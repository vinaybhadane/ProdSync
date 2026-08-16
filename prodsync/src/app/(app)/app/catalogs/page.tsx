'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus, FolderOpen, TrendingUp, ShieldCheck, Sparkles,
  Search, Trash2, X, CheckCircle, RefreshCw, ArrowRight, Tag, Layers, Database
} from 'lucide-react';
import { liveCatalogService } from '@/services/api.client';
import { formatNumber, formatDate } from '@/lib/utils';
import type { Catalog } from '@/types';

const statusConfig: Record<string, { label: string; cls: string }> = {
  completed: { label: 'Active & Verified', cls: 'ps-badge-verified' },
  active: { label: 'Active', cls: 'ps-badge-verified' },
  processing: { label: 'AI Processing', cls: 'ps-badge-ai' },
  pending: { label: 'Pending', cls: 'ps-badge-neutral' },
  failed: { label: 'Failed', cls: 'ps-badge-danger' },
  ready_for_review: { label: 'Needs Review', cls: 'ps-badge-warning' },
};

function CatalogCard({
  catalog,
  onDelete,
}: {
  catalog: Catalog;
  onDelete: (id: string) => void;
}) {
  const status = statusConfig[catalog.processingStatus] ?? {
    label: catalog.processingStatus || 'Active & Verified',
    cls: 'ps-badge-verified',
  };

  const categories = (catalog as any).categories || [];
  const manufacturers = (catalog as any).manufacturers || [];

  return (
    <div
      className="ps-card"
      style={{
        padding: '1.5rem',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid var(--ps-border)',
        borderRadius: '12px',
        background: 'white',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--ps-shadow-md, 0 4px 20px rgba(0,0,0,0.08))';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--ps-shadow-sm, 0 1px 3px rgba(0,0,0,0.05))';
      }}
    >
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'var(--ps-primary-50, #EFF6FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ps-primary, #2563EB)',
                flexShrink: 0,
              }}
            >
              <FolderOpen size={22} />
            </div>
            <div>
              <Link
                href={`/app/catalogs/${catalog.id}`}
                style={{
                  fontWeight: 700,
                  fontSize: '1.0625rem',
                  color: 'var(--ps-text-primary)',
                  textDecoration: 'none',
                  display: 'block',
                  marginBottom: '0.25rem',
                }}
              >
                {catalog.name}
              </Link>
              {catalog.description && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', lineHeight: 1.5, maxWidth: '420px' }}>
                  {catalog.description}
                </p>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <span className={`ps-badge ${status.cls}`} style={{ fontSize: '0.6875rem' }}>
              {status.label}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete catalog "${catalog.name}"?`)) {
                  onDelete(catalog.id);
                }
              }}
              className="ps-btn ps-btn-ghost ps-btn-sm"
              style={{ padding: '0.25rem 0.5rem', color: 'var(--ps-danger, #EF4444)' }}
              title="Delete Catalog"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem', marginBottom: '1rem' }}>
          {[
            { icon: <Database size={13} />, label: 'Real Products', value: formatNumber(catalog.productCount), color: 'var(--ps-primary, #2563EB)' },
            { icon: <TrendingUp size={13} />, label: 'Quality Score', value: `${catalog.dataQualityScore || 0}%`, color: 'var(--ps-success, #10B981)' },
            { icon: <ShieldCheck size={13} />, label: 'Validation Rate', value: `${catalog.validationRate || 0}%`, color: 'var(--ps-success, #10B981)' },
            { icon: <Sparkles size={13} />, label: 'Enriched', value: `${catalog.enrichmentRate || 0}%`, color: 'var(--ps-ai, #8B5CF6)' },
          ].map((m) => (
            <div key={m.label} style={{ textAlign: 'center', padding: '0.625rem 0.375rem', background: 'var(--ps-bg-secondary, #F8FAFC)', borderRadius: '8px', border: '1px solid var(--ps-border, #E2E8F0)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', color: m.color, marginBottom: '0.25rem' }}>
                {m.icon}
              </div>
              <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--ps-text-muted)' }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Categories / Manufacturers Tags */}
        {(categories.length > 0 || manufacturers.length > 0) && (
          <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {categories.slice(0, 3).map((cat: string) => (
              <span key={cat} className="ps-badge ps-badge-neutral" style={{ fontSize: '0.6875rem' }}>
                <Tag size={10} style={{ marginRight: '3px' }} /> {cat}
              </span>
            ))}
            {manufacturers.slice(0, 3).map((mfr: string) => (
              <span key={mfr} className="ps-badge ps-badge-ai" style={{ fontSize: '0.6875rem' }}>
                <Layers size={10} style={{ marginRight: '3px' }} /> {mfr}
              </span>
            ))}
          </div>
        )}

        {/* Completeness bar */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--ps-text-muted)', marginBottom: '0.375rem' }}>
            <span>Catalog Completeness</span>
            <span style={{ fontWeight: 600, color: 'var(--ps-text-primary)' }}>{catalog.completenessRate || 0}%</span>
          </div>
          <div className="ps-progress" style={{ height: '6px' }}>
            <div
              className="ps-progress-bar"
              style={{
                width: `${catalog.completenessRate || 0}%`,
                background:
                  (catalog.completenessRate || 0) >= 85
                    ? 'var(--ps-success, #10B981)'
                    : (catalog.completenessRate || 0) >= 50
                    ? 'var(--ps-primary, #2563EB)'
                    : 'var(--ps-warning, #F59E0B)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.875rem', borderTop: '1px solid var(--ps-border, #E2E8F0)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)' }}>
          Updated {formatDate(catalog.updatedAt)}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href={`/app/catalogs/${catalog.id}`} className="ps-btn ps-btn-secondary ps-btn-sm">
            Catalog Details
          </Link>
          <Link href={`/app/products`} className="ps-btn ps-btn-primary ps-btn-sm">
            Browse Products ({formatNumber(catalog.productCount)}) <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useAuth } from '@/contexts/AuthContext';
import { organizationService } from '@/services/organization.service';

export default function CatalogsPage() {
  const { organization } = useAuth();
  const orgId = organization?.id || 'org_unilog_enterprise';

  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadCatalogs = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const scoped = organizationService.getCatalogs(orgId);
      if (scoped.length > 0) {
        setCatalogs(scoped);
      } else {
        const data = await liveCatalogService.getCatalogs();
        setCatalogs(data);
      }
    } catch (e) {
      console.warn('Failed to load catalogs:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orgId]);

  useEffect(() => {
    loadCatalogs();
    // Auto refresh every 10 seconds for real-time catalog counts
    const interval = setInterval(() => {
      loadCatalogs(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [loadCatalogs]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCreating(true);
    const created = await liveCatalogService.createCatalog(newCatName.trim(), newCatDesc.trim());
    if (created) {
      const updated = [created, ...catalogs];
      setCatalogs(updated);
      organizationService.saveCatalogs(orgId, updated);
      showToast(`✓ Catalog "${created.name}" created successfully.`);
      setNewCatName('');
      setNewCatDesc('');
      setModalOpen(false);
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await liveCatalogService.deleteCatalog(id);
    } catch {}
    organizationService.deleteCatalog(orgId, id);
    setCatalogs((prev) => prev.filter((c) => c.id !== id));
    showToast('✓ Catalog deleted and workspace analytics updated.');
  };

  const filtered = search
    ? catalogs.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || (c.description || '').toLowerCase().includes(search.toLowerCase()))
    : catalogs;

  const totalProductsAcrossCatalogs = catalogs.reduce((acc, c) => acc + (c.productCount || 0), 0);

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 9999,
            background: 'var(--ps-slate-900, #0f172a)',
            color: '#ffffff',
            padding: '0.875rem 1.25rem',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            animation: 'ps-fade-in 0.2s ease',
          }}
        >
          <CheckCircle size={16} color="var(--ps-success, #10b981)" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-h2" style={{ marginBottom: '0.25rem' }}>Product Catalogs</h1>
          <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>
            Real-time catalog inventory, Unilog classifications, and verified technical specifications.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => loadCatalogs(true)}
            className="ps-btn ps-btn-secondary"
            title="Refresh Realtime Catalogs"
          >
            <RefreshCw size={14} style={{ animation: refreshing ? 'ps-spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button onClick={() => setModalOpen(true)} className="ps-btn ps-btn-primary">
            <Plus size={14} />
            New Catalog
          </button>
        </div>
      </div>

      {/* Real-time Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }} className="catalog-summary-grid">
        <div className="ps-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--ps-primary-50, #EFF6FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ps-primary, #2563EB)' }}>
            <FolderOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ps-text-primary)' }}>{catalogs.length}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>Active Catalogs</div>
          </div>
        </div>

        <div className="ps-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--ps-success-light, #ECFDF5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ps-success, #10B981)' }}>
            <Database size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ps-text-primary)' }}>{formatNumber(totalProductsAcrossCatalogs)}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>Total Managed Products</div>
          </div>
        </div>

        <div className="ps-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--ps-ai-light, #F5F3FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ps-ai, #8B5CF6)' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ps-text-primary)' }}>
              {catalogs.length > 0 ? `${Math.round(catalogs.reduce((acc, c) => acc + (c.dataQualityScore || 0), 0) / catalogs.length)}%` : '0%'}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>Average Quality Score</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.875rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--ps-text-muted)',
            }}
          />
          <input
            type="text"
            className="ps-input"
            placeholder="Search catalogs by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Catalogs Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }} className="catalog-grid">
          {[1, 2].map((i) => (
            <div key={i} className="ps-skeleton" style={{ height: '240px', borderRadius: '12px' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="ps-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <FolderOpen size={40} color="var(--ps-slate-300)" style={{ margin: '0 auto 1rem' }} />
          <div style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.5rem' }}>No catalogs found</div>
          <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            {search ? 'Try adjusting your search criteria.' : 'Create your first catalog to organize your products.'}
          </p>
          <button onClick={() => setModalOpen(true)} className="ps-btn ps-btn-primary">
            <Plus size={14} /> Create Catalog
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }} className="catalog-grid">
          {filtered.map((cat) => (
            <CatalogCard key={cat.id} catalog={cat} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="ps-card"
            style={{ width: '100%', maxWidth: '480px', padding: '1.5rem', animation: 'ps-fade-in 0.15s ease' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>Create New Catalog</div>
              <button onClick={() => setModalOpen(false)} className="ps-btn ps-btn-ghost ps-btn-sm" style={{ padding: '0.25rem' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="ps-label" htmlFor="cat-name">Catalog Name *</label>
                <input
                  id="cat-name"
                  type="text"
                  className="ps-input"
                  placeholder="e.g. Industrial Automation 2026"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="ps-label" htmlFor="cat-desc">Description</label>
                <textarea
                  id="cat-desc"
                  className="ps-input"
                  rows={3}
                  placeholder="Brief summary of the products in this catalog..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="ps-btn ps-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="ps-btn ps-btn-primary" disabled={creating || !newCatName.trim()}>
                  {creating ? 'Creating...' : 'Create Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .catalog-grid { grid-template-columns: 1fr !important; }
          .catalog-summary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
