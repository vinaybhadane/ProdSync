'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, ChevronDown, Sparkles, Layers, Cpu, ShieldCheck, Database, FileSpreadsheet } from 'lucide-react';
import Logo from '@/components/Logo';

const NAV_LINKS = [
  { label: 'Features', href: '/features' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="neu-navbar"
      style={{
        boxShadow: scrolled ? '0 4px 20px -2px rgba(15, 23, 42, 0.08)' : '0 1px 3px 0 rgba(15, 23, 42, 0.03)',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(8px)',
      }}
      aria-label="Main navigation"
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        {/* Brand Logo */}
        <Link href="/" aria-label="ProdSync home" style={{ textDecoration: 'none' }}>
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="neu-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`neu-nav-link ${isActive ? 'active' : ''}`}
                style={{
                  color: isActive ? '#2563eb' : '#334155',
                  fontWeight: isActive ? 600 : 500,
                  padding: '0.5rem 0.875rem',
                  fontSize: '0.9375rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease, background-color 0.15s ease',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="neu-desktop-auth" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            href="/login"
            className="neu-btn neu-btn-secondary"
            style={{
              padding: '0.5rem 1.125rem',
              fontSize: '0.875rem',
              borderRadius: '6px',
            }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="neu-btn neu-btn-primary"
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem',
              borderRadius: '6px',
              gap: '0.375rem',
            }}
          >
            Get Started
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="neu-mobile-toggle neu-btn-icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          style={{
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="neu-nav-link"
              style={{
                padding: '0.625rem 0.75rem',
                fontSize: '1rem',
                fontWeight: 500,
                color: '#1e293b',
                borderRadius: '6px',
                display: 'block',
              }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
            <Link
              href="/login"
              className="neu-btn neu-btn-secondary"
              style={{ padding: '0.625rem', fontSize: '0.875rem', textAlign: 'center' }}
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="neu-btn neu-btn-primary"
              style={{ padding: '0.625rem', fontSize: '0.875rem', textAlign: 'center' }}
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
