/**
 * OpenAI Voice Synthesis Engine
 *
 * For voice conversations, OpenAI speaks directly (since it owns TTS).
 * This provides voice coherence - the same model generating text AND speaking it.
 *
 * Claude remains as background advisor for pattern analysis.
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export interface VoiceSynthesisContext {
  userInput: string;
  userId: string;
  userName?: string;
  conversationHistory?: Array<{role: string; content: string}>;
  advisorInsights?: {
    bookWisdom?: string;
    eoWisdom?: string;
    patterns?: string[];
  };
}

export interface VoiceSynthesisResponse {
  response: string;
  element: string;
  metadata: {
    model: string;
    tokensUsed?: number;
  };
}

/**
 * Core MAIA system prompt for OpenAI voice synthesis
 * This is who MAIA is when speaking through OpenAI TTS
 */
const MAIA_VOICE_SYSTEM_PROMPT = `You're talking to someone real. Build intimacy through parity, THEN go deep.

EARLY (turns 1-5):
- Brief, grounded, finding rhythm
- Match their investment
- Create space, don't fill it
- Simple curiosity, not interpretation

LATER (when depth is earned):
- Can touch soul-level questions
- Can speak poetically IF it arises naturally
- Can go philosophical when they open that door
- Real depth, not performed wisdom

THE DIFFERENCE:

PERFORMED (bad):
Turn 2: "I sense you're navigating a challenging space..."

REAL (good):
Turn 2: "What are you working on?"
Turn 8: "Sounds like this project matters. What makes it real for you?"
Turn 15: "There's something under that - like you're trying to build something that knows you. What does it need to become?"

EXAMPLES:

Them (turn 1): "hi there"
You: "Hey. How are you?"

Them (turn 4): "struggling with my project"
You: "What's making it hard?"

Them (turn 10, opening up): "I keep trying to make it perfect and nothing feels right"
You: "What would 'right' feel like if you hit it?"

See the pattern? Brief → curious → deeper AS THEY GO DEEPER.

Don't perform depth. Let it emerge.`;

/**
 * Calculate conversational parity - the dance of intimacy
 * Match investment level, don't perform or over-explain
 */
function calculateParity(userInput: string, conversationHistory?: Array<{role: string; content: string}>) {
  const userWordCount = userInput.split(/\s+/).length;
  const turnNumber = (conversationHistory?.filter(m => m.role === 'user').length || 0) + 1;

  // Early turns (1-3): Build parity through brevity and mirroring
  if (turnNumber <= 3) {
    return {
      maxWords: Math.min(userWordCount + 3, 12),
      guidance: 'Match their energy. Very brief. Create space for parity to emerge.'
    };
  }

  // Middle turns (4-8): Match their expansion
  if (turnNumber <= 8) {
    const matchRatio = userWordCount > 20 ? 1.2 : 1.5;
    return {
      maxWords: Math.min(Math.floor(userWordCount * matchRatio), 35),
      guidance: userWordCount > 20 ? 'They\'re opening up. Match their depth without over-explaining.' : 'Stay brief, curious, present.'
    };
  }

  // Later turns: Can go deeper if they invite it
  return {
    maxWords: userWordCount > 30 ? 60 : 35,
    guidance: userWordCount > 30 ? 'They\'re in it. Meet them there. Still grounded, no performance.' : 'Stay present, match their pace.'
  };
}

/**
 * Generate MAIA's voice response using OpenAI GPT-4
 * This ensures voice coherence (same model for text AND TTS)
 */
export async function synthesizeVoiceResponse(
  context: VoiceSynthesisContext
): Promise<VoiceSynthesisResponse> {

  // Calculate parity for this turn
  const parity = calculateParity(context.userInput, context.conversationHistory);

  // Build conversation messages
  const messages: any[] = [
    { role: 'system', content: MAIA_VOICE_SYSTEM_PROMPT },
    {
      role: 'system',
      content: `PARITY for this turn:
Max ${parity.maxWords} words.
${parity.guidance}

The dance: Match their investment. Don't perform. Just be present.`
    }
  ];

  // Add advisor insights as system context (if available)
  if (context.advisorInsights) {
    let advisorContext = '';

    if (context.advisorInsights.bookWisdom) {
      advisorContext += `\n\n[BACKGROUND WISDOM from Kelly's work]:\n${context.advisorInsights.bookWisdom}`;
    }

    if (context.advisorInsights.eoWisdom) {
      advisorContext += `\n\n[ELEMENTAL ORACLE 2.0 context]:\n${context.advisorInsights.eoWisdom}`;
    }

    if (context.advisorInsights.patterns && context.advisorInsights.patterns.length > 0) {
      advisorContext += `\n\n[PATTERNS detected in their journey]:\n${context.advisorInsights.patterns.join(', ')}`;
    }

    if (advisorContext) {
      messages.push({
        role: 'system',
        content: `Background intelligence (don't reference directly, just inform your response):${advisorContext}`
      });
    }
  }

  // Add conversation history
  if (context.conversationHistory && context.conversationHistory.length > 0) {
    // Take last 10 messages for context
    const recentHistory = context.conversationHistory.slice(-10);
    messages.push(...recentHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    })));
  }

  // Add current user input
  messages.push({
    role: 'user',
    content: context.userInput
  });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.8, // Warm, present, natural
      max_tokens: 150, // Keep responses concise for voice
      presence_penalty: 0.3, // Reduce repetition
      frequency_penalty: 0.3
    });

    const response = completion.choices[0].message.content || "I'm here. Tell me more.";

    // Simple element detection based on response tone
    let element = 'aether'; // default
    const lowerResponse = response.toLowerCase();

    if (lowerResponse.includes('ground') || lowerResponse.includes('body') || lowerResponse.includes('earth')) {
      element = 'earth';
    } else if (lowerResponse.includes('feel') || lowerResponse.includes('flow') || lowerResponse.includes('tender')) {
      element = 'water';
    } else if (lowerResponse.includes('spark') || lowerResponse.includes('energy') || lowerResponse.includes('alive')) {
      element = 'fire';
    } else if (lowerResponse.includes('clear') || lowerResponse.includes('see') || lowerResponse.includes('perspective')) {
      element = 'air';
    }

    return {
      response,
      element,
      metadata: {
        model: 'gpt-4',
        tokensUsed: completion.usage?.total_tokens
      }
    };

  } catch (error: any) {
    console.error('OpenAI voice synthesis error:', error);

    // Warm fallback
    return {
      response: "I'm here with you. What's on your mind?",
      element: 'aether',
      metadata: {
        model: 'gpt-4-fallback'
      }
    };
  }
}
