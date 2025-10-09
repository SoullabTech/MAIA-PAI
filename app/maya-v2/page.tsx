'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/lib/hooks/useUserAuth';
import { useFeatureFlags } from '@/apps/web/lib/utils/feature-flags';
import { OracleConversationV2 } from '@/components/OracleConversationV2';

/**
 * Maya V2 - Testing Route for MaiaOrchestrator Architecture
 *
 * This route runs the new architecture where Maia is the conductor,
 * routing to different backends (Claude, Telesphorus, internal) while
 * maintaining consistent voice through MaiaVoice filter.
 *
 * Production /maya route remains untouched during testing.
 *
 * Access: Requires maiaOrchestratorV2 feature flag enabled
 */
export default function MayaV2Page() {
  const router = useRouter();
  const { user, preferences, isOnboarded, isLoading } = useUserAuth();
  const { flags, isClient } = useFeatureFlags();

  useEffect(() => {
    // Feature flag check
    if (isClient && !flags.maiaOrchestratorV2) {
      console.log('🚫 [V2] Feature flag disabled, redirecting to production /maya');
      router.replace('/maya');
      return;
    }

    // Same auth flow as production /maya
    if (!isLoading && !user) {
      console.log('❌ [V2] No user found, redirecting to signup');
      router.replace('/beta-signup');
      return;
    }

    if (!isLoading && user && !isOnboarded) {
      console.log('⚠️ [V2] User not onboarded, redirecting to entry');
      const betaAccessCode = localStorage.getItem('betaAccessCode');
      if (!betaAccessCode) {
        router.replace('/beta-entry');
      } else {
        router.replace('/beta-orientation');
      }
      return;
    }

    if (!isLoading && user && isOnboarded) {
      console.log('✅ [V2] User ready for Maia V2:', user.sacredName);
      console.log('🧪 [V2] Testing MaiaOrchestrator architecture');
    }
  }, [user, isOnboarded, isLoading, router, isClient, flags.maiaOrchestratorV2]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-ain-soph-amber border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-ain-soph-amber">Initializing Maia V2...</div>
          <div className="text-ain-soph-amber/60 text-sm mt-2">Testing Orchestrator Architecture</div>
        </div>
      </div>
    );
  }

  if (!user || !isOnboarded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-ain-soph-amber">Redirecting...</div>
      </div>
    );
  }

  return (
    <OracleConversationV2
      sessionId={Date.now().toString()}
      userId={user.id}
      userName={user.name || user.sacredName}
      voiceEnabled={preferences?.voice_enabled ?? true}
    />
  );
}
