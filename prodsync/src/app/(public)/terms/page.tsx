import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — ProdSync',
  description: 'Terms of Service for using the ProdSync Product Intelligence platform.',
};

export default function TermsPage() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
        <h1 className="text-h1" style={{ marginBottom: '1rem' }}>Terms of Service</h1>
        <p style={{ color: 'var(--ps-text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>Last updated: August 2026</p>

        <div className="ps-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: 1.7 }}>
          <section>
            <h2 className="text-h3" style={{ marginBottom: '0.5rem' }}>1. Acceptance of Terms</h2>
            <p style={{ color: 'var(--ps-text-secondary)', fontSize: '0.9375rem' }}>
              By accessing and using ProdSync (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: '0.5rem' }}>2. Use of AI Services</h2>
            <p style={{ color: 'var(--ps-text-secondary)', fontSize: '0.9375rem' }}>
              ProdSync utilizes artificial intelligence to assist in extracting, validating, and enriching product data. While our models are tuned for industrial accuracy, users are responsible for final verification of critical technical data before commercial deployment.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: '0.5rem' }}>3. Data Privacy & Ownership</h2>
            <p style={{ color: 'var(--ps-text-secondary)', fontSize: '0.9375rem' }}>
              You retain all ownership rights to your product catalog data, uploaded documents, and exported records. ProdSync does not share your proprietary technical specifications with third parties.
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
