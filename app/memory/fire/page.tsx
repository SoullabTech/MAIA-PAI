'use client';

/**
 * Fire Query: "What Wants to Become?"
 *
 * Shows active teloi (future-pull) with:
 * - Phrase (concise statement)
 * - Strength (current pull intensity)
 * - Horizon (temporal span)
 * - Signals (observable markers)
 * - Recent alignment deltas
 *
 * Visual metaphor: Flames of different intensities
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Telos } from '@/lib/memory/bardic/types';

interface TelosWithAlignment extends Telos {
  recentDeltas?: number[];
  convergenceRate?: number; // +/- rate of change
}

export default function FireQueryPage() {
  const [teloi, setTeloi] = useState<TelosWithAlignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTelos, setSelectedTelos] = useState<TelosWithAlignment | null>(null);
  const [newTelosText, setNewTelosText] = useState('');
  const [extracting, setExtracting] = useState(false);

  // Load teloi on mount
  useEffect(() => {
    loadTeloi();
  }, []);

  async function loadTeloi() {
    try {
      const userId = 'test-user'; // TODO: Get from auth
      const response = await fetch(`/api/telos?userId=${userId}`);
      const data = await response.json();

      setTeloi(data.teloi || []);
    } catch (error) {
      console.error('Error loading teloi:', error);
    } finally {
      setLoading(false);
    }
  }

  async function extractTeloi() {
    if (!newTelosText.trim()) return;

    setExtracting(true);
    try {
      const response = await fetch('/api/telos/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'test-user', // TODO: Get from auth
          text: newTelosText
        })
      });

      const data = await response.json();

      if (data.teloi && data.teloi.length > 0) {
        // Reload to show new teloi
        await loadTeloi();
        setNewTelosText('');
      }
    } catch (error) {
      console.error('Error extracting teloi:', error);
    } finally {
      setExtracting(false);
    }
  }

  // Calculate flame height based on strength
  function getFlameHeight(strength: number): number {
    return 40 + (strength * 120); // 40px to 160px
  }

  // Calculate flame color based on strength
  function getFlameColor(strength: number): string {
    if (strength > 0.7) return 'from-orange-400 via-red-500 to-purple-600';
    if (strength > 0.4) return 'from-yellow-400 via-orange-500 to-red-600';
    return 'from-yellow-300 via-yellow-400 to-orange-500';
  }

  // Calculate horizon label
  function getHorizonLabel(days?: number): string {
    if (!days) return 'Open horizon';
    if (days <= 30) return `${days} days`;
    if (days <= 90) return `${Math.round(days / 30)} months`;
    return `${Math.round(days / 365)} years`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-purple-300 text-lg"
        >
          Sensing what wants to become...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-purple-800/30 bg-slate-950/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-light mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
              🔥 What Wants to Become?
            </h1>
            <p className="text-purple-300/70">
              Fire intelligence: sensing future-pull, not predicting outcomes
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Active Teloi */}
        {teloi.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <AnimatePresence>
              {teloi.map((telos, index) => (
                <motion.div
                  key={telos.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedTelos(telos)}
                  className="relative cursor-pointer group"
                >
                  <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/40 rounded-xl border border-purple-700/30 p-6 hover:border-orange-500/50 transition-all duration-300">
                    {/* Flame visualization */}
                    <div className="absolute -top-3 -right-3">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                        className={`w-12 h-${Math.round(getFlameHeight(telos.strength) / 4)} bg-gradient-to-t ${getFlameColor(telos.strength)} rounded-full blur-sm`}
                      />
                    </div>

                    {/* Strength indicator */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-xs text-purple-400">Strength</div>
                      <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${telos.strength * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-full bg-gradient-to-r ${getFlameColor(telos.strength)}`}
                        />
                      </div>
                      <div className="text-xs text-orange-400 font-medium">
                        {Math.round(telos.strength * 100)}%
                      </div>
                    </div>

                    {/* Phrase */}
                    <p className="text-lg mb-4 text-purple-100 leading-relaxed">
                      {telos.phrase}
                    </p>

                    {/* Horizon */}
                    <div className="text-xs text-purple-400/70 mb-3">
                      Horizon: {getHorizonLabel(telos.horizon_days)}
                    </div>

                    {/* Signals preview */}
                    {telos.signals && telos.signals.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {telos.signals.slice(0, 3).map((signal, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 bg-purple-900/40 text-purple-300 rounded-full"
                          >
                            {signal}
                          </span>
                        ))}
                        {telos.signals.length > 3 && (
                          <span className="text-xs text-purple-400/50">
                            +{telos.signals.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 mb-12"
          >
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-purple-300 mb-2">No teloi sensed yet</p>
            <p className="text-purple-400/60 text-sm">
              Write or reflect below to extract what wants to become
            </p>
          </motion.div>
        )}

        {/* Extract new teloi */}
        <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/40 rounded-xl border border-purple-700/30 p-6">
          <h2 className="text-xl font-light mb-4 text-purple-200">
            Extract Future-Pull
          </h2>
          <p className="text-sm text-purple-400/70 mb-4">
            Write freely about what's stirring, emerging, or knocking at the door of becoming.
          </p>

          <textarea
            value={newTelosText}
            onChange={(e) => setNewTelosText(e.target.value)}
            placeholder="Something wants to shift in how I... I sense myself moving toward... This practice is asking for..."
            className="w-full h-32 bg-slate-900/50 border border-purple-700/30 rounded-lg p-4 text-purple-100 placeholder-purple-400/30 focus:outline-none focus:border-orange-500/50 transition-colors"
          />

          <button
            onClick={extractTeloi}
            disabled={!newTelosText.trim() || extracting}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-purple-700 transition-all duration-300"
          >
            {extracting ? 'Sensing...' : '🔥 Extract Teloi'}
          </button>
        </div>
      </div>

      {/* Telos detail modal */}
      <AnimatePresence>
        {selectedTelos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTelos(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-purple-900/60 rounded-2xl border border-purple-700/50 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-light mb-6 text-purple-100">
                {selectedTelos.phrase}
              </h2>

              <div className="space-y-6">
                {/* Strength */}
                <div>
                  <div className="text-sm text-purple-400 mb-2">Pull Strength</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${selectedTelos.strength * 100}%` }}
                        className={`h-full bg-gradient-to-r ${getFlameColor(selectedTelos.strength)}`}
                      />
                    </div>
                    <div className="text-orange-400 font-medium">
                      {Math.round(selectedTelos.strength * 100)}%
                    </div>
                  </div>
                </div>

                {/* Horizon */}
                <div>
                  <div className="text-sm text-purple-400 mb-2">Temporal Horizon</div>
                  <div className="text-purple-200">
                    {getHorizonLabel(selectedTelos.horizon_days)}
                  </div>
                </div>

                {/* Signals */}
                {selectedTelos.signals && selectedTelos.signals.length > 0 && (
                  <div>
                    <div className="text-sm text-purple-400 mb-2">Observable Signals</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTelos.signals.map((signal, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-purple-900/40 text-purple-200 rounded-full text-sm"
                        >
                          {signal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Created */}
                <div>
                  <div className="text-sm text-purple-400 mb-2">First Emerged</div>
                  <div className="text-purple-300 text-sm">
                    {new Date(selectedTelos.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedTelos(null)}
                className="mt-8 w-full px-6 py-3 bg-purple-900/40 hover:bg-purple-900/60 rounded-lg transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
