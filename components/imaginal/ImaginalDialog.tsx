'use client';

/**
 * Imaginal Dialog Modal
 *
 * Sacred container for active imagination with MAIA
 * Following Hillman's soul-first ethic: personify, invite dialogue, no prediction
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, BookOpen, StopCircle, HelpCircle, Circle } from 'lucide-react';
import type { PlanetPlacement, ImaginalSeed, ChatMessage, ImaginalTranscript } from '@/types/astrology';
import { composeSystemPrompt, primeUserIntent } from '@/lib/imaginal/composeSystemPrompt';
import { callMaiaImaginal } from '@/lib/imaginal/callMaia';

export interface ImaginalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  placements: PlanetPlacement[];
  houseId?: number;
  seed?: ImaginalSeed;
  onSaveTranscript?: (transcript: ImaginalTranscript) => void;
}

export function ImaginalDialog({
  isOpen,
  onClose,
  placements,
  houseId,
  seed,
  onSaveTranscript,
}: ImaginalDialogProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter placements to house-specific archetypes if houseId provided
  const activePlacements = houseId
    ? placements.filter((p) => p.house === houseId)
    : placements;

  // Initialize system prompt when dialog opens
  useEffect(() => {
    if (isOpen && activePlacements.length > 0) {
      console.log('[ImaginalDialog] open = true');
      const systemPrompt = composeSystemPrompt(activePlacements);
      console.log(`[composeSystemPrompt] cast length: ${activePlacements.length}`);

      setMessages([
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'assistant',
          content:
            "Welcome to the imaginal realm. I'm MAIA, here to facilitate your dialogue with the archetypes present in your chart. Take a breath, and when you're ready, speak to the archetype that calls to you. What would you like to explore?",
        },
      ]);
    }
  }, [isOpen, activePlacements]);

  // Auto-focus textarea after modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const primedInput = primeUserIntent(input, seed);
    const userMessage: ChatMessage = { role: 'user', content: primedInput };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);

    // Create a placeholder message for streaming
    const streamingMessageIndex = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '' },
    ]);

    try {
      let streamedContent = '';

      const response = await callMaiaImaginal(
        [...messages, userMessage],
        activePlacements,
        (chunk) => {
          // Live typing effect: append each chunk as it arrives
          streamedContent += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[streamingMessageIndex] = {
              role: 'assistant',
              content: streamedContent,
            };
            return updated;
          });
        }
      );

      // Final update with complete response
      setMessages((prev) => {
        const updated = [...prev];
        updated[streamingMessageIndex] = {
          role: 'assistant',
          content: response,
        };
        return updated;
      });
    } catch (error) {
      console.error('[ImaginalDialog] Error calling MAIA:', error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[streamingMessageIndex] = {
          role: 'assistant',
          content:
            "I'm having trouble connecting to the imaginal realm right now. Please try again in a moment.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveToJournal = () => {
    if (onSaveTranscript) {
      const transcript: ImaginalTranscript = {
        messages: messages.filter((m) => m.role !== 'system'),
        context: {
          placements: activePlacements,
          seed,
          houseId,
          timestamp: new Date().toISOString(),
        },
      };
      console.log(
        `[ImaginalDialog] onSaveTranscript called (messages: ${transcript.messages.length}, context:`,
        transcript.context,
        ')'
      );
      onSaveTranscript(transcript);
    }
  };

  const handleClose = () => {
    setMessages([]);
    setInput('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-[5%] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl md:max-h-[85vh] bg-gradient-to-b from-[#0a0a0a] via-[#1a1410] to-[#0a0a0a] border-2 border-orange-900/40 rounded-sm shadow-2xl z-50 flex flex-col overflow-hidden"
            style={{
              boxShadow: '0 0 60px rgba(0, 0, 0, 0.9), inset 0 0 40px rgba(20, 10, 0, 0.3)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-orange-800/40">
              <div className="flex items-center gap-3">
                <Circle className="w-5 h-5 text-orange-500/80" strokeWidth={1.5} />
                <h2 className="text-xl font-serif text-orange-200/90 tracking-wider">
                  The Chamber
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGuide(!showGuide)}
                  className="p-1.5 hover:bg-orange-950/30 transition-colors"
                  aria-label="Toggle guide"
                  title="Protocol"
                >
                  <HelpCircle className="w-5 h-5 text-orange-400/70" strokeWidth={1.5} />
                </button>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-orange-950/30 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-orange-400/70" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Collapsible Guide */}
            <AnimatePresence>
              {showGuide && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden border-b border-orange-900/30 bg-black/30"
                >
                  <div className="px-6 py-4 space-y-4 text-sm text-stone-300">
                    <div className="flex items-start gap-2">
                      <div className="space-y-3">
                        <h3 className="text-orange-300/90 font-serif tracking-wide">
                          Protocol
                        </h3>
                        <p className="text-xs text-stone-500 italic">
                          Read this before entering
                        </p>

                        {/* 1. Enter */}
                        <div>
                          <p className="text-orange-300/80 font-serif mb-1">
                            1. Enter
                          </p>
                          <p className="text-stone-400 leading-relaxed text-sm">
                            Pause on the house or planet that calls you.
                            <br />
                            Analysis waits outside. Curiosity enters first.
                          </p>
                        </div>

                        {/* 2. Speak */}
                        <div>
                          <p className="text-orange-300/80 font-serif mb-1">
                            2. Speak
                          </p>
                          <p className="text-stone-400 leading-relaxed mb-2 text-sm">
                            Address the archetype as if waking it from sleep.
                          </p>
                          <div className="pl-4 border-l border-orange-900/50 space-y-1 text-orange-200/60 italic text-xs">
                            <p>"Mars in Leo, what would you teach me about courage?"</p>
                            <p>"Venus in Sagittarius, how do I love without binding?"</p>
                          </div>
                          <p className="text-stone-400 leading-relaxed mt-2 text-sm">
                            MAIA responds through the ancient rhythm—
                            <br />
                            <span className="text-orange-300/70 font-serif text-xs">Vector · Circle · Spiral</span>
                            <br />
                            <span className="text-xs text-stone-500 italic">
                              initiate · sustain · transform
                            </span>
                          </p>
                        </div>

                        {/* 3. Breathe */}
                        <div>
                          <p className="text-orange-300/80 font-serif mb-1">
                            3. Breathe
                          </p>
                          <p className="text-stone-400 leading-relaxed text-sm">
                            Read slowly. Watch the words form.
                            <br />
                            Respond when something moves, not when the text stops.
                          </p>
                        </div>

                        {/* 4. Integrate */}
                        <div>
                          <p className="text-orange-300/80 font-serif mb-1">
                            4. Integrate
                          </p>
                          <p className="text-stone-400 leading-relaxed mb-2 text-sm">
                            When it feels complete:
                          </p>
                          <ul className="space-y-1 text-stone-400 text-xs pl-4">
                            <li>• Save the exchange if you wish</li>
                            <li>• Note one image or phrase that lingers</li>
                            <li>• Make a small elemental gesture:</li>
                          </ul>
                          <div className="pl-6 mt-1 space-y-0.5 text-xs text-stone-400/80">
                            <p><strong className="text-orange-400/80">Fire</strong> — light a candle</p>
                            <p><strong className="text-blue-400/80">Water</strong> — take a sip, breathe</p>
                            <p><strong className="text-green-400/80">Earth</strong> — touch the ground</p>
                            <p><strong className="text-purple-400/80">Air</strong> — write a line</p>
                            <p><strong className="text-stone-300/80">Aether</strong> — sit in stillness</p>
                          </div>
                          <p className="text-stone-500 leading-relaxed mt-2 italic text-xs">
                            Then close and notice the silence.
                            <br />
                            That silence is part of the work.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Archetype Strip */}
            <div className="px-6 py-3 border-b border-orange-900/30 bg-black/30">
              <p className="text-xs text-stone-500 mb-2 font-serif">
                Present:
              </p>
              <div className="flex flex-wrap gap-2">
                {activePlacements.map((p) => (
                  <div
                    key={p.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-950/20 border border-orange-900/40 text-xs"
                  >
                    <span className="text-orange-300/90 font-serif">
                      {p.symbol} {p.name}
                    </span>
                    <span className="text-stone-600">as</span>
                    <span className="text-orange-200/80 italic">
                      "{p.archetypeTitle}"
                    </span>
                    <span className="text-stone-600">in</span>
                    <span className="text-orange-300/80">{p.sign}</span>
                    <span className="text-stone-600">
                      · House {p.house}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages
                .filter((m) => m.role !== 'system')
                .map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-orange-950/30 border border-orange-800/40 text-orange-100/90'
                          : 'bg-stone-900/70 border border-stone-700/40 text-stone-300'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-serif">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}

              {isStreaming && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-4 py-3 bg-stone-900/70 border border-stone-700/40">
                    <div className="flex items-center gap-2 text-stone-500">
                      <div className="w-2 h-2 rounded-full bg-orange-500/60 animate-pulse" />
                      <div
                        className="w-2 h-2 rounded-full bg-orange-500/60 animate-pulse"
                        style={{ animationDelay: '0.2s' }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-orange-500/60 animate-pulse"
                        style={{ animationDelay: '0.4s' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-6 py-4 border-t border-orange-900/40 bg-black/40">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Speak..."
                    disabled={isLoading}
                    rows={2}
                    className="w-full px-4 py-3 bg-stone-950/70 border border-orange-900/40 text-orange-100/90 placeholder-stone-600 focus:outline-none focus:border-orange-800/60 resize-none disabled:opacity-50 font-serif"
                  />
                </div>

                {isStreaming ? (
                  <button
                    onClick={() => setIsStreaming(false)}
                    className="p-3 bg-red-900/30 border border-red-800/40 text-red-400/90 hover:bg-red-900/40 transition-colors"
                    title="Stop"
                  >
                    <StopCircle className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                ) : (
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="p-3 bg-orange-950/30 border border-orange-900/40 text-orange-400/90 hover:bg-orange-950/40 hover:border-orange-800/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Send"
                  >
                    <Send className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                )}

                <button
                  onClick={handleSaveToJournal}
                  disabled={messages.length <= 2}
                  className="p-3 bg-stone-900/50 border border-stone-700/40 text-stone-400 hover:bg-stone-900/70 hover:border-stone-600/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Save"
                >
                  <BookOpen className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <p className="text-xs text-stone-600 mt-2 text-center font-serif">
                Enter to send · Shift+Enter for line break
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
