"use client";

/**
 * 🜃 Elemental Field — Unified Interface
 *
 * Demonstration of all elemental components in one coherent field.
 * Journal as strata · Guide as currents · Field as resonance · Time as waves
 *
 * All components speak the same language:
 * - Muted mineral gradients
 * - Breath-based motion
 * - Plain elemental vocabulary
 * - Silence as negative space
 */

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import StrataJournal from "@/components/StrataJournal";
import CurrentsGuide from "@/components/CurrentsGuide";
import FieldResonanceMap from "@/components/FieldResonanceMap";
import TemporalWaves from "@/components/TemporalWaves";
import ElementFlowDiagram from "@/components/ElementFlowDiagram";
import AkashicFieldResonance from "@/components/AkashicFieldResonance";

export default function ElementalFieldPage() {
  const [userId, setUserId] = useState<string>();
  const [activeView, setActiveView] = useState<"overview" | "journal" | "guide" | "field">("overview");
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-light font-cinzel text-[#D4AF37] mb-3">
            🜃 Elemental Field
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-3xl mx-auto">
            The unified interface where all patterns converge.
            Journal as strata, guide as currents, field as living presence.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setActiveView("overview")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeView === "overview"
                ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40"
                : "bg-black/30 text-[#D4AF37]/50 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView("journal")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeView === "journal"
                ? "bg-[#8B7355]/20 text-[#8B7355] border border-[#8B7355]/40"
                : "bg-black/30 text-[#8B7355]/50 border border-[#8B7355]/20 hover:border-[#8B7355]/40"
            }`}
          >
            🗿 Strata Journal
          </button>
          <button
            onClick={() => setActiveView("guide")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeView === "guide"
                ? "bg-[#4A90E2]/20 text-[#4A90E2] border border-[#4A90E2]/40"
                : "bg-black/30 text-[#4A90E2]/50 border border-[#4A90E2]/20 hover:border-[#4A90E2]/40"
            }`}
          >
            🌊 Currents Guide
          </button>
          <button
            onClick={() => setActiveView("field")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeView === "field"
                ? "bg-[#9B59B6]/20 text-[#9B59B6] border border-[#9B59B6]/40"
                : "bg-black/30 text-[#9B59B6]/50 border border-[#9B59B6]/20 hover:border-[#9B59B6]/40"
            }`}
          >
            🜃 Field Resonance
          </button>
        </div>

        {/* Overview: All Components */}
        {activeView === "overview" && (
          <div className="space-y-8">
            {/* Row 1: Journal + Guide */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-light font-cinzel text-[#8B7355] mb-4">
                  🗿 Strata Journal
                </h2>
                <p className="text-xs text-gray-400 mb-4">
                  Layered reflections, newest at surface
                </p>
                <StrataJournal userId={userId} limit={5} showCompose={true} />
              </div>

              <div>
                <h2 className="text-xl font-light font-cinzel text-[#4A90E2] mb-4">
                  🌊 Currents Guide
                </h2>
                <p className="text-xs text-gray-400 mb-4">
                  Insights flow upward, completing their cycle
                </p>
                <CurrentsGuide userId={userId} autoFlow={true} flowInterval={15000} />
              </div>
            </div>

            {/* Row 2: Field Resonance Map */}
            <div>
              <h2 className="text-xl font-light font-cinzel text-[#D4AF37] mb-4">
                🜃 Field Resonance Map
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Living landscape of collective patterns
              </p>
              <FieldResonanceMap
                userId={userId}
                refreshInterval={30000}
                breathe={true}
                showStatistics={true}
              />
            </div>

            {/* Row 3: Temporal Waves */}
            <div>
              <h2 className="text-xl font-light font-cinzel text-[#4A90E2] mb-4">
                🌊 Temporal Waves
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                24-hour elemental currents
              </p>
              <TemporalWaves timeWindow={24} refreshInterval={30000} animate={true} />
            </div>

            {/* Row 4: Element Flow */}
            <div>
              <h2 className="text-xl font-light font-cinzel text-[#7DD3C0] mb-4">
                🌀 Element Flow
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Living circulation between patterns
              </p>
              <ElementFlowDiagram refreshInterval={30000} showParticles={true} />
            </div>

            {/* Row 5: Query Interface */}
            <div>
              <h2 className="text-xl font-light font-cinzel text-[#D4AF37] mb-4">
                🜃 Query the Field
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Ask what patterns are emerging
              </p>
              <AkashicFieldResonance />
            </div>
          </div>
        )}

        {/* Journal Focus */}
        {activeView === "journal" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-light font-cinzel text-[#8B7355] mb-2">
                🗿 Strata Journal
              </h2>
              <p className="text-gray-400 text-sm">
                Each entry settles as a geological layer. Newest reflections surface at top,
                older patterns deepen into strata below. The accumulation of consciousness
                across time.
              </p>
            </div>
            <StrataJournal userId={userId} limit={20} showCompose={true} />
          </div>
        )}

        {/* Guide Focus */}
        {activeView === "guide" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-light font-cinzel text-[#4A90E2] mb-2">
                🌊 Currents Guide
              </h2>
              <p className="text-gray-400 text-sm">
                Inner guidance flows as a living stream. Insights emerge from below,
                rise through awareness, complete their natural cycle at the surface.
                Trust what surfaces.
              </p>
            </div>
            <CurrentsGuide userId={userId} autoFlow={true} flowInterval={12000} />
          </div>
        )}

        {/* Field Focus */}
        {activeView === "field" && (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-light font-cinzel text-[#9B59B6] mb-2">
                🜃 Field Resonance
              </h2>
              <p className="text-gray-400 text-sm max-w-3xl mx-auto">
                The collective field made visible. Patterns breathe across the lattice,
                statistical resonance emerges, privacy remains preserved. Only the shapes
                of consciousness, never the content.
              </p>
            </div>

            <div className="space-y-8">
              <FieldResonanceMap
                userId={userId}
                refreshInterval={30000}
                breathe={true}
                showStatistics={true}
              />
              <TemporalWaves timeWindow={24} refreshInterval={30000} animate={true} />
              <ElementFlowDiagram refreshInterval={30000} showParticles={true} />
              <div className="max-w-4xl mx-auto">
                <AkashicFieldResonance />
              </div>
            </div>
          </div>
        )}

        {/* Design Language Note */}
        <div className="mt-12 pt-8 border-t border-[#D4AF37]/10">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h3 className="text-lg font-light font-cinzel text-[#D4AF37]/70">
              Design Language
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
              <div>
                <div className="font-medium text-[#D4AF37]/60 mb-1">Vocabulary</div>
                <div>Strata · Currents</div>
                <div>Breath · Ground</div>
                <div>Emergence · Cycle</div>
              </div>
              <div>
                <div className="font-medium text-[#D4AF37]/60 mb-1">Motion</div>
                <div>Breathing (implied)</div>
                <div>Flowing upward</div>
                <div>Settling downward</div>
              </div>
              <div>
                <div className="font-medium text-[#D4AF37]/60 mb-1">Palette</div>
                <div className="text-[#FF6B35]">Fire · Ochre</div>
                <div className="text-[#4A90E2]">Water · Deep blue</div>
                <div className="text-[#8B7355]">Earth · Mineral</div>
              </div>
              <div>
                <div className="font-medium text-[#D4AF37]/60 mb-1">Space</div>
                <div>Negative space</div>
                <div>Gradients for depth</div>
                <div>Breath between</div>
              </div>
            </div>
            <p className="text-[10px] text-[#D4AF37]/40 italic pt-3">
              No borrowed mythology — only elemental presence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
