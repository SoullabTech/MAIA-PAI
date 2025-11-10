'use client';

/**
 * Drawer Re-entry: Memory Reconstitution Interface
 *
 * Browse recent episodes and request ritual re-entry
 * Features:
 * - Timeline of episodes (stanza-based)
 * - Recognition search (semantic + cues)
 * - Safety gates (sacred/capacity checks)
 * - Cue-based reconstitution
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Episode, EpisodeCandidate, ReentryResult } from '@/lib/memory/bardic/types';

export default function DrawerReentryPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [searchText, setSearchText] = useState('');
  const [recognition, setRecognition] = useState<EpisodeCandidate[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [reentryResult, setReentryResult] = useState<ReentryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadRecentEpisodes();
  }, []);

  async function loadRecentEpisodes() {
    try {
      const userId = 'test-user'; // TODO: Get from auth
      const response = await fetch(`/api/memory/episodes?userId=${userId}&limit=20`);
      const data = await response.json();

      setEpisodes(data.episodes || []);
    } catch (error) {
      console.error('Error loading episodes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function recognizeScene() {
    if (!searchText.trim()) return;

    setSearching(true);
    try {
      const response = await fetch('/api/memory/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'test-user', // TODO: Get from auth
          recentText: searchText
        })
      });

      const data = await response.json();
      setRecognition(data.candidates || []);
    } catch (error) {
      console.error('Error recognizing:', error);
    } finally {
      setSearching(false);
    }
  }

  async function requestReentry(episodeId: string) {
    try {
      const response = await fetch('/api/memory/reenter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'test-user', // TODO: Get from auth
          episodeId,
          currentArousal: 5 // TODO: Get from biometric data
        })
      });

      const result = await response.json();
      setReentryResult(result);
    } catch (error) {
      console.error('Error requesting re-entry:', error);
    }
  }

  function getAffectLabel(valence?: number, arousal?: number): string {
    if (valence === undefined || arousal === undefined) return '';

    const valenceName = valence > 2 ? 'Joy' :
                       valence < -2 ? 'Grief' :
                       'Neutral';

    const arousalName = arousal > 7 ? 'Intense' :
                       arousal > 4 ? 'Moderate' :
                       'Calm';

    return `${valenceName}, ${arousalName}`;
  }

  function getAffectColor(valence?: number): string {
    if (!valence) return 'text-purple-400';
    if (valence > 2) return 'text-green-400';
    if (valence < -2) return 'text-blue-400';
    return 'text-purple-400';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-indigo-300 text-lg"
        >
          Opening the drawer...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-indigo-800/30 bg-slate-950/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-light mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              📖 Drawer Re-entry
            </h1>
            <p className="text-indigo-300/70">
              Memory as reconstitution, not retrieval
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Recognition Search */}
        <div className="bg-gradient-to-br from-slate-900/80 to-indigo-900/40 rounded-xl border border-indigo-700/30 p-6 mb-8">
          <h2 className="text-xl font-light mb-4 text-indigo-200">
            Recognize Familiar Scenes
          </h2>
          <p className="text-sm text-indigo-400/70 mb-4">
            Describe what you're feeling, thinking, or sensing right now...
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && recognizeScene()}
              placeholder="Restless energy, familiar place, questions about..."
              className="flex-1 bg-slate-900/50 border border-indigo-700/30 rounded-lg px-4 py-3 text-indigo-100 placeholder-indigo-400/30 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
            <button
              onClick={recognizeScene}
              disabled={!searchText.trim() || searching}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              {searching ? 'Sensing...' : '🔍 Recognize'}
            </button>
          </div>

          {/* Recognition Results */}
          {recognition.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-3"
            >
              <div className="text-sm text-indigo-400 mb-2">
                Found {recognition.length} resonant scenes:
              </div>
              {recognition.map((candidate) => (
                <div
                  key={candidate.episodeId}
                  onClick={() => setSelectedEpisode(candidate.episode)}
                  className="bg-slate-900/40 border border-indigo-700/20 rounded-lg p-4 hover:border-indigo-500/50 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm text-indigo-400">
                      {Math.round(candidate.score * 100)}% match
                    </div>
                    <div className="text-xs text-indigo-500">
                      {candidate.why}
                    </div>
                  </div>
                  <p className="text-indigo-100 italic">
                    "{candidate.episode.scene_stanza}"
                  </p>
                  {candidate.episode.place_cue && (
                    <div className="text-xs text-indigo-400/60 mt-2">
                      {candidate.episode.place_cue}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Recent Episodes Timeline */}
        <div className="space-y-3">
          <h2 className="text-xl font-light mb-4 text-indigo-200">
            Recent Episodes
          </h2>

          {episodes.map((episode, index) => (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedEpisode(episode)}
              className="bg-gradient-to-r from-slate-900/60 to-indigo-900/20 rounded-lg border border-indigo-700/20 p-5 hover:border-indigo-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-xs text-indigo-400">
                  {new Date(episode.occurred_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                {episode.affect_valence !== undefined && (
                  <div className={`text-xs ${getAffectColor(episode.affect_valence)}`}>
                    {getAffectLabel(episode.affect_valence, episode.affect_arousal)}
                  </div>
                )}
              </div>

              <p className="text-indigo-100 italic leading-relaxed mb-3">
                "{episode.scene_stanza}"
              </p>

              <div className="flex items-center gap-3 text-xs">
                {episode.place_cue && (
                  <span className="text-indigo-400/60">
                    📍 {episode.place_cue}
                  </span>
                )}
                {episode.sense_cues && episode.sense_cues.length > 0 && (
                  <span className="text-indigo-400/60">
                    🌸 {episode.sense_cues.join(', ')}
                  </span>
                )}
                {episode.sacred_flag && (
                  <span className="text-purple-400">
                    ✨ Sacred
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Episode Detail / Re-entry Modal */}
      <AnimatePresence>
        {selectedEpisode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedEpisode(null);
              setReentryResult(null);
            }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-indigo-900/60 rounded-2xl border border-indigo-700/50 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              {!reentryResult ? (
                <>
                  <h2 className="text-2xl font-light mb-6 text-indigo-100 italic">
                    "{selectedEpisode.scene_stanza}"
                  </h2>

                  <div className="space-y-4 mb-8">
                    <div>
                      <div className="text-sm text-indigo-400 mb-1">When</div>
                      <div className="text-indigo-200">
                        {new Date(selectedEpisode.occurred_at).toLocaleString()}
                      </div>
                    </div>

                    {selectedEpisode.place_cue && (
                      <div>
                        <div className="text-sm text-indigo-400 mb-1">Place</div>
                        <div className="text-indigo-200">{selectedEpisode.place_cue}</div>
                      </div>
                    )}

                    {selectedEpisode.affect_valence !== undefined && (
                      <div>
                        <div className="text-sm text-indigo-400 mb-1">Affect</div>
                        <div className={getAffectColor(selectedEpisode.affect_valence)}>
                          {getAffectLabel(selectedEpisode.affect_valence, selectedEpisode.affect_arousal)}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => requestReentry(selectedEpisode.id)}
                    disabled={selectedEpisode.sacred_flag}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
                  >
                    {selectedEpisode.sacred_flag ? '✨ Sacred (Held, Not Handled)' : '🚪 Request Re-entry'}
                  </button>
                </>
              ) : (
                <div>
                  {reentryResult.allowed ? (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-light text-green-400">
                        ✓ Re-entry Granted
                      </h2>
                      <div className="bg-indigo-900/40 rounded-lg p-6">
                        <div className="text-sm text-indigo-400 mb-2">Stanza</div>
                        <p className="text-indigo-100 italic text-lg leading-relaxed">
                          "{reentryResult.stanza}"
                        </p>
                      </div>
                      {reentryResult.cue && (
                        <div className="bg-indigo-900/40 rounded-lg p-6">
                          <div className="text-sm text-indigo-400 mb-2">Strongest Cue</div>
                          <div className="text-indigo-200">
                            {reentryResult.cue.type}: {reentryResult.cue.user_words}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-light text-yellow-400">
                        ⚠️ Re-entry Not Permitted
                      </h2>
                      <p className="text-indigo-300">
                        {reentryResult.reason === 'sacred'
                          ? 'This episode is held as sacred. It rests in silence.'
                          : reentryResult.reason === 'capacity'
                          ? 'Your current arousal level is too high for safe re-entry. Ground first.'
                          : 'Re-entry is not available at this time.'}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSelectedEpisode(null);
                      setReentryResult(null);
                    }}
                    className="mt-8 w-full px-6 py-3 bg-indigo-900/40 hover:bg-indigo-900/60 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
