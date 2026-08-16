'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { authService } from '@/services/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [socialLoading, setSocialLoading] = useState<'google' | 'microsoft' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.signInWithEmail(form.email, form.password);
      router.push('/app/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(authService.mapError(code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setSocialLoading('google');
    try {
      await authService.signInWithGoogle();
      router.push('/app/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(authService.mapError(code));
    } finally {
      setSocialLoading(null);
    }
  };

  const handleMicrosoft = async () => {
    setError('');
    setSocialLoading('microsoft');
    try {
      await authService.signInWithMicrosoft();
      router.push('/app/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(authService.mapError(code));
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="text-h2" style={{ marginBottom: '0.5rem' }}>Sign in to ProdSync</h1>
        <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: 'var(--ps-primary)', fontWeight: 500, textDecoration: 'none' }}>
            Create one free
          </Link>
        </p>
      </div>

      {/* Social auth */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          onClick={handleGoogle}
          disabled={!!socialLoading || loading}
          className="ps-btn ps-btn-secondary"
          style={{ width: '100%', justifyContent: 'center', gap: '0.75rem', padding: '0.625rem 1rem' }}
        >
          {socialLoading === 'google' ? (
            <Loader2 size={18} style={{ animation: 'ps-spin 1s linear infinite' }} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          Continue with Google
        </button>

        <button
          onClick={handleMicrosoft}
          disabled={!!socialLoading || loading}
          className="ps-btn ps-btn-secondary"
          style={{ width: '100%', justifyContent: 'center', gap: '0.75rem', padding: '0.625rem 1rem' }}
        >
          {socialLoading === 'microsoft' ? (
            <Loader2 size={18} style={{ animation: 'ps-spin 1s linear infinite' }} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H12z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H12z"/>
            </svg>
          )}
          Continue with Microsoft
        </button>
      </div>

      {/* Divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          color: 'var(--ps-text-muted)',
          fontSize: '0.8125rem',
        }}
      >
        <div style={{ flex: 1, height: '1px', background: 'var(--ps-border)' }} />
        or continue with email
        <div style={{ flex: 1, height: '1px', background: 'var(--ps-border)' }} />
      </div>

      {/* Email form */}
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div
            style={{
              display: 'flex',
              gap: '0.625rem',
              padding: '0.75rem',
              background: 'var(--ps-danger-light)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              fontSize: '0.875rem',
              color: 'var(--ps-danger-dark)',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label className="ps-label" htmlFor="email">Work Email</label>
          <input
            id="email"
            type="email"
            className="ps-input"
            placeholder="name@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <label className="ps-label" htmlFor="password" style={{ margin: 0 }}>Password</label>
            <Link
              href="/forgot-password"
              style={{ fontSize: '0.8125rem', color: 'var(--ps-primary)', textDecoration: 'none', fontWeight: 500 }}
            >
              Forgot password?
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="ps-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
              style={{ paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--ps-text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="ps-btn ps-btn-primary"
          disabled={loading || !!socialLoading}
          style={{ width: '100%', justifyContent: 'center', padding: '0.625rem 1rem', fontSize: '0.9375rem' }}
        >
          {loading ? (
            <>
              <Loader2 size={16} style={{ animation: 'ps-spin 1s linear infinite' }} />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </>
  );
}
