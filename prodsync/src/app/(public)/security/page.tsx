import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Server, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Enterprise Security & Governance — ProdSync AI',
  description: 'Learn about ProdSync enterprise security standards, multi-tenant isolation, and SSRF protection.',
};

export default function SecurityPage() {
  return (
    <div style={{ paddingTop: '100px', backgroundColor: '#ffffff', paddingBottom: '5rem' }}>
      <section style={{ padding: '4rem 1.5rem 3rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <div className="neu-badge neu-badge-teal" style={{ marginBottom: '1rem' }}>
            <Shield size={13} />
            <span>Enterprise Protection</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
              fontWeight: 800,
              color: '#0a192f',
              letterSpacing: '-0.03em',
              marginBottom: '1rem',
            }}
          >
            Enterprise Security &amp; Data Governance
          </h1>
          <p style={{ color: '#475569', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            ProdSync is engineered from the ground up with enterprise-grade data protection, multi-tenant isolation, 
            and continuous audit trails.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          {[
            { icon: <Shield size={22} color="#00a896" />, title: 'SOC 2 Type II Certified', desc: 'Strict operational security controls, continuous telemetry monitoring, and annual independent external audit attestation.' },
            { icon: <Lock size={22} color="#2563eb" />, title: 'End-to-End Encryption', desc: 'AES-256 encryption at rest, TLS 1.3 in transit across all backend endpoints and secure Azure Blob Storage containers.' },
            { icon: <Server size={22} color="#3b82f6" />, title: 'Dedicated Multi-Tenant Isolation', desc: 'Your proprietary catalog data and distributor pricing formulas are strictly isolated by organization ID in the database.' },
            { icon: <CheckCircle2 size={22} color="#059669" />, title: 'Zero Foundation Training', desc: 'Your confidential catalog IP is never used to train public foundation models or shared across tenant boundaries.' },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1.75rem',
                boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/" className="neu-btn neu-btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', borderRadius: '6px' }}>
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
