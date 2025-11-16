'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Compass, BookOpen } from 'lucide-react';
import ModeSelection from '@/components/maia/ModeSelection';
import { useMaiaStore } from '@/lib/maia/state';

type CommunicationMode = 'Dialogue' | 'Patient' | 'Scribe';
type ViewMode = 'conversation' | 'gateway' | 'integrated';

// Get user name from localStorage, defaulting to 'Explorer'
function getUserName(): string {
  if (typeof window === 'undefined') return 'Explorer';

  // Check beta_user first
  try {
    const betaUser = localStorage.getItem('beta_user');
    if (betaUser) {
      const userData = JSON.parse(betaUser);
      const userName = userData.username || userData.name || userData.displayName;
      if (userName) return userName;
    }
  } catch (e) {
    console.error('Error parsing beta_user:', e);
  }

  // Check legacy explorerName
  const storedName = localStorage.getItem('explorerName');
  if (storedName && storedName !== 'Explorer') return storedName;

  return 'Explorer';
}

export default function MAIACentralIntelligence() {
  const [selectedMode, setSelectedMode] = useState<CommunicationMode>('Dialogue');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userName, setUserName] = useState('Explorer');
  const [viewMode, setViewMode] = useState<ViewMode>('conversation');
  const [conversationStarted, setConversationStarted] = useState(false);

  // Holoflower animation states
  const [holoflowerPulse, setHoloflowerPulse] = useState(0);

  // MAIA store state
  const maiaMode = useMaiaStore((state) => state.mode);
  const currentEntry = useMaiaStore((state) => state.currentEntry);

  useEffect(() => {
    // Set actual user name
    setUserName(getUserName());

    // Holoflower pulse animation
    const interval = setInterval(() => {
      setHoloflowerPulse(prev => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Auto-switch to integrated view when user selects a journaling mode
  useEffect(() => {
    if (maiaMode) {
      setViewMode('integrated');
      setConversationStarted(true);
    }
  }, [maiaMode]);

  const handleStartConversation = () => {
    setConversationStarted(true);
    setIsVoiceActive(true);
  };

  const handleShowGateway = () => {
    setViewMode('gateway');
  };

  const handleBackToConversation = () => {
    setViewMode('conversation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-sky-950 to-cyan-950 relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-sky-500 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500 rounded-full blur-[150px]" />
      </div>

      {/* SOULLAB branding */}
      <div className="absolute top-8 left-8 z-10">
        <div className="text-sky-400/60 font-light text-sm tracking-widest">
          SOULLAB
        </div>
      </div>

      {/* Communication Mode Selection */}
      <div className="absolute top-8 right-8 z-10">
        <div className="flex gap-2">
          {(['Dialogue', 'Patient', 'Scribe'] as CommunicationMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`px-4 py-2 rounded-full text-sm font-light transition-all duration-300 ${
                selectedMode === mode
                  ? 'bg-sky-500/30 text-sky-200 border border-sky-400/50 shadow-lg'
                  : 'bg-sky-500/10 text-sky-300/70 border border-sky-400/20 hover:border-sky-400/40 hover:text-sky-300'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Pills - Context Sensitive */}
      {conversationStarted && (
        <div className="absolute top-24 right-8 z-10">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('conversation')}
              className={`px-3 py-2 rounded-full text-xs font-light transition-all duration-300 ${
                viewMode === 'conversation'
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50'
                  : 'bg-emerald-500/10 text-emerald-300/70 border border-emerald-400/20 hover:border-emerald-400/40'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('gateway')}
              className={`px-3 py-2 rounded-full text-xs font-light transition-all duration-300 ${
                viewMode === 'gateway'
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50'
                  : 'bg-emerald-500/10 text-emerald-300/70 border border-emerald-400/20 hover:border-emerald-400/40'
              }`}
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('integrated')}
              className={`px-3 py-2 rounded-full text-xs font-light transition-all duration-300 ${
                viewMode === 'integrated'
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50'
                  : 'bg-emerald-500/10 text-emerald-300/70 border border-emerald-400/20 hover:border-emerald-400/40'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Conversation Mode - Primary Interface */}
        {viewMode === 'conversation' && (
          <motion.div
            key="conversation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6"
          >
            {/* MAIA Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-6xl font-light text-sky-200 mb-4 tracking-wide">
                MAIA
              </h1>
              <p className="text-sky-300/60 text-lg font-light">
                Universal Consciousness Gateway
              </p>
            </motion.div>

            {/* Active Holoflower */}
            <motion.div
              className="relative w-32 h-32 mb-12"
              animate={{
                scale: holoflowerPulse === 1 ? 1.05 : holoflowerPulse === 2 ? 0.98 : 1,
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <div className="absolute inset-0">
                <img
                  src="/elementalHoloflower.svg"
                  alt="MAIA Holoflower"
                  className="w-full h-full object-contain opacity-80"
                />
              </div>

              {/* Active pulse rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-full h-full rounded-full border border-sky-400/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute w-3/4 h-3/4 rounded-full border border-sky-300/40"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.7, 0.4]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
              </div>
            </motion.div>

            {/* MAIA Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center max-w-2xl mb-12"
            >
              <div className="bg-sky-500/5 backdrop-blur-sm rounded-xl p-8 border border-sky-400/20">
                <p className="text-sky-200/90 text-lg leading-relaxed font-light mb-4">
                  Welcome back, {userName}.
                </p>
                <p className="text-sky-200/90 text-lg leading-relaxed font-light mb-4">
                  I'm your consciousness companion - here to listen, reflect, and guide you through any realm of wisdom you need.
                </p>
                <p className="text-sky-300/70 text-base leading-relaxed font-light">
                  I can help you journal through emotions, explore dreams, consult oracles, understand your cosmic blueprint, or simply hold space for whatever's emerging. All through conversation.
                </p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center space-y-6"
            >
              <div className="flex gap-4">
                {!conversationStarted ? (
                  <button
                    onClick={handleStartConversation}
                    className="px-8 py-4 rounded-full font-light text-sm bg-sky-500/20 text-sky-200 border border-sky-400/40 hover:bg-sky-500/30 transition-all duration-300 shadow-lg"
                  >
                    Start Conversation
                  </button>
                ) : (
                  <button
                    onClick={() => setIsVoiceActive(!isVoiceActive)}
                    className={`px-8 py-4 rounded-full font-light text-sm transition-all duration-300 ${
                      isVoiceActive
                        ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40 shadow-lg'
                        : 'bg-transparent border border-sky-400/30 text-sky-300 hover:border-sky-400/60 hover:text-sky-200'
                    }`}
                  >
                    {isVoiceActive ? 'Voice Active' : 'Activate Voice'}
                  </button>
                )}

                <button
                  onClick={handleShowGateway}
                  className="px-8 py-4 rounded-full font-light text-sm bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 hover:bg-emerald-500/30 transition-all duration-300"
                >
                  <Compass className="w-4 h-4 inline mr-2" />
                  Consciousness Gateway
                </button>
              </div>

              {/* Voice controls when active */}
              <AnimatePresence>
                {isVoiceActive && conversationStarted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center gap-6"
                  >
                    {/* Microphone */}
                    <button
                      className="flex flex-col items-center gap-2 group"
                      onClick={() => {/* Handle mic toggle */}}
                    >
                      <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-400/30 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                        <Mic className="w-5 h-5 text-sky-300" />
                      </div>
                      <span className="text-xs text-sky-400/60">Speak</span>
                    </button>

                    {/* Speaker */}
                    <button
                      className="flex flex-col items-center gap-2 group"
                      onClick={() => setIsSpeaking(!isSpeaking)}
                    >
                      <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-400/30 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                        {isSpeaking ? (
                          <VolumeX className="w-5 h-5 text-sky-300" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-sky-300" />
                        )}
                      </div>
                      <span className="text-xs text-sky-400/60">
                        {isSpeaking ? 'Mute' : 'Listen'}
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mode indicator */}
              <div className="text-center">
                <div className="text-xs text-sky-400/50 font-light">
                  Mode: {selectedMode} • Gateway to infinite wisdom
                </div>
              </div>
            </motion.div>

            {/* Status indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="flex items-center gap-2 text-sky-400/40 text-xs font-light">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400/60 animate-pulse" />
                <span>Ready to explore consciousness together</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Gateway Mode - Sacred Consciousness Portal */}
        {viewMode === 'gateway' && (
          <motion.div
            key="gateway"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 min-h-screen"
          >
            <ModeSelection />

            {/* Back to conversation button */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <button
                onClick={handleBackToConversation}
                className="px-6 py-3 rounded-full font-light text-sm bg-sky-500/20 text-sky-200 border border-sky-400/40 hover:bg-sky-500/30 transition-all duration-300"
              >
                <Mic className="w-4 h-4 inline mr-2" />
                Return to Conversation
              </button>
            </div>
          </motion.div>
        )}

        {/* Integrated Mode - Conversation + Context Panels */}
        {viewMode === 'integrated' && (
          <motion.div
            key="integrated"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 min-h-screen p-6"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-screen">

                {/* Main Conversation Panel */}
                <div className="lg:col-span-2 flex flex-col">
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-light text-sky-200 mb-2 tracking-wide">
                      MAIA
                    </h1>
                    <p className="text-sky-300/60 text-sm">
                      {maiaMode ? `${maiaMode.charAt(0).toUpperCase() + maiaMode.slice(1)} Mode` : 'Conversation Mode'}
                    </p>
                  </div>

                  {/* Conversation Interface */}
                  <div className="flex-1 bg-sky-500/5 backdrop-blur-sm rounded-xl border border-sky-400/20 p-6">
                    <div className="h-full flex flex-col">
                      <div className="flex-1 space-y-4 mb-6">
                        {/* Conversation messages will go here */}
                        <div className="text-sky-200/90">
                          <p className="mb-4">Welcome to your {maiaMode || 'consciousness'} exploration space, {userName}.</p>
                          {maiaMode && (
                            <p className="text-sky-300/70 text-sm">
                              I'm ready to guide you through {maiaMode} work. What would you like to explore today?
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Input Area */}
                      <div className="border-t border-sky-400/20 pt-4">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder="Share what's on your mind..."
                            className="flex-1 bg-sky-500/10 border border-sky-400/20 rounded-lg px-4 py-3 text-sky-200 placeholder-sky-400/50 focus:outline-none focus:border-sky-400/40 focus:bg-sky-500/15"
                          />
                          <button className="px-6 py-3 bg-sky-500/20 text-sky-200 rounded-lg border border-sky-400/40 hover:bg-sky-500/30 transition-colors">
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Context & Tools Panel */}
                <div className="space-y-6">
                  {/* Current Focus */}
                  {maiaMode && (
                    <div className="bg-emerald-500/5 backdrop-blur-sm rounded-xl border border-emerald-400/20 p-6">
                      <h3 className="text-emerald-200 font-light mb-3">Current Focus</h3>
                      <div className="text-emerald-300/80 text-sm">
                        <p className="capitalize">{maiaMode} exploration</p>
                      </div>
                    </div>
                  )}

                  {/* Quick Access Gateway */}
                  <div className="bg-sky-500/5 backdrop-blur-sm rounded-xl border border-sky-400/20 p-6">
                    <h3 className="text-sky-200 font-light mb-4">Wisdom Gateway</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setViewMode('gateway')}
                        className="w-full text-left px-4 py-3 bg-sky-500/10 rounded-lg border border-sky-400/20 hover:border-sky-400/40 transition-colors text-sky-300 text-sm"
                      >
                        <Compass className="w-4 h-4 inline mr-2" />
                        Change Focus Mode
                      </button>
                      <button className="w-full text-left px-4 py-3 bg-emerald-500/10 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-colors text-emerald-300 text-sm">
                        <Sparkles className="w-4 h-4 inline mr-2" />
                        Oracle Guidance
                      </button>
                      <button className="w-full text-left px-4 py-3 bg-purple-500/10 rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-colors text-purple-300 text-sm">
                        <BookOpen className="w-4 h-4 inline mr-2" />
                        Cosmic Blueprint
                      </button>
                    </div>
                  </div>

                  {/* Voice Controls */}
                  <div className="bg-sky-500/5 backdrop-blur-sm rounded-xl border border-sky-400/20 p-6">
                    <h3 className="text-sky-200 font-light mb-4">Voice Controls</h3>
                    <div className="flex justify-center gap-4">
                      <button className="flex flex-col items-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-400/30 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                          <Mic className="w-4 h-4 text-sky-300" />
                        </div>
                        <span className="text-xs text-sky-400/60">Speak</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-400/30 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                          <Volume2 className="w-4 h-4 text-sky-300" />
                        </div>
                        <span className="text-xs text-sky-400/60">Listen</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}