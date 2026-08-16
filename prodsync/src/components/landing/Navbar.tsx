'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
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
    <nav
      className="neu-navbar"
      style={{
        padding: '0.625rem 1.25rem',
      }}
      aria-label="Main navigation"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        {/* Logo Container */}
        <Link href="/" aria-label="ProdSync home" style={{ textDecoration: 'none' }}>
          <Logo size="md" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="neu-desktop-nav gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`neu-nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth Actions */}
        <div className="neu-desktop-auth gap-3">
          <Link
            href="/login"
            className="neu-btn neu-btn-secondary"
            style={{
              padding: '0.5rem 1.125rem',
              fontSize: '0.875rem',
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
              gap: '0.375rem',
            }}
          >
            Get Started
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Mobile menu button (ONLY on mobile <=868px) */}
        <button
          className="neu-mobile-toggle neu-btn-icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="neu-inset"
          style={{
            marginTop: '0.875rem',
            padding: '1rem',
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
              style={{ padding: '0.625rem 0.875rem', display: 'block' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Link
              href="/login"
              className="neu-btn neu-btn-secondary"
              style={{ padding: '0.625rem', fontSize: '0.875rem' }}
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="neu-btn neu-btn-primary"
              style={{ padding: '0.625rem', fontSize: '0.875rem' }}
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
