/**
 * useMAIASDK - Simplified Sovereign Voice Hook
 *
 * Uses existing browser STT + Claude LLM + OpenAI TTS
 * Drop-in replacement for useMaiaRealtime
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { MAIARealtimeSDK } from '@/lib/maia-sdk';

interface UseMAIASDKOptions {
  voice?: string;
  userId?: string;
  userName?: string;
  mode?: string;
  debug?: boolean;
  onTranscript?: (text: string, isUser: boolean) => void;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
  onError?: (error: Error) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export function useMAIASDK(options: UseMAIASDKOptions = {}) {
  const sdkRef = useRef<MAIARealtimeSDK | null>(null);
  const [sessionCost, setSessionCost] = useState(0);
  const [currentProvider, setCurrentProvider] = useState({
    stt: 'browser-stt',
    llm: 'anthropic',
    tts: 'openai-tts'
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string>();

  // Initialize SDK
  useEffect(() => {
    console.log('🚀 [useMAIASDK] Initializing MAIA SDK...');

    try {
      sdkRef.current = new MAIARealtimeSDK({
        providers: [
          // Browser STT (handled by ContinuousConversation component)
          {
            name: 'browser-stt',
            endpoint: 'browser',
            priority: 100,
            capabilities: ['stt']
          },
          // Claude LLM (via /api/oracle/personal)
          {
            name: 'anthropic',
            endpoint: '/api/oracle/personal',
            priority: 100,
            capabilities: ['llm']
          },
          // OpenAI TTS (good voice quality)
          {
            name: 'openai-tts',
            endpoint: '/api/voice/openai-tts',
            priority: 100,
            capabilities: ['tts'],
            config: {
              voice: options.voice || 'shimmer'
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
        debug: options.debug ?? true
      });

      console.log('✅ [useMAIASDK] SDK initialized');

      // Subscribe to events
      sdkRef.current.on('session.started', (data: any) => {
        console.log('🎙️ [useMAIASDK] Session started');
        setIsConnected(true);
        setCurrentProvider(data.providers);
        options.onConnected?.();
      });

      sdkRef.current.on('stt.completed', (data: any) => {
        console.log('👤 [useMAIASDK] User said:', data.text);
        options.onTranscript?.(data.text, true);
      });

      sdkRef.current.on('llm.completed', (data: any) => {
        console.log('🤖 [useMAIASDK] MAIA responds:', data.text.substring(0, 100));
        options.onTranscript?.(data.text, false);
      });

      sdkRef.current.on('tts.started', () => {
        console.log('🔊 [useMAIASDK] TTS started');
        setIsSpeaking(true);
        options.onAudioStart?.();
      });

      sdkRef.current.on('tts.completed', () => {
        console.log('✅ [useMAIASDK] TTS completed');
        setIsSpeaking(false);
        options.onAudioEnd?.();
      });

      sdkRef.current.on('cost.update', (data: any) => {
        console.log(`💰 [useMAIASDK] Cost: $${data.total.toFixed(4)}`);
        setSessionCost(data.total);
      });

      sdkRef.current.on('error', (err: any) => {
        console.error('❌ [useMAIASDK] Error:', err);
        setError(err.message);
        options.onError?.(err);
      });

    } catch (err) {
      console.error('❌ [useMAIASDK] Failed to initialize:', err);
      setError(err instanceof Error ? err.message : 'Initialization failed');
    }

    return () => {
      if (sdkRef.current) {
        sdkRef.current.endSession().catch(console.error);
      }
    };
  }, [options.debug, options.voice]);

  // Connect (start session)
  const connect = useCallback(async () => {
    if (!sdkRef.current || isConnected) return;

    try {
      await sdkRef.current.startSession('You are MAIA, a warm and empathetic AI guide.', options.voice);
    } catch (err) {
      console.error('❌ [useMAIASDK] Connect failed:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  }, [isConnected, options.voice]);

  // Handle user speech (called by ContinuousConversation with transcribed text)
  const handleUserSpeech = useCallback(async (text: string) => {
    if (!sdkRef.current) {
      console.warn('⚠️ [useMAIASDK] SDK not initialized');
      return;
    }

    // Check if SDK has an active session (more reliable than React state)
    const hasSession = (sdkRef.current as any).session !== null;
    if (!hasSession) {
      console.warn('⚠️ [useMAIASDK] No active session, cannot process speech');
      return;
    }

    try {
      // Process text through SDK (gets LLM response and speaks it)
      const response = await sdkRef.current.processText(text);
      await sdkRef.current.synthesize(response);
    } catch (err) {
      console.error('❌ [useMAIASDK] Speech processing failed:', err);
      setError(err instanceof Error ? err.message : 'Processing failed');
    }
  }, []); // No dependencies - always use latest SDK ref

  // Disconnect
  const disconnect = useCallback(async () => {
    if (!sdkRef.current) return;

    try {
      await sdkRef.current.endSession();
      setIsConnected(false);
      options.onDisconnected?.();
    } catch (err) {
      console.error('❌ [useMAIASDK] Disconnect failed:', err);
    }
  }, [options]);

  // Compatibility with useMaiaRealtime interface
  return {
    // New SDK methods
    handleUserSpeech,
    sessionCost,
    currentProvider,

    // Compatibility aliases
    maiaConnected: isConnected,
    maiaConnecting: false,
    maiaIsSpeaking: isSpeaking,
    maiaError: error,
    maiaTranscript: '',
    maiaConnect: connect,
    maiaDisconnect: disconnect,
    maiaSendText: handleUserSpeech, // Text goes to handleUserSpeech
    maiaCancelResponse: () => console.log('⚠️ Cancel not implemented'),
    maiaChangeMode: () => console.log('⚠️ Mode change not implemented'),

    // Standard names
    isConnected,
    isConnecting: false,
    isSpeaking,
    error,
    transcript: '',
    connect,
    disconnect,
    sendText: handleUserSpeech
  };
}

export default useMAIASDK;
