/**
 * STORYTELLER AGENT + ARCHETYPAL INTELLIGENCE INTEGRATION
 *
 * Enhances StorytellerAgent with Universal Archetypal System
 *
 * New Capabilities:
 * - Generate stories in 47 cultural traditions
 * - Use I Ching archetypes as story foundations
 * - Feature emergent archetypes as protagonists
 * - Apply Light/Dark/Depth to story arcs
 * - Honor user's cultural background
 */

import type {
  StorytellerContext,
  StoryResponse,
  StoryStructure,
  NarrativeStyle
} from '@/apps/api/backend/src/agents/StorytellerAgent';

import {
  ArchetypalStoryBridge,
  generateArchetypalStory,
  generateCulturalStory,
  type StoryArchetypeContext,
  type ArchetypalStorySeeds
} from './ArchetypalStoryBridge';

import {
  getCulturalVariations,
  type CulturalTradition
} from '@/lib/knowledge/CulturalArchetypeMapper';

import type { SpiralogicElement } from '@/lib/types/spiralogic';

// ============== ENHANCED STORYTELLER CONTEXT ==============

export interface EnhancedStorytellerContext extends StorytellerContext {
  // Cultural preferences
  culturalBackground?: CulturalTradition[];
  preferredTradition?: CulturalTradition;
  openToCrossCultural?: boolean;

  // Archetypal preferences
  preferredArchetype?: string;
  archetypeMode?: 'traditional' | 'emergent' | 'mixed';
}

// ============== CULTURAL STORY GENERATOR ==============

export class CulturalStoryGenerator {
  private bridge: ArchetypalStoryBridge;

  constructor() {
    this.bridge = new ArchetypalStoryBridge();
  }

  /**
   * Generate story with cultural and archetypal intelligence
   */
  async generateCulturallyRichStory(
    context: EnhancedStorytellerContext
  ): Promise<{
    archetypalSeeds: ArchetypalStorySeeds;
    storyNarrative: string;
    culturalContext: string;
    integrationGuidance: string;
  }> {

    // Step 1: Generate archetypal seeds
    const archetypalContext: StoryArchetypeContext = {
      userProfile: {
        culturalBackground: context.culturalBackground,
        openToCrossCultural: context.openToCrossCultural ?? true,
        preferredLanguage: this.mapNarrativeVoiceToLanguage(context)
      },
      currentChallenge: context.currentChallenge,
      emotionalState: {
        primary: this.detectPrimaryEmotion(context.emotionalState),
        intensity: context.emotionalState.resonanceScore || 0.7
      },
      elementalAffinity: context.elementalAffinity as SpiralogicElement,
      archetypePreference: context.archetypeMode || 'mixed'
    };

    const seeds = await this.bridge.generateStorySeeds(archetypalContext);

    // Step 2: Generate narrative using seeds
    const narrative = await this.weaveNarrativeFromSeeds(seeds, context);

    // Step 3: Create cultural context
    const culturalContext = this.createCulturalContext(seeds);

    // Step 4: Integration guidance
    const integrationGuidance = this.createIntegrationGuidance(seeds);

    return {
      archetypalSeeds: seeds,
      storyNarrative: narrative,
      culturalContext,
      integrationGuidance
    };
  }

  /**
   * Weave narrative from archetypal seeds
   */
  private async weaveNarrativeFromSeeds(
    seeds: ArchetypalStorySeeds,
    context: EnhancedStorytellerContext
  ): Promise<string> {

    const { narrativeArc, protagonist, challenge, transformation } = seeds;

    // Select narrative style based on arc
    let narrative = '';

    if (narrativeArc === 'dark-to-light') {
      narrative = this.weaveTransformationNarrative(seeds, context);
    } else if (narrativeArc === 'light-to-dark-to-integration') {
      narrative = this.weaveIntegrationNarrative(seeds, context);
    } else {
      narrative = this.weaveInspirationNarrative(seeds, context);
    }

    return narrative;
  }

  /**
   * Weave transformation narrative (dark to light)
   */
  private weaveTransformationNarrative(
    seeds: ArchetypalStorySeeds,
    context: EnhancedStorytellerContext
  ): string {

    const { protagonist, challenge, transformation, culturalWisdom } = seeds;

    return `In the ${protagonist.culturalContext}, there is a teaching about ${protagonist.archetype}.

The story tells of one who faced ${challenge.description}.

The path seemed impossible, the darkness complete. ${challenge.symbolism} — this was the warning that change was needed.

But through ${transformation.process}, the teaching reveals itself:

${transformation.wisdom}

${culturalWisdom[0]}

The elders teach: what seems like breaking is often breaking open. What looks like darkness is the womb of transformation.

Integration Practices:
${seeds.practices.slice(0, 3).map((p, i) => `${i + 1}. ${p}`).join('\n')}

This story is offered not as prescription but as mirror. Your journey is your own, yet these patterns echo across time and culture, reminding us we walk paths others have walked before.`;
  }

  /**
   * Weave integration narrative (full arc)
   */
  private weaveIntegrationNarrative(
    seeds: ArchetypalStorySeeds,
    context: EnhancedStorytellerContext
  ): string {

    const { protagonist, challenge, transformation, culturalWisdom } = seeds;

    return `The pattern of ${protagonist.archetype} appears across many traditions.

In ${protagonist.culturalContext}, ${protagonist.name} teaches this wisdom:

There comes a moment when ${challenge.description} appears not as enemy but as initiation.

Through ${transformation.process}, the deeper truth emerges:
${transformation.wisdom}

This is the sacred spiral:
- Light calls us forward
- Darkness refines us
- Integration makes us whole

${culturalWisdom[1] || culturalWisdom[0]}

The practices that support this journey:
${seeds.practices.slice(0, 3).map((p, i) => `${i + 1}. ${p}`).join('\n')}

May this story serve as companion on your path.`;
  }

  /**
   * Weave inspiration narrative (light to light)
   */
  private weaveInspirationNarrative(
    seeds: ArchetypalStorySeeds,
    context: EnhancedStorytellerContext
  ): string {

    const { protagonist, transformation, culturalWisdom } = seeds;

    return `The ${protagonist.archetype} lives in all of us.

${protagonist.culturalContext} teaches us:

${transformation.wisdom}

Through ${transformation.process}, we remember who we've always been.

${culturalWisdom[0]}

The path forward:
${seeds.practices.slice(0, 2).map((p, i) => `${i + 1}. ${p}`).join('\n')}

You carry this archetype's medicine. Trust it.`;
  }

  /**
   * Create cultural context explanation
   */
  private createCulturalContext(seeds: ArchetypalStorySeeds): string {
    const { protagonist, culturalWisdom } = seeds;

    let context = `This story draws from ${protagonist.culturalContext}, embodying the ${protagonist.archetype} archetype.`;

    // Add cross-cultural insight if available
    if (culturalWisdom.length > 2) {
      context += `\n\n${culturalWisdom[2]}`;
    }

    // Add emergent context if applicable
    if ('emergence' in seeds.primaryArchetype) {
      const emergent = seeds.primaryArchetype as any;
      context += `\n\nThis is an emergent archetype, first detected around ${emergent.emergence.firstDetected.getFullYear()} in response to ${emergent.emergence.culturalContext}.`;
    }

    return context;
  }

  /**
   * Create integration guidance
   */
  private createIntegrationGuidance(seeds: ArchetypalStorySeeds): string {
    const { transformation, practices } = seeds;

    return `**How to work with this story:**

1. **Sit with it**: Let the story settle in your consciousness without forcing meaning.

2. **Notice resonance**: What parts make your soul say "yes"?

3. **Practice**: ${practices[0] || 'Journal about what this story awakens in you.'}

4. **Embody**: ${transformation.wisdom}

5. **Share** (if it feels right): Stories grow in the telling.`;
  }

  // ============== HELPERS ==============

  private mapNarrativeVoiceToLanguage(
    context: EnhancedStorytellerContext
  ): 'mythological' | 'psychological' | 'spiritual' | 'scientific' {
    // Map from context preferences to language style
    if (context.userQuery?.toLowerCase().includes('science')) {
      return 'scientific';
    }
    if (context.userQuery?.toLowerCase().includes('psychology')) {
      return 'psychological';
    }
    if (context.userQuery?.toLowerCase().includes('spirit')) {
      return 'spiritual';
    }
    return 'mythological';
  }

  private detectPrimaryEmotion(emotionalState: any): string {
    const balance = emotionalState?.emotionalBalance || {};

    let maxEmotion = 'curiosity';
    let maxValue = 0;

    for (const [emotion, value] of Object.entries(balance)) {
      if (typeof value === 'number' && value > maxValue) {
        maxValue = value;
        maxEmotion = emotion;
      }
    }

    return maxEmotion;
  }
}

// ============== INTEGRATION WITH STORYTELLER AGENT ==============

/**
 * Enhance StorytellerAgent response with archetypal intelligence
 */
export async function enhanceStoryWithArchetypalWisdom(
  baseStory: StoryResponse,
  context: EnhancedStorytellerContext
): Promise<StoryResponse> {

  const generator = new CulturalStoryGenerator();
  const culturalStory = await generator.generateCulturallyRichStory(context);

  // Enhance the base story with archetypal layers
  return {
    ...baseStory,
    story: {
      ...baseStory.story,
      content: `${baseStory.story.content}\n\n---\n\n**Cultural & Archetypal Context:**\n${culturalStory.culturalContext}\n\n${culturalStory.integrationGuidance}`
    },
    interpretation: {
      ...baseStory.interpretation,
      archetypeActivation: [
        ...baseStory.interpretation.archetypeActivation,
        culturalStory.archetypalSeeds.protagonist.archetype
      ],
      wisdomTeaching: `${baseStory.interpretation.wisdomTeaching}\n\n**From ${culturalStory.archetypalSeeds.protagonist.culturalContext}:** ${culturalStory.archetypalSeeds.transformation.wisdom}`
    },
    metadata: {
      ...baseStory.metadata,
      mythologicalReferences: [
        ...baseStory.metadata.mythologicalReferences,
        culturalStory.archetypalSeeds.protagonist.archetype
      ]
    }
  };
}

// ============== QUICK ACCESS FUNCTIONS ==============

/**
 * Generate story in specific cultural tradition
 */
export async function tellStoryInTradition(
  userMessage: string,
  tradition: CulturalTradition,
  elementalAffinity?: SpiralogicElement
): Promise<string> {

  const seeds = await generateArchetypalStory(
    userMessage,
    tradition,
    elementalAffinity
  );

  const generator = new CulturalStoryGenerator();
  return generator['weaveTransformationNarrative'](seeds, {
    userQuery: userMessage,
    emotionalState: { resonanceScore: 0.7, emotionalBalance: {} },
    elementalAffinity: elementalAffinity || 'fire'
  } as EnhancedStorytellerContext);
}

/**
 * Generate cross-cultural story showing same pattern in different traditions
 */
export async function tellCrossCulturalStory(
  userMessage: string,
  traditions: CulturalTradition[]
): Promise<{
  universalPattern: string;
  culturalVariations: { tradition: string; story: string }[];
  wisdom: string;
}> {

  const seeds = await generateArchetypalStory(userMessage);

  // Get variations from specified traditions
  const variations = traditions.map(tradition => {
    const culturalForm = seeds.primaryArchetype.culturalForms?.find(
      f => f.culture === tradition
    );

    return {
      tradition,
      story: culturalForm?.story || `The ${seeds.protagonist.archetype} pattern manifests in ${tradition} tradition.`
    };
  });

  return {
    universalPattern: seeds.primaryArchetype.essence,
    culturalVariations: variations,
    wisdom: seeds.transformation.wisdom
  };
}
