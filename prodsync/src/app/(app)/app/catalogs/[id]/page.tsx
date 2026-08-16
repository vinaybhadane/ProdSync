'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, TrendingUp, ShieldCheck, Sparkles, Package, AlertTriangle, XCircle, Brain } from 'lucide-react';
import { catalogService } from '@/services/catalog.service';
import { formatNumber, formatDate } from '@/lib/utils';
import type { Catalog, CatalogDetail } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

export default function CatalogDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [catalog, setCatalog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    catalogService.getCatalog(id).then((c) => { setCatalog(c); setLoading(false); });
  }, [id]);

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
    return <div className="ps-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--ps-text-muted)' }}>Catalog not found.</div>;
  }

  const qualityData = [
    { name: 'Missing', value: catalog.missingFieldCount, color: '#ef4444' },
    { name: 'Invalid', value: catalog.invalidFieldCount, color: '#f97316' },
    { name: 'Conflicting', value: catalog.conflictingFieldCount, color: '#f59e0b' },
    { name: 'AI Generated', value: catalog.aiGeneratedFieldCount, color: '#8b5cf6' },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--ps-text-muted)', marginBottom: '1.25rem' }}>
        <Link href="/app/catalogs" style={{ color: 'var(--ps-text-muted)', textDecoration: 'none' }}>Catalogs</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--ps-text-primary)', fontWeight: 500 }}>{catalog.name}</span>
      </nav>

      {/* Header */}
      <div className="ps-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="text-h2" style={{ marginBottom: '0.375rem' }}>{catalog.name}</h1>
            {catalog.description && <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>{catalog.description}</p>}
            <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>
              Updated {formatDate(catalog.updatedAt)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link href="/app/import" className="ps-btn ps-btn-secondary ps-btn-sm">Import</Link>
            <button className="ps-btn ps-btn-secondary ps-btn-sm"><ShieldCheck size={14} />Validate All</button>
            <button className="ps-btn ps-btn-secondary ps-btn-sm">Export</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.5rem' }} className="cat-metrics">
          {[
            { label: 'Total Products', value: formatNumber(catalog.productCount), icon: <Package size={16} />, color: 'var(--ps-primary)' },
            { label: 'Completeness', value: `${catalog.completenessRate}%`, icon: <TrendingUp size={16} />, color: 'var(--ps-success)' },
            { label: 'Validation Rate', value: `${catalog.validationRate}%`, icon: <ShieldCheck size={16} />, color: 'var(--ps-success)' },
            { label: 'Enrichment Rate', value: `${catalog.enrichmentRate}%`, icon: <Sparkles size={16} />, color: 'var(--ps-ai)' },
          ].map((m) => (
            <div key={m.label} style={{ textAlign: 'center', padding: '1rem', background: 'var(--ps-bg-secondary)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', color: m.color, marginBottom: '0.5rem' }}>{m.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="cat-grid">
        {/* Quality overview */}
        <div className="ps-card">
          <div className="ps-card-header"><div style={{ fontWeight: 700 }}>Quality Overview</div></div>
          <div className="ps-card-body">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={qualityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {qualityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [formatNumber(v as number), '']} contentStyle={{ borderRadius: '8px', border: '1px solid var(--ps-border)', fontSize: '0.8125rem' }} />
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '0.75rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="ps-card">
          <div className="ps-card-header"><div style={{ fontWeight: 700 }}>Recent Activity</div></div>
          <div>
            {(catalog?.recentActivity || []).slice(0, 4).map((event: any, i: number) => (
              <div key={event.id || i} style={{ padding: '0.75rem 1.25rem', borderBottom: i < 3 ? '1px solid var(--ps-border)' : 'none' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{event.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)' }}>{event.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .cat-grid { grid-template-columns: 1fr !important; } .cat-metrics { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 480px) { .cat-metrics { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
