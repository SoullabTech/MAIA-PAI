/**
 * OracleConversationV2 - Simplified wrapper for testing MaiaOrchestrator
 *
 * This component uses the /api/maya-v2 endpoint which routes through
 * MaiaOrchestrator instead of calling Claude directly.
 *
 * For now, it's a minimal testing interface. Once validated, we can
 * gradually migrate full OracleConversation features.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface OracleConversationV2Props {
  userId: string;
  userName?: string;
  sessionId: string;
  voiceEnabled?: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'oracle';
  text: string;
  source?: string; // claude, telesphorus, internal, hybrid
  metadata?: any;
  timestamp: Date;
}

export const OracleConversationV2: React.FC<OracleConversationV2Props> = ({
  userId,
  userName,
  sessionId,
  voiceEnabled = true
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/maya-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          userId,
          userName,
          context: {
            conversationHistory: messages.map(m => ({
              role: m.role,
              content: m.text,
              source: m.role === 'oracle' ? 'maia' : 'user'
            })),
            emotionalIntensity: 0.5,
            intimacyLevel: messages.length / 10 // Grows with conversation length
          }
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const oracleMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'oracle',
        text: data.response,
        source: data.source,
        metadata: data.metadata,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, oracleMessage]);

    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'oracle',
        text: "I'm here with you. What's present for you right now?",
        source: 'internal',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-ain-soph-amber/20">
        <h1 className="text-2xl font-bold text-ain-soph-amber">
          Maia V2 (Orchestrator Architecture)
        </h1>
        <p className="text-ain-soph-amber/60 text-sm mt-1">
          Testing routing system: Claude → Telesphorus → Internal
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-ain-soph-amber/20 text-white'
                  : 'bg-gray-800 text-ain-soph-amber'
              }`}
            >
              <div className="text-sm">{message.text}</div>

              {/* V2 Debug Info */}
              {message.source && (
                <div className="mt-2 pt-2 border-t border-ain-soph-amber/20 text-xs opacity-60">
                  Source: {message.source}
                  {message.metadata?.processingTime && (
                    <span className="ml-2">({message.metadata.processingTime}ms)</span>
                  )}
                  {message.metadata?.intentUsed && (
                    <span className="ml-2">Intent: {message.metadata.intentUsed.type}</span>
                  )}
                  {message.metadata?.fieldState && (
                    <div className="mt-1">
                      Field Coherence: {(1 - (message.metadata.fieldState.silenceProbability || 0)).toFixed(2)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg p-4 text-ain-soph-amber">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-ain-soph-amber rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-ain-soph-amber rounded-full animate-pulse delay-100" />
                <div className="w-2 h-2 bg-ain-soph-amber rounded-full animate-pulse delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-ain-soph-amber/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-gray-900 border border-ain-soph-amber/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-ain-soph-amber"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-ain-soph-amber text-black rounded-lg font-medium hover:bg-ain-soph-amber/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>

        <div className="mt-2 text-xs text-ain-soph-amber/60">
          Session: {sessionId} | User: {userName || userId}
        </div>
      </div>
    </div>
  );
};
