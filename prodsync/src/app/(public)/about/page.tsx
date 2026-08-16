import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — ProdSync',
  description: 'ProdSync is an AI-powered Product Intelligence platform for industrial commerce.',
};

export default function AboutPage() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <span className="ps-badge ps-badge-ai" style={{ marginBottom: '1rem', display: 'inline-flex' }}>About ProdSync</span>
          <h1 className="text-h1" style={{ marginBottom: '1.25rem' }}>
            Built for Industrial Commerce. Powered by AI.
          </h1>
          <p className="text-body" style={{ color: 'var(--ps-text-secondary)', marginBottom: '1.5rem' }}>
            ProdSync was born from a simple observation: industrial companies are drowning in product information,
            but starving for product intelligence. Datasheets, catalogs, supplier documents, and technical manuals
            contain enormous value — but turning that raw information into reliable, structured product data is
            painfully slow and error-prone when done manually.
          </p>
          <p className="text-body" style={{ color: 'var(--ps-text-secondary)', marginBottom: '1.5rem' }}>
            We built ProdSync to solve this. Using AI, we transform any product information — no matter the source,
            format, or quality — into validated, enriched, and commerce-ready product intelligence.
          </p>
          <p className="text-body" style={{ color: 'var(--ps-text-secondary)' }}>
            Every AI decision in ProdSync is explainable. We believe industrial product data is too important
            for a black-box approach. Every extracted value shows its source. Every suggestion shows its confidence.
            Every validation shows its reasoning. You stay in control.
          </p>
        </div>

        <div className="ps-card" style={{ padding: '2rem', marginBottom: '2rem', background: 'var(--ps-primary-50)', borderColor: 'var(--ps-primary-100)' }}>
          <h2 className="text-h2" style={{ marginBottom: '1rem', color: 'var(--ps-primary)' }}>Our Mission</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--ps-text-primary)', lineHeight: 1.65, fontWeight: 500 }}>
            &ldquo;Turn fragmented industrial product information into trusted product intelligence — at any scale.&rdquo;
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/register" className="ps-btn ps-btn-primary ps-btn-lg">
            Get Started with ProdSync
          </Link>
        </div>
      </div>
    </div>
  );
}
