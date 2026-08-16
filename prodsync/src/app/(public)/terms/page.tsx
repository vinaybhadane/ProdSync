import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — ProdSync AI',
  description: 'Terms of Service for using the ProdSync Product Intelligence platform.',
};

export default function TermsPage() {
  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: 'var(--neu-text-title)',
              marginBottom: '0.5rem',
            }}
          >
            Terms of Service
          </h1>
          <p style={{ color: 'var(--neu-text-muted)', fontSize: '0.875rem' }}>Last updated: August 2026</p>
        </div>

        <div className="neu-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', lineHeight: 1.7 }}>
          <section>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--neu-text-title)', marginBottom: '0.5rem' }}>
              1. Acceptance of Terms
            </h2>
            <p style={{ color: 'var(--neu-text-body)', fontSize: '0.9375rem', margin: 0 }}>
              By accessing and using ProdSync (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--neu-text-title)', marginBottom: '0.5rem' }}>
              2. Use of AI & Extraction Services
            </h2>
            <p style={{ color: 'var(--neu-text-body)', fontSize: '0.9375rem', margin: 0 }}>
              ProdSync utilizes artificial intelligence and local OCR to assist in extracting, validating, and enriching product data. While models are tuned for industrial accuracy and physical rules, users maintain human-in-the-loop review before final commercial deployment.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--neu-text-title)', marginBottom: '0.5rem' }}>
              3. Data Privacy & Customer Ownership
            </h2>
            <p style={{ color: 'var(--neu-text-body)', fontSize: '0.9375rem', margin: 0 }}>
              You retain all ownership rights to your product catalog data, uploaded documents, and exported records. ProdSync does not share your proprietary technical specifications with third parties.
            </p>
          </section>
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <Link href="/" className="neu-btn neu-btn-secondary" style={{ padding: '0.75rem 1.75rem', fontSize: '0.9375rem' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
