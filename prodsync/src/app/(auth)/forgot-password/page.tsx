'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft, ArrowRight, Sparkles, Mail } from 'lucide-react';
import { authService } from '@/services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.sendPasswordReset(email);
      setSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(authService.mapError(code));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="neu-raised-xl" style={{ padding: '3.5rem 2.5rem', textAlign: 'center' }}>
        <div
          className="neu-inset"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.75rem',
          }}
        >
          <CheckCircle2 size={42} color="#059669" />
        </div>

        <div className="neu-badge neu-badge-emerald" style={{ marginBottom: '1rem' }}>
          <span>Recovery Email Dispatched</span>
        </div>

        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--neu-text-title)',
            marginBottom: '0.75rem',
          }}
        >
          Check Your Email
        </h2>
        <p style={{ color: 'var(--neu-text-body)', marginBottom: '2rem', lineHeight: 1.65, fontSize: '1rem' }}>
          We sent a password reset link to <strong style={{ color: 'var(--neu-primary)', fontWeight: 800 }}>{email}</strong>.
          <br />
          Check your inbox and follow the instructions to reset your password.
        </p>

        <Link
          href="/login"
          className="neu-btn neu-btn-primary"
          style={{
            width: '100%',
            padding: '0.875rem',
            fontSize: '1rem',
            gap: '0.5rem',
          }}
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="neu-raised-xl" style={{ padding: '3rem 2.5rem' }}>
      <Link
        href="/login"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          fontSize: '0.8125rem',
          color: 'var(--neu-text-muted)',
          textDecoration: 'none',
          marginBottom: '1.5rem',
          fontWeight: 700,
        }}
      >
        <ArrowLeft size={14} /> Back to Sign In
      </Link>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="neu-badge neu-badge-blue" style={{ marginBottom: '0.875rem' }}>
          <Sparkles size={13} />
          <span>Account Recovery</span>
        </div>
        <h1
          style={{
            fontSize: '1.875rem',
            fontWeight: 800,
            color: 'var(--neu-text-title)',
            letterSpacing: '-0.025em',
            marginBottom: '0.5rem',
          }}
        >
          Reset Your Password
        </h1>
        <p style={{ color: 'var(--neu-text-muted)', fontSize: '0.9375rem', margin: 0 }}>
          Enter your work email address and we&apos;ll send you a recovery link.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div
            className="neu-inset-sm"
            style={{
              display: 'flex',
              gap: '0.625rem',
              padding: '0.875rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              color: '#dc2626',
              border: '1px solid rgba(239,68,68,0.3)',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ marginBottom: '1.75rem' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--neu-text-title)',
              marginBottom: '0.4rem',
            }}
          >
            <Mail size={14} color="#2563eb" />
            Work Email
          </label>
          <input
            type="email"
            className="neu-input"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <button
          type="submit"
          className="neu-btn neu-btn-primary"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.9375rem 1.5rem',
            fontSize: '1rem',
            gap: '0.5rem',
          }}
        >
          {loading ? (
            <>
              <Loader2 size={18} style={{ animation: 'ps-spin 1s linear infinite' }} />
              Sending reset link...
            </>
          ) : (
            <>
              Send Reset Link
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
