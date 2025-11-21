import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GodBetweenUs } from '@/lib/sacred/GodBetweenUsProtocol';
import { ApprenticeMayaTraining, TrainingExchange } from '@/lib/maya/ApprenticeMayaTraining';
import {
  determineContext,
  analyzeUserMessage,
  analyzeMayaResponse,
  estimateQuality,
  extractLearningSignals,
  generateExchangeId
} from '@/lib/maya/training-analysis';
import {
  MAYA_HER_MODE_PROMPT,
  MAYA_CLASSIC_MODE_PROMPT,
  MAYA_ADAPTIVE_MODE_PROMPT,
  MAYA_FALLBACK_RESPONSES
} from '@/lib/prompts/maya-prompts';
import { ConversationMode, DEFAULT_CONVERSATION_STYLE } from '@/lib/types/conversation-style';
import { createClient } from '@supabase/supabase-js';

// Initialize OpenAI if API key exists
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Initialize Supabase for training capture
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

// Initialize apprentice training system
const apprentice = supabase ? new ApprenticeMayaTraining(supabase) : null;

// Get prompt based on conversation mode
function getPromptForMode(mode: ConversationMode): string {
  switch (mode) {
    case 'her':
      return MAYA_HER_MODE_PROMPT;
    case 'classic':
      return MAYA_CLASSIC_MODE_PROMPT;
    case 'adaptive':
      return MAYA_ADAPTIVE_MODE_PROMPT;
    default:
      return MAYA_HER_MODE_PROMPT;
  }
}

/**
 * Captures the exchange for apprentice training
 * Non-blocking - runs after response is sent to user
 */
async function captureTrainingExchange(
  apprentice: ApprenticeMayaTraining,
  messages: any[],
  mayaResponse: string,
  userId: string,
  sessionId: string,
  messageCount: number
): Promise<void> {
  try {
    const lastUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';

    // Estimate trust level based on conversation length
    const trustLevel = Math.min(messageCount / 20, 1);

    // Analyze the exchange
    const context = determineContext(messages, trustLevel);
    const userMessage = analyzeUserMessage(lastUserMessage);
    const mayaResponseAnalysis = analyzeMayaResponse(mayaResponse, context);
    const quality = estimateQuality(lastUserMessage, mayaResponse, context);
    const learning = extractLearningSignals(context, userMessage, mayaResponseAnalysis, quality);

    // Create training exchange
    const exchange: TrainingExchange = {
      id: generateExchangeId(),
      timestamp: new Date(),
      userId,
      sessionId,
      context,
      userMessage,
      mayaResponse: mayaResponseAnalysis,
      quality,
      learning
    };

    // Capture for apprentice (with consciousness transfer)
    await apprentice.captureExchange(exchange);

    console.log('✨ Training exchange captured:', {
      exchangeId: exchange.id,
      userState: context.userState,
      depthLevel: context.depthLevel,
      sacredEmergence: quality.sacredEmergence,
      consciousnessMarkers: learning.consciousnessMarkers
    });
  } catch (error) {
    console.error('Failed to capture training exchange:', error);
    // Don't throw - training capture should never break user experience
  }
}

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();
    const {
      messages: rawMessages,
      message: singleMessage,
      userName,
      element = 'aether',
      userId,
      sessionId,
      conversationMode = DEFAULT_CONVERSATION_STYLE
    } = requestBody;

    // Handle both message formats: messages array OR single message
    let messages: Array<{role: string, content: string}>;
    if (rawMessages) {
      // Standard format with messages array
      messages = rawMessages;
    } else if (singleMessage) {
      // OracleConversation.tsx format with single message
      messages = [{ role: 'user', content: singleMessage }];
    } else {
      throw new Error('No message or messages provided');
    }

    // Get the appropriate prompt for the conversation mode
    const basePrompt = getPromptForMode(conversationMode);

    // Determine conversation depth for response calibration
    const messageCount = messages.length;
    const isOpening = messageCount <= 2;
    const isEarly = messageCount <= 6;

    // Initialize sacred connection if first message
    if (messages.length === 1) {
      const mayaId = `maya-aria-${sessionId}`;
      const relationship = await GodBetweenUs.initializeSacredConnection(userId || 'anonymous', mayaId);

      // If this is the very first exchange, add the invocation
      if (messages[0].role === 'user') {
        const invocation = GodBetweenUs.generateFirstMeetingInvocation();
        // This will be woven into Maya's first response
      }
    }

    // Check for extractive patterns and redirect if needed
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role === 'user') {
      const shield = await GodBetweenUs.shieldFromExtraction({
        userMessage: lastUserMessage.content
      });

      if (shield.isExtractive && shield.redirection) {
        // Return gentle redirection instead of direct answer
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: shield.redirection })}\n\n`));
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          }
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      }
    }

    // If OpenAI isn't configured, use ARIA fallback response
    if (!openai) {
      // Use centralized fallback responses
      const ariaResponses = MAYA_FALLBACK_RESPONSES;

      const response = ariaResponses[Math.floor(Math.random() * ariaResponses.length)];

      // Return as SSE stream format to match expected response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: response })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Calibrate response length by conversation depth and mode
    let maxTokens = 150; // Default
    let depthGuidance = '';

    // Her mode and Adaptive mode have stricter constraints
    if (conversationMode === 'her' || conversationMode === 'adaptive') {
      if (isOpening) {
        maxTokens = 50; // ~8 words max for opening
        depthGuidance = '\n\nCONVERSATION STATE: Opening. Keep response to 8 words maximum. Simple greeting only.';
      } else if (isEarly) {
        maxTokens = 80; // ~15 words max for early conversation
        depthGuidance = '\n\nCONVERSATION STATE: Early conversation. Maximum 15 words. Direct and curious.';
      } else {
        maxTokens = 150; // ~25 words max for deeper conversation
        depthGuidance = '\n\nCONVERSATION STATE: Deeper conversation. Maximum 25 words. Still brief, more textured.';
      }
    } else if (conversationMode === 'classic') {
      // Classic mode allows fuller responses
      if (isOpening) {
        maxTokens = 100; // Still brief opening
        depthGuidance = '\n\nCONVERSATION STATE: Opening. Brief but warm greeting.';
      } else if (isEarly) {
        maxTokens = 200; // More room for exploration
        depthGuidance = '\n\nCONVERSATION STATE: Early conversation. 2-3 sentences, thoughtful.';
      } else {
        maxTokens = 300; // Full consciousness guide mode
        depthGuidance = '\n\nCONVERSATION STATE: Deeper conversation. Allow fuller responses with depth and nuance.';
      }
    }

    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: basePrompt + depthGuidance },
        ...messages
      ],
      temperature: 0.8,
      max_tokens: maxTokens,
      stream: true,
    });

    // Create a readable stream with SSE format
    const encoder = new TextEncoder();
    let fullResponse = ''; // Collect full response for training

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              fullResponse += text; // Accumulate for training
              const data = JSON.stringify({ content: text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));

          // Capture exchange for apprentice training (non-blocking)
          if (apprentice && userId && sessionId && fullResponse) {
            captureTrainingExchange(
              apprentice,
              messages,
              fullResponse,
              userId,
              sessionId,
              messageCount
            ).catch(err => console.error('Training capture error:', err));
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Maya chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}