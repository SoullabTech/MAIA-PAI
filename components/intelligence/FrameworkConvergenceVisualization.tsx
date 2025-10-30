// Framework Convergence Visualization
// Shows transformation signatures detected across multiple wisdom frameworks
import React, { useMemo } from 'react';
import type { TransformationSignature } from '@/lib/intelligence/CrossFrameworkSynergyEngine';

interface FrameworkConvergenceVisualizationProps {
  signatures: TransformationSignature[];
  currentSignature?: TransformationSignature | null;
  showHistory?: boolean;
  compact?: boolean;
}

export const FrameworkConvergenceVisualization: React.FC<FrameworkConvergenceVisualizationProps> = ({
  signatures,
  currentSignature,
  showHistory = false,
  compact = false
}) => {
  // Get top signature if not provided
  const topSignature = currentSignature || (signatures.length > 0 ? signatures[0] : null);

  // Calculate convergence strength color
  const getConvergenceColor = (frameworkCount: number) => {
    if (frameworkCount >= 7) return { bg: '#7C3AED', text: '#EDE9FE', label: 'Ultra-Rare' }; // Purple
    if (frameworkCount >= 5) return { bg: '#F59E0B', text: '#FEF3C7', label: 'Advanced' }; // Amber
    return { bg: '#3B82F6', text: '#DBEAFE', label: 'Basic' }; // Blue
  };

  // Get urgency color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return '#EF4444'; // Red
      case 'high': return '#F59E0B'; // Amber
      case 'moderate': return '#10B981'; // Green
      case 'low': return '#6B7280'; // Gray
      default: return '#6B7280';
    }
  };

  // Framework colors for constellation
  const frameworkColors: Record<string, string> = {
    'Alchemy': '#7C3AED',
    'Jung': '#EC4899',
    'IFS': '#3B82F6',
    'Polyvagal': '#10B981',
    'Levine': '#F59E0B',
    'Gestalt': '#EF4444',
    'McGilchrist': '#8B5CF6',
    'Family Constellation': '#06B6D4',
    'Levin': '#84CC16',
    'Existential': '#6366F1',
    'Schema Therapy': '#14B8A6',
    'DBT': '#F97316',
    'ACT': '#A855F7',
    'CFT': '#EC4899',
    'Compassionate Inquiry': '#F472B6',
    'NARM': '#8B5CF6',
    'Eco-Therapy': '#22C55E',
    'CBT': '#3B82F6',
    'Gnostic': '#7C3AED'
  };

  // Get framework color
  const getFrameworkColor = (framework: string) => {
    return frameworkColors[framework] || '#6B7280';
  };

  // Constellation layout for frameworks
  const getConstellationLayout = (frameworks: string[]) => {
    const centerX = 150;
    const centerY = 150;
    const radius = 100;

    return frameworks.map((framework, i) => {
      const angle = (i / frameworks.length) * 2 * Math.PI - Math.PI / 2;
      return {
        framework,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        color: getFrameworkColor(framework)
      };
    });
  };

  if (!topSignature) {
    return (
      <div className="framework-convergence-visualization bg-white rounded-xl shadow-sm p-6">
        <div className="text-center text-gray-500">
          <p className="text-sm">No transformation signatures detected yet.</p>
          <p className="text-xs mt-2">MAIA is listening with 26+ frameworks...</p>
        </div>
      </div>
    );
  }

  const convergence = getConvergenceColor(topSignature.frameworkCount);
  const constellationPoints = getConstellationLayout(topSignature.frameworks);

  return (
    <div className={`framework-convergence-visualization bg-white rounded-xl shadow-sm ${compact ? 'p-4' : 'p-6'}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            {topSignature.name}
          </h3>
          <p className="text-sm text-gray-600">
            {topSignature.description}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 ml-4">
          {/* Convergence badge */}
          <div
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: convergence.bg,
              color: convergence.text
            }}
          >
            {convergence.label}
          </div>

          {/* Framework count */}
          <div className="text-2xl font-bold" style={{ color: convergence.bg }}>
            {topSignature.frameworkCount}
          </div>
          <div className="text-xs text-gray-500">frameworks</div>
        </div>
      </div>

      {/* Constellation visualization */}
      {!compact && (
        <div className="relative mb-6 flex justify-center">
          <svg width="300" height="300" viewBox="0 0 300 300">
            {/* Background circle */}
            <circle
              cx="150"
              cy="150"
              r="120"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
              strokeDasharray="4,4"
            />

            {/* Center glow */}
            <circle
              cx="150"
              cy="150"
              r="40"
              fill={convergence.bg}
              opacity="0.1"
            />
            <circle
              cx="150"
              cy="150"
              r="20"
              fill={convergence.bg}
              opacity="0.2"
            />

            {/* Lines from center to frameworks */}
            {constellationPoints.map((point, i) => (
              <line
                key={`line-${i}`}
                x1="150"
                y1="150"
                x2={point.x}
                y2={point.y}
                stroke={point.color}
                strokeWidth="2"
                opacity="0.4"
              />
            ))}

            {/* Framework nodes */}
            {constellationPoints.map((point, i) => (
              <g key={`node-${i}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="12"
                  fill={point.color}
                  opacity="0.9"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="8"
                  fill="white"
                  opacity="0.3"
                />
              </g>
            ))}

            {/* Center confidence indicator */}
            <text
              x="150"
              y="150"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={convergence.bg}
              fontSize="24"
              fontWeight="bold"
            >
              {Math.round(topSignature.confidence * 100)}%
            </text>
            <text
              x="150"
              y="170"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#6B7280"
              fontSize="10"
            >
              confidence
            </text>
          </svg>
        </div>
      )}

      {/* Framework tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {topSignature.frameworks.map((framework, i) => (
          <span
            key={i}
            className="px-2 py-1 text-xs font-medium rounded-md text-white"
            style={{ backgroundColor: getFrameworkColor(framework) }}
          >
            {framework}
          </span>
        ))}
      </div>

      {/* Urgency indicator */}
      <div className="mb-4 p-3 rounded-lg border-2"
           style={{
             borderColor: getUrgencyColor(topSignature.urgency),
             backgroundColor: `${getUrgencyColor(topSignature.urgency)}10`
           }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium" style={{ color: getUrgencyColor(topSignature.urgency) }}>
            Urgency: {topSignature.urgency.toUpperCase()}
          </span>
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-6 rounded ${
                  i < (topSignature.urgency === 'critical' ? 4 :
                       topSignature.urgency === 'high' ? 3 :
                       topSignature.urgency === 'moderate' ? 2 : 1)
                    ? 'opacity-100' : 'opacity-20'
                }`}
                style={{ backgroundColor: getUrgencyColor(topSignature.urgency) }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Clinical meaning */}
      <div className="mb-4 p-4 bg-amber-50 rounded-lg">
        <p className="text-xs font-medium text-amber-900 mb-2">Clinical Meaning</p>
        <p className="text-sm text-amber-800 leading-relaxed">
          {topSignature.clinicalMeaning}
        </p>
      </div>

      {/* Therapeutic focus */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-xs font-medium text-blue-900 mb-2">Therapeutic Focus</p>
        <p className="text-sm text-blue-800">
          {topSignature.therapeuticFocus}
        </p>
      </div>

      {/* Interventions */}
      <div className="p-4 bg-purple-50 rounded-lg">
        <p className="text-xs font-medium text-purple-900 mb-3">Interventions</p>
        <ul className="space-y-2">
          {topSignature.interventions.map((intervention, i) => {
            const isPriority = intervention.toUpperCase().includes('PRIORITY');
            return (
              <li
                key={i}
                className={`text-sm ${isPriority ? 'font-semibold text-purple-900' : 'text-purple-800'}`}
              >
                <span className={isPriority ? 'text-purple-700' : 'text-purple-400'}>•</span> {intervention}
              </li>
            );
          })}
        </ul>
      </div>

      {/* History section */}
      {showHistory && signatures.length > 1 && (
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-gray-500 mb-3">Recent Signatures</p>
          <div className="space-y-2">
            {signatures.slice(1, 4).map((sig, i) => {
              const sigConvergence = getConvergenceColor(sig.frameworkCount);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{sig.name}</p>
                    <p className="text-xs text-gray-500">{sig.frameworkCount} frameworks</p>
                  </div>
                  <div
                    className="w-2 h-8 rounded"
                    style={{ backgroundColor: sigConvergence.bg }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Convergence insight */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 leading-relaxed">
          {topSignature.frameworkCount >= 7 && (
            <>
              <strong className="text-purple-700">Ultra-rare convergence detected.</strong> When 7+ frameworks align,
              you're touching archetypal bedrock - patterns recognized across wisdom traditions for millennia.
            </>
          )}
          {topSignature.frameworkCount >= 5 && topSignature.frameworkCount < 7 && (
            <>
              <strong className="text-amber-700">Advanced pattern detected.</strong> Multiple frameworks converging
              on the same signature with high confidence. This is significant transformation territory.
            </>
          )}
          {topSignature.frameworkCount < 5 && (
            <>
              <strong className="text-blue-700">Clear pattern emerging.</strong> {topSignature.frameworkCount} frameworks
              align on this signature. MAIA sees a coherent transformation pattern across multiple dimensions.
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default FrameworkConvergenceVisualization;
