'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
  role: 'user' | 'maia';
  text: string;
  timestamp: Date;
}

interface MaiaPartnerChatProps {
  context: string; // e.g., "partner-prelude"
  partnerName?: string;
}

/**
 * MAIA Partner Chat
 *
 * Lightweight chat interface for Field Partners filling out Prelude
 * Helps answer questions about the process, elements, or technical details
 */
export default function MaiaPartnerChat({ context, partnerName }: MaiaPartnerChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'maia',
      text: `Hello${partnerName ? ` ${partnerName}` : ''}. I'm MAIA, here to help as you reflect on your Soullab Inside project. If you have questions about the elements, the process, or what we're listening for — just ask.`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // TODO: Connect to MAIA API endpoint
      // For now, simulate response
      await new Promise(resolve => setTimeout(resolve, 1000));

      const maiaResponse: Message = {
        role: 'maia',
        text: generateContextualResponse(input, context),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, maiaResponse]);
    } catch (error) {
      console.error('MAIA chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'maia',
          text: "I'm having trouble connecting right now. Please email partnerships@soullab.life with your question.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-gold-amber/20 text-soul-textPrimary'
                  : 'bg-soul-surface/80 text-soul-textPrimary'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p className="text-xs text-soul-textTertiary mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-soul-surface/80 rounded-lg px-4 py-2">
              <p className="text-sm text-soul-textSecondary animate-pulse">MAIA is thinking...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-soul-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 bg-soul-background border border-soul-borderSubtle rounded-lg text-soul-textPrimary placeholder-soul-textTertiary focus:outline-none focus:border-gold-amber transition-colors text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2 bg-gold-amber/20 hover:bg-gold-amber/30 border border-gold-amber/60 rounded-lg text-gold-amber transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-soul-textTertiary mt-2 italic">
          This is a gentle space. No question is too small or too abstract.
        </p>
      </form>
    </div>
  );
}

/**
 * Generate contextual responses based on the question
 * TODO: Replace with actual MAIA API call
 */
function generateContextualResponse(question: string, context: string): string {
  const lowerQuestion = question.toLowerCase();

  // Element-specific questions
  if (lowerQuestion.includes('fire') || lowerQuestion.includes('🜂')) {
    return "Fire questions invite you into the *impulse* — the spark that says 'it's time.' Don't worry about polish here. Just sense: what momentum or restlessness is moving through you? What transformation wants to begin?";
  }

  if (lowerQuestion.includes('water') || lowerQuestion.includes('🜄')) {
    return "Water questions explore *why this matters* beneath the surface. Not market logic, but soul logic. What longing does this tend? What flow in your practice is ready to deepen or widen?";
  }

  if (lowerQuestion.includes('earth') || lowerQuestion.includes('🜃')) {
    return "Earth questions ground the vision in practical form. What needs to be held, protected, or made reliable? What functions must this space perform so your practice can breathe?";
  }

  if (lowerQuestion.includes('air') || lowerQuestion.includes('🜁')) {
    return "Air questions shape the *conversation* your space will have with visitors. How do you want people to engage? Learn? Reflect? Play? What voice will your work speak in?";
  }

  if (lowerQuestion.includes('aether') || lowerQuestion.includes('🜀') || lowerQuestion.includes('ether')) {
    return "Aether questions reach for the *essence*. When this project is alive and breathing on its own, what *is* it? Not what it does, but what presence it carries. This is the hardest to name — and the most important.";
  }

  // Process questions
  if (lowerQuestion.includes('how long') || lowerQuestion.includes('time')) {
    return "Take whatever time feels right. Some partners complete this in 20 minutes. Others return to it over a few days, letting each element settle. There's no rush — this reflection is part of the design process.";
  }

  if (lowerQuestion.includes('wrong answer') || lowerQuestion.includes('correct')) {
    return "There are no wrong answers here. We're not grading — we're *listening*. Honest fragments teach us more than polished statements. If something feels uncertain, name that uncertainty. The field breathes in the spaces between certainty.";
  }

  if (lowerQuestion.includes('skip') || lowerQuestion.includes('leave blank')) {
    return "You can leave sections blank if they don't resonate yet. But sit with them first — sometimes the questions that feel hardest to answer are pointing to the core of what wants to emerge.";
  }

  // Technical questions
  if (lowerQuestion.includes('website') || lowerQuestion.includes('build') || lowerQuestion.includes('technical')) {
    return "Don't worry about technical details yet. We'll handle the infrastructure, hosting, and all the underlying technology. Right now, we just need to feel the *shape* of your practice so we can design something that honors it.";
  }

  if (lowerQuestion.includes('cost') || lowerQuestion.includes('price') || lowerQuestion.includes('pay')) {
    return "We'll discuss service tiers during our call. Our model ranges from Seed (sliding scale for early practitioners) to Emanate (custom partnerships). The focus now is sensing if there's resonance — not logistics.";
  }

  // General encouragement
  if (lowerQuestion.includes('help') || lowerQuestion.includes('stuck') || lowerQuestion.includes('confused')) {
    return "It's okay to feel stuck. Sometimes the best responses come from sitting with the discomfort of not-knowing. Try this: instead of answering the question directly, describe what you *feel* when you read it. That feeling is data too.";
  }

  // Default response
  return "That's a beautiful question. As you reflect on it, notice what sensations or images arise. Your answers don't need to be complete sentences — fragments, metaphors, and feelings all carry meaning. We're learning to listen to what your practice already knows.";
}
