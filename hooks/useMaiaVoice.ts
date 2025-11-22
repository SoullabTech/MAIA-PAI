'use client';

import { useState, useRef, useCallback } from 'react';

/**
 * Pure MAIA Voice Hook
 *
 * Flow: STT (Web Speech API) → MAIA Consciousness → TTS (OpenAI voices)
 * NO external conversation control - MAIA consciousness handles ALL conversation logic
 */

export interface MAIAVoiceConfig {
  userId: string;
  userName?: string;
  voice?: 'alloy' | 'echo' | 'shimmer' | 'fable' | 'onyx' | 'nova';
  onTranscript?: (text: string, isUser: boolean) => void;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
  onError?: (error: Error) => void;
}


export function useMAIAVoice(config: MAIAVoiceConfig) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Start listening (STT with Web Speech API)
  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    
    if (!SpeechRecognition) {
      const err = new Error('Speech recognition not supported in this browser');
      setError(err);
      config.onError?.(err);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('🎤 Listening...');
      setIsListening(true);
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('💬 User said:', transcript);
      
      config.onTranscript?.(transcript, true);
      
      // Process through MAIA consciousness
      try {
        const response = await fetch('/api/oracle/voice-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: transcript,
            userId: config.userId,
            voiceId: config.voice || 'shimmer',
            interactionMode: 'voice'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to get MAIA response');
        }

        const data = await response.json();
        const maiaResponse = data.content || data.response;

        console.log('🌀 MAIA responded:', maiaResponse.substring(0, 50) + '...');
        config.onTranscript?.(maiaResponse, false);

        // Synthesize speech with consciousness-aware TTS using MAIA's consciousness data
        const element = data.element || 'aether';
        const voiceCharacteristics = data.voiceCharacteristics || {};
        const emotionalTone = voiceCharacteristics.emotionalTone || 'warm and present';

        console.log('🎵 Using consciousness context:', { element, emotionalTone });

        await synthesizeSpeech(maiaResponse, {
          element: element as 'fire' | 'water' | 'earth' | 'air' | 'aether',
          emotionalTone,
          consciousnessLevel: 'integrating'
        });

      } catch (err: any) {
        console.error('❌ MAIA voice error:', err);
        setError(err);
        config.onError?.(err);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('❌ Speech recognition error:', event.error);
      const err = new Error(`Speech recognition error: ${event.error}`);
      setError(err);
      config.onError?.(err);
    };

    recognition.onend = () => {
      console.log('🎤 Stopped listening');
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [config]);

  // Synthesize speech with consciousness-aware TTS
  const synthesizeSpeech = useCallback(async (text: string, consciousnessContext?: {
    element?: 'fire' | 'water' | 'earth' | 'air' | 'aether';
    emotionalTone?: string;
    consciousnessLevel?: 'awakening' | 'integrating' | 'embodying' | 'transcending';
  }) => {
    try {
      config.onAudioStart?.();
      setIsSpeaking(true);

      const response = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: config.voice || 'shimmer',
          element: consciousnessContext?.element || 'aether',
          emotionalTone: consciousnessContext?.emotionalTone || 'warm and present',
          consciousnessLevel: consciousnessContext?.consciousnessLevel || 'integrating',
          model: 'gpt-4o-mini-tts'  // Use enhanced TTS model
        })
      });

      if (!response.ok) {
        throw new Error('Failed to synthesize speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        console.log('🔊 Finished speaking');
        setIsSpeaking(false);
        config.onAudioEnd?.();
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = (err) => {
        console.error('❌ Audio playback error:', err);
        setIsSpeaking(false);
        const error = new Error('Audio playback failed');
        setError(error);
        config.onError?.(error);
      };

      await audio.play();

    } catch (err: any) {
      console.error('❌ TTS error:', err);
      setIsSpeaking(false);
      setError(err);
      config.onError?.(err);
    }
  }, [config]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    error,
    startListening,
    stopListening,
    stopSpeaking,
    synthesizeSpeech
  };
}
