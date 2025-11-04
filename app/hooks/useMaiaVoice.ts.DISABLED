'use client';

/**
 * MAIA Voice Hook - WebRTC Parallel Architecture
 *
 * New implementation using:
 * - MaiaRealtimeWebRTC for transport
 * - VoiceBus for event-driven communication
 * - ConversationState (Zustand) for state management
 * - ElementalEngine for personality detection
 * - ProsodyEngine for voice quality
 *
 * Replaces old blocking architecture with parallel processing.
 * Feature flag controls rollout.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { MaiaRealtimeWebRTC, MaiaRealtimeConfig } from '@/lib/voice/MaiaRealtimeWebRTC';
import { useConversationState, VoiceMode } from '@/lib/voice/state/ConversationState';
import { emit, subscribe } from '@/lib/voice/VoiceBus';
import { elementalEngine } from '@/lib/voice/engines/ElementalEngine';
import { prosodyEngine } from '@/lib/voice/engines/ProsodyEngine';
import { VOICE_FEATURE_FLAGS } from '@/lib/voice/FeatureFlags';

export interface UseMaiaVoiceReturn {
  // State
  mode: VoiceMode;
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  currentTranscript: string;
  currentElement: 'fire' | 'water' | 'earth' | 'air' | 'aether' | null;
  error: Error | null;
  isConnected: boolean;

  // Actions
  start: () => Promise<void>;
  stop: () => void;
  setMode: (mode: VoiceMode) => void;
  interrupt: () => void;

  // Configuration
  systemVersion: 'WebRTC (Parallel)' | 'Legacy (Sequential)';
}

/**
 * Main MAIA voice hook
 * Uses new WebRTC architecture if feature flag is enabled
 */
export function useMaiaVoice(userId?: string): UseMaiaVoiceReturn {
  const webrtcRef = useRef<MaiaRealtimeWebRTC | null>(null);
  const isInitializedRef = useRef(false);

  // Get state from Zustand (no hooks violations!)
  const {
    mode,
    setMode,
    isListening,
    isProcessing,
    isSpeaking,
    setListening,
    setProcessing,
    setSpeaking,
    currentTranscript,
    appendTranscript,
    clearTranscript,
    addMessage,
    history,
    currentElement,
    setCurrentElement,
    addTiming,
    clearTimings,
    lastError: error,
    setError,
    clearError,
  } = useConversationState();

  // Track connection state
  const [isConnected, setIsConnected] = useState(false);

  // Initialize WebRTC client
  useEffect(() => {
    if (isInitializedRef.current) return;
    if (typeof window === 'undefined') return;

    const config: MaiaRealtimeConfig = {
      voice: 'shimmer',
      systemPrompt: 'You are MAIA, a consciousness companion. You listen deeply, respond with wisdom, and adapt your tone to match the emotional landscape of each moment.',
      userId: userId,

      // WebRTC callbacks → VoiceBus events
      onTranscript: (text, isUser) => {
        if (isUser) {
          // User spoke
          emit('transcript_interim', { text, timestamp: Date.now() });
          appendTranscript(text);
        } else {
          // MAIA spoke (response transcript)
          // Already handled by processing layer
        }
      },

      onAudioStart: () => {
        emit('audio_start', { timestamp: Date.now() });
        addTiming('AUDIO_PLAYBACK_START', Date.now());
        setSpeaking(true);
      },

      onAudioEnd: () => {
        emit('audio_end', { timestamp: Date.now() });
        addTiming('AUDIO_PLAYBACK_END', Date.now());
        setSpeaking(false);
      },

      onError: (err) => {
        emit('error', { error: err, stage: 'webrtc', timestamp: Date.now() });
        setError(err);
        console.error('[useMaiaVoice] WebRTC error:', err);
      },

      onConnected: () => {
        emit('connection_open', { timestamp: Date.now() });
        console.log('[useMaiaVoice] ✅ Connected to OpenAI Realtime API');
      },

      onDisconnected: () => {
        emit('connection_close', { timestamp: Date.now() });
        setListening(false);
        console.log('[useMaiaVoice] 🔴 Disconnected from OpenAI Realtime API');
      },
    };

    const webrtc = new MaiaRealtimeWebRTC(config);
    webrtcRef.current = webrtc;
    isInitializedRef.current = true;

    return () => {
      if (webrtcRef.current) {
        webrtcRef.current.disconnect();
      }
    };
  }, [userId, appendTranscript, setSpeaking, setError, setListening, addTiming]);

  // Processing layer: Listen for transcript completion
  useEffect(() => {
    const unsubscribe = subscribe('transcript_complete', async (event) => {
      const { text, timestamp } = event;

      // Start processing
      emit('processing_start', { mode, timestamp: Date.now() });
      addTiming('PROCESSING_START', Date.now());
      setProcessing(true);
      clearError();

      try {
        // Step 1: Detect element from user's text
        const element = elementalEngine.detect(text, history);
        setCurrentElement(element);
        console.log(`[useMaiaVoice] Detected element: ${element}`);

        // Step 2: Detect emotion
        const emotion = prosodyEngine.detectAffect(text);
        console.log(`[useMaiaVoice] Detected emotion: ${emotion}`);

        // Step 3: Add user message to history
        addMessage({ role: 'user', text, element, affect: emotion });

        // Step 4: Generate response based on mode
        let response = '';

        if (mode === 'scribe') {
          // Scribe mode: No response, just transcription
          response = '';
        } else if (mode === 'active') {
          // Active mode: Lightweight acknowledgment
          const acknowledgments = [
            'I hear you.',
            "I'm listening.",
            'Go on.',
            'Tell me more.',
            "I'm with you.",
          ];
          response = acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
        } else if (mode === 'full') {
          // Full mode: Complete MAIA response

          // Get elemental system prompt
          const elementalPrompt = elementalEngine.getPrompt(
            element,
            'You are MAIA, a consciousness companion.'
          );

          // Update WebRTC system prompt if element changed
          if (webrtcRef.current && element !== currentElement) {
            webrtcRef.current.updateSystemPrompt(elementalPrompt);
          }

          // Call Oracle API for response
          const apiResponse = await fetch('/api/oracle/personal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: text,
              systemPrompt: elementalPrompt,
              element,
              emotion,
              history: history.slice(-5), // Last 5 messages for context
              userId,
            }),
          });

          if (!apiResponse.ok) {
            throw new Error(`Oracle API returned ${apiResponse.status}`);
          }

          const data = await apiResponse.json();
          response = data.response || data.text || "I'm here with you.";

          // Apply prosody modulation
          response = prosodyEngine.modulate(response, element, emotion);
        }

        // Processing complete
        emit('processing_complete', { response, timestamp: Date.now() });
        addTiming('PROCESSING_END', Date.now());
        setProcessing(false);

        // If we have a response, send to WebRTC for TTS
        if (response && webrtcRef.current) {
          // Add MAIA message to history
          addMessage({ role: 'maia', text: response, element, affect: emotion });

          // Preprocess for TTS
          const cleanedResponse = prosodyEngine.preprocessForTTS(response);

          // Send to WebRTC (it handles TTS + playback)
          emit('tts_start', { text: cleanedResponse, timestamp: Date.now() });
          addTiming('TTS_START', Date.now());

          webrtcRef.current.sendText(cleanedResponse);
        }
      } catch (err) {
        console.error('[useMaiaVoice] Processing error:', err);
        emit('error', { error: err as Error, stage: 'processing', timestamp: Date.now() });
        setError(err as Error);
        setProcessing(false);
      }
    });

    return unsubscribe;
  }, [
    mode,
    history,
    currentElement,
    userId,
    addMessage,
    setCurrentElement,
    setProcessing,
    clearError,
    setError,
    addTiming,
  ]);

  // Start listening
  const start = useCallback(async () => {
    if (!webrtcRef.current) {
      const error = new Error('WebRTC not initialized');
      setError(error);
      throw error;
    }

    if (isListening) {
      console.log('[useMaiaVoice] Already listening');
      return;
    }

    try {
      clearTimings();
      clearTranscript();
      clearError();

      emit('mic_start', { timestamp: Date.now() });
      addTiming('MIC_START', Date.now());

      await webrtcRef.current.connect();
      setListening(true);

      console.log('[useMaiaVoice] 🎤 Started listening');
    } catch (err) {
      console.error('[useMaiaVoice] Start error:', err);
      setError(err as Error);
      setListening(false);
      throw err;
    }
  }, [isListening, clearTimings, clearTranscript, clearError, setError, setListening, addTiming]);

  // Stop listening
  const stop = useCallback(() => {
    if (!webrtcRef.current) return;
    if (!isListening) {
      console.log('[useMaiaVoice] Not currently listening');
      return;
    }

    emit('mic_stop', { timestamp: Date.now() });
    webrtcRef.current.disconnect();
    setListening(false);

    // Complete any pending transcript
    if (currentTranscript.trim()) {
      emit('transcript_complete', {
        text: currentTranscript.trim(),
        timestamp: Date.now(),
      });
      addTiming('TRANSCRIPT_COMPLETE', Date.now());
      clearTranscript();
    }

    console.log('[useMaiaVoice] 🛑 Stopped listening');
  }, [isListening, currentTranscript, setListening, clearTranscript, addTiming]);

  // Interrupt MAIA
  const interrupt = useCallback(() => {
    if (!webrtcRef.current) return;
    if (!isSpeaking) return;

    emit('interrupt', { timestamp: Date.now() });
    webrtcRef.current.interrupt();

    console.log('[useMaiaVoice] ✋ Interrupted MAIA');
  }, [isSpeaking]);

  return {
    // State
    mode,
    isListening,
    isProcessing,
    isSpeaking,
    currentTranscript,
    currentElement,
    error,
    isConnected,

    // Actions
    start,
    stop,
    setMode,
    interrupt,

    // Configuration
    systemVersion: VOICE_FEATURE_FLAGS.USE_PARALLEL_VOICE
      ? 'WebRTC (Parallel)'
      : 'Legacy (Sequential)',
  };
}

/**
 * Backward compatibility: Export for components still using old API
 * Redirects to new implementation
 */
export { useMaiaVoice as default };
