'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Upload, FileText, Table2, Globe, Type, CheckCircle,
  Loader2, AlertCircle, X, ArrowRight, Plus, Sparkles,
} from 'lucide-react';
import { importService } from '@/services/import.service';
import type { ImportJob } from '@/types';

const ACCEPTED_TYPES = ['.pdf', '.csv', '.xlsx', '.xls'];

export default function ImportPage() {
  const [dragActive, setDragActive] = useState(false);
  const [importMethod, setImportMethod] = useState<'file' | 'url' | 'manual' | 'paste'>('file');
  const [activeJob, setActiveJob] = useState<ImportJob | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Simulate progressive stage completion
  const simulateProcessing = useCallback((job: ImportJob) => {
    setActiveJob(job);
    let stageIdx = 1;
    const interval = setInterval(() => {
      if (stageIdx >= job.stages.length) { clearInterval(interval); return; }
      setActiveJob((prev) => {
        if (!prev) return prev;
        const stages = prev.stages.map((s, i) => ({
          ...s,
          status: i < stageIdx ? 'completed' : i === stageIdx ? 'active' : 'pending',
        })) as ImportJob['stages'];
        const progress = Math.round((stageIdx / prev.stages.length) * 100);
        return { ...prev, stages, progress, status: stageIdx >= prev.stages.length - 1 ? 'completed' : 'processing' };
      });
      stageIdx++;
    }, 1200);
  }, []);

  const handleFileDrop = async (file: File) => {
    setError('');
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      setError(`Unsupported file type. Accepted: ${ACCEPTED_TYPES.join(', ')}`);
      return;
    }
    setUploading(true);
    try {
      const job = await importService.uploadFile(file);
      simulateProcessing(job);
    } catch {
      setError('Upload failed. Please try again.');
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
    setUploading(true);
    try {
      const job = await importService.uploadUrl(urlInput);
      simulateProcessing(job);
    } catch {
      setError('Could not process the URL.');
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
          Upload documents, enter URLs, or paste product information to start AI extraction.
        </p>
      </div>

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
                  Supports PDF, CSV, XLSX formats
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {['PDF', 'CSV', 'XLSX'].map((t) => (
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

              {error && (
                <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', background: 'var(--ps-danger-light)', borderRadius: '8px', marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--ps-danger-dark)' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
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
                placeholder="Paste any product information here — specifications, descriptions, technical data..."
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                style={{ resize: 'vertical', fontFamily: 'var(--ps-font)' }}
              />
              <button
                onClick={async () => {
                  if (!pasteText.trim()) return;
                  setUploading(true);
                  setError('');
                  try {
                    const textBlob = new Blob([pasteText], { type: 'text/plain' });
                    const textFile = new File([textBlob], 'pasted_product_spec.txt', { type: 'text/plain' });
                    const job = await importService.uploadFile(textFile);
                    simulateProcessing(job);
                  } catch {
                    setError('Extraction failed. Please try again.');
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
                    {activeJob.status === 'completed' ? 'Processing Complete' : 'AI Processing...'}
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
                    background: activeJob.status === 'completed' ? 'var(--ps-success)' : 'var(--ps-primary)',
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>

              {/* Stages */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                {activeJob.stages.map((stage, i) => (
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
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--ps-success-dark)' }}>Ready for Review</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>Product data extracted and structured.</div>
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
              <h3 className="text-h3" style={{ marginBottom: '1.25rem' }}>Processing Pipeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { icon: <FileText size={16} />, label: 'File Uploaded', desc: 'Document received and validated' },
                  { icon: <Loader2 size={16} />, label: 'Processing', desc: 'Text extraction and parsing' },
                  { icon: <Table2 size={16} />, label: 'Extracting', desc: 'AI identifies product attributes' },
                  { icon: <CheckCircle size={16} />, label: 'Validating', desc: 'Cross-reference and quality check' },
                  { icon: <CheckCircle size={16} />, label: 'Ready for Review', desc: 'Product structured and enriched' },
                ].map((step, i) => (
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
