'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, FolderOpen, Upload, Cpu, ShieldCheck,
  Sparkles, BarChart3, Activity, Settings, HelpCircle, ChevronLeft,
  ChevronRight, LogOut, User,
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
  const { user, signOut } = useAuth();

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

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0.75rem' }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label ?? 'main'} style={{ marginBottom: '1.5rem' }}>
              {section.label && !collapsed && (
                <div
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
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
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-nav-item${active ? ' active' : ''}`}
                    title={collapsed ? item.label : undefined}
                    style={collapsed ? { justifyContent: 'center', padding: '0.5625rem' } : undefined}
                    onClick={mobileOpen ? onMobileClose : undefined}
                  >
                    <Icon className="icon" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div
          style={{
            padding: '0.75rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {BOTTOM_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="sidebar-nav-item"
                title={collapsed ? item.label : undefined}
                style={collapsed ? { justifyContent: 'center', padding: '0.5625rem' } : undefined}
              >
                <Icon className="icon" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          {/* User profile */}
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
