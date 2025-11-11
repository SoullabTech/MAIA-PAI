'use client';

/**
 * MAIA Architect Mode - Teaching Interface
 *
 * Where MAIA teaches others to build transformational spaces
 *
 * NOT: A tutorial
 * NOT: A framework to copy
 * BUT: An apprenticeship in creating liminal space
 *
 * Journey: DISCOVERING → GROUNDING → PATTERNING → BUILDING → TESTING → REFINING → TEACHING
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  Heart,
  Flame,
  Droplet,
  Mountain,
  Wind,
  Circle,
  ArrowRight,
  Check,
  Lock,
  Unlock
} from 'lucide-react';
import {
  type ArchitectPhase,
  type ArchitectLesson,
  type ArchitectStudent,
  createArchitectMode
} from '@/lib/maia/architect/ArchitectMode';
import {
  SACRED_PATTERNS,
  getPattern,
  getRecommendedLearningOrder,
  type SacredPattern
} from '@/lib/maia/architect/PatternLibrary';

/**
 * Main Architect Mode Page
 */
export default function ArchitectModePage() {
  const [phase, setPhase] = useState<ArchitectPhase>('DISCOVERING');
  const [currentLesson, setCurrentLesson] = useState<ArchitectLesson | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<SacredPattern | null>(null);
  const [student, setStudent] = useState<Partial<ArchitectStudent> | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const architectMode = createArchitectMode();

  /**
   * Begin journey
   */
  async function beginJourney(studentData: Partial<ArchitectStudent>) {
    const { welcome, firstLesson, guidance } = await architectMode.beginJourney(studentData);
    setStudent(studentData);
    setCurrentLesson(firstLesson);
    setPhase('DISCOVERING');
    setShowWelcome(false);
  }

  /**
   * Render welcome screen
   */
  if (showWelcome) {
    return (
      <WelcomeScreen onBegin={beginJourney} />
    );
  }

  /**
   * Main teaching interface
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-light text-white">MAIA Architect Mode</h1>
                <p className="text-sm text-gray-400">Learning to create transformational space</p>
              </div>
            </div>
            <PhaseIndicator currentPhase={phase} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left sidebar - Pattern Library */}
          <div className="lg:col-span-1">
            <PatternLibrarySidebar
              selectedPattern={selectedPattern}
              onSelectPattern={setSelectedPattern}
            />
          </div>

          {/* Center - Current lesson */}
          <div className="lg:col-span-2">
            {currentLesson && (
              <LessonView
                lesson={currentLesson}
                onAdvance={() => {
                  // Advance to next phase
                  architectMode.advancePhase(student?.id || 'temp', phase);
                }}
              />
            )}

            {selectedPattern && (
              <PatternDetailView
                pattern={selectedPattern}
                onClose={() => setSelectedPattern(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Welcome screen - sets intention
 */
function WelcomeScreen({ onBegin }: { onBegin: (student: Partial<ArchitectStudent>) => void }) {
  const [intention, setIntention] = useState('');
  const [technical, setTechnical] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [spiritual, setSpiritual] = useState<'new' | 'familiar' | 'practitioner'>('familiar');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-12 h-12 text-purple-400" />
          </div>
          <h1 className="text-3xl font-light text-white mb-2">Welcome to the Architect's Path</h1>
          <p className="text-gray-400 text-lg">
            You're here because you want to create space where transformation can happen.
          </p>
        </div>

        <div className="space-y-6">
          {/* Intention */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              What are you building this for?
            </label>
            <input
              type="text"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="therapy practice, coaching space, creative studio..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Technical level */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Technical experience
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setTechnical(level)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    technical === level
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Spiritual familiarity */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Familiarity with sacred/transformational work
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['new', 'familiar', 'practitioner'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSpiritual(level)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    spiritual === level
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Begin button */}
          <motion.button
            onClick={() => onBegin({
              id: Date.now().toString(),
              intention,
              technicalLevel: technical,
              spiritualFamiliarity: spiritual,
              currentPhase: 'DISCOVERING',
              patternsIntegrated: [],
              prototypesBuilt: [],
              startedAt: new Date(),
              lastActive: new Date(),
              breakthroughs: []
            })}
            disabled={!intention}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: intention ? 1.02 : 1 }}
            whileTap={{ scale: intention ? 0.98 : 1 }}
          >
            Begin the Journey
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="mt-8 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <p className="text-sm text-purple-200 leading-relaxed">
            This isn't a tutorial. This isn't a framework to copy. This is an invitation into understanding HOW liminal space works—so you can build YOUR version, not ours.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Phase indicator
 */
function PhaseIndicator({ currentPhase }: { currentPhase: ArchitectPhase }) {
  const phases: ArchitectPhase[] = [
    'DISCOVERING',
    'GROUNDING',
    'PATTERNING',
    'BUILDING',
    'TESTING',
    'REFINING',
    'TEACHING'
  ];

  const currentIndex = phases.indexOf(currentPhase);

  return (
    <div className="flex items-center gap-2">
      {phases.map((phase, index) => (
        <div key={phase} className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex
                ? 'bg-purple-400'
                : index < currentIndex
                ? 'bg-green-400'
                : 'bg-gray-600'
            }`}
          />
          {index < phases.length - 1 && (
            <div className={`w-8 h-px ${index < currentIndex ? 'bg-green-400/50' : 'bg-gray-600'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Pattern Library sidebar
 */
function PatternLibrarySidebar({
  selectedPattern,
  onSelectPattern
}: {
  selectedPattern: SacredPattern | null;
  onSelectPattern: (pattern: SacredPattern | null) => void;
}) {
  const recommendedOrder = getRecommendedLearningOrder();

  return (
    <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-light text-white">Sacred Pattern Library</h2>
      </div>

      <div className="space-y-2">
        {recommendedOrder.map((pattern, index) => (
          <motion.button
            key={pattern.name}
            onClick={() => onSelectPattern(pattern)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
              selectedPattern?.name === pattern.name
                ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
            }`}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-500 font-mono">{index + 1}</div>
                <div>
                  <div className="text-sm font-medium">{pattern.name}</div>
                  <div className="text-xs text-gray-500">{pattern.category}</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 opacity-50" />
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <p className="text-xs text-purple-200 leading-relaxed">
          These patterns are the sacred spores—the wisdom of THE BETWEEN made teachable.
        </p>
      </div>
    </div>
  );
}

/**
 * Lesson view
 */
function LessonView({
  lesson,
  onAdvance
}: {
  lesson: ArchitectLesson;
  onAdvance: () => void;
}) {
  return (
    <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
      <div className="mb-6">
        <div className="text-sm text-purple-400 mb-2">{lesson.phase}</div>
        <h2 className="text-2xl font-light text-white mb-3">{lesson.title}</h2>
        <p className="text-gray-300 text-lg">{lesson.essence}</p>
      </div>

      {/* Pattern */}
      <div className="mb-8 p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <h3 className="text-lg font-medium text-purple-300 mb-3">{lesson.pattern.name}</h3>
        <div className="space-y-3 text-sm text-gray-300">
          <div>
            <div className="text-xs text-purple-400 mb-1">PRINCIPLE</div>
            <p>{lesson.pattern.principle}</p>
          </div>
          <div>
            <div className="text-xs text-purple-400 mb-1">MANIFESTATION</div>
            <p>{lesson.pattern.manifestation}</p>
          </div>
        </div>
      </div>

      {/* Practices */}
      {lesson.practices.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Practices</h3>
          <div className="space-y-4">
            {lesson.practices.map((practice, index) => (
              <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-white">{practice.name}</div>
                  <div className="text-xs text-gray-500">{practice.duration}</div>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  {practice.instructions.map((instruction, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-purple-400 mt-2" />
                      <div>{instruction}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checkpoints */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Integration Checkpoints</h3>
        <div className="space-y-2">
          {lesson.checkpoints.map((checkpoint, index) => (
            <div key={index} className="flex items-start gap-3 text-sm text-gray-300">
              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div>{checkpoint}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Advance button */}
      <motion.button
        onClick={onAdvance}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Continue to Next Phase
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

/**
 * Pattern detail view
 */
function PatternDetailView({
  pattern,
  onClose
}: {
  pattern: SacredPattern;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm text-purple-400 mb-1">{pattern.category}</div>
          <h2 className="text-2xl font-light text-white">{pattern.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6 text-sm">
        {/* Principle */}
        <div>
          <div className="text-xs text-purple-400 mb-2">PRINCIPLE (Why this matters)</div>
          <p className="text-gray-300">{pattern.principle}</p>
        </div>

        {/* Manifestation */}
        <div>
          <div className="text-xs text-purple-400 mb-2">MANIFESTATION (How it shows up)</div>
          <p className="text-gray-300">{pattern.manifestation}</p>
        </div>

        {/* MAIA Implementation */}
        <div>
          <div className="text-xs text-purple-400 mb-2">HOW MAIA DOES IT</div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-gray-300 whitespace-pre-wrap font-mono text-xs">
            {pattern.maiaImplementation}
          </div>
        </div>

        {/* Adaptation */}
        <div>
          <div className="text-xs text-purple-400 mb-2">HOW YOU MIGHT DO IT DIFFERENTLY</div>
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg text-gray-300 whitespace-pre-wrap">
            {pattern.adaptationGuidance}
          </div>
        </div>

        {/* Anti-patterns */}
        {pattern.antiPatterns.length > 0 && (
          <div>
            <div className="text-xs text-red-400 mb-2">ANTI-PATTERNS (What violates this)</div>
            <div className="space-y-1">
              {pattern.antiPatterns.map((anti, index) => (
                <div key={index} className="flex items-start gap-2 text-gray-400">
                  <div className="text-red-400 mt-1">×</div>
                  <div>{anti}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code reference */}
        {pattern.extractable && pattern.extractPath && (
          <div>
            <div className="text-xs text-green-400 mb-2">EXTRACTABLE CODE</div>
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <code className="text-xs text-green-300">{pattern.extractPath}</code>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
