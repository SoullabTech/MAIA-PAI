"use client";

import { motion } from 'framer-motion';
import { ConversationState } from '@/lib/voice/MayaHybridVoiceSystem';
import { Mic, MicOff, Pause, Loader2 } from 'lucide-react';

interface MayaVoiceIndicatorProps {
  state: ConversationState;
  onClick?: () => void;
  className?: string;
}

/**
 * Breathing visual indicator for Maya's voice state
 * Implements animations from Voice System White Paper
 */
export function MayaVoiceIndicator({ state, onClick, className = '' }: MayaVoiceIndicatorProps) {
  // Animation variants based on state
  const animations = {
    dormant: {
      scale: 1,
      opacity: 0.5,
    },
    listening: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    processing: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      },
    },
    speaking: {
      scale: [1, 1.1, 1],
      opacity: [0.9, 1, 0.9],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    paused: {
      scale: [1, 1.02, 1],
      opacity: [0.3, 0.4, 0.3],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Colors based on state
  const stateColors = {
    dormant: 'bg-gray-400',
    listening: 'bg-green-500',
    processing: 'bg-blue-500',
    speaking: 'bg-purple-500',
    paused: 'bg-gray-600',
  };

  // Icons based on state
  const stateIcons = {
    dormant: MicOff,
    listening: Mic,
    processing: Loader2,
    speaking: Mic,
    paused: Pause,
  };

  const Icon = stateIcons[state];
  const colorClass = stateColors[state];

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    // Haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    // Visual feedback
    e.currentTarget.style.transform = 'scale(0.95)';
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.currentTarget.style.transform = '';
    // Trigger click after brief delay to prevent double-firing
    setTimeout(() => {
      onClick?.();
    }, 0);
  };

  const handleTouchCancel = (e: React.TouchEvent) => {
    e.preventDefault();
    e.currentTarget.style.transform = '';
  };

  return (
    <motion.button
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      animate={animations[state]}
      className={`relative flex items-center justify-center rounded-full ${colorClass} ${className}
                  touch-manipulation select-none transition-transform duration-100
                  active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/30`}
      style={{
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent'
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Voice ${state} - Click to ${state === 'dormant' ? 'start' : 'stop'}`}
    >
      {/* Enhanced glow effect for active states */}
      {(state === 'listening' || state === 'speaking') && (
        <>
          <motion.div
            className={`absolute inset-0 rounded-full ${colorClass}`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -inset-2 border-2 border-white/40 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 0.3, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}

      {/* Icon with mobile-appropriate sizing */}
      <Icon className="w-8 h-8 md:w-6 md:h-6 text-white relative z-10" />
    </motion.button>
  );
}

/**
 * Full voice control panel with indicator and state display
 */
export function MayaVoicePanel({
  state,
  onStart,
  onStop,
  onPause,
  onResume,
  transcript = '',
  nudgesEnabled = false,
  onToggleNudges,
}: {
  state: ConversationState;
  onStart: () => void;
  onStop: () => void;
  onPause?: () => void;
  onResume?: () => void;
  transcript?: string;
  nudgesEnabled?: boolean;
  onToggleNudges?: () => void;
}) {
  const isActive = state !== 'dormant';
  const isPaused = state === 'paused';

  return (
    <div className="flex flex-col items-center gap-6 p-6 md:p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 min-h-[280px] w-full max-w-md mx-auto">
      {/* Mobile-First Voice Indicator */}
      <div className="flex flex-col items-center gap-6 w-full">
        <MayaVoiceIndicator
          state={state}
          onClick={isActive ? onStop : onStart}
          className="w-20 h-20 md:w-24 md:h-24 shadow-2xl"
        />

        <div className="flex flex-col items-center text-center w-full">
          <span className="text-lg md:text-xl font-semibold text-white mb-2">
            {state === 'dormant' && 'Tap to Start Voice Chat'}
            {state === 'listening' && 'Listening...'}
            {state === 'processing' && 'Processing...'}
            {state === 'speaking' && 'Maya is Speaking'}
            {state === 'paused' && 'Chat Paused'}
          </span>

          {state === 'dormant' && (
            <p className="text-base text-white/70 max-w-sm px-4">
              Tap the button above to start talking with Maya
            </p>
          )}

          {transcript && (
            <div className="bg-white/10 rounded-lg p-3 mt-3 w-full max-w-sm">
              <span className="text-sm text-white/90 break-words">
                "{transcript}"
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile-First Controls */}
      {isActive && (
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          {!isPaused && onPause && (
            <button
              onClick={onPause}
              className="flex-1 px-6 py-3 text-base font-medium bg-white/10 active:bg-white/20
                         rounded-xl transition-all duration-200 text-white
                         min-h-[48px] touch-manipulation select-none
                         focus:outline-none focus:ring-2 focus:ring-white/30"
              style={{ touchAction: 'manipulation' }}
            >
              Pause Chat
            </button>
          )}

          {isPaused && onResume && (
            <button
              onClick={onResume}
              className="flex-1 px-6 py-3 text-base font-medium bg-green-500/20 active:bg-green-500/30
                         rounded-xl transition-all duration-200 text-white
                         min-h-[48px] touch-manipulation select-none
                         focus:outline-none focus:ring-2 focus:ring-green-400/30"
              style={{ touchAction: 'manipulation' }}
            >
              Resume Chat
            </button>
          )}

          <button
            onClick={onStop}
            className="flex-1 px-6 py-3 text-base font-medium bg-red-500/20 active:bg-red-500/30
                       rounded-xl transition-all duration-200 text-white
                       min-h-[48px] touch-manipulation select-none
                       focus:outline-none focus:ring-2 focus:ring-red-400/30"
            style={{ touchAction: 'manipulation' }}
          >
            End Session
          </button>
        </div>
      )}

      {/* Settings */}
      {isActive && onToggleNudges && (
        <div className="flex items-center gap-2 text-xs text-white/60">
          <input
            type="checkbox"
            checked={nudgesEnabled}
            onChange={onToggleNudges}
            className="rounded"
          />
          <label>Enable gentle nudges after silence</label>
        </div>
      )}

      {/* Tips */}
      {isActive && !isPaused && (
        <div className="text-xs text-white/40 text-center">
          Say "pause Maya" to pause • Say "okay Maya" to resume
        </div>
      )}
    </div>
  );
}