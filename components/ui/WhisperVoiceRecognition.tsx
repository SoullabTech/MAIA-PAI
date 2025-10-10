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

  /**
   * Initialize audio visualization
   */
  const initializeAudioVisualization = useCallback((stream: MediaStream) => {
    if (typeof window === 'undefined') return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 256;
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    // Start visualization loop
    const updateLevel = () => {
      if (!analyserRef.current) return;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);

      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      const level = average / 255;

      onAudioLevelChange?.(level);

      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  }, [onAudioLevelChange]);

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

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
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

      // Initialize visualization
      initializeAudioVisualization(stream);

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
          lastSpeechTimeRef.current = Date.now();
        }
      };

      // When recording stops, send to Whisper
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        // Only transcribe if we have meaningful audio (>100ms worth)
        if (audioBlob.size > 1000) {
          transcribeAudio(audioBlob);
        }

        audioChunksRef.current = [];
      };

      // Start recording
      mediaRecorder.start(1000); // Collect 1-second chunks
      setIsListening(true);
      lastSpeechTimeRef.current = Date.now();

      console.log('✅ Recording started');

      // Check for silence every 500ms
      silenceCheckIntervalRef.current = setInterval(() => {
        const silenceDuration = Date.now() - lastSpeechTimeRef.current;

        // If 2 seconds of silence, stop and transcribe
        if (silenceDuration > 2000 && mediaRecorderRef.current?.state === 'recording') {
          console.log('🔇 Silence detected, stopping recording...');
          mediaRecorderRef.current?.stop();

          // Restart recording for next phrase
          setTimeout(() => {
            if (!isMayaSpeaking && enabled && !isMuted) {
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
  }, [enabled, isMuted, isMayaSpeaking, initializeAudioVisualization, transcribeAudio]);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    console.log('🛑 Stopping Whisper recording...');

    if (mediaRecorderRef.current?.state === 'recording') {
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
   * Effect: Start/stop based on props
   */
  useEffect(() => {
    const shouldBeListening = enabled && !isMuted && !isMayaSpeaking;

    if (shouldBeListening && !isListening) {
      startRecording();
    } else if (!shouldBeListening && isListening) {
      stopRecording();
    }
  }, [enabled, isMuted, isMayaSpeaking, isListening, startRecording, stopRecording]);

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
