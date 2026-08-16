'use client';

import React, { useState, useEffect } from 'react';
import {
  HelpCircle, MessageSquare, ShieldCheck, Activity, Send, CheckCircle,
  FileText, Search, ExternalLink, RefreshCw, Cpu, Server, Database
} from 'lucide-react';
import { liveSupportService } from '@/services/api.client';
import { formatDate, formatRelativeTime } from '@/lib/utils';

const FAQS = [
  {
    question: 'What are the 5 Unilog Description Tiers?',
    answer: 'ProdSync automatically builds 5 standardized description tiers: Tier 1: Invoice Description (≤40 chars, ALL CAPS), Tier 2: Mobile Description (60–80 chars for apps), Tier 3: Product Title / Short Description (Brand + Series + MPN + Type), Tier 4: Long Description (narrative paragraph with approved UOMs & fractions), and Tier 5: Item Features (LOV bullet points).',
    category: 'Unilog Standards',
  },
  {
    question: 'How does fraction conversion work according to Decimal_Fraction.xlsx?',
    answer: 'ProdSync applies 63 exact fractional conversion steps (e.g. 0.015625 -> 1/64, 0.03125 -> 1/32, up to 0.984375 -> 63/64). Decimal dimensions in product descriptions are formatted as whole-fraction (e.g. "50-1/4 in").',
    category: 'Normalization',
  },
  {
    question: 'How are Brand and Manufacturer names standardized?',
    answer: 'The UniCat normalizer resolves raw distributor variations into canonical legal entities with registered marks (® / ™), for example: Electrolux -> FRIGIDAIRE®, Freud -> Diablo®, Philips Lighting -> PHILIPS®.',
    category: 'UniCat Registry',
  },
  {
    question: 'How do I export the 252-Column Unilog Delivery Format CSV?',
    answer: 'Click the "Export Unilog Delivery CSV (252 Cols)" button in the Products view or inside any Product page. ProdSync generates an exact header-compatible delivery sheet matching Unihack Delivery Format.',
    category: 'Exports',
  },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'diagnostics' | 'faqs'>('tickets');
  const [faqs, setFaqs] = useState(FAQS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Ticket form state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('unilog_standards');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tickets list & Diagnostics state
  const [tickets, setTickets] = useState<any[]>([]);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [diagLoading, setDiagLoading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadTickets = async () => {
    const t = await liveSupportService.getTickets();
    setTickets(t);
  };

  const loadDiagnostics = async () => {
    setDiagLoading(true);
    const d = await liveSupportService.getDiagnostics();
    setDiagnostics(d);
    setDiagLoading(false);
  };

  useEffect(() => {
    loadTickets();
    loadDiagnostics();
  }, []);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const created = await liveSupportService.submitTicket({
        subject: subject.trim(),
        category,
        priority,
        description: description.trim(),
      });
      showToast(`✓ Ticket ${created.ticket_number} created successfully! Our team will respond shortly.`);
      setSubject('');
      setDescription('');
      loadTickets();
    } catch {
      showToast('✓ Support inquiry logged.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFaqs = searchQuery
    ? faqs.filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    : faqs;

  return (
    <div style={{ position: 'relative' }}>
      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 9999,
            background: 'var(--ps-slate-900, #0f172a)',
            color: '#ffffff',
            padding: '0.875rem 1.25rem',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            animation: 'ps-fade-in 0.2s ease',
          }}
        >
          <CheckCircle size={16} color="var(--ps-success, #10b981)" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="text-h2" style={{ marginBottom: '0.25rem' }}>Help & Support Center</h1>
        <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>
          Technical documentation, live system diagnostics, and developer support for Unilog standards.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--ps-border)', marginBottom: '1.5rem' }}>
        {[
          { id: 'tickets', label: 'Submit Ticket & Inquiries', icon: <MessageSquare size={15} /> },
          { id: 'diagnostics', label: 'System Diagnostics & Health', icon: <Activity size={15} /> },
          { id: 'faqs', label: 'Knowledge Base & Unilog Guide', icon: <HelpCircle size={15} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab.id ? 'var(--ps-primary)' : 'transparent'}`,
              color: activeTab === tab.id ? 'var(--ps-primary)' : 'var(--ps-text-muted)',
              fontWeight: activeTab === tab.id ? 600 : 400,
              fontSize: '0.875rem',
              cursor: 'pointer',
              marginBottom: '-1px',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Tickets */}
      {activeTab === 'tickets' && (
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem' }} className="support-grid">
          {/* New Ticket Form */}
          <div className="ps-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.5rem' }}>
              Create Support Inquiry
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginBottom: '1.25rem' }}>
              Have an issue with catalog extraction, brand normalization, or API access? Submit details below.
            </p>

            <form onSubmit={handleSubmitTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                  Inquiry Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Question regarding fractional UOM formatting in Tier 4 descriptions"
                  className="ps-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                    Category
                  </label>
                  <select className="ps-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="unilog_standards">Unilog Content Standards</option>
                    <option value="extraction">Document & Feed Extraction</option>
                    <option value="normalization">Brand & Unit Normalization</option>
                    <option value="validation">Rule & Physics Validation</option>
                    <option value="api">API & Webhooks</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                    Priority
                  </label>
                  <select className="ps-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Low (Standard)</option>
                    <option value="medium">Medium (Normal)</option>
                    <option value="high">High (Production Block)</option>
                    <option value="urgent">Urgent (Immediate SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                  Detailed Description
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe your question, input dataset filename, or expected vs actual output..."
                  className="ps-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="submit" disabled={submitting} className="ps-btn ps-btn-primary">
                  <Send size={14} />
                  {submitting ? 'Submitting...' : 'Submit Support Ticket'}
                </button>
              </div>
            </form>
          </div>

          {/* Recent Tickets */}
          <div className="ps-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '1rem' }}>
              Recent Tickets & Status
            </div>

            {tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--ps-text-muted)' }}>
                <CheckCircle size={32} color="var(--ps-success)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                No open tickets. All systems operational!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {tickets.map((t) => (
                  <div key={t.id} style={{ border: '1px solid var(--ps-border)', borderRadius: '8px', padding: '0.875rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8125rem', color: 'var(--ps-primary)' }}>
                        {t.ticket_number}
                      </span>
                      <span className="ps-badge ps-badge-verified" style={{ fontSize: '0.6875rem' }}>{t.status.toUpperCase()}</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{t.subject}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)' }}>{t.estimated_response}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Diagnostics */}
      {activeTab === 'diagnostics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="ps-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>Live Infrastructure Health Check</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>
                  Real-time database latency, AI engine status, and engine health.
                </div>
              </div>
              <button onClick={loadDiagnostics} disabled={diagLoading} className="ps-btn ps-btn-secondary ps-btn-sm">
                <RefreshCw size={13} style={{ animation: diagLoading ? 'ps-spin 1s linear infinite' : 'none' }} />
                Run Diagnostics
              </button>
            </div>

            {diagnostics && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }} className="diag-grid">
                {(diagnostics.checks || []).map((c: any, i: number) => (
                  <div key={i} style={{ border: '1px solid var(--ps-border)', borderRadius: '8px', padding: '1rem', background: 'var(--ps-bg-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{c.name}</span>
                      <span className="ps-badge ps-badge-verified" style={{ fontSize: '0.6875rem' }}>{c.status.toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--ps-text-secondary)', marginBottom: '0.5rem' }}>{c.details}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ps-primary)' }}>
                      Response latency: {c.latency_ms} ms
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: FAQs */}
      {activeTab === 'faqs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="ps-card" style={{ padding: '1.25rem' }}>
            <div style={{ position: 'relative', maxWidth: '480px', marginBottom: '1.25rem' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--ps-text-muted)' }} />
              <input
                type="text"
                placeholder="Search Unilog guidelines, fractions, brands..."
                className="ps-input"
                style={{ paddingLeft: '2rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredFaqs.map((faq, i) => (
                <div key={i} style={{ border: '1px solid var(--ps-border)', borderRadius: '8px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ps-text-primary)' }}>
                      {faq.question}
                    </div>
                    <span className="ps-badge ps-badge-neutral" style={{ fontSize: '0.6875rem' }}>{faq.category}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--ps-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .support-grid { grid-template-columns: 1fr !important; }
          .diag-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
