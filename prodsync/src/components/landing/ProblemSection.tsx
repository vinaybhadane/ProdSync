'use client';

import React from 'react';
import { FileText, Globe, Table2, Image as ImageIcon, BookOpen, FileSpreadsheet, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const SOURCES = [
  { icon: <FileText size={20} color="#2563eb" />, label: 'Technical Datasheets', desc: 'Complex nested tables, unstandardized specs, and unstructured PDF layouts.' },
  { icon: <Globe size={20} color="#00a896" />, label: 'Supplier Portals', desc: 'Disparate nomenclature, missing critical attributes, and conflicting models.' },
  { icon: <Table2 size={20} color="#f59e0b" />, label: 'Scattered Tables', desc: 'Ambiguous measurement units, missing UOMs, and mixed standards.' },
  { icon: <FileSpreadsheet size={20} color="#10b981" />, label: 'Legacy Spreadsheets', desc: 'Inconsistent columns, duplicate entries, and non-validated engineering text.' },
  { icon: <ImageIcon size={20} color="#8b5cf6" />, label: 'Nameplate Scans', desc: 'Optical noise, blurred stamping, and non-searchable dimensional schematics.' },
  { icon: <BookOpen size={20} color="#0891b2" />, label: 'Vendor Manuals', desc: 'Hundreds of pages per part number with deeply buried engineering constraints.' },
];

export default function ProblemSection() {
  return (
    <section style={{ padding: '5rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Eyebrow & Section Title */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="neu-badge neu-badge-coral" style={{ marginBottom: '0.875rem' }}>
            <AlertTriangle size={13} />
            <span>The Industrial Catalog Bottleneck</span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
              fontWeight: 800,
              color: '#0a192f',
              letterSpacing: '-0.025em',
              marginBottom: '1rem',
            }}
          >
            Product Data Is Scattered.{' '}
            <span style={{ color: '#ff6b4a' }}>Manual Ingestion Is Broken.</span>
          </h2>
          <p
            style={{
              fontSize: '1.0625rem',
              color: '#475569',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Distributors and B2B manufacturers spend weeks manually copy-pasting specs, converting fractions, 
            and rewriting descriptions for every new catalog update.
          </p>
        </div>

        {/* 6 Clean Enterprise Source Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3rem',
          }}
        >
          {SOURCES.map((s) => (
            <div
              key={s.label}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                  {s.label}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Before vs After Comparison Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.05)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Manual Chaos */}
            <div style={{ padding: '1.5rem', backgroundColor: '#fff1f2', borderRadius: '8px', border: '1px solid #fecdd3' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <XCircle size={18} color="#e11d48" />
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#9f1239', margin: 0 }}>
                  Legacy Manual Onboarding
                </h4>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem', color: '#4c0519' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <strong>✕</strong> 3–5 business days spent manually transcribing each 100 SKUs
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <strong>✕</strong> Frequent metric/imperial unit errors causing returns and customer disputes
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <strong>✕</strong> Zero verifiable audit trail or provenance to the source specification
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <strong>✕</strong> Inconsistent descriptions that fail marketplace and ERP length limits
                </li>
              </ul>
            </div>

            {/* ProdSync Autonomous Intelligence */}
            <div style={{ padding: '1.5rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={18} color="#059669" />
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#065f46', margin: 0 }}>
                  ProdSync Enterprise Intelligence
                </h4>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem', color: '#064e3b' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="#059669" /> Instant leaf taxonomy classification across 10,000+ categories
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="#059669" /> Deterministic List of Values (LOV) validation with New Value discovery
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="#059669" /> Field-level provenance attaching exact URLs and PDF page coordinates
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="#059669" /> Automated 5-tier Unilog descriptions ready for 252-column export
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
