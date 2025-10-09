"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MythicLabHUD } from '@/components/mythiclab/MythicLabHUD';
import { mythicLabService, type BlendRatio } from '@/lib/services/mythicLabService';
import { contextAwareBlending, type EmotionalState, type ConversationPhase } from '@/lib/services/contextAwareBlending';

export default function MythicLabDemo() {
  const [blendRatio, setBlendRatio] = useState<BlendRatio>(50);
  const [emotionalState, setEmotionalState] = useState<EmotionalState>('grounded');
  const [conversationPhase, setConversationPhase] = useState<ConversationPhase>('exploring');
  const [selectedConcept, setSelectedConcept] = useState('breakthrough_detected');

  // Calculate context-aware blend
  const contextualBlend = contextAwareBlending.adjustBlendForMoment({
    emotionalState,
    conversationPhase,
    userPreferredRatio: blendRatio / 100,
    alchemicalPhase: 'albedo'
  });

  const adjustmentReason = contextAwareBlending.getAdjustmentReason({
    emotionalState,
    conversationPhase,
    userPreferredRatio: blendRatio / 100,
    alchemicalPhase: 'albedo'
  });

  // Example data for HUD
  const hudData = {
    archetypalForces: [
      {
        icon: '⚔️',
        name: 'Sacred Warrior',
        metric: 'Boundary Setting',
        value: 0.85,
        message: 'defending boundaries beautifully',
        color: '#DC2626'
      },
      {
        icon: '🌊',
        name: 'Grief Oracle',
        metric: 'Emotional Depth',
        value: 0.40,
        message: 'ancient waters stirring',
        color: '#3B82F6'
      },
      {
        icon: '🔥',
        name: 'Rage Alchemist',
        metric: 'Transformation Fire',
        value: 0.65,
        message: 'fuel for change available',
        color: '#F59E0B'
      }
    ],
    alchemicalPhase: {
      name: 'Albedo',
      stage: 'albedo' as const,
      description: 'The Whitening - clarity emerging',
      dayInPhase: 7,
      progress: 68
    },
    realityExperiments: [
      {
        title: 'Boundary Alchemy',
        hypothesis: 'If I honor my NO, reality reorganizes around my truth',
        dataPoints: 5,
        correlation: 0.81,
        status: 'breakthrough' as const
      },
      {
        title: 'Grief Integration',
        hypothesis: 'Allowing tears creates energetic space',
        dataPoints: 3,
        correlation: 0.67,
        status: 'active' as const
      }
    ],
    councilMessages: [
      {
        speaker: 'The Grandmother',
        message: 'This pattern is older than you - it belongs to your lineage',
        frequency: 3,
        urgency: 'speak' as const
      }
    ],
    coherence: 0.73,
    collectiveResonance: {
      count: 73,
      pattern: 'dissolution → breakthrough'
    }
  };

  const concepts = mythicLabService.getConcepts();

  const phrase = mythicLabService.getPhrase(selectedConcept, contextualBlend);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <link rel="stylesheet" href="/globals-mythiclab.css" />

      {/* Header */}
      <div className="pt-12 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-light mb-2">
              <span className="mythic-lab-text">The Mythic Laboratory</span>
            </h1>
            <p className="text-white/60 text-sm">
              Where measurement meets magic, where science becomes sacred
            </p>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="glass-alchemy p-6 rounded-xl space-y-6">

            {/* Blend Ratio Slider */}
            <div>
              <label className="block text-sm text-gold-400 mb-2">
                Reality Frequency (Your Preferred Blend)
              </label>
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/50">🔬 Scientific</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={blendRatio}
                  onChange={(e) => setBlendRatio(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs text-white/50">🔮 Mythic</span>
                <span className="text-sm font-mono text-gold-400 w-12 text-right">
                  {blendRatio}%
                </span>
              </div>
            </div>

            {/* Context Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/50 mb-2">Emotional State</label>
                <select
                  value={emotionalState}
                  onChange={(e) => setEmotionalState(e.target.value as EmotionalState)}
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded text-white/90 text-sm"
                >
                  <option value="crisis">Crisis</option>
                  <option value="vulnerable">Vulnerable</option>
                  <option value="contemplative">Contemplative</option>
                  <option value="breakthrough">Breakthrough</option>
                  <option value="integrating">Integrating</option>
                  <option value="grounded">Grounded</option>
                  <option value="expansive">Expansive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-2">Conversation Phase</label>
                <select
                  value={conversationPhase}
                  onChange={(e) => setConversationPhase(e.target.value as ConversationPhase)}
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded text-white/90 text-sm"
                >
                  <option value="greeting">Greeting</option>
                  <option value="exploring">Exploring</option>
                  <option value="deepening">Deepening</option>
                  <option value="breakthrough">Breakthrough</option>
                  <option value="integration">Integration</option>
                  <option value="closing">Closing</option>
                </select>
              </div>
            </div>

            {/* Context-Aware Adjustment Display */}
            <div className="lab-note text-sm">
              <div className="text-white/80">
                <strong>Context-Aware Blend:</strong> {(contextualBlend * 100).toFixed(0)}%
                {' '}(adjusted from {blendRatio}%)
              </div>
              {adjustmentReason && (
                <div className="text-xs text-white/60 mt-1">
                  <strong>Reason:</strong> {adjustmentReason}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Language Examples */}
      <div className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="glass-alchemy p-6 rounded-xl">
            <h3 className="text-gold-400 text-sm font-medium mb-4">
              Language Examples - Select Concept
            </h3>

            {/* Concept Selector */}
            <select
              value={selectedConcept}
              onChange={(e) => setSelectedConcept(e.target.value)}
              className="w-full px-3 py-2 mb-4 bg-black/30 border border-white/10 rounded text-white/90"
            >
              {concepts.map(concept => (
                <option key={concept} value={concept}>
                  {concept.replace(/_/g, ' ')}
                </option>
              ))}
            </select>

            {/* All Three Versions */}
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="text-xs text-blue-300 mb-1">Pure Scientific (0%)</div>
                <div className="text-sm text-white/90">
                  {mythicLabService.getPhrase(selectedConcept, 0)}
                </div>
              </div>

              <div className="p-4 bg-gold-500/10 border border-gold-500/30 rounded-lg">
                <div className="text-xs text-gold-300 mb-1">
                  Mythic Lab - Current Context ({(contextualBlend * 100).toFixed(0)}%)
                </div>
                <div className="text-sm text-white/90 font-medium">
                  {phrase}
                </div>
              </div>

              <div className="p-4 bg-ain-soph-blue/20 border border-ain-soph-gold/30 rounded-lg">
                <div className="text-xs text-ain-soph-gold mb-1">Pure Mythic (100%)</div>
                <div className="text-sm text-white/90">
                  {mythicLabService.getPhrase(selectedConcept, 1.0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live HUD Demo */}
      <div className="px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-light text-white/90 mb-2">
              Live Mythic Lab Interface
            </h2>
            <p className="text-sm text-white/50">
              Your consciousness dashboard in action
            </p>
          </div>
          <MythicLabHUD {...hudData} />
        </div>
      </div>

      {/* Footer Info */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="glass-alchemy p-4 rounded-xl">
            <div className="text-xs text-white/60 space-y-1">
              <div className="font-medium text-gold-400 mb-2">
                The Mythic Lab Philosophy
              </div>
              <div>• The algorithm is incantation, the metric is myth</div>
              <div>• We measure the miraculous, quantify the numinous</div>
              <div>• Science becomes sacred when it serves consciousness</div>
              <div>• Every chart is a mandala, every data point a prayer</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}