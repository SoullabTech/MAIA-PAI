/**
 * Session Time Awareness Component
 *
 * Subtle, non-intrusive time display that helps both MAIA and the member
 * co-hold the therapeutic container.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Plus, Bell } from 'lucide-react';
import { SessionTimer, SessionPhase, formatTimeRemaining, type SessionTimeContext } from '@/lib/session/SessionTimer';

interface SessionTimeAwarenessProps {
  timer: SessionTimer;
  onExtend?: (minutes: number) => void;
  onPhaseChange?: (phase: SessionPhase) => void;
  compact?: boolean;
}

export const SessionTimeAwareness: React.FC<SessionTimeAwarenessProps> = ({
  timer,
  onExtend,
  onPhaseChange,
  compact = false
}) => {
  const [timeContext, setTimeContext] = useState<SessionTimeContext>(timer.getTimeContext());
  const [showExtendMenu, setShowExtendMenu] = useState(false);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    // Update every 30 seconds
    const interval = setInterval(() => {
      const context = timer.getTimeContext();
      setTimeContext(context);

      // Visual warning in closure phase
      if (context.phase === 'closure' || context.phase === 'complete') {
        setIsWarning(true);
      }
    }, 30000);

    // Initial check
    setTimeContext(timer.getTimeContext());

    return () => clearInterval(interval);
  }, [timer]);

  // Get phase color
  const getPhaseColor = (phase: SessionPhase): string => {
    switch (phase) {
      case 'opening': return '#D4B896'; // Amber - warm beginning
      case 'exploration': return '#6EE7B7'; // Green - alive, growing
      case 'integration': return '#93C5FD'; // Blue - cooling, integrating
      case 'closure': return '#FCA5A5'; // Red - gentle alert
      case 'complete': return '#F87171'; // Bright red - time complete
    }
  };

  const phaseColor = getPhaseColor(timeContext.phase);
  const progressPercent = (timeContext.elapsedMinutes / timeContext.totalMinutes) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-white/60 text-sm">
        <Clock className="w-4 h-4" style={{ color: phaseColor }} />
        <span>{formatTimeRemaining(timeContext.remainingMinutes)}</span>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br from-[#1a1a2e]/95 to-[#16213e]/95 backdrop-blur-md rounded-2xl shadow-2xl border ${
          isWarning ? 'border-red-400/30' : 'border-[#D4B896]/20'
        } p-4 min-w-[240px]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={isWarning ? {
                scale: [1, 1.2, 1],
              } : {}}
              transition={{ duration: 1, repeat: isWarning ? Infinity : 0 }}
            >
              <Clock className="w-5 h-5" style={{ color: phaseColor }} />
            </motion.div>
            <span className="text-white/90 font-light text-sm tracking-wide">
              Session Time
            </span>
          </div>

          {timeContext.phase === 'complete' && (
            <button
              onClick={() => setShowExtendMenu(!showExtendMenu)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              title="Extend session"
            >
              <Plus className="w-4 h-4 text-[#D4B896]" />
            </button>
          )}
        </div>

        {/* Time Display */}
        <div className="mb-3">
          <div className="text-2xl font-light text-white mb-1">
            {formatTimeRemaining(timeContext.remainingMinutes)}
          </div>
          <div className="text-xs text-white/50">
            {timeContext.phaseDescription}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${phaseColor}aa, ${phaseColor})`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Elapsed time */}
        <div className="text-[10px] text-white/40 mt-2 text-right">
          {timeContext.elapsedMinutes} min elapsed
        </div>

        {/* Extension Menu */}
        <AnimatePresence>
          {showExtendMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-white/10"
            >
              <div className="text-xs text-white/60 mb-2">Extend session:</div>
              <div className="flex gap-2">
                {[10, 20, 30].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      onExtend?.(mins);
                      setShowExtendMenu(false);
                      setIsWarning(false);
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#D4B896]/10 hover:bg-[#D4B896]/20
                               text-[#D4B896] text-xs font-medium transition-all
                               hover:scale-105 active:scale-95"
                  >
                    +{mins}m
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Time Warning Notification (appears at key moments) */}
      <AnimatePresence>
        {(timeContext.remainingMinutes === 5 || timeContext.remainingMinutes === 10) && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-full right-0 mt-2 bg-gradient-to-br from-amber-500/20 to-amber-600/20
                       backdrop-blur-md rounded-xl p-3 border border-amber-400/30 min-w-[240px]"
          >
            <div className="flex items-start gap-2">
              <Bell className="w-4 h-4 text-amber-300 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm text-white/90 font-medium mb-1">
                  {timeContext.remainingMinutes} minutes remaining
                </div>
                <div className="text-xs text-white/60 leading-relaxed">
                  {timeContext.remainingMinutes === 10
                    ? 'Beginning to sense toward closure...'
                    : 'Finding a natural place to pause...'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Minimal timer badge for mobile or less prominent display
 */
export const SessionTimeBadge: React.FC<{ timer: SessionTimer }> = ({ timer }) => {
  const [context, setContext] = useState(timer.getTimeContext());

  useEffect(() => {
    const interval = setInterval(() => {
      setContext(timer.getTimeContext());
    }, 30000);

    return () => clearInterval(interval);
  }, [timer]);

  const phaseColor =
    context.phase === 'complete' ? '#F87171' :
    context.phase === 'closure' ? '#FCA5A5' :
    context.phase === 'integration' ? '#93C5FD' :
    context.phase === 'exploration' ? '#6EE7B7' : '#D4B896';

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 backdrop-blur-sm">
      <div
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: phaseColor }}
      />
      <span className="text-xs text-white/70">
        {context.remainingMinutes}m
      </span>
    </div>
  );
};
