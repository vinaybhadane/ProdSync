import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Server, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Security — ProdSync AI',
  description: 'Enterprise security standards and practices at ProdSync.',
};

export default function SecurityPage() {
  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="neu-badge neu-badge-emerald" style={{ marginBottom: '1rem' }}>
            <Shield size={14} />
            <span>Enterprise Protection</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: 'var(--neu-text-title)',
              letterSpacing: '-0.025em',
              marginBottom: '1rem',
            }}
          >
            Enterprise Security & Governance
          </h1>
          <p style={{ color: 'var(--neu-text-body)', fontSize: '1.0625rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            ProdSync is built from the ground up with enterprise-grade data protection, multi-tenant isolation, and continuous auditing.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { icon: <Shield size={24} color="#059669" />, title: 'SOC 2 Type II Certified', desc: 'Strict operational security controls, continuous monitoring, and annual external auditor attestation.' },
            { icon: <Lock size={24} color="#2563eb" />, title: 'End-to-End Encryption', desc: 'AES-256 at rest, TLS 1.3 in transit across all backend endpoints and direct SAS blob uploads.' },
            { icon: <Server size={24} color="#7c3aed" />, title: 'Dedicated Tenant Isolation', desc: 'Your proprietary catalog data and pricing formulas are strictly isolated in multi-tenant schemas.' },
            { icon: <CheckCircle2 size={24} color="#d97706" />, title: 'Explainable AI Guardrails', desc: 'Immutable audit trails for every AI extraction, normalization, and human enrichment approval.' },
          ].map((item) => (
            <div key={item.title} className="neu-card" style={{ padding: '1.75rem' }}>
              <div className="neu-inset-sm" style={{ width: '46px', height: '46px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--neu-text-title)', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--neu-text-body)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/" className="neu-btn neu-btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
