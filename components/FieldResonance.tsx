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

// Dune Cerulean Palette
const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#D4A574",      // Copper Dawn
  Water: "#A8C5C7",     // Pale Cerulean
  Earth: "#B5C4A8",     // Sage Bloom
  Air: "#C5B8A4",       // Silver Sand
  Aether: "#8FA89A",    // Desert Reed
  Unknown: "#B8C5C7",
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
      <div className="w-full h-96 flex items-center justify-center border border-[#8FA89A]/20 bg-white/20 backdrop-blur-md rounded-2xl">
        <div className="text-xs text-[#6B7868] uppercase tracking-widest animate-pulse font-light">
          Attuning to the pool...
        </div>
      </div>
    );
  }

  if (resonance.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center border border-[#8FA89A]/20 bg-white/20 backdrop-blur-md rounded-2xl">
        <div className="text-xs text-[#6B7868] uppercase tracking-widest font-light">
          The waters await their first ripple...
        </div>
      </div>
    );
  }

  // Calculate scale for presence sizes
  const total = totalResonance || 1;
  const maxCount = Math.max(...resonance.map((r) => r.count), 1);

  return (
    <div className="relative w-full h-96 overflow-hidden border border-[#8FA89A]/30 bg-white/25 backdrop-blur-lg rounded-2xl shadow-2xl">
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

      {/* Atmospheric current — desert winds */}
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
              "radial-gradient(circle at 50% 50%, rgba(212, 165, 116, 0.05), transparent 70%)",
            backgroundSize: "200% 200%",
          }}
        />
      )}

      {/* Overlay Info - Ancient Markings */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-amber-700/70 mb-1 font-light">
            The Pool's Depth
          </div>
          <div className="text-2xl font-serif text-amber-100/90">
            {totalResonance} <span className="text-sm opacity-60 font-light">reflections</span>
          </div>
          {/* Geometric divider */}
          <div className="flex justify-center gap-1 mt-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-amber-800/40 rotate-45" />
            ))}
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
                className="flex items-center gap-1.5 bg-stone-950/50 backdrop-blur-sm px-3 py-1.5 border border-amber-900/40"
              >
                <span
                  className="inline-block w-2 h-2"
                  style={{ background: ELEMENT_COLORS[r.element] || "#b0bec5" }}
                />
                <span className="text-[11px] text-amber-200/80 font-light">{r.element}</span>
                <span className="text-[10px] text-amber-700/70">
                  {ARCHETYPE_SYMBOLS[r.archetype] || "◯"}
                </span>
                <span className="text-[10px] text-amber-600/70 font-light">
                  {r.count}
                </span>
              </motion.div>
            ))}
            {resonance.length > 8 && (
              <div className="text-[10px] text-amber-700/60 font-light">
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
