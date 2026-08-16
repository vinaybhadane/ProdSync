'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { authService } from '@/services/auth.service';
import type { UserRole } from '@/types';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'catalog_manager', label: 'Catalog Manager' },
  { value: 'procurement', label: 'Procurement' },
  { value: 'sales', label: 'Sales' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'administrator', label: 'Administrator' },
  { value: 'other', label: 'Other' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as UserRole | '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await authService.signUpWithEmail(form.email, form.password, form.displayName);
      setSuccess(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(authService.mapError(code));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--ps-success-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <CheckCircle size={32} color="var(--ps-success)" />
        </div>
        <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>Verify your email</h2>
        <p style={{ color: 'var(--ps-text-muted)', marginBottom: '2rem', lineHeight: 1.65 }}>
          We sent a verification email to <strong style={{ color: 'var(--ps-text-primary)' }}>{form.email}</strong>.
          Click the link in the email to activate your account.
        </p>
        <Link href="/login" className="ps-btn ps-btn-primary" style={{ justifyContent: 'center', display: 'flex' }}>
          Continue to Sign In
        </Link>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="text-h2" style={{ marginBottom: '0.5rem' }}>Create your account</h1>
        <p style={{ color: 'var(--ps-text-muted)', fontSize: '0.9375rem' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--ps-primary)', fontWeight: 500, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>

      {/* Social auth */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={async () => {
            setError('');
            setLoading(true);
            try {
              await authService.signInWithGoogle();
              router.push('/app/dashboard');
            } catch (err: unknown) {
              const code = (err as { code?: string }).code ?? '';
              setError(authService.mapError(code));
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="ps-btn ps-btn-secondary"
          style={{ width: '100%', justifyContent: 'center', gap: '0.75rem', padding: '0.625rem 1rem' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <button
          type="button"
          onClick={async () => {
            setError('');
            setLoading(true);
            try {
              await authService.signInWithMicrosoft();
              router.push('/app/dashboard');
            } catch (err: unknown) {
              const code = (err as { code?: string }).code ?? '';
              setError(authService.mapError(code));
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="ps-btn ps-btn-secondary"
          style={{ width: '100%', justifyContent: 'center', gap: '0.75rem', padding: '0.625rem 1rem' }}
        >
          <svg width="18" height="18" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
            <path fill="#f35325" d="M1 1h10v10H1z"/>
            <path fill="#81bc06" d="M12 1h10v10H12z"/>
            <path fill="#05a6f0" d="M1 12h10v10H1z"/>
            <path fill="#ffba08" d="M12 12h10v10H12z"/>
          </svg>
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
        or register with email
        <div style={{ flex: 1, height: '1px', background: 'var(--ps-border)' }} />
      </div>

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
          <label className="ps-label" htmlFor="displayName">Full Name</label>
          <input
            id="displayName"
            type="text"
            className="ps-input"
            placeholder="Your full name"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            required
            autoComplete="name"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label className="ps-label" htmlFor="reg-email">Work Email</label>
          <input
            id="reg-email"
            type="email"
            className="ps-input"
            placeholder="name@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label className="ps-label" htmlFor="reg-password">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              className="ps-input"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="new-password"
              style={{ paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ps-text-muted)',
                display: 'flex', alignItems: 'center',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label className="ps-label" htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="ps-input"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
            autoComplete="new-password"
          />
        </div>

        {/* Role selection */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label className="ps-label">What best describes your role? <span style={{ color: 'var(--ps-text-muted)', fontWeight: 400 }}>(optional)</span></label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {ROLES.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setForm({ ...form, role: form.role === role.value ? '' : role.value })}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: `1px solid ${form.role === role.value ? 'var(--ps-primary)' : 'var(--ps-border-strong)'}`,
                  background: form.role === role.value ? 'var(--ps-primary-50)' : 'white',
                  color: form.role === role.value ? 'var(--ps-primary)' : 'var(--ps-text-secondary)',
                  fontSize: '0.8125rem',
                  fontWeight: form.role === role.value ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
              >
                {role.label}
              </button>
            ))}
          </div>
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
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--ps-text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
          By creating an account, you agree to our{' '}
          <Link href="/terms" style={{ color: 'var(--ps-primary)', textDecoration: 'none' }}>Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ color: 'var(--ps-primary)', textDecoration: 'none' }}>Privacy Policy</Link>.
        </p>
      </form>
    </>
  );
}
