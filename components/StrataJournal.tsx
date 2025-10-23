"use client";

/**
 * 🗿 Strata Journal
 *
 * Layered reflections presented as geological depth.
 * Each entry is a stratum — newest at surface, older settle into depth.
 * No borrowed mythology, only natural vocabulary: layer, stratum, depth, ground.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";

interface JournalEntry {
  id: string;
  content: string;
  element?: string;
  created_at: string;
  metadata?: {
    mood?: string;
    reflection?: string;
  };
}

const ELEMENT_COLORS: Record<string, { base: string; glow: string; bg: string }> = {
  Fire: {
    base: "#FF6B35",
    glow: "rgba(255, 107, 53, 0.2)",
    bg: "rgba(255, 107, 53, 0.05)"
  },
  Water: {
    base: "#4A90E2",
    glow: "rgba(74, 144, 226, 0.2)",
    bg: "rgba(74, 144, 226, 0.05)"
  },
  Earth: {
    base: "#8B7355",
    glow: "rgba(139, 115, 85, 0.2)",
    bg: "rgba(139, 115, 85, 0.05)"
  },
  Air: {
    base: "#7DD3C0",
    glow: "rgba(125, 211, 192, 0.2)",
    bg: "rgba(125, 211, 192, 0.05)"
  },
  Aether: {
    base: "#9B59B6",
    glow: "rgba(155, 89, 182, 0.2)",
    bg: "rgba(155, 89, 182, 0.05)"
  }
};

interface StrataJournalProps {
  userId?: string;
  limit?: number;
  showCompose?: boolean;
}

export default function StrataJournal({
  userId,
  limit = 20,
  showCompose = true
}: StrataJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [selectedElement, setSelectedElement] = useState<string>("Aether");
  const [saving, setSaving] = useState(false);

  /**
   * Load journal entries (strata)
   */
  async function loadEntries() {
    if (!userId) return;

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("insight_history")
        .select("*")
        .eq("user_id", userId)
        .eq("role", "user")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      setEntries(data || []);
    } catch (error) {
      console.error("Failed to load journal entries:", error);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Save new entry (add new stratum)
   */
  async function saveEntry() {
    if (!userId || !newContent.trim()) return;

    setSaving(true);
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("insight_history")
        .insert({
          user_id: userId,
          role: "user",
          content: newContent.trim(),
          element: selectedElement,
          source: "StrataJournal",
          metadata: {
            timestamp: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (error) throw error;

      // Add to top of strata
      setEntries(prev => [data, ...prev]);
      setNewContent("");
      setComposing(false);
    } catch (error) {
      console.error("Failed to save entry:", error);
    } finally {
      setSaving(false);
    }
  }

  // Load on mount
  useEffect(() => {
    loadEntries();
  }, [userId]);

  /**
   * Calculate depth opacity (newer = more visible)
   */
  function getDepthOpacity(index: number): number {
    const depthFactor = index / entries.length;
    return 1 - depthFactor * 0.6; // Fade from 1.0 to 0.4
  }

  /**
   * Calculate depth scale (newer = larger)
   */
  function getDepthScale(index: number): number {
    const depthFactor = index / entries.length;
    return 1 - depthFactor * 0.05; // Scale from 1.0 to 0.95
  }

  return (
    <div className="space-y-4">
      {/* Compose New Stratum */}
      {showCompose && (
        <div className="border border-[#D4AF37]/30 rounded-lg p-4 bg-black/20 backdrop-blur-sm">
          {!composing ? (
            <button
              onClick={() => setComposing(true)}
              className="w-full text-left text-sm text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors"
            >
              + Surface a new reflection...
            </button>
          ) : (
            <div className="space-y-3">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="What patterns are you sensing..."
                className="w-full h-32 bg-black/30 border border-[#D4AF37]/20 rounded-md px-3 py-2 text-sm text-[#D4AF37]/90 placeholder:text-[#D4AF37]/30 resize-none focus:outline-none focus:border-[#D4AF37]/40"
                autoFocus
              />

              {/* Element Selection */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#D4AF37]/50">Element:</span>
                <div className="flex gap-2">
                  {Object.keys(ELEMENT_COLORS).map((element) => (
                    <button
                      key={element}
                      onClick={() => setSelectedElement(element)}
                      className={`px-3 py-1 rounded text-xs transition-colors ${
                        selectedElement === element
                          ? "bg-opacity-20 border"
                          : "bg-opacity-0 border-transparent"
                      }`}
                      style={{
                        backgroundColor: ELEMENT_COLORS[element].bg,
                        borderColor:
                          selectedElement === element
                            ? ELEMENT_COLORS[element].base
                            : "transparent",
                        color: ELEMENT_COLORS[element].base
                      }}
                    >
                      {element}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setComposing(false);
                    setNewContent("");
                  }}
                  className="px-4 py-1.5 text-xs text-[#D4AF37]/50 hover:text-[#D4AF37]/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEntry}
                  disabled={!newContent.trim() || saving}
                  className="px-4 py-1.5 text-xs bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] rounded border border-[#D4AF37]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Settling..." : "Settle into strata"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Strata Layers */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center text-[#D4AF37]/40 text-sm py-8">
            Reading strata...
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center text-[#D4AF37]/30 text-sm py-8 italic">
            No reflections yet. Surface your first layer.
          </div>
        ) : (
          <AnimatePresence>
            {entries.map((entry, index) => {
              const colors = ELEMENT_COLORS[entry.element || "Aether"];
              const opacity = getDepthOpacity(index);
              const scale = getDepthScale(index);

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{
                    opacity,
                    y: 0,
                    scale
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                  className="relative rounded-lg p-4 backdrop-blur-sm"
                  style={{
                    backgroundColor: colors.bg,
                    borderLeft: `3px solid ${colors.base}`,
                    marginTop: index === 0 ? 0 : `${8 + index * 2}px` // Increasing spacing = depth
                  }}
                >
                  {/* Depth Indicator */}
                  <div
                    className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: colors.base, opacity: opacity * 0.6 }}
                  />

                  {/* Content */}
                  <div className="ml-4">
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: `rgba(212, 175, 55, ${opacity * 0.9})` }}
                    >
                      {entry.content}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 mt-3 text-xs"
                      style={{ opacity: opacity * 0.6 }}
                    >
                      <span className="text-[#D4AF37]/60">
                        {new Date(entry.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-[10px]"
                        style={{
                          backgroundColor: colors.glow,
                          color: colors.base
                        }}
                      >
                        {entry.element || "Unknown"}
                      </span>
                      {entry.metadata?.mood && (
                        <span className="text-[#D4AF37]/40 italic">
                          {entry.metadata.mood}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Depth Legend */}
      {entries.length > 0 && (
        <div className="text-[10px] text-[#D4AF37]/30 text-center italic pt-4 border-t border-[#D4AF37]/10">
          {entries.length} layers · Surface to depth · Older reflections settle below
        </div>
      )}
    </div>
  );
}
