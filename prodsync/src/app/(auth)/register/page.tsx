'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Sparkles,
  User,
  Mail,
  Lock,
  Building2,
  Layers,
  Boxes,
  Users,
  Cpu,
  ShieldCheck,
  Check,
  Edit3,
} from 'lucide-react';
import { authService } from '@/services/auth.service';
import { organizationService } from '@/services/organization.service';
import type { UserRole } from '@/types';

const ROLES: { value: UserRole; label: string; icon: React.ComponentType<{ size: number; color?: string }>; desc: string }[] = [
  { value: 'product_manager', label: 'Product Manager', icon: Layers, desc: 'Taxonomy & Specs' },
  { value: 'catalog_manager', label: 'Catalog Manager', icon: Boxes, desc: 'Multi-Channel PIM' },
  { value: 'procurement', label: 'Procurement', icon: Users, desc: 'Vendor Verification' },
  { value: 'engineering', label: 'Engineering / R&D', icon: Cpu, desc: 'Technical Schematics' },
];

export default function RegisterPage() {
  const router = useRouter();

  // Wizard state: 'form' | 'otp'
  const [step, setStep] = useState<'form' | 'otp'>('form');

  const [form, setForm] = useState({
    displayName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'product_manager' as UserRole | '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [socialLoading, setSocialLoading] = useState<'google' | 'microsoft' | null>(null);

  // OTP State (6 digits)
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  // Focus first OTP box when entering OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Handle Step 1 submission -> Send OTP via Brevo API
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const email = form.email.trim();
    const displayName = form.displayName.trim();
    const companyName = form.companyName.trim();

    if (!displayName) {
      setError('Please enter your full name.');
      return;
    }
    if (!companyName) {
      setError('Please enter your company or organization name.');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid work email address.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, displayName }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch verification code.');
      }

      if (data.devOtp) {
        setDevOtpHint(data.devOtp);
      }

      // Transition to OTP step
      setStep('otp');
      setResendCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error sending verification email';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, '');

    if (cleanValue.length > 1) {
      const pasted = cleanValue.slice(0, 6).split('');
      const updated = [...otpDigits];
      pasted.forEach((char, i) => {
        if (i < 6) updated[i] = char;
      });
      setOtpDigits(updated);
      const nextIndex = Math.min(pasted.length, 5);
      otpInputsRef.current[nextIndex]?.focus();
      return;
    }

    const updated = [...otpDigits];
    updated[index] = cleanValue;
    setOtpDigits(updated);

    if (cleanValue && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const fillDevOtp = () => {
    if (devOtpHint) {
      const digits = devOtpHint.split('');
      setOtpDigits(digits);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0 || isResending) return;
    setError('');
    setIsResending(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), displayName: form.displayName.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to resend code');
      }

      if (data.devOtp) {
        setDevOtpHint(data.devOtp);
      }

      setResendCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error resending code';
      setError(message);
    } finally {
      setIsResending(false);
    }
  };

  // Handle Step 2 submission -> Verify OTP & complete registration with isolated Organization
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      // 1. Verify OTP with server route
      const verifyRes = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), otp: fullCode }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Invalid or expired verification code.');
      }

      // 2. Initialize isolated Organization for this user
      organizationService.createOrganization(
        form.companyName || `${form.displayName}'s Organization`,
        form.email,
        form.displayName
      );

      // 3. Complete Firebase account creation and authentication
      try {
        await authService.signUpWithEmail(form.email, form.password, form.displayName);
      } catch (authErr: unknown) {
        const code = (authErr as { code?: string }).code ?? '';
        if (code === 'auth/email-already-in-use') {
          await authService.signInWithEmail(form.email, form.password);
        } else {
          throw new Error(authService.mapError(code));
        }
      }

      // 4. Redirect to app dashboard
      router.push('/app/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Social Auth
  const handleGoogle = async () => {
    setError('');
    setSocialLoading('google');
    try {
      const user = await authService.signInWithGoogle();
      if (user.email) {
        organizationService.getOrganizationForUser(user.email);
      }
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
      const user = await authService.signInWithMicrosoft();
      if (user.email) {
        organizationService.getOrganizationForUser(user.email);
      }
      router.push('/app/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(authService.mapError(code));
    } finally {
      setSocialLoading(null);
    }
  };

  // Real-time validation checks
  const hasMinLength = form.password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(form.password);
  const passwordsMatch = !!form.confirmPassword && form.password === form.confirmPassword;

  // ─────────────────────────────────────────────────────────────
  // STEP 2: OTP VERIFICATION VIEW
  // ─────────────────────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <div className="neu-raised-xl" style={{ padding: '3.25rem 2.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="neu-badge neu-badge-blue" style={{ marginBottom: '1rem' }}>
            <ShieldCheck size={14} />
            <span>Email Security Verification</span>
          </div>

          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--neu-text-title)',
              letterSpacing: '-0.025em',
              marginBottom: '0.625rem',
            }}
          >
            Enter 6-Digit Code
          </h1>

          <p style={{ color: 'var(--neu-text-body)', fontSize: '0.9375rem', lineHeight: 1.5, margin: '0 auto', maxWidth: '380px' }}>
            We dispatched a one-time verification code to{' '}
            <strong style={{ color: 'var(--neu-primary)', fontWeight: 800 }}>{form.email}</strong>
          </p>

          <button
            type="button"
            onClick={() => {
              setStep('form');
              setError('');
            }}
            style={{
              marginTop: '0.75rem',
              background: 'none',
              border: 'none',
              color: 'var(--neu-primary)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Edit3 size={12} />
            Edit email address
          </button>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerifyOTP} noValidate>
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

          {/* Dev Hint Pill */}
          {devOtpHint && (
            <div
              className="neu-inset-sm"
              style={{
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8125rem',
                background: 'rgba(37,99,235,0.06)',
                border: '1px solid rgba(37,99,235,0.2)',
              }}
            >
              <div>
                <span style={{ color: 'var(--neu-text-muted)' }}>Verification Code: </span>
                <strong style={{ color: 'var(--neu-primary)', letterSpacing: '2px' }}>{devOtpHint}</strong>
              </div>
              <button
                type="button"
                onClick={fillDevOtp}
                className="neu-btn neu-btn-secondary"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
              >
                Auto-Fill
              </button>
            </div>
          )}

          {/* 6 Digit Input Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '0.625rem',
              marginBottom: '2rem',
            }}
          >
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  otpInputsRef.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                className="neu-input"
                style={{
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--neu-primary)',
                  padding: 0,
                }}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {/* Verify Action Button */}
          <button
            type="submit"
            className="neu-btn neu-btn-primary"
            disabled={loading || otpDigits.join('').length !== 6}
            style={{
              width: '100%',
              padding: '0.9375rem 1.5rem',
              fontSize: '1rem',
              gap: '0.5rem',
              marginBottom: '1.5rem',
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'ps-spin 1s linear infinite' }} />
                Verifying Code...
              </>
            ) : (
              <>
                Verify & Open {form.companyName ? `${form.companyName} Workspace` : 'Workspace'}
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Resend Code Action */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--neu-text-muted)', margin: 0 }}>
              Didn&apos;t receive the code?{' '}
              {resendCooldown > 0 ? (
                <span style={{ fontWeight: 700, color: 'var(--neu-text-body)' }}>
                  Resend in {resendCooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--neu-primary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0,
                  }}
                >
                  {isResending ? 'Sending...' : 'Resend New Code'}
                </button>
              )}
            </p>
          </div>
        </form>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 1: INITIAL REGISTRATION FORM
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="neu-raised-xl" style={{ padding: '3rem 2.5rem' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="neu-badge neu-badge-blue" style={{ marginBottom: '0.875rem' }}>
          <Sparkles size={13} />
          <span>Get Started Free</span>
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
          Create Your Account
        </h1>
        <p style={{ color: 'var(--neu-text-muted)', fontSize: '0.9375rem', margin: 0 }}>
          Set up your organization workspace with multi-tenant data isolation
        </p>
      </div>

      {/* Social Sign-In Buttons */}
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
          disabled={loading || !!socialLoading}
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
          disabled={loading || !!socialLoading}
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

      {/* Inset Divider */}
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
        <span>or register with work email</span>
        <div className="neu-inset-sm" style={{ flex: 1, height: '2px' }} />
      </div>

      {/* Form */}
      <form onSubmit={handleFormSubmit} noValidate>
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
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Full Name & Company Name Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
          className="neu-name-org-grid"
        >
          <div>
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
              <User size={14} color="#2563eb" />
              Full Name
            </label>
            <input
              type="text"
              className="neu-input"
              placeholder="Jane Doe"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              required
              autoComplete="name"
            />
          </div>

          <div>
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
              <Building2 size={14} color="#2563eb" />
              Company / Org
            </label>
            <input
              type="text"
              className="neu-input"
              placeholder="e.g. Tata Motors"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              required
              autoComplete="organization"
            />
          </div>
        </div>

        {/* Work Email */}
        <div style={{ marginBottom: '1.25rem' }}>
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
            placeholder="jane@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>

        {/* Passwords Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '0.875rem',
          }}
          className="neu-password-grid"
        >
          <div>
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
              <Lock size={14} color="#2563eb" />
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="neu-input"
                placeholder="6+ chars"
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
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neu-text-muted)',
                  display: 'flex', alignItems: 'center',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
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
              <ShieldCheck size={14} color="#059669" />
              Confirm
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="neu-input"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
                autoComplete="new-password"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neu-text-muted)',
                  display: 'flex', alignItems: 'center',
                }}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* Real-time validation pills */}
        {form.password && (
          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <span className={`neu-badge ${hasMinLength ? 'neu-badge-emerald' : 'neu-badge-rose'}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
              {hasMinLength ? <Check size={10} /> : '✕'} 6+ characters
            </span>
            <span className={`neu-badge ${hasLetter ? 'neu-badge-emerald' : 'neu-badge-rose'}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
              {hasLetter ? <Check size={10} /> : '✕'} Letters included
            </span>
            {form.confirmPassword && (
              <span className={`neu-badge ${passwordsMatch ? 'neu-badge-emerald' : 'neu-badge-rose'}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                {passwordsMatch ? <Check size={10} /> : '✕'} Passwords match
              </span>
            )}
          </div>
        )}

        {/* Primary Role Selector */}
        <div style={{ marginTop: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--neu-text-title)', margin: 0 }}>
              Primary Role in Organization
            </label>
            <span style={{ fontSize: '0.75rem', color: 'var(--neu-text-muted)' }}>Tailors your workspace</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
            }}
            className="neu-role-grid"
          >
            {ROLES.map((r) => {
              const isSelected = form.role === r.value;
              const Icon = r.icon;

              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.value })}
                  className={isSelected ? 'neu-inset-sm' : 'neu-raised-sm'}
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.625rem',
                    border: isSelected ? '1px solid rgba(37,99,235,0.45)' : '1px solid rgba(255,255,255,0.5)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: isSelected ? '#ffffff' : 'var(--neu-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={15} color={isSelected ? '#2563eb' : '#64748b'} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: isSelected ? 'var(--neu-primary)' : 'var(--neu-text-title)' }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--neu-text-muted)', lineHeight: 1.2 }}>
                      {r.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button -> Dispatches OTP */}
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
              Sending Verification Code...
            </>
          ) : (
            <>
              Send Verification Code
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Footer Login Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--neu-text-body)', margin: 0 }}>
            Already have an account?{' '}
            <Link
              href="/login"
              style={{
                color: 'var(--neu-primary)',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Sign In to ProdSync →
            </Link>
          </p>
        </div>

        <p style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--neu-text-muted)', textAlign: 'center', lineHeight: 1.5, margin: '1.25rem 0 0' }}>
          By continuing, you agree to our{' '}
          <Link href="/terms" style={{ color: 'var(--neu-text-muted)', textDecoration: 'underline' }}>Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ color: 'var(--neu-text-muted)', textDecoration: 'underline' }}>Privacy Policy</Link>.
        </p>
      </form>

      <style>{`
        @media (max-width: 600px) {
          .neu-name-org-grid,
          .neu-password-grid,
          .neu-role-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
