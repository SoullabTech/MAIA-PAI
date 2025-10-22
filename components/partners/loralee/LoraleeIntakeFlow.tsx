"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

/**
 * Loralee's Conversational Intake Flow
 *
 * NOT a form. A conversation that feels like sitting with Loralee.
 * Uses natural language to gather birth data and soul context.
 */

interface Message {
  role: 'loralee' | 'client';
  content: string;
  timestamp: Date;
}

const INTAKE_QUESTIONS = [
  {
    question: "Welcome, {name}. I'm so glad you're here. Before we explore your birth chart together, I'd love to know: what called you to seek this reading right now?",
    field: 'intention'
  },
  {
    question: "Beautiful. Now, to create your chart, I'll need some information. When were you born? Please share your birth date (month, day, year).",
    field: 'birthDate'
  },
  {
    question: "Thank you. And do you know the time you were born? Even an approximate time helps—the rising sign shifts every couple hours, and it tells us so much about how you meet the world.",
    field: 'birthTime'
  },
  {
    question: "Perfect. Last piece: where were you born? City and state (or country if outside the US).",
    field: 'birthPlace'
  },
  {
    question: "Thank you for trusting me with this sacred information. One more thing before we begin: is there a specific area of life you'd like the chart to illuminate? (Relationships, career, spiritual path, or just 'show me what I need to see'—all are welcome.)",
    field: 'focus'
  }
];

export function LoraleeIntakeFlow({
  clientName,
  onComplete
}: {
  clientName: string;
  onComplete: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'loralee',
      content: INTAKE_QUESTIONS[0].question.replace('{name}', clientName),
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!currentInput.trim()) return;

    // Add client message
    const clientMessage: Message = {
      role: 'client',
      content: currentInput,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, clientMessage]);
    setCurrentInput('');
    setIsTyping(true);

    // Simulate Loralee "typing" then responding
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex < INTAKE_QUESTIONS.length) {
        // Next question
        const loraleeMessage: Message = {
          role: 'loralee',
          content: INTAKE_QUESTIONS[nextIndex].question.replace('{name}', clientName),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, loraleeMessage]);
        setCurrentQuestionIndex(nextIndex);
        setIsTyping(false);
      } else {
        // Complete intake
        const finalMessage: Message = {
          role: 'loralee',
          content: `Thank you, ${clientName}. I'm preparing your chart now. The cosmos has been holding this information since the moment you were born—now we get to reveal it together. ✨`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, finalMessage]);
        setIsTyping(false);

        // Move to chart after brief delay
        setTimeout(() => {
          onComplete();
        }, 3000);
      }
    }, 1500 + Math.random() * 1000); // Simulate realistic typing time
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-indigo-500/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 px-6 py-4 border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-2xl">✦</span>
            </div>
            <div>
              <h3 className="text-indigo-200 font-medium">Loralee Crowder</h3>
              <p className="text-indigo-400/70 text-sm">Astrologer • Soul Guide</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === 'client' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-5 py-3 rounded-2xl ${
                    message.role === 'client'
                      ? 'bg-indigo-600/30 text-indigo-100 border border-indigo-500/30'
                      : 'bg-purple-900/30 text-purple-100 border border-purple-500/20'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <div className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-purple-900/30 px-5 py-3 rounded-2xl border border-purple-500/20">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <motion.div
                      className="w-2 h-2 bg-purple-400 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-purple-400 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-purple-400 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <span className="text-purple-300/70 text-xs">Loralee is typing...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-indigo-500/20 bg-black/20">
          <div className="flex items-end gap-3">
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Share your response..."
              className="flex-1 bg-indigo-950/30 border border-indigo-500/30 rounded-xl px-4 py-3 text-indigo-100 placeholder-indigo-400/40 focus:outline-none focus:border-indigo-400/50 resize-none"
              rows={2}
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={!currentInput.trim() || isTyping}
              className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-indigo-400/50 text-xs mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Context Info */}
      <div className="mt-6 text-center">
        <p className="text-indigo-300/60 text-sm">
          This conversational intake replaces traditional forms—it feels like sitting with Loralee,
          not filling out paperwork.
        </p>
      </div>
    </div>
  );
}
