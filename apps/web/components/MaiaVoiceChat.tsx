'use client';

import { useMaiaVoice } from '@/lib/hooks/useMaiaVoice';
import { getMaiaSystemPrompt } from '@/lib/voice/MaiaSystemPrompt';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Pause } from 'lucide-react';

export interface MaiaVoiceChatProps {
  userId?: string;
  element?: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  conversationStyle?: 'natural' | 'consciousness' | 'adaptive';
  journalContext?: string;
  autoConnect?: boolean;
  onClose?: () => void;
}

export default function MaiaVoiceChat({
  userId = 'anonymous',
  element = 'aether',
  conversationStyle = 'natural',
  journalContext = '',
  autoConnect = false,
  onClose,
}: MaiaVoiceChatProps) {
  const [selectedVoice, setSelectedVoice] = useState<'shimmer' | 'alloy' | 'nova' | 'echo'>('shimmer');

  const systemPrompt = getMaiaSystemPrompt({
    conversationStyle,
    element,
    journalContext,
  });

  const {
    isConnected,
    isSpeaking,
    isListening,
    messages,
    error,
    connect,
    disconnect,
    sendText,
    interrupt,
  } = useMaiaVoice({
    userId,
    element,
    conversationStyle,
    voice: selectedVoice,
    systemPrompt,
    autoConnect: false,
  });

  const handleVoiceChange = (voice: 'shimmer' | 'alloy' | 'nova' | 'echo') => {
    setSelectedVoice(voice);
    if (isConnected) {
      disconnect();
      setTimeout(() => connect(), 500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-950 to-sky-950/80 backdrop-blur-sm rounded-xl border border-sky-400/20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sky-400/10">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-sky-400 animate-pulse' : 'bg-sky-400/30'
          }`} />
          <span className="text-sky-200/90 text-sm font-light">MAIA</span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-sky-400/40 hover:text-sky-400/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Voice Selection - Only when not connected */}
      <AnimatePresence>
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-b border-sky-400/10"
          >
            <label className="block text-xs text-sky-300/60 mb-3 font-light tracking-wide">
              Voice
            </label>
            <div className="flex gap-2">
              {(['shimmer', 'alloy', 'nova', 'echo'] as const).map((voice) => (
                <button
                  key={voice}
                  onClick={() => handleVoiceChange(voice)}
                  className={`px-3 py-1.5 rounded-full text-xs capitalize transition-all font-light ${
                    selectedVoice === voice
                      ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40'
                      : 'bg-sky-500/5 text-sky-300/60 border border-sky-400/10 hover:border-sky-400/30 hover:text-sky-300'
                  }`}
                >
                  {voice}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status */}
      <div className="px-4 py-3 bg-sky-950/50">
        {isConnected ? (
          <div className="flex items-center gap-2 text-xs font-light">
            {isSpeaking && (
              <div className="flex items-center gap-2 text-sky-300">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-3 bg-sky-400 animate-pulse rounded-full" style={{ animationDelay: '0ms' }} />
                  <div className="w-0.5 h-3 bg-sky-400 animate-pulse rounded-full" style={{ animationDelay: '150ms' }} />
                  <div className="w-0.5 h-3 bg-sky-400 animate-pulse rounded-full" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Speaking</span>
              </div>
            )}
            {isListening && !isSpeaking && (
              <div className="flex items-center gap-2 text-sky-400">
                <Mic className="w-3 h-3" />
                <span>Listening</span>
              </div>
            )}
            {!isListening && !isSpeaking && (
              <span className="text-sky-400/50">Connected</span>
            )}
          </div>
        ) : (
          <p className="text-xs text-sky-400/40 font-light">
            Ready to connect
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-sky-300/70 text-sm font-light">Just start speaking</p>
            <p className="text-sky-400/40 text-xs mt-2 font-light">
              I'm listening
            </p>
          </motion.div>
        )}

        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg ${
                msg.isUser
                  ? 'bg-sky-500/10 text-sky-200/90 border border-sky-400/20'
                  : 'bg-sky-400/5 text-sky-200/80 border border-sky-400/10'
              }`}
            >
              <p className="text-sm leading-relaxed font-light">{msg.text}</p>
              <p className="text-xs text-sky-400/30 mt-2 font-light">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 bg-red-900/10 border-t border-red-500/20">
          <p className="text-xs text-red-400/80 font-light">{error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="p-4 border-t border-sky-400/10">
        {!isConnected ? (
          <button
            onClick={connect}
            className="w-full py-3 bg-transparent border border-sky-400/30 text-sky-300 rounded-full font-light text-sm hover:border-sky-400/60 hover:text-sky-200 transition-all duration-300"
          >
            Connect
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={interrupt}
              disabled={!isSpeaking}
              className={`flex-1 py-3 rounded-full transition-all font-light text-sm flex items-center justify-center gap-2 ${
                isSpeaking
                  ? 'bg-sky-500/10 border border-sky-400/30 text-sky-300 hover:bg-sky-500/20'
                  : 'bg-sky-500/5 text-sky-400/30 border border-sky-400/10 cursor-not-allowed'
              }`}
            >
              <Pause className="w-3 h-3" />
              Interrupt
            </button>
            <button
              onClick={disconnect}
              className="flex-1 py-3 bg-sky-500/5 border border-sky-400/20 text-sky-300/70 rounded-full font-light text-sm hover:bg-sky-500/10 hover:text-sky-300 transition-all flex items-center justify-center gap-2"
            >
              <MicOff className="w-3 h-3" />
              End
            </button>
          </div>
        )}
      </div>

      {/* Debug - Dev only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="px-4 py-2 bg-black/20 border-t border-sky-400/5 text-xs font-mono">
          <div className="flex gap-3 text-sky-400/30">
            <span>{isConnected ? '●' : '○'}</span>
            <span>{isSpeaking ? '🔊' : '🔇'}</span>
            <span>{isListening ? '👂' : '·'}</span>
            <span>{messages.length} msgs</span>
          </div>
        </div>
      )}
    </div>
  );
}
