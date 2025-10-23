'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  command?: string;
  metadata?: {
    type?: 'refactor' | 'explain' | 'mirror' | 'ritual';
    files?: string[];
    insights?: string[];
  };
}

export interface Revelation {
  type: 'diff' | 'insight' | 'glyph' | 'poetry';
  content: string;
  metadata?: any;
}

interface ClaudeConsoleProps {
  onRevelation?: (revelation: Revelation) => void;
}

const COMMANDS = {
  '/refactor': 'Alchemical code transformation',
  '/explain': 'Illuminate hidden patterns',
  '/mirror': 'Reflect current system state',
  '/ritual': 'Invoke sacred development practice',
  '/help': 'Show available commands'
};

export function ClaudeConsole({ onRevelation }: ClaudeConsoleProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'system',
      content: 'The Architect awakens. May clarity guide creation.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const parseCommand = (input: string): { command?: string; args: string } => {
    const trimmed = input.trim();
    if (trimmed.startsWith('/')) {
      const parts = trimmed.split(' ');
      const command = parts[0];
      const args = parts.slice(1).join(' ');
      return { command, args };
    }
    return { args: trimmed };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const { command, args } = parseCommand(input);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      command
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      // Handle special commands
      if (command === '/help') {
        const helpMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'system',
          content: Object.entries(COMMANDS)
            .map(([cmd, desc]) => `${cmd} — ${desc}`)
            .join('\n'),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, helpMessage]);
        setIsThinking(false);
        return;
      }

      // Call Claude API
      const response = await fetch('/api/claude/sanctuary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.slice(-10), // Last 10 for context
          input: args,
          command: command?.replace('/', '')
        })
      });

      const data = await response.json();

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
        metadata: data.metadata
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Emit revelation if present
      if (data.revelation && onRevelation) {
        onRevelation(data.revelation);
      }

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 3).toString(),
        role: 'system',
        content: 'Connection to the Architect disrupted. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-950 to-indigo-950 rounded-lg border border-indigo-800/30 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-indigo-900/20 border-b border-indigo-800/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-indigo-300 font-mono">claude-sonnet-4-5</span>
        </div>
        <button
          onClick={() => setMessages([messages[0]])}
          className="text-xs text-indigo-400 hover:text-amber-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-indigo-800 scrollbar-track-transparent">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`
                flex flex-col gap-1
                ${message.role === 'user' ? 'items-end' : 'items-start'}
              `}
            >
              {/* Timestamp */}
              <span className="text-xs text-indigo-500 font-mono">
                {formatTimestamp(message.timestamp)}
              </span>

              {/* Message bubble */}
              <div
                className={`
                  max-w-[85%] px-4 py-3 rounded-lg
                  ${message.role === 'user'
                    ? 'bg-indigo-700/40 text-indigo-100'
                    : message.role === 'system'
                    ? 'bg-amber-900/20 text-amber-200 border border-amber-800/30'
                    : 'bg-slate-800/40 text-slate-200'}
                `}
              >
                {message.command && (
                  <div className="text-xs text-amber-400 font-mono mb-1">
                    {message.command}
                  </div>
                )}
                <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {message.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Thinking indicator */}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-indigo-400"
          >
            <div className="flex gap-1">
              <motion.div
                className="w-2 h-2 rounded-full bg-indigo-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-indigo-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-indigo-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <span className="text-sm">The Architect contemplates...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-slate-900/40 border-t border-indigo-800/30">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the Architect... (type /help for commands)"
            className="
              flex-1 px-4 py-2 bg-slate-900/60 border border-indigo-800/40
              rounded-lg text-slate-200 placeholder-indigo-500
              focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30
              font-mono text-sm transition-all
            "
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="
              px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600
              text-white rounded-lg font-medium
              hover:from-indigo-500 hover:to-purple-500
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200
            "
          >
            Send
          </button>
        </div>
        <div className="mt-2 text-xs text-indigo-500 font-mono">
          Commands: {Object.keys(COMMANDS).join(' · ')}
        </div>
      </form>
    </div>
  );
}
