'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService, AuthUser } from '@/services/auth.service';
import { organizationService, OrganizationRecord } from '@/services/organization.service';

interface AuthContextValue {
  user: AuthUser | null;
  organization: OrganizationRecord;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshOrganization: () => void;
}

const defaultOrg: OrganizationRecord = {
  id: 'org_unilog_enterprise',
  name: 'Unilog Industrial Hub',
  slug: 'unilog-industrial',
  plan: 'enterprise',
  createdAt: '2026-01-15T00:00:00.000Z',
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  organization: defaultOrg,
  loading: true,
  error: null,
  signOut: async () => {},
  refreshOrganization: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [organization, setOrganization] = useState<OrganizationRecord>(defaultOrg);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshOrganization = useCallback(() => {
    if (user?.email) {
      const org = organizationService.getOrganizationForUser(user.email);
      setOrganization(org);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      if (authUser?.email) {
        const org = organizationService.getOrganizationForUser(authUser.email);
        setOrganization(org);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch {
      setError('Failed to sign out.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, organization, loading, error, signOut, refreshOrganization }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
