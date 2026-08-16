'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus, FolderOpen, TrendingUp, ShieldCheck, Sparkles, MoreHorizontal,
  Search, Trash2, X, CheckCircle, RefreshCw
} from 'lucide-react';
import { liveCatalogService } from '@/services/api.client';
import { formatNumber, formatDate, formatPercent } from '@/lib/utils';
import type { Catalog } from '@/types';

const statusConfig: Record<string, { label: string; cls: string }> = {
  completed: { label: 'Completed', cls: 'ps-badge-verified' },
  processing: { label: 'Processing', cls: 'ps-badge-ai' },
  pending: { label: 'Pending', cls: 'ps-badge-neutral' },
  failed: { label: 'Failed', cls: 'ps-badge-danger' },
  ready_for_review: { label: 'Ready for Review', cls: 'ps-badge-warning' },
};

function CatalogCard({
  catalog,
  onDelete,
}: {
  catalog: Catalog;
  onDelete: (id: string) => void;
}) {
  const status = statusConfig[catalog.processingStatus] ?? {
    label: catalog.processingStatus,
    cls: 'ps-badge-neutral',
  };

  return (
    <div
      className="ps-card"
      style={{ padding: '1.5rem', transition: 'all 0.2s ease', cursor: 'pointer' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--ps-shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--ps-shadow-sm)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--ps-primary-50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ps-primary)',
              flexShrink: 0,
            }}
          >
            <FolderOpen size={20} />
          </div>
          <div>
            <Link
              href={`/app/catalogs/${catalog.id}`}
              style={{
                fontWeight: 700,
                fontSize: '0.9375rem',
                color: 'var(--ps-text-primary)',
                textDecoration: 'none',
                display: 'block',
                marginBottom: '0.25rem',
              }}
            >
              {catalog.name}
            </Link>
            {catalog.description && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', lineHeight: 1.5 }}>
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
              if (confirm(`Delete catalog "${catalog.name}"?`)) onDelete(catalog.id);
            }}
            className="ps-btn ps-btn-ghost ps-btn-sm"
            style={{ padding: '0.25rem 0.5rem', color: 'var(--ps-danger)' }}
            title="Delete Catalog"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        {[
          { icon: <FolderOpen size={14} />, label: 'Products', value: formatNumber(catalog.productCount), color: 'var(--ps-primary)' },
          { icon: <TrendingUp size={14} />, label: 'Quality', value: `${catalog.dataQualityScore}%`, color: 'var(--ps-success)' },
          { icon: <ShieldCheck size={14} />, label: 'Validated', value: `${catalog.validationRate}%`, color: 'var(--ps-success)' },
          { icon: <Sparkles size={14} />, label: 'Enriched', value: `${catalog.enrichmentRate}%`, color: 'var(--ps-ai)' },
        ].map((m) => (
          <div key={m.label} style={{ textAlign: 'center', padding: '0.625rem', background: 'var(--ps-bg-secondary)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', color: m.color, marginBottom: '0.25rem' }}>
              {m.icon}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--ps-text-muted)' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Completeness bar */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--ps-text-muted)', marginBottom: '0.375rem' }}>
          <span>Completeness</span>
          <span style={{ fontWeight: 600, color: 'var(--ps-text-primary)' }}>{catalog.completenessRate}%</span>
        </div>
        <div className="ps-progress">
          <div
            className="ps-progress-bar"
            style={{
              width: `${catalog.completenessRate}%`,
              background:
                catalog.completenessRate >= 90
                  ? 'var(--ps-success)'
                  : catalog.completenessRate >= 70
                  ? 'var(--ps-primary)'
                  : 'var(--ps-warning)',
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.875rem', borderTop: '1px solid var(--ps-border)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)' }}>
          Updated {formatDate(catalog.updatedAt)}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href={`/app/catalogs/${catalog.id}`} className="ps-btn ps-btn-secondary ps-btn-sm">
            Open
          </Link>
          <Link href="/app/import" className="ps-btn ps-btn-ghost ps-btn-sm">
            Add Items
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CatalogsPage() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
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

  const loadCatalogs = async () => {
    setLoading(true);
    const data = await liveCatalogService.getCatalogs();
    setCatalogs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCatalogs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCreating(true);
    const created = await liveCatalogService.createCatalog(newCatName.trim(), newCatDesc.trim());
    if (created) {
      setCatalogs((prev) => [created, ...prev]);
      showToast(`✓ Catalog "${created.name}" created successfully.`);
      setNewCatName('');
      setNewCatDesc('');
      setModalOpen(false);
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    const ok = await liveCatalogService.deleteCatalog(id);
    if (ok) {
      setCatalogs((prev) => prev.filter((c) => c.id !== id));
      showToast('✓ Catalog deleted.');
    }
  };

  const filtered = search
    ? catalogs.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : catalogs;

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
            style={{ width: '100%', maxWidth: '480px', padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>Create New Catalog</h3>
              <button onClick={() => setModalOpen(false)} className="ps-btn ps-btn-ghost ps-btn-sm" style={{ padding: '0.25rem' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>
                  Catalog Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Fasteners & Hardware Master"
                  className="ps-input"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Complete industrial fastener lines with standardized ANSI dimensions..."
                  className="ps-input"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="ps-btn ps-btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="ps-btn ps-btn-primary">
                  {creating ? 'Creating...' : 'Create Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-h2" style={{ marginBottom: '0.25rem' }}>Catalogs</h1>
          <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>
            {catalogs.length} catalogs · {formatNumber(catalogs.reduce((a, c) => a + c.productCount, 0))} total products
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={loadCatalogs} className="ps-btn ps-btn-secondary ps-btn-sm">
            <RefreshCw size={13} style={{ animation: loading ? 'ps-spin 1s linear infinite' : 'none' }} /> Refresh
          </button>
          <button onClick={() => setModalOpen(true)} className="ps-btn ps-btn-primary ps-btn-sm">
            <Plus size={14} />
            New Catalog
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '360px', marginBottom: '1.5rem' }}>
        <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ps-text-muted)' }} />
        <input
          type="text"
          className="ps-input"
          placeholder="Search catalogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '2.25rem' }}
          aria-label="Search catalogs"
        />
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.25rem' }} className="catalog-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="ps-card" style={{ padding: '1.5rem' }}>
              <div className="ps-skeleton" style={{ height: '160px' }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="ps-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <FolderOpen size={48} style={{ margin: '0 auto 1rem', display: 'block', color: 'var(--ps-slate-300)' }} />
          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No Catalogs Found</div>
          <div style={{ color: 'var(--ps-text-muted)', marginBottom: '1.5rem' }}>
            Create your first catalog or import dataset.
          </div>
          <button onClick={() => setModalOpen(true)} className="ps-btn ps-btn-primary ps-btn-sm">
            <Plus size={14} /> Create Catalog
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.25rem' }} className="catalog-grid">
          {filtered.map((catalog) => (
            <CatalogCard key={catalog.id} catalog={catalog} onDelete={handleDelete} />
          ))}
        </div>
      )}
      <style>{`@media (max-width: 900px) { .catalog-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
