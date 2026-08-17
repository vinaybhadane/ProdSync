'use client';

import React, { useState } from 'react';
import { Brain, CheckCircle2, Loader2, Cpu, ShieldCheck, ArrowRight, Activity, Terminal, Layers } from 'lucide-react';
import Link from 'next/link';

const STAGES = [
  { id: 1, label: 'Document & PDF Ingestion', status: 'done', detail: 'RapidOCR + Azure DocIntel layout parsing', time: '120ms' },
  { id: 2, label: 'Authoritative Manufacturer Sourcing', status: 'done', detail: 'Priority 1 official domain validation (se.com, 3m.com)', time: '340ms' },
  { id: 3, label: 'Leaf-Level Taxonomy Classification', status: 'done', detail: 'Assigned Taxonomy ID #120441 with 98% confidence', time: '85ms' },
  { id: 4, label: 'Dynamic Category Attribute Extraction', status: 'done', detail: 'Extracted voltage, amps, mounting with UOM separation', time: '410ms' },
  { id: 5, label: 'List of Values (LOV) Engine', status: 'active', detail: 'Validating against standard LOV + NEW_VALUE discovery', time: 'Live' },
  { id: 6, label: '5-Tier Standardized Descriptions', status: 'pending', detail: 'Building Invoice, Mobile, Short, Long, Retail tiers', time: 'Queued' },
  { id: 7, label: '252-Column Unilog Delivery Exporter', status: 'pending', detail: 'Populating CSV, XLSX, and JSON static headers', time: 'Queued' },
];

export default function AIIntelligenceSection() {
  const [selectedStage, setSelectedStage] = useState(4);

  return (
    <section
      style={{
        padding: '5.5rem 1.5rem',
        backgroundColor: '#0a192f',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #1e293b',
        borderBottom: '1px solid #1e293b',
      }}
    >
      {/* Background Accent Grid Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(0, 168, 150, 0.07) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr',
            gap: '3.5rem',
            alignItems: 'center',
          }}
          className="neu-hero-grid"
        >
          {/* Left Column — Architecture Narrative */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(0, 168, 150, 0.12)',
                border: '1px solid rgba(0, 168, 150, 0.3)',
                color: '#00c2cb',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              <Cpu size={14} />
              <span>Multi-Stage Autonomous Pipeline</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.85rem, 3.5vw, 2.65rem)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                marginBottom: '1.25rem',
              }}
            >
              Engineered for Industrial Precision, Not Generic Chat
            </h2>

            <p
              style={{
                fontSize: '1.0625rem',
                color: '#94a3b8',
                lineHeight: 1.65,
                marginBottom: '2rem',
              }}
            >
              ProdSync blends Google Gemini AI inference with deterministic engineering rules, leaf taxonomy trees, 
              and physical List of Values (LOV) validation to guarantee 100% reliable catalog data.
            </p>

            {/* 3 Pillars in Dark Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              <div
                style={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '1.125rem 1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(0, 168, 150, 0.15)',
                    border: '1px solid rgba(0, 168, 150, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Brain size={18} color="#00c2cb" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.25rem' }}>
                    Hybrid Multi-Modal Ingestion
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    Local RapidOCR for fast tabular extraction combined with Google Gemini for contextual engineering inference.
                  </p>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '1.125rem 1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(37, 99, 235, 0.15)',
                    border: '1px solid rgba(37, 99, 235, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={18} color="#3b82f6" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.25rem' }}>
                    Zero-Hallucination LOV Guardrails
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    Extracted attributes are strictly verified against physical LOVs and fractional dimension converters.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/how-it-works"
              className="neu-btn neu-btn-primary"
              style={{
                padding: '0.75rem 1.625rem',
                fontSize: '0.9375rem',
                borderRadius: '6px',
                gap: '0.5rem',
              }}
            >
              View Pipeline Workflow
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Right Column — Live 7-Stage Pipeline Visual */}
          <div
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
            }}
          >
            {/* Terminal Header */}
            <div
              style={{
                padding: '0.75rem 1.25rem',
                backgroundColor: '#070d18',
                borderBottom: '1px solid #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal size={14} color="#00c2cb" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0', fontFamily: 'monospace' }}>
                  prodsync-core-engine://pipeline-v1
                </span>
              </div>
              <span style={{ fontSize: '0.6875rem', color: '#00a896', fontWeight: 700 }}>
                ● 7 STAGES ONLINE
              </span>
            </div>

            {/* Stages Stack */}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {STAGES.map((s, idx) => {
                const isSelected = selectedStage === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStage(s.id)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '6px',
                      backgroundColor: isSelected ? '#1e293b' : 'rgba(30, 41, 59, 0.4)',
                      border: `1px solid ${isSelected ? '#00a896' : '#1e293b'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {s.status === 'done' && <CheckCircle2 size={16} color="#00c2cb" />}
                        {s.status === 'active' && <Activity size={16} color="#3b82f6" className="animate-pulse" />}
                        {s.status === 'pending' && <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#475569' }} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                          Stage {s.id}: {s.label}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                          {s.detail}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: s.status === 'done' ? 'rgba(0, 168, 150, 0.15)' : s.status === 'active' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(71, 85, 105, 0.2)',
                        color: s.status === 'done' ? '#00c2cb' : s.status === 'active' ? '#60a5fa' : '#64748b',
                        fontFamily: 'monospace',
                      }}
                    >
                      {s.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Status Bar */}
            <div
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: '#070d18',
                borderTop: '1px solid #1e293b',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.6875rem',
                color: '#64748b',
              }}
            >
              <span>Latency: 980ms end-to-end</span>
              <span style={{ color: '#00c2cb' }}>Zero Mock Fallback Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
