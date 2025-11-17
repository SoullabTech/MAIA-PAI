'use client';

import React from 'react';
import { Holoflower } from '@/components/ui/Holoflower';
import { motion } from 'framer-motion';
import type { RhythmMetrics } from '@/lib/liquid/ConversationalRhythm';

interface RhythmHoloflowerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rhythmIntensity?: number;
  rhythmMetrics?: RhythmMetrics | null;
  className?: string;
  interactive?: boolean;
  showLabels?: boolean;
  motionState?: any;
}

/**
 * RhythmHoloflower - Animated holoflower that responds to conversation rhythm
 * Uses the amber/brown sacred aesthetic with dynamic animation
 */
export function RhythmHoloflower({
  size = 'lg',
  rhythmIntensity = 1,
  rhythmMetrics = null,
  className = '',
  interactive = false,
  showLabels = false,
  motionState = null
}: RhythmHoloflowerProps) {
  // Calculate intensity based on rhythm metrics if available
  const intensity = rhythmMetrics
    ? rhythmMetrics.intensityLevel
    : rhythmIntensity;

  // Dynamic animation based on conversation tempo
  const getTempoBased = () => {
    if (!rhythmMetrics) {
      return { duration: 2 + intensity, intensity };
    }

    switch (rhythmMetrics.conversationTempo) {
      case 'fast':
        return { duration: 1.5, intensity: intensity * 1.3 };
      case 'slow':
        return { duration: 4, intensity: intensity * 0.7 };
      case 'dynamic':
        return { duration: 2.5, intensity: intensity * 1.1 };
      default:
        return { duration: 2, intensity };
    }
  };

  const { duration, intensity: finalIntensity } = getTempoBased();

  return (
    <motion.div
      animate={{
        scale: [1, 1 + (finalIntensity * 0.15), 1],
        opacity: [1, 1, 1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      <Holoflower
        size={size}
        animate={true}
        glowIntensity={finalIntensity > 0.7 ? "high" : finalIntensity > 0.4 ? "medium" : "low"}
        variant="spectrum"
        theme="dark"
      />
    </motion.div>
  );
}