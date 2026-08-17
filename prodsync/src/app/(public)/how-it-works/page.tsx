import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Upload,
  Cpu,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Package,
  ArrowRight,
  CheckCircle2,
  Layers,
  FileText,
  Eye,
  Download,
  Search,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works — 7-Stage Product Intelligence Pipeline | ProdSync',
  description: 'Understand how ProdSync enriches raw industrial part numbers into 252-column Unilog delivery formats through a 7-stage autonomous pipeline.',
};

const STAGES = [
  {
    step: '01',
    icon: <Search size={22} color="#2563eb" />,
    tag: 'Priority 1 Sourcing',
    title: 'Authoritative Multi-Source Sourcing',
    desc: 'The engine looks up part numbers across official manufacturer portals (se.com, 3m.com, diablotools.com) and authorized industrial distributors (DigiKey, Mouser, Grainger) while strictly filtering out consumer marketplaces.',
    details: [
      'Priority 1: Official manufacturer domain verification',
      'Priority 2: Industrial distributor fallback',
      'Automatic exclusion of Amazon, eBay, Walmart, AliExpress',
      'Extraction of high-res image URLs and PDF spec sheets',
    ],
  },
  {
    step: '02',
    icon: <Layers size={22} color="#00a896" />,
    tag: 'Leaf Taxonomy',
    title: 'Leaf-Level Taxonomy Classification',
    desc: 'Classifies products into leaf categories across 10,000+ industrial classes, assigning numeric Taxonomy IDs (e.g. #120441), UNSPSC codes, and category-specific required attribute schemas.',
    details: [
      'Deterministic taxonomy tree mapping',
      'Full depth classpaths (e.g., Electrical > Industrial Controls > Contactors)',
      'Assigns required and recommended attribute schemas per leaf',
      'Transparent confidence score and classification reasoning',
    ],
  },
  {
    step: '03',
    icon: <Cpu size={22} color="#3b82f6" />,
    tag: 'Extraction & UOM',
    title: 'Dynamic Category Attribute Extraction & UOM Separation',
    desc: 'Extracts 10–30+ technical parameters per category, isolating numeric values from standard units of measure (UOM) and converting decimal measurements to standard fractional strings (e.g. 12 in x 20 in).',
    details: [
      'Strict Value + UOM separation (e.g. value: "440", unit: "V")',
      'Decimal to fraction conversion (e.g. "12.75 in" -> "12-3/4 in")',
      'Standardized industrial abbreviations (kW, A, V, bar, dBA)',
      'Hybrid Local OCR + Google Gemini LLM extraction',
    ],
  },
  {
    step: '04',
    icon: <ShieldCheck size={22} color="#059669" />,
    tag: 'LOV Engine',
    title: 'List of Values (LOV) Validation & NEW_VALUE Discovery',
    desc: 'Validates extracted values against standardized industrial dictionaries. When an authentic engineering term not in the dictionary is encountered, it tags the value as NEW_VALUE without destructive force-fitting.',
    details: [
      'Standard LOVs for mounting, material, grit, voltage, amps, etc.',
      'Flags NEW_VALUE ("New LOV Value Discovered") without force-fitting',
      'Status tagging: verified, new_value, needs_review, missing, conflict',
      'Zero hallucination rule-based guardrails',
    ],
  },
  {
    step: '05',
    icon: <Eye size={22} color="#00a896" />,
    tag: 'Field Provenance',
    title: 'Field-Level Provenance & Multi-Source Conflict Detection',
    desc: 'Attaches verifiable source URLs, PDF page numbers, and verbatim text quotes to every single extracted attribute. Detects discrepancies between competing documents (e.g. Source A vs Source B).',
    details: [
      'Exact document coordinates and source URLs attached to every field',
      'Cross-source conflict detection flagging discrepancy alerts',
      'Transparent AI reasoning log for every extracted value',
      'Audit-ready proof for engineering and procurement teams',
    ],
  },
  {
    step: '06',
    icon: <FileText size={22} color="#2563eb" />,
    tag: '5-Tier Content',
    title: '5-Tier Standardized Unilog Description Generation',
    desc: 'Builds all 5 standardized description tiers with strict character length limits, while preserving original Manufacturer Marketing Copy and feature bullets separately.',
    details: [
      'Invoice / ERP Description (≤40 chars, ALL CAPS)',
      'Mobile Description (60–80 chars for fast scanning)',
      'Product Title / Short Description',
      'Long Description using approved UOM abbreviations',
      'Retail Description + separate Marketing Copy preservation',
    ],
  },
  {
    step: '07',
    icon: <Download size={22} color="#059669" />,
    tag: '252-Col Delivery',
    title: '252-Column Unilog Delivery Exporter',
    desc: 'Maps enriched records into all 252 static columns matching the official Unilog Delivery standard. Generates CSV, Excel XLSX, or structured JSON exports in one click.',
    details: [
      'Populates MFR URL, Ref URLs 1..5, and Digital Asset links',
      'Fills ATTRIBUTE_LABEL, VALUE, and UOM across 1..50 slots',
      'Fills ITEM_FEATURES 1..20 and all 5 description tiers',
      'Ready for immediate syndication into enterprise ERP and PIM platforms',
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div style={{ paddingTop: '100px', backgroundColor: '#ffffff', paddingBottom: '5rem' }}>
      {/* Title Header */}
      <section style={{ padding: '4rem 1.5rem 3rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div className="neu-badge neu-badge-teal" style={{ marginBottom: '1rem' }}>
            <Cpu size={13} />
            <span>The 7-Stage Intelligence Pipeline</span>
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
            How ProdSync Works
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
            A transparent, deterministic seven-stage pipeline converting minimal MPN inputs and raw datasheets 
            into 252-column commerce-ready catalog deliverables.
          </p>
        </div>
      </section>

      {/* 7 Stages Vertical Timeline */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '4.5rem 1.5rem 2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {STAGES.map((s) => (
            <div
              key={s.step}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '2rem',
                boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
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
                    }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', letterSpacing: '0.05em' }}>
                      STAGE {s.step}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '2px 0 0' }}>
                      {s.title}
                    </h3>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: '#f0fdfa',
                    color: '#00a896',
                    border: '1px solid #ccfbf1',
                  }}
                >
                  {s.tag}
                </span>
              </div>

              <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {s.desc}
              </p>

              {/* Bullet Checklist */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '0.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                {s.details.map((d, dIdx) => (
                  <div key={dIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#334155' }}>
                    <CheckCircle2 size={15} color="#059669" style={{ flexShrink: 0 }} />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '3.5rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', marginTop: '3rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0a192f', marginBottom: '0.75rem' }}>
            Experience the pipeline live in the workspace
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#475569', marginBottom: '1.75rem' }}>
            Input a manufacturer part number to watch all 7 stages execute with live sourcing and real Google Gemini inference.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link
              href="/app/import"
              className="neu-btn neu-btn-primary"
              style={{ padding: '0.75rem 1.75rem', fontSize: '0.875rem', borderRadius: '6px' }}
            >
              Start Quick MPN Enrichment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
