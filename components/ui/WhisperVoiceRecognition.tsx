/**
 * Whisper Voice Recognition
 *
 * Clean, simple, reliable voice transcription using OpenAI Whisper.
 * No state management hell. No restart loops. Just works.
 *
 * Migration path: This component can later be swapped with a local Whisper
 * implementation (whisper.cpp) without changing the parent component.
 */

'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

interface WhisperVoiceProps {
  enabled: boolean;
  isMuted: boolean;
  isMayaSpeaking: boolean;
  onTranscript: (text: string) => void;
  onAudioLevelChange?: (level: number) => void;
}

export function WhisperVoiceRecognition({
  enabled,
  isMuted,
  isMayaSpeaking,
  onTranscript,
  onAudioLevelChange
}: WhisperVoiceProps) {

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);

  // Track last speech time to detect silence
  const lastSpeechTimeRef = useRef<number>(0);
  const silenceCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef<boolean>(false);

  // Track total speech duration (only count time above threshold)
  const speechDurationRef = useRef<number>(0);
  const lastSpeechCheckRef = useRef<number>(0);


  /**
   * Send audio to Whisper for transcription
   */
  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    if (isProcessingRef.current) {
      console.log('⏸️ Already processing, skipping this chunk');
      return;
    }

    isProcessingRef.current = true;

    try {
      console.log('🎤 Sending audio to Whisper...', {
        size: audioBlob.size,
        type: audioBlob.type
      });

      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');

      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      console.log('🔑 Using API key:', apiKey.substring(0, 20) + '...');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Whisper API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.text?.trim();

      console.log('✅ Whisper transcript:', text);

      if (text && text.length > 0) {
        setTranscript(text);
        onTranscript(text);
      }

    } catch (error) {
      console.error('❌ Whisper transcription error:', error);
    } finally {
      isProcessingRef.current = false;
    }
  }, [onTranscript]);

  /**
   * Start recording
   */
  const startRecording = useCallback(async () => {
    try {
      console.log('🎙️ Starting Whisper voice recording...');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;

      // Initialize visualization AND silence detection
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Start audio level monitoring (for silence detection)
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkAudioLevel = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const level = average / 255;

        // Update audio visualization
        onAudioLevelChange?.(level);

        // Update last speech time if we detect REAL speech (threshold: 0.25 = speaking volume)
        // Below 0.25 is just background noise/room tone/fan/electrical hum
        if (level > 0.25) {
          const now = Date.now();

          // Track accumulated speech duration
          if (lastSpeechCheckRef.current > 0) {
            const timeSinceLastCheck = now - lastSpeechCheckRef.current;
            speechDurationRef.current += timeSinceLastCheck;
          }

          lastSpeechTimeRef.current = now;
          lastSpeechCheckRef.current = now;
          console.log('🎤 Speech detected, level:', level.toFixed(3), 'total:', speechDurationRef.current + 'ms');
        } else {
          lastSpeechCheckRef.current = 0; // Reset check when no speech
        }

        animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
      };
      checkAudioLevel();

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Collect audio chunks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('📼 Audio chunk collected:', event.data.size, 'bytes');
        }
      };

      // When recording stops, send to Whisper
      mediaRecorder.onstop = () => {
        console.log('⏹️ Recording stopped');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const speechMs = speechDurationRef.current;

        console.log('📊 Speech stats:', {
          blobSize: audioBlob.size,
          speechDuration: speechMs + 'ms'
        });

        // Only transcribe if we have:
        // 1. Meaningful audio size (>1KB)
        // 2. At least 500ms of actual speech (not just background noise)
        if (audioBlob.size > 1000 && speechMs >= 500) {
          console.log('📤 Sending to Whisper, size:', audioBlob.size, 'speech:', speechMs + 'ms');
          transcribeAudio(audioBlob);
        } else {
          console.log('⏭️ Skipping transcription - insufficient speech (size:', audioBlob.size, 'speech:', speechMs + 'ms)');
        }

        // Reset for next recording
        audioChunksRef.current = [];
        speechDurationRef.current = 0;
        lastSpeechCheckRef.current = 0;
      };

      // Start recording
      mediaRecorder.start(1000); // Collect 1-second chunks
      setIsListening(true);
      lastSpeechTimeRef.current = Date.now();
      speechDurationRef.current = 0;
      lastSpeechCheckRef.current = 0;

      console.log('✅ Recording started');

      // Check for silence every 500ms
      silenceCheckIntervalRef.current = setInterval(() => {
        const silenceDuration = Date.now() - lastSpeechTimeRef.current;

        console.log('🔍 Silence check:', {
          silenceDuration: `${silenceDuration}ms`,
          recording: mediaRecorderRef.current?.state
        });

        // If 2 seconds of silence, stop and transcribe
        if (silenceDuration > 2000 && mediaRecorderRef.current?.state === 'recording') {
          console.log('🔇 Silence detected (2s+), stopping recording...');
          mediaRecorderRef.current?.stop();

          // Restart recording for next phrase
          setTimeout(() => {
            if (!isMayaSpeaking && enabled && !isMuted) {
              console.log('🔄 Restarting recording for next phrase...');
              mediaRecorderRef.current?.start(1000);
              lastSpeechTimeRef.current = Date.now();
            }
          }, 100);
        }
      }, 500);

    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      setIsListening(false);
    }
  }, [enabled, isMuted, isMayaSpeaking, onAudioLevelChange, transcribeAudio]);

  /**
   * Pause recording (when MAIA is speaking)
   */
  const pauseRecording = useCallback(() => {
    console.log('⏸️ Pausing Whisper recording (MAIA speaking)...');

    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
    }
  }, []);

  /**
   * Resume recording (when MAIA finishes speaking)
   */
  const resumeRecording = useCallback(() => {
    console.log('▶️ Resuming Whisper recording (MAIA finished)...');

    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      lastSpeechTimeRef.current = Date.now(); // Reset silence timer
      speechDurationRef.current = 0; // Reset speech duration for new phrase
      lastSpeechCheckRef.current = 0;
    }
  }, []);

  /**
   * Stop recording completely (cleanup)
   */
  const stopRecording = useCallback(() => {
    console.log('🛑 Stopping Whisper recording completely...');

    if (mediaRecorderRef.current?.state === 'recording' || mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (silenceCheckIntervalRef.current) {
      clearInterval(silenceCheckIntervalRef.current);
      silenceCheckIntervalRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsListening(false);
    setTranscript('');
  }, []);

  /**
   * Effect: Start/stop/pause based on props
   */
  useEffect(() => {
    // Start recording if enabled and not already listening
    if (enabled && !isMuted && !isListening) {
      startRecording();
      return;
    }

    // Handle MAIA speaking state changes
    if (isListening) {
      if (isMayaSpeaking) {
        pauseRecording();
      } else {
        resumeRecording();
      }
    }

    // Stop completely if disabled or muted
    if ((!enabled || isMuted) && isListening) {
      stopRecording();
    }
  }, [enabled, isMuted, isMayaSpeaking, isListening, startRecording, pauseRecording, resumeRecording, stopRecording]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  return (
    <div className="whisper-voice-indicator">
      {isListening && (
        <div className="text-xs text-gray-500 mt-2">
          {transcript || 'Listening...'}
        </div>
      )}
    </div>
  );
}
