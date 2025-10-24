'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, User, Calendar, ArrowRight } from 'lucide-react';
import { Holoflower } from '@/components/ui/Holoflower';

/**
 * Beta Onboarding Flow - "Share Your Story" Entry Point
 *
 * Kelly's vision: Not forms and checkboxes, but INVITATION
 * "Tell MAIA your story" - the I-Thou relationship begins here
 */

interface OnboardingData {
  name: string;
  birthDate?: string;
  intention?: string;
}

interface BetaOnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export function BetaOnboarding({ onComplete }: BetaOnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [intention, setIntention] = useState('');

  // Load preserved profile data if available (from previous logout)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const betaUser = localStorage.getItem('beta_user');
    if (betaUser) {
      try {
        const userData = JSON.parse(betaUser);
        if (userData.username) {
          setName(userData.username);
          console.log('✅ Pre-filled name from preserved data:', userData.username);
        }
        if (userData.birthDate) {
          setBirthDate(userData.birthDate);
          console.log('✅ Pre-filled birthday from preserved data');
        }
        if (userData.intention) {
          setIntention(userData.intention);
          console.log('✅ Pre-filled intention from preserved data');
        }
      } catch (e) {
        console.error('Error loading preserved data:', e);
      }
    }
  }, []);

  const handleNext = () => {
    if (step === 0 && !name.trim()) return;
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      onComplete({
        name: name.trim(),
        birthDate: birthDate || undefined,
        intention: intention.trim() || undefined
      });
    }
  };

  const handleSkip = () => {
    setStep(step + 1);
  };

  const canContinue = () => {
    if (step === 0) return name.trim().length > 0;
    return true; // Other steps are optional
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C231F] via-[#1A1513] to-[#0A0907] flex items-center justify-center p-4">
      {/* Temple atmosphere - Bronze ceremonial mist */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E3B778] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C89968] rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full relative z-10"
      >
        <div className="bg-gradient-to-br from-[#3D3026]/95 via-[#2C231F]/98 to-[#3A2F28]/95 border border-[#B8865B]/30 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl shadow-black/60">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Welcome - Bene Gesserit Ceremonial */}
                <div className="text-center mb-8 relative">
                  {/* Sacred radial pattern background */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div
                      style={{
                        background: 'radial-gradient(circle at center, rgba(227, 183, 120, 0.4) 0%, transparent 70%)',
                      }}
                    />
                  </div>

                  <motion.div
                    animate={{
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="inline-block mb-6"
                  >
                    <Holoflower size="lg" glowIntensity="high" />
                  </motion.div>

                  <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#FDF5E6' }}>
                    Welcome to MAIA
                  </h1>
                  <p className="text-xl leading-relaxed" style={{ color: '#E8DCC8' }}>
                    I'm here to help you discover the wisdom within your story.
                  </p>
                </div>

                {/* Name Input - Ceremonial glass */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2" style={{ color: '#E8DCC8' }}>
                    <User className="w-5 h-5" style={{ color: '#E3B778' }} />
                    <span className="font-medium">What shall I call you?</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && canContinue() && handleNext()}
                    placeholder="Your name..."
                    autoFocus
                    style={{
                      background: 'linear-gradient(135deg, rgba(26, 21, 19, 0.6), rgba(44, 35, 31, 0.4))',
                      borderColor: 'rgba(184, 134, 91, 0.3)',
                      color: '#FDF5E6',
                    }}
                    className="w-full border rounded-xl px-6 py-4 placeholder-[#9B8B7E] focus:outline-none focus:border-[#E3B778]/50 focus:ring-2 focus:ring-[#E3B778]/20 transition-all text-lg"
                  />
                </div>

                <div className="pt-6">
                  <button
                    onClick={handleNext}
                    disabled={!canContinue()}
                    style={canContinue() ? {
                      background: 'linear-gradient(135deg, #E3B778 0%, #D4A574 50%, #C89968 100%)',
                      color: '#2C1810',
                      boxShadow: '0 8px 24px rgba(227, 183, 120, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    } : {
                      background: 'rgba(44, 35, 31, 0.5)',
                      color: '#6B5D52',
                    }}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                      !canContinue() && 'cursor-not-allowed'
                    }`}
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <Heart className="w-12 h-12 mx-auto mb-4" style={{ color: '#E3B778' }} />
                  <h2 className="text-3xl font-bold mb-3" style={{ color: '#FDF5E6' }}>
                    Beautiful, {name}
                  </h2>
                  <p className="text-lg" style={{ color: '#E8DCC8' }}>
                    Your birth date helps me understand your astrological patterns.
                    <br />
                    <span className="text-sm" style={{ color: '#9B8B7E' }}>(Optional - you can skip this)</span>
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2" style={{ color: '#E8DCC8' }}>
                    <Calendar className="w-5 h-5" style={{ color: '#6B9B9E' }} />
                    <span className="font-medium">When were you born?</span>
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    style={{
                      background: 'linear-gradient(135deg, rgba(26, 21, 19, 0.6), rgba(44, 35, 31, 0.4))',
                      borderColor: 'rgba(107, 155, 158, 0.3)',
                      color: '#FDF5E6',
                    }}
                    className="w-full border rounded-xl px-6 py-4 focus:outline-none focus:border-[#6B9B9E]/50 focus:ring-2 focus:ring-[#6B9B9E]/20 transition-all text-lg"
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    onClick={handleSkip}
                    style={{
                      background: 'rgba(26, 21, 19, 0.6)',
                      borderColor: 'rgba(184, 134, 91, 0.2)',
                      color: '#B8A99A',
                    }}
                    className="flex-1 py-4 px-6 rounded-xl font-semibold text-lg border hover:bg-[#2C231F]/80 transition-all"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleNext}
                    style={{
                      background: 'linear-gradient(135deg, #6B9B9E 0%, #7BA5A8 100%)',
                      color: '#FDF5E6',
                      boxShadow: '0 8px 24px rgba(107, 155, 158, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    }}
                    className="flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="mb-4 flex justify-center"
                  >
                    <Holoflower size="lg" glowIntensity="high" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-3" style={{ color: '#FDF5E6' }}>
                    One more thing, {name}...
                  </h2>
                  <p className="text-lg" style={{ color: '#E8DCC8' }}>
                    What brings you here today?
                    <br />
                    <span className="text-sm" style={{ color: '#9B8B7E' }}>(Optional - or just start talking)</span>
                  </p>
                </div>

                <div className="space-y-3">
                  <label style={{ color: '#E8DCC8' }} className="font-medium block">
                    Your intention (if you'd like to share)
                  </label>
                  <textarea
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    placeholder="I'm here to explore... / I want to understand... / I'm seeking..."
                    rows={4}
                    style={{
                      background: 'linear-gradient(135deg, rgba(26, 21, 19, 0.6), rgba(44, 35, 31, 0.4))',
                      borderColor: 'rgba(184, 134, 91, 0.3)',
                      color: '#FDF5E6',
                    }}
                    className="w-full border rounded-xl px-6 py-4 placeholder-[#9B8B7E] focus:outline-none focus:border-[#E3B778]/50 focus:ring-2 focus:ring-[#E3B778]/20 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    onClick={handleSkip}
                    style={{
                      background: 'rgba(26, 21, 19, 0.6)',
                      borderColor: 'rgba(184, 134, 91, 0.2)',
                      color: '#B8A99A',
                    }}
                    className="flex-1 py-4 px-6 rounded-xl font-semibold text-lg border hover:bg-[#2C231F]/80 transition-all"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleNext}
                    style={{
                      background: 'linear-gradient(135deg, #E3B778 0%, #D4A574 50%, #C89968 100%)',
                      color: '#2C1810',
                      boxShadow: '0 8px 24px rgba(227, 183, 120, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    }}
                    className="flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
                  >
                    Begin Journey
                    <Sparkles className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Dots - Ceremonial bronze */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  backgroundColor: i === step ? '#E3B778' : i < step ? 'rgba(227, 183, 120, 0.4)' : 'rgba(184, 134, 91, 0.2)',
                }}
                className={`h-2 rounded-full transition-all ${i === step ? 'w-8' : 'w-2'}`}
              />
            ))}
          </div>
        </div>

        {/* Kelly's Welcome Message - Temple wisdom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm" style={{ color: '#9B8B7E' }}>
            "This is a space to discover the gold within your story."
            <br />
            <span style={{ color: '#6B5D52' }}>— Kelly Nezat, Founder</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
