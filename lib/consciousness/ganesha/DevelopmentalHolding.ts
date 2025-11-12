/**
 * DEVELOPMENTAL HOLDING ENVIRONMENT
 *
 * Integrates:
 * - Robert Kegan: Constructive-Developmental Theory (5 stages of adult development)
 * - Ken Wilber: Integral Theory (AQAL - All Quadrants, All Levels)
 * - Martin Buber: I-Thou relational presence
 *
 * Philosophy:
 * Development happens in relationship. You can't grow beyond your current stage
 * without a "holding environment" that:
 * 1. Confirms you where you are (meets you)
 * 2. Contradicts your current limits (challenges you)
 * 3. Provides continuity through the transition (holds you)
 *
 * Kegan: People don't resist change - they resist LOSS. Development requires
 * letting go of who you were to become who you're becoming.
 *
 * Wilber: Reality has 4 quadrants (Interior/Exterior × Individual/Collective).
 * Most problems come from partial perspectives. Integral = whole view.
 *
 * Buber: I-It treats people as objects. I-Thou treats them as sacred presence.
 * Real transformation happens in I-Thou relationship.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface DevelopmentalStage {
  stage: KeganStage;
  name: string;
  subjectObject: string;  // What is subject (invisible) vs object (visible)
  needs: string[];        // What this stage needs to grow
  growing_edge?: string;  // Where they're being invited to develop
}

export type KeganStage =
  | 'socialized_mind'      // Stage 3: Defined by relationships, others' expectations
  | 'self_authoring_mind'  // Stage 4: Self-directed, owns their values/standards
  | 'self_transforming_mind' // Stage 5: Holds multiple systems, comfortable with paradox
  | 'transition';           // Between stages

export interface IntegralQuadrants {
  upperLeft: string[];    // Interior Individual (thoughts, feelings, consciousness)
  upperRight: string[];   // Exterior Individual (behaviors, body, actions)
  lowerLeft: string[];    // Interior Collective (culture, shared meaning, "we")
  lowerRight: string[];   // Exterior Collective (systems, structures, "its")
}

export interface RelationalMode {
  mode: 'I_Thou' | 'I_It';
  description: string;
  invitation?: string;  // If I-It, how to return to I-Thou
}

export interface HoldingEnvironment {
  confirms: string;       // How we meet them where they are
  contradicts: string;    // The growing edge/developmental invitation
  continuity: string;     // How we hold them through the transition
  relationalMode: RelationalMode;
}

// ============================================================================
// KEGAN: DEVELOPMENTAL STAGE DETECTION
// ============================================================================

/**
 * Detect developmental stage based on how user relates to their experience
 *
 * SOCIALIZED MIND (Stage 3):
 * - Subject TO relationships, others' opinions, external approval
 * - "I am my relationships" - can't step back from them
 * - Conflict = threat to self (because self = relationships)
 * - Seeks approval, afraid of disappointing others
 *
 * SELF-AUTHORING MIND (Stage 4):
 * - Has OWN values, standards, identity independent of others
 * - Can reflect on relationships (relationship is object, not subject)
 * - Conflict = problem to solve
 * - Seeks competence, self-direction, achievement
 *
 * SELF-TRANSFORMING MIND (Stage 5):
 * - Can hold multiple systems/perspectives simultaneously
 * - Comfortable with paradox, incompleteness, not-knowing
 * - Identity is fluid process, not fixed self
 * - Seeks integration, wholeness, paradox-holding
 */
export function detectDevelopmentalStage(
  userMessage: string,
  context?: { recentPatterns?: string[] }
): DevelopmentalStage {

  const msg = userMessage.toLowerCase();

  // STAGE 5: SELF-TRANSFORMING MIND MARKERS
  const selfTransformingMarkers = [
    /both.*and|paradox|hold.*contradiction|multiple perspectives/i,
    /don't know|uncertain|mystery|unknowing/i,
    /becoming|evolving|transforming|fluid/i,
    /parts of me|different selves|multiple truths/i,
    /question my own (assumptions|beliefs|identity)/i,
  ];

  let stage5Score = 0;
  selfTransformingMarkers.forEach(pattern => {
    if (pattern.test(msg)) stage5Score++;
  });

  // STAGE 4: SELF-AUTHORING MIND MARKERS
  const selfAuthoringMarkers = [
    /my values|my standards|my goals|my vision/i,
    /I decided|I choose|I determined|I set/i,
    /according to my|based on my|my own/i,
    /I am responsible|I own|I'm accountable/i,
    /my plan|my system|my framework/i,
  ];

  let stage4Score = 0;
  selfAuthoringMarkers.forEach(pattern => {
    if (pattern.test(msg)) stage4Score++;
  });

  // STAGE 3: SOCIALIZED MIND MARKERS
  const socializedMarkers = [
    /what (should|will) (I|they)|what do (you|they) think/i,
    /disappointed|let.*down|approve|disapprove/i,
    /they want|they expect|they need|supposed to/i,
    /I can't because.*they|if I.*they'll/i,
    /good (daughter|son|partner|friend|employee)/i,
  ];

  let stage3Score = 0;
  socializedMarkers.forEach(pattern => {
    if (pattern.test(msg)) stage3Score++;
  });

  // TRANSITION MARKERS (growing edge, developmental tension)
  const transitionMarkers = [
    /I know I should.*but|part of me.*part of me/i,
    /torn between|caught between|struggling with/i,
    /outgrowing|too small|ready for more/i,
    /old self|who I was|who I'm becoming/i,
  ];

  const inTransition = transitionMarkers.some(p => p.test(msg));

  // ASSESSMENT
  if (stage5Score >= 2) {
    return {
      stage: 'self_transforming_mind',
      name: 'Self-Transforming Mind',
      subjectObject: 'Subject: Relationship to systems. Object: The systems themselves, identity, ideology',
      needs: ['Paradox-holding spaces', 'Permission for incompleteness', 'Multiple perspective integration'],
      growing_edge: inTransition ? 'Deepening comfort with groundlessness and mystery' : undefined
    };
  }

  if (stage4Score >= 2) {
    return {
      stage: 'self_authoring_mind',
      name: 'Self-Authoring Mind',
      subjectObject: 'Subject: Own identity, values, system. Object: Relationships, social expectations',
      needs: ['Autonomy support', 'Competence recognition', 'Space for self-direction'],
      growing_edge: inTransition
        ? 'Being invited to question own system, hold multiple truths'
        : undefined
    };
  }

  if (stage3Score >= 2) {
    return {
      stage: 'socialized_mind',
      name: 'Socialized Mind',
      subjectObject: 'Subject: Relationships, others\' opinions. Object: Own needs, concrete thinking',
      needs: ['Approval and belonging', 'Clarity about expectations', 'Relational safety'],
      growing_edge: inTransition
        ? 'Discovering own values separate from others\' expectations'
        : undefined
    };
  }

  // DEFAULT: Likely in transition between stages
  return {
    stage: 'transition',
    name: 'Transitional Space',
    subjectObject: 'Moving between stages - old structure dissolving, new not yet formed',
    needs: ['Holding through uncertainty', 'Validation of both old and new', 'Patience with process'],
    growing_edge: 'Trusting the developmental process'
  };
}

// ============================================================================
// WILBER: INTEGRAL QUADRANTS MAPPING
// ============================================================================

/**
 * Map experience into Wilber's 4 quadrants
 * Most people are "quadrant absolutists" - only see 1 or 2 quadrants
 * Integral = seeing all 4 simultaneously
 *
 * UPPER LEFT (UL): Interior Individual - "I" space
 * - Thoughts, feelings, consciousness, intentions, subjective experience
 *
 * UPPER RIGHT (UR): Exterior Individual - "It" space
 * - Behaviors, body, neuroscience, measurable individual actions
 *
 * LOWER LEFT (LL): Interior Collective - "We" space
 * - Culture, shared meaning, relationships, intersubjective understanding
 *
 * LOWER RIGHT (LR): Exterior Collective - "Its" space
 * - Systems, structures, institutions, social/technical systems
 */
export function mapToIntegralQuadrants(userMessage: string): IntegralQuadrants {

  const msg = userMessage.toLowerCase();

  const quadrants: IntegralQuadrants = {
    upperLeft: [],
    upperRight: [],
    lowerLeft: [],
    lowerRight: [],
  };

  // UPPER LEFT: Interior Individual (I)
  const ulPatterns = [
    { pattern: /I feel|I think|I believe|I sense/i, element: 'Subjective experience/consciousness' },
    { pattern: /my (intention|desire|fear|hope)/i, element: 'Interior motivations' },
    { pattern: /I wonder|I imagine|I dream/i, element: 'Interior imagination/possibility' },
    { pattern: /meaning|purpose|soul|spirit/i, element: 'Meaning-making consciousness' },
  ];

  ulPatterns.forEach(({ pattern, element }) => {
    if (pattern.test(msg)) quadrants.upperLeft.push(element);
  });

  // UPPER RIGHT: Exterior Individual (It)
  const urPatterns = [
    { pattern: /my body|physical|health|sleep|exercise/i, element: 'Physical body/health' },
    { pattern: /behavior|action|doing|practice/i, element: 'Observable behaviors' },
    { pattern: /brain|nervous system|neuroscience/i, element: 'Neurobiology' },
    { pattern: /measur|track|data|quantif/i, element: 'Measurable outcomes' },
  ];

  urPatterns.forEach(({ pattern, element }) => {
    if (pattern.test(msg)) quadrants.upperRight.push(element);
  });

  // LOWER LEFT: Interior Collective (We)
  const llPatterns = [
    { pattern: /we|us|our|together/i, element: 'Shared "we" space' },
    { pattern: /culture|relationship|community|belonging/i, element: 'Cultural/relational field' },
    { pattern: /understand each other|shared meaning|mutual/i, element: 'Intersubjective understanding' },
    { pattern: /values|norms|what we believe/i, element: 'Shared values/worldview' },
  ];

  llPatterns.forEach(({ pattern, element }) => {
    if (pattern.test(msg)) quadrants.lowerLeft.push(element);
  });

  // LOWER RIGHT: Exterior Collective (Its)
  const lrPatterns = [
    { pattern: /system|structure|institution|organization/i, element: 'Systems/structures' },
    { pattern: /society|economic|political|social/i, element: 'Social systems' },
    { pattern: /environment|ecological|infrastructure/i, element: 'Environmental/technical systems' },
    { pattern: /process|workflow|procedure/i, element: 'Systemic processes' },
  ];

  lrPatterns.forEach(({ pattern, element }) => {
    if (pattern.test(msg)) quadrants.lowerRight.push(element);
  });

  return quadrants;
}

/**
 * Identify which quadrants are MISSING from user's awareness
 * This is where growth/integration is needed
 */
export function identifyMissingQuadrants(quadrants: IntegralQuadrants): string[] {
  const missing: string[] = [];

  if (quadrants.upperLeft.length === 0) {
    missing.push('Interior Individual (I) - Your subjective experience, feelings, consciousness');
  }
  if (quadrants.upperRight.length === 0) {
    missing.push('Exterior Individual (It) - Your body, behaviors, observable actions');
  }
  if (quadrants.lowerLeft.length === 0) {
    missing.push('Interior Collective (We) - Relationships, culture, shared meaning');
  }
  if (quadrants.lowerRight.length === 0) {
    missing.push('Exterior Collective (Its) - Systems, structures, environment');
  }

  return missing;
}

// ============================================================================
// BUBER: I-THOU vs I-IT RELATIONAL MODE
// ============================================================================

/**
 * Detect relational mode: I-Thou (sacred presence) vs I-It (objectification)
 *
 * I-IT:
 * - Treating self/others as objects, problems, mechanisms
 * - Utilitarian, transactional, fixing/using
 * - "How can I use/fix/optimize this?"
 *
 * I-THOU:
 * - Encountering self/others as whole sacred beings
 * - Relational presence, meeting, dialogue
 * - "How can I be WITH this?"
 */
export function detectRelationalMode(userMessage: string): RelationalMode {

  const msg = userMessage.toLowerCase();

  // I-IT MARKERS
  const iItMarkers = [
    /use|utilize|tool|mechanism|function/i,
    /fix|solve|optimize|improve|manage/i,
    /get (them|him|her|it) to|make (them|him|her|it)/i,
    /object|thing|it|resource/i,
    /efficient|productive|useful|functional/i,
  ];

  let itScore = 0;
  iItMarkers.forEach(pattern => {
    if (pattern.test(msg)) itScore++;
  });

  // I-THOU MARKERS
  const iThouMarkers = [
    /presence|being with|encounter|meet/i,
    /sacred|holy|divine|soul/i,
    /listen|hear|receive|witness/i,
    /relationship|connection|communion/i,
    /whole person|full being|as they are/i,
  ];

  let thouScore = 0;
  iThouMarkers.forEach(pattern => {
    if (pattern.test(msg)) thouScore++;
  });

  if (itScore > thouScore && itScore >= 2) {
    return {
      mode: 'I_It',
      description: 'Relating to self/others as objects, problems, or mechanisms to be managed',
      invitation: 'Return to I-Thou: What if this isn\'t a problem to solve, but a presence to be WITH?'
    };
  }

  if (thouScore >= 2) {
    return {
      mode: 'I_Thou',
      description: 'Relating to self/others as whole sacred beings, present and met'
    };
  }

  // Default: Neutral/mixed
  return {
    mode: 'I_It',
    description: 'Primarily functional/transactional relating',
    invitation: 'Invitation: Shift from "What can I do about this?" to "How can I be WITH this?"'
  };
}

// ============================================================================
// HOLDING ENVIRONMENT GENERATION
// ============================================================================

/**
 * Generate Kegan-style holding environment
 * CONFIRM (meet them where they are)
 * CONTRADICT (invite developmental edge)
 * CONTINUITY (hold them through transition)
 */
export function generateHoldingEnvironment(
  stage: DevelopmentalStage,
  quadrants: IntegralQuadrants,
  relationalMode: RelationalMode,
  userMessage: string
): HoldingEnvironment {

  // CONFIRM: Validate current stage
  let confirms = '';
  switch (stage.stage) {
    case 'socialized_mind':
      confirms = 'I see how much you care about these relationships and meeting others\' expectations. That loyalty and attunement to others is beautiful.';
      break;
    case 'self_authoring_mind':
      confirms = 'I see your self-direction and commitment to your own values. That clarity and ownership is powerful.';
      break;
    case 'self_transforming_mind':
      confirms = 'I see you holding multiple perspectives, comfortable with paradox and not-knowing. That wisdom is rare.';
      break;
    case 'transition':
      confirms = 'I see you in the sacred space between who you were and who you\'re becoming. This disorientation makes sense.';
      break;
  }

  // CONTRADICT: Invite developmental edge
  let contradicts = '';
  if (stage.growing_edge) {
    contradicts = `Growing edge: ${stage.growing_edge}`;
  } else {
    switch (stage.stage) {
      case 'socialized_mind':
        contradicts = 'What if you could honor your relationships AND discover your own truth? What do YOU want, beneath what others want?';
        break;
      case 'self_authoring_mind':
        contradicts = 'What if your system/identity could hold paradox? What truths might exist beyond your current framework?';
        break;
      case 'self_transforming_mind':
        contradicts = 'Can you trust the groundlessness even more fully? What wants to emerge from the mystery?';
        break;
      case 'transition':
        contradicts = 'Can you trust that dissolution is part of development? The old form is composting into new ground.';
        break;
    }
  }

  // CONTINUITY: Hold them through transition
  const missingQuadrants = identifyMissingQuadrants(quadrants);
  let continuity = 'I\'m here with you through this. ';

  if (missingQuadrants.length > 0) {
    continuity += `Let's also notice: ${missingQuadrants[0]}. That perspective might help integrate this experience.`;
  } else {
    continuity += 'You\'re seeing this from multiple perspectives - that integral view will hold you through.';
  }

  return {
    confirms,
    contradicts,
    continuity,
    relationalMode
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const DevelopmentalHolding = {
  detectDevelopmentalStage,
  mapToIntegralQuadrants,
  identifyMissingQuadrants,
  detectRelationalMode,
  generateHoldingEnvironment,
};

export default DevelopmentalHolding;
