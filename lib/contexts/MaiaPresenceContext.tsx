/**
 * 🎙️ MAIA Presence Context
 *
 * Global voice state that persists across all pages
 * Makes MAIA available as ambient companion, not just chat interface
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { RealtimeVoiceService } from '@/lib/voice/RealtimeVoiceService';

interface MaiaPresenceState {
  // Connection state
  isConnected: boolean;
  isInitializing: boolean;
  error: string | null;

  // Voice state
  isListening: boolean;
  isSpeaking: boolean;
  currentElement: 'fire' | 'water' | 'earth' | 'air' | 'aether';

  // Ambient mode
  ambientMode: boolean; // Voice active across all pages
  witnessMode: boolean; // MAIA proactively offers reflections
  voiceOnly: boolean;   // Minimal UI, just voice
}

interface MaiaPresenceActions {
  // Connection
  connect: () => Promise<void>;
  disconnect: () => void;

  // Voice control
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => Promise<void>;

  // Mode control
  toggleAmbientMode: () => void;
  toggleWitnessMode: () => void;
  toggleVoiceOnly: () => void;

  // Context
  setCurrentPage: (page: string) => void;
  notifyActivity: (activity: any) => void;
}

type MaiaPresenceContextValue = MaiaPresenceState & MaiaPresenceActions;

const MaiaPresenceContext = createContext<MaiaPresenceContextValue | null>(null);

export function MaiaPresenceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MaiaPresenceState>({
    isConnected: false,
    isInitializing: false,
    error: null,
    isListening: false,
    isSpeaking: false,
    currentElement: 'water',
    ambientMode: false,
    witnessMode: false,
    voiceOnly: false
  });

  const voiceServiceRef = useRef<RealtimeVoiceService | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const currentPageRef = useRef<string>('');

  /**
   * Initialize voice service
   */
  const connect = useCallback(async () => {
    if (state.isConnected || state.isInitializing) return;

    setState(prev => ({ ...prev, isInitializing: true, error: null }));

    try {
      // Get API key from environment
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      // Create service
      voiceServiceRef.current = new RealtimeVoiceService({
        apiKey,
        voice: 'sage', // Warm, wise voice for MAIA
        temperature: 0.8
      });

      // Subscribe to events
      voiceServiceRef.current.on('input_audio_buffer.speech_started', () => {
        setState(prev => ({ ...prev, isListening: true }));
      });

      voiceServiceRef.current.on('input_audio_buffer.speech_stopped', () => {
        setState(prev => ({ ...prev, isListening: false }));
      });

      voiceServiceRef.current.on('response.audio.delta', () => {
        setState(prev => ({ ...prev, isSpeaking: true }));
      });

      voiceServiceRef.current.on('response.audio.done', () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
      });

      voiceServiceRef.current.on('error', (event: any) => {
        console.error('🎙️ Voice error:', event.error);
        setState(prev => ({ ...prev, error: event.error.message }));
      });

      // Initialize connection
      await voiceServiceRef.current.initialize();

      setState(prev => ({
        ...prev,
        isConnected: true,
        isInitializing: false
      }));

      console.log('🎙️ MAIA presence connected');
    } catch (error: any) {
      console.error('🎙️ Failed to connect MAIA presence:', error);
      setState(prev => ({
        ...prev,
        isConnected: false,
        isInitializing: false,
        error: error.message
      }));
    }
  }, [state.isConnected, state.isInitializing]);

  /**
   * Disconnect voice service
   */
  const disconnect = useCallback(() => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }

    if (voiceServiceRef.current) {
      voiceServiceRef.current.disconnect();
      voiceServiceRef.current = null;
    }

    setState(prev => ({
      ...prev,
      isConnected: false,
      isListening: false,
      isSpeaking: false
    }));

    console.log('🎙️ MAIA presence disconnected');
  }, []);

  /**
   * Start listening (capture microphone)
   */
  const startListening = useCallback(async () => {
    if (!voiceServiceRef.current || !state.isConnected) {
      console.warn('🎙️ Cannot start listening - not connected');
      return;
    }

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 24000,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      audioStreamRef.current = stream;

      // Create audio context and stream to API
      const audioContext = new AudioContext({ sampleRate: 24000 });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const int16Data = new Int16Array(inputData.length);

        // Convert float32 to int16
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Stream to voice service
        voiceServiceRef.current?.streamAudioInput(int16Data.buffer);
      };

      setState(prev => ({ ...prev, isListening: true }));
      console.log('🎙️ MAIA listening...');
    } catch (error) {
      console.error('🎙️ Failed to start listening:', error);
      setState(prev => ({ ...prev, error: 'Microphone access denied' }));
    }
  }, [state.isConnected]);

  /**
   * Stop listening
   */
  const stopListening = useCallback(() => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }

    setState(prev => ({ ...prev, isListening: false }));
    console.log('🎙️ MAIA stopped listening');
  }, []);

  /**
   * Speak text (for manual triggering)
   */
  const speak = useCallback(async (text: string) => {
    if (!voiceServiceRef.current || !state.isConnected) {
      console.warn('🎙️ Cannot speak - not connected');
      return;
    }

    await voiceServiceRef.current.sendTextInput(text);
  }, [state.isConnected]);

  /**
   * Toggle ambient mode
   */
  const toggleAmbientMode = useCallback(() => {
    setState(prev => {
      const newAmbientMode = !prev.ambientMode;

      // When enabling ambient mode, connect if not connected
      if (newAmbientMode && !prev.isConnected) {
        connect();
      }

      // Save to localStorage
      localStorage.setItem('maia_ambient_mode', String(newAmbientMode));

      return { ...prev, ambientMode: newAmbientMode };
    });
  }, [connect]);

  /**
   * Toggle witness mode
   */
  const toggleWitnessMode = useCallback(() => {
    setState(prev => {
      const newWitnessMode = !prev.witnessMode;
      localStorage.setItem('maia_witness_mode', String(newWitnessMode));
      return { ...prev, witnessMode: newWitnessMode };
    });
  }, []);

  /**
   * Toggle voice-only mode
   */
  const toggleVoiceOnly = useCallback(() => {
    setState(prev => {
      const newVoiceOnly = !prev.voiceOnly;
      localStorage.setItem('maia_voice_only', String(newVoiceOnly));
      return { ...prev, voiceOnly: newVoiceOnly };
    });
  }, []);

  /**
   * Set current page (for context awareness)
   */
  const setCurrentPage = useCallback((page: string) => {
    currentPageRef.current = page;
  }, []);

  /**
   * Notify activity (for witness mode)
   */
  const notifyActivity = useCallback((activity: any) => {
    // TODO: Integrate with WitnessEngine
    console.log('🎙️ Activity:', activity);
  }, []);

  /**
   * Load saved preferences on mount
   */
  useEffect(() => {
    const savedAmbient = localStorage.getItem('maia_ambient_mode') === 'true';
    const savedWitness = localStorage.getItem('maia_witness_mode') === 'true';
    const savedVoiceOnly = localStorage.getItem('maia_voice_only') === 'true';

    setState(prev => ({
      ...prev,
      ambientMode: savedAmbient,
      witnessMode: savedWitness,
      voiceOnly: savedVoiceOnly
    }));

    // Auto-connect if ambient mode was enabled
    if (savedAmbient) {
      connect();
    }
  }, [connect]);

  /**
   * Cleanup on unmount (only when app closes, not page navigation)
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      disconnect();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [disconnect]);

  const value: MaiaPresenceContextValue = {
    ...state,
    connect,
    disconnect,
    startListening,
    stopListening,
    speak,
    toggleAmbientMode,
    toggleWitnessMode,
    toggleVoiceOnly,
    setCurrentPage,
    notifyActivity
  };

  return (
    <MaiaPresenceContext.Provider value={value}>
      {children}
    </MaiaPresenceContext.Provider>
  );
}

/**
 * Hook to use MAIA presence
 */
export function useMaiaPresence() {
  const context = useContext(MaiaPresenceContext);
  if (!context) {
    throw new Error('useMaiaPresence must be used within MaiaPresenceProvider');
  }
  return context;
}
