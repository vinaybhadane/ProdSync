'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
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
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'var(--ps-success-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <CheckCircle size={32} color="var(--ps-success)" />
        </div>
        <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>Check your email</h2>
        <p style={{ color: 'var(--ps-text-muted)', marginBottom: '2rem', lineHeight: 1.65 }}>
          We sent a password reset link to <strong style={{ color: 'var(--ps-text-primary)' }}>{email}</strong>.
          Check your inbox and follow the instructions.
        </p>
        <Link href="/login" className="ps-btn ps-btn-secondary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--ps-text-muted)', textDecoration: 'none', marginBottom: '1.5rem' }}>
        <ArrowLeft size={14} /> Back to Sign In
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 className="text-h2" style={{ marginBottom: '0.5rem' }}>Reset your password</h1>
        <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>
          Enter your work email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div style={{ display: 'flex', gap: '0.625rem', padding: '0.75rem', background: 'var(--ps-danger-light)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem', color: 'var(--ps-danger-dark)' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <label className="ps-label" htmlFor="reset-email">Work Email</label>
          <input
            id="reset-email"
            type="email"
            className="ps-input"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <button
          type="submit"
          className="ps-btn ps-btn-primary"
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', padding: '0.625rem 1rem', fontSize: '0.9375rem' }}
        >
          {loading ? (
            <>
              <Loader2 size={16} style={{ animation: 'ps-spin 1s linear infinite' }} />
              Sending reset link...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>
    </>
  );
}
