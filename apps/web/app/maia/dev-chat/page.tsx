'use client';

/**
 * Development-Aware MAIA Chat
 * Chat interface where MAIA has full awareness of user's developmental metrics
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  devContextUsed?: boolean;
  metadata?: any;
}

export default function DevAwareChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devStatus, setDevStatus] = useState<{
    hasMetrics: boolean;
    metricsPreview?: any;
  } | null>(null);

  const userId = user?.id || 'demo-user';

  // Check if user has developmental data
  useEffect(() => {
    async function checkDevStatus() {
      try {
        const response = await fetch(`/api/developmental-context?userId=${userId}&format=json`);
        const data = await response.json();

        setDevStatus({
          hasMetrics: data.hasData,
          metricsPreview: data.context
        });
      } catch (err) {
        console.error('Failed to check dev status:', err);
      }
    }

    checkDevStatus();
  }, [userId]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setError(null);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/oracle/dev-aware', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          userId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Add assistant message
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.message || data.error || 'No response',
          devContextUsed: data.devContextUsed,
          metadata: data.metadata
        }
      ]);

    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black">
      <div className="max-w-4xl mx-auto p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            💬 Development-Aware MAIA
          </h1>
          <p className="text-gray-400">
            Chat with MAIA who has full awareness of your consciousness development metrics
          </p>
        </div>

        {/* Dev Status Badge */}
        {devStatus && (
          <div className={`mb-6 p-4 rounded-lg border ${
            devStatus.hasMetrics
              ? 'bg-green-900/20 border-green-700/50'
              : 'bg-amber-900/20 border-amber-700/50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">
                  {devStatus.hasMetrics ? '✅ Metrics Available' : '⏳ No Metrics Yet'}
                </div>
                <div className="text-sm text-gray-400">
                  {devStatus.hasMetrics
                    ? 'MAIA can see your developmental patterns and work with you on them'
                    : 'Generate demo data or engage with practices to populate metrics'
                  }
                </div>
              </div>
              <a
                href="/maia/insights"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
              >
                View Dashboard
              </a>
            </div>
          </div>
        )}

        {/* Suggested Questions */}
        {messages.length === 0 && (
          <div className="mb-6 space-y-2">
            <div className="text-sm font-medium text-gray-400 mb-3">Try asking:</div>
            {[
              'How am I doing with my development?',
              'What patterns do you notice in my metrics?',
              "I've been feeling scattered lately",
              'What practices would support me right now?'
            ].map((question, i) => (
              <button
                key={i}
                onClick={() => setInput(question)}
                className="block w-full text-left px-4 py-3 bg-gray-900/50 hover:bg-gray-900/70 border border-gray-700 rounded-lg text-gray-300 text-sm transition-colors"
              >
                "{question}"
              </button>
            ))}
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-4 mb-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-900/70 border border-gray-700 text-gray-200'
                }`}
              >
                {/* Message content */}
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Metadata badge for assistant messages */}
                {msg.role === 'assistant' && msg.devContextUsed !== undefined && (
                  <div className="mt-2 pt-2 border-t border-gray-700/50">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {msg.devContextUsed ? (
                        <>
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                          Developmental context used
                        </>
                      ) : (
                        <>
                          <span className="inline-block w-2 h-2 bg-gray-500 rounded-full"></span>
                          No metrics available
                        </>
                      )}
                      {msg.metadata?.trajectory && (
                        <span className="ml-2">• Trajectory: {msg.metadata.trajectory}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                  <span>MAIA is reflecting...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={sendMessage} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask MAIA about your development..."
            disabled={loading}
            className="w-full px-6 py-4 bg-gray-900/70 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Send
          </button>
        </form>

        {/* Info Footer */}
        <div className="mt-8 p-4 bg-gray-900/30 border border-gray-700 rounded-lg text-sm text-gray-400">
          <div className="font-medium text-gray-300 mb-2">How This Works:</div>
          <ul className="space-y-1 text-xs">
            <li>• MAIA fetches your developmental metrics before each response</li>
            <li>• Metrics include: coherence, presence, shift patterns, and trajectory</li>
            <li>• She can reference specific numbers and patterns in her guidance</li>
            <li>• All data is stored locally in your browser (IndexedDB)</li>
            <li>• Try asking about your metrics or describing how you feel</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
