import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — ProdSync Enterprise Product Intelligence',
  description: 'Privacy policy and data governance practices for the ProdSync platform.',
};

export default function PrivacyPage() {
  return (
    <div style={{ paddingTop: '100px', backgroundColor: '#ffffff', paddingBottom: '5rem' }}>
      <section style={{ padding: '3.5rem 1.5rem 2.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
          <div className="neu-badge neu-badge-blue" style={{ marginBottom: '0.875rem' }}>
            <Shield size={13} />
            <span>Data Governance</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              color: '#0a192f',
              marginBottom: '0.5rem',
              letterSpacing: '-0.025em',
            }}
          >
            Privacy Policy
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Last updated: August 2026</p>
        </div>
      </section>

      <section style={{ maxWidth: '840px', margin: '0 auto', padding: '3rem 1.5rem 2rem' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '2.5rem',
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            lineHeight: 1.7,
          }}
        >
          <section>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              1. Information We Collect
            </h2>
            <p style={{ color: '#475569', fontSize: '0.9375rem', margin: 0 }}>
              We collect information you provide directly when creating an account, uploading technical product documents (PDFs, CSVs, datasheets), and configuring catalog schema settings.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              2. How We Protect &amp; Segregate Your Data
            </h2>
            <p style={{ color: '#475569', fontSize: '0.9375rem', margin: 0 }}>
              All uploaded documents and extracted records are encrypted in transit (TLS 1.3) and at rest (AES-256). Your proprietary catalog data is strictly isolated in dedicated multi-tenant databases and is never used to train public foundation models.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              3. Privacy Contacts
            </h2>
            <p style={{ color: '#475569', fontSize: '0.9375rem', margin: 0 }}>
              If you have inquiries regarding this Privacy Policy or enterprise data processing agreements (DPAs), contact our security team at privacy@prodsync.ai.
            </p>
          </section>
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <Link href="/" className="neu-btn neu-btn-secondary" style={{ padding: '0.75rem 1.75rem', fontSize: '0.875rem', borderRadius: '6px' }}>
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
