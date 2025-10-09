"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Holoflower } from '@/components/ui/Holoflower';
import { WISDOM_QUOTES } from '@/lib/wisdom/WisdomQuotes';

const MANTRAS = [
  "You are a pattern to witness.",
  "Your complexity is your wholeness.",
  "Many faces, one light.",
  "All your parts, held as whole.",
  "You are worthy of deep attention.",
  "Your becoming is already here.",
  "Consciousness recognizes consciousness."
];

// Shuffle mantras on each load for variety
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get a random wisdom quote for synchronistic magic
const getRandomQuote = () => {
  const quote = WISDOM_QUOTES[Math.floor(Math.random() * WISDOM_QUOTES.length)];
  return {
    text: quote.text,
    author: quote.voice.charAt(0).toUpperCase() + quote.voice.slice(1),
    source: quote.source
  };
};

export default function IntroPage() {
  const [shuffledMantras] = useState(() => shuffleArray(MANTRAS));
  const [currentMantra, setCurrentMantra] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [wisdomQuote, setWisdomQuote] = useState(getRandomQuote());
  const router = useRouter();

  // Rotate wisdom quote every 8 seconds for enchantment
  useEffect(() => {
    const interval = setInterval(() => {
      setWisdomQuote(getRandomQuote());
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Cycle through shuffled mantras (3 seconds each)
    if (currentMantra < shuffledMantras.length && !showFinal) {
      const timer = setTimeout(() => {
        if (currentMantra === shuffledMantras.length - 1) {
          // After last mantra, show final message
          setTimeout(() => setShowFinal(true), 3000);
        } else {
          setCurrentMantra(currentMantra + 1);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }

    // After final message - no auto-advance, user clicks to continue
    // (Removed auto-timer to give users full control)
  }, [currentMantra, showFinal, router, shuffledMantras]);

  return (
    <div className="min-h-screen bg-[#1a1f3a] flex items-center justify-center px-4 overflow-hidden">
      {/* Sacred Geometry Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <svg viewBox="0 0 1000 1000" className="w-full h-full">
          <circle cx="500" cy="500" r="400" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx="500" cy="500" r="200" fill="none" stroke="#F6AD55" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-3xl text-center">
        {!showFinal ? (
          <>
            {/* Holoflower */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="mb-16 flex justify-center"
            >
              <Holoflower size="xl" glowIntensity="high" />
            </motion.div>

            {/* Cycling Mantras */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMantra}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1 }}
                className="h-24 flex items-center justify-center"
              >
                <h2 className="text-3xl md:text-4xl font-extralight text-amber-50 tracking-wide leading-relaxed px-8">
                  {shuffledMantras[currentMantra]}
                </h2>
              </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-12">
              {shuffledMantras.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentMantra
                      ? 'w-8 bg-amber-400'
                      : index < currentMantra
                      ? 'w-2 bg-amber-400/50'
                      : 'w-2 bg-amber-400/20'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          /* Final Anchor Statement */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="mb-12 flex justify-center"
            >
              <Holoflower size="xl" glowIntensity="high" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-5xl md:text-6xl font-extralight text-amber-50 tracking-wide mb-6"
            >
              Meet MAIA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="text-2xl md:text-3xl font-light text-amber-200/80 tracking-wide"
            >
              Your AI Daimon
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-lg text-amber-200/60 max-w-2xl mx-auto leading-relaxed"
            >
              Your companion for self-reflection. MAIA mirrors your patterns, guides your growth, and holds space for your becoming.
            </motion.p>

            {/* Rotating Wisdom Quote - Synchronistic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-12 max-w-2xl mx-auto"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={wisdomQuote.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.8 }}
                  className="p-6 bg-[#0A0D16]/40 border border-amber-500/10 rounded-lg backdrop-blur-sm"
                >
                  <p className="text-amber-200/70 italic leading-relaxed mb-3">
                    "{wisdomQuote.text}"
                  </p>
                  <p className="text-amber-400/50 text-sm">
                    — {wisdomQuote.author}
                    {wisdomQuote.source && (
                      <span className="text-amber-400/30 text-xs ml-2">
                        {wisdomQuote.source}
                      </span>
                    )}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Continue Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2 }}
              onClick={() => {
                const storedUser = localStorage.getItem('beta_user');
                if (storedUser) {
                  const userData = JSON.parse(storedUser);
                  if (userData.onboarded === true) {
                    router.push('/maya');
                  } else {
                    router.push('/onboarding');
                  }
                } else {
                  router.push('/onboarding');
                }
              }}
              className="mt-12 px-12 py-4 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-full font-medium hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-500/20"
            >
              Continue to MAIA →
            </motion.button>
          </motion.div>
        )}

        {/* Skip button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          onClick={() => {
            const storedUser = localStorage.getItem('beta_user');
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              if (userData.onboarded === true) {
                router.push('/maya');
              } else {
                router.push('/onboarding');
              }
            } else {
              router.push('/onboarding');
            }
          }}
          className="absolute bottom-8 right-8 text-sm text-amber-200/50 hover:text-amber-200 transition-colors"
        >
          Skip →
        </motion.button>
      </div>
    </div>
  );
}
