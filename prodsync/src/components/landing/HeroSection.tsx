'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Layers, FileText, Database, ArrowUpRight, Cpu } from 'lucide-react';

const STATS = [
  { value: '100%', label: 'Dynamic Real AI', sub: 'Zero static mocks' },
  { value: '252', label: 'Delivery Columns', sub: 'Unilog format standard' },
  { value: '5-Tier', label: 'Standard Descriptions', sub: 'Mobile, Invoice, Long' },
  { value: '< 1.5s', label: 'Processing Speed', sub: 'Live Sourcing & LOV' },
];

const SAMPLE_SPECS = [
  { label: 'Voltage Rating', value: '440 V', status: 'verified', statusText: 'LOV Verified' },
  { label: 'Amperage Rating', value: '9 A', status: 'verified', statusText: 'LOV Verified' },
  { label: 'Mounting Type', value: 'DIN Rail / Panel', status: 'new_value', statusText: 'New LOV Value' },
  { label: 'Number of Poles', value: '3', status: 'verified', statusText: 'LOV Verified' },
];

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<'specs' | 'descriptions' | 'provenance'>('specs');

  return (
    <section
      style={{
        paddingTop: '120px',
        paddingBottom: '5rem',
        backgroundColor: '#ffffff',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: '3.5rem',
            alignItems: 'center',
          }}
          className="neu-hero-grid"
        >
          {/* Left Column — Value Proposition */}
          <div>
            {/* Eyebrow Pill */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div
                className="neu-badge neu-badge-teal"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                }}
              >
                <span className="neu-dot neu-dot-pulse" style={{ backgroundColor: '#00a896' }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.03em' }}>
                  Enterprise Product Intelligence Engine
                </span>
              </div>
            </div>

            {/* H1 Heading */}
            <h1
              style={{
                fontSize: 'clamp(2.25rem, 4.2vw, 3.35rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#0a192f',
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
              }}
            >
              Transform Scattered Product Data into{' '}
              <span style={{ color: '#2563eb' }}>Validated, Commerce-Ready</span> Catalogs
            </h1>

            {/* Subheading */}
            <p
              style={{
                fontSize: '1.0625rem',
                lineHeight: 1.65,
                color: '#475569',
                marginBottom: '2rem',
                maxWidth: '540px',
              }}
            >
              ProdSync ingests technical datasheets, vendor PDFs, and unformatted spreadsheets into standardized 
              leaf-level taxonomies, LOV-validated specifications, 5-tier descriptions, and 252-column export formats.
            </p>

            {/* Dual CTAs */}
            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link
                href="/register"
                className="neu-btn neu-btn-primary"
                style={{
                  padding: '0.875rem 1.625rem',
                  fontSize: '0.9375rem',
                  borderRadius: '6px',
                  gap: '0.5rem',
                }}
              >
                Start Free Trial
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/app/import"
                className="neu-btn neu-btn-secondary"
                style={{
                  padding: '0.875rem 1.5rem',
                  fontSize: '0.9375rem',
                  borderRadius: '6px',
                  gap: '0.5rem',
                }}
              >
                Try Quick MPN Enrichment
                <ArrowUpRight size={16} color="#64748b" />
              </Link>
            </div>

            {/* Trust Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                paddingTop: '1.75rem',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              {STATS.map((stat, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0a192f', letterSpacing: '-0.02em' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', marginTop: '2px' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Live Technical Product Deck Visual */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 12px 30px -5px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.04)',
              overflow: 'hidden',
            }}
          >
            {/* Window Header */}
            <div
              style={{
                padding: '0.75rem 1.25rem',
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f87171' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#fbbf24' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#34d399' }} />
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                  Live Enrichment Pipeline · Schneider Electric LC1D09M7
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#059669',
                  backgroundColor: '#d1fae5',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                ● 252-Col Ready
              </span>
            </div>

            {/* Product Meta Banner */}
            <div style={{ padding: '1.25rem 1.25rem 0.75rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Taxonomy ID #120441 · Electrical & Industrial Controls
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>
                    TeSys D Magnetic Contactor 3P 440V 9A
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Classpath: Electrical &gt; Industrial Controls &gt; Contactors &gt; Magnetic Contactors
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>94%</div>
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 600 }}>Quality Score</div>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  onClick={() => setActiveTab('specs')}
                  style={{
                    padding: '0.375rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: activeTab === 'specs' ? '#2563eb' : '#f1f5f9',
                    color: activeTab === 'specs' ? '#ffffff' : '#475569',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Extracted Specs (4)
                </button>
                <button
                  onClick={() => setActiveTab('descriptions')}
                  style={{
                    padding: '0.375rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: activeTab === 'descriptions' ? '#2563eb' : '#f1f5f9',
                    color: activeTab === 'descriptions' ? '#ffffff' : '#475569',
                    transition: 'all 0.15s ease',
                  }}
                >
                  5-Tier Descriptions
                </button>
                <button
                  onClick={() => setActiveTab('provenance')}
                  style={{
                    padding: '0.375rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: activeTab === 'provenance' ? '#2563eb' : '#f1f5f9',
                    color: activeTab === 'provenance' ? '#ffffff' : '#475569',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Provenance & Sourcing
                </button>
              </div>
            </div>

            {/* Tab View Content */}
            <div style={{ padding: '1.25rem', minHeight: '220px', backgroundColor: '#fafbfc' }}>
              {activeTab === 'specs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {SAMPLE_SPECS.map((spec, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: '#334155' }}>{spec.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{spec.value}</span>
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: spec.status === 'verified' ? '#f0fdf4' : '#eff6ff',
                            color: spec.status === 'verified' ? '#059669' : '#2563eb',
                            border: `1px solid ${spec.status === 'verified' ? '#bbf7d0' : '#bfdbfe'}`,
                          }}
                        >
                          {spec.statusText}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'descriptions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '0.625rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>
                      <span>INVOICE / ERP DESCRIPTION</span>
                      <span>27 / 40 CHARS (ALL CAPS)</span>
                    </div>
                    <code style={{ fontSize: '0.75rem', color: '#0f172a', fontWeight: 600 }}>MAGNETIC CONTACTOR 440V 9A</code>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '0.625rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>
                      <span>MOBILE COMMERCE DESCRIPTION</span>
                      <span>79 / 80 CHARS</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#334155' }}>
                      Schneider Electric TeSys D Magnetic Contactor, 3P, 440V, 9A, 220V AC Coil
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'provenance' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
                  <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                    <div style={{ fontWeight: 700, color: '#059669' }}>Priority 1: Official Manufacturer Website</div>
                    <div style={{ color: '#64748b' }}>https://www.se.com/us/en/product/LC1D09M7 · Conf: 98%</div>
                  </div>
                  <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                    <div style={{ fontWeight: 700, color: '#2563eb' }}>Technical Datasheet PDF (DocIntel OCR)</div>
                    <div style={{ color: '#64748b' }}>Page 4, Table 3.1 &quot;Electrical Characteristics&quot; · 0 Conflicts</div>
                  </div>
                </div>
              )}
            </div>

            {/* Window Footer Actions */}
            <div
              style={{
                padding: '0.75rem 1.25rem',
                backgroundColor: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Ready to export in CSV, XLSX, or JSON format
              </span>
              <Link
                href="/app/import"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#2563eb',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Test in Workspace &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
