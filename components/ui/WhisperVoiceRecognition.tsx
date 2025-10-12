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

import React, { useRef, useState, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';

interface WhisperVoiceProps {
  enabled: boolean;
  isMuted: boolean;
  isMayaSpeaking: boolean;
  onTranscript: (text: string) => void;
  onAudioLevelChange?: (level: number) => void;
}

export interface VoiceActivatedMaiaRef {
  isListening: boolean;
  audioLevel: number;
}

export const WhisperVoiceRecognition = forwardRef<VoiceActivatedMaiaRef, WhisperVoiceProps>(({
  enabled,
  isMuted,
  isMayaSpeaking,
  onTranscript,
  onAudioLevelChange
}, ref) => {

  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState('');

  // Expose ref interface for parent component
  useImperativeHandle(ref, () => ({
    isListening,
    audioLevel
  }), [isListening, audioLevel]);

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
   * Convert webm to MP3 for Whisper API compatibility
   * Whisper claims to support webm but often rejects it
   */
  const convertToMp3 = async (webmBlob: Blob): Promise<Blob> => {
    const audioContext = new AudioContext();
    const arrayBuffer = await webmBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Create offline context for rendering to WAV first
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start(0);

    const renderedBuffer = await offlineContext.startRendering();

    // Convert to 16-bit PCM WAV (MP3 encoding requires external library, WAV is more reliable)
    const numberOfChannels = renderedBuffer.numberOfChannels;
    const length = renderedBuffer.length * numberOfChannels * 2;
    const buffer = new ArrayBuffer(44 + length);
    const view = new DataView(buffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, renderedBuffer.sampleRate, true);
    view.setUint32(28, renderedBuffer.sampleRate * numberOfChannels * 2, true); // byte rate
    view.setUint16(32, numberOfChannels * 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    writeString(36, 'data');
    view.setUint32(40, length, true);

    // Write PCM samples
    const offset = 44;
    let index = offset;
    for (let i = 0; i < renderedBuffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, renderedBuffer.getChannelData(channel)[i]));
        view.setInt16(index, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        index += 2;
      }
    }

    return new Blob([buffer], { type: 'audio/wav' });
  };

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
      // Try WAV conversion first, fallback to webm if it fails
      let audioToSend = audioBlob;
      let filename = 'audio.webm';

      try {
        console.log('🎤 Converting webm to WAV for Whisper compatibility...');
        const wavBlob = await convertToMp3(audioBlob);
        audioToSend = wavBlob;
        filename = 'audio.wav';
        console.log('✅ WAV conversion successful:', wavBlob.size, 'bytes');
      } catch (conversionError) {
        console.warn('⚠️ WAV conversion failed, sending webm directly:', conversionError);
        // Continue with original webm blob
      }

      console.log('🎤 Sending audio to Whisper...', {
        size: audioToSend.size,
        type: audioToSend.type,
        filename
      });

      const formData = new FormData();
      formData.append('file', audioToSend, filename);
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
        // Get detailed error message from Whisper API
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'Unknown error';
        console.error('❌ Whisper API error details:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          audioSize: audioBlob.size,
          audioType: audioBlob.type
        });
        throw new Error(`Whisper API error (${response.status}): ${errorMessage}`);
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

      // DIAGNOSTIC: List all available audio input devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(d => d.kind === 'audioinput');
      console.log('🎧 Available audio input devices:', audioInputs.map(d => ({
        id: d.deviceId,
        label: d.label,
        groupId: d.groupId
      })));

      // Request ONLY microphone input - block system audio routing
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          // Advanced constraints to ensure we get REAL microphone, not virtual/system audio
          suppressLocalAudioPlayback: true  // Don't capture browser audio playback
        },
        video: false  // Explicitly no video
      });

      streamRef.current = stream;

      // DIAGNOSTIC: Log which audio input is actually being used
      const audioTrack = stream.getAudioTracks()[0];
      const settings = audioTrack.getSettings();
      console.log('🎤 ACTIVE AUDIO INPUT:', {
        label: audioTrack.label,
        deviceId: settings.deviceId,
        echoCancellation: settings.echoCancellation,
        noiseSuppression: settings.noiseSuppression,
        autoGainControl: settings.autoGainControl,
        sampleRate: settings.sampleRate,
        channelCount: settings.channelCount
      });

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
        setAudioLevel(level);
        onAudioLevelChange?.(level);

        // Update last speech time if we detect REAL speech (threshold: 0.12 = speaking volume)
        // Below 0.12 is just background noise/room tone/fan/electrical hum
        if (level > 0.12) {
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
          speechDuration: speechMs + 'ms',
          chunks: audioChunksRef.current.length,
          activeInput: streamRef.current?.getAudioTracks()[0]?.label || 'unknown'
        });

        // Only transcribe if we have:
        // 1. Meaningful audio size (>1KB)
        // 2. At least 300ms of actual speech (Whisper needs minimum duration)
        // This prevents Whisper from hallucinating transcripts from pure silence or brief noise
        const MIN_SPEECH_DURATION_MS = 300;
        if (audioBlob.size > 1000 && speechMs >= MIN_SPEECH_DURATION_MS) {
          console.log('📤 Sending to Whisper:', {
            size: audioBlob.size,
            speechDuration: speechMs + 'ms',
            inputDevice: streamRef.current?.getAudioTracks()[0]?.label,
            timestamp: new Date().toISOString()
          });
          transcribeAudio(audioBlob);
        } else {
          console.log('⏭️ Skipping transcription - insufficient speech:', {
            size: audioBlob.size,
            speechDuration: speechMs + 'ms',
            required: MIN_SPEECH_DURATION_MS + 'ms',
            reason: audioBlob.size <= 1000 ? 'audio too small' : `need ${MIN_SPEECH_DURATION_MS}ms+ speech (got ${speechMs}ms)`
          });
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
});

WhisperVoiceRecognition.displayName = 'WhisperVoiceRecognition';
