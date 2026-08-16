import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--ps-slate-900)',
        color: 'var(--ps-slate-400)',
        padding: '3rem 1.5rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '2rem',
            marginBottom: '3rem',
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <Logo variant="light" size="md" />
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
              AI-Powered Product Intelligence for Industrial Commerce.
              Transform scattered product information into structured, validated, and commerce-ready intelligence.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ps-slate-300)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
              Product
            </div>
            {['Features', 'How It Works', 'Solutions', 'Pricing'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                style={{ display: 'block', marginBottom: '0.625rem', fontSize: '0.875rem', color: 'var(--ps-slate-400)', textDecoration: 'none' }}
                className="hover:text-white"
              >
                {item}
              </Link>
            ))}
          </div>

          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ps-slate-300)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
              Company
            </div>
            {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                style={{ display: 'block', marginBottom: '0.625rem', fontSize: '0.875rem', color: 'var(--ps-slate-400)', textDecoration: 'none' }}
                className="hover:text-white"
              >
                {item}
              </Link>
            ))}
          </div>

          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ps-slate-300)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
              Account
            </div>
            {[{ label: 'Sign In', href: '/login' }, { label: 'Get Started', href: '/register' }].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{ display: 'block', marginBottom: '0.625rem', fontSize: '0.875rem', color: 'var(--ps-slate-400)', textDecoration: 'none' }}
                className="hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.8125rem' }}>
            &copy; 2026 ProdSync. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy', 'Terms', 'Security'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                style={{ fontSize: '0.8125rem', color: 'var(--ps-slate-500)', textDecoration: 'none' }}
                className="hover:text-white"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
