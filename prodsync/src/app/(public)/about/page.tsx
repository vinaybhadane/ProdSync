import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Shield, Cpu, Target, Award, ArrowRight, CheckCircle2, Lock, Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About ProdSync — Enterprise Industrial AI',
  description: 'Learn about ProdSync AI and our mission to standardize technical product data for B2B industrial commerce.',
};

const PRINCIPLES = [
  {
    icon: <Shield size={22} color="#00a896" />,
    title: 'Explainable AI Over Black Boxes',
    desc: 'Every extracted number traces to exact page coordinates, bounding boxes, and manufacturer sentences. We never hide how results were derived.',
  },
  {
    icon: <Cpu size={22} color="#2563eb" />,
    title: 'Deterministic Physics & LOV Constraints',
    desc: 'LLMs are paired with physical boundary validation (voltages, temperatures, mechanical limits) to eliminate hallucinations completely.',
  },
  {
    icon: <Lock size={22} color="#3b82f6" />,
    title: 'Enterprise Data Confidentiality',
    desc: 'Your catalog IP and proprietary distributor pricing are never used to train public foundation models. Complete multi-tenant isolation.',
  },
  {
    icon: <Target size={22} color="#059669" />,
    title: 'Human-in-the-Loop Supervisory Authority',
    desc: 'AI automates the 90% repetitive grunt work while granting domain engineers total supervisory control over catalog approvals.',
  },
];

export default function AboutPage() {
  return (
    <div style={{ paddingTop: '100px', backgroundColor: '#ffffff', paddingBottom: '5rem' }}>
      {/* Title Header */}
      <section style={{ padding: '4rem 1.5rem 3rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <div className="neu-badge neu-badge-blue" style={{ marginBottom: '1rem' }}>
            <Sparkles size={13} />
            <span>Our Mission & Principles</span>
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
            Built for Industrial Commerce.{' '}
            <span style={{ color: '#2563eb' }}>Powered by Verified AI.</span>
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: '#475569',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            ProdSync was engineered to solve a fundamental industrial bottleneck: companies are drowning in 
            unstructured product documents, but starving for structured product intelligence.
          </p>
        </div>
      </section>

      {/* Main Content & Story */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 1.5rem 2rem' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
            marginBottom: '3.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0a192f', marginBottom: '1rem' }}>
            The Genesis of ProdSync
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            In consumer commerce, products have basic attributes like color and size. But in industrial
            manufacturing, a single variable frequency drive or hydraulic valve possesses over 40 technical
            parameters — operating temperatures, burst pressure ratings, IP ingress ratings, and international
            compliance standards.
          </p>
          <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            For decades, catalog teams have manually copied and pasted these specs from PDF datasheets into ERPs,
            spending weeks per product line and introducing fatal data errors. We engineered ProdSync to transform
            unstructured documents into structured, validated, and commerce-ready product intelligence automatically.
          </p>

          <div
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#f8fafc',
              borderLeft: '4px solid #2563eb',
              borderRadius: '0 8px 8px 0',
            }}
          >
            <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a', margin: 0, fontStyle: 'italic' }}>
              &ldquo;Our mission is to eliminate data chaos across the industrial supply chain by establishing 
              an autonomous, explainable, and certified standard for technical product specifications.&rdquo;
            </p>
          </div>
        </div>

        {/* 4 Guiding Principles Grid */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0a192f', marginBottom: '1.75rem', textAlign: 'center' }}>
          Our Engineering Principles
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
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
                {p.icon}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                {p.title}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '3.5rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', marginTop: '3rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0a192f', marginBottom: '0.75rem' }}>
            Join the Next Era of Industrial Product Intelligence
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#475569', marginBottom: '1.75rem' }}>
            Start automating your catalog enrichment with ProdSync today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link
              href="/register"
              className="neu-btn neu-btn-primary"
              style={{ padding: '0.75rem 1.75rem', fontSize: '0.875rem', borderRadius: '6px' }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
