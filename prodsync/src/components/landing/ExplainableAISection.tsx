'use client';

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Brain, FileText, ChevronDown, ChevronRight } from 'lucide-react';

const SAMPLE_ATTRS = [
  {
    name: 'Operating Temperature',
    value: '-20°C to 80°C',
    status: 'verified',
    confidence: 94,
    source: 'Technical Datasheet',
    sourceType: 'pdf',
    aiReason: "Value extracted directly from the manufacturer's technical specification section, page 4, section 3.2.",
  },
  {
    name: 'Weight',
    value: '18.5 kg',
    status: 'ai_suggested',
    confidence: 83,
    source: 'Similar Product Specs',
    sourceType: 'catalog',
    aiReason: 'Value inferred from related product specifications in the HP-4000 series. Similar models range from 17.8–19.2 kg.',
  },
  {
    name: 'Operating Pressure',
    value: '10 bar / 12 bar',
    status: 'needs_review',
    confidence: 52,
    source: 'Multiple Sources',
    sourceType: 'pdf',
    aiReason: 'Conflict detected between Source A (10 bar, Technical Datasheet) and Source B (12 bar, Product Catalog). Manual review required.',
  },
];

const statusConfig = {
  verified: { label: 'Verified', color: 'var(--ps-success)', bg: 'var(--ps-success-light)', icon: <CheckCircle size={14} /> },
  ai_suggested: { label: 'AI Suggested', color: 'var(--ps-ai)', bg: 'var(--ps-ai-light)', icon: <Brain size={14} /> },
  needs_review: { label: 'Needs Review', color: 'var(--ps-warning-dark)', bg: 'var(--ps-warning-light)', icon: <AlertTriangle size={14} /> },
};

export default function ExplainableAISection() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <section
      style={{
        padding: '6rem 1.5rem',
        background: 'var(--ps-slate-900)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section label */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--ps-primary-light)',
              background: 'rgba(59,130,246,0.15)',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
            }}
          >
            Explainable AI
          </span>
        </div>

        <h2
          className="text-h1"
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
            color: 'white',
          }}
        >
          AI That{' '}
          <span style={{ color: 'var(--ps-primary-light)' }}>Explains Its Decisions</span>
        </h2>

        <p
          className="text-body"
          style={{
            textAlign: 'center',
            color: 'var(--ps-slate-400)',
            maxWidth: '560px',
            margin: '0 auto 3.5rem',
          }}
        >
          Every AI decision comes with a clear, user-facing explanation. No black boxes —
          every value shows its source, confidence, and reasoning.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'start',
          }}
          className="xai-grid"
        >
          {/* Left — attribute cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {SAMPLE_ATTRS.map((attr, i) => {
              const status = statusConfig[attr.status as keyof typeof statusConfig];
              const isExpanded = expanded === i;

              return (
                <div
                  key={attr.name}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease',
                    borderColor: isExpanded ? 'rgba(59,130,246,0.4)' : undefined,
                  }}
                >
                  <button
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    onClick={() => setExpanded(isExpanded ? null : i)}
                    aria-expanded={isExpanded}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>
                        {attr.name}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>
                        {attr.value}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.25rem 0.625rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: `${status.color}20`,
                          color: status.color,
                        }}
                      >
                        {status.icon}
                        {status.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ps-slate-400)', fontWeight: 600 }}>
                        {attr.confidence}% confident
                      </div>
                    </div>

                    <div style={{ color: 'var(--ps-slate-500)', flexShrink: 0 }}>
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div
                      style={{
                        padding: '1rem 1.25rem',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        animation: 'ps-fade-in 0.2s ease',
                      }}
                    >
                      {/* Source */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <FileText size={14} color="var(--ps-slate-500)" style={{ marginTop: '1px', flexShrink: 0 }} />
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--ps-slate-500)', marginRight: '0.5rem' }}>Source:</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ps-slate-300)' }}>
                            {attr.source}
                          </span>
                        </div>
                      </div>

                      {/* AI Reasoning */}
                      <div
                        style={{
                          background: 'rgba(139,92,246,0.08)',
                          border: '1px solid rgba(139,92,246,0.2)',
                          borderRadius: '8px',
                          padding: '0.75rem',
                          display: 'flex',
                          gap: '0.5rem',
                        }}
                      >
                        <Brain size={14} color="var(--ps-ai)" style={{ marginTop: '1px', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--ps-ai)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            AI Reasoning
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--ps-slate-300)', lineHeight: '1.5' }}>
                            &ldquo;{attr.aiReason}&rdquo;
                          </div>
                        </div>
                      </div>

                      {/* Confidence bar */}
                      <div style={{ marginTop: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--ps-slate-500)', marginBottom: '0.375rem' }}>
                          <span>Confidence</span>
                          <span style={{ fontWeight: 600, color: status.color }}>{attr.confidence}%</span>
                        </div>
                        <div className="ps-progress" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div
                            className="ps-progress-bar"
                            style={{
                              width: `${attr.confidence}%`,
                              background: status.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right — explainer */}
          <div>
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '1.5rem',
              }}
            >
              <h3 className="text-h3" style={{ color: 'white', marginBottom: '1.5rem' }}>
                Every decision is transparent
              </h3>

              {[
                {
                  indicator: '●',
                  color: 'var(--ps-success)',
                  title: 'Verified',
                  desc: 'Matched and confirmed across multiple source documents.',
                },
                {
                  indicator: '●',
                  color: 'var(--ps-ai)',
                  title: 'AI Suggested',
                  desc: 'AI-generated value based on related data — pending human review.',
                },
                {
                  indicator: '●',
                  color: 'var(--ps-warning)',
                  title: 'Needs Review',
                  desc: 'Conflicting values detected. Human decision required.',
                },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: item.color,
                      marginTop: '5px',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--ps-slate-400)', lineHeight: 1.5 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: 'rgba(37,99,235,0.1)',
                border: '1px solid rgba(37,99,235,0.25)',
                borderRadius: '12px',
                padding: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.875rem', color: 'var(--ps-slate-300)', lineHeight: 1.6 }}>
                <strong style={{ color: 'white' }}>Human-in-the-Loop by design.</strong>{' '}
                Important product data always requires human approval before becoming trusted.
                AI suggests — you decide.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .xai-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
