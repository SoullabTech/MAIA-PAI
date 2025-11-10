'use client';

/**
 * Fire-Air Balance Dashboard
 *
 * Shows elemental balance and detects imbalances:
 * - Fire (teleology, projection)
 * - Air (continuity, narrative)
 * - Water (affect, depth)
 * - Earth (embodiment, practice)
 * - Aether (witness, coherence)
 *
 * Recommendations when imbalanced
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { BalanceCheck } from '@/lib/memory/bardic/types';

interface ElementalBalance {
  fire: number;    // 0-1
  air: number;
  water: number;
  earth: number;
  aether: number;
}

export default function BalanceDashboardPage() {
  const [balance, setBalance] = useState<ElementalBalance>({
    fire: 0.5,
    air: 0.5,
    water: 0.5,
    earth: 0.5,
    aether: 0.5
  });
  const [balanceCheck, setBalanceCheck] = useState<BalanceCheck | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalance();
  }, []);

  async function loadBalance() {
    try {
      const userId = 'test-user'; // TODO: Get from auth

      // Check Fire-Air balance
      const response = await fetch(`/api/telos/balance?userId=${userId}&recentDays=7`);
      const check = await response.json();

      setBalanceCheck(check);

      // Calculate element balance from recent episodes
      // TODO: Implement proper calculation from episode elemental_state
      setBalance({
        fire: 0.6,
        air: 0.7,
        water: 0.5,
        earth: 0.4,
        aether: 0.6
      });
    } catch (error) {
      console.error('Error loading balance:', error);
    } finally {
      setLoading(false);
    }
  }

  function getElementColor(element: string): string {
    const colors: Record<string, string> = {
      fire: 'from-orange-500 to-red-600',
      air: 'from-cyan-400 to-blue-500',
      water: 'from-blue-500 to-purple-600',
      earth: 'from-green-600 to-emerald-700',
      aether: 'from-purple-500 to-pink-600'
    };
    return colors[element] || 'from-gray-500 to-gray-600';
  }

  function getElementIcon(element: string): string {
    const icons: Record<string, string> = {
      fire: '🔥',
      air: '💨',
      water: '🌊',
      earth: '🌍',
      aether: '✨'
    };
    return icons[element] || '○';
  }

  function getElementDescription(element: string): string {
    const descriptions: Record<string, string> = {
      fire: 'Vision, projection, teleology - what wants to become',
      air: 'Continuity, language, meaning - narrative coherence',
      water: 'Affect, depth, feeling - emotional intelligence',
      earth: 'Embodiment, practice, habit - grounded action',
      aether: 'Witness, coherence, field - integrative awareness'
    };
    return descriptions[element] || '';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-purple-300 text-lg"
        >
          Sensing the field...
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
            <h1 className="text-4xl font-light mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              ⚖️ Elemental Balance
            </h1>
            <p className="text-purple-300/70">
              Fire-Air-Water-Earth-Aether in dynamic equilibrium
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Balance Check Alert */}
        {balanceCheck && balanceCheck.imbalance && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-900/40 to-purple-900/40 border border-orange-500/50 rounded-xl p-6 mb-8"
          >
            <h2 className="text-xl font-light mb-3 text-orange-300">
              ⚠️ Imbalance Detected
            </h2>

            {balanceCheck.imbalance === 'projection_outruns_continuity' && (
              <div className="space-y-3">
                <p className="text-purple-200">
                  <strong>Fire outruns Air:</strong> Many teloi with high strength, but few episodes aligning with them.
                  Vision without grounding.
                </p>
                {balanceCheck.recommendation && (
                  <div className="bg-slate-900/60 rounded-lg p-4 mt-4">
                    <div className="text-sm text-orange-400 mb-2">Recommendation: GROUND</div>
                    {balanceCheck.recommendation.stanza && (
                      <p className="text-purple-100 italic mb-3">
                        "{balanceCheck.recommendation.stanza}"
                      </p>
                    )}
                    {balanceCheck.recommendation.horizon_hours && (
                      <div className="text-sm text-purple-400">
                        Next {balanceCheck.recommendation.horizon_hours} hours: Create one tiny embodied step toward your strongest telos.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {balanceCheck.imbalance === 'continuity_stalls_telos' && (
              <div className="space-y-3">
                <p className="text-purple-200">
                  <strong>Air stalls Fire:</strong> Many episodes but no clear telos emerging.
                  Continuity without direction.
                </p>
                {balanceCheck.recommendation && (
                  <div className="bg-slate-900/60 rounded-lg p-4 mt-4">
                    <div className="text-sm text-cyan-400 mb-2">Recommendation: CRYSTALLIZE</div>
                    {balanceCheck.recommendation.stanza && (
                      <p className="text-purple-100 italic mb-3">
                        "{balanceCheck.recommendation.stanza}"
                      </p>
                    )}
                    <div className="text-sm text-purple-400">
                      Reflect on recent episodes and ask: What wants to become?
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Element Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Object.entries(balance).map(([element, value], index) => (
            <motion.div
              key={element}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-slate-900/80 to-purple-900/40 rounded-xl border border-purple-700/30 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{getElementIcon(element)}</div>
                <div>
                  <div className="text-lg font-light capitalize text-purple-100">
                    {element}
                  </div>
                  <div className="text-sm text-purple-400">
                    {Math.round(value * 100)}%
                  </div>
                </div>
              </div>

              <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full bg-gradient-to-r ${getElementColor(element)}`}
                />
              </div>

              <p className="text-sm text-purple-300/70 leading-relaxed">
                {getElementDescription(element)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Pentagram Visualization */}
        <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/40 rounded-xl border border-purple-700/30 p-8">
          <h2 className="text-xl font-light mb-6 text-purple-200 text-center">
            Elemental Pentagram
          </h2>

          <div className="flex justify-center">
            <svg width="300" height="300" viewBox="0 0 300 300" className="drop-shadow-2xl">
              {/* Outer circle */}
              <circle
                cx="150"
                cy="150"
                r="140"
                fill="none"
                stroke="rgba(168, 85, 247, 0.2)"
                strokeWidth="2"
              />

              {/* Inner pentagram (reference) */}
              <polygon
                points="150,20 268,115 238,235 62,235 32,115"
                fill="none"
                stroke="rgba(168, 85, 247, 0.1)"
                strokeWidth="1"
              />

              {/* Actual balance pentagram */}
              <motion.polygon
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ duration: 1 }}
                points={`
                  ${150},${150 - (balance.aether * 130)}
                  ${150 + (balance.fire * 118)},${150 - (balance.fire * 35)}
                  ${150 + (balance.earth * 88)},${150 + (balance.earth * 105)}
                  ${150 - (balance.water * 88)},${150 + (balance.water * 105)}
                  ${150 - (balance.air * 118)},${150 - (balance.air * 35)}
                `}
                fill="rgba(168, 85, 247, 0.3)"
                stroke="rgba(168, 85, 247, 0.8)"
                strokeWidth="2"
              />

              {/* Element labels */}
              <text x="150" y="15" textAnchor="middle" fill="rgba(168, 85, 247, 0.8)" fontSize="12">
                ✨ Aether
              </text>
              <text x="280" y="120" textAnchor="start" fill="rgba(168, 85, 247, 0.8)" fontSize="12">
                🔥 Fire
              </text>
              <text x="255" y="250" textAnchor="end" fill="rgba(168, 85, 247, 0.8)" fontSize="12">
                🌍 Earth
              </text>
              <text x="45" y="250" textAnchor="start" fill="rgba(168, 85, 247, 0.8)" fontSize="12">
                🌊 Water
              </text>
              <text x="20" y="120" textAnchor="end" fill="rgba(168, 85, 247, 0.8)" fontSize="12">
                💨 Air
              </text>
            </svg>
          </div>

          <p className="text-center text-sm text-purple-400/70 mt-6">
            Perfect balance forms a regular pentagram. Imbalance shows as asymmetry.
          </p>
        </div>
      </div>
    </div>
  );
}
