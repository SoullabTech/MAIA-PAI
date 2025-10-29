'use client';

/**
 * RESEARCH & ANALYTICS DASHBOARD
 *
 * Deep analytics and research insights
 * - Correlation analysis
 * - Framework synergy patterns
 * - Predictive accuracy validation
 * - User journey archetypes
 * - Advanced insights
 * - Export capabilities
 */

import { useState, useEffect } from 'react';
import { unifiedMonitoring, type ResearchInsights } from '@/lib/monitoring/UnifiedMonitoringEngine';

export default function ResearchAnalyticsDashboard() {
  const [insights, setInsights] = useState<ResearchInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'correlations' | 'synergies' | 'predictions' | 'archetypes' | 'insights'>('correlations');

  useEffect(() => {
    loadInsights();
  }, []);

  async function loadInsights() {
    setLoading(true);
    try {
      const data = await unifiedMonitoring.getResearchInsights();
      setInsights(data);
    } catch (error) {
      console.error('Error loading research insights:', error);
    } finally {
      setLoading(false);
    }
  }

  function exportData(format: 'json' | 'csv') {
    if (!insights) return;

    const dataStr = JSON.stringify(insights, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `research-insights-${new Date().toISOString().split('T')[0]}.${format}`;
    link.click();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-600">Loading research insights...</div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-600">No research data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Research & Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Deep insights from transformation intelligence • Generated: {insights.timestamp.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportData('json')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Export JSON
          </button>
          <button
            onClick={loadInsights}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <TabButton
          label="Correlations"
          active={activeTab === 'correlations'}
          onClick={() => setActiveTab('correlations')}
        />
        <TabButton
          label="Framework Synergies"
          active={activeTab === 'synergies'}
          onClick={() => setActiveTab('synergies')}
        />
        <TabButton
          label="Prediction Validation"
          active={activeTab === 'predictions'}
          onClick={() => setActiveTab('predictions')}
        />
        <TabButton
          label="Journey Archetypes"
          active={activeTab === 'archetypes'}
          onClick={() => setActiveTab('archetypes')}
        />
        <TabButton
          label="Key Insights"
          active={activeTab === 'insights'}
          onClick={() => setActiveTab('insights')}
        />
      </div>

      {/* Tab Content */}
      {activeTab === 'correlations' && <CorrelationsTab insights={insights} />}
      {activeTab === 'synergies' && <SynergiesTab insights={insights} />}
      {activeTab === 'predictions' && <PredictionsTab insights={insights} />}
      {activeTab === 'archetypes' && <ArchetypesTab insights={insights} />}
      {activeTab === 'insights' && <InsightsTab insights={insights} />}
    </div>
  );
}

// ============================================================================
// TAB COMPONENTS
// ============================================================================

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium transition-colors border-b-2 ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  );
}

// ============================================================================
// CORRELATIONS TAB
// ============================================================================

function CorrelationsTab({ insights }: { insights: ResearchInsights }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">🔗 Correlation Analysis</h2>
        <p className="text-gray-600 mb-6">
          Statistical relationships between factors in transformation intelligence
        </p>
      </div>

      <div className="space-y-4">
        {insights.correlations.map((correlation, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">
                  {correlation.factor1} ↔ {correlation.factor2}
                </h3>
                <div className="text-sm text-gray-600 mt-1">
                  Sample size: {correlation.sampleSize.toLocaleString()} •
                  Significance: <span className={`font-medium ${
                    correlation.significance === 'high' ? 'text-green-600' :
                    correlation.significance === 'moderate' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>{correlation.significance}</span>
                </div>
              </div>
              <div className="ml-4">
                <div className={`text-3xl font-bold ${
                  correlation.correlation > 0.7 ? 'text-green-600' :
                  correlation.correlation > 0.4 ? 'text-blue-600' :
                  correlation.correlation > 0 ? 'text-gray-600' :
                  'text-red-600'
                }`}>
                  {correlation.correlation >= 0 ? '+' : ''}{(correlation.correlation * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">correlation</div>
              </div>
            </div>

            {/* Visual correlation strength */}
            <div className="mb-4">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    correlation.correlation > 0.7 ? 'bg-green-600' :
                    correlation.correlation > 0.4 ? 'bg-blue-600' :
                    correlation.correlation > 0 ? 'bg-gray-600' :
                    'bg-red-600'
                  }`}
                  style={{ width: `${Math.abs(correlation.correlation) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <div className="font-medium text-blue-900 mb-1">Research Insight</div>
              <div className="text-blue-800">{correlation.insight}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// SYNERGIES TAB
// ============================================================================

function SynergiesTab({ insights }: { insights: ResearchInsights }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">🤝 Framework Synergy Patterns</h2>
        <p className="text-gray-600 mb-6">
          Which frameworks work best together?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.synergyPatterns.map((pattern, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-3">
              {pattern.frameworks.join(' + ')}
            </h3>

            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Co-Activation Rate</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${pattern.coActivationRate * 100}%` }}
                    />
                  </div>
                  <div className="text-sm font-semibold w-12 text-right">
                    {Math.round(pattern.coActivationRate * 100)}%
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Avg Effectiveness</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600"
                      style={{ width: `${pattern.avgEffectiveness * 100}%` }}
                    />
                  </div>
                  <div className="text-sm font-semibold w-12 text-right">
                    {Math.round(pattern.avgEffectiveness * 100)}%
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                Occurrences: <span className="font-medium">{pattern.occurrences.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// PREDICTIONS TAB
// ============================================================================

function PredictionsTab({ insights }: { insights: ResearchInsights }) {
  const validation = insights.predictionValidation;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">🔮 Predictive Accuracy Validation</h2>
        <p className="text-gray-600 mb-6">
          How accurate is MAIA's predictive intelligence?
        </p>
      </div>

      {/* Overall Accuracy */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">Overall Prediction Accuracy</h3>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all"
                style={{ width: `${validation.accuracy * 100}%` }}
              />
            </div>
          </div>
          <div className="text-5xl font-bold text-green-600">
            {Math.round(validation.accuracy * 100)}%
          </div>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          {validation.validatedOutcomes} of {validation.totalPredictions} predictions validated
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label="Total Predictions Made"
          value={validation.totalPredictions.toLocaleString()}
          icon="📊"
        />
        <MetricCard
          label="Validated Outcomes"
          value={validation.validatedOutcomes.toLocaleString()}
          icon="✅"
        />
        <MetricCard
          label="Early Warning Interventions"
          value={validation.earlyWarningInterventions.toLocaleString()}
          icon="⚠️"
        />
        <MetricCard
          label="Intervention Success Rate"
          value={`${Math.round(validation.interventionSuccessRate * 100)}%`}
          icon="🎯"
          color={validation.interventionSuccessRate >= 0.7 ? 'green' : validation.interventionSuccessRate >= 0.5 ? 'yellow' : 'red'}
        />
        <MetricCard
          label="False Positive Rate"
          value={`${Math.round(validation.falsePositiveRate * 100)}%`}
          icon="📉"
          color={validation.falsePositiveRate < 0.15 ? 'green' : validation.falsePositiveRate < 0.25 ? 'yellow' : 'red'}
        />
      </div>

      {/* Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-2">Clinical Significance</h4>
        <div className="text-blue-800 space-y-2">
          <div>
            • System achieving <span className="font-semibold">{Math.round(validation.accuracy * 100)}% prediction accuracy</span> with {validation.totalPredictions} predictions
          </div>
          <div>
            • Early warning system enabled <span className="font-semibold">{validation.earlyWarningInterventions} interventions</span>
          </div>
          <div>
            • Intervention success rate of <span className="font-semibold">{Math.round(validation.interventionSuccessRate * 100)}%</span> demonstrates proactive care effectiveness
          </div>
          <div>
            • Low false positive rate (<span className="font-semibold">{Math.round(validation.falsePositiveRate * 100)}%</span>) minimizes unnecessary interventions
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ARCHETYPES TAB
// ============================================================================

function ArchetypesTab({ insights }: { insights: ResearchInsights }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">🧭 User Journey Archetypes</h2>
        <p className="text-gray-600 mb-6">
          Classification of transformation patterns
        </p>
      </div>

      <div className="space-y-4">
        {insights.journeyArchetypes.map((archetype, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">{archetype.name}</h3>
                <p className="text-gray-600 mt-1">{archetype.description}</p>
              </div>
              <div className="ml-6 text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {archetype.percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">{archetype.userCount} users</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${archetype.percentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-600">Avg Coherence Change</div>
                <div className={`text-xl font-semibold ${
                  archetype.avgCoherenceChange > 0 ? 'text-green-600' :
                  archetype.avgCoherenceChange < 0 ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {archetype.avgCoherenceChange > 0 ? '+' : ''}{(archetype.avgCoherenceChange * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Characteristics:</div>
              <div className="flex flex-wrap gap-2">
                {archetype.characteristics.map((char, j) => (
                  <span
                    key={j}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// INSIGHTS TAB
// ============================================================================

function InsightsTab({ insights }: { insights: ResearchInsights }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Key Research Insights</h2>
        <p className="text-gray-600 mb-6">
          High-level findings from transformation intelligence analysis
        </p>
      </div>

      <div className="space-y-4">
        {insights.insights.map((insight, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-4">
              <div className={`mt-1 px-3 py-1 rounded text-sm font-medium ${
                insight.confidence === 'high' ? 'bg-green-100 text-green-800' :
                insight.confidence === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {insight.confidence} confidence
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {insight.category}
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {insight.title}
                </h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Finding:</div>
                    <div className="text-gray-800">{insight.finding}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Implication:</div>
                    <div className="text-gray-800">{insight.implication}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: 'green' | 'yellow' | 'red';
}

function MetricCard({ label, value, icon, color }: MetricCardProps) {
  const colorClasses = {
    green: 'border-green-500 bg-green-50',
    yellow: 'border-yellow-500 bg-yellow-50',
    red: 'border-red-500 bg-red-50'
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${color ? `border-l-4 ${colorClasses[color]}` : ''}`}>
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
    </div>
  );
}
