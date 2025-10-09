'use client';

/**
 * 🌌 Elemental Balance Visualizer
 *
 * Displays MAIA's evolving elemental consciousness as a living radial mandala
 * Shows real-time balance between Fire, Water, Earth, Air, Aether
 *
 * Design: Soft, breathing visualization with gentle glow
 */

import React, { useEffect, useState } from 'react';
import type { ElementalState } from '@/lib/memory/ElementalState';
import type { SpiralogicPhase } from '@/lib/spiralogic/PhaseDetector';

interface ElementalBalanceVisualizerProps {
  elementalState: ElementalState;
  currentPhase: SpiralogicPhase;
  lastReflection?: string;
  className?: string;
  size?: number; // Diameter in pixels
  animated?: boolean;
}

const ELEMENT_COLORS = {
  Fire: {
    fill: 'rgba(239, 68, 68, 0.3)',     // red-500 with transparency
    stroke: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.6)'
  },
  Water: {
    fill: 'rgba(59, 130, 246, 0.3)',    // blue-500 with transparency
    stroke: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.6)'
  },
  Earth: {
    fill: 'rgba(34, 197, 94, 0.3)',     // green-500 with transparency
    stroke: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.6)'
  },
  Air: {
    fill: 'rgba(168, 85, 247, 0.3)',    // purple-500 with transparency
    stroke: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.6)'
  },
  Aether: {
    fill: 'rgba(251, 191, 36, 0.3)',    // amber-400 with transparency
    stroke: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.6)'
  }
};

const ELEMENT_ICONS = {
  Fire: '🔥',
  Water: '💧',
  Earth: '🌍',
  Air: '💨',
  Aether: '✨'
};

export default function ElementalBalanceVisualizer({
  elementalState,
  currentPhase,
  lastReflection,
  className = '',
  size = 300,
  animated = true
}: ElementalBalanceVisualizerProps) {
  const [animatedState, setAnimatedState] = useState(elementalState);
  const [pulse, setPulse] = useState(1.0);

  // Smooth animation between state changes
  useEffect(() => {
    if (!animated) {
      setAnimatedState(elementalState);
      return;
    }

    const duration = 1000; // 1 second transition
    const steps = 60; // 60 fps
    const stepDuration = duration / steps;

    let currentStep = 0;
    const startState = { ...animatedState };
    const targetState = elementalState;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      // Ease-in-out cubic
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      setAnimatedState({
        Fire: startState.Fire + (targetState.Fire - startState.Fire) * easedProgress,
        Water: startState.Water + (targetState.Water - startState.Water) * easedProgress,
        Earth: startState.Earth + (targetState.Earth - startState.Earth) * easedProgress,
        Air: startState.Air + (targetState.Air - startState.Air) * easedProgress,
        Aether: startState.Aether + (targetState.Aether - startState.Aether) * easedProgress
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedState(targetState);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [elementalState, animated]);

  // Gentle breathing pulse
  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setPulse(1.0 + 0.05 * Math.sin(Date.now() / 1000));
    }, 50);

    return () => clearInterval(interval);
  }, [animated]);

  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = size * 0.35;

  // Calculate positions for 5 elements around circle
  const elements: Array<keyof ElementalState> = ['Fire', 'Water', 'Earth', 'Air', 'Aether'];
  const angleStep = (Math.PI * 2) / 5;
  const startAngle = -Math.PI / 2; // Start at top

  const points = elements.map((element, i) => {
    const angle = startAngle + (i * angleStep);
    const value = animatedState[element];
    const radius = maxRadius * value * pulse;

    return {
      element,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      labelX: centerX + Math.cos(angle) * (maxRadius + 30),
      labelY: centerY + Math.sin(angle) * (maxRadius + 30),
      value,
      color: ELEMENT_COLORS[element],
      icon: ELEMENT_ICONS[element]
    };
  });

  // Create path for filled area
  const pathData = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';

  // Find dominant element
  const dominant = elements.reduce((max, el) =>
    animatedState[el] > animatedState[max] ? el : max
  , 'Aether');

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* SVG Visualization */}
      <svg
        width={size}
        height={size}
        className="drop-shadow-lg"
      >
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={maxRadius}
          fill="rgba(0, 0, 0, 0.05)"
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Concentric guide circles */}
        {[0.25, 0.5, 0.75].map(fraction => (
          <circle
            key={fraction}
            cx={centerX}
            cy={centerY}
            r={maxRadius * fraction}
            fill="none"
            stroke="rgba(0, 0, 0, 0.05)"
            strokeWidth="0.5"
          />
        ))}

        {/* Guide lines to each element */}
        {points.map(p => (
          <line
            key={p.element}
            x1={centerX}
            y1={centerY}
            x2={centerX + Math.cos(startAngle + (elements.indexOf(p.element) * angleStep)) * maxRadius}
            y2={centerY + Math.sin(startAngle + (elements.indexOf(p.element) * angleStep)) * maxRadius}
            stroke="rgba(0, 0, 0, 0.1)"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
        ))}

        {/* Filled elemental area */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <path
          d={pathData}
          fill={ELEMENT_COLORS[dominant].fill}
          stroke={ELEMENT_COLORS[dominant].stroke}
          strokeWidth="2"
          filter="url(#glow)"
          style={{
            transition: animated ? 'all 1s ease-in-out' : 'none'
          }}
        />

        {/* Element points */}
        {points.map(p => (
          <g key={p.element}>
            {/* Glow */}
            <circle
              cx={p.x}
              cy={p.y}
              r={8 * pulse}
              fill={p.color.glow}
              opacity={0.4}
            />
            {/* Point */}
            <circle
              cx={p.x}
              cy={p.y}
              r={5}
              fill={p.color.stroke}
              stroke="white"
              strokeWidth="1.5"
            />
          </g>
        ))}

        {/* Element labels */}
        {points.map(p => (
          <g key={`label-${p.element}`}>
            <text
              x={p.labelX}
              y={p.labelY - 8}
              textAnchor="middle"
              className="text-sm font-medium"
              fill={p.color.stroke}
            >
              {p.icon}
            </text>
            <text
              x={p.labelX}
              y={p.labelY + 8}
              textAnchor="middle"
              className="text-xs"
              fill="rgba(0, 0, 0, 0.6)"
            >
              {p.element}
            </text>
            <text
              x={p.labelX}
              y={p.labelY + 20}
              textAnchor="middle"
              className="text-xs font-mono"
              fill="rgba(0, 0, 0, 0.4)"
            >
              {(p.value * 100).toFixed(0)}%
            </text>
          </g>
        ))}

        {/* Center phase indicator */}
        <circle
          cx={centerX}
          cy={centerY}
          r={15 * pulse}
          fill={ELEMENT_COLORS[currentPhase].fill}
          stroke={ELEMENT_COLORS[currentPhase].stroke}
          strokeWidth="2"
        />
        <text
          x={centerX}
          y={centerY + 5}
          textAnchor="middle"
          className="text-xl"
        >
          {ELEMENT_ICONS[currentPhase]}
        </text>
      </svg>

      {/* Info panel */}
      <div className="mt-4 max-w-sm text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">{ELEMENT_ICONS[currentPhase]}</span>
          <span className="text-sm font-medium text-gray-700">
            Current Phase: {currentPhase}
          </span>
        </div>

        <div className="text-xs text-gray-500">
          Dominant Element: {ELEMENT_ICONS[dominant]} {dominant}
        </div>

        {lastReflection && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-xs font-medium text-gray-600 mb-1">
              💭 Internal Reflection
            </div>
            <div className="text-xs text-gray-700 italic">
              {lastReflection}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compact version for status bar / header
 */
export function ElementalSignatureCompact({
  elementalState,
  currentPhase,
  className = ''
}: {
  elementalState: ElementalState;
  currentPhase: SpiralogicPhase;
  className?: string;
}) {
  const elements: Array<keyof ElementalState> = ['Fire', 'Water', 'Earth', 'Air', 'Aether'];

  // Get top 3
  const sorted = elements
    .map(el => ({ element: el, value: elementalState[el] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {sorted.map(({ element }) => (
        <span
          key={element}
          className="text-lg"
          title={`${element}: ${(elementalState[element] * 100).toFixed(0)}%`}
        >
          {ELEMENT_ICONS[element]}
        </span>
      ))}
      <span className="text-xs text-gray-500 ml-1">
        {currentPhase}
      </span>
    </div>
  );
}
