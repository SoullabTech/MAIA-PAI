/**
 * LIVE STORY GENERATOR
 *
 * Connects Cultural Storytelling System to AI for real-time story generation
 * Integrates with OpenAI/Anthropic for culturally-grounded narrative creation
 */

import {
  ArchetypalStoryBridge,
  type ArchetypalStorySeeds,
  type StoryArchetypeContext
} from './ArchetypalStoryBridge';

import { CulturalStoryGenerator } from './StorytellerArchetypalIntegration';

import type { CulturalTradition } from '@/lib/knowledge/CulturalArchetypeMapper';
import type { SpiralogicElement } from '@/lib/types/spiralogic';

// ============== TYPES ==============

export interface StoryGenerationRequest {
  userChallenge: string;
  culturalTradition: CulturalTradition;
  elementalAffinity?: SpiralogicElement;
  narrativeStyle?: 'mythological' | 'parable' | 'contemporary' | 'poetic';
  includeEmergent?: boolean;
  crossCultural?: boolean;
}

export interface GeneratedStory {
  title: string;
  narrative: string;
  culturalContext: {
    tradition: string;
    archetype: string;
    deity?: string;
    pattern: string;
  };
  transformation: {
    challenge: string;
    pathway: string;
    wisdom: string;
  };
  practices: {
    title: string;
    description: string;
  }[];
  reflection: {
    questions: string[];
    journalPrompt: string;
  };
  crossCulturalWisdom?: {
    tradition: string;
    perspective: string;
  }[];
}

// ============== LIVE STORY GENERATOR ==============

export class LiveStoryGenerator {
  private bridge: ArchetypalStoryBridge;
  private culturalGenerator: CulturalStoryGenerator;

  constructor() {
    this.bridge = new ArchetypalStoryBridge();
    this.culturalGenerator = new CulturalStoryGenerator();
  }

  /**
   * Generate complete story with AI enhancement
   */
  async generateStory(
    request: StoryGenerationRequest
  ): Promise<GeneratedStory> {

    // Step 1: Generate archetypal seeds
    const seeds = await this.generateSeeds(request);

    // Step 2: Create narrative structure
    const narrative = await this.createNarrative(seeds, request);

    // Step 3: Generate title
    const title = this.generateTitle(seeds, request);

    // Step 4: Create practices
    const practices = this.createPractices(seeds);

    // Step 5: Generate reflection prompts
    const reflection = this.createReflection(seeds, request);

    // Step 6: Add cross-cultural wisdom if requested
    const crossCulturalWisdom = request.crossCultural
      ? await this.generateCrossCulturalPerspectives(seeds, request)
      : undefined;

    return {
      title,
      narrative,
      culturalContext: {
        tradition: seeds.protagonist.culturalContext,
        archetype: seeds.protagonist.archetype,
        deity: seeds.protagonist.name,
        pattern: seeds.primaryArchetype.essence
      },
      transformation: {
        challenge: seeds.challenge.description,
        pathway: seeds.transformation.process,
        wisdom: seeds.transformation.wisdom
      },
      practices,
      reflection,
      crossCulturalWisdom
    };
  }

  /**
   * Generate archetypal seeds
   */
  private async generateSeeds(
    request: StoryGenerationRequest
  ): Promise<ArchetypalStorySeeds> {

    const context: StoryArchetypeContext = {
      userProfile: {
        culturalBackground: [request.culturalTradition],
        openToCrossCultural: request.crossCultural ?? false,
        preferredLanguage: this.mapStyleToLanguage(request.narrativeStyle)
      },
      currentChallenge: request.userChallenge,
      elementalAffinity: request.elementalAffinity || 'fire',
      archetypePreference: request.includeEmergent ? 'mixed' : 'traditional'
    };

    return this.bridge.generateStorySeeds(context);
  }

  /**
   * Create full narrative
   */
  private async createNarrative(
    seeds: ArchetypalStorySeeds,
    request: StoryGenerationRequest
  ): Promise<string> {

    const style = request.narrativeStyle || 'mythological';

    if (style === 'mythological') {
      return this.weaveMythologicalNarrative(seeds, request);
    } else if (style === 'parable') {
      return this.weaveParable(seeds, request);
    } else if (style === 'contemporary') {
      return this.weaveContemporaryStory(seeds, request);
    } else {
      return this.weavePoem(seeds, request);
    }
  }

  /**
   * Weave mythological narrative
   */
  private weaveMythologicalNarrative(
    seeds: ArchetypalStorySeeds,
    request: StoryGenerationRequest
  ): string {

    const { protagonist, challenge, transformation, culturalWisdom } = seeds;

    return `In the ${protagonist.culturalContext}, the elders teach of ${protagonist.name}, who embodies ${protagonist.archetype}.

The story begins when ${challenge.description}.

The challenge appears not as enemy but as teacher, wearing the mask of ${challenge.symbolism}.

"Why do you come?" the seeker asks.

"To show you what you have forgotten," the challenge replies.

Through ${transformation.process}, a deeper truth reveals itself:

${transformation.wisdom}

${culturalWisdom[0]}

The elders teach: What seems like obstacle is often initiation. What looks like breaking is breaking open.

${protagonist.name} reminds us that this pattern lives in all beings. The teaching is eternal, yet personal. The path is ancient, yet walked fresh with each step.

This story is offered as mirror, not prescription. May it reflect something true in your journey.`;
  }

  /**
   * Weave parable
   */
  private weaveParable(
    seeds: ArchetypalStorySeeds,
    request: StoryGenerationRequest
  ): string {

    const { protagonist, challenge, transformation } = seeds;

    return `Once, in the time when teachings walked among us, there was one who faced ${challenge.description}.

Every day, the weight grew heavier. "How can I continue?" they wondered.

One morning, an elder appeared. "You carry the pattern of ${protagonist.archetype}," the elder said. "This is both your burden and your gift."

"How can difficulty be a gift?"

The elder smiled. "Through ${transformation.process}, you will understand."

And so it was. What seemed impossible became the path. What looked like ending became beginning.

${transformation.wisdom}

The seeker became the teacher, simply by walking through what needed to be walked through.

May this teaching serve you as it has served countless others across time.`;
  }

  /**
   * Weave contemporary story
   */
  private weaveContemporaryStory(
    seeds: ArchetypalStorySeeds,
    request: StoryGenerationRequest
  ): string {

    const { protagonist, challenge, transformation } = seeds;

    // Check if emergent archetype
    const isEmergent = 'emergence' in seeds.primaryArchetype;

    if (isEmergent) {
      const emergent = seeds.primaryArchetype as any;

      return `**${protagonist.archetype}**

This pattern emerged around ${emergent.emergence.firstDetected.getFullYear()} in response to ${emergent.emergence.culturalContext}.

You're embodying this archetype right now.

**The Challenge:**
${challenge.description}

This isn't just your personal struggle—it's a collective pattern. About ${Math.round(emergent.emergence.populationPrevalence * 100)}% of people are navigating this same archetypal territory.

**The Pathway:**
${transformation.process}

**The Gift:**
${transformation.wisdom}

You're not alone in this. You're part of an emergent pattern, helping to birth new ways of being for humanity.

**What's Needed:**
${seeds.practices.slice(0, 3).map((p, i) => `${i + 1}. ${p}`).join('\n')}

This is the work. This is the way.`;
    }

    // Traditional archetype in contemporary frame
    return `**From ${protagonist.culturalContext}: ${protagonist.archetype}**

The ancient pattern meets modern life.

You're facing: ${challenge.description}

The wisdom tradition offers: ${transformation.process}

The teaching: ${transformation.wisdom}

**How to Work With This:**
${seeds.practices.slice(0, 3).map((p, i) => `${i + 1}. ${p}`).join('\n')}

Ancient pattern, contemporary application. Timeless wisdom, personal journey.`;
  }

  /**
   * Weave poem
   */
  private weavePoem(
    seeds: ArchetypalStorySeeds,
    request: StoryGenerationRequest
  ): string {

    const { protagonist, challenge, transformation } = seeds;

    return `**${protagonist.archetype}**

${challenge.symbolism}
calling from the depths
calling from the heights
calling you home

Through ${transformation.process.toLowerCase()}
the way reveals itself—
not path to destination
but remembering
you are
the path
the walker
the destination

${transformation.wisdom.toLowerCase()}

${protagonist.name} whispers:
"This pattern lives in you
has always lived in you
will always live in you"

Listen.
Trust.
Walk.`;
  }

  /**
   * Generate title
   */
  private generateTitle(
    seeds: ArchetypalStorySeeds,
    request: StoryGenerationRequest
  ): string {

    const { protagonist, narrativeArc } = seeds;
    const style = request.narrativeStyle || 'mythological';

    if (style === 'mythological') {
      return `The Teaching of ${protagonist.name}: ${protagonist.archetype}`;
    } else if (style === 'parable') {
      return `A Parable of ${protagonist.archetype}`;
    } else if (style === 'contemporary') {
      return `${protagonist.archetype}: A Contemporary Journey`;
    } else {
      return `${protagonist.archetype}`;
    }
  }

  /**
   * Create practices
   */
  private createPractices(seeds: ArchetypalStorySeeds): GeneratedStory['practices'] {

    return seeds.practices.slice(0, 4).map(practice => {
      // Parse practice into title and description
      const parts = practice.split(':');
      if (parts.length > 1) {
        return {
          title: parts[0].trim(),
          description: parts.slice(1).join(':').trim()
        };
      }

      return {
        title: practice,
        description: `A practice from ${seeds.protagonist.culturalContext} for embodying ${seeds.protagonist.archetype}.`
      };
    });
  }

  /**
   * Create reflection prompts
   */
  private createReflection(
    seeds: ArchetypalStorySeeds,
    request: StoryGenerationRequest
  ): GeneratedStory['reflection'] {

    const { protagonist, transformation } = seeds;

    const questions = [
      `What in this story resonates most deeply with your current journey?`,
      `How does the pattern of ${protagonist.archetype} show up in your life right now?`,
      `What would it mean to embody: ${transformation.wisdom}?`,
      `What practices feel most aligned with where you are?`
    ];

    const journalPrompt = `Sit with the teaching of ${protagonist.name}. Write what emerges when you ask: "${transformation.wisdom}" What does this mean for me, in my life, right now?`;

    return {
      questions,
      journalPrompt
    };
  }

  /**
   * Generate cross-cultural perspectives
   */
  private async generateCrossCulturalPerspectives(
    seeds: ArchetypalStorySeeds,
    request: StoryGenerationRequest
  ): Promise<GeneratedStory['crossCulturalWisdom']> {

    // Skip for emergent archetypes
    if ('emergence' in seeds.primaryArchetype) {
      return undefined;
    }

    const traditional = seeds.primaryArchetype as any;

    // Get 2-3 other cultural forms
    const otherForms = traditional.culturalForms
      .filter((f: any) => f.culture !== request.culturalTradition)
      .slice(0, 3);

    return otherForms.map((form: any) => ({
      tradition: form.culture,
      perspective: `In ${form.culture} tradition, this pattern appears as ${form.deity || form.name}. ${form.story || `The teaching emphasizes ${traditional.essence}`}`
    }));
  }

  // ============== HELPERS ==============

  private mapStyleToLanguage(
    style?: string
  ): 'mythological' | 'psychological' | 'spiritual' | 'scientific' {
    if (style === 'contemporary') return 'psychological';
    if (style === 'poetic') return 'spiritual';
    return 'mythological';
  }
}

// ============== CONVENIENCE FUNCTION ==============

/**
 * Quick story generation
 */
export async function generateLiveStory(
  userChallenge: string,
  culturalTradition: CulturalTradition,
  options?: {
    elementalAffinity?: SpiralogicElement;
    narrativeStyle?: 'mythological' | 'parable' | 'contemporary' | 'poetic';
    crossCultural?: boolean;
  }
): Promise<GeneratedStory> {

  const generator = new LiveStoryGenerator();

  return generator.generateStory({
    userChallenge,
    culturalTradition,
    elementalAffinity: options?.elementalAffinity,
    narrativeStyle: options?.narrativeStyle || 'mythological',
    includeEmergent: true,
    crossCultural: options?.crossCultural ?? false
  });
}
