"use client";

/**
 * 🌊 Currents Guide
 *
 * Inner guidance as flowing stream.
 * Insights emerge from below, rise upward, complete their cycle.
 * No borrowed mythology, only natural vocabulary: current, flow, emergence, cycle.
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Insight {
  id: string;
  content: string;
  element?: string;
  type: "guidance" | "question" | "reflection";
  timestamp: number;
}

const ELEMENT_COLORS: Record<string, { base: string; glow: string }> = {
  Fire: { base: "#FF6B35", glow: "rgba(255, 107, 53, 0.3)" },
  Water: { base: "#4A90E2", glow: "rgba(74, 144, 226, 0.3)" },
  Earth: { base: "#8B7355", glow: "rgba(139, 115, 85, 0.3)" },
  Air: { base: "#7DD3C0", glow: "rgba(125, 211, 192, 0.3)" },
  Aether: { base: "#9B59B6", glow: "rgba(155, 89, 182, 0.3)" }
};

interface CurrentsGuideProps {
  userId?: string;
  autoFlow?: boolean;
  flowInterval?: number; // ms between new insights
}

export default function CurrentsGuide({
  userId,
  autoFlow = true,
  flowInterval = 10000
}: CurrentsGuideProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [userInput, setUserInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Sample insights that flow naturally
   */
  const insightPool = [
    { content: "What patterns are surfacing in your awareness?", element: "Water", type: "question" as const },
    { content: "Integration happens in the quiet moments between thoughts.", element: "Aether", type: "guidance" as const },
    { content: "The fire of initiation doesn't need to be loud.", element: "Fire", type: "reflection" as const },
    { content: "Notice where resistance appears — it marks the edge of growth.", element: "Earth", type: "guidance" as const },
    { content: "What would shift if you trusted the current?", element: "Air", type: "question" as const },
    { content: "Shadow isn't absence of light — it's light waiting to be witnessed.", element: "Aether", type: "reflection" as const },
    { content: "How does this moment feel in your body?", element: "Water", type: "question" as const },
    { content: "Ground before you expand. Root before you rise.", element: "Earth", type: "guidance" as const },
    { content: "The question holds more energy than the answer.", element: "Air", type: "reflection" as const },
    { content: "What emerges when you stop trying?", element: "Aether", type: "question" as const }
  ];

  /**
   * Add new insight to the current (emerges from bottom)
   */
  function addInsight(content: string, element: string = "Aether", type: Insight["type"] = "guidance") {
    const newInsight: Insight = {
      id: `insight-${Date.now()}-${Math.random()}`,
      content,
      element,
      type,
      timestamp: Date.now()
    };

    setInsights(prev => [...prev, newInsight]);

    // Auto-remove after flowing up (completing cycle)
    setTimeout(() => {
      setInsights(prev => prev.filter(i => i.id !== newInsight.id));
    }, 15000); // 15 seconds lifecycle
  }

  /**
   * User sends a question/reflection
   */
  function sendUserInput() {
    if (!userInput.trim()) return;

    // User input flows in
    addInsight(userInput.trim(), "Water", "question");

    // Simulate guide response after brief pause
    setTimeout(() => {
      const response = insightPool[Math.floor(Math.random() * insightPool.length)];
      addInsight(response.content, response.element, response.type);
    }, 1500);

    setUserInput("");
  }

  /**
   * Auto-flow insights (natural emergence)
   */
  useEffect(() => {
    if (!autoFlow) return;

    const interval = setInterval(() => {
      const insight = insightPool[Math.floor(Math.random() * insightPool.length)];
      addInsight(insight.content, insight.element, insight.type);
    }, flowInterval);

    // Initial insight
    const initial = insightPool[0];
    addInsight(initial.content, initial.element, initial.type);

    return () => clearInterval(interval);
  }, [autoFlow, flowInterval]);

  /**
   * Scroll to bottom when new insight appears
   */
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [insights]);

  return (
    <div className="flex flex-col h-[600px] border border-[#4A90E2]/30 rounded-lg bg-black/20 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#4A90E2]/20 bg-black/30">
        <h3 className="text-sm font-cinzel text-[#4A90E2]">
          Inner Currents
        </h3>
        <p className="text-[10px] text-[#4A90E2]/50 mt-1">
          Guidance flows naturally · Trust what emerges
        </p>
      </div>

      {/* Flowing Insights Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        style={{
          background: "linear-gradient(to top, rgba(74, 144, 226, 0.05), transparent)"
        }}
      >
        <AnimatePresence>
          {insights.map((insight, index) => {
            const colors = ELEMENT_COLORS[insight.element || "Aether"];

            return (
              <motion.div
                key={insight.id}
                initial={{
                  opacity: 0,
                  y: 40, // Emerge from below
                  scale: 0.9
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }}
                exit={{
                  opacity: 0,
                  y: -40, // Fade upward
                  scale: 0.95
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.4, 0.0, 0.2, 1] // Smooth natural curve
                }}
                className={`relative p-3 rounded-lg ${
                  insight.type === "question"
                    ? "ml-auto max-w-[85%]"
                    : "mr-auto max-w-[85%]"
                }`}
                style={{
                  backgroundColor: `${colors.glow}`,
                  borderLeft: insight.type !== "question" ? `2px solid ${colors.base}` : "none",
                  borderRight: insight.type === "question" ? `2px solid ${colors.base}` : "none"
                }}
              >
                {/* Type Indicator */}
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: colors.base }}
                  />
                  <span
                    className="text-[9px] uppercase tracking-wide"
                    style={{ color: colors.base, opacity: 0.7 }}
                  >
                    {insight.type}
                  </span>
                </div>

                {/* Content */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: `rgba(212, 175, 55, 0.9)` }}
                >
                  {insight.content}
                </p>

                {/* Element Tag */}
                <div className="flex justify-end mt-2">
                  <span
                    className="text-[9px] px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${colors.base}20`,
                      color: colors.base
                    }}
                  >
                    {insight.element}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty State */}
        {insights.length === 0 && (
          <div className="flex items-center justify-center h-full text-[#4A90E2]/40 text-sm italic">
            The current is gathering...
          </div>
        )}
      </div>

      {/* Input Field (User can add to the current) */}
      <div className="px-4 py-3 border-t border-[#4A90E2]/20 bg-black/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendUserInput()}
            placeholder="What question is alive in you..."
            className="flex-1 bg-black/40 border border-[#4A90E2]/20 rounded-md px-3 py-2 text-sm text-[#4A90E2]/90 placeholder:text-[#4A90E2]/30 focus:outline-none focus:border-[#4A90E2]/40"
          />
          <button
            onClick={sendUserInput}
            disabled={!userInput.trim()}
            className="px-4 py-2 bg-[#4A90E2]/20 hover:bg-[#4A90E2]/30 text-[#4A90E2] rounded border border-[#4A90E2]/40 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Flow
          </button>
        </div>

        <div className="text-[9px] text-[#4A90E2]/40 mt-2 text-center italic">
          Insights complete their cycle in 15 seconds · New currents emerge naturally
        </div>
      </div>
    </div>
  );
}
