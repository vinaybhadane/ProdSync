import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="neu-footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
          className="neu-footer-grid"
        >
          {/* Brand Column */}
          <div>
            <div style={{ marginBottom: '1rem', display: 'inline-block' }}>
              <Logo variant="full" size="md" />
            </div>
            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: 'var(--neu-text-body)',
                maxWidth: '320px',
                marginBottom: '1.25rem',
              }}
            >
              AI-Powered Product Intelligence for Industrial Commerce. Transform scattered technical
              information into structured, validated, and commerce-ready catalogs.
            </p>
            <div className="neu-badge neu-badge-emerald" style={{ fontSize: '0.75rem' }}>
              <span className="neu-dot neu-dot-active" style={{ width: '6px', height: '6px' }} />
              All Systems Operational
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 800,
                color: 'var(--neu-text-title)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '1.25rem',
              }}
            >
              Product
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {['Features', 'How It Works', 'Solutions', 'About'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--neu-text-muted)',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  className="hover:text-blue-600"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Platform */}
          <div>
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 800,
                color: 'var(--neu-text-title)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '1.25rem',
              }}
            >
              Platform
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {['Security', 'Privacy', 'Terms'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--neu-text-muted)',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  className="hover:text-blue-600"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Account */}
          <div>
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 800,
                color: 'var(--neu-text-title)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '1.25rem',
              }}
            >
              Account
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { label: 'Sign In', href: '/login' },
                { label: 'Get Started Free', href: '/register' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--neu-text-muted)',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  className="hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div
          style={{
            borderTop: '1px solid rgba(0,0,0,0.06)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--neu-text-muted)',
          }}
        >
          <div>&copy; 2026 ProdSync AI Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/privacy" style={{ color: 'var(--neu-text-muted)', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link href="/terms" style={{ color: 'var(--neu-text-muted)', textDecoration: 'none' }}>
              Terms of Service
            </Link>
            <Link href="/security" style={{ color: 'var(--neu-text-muted)', textDecoration: 'none' }}>
              Security
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .neu-footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 480px) {
          .neu-footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
