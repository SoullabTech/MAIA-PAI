'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { soulfulSounds } from '@/lib/audio/SoulfulSounds';

interface EntrancingMessageProps {
  message: string;
  isFromMaya?: boolean;
  onComplete?: () => void;
}

/**
 * Creates an entrancing, sublime chat experience
 * with animated text, subtle sounds, and visual poetry
 */
export function EntrancingChatExperience({
  message,
  isFromMaya = true,
  onComplete
}: EntrancingMessageProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isReflecting, setIsReflecting] = useState(isFromMaya);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'waiting' | 'breathing' | 'speaking' | 'complete'>('waiting');
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth spring animation for glow
  const glowSpring = useSpring(glowIntensity, { stiffness: 50, damping: 30 });
  const glowRadius = useTransform(glowSpring, [0, 1], [0, 60]);

  useEffect(() => {
    if (!isFromMaya) {
      // User messages appear immediately
      setDisplayedText(message);
      setCurrentPhase('complete');
      return;
    }

    // Maya's entrancing flow
    startMayaSequence();
  }, [message]);

  const startMayaSequence = async () => {
    // Reset state
    setDisplayedText('');
    setCurrentPhase('waiting');
    setGlowIntensity(0.3);

    // Phase 1: Reflection (1-2 seconds)
    setIsReflecting(true);
    await wait(1500 + Math.random() * 500); // Vary the thinking time

    // Phase 2: Breath before speaking
    setCurrentPhase('breathing');
    setIsReflecting(false);
    soulfulSounds.playBreath();
    setGlowIntensity(0.5);
    await wait(300);

    // Phase 3: Flowing text with consciousness
    setCurrentPhase('speaking');
    await flowText(message);

    // Phase 4: Complete
    setCurrentPhase('complete');
    setGlowIntensity(0.2);
    onComplete?.();
  };

  const flowText = async (text: string) => {
    const segments = parseTextSegments(text);
    let accumulated = '';

    for (const segment of segments) {
      if (segment.type === 'text') {
        // Flow words naturally
        await flowWords(segment.content, accumulated);
        accumulated += segment.content;
      } else if (segment.type === 'pause') {
        // Natural pause with breath
        await wait(segment.duration);
        if (segment.duration > 400) {
          soulfulSounds.playBreath();
        }
      } else if (segment.type === 'sacred') {
        // Sacred moment - glow and resonance
        setGlowIntensity(0.8);
        soulfulSounds.playResonance();
        await flowWords(segment.content, accumulated, true);
        accumulated += segment.content;
        setGlowIntensity(0.5);
      }
    }
  };

  const flowWords = async (text: string, previousText: string, isSacred = false) => {
    const words = text.split(' ');

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const prefix = previousText + words.slice(0, i).join(' ') + (i > 0 ? ' ' : '');

      // Add word with subtle sound
      setDisplayedText(prefix + word);

      // Subtle typing sound on some words
      if (Math.random() > 0.7 || isSacred) {
        soulfulSounds.playTextFlow();
      }

      // Natural word pacing
      const wordDelay = calculateWordDelay(word, isSacred);
      await wait(wordDelay);
    }
  };

  const calculateWordDelay = (word: string, isSacred: boolean) => {
    const baseDelay = isSacred ? 180 : 120;
    const lengthFactor = word.length * 5;
    const variability = Math.random() * 40 - 20; // ±20ms variation

    // Longer pauses after punctuation
    if (word.includes('.') || word.includes('?') || word.includes('!')) {
      return baseDelay + lengthFactor + 400 + variability;
    }
    if (word.includes(',') || word.includes(';')) {
      return baseDelay + lengthFactor + 200 + variability;
    }

    return baseDelay + lengthFactor + variability;
  };

  const parseTextSegments = (text: string) => {
    const segments = [];
    const sentences = text.split(/([.!?])/);

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];

      // Check for sacred/important phrases
      const sacredPhrases = ['realize', 'truth', 'soul', 'heart', 'breakthrough', 'transform'];
      const isSacred = sacredPhrases.some(phrase =>
        sentence.toLowerCase().includes(phrase)
      );

      if (sentence.match(/[.!?]/)) {
        segments.push({ type: 'text', content: sentence });
        segments.push({ type: 'pause', duration: 600 });
      } else if (isSacred) {
        segments.push({ type: 'sacred', content: sentence });
      } else {
        segments.push({ type: 'text', content: sentence });
      }
    }

    return segments;
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <motion.div
      ref={containerRef}
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Ambient glow that follows Maya's consciousness */}
      {isFromMaya && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center,
              rgba(212, 184, 150, ${glowIntensity * 0.1}) 0%,
              transparent 70%)`,
            filter: `blur(${glowRadius}px)`,
          }}
        />
      )}

      {/* The message container */}
      <div className={`
        relative z-10 rounded-2xl p-6
        ${isFromMaya
          ? 'bg-gradient-to-br from-amber-900/10 to-amber-800/5 border border-amber-500/20'
          : 'bg-gray-800/30 border border-gray-700/30'
        }
      `}>

        {/* Maya's reflection state */}
        <AnimatePresence mode="wait">
          {isReflecting && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="flex gap-1">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 bg-amber-400/40 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay,
                    }}
                  />
                ))}
              </div>
              <span className="text-amber-400/60 text-sm italic">
                Maya is reflecting...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The flowing text */}
        {!isReflecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`
              ${isFromMaya ? 'text-amber-50' : 'text-gray-200'}
              leading-relaxed
            `}
          >
            {displayedText}

            {/* Breathing cursor while Maya speaks */}
            {isFromMaya && currentPhase === 'speaking' && displayedText !== message && (
              <motion.span
                className="inline-block w-0.5 h-5 bg-amber-400/50 ml-1 align-middle"
                animate={{
                  opacity: [0, 1, 0],
                  scaleY: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.div>
        )}

        {/* Subtle sacred moment indicator */}
        {currentPhase === 'speaking' && glowIntensity > 0.7 && (
          <motion.div
            className="absolute -inset-1 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 rounded-2xl animate-pulse
              bg-gradient-to-r from-amber-400/10 via-amber-500/5 to-amber-400/10"
            />
          </motion.div>
        )}
      </div>

      {/* Ethereal particles during sacred moments */}
      {currentPhase === 'speaking' && glowIntensity > 0.7 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
              initial={{
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
                opacity: 0
              }}
              animate={{
                x: Math.random() * 200 - 100,
                y: -100,
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: i * 0.3,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

/**
 * Ambient background presence for the entire chat
 */
export function AmbientChatAtmosphere({ children }: { children: React.ReactNode }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ambientRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    // Start subtle ambient presence
    ambientRef.current = soulfulSounds.createAmbientPresence();

    return () => {
      ambientRef.current?.stop();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className="relative min-h-screen"
      onMouseMove={handleMouseMove}
    >
      {/* Subtle gradient that follows cursor */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(
            circle 800px at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(212, 184, 150, 0.05),
            transparent
          )`
        }}
      />

      {/* Breathing background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0.02, 0.04, 0.02],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212, 184, 150, 0.1), transparent 50%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}