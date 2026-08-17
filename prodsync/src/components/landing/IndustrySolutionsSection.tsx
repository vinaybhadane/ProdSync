'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, Factory, ShoppingCart, CheckCircle2, ArrowRight, Layers, FileSpreadsheet, ShieldCheck } from 'lucide-react';

interface SolutionTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  benefits: string[];
  metrics: { label: string; value: string }[];
  ctaLink: string;
}

const TABS: SolutionTab[] = [
  {
    id: 'distributors',
    label: 'Industrial Distributors',
    icon: <Building2 size={18} />,
    title: 'Automate Vendor Catalog Onboarding at Scale',
    subtitle: 'Ingest 10,000+ supplier line items across multiple formats, normalize units, and syndicate 252-column delivery files.',
    benefits: [
      'Eliminate 40%+ manual copy-paste time on complex vendor price/spec sheets',
      'Automatic leaf taxonomy mapping with deterministic Taxonomy IDs',
      'Detect supplier pricing and specification conflicts automatically',
      'One-click export into ERP, PIM, and e-commerce formats',
    ],
    metrics: [
      { label: 'Faster Onboarding', value: '10×' },
      { label: 'UOM Accuracy', value: '99.8%' },
    ],
    ctaLink: '/solutions',
  },
  {
    id: 'manufacturers',
    label: 'B2B Manufacturers',
    icon: <Factory size={18} />,
    title: 'Maintain Authoritative Product Truth & Compliance',
    subtitle: 'Publish certified engineering specifications, preserve manufacturer marketing copy, and protect digital asset links.',
    benefits: [
      'Direct integration with CAD, PDF datasheets, and technical drawings',
      'Preserve authentic Manufacturer Marketing Copy and feature bullet points',
      'Enforce standardized List of Values (LOVs) and fractional dimensioning',
      'Field-level provenance linking every spec directly to approved documentation',
    ],
    metrics: [
      { label: 'Catalog Completeness', value: '98%' },
      { label: 'Audit Trail Provenance', value: '100%' },
    ],
    ctaLink: '/solutions',
  },
  {
    id: 'ecommerce',
    label: 'Enterprise E-Commerce & PIM',
    icon: <ShoppingCart size={18} />,
    title: 'Generate 5-Tier Descriptions & Syndication Feeds',
    subtitle: 'Drive organic search traffic and mobile conversion with calibrated character-compliant product descriptions.',
    benefits: [
      'Invoice / ERP description strictly formatted to ≤40 characters in ALL CAPS',
      'Mobile-optimized description tailored to 60–80 characters for fast scanning',
      'Full Long Description using approved industrial UOM abbreviations',
      'Instant syndication to Amazon B2B, Unilog Delivery, and custom API endpoints',
    ],
    metrics: [
      { label: 'Delivery Headers', value: '252' },
      { label: 'Standard Tiers', value: '5-Tier' },
    ],
    ctaLink: '/solutions',
  },
];

export default function IndustrySolutionsSection() {
  const [activeTabId, setActiveTabId] = useState<string>('distributors');
  const activeTab = TABS.find((t) => t.id === activeTabId) || TABS[0];

  return (
    <section style={{ padding: '5rem 1.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Eyebrow & Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="neu-badge neu-badge-teal" style={{ marginBottom: '0.875rem' }}>
            <Layers size={13} />
            <span>Tailored Enterprise Solutions</span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
              fontWeight: 800,
              color: '#0a192f',
              letterSpacing: '-0.025em',
              marginBottom: '1rem',
            }}
          >
            Engineered for Every Stakeholder in B2B Commerce
          </h2>
          <p
            style={{
              fontSize: '1.0625rem',
              color: '#475569',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Whether you manage 100,000 distributor SKUs or certify OEM engineering specs, ProdSync streamlines the workflow.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
          }}
        >
          {TABS.map((tab) => {
            const isSelected = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#ffffff' : '#f1f5f9',
                  color: isSelected ? '#2563eb' : '#475569',
                  boxShadow: isSelected ? '0 2px 6px -1px rgba(37, 99, 235, 0.15)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Tab Content Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: '0 4px 15px -3px rgba(15, 23, 42, 0.05)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '3rem',
              alignItems: 'center',
            }}
            className="neu-hero-grid"
          >
            {/* Left: Solution Details & Benefits */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00a896', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Use Case Overview
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0a192f', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                {activeTab.title}
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {activeTab.subtitle}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {activeTab.benefits.map((b, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: '#334155' }}>
                    <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <Link
                href={activeTab.ctaLink}
                className="neu-btn neu-btn-primary"
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  gap: '0.5rem',
                  borderRadius: '6px',
                }}
              >
                Learn More About {activeTab.label}
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right: Key Performance Highlights Deck */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Verified Operational Impact
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {activeTab.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb', letterSpacing: '-0.02em' }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginTop: '4px' }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5, borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                &ldquo;ProdSync transformed our onboarding cycle from 4 weeks of manual reformatting down to a single afternoon.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
