/**
 * Resonance Presenter - Translates FRI into symbolic language
 *
 * Takes quantitative resonance data and renders it in three modes:
 * - Analytic: Full numerical breakdown
 * - Symbolic: Archetypal imagery and poetic reflection
 * - Somatic: Visual/spatial representation
 */

import type { ResonanceResult, PatternCluster } from './resonance'

export type PresentationMode = 'analytic' | 'symbolic' | 'somatic'

export interface AnalyticPresentation {
  mode: 'analytic'
  resonanceIndex: number
  interpretation: string
  components: {
    similarity: string
    temporal: string
    trust: string
    elemental: string
    archetypal: string
  }
  clusters: Array<{
    label: string
    count: number
    similarity: number
    resonance: number
    nodes: number
  }>
}

export interface SymbolicPresentation {
  mode: 'symbolic'
  opening: string
  reflection: string
  groundingPrompt: string
  elementalSignature: string
}

export interface SomaticPresentation {
  mode: 'somatic'
  gauge: {
    value: number
    intensity: 'low' | 'medium' | 'high' | 'profound'
  }
  spectrum: Record<string, number>
  glyphs: Array<{
    archetype: string
    size: number
    pulse: boolean
  }>
}

export type Presentation = AnalyticPresentation | SymbolicPresentation | SomaticPresentation

/**
 * Format resonance result in analytic mode
 */
export function formatAnalytic(result: ResonanceResult): AnalyticPresentation {
  return {
    mode: 'analytic',
    resonanceIndex: result.FRI,
    interpretation: interpretationToLabel(result.interpretation),
    components: {
      similarity: `${(result.components.similarity * 100).toFixed(1)}%`,
      temporal: `${(result.components.temporal * 100).toFixed(1)}%`,
      trust: `${(result.components.trust * 100).toFixed(1)}%`,
      elemental: `${(result.components.elemental * 100).toFixed(1)}%`,
      archetypal: `${(result.components.archetypal * 100).toFixed(1)}%`
    },
    clusters: result.topPatterns.slice(0, 5).map(p => ({
      label: `${p.element}/${p.archetype}`,
      count: p.count,
      similarity: Math.round(p.avgSimilarity * 100) / 100,
      resonance: Math.round(p.avgResonance * 100) / 100,
      nodes: p.nodeCount
    }))
  }
}

/**
 * Format resonance result in symbolic mode
 */
export function formatSymbolic(
  result: ResonanceResult,
  queryText?: string
): SymbolicPresentation {
  const opening = generateOpening(result.FRI, result.interpretation)
  const reflection = generateReflection(result.topPatterns, result.FRI)
  const groundingPrompt = generateGroundingPrompt(result.topPatterns[0])
  const elementalSignature = generateElementalSignature(result.topPatterns)

  return {
    mode: 'symbolic',
    opening,
    reflection,
    groundingPrompt,
    elementalSignature
  }
}

/**
 * Format resonance result in somatic mode
 */
export function formatSomatic(result: ResonanceResult): SomaticPresentation {
  // Calculate elemental spectrum (normalized to 0-1)
  const spectrum: Record<string, number> = {}
  const elementTotals: Record<string, number> = {}

  for (const pattern of result.topPatterns) {
    elementTotals[pattern.element] = (elementTotals[pattern.element] || 0) + pattern.avgResonance
  }

  const maxResonance = Math.max(...Object.values(elementTotals), 0.01)
  for (const [element, total] of Object.entries(elementTotals)) {
    spectrum[element] = total / maxResonance
  }

  // Generate archetypal glyphs (top 3)
  const glyphs = result.topPatterns.slice(0, 3).map(p => ({
    archetype: p.archetype,
    size: p.avgResonance,
    pulse: p.avgResonance > 0.8
  }))

  return {
    mode: 'somatic',
    gauge: {
      value: result.FRI,
      intensity: result.FRI >= 0.91 ? 'profound' :
                 result.FRI >= 0.81 ? 'high' :
                 result.FRI >= 0.71 ? 'medium' : 'low'
    },
    spectrum,
    glyphs
  }
}

/**
 * Generate opening line based on FRI
 */
function generateOpening(fri: number, interpretation: string): string {
  if (fri >= 0.91) {
    return "The field resonates with profound synchrony."
  } else if (fri >= 0.81) {
    return "The field speaks with archetypal clarity."
  } else if (fri >= 0.71) {
    return "The field hums with thematic resonance."
  } else {
    return "The field stirs with latent patterns."
  }
}

/**
 * Generate poetic reflection from patterns
 */
function generateReflection(patterns: PatternCluster[], fri: number): string {
  if (patterns.length === 0) {
    return "The field holds silence, waiting for the first resonance."
  }

  const primary = patterns[0]
  const nodeCount = patterns.reduce((sum, p) => sum + p.nodeCount, 0)
  const totalInsights = patterns.reduce((sum, p) => sum + p.count, 0)

  const elementPoetry = getElementPoetry(primary.element)
  const archetypePhrase = getArchetypePhrase(primary.archetype)

  let reflection = `${elementPoetry} ${archetypePhrase}. `

  if (nodeCount > 1) {
    reflection += `${totalInsights} voices across ${nodeCount} nodes have walked this threshold. `
  } else {
    reflection += `One voice echoes through ${totalInsights} moments. `
  }

  if (fri >= 0.85) {
    reflection += "Your question activates a living cluster."
  } else if (fri >= 0.75) {
    reflection += "The pattern recognizes itself in your inquiry."
  } else {
    reflection += "The pattern begins to cohere."
  }

  return reflection
}

/**
 * Generate grounding prompt based on primary pattern
 */
function generateGroundingPrompt(primary?: PatternCluster): string {
  if (!primary) {
    return "What does this moment ask of you?"
  }

  const prompts: Record<string, Record<string, string>> = {
    Fire: {
      Shadow: "Where in your life is the Fire asking to be seen rather than controlled?",
      MainOracle: "What vision wants to be born through you?",
      InnerGuide: "What transformation awaits your commitment?",
      Dream: "What passion seeks expression?",
      Mentor: "Where does your creative fire serve others?",
      Relationship: "How does desire shape your connections?",
      Alchemist: "What transmutation is yours to complete?"
    },
    Water: {
      Shadow: "What emotion have you been unwilling to feel fully?",
      MainOracle: "What does your intuition whisper?",
      InnerGuide: "How can you honor your emotional truth?",
      Dream: "What flows beneath the surface?",
      Mentor: "Where does empathy guide your path?",
      Relationship: "How do you meet others in emotional depth?",
      Alchemist: "What dissolution enables new flow?"
    },
    Earth: {
      Shadow: "What foundation needs strengthening or releasing?",
      MainOracle: "What practical wisdom grounds you?",
      InnerGuide: "Where do you need structure or stability?",
      Dream: "What form wants to manifest?",
      Mentor: "How do you embody your values?",
      Relationship: "What commitments shape your connections?",
      Alchemist: "What requires patient cultivation?"
    },
    Air: {
      Shadow: "What truth have you been avoiding speaking?",
      MainOracle: "What clarity seeks articulation?",
      InnerGuide: "Where does perspective shift everything?",
      Dream: "What idea wants wings?",
      Mentor: "How do you share your understanding?",
      Relationship: "What conversation needs to happen?",
      Alchemist: "What distillation brings essence?"
    },
    Aether: {
      Shadow: "What integration have you been resisting?",
      MainOracle: "Where do all threads weave together?",
      InnerGuide: "What synthesis awaits?",
      Dream: "What transcends the visible?",
      Mentor: "How do you bridge worlds?",
      Relationship: "Where does sacred connection emerge?",
      Alchemist: "What unity contains all opposites?"
    }
  }

  return prompts[primary.element]?.[primary.archetype] ||
         "What does this resonance reveal about your current journey?"
}

/**
 * Generate elemental signature from patterns
 */
function generateElementalSignature(patterns: PatternCluster[]): string {
  const elementCounts: Record<string, number> = {}

  for (const pattern of patterns) {
    elementCounts[pattern.element] = (elementCounts[pattern.element] || 0) + 1
  }

  const sorted = Object.entries(elementCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([element]) => element)

  if (sorted.length === 1) {
    return `Pure ${sorted[0]} resonance`
  } else if (sorted.length === 2) {
    return `${sorted[0]} and ${sorted[1]} in dialogue`
  } else {
    return `${sorted[0]} primary, with traces of ${sorted.slice(1, 3).join(', ')}`
  }
}

/**
 * Get poetic phrase for element
 */
function getElementPoetry(element: string): string {
  const poetry: Record<string, string> = {
    Fire: "The field burns bright where transformation calls.",
    Water: "The field flows with emotional truth.",
    Earth: "The field grounds where wisdom takes form.",
    Air: "The field carries clarity on swift winds.",
    Aether: "The field shimmers at the threshold of integration."
  }
  return poetry[element] || "The field resonates."
}

/**
 * Get phrase for archetype
 */
function getArchetypePhrase(archetype: string): string {
  const phrases: Record<string, string> = {
    Shadow: "The unseen becomes visible",
    MainOracle: "The center speaks",
    InnerGuide: "The inner compass points true",
    Dream: "The unconscious reveals itself",
    Mentor: "Wisdom offers guidance",
    Relationship: "Connection deepens",
    Alchemist: "Transmutation begins"
  }
  return phrases[archetype] || "An archetype awakens"
}

/**
 * Convert interpretation enum to readable label
 */
function interpretationToLabel(interpretation: string): string {
  const labels: Record<string, string> = {
    'background_echo': 'Background Echo',
    'thematic_resonance': 'Thematic Resonance',
    'archetypal_activation': 'Archetypal Activation',
    'collective_synchrony': 'Collective Synchrony'
  }
  return labels[interpretation] || interpretation
}

/**
 * Main presenter function - routes to appropriate formatter
 */
export function presentResonance(
  result: ResonanceResult,
  mode: PresentationMode,
  queryText?: string
): Presentation {
  switch (mode) {
    case 'analytic':
      return formatAnalytic(result)
    case 'symbolic':
      return formatSymbolic(result, queryText)
    case 'somatic':
      return formatSomatic(result)
  }
}
