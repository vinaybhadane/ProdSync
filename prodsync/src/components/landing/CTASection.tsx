'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Users, Boxes, CheckCircle2 } from 'lucide-react';

const AUDIENCES = [
  {
    icon: <Building2 size={22} color="#2563eb" />,
    label: 'Industrial Suppliers',
    desc: 'Automate technical catalog ingestion across 50,000+ SKUs with zero retyping overhead.',
  },
  {
    icon: <Users size={22} color="#059669" />,
    label: 'Procurement Teams',
    desc: 'Verify supplier data accuracy, spot counterfeit specs, and reconcile vendor line-items.',
  },
  {
    icon: <Boxes size={22} color="#7c3aed" />,
    label: 'Catalog Managers',
    desc: 'Publish standardized, complete attributes directly to e-commerce PIM & ERP platforms.',
  },
];

export default function CTASection() {
  return (
    <section style={{ padding: '5rem 1.5rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Main Neumorphic CTA Center Card */}
        <div
          className="neu-raised-xl"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div className="neu-badge neu-badge-blue" style={{ marginBottom: '1.25rem' }}>
              <span>Instant Catalog Setup</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                fontWeight: 800,
                color: 'var(--neu-text-title)',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
              }}
            >
              Ready to Turn Product Data Into{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Intelligence?
              </span>
            </h2>

            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--neu-text-body)',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
              }}
            >
              Upload your first PDF datasheet, CSV, or spreadsheet today. Experience autonomous
              extraction, deterministic validation, and explainable AI insights in seconds.
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '3rem',
              }}
            >
              <Link
                href="/register"
                className="neu-btn neu-btn-primary"
                style={{
                  padding: '0.875rem 2rem',
                  fontSize: '1.0625rem',
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
                  fontSize: '1.0625rem',
                }}
              >
                Schedule Demo
              </Link>
            </div>

            {/* 3 Audience Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                textAlign: 'left',
              }}
            >
              {AUDIENCES.map((aud) => (
                <div
                  key={aud.label}
                  className="neu-card"
                  style={{
                    padding: '1.25rem',
                  }}
                >
                  <div
                    className="neu-inset-sm"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.875rem',
                    }}
                  >
                    {aud.icon}
                  </div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--neu-text-title)', marginBottom: '0.25rem' }}>
                    {aud.label}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--neu-text-muted)', lineHeight: 1.4 }}>
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
