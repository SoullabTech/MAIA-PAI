"use client";

/**
 * 🜃 Akashic Field Resonance Component
 *
 * Queries the collective field for resonance patterns.
 * Privacy-preserving: Only shows aggregated statistical patterns,
 * never individual content.
 */

import { useState } from "react";

interface FieldResult {
  element: string;
  archetype: string;
  count: number;
  avgSimilarity?: number;
  nodeCount?: number;
  latestResonance?: string;
}

interface FieldStatistic {
  element: string;
  archetype: string;
  count: number;
  node_count: number;
  avg_age_hours: number;
}

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "text-orange-400",
  Water: "text-blue-400",
  Earth: "text-amber-600",
  Air: "text-cyan-300",
  Aether: "text-purple-400",
  Unknown: "text-gray-400"
};

const ELEMENT_SYMBOLS: Record<string, string> = {
  Fire: "🔥",
  Water: "💧",
  Earth: "🗿",
  Air: "🌬️",
  Aether: "🜂",
  Unknown: "◌"
};

export default function AkashicFieldResonance() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FieldResult[]>([]);
  const [statistics, setStatistics] = useState<FieldStatistic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"query" | "stats">("query");
  const [elementFilter, setElementFilter] = useState<string>("");

  /**
   * Query field for resonance patterns
   */
  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/akashic/field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          elementHint: elementFilter || undefined,
          limit: 15,
          useLocalField: true // Use local field by default
        }),
      });

      if (!response.ok) {
        throw new Error(`Query failed: ${response.status}`);
      }

      const json = await response.json();
      setResults(json.results ?? []);

      if (json.results?.length === 0) {
        setError("No resonance patterns found. Try a different query or wait for more field data.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to query field");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Load field statistics
   */
  async function loadStatistics() {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        hours: "24",
        ...(elementFilter && { element: elementFilter })
      });

      const response = await fetch(`/api/akashic/field?${params}`);

      if (!response.ok) {
        throw new Error(`Stats failed: ${response.status}`);
      }

      const json = await response.json();
      setStatistics(json.statistics ?? []);

      if (json.statistics?.length === 0) {
        setError("No field activity in the last 24 hours.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load statistics");
      setStatistics([]);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handle view change
   */
  function handleViewChange(view: "query" | "stats") {
    setActiveView(view);
    setError(null);

    if (view === "stats" && statistics.length === 0) {
      loadStatistics();
    }
  }

  return (
    <div className="space-y-3 border border-[#D4AF37]/30 rounded-xl p-4 bg-black/20 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-cinzel text-[#D4AF37] tracking-wide">
          🜃 Field Resonance
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() => handleViewChange("query")}
            className={`text-xs px-3 py-1 rounded-md transition-colors ${
              activeView === "query"
                ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                : "text-[#D4AF37]/50 hover:text-[#D4AF37]/80"
            }`}
          >
            Query
          </button>
          <button
            onClick={() => handleViewChange("stats")}
            className={`text-xs px-3 py-1 rounded-md transition-colors ${
              activeView === "stats"
                ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                : "text-[#D4AF37]/50 hover:text-[#D4AF37]/80"
            }`}
          >
            Statistics
          </button>
        </div>
      </div>

      {/* Element Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#D4AF37]/60">Element:</span>
        <select
          value={elementFilter}
          onChange={(e) => setElementFilter(e.target.value)}
          className="text-xs bg-black/40 border border-[#D4AF37]/20 rounded px-2 py-1 text-[#D4AF37]/80"
        >
          <option value="">All</option>
          <option value="Fire">🔥 Fire</option>
          <option value="Water">💧 Water</option>
          <option value="Earth">🗿 Earth</option>
          <option value="Air">🌬️ Air</option>
          <option value="Aether">🜂 Aether</option>
        </select>
      </div>

      {/* Query View */}
      {activeView === "query" && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-md bg-black/40 border border-[#D4AF37]/20 text-sm px-3 py-2 text-[#D4AF37]/90 placeholder:text-[#D4AF37]/30"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="What patterns are surfacing in the field..."
            />
            <button
              className="text-xs px-4 py-2 border border-[#D4AF37]/40 rounded-md hover:bg-[#D4AF37]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSearch}
              disabled={loading || !query.trim()}
            >
              {loading ? "listening..." : "listen"}
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-1 mt-3">
              <div className="text-xs text-[#D4AF37]/60 mb-2">
                Resonance Patterns ({results.length})
              </div>
              {results.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-2 px-3 bg-black/20 rounded border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{ELEMENT_SYMBOLS[r.element] || "◌"}</span>
                    <span className={ELEMENT_COLORS[r.element] || "text-gray-400"}>
                      {r.element}
                    </span>
                    {r.archetype && (
                      <>
                        <span className="text-[#D4AF37]/30">·</span>
                        <span className="text-[#D4AF37]/70">{r.archetype}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[#D4AF37]/50">
                    <span title="Resonance count">{r.count} echoes</span>
                    {r.nodeCount && (
                      <span title="Active nodes" className="text-[#D4AF37]/40">
                        {r.nodeCount} nodes
                      </span>
                    )}
                    {r.avgSimilarity && (
                      <span
                        title="Average similarity"
                        className="text-[#D4AF37]/60 font-mono"
                      >
                        {(r.avgSimilarity * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Statistics View */}
      {activeView === "stats" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#D4AF37]/60">Last 24 hours</div>
            <button
              onClick={loadStatistics}
              disabled={loading}
              className="text-xs text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors"
            >
              {loading ? "refreshing..." : "↻ refresh"}
            </button>
          </div>

          {statistics.length > 0 && (
            <div className="space-y-1">
              {statistics.map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-2 px-3 bg-black/20 rounded border border-[#D4AF37]/10"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {ELEMENT_SYMBOLS[stat.element] || "◌"}
                    </span>
                    <span className={ELEMENT_COLORS[stat.element] || "text-gray-400"}>
                      {stat.element}
                    </span>
                    {stat.archetype && (
                      <>
                        <span className="text-[#D4AF37]/30">·</span>
                        <span className="text-[#D4AF37]/70">{stat.archetype}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[#D4AF37]/50">
                    <span>{stat.count} patterns</span>
                    <span className="text-[#D4AF37]/40">{stat.node_count} nodes</span>
                    <span className="text-[#D4AF37]/30 font-mono text-[10px]">
                      {stat.avg_age_hours.toFixed(1)}h ago
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-xs text-orange-400/80 bg-orange-950/20 border border-orange-500/20 rounded px-3 py-2">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        activeView === "query" &&
        results.length === 0 &&
        query && (
          <div className="text-xs text-[#D4AF37]/40 italic text-center py-4">
            The field is quiet... no resonance found.
          </div>
        )}

      {/* Privacy Notice */}
      <div className="text-[10px] text-[#D4AF37]/30 italic pt-2 border-t border-[#D4AF37]/10">
        Privacy preserved: Only anonymized patterns are visible, never individual content.
      </div>
    </div>
  );
}
