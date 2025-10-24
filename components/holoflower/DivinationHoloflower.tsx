'use client';

/**
 * DIVINATION HOLOFLOWER
 *
 * Inductive, intimate portal to the mystery of self
 *
 * Experience Flow:
 * 1. Approach: Sacred mandala breathes, inviting contact
 * 2. Touch: Place finger on center - initiates divination
 * 3. Divination: Flower reads your gesture and reveals your state
 * 4. Witnessing: Watch petals animate to show your configuration
 * 5. Recognition: Receive oracle interpretation
 * 6. Optional: Touch individual petals to explore deeper
 *
 * This is NOT data entry - it's divination through gesture.
 * The holoflower TELLS you your state, you don't input it.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface DivinationHoloflowerProps {
  onComplete?: (reading: DivinationReading) => void;
  onClose?: () => void;
}

export interface DivinationReading {
  values: number[];  // 12 petal values (0-10)
  timestamp: string;
  coherence: number;
  signature: string;
  gestureData: {
    touchDuration: number;
    touchPressure: number;
    approachSpeed: 'slow' | 'medium' | 'quick';
  };
}

// Sacred Geometry - 12 Petals matching your mandala design
const SACRED_PETALS = [
  // AIR QUADRANT (12-3 o'clock) - Golden/Yellow tones
  { id: 1, name: 'Beginning New Cycles', element: 'air', angle: 0, baseColor: '#D4AF37' },
  { id: 2, name: 'Building Inner Awareness', element: 'air', angle: 30, baseColor: '#E0C464' },
  { id: 3, name: 'Integrating Lessons', element: 'air', angle: 60, baseColor: '#F0D878' },

  // FIRE QUADRANT (3-6 o'clock) - Red/Orange tones
  { id: 4, name: 'Igniting Passion', element: 'fire', angle: 90, baseColor: '#CD8A7A' },
  { id: 5, name: 'Transforming Through Action', element: 'fire', angle: 120, baseColor: '#B56C5A' },
  { id: 6, name: 'Radiating Authenticity', element: 'fire', angle: 150, baseColor: '#9D4E3A' },

  // WATER QUADRANT (6-9 o'clock) - Blue tones
  { id: 7, name: 'Opening to Flow', element: 'water', angle: 180, baseColor: '#7FBBD3' },
  { id: 8, name: 'Deepening Intuition', element: 'water', angle: 210, baseColor: '#5FA3BF' },
  { id: 9, name: 'Emotional Integration', element: 'water', angle: 240, baseColor: '#3F8BAB' },

  // EARTH QUADRANT (9-12 o'clock) - Green tones
  { id: 10, name: 'Grounding in Body', element: 'earth', angle: 270, baseColor: '#7A9B65' },
  { id: 11, name: 'Nurturing Growth', element: 'earth', angle: 300, baseColor: '#62834D' },
  { id: 12, name: 'Manifesting Abundance', element: 'earth', angle: 330, baseColor: '#4A6B35' },
];

export function DivinationHoloflower({ onComplete, onClose }: DivinationHoloflowerProps) {
  const [phase, setPhase] = useState<'approach' | 'touching' | 'divining' | 'revealed' | 'exploring'>('approach');
  const [petalValues, setPetalValues] = useState<number[]>(Array(12).fill(5)); // Start neutral
  const [touchStartTime, setTouchStartTime] = useState<number>(0);
  const [touchDuration, setTouchDuration] = useState<number>(0);
  const [oracleMessage, setOracleMessage] = useState<string>('');
  const [showOracle, setShowOracle] = useState(false);

  const centerRef = useRef<HTMLDivElement>(null);
  const centerControls = useAnimation();

  // Haptic feedback helper
  const haptic = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // Divine state based on gesture
  const divineState = (gestureData: { duration: number; pressure: number; speed: 'slow' | 'medium' | 'quick' }) => {
    // Generate semi-randomized but meaningful configuration
    // Seeded by touch characteristics for consistency
    const seed = gestureData.duration + (gestureData.pressure * 100);

    const values = SACRED_PETALS.map((petal, index) => {
      // Base value from pseudo-random (seeded)
      const random = (Math.sin(seed + index * 1000) + 1) / 2; // 0-1

      // Modulate by element and gesture characteristics
      let value = random * 10;

      // Touch duration affects water/earth (longer = more activated)
      if (petal.element === 'water' || petal.element === 'earth') {
        value += (gestureData.duration / 2000) * 2; // Up to +2 for long touch
      }

      // Quick approach affects fire/air (faster = more activated)
      if (petal.element === 'fire' || petal.element === 'air') {
        if (gestureData.speed === 'quick') value += 1.5;
        if (gestureData.speed === 'slow') value -= 0.5;
      }

      // Pressure affects fire (stronger = more fire)
      if (petal.element === 'fire') {
        value += gestureData.pressure * 1.5;
      }

      // Normalize to 0-10
      return Math.max(0, Math.min(10, value));
    });

    return values;
  };

  // Calculate coherence from values
  const calculateCoherence = (values: number[]): number => {
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    // Coherence is inverse of variance (low variance = high coherence)
    return Math.max(0, Math.min(1, 1 - (stdDev / 5)));
  };

  // Generate oracle message
  const generateOracleMessage = (values: number[]): string => {
    const elementalScores = {
      air: (values[0] + values[1] + values[2]) / 3,
      fire: (values[3] + values[4] + values[5]) / 3,
      water: (values[6] + values[7] + values[8]) / 3,
      earth: (values[9] + values[10] + values[11]) / 3,
    };

    const entries = Object.entries(elementalScores);
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0][0];
    const shadow = sorted[sorted.length - 1][0];

    const coherence = calculateCoherence(values);

    const messages: Record<string, string> = {
      air: 'Your mind is alive with possibility. Fresh perspective is flowing through you.',
      fire: 'Creative fire burns bright within. Your passion is your compass today.',
      water: 'Emotional depths are calling. Trust the wisdom of your feeling.',
      earth: 'You are grounded, stable, present. Your foundation is solid.',
    };

    const coherenceMsg = coherence > 0.7
      ? 'You are in harmony—elements dancing as one.'
      : coherence > 0.4
      ? 'Integration is emerging—honoring the complexity.'
      : 'Exploration is sacred—your elements are in dialogue.';

    return `${messages[dominant]}\n\n${coherenceMsg}\n\nYour ${shadow} whispers in the background, holding tomorrow's gift.`;
  };

  // Handle center touch start
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setPhase('touching');
    setTouchStartTime(Date.now());

    // Initial heartbeat haptic
    haptic([50, 30, 50]);

    // Animate center glow
    centerControls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 1, repeat: Infinity }
    });
  };

  // Handle center touch end
  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const duration = Date.now() - touchStartTime;
    setTouchDuration(duration);

    // Determine approach speed (if < 500ms it was quick)
    const speed: 'slow' | 'medium' | 'quick' = duration < 500 ? 'quick' : duration > 1500 ? 'slow' : 'medium';

    // Estimate pressure (not available in web, so use duration as proxy)
    const pressure = Math.min(1, duration / 2000);

    const gestureData = {
      duration,
      pressure,
      speed
    };

    // Begin divination
    setPhase('divining');

    // Divination haptic pattern (mystical)
    haptic([30, 50, 30, 50, 30, 100]);

    // Divine the state
    const divinedValues = divineState(gestureData);

    // Animate petals revealing over 2 seconds
    const revealDuration = 2000;
    const stepDelay = revealDuration / 12;

    divinedValues.forEach((value, index) => {
      setTimeout(() => {
        setPetalValues(prev => {
          const next = [...prev];
          next[index] = value;
          return next;
        });
        haptic(10); // Subtle pulse per petal
      }, index * stepDelay);
    });

    // After reveal complete, show oracle
    setTimeout(() => {
      setPhase('revealed');
      const message = generateOracleMessage(divinedValues);
      setOracleMessage(message);
      setShowOracle(true);
      haptic([100, 50, 100]); // Completion haptic
    }, revealDuration + 500);
  };

  // Handle individual petal touch for exploration
  const handlePetalTouch = (petalIndex: number) => {
    if (phase !== 'revealed' && phase !== 'exploring') return;

    setPhase('exploring');
    haptic(20);

    // Show petal details (future enhancement)
    // For now, just gentle feedback
  };

  // Complete and return reading
  const handleComplete = () => {
    const reading: DivinationReading = {
      values: petalValues,
      timestamp: new Date().toISOString(),
      coherence: calculateCoherence(petalValues),
      signature: btoa(petalValues.join(',')),
      gestureData: {
        touchDuration,
        touchPressure: Math.min(1, touchDuration / 2000),
        approachSpeed: touchDuration < 500 ? 'quick' : touchDuration > 1500 ? 'slow' : 'medium'
      }
    };

    onComplete?.(reading);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 flex items-center justify-center">
      {/* Sacred Container */}
      <div className="relative w-full h-full max-w-2xl max-h-[90vh] flex flex-col items-center justify-center p-8">

        {/* Invitation Text */}
        <AnimatePresence mode="wait">
          {phase === 'approach' && (
            <motion.div
              key="invitation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-8 left-0 right-0 text-center"
            >
              <h2 className="text-2xl font-light text-amber-200/80 mb-2">Sacred Check-In</h2>
              <p className="text-sm text-stone-400 italic">Touch the sacred center when you're ready</p>
            </motion.div>
          )}

          {phase === 'touching' && (
            <motion.div
              key="touching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-8 left-0 right-0 text-center"
            >
              <p className="text-sm text-amber-300/60 italic">Listening...</p>
            </motion.div>
          )}

          {phase === 'divining' && (
            <motion.div
              key="divining"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-8 left-0 right-0 text-center"
            >
              <p className="text-sm text-amber-400/80 italic">Divining your state...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Holoflower Mandala */}
        <div className="relative w-full aspect-square max-w-md">
          <svg viewBox="0 0 500 500" className="w-full h-full">
            <defs>
              {/* Center glow gradient */}
              <radialGradient id="centerGlow">
                <stop offset="0%" stopColor="#FFD700" stopOpacity={phase === 'touching' ? 0.8 : 0.4} />
                <stop offset="50%" stopColor="#FFA500" stopOpacity={0.2} />
                <stop offset="100%" stopColor="transparent" stopOpacity={0} />
              </radialGradient>

              {/* Petal gradients for each element */}
              {SACRED_PETALS.map(petal => (
                <radialGradient key={`grad-${petal.id}`} id={`petal-grad-${petal.id}`}>
                  <stop offset="0%" stopColor={petal.baseColor} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={petal.baseColor} stopOpacity={0.5} />
                </radialGradient>
              ))}
            </defs>

            {/* Center Sacred Circle */}
            <motion.circle
              cx="250"
              cy="250"
              r="40"
              fill="url(#centerGlow)"
              stroke="#D4AF37"
              strokeWidth="2"
              strokeOpacity={0.6}
              animate={centerControls}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleTouchStart}
              onMouseUp={handleTouchEnd}
              style={{ cursor: phase === 'approach' ? 'pointer' : 'default' }}
            />

            {/* Breathing center indicator */}
            <motion.circle
              cx="250"
              cy="250"
              r="40"
              fill="none"
              stroke="#FFD700"
              strokeWidth="1"
              strokeOpacity={0.3}
              animate={{
                r: [40, 50, 40],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* 12 Petals - Organic shapes */}
            {SACRED_PETALS.map((petal, index) => {
              const value = petalValues[index];
              const angleRad = (petal.angle * Math.PI) / 180;

              // Petal extends from center based on value
              const baseRadius = 60;
              const maxExtension = 120;
              const extension = baseRadius + (value / 10) * maxExtension;

              // Petal width
              const petalWidth = 35;

              // Calculate petal path (organic shape)
              const centerX = 250;
              const centerY = 250;

              const tipX = centerX + extension * Math.cos(angleRad);
              const tipY = centerY + extension * Math.sin(angleRad);

              const leftAngle = angleRad - Math.PI / 12;
              const rightAngle = angleRad + Math.PI / 12;

              const leftBaseX = centerX + baseRadius * Math.cos(leftAngle);
              const leftBaseY = centerY + baseRadius * Math.sin(leftAngle);

              const rightBaseX = centerX + baseRadius * Math.cos(rightAngle);
              const rightBaseY = centerY + baseRadius * Math.sin(rightAngle);

              const leftMidX = centerX + (extension * 0.7) * Math.cos(leftAngle);
              const leftMidY = centerY + (extension * 0.7) * Math.sin(leftAngle);

              const rightMidX = centerX + (extension * 0.7) * Math.cos(rightAngle);
              const rightMidY = centerY + (extension * 0.7) * Math.sin(rightAngle);

              const path = `
                M ${centerX},${centerY}
                L ${leftBaseX},${leftBaseY}
                Q ${leftMidX},${leftMidY} ${tipX},${tipY}
                Q ${rightMidX},${rightMidY} ${rightBaseX},${rightBaseY}
                Z
              `;

              return (
                <motion.path
                  key={petal.id}
                  d={path}
                  fill={`url(#petal-grad-${petal.id})`}
                  stroke={petal.baseColor}
                  strokeWidth="1"
                  strokeOpacity={0.4}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: phase === 'approach' ? 0.6 : 1,
                    scale: 1
                  }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handlePetalTouch(index)}
                  style={{ cursor: phase === 'revealed' || phase === 'exploring' ? 'pointer' : 'default' }}
                />
              );
            })}
          </svg>
        </div>

        {/* Oracle Reading */}
        <AnimatePresence>
          {showOracle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-8 left-8 right-8 bg-stone-900/90 backdrop-blur-sm border border-amber-600/30 rounded-xl p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-amber-200 font-light text-lg mb-2">Oracle Reading</h3>
                  <p className="text-stone-300 text-sm whitespace-pre-line leading-relaxed">
                    {oracleMessage}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleComplete}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-medium hover:from-amber-500 hover:to-orange-500 transition-all"
                >
                  Continue to MAIA
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-stone-800 text-stone-300 rounded-lg font-medium hover:bg-stone-700 transition-all"
                  >
                    Close
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
