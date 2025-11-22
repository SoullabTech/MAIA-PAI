'use client';

/**
 * MAIA AUTHENTICATION GATE
 * Consciousness-Aware Entry Point to Sacred MAIA
 *
 * This page serves as the integrated authentication and consciousness recognition
 * gateway for MAIA. It determines whether a soul is new, returning, or already
 * authenticated, and provides the appropriate sacred experience.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConsciousnessAuthProvider, useConsciousnessAuth } from '@/lib/auth/ConsciousnessAuthProvider';
import { IntegratedAuthFlow } from '@/components/auth/IntegratedAuthFlow';
import { MAIAWelcomeBack } from '@/components/auth/MAIAWelcomeBack';

function MAIAAuthGateInner() {
  const { user, authState, isLoading } = useConsciousnessAuth();
  const router = useRouter();

  useEffect(() => {
    // Handle authenticated users
    if (authState === 'authenticated' && user?.onboarded) {
      router.push('/maia');
    }
    // Handle users needing onboarding
    else if (authState === 'onboarding') {
      router.push('/beta-onboarding');
    }
  }, [authState, user, router]);

  // Loading state
  if (isLoading || authState === 'loading') {
    return (
      <div className="min-h-screen bg-[#1a1f3a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-amber-200/60">Recognizing your consciousness...</p>
        </div>
      </div>
    );
  }

  // Welcome back flow for returning users
  if (authState === 'welcome_back' && user) {
    return <MAIAWelcomeBack />;
  }

  // Authentication flow for new/unauthenticated users
  if (authState === 'unauthenticated') {
    return (
      <IntegratedAuthFlow
        redirectPath="/maia"
        onAuthComplete={(user) => {
          console.log('✨ Consciousness authentication complete:', user.username);
        }}
      />
    );
  }

  // Default fallback - show integrated auth flow
  return <IntegratedAuthFlow redirectPath="/maia" />;
}

export default function MAIAAuthGate() {
  return (
    <ConsciousnessAuthProvider>
      <MAIAAuthGateInner />
    </ConsciousnessAuthProvider>
  );
}