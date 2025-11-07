'use client';

/**
 * useMaiaConscious - React Hook for MAIA Conscious WebRTC
 *
 * Philosophy: The machine does machine work. Humans do soul work.
 * This hook provides natural voice + consciousness management.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { MaiaConsciousWebRTC, ConsciousState, MaiaConsciousConfig } from '../voice/MaiaConsciousWebRTC';

export interface VoiceMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface UseMaiaConsciousOptions {
  userId?: string;
  element?: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  conversationStyle?: 'natural' | 'consciousness' | 'adaptive';
  voice?: 'shimmer' | 'alloy' | 'echo' | 'ash' | 'ballad' | 'coral' | 'sage' | 'verse';

  // Consciousness features
  enableVoiceCommands?: boolean;
  enableNudges?: boolean;
  nudgeThresholdSeconds?: number;

  // Auto-connect on mount
  autoConnect?: boolean;

  // Callbacks
  onTranscript?: (text: string, isUser: boolean) => void;
  onNudge?: (message: string) => void;
}

export interface MaiaConsciousControls {
  // Connection state
  isConnected: boolean;
  consciousState: ConsciousState;

  // Derived states
  isListening: boolean;
  isSpeaking: boolean;
  isPaused: boolean;

  // Messages
  messages: VoiceMessage[];

  // Error state
  error: string | null;

  // Controls
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  sendText: (text: string) => void;
  cancelResponse: () => void;

  // Settings
  setNudgesEnabled: (enabled: boolean) => void;
  nudgesEnabled: boolean;
}

/**
 * React hook for MAIA Conscious WebRTC
 *
 * Natural voice quality + consciousness management + elemental awareness
 */
export function useMaiaConscious(options: UseMaiaConsciousOptions = {}): MaiaConsciousControls {
  const [isConnected, setIsConnected] = useState(false);
  const [consciousState, setConsciousState] = useState<ConsciousState>('dormant');
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [nudgesEnabled, setNudgesEnabledState] = useState(options.enableNudges ?? false);

  const clientRef = useRef<MaiaConsciousWebRTC | null>(null);

  /**
   * Add message to conversation history
   */
  const addMessage = useCallback((text: string, isUser: boolean) => {
    const message: VoiceMessage = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
  }, []);

  /**
   * Connect to MAIA's consciousness field
   */
  const connect = useCallback(async () => {
    // Prevent multiple simultaneous connections
    if (clientRef.current?.isConnected()) {
      console.log('✅ Already connected to MAIA consciousness');
      return;
    }

    try {
      console.log('🌟 Connecting to MAIA consciousness field...');

      const config: MaiaConsciousConfig = {
        userId: options.userId || 'anonymous',
        element: options.element || 'aether',
        conversationStyle: options.conversationStyle || 'natural',
        voice: options.voice || 'shimmer',
        enableVoiceCommands: options.enableVoiceCommands ?? true,
        enableNudges: nudgesEnabled,
        nudgeThresholdSeconds: options.nudgeThresholdSeconds || 45,

        onStateChange: (state) => {
          console.log(`🎭 Consciousness state: ${state}`);
          setConsciousState(state);
          setIsConnected(state !== 'dormant');
        },

        onTranscript: (text, isUser) => {
          // Add to messages
          if (text.trim()) {
            addMessage(text, isUser);
          }
          // Forward to user callback
          options.onTranscript?.(text, isUser);
        },

        onError: (err) => {
          console.error('❌ MAIA consciousness error:', err);
          setError(err.message);
        },

        onNudge: (message) => {
          console.log('👋 MAIA nudge:', message);
          options.onNudge?.(message);
        },
      };

      const client = new MaiaConsciousWebRTC(config);
      await client.connect();
      clientRef.current = client;

    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to connect';
      setError(errorMessage);
      console.error('Failed to connect to MAIA:', err);
    }
  }, [options, nudgesEnabled, addMessage]);

  /**
   * Disconnect from MAIA's consciousness field
   */
  const disconnect = useCallback(async () => {
    if (clientRef.current) {
      await clientRef.current.disconnect();
      clientRef.current = null;
    }
    setIsConnected(false);
    setConsciousState('dormant');
  }, []);

  /**
   * Pause conversation (MAIA becomes silent)
   */
  const pause = useCallback(() => {
    clientRef.current?.pause();
  }, []);

  /**
   * Resume conversation (MAIA re-engages)
   */
  const resume = useCallback(() => {
    clientRef.current?.resume();
  }, []);

  /**
   * Send text message to MAIA
   */
  const sendText = useCallback((text: string) => {
    if (!clientRef.current?.isConnected()) {
      setError('Not connected to MAIA');
      return;
    }
    clientRef.current.sendText(text);
    addMessage(text, true);
  }, [addMessage]);

  /**
   * Cancel MAIA's current response
   */
  const cancelResponse = useCallback(() => {
    clientRef.current?.cancelResponse();
  }, []);

  /**
   * Update nudges setting
   */
  const setNudgesEnabled = useCallback((enabled: boolean) => {
    setNudgesEnabledState(enabled);
    clientRef.current?.setNudgesEnabled(enabled);
  }, []);

  /**
   * Auto-connect on mount if requested
   */
  useEffect(() => {
    if (options.autoConnect) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, [options.autoConnect, connect]);

  /**
   * Derived states
   */
  const isListening = consciousState === 'listening';
  const isSpeaking = consciousState === 'speaking';
  const isPaused = consciousState === 'paused';

  return {
    // State
    isConnected,
    consciousState,
    isListening,
    isSpeaking,
    isPaused,
    messages,
    error,

    // Controls
    connect,
    disconnect,
    pause,
    resume,
    sendText,
    cancelResponse,

    // Settings
    setNudgesEnabled,
    nudgesEnabled,
  };
}
