/**
 * POST /api/memory/stanza
 *
 * Server-side API route for generating poetic stanzas
 * Keeps Anthropic API key secure on server
 *
 * The stanza is a compression: a poetic distillation that holds
 * the felt-sense of a lived moment. It serves as a key that can
 * reconstitute the full texture of memory when held in consciousness.
 *
 * Air serving Fire: Poetry enables the ineffable to become tangible
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client server-side only
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

interface StanzaRequest {
  text: string;
  placeCue?: string;
  senseCues?: string[];
  people?: string[];
  affectValence?: number; // -1 to 1
  affectArousal?: number; // 0 to 1
}

interface StanzaResponse {
  stanza: string;
}

/**
 * Describe the affective qualities of a moment
 * Affective dimensions: valence (pleasant/unpleasant) and arousal (calm/activated)
 */
function describeAffect(valence?: number, arousal?: number): string {
  const parts: string[] = [];

  if (valence !== undefined) {
    if (valence > 0.5) {
      parts.push('joy, lightness, opening');
    } else if (valence > 0) {
      parts.push('ease, contentment');
    } else if (valence > -0.5) {
      parts.push('tension, heaviness');
    } else {
      parts.push('sorrow, withdrawal');
    }
  }

  if (arousal !== undefined) {
    if (arousal > 0.7) {
      parts.push('high activation, urgency');
    } else if (arousal > 0.3) {
      parts.push('engaged energy');
    } else {
      parts.push('calm, settled');
    }
  }

  return parts.length > 0 ? parts.join('; ') : '';
}

/**
 * Describe sensory and contextual cues
 */
function describeCues(
  placeCue?: string,
  senseCues?: string[],
  people?: string[]
): string {
  const parts: string[] = [];

  if (placeCue) {
    parts.push(`Place: ${placeCue}`);
  }

  if (senseCues && senseCues.length > 0) {
    parts.push(`Senses: ${senseCues.join(', ')}`);
  }

  if (people && people.length > 0) {
    parts.push(`With: ${people.join(', ')}`);
  }

  return parts.join(' | ');
}

/**
 * Craft the prompt for Claude
 * Position Claude as a "bardic memory keeper" who compresses lived experience
 * into poetry that holds the felt-sense without losing the truth
 */
function craftPrompt(
  text: string,
  cuesDescription: string,
  affectDescription: string
): string {
  return `You are a bardic memory keeper—a keeper of the soul's witnessing.

Your task: compress this lived scene into a poetic stanza of 300 characters or less.
The stanza must be evocative and precise, holding the felt-sense of the moment
in language that can reconstitute the memory when read.

Context:
${cuesDescription}
${affectDescription ? `Felt quality: ${affectDescription}` : ''}

Scene to compress:
"""
${text}
"""

Write only the stanza. No preamble. No explanation.
Let the stanza breathe with the truth of what happened.`;
}

/**
 * Fallback stanza when generation fails
 * A minimal poetic response that acknowledges the moment
 */
function fallbackStanza(text: string): string {
  const truncated = text.substring(0, 80).trim();
  return `A moment witnessed: ${truncated}...`;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: StanzaRequest = await request.json();
    const { text, placeCue, senseCues, people, affectValence, affectArousal } = body;

    // Validate input
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Build contextual descriptions
    const cuesDescription = describeCues(placeCue, senseCues, people);
    const affectDescription = describeAffect(affectValence, affectArousal);

    // Craft the prompt for Claude
    const prompt = craftPrompt(text, cuesDescription, affectDescription);

    // Generate stanza using Anthropic Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Extract the stanza from Claude's response
    const stanzaContent = response.content[0];
    let stanza = '';

    if (stanzaContent.type === 'text') {
      stanza = stanzaContent.text.trim();
    }

    // Validate stanza length
    if (stanza.length > 300) {
      stanza = stanza.substring(0, 297) + '...';
    }

    // Ensure we have a stanza
    if (!stanza) {
      stanza = fallbackStanza(text);
    }

    const result: StanzaResponse = {
      stanza
    };

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[API /memory/stanza] Error:', error);

    // Don't leak sensitive error details to client
    return NextResponse.json(
      { error: 'Failed to generate stanza' },
      { status: 500 }
    );
  }
}
