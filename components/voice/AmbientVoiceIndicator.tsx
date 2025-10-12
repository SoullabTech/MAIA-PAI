/**
 * 🎙️ Ambient Voice Indicator
 *
 * Persistent mini-player that shows MAIA's voice presence
 * - Floats in corner of screen
 * - Survives page navigation
 * - Shows listening/speaking state
 * - Minimal, unobtrusive design
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Settings, Minimize2, Maximize2 } from 'lucide-react';
import { Holoflower } from '@/components/ui/Holoflower';
import { useMaiaPresence } from '@/lib/contexts/MaiaPresenceContext';
import { cn } from '@/lib/utils';

export function AmbientVoiceIndicator() {
  const {
    ambientMode,
    isConnected,
    isListening,
    isSpeaking,
    currentElement,
    startListening,
    stopListening,
    disconnect,
    toggleVoiceOnly
  } = useMaiaPresence();

  const [isExpanded, setIsExpanded] = useState(false);

  // Only show when ambient mode is active
  if (!ambientMode) return null;

  return (
    <>
      {/* Floating mini-player - bottom right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="fixed bottom-6 right-6 z-[80]"
      >
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-full",
            "bg-gradient-to-r backdrop-blur-xl",
            "border shadow-2xl",
            "transition-all duration-300",
            isListening && "ring-2 ring-cyan-400 animate-pulse",
            isSpeaking && "ring-2 ring-purple-400",
            // Color based on state
            isListening
              ? "from-cyan-500/30 to-blue-500/30 border-cyan-400/50"
              : isSpeaking
              ? "from-purple-500/30 to-pink-500/30 border-purple-400/50"
              : "from-amber-500/20 to-orange-500/20 border-amber-400/30"
          )}
        >
          {/* Holoflower indicator */}
          <motion.div
            animate={{
              scale: isListening || isSpeaking ? [1, 1.1, 1] : 1,
              rotate: isSpeaking ? [0, 10, -10, 0] : 0
            }}
            transition={{
              duration: 2,
              repeat: isListening || isSpeaking ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <Holoflower
              size={40}
              element={currentElement}
              glowIntensity={isListening || isSpeaking ? 'high' : 'medium'}
            />
          </motion.div>

          {/* Status text */}
          <div className="text-sm">
            <div className="font-medium text-white">MAIA</div>
            <div className="text-xs text-white/60">
              {!isConnected && 'Connecting...'}
              {isConnected && isListening && 'Listening...'}
              {isConnected && isSpeaking && 'Speaking...'}
              {isConnected && !isListening && !isSpeaking && 'Present'}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 ml-2">
            {/* Mic toggle */}
            <button
              onClick={() => {
                if (isListening) {
                  stopListening();
                } else {
                  startListening();
                }
              }}
              disabled={!isConnected}
              className={cn(
                "p-2 rounded-full transition-all",
                "hover:bg-white/10 active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isListening && "bg-cyan-500/30"
              )}
              title={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening ? (
                <Mic className="w-4 h-4 text-cyan-300" />
              ) : (
                <MicOff className="w-4 h-4 text-white/70" />
              )}
            </button>

            {/* Expand/collapse */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-full hover:bg-white/10 transition-all active:scale-95"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4 text-white/70" />
              ) : (
                <Maximize2 className="w-4 h-4 text-white/70" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded controls panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute bottom-full right-0 mb-3 w-72"
            >
              <div className="bg-[#1a1f2e]/95 backdrop-blur-xl rounded-lg border border-amber-400/20 p-4 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-white">
                    Voice Control
                  </h3>
                  <button
                    onClick={disconnect}
                    className="text-xs text-red-400/70 hover:text-red-400 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>

                {/* Connection status */}
                <div className="flex items-center gap-2 mb-3 p-2 bg-white/5 rounded-lg">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
                    )}
                  />
                  <span className="text-xs text-white/70">
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>

                {/* Mode toggles */}
                <div className="space-y-2">
                  {/* Voice-only mode */}
                  <button
                    onClick={toggleVoiceOnly}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white">Voice-Only Mode</span>
                    </div>
                    <div className="text-xs text-white/50">
                      Minimal UI
                    </div>
                  </button>

                  {/* Quick action: Open settings */}
                  <button
                    onClick={() => {
                      // TODO: Trigger settings panel
                      console.log('Open MAIA settings');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-white">Voice Settings</span>
                    </div>
                  </button>
                </div>

                {/* Current element indicator */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-xs text-white/50 mb-2">Current Element</div>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        currentElement === 'fire' && "bg-orange-400",
                        currentElement === 'water' && "bg-blue-400",
                        currentElement === 'earth' && "bg-green-400",
                        currentElement === 'air' && "bg-cyan-400",
                        currentElement === 'aether' && "bg-purple-400"
                      )}
                    />
                    <span className="text-sm text-white capitalize">
                      {currentElement}
                    </span>
                  </div>
                </div>

                {/* Usage hint */}
                <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <p className="text-xs text-amber-200/70 leading-relaxed">
                    💡 <strong>Tip:</strong> Say "Hey MAIA" to start a conversation, or click the mic button.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Audio waveform visualization when speaking */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-24 right-6 z-[79]"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-purple-400 rounded-full"
                  animate={{
                    height: [8, 20, 8],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
