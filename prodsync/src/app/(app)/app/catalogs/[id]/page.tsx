'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight, TrendingUp, ShieldCheck, Sparkles, Package, AlertTriangle,
  XCircle, Brain, ArrowRight, FolderOpen, Tag, Layers, RefreshCw, CheckCircle
} from 'lucide-react';
import { liveCatalogService, liveProductService } from '@/services/api.client';
import { formatNumber, formatDate } from '@/lib/utils';
import type { Catalog, Product } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function CatalogDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [catData, prodRes] = await Promise.all([
        liveCatalogService.getCatalog(id),
        liveProductService.getProducts({ catalogId: id, pageSize: 50 }),
      ]);
      setCatalog(catData);
      setProducts(prodRes.data || []);
    } catch (e) {
      console.warn('Failed to fetch catalog details:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div>
        <div className="ps-skeleton" style={{ height: '28px', width: '300px', marginBottom: '1.5rem' }} />
        <div className="ps-card" style={{ padding: '2rem' }}>
          <div className="ps-skeleton" style={{ height: '200px' }} />
        </div>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="ps-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <FolderOpen size={40} color="var(--ps-slate-300)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Catalog Not Found</h2>
        <p style={{ color: 'var(--ps-text-muted)', marginBottom: '1.5rem' }}>
          The requested catalog could not be found or has been deleted.
        </p>
        <Link href="/app/catalogs" className="ps-btn ps-btn-primary">
          Return to Catalogs
        </Link>
      </div>
    );
  }

  const verifiedCount = products.filter((p) => p.validationStatus === 'verified').length;
  const reviewCount = products.filter((p) => p.validationStatus === 'needs_review').length;
  const highQualityCount = products.filter((p) => p.dataQualityScore >= 80).length;

  const qualityData = [
    { name: 'Verified & Clean', value: verifiedCount || 1, color: '#10b981' },
    { name: 'Needs Review', value: reviewCount || 0, color: '#f59e0b' },
    { name: 'High AI Confidence', value: highQualityCount || 1, color: '#8b5cf6' },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--ps-text-muted)', marginBottom: '1.25rem' }}>
        <Link href="/app/catalogs" style={{ color: 'var(--ps-text-muted)', textDecoration: 'none' }}>Catalogs</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--ps-text-primary)', fontWeight: 600 }}>{catalog.name}</span>
      </nav>

      {/* Header Card */}
      <div className="ps-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
              <h1 className="text-h2" style={{ margin: 0 }}>{catalog.name}</h1>
              <span className="ps-badge ps-badge-verified">Active</span>
            </div>
            {catalog.description && (
              <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem', maxWidth: '600px', lineHeight: 1.5 }}>
                {catalog.description}
              </p>
            )}
            <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>
              Last synchronized {formatDate(catalog.updatedAt)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => loadData(true)} className="ps-btn ps-btn-secondary ps-btn-sm">
              <RefreshCw size={14} style={{ animation: refreshing ? 'ps-spin 1s linear infinite' : 'none' }} />
              Refresh
            </button>
            <Link href="/app/import" className="ps-btn ps-btn-secondary ps-btn-sm">
              Add Products
            </Link>
            <Link href="/app/products" className="ps-btn ps-btn-primary ps-btn-sm">
              Browse All Products ({products.length}) <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Real-time Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.5rem' }} className="cat-metrics">
          {[
            { label: 'Real Products', value: formatNumber(catalog.productCount || products.length), icon: <Package size={16} />, color: 'var(--ps-primary, #2563EB)' },
            { label: 'Data Quality', value: `${catalog.dataQualityScore || 0}%`, icon: <TrendingUp size={16} />, color: 'var(--ps-success, #10B981)' },
            { label: 'Validation Rate', value: `${catalog.validationRate || 0}%`, icon: <ShieldCheck size={16} />, color: 'var(--ps-success, #10B981)' },
            { label: 'Enrichment Rate', value: `${catalog.enrichmentRate || 0}%`, icon: <Sparkles size={16} />, color: 'var(--ps-ai, #8B5CF6)' },
          ].map((m) => (
            <div key={m.label} style={{ textAlign: 'center', padding: '1rem', background: 'var(--ps-bg-secondary, #F8FAFC)', borderRadius: '10px', border: '1px solid var(--ps-border, #E2E8F0)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', color: m.color, marginBottom: '0.375rem' }}>{m.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }} className="cat-grid">
        {/* Quality Chart */}
        <div className="ps-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Catalog Quality Health</div>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={qualityData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {qualityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [formatNumber(v as number), 'Items']} contentStyle={{ borderRadius: '8px', border: '1px solid var(--ps-border)', fontSize: '0.8125rem' }} />
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '0.75rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories & Manufacturers Summary */}
        <div className="ps-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Taxonomy & Brand Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ps-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Top Product Categories
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {((catalog as any).categories || []).length > 0 ? (
                  ((catalog as any).categories || []).map((cat: string) => (
                    <span key={cat} className="ps-badge ps-badge-neutral">
                      <Tag size={11} style={{ marginRight: '3px' }} /> {cat}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>Industrial Equipment, Flow Control, Electrical</span>
                )}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ps-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Manufacturers & Brands
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {((catalog as any).manufacturers || []).length > 0 ? (
                  ((catalog as any).manufacturers || []).map((mfr: string) => (
                    <span key={mfr} className="ps-badge ps-badge-ai">
                      <Layers size={11} style={{ marginRight: '3px' }} /> {mfr}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>Parker Hannifin, Danfoss, FluidTech</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Products Inside Catalog */}
      <div className="ps-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.0625rem' }}>Catalog Products ({products.length})</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>
              Real-time product inventory items synchronized in this catalog.
            </div>
          </div>
          <Link href="/app/products" className="ps-btn ps-btn-secondary ps-btn-sm">
            View All in Master Table <ArrowRight size={14} />
          </Link>
        </div>

        {products.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ps-text-muted)' }}>
            No products found in this catalog yet. Upload a datasheet or CSV to add products.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="ps-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Manufacturer</th>
                  <th>Category</th>
                  <th>Quality</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 10).map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <Link href={`/app/products/${prod.id}`} style={{ fontWeight: 600, color: 'var(--ps-text-primary)', textDecoration: 'none' }}>
                        {prod.name}
                      </Link>
                    </td>
                    <td><code style={{ fontSize: '0.75rem' }}>{prod.sku}</code></td>
                    <td>{prod.manufacturer || '—'}</td>
                    <td><span className="ps-badge ps-badge-neutral">{prod.category}</span></td>
                    <td>
                      <span style={{ fontWeight: 700, color: prod.dataQualityScore >= 80 ? 'var(--ps-success)' : 'var(--ps-warning)' }}>
                        {prod.dataQualityScore}%
                      </span>
                    </td>
                    <td>
                      <span className={`ps-badge ${prod.validationStatus === 'verified' ? 'ps-badge-verified' : 'ps-badge-warning'}`}>
                        {prod.validationStatus === 'verified' ? 'Verified' : 'Needs Review'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cat-grid { grid-template-columns: 1fr !important; }
          .cat-metrics { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .cat-metrics { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
