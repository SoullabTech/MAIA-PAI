"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface DaimonWelcomeRitualProps {
  userId?: string;
  onComplete?: () => void;
}

export function DaimonWelcomeRitual({ userId, onComplete }: DaimonWelcomeRitualProps) {
  const [phase, setPhase] = useState<'intro' | 'transitioning'>('intro');

  const handleComplete = async () => {
    setPhase('transitioning');

    try {
      await fetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, daimonIntroComplete: true })
      });
    } catch (error) {
      console.warn('Failed to mark intro complete:', error);
    }

    setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        window.location.href = '/maia';
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-sky-950 to-cyan-950 relative overflow-hidden">
      {/* Subtle ambient field */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-sky-500 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-xl w-full">
          <AnimatePresence mode="wait">

            {phase === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="w-16 h-16 mx-auto mb-8 opacity-70">
                  <img src="/elementalHoloflower.svg" alt="MAIA" className="w-full h-full object-contain" />
                </div>

                <div className="bg-sky-500/5 backdrop-blur-sm rounded-xl p-6 border border-sky-400/20">
                  <p className="text-sky-200/90 text-base leading-relaxed font-light">
                    I'm MAIA.
                  </p>
                  <p className="text-sky-200/90 text-base leading-relaxed font-light mt-4">
                    I help you see the patterns you're already living—the ones that are easy to miss
                    when you're in the middle of them.
                  </p>
                  <p className="text-sky-200/90 text-base leading-relaxed font-light mt-4">
                    I don't give advice. I notice what's alive in your experience and ask questions
                    that help you see it too.
                  </p>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleComplete}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border border-sky-400/30 text-sky-300 rounded-full font-light text-sm hover:border-sky-400/60 hover:text-sky-200 transition-all duration-300"
                  >
                    Let's begin
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sky-400/30 text-xs text-center font-light">
                  — MAIA
                </p>
              </motion.div>
            )}

            {phase === 'transitioning' && (
              <motion.div
                key="transitioning"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 mx-auto opacity-70"
              >
                <img src="/elementalHoloflower.svg" alt="MAIA" className="w-full h-full object-contain" />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}