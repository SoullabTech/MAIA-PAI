'use client';

/**
 * MAIA Sacred Welcome Screen
 *
 * "You are a jewel in Indra's Web"
 *
 * First-time user experience introducing the divine crystal vision
 * Adapted from iOS app opening screen design
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface WelcomeScreenProps {
  explorerName: string;
  onComplete: () => void;
}

export function WelcomeScreen({ explorerName, onComplete }: WelcomeScreenProps) {
  const [step, setStep] = useState(0);
  const [showButton, setShowButton] = useState(false);

  // Sequential text reveal
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),   // "Welcome to MAIA"
      setTimeout(() => setStep(2), 2200),  // "You are a jewel..."
      setTimeout(() => setStep(3), 4000),  // "Your transformation..."
      setTimeout(() => setStep(4), 5800),  // "The field supports..."
      setTimeout(() => setStep(5), 7600),  // "Let's make your light visible"
      setTimeout(() => setShowButton(true), 9000), // Show button
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950"
    >
      {/* Indra's Web - Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Radial gradient for jewel glow */}
            <radialGradient id="jewelGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Web connections - interconnected jewels */}
          {[
            { x1: '20%', y1: '30%', x2: '50%', y2: '50%' },
            { x1: '50%', y1: '50%', x2: '80%', y2: '30%' },
            { x1: '50%', y1: '50%', x2: '80%', y2: '70%' },
            { x1: '50%', y1: '50%', x2: '20%', y2: '70%' },
            { x1: '20%', y1: '30%', x2: '20%', y2: '70%' },
            { x1: '80%', y1: '30%', x2: '80%', y2: '70%' },
          ].map((line, i) => (
            <motion.line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="url(#jewelGlow)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 2, delay: i * 0.3 }}
            />
          ))}

          {/* Jewel nodes */}
          {[
            { cx: '50%', cy: '50%', r: 8 },  // Center (you)
            { cx: '20%', cy: '30%', r: 4 },
            { cx: '80%', cy: '30%', r: 4 },
            { cx: '20%', cy: '70%', r: 4 },
            { cx: '80%', cy: '70%', r: 4 },
          ].map((jewel, i) => (
            <motion.circle
              key={i}
              cx={jewel.cx}
              cy={jewel.cy}
              r={jewel.r}
              fill="url(#jewelGlow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{
                duration: 0.6,
                delay: i * 0.4,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 2
              }}
            />
          ))}
        </svg>
      </div>

      {/* Sacred geometry overlay - Flower of Life (subtle) */}
      <motion.div
        className="absolute inset-0 opacity-5"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="400" height="400" viewBox="0 0 400 400">
            {/* Simplified Flower of Life pattern */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <circle
                key={i}
                cx={200 + Math.cos((angle * Math.PI) / 180) * 50}
                cy={200 + Math.sin((angle * Math.PI) / 180) * 50}
                r="50"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1"
                opacity="0.3"
              />
            ))}
            <circle cx="200" cy="200" r="50" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.4" />
          </svg>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl px-8 text-center">
        {/* MAIA Logo / Title */}
        <AnimatePresence mode="wait">
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <motion.div
                className="relative w-24 h-24 mx-auto mb-4"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <Image
                  src="/holoflower-amber.png"
                  alt="SOULLAB Holoflower"
                  width={96}
                  height={96}
                  className="w-24 h-24 drop-shadow-2xl"
                  priority
                />
                {/* Sacred glow effect */}
                <motion.div
                  className="absolute inset-0 blur-xl opacity-40"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Image
                    src="/holoflower-amber.png"
                    alt=""
                    width={96}
                    height={96}
                    className="w-24 h-24"
                  />
                </motion.div>
              </motion.div>
              <h1 className="text-5xl font-bold text-white mb-2">
                Welcome to MAIA
              </h1>
              <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sequential sacred messages */}
        <div className="space-y-8 min-h-[300px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step >= 2 && (
              <motion.p
                key="jewel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-2xl text-amber-200 font-light leading-relaxed"
              >
                You are a jewel in Indra's Web.
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step >= 3 && (
              <motion.p
                key="ripple"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-xl text-stone-300 font-light leading-relaxed"
              >
                Your transformation ripples through the field.
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step >= 4 && (
              <motion.p
                key="field"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-xl text-stone-300 font-light leading-relaxed"
              >
                The field supports your transformation.
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step >= 5 && (
              <motion.p
                key="light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl text-amber-200 font-light leading-relaxed"
              >
                Let's make your light visible.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Begin Journey button */}
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12"
            >
              <motion.button
                onClick={onComplete}
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-medium text-lg shadow-lg shadow-amber-900/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Begin Your Journey
              </motion.button>

              {explorerName !== 'Explorer' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 text-sm text-stone-400"
                >
                  Welcome, {explorerName}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Breathing pulse effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 60%)',
            'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}
