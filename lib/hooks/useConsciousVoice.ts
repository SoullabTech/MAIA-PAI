'use client';

/**
 * useConsciousVoice - Simple hook for conscious voice features
 *
 * Adds pause/resume/nudges to existing voice system
 * Lightweight wrapper - doesn't replace WebSpeech or WebRTC
 */

import { useRef, useCallback } from 'react';
import type { ConsciousContinuousConversationRef, VoiceState, ElementalPreset } from '@/components/voice/ConsciousContinuousConversation';

export interface UseConsciousVoiceReturn {
  voiceRef: React.RefObject<ConsciousContinuousConversationRef>;
  pause: () => void;
  resume: () => void;
  setElementalPreset: (preset?: ElementalPreset) => void;
  getState: () => VoiceState | undefined;
}

export function useConsciousVoice(): UseConsciousVoiceReturn {
  const voiceRef = useRef<ConsciousContinuousConversationRef>(null);

  const pause = useCallback(() => {
    voiceRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    voiceRef.current?.resume();
  }, []);

  const setElementalPreset = useCallback((preset?: ElementalPreset) => {
    voiceRef.current?.setElementalPreset(preset);
  }, []);

  const getState = useCallback((): VoiceState | undefined => {
    return voiceRef.current?.getState();
  }, []);

  return {
    voiceRef,
    pause,
    resume,
    setElementalPreset,
    getState
  };
}
