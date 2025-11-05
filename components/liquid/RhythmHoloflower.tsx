'use client';

/**
 * 🌊 RHYTHM-ENHANCED HOLOFLOWER
 *
 * Wraps SacredHoloflower with conversational rhythm sensing
 * The holoflower pulses in sync with your speech patterns
 */

import { useMemo, useEffect, useState } from 'react';
import { SacredHoloflower } from '@/components/sacred/SacredHoloflower';
import type { RhythmMetrics } from '@/lib/liquid/ConversationalRhythm';
import type { MotionState } from '@/components/motion/MotionOrchestrator';

interface RhythmHoloflowerProps {
  rhythmMetrics: RhythmMetrics | null;
  activeFacetId?: string;
  userCheckIns?: Record<string, number>;
  onPetalClick?: (facetId: string) => void;
  onPetalHover?: (facetId: string | null) => void;
  size?: number;
  showLabels?: boolean;
  interactive?: boolean;
  motionState?: MotionState;
  isListening?: boolean;
  isProcessing?: boolean;
  isResponding?: boolean;
  showBreakthrough?: boolean;
  dimmed?: boolean;
  voiceAmplitude?: number;
  isMaiaSpeaking?: boolean;
}

export function RhythmHoloflower({
  rhythmMetrics,
  voiceAmplitude = 0,
  ...holoflowerProps
}: RhythmHoloflowerProps) {
  const [rhythmPulse, setRhythmPulse] = useState(0);

  // Convert rhythm metrics into visual pulsing
  const coherenceLevel = useMemo(() => {
    if (!rhythmMetrics) return 0.5;

    // Blend multiple rhythm factors into coherence visualization
    const {
      rhythmCoherence,
      breathAlignment,
      silenceComfort,
      conversationTempo
    } = rhythmMetrics;

    // Base coherence from rhythm patterns
    let coherence = rhythmCoherence * 0.4;

    // Breath alignment adds stability
    coherence += breathAlignment * 0.3;

    // Silence comfort adds depth
    coherence += silenceComfort * 0.2;

    // Tempo affects intensity
    if (conversationTempo === 'fast') {
      coherence += 0.1; // High energy
    } else if (conversationTempo === 'slow') {
      coherence += 0.05; // Contemplative
    }

    // Clamp to 0-1 range
    return Math.max(0, Math.min(1, coherence));
  }, [rhythmMetrics]);

  // Create rhythmic pulsing effect based on speech tempo
  useEffect(() => {
    if (!rhythmMetrics) {
      setRhythmPulse(0);
      return;
    }

    const { conversationTempo, rhythmCoherence, totalUtterances } = rhythmMetrics;

    // Only pulse if there's conversational activity
    if (totalUtterances === 0) {
      setRhythmPulse(0);
      return;
    }

    // Pulse speed based on tempo
    let pulseInterval: number;
    if (conversationTempo === 'fast') {
      pulseInterval = 800; // Quick pulses
    } else if (conversationTempo === 'slow') {
      pulseInterval = 2000; // Slow, contemplative pulses
    } else {
      pulseInterval = 1200; // Medium pulses
    }

    // Pulse amplitude based on coherence
    const amplitude = rhythmCoherence * 0.3; // 0-0.3 range

    // Create sine wave pulsing
    let frame = 0;
    const interval = setInterval(() => {
      frame += 0.05;
      const pulse = Math.sin(frame) * amplitude;
      setRhythmPulse(pulse);
    }, pulseInterval / 60); // 60fps-ish

    return () => clearInterval(interval);
  }, [rhythmMetrics]);

  // Combine voice amplitude with rhythm pulse
  const combinedAmplitude = useMemo(() => {
    // Voice amplitude (real-time) takes priority
    if (voiceAmplitude > 0.1) {
      return voiceAmplitude;
    }

    // Fall back to rhythm pulse when not speaking
    return Math.abs(rhythmPulse);
  }, [voiceAmplitude, rhythmPulse]);

  return (
    <SacredHoloflower
      {...holoflowerProps}
      coherenceLevel={coherenceLevel}
      voiceAmplitude={combinedAmplitude}
    />
  );
}
