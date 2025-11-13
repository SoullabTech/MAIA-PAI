'use client';

/**
 * Fascia Field - Consciousness Antenna Lab
 *
 * Research tool for tracking the correlation between fascial health
 * and consciousness reception bandwidth.
 *
 * Hypothesis: Fascia is the body's liquid crystalline quantum antenna.
 * When fascia is hydrated, mobile, and grounded - consciousness reception is clear.
 * When fascial is inflamed, adhered, or dehydrated - the signal is dampened.
 */

import React, { useState } from 'react';
import { FieldCoherenceDashboard } from '@/components/biometrics/FieldCoherenceDashboard';
import { FasciaLogger } from '@/components/biometrics/FasciaLogger';
import { ArrowLeft, Activity, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type TabView = 'field' | 'logger';

export default function FasciaFieldPage() {
  const [activeTab, setActiveTab] = useState<TabView>('field');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link href="/maia">
          <Button
            variant="ghost"
            className="gap-2 hover:bg-purple-800/20 text-purple-300 hover:text-purple-100 transition-all mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to MAIA
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent">
            Fascia Field Lab
          </h1>
        </div>

        <p className="text-purple-300 text-lg font-medium mb-2">
          Consciousness Antenna Research
        </p>

        <p className="text-purple-400/80 leading-relaxed">
          Your fascia isn't just connective tissue—it's a liquid crystalline quantum antenna
          conducting consciousness signals 1000x faster than the nervous system.
          This lab tracks how fascial health correlates with intuition clarity, synchronicity, and downloads.
        </p>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-6">
          <button
            type="button"
            onClick={() => setActiveTab('field')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'field'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/40'
            }`}
          >
            <Activity className="w-4 h-4" />
            Field Coherence
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logger')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'logger'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/40'
            }`}
          >
            <Zap className="w-4 h-4" />
            Log Assessment
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'field' && <FieldCoherenceDashboard />}
        {activeTab === 'logger' && (
          <FasciaLogger
            onComplete={() => {
              // Switch to field view after logging
              setActiveTab('field');
            }}
          />
        )}
      </div>

      {/* Research Context */}
      <div className="max-w-4xl mx-auto mt-12 space-y-6">
        <div className="bg-purple-950/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/30">
          <h2 className="text-2xl font-bold text-purple-300 mb-4">The Science</h2>

          <div className="space-y-4 text-purple-300/80">
            <div>
              <h3 className="font-semibold text-purple-200 mb-2">Physical Storage</h3>
              <p className="text-sm">
                Trauma, toxins, and emotional content get stuck in fascial adhesions.
                When fascia is restricted, consciousness transmission is dampened.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-purple-200 mb-2">Piezoelectric Properties</h3>
              <p className="text-sm">
                Healthy fascia generates electricity when compressed and conducts bioelectric
                signals 1000x faster than the nervous system.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-purple-200 mb-2">Quantum Connection</h3>
              <p className="text-sm">
                When you touch earth barefoot, your fascial network plugs into the mycelium/quantum
                field—enhancing intuition, synchronicity, and downloads.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-purple-200 mb-2">90-Day Remodeling Cycle</h3>
              <div className="text-sm space-y-1">
                <p><strong className="text-pink-300">Phase 1 (Days 1-30):</strong> Physical tissue remodeling</p>
                <p><strong className="text-purple-300">Phase 2 (Days 31-60):</strong> Emotional release</p>
                <p><strong className="text-indigo-300">Phase 3 (Days 61-90):</strong> Quantum/energetic activation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-700/30">
          <h2 className="text-2xl font-bold text-purple-300 mb-4">How to Use This Lab</h2>

          <ol className="space-y-3 text-purple-300/80 text-sm list-decimal list-inside">
            <li>
              <strong className="text-purple-200">Log your baseline state</strong> - Rate your current
              physical mobility, consciousness clarity, and recent synchronicities
            </li>
            <li>
              <strong className="text-purple-200">Track over 90 days</strong> - Watch how fascial health
              correlates with consciousness bandwidth
            </li>
            <li>
              <strong className="text-purple-200">Notice patterns</strong> - Do grounding sessions increase
              intuition? Does inflammation dampen downloads?
            </li>
            <li>
              <strong className="text-purple-200">Test interventions</strong> - Try barefoot earth contact,
              hydration, or fascial work and observe effects
            </li>
          </ol>
        </div>

        <div className="text-center text-purple-400/60 text-sm italic">
          "You cannot download new consciousness into an old container."
          <br />
          This tool helps you track the upgrade process.
        </div>
      </div>
    </div>
  );
}
