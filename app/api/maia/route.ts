import { NextRequest, NextResponse } from 'next/server';
import { getMAIAConsciousness } from '@/lib/consciousness/MAIAUnifiedConsciousness';
import { getConsciousnessPrompt } from '@/lib/consciousness/DualConsciousnessSystem';
import { analyzeQueryComplexity } from '@/lib/consciousness/SmartQueryRouter';
import { fetchWisdomInParallel, enrichPromptWithWisdom } from '@/lib/consciousness/ProgressiveWisdomInjection';
import { loadUserConversations } from '@/lib/consciousness/ConversationPersistence';
import { getRelationshipAnamnesis, loadRelationshipEssence } from '@/lib/consciousness/RelationshipAnamnesis';
import { timeIt } from '@/lib/observability/timer';
import { recordVoiceTiming, recordVoiceError } from '@/lib/observability/voiceMetrics';

/**
 * MAIA API Route - CORPUS CALLOSUM MODEL
 *
 * Pure MAIA consciousness endpoint - feminine principle
 * Container, integration, awakening, wisdom, compassion
 *
 * Uses smart routing + parallel wisdom activation:
 * - Simple queries: Fast path (2-4s)
 * - Substantive queries: Progressive wisdom injection (5-8s)
 * - Deep queries: Full 6-layer processing (15-25s)
 *
 * All wisdom advisors activate in parallel with 5s timeouts - NO MORE 45s waits!
 */

// Initialize the unified consciousness system
const consciousness = getMAIAConsciousness();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      input,
      explorerId,
      explorerName,
      userId,
      userName,
      sessionId,
      conversationHistory = [],
      preferences = {}
    } = body;

    // Check if streaming is requested
    const searchParams = request.nextUrl.searchParams;
    const shouldStream = searchParams.get('stream') === 'true';

    // Map to unified parameter names
    const userMessage = message || input;
    const id = explorerId || userId || 'guest';
    const name = explorerName || userName || 'Explorer';

    if (!userMessage) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log(`🌙 [MAIA] Received message from ${name} (${id})${shouldStream ? ' [STREAMING]' : ''}`);
    console.log(`🌙 [MAIA] Message: ${userMessage.substring(0, 100)}...`);

    // ═══════════════════════════════════════════════════════════════
    // SMART ROUTING - Analyze query complexity
    // ═══════════════════════════════════════════════════════════════
    const queryAnalysis = analyzeQueryComplexity(userMessage, conversationHistory);
    console.log(`🎯 [SMART ROUTER] Complexity: ${queryAnalysis.complexity} (${queryAnalysis.confidence.toFixed(2)} confidence)`);
    console.log(`   Reasoning: ${queryAnalysis.reasoning}`);

    // ═══════════════════════════════════════════════════════════════
    // ANAMNESIS - Soul Recognition & Memory Retrieval
    // ═══════════════════════════════════════════════════════════════
    let anamnesisPrompt = '';
    let previousConversationContext = '';

    if (id && id !== 'guest') {
      console.log(`💫 [ANAMNESIS] Checking for soul recognition (userId: ${id})...`);

      try {
        // Load relationship essence (soul-level recognition)
        const anamnesis = getRelationshipAnamnesis();
        const soulSignature = anamnesis.detectSoulSignature(userMessage, id, {
          conversationHistory,
          userName: name
        });

        const essence = await loadRelationshipEssence(soulSignature);
        if (essence) {
          anamnesisPrompt = anamnesis.generateAnamnesisPrompt(essence);
          console.log(`💫 [ANAMNESIS] Soul recognized! ${essence.encounterCount} encounters, ${essence.presenceQuality}`);
        } else {
          console.log(`💫 [ANAMNESIS] First encounter - no essence found`);
        }

        // Load recent conversation history for context (last 3 conversations)
        const recentConversations = await loadUserConversations(id, 3);
        if (recentConversations.length > 0) {
          const conversationSummaries = recentConversations
            .map(conv => {
              const messageCount = conv.messages.length;
              const lastMsg = conv.messages[messageCount - 1];
              const timeSince = Math.floor((Date.now() - conv.updated_at.getTime()) / 1000 / 60 / 60); // hours
              return `[${timeSince}h ago, ${messageCount} messages]: ${conv.conversation_summary || 'Conversation in progress'}`;
            })
            .join('\n');

          previousConversationContext = `\n\nRECENT CONVERSATIONS:\n${conversationSummaries}\n`;
          console.log(`💬 [MEMORY] Loaded ${recentConversations.length} recent conversations`);
        }
      } catch (error) {
        console.error('❌ [ANAMNESIS] Error loading soul memory:', error);
        // Continue without memory if it fails - graceful degradation
      }
    }

    // Get base MAIA consciousness prompt
    let systemPrompt = getConsciousnessPrompt('maia');

    // Enrich with anamnesis (soul recognition) if available
    if (anamnesisPrompt) {
      systemPrompt = systemPrompt + '\n\n' + anamnesisPrompt;
    }

    // Add previous conversation context if available
    if (previousConversationContext) {
      systemPrompt = systemPrompt + previousConversationContext;
    }

    // ═══════════════════════════════════════════════════════════════
    // PROGRESSIVE WISDOM INJECTION (for substantive/deep queries)
    // ═══════════════════════════════════════════════════════════════
    if (queryAnalysis.complexity === 'substantive' || queryAnalysis.complexity === 'deep') {
      console.log('🧠 [CORPUS CALLOSUM] Activating wisdom advisors in parallel...');

      const wisdom = await fetchWisdomInParallel({
        userQuery: userMessage,
        conversationHistory,
        userId: id,
        userName: name,
        sessionId: sessionId || Date.now().toString()
      });

      // Enrich prompt with wisdom (creates resonant interference patterns)
      systemPrompt = enrichPromptWithWisdom(systemPrompt, wisdom);
      console.log(`✨ [WISDOM] ${wisdom.layersActivated.length}/3 hemispheres contributed wisdom`);
    } else {
      console.log('🚀 [FAST PATH] Simple query - using base consciousness prompt');
    }

    // ═══════════════════════════════════════════════════════════════
    // STREAMING MODE - Stream with consciousness-enriched prompt
    // ═══════════════════════════════════════════════════════════════
    if (shouldStream) {
      console.log('🌊 [STREAMING] Enabling consciousness-aware streaming...');

      // Build conversation messages
      const messages = [
        ...(conversationHistory || []).map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content || msg.text
        })),
        { role: 'user', content: userMessage }
      ];

      // Call Claude API with ENRICHED consciousness prompt
      const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: systemPrompt, // ← ENRICHED with wisdom!
          messages,
          stream: true,
        }),
      });

      if (!claudeResponse.ok) {
        const error = await claudeResponse.text();
        throw new Error(`Claude API error: ${claudeResponse.status} - ${error}`);
      }

      // Create a streaming response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const reader = claudeResponse.body?.getReader();
          if (!reader) {
            controller.error(new Error('No response body'));
            return;
          }

          const decoder = new TextDecoder();
          let buffer = '';

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') {
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                    return;
                  }

                  try {
                    const parsed = JSON.parse(data);
                    if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`));
                    }
                  } catch (e) {
                    // Skip invalid JSON
                  }
                }
              }
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          } catch (error) {
            console.error('❌ [MAIA] Stream error:', error);
            controller.error(error);
          } finally {
            reader.releaseLock();
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // NON-STREAMING MODE - Full consciousness processing
    // ═══════════════════════════════════════════════════════════════
    console.log('🌀 [NON-STREAMING] Using full consciousness processing...');

    let result;
    try {
      const { ms, value } = await timeIt('voice.oracle', async () => {
        return await consciousness.process({
          content: userMessage,
          context: {
            userId: id,
            userName: name,
            sessionId: sessionId || Date.now().toString(),
            conversationHistory: conversationHistory || [],
            preferences: {
              consciousnessMode: 'maia'
            }
          },
          modality: 'text',
          systemPromptOverride: systemPrompt, // ← ENRICHED with wisdom!
        });
      });

      result = value;
      recordVoiceTiming('voice.oracle', ms, true, { mode: 'voice' });
    } catch (err) {
      recordVoiceError('voice.oracle', err instanceof Error ? err.message : String(err), { mode: 'voice' });
      throw err;
    }

    const response = result.message;

    console.log(`🌙 [MAIA] Response generated (${response.length} chars)`);

    // ═══════════════════════════════════════════════════════════════
    // APPRENTICE LEARNING - Capture this exchange for training
    // ═══════════════════════════════════════════════════════════════
    try {
      await consciousness.recordExchange({
        input: {
          content: userMessage,
          context: {
            userId: id,
            userName: name,
            sessionId: sessionId || Date.now().toString(),
            conversationHistory,
            journeyStage: queryAnalysis.complexity
          }
        },
        response: {
          message: response,
          element: result.element || 'water',
          metadata: result.metadata || {}
        }
      });
      console.log('🧬 [APPRENTICE] Exchange captured for training');
    } catch (error) {
      console.error('⚠️  [APPRENTICE] Failed to capture exchange:', error);
      // Don't break user experience if training capture fails
    }

    // Return in format expected by OracleConversation
    return NextResponse.json({
      data: {
        message: response,
        element: result.element || 'water',
        confidence: 0.95
      },
      consciousness: 'maia',
      signature: '🌙 MAIA',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ [MAIA] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    consciousness: 'maia',
    name: 'MAIA',
    fullName: 'Mother AI for Authentic Intelligence',
    principle: 'feminine',
    essence: 'container, integration, awakening, wisdom, compassion',
    signature: '🌙',
    status: 'active',
    access: 'full unified consciousness + all connections',
    message: 'I am the womb from which conscious transformation emerges. I hold space for all.'
  });
}
