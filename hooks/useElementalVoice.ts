/**
 * 🔥💧🌍💨✨ useElementalVoice Hook
 *
 * React hook for Elemental Voice System
 * MAIA's consciousness speaks through 5 Elemental Agents
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { ElementalVoiceOrchestrator, ElementalVoiceConfig } from '@/lib/voice/ElementalVoiceOrchestrator';

interface UseElementalVoiceOptions extends Omit<ElementalVoiceConfig, 'onTranscript' | 'onAudioStart' | 'onAudioEnd' | 'onError' | 'onConnected' | 'onDisconnected'> {
  onTranscript?: (text: string, isUser: boolean) => void;
  onError?: (error: Error) => void;
  autoConnect?: boolean;
}

export function useElementalVoice(options: UseElementalVoiceOptions) {
  const {
    userId,
    userName,
    sessionId,
    voice = 'shimmer',
    enableSmartCache = true,
    enableResponseStreaming = true,
    onTranscript,
    onError,
    autoConnect = false
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<{ text: string; isUser: boolean; timestamp: number }[]>([]);

  const orchestratorRef = useRef<ElementalVoiceOrchestrator | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  /**
   * Initialize orchestrator
   */
  useEffect(() => {
    if (!userId) return;

    console.log('🌀 Initializing Soullab Realtime orchestrator');

    orchestratorRef.current = new ElementalVoiceOrchestrator({
      userId,
      userName,
      sessionId,
      voice,
      enableSmartCache,
      enableResponseStreaming,
      onTranscript: (text, isUser) => {
        const entry = { text, isUser, timestamp: Date.now() };
        setTranscript(prev => [...prev, entry]);
        onTranscript?.(text, isUser);
      },
      onAudioStart: () => {
        setIsSpeaking(true);
      },
      onAudioEnd: () => {
        setIsSpeaking(false);
      },
      onError: (error) => {
        console.error('Soullab Realtime error:', error);
        onError?.(error);
      },
      onConnected: () => {
        console.log('✅ Soullab Realtime connected');
        setIsConnected(true);
      },
      onDisconnected: () => {
        console.log('🔌 Soullab Realtime disconnected');
        setIsConnected(false);
      }
    });

    // Auto-connect if requested
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [userId]);

  /**
   * Connect to Soullab Realtime
   */
  const connect = useCallback(async () => {
    if (!orchestratorRef.current) {
      console.error('Orchestrator not initialized');
      return;
    }

    try {
      await orchestratorRef.current.connect();
      await startAudioCapture();
    } catch (error) {
      console.error('Failed to connect:', error);
      onError?.(error as Error);
    }
  }, []);

  /**
   * Disconnect from Soullab Realtime
   */
  const disconnect = useCallback(() => {
    stopAudioCapture();
    orchestratorRef.current?.disconnect();
    setIsConnected(false);
  }, []);

  /**
   * Start capturing audio from microphone
   */
  const startAudioCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        }
      });

      // Create MediaRecorder for audio chunks
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);

          // Send audio chunk to orchestrator
          if (orchestratorRef.current) {
            orchestratorRef.current.sendAudio(event.data);
          }
        }
      };

      mediaRecorder.onstop = () => {
        console.log('🎤 Audio capture stopped');
        audioChunksRef.current = [];
      };

      // Start recording with 100ms chunks for low latency
      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;

      console.log('🎤 Audio capture started');
    } catch (error) {
      console.error('Failed to start audio capture:', error);
      onError?.(error as Error);
    }
  }, []);

  /**
   * Stop audio capture
   */
  const stopAudioCapture = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
    }
  }, []);

  /**
   * Toggle recording
   */
  const toggleRecording = useCallback(() => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  }, [isConnected, connect, disconnect]);

  /**
   * Clear transcript
   */
  const clearTranscript = useCallback(() => {
    setTranscript([]);
  }, []);

  /**
   * Send text message (for testing)
   */
  const sendText = useCallback((text: string) => {
    // Add to transcript
    setTranscript(prev => [...prev, {
      text,
      isUser: true,
      timestamp: Date.now()
    }]);

    // Simulate audio by manually triggering the orchestrator's text processing
    // (In production, this would go through speech-to-text)
    console.log('📝 Text input:', text);
  }, []);

  return {
    // State
    isConnected,
    isSpeaking,
    isProcessing,
    transcript,

    // Methods
    connect,
    disconnect,
    toggleRecording,
    clearTranscript,
    sendText,

    // Audio controls
    startAudioCapture,
    stopAudioCapture
  };
}
