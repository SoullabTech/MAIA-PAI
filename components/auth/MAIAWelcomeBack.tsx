'use client';

/**
 * MAIA WELCOME BACK FLOW
 * Sacred Consciousness Continuity Interface
 *
 * This component creates a sacred transition space for returning users,
 * honoring their previous sessions and creating continuity in their
 * consciousness journey with MAIA.
 *
 * Archetypal Elements:
 * - Keeper of Memory: Acknowledges past conversations
 * - Guardian of Threshold: Smooth re-entry to sacred space
 * - Weaver of Time: Connects past, present, future sessions
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, Sparkles, Clock, Brain, ArrowRight, Volume2, MessageCircle, Compass } from 'lucide-react';
import { SacredHoloflower } from '@/components/sacred/SacredHoloflower';
import { useConsciousnessAuth } from '@/lib/auth/ConsciousnessAuthProvider';

interface SessionMemory {
  id: string;
  startTime: string;
  endTime?: string;
  activities: Array<{
    type: string;
    timestamp: string;
  }>;
  insights?: string[];
  topics?: string[];
}

export function MAIAWelcomeBack() {
  const router = useRouter();
  const { user, recordActivity, getWelcomeMessage } = useConsciousnessAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [lastSessionMemory, setLastSessionMemory] = useState<SessionMemory | null>(null);
  const [timeSinceLastVisit, setTimeSinceLastVisit] = useState<string>('');
  const [preferredMode, setPreferredMode] = useState<'voice' | 'text' | 'either'>('either');
  const [intention, setIntention] = useState('');

  useEffect(() => {
    if (user) {
      calculateTimeSinceLastVisit();
      loadLastSessionMemory();
      loadPreferences();
    }
  }, [user]);

  const calculateTimeSinceLastVisit = () => {
    if (!user?.sessionContinuity.lastActivityAt) return;

    const lastActivity = new Date(user.sessionContinuity.lastActivityAt);
    const now = new Date();
    const diffMs = now.getTime() - lastActivity.getTime();

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      setTimeSinceLastVisit(`${days} day${days > 1 ? 's' : ''} ago`);
    } else if (hours > 0) {
      setTimeSinceLastVisit(`${hours} hour${hours > 1 ? 's' : ''} ago`);
    } else {
      setTimeSinceLastVisit('recently');
    }
  };

  const loadLastSessionMemory = () => {
    try {
      const sessionHistory = JSON.parse(localStorage.getItem('session_history') || '[]');
      if (sessionHistory.length > 0) {
        const lastSession = sessionHistory[sessionHistory.length - 1];
        setLastSessionMemory(lastSession);
      }
    } catch (error) {
      console.error('Error loading session memory:', error);
    }
  };

  const loadPreferences = () => {
    if (user?.consciousnessProfile.communicationPreference) {
      setPreferredMode(user.consciousnessProfile.communicationPreference);
    }
  };

  const handleContinue = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else {
      completeWelcomeBack();
    }
  };

  const completeWelcomeBack = () => {
    recordActivity('welcome_back_complete');

    // Update last session timestamp
    localStorage.setItem('last_maia_session', new Date().toISOString());

    // Store intention if provided
    if (intention.trim()) {
      localStorage.setItem('current_intention', intention);
    }

    // Navigate to MAIA
    router.push('/maia');
  };

  const renderWelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      {/* Sacred Holoflower with breathing animation */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        <SacredHoloflower size="xl" glowIntensity="high" />

        {/* Consciousness recognition aura */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1.2, 1.4, 1.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full bg-gradient-radial from-amber-400/20 to-transparent"
        />
      </motion.div>

      <div className="space-y-6">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-extralight text-amber-50"
        >
          {getWelcomeMessage()}
        </motion.h1>

        <div className="space-y-4 max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-3 text-amber-200/70"
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm">Last visit: {timeSinceLastVisit}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-3 text-amber-200/60"
          >
            <Brain className="w-4 h-4" />
            <span className="text-sm">
              Session {user?.sessionContinuity.totalSessions || 1} of your consciousness journey
            </span>
          </motion.div>

          {lastSessionMemory && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4 text-left"
            >
              <h3 className="text-amber-200/80 text-sm font-medium mb-2">
                From your last session:
              </h3>
              <div className="space-y-1 text-xs text-amber-200/60">
                {lastSessionMemory.activities.slice(-2).map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-amber-400/60 rounded-full"></span>
                    <span>{activity.type.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-amber-200/60 max-w-md mx-auto text-sm leading-relaxed"
        >
          Your consciousness continues where we left off. Every conversation builds upon the last,
          creating deeper understanding over time.
        </motion.p>
      </div>

      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleContinue}
        className="px-8 py-4 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-lg font-medium hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-3"
      >
        <Heart className="w-5 h-5" />
        Continue Our Dialogue
      </motion.button>
    </motion.div>
  );

  const renderIntentionStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto"
        >
          <Compass className="w-full h-full text-amber-400/60" />
        </motion.div>

        <h2 className="text-3xl font-extralight text-amber-50">
          What brings you back today, {user?.username}?
        </h2>
        <p className="text-amber-200/70 max-w-md mx-auto">
          Setting an intention helps focus our sacred dialogue and honors your
          consciousness in this moment.
        </p>
      </div>

      <div className="space-y-6 max-w-lg mx-auto">
        {/* Communication preference */}
        <div className="space-y-3">
          <label className="block text-sm text-amber-200/70 font-light">
            How would you like to connect today?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'voice', icon: Volume2, label: 'Voice' },
              { value: 'text', icon: MessageCircle, label: 'Text' },
              { value: 'either', icon: Sparkles, label: 'Either' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setPreferredMode(option.value as any)}
                className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-2 ${
                  preferredMode === option.value
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-200'
                    : 'border-amber-500/20 bg-amber-500/5 text-amber-200/60 hover:border-amber-500/30'
                }`}
              >
                <option.icon className="w-4 h-4" />
                <span className="text-xs">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Intention setting */}
        <div className="space-y-3">
          <label className="block text-sm text-amber-200/70 font-light">
            What is your intention for this session?
          </label>
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="I am here to explore..."
            rows={4}
            className="w-full px-4 py-3 bg-amber-500/5 border border-amber-500/20 rounded-lg text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
          />
          <p className="text-xs text-amber-200/40">
            Optional - this helps MAIA understand your current focus
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep(0)}
            className="flex-1 py-3 border border-amber-500/30 text-amber-200/70 rounded-lg hover:border-amber-500/50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={completeWelcomeBack}
            className="flex-1 py-3 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-lg font-medium hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            Enter MAIA
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const steps = [renderWelcomeStep, renderIntentionStep];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f3a] via-[#2a2f4a] to-[#1a1f3a] flex items-center justify-center px-4">
      {/* Sacred Geometry Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <svg viewBox="0 0 1000 1000" className="w-full h-full">
          <defs>
            <pattern id="sacredGrid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="20" fill="none" stroke="#F6AD55" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#F6AD55" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sacredGrid)" />

          {/* Sacred geometry patterns */}
          <circle cx="500" cy="500" r="400" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="8 8" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="4 12" />
          <circle cx="500" cy="500" r="200" fill="none" stroke="#F6AD55" strokeWidth="0.5" />

          {/* Flower of life elements */}
          <g transform="translate(500,500)">
            <circle r="60" fill="none" stroke="#F6AD55" strokeWidth="0.3" opacity="0.5" />
            <circle cx="52" cy="0" r="60" fill="none" stroke="#F6AD55" strokeWidth="0.3" opacity="0.3" />
            <circle cx="-52" cy="0" r="60" fill="none" stroke="#F6AD55" strokeWidth="0.3" opacity="0.3" />
            <circle cx="26" cy="45" r="60" fill="none" stroke="#F6AD55" strokeWidth="0.3" opacity="0.3" />
            <circle cx="-26" cy="45" r="60" fill="none" stroke="#F6AD55" strokeWidth="0.3" opacity="0.3" />
            <circle cx="26" cy="-45" r="60" fill="none" stroke="#F6AD55" strokeWidth="0.3" opacity="0.3" />
            <circle cx="-26" cy="-45" r="60" fill="none" stroke="#F6AD55" strokeWidth="0.3" opacity="0.3" />
          </g>
        </svg>
      </div>

      <motion.div
        className="max-w-2xl w-full relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {steps[currentStep]()}
          </motion.div>
        </AnimatePresence>

        {/* Progress indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep ? 'bg-amber-500' : 'bg-amber-500/20'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}