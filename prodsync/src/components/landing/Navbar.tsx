'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`landing-nav ${scrolled ? 'scrolled' : ''}`}
      style={{
        background: scrolled ? undefined : 'transparent',
      }}
      aria-label="Main navigation"
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        {/* Logo */}
        <Link href="/" aria-label="ProdSync home">
          <Logo size="md" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '0.5rem 0.875rem',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: pathname === link.href ? 'var(--ps-primary)' : 'var(--ps-text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.15s, background 0.15s',
              }}
              className="hover:text-slate-900 hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth actions */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Link
            href="/login"
            className="ps-btn ps-btn-ghost"
            style={{ fontSize: '0.9375rem' }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="ps-btn ps-btn-primary"
            style={{ fontSize: '0.9375rem' }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden ml-auto ps-btn ps-btn-ghost"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            background: 'white',
            borderTop: '1px solid var(--ps-border)',
            padding: '1rem 1.5rem',
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'block',
                padding: '0.75rem 0',
                color: 'var(--ps-text-primary)',
                fontWeight: 500,
                textDecoration: 'none',
                borderBottom: '1px solid var(--ps-border)',
              }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <Link href="/login" className="ps-btn ps-btn-secondary" style={{ justifyContent: 'center' }}>
              Sign In
            </Link>
            <Link href="/register" className="ps-btn ps-btn-primary" style={{ justifyContent: 'center' }}>
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
