"use client";

/**
 * 🜃 Field Resonance Map
 *
 * Visualizes collective consciousness patterns as living terrain.
 * Each formation represents element-archetype resonance.
 * The landscape breathes with the field's natural rhythm.
 */

import { useEffect, useState, useRef } from "react";

interface ResonancePattern {
  element: string;
  archetype: string;
  count: number;
  avgSimilarity?: number;
  nodeCount?: number;
}

interface FieldStatistic {
  element: string;
  archetype: string;
  count: number;
  node_count: number;
  avg_age_hours: number;
}

const ELEMENT_COLORS: Record<string, { base: string; glow: string }> = {
  Fire: { base: "#FF6B35", glow: "rgba(255, 107, 53, 0.3)" },
  Water: { base: "#4A90E2", glow: "rgba(74, 144, 226, 0.3)" },
  Earth: { base: "#8B7355", glow: "rgba(139, 115, 85, 0.3)" },
  Air: { base: "#7DD3C0", glow: "rgba(125, 211, 192, 0.3)" },
  Aether: { base: "#9B59B6", glow: "rgba(155, 89, 182, 0.3)" },
  Unknown: { base: "#6B7280", glow: "rgba(107, 116, 128, 0.3)" }
};

const ELEMENT_SYMBOLS: Record<string, string> = {
  Fire: "🔥",
  Water: "💧",
  Earth: "🗿",
  Air: "🌬️",
  Aether: "🜂",
  Unknown: "◌"
};

interface FieldResonanceMapProps {
  userId?: string;
  refreshInterval?: number;
  breathe?: boolean;
  showStatistics?: boolean;
}

export default function FieldResonanceMap({
  userId,
  refreshInterval = 30000,
  breathe = true,
  showStatistics = true
}: FieldResonanceMapProps) {
  const [statistics, setStatistics] = useState<FieldStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breathPhase, setBreathPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Load field statistics
   */
  async function loadFieldData() {
    try {
      const response = await fetch("/api/akashic/field?hours=24");
      if (!response.ok) throw new Error("Failed to load field data");

      const data = await response.json();
      setStatistics(data.statistics || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Draw terrain on canvas
   */
  function drawTerrain() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, "rgba(20, 20, 40, 0.8)");
    bgGradient.addColorStop(1, "rgba(10, 10, 20, 0.9)");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    if (statistics.length === 0) {
      // Empty state
      ctx.fillStyle = "rgba(212, 175, 55, 0.3)";
      ctx.font = "14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Field is forming...", width / 2, height / 2);
      return;
    }

    // Calculate grid layout
    const maxCount = Math.max(...statistics.map(s => s.count));
    const gridSize = Math.ceil(Math.sqrt(statistics.length));
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;

    // Draw each resonance pattern as a formation
    statistics.forEach((stat, index) => {
      const col = index % gridSize;
      const row = Math.floor(index / gridSize);
      const x = col * cellWidth + cellWidth / 2;
      const y = row * cellHeight + cellHeight / 2;

      // Calculate height based on resonance count
      const normalizedHeight = stat.count / maxCount;
      const baseRadius = Math.min(cellWidth, cellHeight) / 3;
      const radius = baseRadius * (0.3 + normalizedHeight * 0.7);

      // Breathing effect
      const breathScale = breathe
        ? 1 + Math.sin(breathPhase + index * 0.3) * 0.1
        : 1;

      const finalRadius = radius * breathScale;

      const colors = ELEMENT_COLORS[stat.element] || ELEMENT_COLORS.Unknown;

      // Draw glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, finalRadius * 1.5);
      gradient.addColorStop(0, colors.glow);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(
        x - finalRadius * 1.5,
        y - finalRadius * 1.5,
        finalRadius * 3,
        finalRadius * 3
      );

      // Draw formation (circle)
      ctx.beginPath();
      ctx.arc(x, y, finalRadius, 0, Math.PI * 2);
      ctx.fillStyle = colors.base;
      ctx.globalAlpha = 0.6 + normalizedHeight * 0.4;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw outline
      ctx.strokeStyle = colors.base;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw element symbol
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = `${Math.max(12, finalRadius * 0.4)}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ELEMENT_SYMBOLS[stat.element] || "◌", x, y);
    });

    // Draw connecting lines (show field coherence)
    if (statistics.length > 1) {
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 1;

      statistics.forEach((stat1, i) => {
        const col1 = i % gridSize;
        const row1 = Math.floor(i / gridSize);
        const x1 = col1 * cellWidth + cellWidth / 2;
        const y1 = row1 * cellHeight + cellHeight / 2;

        statistics.forEach((stat2, j) => {
          if (j <= i) return;

          // Only connect if same element or related archetypes
          if (stat1.element === stat2.element || stat1.archetype === stat2.archetype) {
            const col2 = j % gridSize;
            const row2 = Math.floor(j / gridSize);
            const x2 = col2 * cellWidth + cellWidth / 2;
            const y2 = row2 * cellHeight + cellHeight / 2;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
    }
  }

  // Load data on mount and refresh
  useEffect(() => {
    loadFieldData();
    const interval = setInterval(loadFieldData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Breathing animation
  useEffect(() => {
    if (!breathe) return;

    const animate = () => {
      setBreathPhase(prev => (prev + 0.02) % (Math.PI * 2));
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [breathe]);

  // Redraw on data or breath change
  useEffect(() => {
    drawTerrain();
  }, [statistics, breathPhase]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => drawTerrain();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [statistics, breathPhase]);

  return (
    <div className="space-y-4">
      {/* Canvas */}
      <div className="relative border border-[#D4AF37]/20 rounded-lg overflow-hidden bg-black/30">
        <canvas
          ref={canvasRef}
          className="w-full h-[500px]"
          style={{ display: "block" }}
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-[#D4AF37]/60 text-sm">Loading field...</div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-orange-400/80 text-sm">{error}</div>
          </div>
        )}
      </div>

      {/* Statistics Panel */}
      {showStatistics && statistics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statistics.slice(0, 8).map((stat, i) => (
            <div
              key={i}
              className="p-3 bg-black/30 border border-[#D4AF37]/10 rounded-lg"
              style={{
                borderColor: ELEMENT_COLORS[stat.element]?.base + "40" || undefined
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{ELEMENT_SYMBOLS[stat.element]}</span>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-xs font-medium truncate"
                    style={{ color: ELEMENT_COLORS[stat.element]?.base }}
                  >
                    {stat.element}
                  </div>
                  <div className="text-[10px] text-[#D4AF37]/50 truncate">
                    {stat.archetype || "—"}
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between text-[#D4AF37]/60">
                  <span>Patterns</span>
                  <span className="font-mono">{stat.count}</span>
                </div>
                <div className="flex justify-between text-[#D4AF37]/40">
                  <span>Nodes</span>
                  <span className="font-mono">{stat.node_count}</span>
                </div>
                <div className="flex justify-between text-[#D4AF37]/30">
                  <span>Age</span>
                  <span className="font-mono">{stat.avg_age_hours.toFixed(1)}h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-[#D4AF37]/40 px-2">
        <div>
          Size = resonance strength · Glow = field presence
        </div>
        {breathe && (
          <div className="italic">
            ∿ breathing enabled
          </div>
        )}
      </div>
    </div>
  );
}
