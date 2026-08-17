'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, Filter, Download, Upload, ChevronLeft, ChevronRight,
  Trash2, CheckSquare, Package, AlertTriangle, Loader2, Sparkles, X, Check,
  MoreHorizontal, ArrowRight, ShieldCheck, RefreshCw
} from 'lucide-react';
import { productService } from '@/services/product.service';
import { liveProductService } from '@/services/api.client';
import { formatNumber, formatDate } from '@/lib/utils';
import type { Product, ProductFilter } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { organizationService } from '@/services/organization.service';

// ============================================================
// Status styles
// ============================================================
const statusStyles: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'ps-badge-neutral' },
  processing: { label: 'Processing', className: 'ps-badge-ai' },
  needs_review: { label: 'Needs Review', className: 'ps-badge-warning' },
  validated: { label: 'Validated', className: 'ps-badge-verified' },
  approved: { label: 'Approved', className: 'ps-badge-verified' },
  exported: { label: 'Exported', className: 'ps-badge-neutral' },
};

const validationStyles: Record<string, { label: string; className: string }> = {
  verified: { label: '✓ Verified', className: 'ps-badge-verified' },
  ai_validated: { label: 'AI Validated', className: 'ps-badge-ai' },
  ai_suggested: { label: 'AI Suggested', className: 'ps-badge-ai' },
  needs_review: { label: 'Needs Review', className: 'ps-badge-warning' },
  invalid: { label: 'Invalid', className: 'ps-badge-danger' },
  missing: { label: 'Missing Data', className: 'ps-badge-danger' },
};

// ============================================================
// Table skeleton row
// ============================================================
function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 11 }).map((_, i) => (
        <td key={i} style={{ padding: '0.875rem 1rem' }}>
          <div className="ps-skeleton" style={{ height: '14px', width: i === 1 ? '80%' : '60%' }} />
        </td>
      ))}
    </tr>
  );
}

// ============================================================
// Main Products Page
// ============================================================
export default function ProductsPage() {
  const { organization } = useAuth();
  const orgId = organization?.id || 'org_unilog_enterprise';

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Multi-Selection state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectAllMatching, setSelectAllMatching] = useState(false);

  // Deletion Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null); // if single delete

  // Filters & Search
  const [filter, setFilter] = useState<ProductFilter>({ page: 1, pageSize: 20 });
  const [searchInput, setSearchInput] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [manufacturers, setManufacturers] = useState<string[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchProducts = useCallback(async (f: ProductFilter) => {
    setLoading(true);
    try {
      // 1. Fetch live products from backend database
      const res = await productService.getProducts(f);
      if (res && res.data && res.data.length > 0) {
        setProducts(res.data);
        setTotal(res.total);
        
        const cats = Array.from(new Set(res.data.map((p) => p.category).filter((c): c is string => Boolean(c))));
        const mfrs = Array.from(new Set(res.data.map((p) => p.manufacturer).filter((m): m is string => Boolean(m))));
        setCategories(cats);
        setManufacturers(mfrs);
      } else {
        // Fallback to local organization scope if backend has not yet been populated
        const scoped = organizationService.getProducts(orgId);
        let list = [...scoped];
        if (f.search) {
          const q = f.search.toLowerCase();
          list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
        }
        if (f.category) list = list.filter((p) => p.category === f.category);
        if (f.manufacturer) list = list.filter((p) => p.manufacturer === f.manufacturer);
        if (f.validationStatus) list = list.filter((p) => p.validationStatus === f.validationStatus);

        setProducts(list);
        setTotal(list.length);

        const cats = Array.from(new Set(scoped.map((p) => p.category).filter((c): c is string => Boolean(c))));
        const mfrs = Array.from(new Set(scoped.map((p) => p.manufacturer).filter((m): m is string => Boolean(m))));
        setCategories(cats);
        setManufacturers(mfrs);
      }
    } catch (e) {
      console.warn('Failed to load products:', e);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchProducts(filter);
  }, [filter, fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelected(new Set());
    setSelectAllMatching(false);
    setFilter((f) => ({ ...f, search: searchInput, page: 1 }));
  };

  // Multi-Selection handlers
  const toggleSelect = (id: string) => {
    setSelectAllMatching(false);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectPage = () => {
    if (selected.size === products.length && products.length > 0) {
      setSelected(new Set());
      setSelectAllMatching(false);
    } else {
      setSelected(new Set(products.map((p) => p.id)));
    }
  };

  const handleSelectAllCatalog = () => {
    setSelectAllMatching(true);
    setSelected(new Set(products.map((p) => p.id)));
  };

  const handleClearSelection = () => {
    setSelected(new Set());
    setSelectAllMatching(false);
  };

  // Permanent Delete Handlers
  const openDeleteModalForSelected = () => {
    setProductToDelete(null);
    setIsDeleteModalOpen(true);
  };

  const openDeleteModalForSingle = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmPermanentDelete = async () => {
    setActionLoading(true);
    try {
      if (productToDelete) {
        // Single product permanent delete
        try {
          await liveProductService.deleteProduct(productToDelete.id, true);
        } catch {}
        organizationService.deleteProduct(orgId, productToDelete.id);
        showToast(`✓ Permanently deleted "${productToDelete.name}" (${productToDelete.sku})`);
        setSelected((prev) => {
          const next = new Set(prev);
          next.delete(productToDelete.id);
          return next;
        });
      } else if (selectAllMatching) {
        // Delete all products matching catalog
        try {
          await liveProductService.bulkDeleteProducts([], true);
        } catch {}
        organizationService.bulkDeleteProducts(orgId, [], true);
        showToast(`✓ Permanently deleted all products.`);
        setSelected(new Set());
        setSelectAllMatching(false);
      } else {
        // Delete selected product IDs
        const ids = Array.from(selected);
        try {
          await liveProductService.bulkDeleteProducts(ids, false);
        } catch {}
        organizationService.bulkDeleteProducts(orgId, ids, false);
        showToast(`✓ Permanently deleted ${ids.length} products.`);
        setSelected(new Set());
      }
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      await fetchProducts(filter);
    } catch (err: any) {
      showToast(`Error deleting products: ${err?.message || 'Please try again'}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Bulk Enrichment
  const handleBulkEnrich = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setActionLoading(true);
    let count = 0;
    for (const id of ids) {
      try {
        await liveProductService.enrichProduct(id);
        count++;
      } catch (e) {
        console.warn('Enrichment notice:', e);
      }
    }
    showToast(`✓ Gemini enrichment triggered for ${count} product(s).`);
    setActionLoading(false);
    await fetchProducts(filter);
  };

  // Bulk Validation
  const handleBulkValidate = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setActionLoading(true);
    for (const id of ids) {
      try {
        await liveProductService.validateProduct(id);
      } catch (e) {
        console.warn('Validate notice:', e);
      }
    }
    showToast(`✓ Validated ${ids.length} product(s).`);
    setActionLoading(false);
    await fetchProducts(filter);
  };

  const totalPages = Math.ceil(total / (filter.pageSize ?? 20));
  const isAllPageSelected = products.length > 0 && selected.size === products.length;
  const totalSelectedCount = selectAllMatching ? total : selected.size;

  return (
    <div style={{ position: 'relative', minHeight: '80vh' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'var(--ps-slate-900, #0F172A)',
            color: 'white',
            padding: '0.875rem 1.5rem',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 9999,
            fontSize: '0.875rem',
            fontWeight: 500,
            animation: 'ps-fade-in 0.2s ease',
          }}
        >
          <Check size={16} color="var(--ps-success, #10B981)" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-h2" style={{ marginBottom: '0.25rem' }}>Products Catalog</h1>
          <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>
            {formatNumber(total)} products indexed · {totalSelectedCount > 0 ? `${formatNumber(totalSelectedCount)} selected` : 'Real-time AI-normalized specifications'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/exports/unilog-delivery-format`}
            download="Unihack_Expected_Output_Delivery_Format.csv"
            className="ps-btn ps-btn-secondary ps-btn-sm"
            title="Download 252-column standard delivery format matching Unilog specification"
          >
            <Download size={14} />
            Export CSV (252 Cols)
          </a>
          <Link href="/app/import" className="ps-btn ps-btn-primary ps-btn-sm">
            <Upload size={14} />
            Import Files
          </Link>
        </div>
      </div>

      {/* Sticky Bulk Actions Bar */}
      {totalSelectedCount > 0 && (
        <div
          style={{
            position: 'sticky',
            top: '4.5rem',
            zIndex: 30,
            marginBottom: '1rem',
            padding: '0.875rem 1.25rem',
            background: 'white',
            border: '1px solid var(--ps-primary, #3B82F6)',
            borderRadius: '10px',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            animation: 'ps-fade-in 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.25rem 0.625rem',
                borderRadius: '6px',
                background: 'var(--ps-primary-50, #EFF6FF)',
                color: 'var(--ps-primary, #2563EB)',
                fontWeight: 700,
                fontSize: '0.8125rem',
              }}
            >
              {selectAllMatching ? `All ${formatNumber(total)} products` : `${selected.size} selected`}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--ps-text-secondary)' }}>
              Bulk Actions:
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={openDeleteModalForSelected}
              disabled={actionLoading}
              className="ps-btn ps-btn-sm"
              style={{
                background: 'var(--ps-danger, #EF4444)',
                color: 'white',
                border: 'none',
                fontWeight: 600,
              }}
            >
              <Trash2 size={14} />
              Delete Permanently ({totalSelectedCount})
            </button>

            <button
              onClick={handleBulkEnrich}
              disabled={actionLoading}
              className="ps-btn ps-btn-primary ps-btn-sm"
            >
              {actionLoading ? <Loader2 size={14} style={{ animation: 'ps-spin 1s linear infinite' }} /> : <Sparkles size={14} />}
              Enrich with Gemini
            </button>

            <button
              onClick={handleBulkValidate}
              disabled={actionLoading}
              className="ps-btn ps-btn-secondary ps-btn-sm"
            >
              <ShieldCheck size={14} />
              Validate
            </button>

            <button
              onClick={handleClearSelection}
              className="ps-btn ps-btn-ghost ps-btn-sm"
              style={{ color: 'var(--ps-text-muted)' }}
            >
              <X size={14} />
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Select All Entire Catalog Banner */}
      {isAllPageSelected && total > products.length && !selectAllMatching && (
        <div
          style={{
            background: 'var(--ps-primary-50, #EFF6FF)',
            border: '1px solid var(--ps-primary-100, #DBEAFE)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.875rem',
            color: 'var(--ps-text-primary)',
          }}
        >
          <div>
            All <strong>{products.length}</strong> products on this page are selected.
          </div>
          <button
            onClick={handleSelectAllCatalog}
            className="ps-btn ps-btn-sm ps-btn-secondary"
            style={{ fontWeight: 600 }}
          >
            Select all {formatNumber(total)} products across catalog
          </button>
        </div>
      )}

      {/* Search & filters */}
      <div className="ps-card" style={{ marginBottom: '1rem', overflow: 'visible' }}>
        <div style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ps-text-muted)' }} />
            <input
              type="text"
              className="ps-input"
              placeholder="Search by SKU, part name, manufacturer..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
              aria-label="Search products"
            />
          </form>

          <select
            className="ps-input"
            style={{ width: 'auto', minWidth: '140px' }}
            value={filter.category ?? ''}
            onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value || undefined, page: 1 }))}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            className="ps-input"
            style={{ width: 'auto', minWidth: '160px' }}
            value={filter.status ?? ''}
            onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value as Product['status'] || undefined, page: 1 }))}
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="needs_review">Needs Review</option>
            <option value="validated">Validated</option>
            <option value="approved">Approved</option>
          </select>

          <button
            onClick={() => { setFilter({ page: 1, pageSize: 20 }); setSearchInput(''); setSelected(new Set()); setSelectAllMatching(false); }}
            className="ps-btn ps-btn-ghost ps-btn-sm"
          >
            <Filter size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="ps-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="ps-table" aria-label="Products table">
            <thead>
              <tr>
                <th style={{ width: '44px', paddingLeft: '1.25rem' }}>
                  <input
                    type="checkbox"
                    checked={isAllPageSelected || selectAllMatching}
                    onChange={toggleSelectPage}
                    aria-label="Select all products on page"
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                </th>
                <th>Product Title</th>
                <th>SKU / MPN</th>
                <th>Category</th>
                <th>Manufacturer</th>
                <th>Completeness</th>
                <th>Validation</th>
                <th>AI Confidence</th>
                <th>Status</th>
                <th>Updated</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : products.length === 0
                ? (
                  <tr>
                    <td colSpan={11} style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
                      <Package size={44} style={{ margin: '0 auto 1rem', display: 'block', color: 'var(--ps-slate-300)' }} />
                      <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--ps-text-primary)' }}>
                        No Products Found
                      </div>
                      <div style={{ color: 'var(--ps-text-muted)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                        Upload a real catalog file or CSV dataset to start AI normalization.
                      </div>
                      <Link href="/app/import" className="ps-btn ps-btn-primary ps-btn-sm">
                        <Upload size={14} /> Import Products
                      </Link>
                    </td>
                  </tr>
                )
                : products.map((product) => {
                  const isSelected = selected.has(product.id) || selectAllMatching;
                  const status = statusStyles[product.status] || { label: product.status, className: 'ps-badge-neutral' };
                  const validation = validationStyles[product.validationStatus] || { label: product.validationStatus, className: 'ps-badge-neutral' };

                  return (
                    <tr
                      key={product.id}
                      style={{
                        background: isSelected ? 'var(--ps-primary-50, #EFF6FF)' : undefined,
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <td style={{ paddingLeft: '1.25rem' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(product.id)}
                          aria-label={`Select ${product.name}`}
                          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                      </td>
                      <td style={{ maxWidth: '280px' }}>
                        <Link
                          href={`/app/products/${product.id}`}
                          style={{ fontWeight: 600, color: 'var(--ps-text-primary)', textDecoration: 'none', fontSize: '0.875rem', lineHeight: 1.4, display: 'block' }}
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--ps-text-secondary)', background: 'var(--ps-bg-secondary)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                          {product.sku}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--ps-text-secondary)' }}>
                        {product.category}
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--ps-text-secondary)', fontWeight: 500 }}>
                        {product.manufacturer}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div className="ps-progress" style={{ width: '56px' }}>
                            <div
                              className="ps-progress-bar"
                              style={{
                                width: `${product.completeness}%`,
                                background: product.completeness >= 90 ? 'var(--ps-success)' : product.completeness >= 70 ? 'var(--ps-primary)' : product.completeness >= 50 ? 'var(--ps-warning)' : 'var(--ps-danger)',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ps-text-secondary)' }}>
                            {product.completeness}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`ps-badge ${validation.className}`} style={{ fontSize: '0.6875rem' }}>
                          {validation.label}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: product.aiConfidence >= 90 ? 'var(--ps-success-dark, #065F46)' : product.aiConfidence >= 75 ? 'var(--ps-primary, #1D4ED8)' : 'var(--ps-warning-dark, #92400E)' }}>
                          {product.aiConfidence}%
                        </span>
                      </td>
                      <td>
                        <span className={`ps-badge ${status.className}`} style={{ fontSize: '0.6875rem' }}>
                          {status.label}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)' }}>
                        {formatDate(product.updatedAt)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                          <button
                            onClick={(e) => openDeleteModalForSingle(product, e)}
                            title="Delete Permanently"
                            className="ps-btn ps-btn-ghost ps-btn-sm"
                            style={{ padding: '0.35rem', color: 'var(--ps-danger, #EF4444)' }}
                          >
                            <Trash2 size={15} />
                          </button>
                          <Link
                            href={`/app/products/${product.id}`}
                            title="View Details"
                            className="ps-btn ps-btn-ghost ps-btn-sm"
                            style={{ padding: '0.35rem', color: 'var(--ps-text-muted)' }}
                          >
                            <MoreHorizontal size={15} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && total > 0 && (
          <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid var(--ps-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>
              Showing {((filter.page! - 1) * filter.pageSize!) + 1}–{Math.min(filter.page! * filter.pageSize!, total)} of {formatNumber(total)} products
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setFilter((f) => ({ ...f, page: Math.max(1, (f.page ?? 1) - 1) }))}
                disabled={(filter.page ?? 1) <= 1}
                className="ps-btn ps-btn-secondary ps-btn-sm"
              >
                <ChevronLeft size={14} />
                Previous
              </button>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: 'var(--ps-text-secondary)', padding: '0 0.5rem' }}>
                Page {filter.page} of {totalPages}
              </span>
              <button
                onClick={() => setFilter((f) => ({ ...f, page: Math.min(totalPages, (f.page ?? 1) + 1) }))}
                disabled={(filter.page ?? 1) >= totalPages}
                className="ps-btn ps-btn-secondary ps-btn-sm"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* Permanent Deletion Confirmation Modal */}
      {/* ============================================================ */}
      {isDeleteModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="ps-card"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '1.75rem',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              animation: 'ps-fade-in 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--ps-danger, #EF4444)' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--ps-danger-light, #FEE2E2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertTriangle size={22} color="var(--ps-danger, #DC2626)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--ps-text-primary)' }}>
                  Permanently Delete Products?
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>
                  This action is permanent and irreversible
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--ps-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {productToDelete ? (
                <>
                  Are you sure you want to permanently delete <strong>{productToDelete.name}</strong> (<code>{productToDelete.sku}</code>)? All associated specifications, AI attributes, and validation issues will be erased.
                </>
              ) : selectAllMatching ? (
                <>
                  Are you sure you want to permanently delete <strong>ALL {formatNumber(total)} products</strong> in your entire catalog? All associated specifications and AI data will be permanently purged.
                </>
              ) : (
                <>
                  Are you sure you want to permanently delete <strong>{selected.size} selected products</strong>? All associated attributes, specifications, and AI validation data will be removed from SQLite.
                </>
              )}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => { setIsDeleteModalOpen(false); setProductToDelete(null); }}
                disabled={actionLoading}
                className="ps-btn ps-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPermanentDelete}
                disabled={actionLoading}
                className="ps-btn ps-btn-danger"
                style={{ background: 'var(--ps-danger, #DC2626)', color: 'white' }}
              >
                {actionLoading ? (
                  <Loader2 size={14} style={{ animation: 'ps-spin 1s linear infinite' }} />
                ) : (
                  <Trash2 size={14} />
                )}
                {actionLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
