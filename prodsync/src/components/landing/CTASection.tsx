'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Users, Boxes, ShieldCheck, Zap, Layers } from 'lucide-react';

const AUDIENCES = [
  {
    icon: <Building2 size={20} color="#2563eb" />,
    label: 'Industrial Distributors',
    desc: 'Automate technical vendor catalog ingestion across 100,000+ SKUs with instant 252-column syndication.',
  },
  {
    icon: <Users size={20} color="#00a896" />,
    label: 'B2B Manufacturers',
    desc: 'Protect brand authority and technical specs by publishing directly into standardized leaf taxonomies.',
  },
  {
    icon: <Boxes size={20} color="#3b82f6" />,
    label: 'Enterprise PIM Teams',
    desc: 'Eliminate manual retyping with 5-tier descriptions, exact fractional conversions, and zero force-fitting.',
  },
];

export default function CTASection() {
  return (
    <section style={{ padding: '5.5rem 1.5rem', backgroundColor: '#f8fafc' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Deep Navy Enterprise CTA Card */}
        <div
          style={{
            backgroundColor: '#0a192f',
            borderRadius: '16px',
            padding: '4.5rem 2rem',
            textAlign: 'center',
            color: '#ffffff',
            boxShadow: '0 20px 40px -10px rgba(10, 25, 47, 0.4)',
            border: '1px solid #1e293b',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Background Mesh */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(rgba(0, 168, 150, 0.08) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: '760px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
                marginBottom: '1.25rem',
              }}
            >
              <Zap size={13} />
              <span>Enterprise Catalog Automation</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
              }}
            >
              Ready to Standardize Your Product Intelligence?
            </h2>

            <p
              style={{
                fontSize: '1.0625rem',
                color: '#94a3b8',
                lineHeight: 1.65,
                marginBottom: '2.5rem',
              }}
            >
              Ingest technical datasheets, vendor PDFs, or spreadsheets today. Experience automated leaf taxonomy classification, 
              LOV validation, 5-tier descriptions, and 252-column export in seconds.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '3.5rem',
              }}
            >
              <Link
                href="/register"
                className="neu-btn neu-btn-primary"
                style={{
                  padding: '0.875rem 2rem',
                  fontSize: '1rem',
                  borderRadius: '6px',
                  gap: '0.5rem',
                }}
              >
                Get Started Free
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/app/import"
                style={{
                  padding: '0.875rem 1.75rem',
                  fontSize: '1rem',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                Quick MPN Enrichment
              </Link>
            </div>

            {/* 3 Audience Breakdown Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                textAlign: 'left',
              }}
            >
              {AUDIENCES.map((aud) => (
                <div
                  key={aud.label}
                  style={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    padding: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid #1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.875rem',
                    }}
                  >
                    {aud.icon}
                  </div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                    {aud.label}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.45 }}>
                    {aud.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
