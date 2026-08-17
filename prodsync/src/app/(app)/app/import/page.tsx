'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Upload, FileText, Table2, Globe, Type, CheckCircle,
  Loader2, AlertCircle, X, ArrowRight, Plus, Sparkles, AlertTriangle, RefreshCw,
  Camera, Image as ImageIcon, Copy, Check, Eye, ShieldCheck, Tag, Cpu, Zap, Download, Database, Layers
} from 'lucide-react';
import { importService } from '@/services/import.service';
import { liveProcessingService, liveImportService, liveProductService } from '@/services/api.client';
import type { ImportJob, Product } from '@/types';

const ACCEPTED_TYPES = ['.pdf', '.csv', '.xlsx', '.xls', '.json', '.txt', '.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff'];
const IMAGE_TYPES = ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff'];

interface OcrScanResult {
  filename: string;
  imagePreviewUrl: string;
  ocrText: string;
  ocrLines: string[];
  lineCount?: number;
  ocrEngine?: string;
  ocrConfidence?: number;
  products: any[];
  jobId?: string;
  model?: string;
}

interface BatchPreviewData {
  filename: string;
  total_rows: number;
  headers: string[];
  sample_records: any[];
  suggested_mappings: Record<string, string>;
  selectedFile?: File;
}

export default function ImportPage() {
  const [dragActive, setDragActive] = useState(false);
  const [importMethod, setImportMethod] = useState<'quick_mpn' | 'file' | 'ocr' | 'url' | 'paste' | 'manual'>('quick_mpn');
  const [activeJob, setActiveJob] = useState<ImportJob | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [apiLimitHit, setApiLimitHit] = useState(false);
  const [copiedOcr, setCopiedOcr] = useState(false);

  // Quick MPN Enrichment State
  const [quickMfr, setQuickMfr] = useState('Schneider Electric');
  const [quickMpn, setQuickMpn] = useState('LC1D09M7');
  const [quickDesc, setQuickDesc] = useState('TeSys D Contactor 3P AC-3 440V 9A 220V AC coil');
  const [quickEnriching, setQuickEnriching] = useState(false);
  const [quickEnrichedProduct, setQuickEnrichedProduct] = useState<Product | null>(null);
  const [quickActiveStep, setQuickActiveStep] = useState(0);

  // Batch CSV Preview State
  const [batchPreview, setBatchPreview] = useState<BatchPreviewData | null>(null);

  // Dedicated Image OCR State
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<OcrScanResult | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

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

  // Handle Quick MPN Enrichment
  const handleQuickEnrich = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickMfr.trim() || !quickMpn.trim()) {
      setError('Manufacturer and MPN / Part Number are required.');
      return;
    }

    setError('');
    setQuickEnriching(true);
    setQuickEnrichedProduct(null);
    setQuickActiveStep(1);

    const stepInterval = setInterval(() => {
      setQuickActiveStep((prev) => (prev < 6 ? prev + 1 : prev));
    }, 450);

    try {
      const enriched = await liveImportService.quickEnrich({
        manufacturer: quickMfr.trim(),
        mpn: quickMpn.trim(),
        part_desc: quickDesc.trim() || undefined,
      });

      clearInterval(stepInterval);
      setQuickActiveStep(7);
      setQuickEnrichedProduct(enriched);
    } catch (err: any) {
      clearInterval(stepInterval);
      const msg = err?.message || 'Quick enrichment failed. Please verify the inputs.';
      setError(msg);
    } finally {
      setQuickEnriching(false);
    }
  };

  // Standard File Drop Handler (Supports CSV preview & Batch)
  const handleFileDrop = async (file: File) => {
    setError('');
    setApiLimitHit(false);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      setError(`Unsupported file type. Accepted: ${ACCEPTED_TYPES.join(', ')}`);
      return;
    }

    if (IMAGE_TYPES.includes(ext) && importMethod === 'ocr') {
      await handleImageOcrScan(file);
      return;
    }

    // If CSV / XLSX, show column mapping preview first
    if (['.csv', '.xlsx', '.xls'].includes(ext)) {
      try {
        setUploading(true);
        const preview = await liveImportService.previewBatch(file);
        setBatchPreview({ ...preview, selectedFile: file });
        setUploading(false);
        return;
      } catch (e) {
        console.warn('Preview notice, falling back to direct upload:', e);
      }
    }

    setUploading(true);
    try {
      const job = await importService.uploadFile(file);
      startRealJobPolling(job);
    } catch (err: any) {
      const msg = err?.message || 'Upload failed. Please try again.';
      if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('limit')) {
        setApiLimitHit(true);
        setError('Google Gemini AI rate limit reached (Quota 429). Please wait a few moments before retrying.');
      } else {
        setError(msg);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleStartBatchProcessing = async () => {
    if (!batchPreview?.selectedFile) return;
    setUploading(true);
    try {
      const job = await importService.uploadFile(batchPreview.selectedFile);
      setBatchPreview(null);
      startRealJobPolling(job);
    } catch (err: any) {
      setError(err?.message || 'Batch upload failed.');
    } finally {
      setUploading(false);
    }
  };

  // Dedicated Image OCR Scanner
  const handleImageOcrScan = async (file: File) => {
    setError('');
    setApiLimitHit(false);
    setOcrScanning(true);
    setOcrResult(null);
    setSelectedImageFile(file);

    const previewUrl = URL.createObjectURL(file);

    try {
      const scanRes = await liveImportService.scanImageOcr(file, true);
      setOcrResult({
        filename: scanRes.filename,
        imagePreviewUrl: previewUrl,
        ocrText: scanRes.ocrText,
        ocrLines: scanRes.ocrLines,
        lineCount: scanRes.lineCount,
        ocrEngine: scanRes.ocrEngine,
        ocrConfidence: scanRes.ocrConfidence,
        products: scanRes.products,
        jobId: scanRes.jobId,
        model: scanRes.aiModel,
      });

      if (scanRes.jobId) {
        startRealJobPolling({
          id: scanRes.jobId,
          filename: file.name,
          fileType: 'image',
          fileSize: file.size,
          status: 'processing',
          progress: 30,
          stages: [
            { id: 'document_received', label: 'Image Received', status: 'completed' },
            { id: 'text_extraction', label: 'RapidOCR Text Extraction', status: 'completed' },
            { id: 'product_detection', label: 'Gemini Structuring', status: 'active' },
            { id: 'normalization', label: 'Unit Normalization', status: 'pending' },
            { id: 'validation', label: 'Engineering Rules', status: 'pending' },
            { id: 'enrichment', label: 'AI Enrichment', status: 'pending' },
            { id: 'final_structuring', label: 'Catalog Ready', status: 'pending' },
          ],
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      const msg = err?.message || 'OCR Image Scan failed.';
      if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('limit')) {
        setApiLimitHit(true);
        setError('Google Gemini AI rate limit is hit (Quota 429). Please wait a few moments before retrying.');
      } else {
        setError(msg);
      }
    } finally {
      setOcrScanning(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (importMethod === 'ocr') handleImageOcrScan(file);
      else handleFileDrop(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (importMethod === 'ocr') handleImageOcrScan(file);
      else handleFileDrop(file);
    }
  };

  const handleCopyOcr = () => {
    if (!ocrResult?.ocrText) return;
    navigator.clipboard.writeText(ocrResult.ocrText);
    setCopiedOcr(true);
    setTimeout(() => setCopiedOcr(false), 2000);
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
      setError(err?.message || 'Could not process the URL.');
    } finally {
      setUploading(false);
    }
  };

  const stageStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle size={18} color="var(--ps-success)" />;
    if (status === 'active') return <Loader2 size={18} color="var(--ps-primary)" style={{ animation: 'ps-spin 1s linear infinite' }} />;
    return <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--ps-slate-300)' }} />;
  };

  const QUICK_ENRICH_STAGES = [
    'Input Validated & Sanitized',
    'Authoritative Manufacturer Sourcing (Priority 1)',
    'Leaf-Level Taxonomy Classification',
    'Dynamic Schema Attribute Extraction & UOMs',
    'List of Values (LOV) Validation & New Value Discovery',
    '5-Tier Unilog Standardized Descriptions',
    'Commerce-Ready Product Structuring & Provenance',
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="text-h2" style={{ marginBottom: '0.25rem' }}>Import & AI Product Intelligence Engine</h1>
        <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>
          Enrich products using minimal manufacturer part inputs, upload batch catalogs, or scan physical nameplates.
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
              The Gemini Free Tier rate limit was reached. Only 100% real dynamic data is processed — no static mock data is used. Please wait a few moments before retrying.
            </div>
          </div>
        </div>
      )}

      {/* Method tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {([
          { id: 'quick_mpn', icon: <Zap size={14} />, label: '⚡ Quick MPN Enrichment (Live Search)' },
          { id: 'file', icon: <Upload size={14} />, label: 'Batch File / CSV / PDF Upload' },
          { id: 'ocr', icon: <Camera size={14} />, label: 'Nameplate OCR Scan (RapidOCR Library)' },
          { id: 'url', icon: <Globe size={14} />, label: 'Manufacturer URL' },
          { id: 'paste', icon: <Type size={14} />, label: 'Paste Technical Text' },
        ] as const).map((method) => (
          <button
            key={method.id}
            onClick={() => {
              setImportMethod(method.id);
              setError('');
            }}
            className="ps-btn ps-btn-sm"
            style={{
              background: importMethod === method.id ? 'var(--ps-primary)' : 'white',
              color: importMethod === method.id ? 'white' : 'var(--ps-text-secondary)',
              border: `1px solid ${importMethod === method.id ? 'var(--ps-primary)' : 'var(--ps-border-strong)'}`,
              fontWeight: importMethod === method.id ? 600 : 500,
            }}
          >
            {method.icon}
            {method.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }} className="import-grid">
        {/* Left Column — Ingestion Input */}
        <div>
          {/* 1. Quick MPN Enrichment Form */}
          {importMethod === 'quick_mpn' && (
            <div className="ps-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ps-primary)' }}>
                  <Zap size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: 0 }}>Minimal Input AI Product Enrichment</h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', margin: 0 }}>
                    Enter Manufacturer + MPN. ProdSync searches authoritative sources and extracts 10–30+ attributes.
                  </p>
                </div>
              </div>

              <form onSubmit={handleQuickEnrich}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--ps-text-primary)' }}>
                    Manufacturer / Brand Name <span style={{ color: 'var(--ps-danger)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="ps-input"
                    value={quickMfr}
                    onChange={(e) => setQuickMfr(e.target.value)}
                    placeholder="e.g. Schneider Electric, 3M, Milwaukee, Freud, Whirlpool"
                    required
                    style={{ width: '100%' }}
                  />
                  {/* Sample suggestions */}
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {['Schneider Electric', '3M', 'Milwaukee', 'Freud', 'Whirlpool', 'Rheem', 'Parker', 'Fluke'].map((brand) => (
                      <button
                        type="button"
                        key={brand}
                        onClick={() => setQuickMfr(brand)}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.5rem',
                          background: 'var(--ps-slate-100)',
                          border: '1px solid var(--ps-border)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--ps-text-primary)' }}>
                    Manufacturer Part Number (MPN / SKU) <span style={{ color: 'var(--ps-danger)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="ps-input"
                    value={quickMpn}
                    onChange={(e) => setQuickMpn(e.target.value)}
                    placeholder="e.g. LC1D09M7, DBDS12125G01F, WDTS7024RZ"
                    required
                    style={{ width: '100%', fontFamily: 'monospace' }}
                  />
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {[
                      { mfr: 'Schneider Electric', mpn: 'LC1D09M7', desc: 'TeSys D Contactor 3P 9A 220V AC' },
                      { mfr: 'Freud', mpn: 'DBDS12125G01F', desc: 'Diablo 12x20mm Speed Demon Metal Cut-Off Disc' },
                      { mfr: 'Whirlpool', mpn: 'WDTS7024RZ', desc: 'Built-In Dishwasher Stainless Steel 41 dBA' },
                      { mfr: '3M', mpn: '7100052341', desc: 'Cubitron II Hookit Film Disc 775L' },
                    ].map((sample) => (
                      <button
                        type="button"
                        key={sample.mpn}
                        onClick={() => {
                          setQuickMfr(sample.mfr);
                          setQuickMpn(sample.mpn);
                          setQuickDesc(sample.desc);
                        }}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.5rem',
                          background: 'rgba(37,99,235,0.06)',
                          border: '1px solid rgba(37,99,235,0.2)',
                          color: 'var(--ps-primary)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        {sample.mfr} {sample.mpn}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--ps-text-primary)' }}>
                    Part Description or Keywords (Optional)
                  </label>
                  <input
                    type="text"
                    className="ps-input"
                    value={quickDesc}
                    onChange={(e) => setQuickDesc(e.target.value)}
                    placeholder="e.g. TeSys D Contactor 3P 9A 220V AC coil"
                    style={{ width: '100%' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={quickEnriching}
                  className="ps-btn ps-btn-primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}
                >
                  {quickEnriching ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'ps-spin 1s linear infinite' }} />
                      Enriching Product from Official Sources...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Enrich Product with Sourcing Engine
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', background: 'var(--ps-danger-light)', borderRadius: '8px', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--ps-danger-dark)' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* 2. File Upload & Batch Preview */}
          {importMethod === 'file' && (
            <div>
              {!batchPreview ? (
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
                    {dragActive ? 'Drop your file here' : 'Drop product catalog (CSV / XLSX / PDF)'}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--ps-text-muted)', marginBottom: '1.25rem' }}>
                    Auto-detects columns and formats for Unihack Delivery Standards
                  </div>
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    {['CSV', 'XLSX', 'PDF', 'JSON', 'Unihack Input Format'].map((t) => (
                      <span key={t} className="ps-badge ps-badge-neutral" style={{ fontSize: '0.75rem' }}>{t}</span>
                    ))}
                  </div>
                  <button type="button" className="ps-btn ps-btn-secondary" style={{ pointerEvents: 'none' }}>
                    Browse Files
                  </button>
                </label>
              ) : (
                <div className="ps-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Batch File Column Preview</h3>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>
                        {batchPreview.filename} ({batchPreview.total_rows} total rows detected)
                      </div>
                    </div>
                    <button onClick={() => setBatchPreview(null)} className="ps-btn ps-btn-sm ps-btn-secondary">
                      <X size={14} /> Change File
                    </button>
                  </div>

                  <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--ps-slate-50)', borderRadius: '8px', border: '1px solid var(--ps-border)' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>Detected Column Mappings:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8125rem' }}>
                      <div><strong>MPN Column:</strong> <span className="ps-badge ps-badge-primary">{batchPreview.suggested_mappings.mpn || 'Mfg_Part_Num'}</span></div>
                      <div><strong>Manufacturer:</strong> <span className="ps-badge ps-badge-primary">{batchPreview.suggested_mappings.manufacturer || 'Part_Manuf'}</span></div>
                      <div><strong>Description:</strong> <span className="ps-badge ps-badge-primary">{batchPreview.suggested_mappings.description || 'Part_Desc'}</span></div>
                      <div><strong>Total Columns:</strong> <span className="ps-badge ps-badge-neutral">{batchPreview.headers.length}</span></div>
                    </div>
                  </div>

                  <button
                    onClick={handleStartBatchProcessing}
                    disabled={uploading}
                    className="ps-btn ps-btn-primary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={16} style={{ animation: 'ps-spin 1s linear infinite' }} />
                        Starting Batch Pipeline...
                      </>
                    ) : (
                      <>
                        <Layers size={16} />
                        Enrich All {batchPreview.total_rows} Products
                      </>
                    )}
                  </button>
                </div>
              )}

              {error && (
                <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', background: 'var(--ps-danger-light)', borderRadius: '8px', marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--ps-danger-dark)' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* 3. OCR Scan Zone */}
          {importMethod === 'ocr' && (
            <div className="ps-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ps-success)' }}>
                  <Camera size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Product Nameplate Optical Scan</h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>
                    Uses RapidOCR library to extract text and Gemini to structure specifications.
                  </div>
                </div>
              </div>

              <label
                className={`upload-zone${dragActive ? ' drag-active' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  minHeight: '220px',
                  cursor: 'pointer',
                  border: '2px dashed var(--ps-border-strong)',
                  borderRadius: '10px',
                }}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                htmlFor="ocr-file-input"
              >
                <input
                  id="ocr-file-input"
                  type="file"
                  accept={IMAGE_TYPES.join(',')}
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                  aria-label="Upload nameplate image"
                />
                {ocrScanning ? (
                  <Loader2 size={36} color="var(--ps-primary)" style={{ animation: 'ps-spin 1s linear infinite', marginBottom: '0.75rem' }} />
                ) : (
                  <Camera size={36} color="var(--ps-slate-400)" style={{ marginBottom: '0.75rem' }} />
                )}
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
                  {ocrScanning ? 'Running Local RapidOCR & Gemini Vision...' : 'Drop Nameplate Image (PNG, JPG, WebP)'}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>
                  Extracts voltage, amps, serial, model number, and certifications.
                </div>
              </label>
            </div>
          )}

          {/* 4. URL Import */}
          {importMethod === 'url' && (
            <div className="ps-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Manufacturer Spec URL</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginBottom: '1rem' }}>
                Enter an official manufacturer product page (e.g. se.com, 3m.com). E-commerce marketplaces are blocked.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="url"
                  className="ps-input"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://www.se.com/us/en/product/LC1D09M7"
                  style={{ flex: 1 }}
                />
                <button
                  onClick={handleUrlSubmit}
                  disabled={uploading || !urlInput}
                  className="ps-btn ps-btn-primary"
                >
                  {uploading ? <Loader2 size={16} style={{ animation: 'ps-spin 1s linear infinite' }} /> : 'Extract'}
                </button>
              </div>
            </div>
          )}

          {/* 5. Paste Text */}
          {importMethod === 'paste' && (
            <div className="ps-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Paste Technical Copy</h3>
              <textarea
                className="ps-input"
                rows={8}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste raw unformatted engineering specification text or tabular lines here..."
                style={{ width: '100%', marginBottom: '1rem', fontFamily: 'monospace', fontSize: '0.8125rem' }}
              />
              <button
                onClick={() => {
                  const blob = new Blob([pasteText], { type: 'text/plain' });
                  const file = new File([blob], 'pasted_specs.txt', { type: 'text/plain' });
                  handleFileDrop(file);
                }}
                disabled={!pasteText.trim()}
                className="ps-btn ps-btn-primary"
                style={{ width: '100%' }}
              >
                Structure Specs
              </button>
            </div>
          )}
        </div>

        {/* Right Column — Live Processing Status & Enriched Output */}
        <div>
          {/* Quick Enriched Result Card */}
          {quickEnrichedProduct && (
            <div className="ps-card" style={{ padding: '1.5rem', border: '2px solid rgba(37,99,235,0.3)', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="ps-badge ps-badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle size={12} /> 100% Enriched
                  </span>
                  <span className="ps-badge ps-badge-primary">ID #{quickEnrichedProduct.unspsc || '120441'}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--ps-primary)' }}>
                  Quality Score: {quickEnrichedProduct.dataQualityScore}%
                </div>
              </div>

              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--ps-text-primary)', marginBottom: '0.375rem' }}>
                {quickEnrichedProduct.productTitle || quickEnrichedProduct.name}
              </h2>
              <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginBottom: '1rem' }}>
                <strong>Leaf Taxonomy:</strong> {quickEnrichedProduct.classpath || quickEnrichedProduct.category}
              </div>

              {/* Descriptions Preview */}
              <div style={{ background: 'var(--ps-slate-50)', padding: '0.875rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--ps-border)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ps-text-muted)', marginBottom: '0.375rem' }}>
                  Standardized 5-Tier Descriptions Generated:
                </div>
                <div style={{ fontSize: '0.8125rem', marginBottom: '0.375rem' }}>
                  <strong>Invoice (≤40 char):</strong> <span style={{ fontFamily: 'monospace', background: 'white', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--ps-border)' }}>{quickEnrichedProduct.invoiceDesc}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', marginBottom: '0.375rem' }}>
                  <strong>Mobile (60–80 char):</strong> {quickEnrichedProduct.mobileDesc}
                </div>
                <div style={{ fontSize: '0.8125rem' }}>
                  <strong>Long Description:</strong> {quickEnrichedProduct.longDescription || quickEnrichedProduct.description}
                </div>
              </div>

              {/* Attributes Triads Preview */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ps-text-muted)', marginBottom: '0.5rem' }}>
                  Extracted Attributes ({quickEnrichedProduct.attributes.length}):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem', maxHeight: '180px', overflowY: 'auto' }}>
                  {quickEnrichedProduct.attributes.map((attr) => (
                    <div key={attr.id} style={{ fontSize: '0.8125rem', padding: '0.375rem 0.5rem', background: 'var(--ps-slate-100)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--ps-text-muted)' }}>{attr.name}:</span>
                      <strong style={{ color: 'var(--ps-text-primary)' }}>{attr.normalizedValue || attr.value} {attr.unit || ''}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link
                  href={`/app/products/${quickEnrichedProduct.id}`}
                  className="ps-btn ps-btn-primary"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}
                >
                  <Eye size={16} /> View Product Details
                </Link>
                <button
                  onClick={() => liveProductService.exportUnilogDelivery('csv', [quickEnrichedProduct.id])}
                  className="ps-btn ps-btn-secondary"
                  title="Export in 252-Column Unilog Delivery Format"
                >
                  <Download size={16} /> 252-Col CSV
                </button>
              </div>
            </div>
          )}

          {/* Quick Enrichment In-Progress Stages */}
          {quickEnriching && !quickEnrichedProduct && (
            <div className="ps-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
                <Loader2 size={20} color="var(--ps-primary)" style={{ animation: 'ps-spin 1s linear infinite' }} />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Executing UniHack Enrichment Pipeline</h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>
                    Querying official manufacturer registries & resolving leaf taxonomy
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {QUICK_ENRICH_STAGES.map((label, idx) => {
                  const isDone = quickActiveStep > idx + 1;
                  const isActive = quickActiveStep === idx + 1;
                  return (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {isDone ? (
                        <CheckCircle size={18} color="var(--ps-success)" />
                      ) : isActive ? (
                        <Loader2 size={18} color="var(--ps-primary)" style={{ animation: 'ps-spin 1s linear infinite' }} />
                      ) : (
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--ps-slate-300)' }} />
                      )}
                      <span style={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--ps-primary)' : isDone ? 'var(--ps-text-primary)' : 'var(--ps-text-muted)' }}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Background Job Card (for Batch / OCR) */}
          {activeJob && !quickEnriching && (
            <div className="ps-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Batch Ingestion Status</h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)' }}>{activeJob.filename}</div>
                </div>
                <span className={`ps-badge ${activeJob.status === 'completed' ? 'ps-badge-success' : 'ps-badge-primary'}`}>
                  {activeJob.status.toUpperCase()} ({activeJob.progress}%)
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {activeJob.stages.map((st) => (
                  <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {stageStatusIcon(st.status)}
                    <span style={{ fontSize: '0.875rem', color: st.status === 'active' ? 'var(--ps-primary)' : 'var(--ps-text-primary)' }}>
                      {st.label}
                    </span>
                  </div>
                ))}
              </div>

              {activeJob.status === 'completed' && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link href="/app/products" className="ps-btn ps-btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                    View {activeJob.productCount || 1} Enriched Products
                  </Link>
                  <button onClick={() => liveProductService.exportUnilogDelivery('csv')} className="ps-btn ps-btn-secondary">
                    <Download size={16} /> Export 252-Col CSV
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Initial Helper Card if nothing running */}
          {!quickEnrichedProduct && !quickEnriching && !activeJob && (
            <div className="ps-card" style={{ padding: '1.75rem', background: 'var(--ps-slate-50)', border: '1px dashed var(--ps-border-strong)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--ps-text-primary)' }}>
                UniHack 2026 AI Product Intelligence Ready
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--ps-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                The pipeline dynamically searches official manufacturer sites, classifies into leaf taxonomies (Taxonomy IDs), performs List of Values (LOV) validation, generates 5 standardized description tiers, and exports 252 static columns.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={16} color="var(--ps-primary)" />
                  <span>Marketplaces prohibited: Amazon, eBay, Walmart, AliExpress</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tag size={16} color="var(--ps-success)" />
                  <span>New LOV value discovery without force-fitting</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Database size={16} color="var(--ps-accent)" />
                  <span>Exact 252-column Unilog delivery format export</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
