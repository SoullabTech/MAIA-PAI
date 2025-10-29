'use client';

/**
 * ADMIN INTELLIGENCE MONITORING PAGE
 *
 * For administrators/practitioners to monitor intelligence across users
 *
 * Route: /admin/intelligence
 */

import { useEffect, useState } from 'react';
import { unifiedIntelligence } from '@/lib/intelligence/UnifiedIntelligenceEngine';

interface UserIntelligenceSummary {
  userId: string;
  userName?: string;
  coherence: number;
  transformationStage: string;
  signatureCount: number;
  lastAnalyzed: Date;
  urgencyLevel: 'critical' | 'high' | 'moderate' | 'low';
}

export default function AdminIntelligencePage() {
  const [users, setUsers] = useState<UserIntelligenceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedIntelligence, setSelectedIntelligence] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high'>('all');

  useEffect(() => {
    loadUserSummaries();
  }, []);

  async function loadUserSummaries() {
    try {
      // In production, this would be an admin API endpoint
      // For now, mock data
      const mockUsers: UserIntelligenceSummary[] = [
        {
          userId: 'user1',
          userName: 'User A',
          coherence: 0.18,
          transformationStage: 'Nigredo',
          signatureCount: 2,
          lastAnalyzed: new Date(),
          urgencyLevel: 'critical'
        },
        {
          userId: 'user2',
          userName: 'User B',
          coherence: 0.65,
          transformationStage: 'Albedo',
          signatureCount: 1,
          lastAnalyzed: new Date(),
          urgencyLevel: 'moderate'
        },
        {
          userId: 'user3',
          userName: 'User C',
          coherence: 0.82,
          transformationStage: 'Citrinitas',
          signatureCount: 1,
          lastAnalyzed: new Date(),
          urgencyLevel: 'low'
        }
      ];

      setUsers(mockUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error loading summaries:', error);
      setLoading(false);
    }
  }

  async function loadFullIntelligence(userId: string) {
    try {
      const intelligence = await unifiedIntelligence.analyze(userId);
      setSelectedIntelligence(intelligence);
    } catch (error) {
      console.error('Error loading intelligence:', error);
    }
  }

  function handleUserSelect(userId: string) {
    setSelectedUser(userId);
    loadFullIntelligence(userId);
  }

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'critical') return user.urgencyLevel === 'critical';
    if (filter === 'high') return user.urgencyLevel === 'critical' || user.urgencyLevel === 'high';
    return true;
  });

  const criticalCount = users.filter(u => u.urgencyLevel === 'critical').length;
  const highCount = users.filter(u => u.urgencyLevel === 'high').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-600">Loading intelligence monitoring...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Intelligence Monitoring</h1>
        <p className="text-gray-600 mt-2">
          Real-time transformation intelligence across all users
        </p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="text-sm text-red-600 font-medium">Critical</div>
          <div className="text-3xl font-bold text-red-700">{criticalCount}</div>
          <div className="text-xs text-red-600">Coherence < 30%</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
          <div className="text-sm text-orange-600 font-medium">High Urgency</div>
          <div className="text-3xl font-bold text-orange-700">{highCount}</div>
          <div className="text-xs text-orange-600">Immediate attention</div>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Optimal State</div>
          <div className="text-3xl font-bold text-green-700">
            {users.filter(u => u.coherence > 0.75).length}
          </div>
          <div className="text-xs text-green-600">Coherence > 75%</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          All Users ({users.length})
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'critical'
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Critical Only ({criticalCount})
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'high'
              ? 'bg-orange-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          High Urgency ({criticalCount + highCount})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Users</h2>
          <div className="space-y-3">
            {filteredUsers.map(user => {
              const coherenceColor =
                user.coherence < 0.30 ? 'text-red-600' :
                user.coherence < 0.50 ? 'text-orange-600' :
                user.coherence < 0.75 ? 'text-yellow-600' :
                'text-green-600';

              const urgencyBorder =
                user.urgencyLevel === 'critical' ? 'border-l-4 border-red-500' :
                user.urgencyLevel === 'high' ? 'border-l-4 border-orange-500' :
                'border-l-4 border-gray-300';

              return (
                <div
                  key={user.userId}
                  onClick={() => handleUserSelect(user.userId)}
                  className={`${urgencyBorder} p-4 hover:bg-gray-50 cursor-pointer rounded transition-colors ${
                    selectedUser === user.userId ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">{user.userName || user.userId}</div>
                    <div className={`text-lg font-bold ${coherenceColor}`}>
                      {(user.coherence * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{user.transformationStage}</span>
                    <span className="text-gray-500">
                      {user.signatureCount} signature{user.signatureCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {user.urgencyLevel === 'critical' && (
                    <div className="mt-2 text-xs text-red-600 font-medium">
                      ⚠️ CRITICAL - Immediate attention needed
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected User Detail */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {!selectedUser ? (
            <div className="text-center text-gray-500 py-12">
              Select a user to view detailed intelligence
            </div>
          ) : !selectedIntelligence ? (
            <div className="text-center text-gray-500 py-12">
              Loading intelligence...
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Detailed Intelligence
              </h2>

              {/* Coherence */}
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-1">Coherence</div>
                <div className="text-3xl font-bold text-gray-900">
                  {(selectedIntelligence.coherence * 100).toFixed(1)}%
                </div>
                <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${selectedIntelligence.coherence * 100}%` }}
                  />
                </div>
              </div>

              {/* Active Signatures */}
              {selectedIntelligence.activeSignatures?.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">Active Signatures</div>
                  <div className="space-y-3">
                    {selectedIntelligence.activeSignatures.map((sig: any, i: number) => (
                      <div key={i} className="border-l-4 border-purple-500 pl-3 py-2">
                        <div className="font-medium text-gray-900">{sig.signature}</div>
                        <div className="text-sm text-gray-600">{(sig.confidence * 100).toFixed(0)}% confidence</div>
                        <div className="text-sm text-gray-700 mt-1">{sig.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Framework Effectiveness */}
              {selectedIntelligence.frameworkEffectiveness && (
                <div>
                  <div className="text-sm text-gray-600 mb-2">Top Frameworks</div>
                  <div className="space-y-2">
                    {Object.entries(selectedIntelligence.frameworkEffectiveness)
                      .sort(([,a]: any, [,b]: any) => b - a)
                      .slice(0, 5)
                      .map(([framework, score]: any) => (
                        <div key={framework} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{framework}</span>
                          <span className="text-sm font-semibold text-blue-600">
                            {(score * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
