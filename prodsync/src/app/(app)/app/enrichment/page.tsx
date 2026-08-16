'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Brain, CheckCircle, XCircle, Sparkles, RefreshCw, Zap, AlertTriangle,
  ChevronRight, Edit2, ExternalLink, Cpu, Info,
} from 'lucide-react';
import { productService } from '@/services/product.service';

interface Suggestion {
  id: string;
  product_id: string;
  attribute_name: string;
  suggested_value: string;
  confidence: number;
  reason: string;
  source_type: string;
  status: string;
  productName?: string;
  productSku?: string;
}

export default function EnrichmentPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<Record<string, boolean>>({});
  const [enrichingProduct, setEnrichingProduct] = useState<string | null>(null);
  const [enrichResult, setEnrichResult] = useState<{ productId: string; count: number } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [aiStatus, setAiStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');

  const loadSuggestions = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await productService.getEnrichmentSuggestions('pending');
      // Also load product names by fetching products list
      const products = await productService.getProducts({ pageSize: 100 });
      const productMap: Record<string, { name: string; sku: string }> = {};
      products.data.forEach((p: any) => { productMap[p.id] = { name: p.name, sku: p.sku }; });

      setSuggestions(
        raw.map((s: any) => ({
          ...s,
          productName: productMap[s.product_id]?.name || 'Unknown Product',
          productSku: productMap[s.product_id]?.sku || '',
        }))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSuggestions(); }, [loadSuggestions]);

  const handleRunEnrichment = async (productId: string) => {
    setEnrichingProduct(productId);
    setAiStatus('running');
    setEnrichResult(null);
    try {
      const result = await productService.runEnrichment(productId);
      setEnrichResult({ productId, count: result.suggestion_count });
      setAiStatus('done');
      // Reload suggestions after enrichment
      await loadSuggestions();
    } catch {
      setAiStatus('error');
    } finally {
      setEnrichingProduct(null);
    }
  };

  const handleAccept = async (suggId: string, customValue?: string) => {
    setAccepting((p) => ({ ...p, [suggId]: true }));
    await productService.acceptSuggestion(suggId, customValue);
    setSuggestions((prev) => prev.filter((s) => s.id !== suggId));
    setEditingId(null);
    setAccepting((p) => ({ ...p, [suggId]: false }));
  };

  const handleReject = async (suggId: string) => {
    await productService.rejectSuggestion(suggId);
    setSuggestions((prev) => prev.filter((s) => s.id !== suggId));
  };

  const handleAcceptAll = async () => {
    const highConf = suggestions.filter((s) => s.confidence >= 90);
    for (const s of highConf) {
      await handleAccept(s.id, s.suggested_value);
    }
  };

  // Group suggestions by product
  const byProduct = suggestions.reduce<Record<string, Suggestion[]>>((acc, s) => {
    if (!acc[s.product_id]) acc[s.product_id] = [];
    acc[s.product_id].push(s);
    return acc;
  }, {});

  const highConf = suggestions.filter((s) => s.confidence >= 90).length;
  const medConf = suggestions.filter((s) => s.confidence >= 70 && s.confidence < 90).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-h2" style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={22} color="var(--ps-ai, #8b5cf6)" /> AI Enrichment
          </h1>
          <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>
            {suggestions.length} Gemini-generated suggestions pending review across {Object.keys(byProduct).length} products
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={loadSuggestions} disabled={loading} className="ps-btn ps-btn-secondary ps-btn-sm">
            <RefreshCw size={13} style={{ animation: loading ? 'ps-spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
          <button
            onClick={handleAcceptAll}
            disabled={highConf === 0}
            className="ps-btn ps-btn-primary ps-btn-sm"
          >
            <Zap size={13} />
            Accept All High-Confidence ({highConf})
          </button>
        </div>
      </div>

      {/* AI Engine Status Banner */}
      {(aiStatus === 'running' || aiStatus === 'done' || aiStatus === 'error') && (
        <div
          style={{
            padding: '0.875rem 1.25rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: aiStatus === 'running'
              ? 'linear-gradient(135deg, #f5f3ff, #ede9fe)'
              : aiStatus === 'done'
                ? '#ecfdf5'
                : '#fef2f2',
            border: `1px solid ${aiStatus === 'running' ? '#c4b5fd' : aiStatus === 'done' ? '#6ee7b7' : '#fca5a5'}`,
          }}
        >
          <div style={{ color: aiStatus === 'running' ? '#7c3aed' : aiStatus === 'done' ? '#059669' : '#dc2626', animation: aiStatus === 'running' ? 'ps-spin 1s linear infinite' : 'none' }}>
            {aiStatus === 'running' ? <Cpu size={18} /> : aiStatus === 'done' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: aiStatus === 'running' ? '#5b21b6' : aiStatus === 'done' ? '#065f46' : '#991b1b' }}>
              {aiStatus === 'running'
                ? 'Gemini AI is analyzing the product specifications...'
                : aiStatus === 'done'
                  ? `✓ Gemini returned ${enrichResult?.count ?? 0} new enrichment suggestions`
                  : '✗ Gemini enrichment encountered an error'}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>
              {aiStatus === 'running'
                ? 'Sending product context to Google Gemini API for attribute inference...'
                : aiStatus === 'done'
                  ? 'Suggestions have been saved to the database — review them below.'
                  : 'Check backend logs. Your API key may have quota limits.'}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}
        className="enr-stats"
      >
        {[
          { label: 'Total Pending', value: suggestions.length, color: 'var(--ps-ai, #8b5cf6)', icon: <Brain size={18} /> },
          { label: 'High Confidence 90%+', value: highConf, color: 'var(--ps-success, #10b981)', icon: <CheckCircle size={18} /> },
          { label: 'Medium Confidence', value: medConf, color: 'var(--ps-warning, #f59e0b)', icon: <Brain size={18} /> },
          { label: 'Products Covered', value: Object.keys(byProduct).length, color: 'var(--ps-primary, #3b82f6)', icon: <Sparkles size={18} /> },
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

      {/* Suggestions by Product Group */}
      <div className="ps-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--ps-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Pending Enrichment Suggestions</div>
          <span style={{
            fontSize: '0.6875rem', fontWeight: 700, background: 'var(--ps-ai-light, #f5f3ff)',
            color: 'var(--ps-ai, #8b5cf6)', padding: '3px 8px', borderRadius: '10px'
          }}>
            Powered by Gemini
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '2rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="ps-skeleton" style={{ height: '72px', marginBottom: '0.75rem', borderRadius: '8px' }} />
            ))}
          </div>
        ) : suggestions.length === 0 ? (
          <div style={{ padding: '5rem', textAlign: 'center' }}>
            <Sparkles size={48} color="var(--ps-ai, #8b5cf6)" style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.4 }} />
            <div style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Pending Suggestions</div>
            <div style={{ color: 'var(--ps-text-muted)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
              Go to a product page and click "Run Gemini Enrichment" to generate AI suggestions.
            </div>
            <Link href="/app/products" className="ps-btn ps-btn-primary ps-btn-sm">
              <ChevronRight size={14} /> Browse Products
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="ps-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Attribute</th>
                  <th>AI Suggested Value</th>
                  <th>Confidence</th>
                  <th>Gemini Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((s) => {
                  const isEditing = editingId === s.id;
                  return (
                    <tr key={s.id}>
                      <td>
                        <div>
                          <Link
                            href={`/app/products/${s.product_id}`}
                            style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--ps-text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            {s.productName} <ExternalLink size={11} />
                          </Link>
                          <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)', fontFamily: 'monospace' }}>{s.productSku}</div>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          fontWeight: 700, fontSize: '0.875rem', color: 'var(--ps-ai, #8b5cf6)',
                          background: 'var(--ps-ai-light, #f5f3ff)', padding: '2px 8px', borderRadius: '6px',
                        }}>
                          {s.attribute_name}
                        </span>
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="ps-input"
                            style={{ fontSize: '0.875rem', height: '32px', width: '140px' }}
                            autoFocus
                          />
                        ) : (
                          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--ps-text-primary)' }}>
                            {s.suggested_value}
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div className="ps-progress" style={{ width: '56px' }}>
                            <div
                              className="ps-progress-bar"
                              style={{
                                width: `${s.confidence}%`,
                                background:
                                  s.confidence >= 90
                                    ? 'var(--ps-success, #10b981)'
                                    : s.confidence >= 70
                                      ? 'var(--ps-primary, #3b82f6)'
                                      : 'var(--ps-warning, #f59e0b)',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: s.confidence >= 90 ? '#059669' : s.confidence >= 70 ? '#2563eb' : '#d97706' }}>
                            {s.confidence}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          title={s.reason}
                          style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', display: 'block', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {s.reason}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--ps-text-muted)', fontStyle: 'italic' }}>
                          {s.source_type === 'industry_standard' ? '📐 Industry Standard' : '🔗 Similar Products'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleAccept(s.id, editValue)}
                                className="ps-btn ps-btn-sm"
                                style={{ background: 'var(--ps-success-light, #ecfdf5)', color: '#059669', border: 'none', fontWeight: 700 }}
                              >
                                <CheckCircle size={12} /> Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="ps-btn ps-btn-ghost ps-btn-sm"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleAccept(s.id)}
                                className="ps-btn ps-btn-sm"
                                disabled={accepting[s.id]}
                                style={{ background: 'var(--ps-success-light, #ecfdf5)', color: '#059669', border: 'none', fontWeight: 600 }}
                              >
                                {accepting[s.id] ? <RefreshCw size={12} style={{ animation: 'ps-spin 1s linear infinite' }} /> : <CheckCircle size={12} />}
                                Accept
                              </button>
                              <button
                                onClick={() => { setEditingId(s.id); setEditValue(s.suggested_value); }}
                                className="ps-btn ps-btn-ghost ps-btn-sm"
                                title="Edit value before accepting"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => handleReject(s.id)}
                                className="ps-btn ps-btn-ghost ps-btn-sm"
                                title="Reject suggestion"
                                style={{ color: 'var(--ps-danger, #ef4444)' }}
                              >
                                <XCircle size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info footer */}
      <div style={{ marginTop: '1rem', padding: '0.875rem 1.25rem', borderRadius: '10px', background: 'var(--ps-bg-secondary)', border: '1px solid var(--ps-border)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <Info size={16} color="var(--ps-primary)" style={{ flexShrink: 0, marginTop: '1px' }} />
        <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--ps-text-primary)' }}>How Gemini AI Enrichment works:</strong>{' '}
          Open any product page → click <strong>"Run Gemini Enrichment"</strong> → Gemini analyzes the product name, category, and existing attributes → suggests missing specifications based on industry standards → you review and approve/edit/reject each suggestion. Accepted suggestions are immediately saved to the product database.
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .enr-stats { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px) { .enr-stats { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
