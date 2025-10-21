'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MaiaRealtimeWebRTC, type MaiaRealtimeConfig } from '@/lib/voice/MaiaRealtimeWebRTC';

export function useMaiaRealtime(config: MaiaRealtimeConfig) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [transcript, setTranscript] = useState<{ text: string; isUser: boolean }[]>([]);

  const clientRef = useRef<MaiaRealtimeWebRTC | null>(null);

  useEffect(() => {
    // Initialize client with callbacks
    clientRef.current = new MaiaRealtimeWebRTC({
      ...config,
      onConnected: () => {
        setIsConnected(true);
        setIsConnecting(false);
        config.onConnected?.();
      },
      onDisconnected: () => {
        setIsConnected(false);
        setIsConnecting(false);
        config.onDisconnected?.();
      },
      onTranscript: (text, isUser) => {
        setTranscript(prev => [...prev, { text, isUser }]);
        config.onTranscript?.(text, isUser);
      },
      onAudioStart: () => {
        setIsSpeaking(true);
        config.onAudioStart?.();
      },
      onAudioEnd: () => {
        setIsSpeaking(false);
        config.onAudioEnd?.();
      },
      onError: (err) => {
        setError(err);
        config.onError?.(err);
      },
    });

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []); // Empty deps - only initialize once

  const connect = useCallback(async () => {
    if (!clientRef.current || isConnecting || isConnected) return;

    setIsConnecting(true);
    setError(null);

    try {
      await clientRef.current.connect();
    } catch (err) {
      setError(err as Error);
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
    }
  }, []);

  const sendText = useCallback((message: string) => {
    if (clientRef.current) {
      clientRef.current.sendText(message);
    }
  }, []);

  const cancelResponse = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.cancelResponse();
    }
  }, []);

  const changeMode = useCallback(async (newMode: 'dialogue' | 'patient' | 'scribe') => {
    if (clientRef.current) {
      await clientRef.current.changeMode(newMode);
    }
  }, []);

  const getCurrentMode = useCallback((): 'dialogue' | 'patient' | 'scribe' | undefined => {
    return clientRef.current?.getCurrentMode();
  }, []);

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    error,
    transcript,
    connect,
    disconnect,
    sendText,
    cancelResponse, // ✅ Interruption support
    changeMode, // ✅ Dynamic mode switching
    getCurrentMode,
  };
}
