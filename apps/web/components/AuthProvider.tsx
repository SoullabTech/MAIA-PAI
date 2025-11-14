'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Simple Auth Provider stub for development
 * In production, this would integrate with your auth system
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // For now, provide a demo user
  const user: User = {
    id: 'demo-user',
    email: 'demo@soullab.com',
    name: 'Demo User'
  };

  return (
    <AuthContext.Provider value={{ user, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}
