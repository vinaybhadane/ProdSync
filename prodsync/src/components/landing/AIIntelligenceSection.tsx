'use client';

import React from 'react';
import { CheckCircle, Loader2, Circle, Brain, ArrowDown } from 'lucide-react';

const STAGES = [
  { label: 'Document Received', status: 'done', detail: 'HP-4500_datasheet.pdf (2.4 MB)' },
  { label: 'Text Extraction', status: 'done', detail: '847 text blocks extracted' },
  { label: 'Product Detection', status: 'done', detail: '1 product identified' },
  { label: 'Attribute Extraction', status: 'done', detail: '14 attributes detected' },
  { label: 'Normalization', status: 'done', detail: 'Units and formats standardized' },
  { label: 'Validation Engine', status: 'active', detail: 'Cross-checking 3 sources...' },
  { label: 'AI Enrichment', status: 'pending', detail: 'Pending validation completion' },
  { label: 'Final Structuring', status: 'pending', detail: 'Awaiting enrichment results' },
];

export default function AIIntelligenceSection() {
  return (
    <section
      style={{
        padding: '6rem 1.5rem',
        background: 'var(--ps-bg)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
          }}
          className="ai-intel-grid"
        >
          {/* Left — content */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--ps-ai)',
                  background: 'var(--ps-ai-light)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                }}
              >
                AI Intelligence
              </span>
            </div>

            <h2
              className="text-h1"
              style={{ marginBottom: '1.25rem', color: 'var(--ps-text-primary)' }}
            >
              A Multi-Stage AI Pipeline Built for{' '}
              <span style={{ color: 'var(--ps-ai)' }}>Industrial Complexity</span>
            </h2>

            <p
              className="text-body"
              style={{ color: 'var(--ps-text-secondary)', marginBottom: '2rem' }}
            >
              Every product document goes through a sophisticated, transparent AI pipeline —
              from raw extraction to structured, validated product intelligence.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { title: 'Multi-source extraction', desc: 'Processes PDFs, URLs, CSVs, images, and more simultaneously.' },
                { title: 'Cross-source validation', desc: 'Detects conflicts and inconsistencies across different documents.' },
                { title: 'Contextual enrichment', desc: 'Fills gaps using AI trained on technical specifications.' },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="var(--ps-success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ps-text-primary)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--ps-text-muted)' }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — processing visualization */}
          <div className="ps-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--ps-ai-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--ps-ai)',
                }}
              >
                <Brain size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--ps-text-primary)' }}>
                  AI Processing Pipeline
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)' }}>
                  HP-4500 Technical Datasheet
                </div>
              </div>
              <span className="ps-badge ps-badge-ai" style={{ marginLeft: 'auto', fontSize: '0.6875rem' }}>
                Processing
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {STAGES.map((stage, i) => (
                <div
                  key={stage.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 0.75rem',
                    borderRadius: '8px',
                    background: stage.status === 'active' ? 'var(--ps-ai-light)' : 'transparent',
                    border: stage.status === 'active' ? '1px solid rgba(139,92,246,0.2)' : '1px solid transparent',
                    animation: `ps-fade-in 0.3s ease ${i * 0.05}s both`,
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    {stage.status === 'done' && <CheckCircle size={16} color="var(--ps-success)" />}
                    {stage.status === 'active' && (
                      <Loader2 size={16} color="var(--ps-ai)" style={{ animation: 'ps-spin 1s linear infinite' }} />
                    )}
                    {stage.status === 'pending' && <Circle size={16} color="var(--ps-slate-300)" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: stage.status === 'active' ? 600 : 500,
                        color: stage.status === 'done'
                          ? 'var(--ps-text-primary)'
                          : stage.status === 'active'
                          ? 'var(--ps-ai)'
                          : 'var(--ps-text-muted)',
                      }}
                    >
                      {stage.label}
                    </div>
                    {stage.status !== 'pending' && (
                      <div style={{ fontSize: '0.6875rem', color: 'var(--ps-text-muted)' }}>
                        {stage.detail}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--ps-border)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: 'var(--ps-text-muted)',
                  marginBottom: '0.375rem',
                }}
              >
                <span>Processing progress</span>
                <span style={{ fontWeight: 600, color: 'var(--ps-ai)' }}>62%</span>
              </div>
              <div className="ps-progress">
                <div
                  className="ps-progress-bar"
                  style={{ width: '62%', background: 'var(--ps-ai)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .ai-intel-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
