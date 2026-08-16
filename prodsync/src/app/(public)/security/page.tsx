import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Server, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Security — ProdSync',
  description: 'Enterprise security standards and practices at ProdSync.',
};

export default function SecurityPage() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
        <h1 className="text-h1" style={{ marginBottom: '1rem' }}>Enterprise Security</h1>
        <p style={{ color: 'var(--ps-text-secondary)', marginBottom: '3rem', fontSize: '1.0625rem' }}>
          ProdSync is built from the ground up with enterprise-grade data protection, confidentiality, and reliability.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { icon: <Shield size={24} />, title: 'SOC 2 Type II Certified', desc: 'Strict operational security controls and continuous auditing.' },
            { icon: <Lock size={24} />, title: 'End-to-End Encryption', desc: 'AES-256 at rest, TLS 1.3 in transit across all endpoints.' },
            { icon: <Server size={24} />, title: 'Dedicated Tenant Isolation', desc: 'Your proprietary catalog data is completely segregated.' },
            { icon: <CheckCircle size={24} />, title: 'Explainable AI Guardrails', desc: 'Audit trails for every AI extraction and enrichment action.' },
          ].map((item) => (
            <div key={item.title} className="ps-card" style={{ padding: '1.5rem' }}>
              <div style={{ color: 'var(--ps-primary)', marginBottom: '0.75rem' }}>{item.icon}</div>
              <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--ps-text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div>
          <Link href="/" className="ps-btn ps-btn-secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
