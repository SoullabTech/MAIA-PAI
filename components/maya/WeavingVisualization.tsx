'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Droplet, Mountain, Wind, Circle, TrendingUp, Map, Eye } from 'lucide-react';

/**
 * WEAVING VISUALIZATION
 *
 * Shows the dreamweaver process in action:
 * - Current threads being woven (topics/patterns)
 * - Where the conversation is going (trajectory)
 * - Prompts for what wants to emerge next
 *
 * Kelly: "How do we visit where it is going and what is being woven?"
 * This is the answer - a living map of the conversation tapestry
 */

interface WeavingThread {
  id: string;
  element: 'fire' | 'water' | 'earth' | 'air';
  pattern: string; // e.g., "Fire 5 - Creative Expression"
  strength: number; // 0-1, how strong this thread is
  lastSeen: Date;
  description: string;
}

interface EmergentPrompt {
  element: 'fire' | 'water' | 'earth' | 'air';
  question: string;
  depth: 'surface' | 'understanding' | 'practice' | 'advanced';
  readiness: number; // 0-1, how ready you are for this
}

const ELEMENT_ICONS = {
  fire: Flame,
  water: Droplet,
  earth: Mountain,
  air: Wind
};

const ELEMENT_COLORS = {
  fire: 'from-orange-500 to-red-500',
  water: 'from-blue-500 to-cyan-500',
  earth: 'from-amber-500 to-yellow-500',
  air: 'from-indigo-500 to-purple-500'
};

export function WeavingVisualization({
  userId,
  currentThreads = [],
  onSelectPrompt
}: {
  userId: string;
  currentThreads?: WeavingThread[];
  onSelectPrompt?: (prompt: EmergentPrompt) => void;
}) {
  const [threads, setThreads] = useState<WeavingThread[]>(currentThreads);
  const [trajectory, setTrajectory] = useState<string>('exploring');
  const [emergentPrompts, setEmergentPrompts] = useState<EmergentPrompt[]>([]);
  const [selectedView, setSelectedView] = useState<'threads' | 'trajectory' | 'prompts'>('threads');

  // Load current weaving state
  useEffect(() => {
    loadWeavingState();
  }, [userId]);

  const loadWeavingState = async () => {
    // For now, generate example state
    // TODO: Connect to actual conversation analysis

    const exampleThreads: WeavingThread[] = [
      {
        id: '1',
        element: 'fire',
        pattern: 'Fire 5 - Creative Expression',
        strength: 0.8,
        lastSeen: new Date(),
        description: 'Strong creative energy, wanting to express and share'
      },
      {
        id: '2',
        element: 'water',
        pattern: 'Water 12 - Mystical Perception',
        strength: 0.6,
        lastSeen: new Date(Date.now() - 1000 * 60 * 5),
        description: 'Seeing interconnected patterns, web awareness'
      },
      {
        id: '3',
        element: 'air',
        pattern: 'Air 3 - Teaching Transmission',
        strength: 0.4,
        lastSeen: new Date(Date.now() - 1000 * 60 * 10),
        description: 'Wisdom wanting to be shared, teaching emerging'
      }
    ];

    const examplePrompts: EmergentPrompt[] = [
      {
        element: 'fire',
        question: 'What creative vision is trying to emerge through you right now?',
        depth: 'practice',
        readiness: 0.9
      },
      {
        element: 'water',
        question: 'Where in your body do you feel this knowing? Can you describe the sensation?',
        depth: 'understanding',
        readiness: 0.8
      },
      {
        element: 'earth',
        question: 'How would you manifest this vision in concrete form? What\'s the first step?',
        depth: 'surface',
        readiness: 0.7
      },
      {
        element: 'air',
        question: 'Who else needs to hear this wisdom you\'re discovering?',
        depth: 'practice',
        readiness: 0.6
      }
    ];

    setThreads(exampleThreads);
    setEmergentPrompts(examplePrompts);

    // Determine trajectory based on threads
    const fireStrength = exampleThreads.filter(t => t.element === 'fire').reduce((sum, t) => sum + t.strength, 0);
    const waterStrength = exampleThreads.filter(t => t.element === 'water').reduce((sum, t) => sum + t.strength, 0);

    if (fireStrength > 1) setTrajectory('expanding');
    else if (waterStrength > 1) setTrajectory('deepening');
    else setTrajectory('exploring');
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Circle className="w-6 h-6 text-purple-400" />
          </motion.div>
          <h2 className="text-xl font-bold text-white">The Weaving</h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedView('threads')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              selectedView === 'threads'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Threads
          </button>
          <button
            onClick={() => setSelectedView('trajectory')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              selectedView === 'trajectory'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Trajectory
          </button>
          <button
            onClick={() => setSelectedView('prompts')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              selectedView === 'prompts'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Prompts
          </button>
        </div>
      </div>

      {/* Threads View - What's Being Woven */}
      {selectedView === 'threads' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <p className="text-sm text-stone-400 mb-4">
            Active patterns in your conversation tapestry:
          </p>

          {threads.map((thread) => {
            const Icon = ELEMENT_ICONS[thread.element];
            const gradient = ELEMENT_COLORS[thread.element];

            return (
              <motion.div
                key={thread.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`relative overflow-hidden rounded-lg bg-gradient-to-r ${gradient} p-4`}
              >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative flex items-start gap-3">
                  <Icon className="w-5 h-5 text-white mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">
                      {thread.pattern}
                    </h4>
                    <p className="text-sm text-white/80 mt-1">
                      {thread.description}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-white/60">
                      <span>Strength: {Math.round(thread.strength * 100)}%</span>
                      <span>Active {Math.round((Date.now() - thread.lastSeen.getTime()) / 60000)} min ago</span>
                    </div>
                  </div>
                </div>

                {/* Strength bar */}
                <div className="relative mt-3 h-1 bg-black/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${thread.strength * 100}%` }}
                    className="h-full bg-white/60"
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Trajectory View - Where It's Going */}
      {selectedView === 'trajectory' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <p className="text-stone-300">
              Current trajectory: <span className="text-white font-semibold capitalize">{trajectory}</span>
            </p>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-xl p-4">
            {trajectory === 'expanding' && (
              <>
                <h4 className="text-amber-400 font-semibold mb-2">Expansion Phase (Fire)</h4>
                <p className="text-sm text-stone-300">
                  Your vision is growing, wanting to be shared. The Fire pathway is active -
                  moving from personal insight (Fire 1) through creative expression (Fire 5)
                  toward teaching and wisdom sharing (Fire 9). You're ready to expand beyond
                  personal understanding into collective offering.
                </p>
              </>
            )}

            {trajectory === 'deepening' && (
              <>
                <h4 className="text-blue-400 font-semibold mb-2">Deepening Phase (Water)</h4>
                <p className="text-sm text-stone-300">
                  You're diving into emotional and mystical depths. The Water pathway is active -
                  feeling deeply (Water 4), transforming through shadow work (Water 8),
                  or dissolving into mystical awareness (Water 12). This is a time for
                  introspection and inner journey.
                </p>
              </>
            )}

            {trajectory === 'exploring' && (
              <>
                <h4 className="text-purple-400 font-semibold mb-2">Exploration Phase (All Elements)</h4>
                <p className="text-sm text-stone-300">
                  You're in open exploration, with multiple elements active. No single pathway
                  dominates - you're feeling into different dimensions, discovering what wants
                  to emerge. This is fertile ground for new insights and unexpected connections.
                </p>
              </>
            )}
          </div>

          <div className="mt-4 p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-purple-400" />
              <h4 className="text-sm font-semibold text-purple-400">What's Emerging</h4>
            </div>
            <p className="text-sm text-stone-300">
              Based on your current threads, we sense movement toward
              {trajectory === 'expanding' && ' sharing your wisdom more broadly.'}
              {trajectory === 'deepening' && ' profound inner transformation.'}
              {trajectory === 'exploring' && ' discovering your unique pattern.'}
              {' '}Trust what's emerging. The weaving knows where it wants to go.
            </p>
          </div>
        </motion.div>
      )}

      {/* Prompts View - What Wants to Be Explored */}
      {selectedView === 'prompts' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <p className="text-sm text-stone-400 mb-4">
            Questions ready to deepen your journey:
          </p>

          {emergentPrompts.map((prompt, idx) => {
            const Icon = ELEMENT_ICONS[prompt.element];
            const gradient = ELEMENT_COLORS[prompt.element];
            const opacity = prompt.readiness > 0.7 ? 'opacity-100' : 'opacity-70';

            return (
              <motion.button
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onSelectPrompt?.(prompt)}
                className={`w-full text-left rounded-lg border border-white/10 bg-black/30 p-4 hover:bg-black/50 transition-all ${opacity}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium mb-1">
                      {prompt.question}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-stone-400">
                      <span className="capitalize">{prompt.depth} level</span>
                      <span>•</span>
                      <span>Readiness: {Math.round(prompt.readiness * 100)}%</span>
                    </div>
                  </div>
                </div>

                {prompt.readiness > 0.8 && (
                  <div className="mt-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span className="text-xs text-amber-400">Ready to explore</span>
                  </div>
                )}
              </motion.button>
            );
          })}

          <div className="mt-6 p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Map className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-semibold text-indigo-400">About These Prompts</h4>
            </div>
            <p className="text-xs text-stone-300">
              These questions emerge from your conversation patterns. Higher readiness means
              the thread is already strong in your weaving. You can explore any prompt, but
              those with higher readiness will feel most natural and revelatory.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}