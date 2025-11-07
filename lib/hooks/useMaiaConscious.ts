'use client';

/**
 * useMaiaConscious - React Hook for MAIA Conscious WebRTC
 *
 * Combines WebRTC audio quality with Hybrid consciousness features
 * Provides natural voice + pause/resume + nudges + elemental awareness
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { MaiaConsciousWebRTC, type VoiceState, type ElementalPreset } from '@/lib/voice/MaiaConsciousWebRTC';

export interface UseMaiaConsciousOptions {
  sessionId: string;
  userId: string;
  userName?: string;
  enableNudges?: boolean;
  nudgeIntervalMs?: number;
  onStateChange?: (state: VoiceState) => void;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onResponse?: (text: string) => void;
  onError?: (error: Error) => void;
  elementalPreset?: ElementalPreset;
}

export interface MaiaConsciousState {
  isConnected: boolean;
  voiceState: VoiceState;
  isListening: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  elementalPreset?: ElementalPreset;
}

export function useMaiaConscious(options: UseMaiaConsciousOptions) {
  const {
    sessionId,
    userId,
    userName,
    enableNudges = true,
    nudgeIntervalMs = 30000,
    onStateChange,
    onTranscript,
    onResponse,
    onError,
    elementalPreset
  } = options;

  // Core state
  const [state, setState] = useState<MaiaConsciousState>({
    isConnected: false,
    voiceState: 'idle',
    isListening: false,
    isSpeaking: false,
    isPaused: false,
    elementalPreset
  });

  // Refs
  const systemRef = useRef<MaiaConsciousWebRTC | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  /**
   * Initialize the consciousness system
   */
  const initialize = useCallback(async () => {
    if (systemRef.current) {
      console.log('🌀 [useMaiaConscious] Already initialized');
      return;
    }

    try {
      console.log('🌀 [useMaiaConscious] Initializing...');

      const system = new MaiaConsciousWebRTC({
        sessionId,
        userId,
        userName,
        enableNudges,
        nudgeIntervalMs,
        elementalPreset
      });

      // Set up event handlers
      system.on('stateChange', (newState) => {
        setState(prev => ({
          ...prev,
          voiceState: newState,
          isListening: newState === 'listening',
          isSpeaking: newState === 'speaking',
          isPaused: newState === 'paused'
        }));
        onStateChange?.(newState);
      });

      system.on('transcript', (transcript, isFinal) => {
        onTranscript?.(transcript, isFinal);
      });

      system.on('response', (text) => {
        onResponse?.(text);
      });

      system.on('error', (error) => {
        console.error('🌀 [useMaiaConscious] Error:', error);
        onError?.(error);
      });

      // Connect to WebRTC
      await system.connect();

      systemRef.current = system;

      setState(prev => ({
        ...prev,
        isConnected: true
      }));

      console.log('✅ [useMaiaConscious] Initialized and connected');
    } catch (error) {
      console.error('❌ [useMaiaConscious] Initialization failed:', error);
      onError?.(error as Error);

      // Attempt reconnect after delay
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('🔄 [useMaiaConscious] Attempting reconnect...');
        initialize();
      }, 3000);
    }
  }, [sessionId, userId, userName, enableNudges, nudgeIntervalMs, elementalPreset, onStateChange, onTranscript, onResponse, onError]);

  /**
   * Disconnect and cleanup
   */
  const disconnect = useCallback(() => {
    if (!systemRef.current) return;

    console.log('🌀 [useMaiaConscious] Disconnecting...');

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    systemRef.current.disconnect();
    systemRef.current = null;

    setState({
      isConnected: false,
      voiceState: 'idle',
      isListening: false,
      isSpeaking: false,
      isPaused: false,
      elementalPreset
    });

    console.log('✅ [useMaiaConscious] Disconnected');
  }, [elementalPreset]);

  /**
   * Pause MAIA (voice command or manual)
   */
  const pause = useCallback(() => {
    if (!systemRef.current) return;
    systemRef.current.pause();
  }, []);

  /**
   * Resume MAIA
   */
  const resume = useCallback(() => {
    if (!systemRef.current) return;
    systemRef.current.resume();
  }, []);

  /**
   * Send a text message (injected as if spoken)
   */
  const sendMessage = useCallback((text: string) => {
    if (!systemRef.current) return;
    systemRef.current.injectMessage(text);
  }, []);

  /**
   * Change elemental preset (modulates voice/consciousness)
   */
  const setElementalPreset = useCallback((preset?: ElementalPreset) => {
    if (!systemRef.current) return;
    systemRef.current.setElementalPreset(preset);
    setState(prev => ({ ...prev, elementalPreset: preset }));
  }, []);

  /**
   * Get current elemental preset
   */
  const getElementalPreset = useCallback((): ElementalPreset | undefined => {
    return systemRef.current?.getElementalPreset();
  }, []);

  /**
   * Manual interrupt (stop MAIA speaking)
   */
  const interrupt = useCallback(() => {
    if (!systemRef.current) return;
    systemRef.current.interrupt();
  }, []);

  // Initialize on mount
  useEffect(() => {
    initialize();

    return () => {
      disconnect();
    };
  }, [initialize, disconnect]);

  return {
    // State
    state,
    isConnected: state.isConnected,
    voiceState: state.voiceState,
    isListening: state.isListening,
    isSpeaking: state.isSpeaking,
    isPaused: state.isPaused,
    elementalPreset: state.elementalPreset,

    // Actions
    initialize,
    disconnect,
    pause,
    resume,
    sendMessage,
    setElementalPreset,
    getElementalPreset,
    interrupt,

    // Direct system access (advanced use)
    system: systemRef.current
  };
}
