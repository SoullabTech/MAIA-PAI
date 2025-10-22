"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, BookOpen, TrendingUp, ArrowLeft, Plus } from 'lucide-react';

/**
 * Loralee's Living Curriculum
 *
 * The client portal where people return to their chart over time:
 * - Journal entries tied to transits
 * - Tracking insights/breakthroughs
 * - Progressive revelation of wisdom
 * - Growth timeline
 */

interface JournalEntry {
  date: Date;
  transit: string;
  reflection: string;
  planetActivated: string;
}

// Sample data showing progression over time
const SAMPLE_ENTRIES: JournalEntry[] = [
  {
    date: new Date('2024-09-15'),
    transit: 'Saturn trine natal Sun',
    reflection: 'That teaching about illuminating the path... I finally get it. I have been waiting for permission to share what I know, but the permission comes from LIVING it first. Saturn is teaching me that structure serves shine.',
    planetActivated: 'Sun in Leo'
  },
  {
    date: new Date('2024-10-03'),
    transit: 'Neptune conjunct natal Moon',
    reflection: 'The emotional overwhelm this week - I kept trying to fix it. Then I remembered: Moon in Pisces, 4th house. My sensitivity IS my gift. Neptune is showing me that dissolving into feeling is not weakness, it is how I access truth.',
    planetActivated: 'Moon in Pisces'
  },
  {
    date: new Date('2024-10-21'),
    transit: 'Mars return',
    reflection: 'Mars back in Aries, my 5th house. The creative fire is BACK. Started the project I have been preparing for. No more waiting. The chart was right - I came to CREATE, not to wait for permission.',
    planetActivated: 'Mars in Aries'
  }
];

export function LoraleeLivingCurriculum({
  clientName,
  onBack
}: {
  clientName: string;
  onBack: () => void;
}) {
  const [showNewEntry, setShowNewEntry] = useState(false);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="text-indigo-400 hover:text-indigo-300 mb-4 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chart
          </button>
          <h1 className="text-4xl font-light text-indigo-200 mb-2">
            Your Living Curriculum
          </h1>
          <p className="text-indigo-300/70">
            Track how your understanding deepens as the cosmos teaches you
          </p>
        </div>
        <button
          onClick={() => setShowNewEntry(true)}
          className="px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 rounded-full border border-indigo-500/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Reflection
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-indigo-500/20">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-300 text-sm">Time with Chart</span>
          </div>
          <div className="text-3xl text-indigo-100 font-light">37 days</div>
          <div className="text-indigo-400/60 text-xs mt-1">Since first reading</div>
        </div>

        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 text-sm">Reflections</span>
          </div>
          <div className="text-3xl text-purple-100 font-light">3 entries</div>
          <div className="text-purple-400/60 text-xs mt-1">Tracking your journey</div>
        </div>

        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-green-300 text-sm">Active Transits</span>
          </div>
          <div className="text-3xl text-green-100 font-light">2 major</div>
          <div className="text-green-400/60 text-xs mt-1">Saturn & Neptune</div>
        </div>
      </div>

      {/* Timeline of Entries */}
      <div className="space-y-6">
        <h2 className="text-2xl text-indigo-200 font-light mb-4">Your Journey</h2>

        {SAMPLE_ENTRIES.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gradient-to-br from-black/40 to-indigo-950/20 backdrop-blur-xl rounded-2xl border border-indigo-500/20 overflow-hidden"
          >
            {/* Entry Header */}
            <div className="bg-indigo-900/20 px-6 py-4 border-b border-indigo-500/10 flex items-center justify-between">
              <div>
                <div className="text-indigo-300 font-medium mb-1">
                  {entry.date.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <div className="text-indigo-400/70 text-sm flex items-center gap-2">
                  <span className="text-purple-400">✦</span>
                  {entry.transit}
                </div>
              </div>
              <div className="px-3 py-1 bg-indigo-600/20 rounded-full border border-indigo-500/30 text-indigo-300 text-xs">
                {entry.planetActivated}
              </div>
            </div>

            {/* Entry Content */}
            <div className="px-6 py-5">
              <p className="text-indigo-200/90 leading-relaxed italic">
                "{entry.reflection}"
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insight: Show progression */}
      <div className="mt-8 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
        <h3 className="text-lg text-purple-200 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Pattern Recognition
        </h3>
        <p className="text-purple-300/80 leading-relaxed mb-4">
          Notice how your relationship with your chart is deepening? Each transit brings you back
          to the same placements with new understanding. Your Saturn-Sun wisdom is building
          over months, not revealed all at once. This is the "living curriculum" approach-
          the chart teaches you as you're ready to learn.
        </p>
        <div className="text-purple-400/60 text-sm italic">
          This is what makes astrology sacred rather than predictive: it meets you where you are.
        </div>
      </div>

      {/* New Entry Modal */}
      <AnimatePresence>
        {showNewEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewEntry(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-indigo-950 to-purple-950 rounded-2xl border border-indigo-500/30 p-8 max-w-2xl w-full"
            >
              <h3 className="text-2xl text-indigo-200 mb-4">New Reflection</h3>
              <p className="text-indigo-300/70 mb-6 text-sm">
                What's alive in your chart right now? What are the planets teaching you?
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-indigo-300 text-sm mb-2 block">
                    Which planet/placement is speaking to you?
                  </label>
                  <select className="w-full px-4 py-2 bg-indigo-950/50 border border-indigo-500/30 rounded-lg text-indigo-100 focus:outline-none focus:border-indigo-400/50">
                    <option>Sun in Leo (9th house)</option>
                    <option>Moon in Pisces (4th house)</option>
                    <option>Mercury in Virgo (10th house)</option>
                    <option>Venus in Libra (11th house)</option>
                    <option>Mars in Aries (5th house)</option>
                  </select>
                </div>

                <div>
                  <label className="text-indigo-300 text-sm mb-2 block">
                    Your reflection
                  </label>
                  <textarea
                    placeholder="What are you noticing? What's shifting? What's the cosmos teaching you right now?"
                    className="w-full px-4 py-3 bg-indigo-950/50 border border-indigo-500/30 rounded-lg text-indigo-100 placeholder-indigo-400/40 focus:outline-none focus:border-indigo-400/50 resize-none"
                    rows={6}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowNewEntry(false)}
                    className="flex-1 px-6 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Would save entry
                      setShowNewEntry(false);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg transition-all"
                  >
                    Save Reflection
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Note */}
      <div className="mt-12 text-center">
        <p className="text-indigo-400/60 text-sm max-w-2xl mx-auto">
          This is a sample of what {clientName}'s client portal would look like. Over weeks and months,
          they return to add reflections, see how transits activate their natal placements, and watch
          their understanding of the chart deepen organically.
        </p>
      </div>
    </div>
  );
}
