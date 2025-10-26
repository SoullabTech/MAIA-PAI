/**
 * 🜂 useResonanceProtocol Hook
 *
 * React hooks for integrating The Resonance Protocol into MAIA's UI.
 * Provides easy access to all five phases from any React component.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getResonanceAwareMAIA } from '../maia/resonance-protocol-integration';
import { getResonanceAudioEngine } from '../audio/resonance-audio-engine';
import type { FieldState, FrequencyConfig } from '../resonance/types';

// ═══════════════════════════════════════════════════════════════
// Main Hook: useResonanceProtocol
// ═══════════════════════════════════════════════════════════════

export interface ResonanceProtocolState {
  fieldState: FieldState | null;
  sonicConfig: FrequencyConfig | null;
  isAudioInitialized: boolean;
  isAudioPlaying: boolean;
  audioVolume: number;
}

export interface ResonanceProtocolActions {
  updateConversation: (
    userInput: string,
    userId: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>
  ) => Promise<{
    shouldRespond: boolean;
    enrichmentPrompt: string | null;
    humanState: any;
  }>;

  checkFollowUpAgents: (userId: string) => string[];
  checkIntervention: (userId: string) => any;

  initializeAudio: () => Promise<boolean>;
  playAudio: () => Promise<void>;
  stopAudio: () => Promise<void>;
  setAudioVolume: (volume: number) => void;
  playInsightChime: (intensity?: number) => Promise<void>;

  reset: (userId?: string) => void;
}

/**
 * Main hook for accessing The Resonance Protocol.
 *
 * Usage:
 * ```tsx
 * const { state, actions } = useResonanceProtocol();
 *
 * // Before agent responds:
 * const guidance = await actions.updateConversation(input, userId, history);
 *
 * // Display field state:
 * <FieldMap fieldState={state.fieldState} />
 * ```
 */
export function useResonanceProtocol(): {
  state: ResonanceProtocolState;
  actions: ResonanceProtocolActions;
} {
  const [fieldState, setFieldState] = useState<FieldState | null>(null);
  const [sonicConfig, setSonicConfig] = useState<FrequencyConfig | null>(null);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolumeState] = useState(0.03);

  const orchestratorRef = useRef(getResonanceAwareMAIA());
  const audioEngineRef = useRef(getResonanceAudioEngine());

  // ──────────────────────────────────────────────────────────────
  // Update Conversation
  // ──────────────────────────────────────────────────────────────

  const updateConversation = useCallback(async (
    userInput: string,
    userId: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>
  ) => {
    const result = await orchestratorRef.current.prepareResponse(
      userInput,
      userId,
      history
    );

    // Update field state
    setFieldState(result.fieldState);

    // Update sonic config
    const sonic = orchestratorRef.current.getSonicConfig();
    setSonicConfig(sonic);

    // Play audio if initialized
    if (isAudioInitialized && sonic && isAudioPlaying) {
      await audioEngineRef.current.play(sonic);
    }

    return {
      shouldRespond: result.shouldRespond,
      enrichmentPrompt: result.enrichmentPrompt,
      humanState: result.humanState,
    };
  }, [isAudioInitialized, isAudioPlaying]);

  // ──────────────────────────────────────────────────────────────
  // Check Follow-Up Agents
  // ──────────────────────────────────────────────────────────────

  const checkFollowUpAgents = useCallback((userId: string) => {
    return orchestratorRef.current.checkFollowUpAgents(userId);
  }, []);

  // ──────────────────────────────────────────────────────────────
  // Check Intervention
  // ──────────────────────────────────────────────────────────────

  const checkIntervention = useCallback((userId: string) => {
    return orchestratorRef.current.checkIntervention(userId);
  }, []);

  // ──────────────────────────────────────────────────────────────
  // Audio Controls
  // ──────────────────────────────────────────────────────────────

  const initializeAudio = useCallback(async () => {
    const success = await audioEngineRef.current.initialize();
    setIsAudioInitialized(success);
    return success;
  }, []);

  const playAudio = useCallback(async () => {
    if (!isAudioInitialized) {
      await initializeAudio();
    }

    if (sonicConfig) {
      await audioEngineRef.current.play(sonicConfig);
      setIsAudioPlaying(true);
    }
  }, [isAudioInitialized, sonicConfig, initializeAudio]);

  const stopAudio = useCallback(async () => {
    await audioEngineRef.current.stop();
    setIsAudioPlaying(false);
  }, []);

  const setAudioVolume = useCallback((volume: number) => {
    audioEngineRef.current.setVolume(volume);
    setAudioVolumeState(volume);
  }, []);

  const playInsightChime = useCallback(async (intensity: number = 1.0) => {
    if (!isAudioInitialized) {
      await initializeAudio();
    }
    await audioEngineRef.current.playInsightChime(intensity);
  }, [isAudioInitialized, initializeAudio]);

  // ──────────────────────────────────────────────────────────────
  // Reset
  // ──────────────────────────────────────────────────────────────

  const reset = useCallback((userId?: string) => {
    orchestratorRef.current.reset(userId);
    if (!userId) {
      setFieldState(null);
      setSonicConfig(null);
    }
  }, []);

  // ──────────────────────────────────────────────────────────────
  // Sonic Update Loop (when playing)
  // ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isAudioPlaying) return;

    const interval = setInterval(() => {
      const sonic = orchestratorRef.current.getSonicConfig();
      if (sonic) {
        setSonicConfig(sonic);
        audioEngineRef.current.play(sonic);
      }
    }, 1000);  // Update every second

    return () => clearInterval(interval);
  }, [isAudioPlaying]);

  // ──────────────────────────────────────────────────────────────
  // Return State & Actions
  // ──────────────────────────────────────────────────────────────

  return {
    state: {
      fieldState,
      sonicConfig,
      isAudioInitialized,
      isAudioPlaying,
      audioVolume,
    },
    actions: {
      updateConversation,
      checkFollowUpAgents,
      checkIntervention,
      initializeAudio,
      playAudio,
      stopAudio,
      setAudioVolume,
      playInsightChime,
      reset,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// Specialized Hooks
// ═══════════════════════════════════════════════════════════════

/**
 * Hook specifically for field visualization.
 */
export function useFieldState(userId: string) {
  const { state } = useResonanceProtocol();
  return state.fieldState;
}

/**
 * Hook for audio controls only.
 */
export function useResonanceAudio() {
  const { state, actions } = useResonanceProtocol();

  return {
    isInitialized: state.isAudioInitialized,
    isPlaying: state.isAudioPlaying,
    volume: state.audioVolume,
    config: state.sonicConfig,
    initialize: actions.initializeAudio,
    play: actions.playAudio,
    stop: actions.stopAudio,
    setVolume: actions.setAudioVolume,
    playChime: actions.playInsightChime,
  };
}

/**
 * Hook for intervention checking.
 */
export function useInterventionCheck(userId: string) {
  const { actions } = useResonanceProtocol();
  const [intervention, setIntervention] = useState<any>(null);

  useEffect(() => {
    const result = actions.checkIntervention(userId);
    setIntervention(result);
  }, [userId, actions]);

  return intervention;
}
