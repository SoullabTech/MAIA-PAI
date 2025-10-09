'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/lib/hooks/useUserAuth';
import { OracleConversation } from '@/components/OracleConversation';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LogOut } from 'lucide-react';

export default function MayaPage() {
  const router = useRouter();
  const { user, preferences, isOnboarded, isLoading } = useUserAuth();
  const [explorerId, setExplorerId] = useState('guest');
  const [explorerName, setExplorerName] = useState('Explorer');

  const handleSignOut = () => {
    // Clear all auth data
    localStorage.removeItem('beta_user');
    localStorage.removeItem('beta_users');
    localStorage.removeItem('betaOnboardingComplete');
    localStorage.removeItem('explorerId');
    localStorage.removeItem('betaUserId');
    localStorage.removeItem('explorerName');

    console.log('👋 Signed out, redirecting to home');
    router.push('/');
  };

  useEffect(() => {
    // Check NEW auth system first
    const newUser = localStorage.getItem('beta_user');
    if (newUser) {
      try {
        const userData = JSON.parse(newUser);
        console.log('🔍 [maya] Found new system user:', { username: userData.username, onboarded: userData.onboarded });

        if (userData.onboarded !== true) {
          console.log('❌ [maya] Not onboarded, redirecting to /onboarding');
          router.replace('/onboarding');
          return;
        }

        // Check if user has seen intro today
        const lastIntroDate = localStorage.getItem('last_intro_date');
        const today = new Date().toDateString();

        if (lastIntroDate !== today) {
          console.log('✨ [maya] New day - showing intro sequence');
          localStorage.setItem('last_intro_date', today);
          router.replace('/intro');
          return;
        }

        console.log('✅ [maya] User onboarded, loading Maya');
        setExplorerId(userData.id || 'guest');
        setExplorerName(userData.username || 'Explorer');
        return;
      } catch (e) {
        console.error('❌ [maya] Error parsing new user data:', e);
      }
    }

    // Fallback to OLD system for migration
    const betaOnboarded = localStorage.getItem('betaOnboardingComplete') === 'true';

    if (!betaOnboarded) {
      console.log('❌ [maya] Not onboarded (old system), redirecting to signup');
      router.replace('/beta-signup');
      return;
    }

    console.log('✅ [maya] User onboarded (old system), loading Maya');

    // Get user data from localStorage as fallback
    const id = user?.id || localStorage.getItem('explorerId') || localStorage.getItem('betaUserId') || 'guest';
    const name = user?.name || user?.sacredName || localStorage.getItem('explorerName') || 'Explorer';

    setExplorerId(id);
    setExplorerName(name);
  }, [router, user]);

  // Show loading state while checking auth (but allow guest to proceed)
  // Commenting out this check - it might be too aggressive
  // if (!explorerId || explorerId === 'guest') {
  //   return (
  //     <div className="relative min-h-screen bg-[#1a1f3a] flex items-center justify-center">
  //       <div className="text-amber-200/60">Loading...</div>
  //     </div>
  //   );
  // }

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-[#0a0b14]" style={{ backgroundColor: '#0a0b14' }}>
        {/* Sign Out Button - Fixed top-right */}
        <button
          onClick={handleSignOut}
          className="fixed top-4 right-4 z-50 p-3 bg-[#1A1F2E]/80 border border-amber-500/20 rounded-full hover:border-amber-500/50 hover:bg-[#1A1F2E] transition-all backdrop-blur-sm"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5 text-amber-400/70 hover:text-amber-400" />
        </button>

        {explorerId ? (
          <OracleConversation
            sessionId={Date.now().toString()}
            userId={explorerId}
            userName={explorerName}
            voiceEnabled={preferences?.voice_enabled ?? true}
          />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-amber-200/60 text-lg">Initializing MAIA...</div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}