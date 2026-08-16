'use client';

import React from 'react';
import { FileText, Globe, Table2, Image, BookOpen, FileSpreadsheet, ArrowRight } from 'lucide-react';

const SOURCES = [
  { icon: <FileText size={20} />, label: 'PDF Documents', color: '#ef4444' },
  { icon: <Globe size={20} />, label: 'Product Websites', color: '#3b82f6' },
  { icon: <Table2 size={20} />, label: 'Datasheets', color: '#f59e0b' },
  { icon: <FileSpreadsheet size={20} />, label: 'Spreadsheets', color: '#10b981' },
  { icon: <Image size={20} />, label: 'Product Images', color: '#8b5cf6' },
  { icon: <BookOpen size={20} />, label: 'Technical Manuals', color: '#0ea5e9' },
];

export default function ProblemSection() {
  return (
    <section
      style={{
        padding: '6rem 1.5rem',
        background: 'var(--ps-bg)',
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
              color: 'var(--ps-danger)',
              background: 'var(--ps-danger-light)',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
            }}
          >
            The Problem
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
          Product Information Is Everywhere.{' '}
          <span style={{ color: 'var(--ps-danger)' }}>Intelligence Isn&apos;t.</span>
        </h2>

        <p
          className="text-body"
          style={{
            textAlign: 'center',
            color: 'var(--ps-text-secondary)',
            maxWidth: '640px',
            margin: '0 auto 3.5rem',
          }}
        >
          Industrial product information is often fragmented across multiple sources, making manual
          catalog creation slow, inconsistent, and difficult to validate.
        </p>

        {/* Visualization */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '2rem',
            alignItems: 'center',
          }}
          className="problem-grid"
        >
          {/* Source cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.875rem',
            }}
          >
            {SOURCES.map((source, i) => (
              <div
                key={source.label}
                className="ps-card"
                style={{
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  animationDelay: `${i * 0.08}s`,
                  animation: 'ps-fade-in 0.4s ease both',
                  cursor: 'default',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--ps-shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--ps-shadow-sm)';
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: `${source.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: source.color,
                    flexShrink: 0,
                  }}
                >
                  {source.icon}
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--ps-text-primary)' }}>
                  {source.label}
                </span>
              </div>
            ))}
          </div>

          {/* Center arrow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'var(--ps-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 0 0 8px rgba(37,99,235,0.1)',
              }}
            >
              <ArrowRight size={22} />
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--ps-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              ProdSync AI
            </span>
          </div>

          {/* Result card */}
          <div
            className="ps-card"
            style={{
              padding: '1.75rem',
              borderColor: 'var(--ps-primary-100)',
              background: 'var(--ps-primary-50)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--ps-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Table2 size={20} color="white" />
              </div>
              <div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--ps-text-primary)' }}>
                  Structured Product Record
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)' }}>
                  Commerce-ready intelligence
                </div>
              </div>
            </div>

            {/* Mini attribute preview */}
            {[
              { name: 'Operating Pressure', value: '250 bar', status: 'verified' },
              { name: 'Material', value: 'Stainless Steel', status: 'verified' },
              { name: 'Weight', value: '18.5 kg', status: 'ai' },
            ].map((attr) => (
              <div
                key={attr.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  background: 'white',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                  border: '1px solid var(--ps-border)',
                }}
              >
                <span style={{ fontSize: '0.8125rem', color: 'var(--ps-text-secondary)' }}>{attr.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ps-text-primary)' }}>
                    {attr.value}
                  </span>
                  <span className={`ps-badge ${attr.status === 'verified' ? 'ps-badge-verified' : 'ps-badge-ai'}`}>
                    {attr.status === 'verified' ? '✓ Verified' : 'AI'}
                  </span>
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: '0.75rem',
                display: 'flex',
                gap: '0.75rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--ps-primary-100)',
              }}
            >
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--ps-success)' }}>94%</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--ps-text-muted)' }}>Quality</div>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--ps-primary)' }}>96%</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--ps-text-muted)' }}>Confidence</div>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--ps-ai)' }}>3</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--ps-text-muted)' }}>Sources</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .problem-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
