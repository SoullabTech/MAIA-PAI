/**
 * ScribeMode with Voice Integration
 * Combines voice transcription with ScribeMode's observation and reflection system
 */

'use client';

import { useState, useEffect } from 'react';
import { ScribeMode } from './ScribeMode';
import { useMaiaRealtime } from '@/hooks/useMaiaRealtime';

interface ScribeModeWithVoiceProps {
  userId: string;
  userName?: string;
}

export function ScribeModeWithVoice({ userId, userName }: ScribeModeWithVoiceProps) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [fullTranscript, setFullTranscript] = useState('');

  // Initialize voice transcription with Scribe mode
  const {
    isConnected,
    transcript,
    connect,
    disconnect
  } = useMaiaRealtime({
    mode: 'scribe',
    userId,
    userName,
    onTranscript: (text: string, isUser: boolean) => {
      if (isUser) {
        // Append user speech to full transcript
        setFullTranscript(prev => prev + '\n' + text);
      }
    }
  });

  // Handle voice toggle
  const handleVoiceToggle = async (enabled: boolean) => {
    if (enabled && !isConnected) {
      await connect();
      setVoiceEnabled(true);
    } else if (!enabled && isConnected) {
      await disconnect();
      setVoiceEnabled(false);
    } else {
      setVoiceEnabled(enabled);
    }
  };

  return (
    <div className="relative">
      {/* Voice status indicator */}
      {voiceEnabled && isConnected && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-green-900/50 border border-green-500/50 rounded-lg px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-300">Voice Active</span>
          </div>
        </div>
      )}

      {/* ScribeMode with voice integration */}
      <ScribeMode
        userId={userId}
        voiceTranscript={fullTranscript}
        voiceEnabled={voiceEnabled}
        onVoiceToggle={handleVoiceToggle}
      />
    </div>
  );
}
