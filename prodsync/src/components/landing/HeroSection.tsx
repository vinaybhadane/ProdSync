'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, CheckCircle, ShieldCheck, Sparkles, Layers, FileText, ChevronRight } from 'lucide-react';

const STATS = [
  { value: '94%', label: 'Avg Quality Score', icon: <CheckCircle size={15} color="#10b981" /> },
  { value: '10×', label: 'Faster Processing', icon: <Zap size={15} color="#2563eb" /> },
  { value: '12K+', label: 'Products Synced', icon: <Layers size={15} color="#8b5cf6" /> },
];

const PIPELINE_NODES = [
  { step: '01', title: 'Raw Input', desc: 'PDF / Datasheets', status: 'done', color: '#64748b' },
  { step: '02', title: 'AI Extraction', desc: '18 Specs Detected', status: 'done', color: '#2563eb' },
  { step: '03', title: 'Validation', desc: '0 Conflicts', status: 'active', color: '#10b981' },
  { step: '04', title: 'Enrichment', desc: '98% Complete', status: 'pending', color: '#8b5cf6' },
];

export default function HeroSection() {
  const [activeStep, setActiveStep] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev % 4) + 1);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        paddingTop: '130px',
        paddingBottom: '5rem',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '3.5rem',
            alignItems: 'center',
          }}
          className="neu-hero-grid"
        >
          {/* Left Column — Hero Text & CTAs */}
          <div>
            {/* Pill Badge */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="neu-badge neu-badge-blue">
                <span className="neu-dot neu-dot-pulse" />
                <span>AI-Powered Product Intelligence</span>
              </div>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: 'var(--neu-text-title)',
                letterSpacing: '-0.03em',
                marginBottom: '1.5rem',
              }}
            >
              Transform Product Data Into Product{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Intelligence
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.6,
                color: 'var(--neu-text-body)',
                marginBottom: '2rem',
                maxWidth: '520px',
              }}
            >
              ProdSync extracts, normalizes, and validates complex technical specs from PDFs,
              datasheets, and spreadsheets into clean, commerce-ready catalogs.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link
                href="/register"
                className="neu-btn neu-btn-primary"
                style={{
                  padding: '0.875rem 1.75rem',
                  fontSize: '1rem',
                  gap: '0.5rem',
                }}
              >
                Start Building Catalog
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/how-it-works"
                className="neu-btn neu-btn-secondary"
                style={{
                  padding: '0.875rem 1.5rem',
                  fontSize: '1rem',
                }}
              >
                See How It Works
              </Link>
            </div>

            {/* Stats Trio (Neumorphic Cards) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
              }}
            >
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="neu-card"
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {s.icon}
                    <div
                      style={{
                        fontSize: '1.375rem',
                        fontWeight: 800,
                        color: 'var(--neu-text-title)',
                      }}
                    >
                      {s.value}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--neu-text-muted)',
                      lineHeight: 1.2,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Tactile Neumorphic Live Demo Console */}
          <div>
            <div
              className="neu-raised-lg"
              style={{
                padding: '1.75rem',
                position: 'relative',
              }}
            >
              {/* Header Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                  paddingBottom: '0.875rem',
                  borderBottom: '1px solid rgba(255,255,255,0.7)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="neu-dot neu-dot-active" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--neu-text-title)' }}>
                    Live AI Pipeline Monitor
                  </span>
                </div>
                <div className="neu-badge neu-badge-emerald" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
                  Ready
                </div>
              </div>

              {/* Sample Product Well */}
              <div
                className="neu-inset"
                style={{
                  padding: '1rem 1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} color="#2563eb" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--neu-text-title)' }}>
                      Siemens_VFD_G120X_Spec.pdf
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--neu-text-muted)', fontWeight: 500 }}>
                    1.8 MB
                  </span>
                </div>

                {/* Extracted Key-Values Preview */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.5rem',
                    fontSize: '0.78125rem',
                  }}
                >
                  <div style={{ background: 'rgba(255,255,255,0.5)', padding: '0.4rem 0.6rem', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--neu-text-muted)' }}>Power: </span>
                    <strong style={{ color: 'var(--neu-text-title)' }}>15 kW (20 HP)</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.5)', padding: '0.4rem 0.6rem', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--neu-text-muted)' }}>Voltage: </span>
                    <strong style={{ color: 'var(--neu-text-title)' }}>380-480 V</strong>
                  </div>
                </div>
              </div>

              {/* 4 Pipeline Step Stages */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {PIPELINE_NODES.map((node, i) => {
                  const nodeIndex = i + 1;
                  const isCurrent = activeStep === nodeIndex;
                  const isPast = activeStep > nodeIndex;

                  return (
                    <div
                      key={node.step}
                      className={isCurrent ? 'neu-inset' : 'neu-card'}
                      style={{
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div
                          className="neu-raised-sm"
                          style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: isCurrent ? 'var(--neu-primary)' : 'var(--neu-text-muted)',
                            background: isCurrent ? '#ffffff' : 'var(--neu-bg)',
                          }}
                        >
                          {node.step}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--neu-text-title)' }}>
                            {node.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--neu-text-muted)' }}>
                            {node.desc}
                          </div>
                        </div>
                      </div>

                      <div>
                        {isCurrent ? (
                          <div className="neu-badge neu-badge-blue" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                            <span className="neu-dot neu-dot-pulse" style={{ width: '6px', height: '6px' }} />
                            Running
                          </div>
                        ) : isPast ? (
                          <div className="neu-badge neu-badge-emerald" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                            <CheckCircle size={10} />
                            Passed
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.75rem', color: 'var(--neu-text-muted)', fontWeight: 500 }}>
                            Queued
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Accuracy Ribbon */}
              <div
                style={{
                  marginTop: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.875rem',
                  borderTop: '1px solid rgba(255,255,255,0.7)',
                  fontSize: '0.8125rem',
                }}
              >
                <span style={{ color: 'var(--neu-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={16} color="#10b981" />
                  Deterministic Validation
                </span>
                <strong style={{ color: 'var(--neu-primary)' }}>100% Provenance Traceable</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
