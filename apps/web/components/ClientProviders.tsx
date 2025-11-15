'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import all providers to prevent SSR useContext errors
const ThemeProvider = dynamic(
  () => import('@/components/providers/ThemeProvider').then(mod => ({ default: mod.ThemeProvider })),
  { ssr: false }
);

const ToastProvider = dynamic(
  () => import('@/components/system/ToastProvider').then(mod => ({ default: mod.ToastProvider })),
  { ssr: false }
);

const SecureAuthProvider = dynamic(
  () => import('@/components/SecureAuthProvider').then(mod => ({ default: mod.SecureAuthProvider })),
  { ssr: false }
);

const IOSFixInitializer = dynamic(
  () => import('@/components/system/IOSFixInitializer'),
  { ssr: false }
);

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <div suppressHydrationWarning>
      <ThemeProvider>
        <SecureAuthProvider>
          <ToastProvider>
            <IOSFixInitializer />
            {children}
          </ToastProvider>
        </SecureAuthProvider>
      </ThemeProvider>
    </div>
  );
}