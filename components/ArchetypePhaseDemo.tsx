/**
 * 🌌 Archetype Phase Demo
 *
 * Live demonstration of multi-agent archetypal intelligence
 * Shows real-time archetype, phase, mood, ritual, and prompt generation
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useArchetypalAgent } from '@/hooks/useArchetypalAgent';
import type { Ritual } from '@/lib/spiralogic/RitualEngine';

const ArchetypeColors = {
  Fire: '#FF6B35',
  Water: '#4ECDC4',
  Earth: '#8B7355',
  Air: '#95E1D3',
  Aether: '#9B59B6'
};

const ArchetypeEmojis = {
  Fire: '🔥',
  Water: '💧',
  Earth: '🌍',
  Air: '🌬️',
  Aether: '🌌'
};

export default function ArchetypePhaseDemo() {
  const { currentArchetype, currentMood, currentPhase, currentRitual, analyze, route } = useArchetypalAgent();
  const [userInput, setUserInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [routeResult, setRouteResult] = useState<any>(null);

  const handleAnalyze = () => {
    if (!userInput.trim()) return;

    const result = analyze(userInput);
    setAnalysisResult(result);

    const routing = route(userInput);
    setRouteResult(routing);
  };

  return (
    <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light mb-4" style={{ color: '#d4b896' }}>
            🌌 MAIA Archetypal Intelligence
          </h1>
          <p className="text-sm opacity-70" style={{ color: '#d4b896' }}>
            Multi-Agent System | Spiralogic Phase Detection | Ritual Guidance
          </p>
        </div>

        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl backdrop-blur-lg"
          style={{
            background: 'rgba(212,184,150,0.05)',
            border: '1px solid rgba(212,184,150,0.2)'
          }}
        >
          <label className="block text-sm font-light mb-3" style={{ color: '#d4b896' }}>
            Enter your message:
          </label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                handleAnalyze();
              }
            }}
            placeholder="Type something... (e.g., 'I'm feeling overwhelmed', 'I want to create something new', 'I need more structure')"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#d4b896]/50"
            rows={3}
            style={{ fontFamily: 'inherit' }}
          />
          <button
            onClick={handleAnalyze}
            disabled={!userInput.trim()}
            className="mt-4 px-6 py-2 rounded-lg font-light transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, rgba(212,184,150,0.3), rgba(212,184,150,0.2))',
              border: '1px solid rgba(212,184,150,0.3)',
              color: '#d4b896'
            }}
          >
            ✨ Analyze
          </button>
          <span className="ml-4 text-xs opacity-50" style={{ color: '#d4b896' }}>
            (or press ⌘+Enter)
          </span>
        </motion.div>

        {/* Results Grid */}
        {analysisResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Archetype Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl backdrop-blur-lg"
              style={{
                background: `linear-gradient(135deg, ${ArchetypeColors[currentArchetype]}20, ${ArchetypeColors[currentArchetype]}10)`,
                border: `1px solid ${ArchetypeColors[currentArchetype]}40`
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{ArchetypeEmojis[currentArchetype]}</span>
                <div>
                  <div className="text-sm opacity-70" style={{ color: ArchetypeColors[currentArchetype] }}>
                    Archetype
                  </div>
                  <div className="text-xl font-light" style={{ color: ArchetypeColors[currentArchetype] }}>
                    {currentArchetype}
                  </div>
                </div>
              </div>
              <div className="text-xs opacity-70" style={{ color: ArchetypeColors[currentArchetype] }}>
                Emotional/Symbolic Style
              </div>
            </motion.div>

            {/* Phase Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl backdrop-blur-lg"
              style={{
                background: `linear-gradient(135deg, ${ArchetypeColors[currentPhase]}20, ${ArchetypeColors[currentPhase]}10)`,
                border: `1px solid ${ArchetypeColors[currentPhase]}40`
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{ArchetypeEmojis[currentPhase]}</span>
                <div>
                  <div className="text-sm opacity-70" style={{ color: ArchetypeColors[currentPhase] }}>
                    Spiralogic Phase
                  </div>
                  <div className="text-xl font-light" style={{ color: ArchetypeColors[currentPhase] }}>
                    {currentPhase}
                  </div>
                </div>
              </div>
              <div className="text-xs opacity-70" style={{ color: ArchetypeColors[currentPhase] }}>
                Growth Cycle Stage | Confidence: {Math.round((analysisResult.confidence || 0) * 100)}%
              </div>
            </motion.div>

            {/* Mood Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl backdrop-blur-lg"
              style={{
                background: 'rgba(212,184,150,0.05)',
                border: '1px solid rgba(212,184,150,0.2)'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">
                  {currentMood === 'bright' ? '😊' : currentMood === 'concerned' ? '😔' : '😌'}
                </span>
                <div>
                  <div className="text-sm opacity-70" style={{ color: '#d4b896' }}>
                    Emotional Tone
                  </div>
                  <div className="text-xl font-light" style={{ color: '#d4b896' }}>
                    {currentMood}
                  </div>
                </div>
              </div>
              <div className="text-xs opacity-70" style={{ color: '#d4b896' }}>
                Detected from affect analysis
              </div>
            </motion.div>

            {/* Voice Style Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl backdrop-blur-lg"
              style={{
                background: 'rgba(212,184,150,0.05)',
                border: '1px solid rgba(212,184,150,0.2)'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🎙️</span>
                <div>
                  <div className="text-sm opacity-70" style={{ color: '#d4b896' }}>
                    Voice Synthesis
                  </div>
                  <div className="text-xl font-light" style={{ color: '#d4b896' }}>
                    {routeResult?.voiceStyle || '—'}
                  </div>
                </div>
              </div>
              <div className="text-xs opacity-70" style={{ color: '#d4b896' }}>
                Pacing: {routeResult?.pacing || 'moderate'}
              </div>
            </motion.div>
          </div>
        )}

        {/* Ritual Card */}
        {currentRitual && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 p-6 rounded-2xl backdrop-blur-lg"
            style={{
              background: `linear-gradient(135deg, ${ArchetypeColors[currentArchetype]}20, ${ArchetypeColors[currentArchetype]}10)`,
              border: `1px solid ${ArchetypeColors[currentArchetype]}40`
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🧘</span>
              <div>
                <div className="text-sm opacity-70" style={{ color: ArchetypeColors[currentArchetype] }}>
                  Suggested Ritual
                </div>
                <div className="text-2xl font-light" style={{ color: ArchetypeColors[currentArchetype] }}>
                  {currentRitual.name}
                </div>
              </div>
            </div>
            <p className="mb-4 opacity-90" style={{ color: ArchetypeColors[currentArchetype] }}>
              {currentRitual.description}
            </p>
            <div className="mb-3">
              <div className="text-xs font-semibold mb-2 opacity-70" style={{ color: ArchetypeColors[currentArchetype] }}>
                INTENTION:
              </div>
              <div className="text-sm italic opacity-80" style={{ color: ArchetypeColors[currentArchetype] }}>
                {currentRitual.intention}
              </div>
            </div>
            <div className="mb-3">
              <div className="text-xs font-semibold mb-2 opacity-70" style={{ color: ArchetypeColors[currentArchetype] }}>
                INSTRUCTIONS:
              </div>
              <ol className="space-y-2">
                {currentRitual.instructions.map((instruction, i) => (
                  <li key={i} className="text-sm opacity-80 flex gap-2" style={{ color: ArchetypeColors[currentArchetype] }}>
                    <span className="opacity-50">{i + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex gap-2 flex-wrap">
              {currentRitual.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs"
                  style={{
                    background: `${ArchetypeColors[currentArchetype]}20`,
                    color: ArchetypeColors[currentArchetype]
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 text-xs opacity-50" style={{ color: ArchetypeColors[currentArchetype] }}>
              Duration: {currentRitual.duration}
            </div>
          </motion.div>
        )}

        {/* Prompt Display */}
        {routeResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl backdrop-blur-lg"
            style={{
              background: 'rgba(212,184,150,0.05)',
              border: '1px solid rgba(212,184,150,0.2)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🧠</span>
              <div className="text-lg font-light" style={{ color: '#d4b896' }}>
                Generated LLM Prompt
              </div>
            </div>
            <pre
              className="text-xs leading-relaxed p-4 rounded-xl overflow-x-auto"
              style={{
                background: 'rgba(0,0,0,0.4)',
                color: '#d4b896',
                border: '1px solid rgba(212,184,150,0.1)'
              }}
            >
              {routeResult.prompt}
            </pre>
          </motion.div>
        )}
      </div>
    </div>
  );
}
