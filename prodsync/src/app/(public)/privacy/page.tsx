import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — ProdSync AI',
  description: 'Privacy policy for the ProdSync Product Intelligence platform.',
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--neu-text-muted)', fontSize: '0.875rem' }}>Last updated: August 2026</p>
        </div>

        <div className="neu-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', lineHeight: 1.7 }}>
          <section>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--neu-text-title)', marginBottom: '0.5rem' }}>
              1. Information We Collect
            </h2>
            <p style={{ color: 'var(--neu-text-body)', fontSize: '0.9375rem', margin: 0 }}>
              We collect information you provide directly when creating an account, uploading technical product documents (PDFs, CSVs, datasheets), and configuring catalog schema settings.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--neu-text-title)', marginBottom: '0.5rem' }}>
              2. How We Protect & Segregate Your Data
            </h2>
            <p style={{ color: 'var(--neu-text-body)', fontSize: '0.9375rem', margin: 0 }}>
              All uploaded documents and extracted records are encrypted in transit and at rest using AES-256 encryption. Your proprietary catalog data is isolated in dedicated tenant databases and is never used to train public foundation models.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--neu-text-title)', marginBottom: '0.5rem' }}>
              3. Privacy Contacts
            </h2>
            <p style={{ color: 'var(--neu-text-body)', fontSize: '0.9375rem', margin: 0 }}>
              If you have inquiries regarding this Privacy Policy or enterprise data processing agreements (DPAs), contact our security team at privacy@prodsync.ai.
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
