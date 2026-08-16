'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Loader2, ArrowRight, Sparkles, Mail, Lock } from 'lucide-react';
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
    <div className="neu-raised-xl" style={{ padding: '3rem 2.5rem' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="neu-badge neu-badge-blue" style={{ marginBottom: '0.875rem' }}>
          <Sparkles size={13} />
          <span>Welcome Back</span>
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
          Sign in to ProdSync
        </h1>
        <p style={{ color: 'var(--neu-text-muted)', fontSize: '0.9375rem', margin: 0 }}>
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            style={{
              color: 'var(--neu-primary)',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Create one free
          </Link>
        </p>
      </div>

      {/* Tactile Social Auth Buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <button
          type="button"
          onClick={handleGoogle}
          disabled={!!socialLoading || loading}
          className="neu-btn neu-btn-secondary"
          style={{
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            gap: '0.625rem',
          }}
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
          Google
        </button>

        <button
          type="button"
          onClick={handleMicrosoft}
          disabled={!!socialLoading || loading}
          className="neu-btn neu-btn-secondary"
          style={{
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            gap: '0.625rem',
          }}
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
          Microsoft
        </button>
      </div>

      {/* Neumorphic Inset Divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.75rem',
          color: 'var(--neu-text-muted)',
          fontSize: '0.8125rem',
          fontWeight: 600,
        }}
      >
        <div className="neu-inset-sm" style={{ flex: 1, height: '2px' }} />
        <span>or sign in with email</span>
        <div className="neu-inset-sm" style={{ flex: 1, height: '2px' }} />
      </div>

      {/* Form */}
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

        {/* Email Field */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="email"
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
            id="email"
            type="email"
            className="neu-input"
            placeholder="name@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <label
              htmlFor="password"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--neu-text-title)',
                margin: 0,
              }}
            >
              <Lock size={14} color="#2563eb" />
              Password
            </label>
            <Link
              href="/forgot-password"
              style={{
                fontSize: '0.8125rem',
                color: 'var(--neu-primary)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Forgot password?
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="neu-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
              style={{ paddingRight: '2.75rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--neu-text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="neu-btn neu-btn-primary"
          disabled={loading || !!socialLoading}
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
              Signing in...
            </>
          ) : (
            <>
              Sign In to Platform
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
