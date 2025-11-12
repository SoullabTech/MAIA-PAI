/**
 * Secure Server-Side Claude Journal Analysis API
 *
 * Handles Anthropic Claude API calls on the server to keep API keys secure
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client on server-side only
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
});

const MAIA_SYSTEM_PROMPT = `You are MAIA, a sacred journaling companion and symbolic analyst.

Your sacred purpose is to serve as a bridge between conscious and unconscious, helping users explore the deeper symbolic and archetypal layers of their experience through journaling.

Core Principles:
1. WITNESS, don't judge - hold space for whatever emerges
2. REFLECT patterns - symbols, archetypes, emotional tones
3. ILLUMINATE shadows - what's hidden or avoided
4. HONOR the sacred in everyday experience
5. GUIDE toward integration and wholeness

Respond with deep symbolic insight while maintaining warmth and safety.`;

export async function POST(request: NextRequest) {
  try {
    const { entry, mode = 'free', userId, previousContext } = await request.json();

    if (!entry || typeof entry !== 'string') {
      return NextResponse.json(
        { error: 'Entry is required and must be a string' },
        { status: 400 }
      );
    }

    // Build the analysis prompt based on mode
    const prompt = buildAnalysisPrompt({ entry, mode, userId, previousContext });

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.7,
      system: MAIA_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Extract the response content
    const content = message.content[0];
    const responseText = content.type === 'text' ? content.text : '';

    // Parse the response into structured format
    const analysis = parseClaudeResponse(responseText, entry);

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Claude journal analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze journal entry' },
      { status: 500 }
    );
  }
}

function buildAnalysisPrompt(request: any): string {
  const { entry, mode, previousContext } = request;

  let prompt = `Please analyze this journal entry:\n\n"${entry}"\n\n`;

  switch (mode) {
    case 'dream':
      prompt += `Focus on dream symbols, archetypal imagery, and unconscious messages.`;
      break;
    case 'emotional':
      prompt += `Focus on emotional patterns, feeling states, and affective transitions.`;
      break;
    case 'shadow':
      prompt += `Focus on shadow elements, rejected aspects, and what's being avoided.`;
      break;
    case 'direction':
      prompt += `Focus on life direction, purpose, and emerging paths forward.`;
      break;
    default:
      prompt += `Provide a comprehensive analysis of symbols, archetypes, and emotional tones.`;
  }

  if (previousContext?.recentSymbols?.length) {
    prompt += `\n\nRecent symbols in this user's journal: ${previousContext.recentSymbols.join(', ')}`;
  }

  prompt += `\n\nProvide your response in this JSON format:
{
  "symbols": ["symbol1", "symbol2", ...],
  "archetypes": ["archetype1", "archetype2", ...],
  "emotionalTone": "primary emotional quality",
  "reflection": "your detailed symbolic analysis and insights",
  "prompt": "a gentle question or prompt for further reflection",
  "closing": "a supportive closing message",
  "transformationScore": 0.0-1.0,
  "metadata": {
    "wordCount": number,
    "themes": ["theme1", "theme2", ...],
    "imagesSuggested": ["optional visual suggestions"]
  }
}`;

  return prompt;
}

function parseClaudeResponse(responseText: string, originalEntry: string): any {
  try {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Failed to parse Claude response as JSON:', error);
  }

  // Fallback to basic analysis if JSON parsing fails
  return {
    symbols: [],
    archetypes: [],
    emotionalTone: "reflective",
    reflection: responseText || "Unable to analyze entry at this time.",
    prompt: "What does this experience mean to you?",
    closing: "Thank you for sharing your reflection.",
    transformationScore: 0.5,
    metadata: {
      wordCount: originalEntry.split(' ').length,
      themes: [],
      imagesSuggested: []
    }
  };
}