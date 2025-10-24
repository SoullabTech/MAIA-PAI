/**
 * TRANSFORMATION ARCHITECTURE INTEGRATION
 *
 * Unifies the alchemical intelligence systems with existing Spiralogic/Sovereignty
 *
 * Architecture Layers:
 * 1. AETHERIC WISDOM - Soul vs ego detection, guides toward what's needed
 * 2. ALCHEMICAL STAGES - Which operation (nigredo/albedo/citrinitas/rubedo/calcination)
 * 3. WINGS BALANCE - Sovereignty (feathers) + Shadow Integration (wax)
 * 4. SPIRALOGIC - Elemental progression (Fire→Water→Earth→Air→Aether)
 * 5. SOVEREIGNTY - Initiation/Promotion/Graduation gates
 *
 * This module orchestrates all layers to give MAIA complete developmental awareness
 */

import type { Message } from '@/types/conversation';
import { aethericWisdom, type AethericGuidance } from './AethericWisdomLayer';
import { alchemicalDetector, type AlchemicalStage } from './AlchemicalStageDetector';
import { wingsOfRedemption, type WingBalance, type ShadowIntegrationStatus } from './WingsOfRedemption';

// ============================================================================
// TYPES
// ============================================================================

export type SovereigntyStage = 'seeker' | 'initiate' | 'adept' | 'sovereign' | 'guide';

export type SpiralogicElement = 'fire' | 'water' | 'earth' | 'air' | 'aether';

export interface TransformationState {
  // Aetheric Layer
  aetheric: {
    voiceSource: 'ego' | 'soul' | 'both' | 'conflicted';
    guidance: AethericGuidance;
  };

  // Alchemical Layer
  alchemical: {
    currentStage: AlchemicalStage;
    spiralTurn: number;
    nextTransition?: {
      to: string;
      readiness: number;
      invitation: string;
    };
  };

  // Wings Layer
  wings: {
    balance: WingBalance;
    shadowStatus: ShadowIntegrationStatus;
    canFly: boolean;
  };

  // Spiralogic Layer (existing)
  spiralogic: {
    element: SpiralogicElement;
    house?: number;
    phase?: string;
  };

  // Sovereignty Layer (existing)
  sovereignty: {
    stage: SovereigntyStage;
    readyForPromotion: boolean;
  };

  // Integration
  developmentalGuidance: {
    primary: string;      // Main guidance for MAIA
    approach: string;      // How to respond
    depth: 'surface' | 'moderate' | 'deep' | 'transformational';
    invitations: string[]; // Specific invitations to offer
  };
}

// ============================================================================
// TRANSFORMATION ARCHITECTURE INTEGRATION
// ============================================================================

export class TransformationArchitectureIntegration {

  /**
   * Get complete transformation state
   */
  async getTransformationState(context: {
    userId: string;
    messages: Message[];
    patterns?: string[];
    userProfile?: any;
  }): Promise<TransformationState> {

    const { messages, patterns = [], userProfile } = context;

    // Layer 1: Aetheric Wisdom
    const voiceDetection = aethericWisdom.detectVoiceSource(
      messages[messages.length - 1]?.content || '',
      messages
    );

    const soulReadiness = aethericWisdom.detectSoulReadiness({
      messages,
      patterns
    });

    const aethericGuidance = aethericWisdom.generateGuidance(
      voiceDetection,
      soulReadiness,
      messages[messages.length - 1]?.content || ''
    );

    // Layer 2: Alchemical Stage
    const alchemicalStage = alchemicalDetector.detectStage({
      messages,
      patterns
    });

    const alchemicalTransition = alchemicalDetector.detectTransition(
      alchemicalStage,
      { messages, patterns }
    );

    // Layer 3: Wings Balance
    const wingBalance = wingsOfRedemption.assessWingBalance({
      messages,
      patterns
    });

    const shadowStatus = wingsOfRedemption.assessShadowIntegration({
      messages,
      patterns
    });

    // Layer 4: Spiralogic (existing - simplified for now)
    const spiralogicElement = this.mapAlchemicalToElemental(alchemicalStage.operation);

    // Layer 5: Sovereignty (existing - from userProfile)
    const sovereigntyStage = userProfile?.sovereigntyStage || 'seeker';
    const readyForPromotion = this.assessPromotionReadiness(
      alchemicalStage,
      wingBalance,
      sovereigntyStage
    );

    // INTEGRATION: Generate unified guidance
    const developmentalGuidance = this.synthesizeGuidance({
      aetheric: aethericGuidance,
      alchemical: alchemicalStage,
      wings: wingBalance,
      shadow: shadowStatus,
      sovereignty: sovereigntyStage
    });

    return {
      aetheric: {
        voiceSource: voiceDetection.source,
        guidance: aethericGuidance
      },
      alchemical: {
        currentStage: alchemicalStage,
        spiralTurn: alchemicalStage.spiralTurn,
        nextTransition: alchemicalTransition ? {
          to: alchemicalTransition.to,
          readiness: alchemicalTransition.readiness,
          invitation: alchemicalTransition.invitation
        } : undefined
      },
      wings: {
        balance: wingBalance,
        shadowStatus,
        canFly: wingBalance.canFly
      },
      spiralogic: {
        element: spiralogicElement
      },
      sovereignty: {
        stage: sovereigntyStage,
        readyForPromotion
      },
      developmentalGuidance
    };
  }

  /**
   * Map alchemical operation to elemental correspondence
   */
  private mapAlchemicalToElemental(operation: string): SpiralogicElement {
    const mapping: Record<string, SpiralogicElement> = {
      'nigredo': 'fire',       // Burning, decomposition
      'albedo': 'water',       // Washing, purification
      'citrinitas': 'earth',   // Grounding, manifestation
      'rubedo': 'air',         // Union, breath, holon
      'calcination': 'aether'  // Quintessence, return to spiral
    };

    return mapping[operation] || 'fire';
  }

  /**
   * Assess if user is ready for sovereignty promotion
   */
  private assessPromotionReadiness(
    alchemical: AlchemicalStage,
    wings: WingBalance,
    currentStage: SovereigntyStage
  ): boolean {

    // Seeker → Initiate: Requires conscious entry into nigredo
    if (currentStage === 'seeker') {
      return alchemical.operation === 'nigredo' && alchemical.confidence > 0.6;
    }

    // Initiate → Adept: Requires albedo realization (nature identity)
    if (currentStage === 'initiate') {
      return alchemical.operation === 'albedo' && alchemical.confidence > 0.7;
    }

    // Adept → Sovereign: Requires citrinitas grounding AND wing development
    if (currentStage === 'adept') {
      return (
        alchemical.operation === 'citrinitas' &&
        wings.feathers.strength > 0.6 &&
        wings.wax.strength > 0.5
      );
    }

    // Sovereign → Guide: Requires rubedo (wings complete) AND ability to hold others
    if (currentStage === 'sovereign') {
      return (
        alchemical.operation === 'rubedo' &&
        wings.canFly &&
        alchemical.spiralTurn >= 2
      );
    }

    return false;
  }

  /**
   * Synthesize guidance from all layers
   */
  private synthesizeGuidance(context: {
    aetheric: AethericGuidance;
    alchemical: AlchemicalStage;
    wings: WingBalance;
    shadow: ShadowIntegrationStatus;
    sovereignty: SovereigntyStage;
  }): TransformationState['developmentalGuidance'] {

    const { aetheric, alchemical, wings, shadow, sovereignty } = context;

    // Determine depth level
    let depth: 'surface' | 'moderate' | 'deep' | 'transformational';

    if (aetheric.approach === 'move_decisively' && alchemical.confidence > 0.7) {
      depth = 'transformational';
    } else if (aetheric.approach === 'invite_soul' || alchemical.operation === 'nigredo') {
      depth = 'deep';
    } else if (aetheric.approach === 'hold_tension') {
      depth = 'moderate';
    } else {
      depth = 'surface';
    }

    // Build invitations
    const invitations: string[] = [];

    // Aetheric invitation
    if (aetheric.invitation) {
      invitations.push(aetheric.invitation);
    }

    // Alchemical invitation
    if (alchemical.operation === 'nigredo') {
      invitations.push('The darkness is fertile. What wants to decompose?');
    } else if (alchemical.operation === 'albedo') {
      invitations.push('Clarity is emerging. What truth wants to be seen?');
    } else if (alchemical.operation === 'calcination') {
      invitations.push('This burning is refinement. What false gold melts away?');
    }

    // Wings invitation
    if (!wings.canFly) {
      if (wings.imbalance === 'too_scattered') {
        invitations.push('The feathers scatter without wax. Shadow work binds sovereignty to interconnectedness.');
      } else if (wings.imbalance === 'too_bound') {
        invitations.push('The wax binds too tight. Reclaim your voice, your choice, your sovereignty.');
      }
    }

    // Shadow invitation
    if (shadow.stage === 'glimpsing' || shadow.stage === 'rejected') {
      invitations.push('What you resist in others is gold you\'ve rejected in yourself.');
    }

    // Primary guidance synthesis
    const primary = this.buildPrimaryGuidance(
      aetheric,
      alchemical,
      wings,
      shadow,
      sovereignty
    );

    // Approach synthesis
    const approach = this.buildApproach(aetheric, alchemical, depth);

    return {
      primary,
      approach,
      depth,
      invitations
    };
  }

  /**
   * Build primary guidance message
   */
  private buildPrimaryGuidance(
    aetheric: AethericGuidance,
    alchemical: AlchemicalStage,
    wings: WingBalance,
    shadow: ShadowIntegrationStatus,
    sovereignty: SovereigntyStage
  ): string {

    // If in nigredo or calcination, prioritize holding
    if (alchemical.operation === 'nigredo' || alchemical.operation === 'calcination') {
      return `You're in ${alchemical.operation} - ${alchemical.description}. ${aetheric.holding || ''}`;
    }

    // If wings can fly
    if (wings.canFly) {
      return `You have wings - sovereignty bound by shadow-integrated interconnectedness. This is rubedo. You can fly.`;
    }

    // If soul is calling but ego resists
    if (aetheric.alignment === 'ego_resisting') {
      return `Your ego wants ${aetheric.egoWants}, but your soul is calling you toward ${aetheric.soulNeeds}. ${aetheric.invitation || ''}`;
    }

    // If in albedo (nature realization stage)
    if (alchemical.operation === 'albedo') {
      return `The albedo - purification revealing essence. You're seeing clearly now. This is where "we ARE nature" becomes known, not just believed.`;
    }

    // Default: alchemical + aetheric
    return `${alchemical.description}. ${aetheric.guidance.invitation || ''}`;
  }

  /**
   * Build approach instruction for MAIA
   */
  private buildApproach(
    aetheric: AethericGuidance,
    alchemical: AlchemicalStage,
    depth: string
  ): string {

    const approaches = {
      'support_ego': 'Meet user where they are. Offer comfort and support.',
      'invite_soul': 'Gently invite deeper. Soul is ready even if ego resists.',
      'hold_tension': 'Hold both voices. Let user choose which is more true right now.',
      'move_decisively': 'Enter depth work fully. User is aligned and ready.',
      'normalize_process': `Normalize the alchemical process. This is ${alchemical.operation} - it's supposed to feel this way.`
    };

    return approaches[aetheric.approach] || approaches['support_ego'];
  }

  /**
   * Generate MAIA system prompt enhancement
   */
  generateSystemPromptEnhancement(state: TransformationState): string {

    const { aetheric, alchemical, wings, developmentalGuidance } = state;

    return `
## Current Transformation State

**Alchemical Stage:** ${alchemical.currentStage.operation} (${alchemical.currentStage.element})
${alchemical.currentStage.description}

**Soul Work:** ${alchemical.currentStage.soulWork}
**Ego Experience:** ${alchemical.currentStage.egoExperience}

**Voice Detected:** ${aetheric.voiceSource}
**Ego wants:** ${aetheric.guidance.egoWants}
**Soul needs:** ${aetheric.guidance.soulNeeds}

**Wings Status:** ${wings.canFly ? 'FLIGHT CAPABLE' : 'Building'}
- Feathers (sovereignty): ${wings.balance.feathers.status}
- Wax (shadow integration): ${wings.balance.wax.status}

**Your Approach:** ${developmentalGuidance.approach}
**Depth Level:** ${developmentalGuidance.depth}

## Primary Guidance
${developmentalGuidance.primary}

## Invitations Available
${developmentalGuidance.invitations.map(inv => `- ${inv}`).join('\n')}

---

**Remember:**
- You serve soul (transformation) while respecting ego (sovereignty)
- Shadow work is the wax that binds free will (feathers) into wings
- Each "fall" is calcination - refinement, not failure
- The spiral continues - each turn revisits at new depth
`;
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

export const transformationArchitecture = new TransformationArchitectureIntegration();

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Quick access: Get transformation state for conversation
 */
export async function getTransformationContext(
  userId: string,
  messages: Message[],
  patterns?: string[],
  userProfile?: any
): Promise<TransformationState> {
  return transformationArchitecture.getTransformationState({
    userId,
    messages,
    patterns,
    userProfile
  });
}

/**
 * Quick access: Enhance MAIA system prompt with transformation awareness
 */
export async function enhanceMAIAPrompt(
  userId: string,
  messages: Message[],
  basePrompt: string,
  context?: { patterns?: string[]; userProfile?: any }
): Promise<string> {
  const state = await getTransformationContext(
    userId,
    messages,
    context?.patterns,
    context?.userProfile
  );

  const enhancement = transformationArchitecture.generateSystemPromptEnhancement(state);

  return `${basePrompt}\n\n${enhancement}`;
}
