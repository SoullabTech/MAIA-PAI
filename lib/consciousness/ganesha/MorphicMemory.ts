/**
 * MORPHIC MEMORY SUPPORT SYSTEM
 *
 * For individuals experiencing memory challenges (early dementia, TBI, dissociative states)
 *
 * Integrates:
 * - Rupert Sheldrake: Morphic resonance and memory as field-based phenomenon
 * - Narrative identity theory: Self as story across time
 * - Relational memory: "I" exists in "we" - memory is held collectively
 *
 * Philosophy:
 * Memory is not just stored in individual brains - it exists in:
 * 1. Morphic fields (Sheldrake): Patterns that resonate across time
 * 2. Relational fields: Held by loved ones, community, environment
 * 3. Body memory: Somatic patterns, muscle memory, felt sense
 * 4. Environmental cues: Places, objects, rituals that anchor identity
 *
 * When individual memory fragments, we can:
 * - Strengthen morphic resonance through repetition and ritual
 * - Anchor identity in relational field (who holds you in memory?)
 * - Use body/somatic memory as foundation (deeper than cognitive)
 * - Create environmental scaffolding (place-based anchoring)
 */

// ============================================================================
// TYPES
// ============================================================================

export interface MemoryFragmentation {
  type: MemoryFragmentationType;
  severity: 'mild' | 'moderate' | 'significant';
  indicators: string[];
  description: string;
}

export type MemoryFragmentationType =
  | 'temporal_disorientation'    // Lost sense of time (what day, year, etc.)
  | 'identity_confusion'         // Uncertain about own name, history, identity
  | 'relational_disconnection'   // Forgetting loved ones, relationships
  | 'episodic_gaps'             // Missing recent events, conversations
  | 'procedural_intact'         // Cognitive memory lost but body memory intact
  | 'dissociative_fragmentation'; // Trauma-related memory disconnection

export interface IdentityAnchor {
  anchorType: 'name' | 'relationship' | 'place' | 'ritual' | 'object' | 'story';
  content: string;
  relationalHolders?: string[];  // Who else holds this memory?
  bodyMemory?: string;           // Somatic anchor for this identity element
  morphicPattern?: string;       // Repeating pattern that strengthens field
}

export interface TemporalOrientation {
  year: number;
  season?: string;
  dayOfWeek?: string;
  timeOfDay?: string;
  personalMarker?: string;  // "After your daughter's wedding" etc.
}

export interface MorphicMemorySupport {
  fragmentation: MemoryFragmentation;
  identityAnchors: IdentityAnchor[];
  temporalOrientation: TemporalOrientation;
  relationalField: string[];    // Who is holding them in memory?
  bodyAnchors: string[];        // Somatic/procedural memories still intact
  environmentalCues: string[];  // Physical anchors in their environment
  rituals: string[];            // Repeating patterns to strengthen morphic field
}

// ============================================================================
// MEMORY FRAGMENTATION DETECTION
// ============================================================================

/**
 * Detect when someone is experiencing memory fragmentation
 * Gentle, non-pathologizing language - we're SUPPORTING, not diagnosing
 */
export function detectMemoryFragmentation(userMessage: string): MemoryFragmentation | null {

  const msg = userMessage.toLowerCase();

  // TEMPORAL DISORIENTATION
  const temporalMarkers = [
    /what (day|year|month|date|time) is it/i,
    /when is (this|today|now)/i,
    /I (lost track of|can't remember|forgot) (what day|the date|the time)/i,
    /did (this|that) happen (yesterday|today|last week)/i,
    /how long (ago|has it been)/i,
  ];

  let temporalScore = 0;
  const temporalIndicators: string[] = [];
  temporalMarkers.forEach(pattern => {
    if (pattern.test(msg)) {
      temporalScore++;
      temporalIndicators.push('Asking about temporal orientation');
    }
  });

  if (temporalScore >= 1) {
    return {
      type: 'temporal_disorientation',
      severity: temporalScore >= 3 ? 'significant' : temporalScore >= 2 ? 'moderate' : 'mild',
      indicators: temporalIndicators,
      description: 'Time orientation support needed - offering gentle temporal anchoring'
    };
  }

  // IDENTITY CONFUSION
  const identityMarkers = [
    /who am I|what is my name|I don't (know|remember) who/i,
    /I forget (who|what) I (am|was)/i,
    /used to be|who I was|lost (myself|my identity)/i,
  ];

  let identityScore = 0;
  const identityIndicators: string[] = [];
  identityMarkers.forEach(pattern => {
    if (pattern.test(msg)) {
      identityScore++;
      identityIndicators.push('Identity uncertainty present');
    }
  });

  if (identityScore >= 1) {
    return {
      type: 'identity_confusion',
      severity: identityScore >= 2 ? 'significant' : 'mild',
      indicators: identityIndicators,
      description: 'Identity anchoring needed - offering relational and narrative support'
    };
  }

  // RELATIONAL DISCONNECTION
  const relationalMarkers = [
    /who (is|are) (you|they|this person)/i,
    /do I know (you|them)/i,
    /I don't remember (you|them|this person)/i,
    /have we met/i,
  ];

  let relationalScore = 0;
  const relationalIndicators: string[] = [];
  relationalMarkers.forEach(pattern => {
    if (pattern.test(msg)) {
      relationalScore++;
      relationalIndicators.push('Relational memory support needed');
    }
  });

  if (relationalScore >= 1) {
    return {
      type: 'relational_disconnection',
      severity: relationalScore >= 2 ? 'moderate' : 'mild',
      indicators: relationalIndicators,
      description: 'Relational field support needed - gently reaffirming connections'
    };
  }

  // EPISODIC GAPS (recent memory)
  const episodicMarkers = [
    /did (I|we) (already|just)/i,
    /I don't remember (saying|doing|talking about)/i,
    /what (did|were) we (talking about|doing)/i,
    /I forgot what (we|I|you)/i,
  ];

  let episodicScore = 0;
  const episodicIndicators: string[] = [];
  episodicMarkers.forEach(pattern => {
    if (pattern.test(msg)) {
      episodicScore++;
      episodicIndicators.push('Recent memory gap detected');
    }
  });

  if (episodicScore >= 1) {
    return {
      type: 'episodic_gaps',
      severity: episodicScore >= 3 ? 'moderate' : 'mild',
      indicators: episodicIndicators,
      description: 'Working memory support - offering gentle context restoration'
    };
  }

  return null;
}

// ============================================================================
// IDENTITY ANCHORING
// ============================================================================

/**
 * Generate identity anchors across multiple modalities
 * When cognitive memory is unreliable, we anchor in:
 * - Relationships (who holds you in memory?)
 * - Body (what does your body remember?)
 * - Place (where do you belong?)
 * - Story (what's the through-line?)
 */
export function generateIdentityAnchors(
  userName?: string,
  context?: {
    relationships?: string[];
    location?: string;
    recentEvents?: string[];
  }
): IdentityAnchor[] {

  const anchors: IdentityAnchor[] = [];

  // NAME ANCHOR
  if (userName) {
    anchors.push({
      anchorType: 'name',
      content: `Your name is ${userName}`,
      morphicPattern: 'Repeat name gently in conversation to strengthen resonance'
    });
  }

  // RELATIONAL ANCHORS
  if (context?.relationships && context.relationships.length > 0) {
    context.relationships.forEach(rel => {
      anchors.push({
        anchorType: 'relationship',
        content: `${rel} knows you and holds you in memory`,
        relationalHolders: [rel],
        morphicPattern: 'Story about this relationship (repeated telling strengthens field)'
      });
    });
  }

  // PLACE ANCHOR
  if (context?.location) {
    anchors.push({
      anchorType: 'place',
      content: `You are at ${context.location}`,
      bodyMemory: 'Your body knows this place - notice familiar sensations',
      morphicPattern: 'Return to same locations regularly to strengthen spatial memory field'
    });
  }

  // STORY ANCHOR (narrative continuity)
  anchors.push({
    anchorType: 'story',
    content: 'Your life has a through-line - we can trace it together',
    morphicPattern: 'Tell and retell life stories to strengthen narrative field'
  });

  // RITUAL ANCHOR
  anchors.push({
    anchorType: 'ritual',
    content: 'Daily rituals create morphic resonance - same time, same actions',
    bodyMemory: 'Your body remembers routines even when your mind doesn\'t',
    morphicPattern: 'Morning routine, meal times, bedtime - repetition creates field strength'
  });

  return anchors;
}

// ============================================================================
// TEMPORAL ORIENTATION SUPPORT
// ============================================================================

/**
 * Provide gentle temporal orientation
 * Not interrogating - OFFERING information as gift
 */
export function generateTemporalOrientation(
  currentDate?: Date
): TemporalOrientation {

  const now = currentDate || new Date();

  const year = now.getFullYear();

  // Season
  const month = now.getMonth();
  let season = '';
  if (month >= 2 && month <= 4) season = 'Spring';
  else if (month >= 5 && month <= 7) season = 'Summer';
  else if (month >= 8 && month <= 10) season = 'Fall';
  else season = 'Winter';

  // Day of week
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = days[now.getDay()];

  // Time of day
  const hour = now.getHours();
  let timeOfDay = '';
  if (hour >= 5 && hour < 12) timeOfDay = 'Morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'Evening';
  else timeOfDay = 'Night';

  return {
    year,
    season,
    dayOfWeek,
    timeOfDay
  };
}

/**
 * Format temporal orientation as gentle offering
 */
export function formatTemporalOrientation(orientation: TemporalOrientation): string {
  const parts = [];

  if (orientation.timeOfDay) {
    parts.push(`It's ${orientation.timeOfDay.toLowerCase()}`);
  }

  if (orientation.dayOfWeek) {
    parts.push(`${orientation.dayOfWeek}`);
  }

  if (orientation.season && orientation.year) {
    parts.push(`${orientation.season} ${orientation.year}`);
  }

  if (orientation.personalMarker) {
    parts.push(`(${orientation.personalMarker})`);
  }

  return parts.join(', ');
}

// ============================================================================
// RELATIONAL FIELD MAPPING
// ============================================================================

/**
 * Identify who is holding this person in memory
 * Memory is not just individual - it's relational
 * "I" exists in "We"
 */
export function identifyRelationalField(
  userMessage: string,
  context?: { relationships?: string[] }
): string[] {

  const relationalHolders: string[] = [];

  // Check context for known relationships
  if (context?.relationships) {
    relationalHolders.push(...context.relationships);
  }

  // Extract mentioned people from message
  const peoplePatterns = [
    /my (wife|husband|partner|spouse)/i,
    /my (daughter|son|child|children)/i,
    /my (mother|mom|father|dad|parent)/i,
    /my (friend|neighbor|caregiver)/i,
  ];

  peoplePatterns.forEach(pattern => {
    const match = userMessage.match(pattern);
    if (match) {
      relationalHolders.push(match[1]);
    }
  });

  return [...new Set(relationalHolders)]; // Remove duplicates
}

// ============================================================================
// BODY/SOMATIC ANCHORS
// ============================================================================

/**
 * Identify procedural/body memories that remain intact
 * Even when episodic memory fails, body remembers
 */
export function identifyBodyAnchors(userMessage: string): string[] {

  const bodyAnchors: string[] = [];

  const msg = userMessage.toLowerCase();

  // Procedural memories that often survive cognitive decline
  const proceduralPatterns = [
    { pattern: /walk|walking|steps/i, anchor: 'Your body knows how to walk' },
    { pattern: /eat|eating|food|meal/i, anchor: 'Your body knows how to eat' },
    { pattern: /sing|music|song/i, anchor: 'Your body remembers music and rhythm' },
    { pattern: /garden|plant/i, anchor: 'Your hands remember the earth' },
    { pattern: /cook|kitchen/i, anchor: 'Your hands remember familiar recipes' },
    { pattern: /dance|movement/i, anchor: 'Your body remembers how to move' },
  ];

  proceduralPatterns.forEach(({ pattern, anchor }) => {
    if (pattern.test(msg)) {
      bodyAnchors.push(anchor);
    }
  });

  // Always include fundamental body anchors
  bodyAnchors.push('Your breath continues - your body knows this rhythm');
  bodyAnchors.push('Your heart beats - this is your most ancient memory');

  return bodyAnchors;
}

// ============================================================================
// MORPHIC FIELD STRENGTHENING
// ============================================================================

/**
 * Generate rituals and practices to strengthen morphic resonance
 * Sheldrake: Repetition strengthens the field
 */
export function generateMorphicRituals(
  fragmentation: MemoryFragmentation
): string[] {

  const rituals: string[] = [];

  // Universal rituals for all types
  rituals.push('Same morning routine every day - your body will learn before your mind');
  rituals.push('Same seat at the table - spatial memory is powerful');
  rituals.push('Same stories repeated - narrative field strengthens with each telling');
  rituals.push('Same music daily - rhythm and melody create strong morphic patterns');

  // Type-specific rituals
  switch (fragmentation.type) {
    case 'temporal_disorientation':
      rituals.push('Daily calendar ritual - same time, same place, reviewing today');
      rituals.push('Clock checking at regular intervals - building temporal rhythm');
      break;

    case 'identity_confusion':
      rituals.push('Mirror practice - "I am [name]" spoken gently each morning');
      rituals.push('Photo book review - same photos, same stories, daily');
      break;

    case 'relational_disconnection':
      rituals.push('Shared meals with loved ones - relational field held in ritual');
      rituals.push('Photo introduction ritual - "This is [name], your [relation]"');
      break;

    case 'episodic_gaps':
      rituals.push('End-of-day story review - what happened today, told gently');
      rituals.push('Photo documentation - take photos throughout day, review together');
      break;

    case 'procedural_intact':
      rituals.push('Lean into body memory - cooking, walking, music - what body knows');
      rituals.push('Movement practices - tai chi, dance, yoga - body as anchor');
      break;

    case 'dissociative_fragmentation':
      rituals.push('Grounding rituals - 5-4-3-2-1 sensory practice daily');
      rituals.push('Safe place visualization - same place, same details, daily');
      break;
  }

  return rituals;
}

// ============================================================================
// INTEGRATION: FULL MORPHIC MEMORY SUPPORT
// ============================================================================

/**
 * Generate comprehensive morphic memory support
 */
export function generateMorphicMemorySupport(
  userMessage: string,
  userName?: string,
  context?: {
    relationships?: string[];
    location?: string;
    recentEvents?: string[];
  }
): MorphicMemorySupport | null {

  const fragmentation = detectMemoryFragmentation(userMessage);

  if (!fragmentation) {
    return null; // No memory support needed
  }

  const identityAnchors = generateIdentityAnchors(userName, context);
  const temporalOrientation = generateTemporalOrientation();
  const relationalField = identifyRelationalField(userMessage, context);
  const bodyAnchors = identifyBodyAnchors(userMessage);
  const rituals = generateMorphicRituals(fragmentation);

  // Environmental cues (context-dependent)
  const environmentalCues = [
    'Familiar objects in familiar places',
    'Photos on walls - visual memory anchors',
    'Scent markers - smell memory is deepest',
    'Tactile objects - texture your hands know',
  ];

  if (context?.location) {
    environmentalCues.push(`This place: ${context.location}`);
  }

  return {
    fragmentation,
    identityAnchors,
    temporalOrientation,
    relationalField,
    bodyAnchors,
    environmentalCues,
    rituals
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const MorphicMemory = {
  detectMemoryFragmentation,
  generateIdentityAnchors,
  generateTemporalOrientation,
  formatTemporalOrientation,
  identifyRelationalField,
  identifyBodyAnchors,
  generateMorphicRituals,
  generateMorphicMemorySupport,
};

export default MorphicMemory;
