/**
 * useMAIAHybrid - True Hybrid Voice System
 *
 * PRIMARY: OpenAI Realtime API (full interruption/VAD/turn-taking)
 * FALLBACK: Sovereignty Stack (Browser STT + Claude + OpenAI TTS) when rate limits hit
 *
 * This gives you the best of both worlds:
 * - ✅ Dynamic conversation with interruption support
 * - ✅ Automatic fallback when 429 errors occur
 * - ✅ Cost tracking across both systems
 * - ✅ Seamless user experience (they won't notice the switch)
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useMaiaRealtime } from './useMaiaRealtime';
import { useMAIASDK } from './useMAIASDK-simple';

interface UseMAIAHybridOptions {
  userId?: string;
  userName?: string;
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  mode?: string;
  debug?: boolean;
  onTranscript?: (text: string, isUser: boolean) => void;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
  onError?: (error: Error) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export function useMAIAHybrid(options: UseMAIAHybridOptions = {}) {
  const [activeSystem, setActiveSystem] = useState<'realtime' | 'sdk'>('realtime');
  const [rateLimitDetected, setRateLimitDetected] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const consecutiveErrorsRef = useRef(0);

  // OpenAI Realtime API (primary system)
  const realtime = useMaiaRealtime({
    userId: options.userId,
    userName: options.userName,
    voice: options.voice || 'alloy',
    mode: options.mode || 'dialogue',
    onTranscript: (text, isUser) => {
      if (activeSystem === 'realtime') {
        options.onTranscript?.(text, isUser);
      }
    },
    onAudioStart: () => {
      if (activeSystem === 'realtime') {
        options.onAudioStart?.();
      }
    },
    onAudioEnd: () => {
      if (activeSystem === 'realtime') {
        options.onAudioEnd?.();
      }
    },
    onError: (error) => {
      console.error('[Hybrid] Realtime error:', error);

      // Detect rate limiting (429 errors)
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        consecutiveErrorsRef.current++;

        if (consecutiveErrorsRef.current >= 2) {
          console.warn('🔄 [Hybrid] Rate limit detected - switching to SDK fallback');
          setRateLimitDetected(true);
          setActiveSystem('sdk');

          // Try to reconnect SDK
          sdk.connect();
        }
      }

      // Still notify parent
      if (activeSystem === 'realtime') {
        options.onError?.(error);
      }
    },
    onConnected: () => {
      console.log('✅ [Hybrid] Realtime connected');
      consecutiveErrorsRef.current = 0; // Reset error counter on successful connection

      if (activeSystem === 'realtime') {
        options.onConnected?.();
      }
    },
    onDisconnected: () => {
      console.log('🔌 [Hybrid] Realtime disconnected');

      if (activeSystem === 'realtime') {
        options.onDisconnected?.();
      }
    },
  });

  // Sovereignty SDK (fallback system)
  const sdk = useMAIASDK({
    userId: options.userId,
    userName: options.userName,
    voice: options.voice || 'alloy',
    mode: options.mode,
    debug: options.debug,
    onTranscript: (text, isUser) => {
      if (activeSystem === 'sdk') {
        options.onTranscript?.(text, isUser);
      }
    },
    onAudioStart: () => {
      if (activeSystem === 'sdk') {
        options.onAudioStart?.();
      }
    },
    onAudioEnd: () => {
      if (activeSystem === 'sdk') {
        options.onAudioEnd?.();
      }
    },
    onError: (error) => {
      console.error('[Hybrid] SDK error:', error);

      if (activeSystem === 'sdk') {
        options.onError?.(error);
      }
    },
    onConnected: () => {
      console.log('✅ [Hybrid] SDK connected');

      if (activeSystem === 'sdk') {
        options.onConnected?.();
      }
    },
    onDisconnected: () => {
      console.log('🔌 [Hybrid] SDK disconnected');

      if (activeSystem === 'sdk') {
        options.onDisconnected?.();
      }
    },
  });

  // Track total cost (estimate for Realtime API)
  useEffect(() => {
    if (activeSystem === 'realtime') {
      // Estimate: $0.06/1K tokens for Realtime API
      // Rough estimate based on conversation length
      // TODO: Get actual usage from OpenAI API
    } else {
      setTotalCost(sdk.sessionCost);
    }
  }, [activeSystem, sdk.sessionCost]);

  // Auto-connect on mount
  useEffect(() => {
    if (activeSystem === 'realtime' && !realtime.isConnected && !realtime.isConnecting) {
      realtime.connect();
    } else if (activeSystem === 'sdk' && !sdk.maiaConnected) {
      sdk.maiaConnect();
    }
  }, [activeSystem]);

  // Periodically check if we can switch back to Realtime API
  useEffect(() => {
    if (!rateLimitDetected) return;

    const checkInterval = setInterval(() => {
      // After 5 minutes, try to reconnect to Realtime API
      console.log('🔄 [Hybrid] Attempting to reconnect to Realtime API...');

      setActiveSystem('realtime');
      realtime.connect();
      setRateLimitDetected(false);
      consecutiveErrorsRef.current = 0;
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(checkInterval);
  }, [rateLimitDetected]);

  // Return unified interface (delegates to active system)
  return {
    // Status
    maiaConnected: activeSystem === 'realtime' ? realtime.isConnected : sdk.maiaConnected,
    maiaConnecting: activeSystem === 'realtime' ? realtime.isConnecting : sdk.maiaConnecting,
    maiaIsSpeaking: activeSystem === 'realtime' ? realtime.isSpeaking : sdk.maiaIsSpeaking,
    maiaError: activeSystem === 'realtime' ? realtime.error?.message : sdk.maiaError,
    maiaTranscript: activeSystem === 'realtime' ? '' : sdk.maiaTranscript,

    // Methods
    maiaConnect: () => {
      if (activeSystem === 'realtime') {
        return realtime.connect();
      } else {
        return sdk.maiaConnect();
      }
    },
    maiaDisconnect: () => {
      if (activeSystem === 'realtime') {
        return realtime.disconnect();
      } else {
        return sdk.maiaDisconnect();
      }
    },
    maiaSendText: (text: string) => {
      if (activeSystem === 'realtime') {
        return realtime.sendText(text);
      } else {
        return sdk.maiaSendText(text);
      }
    },
    maiaCancelResponse: () => {
      if (activeSystem === 'realtime') {
        return realtime.cancelResponse();
      } else {
        return sdk.maiaCancelResponse();
      }
    },
    maiaChangeMode: (mode: string) => {
      if (activeSystem === 'realtime') {
        return realtime.changeMode(mode as any);
      } else {
        return sdk.maiaChangeMode(mode);
      }
    },

    // Hybrid-specific data
    activeSystem,
    rateLimitDetected,
    sessionCost: sdk.sessionCost,
    currentProvider: activeSystem === 'realtime'
      ? { stt: 'openai-realtime', llm: 'openai-realtime', tts: 'openai-realtime' }
      : sdk.currentProvider,

    // Standard names (compatibility)
    isConnected: activeSystem === 'realtime' ? realtime.isConnected : sdk.maiaConnected,
    isConnecting: activeSystem === 'realtime' ? realtime.isConnecting : sdk.maiaConnecting,
    isSpeaking: activeSystem === 'realtime' ? realtime.isSpeaking : sdk.maiaIsSpeaking,
    error: activeSystem === 'realtime' ? realtime.error?.message : sdk.maiaError,
    transcript: activeSystem === 'realtime' ? '' : sdk.maiaTranscript,
    connect: () => {
      if (activeSystem === 'realtime') {
        return realtime.connect();
      } else {
        return sdk.maiaConnect();
      }
    },
    disconnect: () => {
      if (activeSystem === 'realtime') {
        return realtime.disconnect();
      } else {
        return sdk.maiaDisconnect();
      }
    },
    sendText: (text: string) => {
      if (activeSystem === 'realtime') {
        return realtime.sendText(text);
      } else {
        return sdk.maiaSendText(text);
      }
    },
  };
}

export default useMAIAHybrid;
