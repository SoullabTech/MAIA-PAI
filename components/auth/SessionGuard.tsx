'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { betaSession } from '@/lib/auth/betaSession';
import { motion } from 'framer-motion';
import Image from 'next/image';

/**
 * SessionGuard - Ensures user sessions persist across page loads
 *
 * Automatically restores session on mount
 * Redirects unauthenticated users to appropriate pages
 * Handles onboarding flow
 */

interface SessionGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOnboarded?: boolean;
}

// Pages that don't require authentication
const PUBLIC_PATHS = [
  '/auth',
  '/login',
  '/beta-entry',
  '/beta-welcome',
  '/invite-welcome',
  '/partners',
  '/about',
  '/privacy',
];

// Pages that are part of onboarding flow
const ONBOARDING_PATHS = [
  '/beta-orientation',
  '/beta-onboarding',
  '/onboarding',
  '/invite-welcome',
];

export function SessionGuard({
  children,
  requireAuth = false,
  requireOnboarded = false,
}: SessionGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [sessionState, setSessionState] = useState(betaSession.getSessionState());

  useEffect(() => {
    // Restore session on mount
    const state = betaSession.restoreSession();
    setSessionState(state);

    console.log('[SessionGuard] Session restored:', {
      path: pathname,
      authenticated: state.isAuthenticated,
      needsOnboarding: state.needsOnboarding,
      username: state.user?.username
    });

    // Subscribe to session changes
    const unsubscribe = betaSession.subscribe((newState) => {
      setSessionState(newState);
    });

    // Add timeout to prevent indefinite loading
    const timeout = setTimeout(() => {
      console.warn('[SessionGuard] Timeout reached, force completing session check');
      setIsChecking(false);
    }, 3000);

    setIsChecking(false);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [pathname]);

  useEffect(() => {
    if (isChecking) return;

    const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
    const isOnboardingPath = ONBOARDING_PATHS.some(path => pathname.startsWith(path));

    // If not authenticated and requires auth
    if (requireAuth && !sessionState.isAuthenticated) {
      if (!isPublicPath) {
        console.log('[SessionGuard] Redirecting to /auth - not authenticated');
        router.push('/auth');
      }
      return;
    }

    // If authenticated but needs onboarding
    if (sessionState.isAuthenticated && sessionState.needsOnboarding) {
      if (!isOnboardingPath && !isPublicPath) {
        console.log('[SessionGuard] Redirecting to /beta-onboarding - needs onboarding');
        router.push('/beta-onboarding');
      }
      return;
    }

    // If authenticated, onboarded, but somehow on auth page
    if (sessionState.isAuthenticated && !sessionState.needsOnboarding) {
      if (pathname === '/auth' || pathname === '/login') {
        console.log('[SessionGuard] Redirecting to /maia - already authenticated');
        router.push('/maia');
      }
    }
  }, [isChecking, sessionState, pathname, requireAuth, requireOnboarded, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #581c87 20%, #6d28d9 40%, #7c3aed 60%, #a855f7 80%, #c084fc 100%)',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="mb-4 flex justify-center"
          >
            <Image
              src="/holoflower-amber.png"
              alt="Loading"
              width={60}
              height={60}
              style={{ filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))' }}
            />
          </motion.div>
          <p className="text-purple-200 text-sm">Restoring your session...</p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Convenience hook to use session state in components
 */
export function useSession() {
  const [sessionState, setSessionState] = useState(betaSession.getSessionState());

  useEffect(() => {
    const unsubscribe = betaSession.subscribe(setSessionState);
    return unsubscribe;
  }, []);

  return {
    ...sessionState,
    updateUser: (updates: any) => betaSession.updateUser(updates),
    markOnboarded: () => betaSession.markOnboarded(),
    updateLastVisit: () => betaSession.updateLastVisit(),
    logout: () => betaSession.clearSession(),
  };
}
