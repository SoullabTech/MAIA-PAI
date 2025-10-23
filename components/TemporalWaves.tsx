"use client";

/**
 * 🌊 Temporal Waves
 *
 * Visualizes field resonance evolution over time.
 * Shows how elemental patterns ebb and flow across hours/days.
 * Each wave represents an element's presence in the field.
 */

import { useEffect, useState, useRef } from "react";

interface TimePoint {
  timestamp: string;
  elementCounts: Record<string, number>;
}

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#FF6B35",
  Water: "#4A90E2",
  Earth: "#8B7355",
  Air: "#7DD3C0",
  Aether: "#9B59B6"
};

const ELEMENTS = ["Fire", "Water", "Earth", "Air", "Aether"];

interface TemporalWavesProps {
  timeWindow?: number; // hours
  refreshInterval?: number;
  animate?: boolean;
}

export default function TemporalWaves({
  timeWindow = 24,
  refreshInterval = 30000,
  animate = true
}: TemporalWavesProps) {
  const [data, setData] = useState<TimePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Load temporal data from field
   */
  async function loadTemporalData() {
    try {
      // For now, generate synthetic data
      // In production, this would query field_vectors with time buckets
      const now = Date.now();
      const points: TimePoint[] = [];

      for (let i = timeWindow; i >= 0; i--) {
        const timestamp = new Date(now - i * 3600 * 1000).toISOString();
        const elementCounts: Record<string, number> = {};

        ELEMENTS.forEach(element => {
          // Simulate natural patterns with sine waves + noise
          const baseWave = Math.sin((timeWindow - i) * 0.3) * 10;
          const elementPhase = ELEMENTS.indexOf(element) * 0.5;
          const elementWave = Math.sin((timeWindow - i + elementPhase) * 0.2) * 8;
          const noise = Math.random() * 5;

          elementCounts[element] = Math.max(0, Math.round(15 + baseWave + elementWave + noise));
        });

        points.push({ timestamp, elementCounts });
      }

      setData(points);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load temporal data:", error);
      setLoading(false);
    }
  }

  /**
   * Draw waves on canvas
   */
  function drawWaves() {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, "rgba(10, 10, 20, 0.9)");
    bgGradient.addColorStop(1, "rgba(20, 20, 40, 0.8)");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Calculate max value for scaling
    const maxValue = Math.max(
      ...data.flatMap(point =>
        Object.values(point.elementCounts)
      )
    );

    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    const xStep = graphWidth / (data.length - 1);

    // Draw grid lines
    ctx.strokeStyle = "rgba(212, 175, 55, 0.1)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const y = padding + (graphHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw each element's wave
    ELEMENTS.forEach((element, elementIndex) => {
      ctx.beginPath();
      ctx.strokeStyle = ELEMENT_COLORS[element];
      ctx.lineWidth = 2;

      data.forEach((point, index) => {
        const count = point.elementCounts[element] || 0;
        const x = padding + index * xStep;
        const y = padding + graphHeight - (count / maxValue) * graphHeight;

        // Add subtle animation wave
        const waveOffset = animate
          ? Math.sin(phase + index * 0.2 + elementIndex * 0.5) * 3
          : 0;

        if (index === 0) {
          ctx.moveTo(x, y + waveOffset);
        } else {
          ctx.lineTo(x, y + waveOffset);
        }
      });

      ctx.stroke();

      // Fill area under curve
      ctx.lineTo(width - padding, padding + graphHeight);
      ctx.lineTo(padding, padding + graphHeight);
      ctx.closePath();

      ctx.fillStyle = ELEMENT_COLORS[element] + "20";
      ctx.fill();
    });

    // Draw axes
    ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = "rgba(212, 175, 55, 0.6)";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";

    // Time labels (every 6 hours for 24h window)
    const labelStep = Math.ceil(data.length / 5);
    data.forEach((point, index) => {
      if (index % labelStep === 0) {
        const x = padding + index * xStep;
        const time = new Date(point.timestamp);
        const label = `${time.getHours()}:00`;
        ctx.fillText(label, x, height - padding + 15);
      }
    });

    // Y-axis label
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("Resonance", 0, 0);
    ctx.restore();
  }

  // Load data
  useEffect(() => {
    loadTemporalData();
    const interval = setInterval(loadTemporalData, refreshInterval);
    return () => clearInterval(interval);
  }, [timeWindow, refreshInterval]);

  // Animation loop
  useEffect(() => {
    if (!animate) return;

    const animationLoop = () => {
      setPhase(prev => (prev + 0.03) % (Math.PI * 2));
      requestAnimationFrame(animationLoop);
    };

    const animationId = requestAnimationFrame(animationLoop);
    return () => cancelAnimationFrame(animationId);
  }, [animate]);

  // Redraw
  useEffect(() => {
    drawWaves();
  }, [data, phase]);

  // Resize
  useEffect(() => {
    const handleResize = () => drawWaves();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data, phase]);

  return (
    <div className="space-y-3">
      {/* Canvas */}
      <div className="relative border border-[#D4AF37]/20 rounded-lg overflow-hidden bg-black/30">
        <canvas
          ref={canvasRef}
          className="w-full h-[300px]"
          style={{ display: "block" }}
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-[#D4AF37]/60 text-sm">Reading currents...</div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 flex-wrap text-xs">
        {ELEMENTS.map(element => (
          <div key={element} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: ELEMENT_COLORS[element] }}
            />
            <span className="text-[#D4AF37]/70">{element}</span>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-[#D4AF37]/40 text-center italic">
        Last {timeWindow} hours · Updates every {refreshInterval / 1000}s
      </div>
    </div>
  );
}
