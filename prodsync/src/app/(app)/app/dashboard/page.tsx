'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package, Cpu, ShieldCheck, AlertTriangle, Sparkles, TrendingUp,
  ArrowRight, CheckCircle, Upload, Activity, Clock
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { analyticsService } from '@/services/analytics.service';
import { liveActivityService } from '@/services/api.client';
import { formatNumber, formatPercent, formatRelativeTime } from '@/lib/utils';
import type { Analytics, ActivityEvent } from '@/types';

// ============================================================
// Animated Counter
// ============================================================
function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{formatNumber(display)}</>;
}

// ============================================================
// Metric Card
// ============================================================
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  change?: string;
  changePositive?: boolean;
  color: string;
  href?: string;
  isPercentage?: boolean;
}

function MetricCard({ icon, label, value, suffix = '', change, changePositive, color, href, isPercentage }: MetricCardProps) {
  const content = (
    <div
      className="ps-card"
      style={{ padding: '1.25rem', transition: 'all 0.2s ease', cursor: href ? 'pointer' : 'default' }}
      onMouseEnter={href ? (e) => {
        e.currentTarget.style.boxShadow = 'var(--ps-shadow-md)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      } : undefined}
      onMouseLeave={href ? (e) => {
        e.currentTarget.style.boxShadow = 'var(--ps-shadow-sm)';
        e.currentTarget.style.transform = 'translateY(0)';
      } : undefined}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div
          style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color,
          }}
        >
          {icon}
        </div>
        {change && (
          <span
            style={{
              fontSize: '0.75rem', fontWeight: 600,
              color: changePositive ? 'var(--ps-success)' : 'var(--ps-danger)',
              background: changePositive ? 'var(--ps-success-light)' : 'var(--ps-danger-light)',
              padding: '0.125rem 0.5rem',
              borderRadius: '20px',
            }}
          >
            {change}
          </span>
        )}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ps-text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {isPercentage ? `${value.toFixed(1)}%` : <AnimatedCounter value={value} />}
        {suffix && <span style={{ fontSize: '1rem', fontWeight: 600, marginLeft: '2px' }}>{suffix}</span>}
      </div>
      <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--ps-text-muted)', marginTop: '0.375rem' }}>
        {label}
      </div>
    </div>
  );

  return href ? <Link href={href} style={{ textDecoration: 'none' }}>{content}</Link> : content;
}

// ============================================================
// Skeleton
// ============================================================
function MetricSkeleton() {
  return (
    <div className="ps-card" style={{ padding: '1.25rem' }}>
      <div className="ps-skeleton" style={{ width: '40px', height: '40px', borderRadius: '10px', marginBottom: '1rem' }} />
      <div className="ps-skeleton" style={{ width: '60%', height: '28px', marginBottom: '0.5rem' }} />
      <div className="ps-skeleton" style={{ width: '80%', height: '14px' }} />
    </div>
  );
}

// ============================================================
// Dashboard Page
// ============================================================
export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsService.getAnalytics(),
      liveActivityService.getActivities(undefined, 5),
    ]).then(([data, acts]) => {
      setAnalytics(data);
      setActivities(acts);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-h2" style={{ marginBottom: '0.25rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>
            Your product intelligence overview
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/app/import" className="ps-btn ps-btn-primary ps-btn-sm">
            <Upload size={14} />
            Import Data
          </Link>
          <Link href="/app/validation" className="ps-btn ps-btn-secondary ps-btn-sm">
            <ShieldCheck size={14} />
            Review Queue
          </Link>
        </div>
      </div>

      {/* Metric cards */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}
        className="metric-grid"
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <MetricSkeleton key={i} />)
        ) : analytics ? (
          <>
            <MetricCard icon={<Package size={20} />} label="Total Products" value={analytics.totalProducts} color="var(--ps-primary)" href="/app/products" change="+284 this week" changePositive />
            <MetricCard icon={<Cpu size={20} />} label="AI Processed" value={analytics.aiProcessed} color="var(--ps-ai)" change="+1,240 this month" changePositive />
            <MetricCard icon={<ShieldCheck size={20} />} label="Validated" value={analytics.validated} color="var(--ps-success)" href="/app/validation" change="+89 today" changePositive />
            <MetricCard icon={<AlertTriangle size={20} />} label="Needs Review" value={analytics.needsReview} color="var(--ps-warning)" href="/app/validation" change="-12 today" changePositive />
            <MetricCard icon={<Sparkles size={20} />} label="Enrichment Opportunities" value={analytics.enrichmentOpportunities} color="var(--ps-ai)" href="/app/enrichment" />
            <MetricCard icon={<TrendingUp size={20} />} label="Data Quality Score" value={analytics.dataQualityScore} color="var(--ps-success)" isPercentage change="+2.1% vs last month" changePositive />
          </>
        ) : null}
      </div>

      {/* Charts row */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}
        className="chart-grid"
      >
        {/* Quality trend */}
        <div className="ps-card">
          <div className="ps-card-header">
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Data Quality Trend</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>
              Overall quality score over the past 5 weeks
            </div>
          </div>
          <div className="ps-card-body">
            {loading ? (
              <div className="ps-skeleton" style={{ height: '200px' }} />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={analytics?.qualityTrend ?? []} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="qualityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--ps-primary)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--ps-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--ps-border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--ps-text-muted)' }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'var(--ps-text-muted)' }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Quality Score']} contentStyle={{ borderRadius: '8px', border: '1px solid var(--ps-border)', fontSize: '0.8125rem' }} />
                  <Area type="monotone" dataKey="value" stroke="var(--ps-primary)" strokeWidth={2} fill="url(#qualityGrad)" dot={{ fill: 'var(--ps-primary)', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Validation distribution */}
        <div className="ps-card">
          <div className="ps-card-header">
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Validation Status</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>
              By validation status
            </div>
          </div>
          <div className="ps-card-body">
            {loading ? (
              <div className="ps-skeleton" style={{ height: '200px' }} />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={analytics?.validationDistribution ?? []} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {(analytics?.validationDistribution ?? []).map((entry, i) => (
                      <Cell key={i} fill={entry.color ?? '#94a3b8'} />
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

      {/* Bottom row */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
        className="bottom-grid"
      >
        {/* Processing volume */}
        <div className="ps-card">
          <div className="ps-card-header">
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Processing Volume</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>
              Products processed per week
            </div>
          </div>
          <div className="ps-card-body">
            {loading ? (
              <div className="ps-skeleton" style={{ height: '180px' }} />
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={analytics?.processingVolume ?? []} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--ps-border)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--ps-text-muted)' }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--ps-text-muted)' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--ps-border)', fontSize: '0.8125rem' }} />
                  <Bar dataKey="value" fill="var(--ps-primary)" radius={[4, 4, 0, 0]} name="Products" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div className="ps-card">
          <div className="ps-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Recent Activity</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>
                Latest platform events
              </div>
            </div>
            <Link href="/app/activity" className="ps-btn ps-btn-ghost ps-btn-sm">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ overflow: 'hidden' }}>
            {activities.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ps-text-muted)', fontSize: '0.8125rem' }}>
                No recent activity. Ingest datasets or run AI jobs to populate.
              </div>
            ) : (
              activities.slice(0, 5).map((event, i) => (
                <div
                  key={event.id}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    padding: '0.75rem 1.25rem',
                    borderBottom: i < activities.length - 1 ? '1px solid var(--ps-border)' : 'none',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: event.type.includes('failed') ? 'var(--ps-danger-light)' : event.type.includes('validated') || event.type.includes('approved') ? 'var(--ps-success-light)' : 'var(--ps-primary-50)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: '1px',
                      color: event.type.includes('failed') ? 'var(--ps-danger)' : event.type.includes('validated') || event.type.includes('approved') ? 'var(--ps-success)' : 'var(--ps-primary)',
                    }}
                  >
                    {event.type.includes('validated') || event.type.includes('approved') ? (
                      <CheckCircle size={14} />
                    ) : event.type.includes('import') ? (
                      <Upload size={14} />
                    ) : (
                      <Activity size={14} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ps-text-primary)', marginBottom: '0.125rem' }}>
                      {event.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {event.description}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                    <Clock size={11} color="var(--ps-text-muted)" />
                    <span style={{ fontSize: '0.6875rem', color: 'var(--ps-text-muted)' }}>
                      {formatRelativeTime(event.timestamp || event.createdAt || new Date().toISOString())}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .metric-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .chart-grid { grid-template-columns: 1fr !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .metric-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
