'use client';

/**
 * CULTURAL STORYTELLING DEMO
 *
 * "Stories as Mirrors, Not Prescriptions"
 * - 47 cultural traditions
 * - Universal patterns in different guises
 * - Honoring wisdom from all continents
 * - Contemporary emergent stories
 */

import React, { useState } from 'react';
import { CULTURAL_TRADITIONS, type CulturalTradition } from '@/lib/knowledge/CulturalArchetypeMapper';
import { ICHING_ARCHETYPE_PATTERNS } from '@/lib/knowledge/UniversalArchetypalFramework';
import { EMERGENT_ARCHETYPES } from '@/lib/knowledge/EmergentArchetypeDetector';
import { generateLiveStory, type GeneratedStory } from '@/lib/storytelling/LiveStoryGenerator';

// Cultural tradition categories for organization
const TRADITION_CATEGORIES = {
  'Indigenous Americas': [
    'Indigenous North American',
    'Lakota',
    'Navajo',
    'Hopi',
    'Mayan',
    'Aztec',
    'Inca',
    'Quechua',
    'Mapuche',
    'Amazonian'
  ],
  'African': ['Yoruba', 'Vodou', 'Zulu', 'Dogon', 'San Bushman'],
  'Oceanic': ['Aboriginal Australian', 'Maori', 'Polynesian', 'Hawaiian'],
  'Asian': ['Hindu', 'Buddhist', 'Taoist', 'Shinto'],
  'European': ['Greek', 'Roman', 'Norse', 'Viking', 'Nordic', 'Celtic'],
  'Shamanic': [
    'Siberian Shamanic',
    'Mongolian Shamanic',
    'Korean Mudang',
    'Nepali Jhankri',
    'Peruvian Curandero',
    'Brazilian Santo Daime'
  ],
  'Mystical': [
    'Sufi',
    'Christian Mystical',
    'Jewish Kabbalistic',
    'Gnostic',
    'Hermetic',
    'Zoroastrian'
  ],
  'Ancient': ['Egyptian', 'Sumerian']
} as const;

export default function CulturalStoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof TRADITION_CATEGORIES>('Indigenous Americas');
  const [selectedTradition, setSelectedTradition] = useState<CulturalTradition>('Lakota');
  const [selectedArchetype, setSelectedArchetype] = useState(ICHING_ARCHETYPE_PATTERNS[0]);
  const [userChallenge, setUserChallenge] = useState('');
  const [viewMode, setViewMode] = useState<'explore' | 'generate'>('explore');
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [narrativeStyle, setNarrativeStyle] = useState<'mythological' | 'parable' | 'contemporary' | 'poetic'>('mythological');

  const currentTraditions = TRADITION_CATEGORIES[selectedCategory];

  // Get cultural form for selected tradition
  const culturalForm = selectedArchetype.culturalForms.find(
    f => f.culture === selectedTradition
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 dark:from-cyan-950 dark:via-teal-950 dark:to-blue-950">

      {/* Soullab Header */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-8 py-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📖</div>
            <div>
              <h1 className="text-2xl font-bold text-white">SOULLAB</h1>
              <p className="text-xs text-cyan-100">Cultural Storytelling • Wisdom from All Continents</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-cyan-100">Stories as Mirrors</div>
            <div className="text-xs text-cyan-200">Honoring 47 Traditions</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Cultural Storytelling
          </h1>
          <p className="text-xl text-teal-800 dark:text-teal-200 max-w-3xl mx-auto mb-2">
            Universal Patterns in Cultural Guises
          </p>
          <p className="text-sm text-teal-600 dark:text-teal-400">
            Honoring wisdom from Lakota, Yoruba, Maori, Celtic, Hindu, and 42 more traditions
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setViewMode('explore')}
            className={`px-8 py-4 rounded-xl font-bold transition-all ${
              viewMode === 'explore'
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-xl shadow-teal-200/50 scale-105 border-2 border-teal-400'
                : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur text-teal-700 dark:text-teal-300 hover:shadow-lg border-2 border-transparent hover:border-teal-300'
            }`}
          >
            🌍 Explore Traditions
          </button>
          <button
            onClick={() => setViewMode('generate')}
            className={`px-8 py-4 rounded-xl font-bold transition-all ${
              viewMode === 'generate'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xl shadow-cyan-200/50 scale-105 border-2 border-cyan-400'
                : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur text-cyan-700 dark:text-cyan-300 hover:shadow-lg border-2 border-transparent hover:border-cyan-300'
            }`}
          >
            ✨ Generate Story
          </button>
        </div>

        {/* EXPLORE MODE */}
        {viewMode === 'explore' && (
          <div className="space-y-8">

            {/* Category Selector */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl p-6 shadow-xl border-2 border-teal-200 dark:border-teal-800">
              <h3 className="font-bold text-xl mb-4 text-teal-900 dark:text-teal-100">
                Select Cultural Region
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.keys(TRADITION_CATEGORIES) as (keyof typeof TRADITION_CATEGORIES)[]).map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedTradition(TRADITION_CATEGORIES[category][0] as CulturalTradition);
                    }}
                    className={`p-4 rounded-xl font-semibold transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 text-teal-800 dark:text-teal-200 hover:shadow-md'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Tradition Selector */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl p-6 shadow-xl border-2 border-cyan-200 dark:border-cyan-800">
              <h3 className="font-bold text-xl mb-4 text-cyan-900 dark:text-cyan-100">
                {selectedCategory} Traditions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {currentTraditions.map((tradition) => (
                  <button
                    key={tradition}
                    onClick={() => setSelectedTradition(tradition as CulturalTradition)}
                    className={`p-3 rounded-lg text-sm font-semibold transition-all ${
                      selectedTradition === tradition
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                        : 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-200 hover:shadow-sm'
                    }`}
                  >
                    {tradition}
                  </button>
                ))}
              </div>
            </div>

            {/* Archetype Selector */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl p-6 shadow-xl border-2 border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-xl mb-4 text-blue-900 dark:text-blue-100">
                How does {selectedTradition} understand these patterns?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ICHING_ARCHETYPE_PATTERNS.map((archetype) => {
                  const form = archetype.culturalForms.find(f => f.culture === selectedTradition);
                  if (!form) return null;

                  return (
                    <button
                      key={archetype.id}
                      onClick={() => setSelectedArchetype(archetype)}
                      className={`p-4 rounded-xl transition-all text-left ${
                        selectedArchetype.id === archetype.id
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                          : 'bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100 hover:shadow-md'
                      }`}
                    >
                      <div className="text-2xl mb-2">{archetype.trigram.symbol}</div>
                      <div className="font-bold text-sm">{form.deity || form.name}</div>
                      <div className="text-xs opacity-80">{archetype.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Story Display */}
            {culturalForm && (
              <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl border-2 border-teal-400">
                <div className="text-4xl mb-4">{selectedArchetype.trigram.symbol}</div>
                <h2 className="text-3xl font-bold mb-2">{culturalForm.deity || culturalForm.name}</h2>
                <p className="text-xl opacity-90 mb-6">{selectedTradition} • {selectedArchetype.name}</p>

                {culturalForm.story && (
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
                    <p className="text-lg italic leading-relaxed">{culturalForm.story}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-bold mb-2 text-cyan-100">Symbols:</h4>
                    <div className="flex flex-wrap gap-2">
                      {culturalForm.symbols.map((symbol, i) => (
                        <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm">
                          {symbol}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2 text-cyan-100">Practices:</h4>
                    <ul className="space-y-1">
                      {culturalForm.practices.slice(0, 3).map((practice, i) => (
                        <li key={i} className="text-sm">• {practice}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                  <h4 className="font-bold mb-3 text-cyan-100">Universal Pattern:</h4>
                  <p className="text-sm leading-relaxed opacity-90">
                    {selectedArchetype.essence}
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-xs opacity-75">
                      This pattern appears across cultures. In Greek tradition as {selectedArchetype.culturalForms[0]?.deity},
                      in {selectedTradition} as {culturalForm.deity}. Same wisdom, different guises.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* GENERATE MODE */}
        {viewMode === 'generate' && (
          <div className="space-y-8">

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Generate Your Story
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Share what you're facing, and receive a story from the cultural tradition of your choice.
              </p>

              {/* Cultural Tradition Selector */}
              <div className="mb-6">
                <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Select Cultural Tradition:
                </label>
                <select
                  value={selectedTradition}
                  onChange={(e) => setSelectedTradition(e.target.value as CulturalTradition)}
                  className="w-full p-4 rounded-lg border-2 border-teal-300 dark:border-teal-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                >
                  {(Object.entries(TRADITION_CATEGORIES) as [string, readonly CulturalTradition[]][]).map(([category, traditions]) => (
                    <optgroup key={category} label={category}>
                      {traditions.map(tradition => (
                        <option key={tradition} value={tradition}>{tradition}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Narrative Style Selector */}
              <div className="mb-6">
                <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Story Style:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['mythological', 'parable', 'contemporary', 'poetic'].map((style) => (
                    <button
                      key={style}
                      onClick={() => setNarrativeStyle(style as any)}
                      className={`p-3 rounded-lg font-semibold capitalize transition-all ${
                        narrativeStyle === style
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                          : 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 hover:shadow-sm'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {narrativeStyle === 'mythological' && 'Ancient, timeless teaching stories'}
                  {narrativeStyle === 'parable' && 'Simple wisdom tales with profound meaning'}
                  {narrativeStyle === 'contemporary' && 'Modern framing with practical application'}
                  {narrativeStyle === 'poetic' && 'Verse and rhythm, heart-centered'}
                </p>
              </div>

              {/* Challenge Input */}
              <div className="mb-6">
                <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  What are you facing?
                </label>
                <textarea
                  value={userChallenge}
                  onChange={(e) => setUserChallenge(e.target.value)}
                  placeholder="Share your challenge, question, or what you're navigating..."
                  className="w-full h-32 p-4 rounded-lg border-2 border-cyan-300 dark:border-cyan-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 resize-none"
                />
              </div>

              <button
                onClick={async () => {
                  if (!userChallenge.trim()) return;

                  setIsGenerating(true);
                  try {
                    const story = await generateLiveStory(
                      userChallenge,
                      selectedTradition,
                      {
                        narrativeStyle,
                        crossCultural: true
                      }
                    );
                    setGeneratedStory(story);
                  } catch (error) {
                    console.error('Story generation error:', error);
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                disabled={!userChallenge.trim() || isGenerating}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                  !userChallenge.trim() || isGenerating
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:shadow-lg'
                }`}
              >
                {isGenerating ? 'Weaving Story...' : `Receive Story from ${selectedTradition} Wisdom`}
              </button>
            </div>

            {/* Generated Story Display */}
            {generatedStory && (
              <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl border-2 border-teal-400">
                <h2 className="text-3xl font-bold mb-4">{generatedStory.title}</h2>

                <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
                  <div className="text-sm opacity-90 mb-2">
                    {generatedStory.culturalContext.tradition} • {generatedStory.culturalContext.archetype}
                  </div>
                  <div className="prose prose-lg prose-invert max-w-none">
                    {generatedStory.narrative.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4 leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Transformation Section */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <h4 className="font-bold mb-2 text-cyan-100">Challenge</h4>
                    <p className="text-sm opacity-90">{generatedStory.transformation.challenge}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <h4 className="font-bold mb-2 text-cyan-100">Pathway</h4>
                    <p className="text-sm opacity-90">{generatedStory.transformation.pathway}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <h4 className="font-bold mb-2 text-cyan-100">Wisdom</h4>
                    <p className="text-sm opacity-90">{generatedStory.transformation.wisdom}</p>
                  </div>
                </div>

                {/* Practices */}
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
                  <h4 className="font-bold mb-4 text-cyan-100">Integration Practices</h4>
                  <div className="space-y-3">
                    {generatedStory.practices.map((practice, i) => (
                      <div key={i}>
                        <div className="font-semibold">{i + 1}. {practice.title}</div>
                        <p className="text-sm opacity-90 mt-1">{practice.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reflection */}
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
                  <h4 className="font-bold mb-4 text-cyan-100">Reflection Questions</h4>
                  <ul className="space-y-2">
                    {generatedStory.reflection.questions.map((q, i) => (
                      <li key={i} className="text-sm opacity-90">• {q}</li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="font-semibold mb-2">Journal Prompt:</div>
                    <p className="text-sm italic opacity-90">{generatedStory.reflection.journalPrompt}</p>
                  </div>
                </div>

                {/* Cross-Cultural Wisdom */}
                {generatedStory.crossCulturalWisdom && generatedStory.crossCulturalWisdom.length > 0 && (
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                    <h4 className="font-bold mb-4 text-cyan-100">Cross-Cultural Perspectives</h4>
                    <div className="space-y-3">
                      {generatedStory.crossCulturalWisdom.map((wisdom, i) => (
                        <div key={i}>
                          <div className="font-semibold">{wisdom.tradition}</div>
                          <p className="text-sm opacity-90 mt-1">{wisdom.perspective}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setGeneratedStory(null)}
                  className="mt-6 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg font-semibold transition-all"
                >
                  Generate Another Story
                </button>
              </div>
            )}

            {/* Emergent Archetypes Section */}
            <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950/50 dark:via-cyan-950/50 dark:to-blue-950/50 rounded-2xl p-8 border-2 border-teal-300 dark:border-teal-700">
              <h3 className="text-2xl font-bold mb-4 text-teal-900 dark:text-teal-100">
                Or explore Contemporary Archetypes
              </h3>
              <p className="text-teal-700 dark:text-teal-300 mb-6">
                New patterns emerging in our time, responding to climate crisis, digital transformation, collective healing.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {EMERGENT_ARCHETYPES.slice(0, 3).map((archetype) => (
                  <div
                    key={archetype.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
                      {archetype.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
                      {archetype.essence}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      Emerged: {archetype.emergence.firstDetected.getFullYear()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p className="font-semibold text-teal-700 dark:text-teal-300">
            "Stories as Mirrors, Not Prescriptions"
          </p>
          <p>
            Honoring wisdom from Indigenous Americas, Africa, Oceania, Asia, Europe, and shamanic traditions worldwide
          </p>
          <p className="text-xs">
            Deep gratitude to the elders and knowledge keepers who have preserved these teachings
          </p>
        </div>

      </div>
    </div>
  );
}
