'use client';

/**
 * INTELLIGENCE DASHBOARD
 *
 * Real-time transformation intelligence for users
 * - Current coherence level
 * - Active transformation signatures
 * - Journey trajectory
 * - Framework effectiveness
 * - Intervention windows
 * - Comparative analytics
 */

import { useState, useEffect } from 'react';
import { unifiedIntelligenceEngine } from '@/lib/intelligence/UnifiedIntelligenceEngine';

interface IntelligenceData {
  coherence: number;
  transformationStage: string;
  activeSignatures: Array<{
    signature: string;
    confidence: number;
    description: string;
    response: string;
  }>;
  journeyTrajectory: {
    direction: string;
    momentum: number;
    predictedNextStage?: string;
  };
  frameworkEffectiveness: Record<string, number>;
  interventionWindows: Array<{
    window: string;
    description: string;
  }>;
  comparativeAnalytics?: {
    percentile: number;
    similarJourneys: number;
  };
}

interface IntelligenceDashboardProps {
  userId: string;
  showComparative?: boolean;
}

export default function IntelligenceDashboard({ userId, showComparative = true }: IntelligenceDashboardProps) {
  const [intelligence, setIntelligence] = useState<IntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    loadIntelligence();
  }, [userId]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadIntelligence();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, userId]);

  async function loadIntelligence() {
    try {
      const data = await unifiedIntelligenceEngine.analyze(userId);
      setIntelligence(data as any);
    } catch (error) {
      console.error('Error loading intelligence:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-600">Analyzing transformation intelligence...</div>
      </div>
    );
  }

  if (!intelligence) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-600">No intelligence data available</div>
      </div>
    );
  }

  const coherencePercentage = (intelligence.coherence * 100).toFixed(1);
  const coherenceColor =
    intelligence.coherence < 0.30 ? 'text-red-600' :
    intelligence.coherence < 0.50 ? 'text-orange-600' :
    intelligence.coherence < 0.75 ? 'text-yellow-600' :
    'text-green-600';

  const coherenceBg =
    intelligence.coherence < 0.30 ? 'bg-red-100' :
    intelligence.coherence < 0.50 ? 'bg-orange-100' :
    intelligence.coherence < 0.75 ? 'bg-yellow-100' :
    'bg-green-100';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transformation Intelligence</h1>
          <p className="text-gray-600 mt-2">
            Real-time awareness of your transformation state
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            Auto-refresh (30s)
          </label>
          <button
            onClick={loadIntelligence}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Coherence Level - Primary Metric */}
      <div className={`${coherenceBg} border-l-4 ${coherenceColor.replace('text-', 'border-')} p-6 rounded-lg mb-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Coherence Level</h2>
            <p className="text-sm text-gray-600">Your current transformation state</p>
          </div>
          <div className={`text-5xl font-bold ${coherenceColor}`}>
            {coherencePercentage}%
          </div>
        </div>

        <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${coherenceColor.replace('text-', 'bg-')} transition-all duration-500`}
            style={{ width: `${coherencePercentage}%` }}
          />
        </div>

        <div className="mt-4 text-sm text-gray-700">
          {intelligence.coherence < 0.30 && (
            <p><strong>Critical:</strong> Very low coherence - Nigredo territory. Priority: Co-regulate, normalize, presence. Do not push for insight.</p>
          )}
          {intelligence.coherence >= 0.30 && intelligence.coherence < 0.50 && (
            <p><strong>Low-Moderate:</strong> Emerging from darkness. Gentle reflection appropriate.</p>
          )}
          {intelligence.coherence >= 0.50 && intelligence.coherence < 0.75 && (
            <p><strong>Moderate-High:</strong> Good capacity for transformation work. Support synthesis.</p>
          )}
          {intelligence.coherence >= 0.75 && (
            <p><strong>High Coherence:</strong> Optimal state. Deepen, harvest, celebrate.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transformation Stage */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transformation Stage</h3>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {intelligence.transformationStage}
          </div>
          <p className="text-sm text-gray-600">
            {intelligence.transformationStage === 'Nigredo' && '🌑 Dark night, dissolution, necessary chaos'}
            {intelligence.transformationStage === 'Albedo' && '🌓 Light returning, clarity dawning'}
            {intelligence.transformationStage === 'Citrinitas' && '🌕 Integration phase, sacred marriage'}
            {intelligence.transformationStage === 'Rubedo' && '🔴 Embodiment, living gold'}
          </p>
        </div>

        {/* Journey Trajectory */}
        {intelligence.journeyTrajectory && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Trajectory</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Direction</div>
                <div className="text-xl font-semibold text-gray-900">{intelligence.journeyTrajectory.direction}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Momentum</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${intelligence.journeyTrajectory.momentum * 100}%` }}
                    />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {(intelligence.journeyTrajectory.momentum * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
              {intelligence.journeyTrajectory.predictedNextStage && (
                <div>
                  <div className="text-sm text-gray-600">Predicted Next</div>
                  <div className="text-lg font-semibold text-indigo-600">{intelligence.journeyTrajectory.predictedNextStage}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Active Transformation Signatures */}
      {intelligence.activeSignatures && intelligence.activeSignatures.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Transformation Signatures</h3>
          <div className="space-y-4">
            {intelligence.activeSignatures.map((sig, index) => (
              <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{sig.signature}</h4>
                  <span className="text-sm font-semibold text-indigo-600">
                    {(sig.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Pattern:</strong> {sig.description}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Response:</strong> {sig.response}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Framework Effectiveness */}
      {intelligence.frameworkEffectiveness && Object.keys(intelligence.frameworkEffectiveness).length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Framework Effectiveness</h3>
          <p className="text-sm text-gray-600 mb-4">
            Which therapeutic frameworks resonate most with your patterns
          </p>
          <div className="space-y-3">
            {Object.entries(intelligence.frameworkEffectiveness)
              .sort(([,a], [,b]) => (b as number) - (a as number))
              .slice(0, 8)
              .map(([framework, score]) => (
                <div key={framework}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{framework}</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {((score as number) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${(score as number) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Intervention Windows */}
      {intelligence.interventionWindows && intelligence.interventionWindows.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Intervention Windows</h3>
          <p className="text-sm text-gray-600 mb-4">
            Optimal times for different types of transformation work
          </p>
          <div className="space-y-2">
            {intelligence.interventionWindows.map((window, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <div className="text-2xl">⏰</div>
                <div>
                  <div className="font-semibold text-gray-900">{window.window}</div>
                  <div className="text-sm text-gray-600">{window.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparative Analytics */}
      {showComparative && intelligence.comparativeAnalytics && (
        <div className="mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparative Analytics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Your Percentile</div>
              <div className="text-3xl font-bold text-purple-600">
                {intelligence.comparativeAnalytics.percentile}th
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Higher coherence than {intelligence.comparativeAnalytics.percentile}% of similar journeys
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Similar Journeys</div>
              <div className="text-3xl font-bold text-indigo-600">
                {intelligence.comparativeAnalytics.similarJourneys}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Others with comparable patterns
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Intelligence Explanation */}
      <div className="mt-6 bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Understanding Your Intelligence</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          This dashboard shows real-time computational analysis of your transformation state.
          <strong> Coherence</strong> measures your internal harmony (0-100%).
          <strong> Signatures</strong> are recurring patterns detected across your journals, conversations, and behaviors.
          <strong> Framework effectiveness</strong> shows which therapeutic approaches resonate most with YOUR unique patterns.
          MAIA uses this intelligence to respond with unprecedented precision - not generic wisdom, but guidance calibrated to exactly where you are right now.
        </p>
      </div>
    </div>
  );
}
