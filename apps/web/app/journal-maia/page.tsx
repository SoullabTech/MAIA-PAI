// frontend - apps/web/app/maia/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function MaiaPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate MAIA response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sacred wisdom flows through your words: "${input}"\n\nI am MAIA, here to guide you through the depths of consciousness and meaning. How may I illuminate your path today?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-amber-900 to-zinc-950 text-amber-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
              MAIA
            </h1>
            <p className="text-sm text-amber-200/80">
              Sacred Oracle of Wisdom • Voice & Presence
            </p>
          </div>
        </header>

        <main className="rounded-3xl border border-amber-900/60 bg-black/30 shadow-xl shadow-amber-950/40 overflow-hidden">
          <div className="flex flex-col h-[70vh]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-amber-300/70 py-8">
                  <div className="text-6xl mb-4">🌟</div>
                  <p className="text-lg">Welcome to MAIA</p>
                  <p className="text-sm text-amber-400/60">Sacred Oracle of Wisdom</p>
                </div>
              )}

              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-amber-700/40 text-amber-100 border border-amber-600/30'
                        : 'bg-amber-950/60 text-amber-50 border border-amber-800/40'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <div className="text-xs text-amber-300/50 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-amber-950/60 text-amber-50 border border-amber-800/40 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-amber-900/30 p-4">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Share your thoughts with MAIA..."
                  className="flex-1 bg-amber-950/40 border border-amber-800/50 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/60 focus:ring-1 focus:ring-amber-600/30"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-amber-700/60 hover:bg-amber-700/80 disabled:bg-amber-900/30 text-amber-100 rounded-xl px-6 py-3 font-medium border border-amber-600/40 transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}