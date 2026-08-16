import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, Users, Boxes, Factory } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solutions — ProdSync',
  description: 'ProdSync solutions for industrial suppliers, procurement teams, and catalog managers.',
};

const SOLUTIONS = [
  { icon: <Building2 size={28} />, title: 'Industrial Suppliers', desc: 'Manage thousands of SKUs with consistent, validated product data that integrates with e-commerce and procurement platforms.', color: '#2563eb', bg: '#eff6ff', cta: 'Learn More' },
  { icon: <Users size={28} />, title: 'Procurement Teams', desc: 'Verify supplier-provided product data at scale. Detect inconsistencies, confirm specifications, and maintain data quality standards.', color: '#10b981', bg: '#d1fae5', cta: 'Learn More' },
  { icon: <Boxes size={28} />, title: 'Catalog Managers', desc: 'Build, maintain, and export commerce-ready product catalogs. Automate enrichment and keep data fresh and accurate.', color: '#8b5cf6', bg: '#ede9fe', cta: 'Learn More' },
  { icon: <Factory size={28} />, title: 'Technical Sales', desc: 'Access structured, reliable technical specifications that can be used in quotes, proposals, and customer communications.', color: '#f59e0b', bg: '#fef3c7', cta: 'Learn More' },
];

export default function SolutionsPage() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="text-h1" style={{ marginBottom: '1rem' }}>Solutions for Industrial Commerce</h1>
          <p className="text-body" style={{ color: 'var(--ps-text-secondary)', maxWidth: '540px', margin: '0 auto' }}>
            ProdSync is built for the specific needs of industrial product teams — from suppliers to procurement to catalog management.
          </p>
        </div>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '2rem' }}
          className="solutions-grid"
        >
          {SOLUTIONS.map((s) => (
            <div key={s.title} className="feature-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                {s.icon}
              </div>
              <div>
                <h3 className="text-h3" style={{ marginBottom: '0.625rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--ps-text-secondary)', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
              <Link href="/register" className="ps-btn ps-btn-secondary" style={{ alignSelf: 'flex-start' }}>
                {s.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { .solutions-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
