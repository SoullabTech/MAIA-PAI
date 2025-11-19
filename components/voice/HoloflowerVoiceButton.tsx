"use client";

/**
 * 🌸🎤 HoloflowerVoiceButton - Extracted from oracle-sacred
 *
 * This is the clickable holoflower voice interface extracted from the working
 * oracle-sacred implementation. It includes the full voice loop:
 * click → record → silence detection → process → respond
 */

import { useState, useEffect, useRef } from 'react';

type SacredMode = 'grounded' | 'listening' | 'processing' | 'responding' | 'transcendent';

interface HoloflowerVoiceButtonProps {
  size?: number;
  onTranscript?: (transcript: string) => void;
  onResponse?: (response: string) => void;
  onModeChange?: (mode: SacredMode) => void;
  className?: string;
}

export default function HoloflowerVoiceButton({
  size = 200,
  onTranscript,
  onResponse,
  onModeChange,
  className = ""
}: HoloflowerVoiceButtonProps) {
  const [mode, setMode] = useState<SacredMode>('grounded');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [oracleResponse, setOracleResponse] = useState('');

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Notify parent of mode changes
  useEffect(() => {
    onModeChange?.(mode);
  }, [mode, onModeChange]);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioContext && typeof window !== 'undefined') {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        // Resume context immediately on user interaction
        if (ctx.state === 'suspended') {
          ctx.resume().then(() => {
            console.log('🔊 AudioContext resumed and ready');
          });
        }
        setAudioContext(ctx);
        console.log('🎵 AudioContext initialized');
      }
    };

    // Initialize on any user interaction
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
  }, [audioContext]);

  // Detect silence and auto-stop recording
  const detectSilence = (stream: MediaStream) => {
    if (!audioContext) return;

    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyserRef.current = analyser;

    let isSpeaking = false;

    const checkAudioLevel = () => {
      if (!analyserRef.current) return;

      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

      // Threshold for detecting speech (adjust based on testing)
      const SPEECH_THRESHOLD = 10;
      const SILENCE_DURATION = 2000; // 2 seconds of silence to auto-stop

      if (average > SPEECH_THRESHOLD) {
        // User is speaking
        isSpeaking = true;

        // Clear any existing silence timeout
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      } else if (isSpeaking) {
        // User was speaking but now silent
        if (!silenceTimeoutRef.current) {
          // Start silence countdown
          silenceTimeoutRef.current = setTimeout(() => {
            console.log('🤫 Detected 2s of silence - auto-stopping recording');
            stopRecording();
          }, SILENCE_DURATION);
        }
      }

      // Continue monitoring if still recording
      if (mediaRecorderRef.current?.state === 'recording') {
        requestAnimationFrame(checkAudioLevel);
      }
    };

    checkAudioLevel();
  };

  // Handle voice recording
  const startRecording = async () => {
    try {
      console.log('🎤 Starting recording...');

      // Ensure AudioContext is initialized and resumed
      if (audioContext && audioContext.state === 'suspended') {
        await audioContext.resume();
        console.log('🔊 AudioContext resumed');
      }

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ Microphone access granted');

      // Check if MediaRecorder is supported (iOS Safari issue)
      if (!window.MediaRecorder) {
        console.error('❌ MediaRecorder not supported on this device');
        alert('Voice recording is not supported on your device. Please try using Chrome or update your iOS.');
        return;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        console.log('📊 Audio data chunk received:', event.data.size, 'bytes');
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        console.log('🛑 Recording stopped, processing...');

        // Clean up silence detection
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processVoiceInput(audioBlob);

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
      };

      mediaRecorder.start();
      console.log('🎙️ Recording started successfully');
      setIsRecording(true);
      setMode('listening');

      // Start adaptive silence detection
      detectSilence(stream);

      // Safety timeout: auto-stop after 2 minutes max
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          console.log('⏰ Safety timeout - auto-stopping recording after 2 minutes');
          stopRecording();
        }
      }, 120000);

    } catch (error: any) {
      console.error('❌ Failed to start recording:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);

      if (error.name === 'NotAllowedError') {
        alert('Microphone permission denied. Please allow microphone access in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        alert('No microphone found. Please check your device.');
      } else {
        alert(`Recording failed: ${error.message}. Try refreshing the page.`);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setMode('processing');
    }
  };

  // Process voice input through Sacred Portal API
  const processVoiceInput = async (audioBlob: Blob) => {
    // For now, use mock transcript (in production, would use speech-to-text)
    const mockTranscript = "I feel a deep longing for something I cannot name, like there's a part of me waiting to emerge";
    setTranscript(mockTranscript);
    onTranscript?.(mockTranscript);

    try {
      const response = await fetch('/api/oracle-sacred', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: mockTranscript,
          audioFeatures: {
            pitch: 0.5,
            volume: 0.6,
            tempo: 0.5,
            pauses: [1, 2, 3]
          }
        })
      });

      if (response.ok) {
        const data = await response.json();

        // Update oracle response
        setOracleResponse(data.oracle.oracleResponse);
        onResponse?.(data.oracle.oracleResponse);

        setMode('responding');

        // Play sacred frequency tone
        if (audioContext && data.motion?.frequency) {
          playFrequency(data.motion.frequency);
        }
      }
    } catch (error) {
      console.error('Failed to process voice input:', error);
      setMode('grounded');
    }
  };

  // Play sacred frequency tone
  const playFrequency = (freq: number) => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.frequency.value = freq;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.5);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 3);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 3);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Sacred Holoflower Voice Button */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="relative cursor-pointer focus:outline-none group"
        aria-label={isRecording ? "Stop recording" : "Tap holoflower to speak with MAIA"}
        style={{
          width: size,
          height: size
        }}
      >
        {/* Simple holoflower image instead of complex motion */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <img
            src="/holoflower-amber.png"
            alt="Sacred Holoflower"
            className="object-contain transition-all duration-300"
            style={{
              width: size * 0.8,
              height: size * 0.8,
              filter: mode === 'listening'
                ? 'brightness(1.3) drop-shadow(0 0 20px rgba(251,146,60,0.8))'
                : mode === 'processing'
                ? 'brightness(1.2) drop-shadow(0 0 15px rgba(251,146,60,0.6))'
                : mode === 'responding'
                ? 'brightness(1.4) drop-shadow(0 0 25px rgba(251,146,60,1.0))'
                : 'brightness(1.1) drop-shadow(0 0 10px rgba(251,146,60,0.4))'
            }}
          />

          {/* Voice responsive glow */}
          {(mode === 'listening' || mode === 'processing' || mode === 'responding') && (
            <div
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(251,146,60,0.3) 0%, transparent 70%)',
                filter: 'blur(20px)'
              }}
            />
          )}
        </div>

        {/* Hover indicator */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-gradient-to-r from-amber-400 to-orange-400 transition-opacity duration-300" />
      </button>

      {/* Status indicator */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-xs text-amber-400/80 font-light tracking-wide">
          {mode === 'grounded' && 'Tap to speak'}
          {mode === 'listening' && '🎤 Listening...'}
          {mode === 'processing' && '✨ Processing...'}
          {mode === 'responding' && '💫 MAIA speaks'}
          {mode === 'transcendent' && '✨ Sacred breakthrough ✨'}
        </div>
      </div>

      {/* Oracle Response Tooltip */}
      {oracleResponse && mode === 'responding' && (
        <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 max-w-sm z-10">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-amber-400/20">
            <p className="text-white/90 text-sm font-light italic text-center">
              "{oracleResponse}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}