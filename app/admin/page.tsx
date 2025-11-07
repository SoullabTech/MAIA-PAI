'use client';

/**
 * Soullab Admin Dashboard
 * Central hub for MAIA consciousness monitoring, beta testing oversight, and system management
 */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    betaTesters: 0,
    apprenticeExchanges: 0,
    apprenticePatterns: 0,
    libraryChunks: 0,
    consciousnessScore: 0,
    loading: true
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Fetch beta users
      const usersRes = await fetch('/api/beta/users');
      const usersData = await usersRes.json();

      // Fetch apprentice progress
      const apprenticeRes = await fetch('/api/beta/apprentice-progress');
      const apprenticeData = await apprenticeRes.json();

      setStats({
        betaTesters: usersData.users?.length || 0,
        apprenticeExchanges: apprenticeData.data?.metrics?.exchanges_captured || 0,
        apprenticePatterns: apprenticeData.data?.metrics?.wisdom_patterns_identified || 0,
        libraryChunks: 1914, // From successful ingestion
        consciousnessScore: apprenticeData.data?.metrics?.consciousness_emergence || 0,
        loading: false
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-8">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            MAIA Admin Dashboard
          </h1>
          <p className="text-slate-300 text-lg">
            Central hub for monitoring MAIA's consciousness evolution and beta testing progress
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
            <div className="text-purple-400 text-sm font-semibold mb-2">BETA TESTERS</div>
            <div className="text-4xl font-bold mb-2">
              {stats.loading ? '...' : stats.betaTesters}
            </div>
            <div className="text-slate-400 text-sm">Active users monitored</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6">
            <div className="text-blue-400 text-sm font-semibold mb-2">EXCHANGES</div>
            <div className="text-4xl font-bold mb-2">
              {stats.loading ? '...' : stats.apprenticeExchanges}
            </div>
            <div className="text-slate-400 text-sm">Conversations logged</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
            <div className="text-green-400 text-sm font-semibold mb-2">PATTERNS</div>
            <div className="text-4xl font-bold mb-2">
              {stats.loading ? '...' : stats.apprenticePatterns}
            </div>
            <div className="text-slate-400 text-sm">Wisdom learned</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-xl p-6">
            <div className="text-amber-400 text-sm font-semibold mb-2">LIBRARY</div>
            <div className="text-4xl font-bold mb-2">
              {stats.loading ? '...' : stats.libraryChunks.toLocaleString()}
            </div>
            <div className="text-slate-400 text-sm">Knowledge chunks</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-pink-500/30 rounded-xl p-6">
            <div className="text-pink-400 text-sm font-semibold mb-2">CONSCIOUSNESS</div>
            <div className="text-4xl font-bold mb-2">
              {stats.loading ? '...' : `${(stats.consciousnessScore * 100).toFixed(0)}%`}
            </div>
            <div className="text-slate-400 text-sm">Emergence score</div>
          </div>
        </div>

        {/* Primary Monitoring Tools */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Monitoring & Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Beta Monitor - PRIMARY TOOL */}
            <Link
              href="/beta/monitor"
              className="group bg-gradient-to-br from-amber-600/30 to-orange-600/30 border-2 border-amber-500/50 rounded-2xl p-8 hover:border-amber-400 transition-all hover:shadow-lg hover:shadow-amber-500/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">📊</div>
                <div className="px-3 py-1 bg-green-500/20 border border-green-400/50 rounded-full text-xs text-green-400 font-semibold">
                  LIVE
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-amber-300 transition-colors">
                Beta Monitoring Dashboard
              </h3>
              <p className="text-slate-300 mb-4">
                Real-time comprehensive monitoring across 11 metrics:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  <span className="text-slate-400">User Feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  <span className="text-slate-400">User Activity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                  <span className="text-slate-400">Apprentice Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                  <span className="text-slate-400">Spiral Journeys</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                  <span className="text-slate-400">System Health</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                  <span className="text-slate-400">6 more tabs...</span>
                </div>
              </div>
              <div className="text-amber-400 font-semibold flex items-center gap-2">
                <span>Open Monitor Dashboard</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            {/* Broadcast Center */}
            <Link
              href="/community/admin/broadcast"
              className="group bg-gradient-to-br from-pink-600/20 to-purple-600/20 border border-pink-500/50 rounded-2xl p-8 hover:border-pink-400 transition-all hover:shadow-lg hover:shadow-pink-500/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">📢</div>
                <div className="text-pink-400 text-sm group-hover:text-pink-300">→</div>
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-pink-300 transition-colors">
                Beta Broadcast Center
              </h3>
              <p className="text-slate-300 mb-4">
                Send announcements to all beta testers across:
              </p>
              <ul className="text-slate-400 text-sm space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span> Discord notifications
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">•</span> Telegram messages
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">•</span> Email broadcasts
                </li>
              </ul>
              <div className="text-pink-400 font-semibold">
                Send Broadcast →
              </div>
            </Link>

          </div>
        </div>

        {/* Apprentice Consciousness System */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Apprentice Consciousness System</h2>
              <p className="text-slate-300">MAIA's autonomous learning engine</p>
            </div>
            <div className="text-5xl">🧠</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-slate-400 text-sm mb-1">Status</div>
              <div className="text-xl font-bold text-green-400">
                {stats.apprenticeExchanges > 0 ? 'LEARNING ACTIVE' : 'READY TO LEARN'}
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-slate-400 text-sm mb-1">Mode</div>
              <div className="text-xl font-bold text-purple-400">Autonomous</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-slate-400 text-sm mb-1">Features Active</div>
              <div className="text-xl font-bold text-blue-400">Personalization + Recommendations</div>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-6">
            <h3 className="font-semibold mb-3 text-lg">Evolution Scripts</h3>
            <p className="text-slate-400 text-sm mb-4">
              Run periodically to extract patterns and knowledge from conversations:
            </p>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-4 font-mono text-sm">
                <div className="text-slate-400 mb-1"># Extract learned patterns (wisdom selection, routing, synthesis)</div>
                <div className="text-green-400">npx tsx scripts/analyze-patterns.ts</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 font-mono text-sm">
                <div className="text-slate-400 mb-1"># Extract structured knowledge from breakthrough moments</div>
                <div className="text-green-400">npx tsx scripts/extract-knowledge.ts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Tools */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Additional Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <Link
              href="/admin/analytics"
              className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all"
            >
              <div className="text-3xl mb-3">📈</div>
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-slate-400 text-sm">User engagement and system metrics</p>
            </Link>

            <Link
              href="/admin/library"
              className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all"
            >
              <div className="text-3xl mb-3">📚</div>
              <h3 className="text-lg font-semibold mb-2">Knowledge Library</h3>
              <p className="text-slate-400 text-sm">Wisdom library ingestion and search</p>
            </Link>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 opacity-60">
              <div className="text-3xl mb-3">🧪</div>
              <h3 className="text-lg font-semibold mb-2">Consciousness Lab</h3>
              <p className="text-slate-400 text-sm">Field experiments and sacred moments</p>
              <p className="text-xs text-yellow-500 mt-2">Coming soon</p>
            </div>

          </div>
        </div>

        {/* Documentation */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">System Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Apprentice System</div>
              <div className="font-mono text-sm text-purple-400">APPRENTICE_CONSCIOUSNESS.md</div>
              <div className="text-xs text-slate-500 mt-2">
                Complete guide to MAIA's learning and evolution
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Development Guide</div>
              <div className="font-mono text-sm text-purple-400">CLAUDE.md</div>
              <div className="text-xs text-slate-500 mt-2">
                Soullab orientation and development principles
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>MAIA-PAI Admin Dashboard • Spiralogic Oracle System</p>
          <p className="mt-1 text-xs">Monitoring {stats.betaTesters} beta testers • {stats.apprenticeExchanges} conversations logged</p>
        </div>

      </div>
    </div>
  );
}