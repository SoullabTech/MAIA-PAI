// components/patterns/InterfaceNudge.tsx
// 🌀 Interface Design Nudge — Gentle guidance when users design practices
// "You're not just talking—you're designing an interface for patterns to land"

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ElementType = "fire" | "water" | "earth" | "air" | "aether";

export interface InterfaceNudgeProps {
  element?: ElementType;
  facetName?: string;        // e.g., "Vision", "Healing", "Ground"
  suggestion?: string;        // Custom suggestion
  explicitMode?: boolean;     // Show scientific language (default: implicit)
  dismissible?: boolean;      // Can user dismiss this nudge?
}

// Elemental symbols and colors
const elementalTheme = {
  fire: {
    symbol: "🜃",
    color: "from-orange-500 to-red-500",
    bg: "bg-orange-500/5",
    border: "border-orange-500/20",
    glow: "shadow-orange-500/20"
  },
  water: {
    symbol: "🜂",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/5",
    border: "border-blue-500/20",
    glow: "shadow-blue-500/20"
  },
  earth: {
    symbol: "🜄",
    color: "from-green-500 to-emerald-500",
    bg: "bg-green-500/5",
    border: "border-green-500/20",
    glow: "shadow-green-500/20"
  },
  air: {
    symbol: "🜁",
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-500/5",
    border: "border-purple-500/20",
    glow: "shadow-purple-500/20"
  },
  aether: {
    symbol: "🜀",
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-500/5",
    border: "border-violet-500/20",
    glow: "shadow-violet-500/20"
  }
};

// Natural suggestions by element (implicit mode)
const elementalSuggestions = {
  fire: {
    natural: "Notice the spark. What wants to be born?",
    scientific: "You're designing a selection interface. Exploration protocols amplify novelty discovery.",
    practices: [
      "Try: Notice what energizes you. Follow that thread.",
      "Ask: What would I choose if I trusted myself completely?",
      "Practice: 5 minutes of movement to clarify the direction."
    ]
  },
  water: {
    natural: "Feel what's here. Let it move through you.",
    scientific: "You're tuning to valence signals. Attractor basins widen through embodied sensing.",
    practices: [
      "Try: Place a hand on your heart. What does it want to say?",
      "Ask: Where do I feel this in my body?",
      "Practice: Write without editing for 3 minutes. Let it flow."
    ]
  },
  earth: {
    natural: "Ground this. Make it real.",
    scientific: "You're building an embodiment interface. Repeatable structures allow pattern stabilization.",
    practices: [
      "Try: Choose one tiny step you can take today.",
      "Ask: What would make this sustainable?",
      "Practice: 60 seconds of breath. Feet on floor. Notice gravity."
    ]
  },
  air: {
    natural: "Name it clearly. See the pattern.",
    scientific: "You're formalizing invariants. Explicit schemas enable coherent transmission.",
    practices: [
      "Try: Describe this in one sentence. Then simpler.",
      "Ask: What's the core truth here?",
      "Practice: Mind-map this for 5 minutes. Let connections reveal themselves."
    ]
  },
  aether: {
    natural: "Trust the field. The pattern knows.",
    scientific: "You're accessing the pattern library directly. High-coherence states enable ingression.",
    practices: [
      "Try: Sit in silence for 3 minutes. Just listen.",
      "Ask: What wants to emerge through me?",
      "Practice: Trust the first thing that comes. Don't second-guess."
    ]
  }
};

export const InterfaceNudge: React.FC<InterfaceNudgeProps> = ({
  element = "aether",
  facetName,
  suggestion,
  explicitMode = false,
  dismissible = true
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (isDismissed) return null;

  const theme = elementalTheme[element];
  const suggestions = elementalSuggestions[element];
  const displaySuggestion = suggestion || (explicitMode ? suggestions.scientific : suggestions.natural);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`mt-3 rounded-lg ${theme.bg} ${theme.border} border ${theme.glow} shadow-lg overflow-hidden`}
      >
        {/* Main nudge */}
        <div className="px-4 py-3 flex items-start gap-3">
          {/* Element symbol */}
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.color} flex items-center justify-center text-white text-sm`}>
              {theme.symbol}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                {facetName && (
                  <div className="text-xs text-gray-400 mb-1">
                    {explicitMode ? "Interface Design Detected" : "You're crafting something"} • {facetName}
                  </div>
                )}
                <p className="text-sm text-gray-200 leading-relaxed">
                  {displaySuggestion}
                </p>
              </div>

              {/* Dismiss button */}
              {dismissible && (
                <button
                  onClick={() => setIsDismissed(true)}
                  className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label="Dismiss"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Expand for practices */}
            {!explicitMode && suggestions.practices && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-xs text-gray-400 hover:text-gray-300 transition-colors flex items-center gap-1"
              >
                <span>{isExpanded ? "Hide" : "Show"} practices</span>
                <svg
                  className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Expanded practices */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-700/50"
            >
              <div className="px-4 py-3 space-y-2">
                {suggestions.practices.map((practice, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-2 text-xs"
                  >
                    <div className={`mt-1 w-1 h-1 rounded-full bg-gradient-to-br ${theme.color} flex-shrink-0`} />
                    <p className="text-gray-300 leading-relaxed">{practice}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle pulse on border */}
        <motion.div
          className={`absolute inset-0 rounded-lg ${theme.border} border pointer-events-none`}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};
