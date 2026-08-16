'use client';

import React from 'react';
import { Search, ShieldCheck, Sparkles, Grid3X3, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CAPABILITIES = [
  {
    number: '01',
    label: 'Extract',
    icon: <Search size={24} color="#2563eb" />,
    description: 'Extract technical specifications, tables, and dimensions directly from PDFs, vendor portals, and spreadsheets using local OCR & LLMs.',
    tag: 'Multi-Modal OCR',
    tagClass: 'neu-badge-blue',
  },
  {
    number: '02',
    label: 'Validate',
    icon: <ShieldCheck size={24} color="#059669" />,
    description: 'Cross-check numbers against physical laws, catalog constraints, and detect discrepancies between competing vendor sheets.',
    tag: 'Rule & Physics Engine',
    tagClass: 'neu-badge-emerald',
  },
  {
    number: '03',
    label: 'Enrich',
    icon: <Sparkles size={24} color="#7c3aed" />,
    description: 'Fill in missing industrial taxonomy, standard UNSPSC/ETIM classifications, and SEO-ready technical summaries with explainable AI.',
    tag: 'Contextual AI',
    tagClass: 'neu-badge-purple',
  },
  {
    number: '04',
    label: 'Structure',
    icon: <Grid3X3 size={24} color="#d97706" />,
    description: 'Export cleanly normalized JSON, CSV, or direct ERP/e-commerce feeds with complete confidence scores and field provenance.',
    tag: 'Commerce Ready',
    tagClass: 'neu-badge-amber',
  },
];

export default function SolutionSection() {
  return (
    <section style={{ padding: '5rem 1.5rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Badge & Title */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="neu-badge neu-badge-blue" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} />
            <span>The ProdSync Engine</span>
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
            Four Steps to Complete Product{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Mastery
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
            An end-to-end autonomous pipeline engineered specifically for the precision
            demanded by industrial manufacturing and technical distribution.
          </p>
        </div>

        {/* 4 Neumorphic Capability Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem',
            marginBottom: '3rem',
          }}
        >
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.number}
              className="neu-card"
              style={{
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Number & Icon Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div
                    className="neu-inset-sm"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cap.icon}
                  </div>
                  <div
                    className="neu-raised-sm"
                    style={{
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.8125rem',
                      fontWeight: 800,
                      color: 'var(--neu-text-muted)',
                    }}
                  >
                    {cap.number}
                  </div>
                </div>

                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--neu-text-title)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {cap.label}
                </h3>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--neu-text-body)',
                    lineHeight: 1.6,
                    marginBottom: '1.5rem',
                  }}
                >
                  {cap.description}
                </p>
              </div>

              <div>
                <span className={`neu-badge ${cap.tagClass}`} style={{ fontSize: '0.75rem' }}>
                  {cap.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/features"
            className="neu-btn neu-btn-secondary"
            style={{
              padding: '0.75rem 1.75rem',
              fontSize: '0.9375rem',
              gap: '0.5rem',
            }}
          >
            Explore Full Architecture
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
