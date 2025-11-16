'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Clock, Search, HelpCircle, Sparkles, Mic, BarChart3, Settings as SettingsIcon, Gem, Beaker, Library, Users, Target, TrendingUp } from 'lucide-react';
import { Copy } from '@/lib/copy/MaiaCopy';
import { useMaiaStore } from '@/lib/maia/state';
import { mockEntries } from '@/lib/maia/mockData';

import SoulfulAppShell from '@/components/onboarding/SoulfulAppShell';
import ModeSelection from '@/components/maia/ModeSelection';
import JournalEntry from '@/components/maia/JournalEntry';
import VoiceJournaling from '@/components/maia/VoiceJournaling';
import MaiaReflection from '@/components/maia/MaiaReflection';
import TimelineView from '@/components/maia/TimelineView';
import SemanticSearch from '@/components/maia/SemanticSearch';
import Analytics from '@/components/maia/Analytics';
import Settings from '@/components/maia/Settings';
import SoulprintSnapshot from '@/components/maia/SoulprintSnapshot';
import SoulprintDashboard from '@/components/maia/SoulprintDashboard';
import MissionManager from '@/components/missions/MissionManager';

export default function MaiaPage() {
  const { currentView, setView, entries, selectedMode, isVoiceMode } = useMaiaStore();

  console.log('🎯 [MAIA PAGE] Rendering with currentView:', currentView, 'selectedMode:', selectedMode);
  const [userId] = useState('demo-user');
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSoulprint, setShowSoulprint] = useState(false);
  const [showLabTools, setShowLabTools] = useState(false);
  const [showMissionManager, setShowMissionManager] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [useVoiceMode, setUseVoiceMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const demo = params.get('demo');
      const dev = params.get('dev');

      if (demo === 'true') {
        setIsDemoMode(true);
      }
      if (dev === 'true') {
        setIsDevMode(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isDemoMode && entries.length === 0) {
      mockEntries.forEach(entry => {
        useMaiaStore.setState((state) => ({
          entries: [...state.entries, entry]
        }));
      });
    }
  }, [isDemoMode, entries.length]);

  const renderView = () => {
    console.log('🎯 [RENDER VIEW] Switching on currentView:', currentView, 'isVoiceMode:', isVoiceMode);
    switch (currentView) {
      case 'mode-select':
        console.log('🎯 [RENDER VIEW] Rendering ModeSelection');
        return <ModeSelection />;
      case 'journal-entry':
        console.log('🎯 [RENDER VIEW] Rendering JournalEntry');
        return <JournalEntry />;
      case 'voice-journal':
        console.log('🎯 [RENDER VIEW] Rendering VoiceJournaling');
        return <VoiceJournaling />;
      case 'reflection':
        console.log('🎯 [RENDER VIEW] Rendering MaiaReflection');
        return <MaiaReflection />;
      case 'timeline':
        console.log('🎯 [RENDER VIEW] Rendering TimelineView');
        return <TimelineView />;
      case 'search':
        console.log('🎯 [RENDER VIEW] Rendering SemanticSearch');
        return <SemanticSearch />;
      default:
        console.log('🎯 [RENDER VIEW] Default case - rendering ModeSelection');
        return <ModeSelection />;
    }
  };

  return (
    <SoulfulAppShell userId={userId}>
      <div className="min-h-screen bg-gradient-to-br from-jade-abyss via-jade-shadow to-jade-night">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {/* Consciousness Header Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              {/* Coherence metrics moved to Analytics page */}
            </div>

            <nav className="flex items-center gap-2">
              <button
                onClick={() => setView('mode-select')}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all ${
                  currentView === 'mode-select' || currentView === 'journal-entry' || currentView === 'voice-journal' || currentView === 'reflection'
                    ? 'bg-jade-jade text-jade-abyss font-medium shadow-lg shadow-jade-jade/25'
                    : 'text-jade-mineral hover:bg-jade-shadow/40 hover:text-jade-sage'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Journal</span>
              </button>

              <a
                href="/journal"
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm text-jade-mineral hover:bg-jade-shadow/40 hover:text-jade-sage transition-all"
                title="Jade Journal - Temporal Consciousness"
              >
                <Gem className="w-4 h-4" />
                <span className="hidden sm:inline">Jade</span>
              </a>

              <a
                href="/ganesha"
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm text-jade-mineral hover:bg-jade-shadow/40 hover:text-jade-sage transition-all"
                title="Ganesha - Community Management"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Ganesha</span>
              </a>

              <a
                href="/maia/insights"
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm text-jade-mineral hover:bg-jade-shadow/40 hover:text-jade-sage transition-all"
                title="Developmental Insights - Track Your Consciousness Evolution"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Insights</span>
              </a>

              <a
                href="/maia/dev-chat"
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm text-jade-mineral hover:bg-jade-shadow/40 hover:text-jade-sage transition-all"
                title="Chat with Development-Aware MAIA"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Dev Chat</span>
              </a>

              {entries.length >= 3 && (
                <button
                  onClick={() => setView('timeline')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all ${
                    currentView === 'timeline'
                      ? 'bg-jade-jade text-jade-abyss font-medium shadow-lg shadow-jade-jade/25'
                      : 'text-jade-mineral hover:bg-jade-shadow/40 hover:text-jade-sage'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Timeline</span>
                </button>
              )}

              {entries.length >= 5 && (
                <button
                  onClick={() => setView('search')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all ${
                    currentView === 'search'
                      ? 'bg-jade-jade text-jade-abyss font-medium shadow-lg shadow-jade-jade/25'
                      : 'text-jade-mineral hover:bg-jade-shadow/40 hover:text-jade-sage'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              )}

              {entries.length > 0 && (
                <button
                  onClick={() => setShowSoulprint(!showSoulprint)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full text-sm text-jade-mineral hover:bg-jade-shadow/40 hover:text-jade-sage transition-all"
                  title="Soulprint"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setShowLabTools(!showLabTools)}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm text-jade-mineral hover:bg-jade-shadow/40 hover:text-jade-sage transition-all"
                title="Lab Tools & Community"
              >
                <Beaker className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm text-jade-mineral hover:bg-jade-shadow/40 hover:text-jade-sage transition-all"
                title="Analytics"
              >
                <BarChart3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm text-jade-mineral hover:bg-jade-shadow/40 hover:text-jade-sage transition-all"
                title="Settings"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowHelp(!showHelp)}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm text-jade-mineral hover:bg-jade-shadow/40 hover:text-jade-sage transition-all"
                title="Help"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </nav>
          </div>

          <main className="py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>

        {entries.length === 0 && !isDemoMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="fixed bottom-6 right-6 flex flex-col gap-2"
          >
            <button
              onClick={() => setIsDemoMode(true)}
              className="px-4 py-2 bg-violet-600 text-white rounded-full text-sm font-medium hover:bg-violet-700 transition-colors shadow-lg"
            >
              Load Demo Entries
            </button>
          </motion.div>
        )}

        {isDevMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed top-20 right-6 p-3 bg-amber-100 dark:bg-amber-900 rounded-lg border border-amber-300 dark:border-amber-700 text-xs"
          >
            <div className="font-bold mb-1">Dev Mode</div>
            <div>Entries: {entries.length}</div>
            <div>View: {currentView}</div>
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={useVoiceMode}
                onChange={(e) => setUseVoiceMode(e.target.checked)}
                className="rounded"
              />
              Voice Mode
            </label>
          </motion.div>
        )}

        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setShowHelp(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-8 max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  {Copy.help.title}
                </h2>

                <div className="space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
                  <div>
                    <h3 className="font-semibold mb-1">{Copy.help.whatIsJournaling}</h3>
                    <p>MAIA helps you explore your inner world through 5 guided modes—each designed to support different types of reflection.</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1">{Copy.help.aboutPatterns}</h3>
                    <p>As you write, MAIA notices symbols, archetypes, and emotional patterns. Over time, these reveal themes in your journey.</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1">Progressive Discovery</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>After 3 entries: Timeline view unlocks</li>
                      <li>After 5 entries: Semantic search unlocks</li>
                      <li>Voice journaling available anytime</li>
                    </ul>
                  </div>

                  {isDevMode && (
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <h3 className="font-semibold mb-1 text-amber-800 dark:text-amber-300">Test Modes</h3>
                      <ul className="text-xs space-y-1">
                        <li><code>?demo=true</code> - Load demo entries</li>
                        <li><code>?dev=true</code> - Show dev panel</li>
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowHelp(false)}
                  className="mt-6 w-full py-3 bg-jade-jade text-jade-abyss rounded-full font-semibold hover:shadow-lg hover:shadow-jade-jade/25 transition-all"
                >
                  Got it
                </button>
              </motion.div>
            </motion.div>
          )}

          {showSettings && <Settings onClose={() => setShowSettings(false)} />}

          {showSoulprint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setShowSoulprint(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    Your Soulprint
                  </h2>
                  <button
                    onClick={() => setShowSoulprint(false)}
                    className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    Close
                  </button>
                </div>
                <SoulprintDashboard userId={userId} />
              </motion.div>
            </motion.div>
          )}

          {showAnalytics && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setShowAnalytics(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    Analytics
                  </h2>
                  <button
                    onClick={() => setShowAnalytics(false)}
                    className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    Close
                  </button>
                </div>
                <Analytics />
              </motion.div>
            </motion.div>
          )}

          {showLabTools && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setShowLabTools(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    Lab Tools & Community
                  </h2>
                  <button
                    onClick={() => setShowLabTools(false)}
                    className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Mission Management */}
                  <button
                    onClick={() => {
                      setShowMissionManager(true);
                      setShowLabTools(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 transition-all border border-amber-200 dark:border-amber-800"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Mission Management</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Create & track your consciousness missions</p>
                    </div>
                  </button>

                  {/* Oracle Library */}
                  <button
                    onClick={() => {
                      window.open('/oracle/library', '_blank');
                      setShowLabTools(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900/30 dark:hover:to-purple-900/30 transition-all border border-violet-200 dark:border-violet-800"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-violet-500 rounded-lg flex items-center justify-center">
                      <Library className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Oracle Library</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Upload files for AI wisdom analysis</p>
                    </div>
                  </button>

                  {/* Community Commons */}
                  <button
                    onClick={() => {
                      window.open('/community', '_blank');
                      setShowLabTools(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 transition-all border border-emerald-200 dark:border-emerald-800"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Community Commons</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Connect with the consciousness community</p>
                    </div>
                  </button>

                  {/* Consciousness APIs */}
                  <button
                    onClick={() => {
                      window.open('/docs/community-library/consciousness-apis.md', '_blank');
                      setShowLabTools(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-jade-50 to-cyan-50 dark:from-jade-900/20 dark:to-cyan-900/20 rounded-xl hover:from-jade-100 hover:to-cyan-100 dark:hover:from-jade-900/30 dark:hover:to-cyan-900/30 transition-all border border-jade-200 dark:border-jade-800"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-jade-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Consciousness APIs</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Maya's wisdom-powered tracking APIs</p>
                    </div>
                  </button>

                  {/* Lab Tools Dashboard */}
                  <button
                    onClick={() => {
                      window.open('/soullab', '_blank');
                      setShowLabTools(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-900/30 dark:hover:to-amber-900/30 transition-all border border-orange-200 dark:border-orange-800"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Beaker className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Lab Tools Dashboard</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Advanced development & testing tools</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showMissionManager && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setShowMissionManager(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    Mission Management
                  </h2>
                  <button
                    onClick={() => setShowMissionManager(false)}
                    className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    ✕
                  </button>
                </div>
                <MissionManager />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </SoulfulAppShell>
  );
}