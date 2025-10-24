"use client";

import { motion } from "framer-motion";
import { useState } from "react";

/**
 * ResonanceDisplay - The Bene Gesserit Reflecting Pool
 *
 * Design philosophy:
 * - Ancient ritual tablets carved in sandstone
 * - Symbolic text PRIMARY (recognition, feeling)
 * - Visual gauge SECONDARY (sensory confirmation)
 * - Analytic details TERTIARY (understanding, optional)
 *
 * The first thing a seeker sees is poetry, not numbers.
 * Recognition before measurement. Desert mysticism over data.
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

        <div className="bg-gradient-to-b from-stone-600/60 to-amber-700/30 backdrop-blur-lg p-8 border-2 border-amber-500/40 relative overflow-hidden shadow-2xl">
          {/* Ancient ritual glow effect */}
          <div
            className="absolute inset-0 opacity-15 blur-3xl"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${color}, transparent)`,
              opacity: glowIntensity * 0.4
            }}
          />

          {/* Geometric ritual accent */}
          <div className="absolute top-4 left-4 flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-amber-400/60 rotate-45" />
            ))}
          </div>

          <div className="relative z-10 space-y-6">
            {/* Opening incantation */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-serif text-stone-50 leading-relaxed drop-shadow-md"
            >
              {symbolic.opening}
            </motion.p>

            {/* Sacred reflection text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-stone-100 leading-relaxed space-y-4 font-light"
            >
              {symbolic.reflection.split('. ').map((sentence, i) => (
                <p key={i}>{sentence}{i < symbolic.reflection.split('. ').length - 1 ? '.' : ''}</p>
              ))}
            </motion.div>

            {/* Elemental seal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-4 border-t border-amber-500/40"
            >
              <p className="text-sm text-amber-200 italic font-light">
                {symbolic.elementalSignature}
              </p>
            </motion.div>

            {/* Grounding ritual */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-6 space-y-3 border-t border-amber-500/30"
            >
              <p className="text-stone-50 font-serif text-lg drop-shadow-sm">
                {symbolic.groundingPrompt}
              </p>

              {onReflect && (
                <button
                  onClick={onReflect}
                  className="w-full bg-gradient-to-b from-amber-600/90 to-amber-700/95 hover:from-amber-500 hover:to-amber-600 border-2 border-amber-400/60 text-white px-6 py-3 font-serif uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-amber-600/50"
                >
                  Record This Reflection
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* SECONDARY: Analytic Tablet (Right/Bottom) - Sacred Measurements */}
      {showAnalytics && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-b from-amber-700/50 to-stone-700/70 backdrop-blur-lg p-8 border-2 border-amber-500/40 space-y-6 shadow-2xl"
        >
          {/* FRI - The Resonance Number */}
          <div className="text-center space-y-2 border-b border-amber-400/40 pb-6">
            <div className="text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 drop-shadow-lg">
              {resonance.FRI.toFixed(2)}
            </div>
            <div className="text-amber-200 text-xs uppercase tracking-[0.3em] font-light">
              {formatInterpretation(resonance.interpretation)}
            </div>
            {/* Geometric divider */}
            <div className="flex justify-center gap-1 pt-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-amber-400/60 rotate-45" />
              ))}
            </div>
          </div>

          {/* Components - Sacred Measurements */}
          <div className="space-y-4">
            <h3 className="text-amber-100 font-serif text-sm uppercase tracking-[0.2em] border-b border-amber-400/30 pb-2">
              Components
            </h3>
            {Object.entries(resonance.components).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-100 capitalize font-light tracking-wide">{key}</span>
                  <span className="text-amber-300 font-light">{(value * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1 bg-stone-800/70 border border-amber-500/40 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value * 100}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-amber-500/90 to-amber-400/95"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pattern Clusters - Archetypal Seals */}
          <div className="space-y-4 border-t border-amber-400/40 pt-6">
            <h3 className="text-amber-100 font-serif text-sm uppercase tracking-[0.2em] border-b border-amber-400/30 pb-2">
              Pattern Clusters
            </h3>
            {resonance.patterns.slice(0, 3).map((pattern, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="bg-stone-700/50 border border-amber-400/40 p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-stone-50 font-light">
                    {pattern.element} / {pattern.archetype}
                  </span>
                  <span className="text-sm text-amber-300 font-light">
                    {(pattern.avgSimilarity * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-stone-200 font-light">
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
 * Sacred resonance gauge - ritual measurement, ambient presence
 */
function ResonanceGauge({ value, size = 100, color }: { value: number; size?: number; color: string }) {
  const circumference = 2 * Math.PI * (size / 2 - 10);
  const strokeDashoffset = circumference - (value * circumference);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle - sandstone */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 10}
        fill="none"
        stroke="rgba(196, 137, 78, 0.2)"
        strokeWidth="6"
      />
      {/* Resonance arc - ritual seal */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 10}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      {/* Center glow - desert sun */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 4}
        fill={color}
        opacity={value * 0.4}
        className="blur-md"
      />
    </svg>
  );
}

/**
 * Get color based on interpretation level - Illuminated Desert Palette
 */
function getInterpretationColor(interpretation: string): string {
  const colors = {
    'background_echo': '#B8956A',      // Sunlit sandstone
    'thematic_resonance': '#F59E42',   // Radiant amber
    'archetypal_activation': '#E5D4B8', // Luminous silk
    'collective_synchrony': '#FBBF24'   // Golden sun
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
