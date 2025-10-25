/**
 * ARCHETYPAL INTEGRATION BRIDGE
 *
 * Connects the Light/Dark/Depth system to existing MAIA archetype detection
 * Enhances PersonalOracleAgent, ArchetypeRouter, and Voice systems
 */

import {
  detectArchetypalState,
  generateGuidance,
  processArchetypalConversation,
  type ArchetypalDetection,
  type ConversationGuidance
} from './ArchetypalConversationEngine';

import {
  getElementalExpression,
  getZodiacExpression,
  getReflectionQuestions,
  getIntegrationPractices
} from '@/lib/knowledge/ArchetypalLightDarkSystem';

import { chooseArchetype, type Archetype } from '@/lib/voice/ArchetypeRouter';
import { SpiralogicElement } from '@/lib/astrology/spiralogicMapping';

// ============== TYPES ==============

export interface EnhancedArchetypalResponse {
  // Original archetype detection
  archetype: Archetype;

  // Light/Dark/Depth detection
  lightDarkDetection: ArchetypalDetection | null;

  // Guidance
  guidance: ConversationGuidance | null;

  // Formatted response with dialectical layers
  response: string;

  // Practices and questions
  practices: string[];
  questions: string[];

  // Metadata
  confidence: number;
  state: 'light' | 'dark' | 'transition' | 'unknown';
}

// ============== ARCHETYPE ROUTER ENHANCEMENT ==============

/**
 * Enhanced archetype detection that includes Light/Dark/Depth awareness
 */
export function detectArchetypeWithDepth(userMessage: string): EnhancedArchetypalResponse {
  // Original archetype detection (from ArchetypeRouter)
  const basicArchetype = chooseArchetype(userMessage);

  // Map to SpiralogicElement
  const element = mapArchetypeToElement(basicArchetype);

  // Detect Light/Dark/Transition state
  const detections = detectArchetypalState(userMessage);
  const primaryDetection = detections.find(d => d.element === element) || detections[0] || null;

  // Generate guidance
  const guidance = primaryDetection ? generateGuidance(primaryDetection) : null;

  // Get practices and questions
  const elementalExpression = getElementalExpression(element);
  const practices = elementalExpression.expression.goDeeper.integrationPractices;
  const questions = elementalExpression.expression.goDeeper.reflectionQuestions;

  // Format response
  const response = formatEnhancedResponse(basicArchetype, primaryDetection, guidance);

  return {
    archetype: basicArchetype,
    lightDarkDetection: primaryDetection,
    guidance,
    response,
    practices,
    questions,
    confidence: primaryDetection?.confidence || 0.5,
    state: primaryDetection?.state || 'unknown'
  };
}

/**
 * Map basic Archetype to SpiralogicElement
 */
function mapArchetypeToElement(archetype: Archetype): SpiralogicElement {
  const mapping: Record<Archetype, SpiralogicElement> = {
    'Fire': 'fire',
    'Water': 'water',
    'Earth': 'earth',
    'Air': 'air',
    'Aether': 'aether'
  };
  return mapping[archetype];
}

/**
 * Format enhanced response with dialectical layers
 */
function formatEnhancedResponse(
  archetype: Archetype,
  detection: ArchetypalDetection | null,
  guidance: ConversationGuidance | null
): string {
  if (!detection || !guidance) {
    return `I sense ${archetype} energy calling. Let me hold space for what's emerging.`;
  }

  let response = '';

  // Acknowledgment
  response += guidance.acknowledgment + '\n\n';

  // Reflection
  response += guidance.reflection + '\n\n';

  // Practice (if dark or transition state)
  if (guidance.practice && (detection.state === 'dark' || detection.state === 'transition')) {
    response += `**Integration Practice:** ${guidance.practice}\n\n`;
  }

  // Invitation
  if (guidance.invitation) {
    response += `**Invitation:** ${guidance.invitation}\n\n`;
  }

  // Question
  if (guidance.question) {
    response += guidance.question;
  }

  return response;
}

// ============== VOICE ORCHESTRATOR ENHANCEMENT ==============

/**
 * Enhance voice style based on Light/Dark state
 */
export function getVoiceStyleForState(
  element: SpiralogicElement,
  state: 'light' | 'dark' | 'transition' | 'unknown'
): {
  tone: string;
  pacing: 'fast' | 'moderate' | 'slow' | 'thoughtful';
  emphasis: string;
} {
  const baseStyle = {
    fire: { tone: 'energetic', pacing: 'fast' as const, emphasis: 'inspiring' },
    water: { tone: 'flowing', pacing: 'moderate' as const, emphasis: 'empathetic' },
    earth: { tone: 'grounded', pacing: 'slow' as const, emphasis: 'practical' },
    air: { tone: 'clear', pacing: 'moderate' as const, emphasis: 'clarifying' },
    aether: { tone: 'ethereal', pacing: 'thoughtful' as const, emphasis: 'integrative' }
  };

  const style = baseStyle[element];

  // Adjust for dark state - slower, more compassionate
  if (state === 'dark') {
    return {
      ...style,
      pacing: 'thoughtful' as const,
      emphasis: 'compassionate'
    };
  }

  // Adjust for transition - moderate, supportive
  if (state === 'transition') {
    return {
      ...style,
      pacing: 'moderate' as const,
      emphasis: 'supportive'
    };
  }

  return style;
}

// ============== SYSTEM PROMPT ENHANCEMENT ==============

/**
 * Generate enhanced system prompt that includes Light/Dark awareness
 */
export function generateEnhancedSystemPrompt(
  basePrompt: string,
  userContext?: {
    dominantElement?: SpiralogicElement;
    currentState?: 'light' | 'dark' | 'transition';
    zodiacSign?: string;
  }
): string {
  let enhancedPrompt = basePrompt;

  if (userContext?.dominantElement) {
    const elementalArch = getElementalExpression(userContext.dominantElement);
    const expression = elementalArch.expression;

    enhancedPrompt += `\n\n## CURRENT ARCHETYPAL CONTEXT\n\n`;
    enhancedPrompt += `The user is currently expressing ${userContext.dominantElement.toUpperCase()} energy.\n\n`;

    if (userContext.currentState === 'light') {
      enhancedPrompt += `**LIGHT EXPRESSION DETECTED:**\n`;
      enhancedPrompt += `- ${expression.whenLight.energyState}\n`;
      enhancedPrompt += `- Honor and amplify: ${expression.whenLight.gifts[0]}\n`;
      enhancedPrompt += `- Support by: ${expression.goDeeper.transformationInvitations[0]}\n\n`;
    }

    if (userContext.currentState === 'dark') {
      enhancedPrompt += `**SHADOW EXPRESSION DETECTED:**\n`;
      enhancedPrompt += `- Warning sign: ${expression.whenDark.warningSign}\n`;
      enhancedPrompt += `- Healing pathway: ${expression.goDeeper.healingPathway}\n`;
      enhancedPrompt += `- Gentle invitation: ${expression.goDeeper.transformationInvitations[0]}\n\n`;
      enhancedPrompt += `**APPROACH:** Hold compassionate space without judgment. Offer the shadow as ally, not enemy.\n\n`;
    }

    if (userContext.currentState === 'transition') {
      enhancedPrompt += `**TRANSITION STATE DETECTED:**\n`;
      enhancedPrompt += `- Moving through: ${expression.goDeeper.healingPathway}\n`;
      enhancedPrompt += `- Support practice: ${expression.goDeeper.integrationPractices[0]}\n\n`;
    }

    enhancedPrompt += `**KEY REFLECTION QUESTION:**\n${expression.goDeeper.reflectionQuestions[0]}\n`;
  }

  return enhancedPrompt;
}

// ============== PERSONAL ORACLE AGENT ENHANCEMENT ==============

/**
 * Enhance Oracle response with archetypal depth
 */
export async function enhanceOracleResponse(
  userMessage: string,
  baseResponse: string,
  options?: {
    includeArchetypalGuidance?: boolean;
    includePractices?: boolean;
    includeQuestions?: boolean;
  }
): Promise<string> {
  const {
    includeArchetypalGuidance = true,
    includePractices = true,
    includeQuestions = true
  } = options || {};

  // Detect archetypal state
  const archetypalResponse = detectArchetypeWithDepth(userMessage);

  let enhancedResponse = baseResponse;

  // Add archetypal guidance if detected
  if (includeArchetypalGuidance && archetypalResponse.guidance) {
    enhancedResponse += '\n\n---\n\n';
    enhancedResponse += '## Archetypal Reflection\n\n';
    enhancedResponse += archetypalResponse.guidance.acknowledgment + '\n\n';
    enhancedResponse += archetypalResponse.guidance.reflection + '\n\n';
  }

  // Add practices if in dark/transition state
  if (
    includePractices &&
    archetypalResponse.practices.length > 0 &&
    (archetypalResponse.state === 'dark' || archetypalResponse.state === 'transition')
  ) {
    enhancedResponse += '**Integration Practices:**\n';
    archetypalResponse.practices.slice(0, 3).forEach((practice, i) => {
      enhancedResponse += `${i + 1}. ${practice}\n`;
    });
    enhancedResponse += '\n';
  }

  // Add reflection question
  if (includeQuestions && archetypalResponse.questions.length > 0) {
    enhancedResponse += '**Reflection:**\n';
    enhancedResponse += archetypalResponse.questions[0];
  }

  return enhancedResponse;
}

// ============== MEMORY INTEGRATION ==============

/**
 * Track archetypal states over time for pattern recognition
 */
export interface ArchetypalMemory {
  timestamp: Date;
  element: SpiralogicElement;
  state: 'light' | 'dark' | 'transition' | 'unknown';
  confidence: number;
  userMessage: string;
  guidance: ConversationGuidance | null;
}

export class ArchetypalMemoryTracker {
  private memories: ArchetypalMemory[] = [];

  track(userMessage: string): ArchetypalMemory {
    const detection = detectArchetypeWithDepth(userMessage);
    const element = mapArchetypeToElement(detection.archetype);

    const memory: ArchetypalMemory = {
      timestamp: new Date(),
      element,
      state: detection.state,
      confidence: detection.confidence,
      userMessage,
      guidance: detection.guidance
    };

    this.memories.push(memory);
    return memory;
  }

  getPattern(timeWindowDays: number = 30): {
    dominantElement: SpiralogicElement;
    dominantState: 'light' | 'dark' | 'transition';
    stateTransitions: Array<{ from: string; to: string; date: Date }>;
  } {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - timeWindowDays);

    const recent = this.memories.filter(m => m.timestamp >= cutoff);

    // Count element occurrences
    const elementCounts: Record<string, number> = {};
    const stateCounts: Record<string, number> = {};

    recent.forEach(m => {
      elementCounts[m.element] = (elementCounts[m.element] || 0) + 1;
      stateCounts[m.state] = (stateCounts[m.state] || 0) + 1;
    });

    const dominantElement = Object.entries(elementCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] as SpiralogicElement || 'aether';

    const dominantState = Object.entries(stateCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] as any || 'unknown';

    // Track transitions
    const transitions: Array<{ from: string; to: string; date: Date }> = [];
    for (let i = 1; i < recent.length; i++) {
      if (recent[i].state !== recent[i - 1].state) {
        transitions.push({
          from: recent[i - 1].state,
          to: recent[i].state,
          date: recent[i].timestamp
        });
      }
    }

    return {
      dominantElement,
      dominantState,
      stateTransitions: transitions
    };
  }

  getInsight(): string {
    const pattern = this.getPattern();
    const element = pattern.dominantElement;
    const state = pattern.dominantState;

    const elementalArch = getElementalExpression(element);

    let insight = `Over the past 30 days, I notice ${element.toUpperCase()} energy as your dominant archetypal pattern.\n\n`;

    if (state === 'light') {
      insight += `You've been expressing this in its light form: ${elementalArch.expression.whenLight.energyState}.\n\n`;
      insight += `This is serving you through: ${elementalArch.expression.whenLight.gifts[0].toLowerCase()}.\n\n`;
      insight += `To deepen this light expression: ${elementalArch.expression.goDeeper.transformationInvitations[0]}`;
    } else if (state === 'dark') {
      insight += `You've been experiencing this in shadow form: ${elementalArch.expression.whenDark.warningSign.toLowerCase()}.\n\n`;
      insight += `The healing pathway: ${elementalArch.expression.goDeeper.healingPathway}.\n\n`;
      insight += `Integration practice: ${elementalArch.expression.goDeeper.integrationPractices[0]}`;
    } else {
      insight += `You've been in transition, moving through transformation.\n\n`;
      insight += `The pathway: ${elementalArch.expression.goDeeper.healingPathway}.\n\n`;
      insight += `Support practice: ${elementalArch.expression.goDeeper.integrationPractices[1] || elementalArch.expression.goDeeper.integrationPractices[0]}`;
    }

    if (pattern.stateTransitions.length > 0) {
      insight += `\n\n**Pattern Recognition:**\nYou've moved through ${pattern.stateTransitions.length} archetypal transitions recently, showing active transformation work.`;
    }

    return insight;
  }
}

// ============== UTILITY FUNCTIONS ==============

/**
 * Check if user might benefit from archetypal insight
 */
export function shouldOfferArchetypalInsight(userMessage: string): boolean {
  const detections = detectArchetypalState(userMessage);

  // Offer insight if:
  // 1. High confidence detection (> 0.7)
  // 2. Dark or transition state detected
  // 3. Multiple archetypes detected (complex state)

  if (detections.length === 0) return false;

  const primary = detections[0];

  return (
    primary.confidence > 0.7 ||
    primary.state === 'dark' ||
    primary.state === 'transition' ||
    detections.length >= 2
  );
}

/**
 * Get quick archetypal snapshot for UI display
 */
export function getArchetypalSnapshot(userMessage: string): {
  element: SpiralogicElement;
  state: string;
  icon: string;
  color: string;
  oneLineSummary: string;
} | null {
  const detections = detectArchetypalState(userMessage);
  if (detections.length === 0) return null;

  const primary = detections[0];

  const icons: Record<SpiralogicElement, string> = {
    fire: '🔥',
    water: '💧',
    earth: '🌍',
    air: '🌬️',
    aether: '✨'
  };

  const colors: Record<SpiralogicElement, string> = {
    fire: 'text-orange-600',
    water: 'text-blue-600',
    earth: 'text-green-600',
    air: 'text-yellow-600',
    aether: 'text-purple-600'
  };

  const summaries = {
    light: `${primary.element} energy radiating in light`,
    dark: `${primary.element} shadow calling for attention`,
    transition: `${primary.element} in transformation`,
    unknown: `${primary.element} energy present`
  };

  return {
    element: primary.element,
    state: primary.state,
    icon: icons[primary.element],
    color: colors[primary.element],
    oneLineSummary: summaries[primary.state as keyof typeof summaries]
  };
}

// ============== EXPORTS ==============

export {
  detectArchetypalState,
  generateGuidance,
  processArchetypalConversation
} from './ArchetypalConversationEngine';
