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
import { LogOut, Sparkles, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  }, [explorerId, explorerName]);

  if (needsOnboarding) {
    return <BetaOnboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <ErrorBoundary>
      <div className="h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex flex-col overflow-hidden">
        {/* DREAM-WEAVER SYSTEM - Combined Header & Banner */}
        <div className="flex-shrink-0 relative overflow-hidden bg-gradient-to-r from-black/20 via-amber-950/5 to-black/20 border-b border-amber-900/10 backdrop-blur-sm">
          {/* Spice particle effect - very subtle movement */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(1px 1px at 20% 30%, amber 0%, transparent 50%),
                                 radial-gradient(1px 1px at 60% 70%, amber 0%, transparent 50%),
                                 radial-gradient(1px 1px at 80% 10%, amber 0%, transparent 50%)`,
                backgroundSize: '50px 50px',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          {/* Holographic scan line - more transparent */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-600/3 to-transparent pointer-events-none"
            animate={{
              y: ['-100%', '200%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 3
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Left side - SOULLAB branding */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
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
                    <Sparkles className="w-5 h-5 text-amber-400/80" />
                  </motion.div>
                  <div>
                    <h1 className="text-sm font-bold text-white/90">SOUL​LAB</h1>
                    <p className="text-[9px] text-stone-500">Beta Experience</p>
                  </div>
                </div>

                {/* Dream Weaver indicator - smaller, inline */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-shrink-0">
                    <div className="relative flex items-center justify-center w-4 h-4">
                      <div className="absolute inset-0 border border-amber-700/20 rotate-45" />
                      <motion.div
                        className="absolute inset-0.5 bg-gradient-to-br from-amber-600/30 to-orange-700/30"
                        animate={{
                          rotate: [45, 405],
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-amber-600/50 tracking-[0.15em] uppercase">
                      Dream Weaver
                    </span>
                    <motion.span
                      className="text-[8px] font-mono text-amber-500/30"
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      ACTIVE
                    </motion.span>
                  </div>
                  <span className="text-[9px] text-stone-600 hidden lg:block">
                    Neural patterns emerging from dialogue
                  </span>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center gap-2">
                {/* Journey button */}
                <button
                  onClick={() => setShowDashboard(!showDashboard)}
                  className="px-3 py-1.5 rounded-lg bg-black/20 border border-amber-500/20 hover:bg-black/30 hover:border-amber-500/30 transition-all flex items-center gap-2"
                  style={{ color: '#F59E0B' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FCD34D';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) icon.style.color = '#FCD34D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#F59E0B';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) icon.style.color = '#F59E0B';
                  }}
                >
                  <Menu className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
                  <span className="hidden sm:inline text-xs">Journey</span>
                </button>

                {/* Access Matrix button - cinematic style */}
                <motion.button
                  onClick={() => setShowDashboard(true)}
                  className="relative group px-3 py-1.5 overflow-hidden flex-shrink-0"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-black/10 border border-amber-700/10 group-hover:border-amber-600/20 transition-colors" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-600/5 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="relative flex items-center gap-2">
                    <span className="text-[9px] font-mono text-amber-600/60 tracking-wider uppercase">
                      Access Matrix
                    </span>
                    <svg className="w-3 h-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#B45309' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </motion.button>

                {/* Sign out button */}
                <button
                  onClick={handleSignOut}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: '#F59E0B' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FCD34D';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) icon.style.color = '#FCD34D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#F59E0B';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) icon.style.color = '#F59E0B';
                  }}
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" style={{ color: '#F59E0B' }} />
                </button>
              </div>
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