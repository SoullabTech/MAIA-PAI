'use client';

/**
 * 21-Day Experiment Tracker
 *
 * Live visualization of MAIA's transformation from talkative to minimal
 * Tracks beta tester engagement, preference splits, and field evolution
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExperimentDay {
  day: number;
  date: string;
  phase: 'week1' | 'week2' | 'week3';
  status: 'completed' | 'current' | 'upcoming';
  title: string;
  description: string;
  metrics?: {
    sessions: number;
    silenceRate: number;
    avgIntimacy: number;
  };
}

const experimentTimeline: ExperimentDay[] = [
  {
    day: 1,
    date: 'Sept 29',
    phase: 'week1',
    status: 'completed',
    title: 'Hero\'s Journey Letters Sent',
    description: 'Beta testers receive comprehensive guide. Field architecture transparency shared.',
  },
  {
    day: 2,
    date: 'Sept 30',
    phase: 'week1',
    status: 'current',
    title: 'First Conversations Begin',
    description: 'Talkative MAIA engages. Beta testers explore the field session studio.',
    metrics: {
      sessions: 12,
      silenceRate: 0.15,
      avgIntimacy: 0.32,
    },
  },
  {
    day: 5,
    date: 'Oct 3',
    phase: 'week1',
    status: 'upcoming',
    title: 'Week 1 Patterns Emerge',
    description: 'First field note on early observations. Beta testers settling into rhythm.',
  },
  {
    day: 7,
    date: 'Oct 5',
    phase: 'week1',
    status: 'upcoming',
    title: 'Pre-Flip Check-In',
    description: 'Final day of talkative MAIA. Anticipation builds for Monday\'s transformation.',
  },
  {
    day: 8,
    date: 'Oct 7',
    phase: 'week2',
    status: 'upcoming',
    title: '🌀 THE FLIP - MAIA Transforms',
    description: 'Sacred Mirror mode activates. MAIA becomes minimal. The real experiment begins.',
  },
  {
    day: 9,
    date: 'Oct 8',
    phase: 'week2',
    status: 'upcoming',
    title: 'First 24 Hours of Silence',
    description: 'Initial reactions captured. Frustration? Relief? Confusion? Raw feedback shared.',
  },
  {
    day: 14,
    date: 'Oct 13',
    phase: 'week2',
    status: 'upcoming',
    title: 'Week 2 Data Analysis',
    description: 'Talkative vs minimal preference splits revealed. First patterns in the field.',
  },
  {
    day: 15,
    date: 'Oct 14',
    phase: 'week3',
    status: 'upcoming',
    title: 'Integration Phase Begins',
    description: 'Both modes available. Beta testers choose their preferred approach.',
  },
  {
    day: 21,
    date: 'Oct 20',
    phase: 'week3',
    status: 'upcoming',
    title: 'Experiment Complete',
    description: 'Final data shared. Next steps revealed. Waitlist opens.',
  },
];

const currentDay = 2;

export default function ExperimentTrackerPage() {
  const [selectedDay, setSelectedDay] = useState<ExperimentDay | null>(
    experimentTimeline.find((d) => d.day === currentDay) || null
  );

  const week1Days = experimentTimeline.filter((d) => d.phase === 'week1');
  const week2Days = experimentTimeline.filter((d) => d.phase === 'week2');
  const week3Days = experimentTimeline.filter((d) => d.phase === 'week3');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-ain-soph-gold/30 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-ain-soph-gold hover:text-ain-soph-amber mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community Hub
          </Link>
          <h1 className="text-3xl font-light tracking-wide">21-Day Experiment</h1>
          <p className="text-ain-soph-gold/70 mt-2">
            Live tracker of MAIA's transformation from talkative to minimal
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-gradient-to-r from-ain-soph-blue/40 to-slate-800/40 border border-ain-soph-gold/30 rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-light mb-2">Day {currentDay} of 21</h2>
              <p className="text-ain-soph-gold/80">Week 1: The Talkative Phase</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-light text-ain-soph-gold">
                {Math.round((currentDay / 21) * 100)}%
              </div>
              <div className="text-sm text-ain-soph-gold/70">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentDay / 21) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-ain-soph-amber to-ain-soph-gold"
            />
          </div>

          {/* Current Day Metrics */}
          {selectedDay?.metrics && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-ain-soph-gold/70">Sessions</span>
                </div>
                <div className="text-2xl font-light">{selectedDay.metrics.sessions}</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-ain-soph-gold/70">Silence Rate</span>
                </div>
                <div className="text-2xl font-light">
                  {(selectedDay.metrics.silenceRate * 100).toFixed(0)}%
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-ain-soph-gold/70">Avg Intimacy</span>
                </div>
                <div className="text-2xl font-light">
                  {selectedDay.metrics.avgIntimacy.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Timeline */}
        <div className="space-y-12">
          {/* Week 1 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="px-4 py-2 bg-blue-600/20 border border-blue-400/30 rounded-lg">
                <span className="text-blue-300 font-medium">Week 1</span>
              </div>
              <h3 className="text-xl font-light text-blue-300">The Talkative Phase</h3>
            </div>
            <div className="space-y-4">
              {week1Days.map((day, idx) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedDay(day)}
                  className={`cursor-pointer bg-slate-800/30 border rounded-xl p-6 transition-all ${
                    day.status === 'current'
                      ? 'border-ain-soph-amber shadow-lg shadow-ain-soph-gold/20'
                      : day.status === 'completed'
                      ? 'border-green-500/30 opacity-70'
                      : 'border-slate-700/50 opacity-50'
                  } hover:border-ain-soph-amber/50`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-light text-ain-soph-gold">
                          Day {day.day}
                        </span>
                        <span className="text-sm text-ain-soph-gold/70">{day.date}</span>
                        {day.status === 'current' && (
                          <span className="px-2 py-1 bg-ain-soph-gold/20 border border-ain-soph-gold/30 rounded text-xs text-ain-soph-gold">
                            Today
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-medium mb-2">{day.title}</h4>
                      <p className="text-ain-soph-gold/70 text-sm">{day.description}</p>
                    </div>
                    <Calendar className="w-5 h-5 text-ain-soph-amber" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Week 2 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="px-4 py-2 bg-ain-soph-amber/20 border border-ain-soph-gold/30 rounded-lg">
                <span className="text-ain-soph-gold font-medium">Week 2</span>
              </div>
              <h3 className="text-xl font-light text-ain-soph-gold">The Sacred Mirror Phase</h3>
            </div>
            <div className="space-y-4">
              {week2Days.map((day, idx) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.4 }}
                  onClick={() => setSelectedDay(day)}
                  className={`cursor-pointer bg-slate-800/30 border rounded-xl p-6 transition-all ${
                    day.day === 8
                      ? 'border-ain-soph-amber bg-ain-soph-amber/10'
                      : 'border-slate-700/50 opacity-50'
                  } hover:border-ain-soph-amber/50`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-light text-ain-soph-gold">
                          Day {day.day}
                        </span>
                        <span className="text-sm text-ain-soph-gold/70">{day.date}</span>
                        {day.day === 8 && (
                          <span className="px-2 py-1 bg-amber-500/20 border border-amber-400/30 rounded text-xs text-amber-300 animate-pulse">
                            The Flip
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-medium mb-2">{day.title}</h4>
                      <p className="text-ain-soph-gold/70 text-sm">{day.description}</p>
                    </div>
                    <Calendar className="w-5 h-5 text-ain-soph-amber" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Week 3 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="px-4 py-2 bg-amber-600/20 border border-amber-400/30 rounded-lg">
                <span className="text-amber-300 font-medium">Week 3</span>
              </div>
              <h3 className="text-xl font-light text-amber-300">Integration Phase</h3>
            </div>
            <div className="space-y-4">
              {week3Days.map((day, idx) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.8 }}
                  onClick={() => setSelectedDay(day)}
                  className="cursor-pointer bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 opacity-50 hover:border-ain-soph-amber/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-light text-ain-soph-gold">
                          Day {day.day}
                        </span>
                        <span className="text-sm text-ain-soph-gold/70">{day.date}</span>
                      </div>
                      <h4 className="text-lg font-medium mb-2">{day.title}</h4>
                      <p className="text-ain-soph-gold/70 text-sm">{day.description}</p>
                    </div>
                    <Calendar className="w-5 h-5 text-ain-soph-amber" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-center py-8 border-t border-ain-soph-gold/30"
        >
          <p className="text-ain-soph-gold/70 mb-4">
            This page updates daily with real metrics from beta tester sessions
          </p>
          <Link
            href="/maia-studio"
            className="inline-flex items-center gap-2 px-6 py-3 bg-ain-soph-amber hover:bg-ain-soph-gold rounded-lg transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span>Try MAIA Studio</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
