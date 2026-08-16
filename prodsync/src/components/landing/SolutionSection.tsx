'use client';

import React from 'react';
import { Search, ShieldCheck, Sparkles, Grid3X3 } from 'lucide-react';

const CAPABILITIES = [
  {
    number: '01',
    label: 'Extract',
    icon: <Search size={24} />,
    description: 'Extract product attributes from limited or unstructured information across PDFs, websites, spreadsheets, and technical documents.',
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    number: '02',
    label: 'Validate',
    icon: <ShieldCheck size={24} />,
    description: 'Detect inconsistencies, missing values, suspicious values, and conflicting information across multiple source documents.',
    color: '#10b981',
    bg: '#d1fae5',
  },
  {
    number: '03',
    label: 'Enrich',
    icon: <Sparkles size={24} />,
    description: 'Use AI to intelligently complete missing product information based on context, similar products, and industry standards.',
    color: '#8b5cf6',
    bg: '#ede9fe',
  },
  {
    number: '04',
    label: 'Structure',
    icon: <Grid3X3 size={24} />,
    description: 'Convert raw information into standardized, commerce-ready product records that integrate with any downstream system.',
    color: '#f59e0b',
    bg: '#fef3c7',
  },
];

export default function SolutionSection() {
  return (
    <section
      style={{
        padding: '6rem 1.5rem',
        background: 'var(--ps-bg-secondary)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section label */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
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
            The Solution
          </span>
        </div>

        <h2
          className="text-h1"
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
            color: 'var(--ps-text-primary)',
          }}
        >
          From Scattered Data to{' '}
          <span style={{ color: 'var(--ps-primary)' }}>Structured Intelligence</span>
        </h2>

        <p
          className="text-body"
          style={{
            textAlign: 'center',
            color: 'var(--ps-text-secondary)',
            maxWidth: '560px',
            margin: '0 auto 3.5rem',
          }}
        >
          A four-stage AI pipeline that transforms any raw product information into
          reliable, structured product intelligence.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
          }}
          className="solution-grid"
        >
          {CAPABILITIES.map((cap, i) => (
            <div
              key={cap.number}
              className="feature-card"
              style={{
                animationDelay: `${i * 0.1}s`,
                animation: 'ps-fade-in 0.4s ease both',
              }}
            >
              {/* Number */}
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: cap.color,
                  letterSpacing: '0.1em',
                  marginBottom: '1rem',
                  opacity: 0.7,
                }}
              >
                {cap.number}
              </div>

              {/* Icon */}
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: cap.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: cap.color,
                  marginBottom: '1.25rem',
                  transition: 'transform 0.2s ease',
                }}
              >
                {cap.icon}
              </div>

              {/* Label */}
              <h3
                className="text-h3"
                style={{ marginBottom: '0.75rem', color: 'var(--ps-text-primary)' }}
              >
                {cap.label}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--ps-text-secondary)',
                  lineHeight: '1.6',
                }}
              >
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .solution-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .solution-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
