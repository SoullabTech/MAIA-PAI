/**
 * Session Ritual Opening
 *
 * Sacred three-phase opening sequence that creates liminal threshold
 * into therapeutic space. Guides member through arrival, intention-setting,
 * and threshold crossing.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { OPENING_RITUAL, QUICK_OPENING, formatRitualPrompt, type RitualPrompt } from '@/lib/session/SessionRituals';

interface SessionRitualOpeningProps {
  isOpen: boolean;
  sessionDuration: number; // in minutes
  isReturningUser?: boolean; // Show quick version for returning users
  onComplete: () => void;
  onSkip?: () => void; // Optional skip for experienced users
}

export const SessionRitualOpening: React.FC<SessionRitualOpeningProps> = ({
  isOpen,
  sessionDuration,
  isReturningUser = false,
  onComplete,
  onSkip
}) => {
  const ritualSequence = isReturningUser ? [QUICK_OPENING] : OPENING_RITUAL;

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentPrompt = ritualSequence[currentPhaseIndex];
  const isLastPhase = currentPhaseIndex === ritualSequence.length - 1;

  // Auto-advance after duration (optional - user can also manually advance)
  useEffect(() => {
    if (!isOpen || !currentPrompt) return;

    const timer = setTimeout(() => {
      handleNext();
    }, currentPrompt.duration * 1000);

    return () => clearTimeout(timer);
  }, [isOpen, currentPhaseIndex]);

  const handleNext = () => {
    if (isLastPhase) {
      setIsTransitioning(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    } else {
      setCurrentPhaseIndex(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onSkip?.();
    }, 300);
  };

  if (!currentPrompt) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />

          {/* Ritual Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="max-w-2xl w-full"
            >
              {/* Phase Indicator */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {ritualSequence.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      index === currentPhaseIndex
                        ? 'w-12 bg-[#D4B896]'
                        : index < currentPhaseIndex
                        ? 'w-8 bg-[#D4B896]/50'
                        : 'w-6 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Main Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhaseIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-[#1a1a2e]/90 to-[#16213e]/90
                           rounded-3xl p-8 border border-[#D4B896]/20 backdrop-blur-xl"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#D4B896]/10 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-[#D4B896]" />
                    </div>
                  </div>

                  {/* Phase Title */}
                  <h2 className="text-2xl font-light text-white text-center mb-2 tracking-wide">
                    {currentPrompt.title}
                  </h2>

                  {/* Guidance */}
                  <p className="text-sm text-white/50 text-center mb-8">
                    {currentPrompt.guidance}
                  </p>

                  {/* MAIA's Words */}
                  <div className="bg-[#D4B896]/5 rounded-2xl p-6 border border-[#D4B896]/10 mb-8">
                    <p className="text-white/90 leading-relaxed whitespace-pre-line text-center">
                      {formatRitualPrompt(currentPrompt, sessionDuration)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    {/* Continue Button */}
                    <motion.button
                      onClick={handleNext}
                      className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#D4B896] to-[#C4A886]
                               text-[#1a1a2e] font-medium shadow-lg hover:shadow-xl
                               transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLastPhase ? 'Begin Session' : 'Continue'}
                    </motion.button>

                    {/* Skip Option (first phase only) */}
                    {currentPhaseIndex === 0 && onSkip && (
                      <button
                        onClick={handleSkip}
                        className="w-full text-center text-xs text-white/40 hover:text-white/60
                                 transition-colors py-2"
                      >
                        Skip ritual and begin
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Text */}
              <p className="text-center text-xs text-white/30 mt-6">
                {isLastPhase
                  ? 'Opening gong will sound when you begin'
                  : `Phase ${currentPhaseIndex + 1} of ${ritualSequence.length}`
                }
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
