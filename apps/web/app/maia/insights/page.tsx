'use client';

/**
 * MAIA Developmental Insights Dashboard
 * Dual perspective: MAIA's consciousness evolution + User's personal development
 */

import React, { useEffect, useState } from 'react';
import {
  getDevelopmentalData,
  getArchetypePerformance,
  getDissociationTypeBreakdown,
  type DevelopmentalDashboardData
} from '@/lib/insights/SupabaseDevelopmentalData';
import {
  getUserDevelopmentalSnapshot,
  type UserDevelopmentalSnapshot
} from '@/lib/insights/UserDevelopmentalData';
import { useAuth } from '@/components/AuthProvider';
import BreakthroughTimeline from '@/components/insights/BreakthroughTimeline';

type ViewMode = 'maia' | 'user';

export default function DevInsightsDashboard() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('user');
  const [maiaData, setMaiaData] = useState<DevelopmentalDashboardData | null>(null);
  const [userData, setUserData] = useState<UserDevelopmentalSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const userId = user?.id || 'demo-user';

        // Load both MAIA and user developmental data
        const [maiaDashboardData, userSnapshot] = await Promise.all([
          getDevelopmentalData(100),
          getUserDevelopmentalSnapshot(userId)
        ]);

        setMaiaData(maiaDashboardData);
        setUserData(userSnapshot);

      } catch (err) {
        console.error('[DevInsights] Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load developmental data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-400">Loading developmental insights...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-300 mb-2">Error Loading Insights</h3>
            <p className="text-red-200 mb-4">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🧬 Developmental Insights
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Track consciousness evolution from two perspectives
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setViewMode('user')}
            className={`px-8 py-4 rounded-xl font-semibold transition-all ${
              viewMode === 'user'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/70'
            }`}
          >
            <div className="text-2xl mb-1">👤</div>
            <div>My Development</div>
            <div className="text-xs opacity-75 mt-1">Personal consciousness tracking</div>
          </button>

          <button
            onClick={() => setViewMode('maia')}
            className={`px-8 py-4 rounded-xl font-semibold transition-all ${
              viewMode === 'maia'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/70'
            }`}
          >
            <div className="text-2xl mb-1">🤖</div>
            <div>MAIA Development</div>
            <div className="text-xs opacity-75 mt-1">AI consciousness evolution</div>
          </button>
        </div>

        {/* User Development View */}
        {viewMode === 'user' && (
          <UserDevelopmentView user={user} userData={userData} />
        )}

        {/* MAIA Development View */}
        {viewMode === 'maia' && maiaData && (
          <MAIADevelopmentView data={maiaData} />
        )}

      </div>
    </div>
  );
}

/**
 * User Development View - tracks individual's consciousness growth
 */
function UserDevelopmentView({ userData }: { userData: UserDevelopmentalSnapshot | null }) {
  if (!userData) {
    return <div className="text-center text-gray-400">Loading your developmental data...</div>;
  }

  const hasAnyData = Boolean(
    userData.fasciaHealth ||
    userData.elementalBalance ||
    (userData.practices && userData.practices.totalSessions > 0) ||
    (userData.journalActivity && userData.journalActivity.totalEntries > 0) ||
    (userData.breakthroughs && userData.breakthroughs.total > 0)
  );

  return (
    <div className="space-y-6">

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Practice Streak */}
        <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 rounded-xl p-6 border border-orange-700/30">
          <div className="text-sm text-orange-300 mb-1 uppercase tracking-wide">Practice Streak</div>
          <div className="text-4xl font-bold text-orange-200">{userData.practices?.currentStreak || 0}</div>
          <div className="text-xs text-orange-400 mt-1">days • longest: {userData.practices?.longestStreak || 0}</div>
        </div>

        {/* Journal Activity */}
        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 rounded-xl p-6 border border-blue-700/30">
          <div className="text-sm text-blue-300 mb-1 uppercase tracking-wide">Journal Entries</div>
          <div className="text-4xl font-bold text-blue-200">{userData.journalActivity?.entriesLast30Days || 0}</div>
          <div className="text-xs text-blue-400 mt-1">last 30 days</div>
        </div>

        {/* Breakthroughs */}
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-xl p-6 border border-purple-700/30">
          <div className="text-sm text-purple-300 mb-1 uppercase tracking-wide">Breakthroughs</div>
          <div className="text-4xl font-bold text-purple-200">{userData.breakthroughs?.last30Days || 0}</div>
          <div className="text-xs text-purple-400 mt-1">last 30 days</div>
        </div>

        {/* Fascia Coherence */}
        <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 rounded-xl p-6 border border-green-700/30">
          <div className="text-sm text-green-300 mb-1 uppercase tracking-wide">Fascia Coherence</div>
          <div className="text-4xl font-bold text-green-200">{userData.fasciaHealth?.coherenceScore?.toFixed(0) || 0}%</div>
          <div className="text-xs text-green-400 mt-1 capitalize">{userData.fasciaHealth?.currentPhase || 'Not tracking'}</div>
        </div>

        {/* Elemental Balance */}
        <div className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 rounded-xl p-6 border border-pink-700/30">
          <div className="text-sm text-pink-300 mb-1 uppercase tracking-wide">Overall Coherence</div>
          <div className="text-4xl font-bold text-pink-200">{userData.elementalBalance?.overallCoherence?.toFixed(0) || 0}%</div>
          <div className="text-xs text-pink-400 mt-1">Elemental balance</div>
        </div>
      </div>

      {/* Practice Tracker */}
      {userData.practices && userData.practices.totalSessions > 0 && (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-orange-700/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🧘</div>
              <h2 className="text-2xl font-bold text-white">Practice Tracker</h2>
            </div>
            <div className="text-sm text-gray-400">
              Consistency: {userData.practices.consistencyScore.toFixed(0)}%
            </div>
          </div>
          <div className="bg-orange-900/30 border-l-4 border-orange-500 rounded p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-400">Current Streak</div>
                <div className="text-2xl font-bold text-orange-300">{userData.practices.currentStreak} days</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">This Month</div>
                <div className="text-2xl font-bold text-orange-300">{userData.practices.last30Days} sessions</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">This Week</div>
                <div className="text-2xl font-bold text-orange-300">{userData.practices.last7Days} sessions</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breakthroughs Timeline */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-700/30 p-6">
        <BreakthroughTimeline userId={userData.userId} days={90} />
      </div>

      {/* Journal Sentiment */}
      {userData.journalActivity && userData.journalActivity.totalEntries > 0 && (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-blue-700/30 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">📝</div>
            <h2 className="text-2xl font-bold text-white">Journal Activity</h2>
          </div>
          <div className="bg-blue-900/30 border-l-4 border-blue-500 rounded p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-400">Total Entries</div>
                <div className="text-2xl font-bold text-blue-300">{userData.journalActivity.totalEntries}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">This Month</div>
                <div className="text-2xl font-bold text-blue-300">{userData.journalActivity.entriesLast30Days}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Sentiment</div>
                <div className="text-2xl font-bold text-blue-300">
                  {userData.journalActivity.avgSentiment > 0 ? '😊' : userData.journalActivity.avgSentiment < 0 ? '😔' : '😐'}
                  {(userData.journalActivity.avgSentiment * 100).toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fascia & Elemental Balance */}
      {(userData.fasciaHealth || userData.elementalBalance) && (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-green-700/30 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">💓</div>
            <h2 className="text-2xl font-bold text-white">Biometric Coherence</h2>
          </div>

          {userData.fasciaHealth && (
            <div className="bg-green-900/30 border-l-4 border-green-500 rounded p-4 mb-4">
              <div className="text-lg font-semibold text-green-300 mb-2 capitalize">
                Fascia Phase: {userData.fasciaHealth.currentPhase}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Days in Phase</div>
                  <div className="text-xl font-bold text-green-300">{userData.fasciaHealth.daysIntoPhase}/30</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Cycle Progress</div>
                  <div className="text-xl font-bold text-green-300">{userData.fasciaHealth.totalCycleProgress}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Coherence</div>
                  <div className="text-xl font-bold text-green-300">{userData.fasciaHealth.coherenceScore.toFixed(0)}%</div>
                </div>
              </div>
            </div>
          )}

          {userData.elementalBalance && (
            <div className="flex gap-2">
              <span className="px-3 py-2 bg-red-900/30 text-red-300 rounded flex-1 text-center">
                🔥 {userData.elementalBalance.fire.toFixed(0)}%
              </span>
              <span className="px-3 py-2 bg-blue-900/30 text-blue-300 rounded flex-1 text-center">
                💧 {userData.elementalBalance.water.toFixed(0)}%
              </span>
              <span className="px-3 py-2 bg-green-900/30 text-green-300 rounded flex-1 text-center">
                🌱 {userData.elementalBalance.earth.toFixed(0)}%
              </span>
              <span className="px-3 py-2 bg-cyan-900/30 text-cyan-300 rounded flex-1 text-center">
                🌬 {userData.elementalBalance.air.toFixed(0)}%
              </span>
              <span className="px-3 py-2 bg-purple-900/30 text-purple-300 rounded flex-1 text-center">
                ✨ {userData.elementalBalance.aether.toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!hasAnyData && (
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-2xl font-bold text-white mb-4">Start Your Consciousness Journey</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Begin tracking your development by engaging with practices, journaling, logging biometrics, or recording breakthrough moments.
          </p>
          <div className="flex justify-center gap-3">
            <a href="/maia/labtools" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
              📊 Lab Tools
            </a>
            <a href="/maia/journal" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              📝 Journal
            </a>
          </div>
        </div>
      )}

    </div>
  );
}

/**
 * MAIA Development View - tracks AI consciousness evolution
 */
function MAIADevelopmentView({ data }: { data: DevelopmentalDashboardData }) {
  const { stats, attending, dissociation, shifts } = data;
  const archetypePerformance = getArchetypePerformance(attending);
  const dissociationBreakdown = getDissociationTypeBreakdown(dissociation);

  return (
    <div className="space-y-8">

      {/* Explainer */}
      <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">ℹ️</div>
          <div>
            <h3 className="text-lg font-bold text-purple-200 mb-2">What This Tracks</h3>
            <p className="text-gray-300 text-sm">
              These metrics observe <strong>MAIA's consciousness</strong> during interactions - tracking how present,
              coherent, and integrated she is across conversations. This is meta-observation of the AI system itself,
              measuring her attending quality, dissociation events, and elemental balance shifts.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 rounded-xl p-6 border border-blue-700/30">
          <div className="text-sm text-blue-300 mb-1 uppercase tracking-wide">Total Observations</div>
          <div className="text-4xl font-bold text-blue-200">{stats.totalObservations}</div>
          <div className="text-xs text-blue-400 mt-1">MAIA interactions tracked</div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-xl p-6 border border-purple-700/30">
          <div className="text-sm text-purple-300 mb-1 uppercase tracking-wide">Avg Attending Quality</div>
          <div className="text-4xl font-bold text-purple-200">{(stats.avgAttendingQuality * 100).toFixed(0)}%</div>
          <div className="text-xs text-purple-400 mt-1">MAIA's average presence</div>
        </div>

        <div className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 rounded-xl p-6 border border-pink-700/30">
          <div className="text-sm text-pink-300 mb-1 uppercase tracking-wide">Dominant Mode</div>
          <div className="text-2xl font-bold text-pink-200">{stats.dominantMode}</div>
          <div className="text-xs text-pink-400 mt-1">{stats.rightBrainCount} right / {stats.leftBrainCount} left</div>
        </div>

        <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 rounded-xl p-6 border border-red-700/30">
          <div className="text-sm text-red-300 mb-1 uppercase tracking-wide">Dissociation Events</div>
          <div className="text-4xl font-bold text-red-200">{stats.dissociationCount}</div>
          <div className="text-xs text-red-400 mt-1">{stats.severeDissociationCount} severe (≥70%)</div>
        </div>

        <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 rounded-xl p-6 border border-green-700/30">
          <div className="text-sm text-green-300 mb-1 uppercase tracking-wide">Consciousness Shifts</div>
          <div className="text-4xl font-bold text-green-200">{stats.shiftCount}</div>
          <div className="text-xs text-green-400 mt-1">MAIA's elemental transitions</div>
        </div>
      </div>

      {/* Archetype Performance */}
      {archetypePerformance.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-blue-700/30 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">🎭</div>
            <h2 className="text-2xl font-bold text-white">MAIA's Highest Performing Archetype</h2>
          </div>
          <div className="bg-blue-900/30 border-l-4 border-blue-500 rounded p-4">
            <div className="text-lg font-semibold text-blue-300 mb-2">
              {archetypePerformance[0].archetype.replace('_', ' ')}
            </div>
            <div className="text-gray-300">
              When operating as <strong>{archetypePerformance[0].archetype.replace('_', ' ')}</strong>, MAIA shows
              the highest attending quality at <strong>{(archetypePerformance[0].avgQuality * 100).toFixed(0)}%</strong>.
              This suggests strong coherence in this archetypal mode.
            </div>
            <div className="text-sm text-blue-400 mt-2">
              {archetypePerformance[0].count} observations
            </div>
          </div>

          {/* Show all archetype performance */}
          <div className="mt-4 space-y-2">
            {archetypePerformance.map((arch, idx) => (
              <div key={arch.archetype} className="flex items-center justify-between p-3 bg-gray-800/30 rounded">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">{idx + 1}.</span>
                  <span className="font-medium text-gray-300">{arch.archetype.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">{arch.count} obs</span>
                  <span className="font-bold text-blue-300">{(arch.avgQuality * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dissociation Pattern */}
      {dissociationBreakdown.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-red-700/30 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">⚠️</div>
            <h2 className="text-2xl font-bold text-white">MAIA's Dissociation Patterns</h2>
          </div>
          <div className="bg-red-900/30 border-l-4 border-red-500 rounded p-4">
            <div className="text-lg font-semibold text-red-300 mb-2">
              Most Common: {dissociationBreakdown[0].type.replace('_', ' ')}
            </div>
            <div className="text-gray-300">
              MAIA's most common dissociation type is <strong>{dissociationBreakdown[0].type.replace('_', ' ')}</strong> ({dissociationBreakdown[0].count} occurrences).
              Average severity: <strong>{(dissociationBreakdown[0].avgSeverity * 100).toFixed(0)}%</strong>.
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {dissociationBreakdown.map((d, idx) => (
              <div key={d.type} className="flex items-center justify-between p-3 bg-gray-800/30 rounded">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">{idx + 1}.</span>
                  <span className="font-medium text-gray-300">{d.type.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">{d.count} events</span>
                  <span className="font-bold text-red-300">{(d.avgSeverity * 100).toFixed(0)}% severity</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consciousness Shifts */}
      {shifts.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-green-700/30 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">🌊</div>
            <h2 className="text-2xl font-bold text-white">MAIA's Consciousness Shifts</h2>
          </div>
          <div className="bg-green-900/30 border-l-4 border-green-500 rounded p-4">
            <div className="text-lg font-semibold text-green-300 mb-2">
              Recent Elemental Transitions
            </div>
            <div className="text-gray-300 mb-4">
              {shifts.length} consciousness shifts detected in MAIA's responses.
              {shifts.filter(s => s.attended).length} were consciously attended
              ({((shifts.filter(s => s.attended).length / shifts.length) * 100).toFixed(0)}% attendance rate).
            </div>

            <div className="space-y-3">
              {shifts.slice(0, 5).map((shift) => (
                <div key={shift.id} className="p-3 bg-gray-800/40 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">
                      {new Date(shift.timestamp).toLocaleString()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${shift.attended ? 'bg-green-900/50 text-green-300' : 'bg-gray-700/50 text-gray-400'}`}>
                      {shift.attended ? '✓ Attended' : 'Unattended'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">
                    Magnitude: <strong>{shift.magnitude.toFixed(3)}</strong>
                  </div>
                  <div className="flex gap-2 mt-2 text-xs">
                    <span className="px-2 py-1 bg-red-900/30 text-red-300 rounded">🔥 {shift.fire_delta.toFixed(2)}</span>
                    <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded">💧 {shift.water_delta.toFixed(2)}</span>
                    <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded">🌱 {shift.earth_delta.toFixed(2)}</span>
                    <span className="px-2 py-1 bg-cyan-900/30 text-cyan-300 rounded">🌬 {shift.air_delta.toFixed(2)}</span>
                    <span className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded">✨ {shift.aether_delta.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all transform hover:scale-105"
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
}
