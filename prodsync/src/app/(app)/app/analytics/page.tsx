'use client';

import React, { useEffect, useState } from 'react';
import { analyticsService } from '@/services/analytics.service';
import { formatNumber } from '@/lib/utils';
import type { Analytics } from '@/types';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#0ea5e9'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getAnalytics().then((data) => { setAnalytics(data); setLoading(false); });
  }, []);

  const SkeletonChart = () => <div className="ps-skeleton" style={{ height: '240px' }} />;

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="text-h2" style={{ marginBottom: '0.25rem' }}>Analytics</h1>
        <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>
          Data quality, processing volume, and product intelligence metrics
        </p>
      </div>

      {/* Top metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }} className="ana-top">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="ps-card" style={{ padding: '1.25rem' }}>
            <div className="ps-skeleton" style={{ height: '70px' }} />
          </div>
        )) : [
          { label: 'Total Products', value: formatNumber(analytics?.totalProducts ?? 0), color: 'var(--ps-primary)' },
          { label: 'Avg. Quality Score', value: `${analytics?.dataQualityScore.toFixed(1) ?? '—'}%`, color: 'var(--ps-success)' },
          { label: 'AI Processed', value: formatNumber(analytics?.aiProcessed ?? 0), color: 'var(--ps-ai)' },
          { label: 'Enrichment Rate', value: `${analytics?.enrichmentOpportunities ?? 0}`, color: 'var(--ps-warning)' },
        ].map((m) => (
          <div key={m.label} className="ps-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: m.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '0.375rem' }}>
              {m.value}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', fontWeight: 500 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }} className="ana-row1">
        {/* Quality trend */}
        <div className="ps-card">
          <div className="ps-card-header">
            <div style={{ fontWeight: 700 }}>Data Quality Trend</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>Quality score over time</div>
          </div>
          <div className="ps-card-body">
            {loading ? <SkeletonChart /> : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={analytics?.qualityTrend ?? []} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="anaQualityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--ps-border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--ps-text-muted)' }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'var(--ps-text-muted)' }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Quality']} contentStyle={{ borderRadius: '8px', border: '1px solid var(--ps-border)', fontSize: '0.8125rem' }} />
                  <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} fill="url(#anaQualityGrad)" dot={{ fill: '#2563eb', r: 4 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Validation status pie */}
        <div className="ps-card">
          <div className="ps-card-header">
            <div style={{ fontWeight: 700 }}>Validation Status</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>By status category</div>
          </div>
          <div className="ps-card-body">
            {loading ? <SkeletonChart /> : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={analytics?.validationDistribution ?? []} cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={3} dataKey="value">
                    {(analytics?.validationDistribution ?? []).map((entry, i) => (
                      <Cell key={i} fill={entry.color ?? COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [formatNumber(v as number), n]} contentStyle={{ borderRadius: '8px', border: '1px solid var(--ps-border)', fontSize: '0.8125rem' }} />
                  <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '0.75rem' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="ana-row2">
        {/* Processing volume */}
        <div className="ps-card">
          <div className="ps-card-header">
            <div style={{ fontWeight: 700 }}>Processing Volume</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>Products processed per week</div>
          </div>
          <div className="ps-card-body">
            {loading ? <SkeletonChart /> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analytics?.processingVolume ?? []} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--ps-border)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--ps-text-muted)' }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--ps-text-muted)' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--ps-border)', fontSize: '0.8125rem' }} />
                  <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} name="Products" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category distribution */}
        <div className="ps-card">
          <div className="ps-card-header">
            <div style={{ fontWeight: 700 }}>Top Categories</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>Products by category</div>
          </div>
          <div className="ps-card-body">
            {loading ? <SkeletonChart /> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analytics?.categoryDistribution ?? []} layout="vertical" margin={{ top: 5, right: 5, bottom: 0, left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--ps-border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--ps-text-muted)' }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--ps-text-muted)' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--ps-border)', fontSize: '0.8125rem' }} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Products" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .ana-top { grid-template-columns: repeat(2,1fr) !important; } .ana-row1 { grid-template-columns: 1fr !important; } .ana-row2 { grid-template-columns: 1fr !important; } }
        @media (max-width: 640px) { .ana-top { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
