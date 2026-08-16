import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, Users, Boxes, Factory, ArrowRight, CheckCircle2, ShieldCheck, Zap, Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solutions — ProdSync AI',
  description: 'ProdSync solutions for industrial suppliers, procurement teams, and catalog managers.',
};

const SOLUTIONS = [
  {
    icon: <Building2 size={26} color="#2563eb" />,
    badgeClass: 'neu-badge-blue',
    role: 'Industrial Suppliers & Manufacturers',
    tag: 'Enterprise Catalog Onboarding',
    challenge: 'Managing 10,000+ technical SKUs with frequent revisions, mixed metric/imperial spec sheets, and PDF datasheets.',
    outcome: 'Reduce catalog onboarding time from 4 weeks to 2 hours with 99.4% attribute extraction precision.',
    benefits: [
      'Automated PDF & schematic attribute extraction',
      'Instant UNSPSC & ETIM commercial taxonomy mapping',
      'Direct API syndication to distributor channels',
    ],
  },
  {
    icon: <Users size={26} color="#059669" />,
    badgeClass: 'neu-badge-emerald',
    role: 'Procurement & Engineering Teams',
    tag: 'Vendor Data Governance',
    challenge: 'Verifying supplier-submitted technical parameters against internal safety, DIN, and electrical standards.',
    outcome: 'Eliminate counterfeit specs and duplicate supplier line items with automated conflict detection.',
    benefits: [
      'Multi-vendor specification conflict detection',
      'Automated boundary & physical law validation',
      'Complete field-level provenance audit trails',
    ],
  },
  {
    icon: <Boxes size={26} color="#7c3aed" />,
    badgeClass: 'neu-badge-purple',
    role: 'E-Commerce & PIM Catalog Managers',
    tag: 'Commerce-Ready Data Publishing',
    challenge: 'Incomplete product records, missing dimensional attributes, and lack of filterable facet data on storefronts.',
    outcome: 'Skyrocket product search conversion with 100% complete, enriched, and standardized product filters.',
    benefits: [
      'Contextual AI enrichment for missing attributes',
      'Standardized facet normalization (IP rating, wattage, size)',
      'Export ready for Shopify, Akeneo, and SAP Hybris',
    ],
  },
  {
    icon: <Factory size={26} color="#d97706" />,
    badgeClass: 'neu-badge-amber',
    role: 'Technical Sales & Field Application Engineers',
    tag: 'Rapid Technical Quote Generation',
    challenge: 'Digging through 500-page manual PDFs during live customer engineering calls to find critical specs.',
    outcome: 'Instant parametric lookup and side-by-side product comparison in milliseconds.',
    benefits: [
      'Instant parametric search across all catalog lines',
      'Side-by-side technical attribute comparison',
      'Exportable customer-ready spec summaries',
    ],
  },
];

export default function SolutionsPage() {
  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Title Banner */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="neu-badge neu-badge-blue" style={{ marginBottom: '1rem' }}>
            <Layers size={14} />
            <span>Tailored Industry Solutions</span>
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
            Solutions for Industrial Commerce
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
            Engineered specifically for the rigorous data quality, compliance, and taxonomy
            requirements of modern technical enterprises.
          </p>
        </div>

        {/* 4 Solutions Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          {SOLUTIONS.map((s) => (
            <div
              key={s.role}
              className="neu-card"
              style={{
                padding: '2.25rem',
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
                    marginBottom: '1.5rem',
                  }}
                >
                  <div
                    className="neu-inset-sm"
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {s.icon}
                  </div>
                  <span className={`neu-badge ${s.badgeClass}`} style={{ fontSize: '0.75rem' }}>
                    {s.tag}
                  </span>
                </div>

                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--neu-text-title)',
                    marginBottom: '1rem',
                    lineHeight: 1.3,
                  }}
                >
                  {s.role}
                </h2>

                {/* Challenge & Outcome Inset Wells */}
                <div className="neu-inset-sm" style={{ padding: '0.875rem 1rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neu-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    The Bottleneck
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--neu-text-body)', lineHeight: 1.5 }}>
                    {s.challenge}
                  </div>
                </div>

                <div
                  style={{
                    padding: '0.875rem 1rem',
                    borderRadius: '10px',
                    background: 'rgba(37,99,235,0.06)',
                    border: '1px solid rgba(37,99,235,0.15)',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neu-primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    ProdSync Outcome
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--neu-text-title)', fontWeight: 600, lineHeight: 1.5 }}>
                    {s.outcome}
                  </div>
                </div>

                {/* Key Benefits List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.75rem' }}>
                  {s.benefits.map((b) => (
                    <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--neu-text-body)' }}>
                      <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  href="/register"
                  className="neu-btn neu-btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                    gap: '0.375rem',
                  }}
                >
                  Explore Solution
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div
          className="neu-raised-xl"
          style={{
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
            Have a Custom Industrial Catalog Workflow?
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--neu-text-body)',
              maxWidth: '540px',
              margin: '0 auto 2rem',
            }}
          >
            Our solution architects configure custom extraction templates, physical validation
            constraints, and ERP sync pipelines for enterprise teams.
          </p>
          <Link
            href="/register"
            className="neu-btn neu-btn-primary"
            style={{
              padding: '0.875rem 2rem',
              fontSize: '1rem',
              gap: '0.5rem',
            }}
          >
            Schedule Consultation
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
