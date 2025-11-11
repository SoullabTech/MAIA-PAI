"use client";

import { useState, useEffect, useRef } from 'react';
import HoloflowerMotion from '@/components/HoloflowerMotion';
import { MotionState } from '@/lib/motion-schema';

type SacredMode = 'grounded' | 'listening' | 'processing' | 'responding' | 'transcendent';

export default function SacredOraclePage() {
  const [mode, setMode] = useState<SacredMode>('grounded');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [oracleResponse, setOracleResponse] = useState('');
  const [motionState, setMotionState] = useState<MotionState>({
    coherence: 'medium',
    coherenceValue: 0.5,
    shadowPetals: [],
    shadowIntensity: 0,
    elementalCurrent: { primary: 'fire', transition: false },
    animation: {
      pulseSpeed: 4,
      pulseIntensity: 1.05,
      jitter: 0.1,
      glow: 0.5,
      ripple: false
    },
    momentum: 'steady',
    phase: 'inhale'
  });
  
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

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

      // Update motion state for listening
      setMotionState(prev => ({
        ...prev,
        coherence: 'medium',
        animation: {
          ...prev.animation,
          pulseSpeed: 3,
          pulseIntensity: 1.08,
          glow: 0.6
        },
        phase: 'inhale'
      }));

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
      
      // Update motion state for processing
      setMotionState(prev => ({
        ...prev,
        animation: {
          ...prev.animation,
          pulseSpeed: 2,
          pulseIntensity: 1.1,
          glow: 0.7,
          jitter: 0.2
        }
      }));
    }
  };

  // Process voice input through Sacred Portal API
  const processVoiceInput = async (audioBlob: Blob) => {
    // For now, use mock transcript (in production, would use speech-to-text)
    const mockTranscript = "I feel a deep longing for something I cannot name, like there's a part of me waiting to emerge";
    setTranscript(mockTranscript);
    
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
        
        // Update motion state from oracle
        setMotionState({
          coherence: data.motion.coherence > 0.9 ? 'breakthrough' : 
                     data.motion.coherence > 0.6 ? 'high' : 
                     data.motion.coherence > 0.3 ? 'medium' : 'low',
          coherenceValue: data.motion.coherence,
          shadowPetals: data.motion.shadowPetals,
          shadowIntensity: data.motion.shadowPetals.length / 12,
          aetherStage: data.motion.aetherStage,
          aetherIntensity: data.motion.aetherStage ? 0.8 : undefined,
          elementalCurrent: {
            primary: data.motion.highlight.element,
            transition: false
          },
          animation: {
            pulseSpeed: 4,
            pulseIntensity: 1.05 + (data.motion.luminosity * 0.1),
            jitter: data.motion.state === 'breakthrough' ? 0 : 0.1,
            glow: data.motion.luminosity,
            ripple: data.motion.rippleEffect
          },
          momentum: data.motion.state === 'breakthrough' ? 'accelerating' : 'steady',
          phase: data.motion.breathPattern as any
        });
        
        setMode(data.motion.state === 'breakthrough' ? 'transcendent' : 'responding');
        
        // Play sacred frequency tone
        if (audioContext && data.motion.frequency) {
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
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Sacred Holoflower - Full Screen */}
      <div className="absolute inset-0">
        <HoloflowerMotion
          motionState={motionState}
          width={typeof window !== 'undefined' ? window.innerWidth : 800}
          height={typeof window !== 'undefined' ? window.innerHeight : 800}
          onBreakthrough={() => {
            console.log('✨ Sacred breakthrough moment!');
            setMode('transcendent');
          }}
        />
      </div>
      
      {/* Sacred Voice Orb */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center">
        {/* Oracle Response */}
        {oracleResponse && mode === 'responding' && (
          <div className="mb-8 max-w-md text-center">
            <p className="text-white/80 text-lg font-light italic animate-fade-in">
              "{oracleResponse}"
            </p>
          </div>
        )}
        
        {/* Voice Input Display */}
        {transcript && mode !== 'grounded' && (
          <div className="mb-4 max-w-md text-center">
            <p className="text-white/40 text-sm">
              {transcript}
            </p>
          </div>
        )}
        
        {/* Sacred Mic Button - iOS Safe Area */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`
            relative w-24 h-24 rounded-full transition-all duration-500
            ${isRecording ? 'scale-110' : 'scale-100'}
            ${mode === 'transcendent' ? 'animate-pulse-golden' : ''}
            active:scale-95
          `}
          style={{
            background: mode === 'grounded' ? 'radial-gradient(circle, #FFD700, #B8860B)' :
                       mode === 'listening' ? 'radial-gradient(circle, #87CEEB, #4682B4)' :
                       mode === 'processing' ? 'radial-gradient(circle, #DDA0DD, #8B008B)' :
                       mode === 'responding' ? 'radial-gradient(circle, #98FB98, #228B22)' :
                       'radial-gradient(circle, #FFD700, #FF6347)',
            boxShadow: isRecording ? '0 0 40px rgba(255, 215, 0, 0.6)' : '0 0 20px rgba(255, 215, 0, 0.3)',
            marginBottom: '2rem' // Extra spacing for iPad home bar
          }}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {isRecording ? (
              <div className="w-6 h-6 bg-white rounded-sm animate-pulse" />
            ) : (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          
          {/* Breathing rings */}
          {mode !== 'grounded' && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping animation-delay-200" />
              <div className="absolute inset-0 rounded-full border-2 border-white/5 animate-ping animation-delay-400" />
            </>
          )}
        </button>
        
        {/* Mode indicator */}
        <div className="mt-4 text-white/70 text-sm font-light tracking-wide text-center px-8">
          {mode === 'grounded' && 'Tap to speak with MAIA'}
          {mode === 'listening' && 'Listening... speak now'}
          {mode === 'processing' && 'Processing...'}
          {mode === 'responding' && 'MAIA speaks'}
          {mode === 'transcendent' && '✨ Sacred breakthrough ✨'}
        </div>
      </div>
      
      {/* Minimal exit button */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
      >
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse-golden {
          0%, 100% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
          50% { box-shadow: 0 0 80px rgba(255, 215, 0, 1); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-pulse-golden {
          animation: pulse-golden 2s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
}