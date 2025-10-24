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

const ReflectionModal = dynamic(() => import("@/components/ReflectionModal"), {
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

// Akashic Library Palette - Monochromatic + Glowing Teal
const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#FF6B6B", // Warm accent
  Water: "#00D9FF", // Glowing Teal (primary accent)
  Earth: "#88D498", // Soft green accent
  Air: "#A0E7E5", // Light cyan
  Aether: "#00CED1", // Bright turquoise
  Unknown: "#808080",
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

  // Reflection modal state
  const [reflectionModalOpen, setReflectionModalOpen] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      // Query both local insights AND field resonance in parallel
      const [localResponse, fieldResponse] = await Promise.all([
        // Local akashic query
        fetch("/api/akashic/query", {
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
        }),
        // Field resonance query
        fetch("/api/akashic/field", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            elementHint: selectedElements.length === 1 ? selectedElements[0] : undefined,
            archetypeHint: selectedArchetypes.length === 1 ? selectedArchetypes[0] : undefined,
            limit: 10,
          }),
        })
      ]);

      // Handle local results
      const localData = await localResponse.json();
      if (localResponse.ok) {
        setResults(localData.results || []);
      } else {
        console.error("Local query failed:", localData.error);
        setResults([]);
      }

      // Handle field resonance
      const fieldData = await fieldResponse.json();
      if (fieldResponse.ok && fieldData.resonance) {
        // Field service returned resonance data
        setFieldResonance({
          ...fieldData.resonance,
          patterns: fieldData.patterns || [],
          metadata: fieldData.metadata
        });
      } else {
        // No resonance data (field might be empty or unavailable)
        setFieldResonance(null);
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
    <div className="min-h-screen relative overflow-hidden text-stone-50 p-8">
      {/* Akashic Library Background - Monochromatic + Glowing Teal with Depth */}
      <div className="fixed inset-0 -z-10">
        {/* Base: Deep Monochromatic Foundation */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]" />

        {/* Depth Layer 1: Far Distance - Maximum Blur */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(0, 217, 255, 0.12) 0%, transparent 55%)',
            filter: 'blur(120px)',
          }}
        />

        {/* Depth Layer 2: Mid-Distance */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] opacity-18"
          style={{
            background: 'radial-gradient(ellipse, rgba(0, 206, 209, 0.35) 0%, rgba(0, 217, 255, 0.18) 45%, transparent 75%)',
            filter: 'blur(90px)',
          }}
        />

        {/* Depth Layer 3: Near Field */}
        <div
          className="absolute bottom-0 right-1/4 w-[600px] h-[400px] opacity-15"
          style={{
            background: 'radial-gradient(ellipse, rgba(160, 231, 229, 0.25) 0%, transparent 65%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Sparkling Aether Particles - Layer 1 (Distant, Most Blur) */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(0, 217, 255, 0.4) 0px, transparent 1px),
                             radial-gradient(circle at 60% 70%, rgba(160, 231, 229, 0.3) 0px, transparent 1px),
                             radial-gradient(circle at 80% 20%, rgba(0, 206, 209, 0.35) 0px, transparent 1px),
                             radial-gradient(circle at 40% 80%, rgba(0, 217, 255, 0.3) 0px, transparent 1px),
                             radial-gradient(circle at 90% 50%, rgba(160, 231, 229, 0.25) 0px, transparent 1px)`,
            backgroundSize: '800px 800px, 1000px 1000px, 600px 600px, 900px 900px, 700px 700px',
            filter: 'blur(2px)',
            animation: 'sparkle-drift-1 60s linear infinite',
          }}
        />

        {/* Sparkling Aether Particles - Layer 2 (Mid-Distance) */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 15% 15%, rgba(0, 217, 255, 0.5) 0px, transparent 0.5px),
                             radial-gradient(circle at 85% 85%, rgba(160, 231, 229, 0.4) 0px, transparent 0.5px),
                             radial-gradient(circle at 50% 40%, rgba(0, 206, 209, 0.45) 0px, transparent 0.5px),
                             radial-gradient(circle at 30% 70%, rgba(0, 217, 255, 0.35) 0px, transparent 0.5px)`,
            backgroundSize: '500px 500px, 700px 700px, 600px 600px, 800px 800px',
            filter: 'blur(1.5px)',
            animation: 'sparkle-drift-2 45s linear infinite',
          }}
        />

        {/* Sparkling Aether Particles - Layer 3 (Foreground, Finest) */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 50%, rgba(0, 217, 255, 0.6) 0px, transparent 0.3px),
                             radial-gradient(circle at 75% 25%, rgba(160, 231, 229, 0.5) 0px, transparent 0.3px),
                             radial-gradient(circle at 45% 90%, rgba(0, 206, 209, 0.55) 0px, transparent 0.3px),
                             radial-gradient(circle at 65% 10%, rgba(0, 217, 255, 0.45) 0px, transparent 0.3px),
                             radial-gradient(circle at 10% 60%, rgba(160, 231, 229, 0.4) 0px, transparent 0.3px)`,
            backgroundSize: '300px 300px, 400px 400px, 350px 350px, 450px 450px, 500px 500px',
            filter: 'blur(0.8px)',
            animation: 'sparkle-drift-3 30s linear infinite',
          }}
        />

        {/* Ultra-fine Shimmer Layer */}
        <div
          className="absolute inset-0 opacity-8"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0, 217, 255, 0.7) 0px, transparent 0.2px)`,
            backgroundSize: '200px 200px',
            filter: 'blur(0.5px)',
            animation: 'sparkle-shimmer 20s ease-in-out infinite',
          }}
        />

        {/* Film Grain Texture */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'4\' numOctaves=\'5\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
          }}
        />

        {/* Subtle Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%)',
          }}
        />
      </div>

      {/* Sparkle Animations */}
      <style jsx>{`
        @keyframes sparkle-drift-1 {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        @keyframes sparkle-drift-2 {
          0% { background-position: 100% 0%; }
          100% { background-position: 0% 100%; }
        }
        @keyframes sparkle-drift-3 {
          0% { background-position: 50% 50%; }
          100% { background-position: -50% -50%; }
        }
        @keyframes sparkle-shimmer {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.12; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header - Akashic Glow */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 border-b border-cyan-500/20 pb-8"
        >
          <h1 className="text-6xl font-serif mb-4 text-white tracking-wide drop-shadow-[0_0_20px_rgba(0,217,255,0.5)]">
            🜃 The Reflecting Pool
          </h1>
          <p className="text-xl text-gray-400 font-light italic">
            Memory ripples through the infinite library
          </p>
          <div className="mt-4 flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-cyan-400/60 rotate-45 shadow-[0_0_8px_rgba(0,217,255,0.6)]" />
            ))}
          </div>
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

        {/* Search Interface - Data Portal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative p-8 mb-8 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(0, 217, 255, 0.08) 50%, rgba(255, 255, 255, 0.05) 100%)',
          }}
        >
          {/* Query Input - Data Stream */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-widest font-light">
              Query the Akashic Records
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search the infinite library..."
                className="flex-1 bg-black/40 backdrop-blur-sm border-2 border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all font-light text-lg"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-50 border-2 border-cyan-500/60 rounded-xl px-10 py-4 font-serif uppercase tracking-wider text-sm text-white transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
              >
                {loading ? "Accessing..." : "Search"}
              </button>
            </div>
          </div>

          {/* Mode Selection - Search Methods */}
          <div className="flex gap-2 mb-6 border-t border-cyan-500/10 pt-4">
            <span className="text-xs text-gray-500 uppercase tracking-widest mr-3 self-center">Search Mode:</span>
            {(["semantic", "keyword", "hybrid"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 border rounded-lg capitalize transition-all text-xs uppercase tracking-wider ${
                  mode === m
                    ? "bg-cyan-500/30 text-cyan-200 border-cyan-500/60 shadow-lg shadow-cyan-500/20"
                    : "bg-black/20 backdrop-blur-sm text-gray-400 border-gray-700 hover:border-cyan-500/40 hover:text-cyan-300"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Filters - Elemental & Archetypal Lenses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Element Filters */}
            <div>
              <label className="block text-xs text-gray-500 mb-3 uppercase tracking-widest font-light">
                Element Filter
              </label>
              <div className="flex flex-wrap gap-2">
                {ELEMENTS.map((element) => (
                  <button
                    key={element}
                    onClick={() => toggleElement(element)}
                    className={`px-3 py-1.5 text-sm font-light transition-all border rounded-lg ${
                      selectedElements.includes(element)
                        ? "text-white border-current shadow-lg shadow-current/50"
                        : "bg-black/20 backdrop-blur-sm text-gray-400 border-gray-700 hover:border-gray-600"
                    }`}
                    style={{
                      backgroundColor: selectedElements.includes(element)
                        ? ELEMENT_COLORS[element]
                        : undefined,
                      boxShadow: selectedElements.includes(element)
                        ? `0 0 20px ${ELEMENT_COLORS[element]}40`
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
              <label className="block text-xs text-gray-500 mb-3 uppercase tracking-widest font-light">
                Archetype Pattern
              </label>
              <div className="flex flex-wrap gap-2">
                {ARCHETYPES.map((archetype) => (
                  <button
                    key={archetype}
                    onClick={() => toggleArchetype(archetype)}
                    className={`px-3 py-1.5 text-sm font-light transition-all border rounded-lg ${
                      selectedArchetypes.includes(archetype)
                        ? "bg-cyan-500/30 text-cyan-200 border-cyan-500/60 shadow-lg shadow-cyan-500/30"
                        : "bg-black/20 backdrop-blur-sm text-gray-400 border-gray-700 hover:border-cyan-500/40"
                    }`}
                  >
                    {ARCHETYPE_SYMBOLS[archetype]} {archetype}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Relevance Slider - Data Threshold */}
          <div className="mt-6 border-t border-cyan-500/10 pt-4">
            <label className="block text-xs text-gray-500 mb-3 uppercase tracking-widest font-light">
              Relevance Threshold: <span className="text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(0,217,255,0.5)]">{(minRelevance * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={minRelevance}
              onChange={(e) => setMinRelevance(parseFloat(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
        </motion.div>

        {/* Field Resonance - The Waters Ripple */}
        <AnimatePresence>
          {fieldResonance && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-serif mb-6 text-cyan-200 border-b border-cyan-500/30 pb-4 drop-shadow-[0_0_15px_rgba(0,217,255,0.3)]">
                The Pool Reflects
              </h2>
              <ResonanceDisplay
                resonance={fieldResonance}
                onReflect={() => setReflectionModalOpen(true)}
                mode="both"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Personal Records - Local Insights */}
        {/* Results - Reflections from the Pool */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-serif mb-6 text-cyan-200 border-b border-cyan-500/30 pb-3 drop-shadow-[0_0_15px_rgba(0,217,255,0.3)]">
                {results.length} {results.length === 1 ? 'Memory' : 'Memories'} Surfaced
              </h2>

              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="backdrop-blur-xl p-8 border border-cyan-500/30 hover:border-cyan-400/60 transition-all shadow-2xl shadow-cyan-500/10 rounded-2xl hover:shadow-cyan-500/20"
                  style={{
                    background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.85) 0%, rgba(30, 30, 30, 0.9) 50%, rgba(20, 20, 20, 0.85) 100%)',
                  }}
                >
                  {/* Header - Elemental Seal */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-cyan-500/20">
                    <div className="flex items-center gap-4">
                      <span
                        className="px-4 py-1.5 text-sm font-light border-2 rounded-lg shadow-lg"
                        style={{
                          backgroundColor: ELEMENT_COLORS[result.element] + "30" || "#00D9FF30",
                          borderColor: ELEMENT_COLORS[result.element] || "#00D9FF",
                          color: "#FFFFFF",
                          boxShadow: `0 0 15px ${ELEMENT_COLORS[result.element]}40`,
                        }}
                      >
                        {result.element}
                      </span>
                      <span className="text-2xl text-cyan-300">
                        {ARCHETYPE_SYMBOLS[result.archetype] || "◯"}
                      </span>
                      <span className="text-sm text-gray-400 font-light">
                        {result.archetype}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-xs uppercase tracking-widest">
                      <div className="text-gray-400">
                        Clarity: <span className="text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(0,217,255,0.5)]">{(result.relevance * 100).toFixed(0)}%</span>
                      </div>
                      <div className="text-gray-500">
                        {formatTimestamp(result.timestamp)}
                      </div>
                    </div>
                  </div>

                  {/* Content - The Teaching */}
                  <p className="text-gray-200 leading-relaxed mb-4 font-light text-lg">
                    {result.content}
                  </p>

                  {/* Context - Surrounding Waters */}
                  {result.context && result.context !== result.content && (
                    <div className="mt-4 pt-4 border-t border-cyan-500/20">
                      <p className="text-sm text-gray-400/90 italic font-light">
                        {result.context}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State - The Pool Holds No Reflection */}
        {!loading && results.length === 0 && query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 border-2 border-dashed border-cyan-500/30 bg-black/40 backdrop-blur-xl rounded-2xl"
          >
            <p className="text-2xl text-gray-200 mb-2 font-serif">The waters hold no memory of this</p>
            <p className="text-gray-400 font-light">
              Refine your lenses, or speak with different words
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-cyan-400/50 rounded-full shadow-[0_0_8px_rgba(0,217,255,0.6)]" />
              ))}
            </div>
          </motion.div>
        )}

        {/* Initial State - The Pool Awaits */}
        {!query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 space-y-6"
          >
            <p className="text-2xl text-gray-200 mb-6 font-serif italic drop-shadow-[0_0_15px_rgba(0,217,255,0.2)]">
              The pool awaits your question...
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                "Where in my life is Fire asking to be seen?",
                "What patterns does Shadow want me to notice?",
                "How do I integrate the elements into coherence?",
              ].map((exampleQuery) => (
                <button
                  key={exampleQuery}
                  onClick={() => setQuery(exampleQuery)}
                  className="bg-black/40 hover:bg-black/60 backdrop-blur-sm border-2 border-cyan-500/30 hover:border-cyan-400/60 p-6 text-sm text-gray-300 hover:text-white transition-all font-light rounded-xl hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  {exampleQuery}
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-center gap-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-cyan-400/60 rotate-45 shadow-[0_0_6px_rgba(0,217,255,0.5)]" />
              ))}
            </div>
          </motion.div>
        )}

        {/* Reflection Modal */}
        <ReflectionModal
          isOpen={reflectionModalOpen}
          onClose={() => setReflectionModalOpen(false)}
          resonance={fieldResonance}
          query={query}
        />
      </div>
    </div>
  );
}
