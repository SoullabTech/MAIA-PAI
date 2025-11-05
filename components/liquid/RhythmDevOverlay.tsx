'use client';

/**
 * 🌊 RHYTHM DEV OVERLAY
 *
 * Visual feedback for conversational rhythm metrics
 * Shows real-time nervous system sensing
 * Toggleable with keyboard shortcut (Cmd/Ctrl + Shift + R)
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RhythmMetrics } from '@/lib/liquid/ConversationalRhythm';
import { Activity } from 'lucide-react';

interface RhythmDevOverlayProps {
  rhythmMetrics: RhythmMetrics | null;
  visible?: boolean;
}

export function RhythmDevOverlay({ rhythmMetrics, visible = false }: RhythmDevOverlayProps) {
  const [isVisible, setIsVisible] = useState(visible);

  // Keyboard shortcut: Cmd/Ctrl + Shift + R
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'r') {
        e.preventDefault();
        setIsVisible(prev => !prev);
        console.log('🌊 [RHYTHM] Overlay toggled:', !isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!isVisible || !rhythmMetrics) return null;

  const getTempoColor = (tempo: string) => {
    switch (tempo) {
      case 'fast': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'slow': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getCoherenceColor = (coherence: number) => {
    if (coherence > 0.7) return 'text-green-400';
    if (coherence > 0.4) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="fixed right-4 z-40 pointer-events-none"
        style={{ top: 'calc(max(0.5rem, env(safe-area-inset-top)) + 4rem)' }}
      >
        <div className="bg-slate-900/90 backdrop-blur-sm border border-amber-400/30 rounded-lg p-4 shadow-2xl w-72">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-400/20">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-amber-300">
              Rhythm Sensing
            </h3>
            <span className="ml-auto text-xs text-amber-200/50">
              ⌘⇧R
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="space-y-2 font-mono text-xs">
            {/* Speech Timing */}
            <div className="space-y-1">
              <div className="text-amber-200/60 text-[10px] uppercase tracking-wider">
                Speech Timing
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-200/80">WPM:</span>
                <span className="text-amber-100 font-semibold">
                  {Math.round(rhythmMetrics.wordsPerMinute)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-200/80">Tempo:</span>
                <span className={`font-semibold ${getTempoColor(rhythmMetrics.conversationTempo)}`}>
                  {rhythmMetrics.conversationTempo}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-200/80">Avg Pause:</span>
                <span className="text-amber-100">
                  {(rhythmMetrics.averagePauseDuration / 1000).toFixed(1)}s
                </span>
              </div>
            </div>

            {/* Field Coherence */}
            <div className="space-y-1 pt-2 border-t border-amber-400/10">
              <div className="text-amber-200/60 text-[10px] uppercase tracking-wider">
                Field State
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-200/80">Coherence:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${getCoherenceColor(rhythmMetrics.rhythmCoherence)}`}
                      style={{
                        width: `${rhythmMetrics.rhythmCoherence * 100}%`,
                        background: rhythmMetrics.rhythmCoherence > 0.7
                          ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                          : rhythmMetrics.rhythmCoherence > 0.4
                          ? 'linear-gradient(90deg, #facc15, #eab308)'
                          : 'linear-gradient(90deg, #f87171, #ef4444)'
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${rhythmMetrics.rhythmCoherence * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-amber-100 text-[10px]">
                    {(rhythmMetrics.rhythmCoherence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-200/80">Breath Align:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                      style={{ width: `${rhythmMetrics.breathAlignment * 100}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${rhythmMetrics.breathAlignment * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-amber-100 text-[10px]">
                    {(rhythmMetrics.breathAlignment * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Presence Indicators */}
            <div className="space-y-1 pt-2 border-t border-amber-400/10">
              <div className="text-amber-200/60 text-[10px] uppercase tracking-wider">
                Presence
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-200/80">Silence Comfort:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                      style={{ width: `${rhythmMetrics.silenceComfort * 100}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${rhythmMetrics.silenceComfort * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-amber-100 text-[10px]">
                    {(rhythmMetrics.silenceComfort * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-200/80">Response Pressure:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-orange-400 to-red-400"
                      style={{ width: `${rhythmMetrics.responsePressure * 100}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${rhythmMetrics.responsePressure * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-amber-100 text-[10px]">
                    {(rhythmMetrics.responsePressure * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="pt-2 border-t border-amber-400/10 text-[10px] text-amber-200/50">
              <div className="flex justify-between">
                <span>Utterances:</span>
                <span>{rhythmMetrics.totalUtterances}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>
                  {Math.floor((Date.now() - rhythmMetrics.conversationStartTime) / 1000)}s
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 pt-2 border-t border-amber-400/10 text-[9px] text-amber-200/40 leading-tight">
            Press ⌘⇧R to toggle • 🌊 Liquid nervous system sensing
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
