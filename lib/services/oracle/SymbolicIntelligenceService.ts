/**
 * Symbolic Intelligence Service
 *
 * Extracts and interprets symbolic patterns:
 * - Symbolic motif extraction
 * - Emotional theme detection
 * - Spiralogic phase detection
 * - Archetypal analysis
 * - Elemental pattern recognition
 * - Symbolic evolution tracking
 *
 * Earth Phase Service Extraction - Following Spiralogic Principles
 */

import type { StoredJournalEntry } from '@/lib/storage/journal-storage';
import type { SymbolicContext } from '@/lib/memory/soulprint';
import { extractSymbolicMotifs, detectEmotionalThemes } from '@/lib/memory/MemoryUpdater';
import { detectSpiralogicPhase } from '@/lib/spiralogic/PhaseDetector';
import { inferMoodAndArchetype } from '@/lib/voice/conversation/AffectDetector';

/**
 * Service for symbolic intelligence extraction and interpretation
 */
export class SymbolicIntelligenceService {
  /**
   * Extract symbolic motifs from user input
   */
  extractSymbolicMotifs(input: string): string[] {
    return extractSymbolicMotifs(input);
  }

  /**
   * Detect emotional themes from user input
   */
  detectEmotionalThemes(input: string): { themes: string[]; intensity: number } {
    return detectEmotionalThemes(input);
  }

  /**
   * Detect Spiralogic phase from user input
   */
  detectSpiralogicPhase(input: string): { phase: string; confidence: number } {
    return detectSpiralogicPhase(input);
  }

  /**
   * Infer mood and archetype from user input
   */
  inferMoodAndArchetype(input: string): { mood: string; archetype: string } {
    return inferMoodAndArchetype(input);
  }

  /**
   * Extract recurring symbols from journal history
   */
  extractSymbols(entries: StoredJournalEntry[]): string[] {
    const symbolCounts: Record<string, number> = {};

    entries.forEach(entry => {
      entry.reflection.symbols.forEach((symbol: string) => {
        symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
      });
    });

    // Return symbols that appear 2+ times, sorted by frequency
    return Object.entries(symbolCounts)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .map(([symbol]) => symbol)
      .slice(0, 5);
  }

  /**
   * Extract recurring archetypes from journal history
   */
  extractArchetypes(entries: StoredJournalEntry[]): string[] {
    const archetypeCounts: Record<string, number> = {};

    entries.forEach(entry => {
      entry.reflection.archetypes.forEach((archetype: string) => {
        archetypeCounts[archetype] = (archetypeCounts[archetype] || 0) + 1;
      });
    });

    // Return archetypes that appear 2+ times
    return Object.entries(archetypeCounts)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .map(([archetype]) => archetype)
      .slice(0, 3);
  }

  /**
   * Detect dominant element from journal history
   */
  detectDominantElement(entries: StoredJournalEntry[]): string {
    if (entries.length === 0) return 'aether';

    const elementCounts: Record<string, number> = {};

    entries.forEach(entry => {
      if (entry.element) {
        elementCounts[entry.element] = (elementCounts[entry.element] || 0) + 1;
      }
    });

    const sorted = Object.entries(elementCounts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : 'aether';
  }

  /**
   * Describe elemental flow as perfection seeking expression
   * (See what's dampened/frozen/fallow/stifled/veiled and the beauty wanting to emerge)
   */
  describeElementalFlow(context: SymbolicContext): string {
    const { elementalBalance, spiralHistory } = context;

    // Calculate elemental tendencies
    const elements = Object.entries(elementalBalance) as Array<[string, number]>;
    elements.sort((a, b) => b[1] - a[1]);

    const strongest = elements[0];
    const weakest = elements[elements.length - 1];

    let description = '';

    // Describe their natural GIFT (not just tendency)
    if (strongest[0] === 'fire') {
      description += 'Their Fire is strong - they carry passion, vision, the capacity to burn through what\'s false and ignite what\'s true. ';
    } else if (strongest[0] === 'water') {
      description += 'Their Water flows naturally - deep emotional intelligence, the gift of feeling-into, sensing truth beneath surfaces. ';
    } else if (strongest[0] === 'earth') {
      description += 'Their Earth is fertile - they ground vision into form, build what lasts, manifest the sacred into practical reality. ';
    } else if (strongest[0] === 'air') {
      description += 'Their Air is clear - pattern recognition, mental liberation, the gift of perspective that sees connections others miss. ';
    } else {
      description += 'Their Aether is open - comfortable with mystery, shadow as gift, holding paradox with grace. ';
    }

    // Recognize what's wanting to emerge (not "resistance")
    if (weakest[1] === 0 && elements.length > 1) {
      if (weakest[0] === 'fire') {
        description += 'Fire is dampened - there\'s an ember of passion/vision ready to reignite. ';
      } else if (weakest[0] === 'water') {
        description += 'Water is frozen - beneath the ice, emotional flow is waiting to thaw. ';
      } else if (weakest[0] === 'earth') {
        description += 'Earth is fallow - something is germinating beneath the surface, preparing to root. ';
      } else if (weakest[0] === 'air') {
        description += 'Air is stifled - there\'s breath wanting space, perspective ready to clear. ';
      } else if (weakest[0] === 'aether') {
        description += 'Aether is veiled - soul is ready to shine through the obscuration. ';
      }
    }

    // Describe spiral as EVOLUTION OF MAGIC
    if (spiralHistory.length > 2) {
      const recent = spiralHistory.slice(-3);
      description += `Their recent spiral: ${recent.join(' → ')} - each turn revealing more of what was always true.`;
    }

    return description;
  }

  /**
   * Describe symbolic evolution as medicine revealing itself
   * (See the gift and wisdom unfolding, not just frequency)
   */
  describeSymbolicEvolution(entries: StoredJournalEntry[], symbols: string[]): string {
    if (entries.length < 2 || symbols.length === 0) {
      return '';
    }

    // Look for moments where their light broke through
    const victories: string[] = [];
    const wisdomEmergences: string[] = [];

    entries.forEach(entry => {
      const text = entry.entry.toLowerCase();

      // Detect breakthrough language
      if (text.includes('realize') || text.includes('suddenly') || text.includes('aha') ||
          text.includes('understand') || text.includes('clarity') || text.includes('see now')) {
        victories.push('breakthrough moment');
      }

      // Detect wisdom language
      if (text.includes('learned') || text.includes('wisdom') || text.includes('truth') ||
          text.includes('know now') || text.includes('makes sense')) {
        wisdomEmergences.push('wisdom emerging');
      }

      // Detect strength language
      if (text.includes('strong') || text.includes('power') || text.includes('capable') ||
          text.includes('can do') || text.includes('overcame')) {
        victories.push('strength recognized');
      }
    });

    if (victories.length === 0 && wisdomEmergences.length === 0) {
      // Fall back to symbolic pattern but frame as medicine
      const symbolTimeline: Map<string, number> = new Map();
      entries.forEach(entry => {
        entry.reflection.symbols.forEach((symbol: string) => {
          symbolTimeline.set(symbol, (symbolTimeline.get(symbol) || 0) + 1);
        });
      });

      const evolvingSymbols = Array.from(symbolTimeline.entries())
        .filter(([_, count]) => count >= 2)
        .slice(0, 2);

      if (evolvingSymbols.length > 0) {
        return `They're working with "${evolvingSymbols[0][0]}" - this symbol is medicine revealing itself through their process.`;
      }

      return '';
    }

    // Build description highlighting victories
    let description = '';
    if (victories.length > 0) {
      description += `Their light is breaking through: ${victories.length} moments of ${victories[0]} visible in their recent entries. `;
    }
    if (wisdomEmergences.length > 0) {
      description += `Wisdom is emerging - they're remembering what they already know.`;
    }

    return description;
  }
}

/**
 * Create service instance
 */
export function createSymbolicIntelligenceService(): SymbolicIntelligenceService {
  return new SymbolicIntelligenceService();
}
