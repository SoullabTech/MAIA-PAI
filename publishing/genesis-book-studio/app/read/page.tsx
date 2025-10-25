'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Sparkles,
  Home,
  MessageCircle,
  Send,
  Lightbulb,
  Map,
  X,
} from 'lucide-react'

// Sample book content
const BOOK_CONTENT = {
  introduction: {
    title: 'Introduction: The Call to Transformation',
    content: `
      <p>There comes a moment in every seeker's journey when the old maps no longer serve. The comfortable certainties dissolve. The well-worn paths lead nowhere.</p>

      <p>This is not a crisis. <strong>This is an invitation.</strong></p>

      <p>You are standing at the threshold of transformation—a sacred crossing point the ancients knew well. They called it by many names: the hero's journey, the dark night of the soul, the alchemical dissolution. We call it <em>awakening</em>.</p>

      <p class="quote">"The wound is the place where the Light enters you." — Rumi</p>

      <p>In this book, you will learn to work with four fundamental forces—Fire, Water, Earth, and Air—not as mere metaphors, but as living intelligences that shape consciousness itself.</p>

      <h3>The Four Elements as Gates</h3>

      <p>Each element represents both a challenge and a gift:</p>

      <ul>
        <li><strong class="element-fire">Fire</strong> — Vision, transformation, the creative spark</li>
        <li><strong class="element-air">Air</strong> — Clarity, communication, mental freedom</li>
        <li><strong class="element-water">Water</strong> — Flow, emotion, intuitive wisdom</li>
        <li><strong class="element-earth">Earth</strong> — Grounding, structure, manifestation</li>
      </ul>

      <p>Together, they form a complete system of transformation. A map for navigating the territory of awakening.</p>
    `,
  },
}

interface Message {
  role: 'user' | 'maia'
  content: string
  suggestions?: string[]
  timestamp: Date
}

export default function ReadingExperience() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'maia',
      content: "Welcome to Elemental Alchemy! I'm MAIA, your reading companion. I'm here to guide you through this transformative journey.\n\nBefore we begin, help me understand: What brought you to this book today?",
      suggestions: [
        "I'm seeking clarity and direction",
        "I'm in a major life transition",
        "I want to understand myself better",
        "Just curious about the elements",
      ],
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [showPathSelector, setShowPathSelector] = useState(false)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  const paths = [
    {
      id: 'seeker',
      name: 'The Seeker Path',
      icon: '🔥',
      description: 'Spiritual journey, deeper meaning, transformation',
      color: 'fire',
    },
    {
      id: 'scientist',
      name: 'The Scientist Path',
      icon: '🧠',
      description: 'Evidence-based, neuroscience, research-backed',
      color: 'air',
    },
    {
      id: 'practical',
      name: 'The Practical Path',
      icon: '🎯',
      description: 'Just tell me what to DO, practices first',
      color: 'water',
    },
    {
      id: 'healing',
      name: 'The Healing Path',
      icon: '💚',
      description: 'Gentle, trauma-informed, emotional support',
      color: 'earth',
    },
  ]

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    // Add user message
    const userMsg: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    }

    // Generate MAIA response based on context
    let maiaResponse = generateMAIAResponse(inputMessage, messages)

    setMessages([...messages, userMsg, maiaResponse])
    setInputMessage('')
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
    setTimeout(() => handleSendMessage(), 100)
  }

  const handleSelectPath = (pathId: string) => {
    setSelectedPath(pathId)
    setShowPathSelector(false)

    const pathResponses = {
      seeker: {
        content: "Beautiful! You're on a spiritual journey. Let me guide you through a transformative path:\n\n**Your Seeker Path:**\n\n1. Start with Introduction (current chapter)\n2. The Four Elements as Gates - Your map\n3. Choose one element that calls to you\n4. Practice that element for a week\n5. Return for next steps\n\nThis is a journey, not a race. As you read the Introduction, notice which element resonates most. That's your starting gate.\n\nReady to continue reading? I'll be here when you have questions.",
        suggestions: [
          "Which element should I start with?",
          "How do I know which element I need?",
          "Can you explain the Seeker Path more?",
        ],
      },
      scientist: {
        content: "Perfect! Let's start with evidence and build from there:\n\n**Your Scientist Path:**\n\n1. Skip Introduction → Go to Neuroscience of Awakening (Chapter 7)\n2. McGilchrist's Hemisphere Model - Brain science\n3. Research on contemplative practices\n4. Try ONE practice - Experience before belief\n5. Return to elemental framework with context\n\nI'll provide citations and research summaries as we go. The science is solid - you'll see.\n\nWant to jump to the neuroscience chapter now? Or continue reading Introduction?",
        suggestions: [
          "Show me the neuroscience first",
          "What's the evidence for this?",
          "How does Jung's work fit in?",
        ],
      },
      practical: {
        content: "Great! Let's get you practicing immediately:\n\n**Your Practical Path:**\n\n1. 5-Minute Element Assessment (I'll guide you)\n2. Your element's core practice - Start today\n3. Do this daily for one week\n4. Then read your element's chapter\n5. Expand to other elements\n\nTheory follows experience. You'll understand WHY things work AFTER you've felt them.\n\nReady to discover your primary element? Let's do the quick assessment now.",
        suggestions: [
          "Yes, let's do the assessment",
          "Just give me a practice to start",
          "How long until I see results?",
        ],
      },
      healing: {
        content: "Thank you for trusting me with your healing journey. We'll go gently:\n\n**Your Healing Path:**\n\n1. Grounding practice FIRST - Safety and presence\n2. Water element chapter - Emotional intelligence\n3. Shadow work - Gentle introduction\n4. Integration at YOUR pace\n5. Other elements when ready\n\nImportant: Skip anything overwhelming. Take breaks. This book is a resource, not a prescription.\n\nWant to start with a simple grounding practice? Just 3 minutes.",
        suggestions: [
          "Yes, teach me grounding",
          "I'm not sure I'm ready",
          "Can you explain shadow work gently?",
        ],
      },
    }

    const response: Message = {
      role: 'maia',
      ...pathResponses[pathId as keyof typeof pathResponses],
      timestamp: new Date(),
    }

    setMessages([...messages, response])
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-parchment/10 to-white">
      {/* Header */}
      <header className="border-b border-leather/20 bg-white/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded transition">
            <Home size={20} className="text-gray-600" />
          </Link>

          <div className="border-l border-gray-300 h-6"></div>

          <div className="flex items-center gap-2">
            <BookOpen className="text-fire" size={24} />
            <div>
              <h1 className="font-heading font-bold text-gray-900">
                Elemental Alchemy
              </h1>
              <p className="text-xs text-gray-500">Beta Readers Copy • With MAIA Guide</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowPathSelector(true)}
          className="flex items-center gap-2 px-4 py-2 bg-air/10 text-air rounded-lg hover:bg-air/20 transition font-semibold text-sm"
        >
          <Map size={16} />
          Choose Your Path
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Book Content */}
        <div className="flex-1 overflow-auto px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <span className="px-3 py-1 bg-fire/10 text-fire rounded-full text-xs font-semibold">
                Introduction
              </span>
            </div>

            <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8">
              {BOOK_CONTENT.introduction.title}
            </h1>

            <div
              className="prose prose-book"
              dangerouslySetInnerHTML={{ __html: BOOK_CONTENT.introduction.content }}
            />

            <div className="mt-12 p-6 bg-air/5 border-2 border-air/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Lightbulb className="text-air flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-heading font-bold text-air mb-2">
                    MAIA Insight
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Notice which element you felt drawn to as you read. That&apos;s often your entry point.
                    Fire speaks to visionaries, Water to empaths, Air to thinkers, Earth to builders.
                    There&apos;s no wrong starting place - only YOUR starting place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIA Companion Panel */}
        <div className="w-96 border-l border-leather/20 bg-gradient-to-br from-air/5 to-white flex flex-col">
          {/* Panel Header */}
          <div className="p-6 border-b border-leather/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-air to-water flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h2 className="font-heading font-bold text-gray-900">MAIA</h2>
                <p className="text-xs text-gray-600">Your Reading Companion</p>
              </div>
            </div>
            {selectedPath && (
              <div className="mt-3 px-3 py-2 bg-air/10 rounded-lg">
                <p className="text-xs font-semibold text-air">
                  Following: {paths.find((p) => p.id === selectedPath)?.name}
                </p>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${
                  msg.role === 'maia'
                    ? 'bg-air/5 border border-air/20'
                    : 'bg-gray-100 border border-gray-200 ml-8'
                } rounded-lg p-4`}
              >
                <div className="flex items-start gap-2 mb-2">
                  {msg.role === 'maia' && (
                    <Sparkles className="text-air flex-shrink-0 mt-1" size={14} />
                  )}
                  {msg.role === 'user' && (
                    <MessageCircle className="text-gray-600 flex-shrink-0 mt-1" size={14} />
                  )}
                  <p className="text-xs font-semibold text-gray-600">
                    {msg.role === 'maia' ? 'MAIA' : 'You'}
                  </p>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>

                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.suggestions.map((suggestion, sidx) => (
                      <button
                        key={sidx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left px-3 py-2 bg-white border border-air/30 rounded hover:border-air hover:bg-air/5 transition text-xs text-gray-700"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-leather/20 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask MAIA anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-air text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="px-4 py-2 bg-air text-white rounded-lg hover:bg-air-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Path Selector Modal */}
      {showPathSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-gray-900">
                Choose Your Reading Path
              </h2>
              <button
                onClick={() => setShowPathSelector(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 mb-8">
              MAIA will adapt to your learning style and guide you through the book in the way that works best for YOU.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {paths.map((path) => (
                <button
                  key={path.id}
                  onClick={() => handleSelectPath(path.id)}
                  className="text-left p-6 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:border-air hover:shadow-lg transition"
                >
                  <div className="text-3xl mb-3">{path.icon}</div>
                  <h3 className="font-heading font-bold text-lg mb-2 text-gray-900">
                    {path.name}
                  </h3>
                  <p className="text-sm text-gray-600">{path.description}</p>
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 text-center mt-6">
              Don&apos;t worry - you can change paths anytime during your reading journey
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to generate MAIA responses
function generateMAIAResponse(userMessage: string, conversationHistory: Message[]): Message {
  const lower = userMessage.toLowerCase()

  // Context-aware responses
  if (lower.includes('seeking') || lower.includes('clarity') || lower.includes('direction')) {
    return {
      role: 'maia',
      content: "Seeking clarity is itself a form of clarity - you know something needs to shift.\n\nBefore we dive into the book, I'd love to understand your learning style. How do you best absorb wisdom?\n\nChoose the approach that resonates:",
      suggestions: [
        "Show me the science first",
        "Guide me through practices",
        "I want the full spiritual journey",
        "Go gently, I'm healing",
      ],
      timestamp: new Date(),
    }
  }

  if (lower.includes('transition') || lower.includes('change') || lower.includes('crisis')) {
    return {
      role: 'maia',
      content: "Life transitions are exactly what the Torus of Change explains. You're in the dissolution phase right now - it's supposed to feel chaotic.\n\nHere's what would help immediately:\n\n1. Read \"The Torus of Change\" section (Chapter 2)\n2. Try the grounding practice (5 minutes)\n3. Come back and we'll talk about where you are\n\nWould you like me to guide you to the Torus section now? Or do you want to continue with the Introduction?",
      suggestions: [
        "Take me to the Torus of Change",
        "I'll finish the Introduction first",
        "Tell me more about dissolution",
      ],
      timestamp: new Date(),
    }
  }

  if (lower.includes('understand') || lower.includes('learn') || lower.includes('know')) {
    return {
      role: 'maia',
      content: "Beautiful! Self-understanding is the foundation of transformation.\n\nThe four elements are like a personality map, but deeper - they reveal your consciousness patterns:\n\n• **Fire** people are visionaries and creators\n• **Air** people are thinkers and communicators\n• **Water** people are feelers and empaths\n• **Earth** people are builders and manifestors\n\nMost of us have a primary element and need to develop the others.\n\nWant to discover your primary element? I can guide you through a quick assessment.",
      suggestions: [
        "Yes, let's find my element",
        "Tell me more about the elements first",
        "How do I develop all four?",
      ],
      timestamp: new Date(),
    }
  }

  // Default response
  return {
    role: 'maia',
    content: "I'm here to help you navigate this book in whatever way serves you best.\n\nYou can:\n• Ask me questions about what you're reading\n• Request a personalized reading path\n• Get practice guidance\n• Explore concepts more deeply\n\nWhat would be most helpful right now?",
    suggestions: [
      "Help me choose a reading path",
      "Explain the four elements",
      "What should I read first?",
    ],
    timestamp: new Date(),
  }
}
