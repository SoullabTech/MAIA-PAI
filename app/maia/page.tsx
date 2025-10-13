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
import { useUserAuth } from '@/lib/hooks/useUserAuth';
import { OracleConversation } from '@/components/OracleConversation';
import { WisdomJourneyDashboard } from '@/components/maya/WisdomJourneyDashboard';
import { WeavingVisualization } from '@/components/maya/WeavingVisualization';
import { BetaOnboarding } from '@/components/maya/BetaOnboarding';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LogOut, Sparkles, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function getInitialUserData() {
  if (typeof window === 'undefined') return { id: 'guest', name: 'Explorer' };

  const betaUser = localStorage.getItem('beta_user');
  if (betaUser) {
    try {
      const userData = JSON.parse(betaUser);
      if (userData.onboarded === true && userData.id && userData.username) {
        return { id: userData.id, name: userData.username };
      }
    } catch (e) {}
  }

  if (localStorage.getItem('betaOnboardingComplete') === 'true') {
    const id = localStorage.getItem('explorerId') || localStorage.getItem('betaUserId');
    const name = localStorage.getItem('explorerName');
    if (id && name) {
      return { id, name };
    }
  }

  return { id: 'guest', name: 'Explorer' };
}

export default function MAIAPage() {
  const router = useRouter();
  const { user, isOnboarded, isLoading } = useUserAuth();

  const initialData = getInitialUserData();
  const [explorerId, setExplorerId] = useState(initialData.id);
  const [explorerName, setExplorerName] = useState(initialData.name);
  const [sessionId] = useState(() => Date.now().toString());
  const [showDashboard, setShowDashboard] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  const hasCheckedAuth = useRef(false);

  const handleSignOut = () => {
    localStorage.removeItem('beta_user');
    localStorage.removeItem('beta_users');
    localStorage.removeItem('betaOnboardingComplete');
    localStorage.removeItem('explorerId');
    localStorage.removeItem('betaUserId');
    localStorage.removeItem('explorerName');
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
        if (explorerId !== newId) setExplorerId(newId);
        if (explorerName !== newName) setExplorerName(newName);
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
  }, [explorerId, explorerName]);

  if (needsOnboarding) {
    return <BetaOnboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <ErrorBoundary>
      <div className="h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-white/5 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-6 h-6 text-amber-400" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold text-white">SOUL​LAB</h1>
                <p className="text-xs text-stone-400">Beta Experience</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDashboard(!showDashboard)}
                className="px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white hover:bg-black/50 transition-colors flex items-center gap-2"
              >
                <Menu className="w-4 h-4" />
                <span className="hidden sm:inline">Journey</span>
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-stone-400"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* HUD Status Bar - High-end Game Interface for Serious Work */}
        <div className="flex-shrink-0 relative bg-black/60 border-b border-amber-600/10 backdrop-blur-xl">
          {/* Scanning line effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-600/5 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Status Indicator - Like a power core */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping">
                      <div className="w-2 h-2 bg-amber-600/40 rounded-full"></div>
                    </div>
                    <div className="relative w-2 h-2 bg-amber-600 rounded-full"></div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-600/80 uppercase tracking-widest">ONLINE</span>
                </div>

                {/* System Status */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-stone-600 uppercase">SYSTEM</span>
                    <span className="text-[10px] font-mono text-amber-600">DREAMWEAVER_V2</span>
                  </div>

                  <div className="h-3 w-px bg-stone-800"></div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-stone-600 uppercase">MODE</span>
                    <span className="text-[10px] font-mono text-amber-600">WISDOM_SYNTHESIS</span>
                  </div>

                  <div className="h-3 w-px bg-stone-800"></div>

                  {/* Live metrics */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-3 bg-amber-600/60"></div>
                      <div className="w-1 h-4 bg-amber-600/70"></div>
                      <div className="w-1 h-2 bg-amber-600/50"></div>
                      <div className="w-1 h-5 bg-amber-600/80"></div>
                      <div className="w-1 h-3 bg-amber-600/60"></div>
                    </div>
                    <span className="text-[10px] font-mono text-stone-600">NEURAL_ACTIVITY</span>
                  </div>
                </div>
              </div>

              {/* Action Button - Like a game menu */}
              <button
                onClick={() => setShowDashboard(true)}
                className="group relative overflow-hidden px-4 py-1.5 bg-black/40 border border-amber-600/20 hover:border-amber-600/40 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/10 to-amber-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-amber-600/60"></div>
                    <div className="w-1 h-1 bg-amber-600/60"></div>
                    <div className="w-1 h-1 bg-amber-600/60"></div>
                  </div>
                  <span className="text-[11px] font-mono text-amber-600/80 group-hover:text-amber-600 uppercase tracking-wider">
                    WISDOM MATRIX
                  </span>
                  <svg className="w-3 h-3 text-amber-600/60 group-hover:text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L13.586 11H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversation Area */}
          <div className="flex-1 overflow-hidden relative">
            <OracleConversation
              userId={explorerId}
              userName={explorerName}
              sessionId={sessionId}
              voiceEnabled={true}
            />
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
                        <h2 className="text-lg font-mono text-amber-600/80 uppercase tracking-wider">WISDOM MATRIX</h2>
                        <p className="text-xs font-mono text-stone-600 mt-1">PATTERN ANALYSIS • EMERGENCE TRACKING</p>
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