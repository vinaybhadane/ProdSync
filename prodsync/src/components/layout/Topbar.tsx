'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Bell, Menu, CheckCircle, AlertTriangle, XCircle, Info, X, Trash2, ExternalLink,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import type { AppNotification } from '@/types';

import { useAuth } from '@/contexts/AuthContext';
import { organizationService } from '@/services/organization.service';

// localStorage key: timestamp of when user last opened the notification panel
const LAST_SEEN_KEY = 'ps_notif_last_seen';

interface TopbarProps {
  onMobileMenuToggle: () => void;
  pageTitle?: string;
}

const notifIconConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  success: { icon: <CheckCircle size={16} />, color: 'var(--ps-success, #10b981)', bg: '#ecfdf5' },
  warning: { icon: <AlertTriangle size={16} />, color: 'var(--ps-warning, #f59e0b)', bg: '#fffbeb' },
  error:   { icon: <XCircle size={16} />,      color: 'var(--ps-danger, #ef4444)',   bg: '#fef2f2' },
  info:    { icon: <Info size={16} />,          color: 'var(--ps-info, #3b82f6)',     bg: '#eff6ff' },
};

export default function Topbar({ onMobileMenuToggle, pageTitle }: TopbarProps) {
  const router = useRouter();
  const { organization } = useAuth();
  const orgId = organization?.id || 'org_unilog_enterprise';

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [hasNew, setHasNew] = useState(false); // controls the red dot
  const searchRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // ─── helpers ───────────────────────────────────────────────────────────────

  const getLastSeen = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(`${LAST_SEEN_KEY}_${orgId}`);
  };

  const setLastSeen = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${LAST_SEEN_KEY}_${orgId}`, new Date().toISOString());
    }
  };

  /** After fetching, check if any unread notification is newer than last-seen */
  const computeHasNew = (notifs: AppNotification[]) => {
    const lastSeen = getLastSeen();
    const unread = notifs.filter((n) => !n.read);
    if (unread.length === 0) {
      setHasNew(false);
      return;
    }
    if (!lastSeen) {
      // Never opened before — show dot
      setHasNew(true);
      return;
    }
    const hasNewer = unread.some((n) => new Date(n.createdAt) > new Date(lastSeen));
    setHasNew(hasNewer);
  };

  // ─── data loading ──────────────────────────────────────────────────────────

  const loadNotifications = useCallback(() => {
    const data = organizationService.getNotifications(orgId);
    setNotifications(data);
    computeHasNew(data);
  }, [orgId]);

  useEffect(() => {
    loadNotifications();
    // Poll every 10 seconds for new notifications
    const interval = setInterval(loadNotifications, 10_000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  // ─── open/close panel ─────────────────────────────────────────────────────

  const openPanel = () => {
    setNotifOpen(true);
    // Record the moment user opens the panel — dot will only reappear for future items
    setLastSeen();
    setHasNew(false);
  };

  const closePanel = () => setNotifOpen(false);

  const togglePanel = () => {
    if (notifOpen) {
      closePanel();
    } else {
      openPanel();
    }
  };

  // ─── keyboard & outside-click ─────────────────────────────────────────────

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        closePanel();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        closePanel();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ─── actions ──────────────────────────────────────────────────────────────

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`prodsync_notifications_${orgId}`, JSON.stringify(updated));
    }
    setHasNew(false);
  };

  const handleNotifClick = (notif: AppNotification) => {
    if (!notif.read) {
      const updated = notifications.map((n) => (n.id === notif.id ? { ...n, read: true } : n));
      setNotifications(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`prodsync_notifications_${orgId}`, JSON.stringify(updated));
      }
    }
    if (notif.link) {
      router.push(notif.link);
      closePanel();
    }
  };

  const handleDismiss = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`prodsync_notifications_${orgId}`, JSON.stringify(updated));
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="app-topbar">
        {/* Mobile menu button */}
        <button
          className="ps-btn ps-btn-ghost md:hidden"
          style={{ padding: '0.375rem' }}
          onClick={onMobileMenuToggle}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Page title */}
        {pageTitle && (
          <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ps-text-primary)' }}>
            {pageTitle}
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Search trigger */}
        <button
          onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.75rem',
            border: '1px solid var(--ps-border-strong)',
            borderRadius: '8px',
            background: 'var(--ps-bg-secondary)',
            color: 'var(--ps-text-muted)',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'all 0.15s ease',
          }}
          aria-label="Search (Ctrl+K)"
        >
          <Search size={15} />
          <span className="hidden sm:inline">Search...</span>
          <kbd style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            padding: '0.125rem 0.375rem',
            borderRadius: '4px',
            background: 'var(--ps-border)',
            fontSize: '0.6875rem',
            fontFamily: 'monospace',
            color: 'var(--ps-text-muted)',
          }}>
            Ctrl K
          </kbd>
        </button>

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            id="notification-bell-btn"
            onClick={togglePanel}
            style={{
              position: 'relative',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: `1px solid ${notifOpen ? 'var(--ps-primary)' : 'var(--ps-border)'}`,
              background: notifOpen ? 'var(--ps-primary-50, #eff6ff)' : 'var(--ps-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: notifOpen ? 'var(--ps-primary)' : 'var(--ps-text-secondary)',
              transition: 'all 0.15s ease',
            }}
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            aria-expanded={notifOpen}
          >
            <Bell size={17} />

            {/* Red dot — only shown when there are genuinely new unread notifications */}
            {hasNew && (
              <span
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--ps-danger, #ef4444)',
                  border: '2px solid white',
                  animation: 'ps-pulse 2s ease-in-out infinite',
                }}
              />
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '400px',
                background: 'white',
                border: '1px solid var(--ps-border)',
                borderRadius: '14px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                zIndex: 100,
                animation: 'ps-fade-in 0.15s ease',
                overflow: 'hidden',
              }}
              role="dialog"
              aria-label="Notifications"
            >
              {/* Header */}
              <div style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--ps-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span style={{
                      background: 'var(--ps-danger, #ef4444)',
                      color: 'white',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '10px',
                      lineHeight: '1.4',
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{ fontSize: '0.75rem', color: 'var(--ps-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={closePanel}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ps-text-muted)', display: 'flex', padding: '0.25rem' }}
                    aria-label="Close notifications"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* List */}
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2.5rem 1.25rem', textAlign: 'center', color: 'var(--ps-text-muted)', fontSize: '0.875rem' }}>
                    <CheckCircle size={30} color="var(--ps-success, #10b981)" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>All caught up!</div>
                    <div style={{ fontSize: '0.8125rem' }}>No notifications right now.</div>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const cfg = notifIconConfig[notif.type] || notifIconConfig.info;
                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleNotifClick(notif)}
                        style={{
                          padding: '0.875rem 1.25rem',
                          borderBottom: '1px solid var(--ps-border)',
                          background: notif.read ? 'transparent' : 'var(--ps-primary-50, #eff6ff)',
                          display: 'flex',
                          gap: '0.75rem',
                          alignItems: 'flex-start',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                          position: 'relative',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-secondary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = notif.read ? 'transparent' : 'var(--ps-primary-50, #eff6ff)'; }}
                      >
                        {/* Type Icon */}
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: cfg.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: cfg.color,
                          flexShrink: 0,
                        }}>
                          {cfg.icon}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.2rem' }}>
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: notif.read ? 500 : 700,
                              color: 'var(--ps-text-primary)',
                              lineHeight: 1.3,
                            }}>
                              {notif.title}
                            </span>
                            {!notif.read && (
                              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--ps-primary)', flexShrink: 0, marginTop: '4px' }} />
                            )}
                          </div>

                          <div style={{
                            fontSize: '0.8125rem',
                            color: 'var(--ps-text-muted)',
                            lineHeight: 1.5,
                            marginBottom: '0.375rem',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical' as any,
                          }}>
                            {notif.description || notif.message}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.6875rem', color: 'var(--ps-text-muted)' }}>
                              {formatRelativeTime(notif.createdAt)}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {notif.link && notif.actionLabel && (
                                <span style={{ fontSize: '0.6875rem', color: 'var(--ps-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                                  {notif.actionLabel} <ExternalLink size={10} />
                                </span>
                              )}
                              <button
                                onClick={(e) => handleDismiss(e, notif.id)}
                                title="Dismiss"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: 'var(--ps-text-muted)',
                                  display: 'flex',
                                  padding: '2px',
                                  borderRadius: '4px',
                                  opacity: 0.6,
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.6'; }}
                                aria-label="Dismiss notification"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div style={{
                  padding: '0.75rem 1.25rem',
                  borderTop: '1px solid var(--ps-border)',
                  textAlign: 'center',
                }}>
                  <button
                    onClick={() => { router.push('/app/activity'); closePanel(); }}
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--ps-primary)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    View full activity log →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '15vh 1rem 0',
          }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: 'var(--ps-shadow-xl)',
              overflow: 'hidden',
              animation: 'ps-fade-in 0.15s ease',
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--ps-border)' }}>
              <Search size={18} color="var(--ps-text-muted)" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search products, SKUs, catalogs, manufacturers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.9375rem',
                  color: 'var(--ps-text-primary)',
                  background: 'transparent',
                  fontFamily: 'var(--ps-font)',
                }}
                aria-label="Search query"
              />
              <kbd style={{ padding: '0.125rem 0.5rem', borderRadius: '4px', background: 'var(--ps-border)', fontSize: '0.75rem', color: 'var(--ps-text-muted)', fontFamily: 'monospace' }}>
                ESC
              </kbd>
            </div>

            <div style={{ padding: '0.75rem 0' }}>
              {!searchQuery && (
                <>
                  <div style={{ padding: '0.25rem 1.25rem', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--ps-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                    Quick Access
                  </div>
                  {[
                    { label: 'Dashboard', href: '/app/dashboard', icon: '📊' },
                    { label: 'All Products', href: '/app/products', icon: '📦' },
                    { label: 'Catalogs', href: '/app/catalogs', icon: '📁' },
                    { label: 'Import Data', href: '/app/import', icon: '⬆️' },
                    { label: 'Validation Queue', href: '/app/validation', icon: '✅' },
                    { label: 'Activity Log', href: '/app/activity', icon: '📋' },
                  ].map((item) => (
                    <button
                      key={item.href}
                      onClick={() => { router.push(item.href); setSearchOpen(false); }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem 1.25rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        color: 'var(--ps-text-primary)',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-secondary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </>
              )}
            </div>

            <div style={{ padding: '0.625rem 1.25rem', borderTop: '1px solid var(--ps-border)', display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--ps-text-muted)' }}>
              <span><kbd style={{ fontFamily: 'monospace' }}>↑↓</kbd> Navigate</span>
              <span><kbd style={{ fontFamily: 'monospace' }}>↵</kbd> Open</span>
              <span><kbd style={{ fontFamily: 'monospace' }}>ESC</kbd> Close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
