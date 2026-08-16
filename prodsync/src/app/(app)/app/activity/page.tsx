'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle, Upload, ShieldCheck, Sparkles, AlertTriangle, Activity,
  Clock, User, RefreshCw, Search, ArrowUpRight, Filter
} from 'lucide-react';
import { liveActivityService } from '@/services/api.client';
import { formatRelativeTime } from '@/lib/utils';
import type { ActivityEvent } from '@/types';

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  import_started: {
    icon: <Upload size={16} />,
    color: 'var(--ps-primary, #3b82f6)',
    bg: 'var(--ps-primary-50, #eff6ff)',
    label: 'Import Started',
  },
  import_completed: {
    icon: <CheckCircle size={16} />,
    color: 'var(--ps-success, #10b981)',
    bg: 'var(--ps-success-light, #ecfdf5)',
    label: 'Ingestion & Normalization',
  },
  import_failed: {
    icon: <AlertTriangle size={16} />,
    color: 'var(--ps-danger, #ef4444)',
    bg: 'var(--ps-danger-light, #fef2f2)',
    label: 'Import Failed',
  },
  validation_completed: {
    icon: <ShieldCheck size={16} />,
    color: 'var(--ps-success, #10b981)',
    bg: 'var(--ps-success-light, #ecfdf5)',
    label: 'Validation Conflict Resolved',
  },
  enrichment_applied: {
    icon: <Sparkles size={16} />,
    color: 'var(--ps-ai, #8b5cf6)',
    bg: 'var(--ps-ai-light, #f5f3ff)',
    label: 'AI Enrichment Approved',
  },
  product_approved: {
    icon: <CheckCircle size={16} />,
    color: 'var(--ps-success, #10b981)',
    bg: 'var(--ps-success-light, #ecfdf5)',
    label: 'Product Standardized',
  },
  ai_processing_completed: {
    icon: <Activity size={16} />,
    color: 'var(--ps-ai, #8b5cf6)',
    bg: 'var(--ps-ai-light, #f5f3ff)',
    label: 'Batch Pipeline Finished',
  },
  conflict_detected: {
    icon: <AlertTriangle size={16} />,
    color: 'var(--ps-warning, #f59e0b)',
    bg: 'var(--ps-warning-light, #fffbeb)',
    label: 'Conflict Flagged',
  },
};

import { useAuth } from '@/contexts/AuthContext';
import { organizationService } from '@/services/organization.service';

export default function ActivityPage() {
  const { organization } = useAuth();
  const orgId = organization?.id || 'org_unilog_enterprise';

  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadActivities = async () => {
    setLoading(true);
    const orgEvents = organizationService.getActivity(orgId);
    if (orgEvents.length > 0) {
      setEvents(orgEvents);
      setLoading(false);
      return;
    }
    const data = await liveActivityService.getActivities(filter);
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadActivities();
  }, [filter, orgId]);

  const filtered = events.filter((e) => {
    const matchesFilter =
      filter === 'all' || e.type.includes(filter) || filter.includes(e.type);
    const matchesSearch =
      !searchQuery ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.userName && e.userName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 className="text-h2" style={{ marginBottom: '0.25rem' }}>
            Activity Log
          </h1>
          <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>
            Real-time audit log of product normalizations, AI enrichments, validations, and ingestion jobs
          </p>
        </div>
        <button
          onClick={loadActivities}
          disabled={loading}
          className="ps-btn ps-btn-secondary ps-btn-sm"
        >
          <RefreshCw
            size={13}
            style={{ animation: loading ? 'ps-spin 1s linear infinite' : 'none' }}
          />{' '}
          Refresh Feed
        </button>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
        className="activity-stats"
      >
        {[
          {
            label: 'Total Events',
            value: events.length,
            icon: <Activity size={18} />,
            color: 'var(--ps-primary, #3b82f6)',
          },
          {
            label: 'Standardized Products',
            value: events.filter((e) => e.type.includes('product') || e.type.includes('import')).length,
            icon: <CheckCircle size={18} />,
            color: 'var(--ps-success, #10b981)',
          },
          {
            label: 'AI Enrichments',
            value: events.filter((e) => e.type.includes('enrichment') || e.type.includes('ai')).length,
            icon: <Sparkles size={18} />,
            color: 'var(--ps-ai, #8b5cf6)',
          },
          {
            label: 'Validation Checks',
            value: events.filter((e) => e.type.includes('val')).length,
            icon: <ShieldCheck size={18} />,
            color: 'var(--ps-warning, #f59e0b)',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="ps-card"
            style={{ padding: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `${s.color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: s.color,
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Filter chips */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Events' },
            { id: 'import', label: 'Ingestion & Normalization' },
            { id: 'enrichment', label: 'AI Enrichments' },
            { id: 'validation', label: 'Validation Checks' },
            { id: 'ai_processing', label: 'Batch Runs' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className="ps-btn ps-btn-sm"
              style={{
                background: filter === t.id ? 'var(--ps-primary)' : 'white',
                color: filter === t.id ? 'white' : 'var(--ps-text-secondary)',
                border: `1px solid ${filter === t.id ? 'var(--ps-primary)' : 'var(--ps-border-strong)'}`,
                fontWeight: filter === t.id ? 600 : 400,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--ps-text-muted)',
            }}
          />
          <input
            type="text"
            className="ps-input"
            placeholder="Search events, SKUs, users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.25rem', height: '34px', fontSize: '0.8125rem' }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="ps-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '1.5rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                <div
                  className="ps-skeleton"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div className="ps-skeleton" style={{ height: '14px', width: '50%', marginBottom: '0.5rem' }} />
                  <div className="ps-skeleton" style={{ height: '12px', width: '80%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--ps-text-muted)' }}>
            <Activity size={36} style={{ margin: '0 auto 0.75rem', display: 'block', color: 'var(--ps-slate-300)' }} />
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>No Events Match Filter</div>
            <div style={{ fontSize: '0.8125rem' }}>Try clearing your search query or selecting "All Events".</div>
          </div>
        ) : (
          <div>
            {filtered.map((event, i) => {
              const cfg =
                typeConfig[event.type] ?? {
                  icon: <Activity size={16} />,
                  color: 'var(--ps-primary)',
                  bg: 'var(--ps-primary-50)',
                  label: 'System Action',
                };
              const productId = event.metadata?.productId;

              return (
                <div
                  key={event.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem 1.5rem',
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--ps-border)' : 'none',
                    alignItems: 'flex-start',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--ps-bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: cfg.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: cfg.color,
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        marginBottom: '0.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ps-text-primary)' }}>
                          {event.title}
                        </span>
                        <span
                          className="ps-badge"
                          style={{
                            background: cfg.bg,
                            color: cfg.color,
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                          }}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--ps-text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          flexShrink: 0,
                        }}
                      >
                        <Clock size={12} />
                        {formatRelativeTime(event.timestamp || event.createdAt || new Date().toISOString())}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.875rem', color: 'var(--ps-text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                      {event.description}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {event.userName && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            fontSize: '0.75rem',
                            color: 'var(--ps-text-muted)',
                            fontWeight: 500,
                          }}
                        >
                          <User size={11} />
                          {event.userName}
                        </div>
                      )}

                      {productId && (
                        <Link
                          href={`/app/products/${productId}`}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--ps-primary)',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          View Product <ArrowUpRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .activity-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
