/**
 * ARCHETYPAL STORY BRIDGE
 *
 * Connects Universal Archetypal Intelligence to Story Creation Systems
 *
 * Flow:
 * Universal Archetypes → Cultural Lens → Story Generation → Personalized Narrative
 *
 * Features:
 * - 47 cultural traditions for storytelling
 * - I Ching archetypes as narrative foundations
 * - Emergent archetypes as contemporary protagonists
 * - Light/Dark/Depth framework for story arcs
 * - Cross-cultural wisdom woven into narratives
 */

import {
  getIChingArchetype,
  ICHING_ARCHETYPE_PATTERNS,
  type IChingTrigramArchetype,
  type UniversalArchetypePattern
} from '@/lib/knowledge/UniversalArchetypalFramework';

import {
  findArchetypeByDeity,
  getCulturalVariations,
  formatArchetypeForWorldview,
  generateCrossCulturalInsight,
  type CulturalTradition,
  type WorldviewContext
} from '@/lib/knowledge/CulturalArchetypeMapper';

import {
  detectEmergentArchetype,
  suggestEmergentArchetype,
  EMERGENT_ARCHETYPES,
  type EmergentArchetype
} from '@/lib/knowledge/EmergentArchetypeDetector';

import type { SpiralogicElement } from '@/lib/types/spiralogic';

// ============== TYPES ==============

export interface StoryArchetypeContext {
  userProfile: {
    culturalBackground?: CulturalTradition[];
    spiritualInterests?: string[];
    preferredLanguage?: 'mythological' | 'psychological' | 'spiritual' | 'scientific';
    openToCrossCultural?: boolean;
  };
  currentChallenge?: string;
  emotionalState?: {
    primary: string;
    intensity: number;
  };
  elementalAffinity?: SpiralogicElement;
  archetypePreference?: 'traditional' | 'emergent' | 'mixed';
}

export interface ArchetypalStorySeeds {
  primaryArchetype: UniversalArchetypePattern | EmergentArchetype;
  culturalForm?: any; // Specific cultural variation
  narrativeArc: 'light-to-light' | 'dark-to-light' | 'light-to-dark-to-integration';
  protagonist: {
    name: string;
    archetype: string;
    culturalContext: string;
  };
  challenge: {
    description: string;
    symbolism: string;
  };
  transformation: {
    process: string;
    wisdom: string;
  };
  culturalWisdom: string[];
  practices: string[];
}

// ============== MAIN BRIDGE ==============

export class ArchetypalStoryBridge {

  /**
   * Generate story seeds from archetypal intelligence
   */
  async generateStorySeeds(
    context: StoryArchetypeContext
  ): Promise<ArchetypalStorySeeds> {

    // Step 1: Detect relevant archetype (traditional or emergent)
    const archetype = await this.detectRelevantArchetype(context);

    // Step 2: Select cultural lens
    const culturalForm = await this.selectCulturalLens(archetype, context);

    // Step 3: Determine narrative arc based on Light/Dark state
    const narrativeArc = this.determineNarrativeArc(context);

    // Step 4: Create protagonist based on archetype + culture
    const protagonist = this.createProtagonist(archetype, culturalForm);

    // Step 5: Generate challenge that mirrors user's situation
    const challenge = this.generateChallenge(archetype, context);

    // Step 6: Map transformation pathway
    const transformation = this.mapTransformation(archetype, narrativeArc);

    // Step 7: Gather cultural wisdom
    const culturalWisdom = this.gatherCulturalWisdom(archetype, culturalForm);

    // Step 8: Extract practices for integration
    const practices = this.extractPractices(archetype, culturalForm);

    return {
      primaryArchetype: archetype,
      culturalForm,
      narrativeArc,
      protagonist,
      challenge,
      transformation,
      culturalWisdom,
      practices
    };
  }

  // ============== DETECTION ==============

  /**
   * Detect which archetype resonates with user's context
   */
  private async detectRelevantArchetype(
    context: StoryArchetypeContext
  ): Promise<UniversalArchetypePattern | EmergentArchetype> {

    // Check for emergent archetype first (contemporary challenges)
    if (context.archetypePreference !== 'traditional') {
      const emergentDetection = detectEmergentArchetype(
        context.currentChallenge || ''
      );

      if (emergentDetection) {
        return emergentDetection;
      }
    }

    // Fall back to traditional/I Ching archetype
    if (context.elementalAffinity) {
      // Find I Ching archetype matching element
      const iChingArchetype = ICHING_ARCHETYPE_PATTERNS.find(
        a => a.element === context.elementalAffinity
      );

      if (iChingArchetype) {
        return iChingArchetype;
      }
    }

    // Default: Thunder/Initiator (breakthrough energy)
    return getIChingArchetype(1);
  }

  // ============== CULTURAL LENS ==============

  /**
   * Select appropriate cultural variation based on user preferences
   */
  private async selectCulturalLens(
    archetype: UniversalArchetypePattern | EmergentArchetype,
    context: StoryArchetypeContext
  ): Promise<any> {

    // Emergent archetypes don't have traditional cultural forms
    if ('emergence' in archetype) {
      return null;
    }

    const traditionalArchetype = archetype as UniversalArchetypePattern;

    // If user has cultural preferences, match them
    if (context.userProfile.culturalBackground?.length) {
      const preferredCulture = context.userProfile.culturalBackground[0];
      const culturalForm = traditionalArchetype.culturalForms.find(
        form => form.culture === preferredCulture
      );

      if (culturalForm) {
        return culturalForm;
      }
    }

    // Default to first cultural form (often Greek/universal)
    return traditionalArchetype.culturalForms[0];
  }

  // ============== NARRATIVE ARC ==============

  /**
   * Determine story arc based on emotional state and context
   */
  private determineNarrativeArc(
    context: StoryArchetypeContext
  ): 'light-to-light' | 'dark-to-light' | 'light-to-dark-to-integration' {

    if (!context.emotionalState) {
      return 'light-to-light'; // Inspirational journey
    }

    const { primary, intensity } = context.emotionalState;

    // Dark states need transformation arc
    if (['fear', 'sadness', 'anger', 'despair'].includes(primary) && intensity > 0.6) {
      return 'dark-to-light';
    }

    // Complex states need full integration arc
    if (context.currentChallenge && intensity > 0.7) {
      return 'light-to-dark-to-integration';
    }

    // Light states get inspiring journeys
    return 'light-to-light';
  }

  // ============== PROTAGONIST ==============

  /**
   * Create protagonist embodying archetype in cultural context
   */
  private createProtagonist(
    archetype: UniversalArchetypePattern | EmergentArchetype,
    culturalForm: any
  ): ArchetypalStorySeeds['protagonist'] {

    // Emergent archetype protagonist
    if ('emergence' in archetype) {
      return {
        name: 'A seeker of our time',
        archetype: archetype.name,
        culturalContext: archetype.emergence.culturalContext
      };
    }

    // Traditional archetype protagonist
    const traditionalArchetype = archetype as UniversalArchetypePattern;

    if (culturalForm) {
      return {
        name: culturalForm.deity || culturalForm.name,
        archetype: traditionalArchetype.name,
        culturalContext: `${culturalForm.culture} tradition`
      };
    }

    return {
      name: 'The Seeker',
      archetype: traditionalArchetype.name,
      culturalContext: 'Universal wisdom'
    };
  }

  // ============== CHALLENGE ==============

  /**
   * Generate challenge that mirrors user's situation
   */
  private generateChallenge(
    archetype: UniversalArchetypePattern | EmergentArchetype,
    context: StoryArchetypeContext
  ): ArchetypalStorySeeds['challenge'] {

    const userChallenge = context.currentChallenge || 'a crossroads in their journey';

    // Emergent archetype challenges
    if ('emergence' in archetype) {
      const emergent = archetype as EmergentArchetype;
      return {
        description: emergent.expression.whenDark.challenges[0] || userChallenge,
        symbolism: emergent.expression.whenDark.warningSign
      };
    }

    // Traditional archetype challenges
    const traditional = archetype as UniversalArchetypePattern;
    return {
      description: traditional.expression.whenDark.challenges[0] || userChallenge,
      symbolism: traditional.expression.whenDark.warningSign
    };
  }

  // ============== TRANSFORMATION ==============

  /**
   * Map transformation pathway based on arc
   */
  private mapTransformation(
    archetype: UniversalArchetypePattern | EmergentArchetype,
    arc: 'light-to-light' | 'dark-to-light' | 'light-to-dark-to-integration'
  ): ArchetypalStorySeeds['transformation'] {

    const expression = archetype.expression;

    if (arc === 'dark-to-light') {
      return {
        process: expression.goDeeper.healingPathway,
        wisdom: expression.whenLight.gifts[0]
      };
    }

    if (arc === 'light-to-dark-to-integration') {
      return {
        process: `Through the shadow of ${expression.whenDark.warningSign}, into the light of ${expression.whenLight.energyState}`,
        wisdom: expression.goDeeper.wisdomOffering
      };
    }

    // Light-to-light arc
    return {
      process: `Embodying ${expression.whenLight.energyState}`,
      wisdom: expression.whenLight.gifts[0]
    };
  }

  // ============== CULTURAL WISDOM ==============

  /**
   * Gather cross-cultural wisdom for the archetype
   */
  private gatherCulturalWisdom(
    archetype: UniversalArchetypePattern | EmergentArchetype,
    culturalForm: any
  ): string[] {

    const wisdom: string[] = [];

    // Add archetype essence
    wisdom.push(archetype.essence);

    // Add cultural specific wisdom if available
    if (culturalForm?.story) {
      wisdom.push(culturalForm.story);
    }

    // Add cross-cultural insight for traditional archetypes
    if ('id' in archetype) {
      const crossCultural = generateCrossCulturalInsight(archetype.id);
      if (crossCultural) {
        wisdom.push(crossCultural);
      }
    }

    // Add contemporary wisdom for emergent archetypes
    if ('emergence' in archetype) {
      const emergent = archetype as EmergentArchetype;
      wisdom.push(`Emerged: ${emergent.emergence.culturalContext}`);
    }

    return wisdom;
  }

  // ============== PRACTICES ==============

  /**
   * Extract practices for story integration
   */
  private extractPractices(
    archetype: UniversalArchetypePattern | EmergentArchetype,
    culturalForm: any
  ): string[] {

    const practices: string[] = [];

    // Add cultural practices if available
    if (culturalForm?.practices) {
      practices.push(...culturalForm.practices.slice(0, 3));
    }

    // Add integration practices from archetype
    if (archetype.expression.goDeeper.integrationPractices) {
      practices.push(...archetype.expression.goDeeper.integrationPractices.slice(0, 2));
    }

    return practices;
  }

  // ============== STORY FORMATTING ==============

  /**
   * Format archetype for storytelling in specific style
   */
  formatForStorytelling(
    seeds: ArchetypalStorySeeds,
    style: 'mythological' | 'parable' | 'contemporary' | 'poetic'
  ): string {

    if (style === 'mythological') {
      return this.formatMythological(seeds);
    } else if (style === 'parable') {
      return this.formatParable(seeds);
    } else if (style === 'contemporary') {
      return this.formatContemporary(seeds);
    } else {
      return this.formatPoetic(seeds);
    }
  }

  private formatMythological(seeds: ArchetypalStorySeeds): string {
    return `In the ${seeds.protagonist.culturalContext}, ${seeds.protagonist.name} embodied the pattern of ${seeds.protagonist.archetype}.

The challenge arose: ${seeds.challenge.description}, manifesting as ${seeds.challenge.symbolism}.

Through ${seeds.transformation.process}, the wisdom emerged: ${seeds.transformation.wisdom}.

Cultural Wisdom: ${seeds.culturalWisdom.join(' ')}`;
  }

  private formatParable(seeds: ArchetypalStorySeeds): string {
    return `Once there was one who walked the path of ${seeds.protagonist.archetype}.

They faced ${seeds.challenge.description}.

But through ${seeds.transformation.process}, they discovered ${seeds.transformation.wisdom}.`;
  }

  private formatContemporary(seeds: ArchetypalStorySeeds): string {
    return `In our time, the ${seeds.protagonist.archetype} archetype emerges.

Today's challenge: ${seeds.challenge.description}

The pathway: ${seeds.transformation.process}

The gift: ${seeds.transformation.wisdom}

Integration practices: ${seeds.practices.join(', ')}`;
  }

  private formatPoetic(seeds: ArchetypalStorySeeds): string {
    return `${seeds.protagonist.archetype}

${seeds.challenge.symbolism}
dissolves through
${seeds.transformation.process}

revealing:
${seeds.transformation.wisdom}`;
  }
}

// ============== CONVENIENCE FUNCTIONS ==============

/**
 * Quick story generation from user context
 */
export async function generateArchetypalStory(
  userMessage: string,
  culturalPreference?: CulturalTradition,
  elementalAffinity?: SpiralogicElement
): Promise<ArchetypalStorySeeds> {

  const bridge = new ArchetypalStoryBridge();

  const context: StoryArchetypeContext = {
    userProfile: {
      culturalBackground: culturalPreference ? [culturalPreference] : undefined,
      openToCrossCultural: true
    },
    currentChallenge: userMessage,
    elementalAffinity
  };

  return bridge.generateStorySeeds(context);
}

/**
 * Generate culturally-specific story from deity name
 */
export async function generateCulturalStory(
  deityName: string,
  culture: CulturalTradition,
  userChallenge: string
): Promise<ArchetypalStorySeeds | null> {

  const archetype = findArchetypeByDeity(deityName, culture);
  if (!archetype) return null;

  const bridge = new ArchetypalStoryBridge();

  const culturalForm = archetype.culturalForms.find(
    form => form.culture === culture
  );

  const seeds: ArchetypalStorySeeds = {
    primaryArchetype: archetype,
    culturalForm,
    narrativeArc: 'dark-to-light',
    protagonist: {
      name: culturalForm?.deity || deityName,
      archetype: archetype.name,
      culturalContext: culture
    },
    challenge: {
      description: userChallenge,
      symbolism: archetype.expression.whenDark.warningSign
    },
    transformation: {
      process: archetype.expression.goDeeper.healingPathway,
      wisdom: archetype.expression.whenLight.gifts[0]
    },
    culturalWisdom: [archetype.essence, culturalForm?.story || ''],
    practices: culturalForm?.practices || []
  };

  return seeds;
}
