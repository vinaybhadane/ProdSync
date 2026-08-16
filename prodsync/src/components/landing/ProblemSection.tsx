'use client';

import React from 'react';
import { FileText, Globe, Table2, Image as ImageIcon, BookOpen, FileSpreadsheet, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

const SOURCES = [
  { icon: <FileText size={22} color="#dc2626" />, label: 'PDF Datasheets', desc: 'Unstructured layout & nested tables' },
  { icon: <Globe size={22} color="#2563eb" />, label: 'Supplier Portals', desc: 'Inconsistent naming & missing fields' },
  { icon: <Table2 size={22} color="#d97706" />, label: 'Scattered Tables', desc: 'Ambiguous units & mixed standards' },
  { icon: <FileSpreadsheet size={22} color="#059669" />, label: 'Legacy Excel Files', desc: 'Duplicate rows & typos' },
  { icon: <ImageIcon size={22} color="#7c3aed" />, label: 'Image Schematics', desc: 'Non-searchable dimensional blueprints' },
  { icon: <BookOpen size={22} color="#0891b2" />, label: 'User Manuals', desc: 'Hundreds of pages per part number' },
];

export default function ProblemSection() {
  return (
    <section style={{ padding: '5rem 1.5rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Badge & Title */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="neu-badge neu-badge-rose" style={{ marginBottom: '1rem' }}>
            <AlertTriangle size={14} />
            <span>The Catalog Challenge</span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              color: 'var(--neu-text-title)',
              letterSpacing: '-0.025em',
              marginBottom: '1rem',
            }}
          >
            Product Data Is Scattered.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Intelligence Isn&apos;t.
            </span>
          </h2>
          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--neu-text-body)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Engineering and commerce teams waste 40%+ of catalog onboarding time manually
            cleaning, retyping, and resolving conflicting manufacturer specifications.
          </p>
        </div>

        {/* 6 Neumorphic Source Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3.5rem',
          }}
        >
          {SOURCES.map((s) => (
            <div
              key={s.label}
              className="neu-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
              }}
            >
              <div
                className="neu-inset-sm"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--neu-text-title)', marginBottom: '0.25rem' }}>
                  {s.label}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--neu-text-muted)', lineHeight: 1.4 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Before vs After Neumorphic Comparison Banner */}
        <div
          className="neu-raised-lg"
          style={{
            padding: '2rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
            }}
            className="neu-two-col"
          >
            {/* Manual Chaos */}
            <div className="neu-inset" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="neu-dot" style={{ background: '#ef4444' }} />
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#dc2626' }}>
                  Manual & Traditional Ingestion
                </h4>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--neu-text-body)' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#ef4444' }}>✕</span> 3-5 days of manual retyping per 100 SKUs
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#ef4444' }}>✕</span> Unnoticed metric/imperial unit mix-ups
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#ef4444' }}>✕</span> Zero traceability to original manufacturer pages
                </li>
              </ul>
            </div>

            {/* ProdSync Neumorphic Intelligence */}
            <div className="neu-card" style={{ padding: '1.5rem', background: 'var(--neu-bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="neu-dot neu-dot-active" />
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#059669' }}>
                  ProdSync Autonomous Intelligence
                </h4>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--neu-text-body)' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#10b981" /> Instant OCR & multi-source attribute extraction
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#10b981" /> Automated ISO/DIN unit standardization
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#10b981" /> Exact page & bounding box provenance audit trail
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
