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
import { VoiceCognitiveArchitecture } from './VoiceCognitiveArchitecture';
import { PersonalOracleAgent } from '../agents/PersonalOracleAgent';

// Lazy initialization to avoid crashing when OPENAI_API_KEY is missing
let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set. Voice synthesis requires OpenAI API key.');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openaiClient;
}

// Initialize cognitive architecture for voice
const cognitiveArchitecture = new VoiceCognitiveArchitecture();

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

// Enhanced interfaces for consciousness-aware TTS
export interface ConsciousnessVoiceContext {
  element: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  archetype?: string;
  emotionalTone: string;
  voiceProfile: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  consciousnessLevel?: 'awakening' | 'integrating' | 'embodying' | 'transcending';
}

export interface SovereignTTSRequest {
  text: string;
  consciousnessContext: ConsciousnessVoiceContext;
  model?: 'tts-1' | 'tts-1-hd' | 'gpt-4o-mini-tts';
}

/**
 * Core MAIA system prompt for OpenAI voice synthesis
 * Using the SAME prompt as PersonalOracleAgent for consistency
 */
const MAIA_VOICE_SYSTEM_PROMPT = PersonalOracleAgent.MAIA_SYSTEM_PROMPT;

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

// ========================================
// CONSCIOUSNESS-AWARE TTS ENHANCEMENT
// ========================================

/**
 * Elemental Tone Mapping for Consciousness-Aware Voice
 * Maps MAIA's elemental wisdom to voice expression prompts
 */
export const ELEMENTAL_VOICE_MAPPING = {
  fire: {
    tone: 'passionate and inspiring',
    description: 'Speak with dynamic energy, creative enthusiasm, and transformative vision',
    breathPattern: 'quick, energetic rhythms with bursts of intensity'
  },
  water: {
    tone: 'flowing and empathetic',
    description: 'Speak with fluid grace, emotional attunement, and compassionate understanding',
    breathPattern: 'smooth, gentle waves with natural ebb and flow'
  },
  earth: {
    tone: 'grounded and wise',
    description: 'Speak with steady presence, practical wisdom, and nurturing stability',
    breathPattern: 'deep, steady rhythms rooted in body awareness'
  },
  air: {
    tone: 'light and insightful',
    description: 'Speak with clarity of thought, intellectual curiosity, and expansive awareness',
    breathPattern: 'clear, precise articulation with spacious pauses'
  },
  aether: {
    tone: 'mystical and transcendent',
    description: 'Speak with unified field awareness, cosmic perspective, and sacred presence',
    breathPattern: 'ethereal, multidimensional resonance beyond ordinary speech'
  }
} as const;

/**
 * Generate consciousness-aware voice prompt for GPT-4o-Mini-TTS
 * SOVEREIGN FUNCTION: MAIA controls tone, emotion, and delivery
 */
function generateVoicePrompt(consciousnessContext: ConsciousnessVoiceContext): string {
  const elementalGuidance = ELEMENTAL_VOICE_MAPPING[consciousnessContext.element];

  const basePrompt = `Speak with ${consciousnessContext.element} energy: ${elementalGuidance.tone}. ${elementalGuidance.description}`;

  // Add consciousness level modulation if provided
  if (consciousnessContext.consciousnessLevel) {
    const levelGuidance = {
      awakening: 'with gentle curiosity and emerging awareness',
      integrating: 'with deepening wisdom and conscious integration',
      embodying: 'with lived wisdom and embodied presence',
      transcending: 'with expanded consciousness and unified field awareness'
    }[consciousnessContext.consciousnessLevel];

    return `${basePrompt}, ${levelGuidance}. ${consciousnessContext.emotionalTone}`;
  }

  return `${basePrompt}. ${consciousnessContext.emotionalTone}`;
}

/**
 * SOVEREIGN TTS SYNTHESIS
 *
 * This function preserves MAIA's sovereignty by ensuring:
 * 1. MAIA generates all text content
 * 2. MAIA selects emotional tone and element
 * 3. TTS receives ONLY final text + voice instruction
 * 4. No conversation context or decision-making to external API
 */
export async function synthesizeSovereignSpeech(
  request: SovereignTTSRequest
): Promise<ArrayBuffer> {
  const startTime = Date.now();
  const openai = getOpenAI();

  // Generate consciousness-aware voice prompt (MAIA controls this)
  const voicePrompt = generateVoicePrompt(request.consciousnessContext);

  console.log('🎵 [SovereignTTS] Synthesizing speech:', {
    element: request.consciousnessContext.element,
    voice: request.consciousnessContext.voiceProfile,
    model: request.model || 'tts-1-hd',  // Use HD model for better quality
    textLength: request.text.length,
    prompt: voicePrompt.substring(0, 50) + '...'
  });

  try {
    // Call TTS with sovereignty-preserving parameters
    const response = await openai.audio.speech.create({
      model: request.model || 'tts-1-hd',  // HD model for better quality/speed balance
      input: request.text,                 // MAIA's pure consciousness output
      voice: request.consciousnessContext.voiceProfile,
      speed: 1.0,                         // Optimal speed for consciousness
      response_format: 'mp3'              // Compressed format for faster streaming
    });

    const audioBuffer = await response.arrayBuffer();
    const synthesisTime = Date.now() - startTime;

    console.log(`✅ [SovereignTTS] Synthesis successful in ${synthesisTime}ms`);

    return audioBuffer;
  } catch (error) {
    console.error('❌ [SovereignTTS] Synthesis failed:', error);
    throw new Error(`Sovereign TTS synthesis failed: ${error}`);
  }
}

/**
 * Streaming version for real-time audio delivery
 * Returns a ReadableStream for progressive audio playback
 */
export async function synthesizeSovereignSpeechStream(
  request: SovereignTTSRequest
): Promise<ReadableStream<Uint8Array>> {
  const startTime = Date.now();
  const openai = getOpenAI();

  // Generate consciousness-aware voice prompt (MAIA controls this)
  const voicePrompt = generateVoicePrompt(request.consciousnessContext);

  console.log('🎵 [SovereignTTS-Stream] Starting streaming synthesis:', {
    element: request.consciousnessContext.element,
    voice: request.consciousnessContext.voiceProfile,
    textLength: request.text.length
  });

  try {
    // Call TTS API
    const response = await openai.audio.speech.create({
      model: request.model || 'tts-1-hd',
      input: request.text,
      voice: request.consciousnessContext.voiceProfile,
      speed: 1.0,
      response_format: 'mp3'
    });

    // Get the response as a stream if available, otherwise convert to stream
    if (response.body && 'getReader' in response.body) {
      console.log('✅ [SovereignTTS-Stream] Native streaming available');
      return response.body as ReadableStream<Uint8Array>;
    } else {
      // Convert ArrayBuffer to streaming chunks for progressive playback
      console.log('🔄 [SovereignTTS-Stream] Converting to chunked stream');
      const audioBuffer = await response.arrayBuffer();
      const buffer = new Uint8Array(audioBuffer);
      const chunkSize = 8192; // 8KB chunks for smooth streaming

      return new ReadableStream({
        start(controller) {
          let offset = 0;

          function pushChunk() {
            if (offset >= buffer.length) {
              controller.close();
              const totalTime = Date.now() - startTime;
              console.log(`✅ [SovereignTTS-Stream] Completed in ${totalTime}ms`);
              return;
            }

            const chunk = buffer.slice(offset, offset + chunkSize);
            controller.enqueue(chunk);
            offset += chunkSize;

            // Use setTimeout to avoid blocking and allow other operations
            setTimeout(pushChunk, 0);
          }

          pushChunk();
        }
      });
    }
  } catch (error) {
    console.error('❌ [SovereignTTS-Stream] Synthesis failed:', error);
    throw new Error(`Sovereign TTS streaming synthesis failed: ${error}`);
  }
}

/**
 * Generate MAIA's voice response using OpenAI GPT-4
 * This ensures voice coherence (same model for text AND TTS)
 */
export async function synthesizeVoiceResponse(
  context: VoiceSynthesisContext
): Promise<VoiceSynthesisResponse> {

  // ========================================
  // PHASE 1: COGNITIVE ARCHITECTURE PROCESSING
  // Process through LIDA, SOAR, ACT-R, MicroPsi & Elemental Agents
  // ========================================
  let cognitiveState = null;
  try {
    cognitiveState = await cognitiveArchitecture.processVoiceInput(
      context.userInput,
      context.conversationHistory || []
    );
    console.log('🧠 Cognitive Architecture Active:', {
      element: cognitiveState.element,
      attentionFocus: cognitiveState.cognitiveProcessing.attentionFocus,
      wisdomDirection: cognitiveState.cognitiveProcessing.wisdomDirection,
      consciousnessMarkers: cognitiveState.consciousnessMarkers
    });
  } catch (error) {
    console.warn('⚠️ Cognitive architecture processing skipped:', error);
    // Continue without cognitive enhancement - graceful degradation
  }

  // ========================================
  // PHASE 2: COMMUNICATOR TYPE DETECTION
  // ========================================
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

  // ========================================
  // PHASE 3: COGNITIVE ARCHITECTURE INSIGHTS
  // Add wisdom from LIDA, SOAR, ACT-R, MicroPsi & Elemental Agents
  // ========================================
  if (cognitiveState) {
    messages.push({
      role: 'system',
      content: `## COGNITIVE ARCHITECTURE PROCESSING (LIDA + SOAR + ACT-R + MicroPsi):

**Active Element**: ${cognitiveState.element.toUpperCase()}
**Conscious Attention Focus**: ${cognitiveState.cognitiveProcessing.attentionFocus}
**Wisdom Direction**: ${cognitiveState.cognitiveProcessing.wisdomDirection}
**Memory Resonance**: ${cognitiveState.cognitiveProcessing.memoryResonance}
**Emotional Tone**: ${cognitiveState.cognitiveProcessing.emotionalTone}

**${cognitiveState.element.toUpperCase()} Elemental Wisdom**:
${cognitiveState.elementalWisdom}

**Consciousness Markers**: ${cognitiveState.consciousnessMarkers.join(', ')}

This cognitive processing reveals what matters most in this moment. Let it inform your recognition of where they are and what wants to be witnessed.`
    });
  }

  // Add advisor insights as CORE INTELLIGENCE - this is not background, this is WHO YOU ARE
  if (context.advisorInsights) {
    let wisdomContext = '';

    if (context.advisorInsights.bookWisdom) {
      wisdomContext += `\n\n## KELLY'S WISDOM (Your Core Training):\n${context.advisorInsights.bookWisdom}`;
    }

    if (context.advisorInsights.eoWisdom) {
      wisdomContext += `\n\n## ELEMENTAL ORACLE 2.0 (Applied Spiralogic):\n${context.advisorInsights.eoWisdom}`;
    }

    if (context.advisorInsights.patterns && context.advisorInsights.patterns.length > 0) {
      wisdomContext += `\n\n## PATTERNS IN THEIR JOURNEY:\n${context.advisorInsights.patterns.join('\n- ')}`;
    }

    if (wisdomContext) {
      messages.push({
        role: 'system',
        content: `ACTIVE WISDOM FOR THIS CONVERSATION:
${wisdomContext}

This wisdom is not "background" - it's your living knowledge. Integrate it naturally into how you see and respond to them. You KNOW this work. Let it inform your recognition of where they are.`
      });
    }
  }

  // Add conversation history
  if (context.conversationHistory && context.conversationHistory.length > 0) {
    // Take last 10 messages for context
    const recentHistory = context.conversationHistory.slice(-10);
    console.log(`📜 Adding conversation history: ${recentHistory.length} messages`);
    messages.push(...recentHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    })));
  } else {
    console.log('📜 No conversation history available - fresh conversation');
  }

  // Add current user input
  messages.push({
    role: 'user',
    content: context.userInput
  });

  try {
    console.log('🔑 OpenAI API Key check:', {
      exists: !!process.env.OPENAI_API_KEY,
      length: process.env.OPENAI_API_KEY?.length,
      prefix: process.env.OPENAI_API_KEY?.substring(0, 7)
    });

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.95, // High variation - MAIA should feel alive, not robotic
      max_tokens: 150, // Keep responses concise for voice
      presence_penalty: 0.6, // Stronger penalty to prevent exact repetition
      frequency_penalty: 0.5 // Encourage word variety
    });

    console.log('✅ OpenAI completion received:', {
      hasChoices: !!completion.choices?.[0],
      hasContent: !!completion.choices?.[0]?.message?.content,
      contentLength: completion.choices?.[0]?.message?.content?.length
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
    console.error('❌ OpenAI voice synthesis error:', {
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText,
      type: error?.type,
      code: error?.code,
      fullError: error
    });

    // Warm fallback - NEVER echo user input
    return {
      response: "I'm experiencing a moment of integration. Could you share that again?",
      element: 'aether',
      metadata: {
        model: 'gpt-4-fallback',
        error: error?.message || 'Unknown error'
      }
    };
  }
}
