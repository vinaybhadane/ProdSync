'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, Filter, Download, Upload, ChevronLeft, ChevronRight,
  ArrowUpDown, MoreHorizontal, CheckSquare, Package,
} from 'lucide-react';
import { productService } from '@/services/product.service';
import { formatNumber, formatDate, formatPercent } from '@/lib/utils';
import type { Product, ProductFilter } from '@/types';

// ============================================================
// Status badge
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
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} style={{ padding: '0.875rem 1rem' }}>
          <div className="ps-skeleton" style={{ height: '14px', width: i === 0 ? '80%' : '60%' }} />
        </td>
      ))}
    </tr>
  );
}

// ============================================================
// Products page
// ============================================================
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<ProductFilter>({ page: 1, pageSize: 20 });
  const [searchInput, setSearchInput] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [manufacturers, setManufacturers] = useState<string[]>([]);

  const fetchProducts = useCallback(async (f: ProductFilter) => {
    setLoading(true);
    try {
      const res = await productService.getProducts(f);
      setProducts(res.data);
      setTotal(res.total);
      
      // Dynamically extract categories & manufacturers from live extracted data
      const cats = Array.from(new Set(res.data.map((p) => p.category).filter(Boolean)));
      const mfrs = Array.from(new Set(res.data.map((p) => p.manufacturer).filter(Boolean)));
      setCategories(cats);
      setManufacturers(mfrs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filter);
  }, [filter, fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter((f) => ({ ...f, search: searchInput, page: 1 }));
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === products.length) setSelected(new Set());
    else setSelected(new Set(products.map((p) => p.id)));
  };

  const totalPages = Math.ceil(total / (filter.pageSize ?? 20));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-h2" style={{ marginBottom: '0.25rem' }}>Products</h1>
          <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>
            {formatNumber(total)} products · {selected.size > 0 ? `${selected.size} selected` : 'Manage your product catalog'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href="http://localhost:8000/api/v1/exports/unilog-delivery-format"
            download="Unihack_Expected_Output_Delivery_Format.csv"
            className="ps-btn ps-btn-secondary ps-btn-sm"
            title="Download 252-column standard delivery format matching Unilog specification"
          >
            <Download size={14} />
            Export Unilog Delivery CSV (252 Cols)
          </a>
          {selected.size > 0 && (
            <button className="ps-btn ps-btn-secondary ps-btn-sm">
              <CheckSquare size={14} />
              Validate ({selected.size})
            </button>
          )}
          <Link href="/app/import" className="ps-btn ps-btn-primary ps-btn-sm">
            <Upload size={14} />
            Import Products
          </Link>
        </div>
      </div>

      {/* Search & filters */}
      <div className="ps-card" style={{ marginBottom: '1rem', overflow: 'visible' }}>
        <div style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ps-text-muted)' }} />
            <input
              type="text"
              className="ps-input"
              placeholder="Search by name, SKU, manufacturer..."
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
            onClick={() => { setFilter({ page: 1, pageSize: 20 }); setSearchInput(''); }}
            className="ps-btn ps-btn-ghost ps-btn-sm"
          >
            <Filter size={14} />
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="ps-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="ps-table" aria-label="Products table">
            <thead>
              <tr>
                <th style={{ width: '40px', paddingLeft: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={selected.size === products.length && products.length > 0}
                    onChange={selectAll}
                    aria-label="Select all products"
                  />
                </th>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Manufacturer</th>
                <th>Completeness</th>
                <th>Validation</th>
                <th>AI Confidence</th>
                <th>Status</th>
                <th>Updated</th>
                <th style={{ width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : products.length === 0
                ? (
                  <tr>
                    <td colSpan={11} style={{ padding: '3rem', textAlign: 'center' }}>
                      <Package size={40} style={{ margin: '0 auto 1rem', display: 'block', color: 'var(--ps-slate-300)' }} />
                      <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--ps-text-primary)' }}>No Products Yet</div>
                      <div style={{ color: 'var(--ps-text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        Upload your first product document and let ProdSync transform it into structured intelligence.
                      </div>
                      <Link href="/app/import" className="ps-btn ps-btn-primary ps-btn-sm">
                        Import Product Data
                      </Link>
                    </td>
                  </tr>
                )
                : products.map((product) => {
                  const status = statusStyles[product.status];
                  const validation = validationStyles[product.validationStatus];
                  return (
                    <tr key={product.id}>
                      <td style={{ paddingLeft: '1rem' }}>
                        <input
                          type="checkbox"
                          checked={selected.has(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          aria-label={`Select ${product.name}`}
                        />
                      </td>
                      <td>
                        <Link href={`/app/products/${product.id}`} style={{ fontWeight: 600, color: 'var(--ps-text-primary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                          {product.name}
                        </Link>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--ps-text-secondary)' }}>
                          {product.sku}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--ps-text-secondary)' }}>
                        {product.category}
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--ps-text-secondary)' }}>
                        {product.manufacturer}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div className="ps-progress" style={{ width: '60px' }}>
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
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: product.aiConfidence >= 90 ? 'var(--ps-success-dark)' : product.aiConfidence >= 75 ? 'var(--ps-primary)' : 'var(--ps-warning-dark)' }}>
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
                        <Link href={`/app/products/${product.id}`} className="ps-btn ps-btn-ghost ps-btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                          <MoreHorizontal size={15} />
                        </Link>
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
    </div>
  );
}
