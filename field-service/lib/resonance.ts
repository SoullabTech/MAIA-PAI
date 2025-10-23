/**
 * Field Resonance Index (FRI) Calculation Engine
 *
 * Calculates composite resonance scores that blend:
 * - Semantic similarity (cosine)
 * - Temporal decay (recency)
 * - Node trust (source integrity)
 * - Elemental balance (prevent monopoly)
 * - Archetypal balance (maintain diversity)
 */

export interface Vector {
  id: string
  embedding: number[]
  element: string
  archetype: string
  nodeId: string
  timestamp: Date
  similarity?: number
}

export interface FieldState {
  elementFrequencies: Record<string, number>
  archetypeFrequencies: Record<string, number>
  nodeTrustScores: Record<string, number>
  totalVectors: number
}

export interface ResonanceComponents {
  similarity: number
  temporal: number
  trust: number
  elemental: number
  archetypal: number
}

export interface ResonanceScore {
  vector: Vector
  components: ResonanceComponents
  R_i: number
}

export interface PatternCluster {
  element: string
  archetype: string
  count: number
  avgSimilarity: number
  avgResonance: number
  nodeCount: number
  latestTimestamp: Date
}

export interface ResonanceResult {
  FRI: number
  interpretation: 'background_echo' | 'thematic_resonance' | 'archetypal_activation' | 'collective_synchrony'
  topPatterns: PatternCluster[]
  components: ResonanceComponents
  metadata: {
    queriedVectors: number
    topK: number
    fieldHealth: number
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new Error('Vector dimensions must match')

  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    magnitudeA += a[i] * a[i]
    magnitudeB += b[i] * b[i]
  }

  magnitudeA = Math.sqrt(magnitudeA)
  magnitudeB = Math.sqrt(magnitudeB)

  if (magnitudeA === 0 || magnitudeB === 0) return 0

  return dotProduct / (magnitudeA * magnitudeB)
}

/**
 * Calculate temporal weight with exponential decay
 * λ = 0.1 means ~10% decay per day
 */
export function temporalWeight(timestamp: Date, lambda: number = 0.1): number {
  const now = new Date()
  const ageInDays = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60 * 24)
  return Math.exp(-lambda * ageInDays)
}

/**
 * Get node trust score (default 1.0 if unknown)
 */
export function nodeTrust(nodeId: string, fieldState: FieldState): number {
  return fieldState.nodeTrustScores[nodeId] || 1.0
}

/**
 * Calculate elemental weight (inverse frequency)
 */
export function elementalWeight(element: string, fieldState: FieldState): number {
  const frequency = fieldState.elementFrequencies[element] || 1
  const total = fieldState.totalVectors || 1
  const relativeFreq = frequency / total

  // Normalize so average frequency gets weight 1.0
  const avgFreq = 1 / Object.keys(fieldState.elementFrequencies).length
  return avgFreq / relativeFreq
}

/**
 * Calculate archetypal weight (inverse frequency)
 */
export function archetypeWeight(archetype: string, fieldState: FieldState): number {
  const frequency = fieldState.archetypeFrequencies[archetype] || 1
  const total = fieldState.totalVectors || 1
  const relativeFreq = frequency / total

  // Normalize so average frequency gets weight 1.0
  const avgFreq = 1 / Object.keys(fieldState.archetypeFrequencies).length
  return avgFreq / relativeFreq
}

/**
 * Calculate composite resonance score for a single vector
 */
export function calculateResonance(
  queryVector: number[],
  candidate: Vector,
  fieldState: FieldState
): ResonanceScore {
  const similarity = candidate.similarity || cosineSimilarity(queryVector, candidate.embedding)
  const temporal = temporalWeight(candidate.timestamp)
  const trust = nodeTrust(candidate.nodeId, fieldState)
  const elemental = elementalWeight(candidate.element, fieldState)
  const archetypal = archetypeWeight(candidate.archetype, fieldState)

  const R_i = similarity * temporal * trust * elemental * archetypal

  return {
    vector: candidate,
    components: {
      similarity,
      temporal,
      trust,
      elemental,
      archetypal
    },
    R_i
  }
}

/**
 * Interpret FRI value into qualitative categories
 */
export function interpretFRI(fri: number): ResonanceResult['interpretation'] {
  if (fri >= 0.91) return 'collective_synchrony'
  if (fri >= 0.81) return 'archetypal_activation'
  if (fri >= 0.71) return 'thematic_resonance'
  return 'background_echo'
}

/**
 * Aggregate resonance scores by element/archetype clusters
 */
export function aggregateByArchetype(scored: ResonanceScore[]): PatternCluster[] {
  const clusters = new Map<string, {
    scores: ResonanceScore[]
    nodes: Set<string>
  }>()

  for (const score of scored) {
    const key = `${score.vector.element}:${score.vector.archetype}`

    if (!clusters.has(key)) {
      clusters.set(key, { scores: [], nodes: new Set() })
    }

    const cluster = clusters.get(key)!
    cluster.scores.push(score)
    cluster.nodes.add(score.vector.nodeId)
  }

  return Array.from(clusters.entries()).map(([key, data]) => {
    const [element, archetype] = key.split(':')
    const avgSimilarity = data.scores.reduce((sum, s) => sum + s.components.similarity, 0) / data.scores.length
    const avgResonance = data.scores.reduce((sum, s) => sum + s.R_i, 0) / data.scores.length
    const latestTimestamp = new Date(Math.max(...data.scores.map(s => s.vector.timestamp.getTime())))

    return {
      element,
      archetype,
      count: data.scores.length,
      avgSimilarity,
      avgResonance,
      nodeCount: data.nodes.size,
      latestTimestamp
    }
  }).sort((a, b) => b.avgResonance - a.avgResonance)
}

/**
 * Calculate average component weights across top-k
 */
export function averageComponents(scored: ResonanceScore[]): ResonanceComponents {
  if (scored.length === 0) {
    return { similarity: 0, temporal: 0, trust: 0, elemental: 0, archetypal: 0 }
  }

  return {
    similarity: scored.reduce((sum, s) => sum + s.components.similarity, 0) / scored.length,
    temporal: scored.reduce((sum, s) => sum + s.components.temporal, 0) / scored.length,
    trust: scored.reduce((sum, s) => sum + s.components.trust, 0) / scored.length,
    elemental: scored.reduce((sum, s) => sum + s.components.elemental, 0) / scored.length,
    archetypal: scored.reduce((sum, s) => sum + s.components.archetypal, 0) / scored.length
  }
}

/**
 * Calculate Field Resonance Index from query and candidates
 */
export function calculateFieldResonanceIndex(
  queryVector: number[],
  candidates: Vector[],
  fieldState: FieldState,
  k: number = 20
): ResonanceResult {
  // Calculate resonance for all candidates
  const scored = candidates.map(c => calculateResonance(queryVector, c, fieldState))

  // Sort by resonance and take top-k
  const topK = scored.sort((a, b) => b.R_i - a.R_i).slice(0, k)

  // Calculate FRI as average of top-k resonance scores
  const FRI = topK.length > 0
    ? topK.reduce((sum, s) => sum + s.R_i, 0) / topK.length
    : 0

  // Aggregate into archetypal patterns
  const topPatterns = aggregateByArchetype(topK)

  // Calculate average component contributions
  const components = averageComponents(topK)

  // Calculate field health (0-1, based on cluster diversity)
  const uniqueClusters = new Set(topK.map(s => `${s.vector.element}:${s.vector.archetype}`)).size
  const fieldHealth = Math.min(1.0, uniqueClusters / 5) // 5+ clusters = healthy

  return {
    FRI,
    interpretation: interpretFRI(FRI),
    topPatterns,
    components,
    metadata: {
      queriedVectors: candidates.length,
      topK: topK.length,
      fieldHealth
    }
  }
}
