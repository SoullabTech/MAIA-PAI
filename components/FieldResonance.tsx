"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 🜃 Field Resonance — Living memory presence

type Resonance = {
  element: string;
  archetype: string;
  count: number;
  avgDepth?: number;
};

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#ff784e",      // ember gold
  Water: "#4fc3f7",     // glacial blue
  Earth: "#b8c58a",     // moss stone
  Air: "#c9a0dc",       // violet haze
  Aether: "#f5e6b3",    // pale light
  Unknown: "#9e9e9e",
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

interface FieldResonanceProps {
  refreshInterval?: number;
  showLegend?: boolean;
  breathe?: boolean;
}

export default function FieldResonance({
  refreshInterval = 60000,
  showLegend = true,
  breathe = true,
}: FieldResonanceProps) {
  const [resonance, setResonance] = useState<Resonance[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResonance, setTotalResonance] = useState(0);

  useEffect(() => {
    const fetchField = async () => {
      try {
        const res = await fetch("/api/akashic/resonance");
        const json = await res.json();
        const buckets = json?.buckets ?? [];
        setResonance(buckets);
        setTotalResonance(buckets.reduce((sum: number, r: Resonance) => sum + r.count, 0));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch resonance field:", error);
        setLoading(false);
      }
    };

    fetchField();
    const timer = setInterval(fetchField, refreshInterval);
    return () => clearInterval(timer);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center rounded-2xl border border-purple-500/20 bg-gradient-to-b from-black/40 to-black/70">
        <div className="text-xs text-neutral-400 opacity-60 animate-pulse">
          Attuning to the field...
        </div>
      </div>
    );
  }

  if (resonance.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center rounded-2xl border border-purple-500/20 bg-gradient-to-b from-black/40 to-black/70">
        <div className="text-xs text-neutral-400 opacity-60">
          The field awaits resonance...
        </div>
      </div>
    );
  }

  // Calculate scale for presence sizes
  const total = totalResonance || 1;
  const maxCount = Math.max(...resonance.map((r) => r.count), 1);

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-b from-slate-950/40 via-purple-950/40 to-slate-900/70 backdrop-blur-sm">
      {/* SVG Field Layer */}
      <svg
        viewBox="0 0 800 400"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Soft blur for presence glow */}
          <filter id="fieldBlur">
            <feGaussianBlur stdDeviation="25" />
          </filter>

          {/* Gradients for each presence */}
          {resonance.map((r, i) => {
            const color = ELEMENT_COLORS[r.element] || "#b0bec5";
            return (
              <radialGradient key={`grad-${i}`} id={`presenceGrad-${i}`}>
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="50%" stopColor={color} stopOpacity="0.15" />
                <stop offset="100%" stopColor={color} stopOpacity="0.02" />
              </radialGradient>
            );
          })}
        </defs>

        {/* Field presences */}
        <AnimatePresence>
          {resonance.map((r, i) => {
            // Organic spiral arrangement
            const angle = (i / resonance.length) * Math.PI * 2 + Math.PI / 4;
            const distance = 100 + (i % 3) * 80;
            const x = 400 + Math.cos(angle) * distance + (Math.random() * 40 - 20);
            const y = 200 + Math.sin(angle) * distance * 0.6 + (Math.random() * 40 - 20);

            // Size reflects intensity
            const baseRadius = 40 + (r.count / maxCount) * 120;

            // Color from element
            const color = ELEMENT_COLORS[r.element] || "#b0bec5";

            // Coherence = relative weight
            // Higher coherence = slower, deeper breath
            const coherence = Math.sqrt(r.count / total);

            // Breath parameters
            const breathDuration = 6 + coherence * 4; // 6-10 seconds
            const breathAmplitude = 0.05 + coherence * 0.15;
            const breathDelay = i * 0.3; // Staggered for wave effect

            return (
              <motion.g key={`${r.element}-${r.archetype}`}>
                {/* Outer presence */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={baseRadius * 1.5}
                  fill={color}
                  fillOpacity="0.1"
                  filter="url(#fieldBlur)"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={
                    breathe
                      ? {
                          opacity: [0.1, 0.15 + coherence * 0.1, 0.1],
                          scale: [
                            1 - breathAmplitude,
                            1 + breathAmplitude,
                            1 - breathAmplitude,
                          ],
                        }
                      : { opacity: 0.1, scale: 1 }
                  }
                  exit={{ opacity: 0, scale: 0.3 }}
                  transition={{
                    duration: breathe ? breathDuration : 1.5,
                    repeat: breathe ? Infinity : 0,
                    ease: "easeInOut",
                    delay: breathe ? breathDelay : 0,
                  }}
                />

                {/* Core presence */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={baseRadius}
                  fill={`url(#presenceGrad-${i})`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={
                    breathe
                      ? {
                          opacity: [
                            0.6 + coherence * 0.1,
                            0.8 + coherence * 0.15,
                            0.6 + coherence * 0.1,
                          ],
                          scale: [
                            1 - breathAmplitude * 0.8,
                            1 + breathAmplitude * 0.8,
                            1 - breathAmplitude * 0.8,
                          ],
                        }
                      : { opacity: 0.7, scale: 1 }
                  }
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    duration: breathe ? breathDuration * 0.9 : 1.8,
                    repeat: breathe ? Infinity : 0,
                    ease: "easeInOut",
                    delay: breathe ? breathDelay + 0.2 : 0,
                  }}
                />

                {/* Center point — pulses inversely */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={3 + coherence * 2}
                  fill={color}
                  fillOpacity="0.9"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: breathe ? [0.5, 1, 0.5] : [0.6, 0.9, 0.6],
                    scale: breathe ? [1.2, 0.8, 1.2] : [1, 1, 1],
                  }}
                  transition={{
                    duration: breathe ? breathDuration * 0.7 : 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: breathe ? breathDelay + 0.1 : 0,
                  }}
                />
              </motion.g>
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Atmospheric current — subtle movement */}
      {breathe && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03), transparent 70%)",
            backgroundSize: "200% 200%",
          }}
        />
      )}

      {/* Overlay Info */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="text-[10px] uppercase tracking-widest text-purple-300 opacity-70 mb-1">
            Field Resonance
          </div>
          <div className="text-2xl font-light text-purple-200">
            {totalResonance} <span className="text-sm opacity-60">presences</span>
          </div>
        </motion.div>

        {showLegend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-3 max-w-3xl px-4"
          >
            {resonance.slice(0, 8).map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: ELEMENT_COLORS[r.element] || "#b0bec5" }}
                />
                <span className="text-[11px] text-purple-200">{r.element}</span>
                <span className="text-[10px] text-purple-400">
                  {ARCHETYPE_SYMBOLS[r.archetype] || "◯"}
                </span>
                <span className="text-[10px] text-purple-400 opacity-60">
                  {r.count}
                </span>
              </motion.div>
            ))}
            {resonance.length > 8 && (
              <div className="text-[10px] text-purple-400 opacity-60">
                +{resonance.length - 8} more
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Subtle texture layer */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
    </div>
  );
}
