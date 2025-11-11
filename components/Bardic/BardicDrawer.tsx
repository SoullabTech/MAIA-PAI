/**
 * Bardic Drawer - "Show me the thread"
 *
 * Air query interface for viewing narrative threads between episodes
 * Reveals the connections between lived moments
 *
 * @module components/Bardic/BardicDrawer
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// ============================================================================
// TYPES
// ============================================================================

interface Episode {
  id: string;
  datetime: Date;
  sceneStanza: string;
  placeCue?: string;
  dominantElement?: string;
  affectValence?: number;
  affectArousal?: number;
}

interface NarrativeThread {
  episodes: Episode[];
  relationType: string;
  strength: number;
  theme?: string;
}

interface BardicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentEpisodeId?: string;
  userId: string;
  authToken: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function BardicDrawer({
  isOpen,
  onClose,
  currentEpisodeId,
  userId,
  authToken,
}: BardicDrawerProps) {
  const [threads, setThreads] = useState<NarrativeThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<NarrativeThread | null>(null);

  // ========================================================================
  // FETCH THREADS
  // ========================================================================

  useEffect(() => {
    if (!isOpen || !currentEpisodeId) return;

    async function fetchThreads() {
      setLoading(true);
      setError(null);

      try {
        // Get episode details with narrative threads
        const response = await fetch(
          `/api/bardic/recall?episodeId=${currentEpisodeId}&depth=full`,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to retrieve narrative threads');
        }

        const data = await response.json();

        // Transform linked episodes into narrative threads
        const threadMap = new Map<string, Episode[]>();

        data.details.linkedEpisodes.forEach((link: any) => {
          const relationType = link.relationType;
          if (!threadMap.has(relationType)) {
            threadMap.set(relationType, []);
          }
          threadMap.get(relationType)!.push(link.episode);
        });

        const narrativeThreads: NarrativeThread[] = Array.from(threadMap.entries()).map(
          ([relationType, episodes]) => ({
            episodes,
            relationType,
            strength: episodes.length,
          })
        );

        setThreads(narrativeThreads);
      } catch (err: any) {
        console.error('Error fetching threads:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchThreads();
  }, [isOpen, currentEpisodeId, authToken]);

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Drawer Panel (Right Edge) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-[90vw] md:w-[500px] bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-gray-800 dark:to-gray-850">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Narrative Threads
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Air query: Show me the thread
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close drawer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Weaving threads...
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              {!loading && !error && threads.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400">
                      No narrative threads found
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      This moment stands alone for now
                    </p>
                  </div>
                </div>
              )}

              {!loading && !error && threads.length > 0 && (
                <div className="space-y-6">
                  {threads.map((thread, index) => (
                    <ThreadCard
                      key={index}
                      thread={thread}
                      isSelected={selectedThread === thread}
                      onSelect={() => setSelectedThread(thread)}
                    />
                  ))}
                </div>
              )}

              {selectedThread && (
                <ThreadDetailView
                  thread={selectedThread}
                  onClose={() => setSelectedThread(null)}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// THREAD CARD
// ============================================================================

interface ThreadCardProps {
  thread: NarrativeThread;
  isSelected: boolean;
  onSelect: () => void;
}

function ThreadCard({ thread, isSelected, onSelect }: ThreadCardProps) {
  const elementColors: Record<string, string> = {
    fire: 'from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20',
    water: 'from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20',
    earth: 'from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20',
    air: 'from-sky-100 to-indigo-100 dark:from-sky-900/20 dark:to-indigo-900/20',
    aether: 'from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20',
  };

  const dominantElement = thread.episodes[0]?.dominantElement || 'air';
  const gradient = elementColors[dominantElement] || elementColors.air;

  return (
    <motion.button
      onClick={onSelect}
      className={clsx(
        'w-full text-left p-4 rounded-xl border transition-all',
        'bg-gradient-to-br',
        gradient,
        isSelected
          ? 'border-sky-400 dark:border-sky-600 shadow-lg scale-[1.02]'
          : 'border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-700'
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
          {formatRelationType(thread.relationType)}
        </h3>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300">
          {thread.episodes.length} {thread.episodes.length === 1 ? 'episode' : 'episodes'}
        </span>
      </div>

      <div className="space-y-1">
        {thread.episodes.slice(0, 3).map((episode, i) => (
          <p key={i} className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">
            "{episode.sceneStanza}"
          </p>
        ))}
        {thread.episodes.length > 3 && (
          <p className="text-xs text-gray-500 dark:text-gray-500 italic">
            +{thread.episodes.length - 3} more...
          </p>
        )}
      </div>
    </motion.button>
  );
}

// ============================================================================
// THREAD DETAIL VIEW
// ============================================================================

interface ThreadDetailViewProps {
  thread: NarrativeThread;
  onClose: () => void;
}

function ThreadDetailView({ thread, onClose }: ThreadDetailViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-60 bg-white dark:bg-gray-900 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {formatRelationType(thread.relationType)}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {thread.episodes.map((episode, index) => (
            <div
              key={episode.id}
              className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {new Date(episode.datetime).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                {episode.placeCue && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {episode.placeCue}
                  </span>
                )}
              </div>
              <p className="text-gray-800 dark:text-gray-200">{episode.sceneStanza}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function formatRelationType(type: string): string {
  const typeMap: Record<string, string> = {
    'echoes': 'Echoes of...',
    'precedes': 'Led to...',
    'follows': 'Followed from...',
    'mirrors': 'Mirrors...',
    'contrasts': 'Contrasts with...',
    'amplifies': 'Amplifies...',
  };

  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
}
