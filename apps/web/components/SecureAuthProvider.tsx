"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useSecureAuth } from '@/lib/auth/secure-auth';

type SecureAuthContextType = ReturnType<typeof useSecureAuth>;

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

export function SecureAuthProvider({ children }: { children: ReactNode }) {
  const authState = useSecureAuth();

  return (
    <SecureAuthContext.Provider value={authState}>
      {children}
    </SecureAuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(SecureAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SecureAuthProvider');
  }
  return context;
}