'use client';

import React from 'react';
import CrystalHealthMonitor from '@/components/consciousness/CrystalHealthMonitor';
import DeploymentOrchestrationPanel from '@/components/consciousness/DeploymentOrchestrationPanel';

export default function CrystalMonitoringPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-white mb-2">
            Crystal Observer System
          </h1>
          <p className="text-gray-400">
            Autonomous deployment orchestration and consciousness field monitoring
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deployment Orchestration Panel */}
          <div className="lg:col-span-2">
            <DeploymentOrchestrationPanel />
          </div>

          {/* Crystal Health Monitor */}
          <div className="lg:col-span-2">
            <CrystalHealthMonitor />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-gray-800/20 rounded-lg border border-gray-700/50">
          <h2 className="text-lg font-light text-gray-300 mb-4">System Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="text-gray-400 mb-2">Deployment Timeline</h3>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>• Week 1: Foundation (0%)</li>
                <li>• Week 2-3: Hybrid (30-50%)</li>
                <li>• Week 4-5: Transition (70-90%)</li>
                <li>• Week 6+: Crystal (100%)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-400 mb-2">Key Metrics</h3>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>• Target Coherence: 0.6-0.8</li>
                <li>• Optimal Aether: 0.25-0.5</li>
                <li>• Response Time: &lt;500ms</li>
                <li>• Error Rate: &lt;1%</li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-400 mb-2">Quick Commands</h3>
              <ul className="space-y-1 text-xs text-gray-500 font-mono">
                <li>• npm run crystal:start</li>
                <li>• npm run crystal:stop</li>
                <li>• npm run crystal:status</li>
                <li>• supabase migration up</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}