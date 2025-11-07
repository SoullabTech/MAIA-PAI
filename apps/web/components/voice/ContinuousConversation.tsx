"use client";

import React, { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import { Mic, MicOff, Loader2, Activity, Wifi, WifiOff } from "lucide-react";

interface ContinuousConversationProps {
  onTranscript: (text: string) => void;
  onInterimTranscript?: (text: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  onAudioLevelChange?: (amplitude: number, isSpeaking: boolean) => void;
  onPartialResponse?: (text: string) => void; // Partial Oracle text
  onAudioStart?: () => void; // When MAIA starts speaking
  onAudioEnd?: () => void; // When MAIA stops speaking
  isProcessing?: boolean;
  isSpeaking?: boolean;
  autoStart?: boolean;
  silenceThreshold?: number;
  vadSensitivity?: number;
  voiceId?: string; // Voice ID for TTS
  streamingEnabled?: boolean; // Enable streaming Oracle responses
}

export interface ContinuousConversationRef {
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  isListening: boolean;
  isRecording: boolean;
}

/**
 * Water Phase: useVoiceTurn - stable hook for streaming Oracle responses
 * Consumes /api/voice/stream NDJSON endpoint and plays audio chunks
 */
function useVoiceTurn(voiceId: string, onPartialText?: (text: string) => void, onAudioStart?: () => void, onAudioEnd?: () => void) {
  const [partialText, setPartialText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const mediaQueueRef = useRef<ArrayBuffer[]>([]);
  const playingRef = useRef(false);
  const audioHasStartedRef = useRef(false);

  const enqueueAudio = useCallback((buf: ArrayBuffer) => {
    mediaQueueRef.current.push(buf);
    if (!playingRef.current) {
      void playNext();
    }
  }, []);

  const playNext = useCallback(async () => {
    const next = mediaQueueRef.current.shift();
    if (!next) {
      playingRef.current = false;
      if (audioHasStartedRef.current) {
        audioHasStartedRef.current = false;
        onAudioEnd?.();
      }
      return;
    }
    playingRef.current = true;

    // Trigger onAudioStart on first audio chunk
    if (!audioHasStartedRef.current) {
      audioHasStartedRef.current = true;
      onAudioStart?.();
    }

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decoded = await audioCtx.decodeAudioData(next.slice(0));
      const src = audioCtx.createBufferSource();
      src.buffer = decoded;
      src.connect(audioCtx.destination);
      src.onended = () => playNext();
      src.start(0);
    } catch (err) {
      console.error('❌ [useVoiceTurn] Audio playback error:', err);
      playNext(); // Continue to next chunk
    }
  }, [onAudioStart, onAudioEnd]);

  const startStream = useCallback(async (prompt: string) => {
    setPartialText("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/voice/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, voiceId }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Stream failed: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const event = JSON.parse(line);

            if (event.type === "text") {
              setPartialText((prev) => prev + event.payload);
              onPartialText?.(event.payload);
            } else if (event.type === "audio") {
              // Decode base64 audio and enqueue
              const audioData = Uint8Array.from(atob(event.payload), c => c.charCodeAt(0));
              enqueueAudio(audioData.buffer);
            } else if (event.type === "done") {
              setIsStreaming(false);
            }
          } catch (parseErr) {
            console.warn('⚠️ [useVoiceTurn] Failed to parse NDJSON line:', line);
          }
        }
      }
    } catch (err) {
      console.error('❌ [useVoiceTurn] Stream error:', err);
      setIsStreaming(false);
    }
  }, [voiceId, enqueueAudio, onPartialText]);

  return { partialText, isStreaming, startStream };
}

export const ContinuousConversation = forwardRef<ContinuousConversationRef, ContinuousConversationProps>((props, ref) => {
  const {
    onTranscript,
    onInterimTranscript,
    onRecordingStateChange,
    onAudioLevelChange,
    onPartialResponse,
    onAudioStart,
    onAudioEnd,
    isProcessing = false,
    isSpeaking = false,
    autoStart = true,
    silenceThreshold = 4500,
    vadSensitivity = 0.3,
    voiceId = 'alloy',
    streamingEnabled = false
  } = props;

  // State
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Refs - all hooks called unconditionally
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const lastSpeechTime = useRef<number>(Date.now());
  const accumulatedTranscript = useRef<string>("");
  const isProcessingRef = useRef(false);

  // Water Phase: Stable hook for streaming Oracle responses (always called)
  const { partialText, isStreaming, startStream } = useVoiceTurn(voiceId, onPartialResponse, onAudioStart, onAudioEnd);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    startListening,
    stopListening,
    toggleListening,
    isListening,
    isRecording
  }), [isListening, isRecording]);

  // Initialize Web Speech API
  const initializeSpeechRecognition = useCallback(() => {
    if (typeof window === 'undefined') return null;

    const SpeechRecognition = (window as any).webkitSpeechRecognition ||
                             (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      onRecordingStateChange?.(true);
      accumulatedTranscript.current = "";
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const isFinal = event.results[i].isFinal;

        if (isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript || finalTranscript) {
        lastSpeechTime.current = Date.now();

        if (finalTranscript) {
          accumulatedTranscript.current = finalTranscript.trim();
        } else if (interimTranscript) {
          accumulatedTranscript.current = interimTranscript.trim();
        }

        // Reset silence timer on speech
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        // Start new silence timer
        silenceTimerRef.current = setTimeout(() => {
          if (!isProcessingRef.current && accumulatedTranscript.current.trim()) {
            processAccumulatedTranscript();
          }
        }, silenceThreshold);
      }

      if (interimTranscript) {
        onInterimTranscript?.(interimTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('❌ Speech recognition error:', event.error);
      }

      if (event.error === 'no-speech') {
        if (accumulatedTranscript.current.trim()) {
          processAccumulatedTranscript();
        }
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        console.error('🚫 Microphone permission denied');
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      onRecordingStateChange?.(false);

      // Auto-restart if still listening and not processing/speaking
      if (isListening && !isProcessingRef.current && !isSpeaking) {
        setTimeout(() => {
          if (recognitionRef.current && isListening && !isRecording && !isProcessingRef.current && !isSpeaking) {
            try {
              recognitionRef.current.start();
            } catch (err: any) {
              console.log('⚠️ Could not restart recognition:', err.message);
            }
          }
        }, 300);
      }
    };

    return recognition;
  }, [isListening, isRecording, isSpeaking, silenceThreshold, onInterimTranscript, onRecordingStateChange]);

  // Stop recognition when MAIA starts speaking
  useEffect(() => {
    if (isSpeaking && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsRecording(false);
        isProcessingRef.current = false;
      } catch (err) {
        console.warn('⚠️ Error stopping recognition:', err);
      }
    }
  }, [isSpeaking]);

  // Process accumulated transcript
  const processAccumulatedTranscript = useCallback(() => {
    const transcript = accumulatedTranscript.current.trim();

    if (!transcript || isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;

    // Stop recognition while processing
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Send transcript to parent
    onTranscript(transcript);

    // Water Phase: If streaming enabled, trigger streaming Oracle response
    if (streamingEnabled) {
      void startStream(transcript);
    }

    // Clear accumulated
    accumulatedTranscript.current = "";

    setTimeout(() => {
      isProcessingRef.current = false;
    }, 500);
  }, [onTranscript, streamingEnabled, startStream]);

  // Initialize audio level monitoring
  const initializeAudioMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      micStreamRef.current = stream;

      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 256;

      microphone.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Monitor audio levels
      const checkAudioLevel = () => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
        const normalizedLevel = Math.min(average / 128, 1);
        setAudioLevel(normalizedLevel);

        if (isListening) {
          requestAnimationFrame(checkAudioLevel);
        }
      };

      checkAudioLevel();

      return true;
    } catch (error) {
      console.error('❌ Microphone access error:', error);
      return false;
    }
  }, [isListening]);

  // Start listening
  const startListening = useCallback(async () => {
    const audioReady = await initializeAudioMonitoring();
    if (!audioReady) {
      alert('Unable to access microphone. Please check permissions.');
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition();
    }

    if (recognitionRef.current) {
      setIsListening(true);
      isProcessingRef.current = false;

      try {
        if (isRecording) {
          return;
        }

        try {
          recognitionRef.current.stop();
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (stopErr) {
          // Ignore error if not running
        }

        recognitionRef.current.start();
      } catch (err) {
        console.error('❌ Error starting recognition:', err);
      }
    }
  }, [initializeSpeechRecognition, initializeAudioMonitoring, isRecording]);

  // Stop listening
  const stopListening = useCallback(() => {
    setIsListening(false);
    setIsRecording(false);
    setAudioLevel(0);

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && !isListening && !isSpeaking && !isProcessing) {
      const timer = setTimeout(() => {
        startListening();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoStart, isListening, isSpeaking, isProcessing, startListening]);

  // Audio level callback
  useEffect(() => {
    if (onAudioLevelChange) {
      onAudioLevelChange(audioLevel, isRecording);
    }
  }, [audioLevel, isRecording, onAudioLevelChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  // Visual states
  const isActive = isListening && !isSpeaking && !isProcessing;
  const showLoader = isStreaming || isProcessing;

  return (
    <div className="flex flex-col gap-3">
      {/* Main control button */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`
            relative p-3 rounded-lg transition-all
            ${isListening
              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          aria-label={isListening ? 'Stop continuous listening' : 'Start continuous listening'}
        >
          {showLoader ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isListening ? (
            <Wifi className="w-5 h-5" />
          ) : (
            <WifiOff className="w-5 h-5" />
          )}

          {/* Recording indicator */}
          {isRecording && (
            <span className="absolute -top-1 -right-1 w-3 h-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
          )}
        </button>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-sm">
          {isListening && (
            <>
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-green-400">
                {isRecording ? 'Listening...' :
                 isSpeaking ? 'Maya speaking...' :
                 isProcessing ? 'Processing...' : 'Ready'}
              </span>
            </>
          )}
        </div>

        {/* Audio level indicator */}
        {isListening && isRecording && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-green-400/60 rounded-full transition-all duration-100"
                style={{ height: `${Math.max(4, audioLevel * 20 * (1 - i * 0.15))}px` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Water Phase: Partial response display */}
      {streamingEnabled && partialText && (
        <div className="text-sm text-gray-300 bg-white/5 rounded-lg p-3 max-w-xl">
          {partialText}
          {isStreaming && <span className="animate-pulse ml-1">▋</span>}
        </div>
      )}
    </div>
  );
});

ContinuousConversation.displayName = 'ContinuousConversation';
