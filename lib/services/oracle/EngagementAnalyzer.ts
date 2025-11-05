/**
 * Engagement Analyzer Service
 *
 * Analyzes user engagement and emotional depth:
 * - Emotional tone detection
 * - Engagement level assessment
 * - Transformation moment detection
 * - Sacred moment recognition
 * - Contextual suggestion generation
 *
 * Earth Phase Service Extraction - Following Spiralogic Principles
 */

/**
 * Service for analyzing user engagement and emotional depth
 */
export class EngagementAnalyzer {
  /**
   * Detect emotional tone from user input
   */
  detectEmotionalTone(input: string): string {
    const lower = input.toLowerCase();

    // Joy indicators
    if (/\b(happy|joy|excited|grateful|love|amazing|wonderful)\b/i.test(lower)) {
      return 'joy';
    }

    // Sadness indicators
    if (/\b(sad|grief|loss|miss|lonely|depressed|down)\b/i.test(lower)) {
      return 'sadness';
    }

    // Fear/anxiety indicators
    if (/\b(afraid|scared|anxious|worry|nervous|fear)\b/i.test(lower)) {
      return 'fear';
    }

    // Anger indicators
    if (/\b(angry|frustrated|mad|annoyed|upset|irritated)\b/i.test(lower)) {
      return 'anger';
    }

    // Peace indicators
    if (/\b(calm|peaceful|serene|tranquil|still|centered)\b/i.test(lower)) {
      return 'peace';
    }

    // Curiosity indicators
    if (/\b(wonder|curious|interesting|explore|discover|fascinated)\b/i.test(lower)) {
      return 'curiosity';
    }

    return 'neutral';
  }

  /**
   * Assess engagement level from exchange
   */
  assessEngagementLevel(userInput: string, mayaResponse: string): 'deep' | 'engaged' | 'neutral' | 'disengaged' | 'closed' {
    const userLength = userInput.split(' ').length;
    const hasVulnerability = /\b(feel|struggle|difficult|hard|lost|confused|vulnerable|shame|guilt|alone)\b/i.test(userInput);
    const hasDepth = /\b(meaning|purpose|soul|spirit|truth|authentic|real|deep)\b/i.test(userInput);

    if ((userLength > 40 && hasVulnerability) || hasDepth) {
      return 'deep';
    }

    if (userLength > 20 || hasVulnerability) {
      return 'engaged';
    }

    if (userLength > 5) {
      return 'neutral';
    }

    return 'disengaged';
  }

  /**
   * Detect transformation moments
   */
  detectTransformation(userInput: string, mayaResponse: string): boolean {
    const transformationIndicators = [
      /\b(realize|see now|never thought|breakthrough|shift|changed|different)\b/i,
      /\b(understand now|makes sense|clarity|clear now|got it)\b/i,
      /\b(ready to|want to try|willing to|going to)\b/i
    ];

    return transformationIndicators.some(pattern => pattern.test(userInput));
  }

  /**
   * Detect sacred/significant moments
   */
  detectSacredMoment(userInput: string, mayaResponse: string): boolean {
    const sacredIndicators = [
      /\b(sacred|divine|soul|spirit|profound|deep truth)\b/i,
      /\b(first time|never felt|always wanted|finally)\b/i,
      /\b(real me|true self|who I am|authentic)\b/i
    ];

    const userLength = userInput.split(' ').length;
    const hasDepth = userLength > 50;
    const hasSacredLanguage = sacredIndicators.some(pattern => pattern.test(userInput));

    return hasDepth && hasSacredLanguage;
  }

  /**
   * Generate contextual suggestions based on patterns
   */
  generateSuggestions(symbols: string[], archetypes: string[]): string[] {
    const suggestions: string[] = [];

    if (symbols.length >= 3) {
      suggestions.push(`Explore the connection between ${symbols[0]} and ${symbols[1]}`);
    }

    if (archetypes.includes('Shadow')) {
      suggestions.push('Consider a shadow work journaling session');
    }

    if (archetypes.includes('Seeker') || archetypes.includes('Explorer')) {
      suggestions.push('Try a life direction journaling prompt');
    }

    return suggestions.slice(0, 2);
  }

  /**
   * Determine emotional shift for semantic memory
   */
  determineEmotionalShift(
    emotionalTone: string,
    safetyAction: string
  ): 'positive' | 'neutral' | 'negative' | 'crisis' {
    if (safetyAction === 'lock_session') {
      return 'crisis';
    } else if (emotionalTone === 'positive' || emotionalTone === 'hopeful') {
      return 'positive';
    } else if (emotionalTone === 'distress' || emotionalTone === 'anxiety') {
      return 'negative';
    }
    return 'neutral';
  }
}

/**
 * Create service instance
 */
export function createEngagementAnalyzer(): EngagementAnalyzer {
  return new EngagementAnalyzer();
}
