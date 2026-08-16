import type { Metadata } from 'next';
import Link from 'next/link';
import { Upload, Cpu, ShieldCheck, Sparkles, UserCheck, Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works — ProdSync',
  description: 'Learn how ProdSync transforms scattered product data into intelligence.',
};

const STEPS = [
  { step: '01', icon: <Upload size={28} />, title: 'Import Product Information', desc: 'Upload PDF documents, spreadsheets, paste URLs, or manually enter product details. ProdSync accepts data from any source.', color: '#2563eb' },
  { step: '02', icon: <Cpu size={28} />, title: 'AI Processes Your Data', desc: 'Our multi-stage AI pipeline extracts, normalizes, and structures product attributes — transparently, with stage-by-stage visibility.', color: '#8b5cf6' },
  { step: '03', icon: <ShieldCheck size={28} />, title: 'Validate & Detect Issues', desc: 'The validation engine cross-checks data across sources, detects conflicts, flags missing values, and assigns quality scores.', color: '#10b981' },
  { step: '04', icon: <Sparkles size={28} />, title: 'Enrich Missing Information', desc: 'AI suggests values for missing attributes with confidence scores, source attribution, and clear reasoning — ready for your review.', color: '#f59e0b' },
  { step: '05', icon: <UserCheck size={28} />, title: 'Human Review & Approval', desc: 'Review AI suggestions, resolve conflicts, and approve important data. ProdSync is designed for human-in-the-loop control.', color: '#0ea5e9' },
  { step: '06', icon: <Package size={28} />, title: 'Export Commerce-Ready Products', desc: 'Export structured, validated, and enriched product records into any format or downstream commerce system.', color: '#059669' },
];

export default function HowItWorksPage() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="text-h1" style={{ marginBottom: '1rem' }}>
            How ProdSync Works
          </h1>
          <p className="text-body" style={{ color: 'var(--ps-text-secondary)', maxWidth: '540px', margin: '0 auto' }}>
            A transparent, six-stage journey from scattered product information to commerce-ready product intelligence.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {STEPS.map((step, i) => (
            <div
              key={step.step}
              style={{
                display: 'flex',
                gap: '2rem',
                alignItems: 'flex-start',
                position: 'relative',
              }}
            >
              {/* Step indicator + line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `${step.color}18`,
                    border: `2px solid ${step.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: step.color,
                    position: 'relative',
                    zIndex: 1,
                    flexShrink: 0,
                  }}
                >
                  {step.icon}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      width: '2px',
                      height: '60px',
                      background: 'var(--ps-border)',
                      marginTop: '4px',
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div style={{ paddingBottom: i < STEPS.length - 1 ? '2rem' : 0 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: step.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                  Step {step.step}
                </div>
                <h3 className="text-h3" style={{ marginBottom: '0.625rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--ps-text-secondary)', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/register" className="ps-btn ps-btn-primary ps-btn-lg">
            Start Your First Import
          </Link>
        </div>
      </div>
    </div>
  );
}
