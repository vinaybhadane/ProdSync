'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, FolderOpen, Upload, Cpu, ShieldCheck,
  Sparkles, BarChart3, Activity, Settings, HelpCircle, ChevronLeft,
  ChevronRight, LogOut, User, Building2,
} from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';

const NAV_SECTIONS = [
  {
    label: null,
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/app/dashboard' },
      { icon: Package, label: 'Products', href: '/app/products' },
      { icon: FolderOpen, label: 'Catalogs', href: '/app/catalogs' },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { icon: Upload, label: 'Import Data', href: '/app/import' },
      { icon: Cpu, label: 'AI Processing', href: '/app/processing' },
      { icon: ShieldCheck, label: 'Validation', href: '/app/validation' },
      { icon: Sparkles, label: 'Enrichment', href: '/app/enrichment' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { icon: BarChart3, label: 'Analytics', href: '/app/analytics' },
      { icon: Activity, label: 'Activity', href: '/app/activity' },
    ],
  },
];

const BOTTOM_ITEMS = [
  { icon: Settings, label: 'Settings', href: '/app/settings' },
  { icon: HelpCircle, label: 'Help & Support', href: '/app/support' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, organization, signOut } = useAuth();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 45,
          }}
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`app-sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}
        aria-label="Application sidebar"
      >
        {/* Logo header */}
        <div
          style={{
            padding: '1rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '60px',
          }}
        >
          {!collapsed && <Logo variant="light" size="sm" />}
          {collapsed && (
            <div style={{ margin: '0 auto' }}>
              <Logo variant="icon" size="sm" />
            </div>
          )}
          {!collapsed && (
            <button
              onClick={onToggle}
              className="ps-btn ps-btn-ghost"
              style={{
                color: 'var(--ps-slate-500)',
                padding: '0.375rem',
                borderRadius: '6px',
                flexShrink: 0,
              }}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Collapsed expand button */}
        {collapsed && (
          <button
            onClick={onToggle}
            className="ps-btn"
            style={{
              color: 'var(--ps-slate-500)',
              padding: '0.5rem',
              margin: '0.5rem auto',
              display: 'flex',
              borderRadius: '6px',
              background: 'transparent',
              border: 'none',
            }}
            aria-label="Expand sidebar"
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Organization Scope Pill */}
        {!collapsed && (
          <div style={{ padding: '0.75rem 1rem 0.25rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.375rem 0.625rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.08)',
                overflow: 'hidden',
              }}
            >
              <Building2 size={13} color="var(--ps-primary, #3b82f6)" style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--ps-slate-200, #e2e8f0)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {organization?.name || 'Organization Workspace'}
              </span>
            </div>
          </div>
        )}

        {/* Navigation items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
          {NAV_SECTIONS.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '1.25rem' }}>
              {section.label && !collapsed && (
                <div
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--ps-slate-600)',
                    padding: '0 0.5rem',
                    marginBottom: '0.375rem',
                  }}
                >
                  {section.label}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onMobileClose}
                      className={`nav-item${active ? ' active' : ''}`}
                      title={collapsed ? item.label : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: collapsed ? '0.625rem' : '0.5rem 0.75rem',
                        borderRadius: '6px',
                        color: active ? 'white' : 'var(--ps-slate-400)',
                        background: active ? 'var(--ps-primary)' : 'transparent',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: active ? 600 : 400,
                        transition: 'all 0.15s ease',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                      }}
                    >
                      <Icon size={18} style={{ flexShrink: 0 }} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom actions & user */}
        <div
          style={{
            padding: '0.75rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          {BOTTOM_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={`nav-item${active ? ' active' : ''}`}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: collapsed ? '0.625rem' : '0.5rem 0.75rem',
                  borderRadius: '6px',
                  color: active ? 'white' : 'var(--ps-slate-400)',
                  background: active ? 'var(--ps-primary)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 400,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          {/* User profile row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem',
              marginTop: '0.5rem',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user?.displayName || 'User'}
                referrerPolicy="no-referrer"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--ps-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {user?.displayName?.[0]?.toUpperCase() ?? <User size={14} />}
              </div>
            )}
            {!collapsed && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ps-slate-300)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.displayName ?? 'User'}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--ps-slate-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email ?? ''}
                </div>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={signOut}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ps-slate-600)', display: 'flex', padding: '0.25rem', borderRadius: '4px', flexShrink: 0 }}
                title="Sign out"
                aria-label="Sign out"
                className="hover:text-white"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
