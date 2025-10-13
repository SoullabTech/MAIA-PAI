'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/lib/hooks/useUserAuth';
import { OracleConversation } from '@/components/OracleConversation';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LogOut } from 'lucide-react';

// Helper to get initial user state from localStorage (runs before first render)
function getInitialUserData() {
  if (typeof window === 'undefined') return { id: 'guest', name: 'Explorer' };

  // Check NEW auth system
  const betaUser = localStorage.getItem('beta_user');
  if (betaUser) {
    try {
      const userData = JSON.parse(betaUser);
      if (userData.onboarded === true && userData.id && userData.username) {
        return { id: userData.id, name: userData.username };
      }
    } catch (e) {}
  }

  // Check OLD auth system
  if (localStorage.getItem('betaOnboardingComplete') === 'true') {
    const id = localStorage.getItem('explorerId') || localStorage.getItem('betaUserId');
    const name = localStorage.getItem('explorerName');
    if (id && name) {
      return { id, name };
    }
  }

  return { id: 'guest', name: 'Explorer' };
}

export default function MayaPage() {
  console.log('[MayaPage] Component mounting - Stack trace:', new Error().stack?.split('\n').slice(0, 3));
  const router = useRouter();
  const { user, preferences, isOnboarded, isLoading } = useUserAuth();

  // Initialize state from localStorage to prevent re-mount when auth loads
  const initialData = getInitialUserData();
  const [explorerId, setExplorerId] = useState(initialData.id);
  const [explorerName, setExplorerName] = useState(initialData.name);

  // Create session ID once and keep it stable across renders
  const [sessionId] = useState(() => Date.now().toString());

  // Track if we've already run auth checks to prevent redirect loops
  const hasCheckedAuth = useRef(false);

  console.log('[MayaPage] State:', { explorerId, explorerName, isLoading });

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
    // Only run auth checks once to prevent redirect loops during conversation
    if (hasCheckedAuth.current) {
      return;
    }
    hasCheckedAuth.current = true;

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

        // Check if user has seen intro today - COMMENTED OUT TO PREVENT INTERRUPTIONS
        // const lastIntroDate = localStorage.getItem('last_intro_date');
        // const today = new Date().toDateString();
        // if (lastIntroDate !== today) {
        //   console.log('✨ [maya] New day - showing intro sequence');
        //   localStorage.setItem('last_intro_date', today);
        //   router.replace('/intro');
        //   return;
        // }

        console.log('✅ [maya] User onboarded, loading Maya');
        // Only update state if values actually changed
        const newId = userData.id || 'guest';
        const newName = userData.username || 'Explorer';
        if (explorerId !== newId) setExplorerId(newId);
        if (explorerName !== newName) setExplorerName(newName);
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

    // Only update state if values actually changed
    if (explorerId !== id) setExplorerId(id);
    if (explorerName !== name) setExplorerName(name);
  }, [router, user]); // FIXED: Removed explorerId/explorerName to prevent infinite loop

  // Show loading state while checking auth (but allow guest to proceed)
  // Commenting out this check - it might be too aggressive
  // if (!explorerId || explorerId === 'guest') {
  //   return (
  //     <div className="relative min-h-screen bg-[#1a1f3a] flex items-center justify-center">
  //       <div className="text-amber-200/60">Loading...</div>
  //     </div>
  //   );
  // }

  // Enhanced error handling and logging
  console.log('[MayaPage] Rendering with:', { explorerId, explorerName, voiceEnabled: preferences?.voice_enabled });

  if (!explorerId || explorerId === '') {
    console.log('[MayaPage] No explorerId yet, showing loading state');
    return (
      <div className="relative min-h-screen bg-soul-background flex items-center justify-center">
        <div className="text-soul-textSecondary text-lg">Initializing MAIA...</div>
      </div>
    );
  }

  try {
    console.log('[MayaPage] Rendering OracleConversation');
    return (
      <ErrorBoundary
        fallback={
          <div className="min-h-screen bg-soul-background flex items-center justify-center text-soul-textPrimary p-8">
            <div className="max-w-md text-center space-y-4">
              <h2 className="text-2xl">Something went wrong</h2>
              <p className="text-soul-textSecondary">MAIA encountered an error. Please refresh the page.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-soul-accent/90 hover:bg-soul-accentHover text-soul-background rounded-lg transition-all"
              >
                Refresh
              </button>
            </div>
          </div>
        }
      >
        <div className="relative min-h-screen bg-soul-background" style={{ backgroundColor: '#1C1614', minHeight: '100vh', position: 'relative' }}>
          <button
            onClick={handleSignOut}
            className="fixed top-4 right-4 z-[200] p-3 bg-soul-surface/80 border border-soul-accent/20 rounded-full hover:border-soul-accent/50 hover:bg-soul-surface transition-all backdrop-blur-sm"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 text-soul-accent/70 hover:text-soul-accent" />
          </button>

          <OracleConversation
            sessionId={sessionId}
            userId={explorerId}
            userName={explorerName}
            voiceEnabled={preferences?.voice_enabled ?? true}
          />
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('[MayaPage] Render error:', error);
    return (
      <div className="min-h-screen bg-soul-background flex items-center justify-center text-soul-textPrimary p-8">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl">Error loading MAIA</h2>
          <p className="text-soul-textSecondary">{String(error)}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-soul-accent/90 hover:bg-soul-accentHover text-soul-background rounded-lg transition-all"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
}