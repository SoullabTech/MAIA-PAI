"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  resonance?: {
    FRI: number;
    interpretation: string;
    patterns: Array<{
      element: string;
      archetype: string;
      count: number;
    }>;
    symbolic?: {
      opening: string;
      reflection: string;
      groundingPrompt: string;
    };
  };
  query?: string;
}

export default function ReflectionModal({
  isOpen,
  onClose,
  resonance,
  query,
}: ReflectionModalProps) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;

    setSaving(true);

    try {
      // Determine primary element and archetype from resonance
      const primaryPattern = resonance?.patterns?.[0];
      const element = primaryPattern?.element || "Aether";
      const archetype = primaryPattern?.archetype || "MainOracle";

      // Save to insight_history via the insights/process API
      const response = await fetch("/api/insights/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          context: "sacred_moment",
          userId: "akashic-user", // TODO: Get from session
          metadata: {
            element: element.toLowerCase(),
            emotionalTone: "reflective",
            sessionId: `reflection-${Date.now()}`,
            date: new Date().toISOString(),
            // Store the original query and resonance data
            sourceQuery: query,
            FRI: resonance?.FRI,
            interpretation: resonance?.interpretation,
            archetype,
          },
        }),
      });

      if (response.ok) {
        setSaved(true);
        // Close after 1.5 seconds
        setTimeout(() => {
          onClose();
          // Reset state
          setTimeout(() => {
            setContent("");
            setSaved(false);
          }, 300);
        }, 1500);
      } else {
        console.error("Failed to save reflection");
        alert("Failed to save reflection. Please try again.");
      }
    } catch (error) {
      console.error("Error saving reflection:", error);
      alert("Error saving reflection. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-purple-500/30 shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {saved ? (
                // Success state
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-2xl font-light text-purple-200 mb-2">
                    Reflection Recorded
                  </h3>
                  <p className="text-purple-300">
                    Your wisdom has been woven into the Akashic Records
                  </p>
                </motion.div>
              ) : (
                // Form state
                <>
                  <div className="mb-6">
                    <h2 className="text-3xl font-light text-purple-100 mb-2">
                      🜃 Record Your Reflection
                    </h2>
                    <p className="text-purple-300">
                      What does this resonance illuminate for you?
                    </p>
                  </div>

                  {/* Show grounding prompt if available */}
                  {resonance?.symbolic?.groundingPrompt && (
                    <div className="mb-6 p-4 bg-white/5 rounded-lg border border-purple-500/20">
                      <p className="text-purple-200 italic">
                        {resonance.symbolic.groundingPrompt}
                      </p>
                    </div>
                  )}

                  {/* Textarea */}
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Let your truth flow onto the page..."
                    className="w-full h-48 bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-6"
                    autoFocus
                  />

                  {/* Actions */}
                  <div className="flex gap-4">
                    <button
                      onClick={onClose}
                      disabled={saving}
                      className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-purple-200 px-6 py-3 rounded-lg font-medium transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving || !content.trim()}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-all"
                    >
                      {saving ? "Saving..." : "Save Reflection"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
