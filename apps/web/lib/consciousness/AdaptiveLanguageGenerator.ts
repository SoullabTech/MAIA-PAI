/**
 * ADAPTIVE LANGUAGE GENERATOR
 *
 * Core engine that generates responses at the appropriate consciousness level.
 *
 * Flow:
 * 1. Detect user's consciousness level
 * 2. Analyze elemental signature of input
 * 3. Build appropriate prompt for level
 * 4. Generate response via Claude/Llama
 * 5. Filter for cringe
 * 6. Return adapted response
 *
 * Kelly's Vision: "Meet people where they are. No cringe. Just wisdom."
 */

import { ConsciousnessLevel, ConsciousnessLevelDetector } from './ConsciousnessLevelDetector';
import { getSystemPrompt, ADAPTIVE_PROMPTS } from './AdaptiveSystemPrompts';
import { CringeFilter, addNoCringeRules } from './CringeFilter';
import Anthropic from '@anthropic-ai/sdk';

export interface ElementalAnalysis {
  fire: number;      // 0-10: Creative drive, vision, emergence
  water: number;     // 0-10: Emotional depth, feeling, intuition
  earth: number;     // 0-10: Grounding, embodiment, practical action
  air: number;       // 0-10: Mental clarity, perspective, integration
  aether: number;    // 0-10: Coherent presence, wholeness, unity
}

export interface AdaptiveResponse {
  message: string;
  consciousnessLevel: ConsciousnessLevel;
  elementalSignature: ElementalAnalysis;
  cringeScore: number;
  passedCringeFilter: boolean;
  metadata: {
    promptTemplate: string;
    modelUsed: string;
    generationTime: number;
  };
}

export class AdaptiveLanguageGenerator {
  private levelDetector: ConsciousnessLevelDetector;
  private cringeFilter: CringeFilter;
  private anthropic: Anthropic;

  constructor() {
    this.levelDetector = new ConsciousnessLevelDetector();
    this.cringeFilter = new CringeFilter();

    // Initialize Anthropic client
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
    });
  }

  /**
   * Generate adaptive response based on user's consciousness level
   */
  async generateResponse(params: {
    input: string;
    userId: string;
    consciousnessLevel?: ConsciousnessLevel; // Optional override
  }): Promise<AdaptiveResponse> {

    const startTime = Date.now();
    const { input, userId, consciousnessLevel } = params;

    // 1. Detect or use provided consciousness level
    const level = consciousnessLevel || await this.levelDetector.detectLevel({ userId });

    // 2. Analyze elemental signature of input
    const elementalSignature = await this.analyzeElements(input);

    // 3. Build prompt appropriate for level
    const systemPrompt = this.buildPrompt(input, elementalSignature, level);

    // 4. Generate response
    const rawResponse = await this.callClaude(systemPrompt, input, level);

    // 5. Check for cringe
    const cringeAnalysis = this.cringeFilter.analyze(rawResponse);

    // If cringe detected and score is high, regenerate with stricter rules
    let finalResponse = rawResponse;
    if (cringeAnalysis.score > 0.5) {
      console.warn(`Cringe detected (score: ${cringeAnalysis.score}). Regenerating...`);
      const stricterPrompt = this.buildPrompt(input, elementalSignature, level, true);
      finalResponse = await this.callClaude(stricterPrompt, input, level);
    }

    const generationTime = Date.now() - startTime;

    return {
      message: finalResponse,
      consciousnessLevel: level,
      elementalSignature,
      cringeScore: cringeAnalysis.score,
      passedCringeFilter: cringeAnalysis.passesFilter,
      metadata: {
        promptTemplate: ADAPTIVE_PROMPTS[level].name,
        modelUsed: 'claude-3-7-sonnet-20250219',
        generationTime
      }
    };
  }

  /**
   * Analyze elemental signature of user input
   */
  private async analyzeElements(input: string): Promise<ElementalAnalysis> {
    // Simple keyword-based analysis for now
    // TODO: Use Claude to analyze elemental signature more sophisticatedly

    const lowerInput = input.toLowerCase();

    // Fire indicators: action verbs, creation words, urgency
    const fireWords = ['create', 'do', 'start', 'build', 'make', 'now', 'urgent', 'push'];
    const fire = this.countMatches(lowerInput, fireWords) * 2;

    // Water indicators: feeling words, emotional language
    const waterWords = ['feel', 'emotion', 'heart', 'love', 'sad', 'happy', 'overwhelm', 'afraid'];
    const water = this.countMatches(lowerInput, waterWords) * 2;

    // Earth indicators: body words, practical concerns, grounding
    const earthWords = ['body', 'physical', 'ground', 'real', 'practical', 'concrete', 'tangible'];
    const earth = this.countMatches(lowerInput, earthWords) * 2;

    // Air indicators: thinking words, mental processing
    const airWords = ['think', 'understand', 'clarity', 'perspective', 'analyze', 'consider'];
    const air = this.countMatches(lowerInput, airWords) * 2;

    // Aether: presence, wholeness, integration words
    const aetherWords = ['whole', 'integrate', 'presence', 'aware', 'conscious', 'unity'];
    const aether = this.countMatches(lowerInput, aetherWords) * 2;

    // Normalize to 0-10 scale
    const max = Math.max(fire, water, earth, air, aether, 1);

    return {
      fire: Math.min(Math.round((fire / max) * 10), 10),
      water: Math.min(Math.round((water / max) * 10), 10),
      earth: Math.min(Math.round((earth / max) * 10), 10),
      air: Math.min(Math.round((air / max) * 10), 10),
      aether: Math.min(Math.round((aether / max) * 10), 10),
    };
  }

  /**
   * Count keyword matches in text
   */
  private countMatches(text: string, keywords: string[]): number {
    return keywords.reduce((count, keyword) => {
      const regex = new RegExp(`\\b${keyword}`, 'gi');
      return count + (text.match(regex)?.length || 0);
    }, 0);
  }

  /**
   * Build complete system prompt for level
   */
  private buildPrompt(
    input: string,
    analysis: ElementalAnalysis,
    level: ConsciousnessLevel,
    extraStrict: boolean = false
  ): string {

    // Get base prompt for level
    let systemPrompt = getSystemPrompt(level);

    // Add NO CRINGE rules
    systemPrompt = addNoCringeRules(systemPrompt);

    // Add elemental context
    const elementalContext = `
ELEMENTAL SIGNATURE OF USER'S MESSAGE:
- Fire (creative drive): ${analysis.fire}/10
- Water (emotional depth): ${analysis.water}/10
- Earth (grounding): ${analysis.earth}/10
- Air (mental clarity): ${analysis.air}/10
- Aether (coherence): ${analysis.aether}/10

${level >= 3 ? 'You may reference these elements in your response if appropriate for the level.' : 'Do NOT reference elements - user is not ready for this framework.'}
`;

    systemPrompt = `${systemPrompt}\n\n${elementalContext}`;

    // If regenerating due to cringe, add extra strict rules
    if (extraStrict) {
      systemPrompt += `\n\nWARNING: Previous response failed cringe check. Be EXTRA direct and grounded.`;
    }

    return systemPrompt;
  }

  /**
   * Call Claude API for response generation
   */
  private async callClaude(
    systemPrompt: string,
    userInput: string,
    level: ConsciousnessLevel
  ): Promise<string> {

    try {
      const message = await this.anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: level >= 4 ? 800 : 500, // More tokens for advanced levels
        temperature: level >= 4 ? 0.7 : 0.6, // Slightly more creative for advanced
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userInput
          }
        ]
      });

      const response = message.content[0];
      if (response.type === 'text') {
        return response.text;
      }

      throw new Error('Unexpected response type from Claude');

    } catch (error) {
      console.error('Claude API error:', error);

      // Fallback response
      return this.getFallbackResponse(level);
    }
  }

  /**
   * Fallback response if API fails
   */
  private getFallbackResponse(level: ConsciousnessLevel): string {
    const fallbacks = {
      1: "I'm having trouble connecting right now, but I hear you. What you're experiencing sounds challenging. Can you tell me more about what's going on?",
      2: "I'm experiencing some technical difficulty, but I'm here. It sounds like something important is coming up for you. What's beneath the surface of this?",
      3: "Technical glitch on my end - give me a moment. But what you're sharing has a particular energy to it. What element feels most present - is it more emotional (Water) or more about taking action (Fire)?",
      4: "API hiccup - back in a moment. But I'm sensing something significant in what you're sharing. What's the elemental signature here for you?",
      5: "Connection interrupted briefly. But the pattern you're describing carries weight. What's the alchemical work happening here?"
    };

    return fallbacks[level];
  }

  /**
   * Quick test method to compare responses across all levels
   */
  async testAllLevels(input: string, userId: string): Promise<Record<ConsciousnessLevel, AdaptiveResponse>> {
    const results = {} as Record<ConsciousnessLevel, AdaptiveResponse>;

    for (let level = 1; level <= 5; level++) {
      results[level as ConsciousnessLevel] = await this.generateResponse({
        input,
        userId,
        consciousnessLevel: level as ConsciousnessLevel
      });
    }

    return results;
  }
}
