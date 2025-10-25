'use client';

/**
 * ARCHETYPAL EXPRESSION CARD
 *
 * Beautiful UI component to display When Light / When Dark / Go Deeper
 * Inspired by archetypal wheel aesthetics
 */

import React, { useState } from 'react';
import { SpiralogicElement } from '@/lib/astrology/spiralogicMapping';
import {
  getElementalExpression,
  getZodiacExpression,
  type ArchetypalExpression,
  type ElementalArchetype
} from '@/lib/knowledge/ArchetypalLightDarkSystem';

// ============== TYPES ==============

interface ArchetypalExpressionCardProps {
  element?: SpiralogicElement;
  zodiacSign?: string;
  variant?: 'light' | 'dark' | 'both';
  showPractices?: boolean;
  interactive?: boolean;
  className?: string;
}

type ExpressionView = 'light' | 'dark' | 'deeper';

// ============== ELEMENT COLORS ==============

const ELEMENT_COLORS: Record<SpiralogicElement, {
  light: string;
  dark: string;
  accent: string;
  gradient: string;
}> = {
  fire: {
    light: 'from-orange-400 to-red-500',
    dark: 'from-red-900 to-orange-900',
    accent: 'border-orange-500',
    gradient: 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950'
  },
  water: {
    light: 'from-blue-400 to-cyan-500',
    dark: 'from-blue-900 to-cyan-900',
    accent: 'border-blue-500',
    gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950'
  },
  earth: {
    light: 'from-green-500 to-emerald-600',
    dark: 'from-green-900 to-emerald-900',
    accent: 'border-green-600',
    gradient: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950'
  },
  air: {
    light: 'from-yellow-300 to-amber-400',
    dark: 'from-yellow-800 to-amber-900',
    accent: 'border-yellow-500',
    gradient: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950'
  },
  aether: {
    light: 'from-purple-400 to-pink-500',
    dark: 'from-purple-900 to-pink-900',
    accent: 'border-purple-500',
    gradient: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950'
  }
};

const ELEMENT_SYMBOLS: Record<SpiralogicElement, string> = {
  fire: '🔥',
  water: '💧',
  earth: '🌍',
  air: '🌬️',
  aether: '✨'
};

// ============== MAIN COMPONENT ==============

export function ArchetypalExpressionCard({
  element,
  zodiacSign,
  variant = 'both',
  showPractices = true,
  interactive = true,
  className = ''
}: ArchetypalExpressionCardProps) {
  const [activeView, setActiveView] = useState<ExpressionView>('light');

  // Get expression data
  let expression: ArchetypalExpression | undefined;
  let title: string;
  let subtitle: string;

  if (element) {
    const elementalArch = getElementalExpression(element);
    expression = elementalArch.expression;
    title = `${ELEMENT_SYMBOLS[element]} ${element.charAt(0).toUpperCase() + element.slice(1)}`;
    subtitle = elementalArch.name;
  } else if (zodiacSign) {
    expression = getZodiacExpression(zodiacSign);
    title = zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1);
    subtitle = 'Zodiac Archetype';
  }

  if (!expression) {
    return <div>No archetypal data available</div>;
  }

  const elementColor = element ? ELEMENT_COLORS[element] : ELEMENT_COLORS.aether;

  return (
    <div className={`rounded-2xl overflow-hidden shadow-xl ${elementColor.gradient} ${className}`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${elementColor.light} p-6 text-white`}>
        <h2 className="text-3xl font-bold mb-1">{title}</h2>
        <p className="text-white/90 text-sm">{subtitle}</p>
      </div>

      {/* Navigation Tabs */}
      {interactive && variant === 'both' && (
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/20">
          <button
            onClick={() => setActiveView('light')}
            className={`flex-1 py-3 px-4 text-center font-semibold transition-all ${
              activeView === 'light'
                ? `border-b-4 ${elementColor.accent} text-gray-900 dark:text-white`
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            ☀️ When Light
          </button>
          <button
            onClick={() => setActiveView('dark')}
            className={`flex-1 py-3 px-4 text-center font-semibold transition-all ${
              activeView === 'dark'
                ? `border-b-4 ${elementColor.accent} text-gray-900 dark:text-white`
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            🌑 When Dark
          </button>
          <button
            onClick={() => setActiveView('deeper')}
            className={`flex-1 py-3 px-4 text-center font-semibold transition-all ${
              activeView === 'deeper'
                ? `border-b-4 ${elementColor.accent} text-gray-900 dark:text-white`
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            🔮 Go Deeper
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {(activeView === 'light' || variant === 'light') && (
          <LightExpressionView expression={expression} elementColor={elementColor} />
        )}

        {(activeView === 'dark' || variant === 'dark') && (
          <DarkExpressionView expression={expression} elementColor={elementColor} />
        )}

        {activeView === 'deeper' && showPractices && (
          <DeeperExpressionView expression={expression} elementColor={elementColor} />
        )}
      </div>
    </div>
  );
}

// ============== SUB-COMPONENTS ==============

function LightExpressionView({
  expression,
  elementColor
}: {
  expression: ArchetypalExpression;
  elementColor: any;
}) {
  return (
    <div className="space-y-6">
      {/* Energy State */}
      <div className={`p-4 rounded-lg bg-gradient-to-r ${elementColor.light} text-white`}>
        <p className="text-lg font-semibold italic">"{expression.whenLight.energyState}"</p>
      </div>

      {/* Qualities */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-3">
          Qualities
        </h3>
        <ul className="space-y-2">
          {expression.whenLight.qualities.map((quality, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span className="text-gray-800 dark:text-gray-200">{quality}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Gifts */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-3">
          Gifts to the World
        </h3>
        <ul className="space-y-2">
          {expression.whenLight.gifts.map((gift, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-amber-500">✨</span>
              <span className="text-gray-800 dark:text-gray-200">{gift}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Manifests As */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-3">
          Manifests As
        </h3>
        <div className="grid gap-2">
          {expression.whenLight.manifestsAs.map((manifestation, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-white/70 dark:bg-black/30 border border-gray-200 dark:border-gray-700"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">{manifestation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DarkExpressionView({
  expression,
  elementColor
}: {
  expression: ArchetypalExpression;
  elementColor: any;
}) {
  return (
    <div className="space-y-6">
      {/* Warning Sign */}
      <div className={`p-4 rounded-lg bg-gradient-to-r ${elementColor.dark} text-white border-l-4 border-red-500`}>
        <p className="text-lg font-semibold">⚠️ {expression.whenDark.warningSign}</p>
      </div>

      {/* Qualities */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-3">
          Shadow Qualities
        </h3>
        <ul className="space-y-2">
          {expression.whenDark.qualities.map((quality, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-red-500 mt-1">⚠</span>
              <span className="text-gray-800 dark:text-gray-200">{quality}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Shadows */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-3">
          Shadow Patterns
        </h3>
        <ul className="space-y-2">
          {expression.whenDark.shadows.map((shadow, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-purple-500">🌑</span>
              <span className="text-gray-800 dark:text-gray-200">{shadow}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Manifests As */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-3">
          Manifests As
        </h3>
        <div className="grid gap-2">
          {expression.whenDark.manifestsAs.map((manifestation, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">{manifestation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Healing Pathway */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950 dark:to-blue-950 border border-purple-300 dark:border-purple-700">
        <h3 className="text-sm font-bold uppercase tracking-wide text-purple-800 dark:text-purple-300 mb-2">
          Healing Pathway
        </h3>
        <p className="text-purple-900 dark:text-purple-200 italic">
          {expression.goDeeper.healingPathway}
        </p>
      </div>
    </div>
  );
}

function DeeperExpressionView({
  expression,
  elementColor
}: {
  expression: ArchetypalExpression;
  elementColor: any;
}) {
  return (
    <div className="space-y-6">
      {/* Healing Pathway */}
      <div className={`p-4 rounded-lg bg-gradient-to-r ${elementColor.light} text-white`}>
        <h3 className="text-sm font-bold uppercase tracking-wide mb-2">Healing Pathway</h3>
        <p className="text-lg italic">{expression.goDeeper.healingPathway}</p>
      </div>

      {/* Reflection Questions */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
          <span>🤔</span> Reflection Questions
        </h3>
        <div className="space-y-3">
          {expression.goDeeper.reflectionQuestions.map((question, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-white/70 dark:bg-black/30 border-l-4 border-blue-500"
            >
              <p className="text-gray-800 dark:text-gray-200 italic">{question}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Practices */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
          <span>🧘</span> Integration Practices
        </h3>
        <div className="grid gap-2">
          {expression.goDeeper.integrationPractices.map((practice, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">{practice}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transformation Invitations */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
          <span>🎁</span> Transformation Invitations
        </h3>
        <div className="space-y-3">
          {expression.goDeeper.transformationInvitations.map((invitation, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800"
            >
              <p className="text-gray-800 dark:text-gray-200">{invitation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============== COMPACT VERSION ==============

export function ArchetypalExpressionCompact({
  element,
  state = 'light',
  className = ''
}: {
  element: SpiralogicElement;
  state?: 'light' | 'dark';
  className?: string;
}) {
  const elementalArch = getElementalExpression(element);
  const expression = elementalArch.expression;
  const colors = ELEMENT_COLORS[element];

  return (
    <div className={`p-4 rounded-lg ${colors.gradient} border ${colors.accent} ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-3xl">{ELEMENT_SYMBOLS[element]}</span>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 dark:text-white mb-1">
            {element.charAt(0).toUpperCase() + element.slice(1)} - {elementalArch.name}
          </h4>
          {state === 'light' && (
            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
              {expression.whenLight.energyState}
            </p>
          )}
          {state === 'dark' && (
            <p className="text-sm text-red-700 dark:text-red-300 italic">
              {expression.whenDark.warningSign}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============== GRID VIEW ==============

export function ArchetypalExpressionGrid({
  elements = ['fire', 'water', 'earth', 'air', 'aether'] as SpiralogicElement[],
  className = ''
}: {
  elements?: SpiralogicElement[];
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {elements.map((element) => (
        <ArchetypalExpressionCard key={element} element={element} interactive={false} />
      ))}
    </div>
  );
}
