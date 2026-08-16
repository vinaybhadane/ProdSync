'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, AlertTriangle, XCircle, ArrowRight, Filter } from 'lucide-react';
import { productService } from '@/services/product.service';
import { formatDate } from '@/lib/utils';
import type { Product } from '@/types';

const issueConfig = {
  missing: { label: 'Missing Data', cls: 'ps-badge-danger', icon: <XCircle size={14} />, color: 'var(--ps-danger)' },
  conflict: { label: 'Conflict', cls: 'ps-badge-warning', icon: <AlertTriangle size={14} />, color: 'var(--ps-warning)' },
  suspicious: { label: 'Suspicious Value', cls: 'ps-badge-warning', icon: <AlertTriangle size={14} />, color: 'var(--ps-warning)' },
  invalid: { label: 'Invalid', cls: 'ps-badge-danger', icon: <XCircle size={14} />, color: 'var(--ps-danger)' },
};

export default function ValidationPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning'>('all');

  useEffect(() => {
    productService.getProducts({ status: 'needs_review', pageSize: 50 }).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  const allIssues = products.flatMap((p) =>
    p.validationIssues.map((issue) => ({ ...issue, product: p }))
  );

  const handleResolve = async (issueId: string) => {
    await productService.resolveValidationIssue(issueId);
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        validationIssues: p.validationIssues.filter((i) => i.id !== issueId),
      }))
    );
  };

  const handleDismiss = async (issueId: string) => {
    await productService.dismissValidationIssue(issueId);
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        validationIssues: p.validationIssues.filter((i) => i.id !== issueId),
      }))
    );
  };

  const handleApproveAllMinor = async () => {
    const warnings = allIssues.filter((i) => i.severity === 'warning');
    for (const issue of warnings) {
      await productService.resolveValidationIssue(issue.id);
    }
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        validationIssues: p.validationIssues.filter((i) => i.severity !== 'warning'),
      }))
    );
  };

  const filtered = filter === 'critical'
    ? allIssues.filter((i) => i.severity === 'critical')
    : filter === 'warning'
    ? allIssues.filter((i) => i.severity === 'warning')
    : allIssues;

  const criticalCount = allIssues.filter((i) => i.severity === 'critical').length;
  const warningCount = allIssues.filter((i) => i.severity === 'warning').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-h2" style={{ marginBottom: '0.25rem' }}>Validation Queue</h1>
          <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>
            {allIssues.length} issues across {products.length} products require review
          </p>
        </div>
        <button
          onClick={handleApproveAllMinor}
          disabled={warningCount === 0}
          className="ps-btn ps-btn-secondary ps-btn-sm"
        >
          <CheckCircle size={14} />
          Approve All Minor Issues ({warningCount})
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }} className="val-summary">
        {[
          { label: 'All Issues', value: allIssues.length, color: 'var(--ps-text-primary)', bg: 'var(--ps-bg-secondary)', filter: 'all' },
          { label: 'Critical', value: criticalCount, color: 'var(--ps-danger)', bg: 'var(--ps-danger-light)', filter: 'critical' },
          { label: 'Warnings', value: warningCount, color: 'var(--ps-warning-dark)', bg: 'var(--ps-warning-light)', filter: 'warning' },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => setFilter(s.filter as typeof filter)}
            className="ps-card"
            style={{
              padding: '1.25rem',
              background: filter === s.filter ? s.bg : undefined,
              borderColor: filter === s.filter ? s.color : undefined,
              border: filter === s.filter ? `2px solid ${s.color}40` : undefined,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
              width: '100%',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginTop: '0.375rem', fontWeight: 500 }}>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Issues list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="ps-card" style={{ padding: '1.5rem' }}>
              <div className="ps-skeleton" style={{ height: '100px' }} />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="ps-card" style={{ padding: '4rem', textAlign: 'center' }}>
            <CheckCircle size={56} color="var(--ps-success)" style={{ margin: '0 auto 1.25rem', display: 'block' }} />
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>All Clear!</div>
            <div style={{ color: 'var(--ps-text-muted)' }}>No validation issues found in the current filter.</div>
          </div>
        ) : (
          filtered.map((issue) => (
            <div
              key={`${issue.id}-${issue.product.id}`}
              className="ps-card"
              style={{
                padding: '1.25rem',
                borderLeft: `4px solid ${issue.severity === 'critical' ? 'var(--ps-danger)' : 'var(--ps-warning)'}`,
              }}
            >
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: issue.severity === 'critical' ? 'var(--ps-danger-light)' : 'var(--ps-warning-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: issue.severity === 'critical' ? 'var(--ps-danger)' : 'var(--ps-warning)',
                    flexShrink: 0,
                  }}
                >
                  {issue.severity === 'critical' ? <XCircle size={18} /> : <AlertTriangle size={18} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ps-text-primary)' }}>{issue.title}</span>
                    <span className={`ps-badge ${issue.severity === 'critical' ? 'ps-badge-danger' : 'ps-badge-warning'}`} style={{ fontSize: '0.6875rem', textTransform: 'capitalize' }}>
                      {issue.severity}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginBottom: '0.75rem' }}>
                    <strong>{issue.product.name}</strong> · {issue.product.sku} · Attribute: {issue.attributeName}
                  </div>

                  {(issue.sourceAValue || issue.sourceBValue) && (
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      {[{ label: issue.sourceALabel, value: issue.sourceAValue }, { label: issue.sourceBLabel, value: issue.sourceBValue }].map((src, i) => src.value && (
                        <div key={i} style={{ padding: '0.5rem 0.875rem', background: 'var(--ps-bg-secondary)', borderRadius: '8px', border: '1px solid var(--ps-border)' }}>
                          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--ps-text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>{src.label ?? `Source ${i + 1}`}</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--ps-text-primary)' }}>{src.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleResolve(issue.id)}
                      className="ps-btn ps-btn-sm"
                      style={{ background: 'var(--ps-success-light)', color: 'var(--ps-success-dark)', border: 'none', cursor: 'pointer' }}
                    >
                      <CheckCircle size={12} />Accept & Resolve
                    </button>
                    <button
                      onClick={() => handleDismiss(issue.id)}
                      className="ps-btn ps-btn-ghost ps-btn-sm"
                    >
                      <XCircle size={12} />Dismiss
                    </button>
                    <Link href={`/app/products/${issue.product.id}`} className="ps-btn ps-btn-secondary ps-btn-sm">
                      View Product <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <style>{`@media (max-width: 640px) { .val-summary { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
