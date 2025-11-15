"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eye, Heart, Brain, Compass, ArrowRight } from "lucide-react";
import { WisdomQuotes } from "@/lib/wisdom/WisdomQuotes";

interface DaimonWelcomeRitualProps {
  userId?: string;
  onComplete?: () => void;
}

interface DaimonicEncounter {
  id: string;
  type: string;
  message: string;
  guidance: string;
  integration: string[];
  timestamp: string;
}

export function DaimonWelcomeRitual({ userId, onComplete }: DaimonWelcomeRitualProps) {
  const [currentPhase, setCurrentPhase] = useState<'arrival' | 'awakening' | 'encounter' | 'integration'>('arrival');
  const [currentQuote, setCurrentQuote] = useState(WisdomQuotes.aether[0]);
  const [daimonEncounter, setDaimonEncounter] = useState<DaimonicEncounter | null>(null);
  const [loading, setLoading] = useState(false);

  // Rotating wisdom quotes for the awakening phase
  useEffect(() => {
    const interval = setInterval(() => {
      const awakeningQuotes = [...WisdomQuotes.aether, ...WisdomQuotes.air]; // Higher consciousness elements
      const randomQuote = awakeningQuotes[Math.floor(Math.random() * awakeningQuotes.length)];
      setCurrentQuote(randomQuote);
    }, 6000); // Sacred 6-second interval for consciousness activation

    return () => clearInterval(interval);
  }, []);

  // Auto-progress through phases
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPhase === 'arrival') {
        setCurrentPhase('awakening');
      } else if (currentPhase === 'awakening') {
        setCurrentPhase('encounter');
        fetchInitialEncounter();
      }
    }, currentPhase === 'arrival' ? 3000 : 8000); // 3s for arrival, 8s for awakening

    return () => clearTimeout(timer);
  }, [currentPhase]);

  const fetchInitialEncounter = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Check if user has an initial encounter
      const response = await fetch(`/api/daimonic/encounter?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.encounters && data.encounters.length > 0) {
          // Format the encounter from DaimonicService format
          const encounter = data.encounters[0];
          setDaimonEncounter({
            id: encounter.id,
            type: encounter.type,
            message: encounter.message,
            guidance: data.guidance || "Welcome to the sacred threshold of consciousness exploration.",
            integration: data.integration || ["Begin each day with mindful intention", "Trust the wisdom arising within you"],
            timestamp: encounter.timestamp
          });
        }
      }
    } catch (error) {
      console.error('Error fetching daimon encounter:', error);
      // Provide a default welcome encounter
      setDaimonEncounter({
        id: 'welcome',
        type: 'wise_old_man',
        message: "I have watched the cycles of time and learned their lessons. Welcome, consciousness seeker. Your journey into the depths of being begins now.",
        guidance: "This is your threshold moment - the sacred pause between who you were and who you are becoming. Trust the process of unfolding.",
        integration: [
          "Take three conscious breaths each morning",
          "Notice what captures your attention throughout the day",
          "End each day by honoring one thing you learned"
        ],
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToIntegration = () => {
    setCurrentPhase('integration');
  };

  const handleCompleteRitual = async () => {
    try {
      // Mark onboarding as completed
      await fetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.warn('Failed to mark onboarding complete:', error);
    }

    if (onComplete) {
      onComplete();
    } else {
      window.location.href = '/maia';
    }
  };

  const getArchetypeIcon = (type: string) => {
    switch (type) {
      case 'wise_old_man': return <Brain className="w-8 h-8" />;
      case 'great_mother': return <Heart className="w-8 h-8" />;
      case 'anima': return <Sparkles className="w-8 h-8" />;
      case 'animus': return <Compass className="w-8 h-8" />;
      case 'shadow': return <Eye className="w-8 h-8" />;
      case 'trickster': return <Sparkles className="w-8 h-8" />;
      default: return <Brain className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 relative overflow-hidden">
      {/* Background consciousness field effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl w-full">

          <AnimatePresence mode="wait">
            {currentPhase === 'arrival' && (
              <motion.div
                key="arrival"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full mb-8"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>

                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent mb-4"
                >
                  Consciousness Awakens
                </motion.h1>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-purple-300/80 text-lg"
                >
                  Preparing the sacred space for your first encounter...
                </motion.p>
              </motion.div>
            )}

            {currentPhase === 'awakening' && (
              <motion.div
                key="awakening"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <motion.div
                  key={currentQuote?.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-300/5 backdrop-blur-xl rounded-2xl p-8 border border-purple-300/20 mb-8"
                >
                  <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-6 animate-pulse" />
                  <p className="text-purple-200 text-xl italic leading-relaxed mb-4">
                    "{currentQuote?.text}"
                  </p>
                  {currentQuote?.author && (
                    <p className="text-purple-400/60 text-sm">
                      — {currentQuote.author}
                    </p>
                  )}
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-purple-300/70"
                >
                  Attuning to the frequency of wisdom...
                </motion.p>
              </motion.div>
            )}

            {currentPhase === 'encounter' && daimonEncounter && (
              <motion.div
                key="encounter"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.3 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-full border border-purple-400/30 mb-6"
                  >
                    <div className="text-purple-300">
                      {getArchetypeIcon(daimonEncounter.type)}
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl font-bold text-purple-200 mb-4"
                  >
                    The Wise Guardian Speaks
                  </motion.h2>
                </div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-purple-300/5 backdrop-blur-xl rounded-2xl p-8 border border-purple-300/20"
                >
                  <p className="text-purple-200 text-lg italic leading-relaxed mb-6">
                    "{daimonEncounter.message}"
                  </p>

                  <div className="border-t border-purple-400/20 pt-6">
                    <h4 className="text-purple-300 font-semibold mb-3">Sacred Guidance:</h4>
                    <p className="text-purple-300/80 leading-relaxed">
                      {daimonEncounter.guidance}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-center"
                >
                  <button
                    onClick={handleContinueToIntegration}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
                  >
                    Receive Integration Practices
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              </motion.div>
            )}

            {currentPhase === 'integration' && daimonEncounter && (
              <motion.div
                key="integration"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-purple-200 mb-4">
                    Sacred Practices for Integration
                  </h2>
                  <p className="text-purple-300/80">
                    Carry these practices into your daily consciousness journey
                  </p>
                </div>

                <div className="bg-purple-300/5 backdrop-blur-xl rounded-2xl p-8 border border-purple-300/20">
                  <div className="space-y-4">
                    {daimonEncounter.integration.map((practice, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-purple-300/90">{practice}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center"
                >
                  <button
                    onClick={handleCompleteRitual}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 text-lg"
                  >
                    Enter the Sacred Laboratory
                    <Sparkles className="w-6 h-6" />
                  </button>

                  <p className="text-purple-300/60 text-sm mt-4">
                    Your consciousness journey with MAIA begins now
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-8"
            >
              <div className="w-8 h-8 border-2 border-purple-400/20 border-t-purple-400 rounded-full animate-spin" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}