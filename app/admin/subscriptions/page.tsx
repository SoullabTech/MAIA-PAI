'use client';

/**
 * Admin Subscription Dashboard
 *
 * Real-time subscription analytics and metrics
 */

import { useEffect, useState } from 'react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeSubscribers: number;
    trialingUsers: number;
    freeUsers: number;
    mrr: number;
    arr: number;
  };
  byTier: {
    free: number;
    explorer: number;
    practitioner: number;
    studio: number;
  };
  trials: {
    activeTrials: number;
    expiredTrials: number;
    conversionRate: number;
  };
  revenue: {
    explorer: number;
    practitioner: number;
    studio: number;
    total: number;
  };
  recentActivity: Array<{
    userId: string;
    userName: string;
    event: string;
    tier?: string;
    timestamp: string;
  }>;
  topUsers: Array<{
    userId: string;
    userName: string;
    tier: string;
    conversationsThisMonth: number;
    subscriptionStatus: string;
  }>;
}

export default function AdminSubscriptionsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const fetchAnalytics = async (key: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });

      if (response.status === 401) {
        setError('Invalid admin key');
        setAuthenticated(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const result = await response.json();
      setAnalytics(result.data);
      setAuthenticated(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalytics(adminKey);
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // ============================================================================
  // LOGIN SCREEN
  // ============================================================================

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-white mb-6">Admin Login</h1>

          {error && (
            <div className="bg-red-900/20 border border-red-900 text-red-400 rounded p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2 text-sm">
                Admin API Key
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter admin key"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors"
            >
              Login
            </button>
          </form>

          <p className="text-gray-500 text-xs mt-4">
            Set ADMIN_API_KEY in your environment variables
          </p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // DASHBOARD
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-red-400">Failed to load analytics</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">MAIA Subscription Analytics</h1>
          <p className="text-gray-400">Real-time subscription metrics and insights</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Total Users"
            value={analytics.overview.totalUsers}
            icon="👥"
          />
          <MetricCard
            label="Active Subscribers"
            value={analytics.overview.activeSubscribers}
            icon="✅"
            color="green"
          />
          <MetricCard
            label="Monthly Recurring Revenue"
            value={formatCurrency(analytics.overview.mrr)}
            icon="💰"
            color="blue"
          />
          <MetricCard
            label="Annual Recurring Revenue"
            value={formatCurrency(analytics.overview.arr)}
            icon="📈"
            color="purple"
          />
        </div>

        {/* Subscription Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* By Tier */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Users by Tier</h2>
            <div className="space-y-3">
              <TierBar label="Free" count={analytics.byTier.free} color="gray" />
              <TierBar label="Explorer" count={analytics.byTier.explorer} color="blue" />
              <TierBar label="Practitioner" count={analytics.byTier.practitioner} color="purple" />
              <TierBar label="Studio" count={analytics.byTier.studio} color="gold" />
            </div>
          </div>

          {/* Trial Metrics */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Trial Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Active Trials</span>
                  <span className="font-bold text-green-400">{analytics.trials.activeTrials}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Expired Trials</span>
                  <span className="font-bold text-orange-400">{analytics.trials.expiredTrials}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Conversion Rate</span>
                  <span className="font-bold text-blue-400">
                    {analytics.trials.conversionRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${analytics.trials.conversionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Revenue by Tier</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RevenueCard
              tier="Explorer"
              revenue={formatCurrency(analytics.revenue.explorer)}
              subscribers={analytics.byTier.explorer}
            />
            <RevenueCard
              tier="Practitioner"
              revenue={formatCurrency(analytics.revenue.practitioner)}
              subscribers={analytics.byTier.practitioner}
            />
            <RevenueCard
              tier="Studio"
              revenue={formatCurrency(analytics.revenue.studio)}
              subscribers={analytics.byTier.studio}
            />
          </div>
        </div>

        {/* Top Users & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Users */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Top Users (by conversations)</h2>
            <div className="space-y-2">
              {analytics.topUsers.map((user, idx) => (
                <div key={user.userId} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-mono text-sm">{idx + 1}.</span>
                    <div>
                      <div className="font-medium">{user.userName}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.tier}</div>
                    </div>
                  </div>
                  <div className="text-blue-400 font-bold">
                    {user.conversationsThisMonth}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {analytics.recentActivity.map((activity, idx) => (
                <div key={idx} className="p-2 bg-gray-800 rounded text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{activity.userName}</span>
                    <span className="text-gray-500 text-xs">{formatDate(activity.timestamp)}</span>
                  </div>
                  <div className="text-gray-400 text-xs">{activity.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => fetchAnalytics(adminKey)}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

function MetricCard({ label, value, icon, color = 'gray' }: {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}) {
  const colorClasses = {
    gray: 'bg-gray-900 border-gray-800',
    green: 'bg-green-900/20 border-green-900',
    blue: 'bg-blue-900/20 border-blue-900',
    purple: 'bg-purple-900/20 border-purple-900'
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} border rounded-lg p-6`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}

function TierBar({ label, count, color }: { label: string; count: number; color: string }) {
  const colorClasses = {
    gray: 'bg-gray-600',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    gold: 'bg-yellow-500'
  };

  return (
    <div>
      <div className="flex justify-between mb-1 text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="font-bold">{count}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className={`${colorClasses[color as keyof typeof colorClasses]} h-2 rounded-full transition-all`}
          style={{ width: `${Math.min(100, (count / 50) * 100)}%` }}
        />
      </div>
    </div>
  );
}

function RevenueCard({ tier, revenue, subscribers }: {
  tier: string;
  revenue: string;
  subscribers: number;
}) {
  return (
    <div className="bg-gray-800 rounded p-4">
      <div className="text-gray-400 text-sm mb-1">{tier}</div>
      <div className="text-2xl font-bold mb-2">{revenue}</div>
      <div className="text-gray-500 text-xs">{subscribers} subscribers</div>
    </div>
  );
}
