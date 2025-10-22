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
            "flex items-center gap-3 px-4 py-3 rounded-2xl",
            "backdrop-blur-xl",
            "border shadow-2xl",
            "transition-all duration-500",
            // Ceremonial states with Bene Gesserit colors
            isListening && "voice-listening-ceremonial animate-consciousness-ripple",
            isSpeaking && "voice-speaking-ceremonial animate-wisdom-shimmer",
            !isListening && !isSpeaking && "voice-present-ceremonial"
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
            className={cn(
              isListening && "holoflower-consciousness",
              isSpeaking && "holoflower-ceremonial",
              !isListening && !isSpeaking && "holoflower-heart"
            )}
          >
            <Holoflower
              size={40}
              element={currentElement}
              glowIntensity={isListening || isSpeaking ? 'high' : 'medium'}
            />
          </motion.div>

          {/* Status text - Bene Gesserit typography */}
          <div className="text-sm">
            <div className="font-medium text-benegesserit-ivory-bright">MAIA</div>
            <div className="text-xs text-benegesserit-bronze-bright/80">
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
                "p-2 rounded-full transition-all duration-300",
                "hover:bg-benegesserit-bronze/20 active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isListening && "bg-benegesserit-amethyst-muted/30 animate-consciousness-ripple"
              )}
              title={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening ? (
                <Mic className="w-4 h-4 text-benegesserit-lavender-stone" />
              ) : (
                <MicOff className="w-4 h-4 text-benegesserit-bronze-bright/70" />
              )}
            </button>

            {/* Expand/collapse */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-full hover:bg-benegesserit-bronze/20 transition-all duration-300 active:scale-95"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4 text-benegesserit-bronze-bright/70" />
              ) : (
                <Maximize2 className="w-4 h-4 text-benegesserit-bronze-bright/70" />
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
              <div className="glass-ceremonial rounded-2xl border-bronze p-4 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-benegesserit-ivory-bright font-serif tracking-wide">
                    Voice Control
                  </h3>
                  <button
                    onClick={disconnect}
                    className="text-xs text-dune-harkonnen-crimson/70 hover:text-dune-harkonnen-crimson transition-colors duration-300"
                  >
                    Disconnect
                  </button>
                </div>

                {/* Connection status */}
                <div className="flex items-center gap-2 mb-3 p-2 bg-benegesserit-stone-raised/30 rounded-lg border border-benegesserit-border-subtle">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isConnected ? "bg-benegesserit-saffron animate-pulse" : "bg-benegesserit-burgundy"
                    )}
                  />
                  <span className="text-xs text-benegesserit-bronze-bright/80">
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>

                {/* Mode toggles */}
                <div className="space-y-2">
                  {/* Voice-only mode */}
                  <button
                    onClick={toggleVoiceOnly}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-benegesserit-stone-raised/20 hover:bg-benegesserit-stone-raised/30 border border-benegesserit-border transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-benegesserit-lavender-stone" />
                      <span className="text-sm text-benegesserit-ivory">Voice-Only Mode</span>
                    </div>
                    <div className="text-xs text-benegesserit-bronze/60">
                      Minimal UI
                    </div>
                  </button>

                  {/* Quick action: Open settings */}
                  <button
                    onClick={() => {
                      // TODO: Trigger settings panel
                      console.log('Open MAIA settings');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-benegesserit-stone-raised/20 hover:bg-benegesserit-stone-raised/30 border border-benegesserit-border transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-benegesserit-amber" />
                      <span className="text-sm text-benegesserit-ivory">Voice Settings</span>
                    </div>
                  </button>
                </div>

                {/* Current element indicator */}
                <div className="mt-4 pt-4 border-t border-benegesserit-border">
                  <div className="text-xs text-benegesserit-bronze-bright/60 mb-2 tracking-wide">Current Element</div>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full animate-ceremonial-pulse",
                        currentElement === 'fire' && "bg-benegesserit-copper",
                        currentElement === 'water' && "bg-dune-caladan-teal",
                        currentElement === 'earth' && "bg-benegesserit-terracotta",
                        currentElement === 'air' && "bg-benegesserit-ivory-deep",
                        currentElement === 'aether' && "bg-benegesserit-amethyst-muted"
                      )}
                    />
                    <span className="text-sm text-benegesserit-bronze-bright capitalize">
                      {currentElement}
                    </span>
                  </div>
                </div>

                {/* Usage hint */}
                <div className="mt-4 p-3 bg-benegesserit-amber/10 rounded-lg border border-benegesserit-amber/20">
                  <p className="text-xs text-benegesserit-saffron/80 leading-relaxed">
                    ✨ <strong className="text-benegesserit-amber">Wisdom:</strong> Say "Hey MAIA" to start a conversation, or click the mic button.
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
                  className="w-1 rounded-full bg-gradient-to-t from-benegesserit-amber to-benegesserit-saffron"
                  style={{
                    boxShadow: '0 0 8px rgba(200, 148, 70, 0.4)'
                  }}
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
