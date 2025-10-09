/**
 * 🌌 useArchetypalAgent Hook
 *
 * React hook for multi-agent archetypal intelligence
 * Routes user input to appropriate elemental agent (Fire, Water, Earth, Air, Aether)
 * Integrates Spiralogic phase detection and ritual suggestions
 */

import { useState, useCallback } from 'react';
import { routeToArchetype } from '@/lib/voice/ArchetypeRouter';
import { inferMoodAndArchetype, type Mood, type Archetype } from '@/lib/voice/conversation/AffectDetector';
import { detectSpiralogicPhase, type SpiralogicPhase } from '@/lib/spiralogic/PhaseDetector';
import { suggestRitual, type Ritual } from '@/lib/spiralogic/RitualEngine';

interface ArchetypalResponse {
  text: string;
  archetype: Archetype;
  mood: Mood;
  voiceStyle: string;
  pacing: "fast" | "moderate" | "slow" | "thoughtful";
  phase: SpiralogicPhase;
  ritual: Ritual | null;
}

export function useArchetypalAgent() {
  const [currentArchetype, setCurrentArchetype] = useState<Archetype>("Aether");
  const [currentMood, setCurrentMood] = useState<Mood>("calm");
  const [currentPhase, setCurrentPhase] = useState<SpiralogicPhase>("Aether");
  const [currentRitual, setCurrentRitual] = useState<Ritual | null>(null);

  /**
   * Analyze user input and determine archetype + mood + phase
   */
  const analyze = useCallback((text: string) => {
    const { mood, archetype } = inferMoodAndArchetype(text);
    const { phase, confidence } = detectSpiralogicPhase(text);
    const ritual = suggestRitual(archetype, phase);

    setCurrentMood(mood);
    setCurrentArchetype(archetype);
    setCurrentPhase(phase);
    setCurrentRitual(ritual);

    return { mood, archetype, phase, ritual, confidence };
  }, []);

  /**
   * Get routing information for user input (with phase and ritual)
   */
  const route = useCallback((text: string): {
    archetype: Archetype;
    prompt: string;
    voiceStyle: string;
    pacing: "fast" | "moderate" | "slow" | "thoughtful";
    phase: SpiralogicPhase;
    ritual: Ritual | null;
  } => {
    const routing = routeToArchetype(text);
    const { phase } = detectSpiralogicPhase(text);
    const ritual = suggestRitual(routing.archetype, phase);

    setCurrentArchetype(routing.archetype);
    setCurrentPhase(phase);
    setCurrentRitual(ritual);

    return {
      ...routing,
      phase,
      ritual
    };
  }, []);

  /**
   * Process response with archetypal enhancement (full context)
   */
  const enhance = useCallback((
    responseText: string,
    userText: string
  ): ArchetypalResponse => {
    const { archetype, voiceStyle, pacing } = routeToArchetype(userText);
    const { mood } = inferMoodAndArchetype(userText);
    const { phase } = detectSpiralogicPhase(userText);
    const ritual = suggestRitual(archetype, phase);

    return {
      text: responseText,
      archetype,
      mood,
      voiceStyle,
      pacing,
      phase,
      ritual
    };
  }, []);

  return {
    // State
    currentArchetype,
    currentMood,
    currentPhase,
    currentRitual,

    // Methods
    analyze,
    route,
    enhance
  };
}
