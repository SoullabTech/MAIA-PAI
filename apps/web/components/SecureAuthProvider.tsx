"use client";

import { createContext, useContext, ReactNode } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  login: (credentials: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getAuthState: () => AuthState;
}

const SecureAuthContext = createContext<AuthState | undefined>(undefined);

export function SecureAuthProvider({ children }: { children: ReactNode }) {
  // Provide a simple default auth state for SSR compatibility
  const defaultState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    login: () => Promise.resolve({ success: false, error: 'Not implemented' }),
    logout: () => Promise.resolve(),
    getAuthState: () => ({ isAuthenticated: false, user: null, loading: false, login: () => Promise.resolve({ success: false }), logout: () => Promise.resolve(), getAuthState: () => ({}) as AuthState })
  };

  return (
    <SecureAuthContext.Provider value={defaultState}>
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