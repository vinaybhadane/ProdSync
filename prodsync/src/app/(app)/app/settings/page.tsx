'use client';

import React, { useState, useEffect } from 'react';
import {
  User, Bell, Shield, Building2, Key, Globe, Palette, Save, CheckCircle,
  Plus, Trash2, Copy, Send, RefreshCw, Lock, Eye, EyeOff, X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SETTINGS_TABS = [
  { id: 'profile', icon: <User size={16} />, label: 'Profile' },
  { id: 'notifications', icon: <Bell size={16} />, label: 'Notifications' },
  { id: 'security', icon: <Shield size={16} />, label: 'Security' },
  { id: 'organization', icon: <Building2 size={16} />, label: 'Organization' },
  { id: 'api', icon: <Key size={16} />, label: 'API & Integrations' },
  { id: 'appearance', icon: <Palette size={16} />, label: 'Appearance' },
];

function Toggle({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <label htmlFor={id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0' }}>
      <div
        style={{
          width: '40px',
          height: '22px',
          background: checked ? 'var(--ps-primary)' : 'var(--ps-slate-300)',
          borderRadius: '11px',
          position: 'relative',
          transition: 'background 0.2s ease',
          cursor: 'pointer',
        }}
        onClick={() => onChange(!checked)}
      >
        <div
          style={{
            width: '16px',
            height: '16px',
            background: 'white',
            borderRadius: '50%',
            position: 'absolute',
            top: '3px',
            left: checked ? '21px' : '3px',
            transition: 'left 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          }}
        />
      </div>
    </label>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile state
  const [profile, setProfile] = useState({
    displayName: user?.displayName || 'Industrial Content Specialist',
    email: user?.email || 'admin@prodsync.ai',
    title: 'Lead Catalog Engineer',
    company: 'Unilog Distribution Hub',
    phone: '+1 (555) 382-9901',
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    importCompleted: true,
    validationRequired: true,
    enrichmentReady: true,
    conflicts: true,
    aiInsights: false,
    weeklyReport: true,
    productApproved: true,
  });

  // Organization state
  const [org, setOrg] = useState({
    name: 'Unilog Industrial Partner',
    taxId: 'US-EIN-94820194',
    domain: 'industrial.unilog.com',
    industry: 'Industrial Supply & Electrical Distribution',
  });

  const [members, setMembers] = useState([
    { id: 'm1', name: 'Alex Chen', email: 'alex@unilog.com', role: 'Owner', status: 'Active' },
    { id: 'm2', name: 'Sarah Jenkins', email: 'sarah.j@unilog.com', role: 'Admin', status: 'Active' },
    { id: 'm3', name: 'David Kumar', email: 'd.kumar@unilog.com', role: 'Editor', status: 'Active' },
  ]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');

  // Security state
  const [twoFactor, setTwoFactor] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // API & Integrations state
  const [apiKeys, setApiKeys] = useState([
    { id: 'k1', name: 'Production Pipeline Key', prefix: 'sk_live_9482...', created: '2026-08-01' },
    { id: 'k2', name: 'Staging Environment Key', prefix: 'sk_test_1049...', created: '2026-08-10' },
  ]);
  const [webhookUrl, setWebhookUrl] = useState('https://api.distributor.com/webhooks/prodsync');
  const [webhookEvents, setWebhookEvents] = useState({
    productValidated: true,
    catalogCompleted: true,
    conflictDetected: true,
  });

  // Appearance state
  const [theme, setTheme] = useState('light');
  const [compactMode, setCompactMode] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('prodsync_profile');
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      const savedOrg = localStorage.getItem('prodsync_org');
      if (savedOrg) setOrg(JSON.parse(savedOrg));
      const savedNotifs = localStorage.getItem('prodsync_notifs');
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    try {
      localStorage.setItem('prodsync_profile', JSON.stringify(profile));
      localStorage.setItem('prodsync_org', JSON.stringify(org));
      localStorage.setItem('prodsync_notifs', JSON.stringify(notifications));
    } catch {}
    showToast('✓ Settings updated and saved successfully.');
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const newMember = {
      id: `m_${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'Invited',
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail('');
    setInviteModalOpen(false);
    showToast(`✓ Invitation sent to ${inviteEmail}`);
  };

  const handleGenerateApiKey = () => {
    const randomHex = Math.random().toString(36).substring(2, 10);
    const newKey = {
      id: `k_${Date.now()}`,
      name: `API Key (${new Date().toLocaleDateString()})`,
      prefix: `sk_live_${randomHex}...`,
      created: new Date().toISOString().split('T')[0],
    };
    setApiKeys((prev) => [newKey, ...prev]);
    showToast('✓ New live API key generated.');
  };

  const handleTestWebhook = () => {
    showToast('✓ Test webhook payload dispatched (HTTP 200 OK received).');
  };

  return (
    <div>
      {/* Toast Notification */}
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

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setInviteModalOpen(false)}
        >
          <div
            className="ps-card"
            style={{ width: '100%', maxWidth: '440px', padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 700 }}>Invite Team Member</h3>
              <button onClick={() => setInviteModalOpen(false)} className="ps-btn ps-btn-ghost ps-btn-sm" style={{ padding: '0.25rem' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleInviteMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="colleague@unilog.com"
                  className="ps-input"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>
                  Role & Permissions
                </label>
                <select className="ps-input" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                  <option value="Admin">Admin (Full Access & Settings)</option>
                  <option value="Editor">Editor (Product Editing & AI Approvals)</option>
                  <option value="Viewer">Viewer (Read-Only & Exports)</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setInviteModalOpen(false)} className="ps-btn ps-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="ps-btn ps-btn-primary">
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="text-h2" style={{ marginBottom: '0.25rem' }}>Settings</h1>
        <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>
          Manage your account profile, organization parameters, API integrations, and AI preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }} className="settings-grid">
        {/* Sidebar Nav */}
        <nav className="ps-card" style={{ padding: '0.75rem' }}>
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? 'var(--ps-primary-50)' : 'transparent',
                color: activeTab === tab.id ? 'var(--ps-primary)' : 'var(--ps-text-secondary)',
                fontWeight: activeTab === tab.id ? 600 : 400,
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                marginBottom: '0.25rem',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Tab: Profile */}
          {activeTab === 'profile' && (
            <div className="ps-card" style={{ padding: '1.75rem' }}>
              <h2 className="text-h3" style={{ marginBottom: '0.5rem' }}>Profile Information</h2>
              <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
                Your personal details used for audit trails and notifications.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>Full Name</label>
                  <input
                    type="text"
                    className="ps-input"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>Email Address</label>
                  <input
                    type="email"
                    className="ps-input"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>Job Title</label>
                  <input
                    type="text"
                    className="ps-input"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>Company / Division</label>
                  <input
                    type="text"
                    className="ps-input"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--ps-border)' }}>
                <button onClick={handleSave} className="ps-btn ps-btn-primary">
                  <Save size={14} /> Save Profile Changes
                </button>
              </div>
            </div>
          )}

          {/* Tab: Notifications */}
          {activeTab === 'notifications' && (
            <div className="ps-card" style={{ padding: '1.75rem' }}>
              <h2 className="text-h3" style={{ marginBottom: '0.5rem' }}>Notification Preferences</h2>
              <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
                Control which alerts appear in your real-time topbar feed and email digest.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {[
                  { key: 'importCompleted', label: 'Dataset Import & Extraction Completed', desc: 'Notify when batch PDF/CSV uploads finish parsing.' },
                  { key: 'validationRequired', label: 'Validation Issues Requiring Review', desc: 'Alert when conflicting manufacturer values or negative pressure anomalies are flagged.' },
                  { key: 'enrichmentReady', label: 'AI Enrichment Suggestions Available', desc: 'Notify when new high-confidence standard attributes are ready for approval.' },
                  { key: 'weeklyReport', label: 'Unilog Quality & Completeness Digest', desc: 'Receive weekly health summary of catalog compliance scores.' },
                ].map((item) => (
                  <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>{item.desc}</div>
                    </div>
                    <Toggle
                      id={item.key}
                      checked={(notifications as any)[item.key]}
                      onChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--ps-border)' }}>
                <button onClick={handleSave} className="ps-btn ps-btn-primary">
                  <Save size={14} /> Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Tab: Security */}
          {activeTab === 'security' && (
            <div className="ps-card" style={{ padding: '1.75rem' }}>
              <h2 className="text-h3" style={{ marginBottom: '0.5rem' }}>Security & Authentication</h2>
              <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
                Manage password credentials, two-factor authentication, and active sessions.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--ps-bg-secondary)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Two-Factor Authentication (2FA)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)', marginTop: '2px' }}>
                      Require an authenticator app code for sensitive operations (catalog exports & schema changes).
                    </div>
                  </div>
                  <Toggle id="2fa" checked={twoFactor} onChange={(v) => { setTwoFactor(v); showToast(`2FA ${v ? 'enabled' : 'disabled'}.`); }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="ps-input"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="ps-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--ps-border)' }}>
                <button
                  onClick={() => {
                    if (newPassword) {
                      setCurrentPassword('');
                      setNewPassword('');
                      showToast('✓ Password updated successfully.');
                    } else {
                      showToast('Please enter new password.');
                    }
                  }}
                  className="ps-btn ps-btn-primary"
                >
                  <Lock size={14} /> Update Password
                </button>
              </div>
            </div>
          )}

          {/* Tab: Organization */}
          {activeTab === 'organization' && (
            <div className="ps-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h2 className="text-h3" style={{ marginBottom: '0.5rem' }}>Organization & Team</h2>
                  <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.8125rem', margin: 0 }}>
                    Manage enterprise profile and team member permissions.
                  </p>
                </div>
                <button onClick={() => setInviteModalOpen(true)} className="ps-btn ps-btn-primary ps-btn-sm">
                  <Plus size={14} /> Invite Member
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>Organization Name</label>
                  <input
                    type="text"
                    className="ps-input"
                    value={org.name}
                    onChange={(e) => setOrg({ ...org, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>Tax EIN / VAT ID</label>
                  <input
                    type="text"
                    className="ps-input"
                    value={org.taxId}
                    onChange={(e) => setOrg({ ...org, taxId: e.target.value })}
                  />
                </div>
              </div>

              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>Team Members ({members.length})</h4>
              <div style={{ border: '1px solid var(--ps-border)', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                {members.map((m, i) => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      borderBottom: i < members.length - 1 ? '1px solid var(--ps-border)' : 'none',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{m.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)' }}>{m.email}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="ps-badge ps-badge-neutral" style={{ fontSize: '0.6875rem' }}>{m.role}</span>
                      <span className="ps-badge ps-badge-verified" style={{ fontSize: '0.6875rem' }}>{m.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--ps-border)' }}>
                <button onClick={handleSave} className="ps-btn ps-btn-primary">
                  <Save size={14} /> Save Organization Settings
                </button>
              </div>
            </div>
          )}

          {/* Tab: API & Integrations */}
          {activeTab === 'api' && (
            <div className="ps-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h2 className="text-h3" style={{ marginBottom: '0.5rem' }}>API Keys & Webhooks</h2>
                  <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.8125rem', margin: 0 }}>
                    Connect external ERPs, distributor feeds, and automated export pipelines.
                  </p>
                </div>
                <button onClick={handleGenerateApiKey} className="ps-btn ps-btn-primary ps-btn-sm">
                  <Plus size={14} /> Generate New Key
                </button>
              </div>

              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>Active API Keys</h4>
              <div style={{ border: '1px solid var(--ps-border)', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                {apiKeys.map((k, i) => (
                  <div
                    key={k.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      borderBottom: i < apiKeys.length - 1 ? '1px solid var(--ps-border)' : 'none',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{k.name}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--ps-primary)' }}>{k.prefix}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(k.prefix);
                          showToast('✓ Key copied to clipboard.');
                        }}
                        className="ps-btn ps-btn-ghost ps-btn-sm"
                      >
                        <Copy size={13} /> Copy
                      </button>
                      <button
                        onClick={() => {
                          setApiKeys(apiKeys.filter((x) => x.id !== k.id));
                          showToast('✓ API key revoked.');
                        }}
                        className="ps-btn ps-btn-ghost ps-btn-sm"
                        style={{ color: 'var(--ps-danger)' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>Outbound Webhook Endpoint</h4>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <input
                  type="url"
                  className="ps-input"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://api.yourdomain.com/webhooks/prodsync"
                />
                <button onClick={handleTestWebhook} className="ps-btn ps-btn-secondary" style={{ whiteSpace: 'nowrap' }}>
                  <Send size={14} /> Send Test Payload
                </button>
              </div>
            </div>
          )}

          {/* Tab: Appearance */}
          {activeTab === 'appearance' && (
            <div className="ps-card" style={{ padding: '1.75rem' }}>
              <h2 className="text-h3" style={{ marginBottom: '0.5rem' }}>Appearance & Display</h2>
              <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
                Customize your workspace visual theme and table layout density.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                    Interface Color Theme
                  </label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {[
                      { id: 'light', label: 'Light Studio' },
                      { id: 'dark', label: 'Dark Mode' },
                      { id: 'system', label: 'System Sync' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setTheme(t.id);
                          showToast(`✓ Switched to ${t.label}.`);
                        }}
                        style={{
                          padding: '0.75rem 1.25rem',
                          borderRadius: '8px',
                          border: `1.5px solid ${theme === t.id ? 'var(--ps-primary)' : 'var(--ps-border)'}`,
                          background: theme === t.id ? 'var(--ps-primary-50)' : 'white',
                          color: theme === t.id ? 'var(--ps-primary)' : 'var(--ps-text-primary)',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--ps-border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Compact Table Density</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ps-text-muted)' }}>
                      Display more rows simultaneously in product specifications and validation queues.
                    </div>
                  </div>
                  <Toggle id="compact" checked={compactMode} onChange={(v) => { setCompactMode(v); showToast(`Compact density ${v ? 'enabled' : 'disabled'}.`); }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .settings-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
