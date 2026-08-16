'use client';

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Brain, FileText, ChevronDown, ChevronRight, Sparkles, Shield, Eye } from 'lucide-react';

const SAMPLE_ATTRS = [
  {
    name: 'Operating Temperature',
    value: '-20°C to 80°C',
    status: 'verified',
    confidence: 96,
    source: 'Manufacturer Datasheet',
    sourceType: 'PDF Page 4, Sec 3.2',
    aiReason: 'Value extracted directly from tabular specification matrix. Unit converted from Kelvin/Celsius to ISO standard range with 100% confidence.',
  },
  {
    name: 'Nominal Input Voltage',
    value: '380 - 480 V AC',
    status: 'verified',
    confidence: 94,
    source: 'Electrical Manual',
    sourceType: 'PDF Page 12, Table 2',
    aiReason: 'Cross-validated across 2 independent vendor sheets. Matches industrial standard 3-phase European/US grid parameters.',
  },
  {
    name: 'Operating Pressure',
    value: '10 bar / 12 bar',
    status: 'needs_review',
    confidence: 54,
    source: 'Conflicting Sources',
    sourceType: 'Datasheet A vs Catalog B',
    aiReason: 'Conflict detected: Datasheet A states 10 bar continuous rating, whereas Catalog B lists 12 bar peak burst limit. Highlighted for 1-click human verification.',
  },
  {
    name: 'Protection Class (Ingress)',
    value: 'IP66 / NEMA 4X',
    status: 'ai_suggested',
    confidence: 88,
    source: 'Taxonomy Inference',
    sourceType: 'Contextual Model Matrix',
    aiReason: 'Inferred based on silicone gasket seal specs and stainless steel enclosure material. Recommended for heavy washdown environments.',
  },
];

const statusStyles = {
  verified: { label: 'Verified', badge: 'neu-badge-emerald', icon: <CheckCircle size={14} color="#059669" /> },
  ai_suggested: { label: 'AI Suggested', badge: 'neu-badge-purple', icon: <Brain size={14} color="#7c3aed" /> },
  needs_review: { label: 'Needs Review', badge: 'neu-badge-amber', icon: <AlertTriangle size={14} color="#d97706" /> },
};

export default function ExplainableAISection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section style={{ padding: '5rem 1.5rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Badge & Title */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="neu-badge neu-badge-blue" style={{ marginBottom: '1rem' }}>
            <Eye size={14} />
            <span>Explainable Provenance</span>
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
            Every Value Has a Source.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Every Suggestion Has a Reason.
            </span>
          </h2>
          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--neu-text-body)',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            ProdSync never acts as a black box. Each extracted field provides exact document page
            coordinates, confidence percentages, and transparent reasoning.
          </p>
        </div>

        {/* Interactive Attribute Inspector Deck */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '2.5rem',
            alignItems: 'flex-start',
          }}
          className="neu-hero-grid"
        >
          {/* Left: Interactive List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {SAMPLE_ATTRS.map((attr, idx) => {
              const isSelected = expandedIndex === idx;
              const meta = statusStyles[attr.status as keyof typeof statusStyles];

              return (
                <div
                  key={attr.name}
                  onClick={() => setExpandedIndex(idx)}
                  className={isSelected ? 'neu-inset' : 'neu-card'}
                  style={{
                    padding: '1.25rem 1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      {meta.icon}
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--neu-text-title)' }}>
                        {attr.name}
                      </span>
                    </div>
                    <div className={`neu-badge ${meta.badge}`} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                      {meta.label}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--neu-primary)' }}>
                      {attr.value}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neu-text-muted)' }}>
                        {attr.confidence}% Confidence
                      </span>
                      {isSelected ? <ChevronDown size={18} color="#2563eb" /> : <ChevronRight size={18} color="#94a3b8" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Neumorphic Audit Inspection Panel */}
          {expandedIndex !== null && (
            <div
              className="neu-raised-lg"
              style={{
                padding: '2rem',
                position: 'sticky',
                top: '6rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid rgba(255,255,255,0.8)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={18} color="#2563eb" />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--neu-text-title)' }}>
                    Provenance Audit Trail
                  </span>
                </div>
                <div className="neu-badge neu-badge-blue" style={{ fontSize: '0.75rem' }}>
                  Live Verified
                </div>
              </div>

              {/* Selected Parameter Header */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.8125rem', color: 'var(--neu-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Attribute
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neu-text-title)' }}>
                  {SAMPLE_ATTRS[expandedIndex].name}
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--neu-primary)', marginTop: '0.25rem' }}>
                  {SAMPLE_ATTRS[expandedIndex].value}
                </div>
              </div>

              {/* Source Origin Well */}
              <div className="neu-inset" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <FileText size={15} color="#2563eb" />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--neu-text-title)' }}>
                    {SAMPLE_ATTRS[expandedIndex].source}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--neu-text-muted)' }}>
                  Location: <strong>{SAMPLE_ATTRS[expandedIndex].sourceType}</strong>
                </div>
              </div>

              {/* Explainable AI Reasoning */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8125rem', color: 'var(--neu-text-muted)', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={14} color="#7c3aed" />
                  AI Rationale & Validation Logic
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--neu-text-body)', lineHeight: 1.6, margin: 0 }}>
                  {SAMPLE_ATTRS[expandedIndex].aiReason}
                </p>
              </div>

              {/* Confidence Meter */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--neu-text-muted)' }}>Confidence Metric</span>
                  <span style={{ color: 'var(--neu-primary)' }}>{SAMPLE_ATTRS[expandedIndex].confidence}%</span>
                </div>
                <div className="neu-inset-sm" style={{ height: '10px', padding: '2px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${SAMPLE_ATTRS[expandedIndex].confidence}%`,
                      background:
                        SAMPLE_ATTRS[expandedIndex].confidence > 80
                          ? 'linear-gradient(90deg, #10b981, #059669)'
                          : 'linear-gradient(90deg, #f59e0b, #d97706)',
                      borderRadius: '6px',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
