import { db } from '@/lib/db'

/**
 * MAIA Adaptive Reading — Scoring Algorithm
 *
 * Maps reader intents to book sections using weighted elemental alignment.
 * Each intent has element weights (fire, water, air, earth, aether).
 * Each section has element tags and intent tags.
 *
 * Personalization: Merges user's stored element_bias from reader_profiles
 * to gradually learn individual preferences over time.
 */

interface Section {
  id: string
  title: string
  loc: { page_start: number; page_end: number }
  tags: string[]
  intents: string[]
  summary?: string
}

interface Manifest {
  sections: Section[]
}

interface ScoreInput {
  manifest: Manifest
  intent: string
  userId?: string
}

interface ScoredStep {
  section_id: string
  title: string
  why: string
  loc: { page_start: number; page_end: number }
  score: number
}

// Intent → Element weights (base configuration)
const intentWeights: Record<string, Record<string, number>> = {
  anger: { fire: 0.9, water: 0.3, air: 0.2, earth: 0.2, aether: 0.1 },
  focus: { air: 0.9, earth: 0.3, fire: 0.2, water: 0.1, aether: 0.1 },
  transition: { aether: 0.8, water: 0.5, earth: 0.4, fire: 0.3, air: 0.2 },
  grief: { water: 0.9, earth: 0.4, aether: 0.3, air: 0.2, fire: 0.1 },
  evidence: { air: 0.7, earth: 0.7, fire: 0.2, water: 0.2, aether: 0.1 },
}

/**
 * Merge a reader's element bias (stored as JSON) into the global intent weights.
 * Increases or decreases certain element emphasis based on past resonance.
 */
export async function mergeUserBias(
  userId: string,
  baseWeights: Record<string, number>
) {
  try {
    const { data } = await db
      .from('reader_profiles')
      .select('element_bias')
      .eq('user_id', userId)
      .single()

    if (!data?.element_bias) return baseWeights

    const bias = data.element_bias as Record<string, number>
    const merged: Record<string, number> = {}

    for (const el of Object.keys(baseWeights)) {
      const biasAdj = bias[el] ?? 0
      merged[el] = clamp(baseWeights[el] + biasAdj, 0, 1)
    }

    return merged
  } catch {
    return baseWeights
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

/**
 * Score and rank sections for a given intent, personalized to user
 * Returns top 3-4 sections as a suggested reading path
 */
export async function scorePath({ manifest, intent, userId }: ScoreInput) {
  let weights = intentWeights[intent] ?? {}
  if (userId) weights = await mergeUserBias(userId, weights)

  const scored: ScoredStep[] = []

  for (const section of manifest.sections) {
    let score = 0

    // Direct intent match (highest priority)
    if (section.intents?.includes(intent)) {
      score += 10
    }

    // Element tag alignment
    for (const tag of section.tags || []) {
      const weight = weights[tag] ?? 0
      score += weight * 5
    }

    // Generate contextual "why" based on intent
    const why = generateWhy(intent, section)

    scored.push({
      section_id: section.id,
      title: section.title,
      why,
      loc: section.loc,
      score,
    })
  }

  // Sort by score descending, take top 3-4
  const steps = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((step, i) => ({
      ...step,
      order_index: i,
    }))

  return { steps }
}

/**
 * Generate contextual rationale for why this section fits the intent
 */
function generateWhy(intent: string, section: Section): string {
  const whyMap: Record<string, string> = {
    anger: `This section helps you channel ${section.tags.includes('fire') ? 'fiery' : 'transformative'} energy into creative power.`,
    focus: `Clarifies attention patterns and ${section.tags.includes('air') ? 'mental clarity' : 'grounding practices'}.`,
    transition: `Guides you through ${section.tags.includes('aether') ? 'liminal space' : 'change processes'} with grace.`,
    grief: `Holds space for ${section.tags.includes('water') ? 'emotional depth' : 'integration'} and healing.`,
    evidence: `Provides ${section.tags.includes('air') ? 'scientific backing' : 'grounded research'} for these practices.`,
  }

  return whyMap[intent] ?? section.summary ?? 'Supports your current journey.'
}
