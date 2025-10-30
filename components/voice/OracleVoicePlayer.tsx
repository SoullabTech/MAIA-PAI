'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface OracleVoicePlayerProps {
  text?: string;
  audioUrl?: string;
  autoPlay?: boolean;
  compact?: boolean;
  muted?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export default function OracleVoicePlayer({
  text,
  audioUrl,
  autoPlay = false,
  compact = false,
  muted = false,
  onPlayStateChange
}: OracleVoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Update muted state when prop changes
  useEffect(() => {
    setIsMuted(muted);
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (autoPlay && text) {
      playAudio();
    }
  }, [text, autoPlay]);

  const playAudio = async () => {
    if (!text || isPlaying || isLoading) return;

    try {
      setIsLoading(true);
      setIsPlaying(true);
      onPlayStateChange?.(true);

      // Use OpenAI TTS API for high-quality voice synthesis
      const response = await fetch('/api/voice/openai-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          agentVoice: 'maya' // Use Maya's voice configuration
        })
      });

      if (!response.ok) {
        throw new Error(`TTS API failed: ${response.status}`);
      }

      // Get audio blob
      const audioBlob = await response.blob();

      // Clean up previous audio URL
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }

      // Create new audio URL
      audioUrlRef.current = URL.createObjectURL(audioBlob);

      // Create or reuse audio element
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = audioUrlRef.current;
      audioRef.current.muted = isMuted;

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setIsLoading(false);
        onPlayStateChange?.(false);
      };

      audioRef.current.onerror = (error) => {
        console.error('Audio playback error:', error);
        setIsPlaying(false);
        setIsLoading(false);
        onPlayStateChange?.(false);
      };

      setIsLoading(false);
      await audioRef.current.play();

    } catch (error) {
      console.error('Voice synthesis error:', error);
      setIsPlaying(false);
      setIsLoading(false);
      onPlayStateChange?.(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsLoading(false);
    onPlayStateChange?.(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isPlaying ? stopAudio : playAudio}
        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!text || isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
        ) : (
          <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-amber-400' : 'text-white/60'}`} />
        )}
      </button>
      {isPlaying && (
        <button
          onClick={toggleMute}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-white/60" /> : <Volume2 className="w-4 h-4 text-white/60" />}
        </button>
      )}
    </div>
  );
}