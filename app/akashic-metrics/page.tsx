'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface FieldMetrics {
  totalInsights: number;
  sourceBreakdown: { source: string; count: number; percentage: number }[];
  elementDistribution: { element: string; count: number; percentage: number }[];
  archetypeDistribution: { archetype: string; count: number; percentage: number }[];
  recentGrowth: { date: string; count: number }[];
  averageContentLength: number;
  uniqueUsers: number;
  uniqueSessions: number;
  oldestInsight: string;
  newestInsight: string;
}

export default function AkashicMetricsPage() {
  const [metrics, setMetrics] = useState<FieldMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    try {
      setLoading(true);
      setError(null);

      // Total insights
      const { count: totalInsights, error: countError } = await supabase
        .from('insight_history')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // Source breakdown
      const { data: sourceData, error: sourceError } = await supabase
        .from('insight_history')
        .select('source')
        .order('source');

      if (sourceError) throw sourceError;

      const sourceCounts: Record<string, number> = {};
      sourceData?.forEach(row => {
        sourceCounts[row.source] = (sourceCounts[row.source] || 0) + 1;
      });

      const sourceBreakdown = Object.entries(sourceCounts).map(([source, count]) => ({
        source,
        count,
        percentage: ((count / (totalInsights || 1)) * 100)
      }));

      // Element distribution
      const { data: elementData, error: elementError } = await supabase
        .from('insight_history')
        .select('element')
        .not('element', 'is', null);

      if (elementError) throw elementError;

      const elementCounts: Record<string, number> = {};
      elementData?.forEach(row => {
        elementCounts[row.element] = (elementCounts[row.element] || 0) + 1;
      });

      const elementDistribution = Object.entries(elementCounts).map(([element, count]) => ({
        element,
        count,
        percentage: ((count / (elementData?.length || 1)) * 100)
      })).sort((a, b) => b.count - a.count);

      // Archetype distribution
      const { data: archetypeData, error: archetypeError } = await supabase
        .from('insight_history')
        .select('archetype')
        .not('archetype', 'is', null);

      if (archetypeError) throw archetypeError;

      const archetypeCounts: Record<string, number> = {};
      archetypeData?.forEach(row => {
        archetypeCounts[row.archetype] = (archetypeCounts[row.archetype] || 0) + 1;
      });

      const archetypeDistribution = Object.entries(archetypeCounts).map(([archetype, count]) => ({
        archetype,
        count,
        percentage: ((count / (archetypeData?.length || 1)) * 100)
      })).sort((a, b) => b.count - a.count);

      // Recent growth (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentData, error: recentError } = await supabase
        .from('insight_history')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at');

      if (recentError) throw recentError;

      const dailyCounts: Record<string, number> = {};
      recentData?.forEach(row => {
        const date = new Date(row.created_at).toISOString().split('T')[0];
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      });

      const recentGrowth = Object.entries(dailyCounts).map(([date, count]) => ({
        date,
        count
      })).sort((a, b) => a.date.localeCompare(b.date));

      // Content stats
      const { data: contentData, error: contentError } = await supabase
        .from('insight_history')
        .select('content');

      if (contentError) throw contentError;

      const averageContentLength = contentData?.length
        ? Math.round(contentData.reduce((sum, row) => sum + (row.content?.length || 0), 0) / contentData.length)
        : 0;

      // Unique users
      const { data: userData, error: userError } = await supabase
        .from('insight_history')
        .select('user_id')
        .not('user_id', 'is', null);

      if (userError) throw userError;

      const uniqueUsers = new Set(userData?.map(row => row.user_id)).size;

      // Unique sessions
      const { data: sessionData, error: sessionError } = await supabase
        .from('insight_history')
        .select('session_id')
        .not('session_id', 'is', null);

      if (sessionError) throw sessionError;

      const uniqueSessions = new Set(sessionData?.map(row => row.session_id)).size;

      // Oldest and newest insights
      const { data: oldestData, error: oldestError } = await supabase
        .from('insight_history')
        .select('created_at')
        .order('created_at', { ascending: true })
        .limit(1);

      const { data: newestData, error: newestError } = await supabase
        .from('insight_history')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1);

      setMetrics({
        totalInsights: totalInsights || 0,
        sourceBreakdown,
        elementDistribution,
        archetypeDistribution,
        recentGrowth,
        averageContentLength,
        uniqueUsers,
        uniqueSessions,
        oldestInsight: oldestData?.[0]?.created_at || 'N/A',
        newestInsight: newestData?.[0]?.created_at || 'N/A'
      });
    } catch (err: any) {
      console.error('Failed to fetch metrics:', err);
      setError(err.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  }

  const elementColors: Record<string, string> = {
    Fire: 'bg-red-500/20 text-red-300 border-red-500/30',
    Water: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Earth: 'bg-green-500/20 text-green-300 border-green-500/30',
    Air: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    Aether: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  };

  const sourceIcons: Record<string, string> = {
    MAIA: '🎙️',
    ClaudeMirror: '🜂',
    Astrology: '🌟',
    Document: '📄',
    Divination: '🔮'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Akashic Field Metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Metrics</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchMetrics}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/10 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🜃 Akashic Field Metrics
          </h1>
          <p className="text-gray-400">SL-2025-02: Unified Wisdom Field Evolution</p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-6">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-3xl font-bold text-purple-400">{metrics?.totalInsights}</div>
            <div className="text-sm text-gray-400">Total Insights</div>
          </div>

          <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-6">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-3xl font-bold text-blue-400">{metrics?.uniqueUsers}</div>
            <div className="text-sm text-gray-400">Unique Users</div>
          </div>

          <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-6">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-3xl font-bold text-green-400">{metrics?.averageContentLength}</div>
            <div className="text-sm text-gray-400">Avg Content Length</div>
          </div>

          <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-6">
            <div className="text-3xl mb-2">🔗</div>
            <div className="text-3xl font-bold text-yellow-400">{metrics?.uniqueSessions}</div>
            <div className="text-sm text-gray-400">Unique Sessions</div>
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Source Distribution</h2>
          <div className="space-y-3">
            {metrics?.sourceBreakdown.map(({ source, count, percentage }) => (
              <div key={source} className="flex items-center gap-4">
                <div className="text-2xl w-8">{sourceIcons[source] || '📦'}</div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{source}</span>
                    <span className="text-gray-400">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Element & Archetype Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Element Distribution */}
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Elemental Distribution</h2>
            <div className="space-y-2">
              {metrics?.elementDistribution.map(({ element, count, percentage }) => (
                <div key={element} className={`p-3 rounded-lg border ${elementColors[element] || 'bg-gray-700/20 text-gray-300 border-gray-600/30'}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{element}</span>
                    <span className="text-sm">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Archetype Distribution */}
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Archetypal Distribution</h2>
            <div className="space-y-2">
              {metrics?.archetypeDistribution.map(({ archetype, count, percentage }) => (
                <div key={archetype} className="p-3 rounded-lg bg-gray-700/20 border border-gray-600/30">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-purple-300">{archetype}</span>
                    <span className="text-sm text-gray-400">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Growth Chart */}
        <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Recent Growth (Last 30 Days)</h2>
          <div className="h-64 flex items-end justify-between gap-1">
            {metrics?.recentGrowth.map(({ date, count }) => {
              const maxCount = Math.max(...(metrics?.recentGrowth.map(g => g.count) || [1]));
              const heightPercent = (count / maxCount) * 100;
              return (
                <div key={date} className="flex-1 flex flex-col items-center group relative">
                  <div
                    className="w-full bg-purple-500 hover:bg-purple-400 transition-all rounded-t"
                    style={{ height: `${heightPercent}%`, minHeight: count > 0 ? '4px' : '0' }}
                  ></div>
                  <div className="absolute -bottom-6 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    <br />
                    {count} insights
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center text-sm text-gray-500 mt-8">
            Hover over bars for details
          </div>
        </div>

        {/* Temporal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Oldest Insight</h3>
            <p className="text-gray-400">
              {metrics?.oldestInsight !== 'N/A'
                ? new Date(metrics?.oldestInsight || '').toLocaleString()
                : 'N/A'}
            </p>
          </div>

          <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Newest Insight</h3>
            <p className="text-gray-400">
              {metrics?.newestInsight !== 'N/A'
                ? new Date(metrics?.newestInsight || '').toLocaleString()
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>🜃 Unified Akashic Field • SL-2025-02</p>
          <p className="mt-2">
            <button
              onClick={fetchMetrics}
              className="text-purple-400 hover:text-purple-300 transition"
            >
              Refresh Metrics
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
