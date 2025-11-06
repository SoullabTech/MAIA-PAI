/**
 * Resume Session Prompt
 *
 * Modal that appears when user returns to a page with an active session.
 * Offers to resume where they left off or start fresh.
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, RotateCcw, XCircle } from 'lucide-react';

interface ResumeSessionPromptProps {
  isOpen: boolean;
  remainingTime: string; // e.g., "23 minutes" or "1h 15m"
  phase: string; // e.g., "Exploration", "Integration"
  onResume: () => void;
  onStartNew: () => void;
  onDismiss: () => void;
}

export const ResumeSessionPrompt: React.FC<ResumeSessionPromptProps> = ({
  isOpen,
  remainingTime,
  phase,
  onResume,
  onStartNew,
  onDismiss
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]"
            onClick={onDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div
              className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl shadow-2xl
                         border border-[#D4B896]/20 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-[#D4B896]/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#D4B896]/10 flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-[#D4B896]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-light text-white tracking-wide">
                      Welcome Back
                    </h2>
                    <p className="text-xs text-white/50 mt-0.5">
                      You have an active session
                    </p>
                  </div>
                </div>
                <button
                  onClick={onDismiss}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all"
                >
                  <XCircle className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Session Info */}
                <div className="bg-[#D4B896]/5 border border-[#D4B896]/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-[#D4B896]" />
                    <div>
                      <div className="text-sm text-white/90 font-medium">
                        {remainingTime} remaining
                      </div>
                      <div className="text-xs text-white/50">
                        Currently in {phase} phase
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Your session is still active. You can pick up right where you left off,
                    or start a fresh session if you prefer.
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {/* Resume Button */}
                  <motion.button
                    onClick={onResume}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#D4B896] to-[#C4A886]
                             text-[#1a1a2e] font-medium shadow-lg hover:shadow-xl
                             transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Resume Session
                  </motion.button>

                  {/* Start New Button */}
                  <motion.button
                    onClick={onStartNew}
                    className="w-full py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10
                             text-white/90 font-medium border border-white/10
                             transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start New Session
                  </motion.button>
                </div>

                {/* Dismiss Link */}
                <button
                  onClick={onDismiss}
                  className="w-full text-center text-xs text-white/40 hover:text-white/60 transition-colors py-2"
                >
                  Continue without session timer
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
