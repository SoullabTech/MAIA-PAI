// components/patterns/PatternRibbon.tsx
// 🌀 Pattern Ingression Ribbon — Subtle feedback on pattern landing
// Based on Michael Levin's framework: Pattern Field → Interface → Ingression

"use client";

import React from "react";
import { motion } from "framer-motion";

export type IngressionType =
  | "AttractorLock"              // Pattern stabilizing into recurrence
  | "ValenceShift"               // Measurable stress/comfort change
  | "InvariantDetected"          // Logical constraint discovered
  | "TransferAcrossEmbodiment";  // Pattern appearing in new context

export interface PatternRibbonProps {
  ingressType?: IngressionType;
  scores?: {
    coherence?: number;      // 0-1: Pattern clarity/clustering
    robustness?: number;     // 0-1: Pattern stability
    valenceDelta?: number;   // -1 to +1: Stress to comfort shift
  };
  element?: "fire" | "water" | "earth" | "air" | "aether";
  compact?: boolean;         // Minimal display
  explicitMode?: boolean;    // Show scientific language (default: implicit)
}

// Elemental colors matching the system
const elementalColors = {
  fire: { from: "from-orange-500", to: "to-red-500", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  water: { from: "from-blue-500", to: "to-cyan-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  earth: { from: "from-green-500", to: "to-emerald-500", bg: "bg-green-500/10", border: "border-green-500/30" },
  air: { from: "from-purple-500", to: "to-pink-500", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  aether: { from: "from-violet-500", to: "to-purple-500", bg: "bg-violet-500/10", border: "border-violet-500/30" },
};

// Natural language descriptions (implicit mode)
const ingressionDescriptions = {
  AttractorLock: {
    natural: "Pattern crystallizing",
    scientific: "Attractor Stabilization",
    icon: "✨",
    description: "A recurring pattern is finding its rhythm"
  },
  ValenceShift: {
    natural: "Energy shifting",
    scientific: "Valence Transition",
    icon: "🌊",
    description: "Emotional resonance moving"
  },
  InvariantDetected: {
    natural: "Recognition emerging",
    scientific: "Invariant Pattern",
    icon: "💎",
    description: "A core truth revealing itself"
  },
  TransferAcrossEmbodiment: {
    natural: "Pattern echoing",
    scientific: "Cross-Context Transfer",
    icon: "🔄",
    description: "The same pattern appearing in new places"
  }
};

export const PatternRibbon: React.FC<PatternRibbonProps> = ({
  ingressType,
  scores = {},
  element = "aether",
  compact = false,
  explicitMode = false
}) => {
  // Don't render if no ingression detected
  if (!ingressType) return null;

  const description = ingressionDescriptions[ingressType];
  const colors = elementalColors[element];

  // Calculate overall strength from scores
  const hasScores = scores.coherence !== undefined || scores.robustness !== undefined;
  const avgScore = hasScores
    ? ((scores.coherence || 0) + (scores.robustness || 0)) / 2
    : 0.5;

  // Valence indicator
  const valenceTrend = scores.valenceDelta !== undefined
    ? scores.valenceDelta > 0.1 ? "↑" : scores.valenceDelta < -0.1 ? "↓" : "→"
    : null;

  if (compact) {
    // Minimal ribbon - just icon and type
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${colors.bg} ${colors.border} border text-xs`}
      >
        <span>{description.icon}</span>
        <span className="text-gray-300">{explicitMode ? description.scientific : description.natural}</span>
        {valenceTrend && <span className="text-gray-400">{valenceTrend}</span>}
      </motion.div>
    );
  }

  // Full ribbon with scores
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className={`mt-4 rounded-xl px-4 py-3 ${colors.bg} ${colors.border} border`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Pattern info */}
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl">{description.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-200">
                {explicitMode ? description.scientific : description.natural}
              </span>
              {!explicitMode && (
                <span className="text-xs text-gray-500 italic">
                  {description.description}
                </span>
              )}
            </div>

            {/* Scores (if available) */}
            {hasScores && (
              <div className="flex items-center gap-3 mt-2">
                {scores.coherence !== undefined && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">
                      {explicitMode ? "Coherence" : "Clarity"}
                    </span>
                    <div className="h-1.5 w-16 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${colors.from} ${colors.to}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${scores.coherence * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-mono">
                      {Math.round(scores.coherence * 100)}%
                    </span>
                  </div>
                )}

                {scores.robustness !== undefined && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">
                      {explicitMode ? "Robustness" : "Stability"}
                    </span>
                    <div className="h-1.5 w-16 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${colors.from} ${colors.to}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${scores.robustness * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-mono">
                      {Math.round(scores.robustness * 100)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Valence indicator */}
        {scores.valenceDelta !== undefined && (
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 mb-1">
              {explicitMode ? "Valence" : "Feeling"}
            </span>
            <div className="flex items-center gap-1">
              <span className={`text-2xl ${scores.valenceDelta > 0 ? 'text-green-400' : scores.valenceDelta < 0 ? 'text-orange-400' : 'text-gray-400'}`}>
                {valenceTrend}
              </span>
              {explicitMode && (
                <span className="text-xs text-gray-400 font-mono">
                  {scores.valenceDelta > 0 ? '+' : ''}{scores.valenceDelta.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subtle pulse animation for high-coherence patterns */}
      {avgScore > 0.7 && (
        <motion.div
          className={`absolute inset-0 rounded-xl bg-gradient-to-r ${colors.from} ${colors.to} opacity-0`}
          animate={{
            opacity: [0, 0.05, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );
};
