'use client';

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Brain, FileText, ChevronDown, ChevronRight, Sparkles, Shield, Eye, ExternalLink } from 'lucide-react';

const SAMPLE_ATTRS = [
  {
    name: 'Voltage Rating',
    value: '440 V',
    status: 'verified',
    statusLabel: 'LOV Verified',
    confidence: 98,
    source: 'Schneider Electric Official Portal',
    sourceUrl: 'https://www.se.com/us/en/product/LC1D09M7',
    sourceType: 'Priority 1: Manufacturer',
    aiReason: 'Extracted directly from authoritative technical specification table. Validated against IEC 60947-4-1 contactor LOV standard.',
  },
  {
    name: 'Mounting Type',
    value: 'DIN Rail / Plate Mount',
    status: 'new_value',
    statusLabel: '★ New LOV Value Discovered',
    confidence: 94,
    source: 'Technical Datasheet PDF',
    sourceUrl: 'Page 3, Section 2.1 "Mechanical Dimensions"',
    sourceType: 'Technical Datasheet',
    aiReason: 'New valid engineering value discovered outside existing dictionary. Tagged as NEW_VALUE without destructive force-fitting.',
  },
  {
    name: 'Operating Pressure',
    value: '10 bar vs 12 bar',
    status: 'conflict',
    statusLabel: '⚡ Discrepancy Flagged',
    confidence: 62,
    source: 'Manufacturer Datasheet vs Distributor Sheet',
    sourceUrl: 'MFR Datasheet (10 bar) vs Catalog B (12 bar)',
    sourceType: 'Multi-Source Conflict',
    aiReason: 'Conflict detected between continuous working limit (10 bar) and peak burst limit (12 bar). Flagged for 1-click human review.',
  },
  {
    name: 'Protection Standard',
    value: 'IP20 conforming to IEC 60529',
    status: 'verified',
    statusLabel: 'LOV Verified',
    confidence: 96,
    source: 'Official Compliance Manual',
    sourceUrl: 'https://www.se.com/us/en/product/LC1D09M7',
    sourceType: 'Priority 1: Manufacturer',
    aiReason: 'Cross-verified across manufacturer conformity certificates and official product portal.',
  },
];

export default function ExplainableAISection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section
      style={{
        padding: '5.5rem 1.5rem',
        backgroundColor: '#070d18',
        color: '#f8fafc',
        borderBottom: '1px solid #1e293b',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Eyebrow & Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
              marginBottom: '1rem',
            }}
          >
            <Eye size={13} />
            <span>Field-Level Provenance & Traceability</span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.65rem)',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.025em',
              marginBottom: '1rem',
            }}
          >
            Every Value Has a Source.{' '}
            <span style={{ color: '#00c2cb' }}>Every Suggestion Has a Reason.</span>
          </h2>
          <p
            style={{
              fontSize: '1.0625rem',
              color: '#94a3b8',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            ProdSync eliminates black-box AI by attaching verifiable URLs, PDF page tags, verbatim text snippets, 
            and transparent confidence ratings to every single field.
          </p>
        </div>

        {/* Interactive Attribute Provenance Inspector Deck */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '2rem',
            alignItems: 'start',
          }}
          className="neu-hero-grid"
        >
          {/* Left Column: Attribute Selector List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {SAMPLE_ATTRS.map((attr, idx) => {
              const isSelected = expandedIndex === idx;
              return (
                <div
                  key={attr.name}
                  onClick={() => setExpandedIndex(idx)}
                  style={{
                    backgroundColor: isSelected ? '#1e293b' : '#0f172a',
                    border: `1px solid ${isSelected ? '#00c2cb' : '#1e293b'}`,
                    borderRadius: '8px',
                    padding: '1.125rem 1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: isSelected ? '#ffffff' : '#e2e8f0' }}>
                      {attr.name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor:
                          attr.status === 'verified'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : attr.status === 'new_value'
                            ? 'rgba(37, 99, 235, 0.2)'
                            : 'rgba(239, 68, 68, 0.2)',
                        color:
                          attr.status === 'verified'
                            ? '#34d399'
                            : attr.status === 'new_value'
                            ? '#60a5fa'
                            : '#f87171',
                      }}
                    >
                      {attr.statusLabel}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                    <span style={{ color: '#94a3b8' }}>Value: <strong style={{ color: '#f8fafc' }}>{attr.value}</strong></span>
                    <span style={{ color: '#00c2cb', fontWeight: 600, fontSize: '0.75rem' }}>
                      Confidence: {attr.confidence}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Provenance & Evidence Inspector */}
          {expandedIndex !== null && (
            <div
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '10px',
                padding: '1.75rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1e293b' }}>
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#00c2cb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Provenance Audit Log
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', margin: '2px 0 0' }}>
                    {SAMPLE_ATTRS[expandedIndex].name}
                  </h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00c2cb' }}>
                    {SAMPLE_ATTRS[expandedIndex].confidence}%
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>AI Confidence</div>
                </div>
              </div>

              {/* Sourcing Authority Tier */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.25rem' }}>
                  Sourcing Authority:
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#38bdf8' }}>
                  {SAMPLE_ATTRS[expandedIndex].sourceType}
                </div>
              </div>

              {/* Exact Verifiable Evidence / URL */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.25rem' }}>
                  Source URL / Document Section:
                </div>
                <div
                  style={{
                    backgroundColor: '#070d18',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '6px',
                    border: '1px solid #1e293b',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: '#e2e8f0',
                    wordBreak: 'break-all',
                  }}
                >
                  {SAMPLE_ATTRS[expandedIndex].sourceUrl}
                </div>
              </div>

              {/* Transparent Reasoning */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.25rem' }}>
                  Transparent AI Reasoning & Validation:
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: 1.55, margin: 0 }}>
                  {SAMPLE_ATTRS[expandedIndex].aiReason}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #1e293b' }}>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Approve Specification
                </button>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    color: '#94a3b8',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Edit / Override
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
