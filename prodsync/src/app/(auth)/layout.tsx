import React from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'var(--ps-bg)',
      }}
      className="auth-layout"
    >
      {/* Left — branding panel */}
      <div
        style={{
          background: 'var(--ps-slate-900)',
          display: 'flex',
          flexDirection: 'column',
          padding: '3rem',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="auth-brand-panel"
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(37,99,235,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139,92,246,0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo */}
        <Link href="/">
          <Logo variant="light" size="md" />
        </Link>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Highlight card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'white',
              marginBottom: '1rem',
              lineHeight: 1.3,
            }}
          >
            Turn scattered product data into structured intelligence
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--ps-slate-400)', lineHeight: 1.65 }}>
            Extract, validate, enrich, and structure industrial product information at scale — with explainable AI.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { value: '94%', label: 'Avg. Quality Score' },
            { value: '10×', label: 'Faster Processing' },
            { value: '12K+', label: 'Products Managed' },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ps-slate-500)', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form panel */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 2rem',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-layout {
            grid-template-columns: 1fr !important;
          }
          .auth-brand-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
