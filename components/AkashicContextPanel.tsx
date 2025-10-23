"use client";

import { useState } from "react";
import { useAkashicContext } from "@/hooks/useAkashicContext";
import { motion, AnimatePresence } from "framer-motion";

// 🜃 Field Resonance Context Panel

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#ff784e",      // ember gold
  Water: "#4fc3f7",     // glacial blue
  Earth: "#b8c58a",     // moss stone
  Air: "#c9a0dc",       // violet haze
  Aether: "#f5e6b3",    // pale light
  Unknown: "#9e9e9e",
};

interface AkashicContextPanelProps {
  userId?: string;
  onContextSelect?: (context: string) => void;
}

export default function AkashicContextPanel({
  userId,
  onContextSelect,
}: AkashicContextPanelProps) {
  const [topic, setTopic] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const { context, summary, loading, error, fetchContext, formatAsPrompt, hasContext } =
    useAkashicContext({
      userId,
      lastN: 5,
      minRelevance: 0.7,
    });

  const handleSearch = async () => {
    if (topic.trim()) {
      await fetchContext(topic);
      setIsExpanded(true);
    }
  };

  const handleUseContext = () => {
    if (onContextSelect) {
      onContextSelect(formatAsPrompt());
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-950/40 to-slate-900/70 backdrop-blur-sm rounded-xl p-6 border border-neutral-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] uppercase tracking-widest text-neutral-300">
          Field Resonance
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-neutral-400 hover:text-neutral-200 transition-colors text-xs"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {/* Search Interface */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="What patterns to sense?"
          className="flex-1 bg-black/30 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600 text-sm"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !topic.trim()}
          className="bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 px-6 py-2 rounded-lg text-sm transition-all text-neutral-200"
        >
          {loading ? "..." : "Sense"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 mb-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="bg-black/20 rounded-lg p-4 mb-4 border border-neutral-700/50">
          <p className="text-neutral-300 text-sm leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Context Items */}
      <AnimatePresence>
        {isExpanded && hasContext && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 mb-4"
          >
            {context.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-lg p-3 border border-neutral-700/70 text-sm"
                style={{
                  background:
                    "radial-gradient(circle at 40% 0%, rgba(255,255,255,0.03), transparent 70%)",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{
                        background: ELEMENT_COLORS[item.element] || "#9e9e9e",
                      }}
                    />
                    <span className="text-neutral-300">{item.element}</span>
                    <span className="text-neutral-600">·</span>
                    <span className="text-neutral-400">{item.archetype}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                    <span>{(item.relevance * 100).toFixed(0)}%</span>
                    <span>
                      {new Date(item.timestamp).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Content Preview */}
                <p className="text-neutral-200 leading-snug whitespace-pre-wrap">
                  {item.content.length > 200
                    ? item.content.substring(0, 200) + "..."
                    : item.content}
                </p>

                {/* Key Points */}
                {item.keyPoints.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-neutral-700/50">
                    <p className="text-[10px] text-neutral-500 mb-1">Key currents:</p>
                    <ul className="text-[11px] text-neutral-400 space-y-1">
                      {item.keyPoints.slice(0, 2).map((point, i) => (
                        <li key={i}>• {point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Button */}
      {hasContext && (
        <button
          onClick={handleUseContext}
          className="w-full bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg text-sm transition-all text-neutral-200"
        >
          Integrate into Session
        </button>
      )}

      {/* Empty State */}
      {!hasContext && !loading && topic && (
        <div className="text-center py-6 text-neutral-500 text-sm">
          The field is quiet around this topic.
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-6 text-neutral-400 text-sm animate-pulse">
          Listening...
        </div>
      )}
    </div>
  );
}
