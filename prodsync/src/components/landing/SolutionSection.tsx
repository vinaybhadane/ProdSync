'use client';

import React from 'react';
import { Search, ShieldCheck, Sparkles, Grid3X3, ArrowRight, Layers, Cpu, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const CAPABILITIES = [
  {
    number: '01',
    label: 'Extract & Sourcing',
    icon: <Search size={22} color="#2563eb" />,
    description: 'Multi-source lookup across official manufacturer domains and authorized distributors with automatic exclusion of consumer marketplaces.',
    tag: 'Priority Sourcing',
    badgeStyle: { backgroundColor: '#eff6ff', color: '#2563eb', borderColor: '#dbeafe' },
  },
  {
    number: '02',
    label: 'Leaf Taxonomy',
    icon: <Layers size={22} color="#00a896" />,
    description: 'Deterministic classification across 10,000+ industrial leaf categories with numeric Taxonomy IDs, Classpaths, and dynamic attribute schemas.',
    tag: 'Hierarchical Taxonomies',
    badgeStyle: { backgroundColor: '#f0fdfa', color: '#00a896', borderColor: '#ccfbf1' },
  },
  {
    number: '03',
    label: 'LOV & Validation',
    icon: <ShieldCheck size={22} color="#059669" />,
    description: 'Validates specifications against standardized industrial List of Values while dynamically tagging authentic discoveries as NEW_VALUE without destructive force-fitting.',
    tag: 'Physics & LOV Engine',
    badgeStyle: { backgroundColor: '#f0fdf4', color: '#059669', borderColor: '#bbf7d0' },
  },
  {
    number: '04',
    label: '5-Tier Descriptions',
    icon: <Grid3X3 size={22} color="#2563eb" />,
    description: 'Generates Mobile (60-80 char), Invoice (≤40 ALL CAPS), Title, Long narrative, and Retail copy ready for instant 252-column export.',
    tag: '252-Col Delivery',
    badgeStyle: { backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#dbeafe' },
  },
];

export default function SolutionSection() {
  return (
    <section style={{ padding: '5rem 1.5rem', backgroundColor: '#ffffff' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Eyebrow & Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="neu-badge neu-badge-blue" style={{ marginBottom: '0.875rem' }}>
            <Cpu size={13} />
            <span>The ProdSync Intelligence Pipeline</span>
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
            Four Stages to Enterprise Catalog Mastery
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
            An end-to-end normalization and enrichment engine engineered for the strict standards of industrial distribution and commerce.
          </p>
        </div>

        {/* 4 Clean Enterprise Capability Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.number}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
              }}
            >
              <div>
                {/* Header row: Icon + Stage number */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cap.icon}
                  </div>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 800,
                      color: '#94a3b8',
                      backgroundColor: '#f8fafc',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    STAGE {cap.number}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '0.625rem',
                  }}
                >
                  {cap.label}
                </h3>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#475569',
                    lineHeight: 1.55,
                    marginBottom: '1.5rem',
                  }}
                >
                  {cap.description}
                </p>
              </div>

              <div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: `1px solid ${cap.badgeStyle.borderColor}`,
                    backgroundColor: cap.badgeStyle.backgroundColor,
                    color: cap.badgeStyle.color,
                  }}
                >
                  {cap.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Explore Architecture CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/how-it-works"
            className="neu-text-link"
            style={{ fontSize: '0.9375rem' }}
          >
            Explore the 7-stage pipeline walkthrough &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
