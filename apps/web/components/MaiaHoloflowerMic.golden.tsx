'use client';

/**
 * GOLDEN PRESERVED ORIGINAL - DO NOT MODIFY
 *
 * This is the original holoflower mic button extracted from OracleConversation.tsx
 * Lines 1797-1900 approximately
 *
 * Combines:
 * - SacredHoloflower component with voice-responsive animations
 * - Clickable holoflower image (/holoflower-amber.png)
 * - Voice microphone toggle functionality
 */

import React from 'react';
import { motion } from 'framer-motion';
import { SacredHoloflower } from './sacred/SacredHoloflower';

interface MaiaHoloflowerMicGoldenProps {
  // Voice state
  isListening: boolean;
  isProcessing: boolean;
  isResponding: boolean;
  isMuted: boolean;

  // Chat/UI state
  showChatInterface: boolean;
  voiceEnabled: boolean;
  conversationMode: string;
  messages: any[];

  // Motion state
  currentMotionState: string;
  coherenceLevel: number;
  coherenceShift: string;
  showBreakthrough: boolean;
  voiceAmplitude: number;
  maiaIsSpeaking: boolean;

  // Size
  holoflowerSize: number;

  // Voice control refs
  voiceMicRef: React.RefObject<any>;

  // Callbacks
  enableAudio: () => Promise<void>;
  setIsMuted: (muted: boolean) => void;
  setShowChatInterface: (show: boolean) => void;
}

export const MaiaHoloflowerMicGolden: React.FC<MaiaHoloflowerMicGoldenProps> = ({
  isListening,
  isProcessing,
  isResponding,
  isMuted,
  showChatInterface,
  voiceEnabled,
  conversationMode,
  messages,
  currentMotionState,
  coherenceLevel,
  coherenceShift,
  showBreakthrough,
  voiceAmplitude,
  maiaIsSpeaking,
  holoflowerSize,
  voiceMicRef,
  enableAudio,
  setIsMuted,
  setShowChatInterface
}) => {
  return (
    <motion.div
      className="cursor-pointer opacity-60 hover:opacity-80 transition-opacity"
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🌸 Holoflower clicked!');
        await enableAudio();

        if (!showChatInterface && voiceEnabled) {
          if (!isMuted) {
            setIsMuted(true);
            if (voiceMicRef.current?.stopListening) {
              voiceMicRef.current.stopListening();
              console.log('🔇 Voice stopped via holoflower');
            }
          } else {
            setIsMuted(false);
            setTimeout(async () => {
              if (voiceMicRef.current?.startListening && !isProcessing && !isResponding) {
                await voiceMicRef.current.startListening();
                console.log('🎤 Voice started via holoflower');
              }
            }, 100);
          }
        } else if (showChatInterface) {
          setShowChatInterface(false);
          setIsMuted(false);
          setTimeout(async () => {
            if (voiceMicRef.current?.startListening && !isProcessing && !isResponding) {
              await voiceMicRef.current.startListening();
            }
          }, 200);
        }
      }}
      style={{ willChange: 'auto' }}
    >
      {/* Holoflower container - smaller, upper-left, visible but not dominating */}
      <div className="flex items-center justify-center"
           style={{
             width: holoflowerSize,
             height: holoflowerSize,
             background: 'transparent',
             overflow: 'visible'
           }}>
        {/* Non-interactive Sacred Holoflower with animations */}
        <SacredHoloflower
          size={holoflowerSize}
          interactive={false}
          showLabels={false}
          motionState={currentMotionState}
          coherenceLevel={coherenceLevel}
          coherenceShift={coherenceShift}
          isListening={isListening}
          isProcessing={isProcessing}
          isResponding={isResponding}
          showBreakthrough={showBreakthrough}
          voiceAmplitude={voiceAmplitude}
          isMaiaSpeaking={isResponding || maiaIsSpeaking}
          dimmed={conversationMode === 'chat' || messages.length > 0}
        />

        {/* Central Holoflower Logo with Glow and Sparkles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Minimal glow - almost imperceptible */}
          <motion.div
            className={`absolute flex items-center justify-center pointer-events-none ${
              showChatInterface || messages.length > 0
                ? 'opacity-0'  // Invisible when text present
                : 'opacity-10'  // Barely visible when listening
            }`}
            animate={{
              scale: [1, 1.1, 1],
              opacity: showChatInterface || messages.length > 0 ? 0 : [0.05, 0.1, 0.05]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div
              className="w-32 h-32 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(212, 184, 150, 0.15) 0%, transparent 60%)',
                filter: 'blur(40px)',
                transform: 'translate(0, 0)'
              }}
            />
          </motion.div>

          {/* Holoflower Image - Subtle presence */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <img
              src="/holoflower-amber.png"
              alt="Holoflower"
              className="object-contain opacity-50"
              style={{
                width: `${holoflowerSize * 0.85}px`,
                height: `${holoflowerSize * 0.85}px`,
                filter: 'none',
              }}
            />
          </div>

          {/* Sparkles emanating from center - ULTRA SLOW & EPHEMERAL */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Main radial sparkles - slower drift */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-0.5 h-0.5 bg-white/80 rounded-full"
                style={{
                  filter: 'blur(0.5px)'
                }}
                animate={{
                  x: [0, Math.cos(i * Math.PI / 6) * 100],
                  y: [0, Math.sin(i * Math.PI / 6) * 100],
                  opacity: [0, 0.7, 0.3, 0],
                  scale: [0, 1.2, 0.8, 0]
                }}
                transition={{
                  duration: 10 + Math.random() * 5, // 10-15 seconds
                  repeat: Infinity,
                  delay: i * 1.5 + Math.random() * 5, // Very sporadic
                  ease: "easeInOut",
                  repeatDelay: Math.random() * 5 // Long pauses
                }}
              />
            ))}

            {/* Spiraling sparkles - dreamy drift */}
            {[...Array(16)].map((_, i) => {
              const angle = (i * Math.PI * 2) / 16;
              const radius = 80 + Math.random() * 40;

              return (
                <motion.div
                  key={`spiral-sparkle-${i}`}
                  className="absolute w-0.5 h-0.5 bg-amber-200/60 rounded-full"
                  style={{
                    filter: 'blur(1px)'
                  }}
                  animate={{
                    x: [
                      0,
                      Math.cos(angle) * (radius * 0.3),
                      Math.cos(angle + Math.PI * 0.5) * (radius * 0.6),
                      Math.cos(angle + Math.PI) * radius,
                      Math.cos(angle + Math.PI * 1.5) * (radius * 0.4),
                      0
                    ],
                    y: [
                      0,
                      Math.sin(angle) * (radius * 0.3),
                      Math.sin(angle + Math.PI * 0.5) * (radius * 0.6),
                      Math.sin(angle + Math.PI) * radius,
                      Math.sin(angle + Math.PI * 1.5) * (radius * 0.4),
                      0
                    ],
                    opacity: [0, 0.4, 0.6, 0.3, 0.1, 0],
                    scale: [0, 0.8, 1.2, 0.9, 0.4, 0]
                  }}
                  transition={{
                    duration: 15 + Math.random() * 10, // 15-25 seconds
                    repeat: Infinity,
                    delay: i * 2 + Math.random() * 8, // Very staggered
                    ease: "easeInOut",
                    repeatDelay: Math.random() * 10 // Long intervals
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MaiaHoloflowerMicGolden;