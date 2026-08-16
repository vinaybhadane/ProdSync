'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Upload, FileText, Table2, Globe, Type, CheckCircle,
  Loader2, AlertCircle, X, ArrowRight, Plus, Sparkles, AlertTriangle, RefreshCw
} from 'lucide-react';
import { importService } from '@/services/import.service';
import { liveProcessingService } from '@/services/api.client';
import type { ImportJob, ProcessingJob } from '@/types';

const ACCEPTED_TYPES = ['.pdf', '.csv', '.xlsx', '.xls', '.json', '.txt'];

export default function ImportPage() {
  const [dragActive, setDragActive] = useState(false);
  const [importMethod, setImportMethod] = useState<'file' | 'url' | 'manual' | 'paste'>('file');
  const [activeJob, setActiveJob] = useState<ImportJob | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [apiLimitHit, setApiLimitHit] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Clear polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Poll real backend job status
  const startRealJobPolling = useCallback((job: ImportJob) => {
    setActiveJob(job);
    setApiLimitHit(false);
    setError('');

    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const realStatus = await liveProcessingService.getJobStatus(job.id);
        if (!realStatus) return;

        if (realStatus.status === 'failed') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          const errText = realStatus.errorMessage || 'AI Analysis failed.';
          const isQuota = errText.toLowerCase().includes('limit') || errText.toLowerCase().includes('quota') || errText.includes('429');
          setApiLimitHit(isQuota);
          setError(errText);
          setActiveJob((prev) => prev ? { ...prev, status: 'failed', errorMessage: errText } : null);
          return;
        }

        if (realStatus.status === 'completed') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setActiveJob((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              status: 'completed',
              progress: 100,
              productCount: realStatus.productCount || prev.productCount || 1,
              stages: prev.stages.map((s) => ({ ...s, status: 'completed' })),
            };
          });
          return;
        }

        // Still processing
        setActiveJob((prev) => {
          if (!prev) return prev;
          const currentStageName = realStatus.currentStage?.toLowerCase() || '';
          return {
            ...prev,
            status: 'processing',
            progress: Math.max(prev.progress, realStatus.progress || 35),
            stages: prev.stages.map((s) => {
              if (s.id.toLowerCase() === currentStageName || s.label.toLowerCase() === currentStageName) {
                return { ...s, status: 'active' };
              }
              return s;
            }),
          };
        });
      } catch (e) {
        console.warn('Job polling notice:', e);
      }
    }, 1500);
  }, []);

  const handleFileDrop = async (file: File) => {
    setError('');
    setApiLimitHit(false);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      setError(`Unsupported file type. Accepted: ${ACCEPTED_TYPES.join(', ')}`);
      return;
    }
    setUploading(true);
    try {
      const job = await importService.uploadFile(file);
      startRealJobPolling(job);
    } catch (err: any) {
      const msg = err?.message || 'Upload failed. Please try again.';
      if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('limit')) {
        setApiLimitHit(true);
        setError('Google Gemini AI rate limit is hit (Quota 429). Please wait a few moments before retrying.');
      } else {
        setError(msg);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileDrop(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileDrop(file);
  };

  const handleUrlSubmit = async () => {
    if (!urlInput) return;
    setError('');
    setApiLimitHit(false);
    setUploading(true);
    try {
      const job = await importService.uploadUrl(urlInput);
      startRealJobPolling(job);
    } catch (err: any) {
      const msg = err?.message || 'Could not process the URL.';
      if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('limit')) {
        setApiLimitHit(true);
        setError('Google Gemini AI rate limit is hit (Quota 429). Please wait a few moments before retrying.');
      } else {
        setError(msg);
      }
    } finally {
      setUploading(false);
    }
  };

  const stageStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle size={18} color="var(--ps-success)" />;
    if (status === 'active') return <Loader2 size={18} color="var(--ps-primary)" style={{ animation: 'ps-spin 1s linear infinite' }} />;
    return <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--ps-slate-300)' }} />;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="text-h2" style={{ marginBottom: '0.25rem' }}>Import Product Data</h1>
        <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>
          Upload actual product catalogs, datasheets, or CSV datasets for real-time Google Gemini AI extraction & Unilog normalization.
        </p>
      </div>

      {/* API Limit Warning Banner */}
      {apiLimitHit && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.875rem',
            padding: '1rem 1.25rem',
            background: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            color: '#92400E',
          }}
        >
          <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
              Google Gemini API Limit Reached (HTTP 429)
            </div>
            <div style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
              The Gemini Free Tier daily or per-minute rate limit was reached while processing your file. Only 100% real data is processed — no mock data is used. Please wait 30–60 seconds before retrying.
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }} className="import-grid">
        {/* Left — import form */}
        <div>
          {/* Method tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {([
              { id: 'file', icon: <Upload size={14} />, label: 'Upload File' },
              { id: 'url', icon: <Globe size={14} />, label: 'Enter URL' },
              { id: 'paste', icon: <Type size={14} />, label: 'Paste Text' },
              { id: 'manual', icon: <Plus size={14} />, label: 'Manual Entry' },
            ] as const).map((method) => (
              <button
                key={method.id}
                onClick={() => setImportMethod(method.id)}
                className="ps-btn ps-btn-sm"
                style={{
                  background: importMethod === method.id ? 'var(--ps-primary)' : 'white',
                  color: importMethod === method.id ? 'white' : 'var(--ps-text-secondary)',
                  border: `1px solid ${importMethod === method.id ? 'var(--ps-primary)' : 'var(--ps-border-strong)'}`,
                }}
              >
                {method.icon}
                {method.label}
              </button>
            ))}
          </div>

          {/* File drop zone */}
          {importMethod === 'file' && (
            <div>
              <label
                className={`upload-zone${dragActive ? ' drag-active' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  minHeight: '280px',
                  cursor: 'pointer',
                }}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                htmlFor="file-input"
              >
                <input
                  id="file-input"
                  type="file"
                  accept={ACCEPTED_TYPES.join(',')}
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                  aria-label="Upload product document"
                />
                {uploading ? (
                  <Loader2 size={40} color="var(--ps-primary)" style={{ animation: 'ps-spin 1s linear infinite', marginBottom: '1rem' }} />
                ) : (
                  <Upload size={40} color={dragActive ? 'var(--ps-primary)' : 'var(--ps-slate-400)'} style={{ marginBottom: '1rem' }} />
                )}
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: dragActive ? 'var(--ps-primary)' : 'var(--ps-text-primary)' }}>
                  {dragActive ? 'Drop your file here' : 'Drop product documents here'}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--ps-text-muted)', marginBottom: '1.5rem' }}>
                  Supports CSV, XLSX, PDF, JSON formats
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {['CSV', 'XLSX', 'PDF', 'JSON'].map((t) => (
                    <span key={t} className="ps-badge ps-badge-neutral" style={{ fontSize: '0.75rem' }}>{t}</span>
                  ))}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>or</div>
                <button
                  type="button"
                  className="ps-btn ps-btn-secondary"
                  style={{ marginTop: '0.75rem', pointerEvents: 'none' }}
                >
                  Browse Files
                </button>
              </label>

              {error && !apiLimitHit && (
                <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', background: 'var(--ps-danger-light)', borderRadius: '8px', marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--ps-danger-dark)' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* URL input */}
          {importMethod === 'url' && (
            <div className="ps-card" style={{ padding: '1.5rem' }}>
              <label className="ps-label" htmlFor="url-input">Product Page URL</label>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <input
                  id="url-input"
                  type="url"
                  className="ps-input"
                  placeholder="https://manufacturer.com/product/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  onClick={handleUrlSubmit}
                  className="ps-btn ps-btn-primary"
                  disabled={!urlInput || uploading}
                  style={{ flexShrink: 0 }}
                >
                  {uploading ? <Loader2 size={16} style={{ animation: 'ps-spin 1s linear infinite' }} /> : <ArrowRight size={16} />}
                  Extract
                </button>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>
                ProdSync will extract product attributes from the provided URL.
              </p>
            </div>
          )}

          {/* Paste text */}
          {importMethod === 'paste' && (
            <div className="ps-card" style={{ padding: '1.5rem' }}>
              <label className="ps-label" htmlFor="paste-input">Paste Product Information</label>
              <textarea
                id="paste-input"
                className="ps-input"
                rows={8}
                placeholder="Paste real product specifications, descriptions, technical data, or CSV rows..."
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                style={{ resize: 'vertical', fontFamily: 'var(--ps-font)' }}
              />
              <button
                onClick={async () => {
                  if (!pasteText.trim()) return;
                  setUploading(true);
                  setError('');
                  setApiLimitHit(false);
                  try {
                    const textBlob = new Blob([pasteText], { type: 'text/plain' });
                    const textFile = new File([textBlob], 'pasted_product_spec.txt', { type: 'text/plain' });
                    const job = await importService.uploadFile(textFile);
                    startRealJobPolling(job);
                  } catch (err: any) {
                    const msg = err?.message || 'Extraction failed. Please try again.';
                    if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('limit')) {
                      setApiLimitHit(true);
                      setError('Google Gemini AI rate limit is hit (Quota 429). Please wait a few moments before retrying.');
                    } else {
                      setError(msg);
                    }
                  } finally {
                    setUploading(false);
                  }
                }}
                className="ps-btn ps-btn-primary"
                disabled={!pasteText || uploading}
                style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}
              >
                {uploading ? <Loader2 size={14} style={{ animation: 'ps-spin 1s linear infinite' }} /> : <Sparkles size={14} />}
                Extract Product Data
              </button>
            </div>
          )}

          {/* Manual entry */}
          {importMethod === 'manual' && (
            <div className="ps-card" style={{ padding: '1.5rem' }}>
              <h3 className="text-h3" style={{ marginBottom: '1.25rem' }}>Add Product Manually</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['Product Name', 'SKU', 'Manufacturer', 'Category'].map((field) => (
                  <div key={field}>
                    <label className="ps-label" htmlFor={`manual-${field}`}>{field}</label>
                    <input id={`manual-${field}`} type="text" className="ps-input" placeholder={`Enter ${field.toLowerCase()}`} />
                  </div>
                ))}
                <button className="ps-btn ps-btn-primary" style={{ justifyContent: 'center' }}>
                  <Plus size={14} />
                  Add Product
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right — processing status */}
        <div>
          {activeJob ? (
            <div className="ps-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
                    {activeJob.status === 'completed'
                      ? 'Processing Complete'
                      : activeJob.status === 'failed'
                      ? 'Processing Stopped'
                      : 'AI Processing...'}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                    {activeJob.filename}
                  </div>
                </div>
                <button onClick={() => setActiveJob(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ps-text-muted)', display: 'flex' }}>
                  <X size={16} />
                </button>
              </div>

              {/* Progress bar */}
              <div className="ps-progress" style={{ marginBottom: '1.25rem' }}>
                <div
                  className="ps-progress-bar"
                  style={{
                    width: `${activeJob.progress}%`,
                    background: activeJob.status === 'completed'
                      ? 'var(--ps-success)'
                      : activeJob.status === 'failed'
                      ? 'var(--ps-danger)'
                      : 'var(--ps-primary)',
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>

              {/* Error state */}
              {activeJob.status === 'failed' && (
                <div style={{ padding: '1rem', background: 'var(--ps-danger-light)', borderRadius: '8px', marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--ps-danger-dark)', marginBottom: '0.25rem' }}>
                    {apiLimitHit ? 'AI Rate Limit Hit (429)' : 'Processing Error'}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ps-danger)' }}>
                    {activeJob.errorMessage || error || 'The file could not be analyzed.'}
                  </div>
                </div>
              )}

              {/* Stages */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                {activeJob.stages.map((stage) => (
                  <div
                    key={stage.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.625rem 0.75rem',
                      borderRadius: '8px',
                      background: stage.status === 'active' ? 'var(--ps-primary-50)' : 'transparent',
                    }}
                  >
                    {stageStatusIcon(stage.status)}
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: stage.status === 'active' ? 600 : 400,
                        color: stage.status === 'active' ? 'var(--ps-primary)' : stage.status === 'completed' ? 'var(--ps-text-primary)' : 'var(--ps-text-muted)',
                      }}
                    >
                      {stage.label}
                    </span>
                  </div>
                ))}
              </div>

              {activeJob.status === 'completed' && (
                <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--ps-success-light)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle size={20} color="var(--ps-success)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--ps-success-dark)' }}>Real Data Extracted</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>
                      {activeJob.productCount} product(s) normalized and saved to database.
                    </div>
                  </div>
                </div>
              )}

              {activeJob.status === 'completed' && (
                <Link href="/app/products" className="ps-btn ps-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.875rem' }}>
                  View Products <ArrowRight size={14} />
                </Link>
              )}
            </div>
          ) : (
            <div className="ps-card" style={{ padding: '2rem' }}>
              <h3 className="text-h3" style={{ marginBottom: '1.25rem' }}>Real-Time Processing Pipeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { icon: <FileText size={16} />, label: 'File Uploaded', desc: 'Real document/data received' },
                  { icon: <Loader2 size={16} />, label: 'Text & Table Extraction', desc: 'High-fidelity parser extracts real records' },
                  { icon: <Table2 size={16} />, label: 'Google Gemini AI Analysis', desc: 'Normalized Unilog specs & taxonomy' },
                  { icon: <CheckCircle size={16} />, label: 'Physical Rule Validation', desc: 'Engineering conflicts & range checks' },
                  { icon: <CheckCircle size={16} />, label: 'Database Persistence', desc: 'Saved directly to SQLite products catalog' },
                ].map((step) => (
                  <div key={step.label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--ps-bg-secondary)', border: '1px solid var(--ps-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ps-slate-400)', flexShrink: 0 }}>
                      {step.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ps-text-primary)' }}>{step.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)' }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .import-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
