'use client';

import { useEffect, useState } from 'react';

interface DashboardData {
  overview: {
    totalActiveInsights: number;
    totalInsights: number;
    totalUsers: number;
    recurrences24h: number;
    recurrences7d: number;
    avgConvergence: number;
    breakthroughReady: number;
  };
  recentInsights: any[];
  breakthroughInsights: any[];
  distributions: {
    elements: Record<string, number>;
    spiralDirections: Record<string, number>;
  };
  recentActivity: any[];
  timestamp: string;
}

export default function InsightsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/insights/dashboard');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const elementColors: Record<string, string> = {
    fire: 'text-orange-500',
    water: 'text-blue-500',
    earth: 'text-green-600',
    air: 'text-cyan-400',
    aether: 'text-purple-500'
  };

  const spiralIcons: Record<string, string> = {
    descending: '↓',
    ascending: '↑',
    lateral: '→',
    stalled: '◦'
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌀</div>
          <p className="text-gray-400">Loading insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light mb-2">
            <span className="text-gray-400">🌀</span> Unified Insights Observatory
          </h1>
          <p className="text-gray-500">
            Real-time pattern emergence across temporal consciousness
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            Auto-refresh (30s)
          </label>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="text-3xl font-light mb-1">{data.overview.totalActiveInsights}</div>
          <div className="text-sm text-gray-500">Active Patterns</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="text-3xl font-light mb-1">{data.overview.totalUsers}</div>
          <div className="text-sm text-gray-500">Users Tracked</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="text-3xl font-light mb-1">{data.overview.recurrences24h}</div>
          <div className="text-sm text-gray-500">Recurrences (24h)</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="text-3xl font-light mb-1 text-purple-400">{data.overview.breakthroughReady}</div>
          <div className="text-sm text-gray-500">Breakthrough Ready (≥70%)</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-8">
        {/* Elemental Distribution */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-light mb-4 text-gray-400">Elemental Distribution</h3>
          <div className="space-y-2">
            {Object.entries(data.distributions.elements).map(([element, count]) => (
              <div key={element} className="flex items-center justify-between">
                <span className={`capitalize ${elementColors[element]}`}>{element}</span>
                <span className="text-gray-500">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spiral Directions */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-light mb-4 text-gray-400">Spiral Movements</h3>
          <div className="space-y-2">
            {Object.entries(data.distributions.spiralDirections).map(([direction, count]) => (
              <div key={direction} className="flex items-center justify-between">
                <span className="capitalize text-gray-300">
                  {spiralIcons[direction]} {direction}
                </span>
                <span className="text-gray-500">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Convergence */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-light mb-4 text-gray-400">Convergence Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="text-2xl font-light text-purple-400">{data.overview.avgConvergence}%</div>
              <div className="text-sm text-gray-500">Average Score</div>
            </div>
            <div>
              <div className="text-2xl font-light text-green-400">{data.overview.breakthroughReady}</div>
              <div className="text-sm text-gray-500">Ready for Integration</div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakthrough Ready Insights */}
      {data.breakthroughInsights.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-light mb-4 text-purple-400">⚡️ Breakthrough Threshold</h2>
          <div className="space-y-4">
            {data.breakthroughInsights.slice(0, 5).map((insight) => (
              <div key={insight.id} className="bg-purple-950/20 rounded-lg p-4 border border-purple-900/30">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-purple-200">{insight.core_pattern}</div>
                    <div className="text-sm text-gray-400 mt-1">{insight.essence}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-light text-purple-400">{Math.round(insight.convergence_score)}%</div>
                    <div className="text-xs text-gray-500">convergence</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className={elementColors[insight.current_element]}>
                    {insight.current_element}
                  </span>
                  <span>Depth {insight.current_depth}</span>
                  {insight.archetype && <span>🎭 {insight.archetype}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Insights */}
      <div>
        <h2 className="text-2xl font-light mb-4 text-gray-400">Recent Pattern Activity</h2>
        <div className="space-y-3">
          {data.recentInsights.slice(0, 10).map((insight) => {
            const spiral = insight.spiral_movements?.[0];
            const archetype = insight.archetypal_threads?.[0];

            return (
              <div key={insight.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-200">{insight.core_pattern}</div>
                    <div className="text-sm text-gray-500 mt-1">{insight.essence}</div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                      <span className={elementColors[insight.current_element]}>
                        {insight.current_element}
                      </span>
                      <span>First: {new Date(insight.first_date).toLocaleDateString()}</span>
                      <span>Last: {new Date(insight.last_seen).toLocaleDateString()}</span>
                      {archetype && <span>🎭 {archetype.archetype}</span>}
                    </div>
                  </div>
                  {spiral && (
                    <div className="text-right ml-4">
                      <div className="text-lg font-light text-gray-400">
                        {spiralIcons[spiral.direction]} {Math.round(spiral.convergence_score)}%
                      </div>
                      <div className="text-xs text-gray-600">Depth {spiral.current_depth}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-600">
        Last updated: {new Date(data.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
