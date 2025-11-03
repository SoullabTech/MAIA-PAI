"use client";

import React, { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import { Mic, MicOff, Loader2, Activity, Wifi, WifiOff } from "lucide-react";
import VoiceFeedbackPrevention from "@/lib/voice/voice-feedback-prevention";
// import { Analytics } from "../../lib/analytics/supabaseAnalytics"; // Disabled for Vercel build

interface ContinuousConversationProps {
  onTranscript: (text: string) => void;
  onInterimTranscript?: (text: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  onAudioLevelChange?: (level: number) => void; // Audio amplitude 0.0-1.0 for visualization
  isProcessing?: boolean;
  isSpeaking?: boolean; // When Maya is speaking
  autoStart?: boolean; // Start listening immediately
  silenceThreshold?: number; // Silence detection threshold in ms (default 2000)
  vadSensitivity?: number; // Voice activity detection sensitivity 0-1
}

export interface ContinuousConversationRef {
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  isListening: boolean;
  isRecording: boolean;
}

export const ContinuousConversation = forwardRef<ContinuousConversationRef, ContinuousConversationProps>((props, ref) => {
  const {
    onTranscript,
    onInterimTranscript,
    onRecordingStateChange,
    onAudioLevelChange,
    isProcessing = false,
    isSpeaking = false,
    autoStart = true,
    silenceThreshold = 4500, // Increased to 4.5s to allow fuller thoughts before processing
    vadSensitivity = 0.3
  } = props;

  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const lastSpeechTime = useRef<number>(Date.now());
  const accumulatedTranscript = useRef<string>("");
  const isProcessingRef = useRef(false);
  const recognitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSentRef = useRef<string>("");
  const isRestartingRef = useRef(false);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    startListening,
    stopListening,
    toggleListening,
    isListening,
    isRecording
  }));

  // Auto-restart listening when Maya stops speaking, but with timeout to stop if no response
  const conversationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // DISABLED: Auto-restart causes echo loops - OracleConversation handles restart via startListening()
  // useEffect(() => {
  //   if (!isSpeaking && isListening && !isRecording && !isProcessing) {
  //     console.log('🎤 Maya stopped speaking, restarting microphone...');
  //     setTimeout(() => {
  //       if (recognitionRef.current && isListening && !isRecording && !isSpeaking) {
  //         recognitionRef.current.start();
  //       }
  //     }, 2000);
  //   }
  // }, [isSpeaking, isListening, isRecording, isProcessing]);

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
    recognition.continuous = true; // Enable continuous listening
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    // CRITICAL: Register with feedback prevention to stop mic when Maya speaks
    const feedbackPrevention = VoiceFeedbackPrevention.getInstance();
    feedbackPrevention.registerRecognition(recognition);
    console.log('✅ [ContinuousConversation] Registered with VoiceFeedbackPrevention');

    recognition.onstart = () => {
      setIsRecording(true);
      onRecordingStateChange?.(true);
      accumulatedTranscript.current = "";

      // Clear conversation timeout when user starts speaking
      if (conversationTimeoutRef.current) {
        clearTimeout(conversationTimeoutRef.current);
        conversationTimeoutRef.current = null;
      }

      // Set timeout to auto-stop recognition after 30 seconds (increased from 6)
      if (recognitionTimeoutRef.current) {
        clearTimeout(recognitionTimeoutRef.current);
      }
      recognitionTimeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && isRecording) {
          // Only stop if no speech detected for a while
          const timeSinceLastSpeech = Date.now() - lastSpeechTime.current;
          if (timeSinceLastSpeech > 5000) {
            recognitionRef.current.stop();
          } else {
            // Reset the timeout if there was recent speech
            recognitionTimeoutRef.current = setTimeout(() => {
              if (recognitionRef.current && isRecording) {
                recognitionRef.current.stop();
              }
            }, 10000);
          }
        }
      }, 30000);
    };

    recognition.onresult = (event: any) => {
      console.log('🎤 [onresult] FIRED - event:', event.results.length, 'results');

      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const isFinal = event.results[i].isFinal;
        console.log(`  Result [${i}]: "${transcript}" (isFinal: ${isFinal})`);

        if (isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Update speech time on any speech
      if (interimTranscript || finalTranscript) {
        lastSpeechTime.current = Date.now();

        // CRITICAL FIX: Store interim results immediately in case isFinal never comes
        // This prevents the 30-second timeout issue
        if (finalTranscript) {
          console.log('✅ Got FINAL transcript:', finalTranscript);
          // Replace with final (don't add, since interim already set it)
          accumulatedTranscript.current = finalTranscript.trim();
        } else if (interimTranscript) {
          console.log('📝 Got INTERIM transcript:', interimTranscript);
          // Replace with latest interim (don't accumulate)
          accumulatedTranscript.current = interimTranscript.trim();
        }

        console.log('📊 Accumulated so far:', accumulatedTranscript.current);

        // Reset silence timer on speech
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        // Start new silence timer - use the configurable threshold
        silenceTimerRef.current = setTimeout(() => {
          console.log('🔕 Silence detected - processing transcript');
          // CRITICAL FIX: Don't check isRecording - onend fires before this timer
          // Just check if we have a transcript to send
          if (!isProcessingRef.current && accumulatedTranscript.current.trim()) {
            processAccumulatedTranscript();
          }
        }, silenceThreshold); // Use configurable threshold from props
      }

      if (interimTranscript) {
        onInterimTranscript?.(interimTranscript);
      }
    };

    // 🛑 INTERRUPT: Stop MAIA when actual speech is detected
    recognition.onspeechstart = () => {
      console.log('🗣️ User speech detected - interrupting MAIA');
      feedbackPrevention.interruptMaya();
    };

    recognition.onerror = (event: any) => {
      // Only log critical errors (not no-speech or aborted, which are common)
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('❌ [Continuous] Speech recognition error:', event.error);
      }

      if (event.error === 'no-speech') {
        // Process accumulated transcript before restarting
        if (accumulatedTranscript.current.trim()) {
          processAccumulatedTranscript();
        }
        // No-speech is normal in continuous mode, auto-restart happens in onend
      } else if (event.error === 'network') {
        console.warn('⚠️ Network error in speech recognition, will retry on restart');
        // Network errors will be retried by the auto-restart mechanism
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        console.error('🚫 Microphone permission denied');
        // Stop listening permanently if permission denied
        setIsListening(false);
        // Note: onError is not defined in props, removed the call
      } else if (event.error === 'aborted') {
        // Aborted is normal when stopping/restarting - don't log as error
        console.log('⏹️ Recognition aborted (normal during restart)');
        // Don't trigger any restart logic here - let onend handle it
      }
    };

    recognition.onend = () => {
      console.log('🏁 [onend] Recognition stopped');
      setIsRecording(false);
      onRecordingStateChange?.(false);

      // Clear timeout
      if (recognitionTimeoutRef.current) {
        clearTimeout(recognitionTimeoutRef.current);
        recognitionTimeoutRef.current = null;
      }

      // CRITICAL: Prevent infinite restart loop
      // Check if already restarting to prevent multiple simultaneous attempts
      if (isRestartingRef.current) {
        console.log('⚠️ [onend] Already restarting, skipping');
        return;
      }

      // Only restart if we're actively listening and not processing/speaking
      if (isListening && !isProcessingRef.current && !isSpeaking) {
        console.log('🔄 [onend] Will restart recognition after delay...');
        isRestartingRef.current = true;

        setTimeout(() => {
          // Double-check conditions before restart to prevent race conditions
          if (recognitionRef.current && isListening && !isRecording && !isProcessingRef.current && !isSpeaking) {
            try {
              recognitionRef.current.start();
              console.log('✅ [onend] Recognition restarted');
            } catch (err: any) {
              // If start fails, it's likely already running or in a bad state
              console.log('⚠️ [onend] Could not restart recognition:', err.message);
              // Don't retry to avoid infinite loop
            }
          } else {
            console.log('🚫 [onend] Conditions changed, not restarting');
          }
          // Clear the restarting flag
          isRestartingRef.current = false;
        }, 300); // Increased from 50ms to 300ms for stability
      } else {
        console.log('🚫 [onend] Not restarting - conditions not met');
      }
    };

    return recognition;
  }, [isListening, isRecording, isSpeaking, silenceThreshold, onInterimTranscript, onRecordingStateChange]);

  // Process accumulated transcript
  const processAccumulatedTranscript = useCallback(() => {
    const transcript = accumulatedTranscript.current.trim();
    console.log('🔄 [processAccumulatedTranscript] Called with:', transcript);

    if (!transcript) {
      console.log('⚠️ [processAccumulatedTranscript] No transcript to process');
      return;
    }

    // CRITICAL FIX: If already processing, schedule retry instead of abandoning
    if (isProcessingRef.current) {
      console.log('⏳ [ContinuousConversation] Already processing, will retry in 500ms');
      setTimeout(() => {
        processAccumulatedTranscript();
      }, 500);
      return;
    }
    
    // ✅ Prevent duplicate sends
    if (transcript === lastSentRef.current) {
      accumulatedTranscript.current = ""; // Clear duplicate
      return;
    }
    
    lastSentRef.current = transcript;
    
    isProcessingRef.current = true;
    
    // Stop recognition while processing
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Send transcript
    console.log('📤 [ContinuousConversation] Sending transcript to parent:', transcript);
    onTranscript(transcript);
    console.log('✅ [ContinuousConversation] onTranscript callback completed');
    
    // Track analytics (disabled for Vercel build)
    // Analytics.transcriptionSuccess({
    //   transcription_duration_ms: Date.now() - lastSpeechTime.current,
    //   transcription_length: transcript.length,
    //   mode: 'continuous'
    // });
    
    // Clear accumulated
    accumulatedTranscript.current = "";
    
    // Will restart when Maya finishes speaking
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 500);
  }, [onTranscript]);

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

        // Calculate average level
        const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
        const normalizedLevel = Math.min(average / 128, 1);
        setAudioLevel(normalizedLevel);

        // Send amplitude to parent for visualization
        onAudioLevelChange?.(normalizedLevel);

        if (isListening) {
          requestAnimationFrame(checkAudioLevel);
        }
      };
      
      checkAudioLevel();
      
      return true;
    } catch (error) {
      console.error('❌ [Continuous] Microphone access error:', error);
      return false;
    }
  }, [isListening]);

  // Start listening
  const startListening = useCallback(async () => {
    console.log('🎤 [ContinuousConversation] startListening called');

    // Initialize audio monitoring
    const audioReady = await initializeAudioMonitoring();
    if (!audioReady) {
      console.error('❌ [ContinuousConversation] Audio monitoring failed');
      alert('Unable to access microphone. Please check permissions.');
      return;
    }

    console.log('✅ [ContinuousConversation] Audio monitoring ready');

    // Initialize speech recognition
    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition();
      console.log('🔧 [ContinuousConversation] Speech recognition initialized');
    }

    if (recognitionRef.current) {
      setIsListening(true);
      isProcessingRef.current = false;

      try {
        // CRITICAL FIX: Stop first if already running to prevent "already started" error
        // Need to check actual state before attempting to start
        const isCurrentlyRecording = isRecording;

        if (isCurrentlyRecording) {
          console.log('⏸️ [ContinuousConversation] Recognition already active, skipping start');
          return;
        }

        try {
          recognitionRef.current.stop();
          // Wait for stop to complete (increased from 50ms to 200ms)
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (stopErr) {
          // Ignore error if not running
        }

        recognitionRef.current.start();
        console.log('🎙️ [ContinuousConversation] Recognition started');

        // Track analytics (disabled for Vercel build)
        // Analytics.startRecording({
        //   timestamp: new Date().toISOString(),
        //   mode: 'continuous',
        //   user_agent: window.navigator.userAgent
        // });
      } catch (err) {
        console.error('❌ [ContinuousConversation] Error starting recognition:', err);
      }
    }
  }, [initializeSpeechRecognition, initializeAudioMonitoring]);

  // Stop listening
  const stopListening = useCallback(() => {
    console.log('🛑 [ContinuousConversation] stopListening called');

    setIsListening(false);
    setIsRecording(false);
    setAudioLevel(0);

    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    // Clear timers
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (recognitionTimeoutRef.current) {
      clearTimeout(recognitionTimeoutRef.current);
      recognitionTimeoutRef.current = null;
    }

    if (conversationTimeoutRef.current) {
      clearTimeout(conversationTimeoutRef.current);
      conversationTimeoutRef.current = null;
    }

    // Stop audio monitoring
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Track analytics (disabled for Vercel build)
    // Analytics.stopRecording({
    //   recording_duration_ms: Date.now() - lastSpeechTime.current,
    //   success: true,
    //   mode: 'continuous'
    // });
  }, []);

  // Toggle listening
  const toggleListening = useCallback(() => {
    console.log('🔄 [ContinuousConversation] toggleListening called - isListening:', isListening);
    if (isListening) {
      console.log('⏹️ [ContinuousConversation] Stopping listening');
      stopListening();
    } else {
      console.log('▶️ [ContinuousConversation] Starting listening');
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

  // Restart listening when Maya stops speaking
  useEffect(() => {
    if (isListening && !isSpeaking && !isProcessing && !isRecording && !isRestartingRef.current) {
      // Restart recognition after Maya finishes - LONGER DELAY to prevent echo
      const timer = setTimeout(() => {
        if (recognitionRef.current && isListening && !isRecording && !isRestartingRef.current) {
          try {
            isRestartingRef.current = true;
            recognitionRef.current.start();
            console.log('✅ [effect] Recognition restarted after Maya stopped speaking');
            // Clear flag after a short delay
            setTimeout(() => {
              isRestartingRef.current = false;
            }, 500);
          } catch (err) {
            // Already started or other error, ignore
            console.log('⚠️ [effect] Could not restart recognition:', err);
            isRestartingRef.current = false;
          }
        }
      }, 1500); // Increased from 500ms to 1.5s to prevent picking up MAIA's voice echo
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, isProcessing, isListening, isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  // Visual states
  const isActive = isListening && !isSpeaking && !isProcessing;
  const showLoader = isTranscribing || isProcessing;

  return (
    <div className="flex items-center gap-3">
      {/* Main control button */}
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
              className={`w-1 h-${Math.max(1, Math.floor(audioLevel * 5) - i)} 
                         bg-green-400/60 rounded-full transition-all duration-100`}
              style={{ height: `${Math.max(4, audioLevel * 20 * (1 - i * 0.15))}px` }}
            />
          ))}
        </div>
      )}
    </div>
  );
});

ContinuousConversation.displayName = 'ContinuousConversation';