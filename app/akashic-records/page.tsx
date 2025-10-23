"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// 🜃 Akashic Records Explorer — Living Memory Interface

// Dynamic import to avoid SSR issues with animation
const FieldResonance = dynamic(() => import("@/components/FieldResonance"), {
  ssr: false,
});

const ResonanceDisplay = dynamic(() => import("@/components/ResonanceDisplay"), {
  ssr: false,
});

const ELEMENTS = ["Fire", "Water", "Earth", "Air", "Aether"];
const ARCHETYPES = [
  "MainOracle",
  "Shadow",
  "InnerGuide",
  "Dream",
  "Mentor",
  "Relationship",
  "Alchemist",
];

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#FF6B35",
  Water: "#4ECDC4",
  Earth: "#8B7355",
  Air: "#FFE66D",
  Aether: "#A06CD5",
  Unknown: "#9CA3AF",
};

const ARCHETYPE_SYMBOLS: Record<string, string> = {
  MainOracle: "🜃",
  Shadow: "🜚",
  InnerGuide: "🜄",
  Dream: "🜁",
  Mentor: "🜅",
  Relationship: "🜋",
  Alchemist: "🜔",
  Unknown: "◯",
};

interface QueryResult {
  id: string;
  type: "insight" | "session";
  content: string;
  element: string;
  archetype: string;
  relevance: number;
  timestamp: string;
  context?: string;
}

export default function AkashicRecordsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QueryResult[]>([]);
  const [fieldResonance, setFieldResonance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"semantic" | "keyword" | "hybrid">("hybrid");

  // Filters
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>([]);
  const [minRelevance, setMinRelevance] = useState(0.5);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/akashic/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          mode,
          filters: {
            elements: selectedElements.length > 0 ? selectedElements : undefined,
            archetypes: selectedArchetypes.length > 0 ? selectedArchetypes : undefined,
            minRelevance,
          },
          limit: 20,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results || []);
      } else {
        console.error("Query failed:", data.error);
      }
    } catch (error) {
      console.error("Query error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleElement = (element: string) => {
    setSelectedElements((prev) =>
      prev.includes(element)
        ? prev.filter((e) => e !== element)
        : [...prev, element]
    );
  };

  const toggleArchetype = (archetype: string) => {
    setSelectedArchetypes((prev) =>
      prev.includes(archetype)
        ? prev.filter((a) => a !== archetype)
        : [...prev, archetype]
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            🜃 Akashic Records
          </h1>
          <p className="text-xl text-purple-300">
            The living memory of Soullab&apos;s collective wisdom
          </p>
        </motion.div>

        {/* Field Resonance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <FieldResonance refreshInterval={60000} breathe={true} showLegend={true} />
        </motion.div>

        {/* Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-purple-500/20"
        >
          {/* Query Input */}
          <div className="mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Ask the Akashic Records... (e.g., 'What did I learn about authentication?')"
                className="flex-1 bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 px-8 py-3 rounded-lg font-semibold transition-all"
              >
                {loading ? "Searching..." : "Query"}
              </button>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="flex gap-2 mb-6">
            {(["semantic", "keyword", "hybrid"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg capitalize transition-all ${
                  mode === m
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-purple-300 hover:bg-white/10"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Element Filters */}
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Elements
              </label>
              <div className="flex flex-wrap gap-2">
                {ELEMENTS.map((element) => (
                  <button
                    key={element}
                    onClick={() => toggleElement(element)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedElements.includes(element)
                        ? "text-white"
                        : "bg-white/5 text-purple-300 hover:bg-white/10"
                    }`}
                    style={{
                      backgroundColor: selectedElements.includes(element)
                        ? ELEMENT_COLORS[element]
                        : undefined,
                    }}
                  >
                    {element}
                  </button>
                ))}
              </div>
            </div>

            {/* Archetype Filters */}
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Archetypes
              </label>
              <div className="flex flex-wrap gap-2">
                {ARCHETYPES.map((archetype) => (
                  <button
                    key={archetype}
                    onClick={() => toggleArchetype(archetype)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedArchetypes.includes(archetype)
                        ? "bg-purple-600 text-white"
                        : "bg-white/5 text-purple-300 hover:bg-white/10"
                    }`}
                  >
                    {ARCHETYPE_SYMBOLS[archetype]} {archetype}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Relevance Slider */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Minimum Relevance: {(minRelevance * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={minRelevance}
              onChange={(e) => setMinRelevance(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </motion.div>

        {/* Field Resonance - Collective Echo */}
        <AnimatePresence>
          {fieldResonance && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-light mb-6 text-purple-200">
                The Field Speaks
              </h2>
              <ResonanceDisplay
                resonance={fieldResonance}
                onReflect={() => {
                  // Future: Open journal/reflection interface
                  console.log("Reflection triggered");
                }}
                mode="both"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Personal Records - Local Insights */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                Found {results.length} records
              </h2>

              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: ELEMENT_COLORS[result.element] || "#9CA3AF",
                          color: "white",
                        }}
                      >
                        {result.element}
                      </span>
                      <span className="text-2xl">
                        {ARCHETYPE_SYMBOLS[result.archetype] || "◯"}
                      </span>
                      <span className="text-sm text-purple-300">
                        {result.archetype}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-sm text-purple-300">
                        Relevance: {(result.relevance * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-purple-400">
                        {formatTimestamp(result.timestamp)}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-white/90 leading-relaxed mb-3">
                    {result.content}
                  </p>

                  {/* Context */}
                  {result.context && result.context !== result.content && (
                    <div className="mt-3 pt-3 border-t border-purple-500/20">
                      <p className="text-sm text-purple-300 italic">
                        Context: {result.context}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && results.length === 0 && query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-2xl text-purple-400 mb-2">No records found</p>
            <p className="text-purple-300">
              Try adjusting your filters or search query
            </p>
          </motion.div>
        )}

        {/* Initial State */}
        {!query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 space-y-4"
          >
            <p className="text-2xl text-purple-400 mb-6">
              The records await your inquiry...
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                "What did I learn about authentication last month?",
                "Show me all Fire insights about transformation",
                "Find Shadow work breakthroughs",
              ].map((exampleQuery) => (
                <button
                  key={exampleQuery}
                  onClick={() => setQuery(exampleQuery)}
                  className="bg-white/5 hover:bg-white/10 border border-purple-500/20 rounded-lg p-4 text-sm text-purple-300 transition-all"
                >
                  {exampleQuery}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
