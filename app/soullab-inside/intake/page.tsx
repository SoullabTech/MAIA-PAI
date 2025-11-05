'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Sparkles, Download, Mail } from 'lucide-react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface IntakeData {
  businessName?: string;
  clientName?: string;
  email?: string;
  website?: string;
  businessModel?: string[];
  topGoals?: string[];
  uniqueValue?: string;
  customers?: {
    persona1?: string;
    persona2?: string;
  };
  products?: {
    totalSKUs?: number;
    categories?: string[];
    priceRange?: { low?: number; high?: number; average?: number };
  };
  features?: {
    subscriptions?: string;
    personalization?: string;
    conversationalAI?: string;
  };
  budget?: string;
  timeline?: string;
  magicWand?: string;
  rawResponses?: Record<string, string>;
}

export default function SoullabInsideIntake() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [intakeData, setIntakeData] = useState<IntakeData>({
    rawResponses: {}
  });
  const [sessionId] = useState(() => `intake_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start conversation automatically
    startIntake();
  }, []);

  const startIntake = () => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: `Welcome to Soullab Inside 🌿

I'm MAIA, and I'll be guiding you through our partnership discovery process. Instead of filling out a long form, we're going to have a conversation—like you would with Kelly herself.

This usually takes 30-45 minutes, but we can pause anytime and pick up where we left off. I'll ask about your business, your vision, your customers, and what kind of digital experience you want to create.

Ready to begin?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const saveIntakeData = async (data: IntakeData) => {
    try {
      // Save to localStorage for persistence
      localStorage.setItem(`intake_${sessionId}`, JSON.stringify(data));

      // Also save to database/Supabase
      await fetch('/api/soullab-inside/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          data,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error saving intake data:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/soullab-inside/intake-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages: [...messages, userMessage],
          intakeData,
        }),
      });

      const { message, updatedData } = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (updatedData) {
        setIntakeData(updatedData);
        await saveIntakeData(updatedData);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I apologize, but I encountered an error. Could you please try again?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const exportIntakeData = () => {
    const exportData = {
      sessionId,
      timestamp: new Date().toISOString(),
      messages,
      structuredData: intakeData,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soullab_intake_${sessionId}.json`;
    a.click();
  };

  const emailToKelly = async () => {
    try {
      await fetch('/api/soullab-inside/email-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages,
          intakeData,
          recipientEmail: 'kelly@soullab.org',
        }),
      });

      alert('Your responses have been sent to Kelly! She\'ll be in touch within 2-3 business days.');
    } catch (error) {
      console.error('Error emailing intake:', error);
      alert('There was an error sending your responses. Please try downloading them instead.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 text-amber-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              Soullab Inside
            </h1>
          </div>
          <p className="text-amber-300/80">Partnership Discovery with MAIA</p>
        </div>

        {/* Conversation */}
        <div className="bg-black/20 backdrop-blur-sm border border-amber-500/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Messages Area */}
          <div className="h-[60vh] overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                    msg.role === 'user'
                      ? 'bg-amber-600/30 border border-amber-500/40 text-amber-100'
                      : 'bg-indigo-900/40 border border-indigo-500/30 text-amber-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div className="text-xs opacity-50 mt-2">
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-indigo-900/40 border border-indigo-500/30 rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-2 text-amber-300">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-75" />
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-150" />
                    <span className="ml-2">MAIA is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-amber-500/20 p-4 bg-black/30">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response here..."
                className="flex-1 bg-black/40 border-amber-500/30 text-amber-100 placeholder:text-amber-400/40 focus:border-amber-400 min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-amber-600 hover:bg-amber-500 text-black font-semibold px-6"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex gap-2 mt-3">
              <Button
                onClick={exportIntakeData}
                variant="outline"
                size="sm"
                className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Responses
              </Button>

              <Button
                onClick={emailToKelly}
                variant="outline"
                size="sm"
                className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email to Kelly
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/20 border border-amber-500/20 rounded-full text-sm text-amber-300/80">
            <Sparkles className="w-4 h-4" />
            <span>Session ID: {sessionId.slice(-8)}</span>
          </div>
        </div>

        {/* Data Preview (Dev Mode) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-black/40 border border-amber-500/20 rounded-lg">
            <h3 className="text-sm font-semibold text-amber-400 mb-2">
              Captured Data (Dev Mode):
            </h3>
            <pre className="text-xs text-amber-300/60 overflow-auto max-h-40">
              {JSON.stringify(intakeData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
