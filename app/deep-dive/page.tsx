'use client';

/**
 * Deep Dive: Elemental Alchemy
 *
 * The phenomenological journey through Kelly Beard's Elemental Alchemy
 * Living curriculum that transforms astrology from information to experience
 *
 * Future: Platform for other wisdom traditions (Phase 2+)
 */

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Flame,
  Droplet,
  Globe,
  Wind,
  Sparkles,
  Lock,
  CheckCircle,
  Circle
} from 'lucide-react';

interface Chapter {
  number: number;
  title: string;
  element: 'fire' | 'water' | 'earth' | 'air' | 'aether' | 'intro';
  icon: any;
  description: string;
  houses?: number[];
  isAvailable: boolean;
  isSample?: boolean;
}

const CHAPTERS: Chapter[] = [
  {
    number: 0,
    title: 'Flying High, Diving Deep',
    element: 'intro',
    icon: BookOpen,
    description: 'The Icarus myth and our relationship with technology, nature, and transformation. An invitation to the alchemical journey.',
    isAvailable: true,
    isSample: true,
  },
  {
    number: 1,
    title: 'We Are Elemental Beings',
    element: 'intro',
    icon: Sparkles,
    description: 'Understanding consciousness through the five elements. The foundation of Spiralogic and the journey ahead.',
    isAvailable: true,
    isSample: true,
  },
  {
    number: 2,
    title: 'The Fire Pathway',
    element: 'fire',
    icon: Flame,
    houses: [1, 5, 9],
    description: 'I Explore → I Express → I Expand. Vision, creation, and expansion through the Right Prefrontal Cortex. Purpose, Play, Practice.',
    isAvailable: true,
  },
  {
    number: 3,
    title: 'The Water Pathway',
    element: 'water',
    icon: Droplet,
    houses: [4, 8, 12],
    description: 'I Feel → I Flow → I Fathom. Depth, transformation, and transcendence through the Right Hemisphere. Heart, Healing, Holy.',
    isAvailable: true,
  },
  {
    number: 4,
    title: 'The Earth Pathway',
    element: 'earth',
    icon: Globe,
    houses: [2, 6, 10],
    description: 'I Ground → I Grow → I Generate. Manifestation, refinement, and mastery through the Left Hemisphere. Mission, Method, Medicine.',
    isAvailable: true,
  },
  {
    number: 5,
    title: 'The Air Pathway',
    element: 'air',
    icon: Wind,
    houses: [3, 7, 11],
    description: 'I Connect → I Collaborate → I Convey. Communication, relationship, and collective vision through the Left Prefrontal. Connection, Community, Consciousness.',
    isAvailable: true,
  },
  {
    number: 6,
    title: 'The Aether: I Am',
    element: 'aether',
    icon: Sparkles,
    description: 'The fifth element that unifies all others. The soul center, the conscious witness, the divine spark.',
    isAvailable: true,
  },
];

const getElementColor = (element: string) => {
  const colors = {
    fire: 'from-orange-500 to-red-600',
    water: 'from-blue-500 to-indigo-600',
    earth: 'from-green-500 to-emerald-600',
    air: 'from-cyan-500 to-sky-600',
    aether: 'from-purple-500 to-pink-600',
    intro: 'from-amber-500 to-orange-500',
  };
  return colors[element as keyof typeof colors] || colors.intro;
};

const getElementBorder = (element: string) => {
  const borders = {
    fire: 'border-orange-500/30',
    water: 'border-blue-500/30',
    earth: 'border-green-500/30',
    air: 'border-cyan-500/30',
    aether: 'border-purple-500/30',
    intro: 'border-amber-500/30',
  };
  return borders[element as keyof typeof borders] || borders.intro;
};

export default function DeepDivePage() {
  const [userHasAccess] = useState(false); // TODO: Check actual access

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-amber-950/20 to-black">
      {/* Ambient background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 text-amber-500 mb-4">
            <BookOpen className="w-6 h-6" />
            <span className="text-sm uppercase tracking-wider font-light">The Deep Dive</span>
          </div>
          <h1 className="text-5xl font-bold text-amber-100 mb-4">
            Elemental Alchemy
          </h1>
          <p className="text-xl text-amber-300/80 mb-2">
            The Ancient Art of Living a Phenomenal Life
          </p>
          <p className="text-amber-500/60 text-sm">by Kelly Beard</p>

          <div className="max-w-3xl mx-auto mt-8">
            <p className="text-amber-300/70 text-lg leading-relaxed mb-6">
              This book is not just theory—it's a <span className="text-amber-400 font-semibold">phenomenological journey</span> through
              the elements of consciousness. Here, your birth chart becomes a living map, and each chapter
              guides you through direct experience of the alchemical transformation.
            </p>
            <p className="text-amber-400/60 italic">
              "Alchemy is the art of transformation. It is about transforming oneself, understanding oneself,
              and bringing oneself into harmony with the world." — Edward Whitmont
            </p>
          </div>
        </motion.div>

        {/* Access Status */}
        {!userHasAccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="bg-gradient-to-br from-amber-950/40 to-stone-900/80 border border-amber-800/30 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-900/30 rounded-lg">
                  <Lock className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-100 mb-2">
                    Full Access Coming Soon
                  </h3>
                  <p className="text-amber-400/70 mb-4">
                    The complete Deep Dive experience with all chapters, practices, and personal
                    integration tools will be available to book owners and premium members.
                  </p>
                  <p className="text-amber-500/60 text-sm mb-4">
                    For now, explore the sample chapters below to get a taste of the journey.
                  </p>
                  <div className="flex gap-3">
                    <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-lg transition-all">
                      Get the Book
                    </button>
                    <button className="px-6 py-3 bg-stone-900/60 hover:bg-stone-800/60 text-amber-400 border border-amber-800/30 font-semibold rounded-lg transition-all">
                      Learn About Premium
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Chapter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHAPTERS.map((chapter, index) => {
            const Icon = chapter.icon;
            const canAccess = chapter.isSample || userHasAccess;

            return (
              <motion.div
                key={chapter.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={canAccess ? `/deep-dive/chapter-${chapter.number}` : '#'}
                  className={`block h-full ${!canAccess ? 'cursor-not-allowed' : ''}`}
                >
                  <div className={`h-full bg-gradient-to-br from-stone-900/80 via-amber-950/40 to-stone-900/80 backdrop-blur-xl border ${getElementBorder(chapter.element)} rounded-2xl p-6 transition-all duration-300 ${
                    canAccess
                      ? 'hover:scale-105 hover:shadow-2xl hover:shadow-amber-900/30'
                      : 'opacity-60'
                  }`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-br ${getElementColor(chapter.element)} rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        {chapter.isSample && (
                          <span className="px-2 py-1 bg-amber-900/30 border border-amber-700/30 rounded text-amber-400 text-xs font-semibold">
                            SAMPLE
                          </span>
                        )}
                        {!canAccess && (
                          <Lock className="w-5 h-5 text-amber-600/40" />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                      <div className="text-amber-600/60 text-sm mb-1">
                        Chapter {chapter.number}
                      </div>
                      <h3 className="text-xl font-bold text-amber-100 mb-2">
                        {chapter.title}
                      </h3>
                      {chapter.houses && (
                        <div className="text-amber-500/60 text-sm mb-3">
                          Houses {chapter.houses.join(', ')}
                        </div>
                      )}
                      <p className="text-amber-400/60 text-sm leading-relaxed">
                        {chapter.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-amber-900/30">
                      {canAccess ? (
                        <div className="flex items-center gap-2 text-amber-500 text-sm">
                          <span>Explore chapter</span>
                          <span>→</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-600/40 text-sm">
                          <Lock className="w-4 h-4" />
                          <span>Locked</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* What Makes This Different */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-stone-900/80 via-amber-950/40 to-stone-900/80 backdrop-blur-xl border border-amber-900/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-amber-100 mb-6 text-center">
              The Deep Dive Experience
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-100 mb-1">
                    Personalized to Your Chart
                  </h3>
                  <p className="text-amber-400/60 text-sm">
                    As you read, see how each passage relates to YOUR specific planetary placements and houses.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-100 mb-1">
                    MAIA as Your Guide
                  </h3>
                  <p className="text-amber-400/60 text-sm">
                    Explore passages in conversation with MAIA, who helps you integrate wisdom into lived experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-100 mb-1">
                    Track Your Journey
                  </h3>
                  <p className="text-amber-400/60 text-sm">
                    See your progress through the elements, mark insights, record reflections, and watch transformation unfold.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-100 mb-1">
                    Embodied Practices
                  </h3>
                  <p className="text-amber-400/60 text-sm">
                    Each chapter includes practices, meditations, and voice journeys to move wisdom from head to heart to hands.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-amber-900/30 text-center">
              <p className="text-amber-500/70 italic mb-4">
                "In this there is no teacher, no pupil; there is no leader; there is no guru; there is no Master,
                no Saviour. You yourself are the teacher and the pupil; you are the Master; you are the guru;
                you are the leader; you are everything."
              </p>
              <p className="text-amber-600/60 text-sm">— Jiddu Krishnamurti</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/astrology"
            className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors"
          >
            ← Back to Your Cosmic Blueprint
          </Link>
        </div>
      </div>
    </div>
  );
}
