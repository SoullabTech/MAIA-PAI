/**
 * UPPER PAGE - Big Picture View
 *
 * "This whole process could live in the Upper page above main page as it is the big picture."
 *
 * The hierarchy:
 * - UPPER = WHO YOU ARE (the mythology unfolding)
 * - ASTROLOGY = THE INSTRUMENT (soul architecture)
 * - MAIN = THE WORK (daily practice)
 *
 * This page shows your Living Mythology at the highest level:
 * - Current chapter being written
 * - Timeline of your journey
 * - Active threads MAIA is tracking
 * - Link to full Story page for co-authorship
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Calendar,
  Eye,
} from 'lucide-react';

// Mock data - will connect to real data
const mockOverview = {
  currentChapter: {
    title: 'Genesis',
    status: 'draft' as const,
    progress: 75, // percentage
    lastUpdated: new Date('2025-01-15'),
  },
  totalChapters: 1,
  approvedChapters: 0,
  activeThreads: [
    {
      id: '1',
      name: 'Saturn Focal Point Work',
      description: 'Crystallizing your life\'s work through discipline and form',
      status: 'active' as const,
      relatedChapters: ['Genesis'],
    },
    {
      id: '2',
      name: 'The Water Path',
      description: 'Swimming in oceanic depths and returning with pearls',
      status: 'emerging' as const,
      relatedChapters: ['Genesis'],
    },
  ],
  recentEvents: [
    {
      id: '1',
      date: new Date('2025-01-15'),
      type: 'chapter-created',
      title: 'Genesis Chapter Created',
      description: 'MAIA wove your birth chart into narrative form',
    },
    {
      id: '2',
      date: new Date('2025-01-10'),
      type: 'story-initialized',
      title: 'Your Story Begins',
      description: 'Living Mythology initialized with Sacred Scribe',
    },
  ],
  chartSummary: {
    sunSign: 'Sagittarius',
    moonSign: 'Scorpio',
    risingSign: 'Leo',
    chartPattern: 'Funnel',
    dominantElement: 'Water',
  },
};

export default function UpperPage() {
  const [isDayMode] = useState(false); // Connect to global theme later

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] text-stone-100">
      {/* Cosmic background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-200/40"
            style={{
              width: Math.random() > 0.7 ? '2px' : '1px',
              height: Math.random() > 0.7 ? '2px' : '1px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="w-10 h-10 text-amber-400" />
            <h1 className="text-5xl font-serif text-amber-300">
              The Big Picture
            </h1>
          </div>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto mb-3">
            Your Living Mythology as co-authored with MAIA, your Sacred Scribe
          </p>
          <p className="text-stone-500 text-sm italic">
            She sees the pattern. You live the story. Together you author the mythology.
          </p>
        </motion.div>

        {/* Current Chapter Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-br from-purple-900/30 via-black/40 to-amber-900/30 backdrop-blur-md border border-amber-500/30 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-6 h-6 text-amber-400" />
                  <h2 className="text-2xl font-serif text-amber-300">
                    Current Chapter
                  </h2>
                </div>
                <h3 className="text-3xl font-serif text-stone-100 mb-2">
                  {mockOverview.currentChapter.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-stone-400">
                  <span className={`px-3 py-1 rounded-full border ${
                    mockOverview.currentChapter.status === 'draft'
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-200'
                      : 'bg-green-500/20 border-green-500/40 text-green-200'
                  }`}>
                    {mockOverview.currentChapter.status === 'draft' ? 'In Co-Authorship' : 'Approved'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Updated {mockOverview.currentChapter.lastUpdated.toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Link
                href="/story"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 hover:bg-amber-500/30 transition-all"
              >
                Continue Writing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-stone-400 mb-2">
                <span>Co-Authorship Progress</span>
                <span>{mockOverview.currentChapter.progress}%</span>
              </div>
              <div className="h-2 bg-stone-800/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mockOverview.currentChapter.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-amber-500"
                />
              </div>
            </div>

            <p className="text-stone-300 text-sm">
              MAIA has drafted this chapter from your birth chart. Review her synthesis, add your voice,
              request revisions, and approve when it feels true. This is co-authorship - you lived it,
              she saw it, together you write it.
            </p>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-black/40 backdrop-blur-md border border-stone-700/40 rounded-2xl p-6">
            <div className="text-3xl font-serif text-amber-400 mb-2">
              {mockOverview.totalChapters}
            </div>
            <div className="text-sm text-stone-400">Chapters in Progress</div>
          </div>
          <div className="bg-black/40 backdrop-blur-md border border-stone-700/40 rounded-2xl p-6">
            <div className="text-3xl font-serif text-green-400 mb-2">
              {mockOverview.approvedChapters}
            </div>
            <div className="text-sm text-stone-400">Approved & Permanent</div>
          </div>
          <div className="bg-black/40 backdrop-blur-md border border-stone-700/40 rounded-2xl p-6">
            <div className="text-3xl font-serif text-purple-400 mb-2">
              {mockOverview.activeThreads.length}
            </div>
            <div className="text-sm text-stone-400">Active Threads Weaving</div>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Threads */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-black/40 backdrop-blur-md border border-stone-700/40 rounded-2xl p-6 h-full">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-serif text-purple-300">
                  Threads MAIA is Tracking
                </h2>
              </div>
              <p className="text-sm text-stone-400 mb-6">
                Recurring patterns across your sessions, journal, and life events. These become chapters.
              </p>
              <div className="space-y-4">
                {mockOverview.activeThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`p-4 rounded-lg border ${
                      thread.status === 'active'
                        ? 'bg-purple-900/20 border-purple-700/40'
                        : 'bg-amber-900/20 border-amber-700/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-serif text-stone-200">{thread.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        thread.status === 'active'
                          ? 'bg-purple-500/30 text-purple-200'
                          : 'bg-amber-500/30 text-amber-200'
                      }`}>
                        {thread.status}
                      </span>
                    </div>
                    <p className="text-sm text-stone-400">{thread.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Journey Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-black/40 backdrop-blur-md border border-stone-700/40 rounded-2xl p-6 h-full">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-serif text-amber-300">
                  Your Journey So Far
                </h2>
              </div>
              <div className="space-y-4">
                {mockOverview.recentEvents.map((event, idx) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      {idx < mockOverview.recentEvents.length - 1 && (
                        <div className="w-0.5 flex-1 bg-stone-700/40 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="text-xs text-stone-500 mb-1">
                        {event.date.toLocaleDateString()}
                      </div>
                      <h3 className="text-sm font-serif text-amber-200 mb-1">
                        {event.title}
                      </h3>
                      <p className="text-xs text-stone-400">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/story"
                className="mt-4 text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                View Full Timeline
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Your Instrument - Chart Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-br from-black/40 via-stone-900/40 to-black/40 backdrop-blur-md border border-stone-700/40 rounded-2xl p-8">
            <h2 className="text-2xl font-serif text-stone-200 mb-6 text-center">
              Your Instrument
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              <div>
                <div className="text-sm text-stone-500 mb-1">Sun</div>
                <div className="text-lg font-serif text-amber-300">
                  {mockOverview.chartSummary.sunSign}
                </div>
              </div>
              <div>
                <div className="text-sm text-stone-500 mb-1">Moon</div>
                <div className="text-lg font-serif text-purple-300">
                  {mockOverview.chartSummary.moonSign}
                </div>
              </div>
              <div>
                <div className="text-sm text-stone-500 mb-1">Rising</div>
                <div className="text-lg font-serif text-orange-300">
                  {mockOverview.chartSummary.risingSign}
                </div>
              </div>
              <div>
                <div className="text-sm text-stone-500 mb-1">Pattern</div>
                <div className="text-lg font-serif text-green-300">
                  {mockOverview.chartSummary.chartPattern}
                </div>
              </div>
              <div>
                <div className="text-sm text-stone-500 mb-1">Element</div>
                <div className="text-lg font-serif text-blue-300">
                  {mockOverview.chartSummary.dominantElement}
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/astrology"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-stone-700/40 border border-stone-600/40 text-stone-300 hover:bg-stone-700/60 transition-all text-sm"
              >
                View Full Chart & Sacred Geometry
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            href="/story"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-amber-500/20 border border-amber-500/40 text-amber-200 hover:from-purple-500/30 hover:to-amber-500/30 transition-all text-lg font-serif"
          >
            <BookOpen className="w-6 h-6" />
            Enter Co-Authorship Space
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-stone-500 italic">
            The Sacred Scribe awaits. Your story continues.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
