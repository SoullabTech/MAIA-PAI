/**
 * Biometric Coherence Hook
 *
 * React hook that provides real-time biometric data and coherence state
 * to MAIA conversation components
 *
 * Usage:
 * ```tsx
 * const { coherence, heartRate, recommendedMode } = useBiometricCoherence();
 * ```
 */

import { useState, useEffect } from 'react';
import { realtimeBiometricService } from '@/lib/biometrics/RealtimeBiometricService';
import type { BiometricUpdate } from '@/lib/biometrics/RealtimeBiometricService';

export interface BiometricCoherenceState {
  // Current metrics
  hrv: number | null;
  heartRate: number | null;
  respiratoryRate: number | null;

  // Coherence analysis
  coherenceLevel: number; // 0.0 - 1.0
  coherenceTrend: 'rising' | 'stable' | 'falling';
  readinessScore: number; // 0-100

  // Recommended states
  recommendedMode: 'dialogue' | 'patient' | 'scribe';
  recommendedBreathRate: number; // seconds per breath

  // Status
  isStreaming: boolean;
  lastUpdate: Date | null;
}

export function useBiometricCoherence(): BiometricCoherenceState {
  const [state, setState] = useState<BiometricCoherenceState>({
    hrv: null,
    heartRate: null,
    respiratoryRate: null,
    coherenceLevel: 0.5,
    coherenceTrend: 'stable',
    readinessScore: 50,
    recommendedMode: 'dialogue',
    recommendedBreathRate: 4,
    isStreaming: false,
    lastUpdate: null
  });

  useEffect(() => {
    // Subscribe to biometric updates
    const unsubscribe = realtimeBiometricService.subscribe((update: BiometricUpdate) => {
      // Map recommended mode to breath rate
      const breathRates: Record<string, number> = {
        dialogue: 4,  // Stressed → gentle 4s breathing
        patient: 8,   // Balanced → deeper 8s breathing
        scribe: 12    // Coherent → witnessing 12s breathing
      };

      setState({
        hrv: update.hrv ?? null,
        heartRate: update.heartRate ?? null,
        respiratoryRate: update.respiratoryRate ?? null,
        coherenceLevel: update.coherenceLevel,
        coherenceTrend: update.coherenceTrend,
        readinessScore: update.readinessScore,
        recommendedMode: update.recommendedMode,
        recommendedBreathRate: breathRates[update.recommendedMode],
        isStreaming: true,
        lastUpdate: update.timestamp
      });
    });

    // Start service if not already running
    realtimeBiometricService.start(30000); // Poll every 30 seconds

    return () => {
      unsubscribe();
    };
  }, []);

  return state;
}

/**
 * Get coherence status as human-readable string
 */
export function getCoherenceStatus(coherenceLevel: number): string {
  if (coherenceLevel >= 0.8) return 'Optimal';
  if (coherenceLevel >= 0.6) return 'High';
  if (coherenceLevel >= 0.4) return 'Balanced';
  if (coherenceLevel >= 0.2) return 'Building';
  return 'Activated';
}

/**
 * Get coherence color for UI
 */
export function getCoherenceColor(coherenceLevel: number): string {
  if (coherenceLevel >= 0.7) return '#E94B8A'; // bloom-magenta (high coherence)
  if (coherenceLevel >= 0.4) return '#FF7B9C'; // heart-coral (balanced)
  return '#D45D79'; // wellness-crimson (building coherence)
}

/**
 * Get recommended motion state for holoflower
 */
export function getMotionState(
  coherenceLevel: number,
  trend: 'rising' | 'stable' | 'falling'
): 'idle' | 'breathing' | 'processing' | 'responding' | 'breakthrough' {
  // Breakthrough moment if coherence is high and rising
  if (coherenceLevel >= 0.8 && trend === 'rising') {
    return 'breakthrough';
  }

  // Responsive breathing based on coherence
  if (coherenceLevel >= 0.5) {
    return 'breathing';
  }

  return 'idle';
}
