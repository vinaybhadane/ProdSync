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
  Layers,
  FileText,
  Eye,
  Download,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Platform Features — ProdSync Enterprise Product Intelligence',
  description: 'Explore the complete technical features of ProdSync: Multi-source lookup, leaf taxonomy, LOV engine, 5-tier descriptions, and 252-column export.',
};

const FEATURE_CATEGORIES = [
  {
    category: '1. Autonomous Sourcing & Multi-Modal Ingestion',
    tag: 'Priority 1: Official Manufacturer Domains',
    items: [
      {
        icon: <Search size={22} color="#2563eb" />,
        title: 'Authoritative Manufacturer Sourcing',
        desc: 'Direct lookup across official manufacturer domains (se.com, 3m.com, diablotools.com) and reputable industrial distributors (DigiKey, Mouser, Grainger) with strict filtering of consumer marketplaces.',
        badge: 'Priority Sourcing',
      },
      {
        icon: <FileText size={22} color="#00a896" />,
        title: 'Multi-Modal PDF OCR & Digital Assets',
        desc: 'Extract technical tables, electrical matrices, and mechanical drawings directly from datasheets. Automatically retrieves high-res product images and PDF specification URLs.',
        badge: 'Digital Assets',
      },
      {
        icon: <Upload size={22} color="#3b82f6" />,
        title: 'Batch CSV Ingestion & Auto-Column Mapping',
        desc: 'Ingest 1,000+ catalog rows instantly. The engine detects Part Numbers, Brand names, and Descriptions, mapping them directly into the enrichment pipeline.',
        badge: 'Massive Scale',
      },
    ],
  },
  {
    category: '2. Leaf Taxonomy & List of Values (LOV) Engine',
    tag: 'Deterministic Engineering Integrity',
    items: [
      {
        icon: <Layers size={22} color="#00a896" />,
        title: 'Leaf-Level Taxonomy Classification',
        desc: 'Deterministic classification into 10,000+ industrial leaf categories with numeric Taxonomy IDs (e.g. #120441), UNSPSC codes, and category-specific required attribute schemas.',
        badge: 'Hierarchical Taxonomies',
      },
      {
        icon: <ShieldCheck size={22} color="#059669" />,
        title: 'LOV Engine & NEW_VALUE Discovery',
        desc: 'Validates specifications against standardized industrial List of Values. When authentic new engineering values are found, tags them as NEW_VALUE without destructive force-fitting.',
        badge: 'Zero Force-Fitting',
      },
      {
        icon: <Cpu size={22} color="#2563eb" />,
        title: 'Decimal-to-Fraction & Unit Normalization',
        desc: 'Converts ambiguous metric/imperial measurements into standard fractional dimensions (e.g., 12 in x 20 in) and authorized UOM abbreviations (V, A, kW, dBA, bar).',
        badge: 'Approved UOMs',
      },
    ],
  },
  {
    category: '3. Standardized Content & Field-Level Provenance',
    tag: 'Unilog Standards & Explainable AI',
    items: [
      {
        icon: <Grid3X3 size={22} color="#2563eb" />,
        title: '5-Tier Standardized Unilog Descriptions',
        desc: 'Generates Mobile (60-80 chars), Invoice (≤40 chars ALL CAPS), Product Title, Long narrative, and Retail copy while preserving original Manufacturer Marketing Copy separately.',
        badge: '5-Tier Content',
      },
      {
        icon: <Eye size={22} color="#00a896" />,
        title: 'Field-Level Provenance & Conflict Detection',
        desc: 'Every single extracted attribute links directly to verifiable source URLs, PDF page tags, and verbatim quotes. Automatically flags multi-source discrepancies for review.',
        badge: '100% Provenance',
      },
      {
        icon: <Download size={22} color="#059669" />,
        title: '252-Column Unilog Delivery Exporter',
        desc: 'Populates all 252 static delivery headers matching industry distribution requirements. Exports cleanly in CSV, Microsoft Excel XLSX, or structured JSON.',
        badge: '252-Col Delivery',
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div style={{ paddingTop: '100px', backgroundColor: '#ffffff' }}>
      {/* Hero Header */}
      <section style={{ padding: '4rem 1.5rem 3rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div className="neu-badge neu-badge-blue" style={{ marginBottom: '1rem' }}>
            <Cpu size={13} />
            <span>Architecture & Specifications</span>
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
            Enterprise Product Intelligence Features
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
            Explore the complete end-to-end capabilities powering automated sourcing, leaf taxonomy classification, 
            deterministic LOV validation, and 252-column syndication.
          </p>
        </div>
      </section>

      {/* Main Categories Section */}
      <section style={{ padding: '4.5rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {FEATURE_CATEGORIES.map((cat, cIdx) => (
            <div key={cat.category}>
              {/* Category Header */}
              <div style={{ marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0a192f', margin: 0 }}>
                    {cat.category}
                  </h2>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {cat.tag}
                </span>
              </div>

              {/* 3 Grid Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {cat.items.map((item) => (
                  <div
                    key={item.title}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '1.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
                      transition: 'transform 0.15s ease, border-color 0.15s ease',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '1.25rem',
                        }}
                      >
                        {item.icon}
                      </div>
                      <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        {item.desc}
                      </p>
                    </div>
                    <div>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #dbeafe',
                        }}
                      >
                        {item.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0a192f', marginBottom: '0.75rem' }}>
            Ready to test these features on your catalog?
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#475569', marginBottom: '1.75rem' }}>
            Try Quick MPN Enrichment or upload a sample CSV to see live leaf taxonomy and 252-column export generation in action.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/app/import"
              className="neu-btn neu-btn-primary"
              style={{ padding: '0.75rem 1.75rem', fontSize: '0.875rem', borderRadius: '6px' }}
            >
              Test Quick MPN Enrichment
            </Link>
            <Link
              href="/how-it-works"
              className="neu-btn neu-btn-secondary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', borderRadius: '6px' }}
            >
              View 7-Stage Pipeline
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
