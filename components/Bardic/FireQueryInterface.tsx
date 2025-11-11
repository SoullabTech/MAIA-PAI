/**
 * Fire Query Interface
 *
 * Right PFC cognition: What wants to emerge?
 * Interface for exploring teleological attractors and crystallizing teloi
 *
 * @module components/Bardic/FireQueryInterface
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// ============================================================================
// TYPES
// ============================================================================

interface Telos {
  id: string;
  phrase: string;
  strength: number;
  horizonDays: number;
  signals?: string[];
  isActive: boolean;
  createdAt: Date;
}

interface CrystallizationMoment {
  telos: Telos;
  recentAlignment: number;
  velocity: number;
  isCrystallizing: boolean;
}

type FireQuery = 'emerge' | 'forward' | 'clearer';

interface FireQueryInterfaceProps {
  userId: string;
  authToken: string;
  onTelosSelect?: (telos: Telos) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function FireQueryInterface({
  userId,
  authToken,
  onTelosSelect,
}: FireQueryInterfaceProps) {
  const [activeQuery, setActiveQuery] = useState<FireQuery>('emerge');
  const [teloi, setTeloi] = useState<Telos[]>([]);
  const [crystallizing, setCrystallizing] = useState<CrystallizationMoment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ========================================================================
  // EXECUTE FIRE QUERY
  // ========================================================================

  async function executeQuery(query: FireQuery) {
    setLoading(true);
    setError(null);
    setActiveQuery(query);

    try {
      const response = await fetch(`/api/bardic/fire?query=${query}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to execute fire query');
      }

      const data = await response.json();
      setTeloi(data.teloi || data.crystallizing || []);

      // Fetch crystallization data if not included
      if (query === 'clearer') {
        setCrystallizing(data.crystallizing || []);
      }
    } catch (err: any) {
      console.error('Error executing fire query:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ========================================================================
  // INITIAL LOAD
  // ========================================================================

  useEffect(() => {
    executeQuery('emerge');
  }, [userId, authToken]);

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* Fire Query Selector */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Fire Cognition
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Right PFC orientation toward becoming
        </p>

        <div className="flex flex-wrap gap-3">
          <QueryButton
            active={activeQuery === 'emerge'}
            onClick={() => executeQuery('emerge')}
            icon="🔥"
          >
            What wants to emerge?
          </QueryButton>

          <QueryButton
            active={activeQuery === 'forward'}
            onClick={() => executeQuery('forward')}
            icon="➡️"
          >
            What's pulling me forward?
          </QueryButton>

          <QueryButton
            active={activeQuery === 'clearer'}
            onClick={() => executeQuery('clearer')}
            icon="✨"
          >
            What's becoming clearer?
          </QueryButton>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Querying the field...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {!loading && !error && teloi.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌑</div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              The field is quiet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              No strong future pressures detected
            </p>
          </div>
        )}

        {!loading && !error && teloi.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {activeQuery === 'clearer' && crystallizing.length > 0
              ? crystallizing.map((moment) => (
                  <CrystallizingTelosCard
                    key={moment.telos.id}
                    moment={moment}
                    onSelect={() => onTelosSelect?.(moment.telos)}
                  />
                ))
              : teloi.map((telos) => (
                  <TelosCard
                    key={telos.id}
                    telos={telos}
                    onSelect={() => onTelosSelect?.(telos)}
                  />
                ))}
          </div>
        )}
      </div>

      {/* Create Telos Button */}
      <div className="mt-8 flex justify-center">
        <CreateTelosButton authToken={authToken} onCreate={executeQuery} />
      </div>
    </div>
  );
}

// ============================================================================
// QUERY BUTTON
// ============================================================================

interface QueryButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  children: React.ReactNode;
}

function QueryButton({ active, onClick, icon, children }: QueryButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={clsx(
        'px-4 py-3 rounded-xl font-medium transition-all',
        'border-2 flex items-center gap-2',
        active
          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent shadow-lg'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-xl">{icon}</span>
      <span>{children}</span>
    </motion.button>
  );
}

// ============================================================================
// TELOS CARD
// ============================================================================

interface TelosCardProps {
  telos: Telos;
  onSelect: () => void;
}

function TelosCard({ telos, onSelect }: TelosCardProps) {
  const strengthPercentage = Math.round(telos.strength * 100);

  return (
    <motion.div
      className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all cursor-pointer"
      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {telos.phrase}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Horizon: {telos.horizonDays} days
          </p>
        </div>
        <div className="ml-4">
          <StrengthIndicator strength={telos.strength} />
        </div>
      </div>

      {telos.signals && telos.signals.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Observable signals:
          </p>
          <div className="flex flex-wrap gap-2">
            {telos.signals.slice(0, 3).map((signal, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
              >
                {signal}
              </span>
            ))}
            {telos.signals.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                +{telos.signals.length - 3}
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// CRYSTALLIZING TELOS CARD
// ============================================================================

interface CrystallizingTelosCardProps {
  moment: CrystallizationMoment;
  onSelect: () => void;
}

function CrystallizingTelosCard({ moment, onSelect }: CrystallizingTelosCardProps) {
  return (
    <motion.div
      className="p-6 rounded-xl border-2 border-yellow-400 dark:border-yellow-600 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 cursor-pointer relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      {/* Crystallization Indicator */}
      <div className="absolute top-2 right-2">
        <motion.div
          className="text-2xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          ✨
        </motion.div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 pr-8">
        {moment.telos.phrase}
      </h3>

      <div className="space-y-2 mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Alignment</span>
          <span className="font-semibold text-yellow-700 dark:text-yellow-300">
            +{moment.recentAlignment.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Velocity</span>
          <span className="font-semibold text-orange-700 dark:text-orange-300">
            {moment.velocity.toFixed(3)}/day
          </span>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-white/60 dark:bg-gray-800/60">
        <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
          🔥 Crystallizing - this future pressure is manifesting into form
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// STRENGTH INDICATOR
// ============================================================================

function StrengthIndicator({ strength }: { strength: number }) {
  const percentage = Math.round(strength * 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - strength)}`}
            className="text-orange-500 dark:text-orange-400 transition-all duration-500"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            {percentage}%
          </span>
        </div>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">strength</span>
    </div>
  );
}

// ============================================================================
// CREATE TELOS BUTTON
// ============================================================================

interface CreateTelosButtonProps {
  authToken: string;
  onCreate: (query: FireQuery) => void;
}

function CreateTelosButton({ authToken, onCreate }: CreateTelosButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [signals, setSignals] = useState<string[]>([]);
  const [currentSignal, setCurrentSignal] = useState('');
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    if (!phrase.trim()) return;

    setCreating(true);

    try {
      const response = await fetch('/api/bardic/fire', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          phrase,
          signals: signals.length > 0 ? signals : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create telos');
      }

      // Reset form
      setPhrase('');
      setSignals([]);
      setIsOpen(false);

      // Refresh query
      onCreate('emerge');
    } catch (err) {
      console.error('Error creating telos:', err);
      alert('Failed to create telos');
    } finally {
      setCreating(false);
    }
  }

  function addSignal() {
    if (currentSignal.trim()) {
      setSignals([...signals, currentSignal.trim()]);
      setCurrentSignal('');
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        + Register New Telos
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Register New Telos
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What wants to become?
                  </label>
                  <input
                    type="text"
                    value={phrase}
                    onChange={(e) => setPhrase(e.target.value)}
                    placeholder="e.g., Writing every morning"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Observable signals (optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentSignal}
                      onChange={(e) => setCurrentSignal(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSignal()}
                      placeholder="Add a signal..."
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      onClick={addSignal}
                      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      Add
                    </button>
                  </div>
                  {signals.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {signals.map((signal, i) => (
                        <span
                          key={i}
                          className="text-sm px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 flex items-center gap-2"
                        >
                          {signal}
                          <button
                            onClick={() => setSignals(signals.filter((_, idx) => idx !== i))}
                            className="hover:text-orange-900 dark:hover:text-orange-100"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!phrase.trim() || creating}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
