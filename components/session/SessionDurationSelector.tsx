/**
 * Session Duration Selector
 *
 * Allows members to choose session length before beginning.
 * Sets the therapeutic container for time-aware conversation.
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, X } from 'lucide-react';
import { SESSION_PRESETS } from '@/lib/session/SessionTimer';

interface SessionDurationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (durationMinutes: number) => void;
  defaultDuration?: number;
}

export const SessionDurationSelector: React.FC<SessionDurationSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  defaultDuration = 50
}) => {
  const [selectedDuration, setSelectedDuration] = useState(defaultDuration);
  const [customDuration, setCustomDuration] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const presets = [
    { ...SESSION_PRESETS.quick, icon: '⚡' },
    { ...SESSION_PRESETS.standard, icon: '🌟' },
    { ...SESSION_PRESETS.extended, icon: '🌊' },
    { ...SESSION_PRESETS.deep, icon: '🔮' },
  ];

  const handleStart = () => {
    const duration = showCustomInput
      ? parseInt(customDuration) || selectedDuration
      : selectedDuration;

    if (duration > 0 && duration <= 180) {
      onSelect(duration);
      onClose();
    }
  };

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
            onClick={onClose}
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
                         border border-[#D4B896]/20 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#D4B896]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4B896]/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#D4B896]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-light text-white tracking-wide">
                      Session Container
                    </h2>
                    <p className="text-xs text-white/50 mt-0.5">
                      Choose your time boundary
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Explanation */}
                <div className="bg-[#D4B896]/5 border border-[#D4B896]/10 rounded-xl p-4">
                  <p className="text-sm text-white/70 leading-relaxed">
                    Like traditional therapy, setting a time boundary creates safety and focus.
                    MAIA will be aware of the container and help guide the session naturally toward closure.
                  </p>
                </div>

                {/* Presets */}
                <div className="space-y-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider">
                    Session Presets
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {presets.map((preset) => (
                      <motion.button
                        key={preset.minutes}
                        onClick={() => {
                          setSelectedDuration(preset.minutes);
                          setShowCustomInput(false);
                        }}
                        className={`relative p-4 rounded-xl border transition-all
                          ${selectedDuration === preset.minutes && !showCustomInput
                            ? 'bg-[#D4B896]/20 border-[#D4B896]/40'
                            : 'bg-white/5 border-white/10 hover:border-[#D4B896]/20'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-2xl mb-2">{preset.icon}</div>
                        <div className="text-sm text-white/90 font-medium mb-1">
                          {preset.minutes} min
                        </div>
                        <div className="text-xs text-white/50">
                          {preset.label.split(' - ')[1]}
                        </div>

                        {selectedDuration === preset.minutes && !showCustomInput && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2"
                          >
                            <CheckCircle2 className="w-5 h-5 text-[#D4B896]" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Custom Duration */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    className="text-xs text-[#D4B896] hover:text-[#D4B896]/80 transition-colors"
                  >
                    {showCustomInput ? '← Back to presets' : '+ Custom duration'}
                  </button>

                  <AnimatePresence>
                    {showCustomInput && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <label className="text-xs text-white/70 mb-2 block">
                            Custom duration (minutes)
                          </label>
                          <input
                            type="number"
                            min="5"
                            max="180"
                            value={customDuration}
                            onChange={(e) => setCustomDuration(e.target.value)}
                            placeholder="e.g., 60"
                            className="w-full px-4 py-2 bg-white/10 border border-white/20
                                     rounded-lg text-white placeholder:text-white/40
                                     focus:outline-none focus:border-[#D4B896]/40"
                          />
                          <p className="text-xs text-white/40 mt-2">
                            Between 5-180 minutes
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Info about extensions */}
                <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                  <div className="text-lg">💡</div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    You can always extend the session if you need more time.
                    The boundary is supportive, not rigid.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[#D4B896]/10">
                <motion.button
                  onClick={handleStart}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#D4B896] to-[#C4A886]
                           text-[#1a1a2e] font-medium shadow-lg hover:shadow-xl
                           transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Begin Session
                  {showCustomInput && customDuration
                    ? ` (${customDuration} min)`
                    : ` (${selectedDuration} min)`}
                </motion.button>

                <p className="text-center text-xs text-white/40 mt-3">
                  MAIA will be aware of this time container
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * Quick start button with duration
 */
export const QuickStartSession: React.FC<{
  durationMinutes: number;
  onStart: () => void;
}> = ({ durationMinutes, onStart }) => {
  return (
    <motion.button
      onClick={onStart}
      className="flex items-center gap-3 px-6 py-3 rounded-xl
                 bg-gradient-to-r from-[#D4B896]/10 to-[#C4A886]/10
                 border border-[#D4B896]/20 hover:border-[#D4B896]/40
                 transition-all group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Clock className="w-5 h-5 text-[#D4B896] group-hover:scale-110 transition-transform" />
      <div className="text-left">
        <div className="text-sm text-white/90 font-medium">
          Start {durationMinutes}-minute session
        </div>
        <div className="text-xs text-white/50">
          MAIA will hold this time container with you
        </div>
      </div>
    </motion.button>
  );
};
