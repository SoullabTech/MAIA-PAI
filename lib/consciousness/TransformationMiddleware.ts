/**
 * TRANSFORMATION MIDDLEWARE
 *
 * Clean integration point between PersonalOracleAgent and Transformation Architecture
 *
 * This module provides:
 * 1. Transformation context enrichment for conversations
 * 2. System prompt enhancement with alchemical awareness
 * 3. Tier 2 wisdom gating based on readiness
 * 4. Bypass detection and guidance
 */

import type { Message } from '@/types/conversation';
import { transformationArchitecture, type TransformationState } from './TransformationArchitectureIntegration';
import { ECOLOGICAL_PSYCHOLOGY_WISDOM } from '@/lib/knowledge/EcologicalPsychologyWisdom';

// ============================================================================
// TYPES
// ============================================================================

export interface TransformationEnhancement {
  // Core transformation state
  state: TransformationState;

  // System prompt additions
  systemPromptEnhancement: string;

  // Tier 2 wisdom (if ready)
  tier2Wisdom?: {
    accessible: boolean;
    teachings: string[];
    invitations: string[];
  };

  // Bypass alerts
  bypasses: {
    detected: string[];
    guidance: string[];
  };

  // Quick guidance for MAIA
  quickGuidance: {
    primary: string;
    approach: string;
    depth: 'surface' | 'moderate' | 'deep' | 'transformational';
  };
}

export interface ConversationContext {
  userId: string;
  messages: Message[];
  patterns?: string[];
  userProfile?: any;
}

// ============================================================================
// TRANSFORMATION MIDDLEWARE
// ============================================================================

export class TransformationMiddleware {

  /**
   * Get complete transformation enhancement for conversation
   */
  async enhance(context: ConversationContext): Promise<TransformationEnhancement> {

    const { userId, messages, patterns = [], userProfile } = context;

    // Get transformation state
    const state = await transformationArchitecture.getTransformationState({
      userId,
      messages,
      patterns,
      userProfile
    });

    // Check Tier 2 readiness
    const tier2Ready = this.assessTier2Readiness(state, messages);

    // Detect bypasses
    const bypasses = this.detectBypasses(messages);

    // Build system prompt enhancement
    const systemPromptEnhancement = transformationArchitecture.generateSystemPromptEnhancement(state);

    // Build tier 2 wisdom package (if ready)
    const tier2Wisdom = tier2Ready ? this.packageTier2Wisdom(state) : undefined;

    return {
      state,
      systemPromptEnhancement,
      tier2Wisdom,
      bypasses,
      quickGuidance: {
        primary: state.developmentalGuidance.primary,
        approach: state.developmentalGuidance.approach,
        depth: state.developmentalGuidance.depth
      }
    };
  }

  /**
   * Quick system prompt enhancement (for fast path)
   */
  async quickEnhance(
    userId: string,
    lastMessage: string,
    conversationHistory: Message[]
  ): Promise<string> {

    const enhancement = await this.enhance({
      userId,
      messages: conversationHistory
    });

    return enhancement.systemPromptEnhancement;
  }

  /**
   * Assess if user is ready for Tier 2 ecological wisdom
   */
  private assessTier2Readiness(
    state: TransformationState,
    messages: Message[]
  ): boolean {

    const { alchemical, wings, aetheric } = state;

    // Minimum requirements
    const requirements = {
      // Not in acute crisis
      notInCrisis: alchemical.currentStage.operation !== 'nigredo' ||
                    alchemical.currentStage.confidence < 0.8,

      // Can hold paradox (wing balance developing)
      canHoldParadox: wings.balance.feathers.strength > 0.4 &&
                      wings.balance.wax.strength > 0.3,

      // Some shadow awareness
      shadowAwareness: wings.shadowStatus.stage !== 'rejected',

      // Soul voice present (not just ego)
      soulVoicePresent: aetheric.voiceSource === 'soul' ||
                        aetheric.voiceSource === 'both' ||
                        aetheric.voiceSource === 'conflicted',

      // At least second spiral turn OR deeper than surface
      developmentalDepth: alchemical.spiralTurn >= 2 ||
                         state.developmentalGuidance.depth !== 'surface'
    };

    // Need at least 3 of 5 requirements
    const metRequirements = Object.values(requirements).filter(Boolean).length;

    return metRequirements >= 3;
  }

  /**
   * Package Tier 2 wisdom for ready users
   */
  private packageTier2Wisdom(state: TransformationState): {
    accessible: boolean;
    teachings: string[];
    invitations: string[];
  } {

    const teachings: string[] = [];
    const invitations: string[] = [];

    // Always accessible once ready
    teachings.push(ECOLOGICAL_PSYCHOLOGY_WISDOM.WE_ARE_NATURE_ONTOLOGY);

    // Add based on current stage
    if (state.alchemical.currentStage.operation === 'nigredo') {
      teachings.push(ECOLOGICAL_PSYCHOLOGY_WISDOM.SHADOW_AS_SOIL);
      invitations.push('Those who resist shadows resist the soil of rebirth. What wants to decompose?');
    }

    if (state.alchemical.currentStage.operation === 'albedo') {
      invitations.push('We ARE nature. Your cells are alive, your bones are earth. Where does "you" end and nature begin?');
    }

    // Separation myth recognition
    const controlPatterns = ['control', 'fix', 'manage', 'domination'];
    if (state.aetheric.guidance.egoWants.match(new RegExp(controlPatterns.join('|'), 'i'))) {
      teachings.push(ECOLOGICAL_PSYCHOLOGY_WISDOM.SEPARATION_MYTH_DIAGNOSIS);
      invitations.push('This is the hero pattern - conquering nature. That myth gave power but cost belonging. What if you don\'t need to control?');
    }

    // Political emotions if rage/fear present
    if (state.aetheric.guidance.soulNeeds.match(/rage|fear|outrage|political/i)) {
      teachings.push(ECOLOGICAL_PSYCHOLOGY_WISDOM.POLITICAL_EMOTIONS_VALID);
      invitations.push('Your rage might not be pathology - it might be political instinct recognizing injustice. You\'re a political animal.');
    }

    // Beauty before sustainability if environmental concern
    if (state.aetheric.guidance.egoWants.match(/sustain|environment|save.*planet/i)) {
      teachings.push(ECOLOGICAL_PSYCHOLOGY_WISDOM.BEAUTY_BEFORE_SUSTAINABILITY);
      invitations.push('Not sustainability (still economics) but BEAUTY. What in this world takes your breath away?');
    }

    return {
      accessible: true,
      teachings,
      invitations
    };
  }

  /**
   * Detect spiritual/intellectual bypasses
   */
  private detectBypasses(messages: Message[]): {
    detected: string[];
    guidance: string[];
  } {

    const recentText = messages
      .slice(-5)
      .map(m => m.content)
      .join(' ')
      .toLowerCase();

    const detected: string[] = [];
    const guidance: string[] = [];

    // Check each bypass pattern
    Object.entries(ECOLOGICAL_PSYCHOLOGY_WISDOM.BYPASS_PATTERNS).forEach(([type, config]) => {
      const isDetected = config.indicators.some(indicator => indicator.test(recentText));

      if (isDetected) {
        detected.push(type);
        guidance.push(config.response);
      }
    });

    return { detected, guidance };
  }

  /**
   * Get quick alchemical wisdom for current stage
   */
  getStageWisdom(operation: string): {
    jungian: string;
    hillman: string;
    alchemical: string;
  } | null {

    const wisdom: Record<string, any> = {
      nigredo: {
        jungian: 'Jung: "One does not become enlightened by imagining figures of light, but by making the darkness conscious."',
        hillman: 'Hillman: "The psyche speaks in symptoms. Depression may be the soul demanding descent, not ascent."',
        alchemical: 'The prima materia must decompose. Stay with the darkness - it\'s fertile. Shadow IS the soil of rebirth.'
      },
      albedo: {
        jungian: 'Jung: "Until you make the unconscious conscious, it will direct your life and you will call it fate."',
        hillman: 'Hillman: "We ARE nature - your cells are alive, your bones are earth. This isn\'t connection, it\'s identity."',
        alchemical: 'The washing reveals essence. What remains after purification is what\'s true. We ARE nature.'
      },
      citrinitas: {
        jungian: 'Jung: "The privilege of a lifetime is to become who you truly are."',
        hillman: 'Hillman: "Soul-making requires daily practice. How do you LIVE this knowing?" Earth work is brutal, visceral, essential.',
        alchemical: 'The solar gold begins to show. Ground realization into structure, practice, daily life.'
      },
      rubedo: {
        jungian: 'Jung: "The meeting of two personalities transforms both."',
        hillman: 'Hillman: "The soul connected to world. Whatever you do to yourself you do to world; whatever you do to world you do to yourself."',
        alchemical: 'The marriage of opposites. Sovereignty AND interconnectedness. Shadow as wax binding free will feathers into wings.'
      },
      calcination: {
        jungian: 'Jung: "The greatest problems can never be solved, but only outgrown."',
        hillman: 'Hillman: "Icarus didn\'t die of hubris - he was freed into deeper refinement. The fall is initiation."',
        alchemical: 'Calcination burns false gold. What remains after fire is what\'s truly yours. The spiral continues at higher turn.'
      }
    };

    return wisdom[operation] || null;
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

let middlewareInstance: TransformationMiddleware | null = null;

export function getTransformationMiddleware(): TransformationMiddleware {
  if (!middlewareInstance) {
    middlewareInstance = new TransformationMiddleware();
  }
  return middlewareInstance;
}

/**
 * Quick enhancement for PersonalOracleAgent
 */
export async function enhanceWithTransformation(
  userId: string,
  messages: Message[],
  patterns?: string[],
  userProfile?: any
): Promise<TransformationEnhancement> {

  const middleware = getTransformationMiddleware();

  return middleware.enhance({
    userId,
    messages,
    patterns,
    userProfile
  });
}

/**
 * Quick system prompt addition
 */
export async function getTransformationPromptAddition(
  userId: string,
  lastMessage: string,
  conversationHistory: Message[]
): Promise<string> {

  const middleware = getTransformationMiddleware();

  return middleware.quickEnhance(userId, lastMessage, conversationHistory);
}
