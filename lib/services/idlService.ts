/**
 * Interface Design Layer (IDL) Service
 *
 * Records and retrieves pattern ingression data:
 * - Interface hypotheses (user-designed practices, rituals, structures)
 * - Pattern ingression events (measurable markers of patterns landing)
 *
 * Based on Michael Levin's framework: Pattern Field → Interface → Ingression
 */

import { createClient } from '@/lib/supabase';

// ============================================================================
// TYPES
// ============================================================================

export type ElementType = 'Aether' | 'Air' | 'Water' | 'Earth' | 'Fire' | 'Weather';

export type IngressionType =
  | 'AttractorLock'              // Pattern stabilizing into recurrence
  | 'ValenceShift'               // Measurable stress/comfort change
  | 'InvariantDetected'          // Logical constraint discovered
  | 'TransferAcrossEmbodiment';  // Pattern appearing in new context

export interface InterfaceHypothesis {
  id?: string;
  userId: string;
  timestamp?: Date;
  elementBias: ElementType[];
  facetFocus?: number[];          // Spiralogic facets 1-12
  attractorLabel?: string;        // "Delayed Gratification", "Reconciliation", etc.
  interfaceNotes?: string;        // Description of the interface (ritual, practice, constraint)
  contextHash?: string;           // From dynamicContextBuilder snapshot
}

export interface PatternIngressionMeasures {
  valenceDelta?: number;          // -1..+1 normalized (stress to comfort)
  robustnessScore?: number;       // 0..1 (pattern stability under perturbation)
  coherenceScore?: number;        // 0..1 (pattern clarity/clustering)
  transferCount?: number;         // Number of distinct contexts where pattern appears
}

export interface PatternIngressionFacets {
  fire?: number;    // 0..10 intensity
  water?: number;   // 0..10 intensity
  earth?: number;   // 0..10 intensity
  air?: number;     // 0..10 intensity
}

export interface PatternIngressionEvent {
  id?: string;
  userId: string;
  timestamp?: Date;
  ingressType: IngressionType;
  measures: PatternIngressionMeasures;
  evidenceRefs: string[];         // Memory IDs, transcript IDs, telemetry IDs
  facets: PatternIngressionFacets;
  notes?: string;
  hypothesisId?: string;          // Links to InterfaceHypothesis
}

export interface PatternTransfer {
  attractorLabel: string;
  transferCount: number;
  contexts: string[];
  firstSeen: Date;
  lastSeen: Date;
  avgCoherence: number;
}

export interface ValenceTrend {
  date: Date;
  avgValence: number;
  ingressionCount: number;
}

// ============================================================================
// INTERFACE HYPOTHESIS FUNCTIONS
// ============================================================================

/**
 * Record a new interface hypothesis
 * Called when user designs an interface (practice, ritual, structure, choice)
 */
export async function recordInterfaceHypothesis(
  hypothesis: InterfaceHypothesis
): Promise<InterfaceHypothesis> {
  const supabase = createClient();

  // Validate element bias
  const validElements = ['Aether', 'Air', 'Water', 'Earth', 'Fire', 'Weather'];
  if (!hypothesis.elementBias || hypothesis.elementBias.length === 0) {
    throw new Error('elementBias is required and must contain at least one element');
  }
  for (const elem of hypothesis.elementBias) {
    if (!validElements.includes(elem)) {
      throw new Error(`Invalid element: ${elem}`);
    }
  }

  // Validate facet focus if provided
  if (hypothesis.facetFocus) {
    for (const facet of hypothesis.facetFocus) {
      if (facet < 1 || facet > 12) {
        throw new Error(`Invalid facet: ${facet}. Must be between 1 and 12`);
      }
    }
  }

  const { data, error } = await supabase
    .from('interface_hypotheses')
    .insert({
      user_id: hypothesis.userId,
      element_bias: hypothesis.elementBias,
      facet_focus: hypothesis.facetFocus ?? null,
      attractor_label: hypothesis.attractorLabel ?? null,
      interface_notes: hypothesis.interfaceNotes ?? null,
      context_hash: hypothesis.contextHash ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error('[IDL] Error recording interface hypothesis:', error);
    throw error;
  }

  return {
    id: data.id,
    userId: data.user_id,
    timestamp: new Date(data.timestamp),
    elementBias: data.element_bias as ElementType[],
    facetFocus: data.facet_focus,
    attractorLabel: data.attractor_label,
    interfaceNotes: data.interface_notes,
    contextHash: data.context_hash,
  };
}

/**
 * Get recent interface hypotheses for a user
 */
export async function getRecentHypotheses(
  userId: string,
  limit: number = 10
): Promise<InterfaceHypothesis[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('interface_hypotheses')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[IDL] Error fetching hypotheses:', error);
    throw error;
  }

  return data.map(row => ({
    id: row.id,
    userId: row.user_id,
    timestamp: new Date(row.timestamp),
    elementBias: row.element_bias as ElementType[],
    facetFocus: row.facet_focus,
    attractorLabel: row.attractor_label,
    interfaceNotes: row.interface_notes,
    contextHash: row.context_hash,
  }));
}

// ============================================================================
// PATTERN INGRESSION FUNCTIONS
// ============================================================================

/**
 * Record a pattern ingression event
 * Called when MAIA detects a pattern has landed (measurable markers)
 */
export async function recordPatternIngression(
  event: PatternIngressionEvent
): Promise<PatternIngressionEvent> {
  const supabase = createClient();

  // Validate ingress type
  const validTypes: IngressionType[] = [
    'AttractorLock',
    'ValenceShift',
    'InvariantDetected',
    'TransferAcrossEmbodiment',
  ];
  if (!validTypes.includes(event.ingressType)) {
    throw new Error(`Invalid ingressType: ${event.ingressType}`);
  }

  // Validate measures
  if (event.measures.valenceDelta !== undefined) {
    if (event.measures.valenceDelta < -1 || event.measures.valenceDelta > 1) {
      throw new Error('valenceDelta must be between -1 and 1');
    }
  }
  if (event.measures.robustnessScore !== undefined) {
    if (event.measures.robustnessScore < 0 || event.measures.robustnessScore > 1) {
      throw new Error('robustnessScore must be between 0 and 1');
    }
  }
  if (event.measures.coherenceScore !== undefined) {
    if (event.measures.coherenceScore < 0 || event.measures.coherenceScore > 1) {
      throw new Error('coherenceScore must be between 0 and 1');
    }
  }

  // Validate facets
  for (const [key, value] of Object.entries(event.facets)) {
    if (value !== undefined && (value < 0 || value > 10)) {
      throw new Error(`Facet ${key} must be between 0 and 10`);
    }
  }

  const { data, error } = await supabase
    .from('pattern_ingressions')
    .insert({
      user_id: event.userId,
      ingress_type: event.ingressType,
      measures: event.measures,
      evidence_refs: event.evidenceRefs,
      facets: event.facets,
      notes: event.notes ?? null,
      hypothesis_id: event.hypothesisId ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error('[IDL] Error recording pattern ingression:', error);
    throw error;
  }

  return {
    id: data.id,
    userId: data.user_id,
    timestamp: new Date(data.timestamp),
    ingressType: data.ingress_type as IngressionType,
    measures: data.measures as PatternIngressionMeasures,
    evidenceRefs: data.evidence_refs,
    facets: data.facets as PatternIngressionFacets,
    notes: data.notes,
    hypothesisId: data.hypothesis_id,
  };
}

/**
 * Get recent pattern ingressions for a user
 */
export async function getRecentIngressions(
  userId: string,
  limit: number = 10,
  ingressType?: IngressionType
): Promise<PatternIngressionEvent[]> {
  const supabase = createClient();

  let query = supabase
    .from('pattern_ingressions')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (ingressType) {
    query = query.eq('ingress_type', ingressType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[IDL] Error fetching ingressions:', error);
    throw error;
  }

  return data.map(row => ({
    id: row.id,
    userId: row.user_id,
    timestamp: new Date(row.timestamp),
    ingressType: row.ingress_type as IngressionType,
    measures: row.measures as PatternIngressionMeasures,
    evidenceRefs: row.evidence_refs,
    facets: row.facets as PatternIngressionFacets,
    notes: row.notes,
    hypothesisId: row.hypothesis_id,
  }));
}

// ============================================================================
// PATTERN ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Get pattern transfers (patterns appearing across multiple contexts)
 */
export async function getPatternTransfers(
  userId: string,
  daysBack: number = 30
): Promise<PatternTransfer[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_pattern_transfers', {
    p_user_id: userId,
    p_days_back: daysBack,
  });

  if (error) {
    console.error('[IDL] Error fetching pattern transfers:', error);
    throw error;
  }

  return data.map((row: any) => ({
    attractorLabel: row.attractor_label,
    transferCount: row.transfer_count,
    contexts: row.contexts,
    firstSeen: new Date(row.first_seen),
    lastSeen: new Date(row.last_seen),
    avgCoherence: parseFloat(row.avg_coherence) || 0,
  }));
}

/**
 * Get valence trend over time
 */
export async function getValenceTrend(
  userId: string,
  daysBack: number = 7
): Promise<ValenceTrend[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_valence_trend', {
    p_user_id: userId,
    p_days_back: daysBack,
  });

  if (error) {
    console.error('[IDL] Error fetching valence trend:', error);
    throw error;
  }

  return data.map((row: any) => ({
    date: new Date(row.date),
    avgValence: parseFloat(row.avg_valence) || 0,
    ingressionCount: row.ingression_count,
  }));
}

// ============================================================================
// HEURISTICS FOR AUTOMATIC INGRESSION DETECTION
// ============================================================================

/**
 * Classify ingression type based on AI response metadata
 * These are simple heuristics - can be refined over time
 */
export function classifyIngressionType(
  metadata: {
    invariantFound?: boolean;
    transferCount?: number;
    valenceDelta?: number;
    coherenceScore?: number;
  }
): IngressionType {
  // Priority order:
  // 1. Invariant detection (logical patterns)
  // 2. Transfer across embodiment (pattern in multiple contexts)
  // 3. Valence shift (emotional change)
  // 4. Attractor lock (default - pattern stabilizing)

  if (metadata.invariantFound) {
    return 'InvariantDetected';
  }

  if (metadata.transferCount && metadata.transferCount >= 2) {
    return 'TransferAcrossEmbodiment';
  }

  if (metadata.valenceDelta && Math.abs(metadata.valenceDelta) >= 0.2) {
    return 'ValenceShift';
  }

  return 'AttractorLock';
}

/**
 * Detect if user input suggests interface design
 * Returns element bias and facet focus if detected
 */
export function detectInterfaceDesign(userInput: string): {
  detected: boolean;
  elementBias?: ElementType[];
  facetFocus?: number[];
  interfaceNotes?: string;
} {
  const lowerInput = userInput.toLowerCase();

  // Check for interface design signals
  const interfaceSignals = [
    { pattern: /starting a (daily |new )?practice/i, element: 'Earth' as ElementType, facet: 7 },
    { pattern: /creating (a )?ritual/i, element: 'Earth' as ElementType, facet: 9 },
    { pattern: /setting boundaries/i, element: 'Earth' as ElementType, facet: 8 },
    { pattern: /letting go|releasing|surrendering/i, element: 'Water' as ElementType, facet: 5 },
    { pattern: /choosing|deciding|committing/i, element: 'Fire' as ElementType, facet: 1 },
    { pattern: /exploring|experimenting|trying/i, element: 'Fire' as ElementType, facet: 3 },
    { pattern: /journaling|writing|naming/i, element: 'Air' as ElementType, facet: 10 },
    { pattern: /meditating|praying|contemplating/i, element: 'Aether' as ElementType, facet: 1 },
  ];

  const matches = interfaceSignals.filter(signal =>
    signal.pattern.test(userInput)
  );

  if (matches.length === 0) {
    return { detected: false };
  }

  // Extract unique elements and facets
  const elementBias = [...new Set(matches.map(m => m.element))];
  const facetFocus = [...new Set(matches.map(m => m.facet))];

  return {
    detected: true,
    elementBias,
    facetFocus,
    interfaceNotes: userInput.slice(0, 500), // First 500 chars
  };
}
