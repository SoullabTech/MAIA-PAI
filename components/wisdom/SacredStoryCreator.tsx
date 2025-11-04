'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { BookOpen, Sparkles, ArrowLeft, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Sacred Story Creator
 * Cinematic MAIA Aesthetics - Professional and immersive
 *
 * Philosophy: Ancient wisdom meets cinema-grade interface
 * Branding: Soullab holoflower + warm amber accents
 */

interface StoryCreatorProps {
  onGenerate?: (config: StoryConfig) => void;
}

interface StoryConfig {
  userContext: string;
  tradition: string;
  archetype?: string;
  element?: string;
  theme?: string;
  length: string;
  tone?: string;
}

const WISDOM_TRADITIONS = [
  { id: 'indigenous', name: 'Indigenous Wisdom', icon: '🌍', description: 'Earth-based teachings' },
  { id: 'buddhist', name: 'Buddhist', icon: '☸️', description: 'Mindfulness & compassion' },
  { id: 'sufi', name: 'Sufi', icon: '🌙', description: 'Mystical poetry & divine love' },
  { id: 'taoist', name: 'Taoist', icon: '☯️', description: 'Flow & natural order' },
  { id: 'celtic', name: 'Celtic', icon: '🍃', description: 'Nature cycles & ancient magic' },
  { id: 'hermetic', name: 'Hermetic', icon: '⚡', description: 'As above, so below' },
  { id: 'yogic', name: 'Yogic', icon: '🧘', description: 'Union & consciousness' },
  { id: 'kabbalistic', name: 'Kabbalistic', icon: '✡️', description: 'Tree of life wisdom' },
  { id: 'gnostic', name: 'Gnostic', icon: '👁️', description: 'Direct inner knowing' },
  { id: 'shamanic', name: 'Shamanic', icon: '🦅', description: 'Spirit journeys & medicine' },
];

const ARCHETYPES = [
  { id: 'healer', name: 'Healer', icon: '🌿' },
  { id: 'warrior', name: 'Warrior', icon: '⚔️' },
  { id: 'sage', name: 'Sage', icon: '📜' },
  { id: 'mystic', name: 'Mystic', icon: '✨' },
  { id: 'creator', name: 'Creator', icon: '🎨' },
  { id: 'explorer', name: 'Explorer', icon: '🧭' },
];

const ELEMENTS = [
  { id: 'any', name: 'Any', icon: '○' },
  { id: 'fire', name: 'Fire', icon: '🔥' },
  { id: 'water', name: 'Water', icon: '💧' },
  { id: 'earth', name: 'Earth', icon: '🌍' },
  { id: 'air', name: 'Air', icon: '💨' },
  { id: 'aether', name: 'Aether', icon: '✨' },
];

const TONES = [
  { id: 'any', name: 'Any' },
  { id: 'reflective', name: 'Reflective' },
  { id: 'inspiring', name: 'Inspiring' },
  { id: 'challenging', name: 'Challenging' },
  { id: 'comforting', name: 'Comforting' },
  { id: 'mystical', name: 'Mystical' },
];

const STORY_LENGTHS = [
  { id: 'brief', name: 'Brief', icon: '📖', description: '2-3 minutes' },
  { id: 'medium', name: 'Medium', icon: '📚', description: '5-7 minutes' },
  { id: 'extended', name: 'Extended', icon: '📜', description: '10+ minutes' },
];

export function SacredStoryCreator({ onGenerate }: StoryCreatorProps) {
  const router = useRouter();
  const [userContext, setUserContext] = useState('');
  const [tradition, setTradition] = useState('');
  const [archetype, setArchetype] = useState('');
  const [element, setElement] = useState('any');
  const [theme, setTheme] = useState('');
  const [length, setLength] = useState('medium');
  const [tone, setTone] = useState('any');

  const handleGenerate = () => {
    if (!userContext || !tradition) return;

    onGenerate?.({
      userContext,
      tradition,
      archetype: archetype || undefined,
      element: element !== 'any' ? element : undefined,
      theme: theme || undefined,
      length,
      tone: tone !== 'any' ? tone : undefined,
    });
  };

  const canGenerate = userContext.trim() !== '' && tradition !== '';

  return (
    <div className="min-h-screen bg-[#1a1f3a] text-white">
      {/* Sacred Geometry Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <svg viewBox="0 0 1000 1000" className="w-full h-full">
          <circle cx="500" cy="500" r="400" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="500" cy="500" r="200" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="4 4" />
          <path d="M 500 100 L 900 500 L 500 900 L 100 500 Z" fill="none" stroke="#F6AD55" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-amber-500/10 bg-[#1a1f3a]/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Holoflower Logo */}
              <div className="w-10 h-10 relative opacity-80 hover:opacity-100 transition-opacity">
                <Image
                  src="/holoflower.svg"
                  alt="Soullab"
                  width={40}
                  height={40}
                />
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <h1 className="text-xl font-light text-amber-50 tracking-wide">
                    Sacred Story Creator
                  </h1>
                </div>
                <p className="text-xs text-amber-400/60 mt-0.5">
                  46+ Global Wisdom Traditions
                </p>
              </div>
            </div>

            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="space-y-10">
          {/* User Context Input - HERO SECTION */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-amber-500/5 to-purple-500/5 border-2 border-amber-500/20 rounded-2xl p-8"
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl font-light text-amber-100 tracking-wide">
                  Share Your Story
                </h2>
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-base text-amber-200/80 max-w-2xl mx-auto leading-relaxed">
                What's alive in your heart right now? What question, challenge, or transition are you navigating?
              </p>
            </div>

            <textarea
              value={userContext}
              onChange={(e) => setUserContext(e.target.value)}
              placeholder="I'm feeling called to make a big life change, but I'm afraid of letting go of what's familiar...

Or perhaps: I just went through a difficult loss and I'm trying to find meaning in it...

Or maybe: I'm at a crossroads and don't know which path to choose..."
              rows={10}
              className="
                w-full px-6 py-5 rounded-xl
                bg-[#0A0D16]/60 border-2 border-amber-500/30
                text-amber-50 text-lg placeholder:text-amber-100/30
                focus:outline-none focus:border-amber-500/60 focus:bg-[#0A0D16]/80 focus:shadow-lg focus:shadow-amber-500/10
                transition-all resize-none
                leading-relaxed
              "
            />

            <p className="text-sm text-amber-200/70 mt-4 text-center">
              MAIA will craft a sacred story woven from ancient wisdom, speaking directly to your soul's journey
            </p>
          </motion.section>

          {/* Wisdom Tradition Selection */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="flex items-center gap-2 text-sm font-medium text-amber-400 mb-4 tracking-wide">
              <Sparkles className="w-4 h-4" />
              SELECT WISDOM TRADITION *
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {WISDOM_TRADITIONS.map((t) => (
                <motion.button
                  key={t.id}
                  onClick={() => setTradition(t.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`
                    relative p-4 rounded-xl text-left transition-all
                    ${tradition === t.id
                      ? 'bg-amber-500/10 border-2 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-white/5 border-2 border-white/10 hover:border-amber-500/30 hover:bg-white/8'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{t.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base font-medium text-amber-50">
                          {t.name}
                        </span>
                        {tradition === t.id && (
                          <Check className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                      <p className="text-sm text-amber-100/60">
                        {t.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.section>

          {/* Archetype Selection */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-amber-400/80 mb-4 tracking-wide">
              ARCHETYPE (OPTIONAL)
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ARCHETYPES.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setArchetype(archetype === a.id ? '' : a.id)}
                  className={`
                    p-3 rounded-lg text-left transition-all flex items-center gap-3
                    ${archetype === a.id
                      ? 'bg-amber-500/10 border-2 border-amber-500/50'
                      : 'bg-white/5 border-2 border-white/10 hover:border-amber-500/30'
                    }
                  `}
                >
                  <span className="text-xl">{a.icon}</span>
                  <span className="text-sm font-medium text-amber-50">{a.name}</span>
                  {archetype === a.id && (
                    <Check className="w-4 h-4 text-amber-400 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Element & Length Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Element Selection */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-amber-400/80 mb-4 tracking-wide">
                ELEMENT
              </label>

              <div className="grid grid-cols-3 gap-2">
                {ELEMENTS.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setElement(e.id)}
                    className={`
                      px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                      ${element === e.id
                        ? 'bg-amber-500/10 border-2 border-amber-500/50 text-amber-50'
                        : 'bg-white/5 border-2 border-white/10 text-amber-100/60 hover:border-amber-500/30'
                      }
                    `}
                  >
                    <span>{e.icon}</span>
                    <span>{e.name}</span>
                  </button>
                ))}
              </div>
            </motion.section>

            {/* Story Length */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-amber-400/80 mb-4 tracking-wide">
                STORY LENGTH
              </label>

              <div className="space-y-2">
                {STORY_LENGTHS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLength(l.id)}
                    className={`
                      w-full p-3 rounded-lg text-left transition-all flex items-center gap-3
                      ${length === l.id
                        ? 'bg-amber-500/10 border-2 border-amber-500/50'
                        : 'bg-white/5 border-2 border-white/10 hover:border-amber-500/30'
                      }
                    `}
                  >
                    <span className="text-xl">{l.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-amber-50">{l.name}</div>
                      <div className="text-xs text-amber-100/60">{l.description}</div>
                    </div>
                    {length === l.id && (
                      <Check className="w-4 h-4 text-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Theme Input */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-amber-400/80 mb-4 tracking-wide">
              THEME (OPTIONAL)
            </label>

            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g., transformation, courage, letting go..."
              className="
                w-full px-4 py-3.5 rounded-xl
                bg-white/5 border-2 border-white/10
                text-amber-50 placeholder:text-amber-100/40
                focus:outline-none focus:border-amber-500/50 focus:bg-white/8
                transition-all
              "
            />
          </motion.section>

          {/* Tone Selection */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-medium text-amber-400/80 mb-4 tracking-wide">
              TONE
            </label>

            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`
                    px-5 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${tone === t.id
                      ? 'bg-amber-500/10 border-2 border-amber-500/50 text-amber-50'
                      : 'bg-white/5 border-2 border-white/10 text-amber-100/60 hover:border-amber-500/30'
                    }
                  `}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Generate Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="pt-4"
          >
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`
                w-full py-5 rounded-xl text-base font-medium tracking-wide
                transition-all duration-300
                ${canGenerate
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:shadow-2xl hover:shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-white/5 border-2 border-white/10 text-amber-100/40 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>{canGenerate ? 'Weave My Sacred Story' : 'Share Your Story & Choose a Tradition'}</span>
              </div>
            </button>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5"
          >
            <p className="text-sm text-amber-100/70 leading-relaxed">
              MAIA will weave a sacred teaching story specifically for your situation, drawing from the wisdom tradition you've chosen. Each story is unique—crafted to mirror your journey and illuminate the path forward through timeless archetypal wisdom.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
