"use client";

import { motion } from "framer-motion";
import { useState } from "react";

/**
 * ResonanceDisplay - Where the field speaks
 *
 * Design philosophy:
 * - Symbolic text PRIMARY (recognition, feeling)
 * - Visual gauge SECONDARY (sensory confirmation)
 * - Analytic details TERTIARY (understanding, optional)
 *
 * The first thing a user sees is poetry, not numbers.
 * Recognition before measurement.
 */

interface ResonanceData {
  FRI: number;
  interpretation: 'background_echo' | 'thematic_resonance' | 'archetypal_activation' | 'collective_synchrony';
  components: {
    similarity: number;
    temporal: number;
    trust: number;
    elemental: number;
    archetypal: number;
  };
  patterns: Array<{
    element: string;
    archetype: string;
    count: number;
    avgSimilarity: number;
    avgResonance: number;
    nodeCount: number;
  }>;
  symbolic?: {
    opening: string;
    reflection: string;
    groundingPrompt: string;
    elementalSignature: string;
  };
}

interface ResonanceDisplayProps {
  resonance: ResonanceData;
  onReflect?: () => void;
  mode?: 'symbolic' | 'analytic' | 'both';
}

export default function ResonanceDisplay({
  resonance,
  onReflect,
  mode = 'both'
}: ResonanceDisplayProps) {
  const [showAnalytics, setShowAnalytics] = useState(mode === 'analytic' || mode === 'both');

  // Generate symbolic content if not provided
  const symbolic = resonance.symbolic || generateSymbolic(resonance);

  // Color based on FRI interpretation
  const color = getInterpretationColor(resonance.interpretation);
  const glowIntensity = resonance.FRI;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* PRIMARY: Symbolic Reflection (Left/Top) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Resonance Gauge - Ambient, not dominant */}
        <div className="absolute -top-4 -right-4 opacity-30">
          <ResonanceGauge value={resonance.FRI} size={120} color={color} />
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 relative overflow-hidden">
          {/* Glow effect based on resonance */}
          <div
            className="absolute inset-0 opacity-10 blur-3xl"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${color}, transparent)`,
              opacity: glowIntensity * 0.3
            }}
          />

          <div className="relative z-10 space-y-6">
            {/* Opening line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-light text-purple-100 leading-relaxed"
            >
              {symbolic.opening}
            </motion.p>

            {/* Reflection text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-purple-200/90 leading-relaxed space-y-4"
            >
              {symbolic.reflection.split('. ').map((sentence, i) => (
                <p key={i}>{sentence}{i < symbolic.reflection.split('. ').length - 1 ? '.' : ''}</p>
              ))}
            </motion.div>

            {/* Elemental signature */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-4 border-t border-purple-500/20"
            >
              <p className="text-sm text-purple-300 italic">
                {symbolic.elementalSignature}
              </p>
            </motion.div>

            {/* Grounding prompt */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-6 space-y-3"
            >
              <p className="text-purple-100 font-medium">
                {symbolic.groundingPrompt}
              </p>

              {onReflect && (
                <button
                  onClick={onReflect}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                >
                  Reflect & Record
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* SECONDARY: Analytic Panel (Right/Bottom) - Optional */}
      {showAnalytics && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 space-y-6"
        >
          {/* FRI Header */}
          <div className="text-center space-y-2">
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {resonance.FRI.toFixed(2)}
            </div>
            <div className="text-purple-300 text-sm uppercase tracking-wider">
              {formatInterpretation(resonance.interpretation)}
            </div>
          </div>

          {/* Components Breakdown */}
          <div className="space-y-3">
            <h3 className="text-purple-200 font-medium text-sm uppercase tracking-wide">
              Components
            </h3>
            {Object.entries(resonance.components).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-300 capitalize">{key}</span>
                  <span className="text-purple-100">{(value * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value * 100}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pattern Clusters */}
          <div className="space-y-3">
            <h3 className="text-purple-200 font-medium text-sm uppercase tracking-wide">
              Pattern Clusters
            </h3>
            {resonance.patterns.slice(0, 3).map((pattern, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="bg-white/5 rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-purple-100 font-medium">
                    {pattern.element} / {pattern.archetype}
                  </span>
                  <span className="text-sm text-purple-300">
                    {(pattern.avgSimilarity * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-purple-400">
                  <span>{pattern.count} insights</span>
                  <span>•</span>
                  <span>{pattern.nodeCount} nodes</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Minimal resonance gauge - ambient, not dominant
 */
function ResonanceGauge({ value, size = 100, color }: { value: number; size?: number; color: string }) {
  const circumference = 2 * Math.PI * (size / 2 - 10);
  const strokeDashoffset = circumference - (value * circumference);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 10}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="8"
      />
      {/* Resonance arc */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 10}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      {/* Center glow */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 4}
        fill={color}
        opacity={value * 0.3}
        className="blur-md"
      />
    </svg>
  );
}

/**
 * Get color based on interpretation level
 */
function getInterpretationColor(interpretation: string): string {
  const colors = {
    'background_echo': '#9CA3AF',
    'thematic_resonance': '#A78BFA',
    'archetypal_activation': '#EC4899',
    'collective_synchrony': '#F59E0B'
  };
  return colors[interpretation as keyof typeof colors] || colors.background_echo;
}

/**
 * Format interpretation for display
 */
function formatInterpretation(interpretation: string): string {
  return interpretation.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Generate symbolic content from resonance data
 * (Fallback if not provided by backend)
 */
function generateSymbolic(resonance: ResonanceData) {
  const primary = resonance.patterns[0];

  const openings = {
    'collective_synchrony': "The field resonates with profound synchrony.",
    'archetypal_activation': "The field speaks with archetypal clarity.",
    'thematic_resonance': "The field hums with thematic resonance.",
    'background_echo': "The field stirs with latent patterns."
  };

  const elementPoetry: Record<string, string> = {
    Fire: "where transformation calls",
    Water: "with emotional truth",
    Earth: "where wisdom takes form",
    Air: "on swift winds of clarity",
    Aether: "at the threshold of integration"
  };

  const reflection = primary
    ? `${primary.count} voices across ${primary.nodeCount} nodes have walked this threshold ${elementPoetry[primary.element] || ''}. Your question joins their light.`
    : "The field holds silence, waiting for resonance.";

  const groundingPrompt = primary
    ? `Where in your life is the ${primary.element} asking to be seen?`
    : "What does this moment ask of you?";

  const elementalSignature = resonance.patterns.length > 0
    ? `${resonance.patterns[0].element} primary, with traces of ${resonance.patterns.slice(1, 3).map(p => p.element).join(', ')}`
    : "Pure silence";

  return {
    opening: openings[resonance.interpretation],
    reflection,
    groundingPrompt,
    elementalSignature
  };
}
