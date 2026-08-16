import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Search,
  ShieldCheck,
  Sparkles,
  Grid3X3,
  BarChart3,
  Bell,
  Upload,
  Cpu,
  ArrowRight,
  Database,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Features — ProdSync AI',
  description: 'Explore all ProdSync features for AI-powered product intelligence.',
};

const FEATURE_CATEGORIES = [
  {
    category: 'Ingestion & Extraction',
    items: [
      {
        icon: <Search size={22} color="#2563eb" />,
        title: 'Local Hybrid OCR & Document Vision',
        desc: 'Extract tables, key-value specs, and schematic text directly from PDFs, images, and datasheets using local RapidOCR and Azure AI.',
        badge: 'Zero-Leakage OCR',
        badgeClass: 'neu-badge-blue',
      },
      {
        icon: <Upload size={22} color="#7c3aed" />,
        title: 'Multi-Format Bulk Ingestion',
        desc: 'Ingest thousands of manufacturer documents via PDF, CSV, Excel spreadsheets, direct URL crawls, or REST API batch uploads.',
        badge: 'Massive Scale',
        badgeClass: 'neu-badge-purple',
      },
      {
        icon: <FileSpreadsheet size={22} color="#059669" />,
        title: 'Tabular & Coordinate Vectorization',
        desc: 'Retain tabular row/column relationships, dimensional bounding boxes, and multi-page cross-references automatically.',
        badge: 'Structural Precision',
        badgeClass: 'neu-badge-emerald',
      },
    ],
  },
  {
    category: 'Validation & Enrichment',
    items: [
      {
        icon: <ShieldCheck size={22} color="#059669" />,
        title: 'Deterministic Physics Validation',
        desc: 'Cross-check physical laws, electrical ratings, temperature limits, and dimensional units without LLM hallucinations.',
        badge: 'Physics-Based',
        badgeClass: 'neu-badge-emerald',
      },
      {
        icon: <Sparkles size={22} color="#7c3aed" />,
        title: 'Contextual Attribute Enrichment',
        desc: 'Infer missing attributes, UNSPSC taxonomy codes, and commercial descriptions with human-in-the-loop approval workflows.',
        badge: 'Explainable AI',
        badgeClass: 'neu-badge-purple',
      },
      {
        icon: <Cpu size={22} color="#d97706" />,
        title: 'Cross-Document Conflict Detection',
        desc: 'Flag discrepancies when competing vendor datasheets cite conflicting voltages, operating pressures, or tolerance bounds.',
        badge: 'Conflict Engine',
        badgeClass: 'neu-badge-amber',
      },
    ],
  },
  {
    category: 'Governance & Distribution',
    items: [
      {
        icon: <BarChart3 size={22} color="#2563eb" />,
        title: 'Mathematical Quality Scoring',
        desc: 'Deterministic 0-100% data completeness and accuracy metrics computed across completeness, validation, and consistency.',
        badge: 'Audit Ready',
        badgeClass: 'neu-badge-blue',
      },
      {
        icon: <Database size={22} color="#0891b2" />,
        title: 'Commerce-Ready PIM/ERP Feeds',
        desc: 'Export normalized JSON, CSV, or direct webhooks into SAP, Shopify, Akeneo, and industrial procurement marketplaces.',
        badge: 'Standardized',
        badgeClass: 'neu-badge-blue',
      },
      {
        icon: <Lock size={22} color="#dc2626" />,
        title: 'Enterprise Tenant Isolation & RBAC',
        desc: 'Multi-tenant database schema isolation, Firebase token authentication, and role-based permissions for proprietary catalogs.',
        badge: 'SOC 2 Ready',
        badgeClass: 'neu-badge-rose',
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header Title Banner */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="neu-badge neu-badge-blue" style={{ marginBottom: '1rem' }}>
            <Cpu size={14} />
            <span>Industrial Intelligence Engine</span>
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
            Everything Engineered for{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Product Intelligence
            </span>
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--neu-text-body)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            A full-stack suite of AI and deterministic tools built specifically for the precision,
            scale, and taxonomy demands of technical manufacturing and B2B commerce.
          </p>
        </div>

        {/* Feature Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          {FEATURE_CATEGORIES.map((section) => (
            <div key={section.category}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.75rem',
                }}
              >
                <div className="neu-dot neu-dot-active" />
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--neu-text-title)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {section.category}
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.75rem',
                }}
              >
                {section.items.map((feat) => (
                  <div
                    key={feat.title}
                    className="neu-card"
                    style={{
                      padding: '1.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '1.25rem',
                        }}
                      >
                        <div
                          className="neu-inset-sm"
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {feat.icon}
                        </div>
                        <span className={`neu-badge ${feat.badgeClass}`} style={{ fontSize: '0.75rem' }}>
                          {feat.badge}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: 700,
                          color: 'var(--neu-text-title)',
                          marginBottom: '0.625rem',
                        }}
                      >
                        {feat.title}
                      </h3>

                      <p
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--neu-text-body)',
                          lineHeight: 1.6,
                          marginBottom: '1rem',
                        }}
                      >
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Raised Neumorphic CTA Banner */}
        <div
          className="neu-raised-xl"
          style={{
            marginTop: '5rem',
            padding: '3.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: '1.875rem',
              fontWeight: 800,
              color: 'var(--neu-text-title)',
              marginBottom: '1rem',
            }}
          >
            Ready to Experience the Full Feature Suite?
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--neu-text-body)',
              maxWidth: '520px',
              margin: '0 auto 2rem',
            }}
          >
            Upload your first catalog or test a datasheet. Set up in less than 2 minutes.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/register"
              className="neu-btn neu-btn-primary"
              style={{
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                gap: '0.5rem',
              }}
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/how-it-works"
              className="neu-btn neu-btn-secondary"
              style={{
                padding: '0.875rem 1.75rem',
                fontSize: '1rem',
              }}
            >
              See the Workflow
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
