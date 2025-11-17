'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * MAIA Baseline - Lab interface for MAIA development and testing
 * Provides development tools and baseline functionality
 */
export default function MAIABaseline() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-soul-background via-soul-surface to-soul-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-bold text-soul-textPrimary mb-4"
            >
              🧪 MAIA Lab
            </motion.h1>
            <p className="text-xl text-soul-textSecondary">
              Development baseline and experimental interface
            </p>
          </div>

          {/* Lab Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Analytics Panel */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-soul-surface border border-soul-border rounded-xl p-6 shadow-lg"
            >
              <div className="text-2xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-soul-textPrimary mb-2">
                Analytics
              </h3>
              <p className="text-soul-textSecondary text-sm">
                Monitor conversation metrics and user engagement
              </p>
            </motion.div>

            {/* Voice Testing */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-soul-surface border border-soul-border rounded-xl p-6 shadow-lg"
            >
              <div className="text-2xl mb-3">🎤</div>
              <h3 className="text-lg font-semibold text-soul-textPrimary mb-2">
                Voice Pipeline
              </h3>
              <p className="text-soul-textSecondary text-sm">
                Test voice recognition and synthesis capabilities
              </p>
            </motion.div>

            {/* Rhythm Analysis */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-soul-surface border border-soul-border rounded-xl p-6 shadow-lg"
            >
              <div className="text-2xl mb-3">🌊</div>
              <h3 className="text-lg font-semibold text-soul-textPrimary mb-2">
                Rhythm Tracker
              </h3>
              <p className="text-soul-textSecondary text-sm">
                Analyze conversational flow and timing patterns
              </p>
            </motion.div>

            {/* Component Testing */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-soul-surface border border-soul-border rounded-xl p-6 shadow-lg"
            >
              <div className="text-2xl mb-3">⚙️</div>
              <h3 className="text-lg font-semibold text-soul-textPrimary mb-2">
                Components
              </h3>
              <p className="text-soul-textSecondary text-sm">
                Test and preview UI components in isolation
              </p>
            </motion.div>

            {/* Oracle Gateway */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-soul-surface border border-soul-border rounded-xl p-6 shadow-lg"
            >
              <div className="text-2xl mb-3">🔮</div>
              <h3 className="text-lg font-semibold text-soul-textPrimary mb-2">
                Oracle Interface
              </h3>
              <p className="text-soul-textSecondary text-sm">
                Direct access to production Oracle conversation system
              </p>
              <a
                href="/oracle"
                className="inline-block mt-3 text-soul-accent hover:text-soul-accent/80 transition-colors"
              >
                Launch Oracle →
              </a>
            </motion.div>

            {/* System Health */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-soul-surface border border-soul-border rounded-xl p-6 shadow-lg"
            >
              <div className="text-2xl mb-3">💚</div>
              <h3 className="text-lg font-semibold text-soul-textPrimary mb-2">
                System Health
              </h3>
              <p className="text-soul-textSecondary text-sm">
                Monitor API status, performance, and error rates
              </p>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-soul-surface border border-soul-border rounded-xl p-6 text-center"
          >
            <h3 className="text-lg font-semibold text-soul-textPrimary mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-4 py-2 bg-soul-accent text-soul-background rounded-lg hover:bg-soul-accent/90 transition-colors">
                Reset Session
              </button>
              <button className="px-4 py-2 border border-soul-border text-soul-textPrimary rounded-lg hover:bg-soul-surface/50 transition-colors">
                Export Logs
              </button>
              <button className="px-4 py-2 border border-soul-border text-soul-textPrimary rounded-lg hover:bg-soul-surface/50 transition-colors">
                Run Tests
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}