'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Users, Boxes } from 'lucide-react';

const SOLUTIONS = [
  {
    icon: <Building2 size={20} />,
    label: 'Industrial Suppliers',
    desc: 'Manage thousands of SKUs with consistent quality.',
    color: '#2563eb',
  },
  {
    icon: <Users size={20} />,
    label: 'Procurement Teams',
    desc: 'Verify supplier data accuracy at scale.',
    color: '#10b981',
  },
  {
    icon: <Boxes size={20} />,
    label: 'Catalog Managers',
    desc: 'Build and maintain commerce-ready catalogs.',
    color: '#8b5cf6',
  },
];

export default function CTASection() {
  return (
    <section
      style={{
        padding: '6rem 1.5rem',
        background: 'var(--ps-bg-secondary)',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ marginBottom: '1rem' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--ps-primary)',
              background: 'var(--ps-primary-100)',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
            }}
          >
            Get Started
          </span>
        </div>

        <h2
          className="text-h1"
          style={{ marginBottom: '1.25rem', color: 'var(--ps-text-primary)' }}
        >
          Ready to Turn Product Data Into{' '}
          <span style={{ color: 'var(--ps-primary)' }}>Intelligence?</span>
        </h2>

        <p
          className="text-body"
          style={{
            color: 'var(--ps-text-secondary)',
            maxWidth: '500px',
            margin: '0 auto 2.5rem',
            fontSize: '1.0625rem',
          }}
        >
          Join industrial companies using ProdSync to transform scattered product information
          into trusted product intelligence — at any scale.
        </p>

        {/* Solutions pills */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2.5rem',
          }}
        >
          {SOLUTIONS.map((s) => (
            <div
              key={s.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid var(--ps-border)',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--ps-text-secondary)',
              }}
            >
              <span style={{ color: s.color }}>{s.icon}</span>
              {s.label}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/register"
            className="ps-btn ps-btn-primary ps-btn-lg"
          >
            Start Building Your Catalog
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/login"
            className="ps-btn ps-btn-secondary ps-btn-lg"
          >
            Sign In
          </Link>
        </div>

        <p
          style={{
            marginTop: '1.5rem',
            fontSize: '0.8125rem',
            color: 'var(--ps-text-muted)',
          }}
        >
          No credit card required · Enterprise-ready · Built for industrial scale
        </p>
      </div>
    </section>
  );
}
