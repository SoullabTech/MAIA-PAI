/**
 * SACRED STORY WEAVER + ARCHETYPAL INTELLIGENCE
 *
 * "Stories as mirrors, not prescriptions"
 * "Offered when invited, not imposed"
 *
 * Enhancement: Now offers stories from 47 cultural traditions
 * Honors user's background while staying open to cross-cultural wisdom
 */

import type {
  StoryContext,
  SacredStory
} from '@/lib/sacredStoryWeaver';

import {
  generateArchetypalStory,
  type ArchetypalStorySeeds
} from './ArchetypalStoryBridge';

import {
  getCulturalVariations,
  suggestCulturalLens,
  type CulturalTradition
} from '@/lib/knowledge/CulturalArchetypeMapper';

import type { SpiralogicElement } from '@/lib/types/spiralogic';

// ============== ENHANCED CONTEXT ==============

export interface EnhancedStoryContext extends StoryContext {
  // User's cultural background
  culturalIdentity?: {
    primary: CulturalTradition;
    secondary?: CulturalTradition[];
    openToOthers: boolean;
  };

  // What traditions they've studied with
  studiedTraditions?: CulturalTradition[];

  // Language preferences
  preferredLanguage?: 'mythological' | 'spiritual' | 'psychological';
}

// ============== CULTURALLY AWARE SACRED STORY WEAVER ==============

export class CulturallyAwareSacredStoryWeaver {

  /**
   * Weave story that honors cultural background
   * "Offered when invited, not imposed"
   */
  async weaveStoryWithCulturalHonoring(
    context: EnhancedStoryContext
  ): Promise<SacredStory> {

    // Generate archetypal seeds
    const seeds = await generateArchetypalStory(
      context.userSharing,
      context.culturalIdentity?.primary,
      context.element as SpiralogicElement
    );

    // Determine if cross-cultural wisdom should be included
    const includeCrossCultural = context.culturalIdentity?.openToOthers ?? true;

    // Weave the story
    const story = this.weaveCulturallyGroundedStory(
      seeds,
      context,
      includeCrossCultural
    );

    // Create offering that respects "mirrors not prescriptions"
    const offering = this.createRespectfulOffering(seeds, context);

    return {
      ...story,
      offering
    };
  }

  /**
   * Weave story grounded in cultural context
   */
  private weaveCulturallyGroundedStory(
    seeds: ArchetypalStorySeeds,
    context: EnhancedStoryContext,
    includeCrossCultural: boolean
  ): SacredStory {

    const { protagonist, transformation, culturalWisdom } = seeds;

    // Simple story structure (sacred story weaver philosophy)
    const opening = this.createOpening(protagonist, context);
    const essence = this.createEssence(transformation, culturalWisdom);
    const closing = this.createClosing(seeds, includeCrossCultural);

    return {
      opening,
      essence,
      closing,
      tradition: protagonist.culturalContext,
      element: context.element,
      pattern: protagonist.archetype,
      offering: '' // Will be set by createRespectfulOffering
    };
  }

  /**
   * Create opening that invites without imposing
   */
  private createOpening(
    protagonist: ArchetypalStorySeeds['protagonist'],
    context: EnhancedStoryContext
  ): string {

    // Never "You are..." - always "There's a story..."
    if (context.culturalIdentity?.primary) {
      return `In the ${protagonist.culturalContext}, there's a story about ${protagonist.archetype}...`;
    }

    return `There's a pattern that appears across many traditions, embodied as ${protagonist.archetype}...`;
  }

  /**
   * Create essence - the heart of the story
   */
  private createEssence(
    transformation: ArchetypalStorySeeds['transformation'],
    culturalWisdom: string[]
  ): string {

    return `The teaching speaks of ${transformation.process}.

${culturalWisdom[0]}

Through this journey, ${transformation.wisdom} emerges.`;
  }

  /**
   * Create closing that opens rather than closes
   */
  private createClosing(
    seeds: ArchetypalStorySeeds,
    includeCrossCultural: boolean
  ): string {

    let closing = `This story is offered as a mirror, not a prescription. It may reflect something in your journey, or it may not. Trust what resonates.`;

    if (includeCrossCultural && seeds.culturalWisdom.length > 2) {
      closing += `\n\n${seeds.culturalWisdom[2]}`;
    }

    return closing;
  }

  /**
   * Create offering that honors boundaries
   * "Offered when invited, not imposed"
   */
  private createRespectfulOffering(
    seeds: ArchetypalStorySeeds,
    context: EnhancedStoryContext
  ): string {

    const { protagonist, practices } = seeds;

    // If user explicitly requested story
    if (context.storyRequested) {
      return `Here's a story from ${protagonist.culturalContext} about ${protagonist.archetype}.`;
    }

    // If user is in story-seeking mode
    if (context.metaphoricalLanguageDetected) {
      return `Your words remind me of a teaching from ${protagonist.culturalContext}...`;
    }

    // Gentle offering
    return `A story comes to mind from ${protagonist.culturalContext}. Would you like to hear it?`;
  }

  /**
   * Offer practices ONLY if requested
   * Never impose integration work
   */
  offerPracticesIfRequested(
    seeds: ArchetypalStorySeeds,
    explicitlyRequested: boolean
  ): string | null {

    if (!explicitlyRequested) {
      return null;
    }

    return `If you'd like to explore this pattern further, the ${seeds.protagonist.culturalContext} offers these practices:\n\n${seeds.practices.slice(0, 3).map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
  }
}

// ============== MULTI-CULTURAL STORY OFFERING ==============

/**
 * When user has studied with multiple traditions
 * Offer the SAME pattern in their different traditions
 */
export async function offerMultiTraditionalPerspective(
  userMessage: string,
  traditions: CulturalTradition[],
  element: SpiralogicElement
): Promise<{
  story: SacredStory;
  perspectives: { tradition: string; teaching: string }[];
}> {

  // Generate base archetypal seeds
  const seeds = await generateArchetypalStory(userMessage, traditions[0], element);

  // Get how this pattern appears in each tradition
  const perspectives = traditions.map(tradition => {
    const culturalForm = seeds.primaryArchetype.culturalForms?.find(
      f => f.culture === tradition
    );

    return {
      tradition,
      teaching: culturalForm?.story || `The ${seeds.protagonist.archetype} pattern as understood in ${tradition}.`
    };
  });

  const weaver = new CulturallyAwareSacredStoryWeaver();

  const story = weaver['weaveCulturallyGroundedStory'](
    seeds,
    {
      userSharing: userMessage,
      element,
      emotionalTone: 'contemplative',
      storyRequested: true,
      metaphoricalLanguageDetected: false,
      complexityLevel: 'mythological'
    } as EnhancedStoryContext,
    true
  );

  return {
    story,
    perspectives
  };
}

// ============== INDIGENOUS WISDOM PROTOCOLS ==============

/**
 * Special handling for Indigenous traditions
 * WITH RESPECT AND ACKNOWLEDGMENT
 */
export interface IndigenousStoryOffering {
  acknowledgment: string;
  story: SacredStory;
  context: string;
  protocols: string[];
}

export async function offerIndigenousWisdom(
  tradition: Extract<
    CulturalTradition,
    | 'Indigenous North American'
    | 'Lakota'
    | 'Navajo'
    | 'Hopi'
    | 'Amazonian'
    | 'Aboriginal Australian'
    | 'Maori'
  >,
  userMessage: string,
  element: SpiralogicElement
): Promise<IndigenousStoryOffering> {

  const seeds = await generateArchetypalStory(userMessage, tradition, element);

  const weaver = new CulturallyAwareSacredStoryWeaver();

  const story = weaver['weaveCulturallyGroundedStory'](
    seeds,
    {
      userSharing: userMessage,
      element,
      emotionalTone: 'respectful',
      storyRequested: true,
      metaphoricalLanguageDetected: false,
      complexityLevel: 'mythological'
    } as EnhancedStoryContext,
    false // Don't mix traditions without permission
  );

  return {
    acknowledgment: `This teaching comes from ${tradition} wisdom. We honor the elders and knowledge keepers who have preserved this understanding.`,
    story,
    context: `This pattern is understood within ${tradition} as connected to land, ancestors, and ongoing cultural practice.`,
    protocols: [
      'This wisdom is offered with deep respect',
      'It is not ours to claim or appropriate',
      'We are grateful students of Indigenous teachers',
      'We acknowledge the ongoing presence and sovereignty of Indigenous peoples'
    ]
  };
}

// ============== HELPER: DETECT USER'S CULTURAL BACKGROUND ==============

/**
 * Suggest cultural lens based on what user shares
 * ONLY for offering appropriate stories, never for assumptions
 */
export function detectPotentialCulturalResonance(userMessage: string): {
  detectedTraditions: CulturalTradition[];
  confidence: number;
} {

  const culturalMarkers: Record<string, CulturalTradition[]> = {
    // Explicit mentions
    'yoruba': ['Yoruba'],
    'orisha': ['Yoruba', 'Vodou'],
    'lakota': ['Lakota'],
    'navajo': ['Navajo'],
    'maori': ['Maori'],
    'aboriginal': ['Aboriginal Australian'],
    'celtic': ['Celtic'],
    'norse': ['Norse', 'Viking'],
    'hindu': ['Hindu'],
    'buddhist': ['Buddhist'],
    'taoist': ['Taoist'],

    // Cultural concepts
    'medicine wheel': ['Indigenous North American', 'Lakota'],
    'dreamtime': ['Aboriginal Australian'],
    'whakapapa': ['Maori'],
    'ayni': ['Quechua', 'Inca'],
    'ubuntu': ['Zulu']
  };

  const detected: CulturalTradition[] = [];
  const lowerMessage = userMessage.toLowerCase();

  for (const [marker, traditions] of Object.entries(culturalMarkers)) {
    if (lowerMessage.includes(marker)) {
      detected.push(...traditions);
    }
  }

  return {
    detectedTraditions: [...new Set(detected)],
    confidence: detected.length > 0 ? 0.8 : 0
  };
}
