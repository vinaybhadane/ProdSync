import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Shield, Cpu, Target, Award, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About — ProdSync AI',
  description: 'ProdSync is an AI-powered Product Intelligence platform for industrial commerce.',
};

const PRINCIPLES = [
  {
    icon: <Shield size={22} color="#059669" />,
    title: 'Explainable AI Over Black Boxes',
    desc: 'Every extracted number traces to exact page coordinates, bounding boxes, and manufacturer sentences. We never hide how results were derived.',
  },
  {
    icon: <Cpu size={22} color="#2563eb" />,
    title: 'Deterministic Physics Constraints',
    desc: 'LLMs are paired with physical boundary validation (voltages, temperatures, mechanical limits) to eliminate hallucinations completely.',
  },
  {
    icon: <Lock size={22} color="#7c3aed" />,
    title: 'Enterprise Data Confidentiality',
    desc: 'Your catalog IP and proprietary distributor pricing are never used to train public foundation models. Complete multi-tenant isolation.',
  },
  {
    icon: <Target size={22} color="#d97706" />,
    title: 'Human-in-the-Loop Authority',
    desc: 'AI automates the 90% repetitive grunt work while granting domain engineers total supervisory control over catalog approvals.',
  },
];

export default function AboutPage() {
  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Title Banner */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="neu-badge neu-badge-purple" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} />
            <span>Our Mission & Vision</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 800,
              color: 'var(--neu-text-title)',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              marginBottom: '1.25rem',
            }}
          >
            Built for Industrial Commerce.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Powered by Verified AI.
            </span>
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--neu-text-body)',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            ProdSync was born from a fundamental problem: industrial companies are drowning in
            unstructured product documents, but starving for structured product intelligence.
          </p>
        </div>

        {/* Story Section in Neumorphic Card */}
        <div className="neu-card" style={{ padding: '2.5rem', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--neu-text-title)', marginBottom: '1rem' }}>
            The Genesis of ProdSync
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--neu-text-body)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            In consumer commerce, products have basic attributes like color and size. But in industrial
            manufacturing, a single variable frequency drive or hydraulic valve possesses over 40 technical
            parameters — operating temperatures, burst pressure ratings, IP ingress ratings, and international
            compliance standards.
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--neu-text-body)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            For decades, catalog teams have manually copied and pasted these specs from PDF datasheets into ERPs,
            spending weeks per product line and introducing fatal data errors. We engineered ProdSync to transform
            unstructured documents into structured, validated, and commerce-ready product intelligence automatically.
          </p>

          {/* Mission Inset Highlight */}
          <div
            className="neu-inset"
            style={{
              padding: '1.5rem 2rem',
              borderLeft: '4px solid var(--neu-primary)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neu-primary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Our Core Mission
            </div>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--neu-text-title)', margin: 0, lineHeight: 1.5 }}>
              &ldquo;Turn fragmented industrial product information into trusted, mathematically verified product intelligence — at global scale.&rdquo;
            </p>
          </div>
        </div>

        {/* 4 Architectural Principles Grid */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--neu-text-title)', marginBottom: '0.5rem' }}>
              Our Core Principles
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--neu-text-muted)' }}>
              How we approach artificial intelligence in high-stakes engineering domains
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="neu-card" style={{ padding: '1.75rem' }}>
                <div
                  className="neu-inset-sm"
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  {p.icon}
                </div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--neu-text-title)', marginBottom: '0.5rem' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--neu-text-body)', lineHeight: 1.6, margin: 0 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="neu-raised-xl"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--neu-text-title)', marginBottom: '0.75rem' }}>
            Join the Next Generation of Product Intelligence
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--neu-text-body)', maxWidth: '480px', margin: '0 auto 2rem' }}>
            Start building your catalog on ProdSync today and experience explainable industrial AI.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/register"
              className="neu-btn neu-btn-primary"
              style={{
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                gap: '0.5rem',
              }}
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/features"
              className="neu-btn neu-btn-secondary"
              style={{
                padding: '0.875rem 1.75rem',
                fontSize: '1rem',
              }}
            >
              Explore Features
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
