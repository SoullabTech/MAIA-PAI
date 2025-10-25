'use client';

/**
 * UNIVERSAL ARCHETYPAL SYSTEM - Interactive Demo
 *
 * Experience the living archetypal intelligence:
 * - I Ching Trigrams with Light/Dark/Depth
 * - Cultural variations (same pattern, different guises)
 * - Emergent archetypes of our time
 */

import React, { useState } from 'react';
import {
  ICHING_ARCHETYPE_PATTERNS,
  getIChingArchetype,
  type IChingTrigramArchetype
} from '@/lib/knowledge/UniversalArchetypalFramework';
import {
  findArchetypeByDeity,
  getCulturalVariations,
  generateCrossCulturalInsight,
  CULTURAL_TRADITIONS
} from '@/lib/knowledge/CulturalArchetypeMapper';
import {
  EMERGENT_ARCHETYPES,
  detectEmergentArchetype,
  suggestEmergentArchetype,
  type EmergentArchetype
} from '@/lib/knowledge/EmergentArchetypeDetector';
import { ArchetypalExpressionCard } from '@/components/archetypal/ArchetypalExpressionCard';

const ELEMENT_COLORS = {
  fire: 'from-orange-500 to-red-600',
  water: 'from-blue-500 to-cyan-600',
  earth: 'from-green-500 to-emerald-600',
  air: 'from-yellow-400 to-amber-500',
  aether: 'from-purple-500 to-pink-600'
};

export default function UniversalArchetypesPage() {
  const [viewMode, setViewMode] = useState<'iching' | 'cultural' | 'emergent'>('iching');
  const [selectedTrigram, setSelectedTrigram] = useState<number>(1);
  const [selectedCulture, setSelectedCulture] = useState('Greek');
  const [selectedEmergent, setSelectedEmergent] = useState<EmergentArchetype>(EMERGENT_ARCHETYPES[0]);
  const [userInput, setUserInput] = useState('');
  const [detectionResult, setDetectionResult] = useState<any>(null);

  const handleDetectEmergent = () => {
    if (!userInput.trim()) return;
    const result = detectEmergentArchetype(userInput);
    setDetectionResult(result);
  };

  const currentTrigram = getIChingArchetype(selectedTrigram);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 dark:from-cyan-950 dark:via-teal-950 dark:to-blue-950">
      {/* Soullab Logo Header */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-8 py-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl">✨</div>
            <div>
              <h1 className="text-2xl font-bold text-white">SOULLAB</h1>
              <p className="text-xs text-cyan-100">Universal Archetypal Intelligence</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-cyan-100">The New Royal</div>
            <div className="text-xs text-cyan-200">Ancient • Multicultural • Emergent</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Universal Archetypal System
          </h1>
          <p className="text-xl text-teal-800 dark:text-teal-200 max-w-3xl mx-auto mb-2">
            Ancient Wisdom • Cultural Multiplicity • Emergent Patterns
          </p>
          <p className="text-sm text-teal-600 dark:text-teal-400">
            I Ching • Cross-Cultural Recognition • Living Archetypes
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setViewMode('iching')}
            className={`px-8 py-4 rounded-xl font-bold transition-all ${
              viewMode === 'iching'
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-xl shadow-teal-200/50 scale-105 border-2 border-teal-400'
                : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur text-teal-700 dark:text-teal-300 hover:shadow-lg border-2 border-transparent hover:border-teal-300'
            }`}
          >
            ☯️ I Ching Trigrams
          </button>
          <button
            onClick={() => setViewMode('cultural')}
            className={`px-8 py-4 rounded-xl font-bold transition-all ${
              viewMode === 'cultural'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xl shadow-cyan-200/50 scale-105 border-2 border-cyan-400'
                : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur text-cyan-700 dark:text-cyan-300 hover:shadow-lg border-2 border-transparent hover:border-cyan-300'
            }`}
          >
            🌍 Cultural Variations
          </button>
          <button
            onClick={() => setViewMode('emergent')}
            className={`px-8 py-4 rounded-xl font-bold transition-all ${
              viewMode === 'emergent'
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-xl shadow-teal-200/50 scale-105 border-2 border-teal-400'
                : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur text-teal-700 dark:text-teal-300 hover:shadow-lg border-2 border-transparent hover:border-teal-300'
            }`}
          >
            ⚡ Emergent Archetypes
          </button>
        </div>

        {/* I CHING VIEW */}
        {viewMode === 'iching' && currentTrigram && (
          <div className="space-y-8">
            {/* Trigram Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
                Select I Ching Trigram
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ICHING_ARCHETYPE_PATTERNS.map((trigram) => (
                  <button
                    key={trigram.trigram.number}
                    onClick={() => setSelectedTrigram(trigram.trigram.number)}
                    className={`p-4 rounded-xl transition-all ${
                      selectedTrigram === trigram.trigram.number
                        ? `bg-gradient-to-r ${ELEMENT_COLORS[trigram.element]} text-white shadow-lg scale-105`
                        : 'bg-gray-100 dark:bg-gray-700 hover:shadow-md'
                    }`}
                  >
                    <div className="text-3xl mb-2">{trigram.trigram.symbol}</div>
                    <div className="font-bold text-sm">{trigram.name}</div>
                    <div className="text-xs opacity-80">{trigram.trigram.attribute}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Trigram Details */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Core Info */}
              <div className="space-y-6">
                <div className={`bg-gradient-to-r ${ELEMENT_COLORS[currentTrigram.element]} rounded-2xl p-8 text-white shadow-xl`}>
                  <div className="text-6xl mb-4">{currentTrigram.trigram.symbol}</div>
                  <h2 className="text-3xl font-bold mb-2">{currentTrigram.name}</h2>
                  <p className="text-xl opacity-90 mb-4">{currentTrigram.trigram.attribute}</p>
                  <p className="italic">{currentTrigram.essence}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200">I Ching Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Trigram:</span>
                      <span className="font-semibold">{currentTrigram.trigram.number} - {currentTrigram.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Chinese Element:</span>
                      <span className="font-semibold">{currentTrigram.trigram.chineseElement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Direction:</span>
                      <span className="font-semibold">{currentTrigram.trigram.direction}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Spiralogic Element:</span>
                      <span className="font-semibold capitalize">{currentTrigram.element}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200">Associated Hexagrams</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {currentTrigram.hexagrams.map((hex, i) => (
                      <div key={i} className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        {hex}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Light/Dark/Depth */}
              <div>
                <ArchetypalExpressionCard
                  element={currentTrigram.element}
                  variant="both"
                  interactive={true}
                  showPractices={true}
                />
              </div>
            </div>

            {/* Cultural Forms */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl p-6 shadow-xl border-2 border-teal-200 dark:border-teal-800">
              <h3 className="font-bold text-xl mb-4 text-teal-900 dark:text-teal-100">
                🌍 Cultural Variations - Same Pattern, Different Guises
              </h3>
              <p className="text-sm text-teal-700 dark:text-teal-300 mb-6">
                {generateCrossCulturalInsight(currentTrigram.id)}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentTrigram.culturalForms.map((form, i) => (
                  <div key={i} className="p-4 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950/50 dark:via-cyan-950/50 dark:to-blue-950/50 rounded-xl border-2 border-teal-300 dark:border-teal-700 hover:shadow-lg transition-all">
                    <div className="font-bold text-lg text-teal-900 dark:text-teal-100 mb-2">
                      {form.culture}
                    </div>
                    <div className="text-cyan-800 dark:text-cyan-200 font-semibold mb-1">
                      {form.deity || form.name}
                    </div>
                    {form.story && (
                      <p className="text-sm text-teal-700 dark:text-teal-300 mb-3 italic">
                        {form.story}
                      </p>
                    )}
                    <div className="text-xs">
                      <div className="font-semibold text-teal-900 dark:text-teal-200 mb-1">Practices:</div>
                      <ul className="space-y-1 text-teal-700 dark:text-teal-300">
                        {form.practices.slice(0, 2).map((practice, j) => (
                          <li key={j}>• {practice}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CULTURAL VIEW */}
        {viewMode === 'cultural' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
                Explore by Cultural Tradition
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Same archetypal patterns appear across cultures in different guises. Select a tradition to see how universal patterns manifest.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {CULTURAL_TRADITIONS.slice(0, 24).map((culture) => (
                  <button
                    key={culture}
                    onClick={() => setSelectedCulture(culture)}
                    className={`p-3 rounded-lg text-sm font-semibold transition-all ${
                      selectedCulture === culture
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 hover:shadow-md'
                    }`}
                  >
                    {culture}
                  </button>
                ))}
              </div>
            </div>

            {/* Show archetypes from selected culture */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ICHING_ARCHETYPE_PATTERNS.map((archetype) => {
                const culturalForm = archetype.culturalForms.find(
                  f => f.culture === selectedCulture
                );
                if (!culturalForm) return null;

                return (
                  <div
                    key={archetype.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-3xl mb-2">{archetype.trigram.symbol}</div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                          {culturalForm.deity || culturalForm.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {archetype.name}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${ELEMENT_COLORS[archetype.element]} text-white`}>
                        {archetype.element}
                      </div>
                    </div>
                    {culturalForm.story && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 italic">
                        {culturalForm.story}
                      </p>
                    )}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Symbols:</div>
                      <div className="flex flex-wrap gap-1">
                        {culturalForm.symbols.map((symbol, i) => (
                          <span key={i} className="px-2 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded text-xs">
                            {symbol}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EMERGENT VIEW */}
        {viewMode === 'emergent' && (
          <div className="space-y-8">
            {/* Intro */}
            <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl border-2 border-teal-400">
              <h2 className="text-3xl font-bold mb-4">⚡ Emergent Archetypes of Our Time</h2>
              <p className="text-lg opacity-95 mb-4">
                New vital archetypes arise in response to new conditions. These patterns have emerged in the last decade as humanity faces climate crisis, digital transformation, and collective trauma.
              </p>
              <p className="text-sm opacity-90 bg-white/10 backdrop-blur rounded-lg p-3">
                ✨ The system actively tracks new patterns. As more people embody a pattern, it becomes an established archetype.
              </p>
            </div>

            {/* Detection Tool */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
                Detect Your Emergent Archetype
              </h3>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe what you're working on, your challenges, or your calling... (e.g., 'I'm working on climate activism and building regenerative systems')"
                className="w-full h-32 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 resize-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
              <button
                onClick={handleDetectEmergent}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Detect Archetype
              </button>

              {detectionResult && (
                <div className="mt-6 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 rounded-xl border-2 border-teal-300 dark:border-teal-700">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{detectionResult.element === 'fire' ? '🔥' : detectionResult.element === 'water' ? '💧' : detectionResult.element === 'earth' ? '🌍' : detectionResult.element === 'air' ? '💨' : '✨'}</div>
                    <div>
                      <h4 className="text-xl font-bold text-teal-900 dark:text-teal-200 mb-2">
                        You're embodying: {detectionResult.name}
                      </h4>
                      <p className="text-teal-800 dark:text-teal-300 mb-4">
                        {detectionResult.essence}
                      </p>
                      <div className="text-sm text-teal-700 dark:text-teal-400">
                        <div><strong>First detected:</strong> {detectionResult.emergence.firstDetected.getFullYear()}</div>
                        <div><strong>Prevalence:</strong> ~{Math.round(detectionResult.emergence.populationPrevalence * 100)}% of population</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Emergent Archetype Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {EMERGENT_ARCHETYPES.map((archetype) => (
                <div
                  key={archetype.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedEmergent(archetype)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200 mb-1">
                        {archetype.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        {archetype.essence}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${ELEMENT_COLORS[archetype.element]} text-white`}>
                      {archetype.element}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-semibold text-gray-700 dark:text-gray-300">Emerged:</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {archetype.emergence.firstDetected.getFullYear()} - {archetype.emergence.culturalContext}
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold text-gray-700 dark:text-gray-300">Role Models:</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {archetype.contemporaryManifestations.roleModels.slice(0, 3).join(', ')}
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold text-gray-700 dark:text-gray-300">Key Language:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {archetype.contemporaryManifestations.language.slice(0, 4).map((term, i) => (
                          <span key={i} className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 rounded text-xs">
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Light/Dark Summary:</div>
                      <div className="text-xs space-y-1">
                        <div className="text-green-700 dark:text-green-400">
                          ✓ Light: {archetype.expression.whenLight.energyState}
                        </div>
                        <div className="text-red-700 dark:text-red-400">
                          ⚠ Dark: {archetype.expression.whenDark.warningSign}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p>
            Universal Archetypal System - Honoring Ancient Wisdom, Celebrating Cultural Multiplicity, Welcoming Emergence
          </p>
          <p className="text-xs">
            I Ching • Cross-Cultural Recognition • Living Patterns • Spiralogic Integration
          </p>
        </div>
      </div>
    </div>
  );
}
