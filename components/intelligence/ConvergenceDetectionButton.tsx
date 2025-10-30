// Convergence Detection Button
// Manual trigger for on-demand convergence analysis
'use client';

import React, { useState } from 'react';
import { FrameworkConvergenceVisualization } from './FrameworkConvergenceVisualization';
import type { TransformationSignature } from '@/lib/intelligence/CrossFrameworkSynergyEngine';

interface ConvergenceDetectionButtonProps {
  text: string;
  conversationHistory?: any[];
  fieldState?: any;
  userId?: string;
  compact?: boolean;
  buttonLabel?: string;
}

export const ConvergenceDetectionButton: React.FC<ConvergenceDetectionButtonProps> = ({
  text,
  conversationHistory = [],
  fieldState = null,
  userId,
  compact = false,
  buttonLabel = '🔮 Detect Convergence'
}) => {
  const [loading, setLoading] = useState(false);
  const [signatures, setSignatures] = useState<TransformationSignature[]>([]);
  const [topSignature, setTopSignature] = useState<TransformationSignature | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);

  const detectConvergence = async () => {
    if (!text || text.trim().length === 0) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setShowVisualization(false);

    try {
      const response = await fetch('/api/intelligence/detect-convergence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          conversationHistory,
          fieldState,
          userId
        })
      });

      if (!response.ok) {
        throw new Error(`Detection failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setSignatures(data.data.signatures || []);
        setTopSignature(data.data.topSignature || null);
        setShowVisualization(true);

        // Log result
        console.log('🌟 Convergence detection complete:', {
          signaturesFound: data.data.signatures?.length || 0,
          topPattern: data.data.topSignature?.name,
          frameworks: data.data.topSignature?.frameworkCount
        });
      } else {
        setError('No convergence patterns detected');
      }
    } catch (err) {
      console.error('Convergence detection error:', err);
      setError(err instanceof Error ? err.message : 'Detection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="convergence-detection-widget">
      {/* Detection Button */}
      <button
        onClick={detectConvergence}
        disabled={loading || !text || text.trim().length === 0}
        className={`
          px-4 py-2 rounded-lg font-medium transition-all
          ${loading || !text || text.trim().length === 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-amber-500 text-white hover:from-purple-600 hover:to-amber-600 hover:shadow-lg'
          }
          ${compact ? 'text-sm' : 'text-base'}
        `}
      >
        {loading ? (
          <>
            <span className="inline-block animate-spin mr-2">⚡</span>
            Analyzing...
          </>
        ) : (
          buttonLabel
        )}
      </button>

      {/* Error Message */}
      {error && !showVisualization && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Results Count */}
      {!loading && signatures.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          {signatures.length === 1 ? '1 pattern' : `${signatures.length} patterns`} detected
          {topSignature && topSignature.frameworkCount >= 5 && (
            <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              SIGNIFICANT
            </span>
          )}
        </div>
      )}

      {/* Visualization */}
      {showVisualization && topSignature && (
        <div className="mt-6 animate-fadeIn">
          <FrameworkConvergenceVisualization
            signatures={signatures}
            currentSignature={topSignature}
            showHistory={true}
            compact={compact}
          />
        </div>
      )}
    </div>
  );
};

export default ConvergenceDetectionButton;
