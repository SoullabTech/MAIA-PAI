'use client';

/**
 * ADMIN SYSTEM DASHBOARD
 *
 * Complete system operations and health monitoring
 * - Real-time system health metrics
 * - User engagement analytics
 * - Intelligence engine performance
 * - Framework usage & effectiveness
 * - Voice & conversation quality
 * - Beta A/B comparison
 */

import { useState, useEffect } from 'react';
import { unifiedMonitoring, type SystemIntelligence } from '@/lib/monitoring/UnifiedMonitoringEngine';

export default function AdminSystemDashboard() {
  const [systemData, setSystemData] = useState<SystemIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadSystemData();

    if (autoRefresh) {
      const interval = setInterval(loadSystemData, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  async function loadSystemData() {
    try {
      const data = await unifiedMonitoring.getSystemIntelligence();
      setSystemData(data);
    } catch (error) {
      console.error('Error loading system data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-600">Loading system intelligence...</div>
      </div>
    );
  }

  if (!systemData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-600">No system data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Operations Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Real-time monitoring • Last updated: {systemData.timestamp.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={loadSystemData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Now
          </button>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            Auto-refresh (30s)
          </label>
        </div>
      </div>

      {/* System Health Score */}
      <div className="mb-6">
        <HealthScoreCard
          label="Overall System Health"
          score={systemData.systemHealthScore}
          subtitle="Composite score: API health + transformation outcomes + engagement + intelligence"
        />
      </div>

      {/* System Alerts */}
      {systemData.systemAlerts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🚨 System Alerts</h2>
          <div className="space-y-2">
            {systemData.systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.level === 'critical' ? 'bg-red-50 border-red-300' :
                  alert.level === 'warning' ? 'bg-yellow-50 border-yellow-300' :
                  'bg-blue-50 border-blue-300'
                }`}
              >
                <div className="font-semibold">{alert.title}</div>
                <div className="text-sm mt-1">{alert.message}</div>
                <div className="text-sm mt-2">
                  <span className="font-medium">Action:</span> {alert.actionRequired}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-Time Metrics */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">⚡️ Real-Time Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Users"
            value={systemData.totalUsers}
            icon="👥"
          />
          <MetricCard
            label="Active Today"
            value={systemData.activeToday}
            subtitle={`${Math.round((systemData.activeToday / systemData.totalUsers) * 100)}% of total`}
            icon="📊"
          />
          <MetricCard
            label="Avg Sessions/User"
            value={systemData.avgSessionsPerUser.toFixed(1)}
            icon="🔄"
          />
          <MetricCard
            label="API Health"
            value={`${Math.round(systemData.apiHealthScore * 100)}%`}
            icon="⚙️"
            color={systemData.apiHealthScore >= 0.9 ? 'green' : systemData.apiHealthScore >= 0.7 ? 'yellow' : 'red'}
          />
        </div>
      </div>

      {/* User Engagement */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">👥 User Engagement</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">Daily Active Users</div>
              <div className="text-3xl font-bold text-blue-600">{systemData.activeToday}</div>
              <div className="text-sm text-gray-500 mt-1">
                {Math.round((systemData.activeToday / systemData.totalUsers) * 100)}% of total
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Weekly Active Users</div>
              <div className="text-3xl font-bold text-blue-600">{systemData.activeThisWeek}</div>
              <div className="text-sm text-gray-500 mt-1">
                {Math.round((systemData.activeThisWeek / systemData.totalUsers) * 100)}% of total
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Monthly Active Users</div>
              <div className="text-3xl font-bold text-blue-600">{systemData.activeThisMonth}</div>
              <div className="text-sm text-gray-500 mt-1">
                {Math.round((systemData.activeThisMonth / systemData.totalUsers) * 100)}% of total
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Intelligence Engine Performance */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🧠 Intelligence Engine Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard
            label="Analyses Today"
            value={systemData.intelligenceMetrics.analysesToday}
            icon="📊"
          />
          <MetricCard
            label="This Week"
            value={systemData.intelligenceMetrics.analysesThisWeek}
            icon="📈"
          />
          <MetricCard
            label="Advanced Signatures"
            value={systemData.intelligenceMetrics.advancedSignaturesDetected}
            subtitle="5-9 frameworks"
            icon="🎯"
          />
          <MetricCard
            label="Early Warnings"
            value={systemData.intelligenceMetrics.earlyWarningsGenerated}
            icon="⚠️"
          />
          <MetricCard
            label="Avg Processing"
            value={`${systemData.intelligenceMetrics.avgProcessingTimeMs}ms`}
            subtitle="Target: <30ms"
            icon="⚡️"
            color={systemData.intelligenceMetrics.avgProcessingTimeMs < 30 ? 'green' : systemData.intelligenceMetrics.avgProcessingTimeMs < 50 ? 'yellow' : 'red'}
          />
        </div>
        <div className="mt-4 bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Prediction Accuracy</div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all"
                style={{ width: `${systemData.intelligenceMetrics.predictionAccuracy * 100}%` }}
              />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(systemData.intelligenceMetrics.predictionAccuracy * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Framework Usage & Effectiveness */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🎭 Framework Usage & Effectiveness</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Framework
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activation Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Effectiveness
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage Count
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {systemData.frameworkMetrics.map((framework, i) => (
                <tr key={framework.framework} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {framework.framework}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${framework.activationRate * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{Math.round(framework.activationRate * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600"
                          style={{ width: `${framework.avgEffectiveness * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{Math.round(framework.avgEffectiveness * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {framework.usageCount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transformation Outcomes */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">✨ Transformation Outcomes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Avg Coherence Improvement"
            value={`${systemData.transformationMetrics.avgCoherenceImprovement > 0 ? '+' : ''}${systemData.transformationMetrics.avgCoherenceImprovement.toFixed(1)}%`}
            icon="📈"
            color={systemData.transformationMetrics.avgCoherenceImprovement > 10 ? 'green' : systemData.transformationMetrics.avgCoherenceImprovement > 0 ? 'yellow' : 'red'}
          />
          <MetricCard
            label="Breakthrough Rate"
            value={systemData.transformationMetrics.breakthroughRate.toFixed(2)}
            subtitle="per session"
            icon="💫"
          />
          <MetricCard
            label="Escalation Prevention"
            value={`${Math.round(systemData.transformationMetrics.escalationPreventionRate * 100)}%`}
            icon="🛡️"
            color={systemData.transformationMetrics.escalationPreventionRate >= 0.7 ? 'green' : 'yellow'}
          />
          <MetricCard
            label="Avg Journey Length"
            value={`${systemData.transformationMetrics.avgJourneySessions.toFixed(1)} sessions`}
            icon="🧭"
          />
        </div>
      </div>

      {/* Voice & Conversation Quality */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🎤 Voice & Conversation Quality</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Voice Session Rate"
            value={`${Math.round(systemData.conversationMetrics.voiceSessionRate * 100)}%`}
            icon="🎙️"
          />
          <MetricCard
            label="Avg Brevity Score"
            value={`${Math.round(systemData.conversationMetrics.avgBrevityScore * 100)}%`}
            subtitle="Higher = more restrained"
            icon="📏"
          />
          <MetricCard
            label="Authenticity Rating"
            value={`${systemData.conversationMetrics.avgAuthenticityRating.toFixed(1)}/5`}
            icon="✨"
            color={systemData.conversationMetrics.avgAuthenticityRating >= 4 ? 'green' : systemData.conversationMetrics.avgAuthenticityRating >= 3.5 ? 'yellow' : 'red'}
          />
          <MetricCard
            label="Avg Response Time"
            value={`${systemData.conversationMetrics.avgResponseTimeMs.toFixed(0)}ms`}
            icon="⚡️"
            color={systemData.conversationMetrics.avgResponseTimeMs < 2000 ? 'green' : systemData.conversationMetrics.avgResponseTimeMs < 3000 ? 'yellow' : 'red'}
          />
        </div>
      </div>

      {/* Beta A/B Comparison */}
      {systemData.betaComparison && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔬 Beta A/B Comparison</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sesame Hybrid */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-4">Sesame Hybrid (Baseline)</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Sessions</div>
                  <div className="text-2xl font-bold">{systemData.betaComparison.sesameHybrid.sessionCount}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Authenticity</div>
                  <div className="text-xl font-semibold">
                    {Math.round(systemData.betaComparison.sesameHybrid.avgAuthenticity * 100)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Breakthrough Rate</div>
                  <div className="text-xl font-semibold">
                    {systemData.betaComparison.sesameHybrid.breakthroughRate.toFixed(2)}/session
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">User Satisfaction</div>
                  <div className="text-xl font-semibold">
                    {systemData.betaComparison.sesameHybrid.userSatisfaction.toFixed(1)}/5
                  </div>
                </div>
              </div>
            </div>

            {/* Field System */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-blue-500">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                Field System (Experimental)
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">NEW</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Sessions</div>
                  <div className="text-2xl font-bold">{systemData.betaComparison.fieldSystem.sessionCount}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Authenticity</div>
                  <div className="text-xl font-semibold">
                    {Math.round(systemData.betaComparison.fieldSystem.avgAuthenticity * 100)}%
                    {systemData.betaComparison.fieldSystem.avgAuthenticity > systemData.betaComparison.sesameHybrid.avgAuthenticity && (
                      <span className="ml-2 text-sm text-green-600">↑</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Breakthrough Rate</div>
                  <div className="text-xl font-semibold">
                    {systemData.betaComparison.fieldSystem.breakthroughRate.toFixed(2)}/session
                    {systemData.betaComparison.fieldSystem.breakthroughRate > systemData.betaComparison.sesameHybrid.breakthroughRate && (
                      <span className="ml-2 text-sm text-green-600">↑</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Silence Rate</div>
                  <div className="text-xl font-semibold">
                    {Math.round(systemData.betaComparison.fieldSystem.silenceRate * 100)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">User Satisfaction</div>
                  <div className="text-xl font-semibold">
                    {systemData.betaComparison.fieldSystem.userSatisfaction.toFixed(1)}/5
                    {systemData.betaComparison.fieldSystem.userSatisfaction > systemData.betaComparison.sesameHybrid.userSatisfaction && (
                      <span className="ml-2 text-sm text-green-600">↑</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Preference */}
          <div className="mt-4 bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">User Preference</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Prefer Sesame</div>
                <div className="text-2xl font-bold text-blue-600">
                  {systemData.betaComparison.userPreference.preferSesame}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Prefer Field</div>
                <div className="text-2xl font-bold text-green-600">
                  {systemData.betaComparison.userPreference.preferField}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">No Preference</div>
                <div className="text-2xl font-bold text-gray-600">
                  {systemData.betaComparison.userPreference.noPreference}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function HealthScoreCard({ label, score, subtitle }: { label: string; score: number; subtitle?: string }) {
  const percentage = Math.round(score * 100);
  const color = score >= 0.9 ? 'green' : score >= 0.7 ? 'yellow' : score >= 0.5 ? 'orange' : 'red';
  const colorClasses = {
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-sm text-gray-600 mb-2">{label}</div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${colorClasses[color]}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <div className="text-4xl font-bold text-gray-900">{percentage}%</div>
      </div>
      {subtitle && <div className="text-xs text-gray-500 mt-2">{subtitle}</div>}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: string;
  subtitle?: string;
  color?: 'green' | 'yellow' | 'red' | 'blue';
}

function MetricCard({ label, value, icon, subtitle, color }: MetricCardProps) {
  const colorClasses = {
    green: 'border-green-500 bg-green-50',
    yellow: 'border-yellow-500 bg-yellow-50',
    red: 'border-red-500 bg-red-50',
    blue: 'border-blue-500 bg-blue-50'
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${color ? `border-l-4 ${colorClasses[color]}` : ''}`}>
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
}
