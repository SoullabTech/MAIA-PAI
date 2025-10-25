'use client';

/**
 * ARCHETYPAL LIBRARY - Interactive Explorer
 *
 * Browse and explore the When Light / When Dark / Go Deeper framework
 * for all elements and zodiac signs
 */

import React, { useState } from 'react';
import {
  ArchetypalExpressionCard,
  ArchetypalExpressionCompact,
  ArchetypalExpressionGrid
} from '@/components/archetypal/ArchetypalExpressionCard';
import { SpiralogicElement } from '@/lib/astrology/spiralogicMapping';
import {
  processArchetypalConversation,
  EXAMPLE_FIRE_DARK,
  EXAMPLE_WATER_LIGHT,
  EXAMPLE_EARTH_TRANSITION,
  EXAMPLE_AIR_LIGHT,
  EXAMPLE_AETHER_DARK
} from '@/lib/oracle/ArchetypalConversationEngine';

const ELEMENTS: SpiralogicElement[] = ['fire', 'water', 'earth', 'air', 'aether'];

const ZODIAC_SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

const EXAMPLE_MESSAGES = [
  {
    label: 'Fire Burnout',
    message: EXAMPLE_FIRE_DARK.userMessage,
    element: 'fire' as SpiralogicElement
  },
  {
    label: 'Water Shadow Work',
    message: EXAMPLE_WATER_LIGHT.userMessage,
    element: 'water' as SpiralogicElement
  },
  {
    label: 'Earth Building',
    message: EXAMPLE_EARTH_TRANSITION.userMessage,
    element: 'earth' as SpiralogicElement
  },
  {
    label: 'Air Teaching',
    message: EXAMPLE_AIR_LIGHT.userMessage,
    element: 'air' as SpiralogicElement
  },
  {
    label: 'Aether Bypassing',
    message: EXAMPLE_AETHER_DARK.userMessage,
    element: 'aether' as SpiralogicElement
  }
];

export default function ArchetypalLibraryPage() {
  const [viewMode, setViewMode] = useState<'elements' | 'zodiac' | 'interactive'>('elements');
  const [selectedElement, setSelectedElement] = useState<SpiralogicElement>('fire');
  const [selectedZodiac, setSelectedZodiac] = useState('aries');
  const [userMessage, setUserMessage] = useState('');
  const [detectionResult, setDetectionResult] = useState<any>(null);

  const handleDetection = () => {
    if (!userMessage.trim()) return;
    const result = processArchetypalConversation(userMessage);
    setDetectionResult(result);
  };

  const loadExample = (example: typeof EXAMPLE_MESSAGES[0]) => {
    setUserMessage(example.message);
    setViewMode('interactive');
    setTimeout(() => {
      const result = processArchetypalConversation(example.message);
      setDetectionResult(result);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950 dark:via-pink-950 dark:to-orange-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Archetypal Library
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Explore the When Light / When Dark / Go Deeper framework for elemental archetypes
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Inspired by Carolyn Myss, James Hillman, Richard Tarnas, Carl Jung, and Marie-Louise von Franz
          </p>
        </div>

        {/* View Mode Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setViewMode('elements')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              viewMode === 'elements'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
            }`}
          >
            🔥 Elements
          </button>
          <button
            onClick={() => setViewMode('zodiac')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              viewMode === 'zodiac'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
            }`}
          >
            ♈ Zodiac
          </button>
          <button
            onClick={() => setViewMode('interactive')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              viewMode === 'interactive'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
            }`}
          >
            🤖 Interactive
          </button>
        </div>

        {/* ELEMENTS VIEW */}
        {viewMode === 'elements' && (
          <div>
            {/* Element Selector */}
            <div className="flex justify-center gap-3 mb-8 flex-wrap">
              {ELEMENTS.map((element) => (
                <button
                  key={element}
                  onClick={() => setSelectedElement(element)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedElement === element
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                  }`}
                >
                  {element.charAt(0).toUpperCase() + element.slice(1)}
                </button>
              ))}
            </div>

            {/* Element Card */}
            <div className="max-w-4xl mx-auto">
              <ArchetypalExpressionCard element={selectedElement} />
            </div>
          </div>
        )}

        {/* ZODIAC VIEW */}
        {viewMode === 'zodiac' && (
          <div>
            {/* Zodiac Selector */}
            <div className="flex justify-center gap-2 mb-8 flex-wrap max-w-4xl mx-auto">
              {ZODIAC_SIGNS.map((sign) => (
                <button
                  key={sign}
                  onClick={() => setSelectedZodiac(sign)}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all text-sm ${
                    selectedZodiac === sign
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                  }`}
                >
                  {sign.charAt(0).toUpperCase() + sign.slice(1)}
                </button>
              ))}
            </div>

            {/* Zodiac Card */}
            <div className="max-w-4xl mx-auto">
              <ArchetypalExpressionCard zodiacSign={selectedZodiac} />
            </div>
          </div>
        )}

        {/* INTERACTIVE VIEW */}
        {viewMode === 'interactive' && (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Example Messages */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
                Try Example Messages
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {EXAMPLE_MESSAGES.map((example) => (
                  <button
                    key={example.label}
                    onClick={() => loadExample(example)}
                    className="px-4 py-3 rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-500"
                  >
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {example.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
                Test Archetypal Detection
              </h3>
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Share what's happening for you... (e.g., 'I'm feeling burned out and scattered' or 'I've been doing deep shadow work')"
                className="w-full h-32 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
              />
              <button
                onClick={handleDetection}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Detect Archetype
              </button>
            </div>

            {/* Detection Results */}
            {detectionResult && detectionResult.detections.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  Detection Results
                </h3>

                {/* Detected Archetypes */}
                <div className="grid gap-4">
                  {detectionResult.detections.map((detection: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                          {detection.element.charAt(0).toUpperCase() + detection.element.slice(1)} - {detection.state.toUpperCase()}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                              style={{ width: `${detection.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            {Math.round(detection.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* MAIA Response */}
                {detectionResult.formattedResponse && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl p-6 shadow-lg border-2 border-purple-200 dark:border-purple-800">
                    <h4 className="font-bold text-lg mb-4 text-purple-900 dark:text-purple-200">
                      MAIA's Response
                    </h4>
                    <div className="prose dark:prose-invert max-w-none whitespace-pre-line text-gray-800 dark:text-gray-200">
                      {detectionResult.formattedResponse}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Part of the Soullab Genesis system - Archetypal intelligence for personal transformation
          </p>
        </div>
      </div>
    </div>
  );
}
