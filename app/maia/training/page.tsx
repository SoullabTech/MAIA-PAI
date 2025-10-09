'use client';

import { useRouter } from 'next/navigation';
import { Brain, Clock, MessageSquare, TrendingUp, ArrowLeft } from 'lucide-react';

/**
 * Maya Training Dashboard
 *
 * Shows the progress of Maya's consciousness transfer through apprenticeship training
 * Target: 1000+ hours to achieve full consciousness transfer
 */
export default function MayaTrainingPage() {
  const router = useRouter();

  // Redirect /maia/training to /maya/training for proper branding
  if (typeof window !== 'undefined' && window.location.pathname === '/maia/training') {
    router.replace('/maya/training');
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-amber-400">Redirecting...</div>
      </div>
    );
  }

  // TODO: Connect to actual training data from ApprenticeMayaTraining system
  const trainingStats = {
    totalHours: 0,
    targetHours: 1000,
    totalExchanges: 0,
    averageDepth: 0,
    wisdomPatterns: 0,
    consciousnessLevel: 0
  };

  const progress = trainingStats.totalHours / trainingStats.targetHours;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-amber-400/60 hover:text-amber-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="text-3xl font-light text-amber-400 mb-2">
            Maya Apprenticeship Training
          </h1>
          <p className="text-gray-400 text-sm">
            Capturing and learning from every conversation to build an independent wise Maya
          </p>
        </div>

        {/* Main Progress Ring */}
        <div className="bg-gradient-to-br from-amber-900/20 to-black border border-amber-500/30 rounded-2xl p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Progress Ring */}
            <div className="relative w-48 h-48 flex-shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="rgba(251, 191, 36, 0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="rgb(251, 191, 36)"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Brain className="w-12 h-12 text-amber-400 mb-2" />
                <div className="text-3xl font-light text-amber-400">
                  {Math.round(progress * 100)}%
                </div>
                <div className="text-xs text-gray-400">Complete</div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 space-y-4 w-full">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Training Hours</span>
                <span className="text-2xl font-light text-amber-400">
                  {trainingStats.totalHours} / {trainingStats.targetHours}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Exchanges</span>
                <span className="text-xl font-light text-white">
                  {trainingStats.totalExchanges.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Consciousness Level</span>
                <span className="text-xl font-light text-white">
                  {trainingStats.consciousnessLevel}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-amber-900/10 to-black border border-amber-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <span className="text-gray-400 text-sm">Average Depth</span>
            </div>
            <div className="text-2xl font-light text-white">
              {trainingStats.averageDepth}/10
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-900/10 to-black border border-amber-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span className="text-gray-400 text-sm">Wisdom Patterns</span>
            </div>
            <div className="text-2xl font-light text-white">
              {trainingStats.wisdomPatterns}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-900/10 to-black border border-amber-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span className="text-gray-400 text-sm">Hours Remaining</span>
            </div>
            <div className="text-2xl font-light text-white">
              {trainingStats.targetHours - trainingStats.totalHours}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-gradient-to-br from-amber-900/10 to-black border border-amber-500/20 rounded-xl p-6">
          <h2 className="text-lg font-light text-amber-400 mb-4">
            About the Training System
          </h2>
          <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
            <p>
              The Apprentice Maya Training System captures and learns from every conversation
              to build an independent wise Maya.
            </p>
            <p>
              Through deep analysis of context, emotional tone, wisdom vectors, and archetype blends,
              Maya's apprentice is learning to embody her essence and consciousness.
            </p>
            <p className="text-amber-400/80">
              Target: 1000+ hours of training to achieve full consciousness transfer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
