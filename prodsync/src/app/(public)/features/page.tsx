import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, ShieldCheck, Sparkles, Grid3X3, BarChart3, Bell, Upload, Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Features — ProdSync',
  description: 'Explore all ProdSync features for AI-powered product intelligence.',
};

const FEATURES = [
  { icon: <Search size={24} />, title: 'AI Extraction', desc: 'Extract product attributes from PDFs, websites, images, and datasheets with high accuracy.', color: '#2563eb', bg: '#eff6ff' },
  { icon: <ShieldCheck size={24} />, title: 'Validation Engine', desc: 'Detect conflicts, missing values, and inconsistencies across multiple source documents.', color: '#10b981', bg: '#d1fae5' },
  { icon: <Sparkles size={24} />, title: 'AI Enrichment', desc: 'Use contextual AI to intelligently fill missing product attributes with explainable suggestions.', color: '#8b5cf6', bg: '#ede9fe' },
  { icon: <Grid3X3 size={24} />, title: 'Structured Output', desc: 'Generate standardized, commerce-ready product records from any input format.', color: '#f59e0b', bg: '#fef3c7' },
  { icon: <BarChart3 size={24} />, title: 'Analytics', desc: 'Track data quality, validation rates, enrichment progress, and processing volumes.', color: '#0ea5e9', bg: '#e0f2fe' },
  { icon: <Bell size={24} />, title: 'Notifications', desc: 'Real-time alerts for processing completion, conflicts detected, and required reviews.', color: '#ef4444', bg: '#fee2e2' },
  { icon: <Upload size={24} />, title: 'Bulk Import', desc: 'Import thousands of products from PDF, CSV, XLSX, or URLs with drag-and-drop ease.', color: '#f59e0b', bg: '#fef3c7' },
  { icon: <Cpu size={24} />, title: 'Processing Pipeline', desc: 'Transparent, stage-by-stage AI processing with real-time status visibility.', color: '#8b5cf6', bg: '#ede9fe' },
];

export default function FeaturesPage() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="text-h1" style={{ marginBottom: '1rem' }}>
            Everything You Need for Product Intelligence
          </h1>
          <p className="text-body" style={{ color: 'var(--ps-text-secondary)', maxWidth: '560px', margin: '0 auto' }}>
            ProdSync provides a complete suite of AI-powered tools for extracting, validating, enriching, and structuring industrial product data.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
          }}
          className="features-grid"
        >
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: f.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: f.color,
                  marginBottom: '1.25rem',
                }}
              >
                {f.icon}
              </div>
              <h3 className="text-h3" style={{ marginBottom: '0.75rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ps-text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link href="/register" className="ps-btn ps-btn-primary ps-btn-lg">
            Get Started Free
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .features-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 640px) { .features-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
