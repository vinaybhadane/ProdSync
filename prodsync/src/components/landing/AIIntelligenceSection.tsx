'use client';

import React, { useState } from 'react';
import { Brain, CheckCircle2, Loader2, Cpu, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';

const STAGES = [
  { label: 'Document Ingestion', status: 'done', detail: 'RapidOCR & PDF Vectorization', time: '140ms' },
  { label: 'Product Entity Detection', status: 'done', detail: 'Identified Series & Model SKU', time: '210ms' },
  { label: 'Attribute Extraction', status: 'done', detail: '18 Technical Parameters detected', time: '380ms' },
  { label: 'Unit & Text Normalization', status: 'done', detail: 'Unified DIN / ISO / ANSI standards', time: '85ms' },
  { label: 'Deterministic Validation', status: 'active', detail: 'Cross-checking 3 vendor sources...', time: 'Live' },
  { label: 'Confidence Quality Scorer', status: 'pending', detail: 'Mathematical 0-100% calibration', time: 'Queued' },
  { label: 'Field-Level Provenance', status: 'pending', detail: 'Bounding-box coordinate tagging', time: 'Queued' },
];

export default function AIIntelligenceSection() {
  const [selectedStage, setSelectedStage] = useState(4);

  return (
    <section style={{ padding: '5rem 1.5rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr',
            gap: '3.5rem',
            alignItems: 'center',
          }}
          className="neu-hero-grid"
        >
          {/* Left Column — Pipeline Story */}
          <div>
            <div className="neu-badge neu-badge-purple" style={{ marginBottom: '1rem' }}>
              <Brain size={14} />
              <span>Multi-Stage Intelligence</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                fontWeight: 800,
                color: 'var(--neu-text-title)',
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                marginBottom: '1.25rem',
              }}
            >
              Built for Industrial Complexity, Not Generic Text
            </h2>

            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--neu-text-body)',
                lineHeight: 1.6,
                marginBottom: '2rem',
              }}
            >
              Unlike generic chatbots that hallucinate numbers, ProdSync pairs Azure OpenAI
              with local ONNX OCR engines and mathematical validation rules to guarantee
              engineering-grade data integrity.
            </p>

            {/* 3 Pillars in tactile cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div className="neu-card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="neu-inset-sm" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Cpu size={20} color="#7c3aed" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--neu-text-title)', marginBottom: '0.15rem' }}>
                    Dual OCR & LLM Hybrid Stack
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--neu-text-muted)', margin: 0 }}>
                    Local RapidOCR for fast tabular extraction + GPT-4o for contextual entity disambiguation.
                  </p>
                </div>
              </div>

              <div className="neu-card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="neu-inset-sm" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={20} color="#059669" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--neu-text-title)', marginBottom: '0.15rem' }}>
                    Zero Hallucination Guardrails
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--neu-text-muted)', margin: 0 }}>
                    Physical constraints (temperatures, voltages, dimensions) validated deterministically.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/register"
              className="neu-btn neu-btn-primary"
              style={{
                padding: '0.75rem 1.75rem',
                fontSize: '0.9375rem',
                gap: '0.5rem',
              }}
            >
              Test Your Datasheets
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right Column — Tactile Multi-Stage Processing Deck */}
          <div>
            <div className="neu-raised-lg" style={{ padding: '2rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                  paddingBottom: '0.875rem',
                  borderBottom: '1px solid rgba(255,255,255,0.8)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={18} color="#7c3aed" />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--neu-text-title)' }}>
                    Autonomous Execution Deck
                  </span>
                </div>
                <div className="neu-badge neu-badge-purple" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                  Pipeline Active
                </div>
              </div>

              {/* Interactive Stage Flow */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {STAGES.map((stage, idx) => {
                  const isActive = idx === selectedStage;
                  const isDone = stage.status === 'done';

                  return (
                    <div
                      key={stage.label}
                      onClick={() => setSelectedStage(idx)}
                      className={isActive ? 'neu-inset' : 'neu-card'}
                      style={{
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {isDone ? (
                          <div className="neu-dot neu-dot-active" />
                        ) : stage.status === 'active' ? (
                          <div className="neu-dot neu-dot-pulse" style={{ background: '#7c3aed' }} />
                        ) : (
                          <div className="neu-dot" style={{ background: '#94a3b8' }} />
                        )}
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--neu-text-title)' }}>
                            {stage.label}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--neu-text-muted)' }}>
                            {stage.detail}
                          </div>
                        </div>
                      </div>

                      <div
                        className="neu-raised-sm"
                        style={{
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          color: isDone ? '#059669' : stage.status === 'active' ? '#7c3aed' : '#64748b',
                        }}
                      >
                        {stage.time}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress Groove Bar */}
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--neu-text-muted)' }}>Pipeline Execution</span>
                  <span style={{ color: 'var(--neu-primary)' }}>72%</span>
                </div>
                <div className="neu-inset-sm" style={{ height: '8px', padding: '1px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: '72%',
                      background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                      borderRadius: '6px',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
