'use client';

/**
 * PRACTITIONER DASHBOARD
 *
 * Complete client overview with multi-dimensional intelligence
 * - See all clients with status indicators
 * - View alerts (critical/warning/info)
 * - Monitor coherence trends and trajectories
 * - Access detailed client intelligence
 */

import { useState, useEffect } from 'react';
import { unifiedMonitoring, type ClientIntelligenceSummary, type UnifiedAlert } from '@/lib/monitoring/UnifiedMonitoringEngine';

type FilterOption = 'all' | 'critical' | 'needs-attention' | 'active';

export default function PractitionerDashboard() {
  const [clients, setClients] = useState<ClientIntelligenceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, [filter]);

  async function loadClients() {
    setLoading(true);
    try {
      const clientData = await unifiedMonitoring.getAllClientsIntelligence(filter);
      setClients(clientData);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  }

  const criticalCount = clients.filter(c => c.overallStatus === 'critical').length;
  const needsAttentionCount = clients.filter(c => c.overallStatus === 'needs-attention').length;
  const progressingCount = clients.filter(c => c.overallStatus === 'progressing').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Practitioner Dashboard</h1>
        <p className="text-gray-600 mt-2">Complete client intelligence with multi-dimensional analytics</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-400">
          <div className="text-sm text-gray-600">Total Clients</div>
          <div className="text-2xl font-bold text-gray-900">{clients.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="text-sm text-gray-600">Critical</div>
          <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600">Needs Attention</div>
          <div className="text-2xl font-bold text-yellow-600">{needsAttentionCount}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-600">Progressing</div>
          <div className="text-2xl font-bold text-green-600">{progressingCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Clients
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'critical'
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Critical ({criticalCount})
        </button>
        <button
          onClick={() => setFilter('needs-attention')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'needs-attention'
              ? 'bg-yellow-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Needs Attention ({needsAttentionCount})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'active'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Active (Last 7 Days)
        </button>
      </div>

      {/* Client List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-600">Loading client intelligence...</div>
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-600">No clients found</div>
        </div>
      ) : (
        <div className="space-y-4">
          {clients.map((client) => (
            <ClientCard
              key={client.userId}
              client={client}
              isExpanded={selectedClient === client.userId}
              onToggle={() => setSelectedClient(selectedClient === client.userId ? null : client.userId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CLIENT CARD COMPONENT
// ============================================================================

interface ClientCardProps {
  client: ClientIntelligenceSummary;
  isExpanded: boolean;
  onToggle: () => void;
}

function ClientCard({ client, isExpanded, onToggle }: ClientCardProps) {
  const statusColors = {
    critical: 'border-red-500 bg-red-50',
    'needs-attention': 'border-yellow-500 bg-yellow-50',
    progressing: 'border-green-500 bg-green-50',
    thriving: 'border-blue-500 bg-blue-50'
  };

  const statusIcons = {
    critical: '🔴',
    'needs-attention': '⚠️',
    progressing: '🟢',
    thriving: '✨'
  };

  const trendIcons = {
    ascending: '↗️',
    descending: '↘️',
    stable: '→',
    oscillating: '↕️'
  };

  return (
    <div className={`bg-white rounded-lg shadow border-l-4 ${statusColors[client.overallStatus]} transition-all`}>
      {/* Card Header - Always Visible */}
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{statusIcons[client.overallStatus]}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {client.userName || `Client ${client.userId.slice(0, 8)}`}
                </h3>
                <div className="text-sm text-gray-600 mt-1">
                  {client.totalSessions} sessions • Last seen {client.daysSinceLastSession === 0 ? 'today' : `${client.daysSinceLastSession} days ago`}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <div className="text-xs text-gray-500">Coherence</div>
                <div className="text-lg font-semibold">
                  {Math.round(client.currentCoherence * 100)}%
                  <span className="ml-2 text-sm">{trendIcons[client.coherenceTrend]}</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Element</div>
                <div className="text-sm font-medium">{client.dominantElement}</div>
                <div className="text-xs text-gray-500 capitalize">({client.elementalBalance})</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Trajectory</div>
                <div className="text-sm font-medium capitalize">{client.trajectoryRisk}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Alerts</div>
                <div className="text-sm">
                  {client.criticalAlertCount > 0 && (
                    <span className="text-red-600 font-semibold">{client.criticalAlertCount} Critical</span>
                  )}
                  {client.criticalAlertCount > 0 && client.warningAlertCount > 0 && ', '}
                  {client.warningAlertCount > 0 && (
                    <span className="text-yellow-600 font-semibold">{client.warningAlertCount} Warning</span>
                  )}
                  {client.criticalAlertCount === 0 && client.warningAlertCount === 0 && (
                    <span className="text-gray-400">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button className="ml-4 text-gray-400 hover:text-gray-600">
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          {/* Alerts Section */}
          {client.alerts.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🚨 Active Alerts</h4>
              <div className="space-y-2">
                {client.alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          )}

          {/* Primary Signature */}
          {client.primarySignature && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🎯 Current Signature</h4>
              <div className="bg-gray-50 rounded p-3">
                <div className="font-medium">{client.primarySignature.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {client.primarySignature.frameworkCount} frameworks align •
                  {Math.round(client.primarySignature.confidence * 100)}% confidence •
                  <span className={`ml-1 capitalize ${
                    client.primarySignature.urgency === 'critical' ? 'text-red-600 font-semibold' :
                    client.primarySignature.urgency === 'high' ? 'text-orange-600 font-semibold' :
                    'text-gray-600'
                  }`}>
                    {client.primarySignature.urgency} urgency
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Journey Progression */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">🧭 Journey Progression</h4>
            <div className="bg-gray-50 rounded p-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Spiral Direction</div>
                  <div className="font-medium capitalize">{client.spiralDirection}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Coherence Change</div>
                  <div className={`font-medium ${client.coherenceChange > 0 ? 'text-green-600' : client.coherenceChange < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {client.coherenceChange > 0 ? '+' : ''}{Math.round(client.coherenceChange * 100)}%
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500">State Progression</div>
                  <div className="font-mono text-sm">{client.stateProgression}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Prediction */}
          {client.predictedOutcome && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🔮 Predictive Intelligence</h4>
              <div className="bg-gray-50 rounded p-3">
                <div className="font-medium">{client.predictedOutcome}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {Math.round((client.outcomeProbability || 0) * 100)}% probability
                  {client.interventionWindow && ` • ${client.interventionWindow} intervention window`}
                </div>
              </div>
            </div>
          )}

          {/* Personalized Framework Effectiveness */}
          {client.topFrameworks.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">💊 Top Frameworks (Personalized)</h4>
              <div className="bg-gray-50 rounded p-3">
                <div className="space-y-2">
                  {client.topFrameworks.map((fw, i) => (
                    <div key={fw.framework} className="flex items-center justify-between">
                      <span className="text-sm">
                        {i + 1}. {fw.framework}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${fw.effectiveness * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{Math.round(fw.effectiveness * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Optimal Entry: <span className="font-medium capitalize">{client.optimalEntryPoint.replace('-', ' ')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Elemental Balance */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">🔥💧🌬️🌍✨ Elemental Balance</h4>
            <div className="bg-gray-50 rounded p-3">
              <div className="text-sm">
                <span className="font-medium capitalize">{client.dominantElement}</span> -
                <span className="capitalize ml-1">{client.elementalBalance}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Balancing element: <span className="font-medium capitalize">{client.balancingElement}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ALERT CARD COMPONENT
// ============================================================================

interface AlertCardProps {
  alert: UnifiedAlert;
}

function AlertCard({ alert }: AlertCardProps) {
  const levelColors = {
    critical: 'bg-red-100 border-red-300 text-red-900',
    warning: 'bg-yellow-100 border-yellow-300 text-yellow-900',
    info: 'bg-blue-100 border-blue-300 text-blue-900'
  };

  const levelIcons = {
    critical: '🔴',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`border rounded p-3 ${levelColors[alert.level]}`}>
      <div className="flex items-start gap-2">
        <span className="text-lg">{levelIcons[alert.level]}</span>
        <div className="flex-1">
          <div className="font-semibold">{alert.title}</div>
          <div className="text-sm mt-1">{alert.message}</div>
          <div className="text-sm mt-2">
            <span className="font-medium">Action: </span>
            {alert.actionRequired}
          </div>
          {alert.timeframe && (
            <div className="text-xs mt-1 opacity-75 capitalize">
              Timeframe: {alert.timeframe}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
