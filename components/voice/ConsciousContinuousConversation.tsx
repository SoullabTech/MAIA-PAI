'use client';

/**
 * Conscious Continuous Conversation - Enhanced WebSpeech with Consciousness
 *
 * Wraps ContinuousConversation with:
 * - Voice commands (pause/resume detection)
 * - Nudge system (proactive engagement)
 * - State awareness (listening/speaking/paused)
 * - Elemental integration (Fire/Water/Earth/Air/Aether modulation)
 *
 * Keeps the working WebSpeech API, adds consciousness layer
 */

import React, { useRef, useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { ContinuousConversation, ContinuousConversationRef } from '../../apps/web/components/voice/ContinuousConversation';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'paused';
export type ElementalPreset = 'fire' | 'water' | 'earth' | 'air' | 'aether';

interface ConsciousContinuousConversationProps {
  onTranscript: (text: string) => void;
  onInterimTranscript?: (text: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  onAudioLevelChange?: (amplitude: number, isSpeaking: boolean) => void;
  onStateChange?: (state: VoiceState) => void;
  onNudge?: () => void;
  isProcessing?: boolean;
  isSpeaking?: boolean;
  autoStart?: boolean;
  silenceThreshold?: number;
  vadSensitivity?: number;
  enableNudges?: boolean;
  nudgeIntervalMs?: number;
  elementalPreset?: ElementalPreset;
}

export interface ConsciousContinuousConversationRef extends ContinuousConversationRef {
  pause: () => void;
  resume: () => void;
  getState: () => VoiceState;
  setElementalPreset: (preset?: ElementalPreset) => void;
}

export const ConsciousContinuousConversation = forwardRef<ConsciousContinuousConversationRef, ConsciousContinuousConversationProps>((props, ref) => {
  const {
    onTranscript,
    onInterimTranscript,
    onRecordingStateChange,
    onAudioLevelChange,
    onStateChange,
    onNudge,
    isProcessing = false,
    isSpeaking = false,
    autoStart = false,
    silenceThreshold = 6000,
    vadSensitivity = 0.3,
    enableNudges = true,
    nudgeIntervalMs = 30000,
    elementalPreset
  } = props;

  // State
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [isPaused, setIsPaused] = useState(false);
  const [currentElementalPreset, setCurrentElementalPreset] = useState<ElementalPreset | undefined>(elementalPreset);

  // Refs
  const conversationRef = useRef<ContinuousConversationRef>(null);
  const nudgeTimerRef = useRef<NodeJS.Timeout>();
  const lastInteractionTimeRef = useRef<number>(Date.now());

  /**
   * Voice command detection
   */
  const detectVoiceCommand = useCallback((text: string): 'pause' | 'resume' | null => {
    const lowerText = text.toLowerCase().trim();

    // Pause commands
    if (lowerText.includes('pause maia') ||
        lowerText.includes('maia pause') ||
        lowerText === 'pause') {
      return 'pause';
    }

    // Resume commands
    if (lowerText.includes('resume') ||
        lowerText.includes("i'm ready") ||
        lowerText.includes('continue') ||
        lowerText.includes('maia') && (lowerText.includes('ready') || lowerText.includes('start'))) {
      return 'resume';
    }

    return null;
  }, []);

  /**
   * Handle transcript with voice command detection
   */
  const handleTranscript = useCallback((text: string) => {
    lastInteractionTimeRef.current = Date.now();

    // Check for voice commands
    const command = detectVoiceCommand(text);

    if (command === 'pause') {
      console.log('🎯 [Conscious] Voice command detected: PAUSE');
      pause();
      return; // Don't pass "pause maia" to conversation
    }

    if (command === 'resume') {
      console.log('🎯 [Conscious] Voice command detected: RESUME');
      resume();
      return; // Don't pass "resume" to conversation
    }

    // Pass to parent if not paused
    if (!isPaused) {
      onTranscript(text);
    }
  }, [isPaused, detectVoiceCommand, onTranscript]);

  /**
   * Update voice state
   */
  const updateState = useCallback((newState: VoiceState) => {
    setVoiceState(newState);
    onStateChange?.(newState);
  }, [onStateChange]);

  /**
   * Pause (stop listening, enter paused state)
   */
  const pause = useCallback(() => {
    console.log('🌀 [Conscious] Pausing...');
    setIsPaused(true);
    conversationRef.current?.stopListening();
    updateState('paused');

    // Stop nudge timer when paused
    if (nudgeTimerRef.current) {
      clearInterval(nudgeTimerRef.current);
    }
  }, [updateState]);

  /**
   * Resume (restart listening)
   */
  const resume = useCallback(() => {
    console.log('🌀 [Conscious] Resuming...');
    setIsPaused(false);
    conversationRef.current?.startListening();
    updateState('listening');
    lastInteractionTimeRef.current = Date.now();

    // Restart nudge timer when resumed
    startNudgeTimer();
  }, [updateState]);

  /**
   * Get current state
   */
  const getState = useCallback((): VoiceState => {
    return voiceState;
  }, [voiceState]);

  /**
   * Set elemental preset
   */
  const setElementalPresetFn = useCallback((preset?: ElementalPreset) => {
    console.log('🌀 [Conscious] Setting elemental preset:', preset);
    setCurrentElementalPreset(preset);
    // Elemental modulation can be applied to voice params here
  }, []);

  /**
   * Nudge system - proactive engagement when user is silent
   */
  const startNudgeTimer = useCallback(() => {
    if (!enableNudges) return;

    // Clear existing timer
    if (nudgeTimerRef.current) {
      clearInterval(nudgeTimerRef.current);
    }

    // Check for silence periodically
    nudgeTimerRef.current = setInterval(() => {
      const timeSinceInteraction = Date.now() - lastInteractionTimeRef.current;

      // If user has been silent for nudgeIntervalMs and not paused
      if (timeSinceInteraction >= nudgeIntervalMs && !isPaused && voiceState === 'listening') {
        console.log('🌀 [Conscious] Nudging user (silence detected)');
        onNudge?.();
        lastInteractionTimeRef.current = Date.now(); // Reset to avoid rapid nudges
      }
    }, 5000); // Check every 5 seconds
  }, [enableNudges, nudgeIntervalMs, isPaused, voiceState, onNudge]);

  /**
   * Track processing state
   */
  useEffect(() => {
    if (isProcessing) {
      updateState('processing');
    }
  }, [isProcessing, updateState]);

  /**
   * Track speaking state
   */
  useEffect(() => {
    if (isSpeaking) {
      updateState('speaking');
      lastInteractionTimeRef.current = Date.now(); // Reset on MAIA speaking
    } else if (voiceState === 'speaking') {
      // When MAIA stops speaking, return to listening (if not paused)
      updateState(isPaused ? 'paused' : 'listening');
    }
  }, [isSpeaking, voiceState, isPaused, updateState]);

  /**
   * Initialize nudge system
   */
  useEffect(() => {
    if (autoStart && !isPaused) {
      startNudgeTimer();
    }

    return () => {
      if (nudgeTimerRef.current) {
        clearInterval(nudgeTimerRef.current);
      }
    };
  }, [autoStart, isPaused, startNudgeTimer]);

  /**
   * Expose methods via ref
   */
  useImperativeHandle(ref, () => ({
    startListening: () => conversationRef.current?.startListening(),
    stopListening: () => conversationRef.current?.stopListening(),
    toggleListening: () => conversationRef.current?.toggleListening(),
    extendRecording: () => conversationRef.current?.extendRecording(),
    get isListening() { return conversationRef.current?.isListening || false; },
    get isRecording() { return conversationRef.current?.isRecording || false; },
    pause,
    resume,
    getState,
    setElementalPreset: setElementalPresetFn
  }));

  return (
    <ContinuousConversation
      ref={conversationRef}
      onTranscript={handleTranscript}
      onInterimTranscript={onInterimTranscript}
      onRecordingStateChange={onRecordingStateChange}
      onAudioLevelChange={onAudioLevelChange}
      isProcessing={isProcessing}
      isSpeaking={isSpeaking}
      autoStart={autoStart && !isPaused}
      silenceThreshold={silenceThreshold}
      vadSensitivity={vadSensitivity}
    />
  );
});

ConsciousContinuousConversation.displayName = 'ConsciousContinuousConversation';
