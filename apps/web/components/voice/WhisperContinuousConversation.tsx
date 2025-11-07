"use client";

import React, { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import { Mic, MicOff, Loader2, Activity } from "lucide-react";

// E2E timing for voice latency monitoring
let e2eStartTime: number | null = null;

interface WhisperContinuousConversationProps {
  onTranscript: (text: string) => void;
  onInterimTranscript?: (text: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  onAudioLevelChange?: (amplitude: number, isSpeaking: boolean) => void;
  isProcessing?: boolean;
  isSpeaking?: boolean;
  autoStart?: boolean;
  silenceThreshold?: number; // Silence detection threshold in ms (default 2000)
  whisperEndpoint?: string; // Whisper STT endpoint (default: http://localhost:8001/transcribe)
}

export interface WhisperContinuousConversationRef {
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  extendRecording: () => void;
  isListening: boolean;
  isRecording: boolean;
}

export const WhisperContinuousConversation = forwardRef<WhisperContinuousConversationRef, WhisperContinuousConversationProps>((props, ref) => {
  const {
    onTranscript,
    onInterimTranscript,
    onRecordingStateChange,
    onAudioLevelChange,
    isProcessing = false,
    isSpeaking = false,
    autoStart = false,
    silenceThreshold = 2000, // 2s silence threshold
    whisperEndpoint = 'http://localhost:8001/transcribe'
  } = props;

  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const lastSpeechTime = useRef<number>(Date.now());
  const isListeningRef = useRef(false);
  const isRecordingRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const isProcessingRef = useRef(false);

  // Update refs when props change
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  // Initialize audio analyzer for VAD (Voice Activity Detection)
  const initializeAudioAnalyzer = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      micStreamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      console.log('✅ [Whisper] Audio analyzer initialized');
      return stream;
    } catch (error) {
      console.error('❌ [Whisper] Failed to initialize audio analyzer:', error);
      return null;
    }
  }, []);

  // Monitor audio level for VAD
  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current || !isListening) return;

    const dataArray = new Uint8Array(analyserRef.current.fftSize);

    const checkLevel = () => {
      if (!isListeningRef.current || !analyserRef.current) return;

      analyserRef.current.getByteTimeDomainData(dataArray);

      // Calculate RMS (Root Mean Square) for amplitude
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const normalized = (dataArray[i] - 128) / 128;
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / dataArray.length);
      const amplitude = Math.min(rms * 5, 1); // Scale and clamp to 0-1

      setAudioLevel(amplitude);
      onAudioLevelChange?.(amplitude, amplitude > 0.1);

      requestAnimationFrame(checkLevel);
    };

    checkLevel();
  }, [isListening, onAudioLevelChange]);

  // Send audio to Whisper STT service
  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    console.log('🎤 [Whisper] Transcribing audio chunk:', audioBlob.size, 'bytes');
    setIsTranscribing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');

      const transcribeStart = performance.now();

      const response = await fetch(whisperEndpoint, {
        method: 'POST',
        body: formData
      });

      const transcribeTime = performance.now() - transcribeStart;

      if (!response.ok) {
        throw new Error(`Whisper API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.transcript) {
        const transcript = result.transcript.trim();

        if (transcript && transcript.length > 0) {
          console.log('✅ [Whisper] Transcribed:', transcript);
          console.log(`📊 [Whisper] Latency: ${transcribeTime.toFixed(0)}ms`);

          // E2E timing
          if (e2eStartTime) {
            const e2eTime = performance.now() - e2eStartTime;
            console.log(`📊 [E2E] Total voice latency: ${e2eTime.toFixed(0)}ms`);
            e2eStartTime = null;
          }

          onTranscript(transcript);
        }
      } else {
        console.warn('⚠️ [Whisper] Empty transcript returned');
      }
    } catch (error) {
      console.error('❌ [Whisper] Transcription failed:', error);
    } finally {
      setIsTranscribing(false);
    }
  }, [whisperEndpoint, onTranscript]);

  // Start recording
  const startRecording = useCallback(async () => {
    console.log('🎤 [Whisper] Starting recording...');

    e2eStartTime = performance.now(); // E2E timing marker

    try {
      // Initialize audio analyzer if not already done
      const stream = micStreamRef.current || await initializeAudioAnalyzer();
      if (!stream) {
        console.error('❌ [Whisper] Failed to get audio stream');
        return;
      }

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Collect audio chunks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          lastSpeechTime.current = Date.now(); // Update speech time
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = async () => {
        console.log('🎤 [Whisper] Recording stopped, processing audio...');

        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          audioChunksRef.current = [];

          // Transcribe audio via Whisper
          await transcribeAudio(audioBlob);
        }

        setIsRecording(false);
        isRecordingRef.current = false;
        onRecordingStateChange?.(false);
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms for silence detection

      setIsRecording(true);
      isRecordingRef.current = true;
      onRecordingStateChange?.(true);

      // Start monitoring audio level
      monitorAudioLevel();

      // Setup silence detection
      const checkSilence = () => {
        const timeSinceSpeech = Date.now() - lastSpeechTime.current;

        if (timeSinceSpeech >= silenceThreshold && isRecordingRef.current) {
          console.log('🔇 [Whisper] Silence detected, stopping recording');
          stopRecording();
        } else if (isRecordingRef.current) {
          silenceTimerRef.current = setTimeout(checkSilence, 100);
        }
      };

      silenceTimerRef.current = setTimeout(checkSilence, 100);

      console.log('✅ [Whisper] Recording started');
    } catch (error) {
      console.error('❌ [Whisper] Failed to start recording:', error);
    }
  }, [initializeAudioAnalyzer, monitorAudioLevel, silenceThreshold, transcribeAudio, onRecordingStateChange]);

  // Stop recording
  const stopRecording = useCallback(() => {
    console.log('🛑 [Whisper] Stopping recording...');

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // Start listening
  const startListening = useCallback(async () => {
    if (isListening) return;

    console.log('🎧 [Whisper] Starting listening...');
    setIsListening(true);
    isListeningRef.current = true;

    // Start recording immediately
    await startRecording();
  }, [isListening, startRecording]);

  // Stop listening
  const stopListening = useCallback(() => {
    console.log('🛑 [Whisper] Stopping listening...');

    setIsListening(false);
    isListeningRef.current = false;

    stopRecording();

    // Cleanup audio analyzer
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
  }, [stopRecording]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Extend recording (reset silence timer)
  const extendRecording = useCallback(() => {
    lastSpeechTime.current = Date.now();
    console.log('⏰ [Whisper] Recording extended');
  }, []);

  // Auto-start when MAIA stops speaking
  useEffect(() => {
    if (!isSpeaking && isListening && !isRecording && !isProcessing) {
      console.log('🎤 [Whisper] MAIA stopped speaking, restarting recording...');
      setTimeout(() => {
        if (isListeningRef.current && !isRecordingRef.current && !isSpeakingRef.current) {
          startRecording();
        }
      }, 500);
    }
  }, [isSpeaking, isListening, isRecording, isProcessing, startRecording]);

  // Stop recording when MAIA starts speaking
  useEffect(() => {
    if (isSpeaking && isRecording) {
      console.log('🔇 [Whisper] MAIA speaking, stopping recording');
      stopRecording();
    }
  }, [isSpeaking, isRecording, stopRecording]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && !isListening) {
      console.log('🚀 [Whisper] Auto-starting...');
      startListening();
    }
  }, [autoStart]); // Only run once on mount

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    startListening,
    stopListening,
    toggleListening,
    extendRecording,
    isListening,
    isRecording
  }), [startListening, stopListening, toggleListening, extendRecording, isListening, isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return null; // This is a headless component, no UI
});

WhisperContinuousConversation.displayName = "WhisperContinuousConversation";
