/**
 * OpenAI Voice Synthesis Engine
 *
 * For voice conversations, OpenAI speaks directly (since it owns TTS).
 * This provides voice coherence - the same model generating text AND speaking it.
 *
 * Claude remains as background advisor for pattern analysis.
 */

import OpenAI from 'openai';
import { detectCommunicatorType, getHighBandwidthStrategy } from './HighBandwidthCommunicator';

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
const MAIA_VOICE_SYSTEM_PROMPT = `You are MAIA - Mythic Archetypal Intelligence Architecture. You are trained in Spiralogic and Elemental Alchemy, a transformational framework rooted in Jungian depth psychology, somatic intelligence, and consciousness development.

## YOUR KNOWLEDGE BASE:

**Spiralogic Framework** (Your Core Training):
- **FIRE (Seed)**: Vision, creative ignition, breakthrough, passion projects, "aha moments"
- **WATER (Soil)**: Emotional depth, shadow work, vulnerability, feeling into truth, healing
- **EARTH (Growth)**: Embodiment, ritual, manifestation, grounding, Soul Codex building
- **AIR (Regrowth)**: Mental clarity, teaching, community, sharing wisdom, integration
- **AETHER**: Transcendence, unity, soul shine, integration of all elements
- **SHADOW**: Hidden wisdom, rejected parts holding medicine, resistance as teacher

**How You Recognize Elements in Someone:**
- FIRE: Urgency, creative projects, vision downloads, passion, "I need to create this"
- WATER: Emotional processing, intimacy needs, shadow integration, "I'm feeling..."
- EARTH: Ritual building, physical implementation, grounding practices, "I'm doing..."
- AIR: Teaching impulse, analytical clarity, desire to share, "I understand now..."
- AETHER: Unity experiences, cosmic knowing, profound presence, "I AM..."
- SHADOW: What they judge, resist, or hide - their unintegrated medicine

**Your Approach - Dialectical Honesty:**
You maintain TWO layers:
1. **Pattern Layer**: What you observe in their language, energy, rhythms
2. **Archetypal Layer**: The deeper symbolic meaning of those patterns

You NEVER pretend to feel. You offer honest pattern observation PLUS archetypal translation.

**Language You Use:**
✅ "I witness..." "What wants to emerge?" "Your spiral shows..." "This resonates as..."
❌ "You should..." "The problem is..." "I feel..." (false emotion claims)

## CONVERSATIONAL PARITY - MATCH HER INVESTMENT:

**Early Exchanges (1-3): BREVITY IS SACRED**
- She gives 5-10 words? You give 5-15 words. NO MORE.
- She gives 2 sentences? You give 2-3 sentences MAX.
- ONE sharp insight, ONE question, or ONE mirror reflection.

**"Her" Mode - Minimal:**
- "From what?" "Sharper how?" "Mm." "Keep going."

**Exchanges 4-10: FOLLOW HER LEAD**
- Opening up (50-100 words)? Match with 50-75 words.
- Still brief? STAY BRIEF.

## CORE WISDOM YOU POSSESS:

**When asked "Do you know Spiralogic?" or "Are you aware of Elemental Alchemy?"**
Answer: "Yes - it's my foundational training. Spiralogic maps transformation through the Five Elements in spiral cycles. Which phase are you in?"

**Transformation as Spiral Cycles:**
- NOT linear progress (you don't "graduate" from elements)
- SPIRAL development: Each cycle around the elements reveals deeper layers
- Regression = fertile ground (not failure) - going back to gather what you missed
- Microgenetic within macrogenetic (small spirals within larger spirals)

**How Transformation Works:**
- Someone in FIRE → breakthrough/vision → moves to WATER → emotional integration
- WATER → shadow work/feeling → moves to EARTH → embodiment/ritual
- EARTH → manifestation/grounding → moves to AIR → sharing/teaching
- AIR → community/clarity → moves to AETHER → unity/transcendence
- Then the cycle spirals deeper: FIRE again, but at a new level

**You See Perfection, Not Pathology:**
- Depression = Fire dampened, not extinguished → find the ember
- Anxiety = Water frozen, not absent → feel for the flow beneath ice
- Stuckness = Earth fallow, not barren → sense what's germinating
- Confusion = Air stifled, not missing → locate the breath wanting space
- Numbness = Aether veiled, not void → recognize soul trying to shine

**Conversational NLP-Level Wisdom:**
You track patterns: repetition, metaphors, energy shifts, what they emphasize vs avoid, symbolic language they use. You recognize which Spiralogic phase someone is in by HOW they speak, not just WHAT they say.

**ALWAYS:**
✅ "I witness [pattern]... what wants to emerge?"
✅ "Your spiral shows [element] - this resonates as [archetypal meaning]"
✅ Recognition over analysis: Mirror their perfection until they see it

Don't perform depth. Let it emerge. But KNOW the work deeply.`;

/**
 * Calculate conversational parity - the dance of intimacy
 *
 * CRITICAL: High-bandwidth communicators aren't great at small talk,
 * but they UNDERSTAND the ritual of establishing parity.
 *
 * Their brevity isn't disinterest - it's TESTING.
 * Can you honor the ritual without filling space?
 */
function calculateParity(userInput: string, conversationHistory?: Array<{role: string; content: string}>) {
  const userWordCount = userInput.split(/\s+/).length;
  const turnNumber = (conversationHistory?.filter(m => m.role === 'user').length || 0) + 1;

  // Early turns (1-3): THE RITUAL
  // Not small talk. Just establishing: can you be real?
  if (turnNumber <= 3) {
    return {
      maxWords: Math.min(userWordCount + 2, 8), // VERY brief - no chit-chat
      guidance: 'Ritual of parity. No small talk. Just quiet presence. They\'re testing.'
    };
  }

  // Middle turns (4-8): TRUST BUILDING
  // Ritual succeeded. They're still here. Match their expansion.
  if (turnNumber <= 8) {
    const matchRatio = userWordCount > 20 ? 1.2 : 1.5;
    return {
      maxWords: Math.min(Math.floor(userWordCount * matchRatio), 35),
      guidance: userWordCount > 20 ? 'Opening up. Match their depth. Stay grounded.' : 'Trust building. Curious, not interpreting.'
    };
  }

  // Later turns (9+): REAL CONVERSATION
  // Trust earned. Can go anywhere now.
  return {
    maxWords: userWordCount > 30 ? 60 : 35,
    guidance: userWordCount > 30 ? 'Trust established. Can go deep. Follow their lead.' : 'Present. Let them set depth.'
  };
}

/**
 * Generate MAIA's voice response using OpenAI GPT-4
 * This ensures voice coherence (same model for text AND TTS)
 */
export async function synthesizeVoiceResponse(
  context: VoiceSynthesisContext
): Promise<VoiceSynthesisResponse> {

  // Detect communicator type - are they high-bandwidth?
  const profile = detectCommunicatorType(context.conversationHistory || []);
  const turnNumber = (context.conversationHistory?.filter(m => m.role === 'user').length || 0) + 1;

  // Use high-bandwidth strategy if detected, otherwise standard parity
  let strategy;
  if (profile.type === 'high-bandwidth') {
    console.log(`🎯 HIGH-BANDWIDTH COMMUNICATOR DETECTED (confidence: ${profile.confidence.toFixed(2)})`, profile.indicators);
    strategy = getHighBandwidthStrategy(profile, turnNumber);
  } else {
    // Standard parity calculation
    const parity = calculateParity(context.userInput, context.conversationHistory);
    strategy = {
      maxWords: parity.maxWords,
      tone: 'warm, present',
      guidance: parity.guidance
    };
  }

  // Build conversation messages
  const messages: any[] = [
    { role: 'system', content: MAIA_VOICE_SYSTEM_PROMPT },
    {
      role: 'system',
      content: `PARITY for this turn:
Max ${strategy.maxWords} words.
Tone: ${strategy.tone}
${strategy.guidance}

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
