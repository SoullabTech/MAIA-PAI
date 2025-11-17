'use client';

import { useCallback, useState } from 'react';
import type { VoiceState } from '@/lib/voice/voice-capture';

// Minimal stub for realtime MAIA behavior
export type MaiaRealtimeMessage = {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
};

export type MaiaRealtimeState = {
  isConnected: boolean;
  isConnecting: boolean;
  isStreaming: boolean;
  error: string | null;
  voiceState: VoiceState | 'idle';
  messages: MaiaRealtimeMessage[];
};

export function useMaiaRealtime() {
  const [state, setState] = useState<MaiaRealtimeState>({
    isConnected: false,
    isConnecting: false,
    isStreaming: false,
    error: null,
    voiceState: 'idle',
    messages: [],
  });

  const connect = useCallback(async () => {
    console.log('[Realtime] connect() stub');
    setState((prev) => ({ ...prev, isConnecting: true }));
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        isConnected: true,
      }));
    }, 50);
  }, []);

  const disconnect = useCallback(() => {
    console.log('[Realtime] disconnect() stub');
    setState((prev) => ({
      ...prev,
      isConnected: false,
      isStreaming: false,
    }));
  }, []);

  const sendUserMessage = useCallback(async (content: string) => {
    console.log('[Realtime] sendUserMessage() stub', content);

    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: `local-${Date.now()}`,
          role: 'user',
          content,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }, []);

  const stopStreaming = useCallback(() => {
    console.log('[Realtime] stopStreaming() stub');
    setState((prev) => ({
      ...prev,
      isStreaming: false,
    }));
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    sendUserMessage,
    stopStreaming,
  };
}