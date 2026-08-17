import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, Users, Boxes, Factory, ArrowRight, CheckCircle2, ShieldCheck, Zap, Layers, ShoppingCart, Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Industry Solutions — ProdSync Enterprise Product Intelligence',
  description: 'Tailored catalog enrichment and standardization solutions for Industrial Distributors, B2B Manufacturers, and Enterprise Commerce.',
};

const SOLUTIONS = [
  {
    icon: <Building2 size={24} color="#2563eb" />,
    role: 'Industrial Distributors & Wholesalers',
    tag: 'Vendor Catalog Onboarding',
    challenge: 'Managing 100,000+ supplier line items across inconsistent price sheets, conflicting spec units, and unstructured PDF datasheets.',
    outcome: 'Reduce catalog onboarding cycles from 4 weeks to 2 hours while generating 252-column delivery files with 99.8% precision.',
    benefits: [
      'Automated extraction of technical specifications and leaf taxonomy mapping',
      'Instant generation of character-compliant Invoice and Mobile descriptions',
      'Multi-source conflict detection flagging supplier discrepancies',
      'Direct CSV, Excel XLSX, and JSON export in official 252-column delivery format',
    ],
  },
  {
    icon: <Factory size={24} color="#00a896" />,
    role: 'B2B Equipment Manufacturers & OEMs',
    tag: 'Authoritative Product Sourcing',
    challenge: 'Distributors publishing incorrect fractional dimensions, outdated spec sheets, and truncated marketing descriptions.',
    outcome: 'Establish a certified digital product passport with field-level provenance linking every spec directly to approved engineering docs.',
    benefits: [
      'Preserve certified Manufacturer Marketing Copy and feature bullet points',
      'Enforce standardized industrial List of Values (LOV) across all channels',
      'Protect digital asset links (Product Image JPGs, PDF Specification Sheets)',
      'Deterministic UNSPSC and leaf taxonomy compliance',
    ],
  },
  {
    icon: <ShoppingCart size={24} color="#3b82f6" />,
    role: 'Enterprise E-Commerce & PIM Catalog Teams',
    tag: 'Search Conversion & Syndication',
    challenge: 'Incomplete product filters, missing dimensional facets, and descriptions that exceed ERP or marketplace character limits.',
    outcome: 'Maximize parametric search conversion with standardized attributes, approved units of measure, and calibrated 5-tier descriptions.',
    benefits: [
      'Invoice Description strictly formatted to ≤40 characters in ALL CAPS',
      'Mobile Description optimized to 60–80 characters for fast scanning',
      'Full Long Description utilizing authorized industrial UOM abbreviations',
      'Seamless syndication to Amazon B2B, Akeneo, SAP, and custom PIM channels',
    ],
  },
  {
    icon: <Cpu size={24} color="#059669" />,
    role: 'Procurement & Application Engineering',
    tag: 'Parametric Verification & Proof',
    challenge: 'Manually verifying supplier ratings against safety standards and cross-checking competing vendor part numbers.',
    outcome: 'Instant side-by-side parametric comparison with complete audit trails and transparent AI reasoning logs.',
    benefits: [
      'Verifiable source URLs and PDF page coordinate provenance',
      'Mathematical 0–100% data quality and completeness scoring',
      'Deterministic physical boundary validation preventing impossible values',
      'One-click export of customer-ready engineering summaries',
    ],
  },
];

export default function SolutionsPage() {
  return (
    <div style={{ paddingTop: '100px', backgroundColor: '#ffffff', paddingBottom: '5rem' }}>
      {/* Title Header */}
      <section style={{ padding: '4rem 1.5rem 3rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div className="neu-badge neu-badge-blue" style={{ marginBottom: '1rem' }}>
            <Layers size={13} />
            <span>Enterprise Solutions</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
              fontWeight: 800,
              color: '#0a192f',
              letterSpacing: '-0.03em',
              marginBottom: '1rem',
            }}
          >
            Solutions for Industrial B2B Commerce
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: '#475569',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Engineered specifically for the rigorous data quality, leaf taxonomy precision, 
            and syndication standards demanded by technical enterprises.
          </p>
        </div>
      </section>

      {/* Solutions Cards Grid */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '4.5rem 1.5rem 2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '2rem',
          }}
        >
          {SOLUTIONS.map((sol) => (
            <div
              key={sol.role}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '2.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {sol.icon}
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      border: '1px solid #dbeafe',
                    }}
                  >
                    {sol.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0a192f', marginBottom: '0.75rem' }}>
                  {sol.role}
                </h3>

                {/* Challenge & Outcome Block */}
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Challenge:
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    {sol.challenge}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: '4px' }}>
                    ProdSync Outcome:
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#064e3b', fontWeight: 600, lineHeight: 1.5 }}>
                    {sol.outcome}
                  </div>
                </div>

                {/* Key Benefits List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {sol.benefits.map((b, bIdx) => (
                    <div key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem', color: '#334155' }}>
                      <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  href="/app/import"
                  className="neu-btn neu-btn-primary"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', borderRadius: '6px', gap: '0.5rem' }}
                >
                  Explore in Workspace
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', marginTop: '3rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0a192f', marginBottom: '0.75rem' }}>
            Ready to standardize your enterprise catalog?
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#475569', marginBottom: '1.75rem' }}>
            Test the pipeline with minimal inputs or batch CSV files today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link
              href="/register"
              className="neu-btn neu-btn-primary"
              style={{ padding: '0.75rem 1.75rem', fontSize: '0.875rem', borderRadius: '6px' }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
