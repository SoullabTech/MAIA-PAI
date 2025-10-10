/**
 * 🔥💧🌍💨✨ useElementalVoice Hook
 *
 * React hook for Elemental Voice System
 * MAIA's consciousness speaks through 5 Elemental Agents
 *
 * FIXED: Accumulates audio chunks, detects silence, sends complete audio to Whisper
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
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const isSpeakingRef = useRef(false);

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
   * Detect if user is speaking using volume analysis
   */
  const detectSpeech = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;

    // Volume threshold for speech detection (adjust as needed)
    const SPEECH_THRESHOLD = 15;
    const wasSpeaking = isSpeakingRef.current;
    const isNowSpeaking = average > SPEECH_THRESHOLD;

    if (isNowSpeaking && !wasSpeaking) {
      // User started speaking
      console.log('🎤 User started speaking');
      isSpeakingRef.current = true;

      // Trigger interruption handler
      if (orchestratorRef.current) {
        orchestratorRef.current.handleUserSpeechStart();
      }

      // Clear any pending silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    } else if (!isNowSpeaking && wasSpeaking) {
      // User stopped speaking - start silence timer
      console.log('🔇 User stopped speaking - waiting for silence confirmation');
      isSpeakingRef.current = false;

      // Wait for sustained silence before processing
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      silenceTimerRef.current = setTimeout(async () => {
        if (audioChunksRef.current.length > 0 && orchestratorRef.current) {
          // Combine all chunks into one complete audio file
          const completeAudio = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
          console.log('🎤 Sending complete audio:', completeAudio.size, 'bytes,', audioChunksRef.current.length, 'chunks');

          // Send complete audio to orchestrator
          await orchestratorRef.current.sendAudio(completeAudio);

          // Clear chunks after sending
          audioChunksRef.current = [];
        }
        silenceTimerRef.current = null;
      }, 800); // 800ms of silence before processing
    }

    // Continue monitoring
    if (mediaRecorderRef.current?.state === 'recording') {
      requestAnimationFrame(detectSpeech);
    }
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

      // Create audio context for speech detection
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);

      // Create MediaRecorder for audio chunks
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('🎤 Audio capture stopped');
        audioChunksRef.current = [];
        isSpeakingRef.current = false;

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      };

      // Start recording with 100ms chunks for low latency buffering
      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;

      // Start speech detection
      detectSpeech();

      console.log('🎤 Audio capture started with speech detection');
    } catch (error) {
      console.error('Failed to start audio capture:', error);
      onError?.(error as Error);
    }
  }, [detectSpeech, onError]);

  /**
   * Stop audio capture
   */
  const stopAudioCapture = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    analyserRef.current = null;
    isSpeakingRef.current = false;
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
