'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle, Clock, AlertTriangle, TrendingUp, Cpu, BarChart2, RefreshCw } from 'lucide-react';
import { liveProcessingService } from '@/services/api.client';
import { formatRelativeTime, formatNumber } from '@/lib/utils';
import type { ProcessingJob } from '@/types';

const statusConfig: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  pending: { label: 'Queued', cls: 'ps-badge-neutral', icon: <Clock size={14} /> },
  processing: { label: 'Processing', cls: 'ps-badge-ai', icon: <Loader2 size={14} style={{ animation: 'ps-spin 1s linear infinite' }} /> },
  completed: { label: 'Completed', cls: 'ps-badge-verified', icon: <CheckCircle size={14} /> },
  failed: { label: 'Failed', cls: 'ps-badge-danger', icon: <AlertTriangle size={14} /> },
  ready_for_review: { label: 'Ready for Review', cls: 'ps-badge-warning', icon: <AlertTriangle size={14} /> },
};

export default function ProcessingPage() {
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const loadJobs = async () => {
    setLoading(true);
    const data = await liveProcessingService.getJobs(activeTab);
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 15000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const filtered = activeTab === 'all' ? jobs : jobs.filter((j) => j.status === activeTab);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-h2" style={{ marginBottom: '0.25rem' }}>AI Processing</h1>
          <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>Monitor active and recent AI processing jobs</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={loadJobs} disabled={loading} className="ps-btn ps-btn-secondary ps-btn-sm">
            <RefreshCw size={13} style={{ animation: loading ? 'ps-spin 1s linear infinite' : 'none' }} /> Refresh
          </button>
          <Link href="/app/import" className="ps-btn ps-btn-primary ps-btn-sm">
            <Cpu size={14} /> New Import
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }} className="proc-stats">
        {[
          { label: 'Total Jobs', value: jobs.length, icon: <BarChart2 size={18} />, color: 'var(--ps-primary)' },
          { label: 'Processing', value: jobs.filter((j) => j.status === 'processing').length, icon: <Loader2 size={18} />, color: 'var(--ps-ai)' },
          { label: 'Completed', value: jobs.filter((j) => j.status === 'completed').length, icon: <CheckCircle size={18} />, color: 'var(--ps-success)' },
          { label: 'Failed', value: jobs.filter((j) => j.status === 'failed').length, icon: <AlertTriangle size={18} />, color: 'var(--ps-danger)' },
        ].map((s) => (
          <div key={s.label} className="ps-card" style={{ padding: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--ps-border)', marginBottom: '1rem', gap: '0' }}>
        {['all', 'processing', 'pending', 'completed', 'failed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.625rem 1rem',
              background: 'none', border: 'none',
              borderBottom: `2px solid ${activeTab === tab ? 'var(--ps-primary)' : 'transparent'}`,
              color: activeTab === tab ? 'var(--ps-primary)' : 'var(--ps-text-muted)',
              fontWeight: activeTab === tab ? 600 : 400,
              fontSize: '0.875rem', cursor: 'pointer',
              textTransform: 'capitalize',
              marginBottom: '-1px', whiteSpace: 'nowrap',
            }}
          >
            {tab === 'pending' ? 'Queued' : tab} {tab === 'all' && `(${jobs.length})`}
          </button>
        ))}
      </div>

      {/* Jobs list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="ps-card" style={{ padding: '1.25rem' }}>
              <div className="ps-skeleton" style={{ height: '80px' }} />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="ps-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--ps-text-muted)' }}>
            No {activeTab === 'all' ? '' : activeTab + ' '} jobs found.
          </div>
        ) : (
          filtered.map((job) => {
            const s = statusConfig[job.status] ?? statusConfig.pending;
            return (
              <div key={job.id} className="ps-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {job.filename}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>
                      {job.sourceType.toUpperCase()} · {job.productCount} products · Started {formatRelativeTime(job.startedAt || job.createdAt)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <span className={`ps-badge ${s.cls}`} style={{ fontSize: '0.6875rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      {s.icon}{s.label}
                    </span>
                  </div>
                </div>

                {job.status !== 'pending' && (
                  <>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--ps-text-muted)', marginBottom: '0.375rem' }}>
                        <span>{job.currentStage}</span>
                        <span style={{ fontWeight: 600, color: job.status === 'completed' ? 'var(--ps-success)' : 'var(--ps-primary)' }}>{job.progress}%</span>
                      </div>
                      <div className="ps-progress">
                        <div className="ps-progress-bar" style={{
                          width: `${job.progress}%`,
                          background: job.status === 'failed' ? 'var(--ps-danger)' : job.status === 'completed' ? 'var(--ps-success)' : 'var(--ps-primary)',
                        }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', color: 'var(--ps-text-muted)' }}>
                      <span>✓ {job.attributesExtracted} attributes extracted</span>
                      <span>⚠ {job.validationIssues} validation issues</span>
                      {job.completedAt && <span>Finished {formatRelativeTime(job.completedAt)}</span>}
                    </div>
                  </>
                )}

                {job.status === 'completed' && (
                  <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid var(--ps-border)', display: 'flex', gap: '0.5rem' }}>
                    <Link href="/app/products" className="ps-btn ps-btn-secondary ps-btn-sm">View Products</Link>
                    <Link href="/app/validation" className="ps-btn ps-btn-secondary ps-btn-sm">Review Validation</Link>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <style>{`@media (max-width: 900px) { .proc-stats { grid-template-columns: repeat(2,1fr) !important; } }`}</style>
    </div>
  );
}
