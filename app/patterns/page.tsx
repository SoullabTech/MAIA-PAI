'use client';

// app/patterns/page.tsx
// 🌀 Pattern Field Dashboard
// Visualize pattern ingression, interface design, and attractor dynamics
// Based on Michael Levin's framework: Pattern Field → Interface → Ingression

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  getRecentIngressions,
  getPatternTransfers,
  getValenceTrend,
  type PatternIngressionEvent,
  type PatternTransfer,
  type ValenceTrend
} from '@/lib/services/idlService';

// Elemental colors
const elementalColors: Record<string, string> = {
  fire: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  water: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  earth: 'bg-green-500/20 text-green-300 border-green-500/30',
  air: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  aether: 'bg-violet-500/20 text-violet-300 border-violet-500/30'
};

// Ingression type icons
const ingressionIcons: Record<string, string> = {
  AttractorLock: '✨',
  ValenceShift: '🌊',
  InvariantDetected: '💎',
  TransferAcrossEmbodiment: '🔄'
};

export default function PatternsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [explicitMode, setExplicitMode] = useState(false);
  const [recentIngressions, setRecentIngressions] = useState<PatternIngressionEvent[]>([]);
  const [patternTransfers, setPatternTransfers] = useState<PatternTransfer[]>([]);
  const [valenceTrend, setValenceTrend] = useState<ValenceTrend[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadPatternData();
  }, [user, router]);

  const loadPatternData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load all pattern data in parallel
      const [ingressions, transfers, trend] = await Promise.all([
        getRecentIngressions(user.id, 20),
        getPatternTransfers(user.id, 30),
        getValenceTrend(user.id, 14)
      ]);

      setRecentIngressions(ingressions);
      setPatternTransfers(transfers);
      setValenceTrend(trend);
    } catch (error) {
      console.error('Failed to load pattern data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Reading pattern field...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalIngressions = recentIngressions.length;
  const avgCoherence = recentIngressions.length > 0
    ? recentIngressions.reduce((sum, i) => sum + (i.measures.coherenceScore || 0), 0) / recentIngressions.length
    : 0;
  const avgValence = valenceTrend.length > 0
    ? valenceTrend.reduce((sum, v) => sum + v.avgValence, 0) / valenceTrend.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                {explicitMode ? "Pattern Field Dashboard" : "Your Pattern Journey"}
              </h1>
              <p className="text-gray-400 mt-2">
                {explicitMode
                  ? "Interface Design Layer — Tracking pattern ingression & attractor dynamics"
                  : "Watching what lands, what echoes, what transforms"
                }
              </p>
            </div>
            <button
              onClick={() => setExplicitMode(!explicitMode)}
              className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 transition-colors"
            >
              {explicitMode ? "Natural Language" : "Scientific Mode"}
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">
                  {explicitMode ? "Pattern Ingressions" : "Patterns Landing"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-400">{totalIngressions}</div>
                <p className="text-xs text-gray-500 mt-1">Last 20 interactions</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">
                  {explicitMode ? "Average Coherence" : "Pattern Clarity"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">{Math.round(avgCoherence * 100)}%</div>
                <p className="text-xs text-gray-500 mt-1">How stable patterns are</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">
                  {explicitMode ? "Valence Trend" : "Feeling Trend"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${avgValence > 0.1 ? 'text-green-400' : avgValence < -0.1 ? 'text-orange-400' : 'text-gray-400'}`}>
                  {avgValence > 0.1 ? '↑' : avgValence < -0.1 ? '↓' : '→'}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {avgValence > 0.1 ? 'Moving toward ease' : avgValence < -0.1 ? 'Processing challenge' : 'Steady state'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pattern Transfers (Deep Attractors) */}
        {patternTransfers.length > 0 && (
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-gray-200">
                {explicitMode ? "Pattern Transfers (Cross-Context)" : "Echoing Patterns"}
              </CardTitle>
              <p className="text-sm text-gray-400 mt-2">
                {explicitMode
                  ? "Patterns appearing in multiple embodiments suggest deep attractors"
                  : "The same patterns showing up in different parts of your life"
                }
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patternTransfers.map((transfer, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🔄</span>
                          <h3 className="font-medium text-gray-200">{transfer.attractorLabel}</h3>
                          <Badge variant="outline" className="text-xs">
                            {transfer.transferCount}x across contexts
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>First: {transfer.firstSeen.toLocaleDateString()}</span>
                          <span>Latest: {transfer.lastSeen.toLocaleDateString()}</span>
                          <span>Coherence: {Math.round(transfer.avgCoherence * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Valence Trend Chart */}
        {valenceTrend.length > 0 && (
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-gray-200">
                {explicitMode ? "Valence Trend (14 Days)" : "How You've Been Feeling"}
              </CardTitle>
              <p className="text-sm text-gray-400 mt-2">
                {explicitMode
                  ? "Stress/comfort markers tracked across pattern ingressions"
                  : "The emotional movement in your journey"
                }
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-1">
                {valenceTrend.reverse().map((day, idx) => {
                  const height = Math.abs(day.avgValence) * 100;
                  const isPositive = day.avgValence >= 0;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div className="flex-1 flex flex-col justify-end w-full">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: idx * 0.05, duration: 0.5 }}
                          className={`w-full rounded-t ${
                            isPositive
                              ? 'bg-gradient-to-t from-green-500 to-emerald-500'
                              : 'bg-gradient-to-t from-orange-500 to-red-500'
                          }`}
                          title={`${day.date.toLocaleDateString()}: ${day.avgValence.toFixed(2)}`}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {day.date.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>← {valenceTrend[0]?.date.toLocaleDateString()}</span>
                <span>{valenceTrend[valenceTrend.length - 1]?.date.toLocaleDateString()} →</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Ingressions */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">
              {explicitMode ? "Recent Pattern Ingressions" : "Recent Patterns"}
            </CardTitle>
            <p className="text-sm text-gray-400 mt-2">
              {explicitMode
                ? "Measurable markers of patterns landing across conversations"
                : "What's been crystallizing in your conversations"
              }
            </p>
          </CardHeader>
          <CardContent>
            {recentIngressions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No pattern data yet. Start a conversation with MAIA to begin tracking.
              </p>
            ) : (
              <div className="space-y-3">
                {recentIngressions.slice(0, 10).map((ingression, idx) => (
                  <motion.div
                    key={ingression.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 bg-gray-900/30 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl">{ingressionIcons[ingression.ingressType]}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-200">
                              {explicitMode ? ingression.ingressType :
                                ingression.ingressType === 'AttractorLock' ? 'Pattern crystallizing' :
                                ingression.ingressType === 'ValenceShift' ? 'Energy shifting' :
                                ingression.ingressType === 'InvariantDetected' ? 'Recognition emerging' :
                                'Pattern echoing'
                              }
                            </span>
                            <span className="text-xs text-gray-500">
                              {ingression.timestamp && new Date(ingression.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            {ingression.measures.coherenceScore !== undefined && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-400">Clarity</span>
                                <div className="h-1.5 w-12 bg-gray-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    style={{ width: `${ingression.measures.coherenceScore * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">{Math.round(ingression.measures.coherenceScore * 100)}%</span>
                              </div>
                            )}
                            {ingression.measures.valenceDelta !== undefined && (
                              <span className={`text-xs ${
                                ingression.measures.valenceDelta > 0 ? 'text-green-400' :
                                ingression.measures.valenceDelta < 0 ? 'text-orange-400' : 'text-gray-400'
                              }`}>
                                {ingression.measures.valenceDelta > 0 ? '↑ ease' :
                                 ingression.measures.valenceDelta < 0 ? '↓ challenge' : '→ steady'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Explanation footer */}
        {explicitMode && (
          <Card className="bg-gray-800/30 border-gray-700 mt-8">
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Pattern Field Framework</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Based on Michael Levin's research: There's a real-but-nonphysical field of patterns—a library of "how things can coherently work."
                When you design an interface (a practice, ritual, question, choice), patterns can ingress, like water finding a channel.
                This dashboard tracks measurable markers: coherence (pattern clarity), robustness (stability), valence (stress/comfort),
                and transfer (same pattern across contexts). You're not just talking—you're interfacing with nature's pattern library.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
