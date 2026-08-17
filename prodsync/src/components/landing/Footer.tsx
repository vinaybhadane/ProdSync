import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#0a192f',
        color: '#f8fafc',
        padding: '4.5rem 1.5rem 2rem',
        borderTop: '1px solid #1e293b',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
          className="neu-footer-grid"
        >
          {/* Column 1: Brand & Identity */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <Logo variant="light" size="md" />
            </div>
            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.65,
                color: '#94a3b8',
                maxWidth: '340px',
                marginBottom: '1.5rem',
              }}
            >
              Enterprise AI Product Intelligence for Industrial B2B Commerce. Ingest, validate, 
              and syndicate commerce-ready catalogs with deterministic leaf taxonomy and 252-column export standards.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(0, 168, 150, 0.12)',
                border: '1px solid rgba(0, 168, 150, 0.25)',
                color: '#00c2cb',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#00c2cb' }} />
              All Processing Engines Operational
            </div>
          </div>

          {/* Column 2: Product & Capabilities */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}
            >
              Product
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              {[
                { label: 'Platform Features', href: '/features' },
                { label: '7-Stage Pipeline', href: '/how-it-works' },
                { label: 'Leaf Taxonomy Engine', href: '/features' },
                { label: 'LOV Validation Engine', href: '/features' },
                { label: '5-Tier Descriptions', href: '/features' },
                { label: '252-Col Delivery Export', href: '/features' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.15s ease' }}
                  className="hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Solutions by Industry */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}
            >
              Solutions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              {[
                { label: 'Industrial Distributors', href: '/solutions' },
                { label: 'B2B Manufacturers', href: '/solutions' },
                { label: 'Enterprise PIM & ERP', href: '/solutions' },
                { label: 'Marketplace Syndication', href: '/solutions' },
                { label: 'Quick MPN Enrichment', href: '/app/import' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.15s ease' }}
                  className="hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Platform & Compliance */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}
            >
              Security & Legal
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              {[
                { label: 'Security & Compliance', href: '/security' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'About ProdSync', href: '/about' },
                { label: 'Sign In to Workspace', href: '/login' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.15s ease' }}
                  className="hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: '#64748b',
          }}
        >
          <div>&copy; 2026 ProdSync AI Inc. All rights reserved. Built for UniHack 2026.</div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none' }} className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" style={{ color: '#94a3b8', textDecoration: 'none' }} className="hover:text-white">
              Terms
            </Link>
            <Link href="/security" style={{ color: '#94a3b8', textDecoration: 'none' }} className="hover:text-white">
              Security
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 868px) {
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
