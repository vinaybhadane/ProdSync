import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — ProdSync',
  description: 'Privacy policy for the ProdSync Product Intelligence platform.',
};

export default function PrivacyPage() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
        <h1 className="text-h1" style={{ marginBottom: '1rem' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--ps-text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>Last updated: August 2026</p>

        <div className="ps-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: 1.7 }}>
          <section>
            <h2 className="text-h3" style={{ marginBottom: '0.5rem' }}>1. Information We Collect</h2>
            <p style={{ color: 'var(--ps-text-secondary)', fontSize: '0.9375rem' }}>
              We collect information you provide directly to us when creating an account, uploading product documents (PDFs, CSVs, datasheets), and configuring your catalog settings.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: '0.5rem' }}>2. How We Protect Your Data</h2>
            <p style={{ color: 'var(--ps-text-secondary)', fontSize: '0.9375rem' }}>
              All uploaded documents and extracted catalog records are encrypted in transit and at rest using industry-standard AES-256 encryption. We adhere to enterprise security protocols.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: '0.5rem' }}>3. Contact Us</h2>
            <p style={{ color: 'var(--ps-text-secondary)', fontSize: '0.9375rem' }}>
              If you have questions about this Privacy Policy, please contact our security and privacy team at privacy@prodsync.ai.
            </p>
          </section>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Link href="/" className="ps-btn ps-btn-secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
