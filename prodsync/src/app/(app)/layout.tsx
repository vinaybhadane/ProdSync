'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Loader2 } from 'lucide-react';

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--ps-bg)',
          gap: '1rem',
        }}
      >
        <div style={{ animation: 'ps-spin 1s linear infinite' }}>
          <Loader2 size={32} color="var(--ps-primary)" />
        </div>
        <div style={{ fontSize: '0.9375rem', color: 'var(--ps-text-muted)' }}>
          Loading ProdSync...
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return <AppLayout>{children}</AppLayout>;
}
