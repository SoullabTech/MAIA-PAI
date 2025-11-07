'use client';

import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { useMaiaConscious } from '@/lib/hooks/useMaiaConscious';

/**
 * MaiaConsciousConversation - Enhanced Oracle Voice Component
 *
 * Combines:
 * - Natural voice quality (OpenAI WebRTC Realtime API)
 * - Consciousness management (pause/resume, nudges, state tracking)
 * - Elemental integration (Fire/Water/Earth/Air/Aether)
 * - Voice commands (automatic pause/resume detection)
 *
 * Philosophy: AI serves human consciousness, not replaces it.
 * The machine does machine work. Humans do soul work.
 */

export interface MaiaConsciousConversationProps {
  onTranscript?: (text: string, isUser: boolean) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  onConsciousStateChange?: (state: string) => void;
  autoStart?: boolean;
  userId?: string;
  element?: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  conversationStyle?: 'natural' | 'consciousness' | 'adaptive';
  voice?: 'shimmer' | 'alloy' | 'echo' | 'ash' | 'ballad' | 'coral' | 'sage' | 'verse';
  enableVoiceCommands?: boolean;
  enableNudges?: boolean;
  nudgeThresholdSeconds?: number;
}

export interface MaiaConsciousConversationRef {
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  pause: () => void;
  resume: () => void;
  sendText: (text: string) => void;
  cancelResponse: () => void;
  setNudgesEnabled: (enabled: boolean) => void;
  isListening: boolean;
  isConnected: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  consciousState: string;
}

export const MaiaConsciousConversation = forwardRef<
  MaiaConsciousConversationRef,
  MaiaConsciousConversationProps
>((props, ref) => {
  const {
    onTranscript,
    onRecordingStateChange,
    onConsciousStateChange,
    autoStart = false,
    userId = 'anonymous',
    element = 'aether',
    conversationStyle = 'natural',
    voice = 'shimmer',
    enableVoiceCommands = true,
    enableNudges = false,
    nudgeThresholdSeconds = 45,
  } = props;

  // Use the conscious voice hook
  const {
    isConnected,
    consciousState,
    isListening,
    isSpeaking,
    isPaused,
    messages,
    error,
    connect,
    disconnect,
    pause,
    resume,
    sendText,
    cancelResponse,
    setNudgesEnabled,
    nudgesEnabled,
  } = useMaiaConscious({
    userId,
    element,
    conversationStyle,
    voice,
    enableVoiceCommands,
    enableNudges,
    nudgeThresholdSeconds,
    autoConnect: autoStart,
    onTranscript: (text: string, isUser: boolean) => {
      onTranscript?.(text, isUser);
    },
    onNudge: (message: string) => {
      console.log('👋 MAIA nudge:', message);
    },
  });

  // Expose control methods to parent via ref
  useImperativeHandle(ref, () => ({
    startListening: () => {
      console.log('🎙️ [MaiaConsciousConversation] startListening called');
      if (!isConnected) {
        connect();
      }
    },
    stopListening: () => {
      console.log('🛑 [MaiaConsciousConversation] stopListening called');
      if (isConnected) {
        disconnect();
      }
    },
    toggleListening: () => {
      console.log('🔄 [MaiaConsciousConversation] toggleListening - isConnected:', isConnected);
      if (isConnected) {
        disconnect();
      } else {
        connect();
      }
    },
    pause,
    resume,
    sendText,
    cancelResponse,
    setNudgesEnabled,
    isListening,
    isConnected,
    isSpeaking,
    isPaused,
    consciousState,
  }));

  // Notify parent of recording state changes
  useEffect(() => {
    if (onRecordingStateChange) {
      onRecordingStateChange(isListening);
    }
  }, [isListening, onRecordingStateChange]);

  // Notify parent of consciousness state changes
  useEffect(() => {
    if (onConsciousStateChange) {
      onConsciousStateChange(consciousState);
    }
  }, [consciousState, onConsciousStateChange]);

  // Log errors
  useEffect(() => {
    if (error) {
      console.error('❌ [MaiaConsciousConversation] Error:', error);
    }
  }, [error]);

  // Log consciousness state transitions
  useEffect(() => {
    console.log(`🎭 [MaiaConsciousConversation] Consciousness state: ${consciousState}`);
  }, [consciousState]);

  // This component is headless - no UI, just consciousness management
  // The parent component (oracle page) handles all UI
  return null;
});

MaiaConsciousConversation.displayName = 'MaiaConsciousConversation';
