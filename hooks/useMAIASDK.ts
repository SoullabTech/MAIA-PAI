/**
 * useMAIASDK - React Hook for MAIA Sovereign Voice System
 *
 * Drop-in replacement for useMaiaRealtime that uses the SDK instead of WebRTC.
 * Provides the same interface for easy migration.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { MAIARealtimeSDK } from '@/lib/maia-sdk';
import { getAgentConfig } from '@/lib/agent-config';

interface SDKVoiceState {
  isConnected: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
  currentProvider: {
    stt: string;
    llm: string;
    tts: string;
  };
  sessionCost: number;
  error?: string;
}

interface UseMAIASDKOptions {
  /** Voice to use for TTS (e.g., 'maya', 'anthony') */
  voice?: string;
  /** Enable debug logging */
  debug?: boolean;
  /** Auto-start session on mount */
  autoStart?: boolean;
  /** User ID for session tracking */
  userId?: string;
  /** User name for personalization */
  userName?: string;
  /** Conversation mode (not used by SDK, for compatibility) */
  mode?: string;
  /** Callback when user or MAIA transcripts arrive */
  onTranscript?: (text: string, isUser: boolean) => void;
  /** Callback when MAIA starts speaking */
  onAudioStart?: () => void;
  /** Callback when MAIA finishes speaking */
  onAudioEnd?: () => void;
  /** Callback on errors */
  onError?: (error: Error) => void;
  /** Callback when connected */
  onConnected?: () => void;
  /** Callback when disconnected */
  onDisconnected?: () => void;
}

export function useMAIASDK(options: UseMAIASDKOptions = {}) {
  const sdkRef = useRef<MAIARealtimeSDK | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [agentConfig] = useState(() => getAgentConfig());
  const [state, setState] = useState<SDKVoiceState>({
    isConnected: false,
    isConnecting: false,
    isSpeaking: false,
    isListening: false,
    isProcessing: false,
    currentProvider: {
      stt: 'browser-stt',
      llm: 'anthropic',
      tts: 'browser-tts'
    },
    sessionCost: 0
  });

  // Initialize SDK
  useEffect(() => {
    console.log('🚀 [useMAIASDK] Initializing MAIA SDK...');

    try {
      sdkRef.current = new MAIARealtimeSDK({
        providers: [
          // Local Whisper (if available)
          {
            name: 'local-whisper',
            endpoint: process.env.NEXT_PUBLIC_WHISPER_ENDPOINT || 'http://localhost:8001',
            priority: 100,
            capabilities: ['stt'],
            config: { model: 'base.en' }
          },
          // Claude for LLM (already integrated via PersonalOracleAgent!)
          {
            name: 'anthropic',
            endpoint: 'https://api.anthropic.com',
            apiKey: process.env.ANTHROPIC_API_KEY,
            priority: 100,
            capabilities: ['llm'],
            config: {
              model: 'claude-3-5-sonnet-20241022',
              maxTokens: 4096
            }
          },
          // Local XTTS (if available)
          {
            name: 'local-xtts',
            endpoint: process.env.NEXT_PUBLIC_XTTS_ENDPOINT || 'http://localhost:8000',
            priority: 100,
            capabilities: ['tts'],
            config: {
              voice: options.voice || 'maya',
              language: 'en'
            }
          },
          // Browser STT (always available, fallback)
          {
            name: 'browser-stt',
            endpoint: 'browser',
            priority: 50,
            capabilities: ['stt']
          },
          // OpenAI TTS (good quality voice, use until XTTS is trained)
          {
            name: 'openai-tts',
            endpoint: '/api/voice/openai-tts',
            priority: 80,
            capabilities: ['tts'],
            config: {
              voice: options.voice || 'alloy', // Default: Neutral & balanced
              model: 'tts-1'
            }
          },
          // Browser TTS (fallback)
          {
            name: 'browser-tts',
            endpoint: 'browser',
            priority: 50,
            capabilities: ['tts']
          }
        ],
        fallbackChain: ['browser-stt', 'local-whisper', 'openai'],
        costOptimization: true,
        debug: options.debug ?? true
      });

      console.log('✅ [useMAIASDK] SDK initialized successfully');

      // Subscribe to SDK events
      sdkRef.current.on('session.started', (data) => {
        console.log('🎙️ [useMAIASDK] Session started:', data.sessionId);
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          currentProvider: data.providers
        }));
        options.onConnected?.();
      });

      sdkRef.current.on('stt.started', () => {
        console.log('🎤 [useMAIASDK] Speech detection started');
        setState(prev => ({ ...prev, isListening: true }));
      });

      sdkRef.current.on('stt.completed', (data) => {
        console.log('👤 [useMAIASDK] User said:', data.text);
        setState(prev => ({ ...prev, isListening: false, isProcessing: true }));
        options.onTranscript?.(data.text, true); // isUser = true
      });

      sdkRef.current.on('llm.completed', (data) => {
        console.log('🤖 [useMAIASDK] MAIA responds:', data.text.substring(0, 100));
        setState(prev => ({ ...prev, isProcessing: false }));
        options.onTranscript?.(data.text, false); // isUser = false
      });

      sdkRef.current.on('tts.started', () => {
        console.log('🔊 [useMAIASDK] Audio playback started');
        setState(prev => ({ ...prev, isSpeaking: true }));
        options.onAudioStart?.();
      });

      sdkRef.current.on('tts.completed', () => {
        console.log('✅ [useMAIASDK] Audio playback completed');
        setState(prev => ({ ...prev, isSpeaking: false }));
        options.onAudioEnd?.();
      });

      sdkRef.current.on('cost.update', (data) => {
        console.log(`💰 [useMAIASDK] Cost update: +$${data.cost.toFixed(4)} (total: $${data.total.toFixed(4)})`);
        setState(prev => ({ ...prev, sessionCost: data.total }));
      });

      sdkRef.current.on('failover', (data) => {
        console.warn(`🔄 [useMAIASDK] Failover: ${data.from} → ${data.to} (${data.reason})`);
      });

      sdkRef.current.on('error', (error) => {
        console.error('❌ [useMAIASDK] Error:', error);
        setState(prev => ({ ...prev, error: error.message }));
        options.onError?.(error instanceof Error ? error : new Error(String(error)));
      });

    } catch (error) {
      console.error('❌ [useMAIASDK] Failed to initialize SDK:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'SDK initialization failed'
      }));
    }

    // Cleanup on unmount
    return () => {
      if (sdkRef.current) {
        sdkRef.current.endSession().catch(console.error);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [options.debug, options.voice]);

  // Start session
  const connect = useCallback(async () => {
    if (!sdkRef.current || state.isConnecting || state.isConnected) {
      console.log('⚠️ [useMAIASDK] Cannot connect - already connecting or connected');
      return;
    }

    console.log('🔌 [useMAIASDK] Starting connection...');
    setState(prev => ({ ...prev, isConnecting: true, error: undefined }));

    try {
      // Build system instructions from agent config
      const instructions = `You are ${agentConfig.name}, ${agentConfig.description}

Voice Characteristics:
${agentConfig.voiceCharacteristics?.tone ? `- Tone: ${agentConfig.voiceCharacteristics.tone}` : ''}
${agentConfig.voiceCharacteristics?.pace ? `- Pace: ${agentConfig.voiceCharacteristics.pace}` : ''}
${agentConfig.voiceCharacteristics?.energy ? `- Energy: ${agentConfig.voiceCharacteristics.energy}` : ''}

Respond naturally with warmth and empathy using your voice.`;

      // Start SDK session
      await sdkRef.current.startSession(instructions, options.voice);

      console.log('✅ [useMAIASDK] Session started successfully');

    } catch (error) {
      console.error('❌ [useMAIASDK] Failed to start session:', error);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to start session'
      }));
    }
  }, [state.isConnecting, state.isConnected, agentConfig, options.voice]);

  // Start capturing microphone
  const startListening = useCallback(async () => {
    if (!sdkRef.current || !state.isConnected) {
      console.log('⚠️ [useMAIASDK] Cannot start listening - not connected');
      return;
    }

    try {
      console.log('🎤 [useMAIASDK] Starting microphone capture...');

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 24000
        }
      });
      streamRef.current = stream;

      // Create audio context
      const audioContext = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = async (e) => {
        if (!sdkRef.current || !state.isConnected) return;

        const audioData = e.inputBuffer.getChannelData(0);

        // Send audio chunk to SDK for processing
        await sdkRef.current.processAudio(audioData);
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      console.log('✅ [useMAIASDK] Microphone capture started');

    } catch (error) {
      console.error('❌ [useMAIASDK] Failed to start microphone:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Microphone access failed'
      }));
    }
  }, [state.isConnected]);

  // Stop listening
  const stopListening = useCallback(() => {
    console.log('🛑 [useMAIASDK] Stopping microphone capture...');

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }

    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  // Disconnect session
  const disconnect = useCallback(async () => {
    console.log('🔌 [useMAIASDK] Disconnecting...');

    stopListening();

    if (sdkRef.current) {
      const summary = await sdkRef.current.endSession();
      console.log('📊 [useMAIASDK] Session summary:', {
        duration: (Date.now() - summary.startTime) / 1000,
        messages: summary.transcript.length,
        cost: summary.cost.total.toFixed(4)
      });
    }

    setState(prev => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
      isSpeaking: false,
      isListening: false,
      isProcessing: false,
      sessionCost: 0
    }));

    options.onDisconnected?.();
  }, [stopListening, options]);

  // Send text message (for testing or fallback)
  const sendText = useCallback(async (text: string) => {
    if (!sdkRef.current || !state.isConnected) {
      console.warn('⚠️ [useMAIASDK] Cannot send text - not connected');
      return;
    }

    console.log('📤 [useMAIASDK] Sending text:', text.substring(0, 50));

    // Create synthetic audio chunk (silence) to trigger processing with text
    const audioChunk = new Float32Array(24000); // 1 second of silence
    await sdkRef.current.processAudio(audioChunk);
  }, [state.isConnected]);

  // Auto-start session if requested
  useEffect(() => {
    if (options.autoStart && sdkRef.current && !state.isConnected && !state.isConnecting) {
      connect();
    }
  }, [options.autoStart, state.isConnected, state.isConnecting, connect]);

  return {
    // Connection state
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,

    // Activity state
    isSpeaking: state.isSpeaking,
    isListening: state.isListening,
    isProcessing: state.isProcessing,

    // Provider info
    currentProvider: state.currentProvider,

    // Cost tracking
    sessionCost: state.sessionCost,

    // Error state
    error: state.error,

    // Transcript (empty for SDK, handled via callbacks)
    transcript: '',

    // Actions
    connect,
    disconnect,
    startListening,
    stopListening,
    sendText,
    cancelResponse: () => {
      console.log('⚠️ [useMAIASDK] cancelResponse not implemented in SDK');
    },
    changeMode: (mode: string) => {
      console.log('⚠️ [useMAIASDK] changeMode not implemented in SDK (mode:', mode, ')');
    },

    // Compatibility aliases (match useMaiaRealtime interface)
    maiaConnect: connect,
    maiaDisconnect: disconnect,
    maiaConnected: state.isConnected,
    maiaConnecting: state.isConnecting,
    maiaIsSpeaking: state.isSpeaking,
    maiaSendText: sendText,
    maiaCancelResponse: () => {
      console.log('⚠️ [useMAIASDK] cancelResponse not implemented in SDK');
    },
    maiaChangeMode: (mode: string) => {
      console.log('⚠️ [useMAIASDK] changeMode not implemented in SDK (mode:', mode, ')');
    },
    maiaError: state.error,
    maiaTranscript: ''
  };
}

export default useMAIASDK;
