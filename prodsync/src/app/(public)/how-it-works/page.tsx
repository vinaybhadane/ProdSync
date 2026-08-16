import type { Metadata } from 'next';
import Link from 'next/link';
import { Upload, Cpu, ShieldCheck, Sparkles, UserCheck, Package, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works — ProdSync AI',
  description: 'Learn how ProdSync transforms scattered product data into intelligence.',
};

const STEPS = [
  {
    step: '01',
    icon: <Upload size={24} color="#2563eb" />,
    badgeClass: 'neu-badge-blue',
    title: 'Multi-Source Document Ingestion',
    desc: 'Drag and drop PDF datasheets, CSV inventories, Excel workbooks, or paste vendor product URLs. ProdSync ingests files regardless of formatting, language, or layout.',
    details: ['Direct SAS blob upload', 'Local OCR vectorization', 'Multi-page table retention'],
  },
  {
    step: '02',
    icon: <Cpu size={24} color="#7c3aed" />,
    badgeClass: 'neu-badge-purple',
    title: 'Autonomous AI Extraction & Normalization',
    desc: 'Azure OpenAI + local RapidOCR identify product entities, parse key-value attributes, and normalize units into unified DIN/ISO standards with bounding box coordinate tags.',
    details: ['Entity disambiguation', 'Metric/Imperial conversion', 'Structured JSON generation'],
  },
  {
    step: '03',
    icon: <ShieldCheck size={24} color="#059669" />,
    badgeClass: 'neu-badge-emerald',
    title: 'Deterministic Physical Validation',
    desc: 'The validation engine applies physical boundary checks, electrical safety rules, and catalog consistency constraints to spot impossible numbers and vendor discrepancies.',
    details: ['Zero LLM hallucinations', 'Cross-source conflict detection', 'Mathematical quality score'],
  },
  {
    step: '04',
    icon: <Sparkles size={24} color="#d97706" />,
    badgeClass: 'neu-badge-amber',
    title: 'Explainable AI Enrichment',
    desc: 'Missing attributes, commercial taxonomy (UNSPSC/ETIM), and SEO copy are enriched with transparent AI rationale and calibrated confidence percentages.',
    details: ['Confidence calibration', 'Provenance trail inspection', 'Automated taxonomy mapping'],
  },
  {
    step: '05',
    icon: <UserCheck size={24} color="#0891b2" />,
    badgeClass: 'neu-badge-blue',
    title: 'Human-in-the-Loop Review Console',
    desc: 'Review flagged conflicts, accept or adjust AI suggestions with 1 click, and audit complete provenance trails before catalog approval.',
    details: ['1-click conflict resolution', 'Full page coordinate viewing', 'Granular team permissions'],
  },
  {
    step: '06',
    icon: <Package size={24} color="#059669" />,
    badgeClass: 'neu-badge-emerald',
    title: 'Commerce-Ready Catalog Syndication',
    desc: 'Export 100% validated product records into standard CSV, Excel, or live JSON webhooks for seamless synchronization with SAP, Shopify, and PIM systems.',
    details: ['Clean schema export', 'Real-time webhook sync', 'PIM & ERP integration ready'],
  },
];

export default function HowItWorksPage() {
  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Title Banner */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="neu-badge neu-badge-blue" style={{ marginBottom: '1rem' }}>
            <Cpu size={14} />
            <span>End-to-End Architecture</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 800,
              color: 'var(--neu-text-title)',
              letterSpacing: '-0.025em',
              marginBottom: '1rem',
            }}
          >
            How ProdSync Works
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--neu-text-body)',
              maxWidth: '580px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            A transparent, six-stage pipeline from scattered manufacturer information to
            fully validated, commerce-ready product intelligence.
          </p>
        </div>

        {/* Steps List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {STEPS.map((step, idx) => (
            <div
              key={step.step}
              className="neu-card"
              style={{
                padding: '2rem',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '1.75rem',
                alignItems: 'flex-start',
              }}
            >
              {/* Dial Disc */}
              <div
                className="neu-inset-sm"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  flexShrink: 0,
                }}
              >
                {step.icon}
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--neu-text-muted)' }}>
                  {step.step}
                </span>
              </div>

              {/* Step Content */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neu-text-title)', margin: 0 }}>
                    {step.title}
                  </h2>
                  <span className={`neu-badge ${step.badgeClass}`} style={{ fontSize: '0.75rem' }}>
                    Stage {step.step}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.9375rem',
                    color: 'var(--neu-text-body)',
                    lineHeight: 1.6,
                    marginBottom: '1.25rem',
                  }}
                >
                  {step.desc}
                </p>

                {/* Sub-bullets in soft pill badges */}
                <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                  {step.details.map((detail) => (
                    <div
                      key={detail}
                      className="neu-inset-sm"
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--neu-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <CheckCircle2 size={12} color="#059669" />
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link
            href="/register"
            className="neu-btn neu-btn-primary"
            style={{
              padding: '0.875rem 2rem',
              fontSize: '1rem',
              gap: '0.5rem',
            }}
          >
            Start Your First Import
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
