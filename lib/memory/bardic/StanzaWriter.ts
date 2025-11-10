/**
 * StanzaWriter
 *
 * Compresses lived scenes into poetic recall keys (≤300 chars)
 *
 * Principles:
 * - Affect + place + meaning (not clinical description)
 * - Evocative, not exhaustive
 * - Reconstitutes felt-sense when read
 * - Bardic compression: uses rhythm, imagery, resonance
 *
 * Example:
 * Instead of: "Had a conversation with Sarah about my career anxiety at the coffee shop"
 * Stanza: "Cedar-scented morning. Sarah's eyes holding the question I couldn't ask. Fear & possibility, braided."
 */

import Anthropic from '@anthropic-ai/sdk';

export interface StanzaInput {
  text: string; // Raw text of the episode (conversation, reflection, etc.)
  placeCue?: string;
  senseCues?: string[];
  people?: string[];
  affectValence?: number; // -5 to +5
  affectArousal?: number; // 0 to 10
}

export class StanzaWriter {
  private anthropic: Anthropic;

  constructor(apiKey?: string) {
    this.anthropic = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY || ''
    });
  }

  /**
   * Write stanza for an episode
   *
   * Returns poetic compression (≤300 chars) that evokes the scene
   */
  async write(input: StanzaInput): Promise<string> {
    try {
      const prompt = this.craftPrompt(input);

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const stanza = response.content[0].type === 'text'
        ? response.content[0].text.trim()
        : '';

      // Ensure ≤300 chars
      if (stanza.length > 300) {
        return stanza.substring(0, 297) + '...';
      }

      return stanza;
    } catch (error) {
      console.error('[StanzaWriter] Error:', error);
      // Fallback: simple compression
      return this.fallbackStanza(input);
    }
  }

  /**
   * Craft prompt for Claude
   */
  private craftPrompt(input: StanzaInput): string {
    const affectDesc = this.describeAffect(input.affectValence, input.affectArousal);
    const cuesDesc = this.describeCues(input);

    return `
You are a bardic memory keeper. Compress this lived scene into a poetic stanza (≤300 characters) that can later reconstitute the felt-sense of the moment.

DO NOT:
- Use clinical language
- List facts
- Explain or analyze

DO:
- Evoke affect, place, and meaning
- Use sensory imagery
- Capture the essential resonance
- Write with rhythm and breath

Scene details:
${cuesDesc}
Affect: ${affectDesc}

Raw text:
${input.text.substring(0, 1000)} ${input.text.length > 1000 ? '...' : ''}

Write the stanza (≤300 chars):
`.trim();
  }

  /**
   * Describe affect in poetic terms
   */
  private describeAffect(valence?: number, arousal?: number): string {
    if (valence === undefined || arousal === undefined) {
      return 'Unknown';
    }

    const valenceName = valence > 2 ? 'Joy/Light' :
                       valence < -2 ? 'Grief/Dark' :
                       'Neutral/Mixed';

    const arousalName = arousal > 7 ? 'Intense' :
                       arousal > 4 ? 'Moderate' :
                       'Calm';

    return `${valenceName}, ${arousalName}`;
  }

  /**
   * Describe cues (place, scent, people)
   */
  private describeCues(input: StanzaInput): string {
    const parts: string[] = [];

    if (input.placeCue) {
      parts.push(`Place: ${input.placeCue}`);
    }

    if (input.senseCues && input.senseCues.length > 0) {
      parts.push(`Senses: ${input.senseCues.join(', ')}`);
    }

    if (input.people && input.people.length > 0) {
      parts.push(`With: ${input.people.join(', ')}`);
    }

    return parts.length > 0 ? parts.join('. ') : 'No specific cues';
  }

  /**
   * Fallback stanza if API fails
   */
  private fallbackStanza(input: StanzaInput): string {
    const place = input.placeCue || 'Unknown place';
    const affect = input.affectValence !== undefined && input.affectValence > 0
      ? 'light'
      : input.affectValence !== undefined && input.affectValence < 0
      ? 'shadow'
      : 'between';

    const firstLine = input.text.split('.')[0] || input.text.substring(0, 100);

    return `${place}. ${affect}. ${firstLine}`;
  }
}

/**
 * Create singleton instance
 */
let stanzaWriter: StanzaWriter | null = null;

export function getStanzaWriter(): StanzaWriter {
  if (!stanzaWriter) {
    stanzaWriter = new StanzaWriter();
  }
  return stanzaWriter;
}
