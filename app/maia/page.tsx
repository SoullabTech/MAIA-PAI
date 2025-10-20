'use client';

/**
 * MAIA Page - SOUL​LAB Dream-Weaver Edition
 *
 * MAIA = The Fertile Mother (Pleiades) - She who births wisdom
 * Not Maya (illusion) but MAIA (midwife)
 *
 * Kelly Nezat's vision: "Where two or more are gathered, there I AM"
 * God is more between than within - the I-Thou relationship
 */

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { OracleConversation } from '@/components/OracleConversation';
import { UnifiedBrainTrust } from '@/components/consciousness/UnifiedBrainTrust';
import { WisdomJourneyDashboard } from '@/components/maya/WisdomJourneyDashboard';
import { WeavingVisualization } from '@/components/maya/WeavingVisualization';
import { BetaOnboarding } from '@/components/maya/BetaOnboarding';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PetalCarouselMenuBar } from '@/components/ui/PetalCarouselMenuBar';
import { X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/auth/supabase-client';
import { isIOSChrome } from '@/lib/utils/browserDetection';

function getInitialUserData() {
  if (typeof window === 'undefined') return { id: 'guest', name: 'Explorer' };

  // Check NEW system first (beta_user from auth system)
  const betaUser = localStorage.getItem('beta_user');
  if (betaUser) {
    try {
      const userData = JSON.parse(betaUser);
      if (userData.onboarded === true && userData.id && userData.username) {
        // Also sync to old system for compatibility
        localStorage.setItem('explorerName', userData.username);
        localStorage.setItem('explorerId', userData.id);
        console.log('✅ [MAIA] User authenticated as:', userData.username);
        return { id: userData.id, name: userData.username };
      }
    } catch (e) {
      console.error('❌ [MAIA] Error parsing beta_user:', e);
    }
  }

  // Check OLD system (for backward compatibility)
  if (localStorage.getItem('betaOnboardingComplete') === 'true') {
    const id = localStorage.getItem('explorerId') || localStorage.getItem('betaUserId');
    const name = localStorage.getItem('explorerName');
    if (id && name) {
      console.log('📦 [MAIA] Using legacy user data:', name);
      return { id, name };
    }
  }

  console.log('⚠️ [MAIA] No user data found, using defaults');
  return { id: 'guest', name: 'Explorer' };
}

export default function MAIAPage() {
  const router = useRouter();

  const initialData = getInitialUserData();
  const [explorerId, setExplorerId] = useState(initialData.id);
  const [explorerName, setExplorerName] = useState(initialData.name);
  const [sessionId] = useState(() => Date.now().toString());
  const [showDashboard, setShowDashboard] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [showIOSChromeWarning, setShowIOSChromeWarning] = useState(false);

  const hasCheckedAuth = useRef(false);

  const handleSignOut = async () => {
    // Preserve user profile data (birthday, name, intention, birthData) before clearing session
    const betaUser = localStorage.getItem('beta_user');
    let preservedData: { birthDate?: string; username?: string; intention?: string; birthData?: any } | null = null;

    if (betaUser) {
      try {
        const userData = JSON.parse(betaUser);
        preservedData = {
          birthDate: userData.birthDate,
          username: userData.username,
          intention: userData.intention,
          birthData: userData.birthData // Preserve astrology chart data
        };
      } catch (e) {
        console.error('Error parsing user data for preservation:', e);
      }
    }

    // Sign out from Supabase
    await supabase.auth.signOut();

    // Clear session data only (NOT profile data like birthday)
    localStorage.removeItem('beta_users');
    localStorage.removeItem('betaOnboardingComplete');
    localStorage.removeItem('explorerId');
    localStorage.removeItem('betaUserId');
    localStorage.removeItem('explorerName');

    // Restore preserved profile data but mark as logged out
    if (preservedData) {
      const profileData = {
        ...preservedData,
        onboarded: false, // User needs to sign back in
        loggedOut: true
      };
      localStorage.setItem('beta_user', JSON.stringify(profileData));
      console.log('✅ User profile data preserved after logout:', {
        hasBirthDate: !!preservedData.birthDate,
        hasUsername: !!preservedData.username
      });
    }

    router.push('/');
  };

  const handleOnboardingComplete = (data: { name: string; birthDate?: string; intention?: string }) => {
    const userId = `user_${Date.now()}`;
    const userData = {
      id: userId,
      username: data.name,
      onboarded: true,
      birthDate: data.birthDate,
      intention: data.intention,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('beta_user', JSON.stringify(userData));
    localStorage.setItem('betaOnboardingComplete', 'true');
    localStorage.setItem('explorerId', userId);
    localStorage.setItem('explorerName', data.name);

    setExplorerId(userId);
    setExplorerName(data.name);
    setNeedsOnboarding(false);
  };

  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    // Detect iOS Chrome (voice won't work)
    if (isIOSChrome()) {
      setShowIOSChromeWarning(true);
      console.warn('⚠️ [MAIA] iOS Chrome detected - voice input not supported. Recommend using Safari.');
    }

    // Check Supabase session FIRST
    const checkSupabaseAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Get user profile from database
          const { data: profile } = await supabase
            .from('users')
            .select('name, email')
            .eq('id', session.user.id)
            .single();

          const userName = profile?.name || session.user.email?.split('@')[0] || 'Explorer';
          console.log('✅ [MAIA] Supabase user authenticated:', userName);

          setExplorerId(session.user.id);
          setExplorerName(userName);
          return true; // Authenticated via Supabase
        }
      } catch (error) {
        console.error('⚠️ [MAIA] Supabase auth check failed:', error);
      }
      return false;
    };

    checkSupabaseAuth().then(isSupabaseAuth => {
      if (isSupabaseAuth) {
        // User is authenticated via Supabase - no onboarding needed
        setNeedsOnboarding(false);
        return;
      }

      // Fall back to localStorage beta system
      const newUser = localStorage.getItem('beta_user');
      if (newUser) {
      try {
        const userData = JSON.parse(newUser);
        if (userData.onboarded !== true) {
          setNeedsOnboarding(true);
          return;
        }

        const newId = userData.id || 'guest';
        const newName = userData.username || 'Explorer';

        // Sync to old system for compatibility
        localStorage.setItem('explorerName', newName);
        localStorage.setItem('explorerId', newId);

        if (explorerId !== newId) setExplorerId(newId);
        if (explorerName !== newName) setExplorerName(newName);

        console.log('✅ [MAIA] User session restored:', { name: newName, id: newId });
        return;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    const betaOnboarded = localStorage.getItem('betaOnboardingComplete') === 'true';
    if (!betaOnboarded) {
      setNeedsOnboarding(true);
      return;
    }

    const oldId = localStorage.getItem('explorerId') || localStorage.getItem('betaUserId');
    const oldName = localStorage.getItem('explorerName');

    if (oldId && oldName) {
      if (explorerId !== oldId) setExplorerId(oldId);
      if (explorerName !== oldName) setExplorerName(oldName);
      } else {
        setNeedsOnboarding(true);
      }
    });
  }, [explorerId, explorerName]);

  if (needsOnboarding) {
    return <BetaOnboarding onComplete={handleOnboardingComplete} />;
  }

  // Listen for Journey and Access Matrix events from PetalCarouselMenuBar
  useEffect(() => {
    const handleOpenJourney = () => setShowDashboard(true);
    const handleOpenMatrix = () => setShowDashboard(true);

    window.addEventListener('openJourneyDashboard', handleOpenJourney);
    window.addEventListener('openAccessMatrix', handleOpenMatrix);

    return () => {
      window.removeEventListener('openJourneyDashboard', handleOpenJourney);
      window.removeEventListener('openAccessMatrix', handleOpenMatrix);
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex flex-col overflow-hidden">
        {/* New Petal Carousel Menu Bar - Clean & Minimal Top, Carousel Bottom */}
        <PetalCarouselMenuBar />

        {/* iOS Chrome Warning Banner */}
        <AnimatePresence>
          {showIOSChromeWarning && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="relative z-40 bg-amber-500/10 border-b border-amber-500/30 backdrop-blur-sm"
              style={{ marginTop: '56px' }} // Below the new top bar
            >
              <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-amber-200 font-medium">
                      Voice input doesn't work in Chrome on iPhone
                    </p>
                    <p className="text-xs text-amber-300/80 mt-0.5">
                      Please use Safari for voice conversations with MAIA, or use text chat
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSChromeWarning(false)}
                  className="p-1.5 hover:bg-amber-500/20 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Old header completely removed - all navigation now in PetalCarouselMenuBar */}

        {/* Main Content - with padding for top bar */}
        <div className="flex-1 flex overflow-hidden" style={{ paddingTop: '56px', paddingBottom: '80px' }}>
          {/* Conversation Area */}
          <div className="flex-1 overflow-hidden relative">
            <OracleConversation
              userId={explorerId}
              userName={explorerName}
              sessionId={sessionId}
              voiceEnabled={true}
              hideBottomIconBar={true}
            />

            {/* Unified Brain Trust - Combines Claude Code consciousness + Brain Trust monitoring */}
            <UnifiedBrainTrust />
          </div>

          {/* Wisdom Journey Dashboard - Slide-out Panel */}
          <AnimatePresence>
            {showDashboard && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowDashboard(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                />

                {/* Panel */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="absolute lg:relative right-0 top-0 h-full w-full max-w-md bg-stone-900/95 backdrop-blur-xl border-l border-white/10 overflow-y-auto z-50"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-medium text-stone-200">Your Wisdom Patterns</h2>
                        <p className="text-xs text-stone-500 mt-1">Threads being woven from your reflections</p>
                      </div>
                      <button
                        onClick={() => setShowDashboard(false)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-stone-400" />
                      </button>
                    </div>

                    <WisdomJourneyDashboard userId={explorerId} />

                    {/* Weaving Visualization - Shows the dreamweaver process */}
                    <div className="mt-6">
                      <WeavingVisualization
                        userId={explorerId}
                        onSelectPrompt={(prompt) => {
                          // Feed selected prompt to conversation
                          // TODO: Connect to OracleConversation input
                          console.log('Selected prompt:', prompt.question);
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Welcome Message for First-Time Users */}
        {typeof window !== 'undefined' && !localStorage.getItem('maia_welcome_seen') && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 max-w-md w-full mx-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="text-center">
              <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Welcome, {explorerName}
              </h3>
              <p className="text-sm text-stone-300 mb-4">
                Share your story. MAIA will help you discover the wisdom within it.
                Your journey begins now.
              </p>
              <button
                onClick={() => {
                  localStorage.setItem('maia_welcome_seen', 'true');
                  window.location.reload();
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
              >
                Begin
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </ErrorBoundary>
  );
}