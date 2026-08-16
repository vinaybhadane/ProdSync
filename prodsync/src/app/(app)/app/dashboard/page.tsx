'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package, Cpu, ShieldCheck, AlertTriangle, Sparkles, TrendingUp,
  ArrowRight, CheckCircle, Upload, Activity, Clock, FolderOpen, Building2, User
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { analyticsService } from '@/services/analytics.service';
import { liveActivityService } from '@/services/api.client';
import { organizationService } from '@/services/organization.service';
import { useAuth } from '@/contexts/AuthContext';
import { formatNumber, formatRelativeTime } from '@/lib/utils';
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
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
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
      style={{
        padding: '1.25rem',
        transition: 'all 0.2s ease',
        cursor: href ? 'pointer' : 'default',
        minWidth: 0,
        overflow: 'hidden',
      }}
      onMouseEnter={href ? (e) => {
        e.currentTarget.style.boxShadow = 'var(--ps-shadow-md)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      } : undefined}
      onMouseLeave={href ? (e) => {
        e.currentTarget.style.boxShadow = 'var(--ps-shadow-sm)';
        e.currentTarget.style.transform = 'translateY(0)';
      } : undefined}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: `${color}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        {change && (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: changePositive ? 'var(--ps-success)' : 'var(--ps-danger)',
              background: changePositive ? 'var(--ps-success-light)' : 'var(--ps-danger-light)',
              padding: '0.125rem 0.5rem',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
            }}
          >
            {change}
          </span>
        )}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ps-text-primary)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        {isPercentage ? `${value.toFixed(1)}%` : <AnimatedCounter value={value} />}
        {suffix && <span style={{ fontSize: '1rem', fontWeight: 600, marginLeft: '2px' }}>{suffix}</span>}
      </div>
      <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--ps-text-muted)', marginTop: '0.375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </div>
    </div>
  );

  return href ? <Link href={href} style={{ textDecoration: 'none', display: 'block', minWidth: 0 }}>{content}</Link> : content;
}

// ============================================================
// Skeleton
// ============================================================
function MetricSkeleton() {
  return (
    <div className="ps-card" style={{ padding: '1.25rem', minWidth: 0 }}>
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
  const { organization } = useAuth();
  const orgId = organization?.id || 'org_unilog_enterprise';

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = React.useCallback(() => {
    // Calculate live analytics directly from remaining products in organization
    const calculated = organizationService.calculateAnalytics(orgId);
    setAnalytics(calculated);

    const scopedActs = organizationService.getActivity(orgId);
    if (scopedActs.length > 0) {
      setActivities(scopedActs);
      setLoading(false);
    } else {
      liveActivityService.getActivities(undefined, 8).then((acts) => {
        setActivities(acts);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [orgId]);

  useEffect(() => {
    loadDashboardData();
    // Auto sync when user refocuses tab or after deletions in another screen
    window.addEventListener('focus', loadDashboardData);
    window.addEventListener('storage', loadDashboardData);
    const interval = setInterval(loadDashboardData, 4000);
    return () => {
      window.removeEventListener('focus', loadDashboardData);
      window.removeEventListener('storage', loadDashboardData);
      clearInterval(interval);
    };
  }, [loadDashboardData]);

  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Page header */}
      <div
        style={{
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          minWidth: 0,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 className="text-h2" style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Dashboard
            </h1>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--ps-primary)',
                background: 'var(--ps-primary-50)',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                border: '1px solid rgba(37,99,235,0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                flexShrink: 0,
              }}
            >
              <Building2 size={12} />
              {organization?.name || 'Workspace'}
            </span>
          </div>
          <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem', margin: 0 }}>
            Real-time product intelligence, compliance metrics, and autonomous activity feed.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
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
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '1.5rem',
          minWidth: 0,
        }}
        className="metric-grid"
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <MetricSkeleton key={i} />)
        ) : analytics ? (
          <>
            <MetricCard
              icon={<Package size={20} />}
              label="Total Products"
              value={analytics.totalProducts}
              color="var(--ps-primary)"
              href="/app/products"
              change="+284 this week"
              changePositive
            />
            <MetricCard
              icon={<Cpu size={20} />}
              label="AI Processed"
              value={analytics.aiProcessed}
              color="var(--ps-ai)"
              change="+1,240 this month"
              changePositive
            />
            <MetricCard
              icon={<ShieldCheck size={20} />}
              label="Validated & Verified"
              value={analytics.validated}
              color="var(--ps-success)"
              href="/app/validation"
              change="+89 today"
              changePositive
            />
            <MetricCard
              icon={<AlertTriangle size={20} />}
              label="Needs Review"
              value={analytics.needsReview}
              color="var(--ps-warning)"
              href="/app/validation"
              change="-12 today"
              changePositive
            />
            <MetricCard
              icon={<Sparkles size={20} />}
              label="Enrichment Opportunities"
              value={analytics.enrichmentOpportunities}
              color="var(--ps-ai)"
              href="/app/enrichment"
            />
            <MetricCard
              icon={<TrendingUp size={20} />}
              label="Data Quality Score"
              value={analytics.dataQualityScore}
              color="var(--ps-success)"
              isPercentage
              change="+2.1% vs last month"
              changePositive
            />
          </>
        ) : null}
      </div>

      {/* Charts row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1rem',
          marginBottom: '1.5rem',
          minWidth: 0,
        }}
        className="chart-grid"
      >
        {/* Quality trend */}
        <div className="ps-card" style={{ minWidth: 0, overflow: 'hidden' }}>
          <div className="ps-card-header">
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Data Quality Trend</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>
              Overall quality compliance over the past 5 weeks
            </div>
          </div>
          <div className="ps-card-body" style={{ minWidth: 0, overflow: 'hidden' }}>
            {loading ? (
              <div className="ps-skeleton" style={{ height: '200px' }} />
            ) : (
              <div style={{ width: '100%', height: '200px', minWidth: 0 }}>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={analytics?.qualityTrend ?? []} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
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
              </div>
            )}
          </div>
        </div>

        {/* Validation distribution */}
        <div className="ps-card" style={{ minWidth: 0, overflow: 'hidden' }}>
          <div className="ps-card-header">
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Validation Breakdown</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>
              Products grouped by verification status
            </div>
          </div>
          <div className="ps-card-body" style={{ minWidth: 0, overflow: 'hidden' }}>
            {loading ? (
              <div className="ps-skeleton" style={{ height: '200px' }} />
            ) : (
              <div style={{ width: '100%', height: '200px', minWidth: 0 }}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={analytics?.validationDistribution ?? []} cx="50%" cy="50%" innerRadius={48} outerRadius={76} paddingAngle={3} dataKey="value">
                      {(analytics?.validationDistribution ?? []).map((entry, i) => (
                        <Cell key={i} fill={entry.color ?? '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, n) => [formatNumber(v as number), n]} contentStyle={{ borderRadius: '8px', border: '1px solid var(--ps-border)', fontSize: '0.8125rem' }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.7rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          minWidth: 0,
        }}
        className="bottom-grid"
      >
        {/* Processing volume */}
        <div className="ps-card" style={{ minWidth: 0, overflow: 'hidden' }}>
          <div className="ps-card-header">
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Processing Volume</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>
              Products extracted & synchronized per week
            </div>
          </div>
          <div className="ps-card-body" style={{ minWidth: 0, overflow: 'hidden' }}>
            {loading ? (
              <div className="ps-skeleton" style={{ height: '180px' }} />
            ) : (
              <div style={{ width: '100%', height: '180px', minWidth: 0 }}>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={analytics?.processingVolume ?? []} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--ps-border)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--ps-text-muted)' }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--ps-text-muted)' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--ps-border)', fontSize: '0.8125rem' }} />
                    <Bar dataKey="value" fill="var(--ps-primary)" radius={[4, 4, 0, 0]} name="Products" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Card with safe boundaries & no overflowing IDs */}
        <div className="ps-card" style={{ minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div
            className="ps-card-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Recent Activity</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>
                Latest organization operations & audits
              </div>
            </div>
            <Link href="/app/activity" className="ps-btn ps-btn-ghost ps-btn-sm" style={{ flexShrink: 0 }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, minWidth: 0 }}>
            {activities.length === 0 ? (
              <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: 'var(--ps-text-muted)', fontSize: '0.8125rem' }}>
                <Activity size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <div>No recent activity yet for {organization?.name || 'this workspace'}.</div>
                <div style={{ marginTop: '0.75rem' }}>
                  <Link href="/app/import" className="ps-btn ps-btn-secondary ps-btn-sm">
                    Upload First Document
                  </Link>
                </div>
              </div>
            ) : (
              activities.slice(0, 5).map((event, i) => {
                const isFail = event.type.includes('failed');
                const isSuccess = event.type.includes('validated') || event.type.includes('approved');
                const isImport = event.type.includes('import') || event.type.includes('upload');
                const isCatalog = event.type.includes('catalog');

                return (
                  <div
                    key={event.id}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      padding: '0.875rem 1.25rem',
                      borderBottom: i < Math.min(activities.length, 5) - 1 ? '1px solid var(--ps-border)' : 'none',
                      alignItems: 'flex-start',
                      minWidth: 0,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Event Icon */}
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: isFail
                          ? 'var(--ps-danger-light, #fee2e2)'
                          : isSuccess
                          ? 'var(--ps-success-light, #dcfce7)'
                          : isImport
                          ? 'rgba(37,99,235,0.1)'
                          : isCatalog
                          ? 'rgba(124,58,237,0.1)'
                          : 'var(--ps-primary-50, #eff6ff)',
                        color: isFail
                          ? 'var(--ps-danger, #ef4444)'
                          : isSuccess
                          ? 'var(--ps-success, #10b981)'
                          : isImport
                          ? 'var(--ps-primary, #2563eb)'
                          : isCatalog
                          ? '#7c3aed'
                          : 'var(--ps-primary, #2563eb)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      {isSuccess ? (
                        <CheckCircle size={15} />
                      ) : isImport ? (
                        <Upload size={15} />
                      ) : isCatalog ? (
                        <FolderOpen size={15} />
                      ) : isFail ? (
                        <AlertTriangle size={15} />
                      ) : (
                        <Activity size={15} />
                      )}
                    </div>

                    {/* Middle Info Column with safe line clamping */}
                    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.125rem' }}>
                        <span
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            color: 'var(--ps-text-primary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '100%',
                          }}
                        >
                          {event.title}
                        </span>

                        {event.entityName && (
                          <span
                            className="ps-badge ps-badge-neutral"
                            style={{
                              fontSize: '0.6875rem',
                              padding: '0.1rem 0.4rem',
                              maxWidth: '160px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              borderRadius: '4px',
                            }}
                            title={event.entityName}
                          >
                            {event.entityName}
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--ps-text-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '100%',
                          lineHeight: 1.4,
                        }}
                        title={event.description}
                      >
                        {event.description}
                      </div>

                      {event.userName && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                          <User size={10} color="var(--ps-text-muted)" />
                          <span style={{ fontSize: '0.6875rem', color: 'var(--ps-text-muted)' }}>
                            {event.userName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        flexShrink: 0,
                        paddingLeft: '0.5rem',
                        marginTop: '2px',
                      }}
                    >
                      <Clock size={11} color="var(--ps-text-muted)" />
                      <span style={{ fontSize: '0.6875rem', color: 'var(--ps-text-muted)', whiteSpace: 'nowrap' }}>
                        {formatRelativeTime(event.timestamp || event.createdAt || new Date().toISOString())}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .metric-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .chart-grid { grid-template-columns: 1fr !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .metric-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
