"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface DaimonWelcomeRitualProps {
  userId?: string;
  onComplete?: () => void;
}

interface ProfileData {
  ageRange: string;
  sex: string;
}

export function DaimonWelcomeRitual({ userId, onComplete }: DaimonWelcomeRitualProps) {
  const [phase, setPhase] = useState<'intro' | 'profile' | 'transitioning'>('intro');
  const [profileData, setProfileData] = useState<ProfileData>({
    ageRange: '',
    sex: ''
  });

  const handleComplete = async () => {
    setPhase('transitioning');

    try {
      await fetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileData })
      });
    } catch (error) {
      console.warn('Failed to store onboarding data:', error);
    }

    setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        window.location.href = '/maia';
      }
    }, 800);
  };

  const canProceed = profileData.ageRange && profileData.sex;

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
                    First, a few details to get started.
                  </p>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setPhase('profile')}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border border-sky-400/30 text-sky-300 rounded-full font-light text-sm hover:border-sky-400/60 hover:text-sky-200 transition-all duration-300"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sky-400/30 text-xs text-center font-light">
                  — MAIA
                </p>
              </motion.div>
            )}

            {phase === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="w-12 h-12 mx-auto mb-6 opacity-60">
                  <img src="/elementalHoloflower.svg" alt="MAIA" className="w-full h-full object-contain" />
                </div>

                <div className="space-y-4">
                  {/* Age Range */}
                  <div>
                    <label className="block text-xs text-sky-300/60 mb-2 font-light tracking-wide">
                      Age Range
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {['18-24', '25-34', '35-44', '45-54', '55-64', '65+'].map((range) => (
                        <button
                          key={range}
                          onClick={() => setProfileData(p => ({ ...p, ageRange: range }))}
                          className={`px-3 py-1.5 rounded-full text-xs font-light transition-all ${
                            profileData.ageRange === range
                              ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40'
                              : 'bg-sky-500/5 text-sky-300/60 border border-sky-400/10 hover:border-sky-400/30'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sex */}
                  <div>
                    <label className="block text-xs text-sky-300/60 mb-2 font-light tracking-wide">
                      Sex
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {['Female', 'Male', 'Non-binary', 'Prefer not to say'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setProfileData(p => ({ ...p, sex: option }))}
                          className={`px-3 py-1.5 rounded-full text-xs font-light transition-all ${
                            profileData.sex === option
                              ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40'
                              : 'bg-sky-500/5 text-sky-300/60 border border-sky-400/10 hover:border-sky-400/30'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={handleComplete}
                    disabled={!canProceed}
                    className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-light text-sm transition-all duration-300 ${
                      canProceed
                        ? 'bg-transparent border border-sky-400/30 text-sky-300 hover:border-sky-400/60 hover:text-sky-200'
                        : 'bg-sky-500/5 border border-sky-400/10 text-sky-400/30 cursor-not-allowed'
                    }`}
                  >
                    Let's begin
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
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