'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, CheckCircle, Zap, Shield, TrendingUp } from 'lucide-react';

const PIPELINE_STEPS = [
  { label: 'Unstructured Information', icon: '📄', color: '#64748b', desc: 'PDFs, CSVs, URLs, Datasheets' },
  { label: 'AI Extraction', icon: null, color: '#2563eb', desc: 'Attribute detection & parsing', ai: true },
  { label: 'Validation', icon: null, color: '#10b981', desc: 'Conflict & accuracy checks', ai: true },
  { label: 'Enrichment', icon: null, color: '#8b5cf6', desc: 'Missing data completion', ai: true },
  { label: 'Commerce Ready', icon: '✓', color: '#059669', desc: 'Structured product record', final: true },
];

const STATS = [
  { value: '94%', label: 'Avg. Data Quality Score' },
  { value: '10×', label: 'Faster than Manual Entry' },
  { value: '12K+', label: 'Products Processed' },
];

export default function HeroSection() {
  return (
    <section
      className="hero-gradient"
      style={{
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '5rem',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Left — content */}
          <div style={{ animation: 'ps-fade-in 0.5s ease forwards' }}>
            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(37,99,235,0.08)',
                border: '1px solid rgba(37,99,235,0.2)',
                borderRadius: '20px',
                padding: '0.3125rem 0.875rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--ps-primary)',
                marginBottom: '1.5rem',
              }}
            >
              <Zap size={13} />
              AI-Powered Product Intelligence
            </div>

            <h1
              className="text-display"
              style={{ marginBottom: '1.5rem', color: 'var(--ps-text-primary)' }}
            >
              Transform Product Data Into Product{' '}
              <span style={{ color: 'var(--ps-primary)' }}>Intelligence</span>
            </h1>

            <p
              className="text-body"
              style={{
                color: 'var(--ps-text-secondary)',
                marginBottom: '2rem',
                fontSize: '1.0625rem',
                maxWidth: '480px',
              }}
            >
              ProdSync uses AI to transform scattered industrial product information into
              structured, validated, enriched, and commerce-ready data — at scale.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link
                href="/register"
                className="ps-btn ps-btn-primary ps-btn-lg"
                style={{ gap: '0.5rem' }}
              >
                Start Building Your Catalog
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/how-it-works"
                className="ps-btn ps-btn-secondary ps-btn-lg"
                style={{ gap: '0.5rem' }}
              >
                <Play size={16} fill="currentColor" />
                See How It Works
              </Link>
            </div>

            {/* Social proof / stats */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: 'var(--ps-primary)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — pipeline visualization */}
          <div
            style={{
              animation: 'ps-slide-in-right 0.6s ease forwards',
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
            }}
          >
            {/* Dashboard preview card */}
            <div
              className="ps-card"
              style={{
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Mini dashboard header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ps-text-primary)' }}>
                    Product Intelligence Pipeline
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)' }}>
                    HP-4500 Technical Datasheet
                  </div>
                </div>
                <span className="ps-badge ps-badge-ai" style={{ fontSize: '0.6875rem' }}>
                  AI Processing
                </span>
              </div>

              {/* Pipeline stages */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {PIPELINE_STEPS.map((step, i) => (
                  <React.Fragment key={step.label}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        background: i === 2 ? 'var(--ps-primary-50)' : 'transparent',
                        border: i === 2 ? '1px solid var(--ps-primary-100)' : '1px solid transparent',
                        animation: `ps-pipeline-flow ${0.3 + i * 0.1}s ease ${i * 0.08}s both`,
                      }}
                    >
                      {/* Status indicator */}
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: i < 2 ? 'var(--ps-success-light)' : i === 2 ? 'var(--ps-primary-100)' : 'var(--ps-slate-100)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {i < 2 ? (
                          <CheckCircle size={16} color="var(--ps-success)" />
                        ) : i === 2 ? (
                          <div
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: 'var(--ps-primary)',
                              animation: 'ps-pulse-dot 1.2s ease-in-out infinite',
                            }}
                          />
                        ) : i === PIPELINE_STEPS.length - 1 ? (
                          <Shield size={16} color="var(--ps-success)" />
                        ) : (
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: 'var(--ps-slate-300)',
                            }}
                          />
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: i === 2 ? 'var(--ps-primary)' : i < 2 ? 'var(--ps-text-primary)' : 'var(--ps-text-muted)',
                          }}
                        >
                          {step.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)' }}>
                          {step.desc}
                        </div>
                      </div>

                      {step.ai && (
                        <span className="ps-badge ps-badge-ai" style={{ fontSize: '0.6875rem' }}>
                          AI
                        </span>
                      )}
                      {step.final && i === PIPELINE_STEPS.length - 1 && (
                        <span className="ps-badge ps-badge-verified" style={{ fontSize: '0.6875rem' }}>
                          Ready
                        </span>
                      )}
                    </div>

                    {/* Connector line */}
                    {i < PIPELINE_STEPS.length - 1 && (
                      <div
                        style={{
                          width: '2px',
                          height: '12px',
                          background: i < 2 ? 'var(--ps-success)' : 'var(--ps-slate-200)',
                          marginLeft: 'calc(1rem + 15px)',
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Quality score footer */}
              <div
                style={{
                  marginTop: '1.25rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--ps-border)',
                  display: 'flex',
                  gap: '1.5rem',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ps-success)' }}>94%</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--ps-text-muted)', fontWeight: 500 }}>Data Quality</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ps-primary)' }}>96%</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--ps-text-muted)', fontWeight: 500 }}>AI Confidence</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ps-ai)' }}>7</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--ps-text-muted)', fontWeight: 500 }}>Attrs Verified</div>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '1rem',
                flexWrap: 'wrap',
              }}
            >
              {[
                { icon: <Shield size={13} />, label: 'Enterprise Security' },
                { icon: <TrendingUp size={13} />, label: 'Explainable AI' },
                { icon: <CheckCircle size={13} />, label: 'Human-in-the-Loop' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.375rem 0.75rem',
                    background: 'white',
                    border: '1px solid var(--ps-border)',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'var(--ps-text-secondary)',
                  }}
                >
                  {item.icon}
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
