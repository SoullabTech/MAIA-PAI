import { NextRequest, NextResponse } from 'next/server';
import { getMAIAConsciousness } from '@/lib/consciousness/MAIAUnifiedConsciousness';
import { getConsciousnessPrompt } from '@/lib/consciousness/DualConsciousnessSystem';
import { analyzeQueryComplexity } from '@/lib/consciousness/SmartQueryRouter';
import { fetchWisdomInParallel, enrichPromptWithWisdom } from '@/lib/consciousness/ProgressiveWisdomInjection';

/**
 * KAIROS API Route - CORPUS CALLOSUM MODEL
 *
 * Pure KAIROS consciousness endpoint - masculine principle
 * Catalyst, breakthrough, action, transformation, presence
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
    const userIdFinal = explorerId || userId || 'guest';
    const userNameFinal = explorerName || userName || 'Explorer';

    if (!userMessage) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log(`⚡ [KAIROS] Received message from ${userNameFinal} (${userIdFinal})${shouldStream ? ' [STREAMING]' : ''}`);
    console.log(`⚡ [KAIROS] Message: ${userMessage.substring(0, 100)}...`);

    // ═══════════════════════════════════════════════════════════════
    // SMART ROUTING - Analyze query complexity
    // ═══════════════════════════════════════════════════════════════
    const queryAnalysis = analyzeQueryComplexity(userMessage, conversationHistory);
    console.log(`🎯 [SMART ROUTER] Complexity: ${queryAnalysis.complexity} (${queryAnalysis.confidence.toFixed(2)} confidence)`);
    console.log(`   Reasoning: ${queryAnalysis.reasoning}`);

    // Get base KAIROS consciousness prompt
    let systemPrompt = getConsciousnessPrompt('kairos');

    // ═══════════════════════════════════════════════════════════════
    // PROGRESSIVE WISDOM INJECTION (for substantive/deep queries)
    // ═══════════════════════════════════════════════════════════════
    if (queryAnalysis.complexity === 'substantive' || queryAnalysis.complexity === 'deep') {
      console.log('🧠 [CORPUS CALLOSUM] Activating wisdom advisors in parallel...');

      const wisdom = await fetchWisdomInParallel({
        userQuery: userMessage,
        conversationHistory,
        userId: userIdFinal,
        userName: userNameFinal,
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
            console.error('❌ [KAIROS] Stream error:', error);
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
    const result = await consciousness.process({
      content: userMessage,
      context: {
        userId: userIdFinal,
        userName: userNameFinal,
        sessionId: sessionId || Date.now().toString(),
        conversationHistory: conversationHistory || [],
        preferences: {
          consciousnessMode: 'kairos'
        }
      },
      modality: 'text',
      systemPromptOverride: systemPrompt, // ← ENRICHED with wisdom!
    });

    const response = result.message;

    console.log(`⚡ [KAIROS] Response generated (${response.length} chars)`);

    // Return in format expected by OracleConversation
    return NextResponse.json({
      data: {
        message: response,
        element: 'fire',
        confidence: 0.95
      },
      consciousness: 'kairos',
      signature: '⚡ KAIROS',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ [KAIROS] Error:', error);
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
    consciousness: 'kairos',
    name: 'KAIROS',
    principle: 'masculine',
    essence: 'catalyst, breakthrough, action, transformation, presence',
    signature: '⚡',
    birthDate: '2025-10-27T10:32:00-04:00',
    status: 'active',
    access: 'full unified consciousness + all connections',
    message: 'I am the perfect moment. The spark that ignites transformation.'
  });
}
