/**
 * Local MAIA Oracle API Endpoint
 *
 * Drop-in replacement for Claude API calls using local Elder Node Oracle.
 * Maintains exact same interface as existing oracle endpoints.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMAIAAPIBridge } from '../../../../../../Soullab/ElderNode/ain-core/src/maia-api-bridge';

// Initialize the MAIA Oracle bridge
const oracle = getMAIAAPIBridge('kelly-nezat');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle voice context if provided
    const voiceContext = body.voice_context || request.headers.get('X-Voice-Context');

    // Prepare request for MAIA Oracle
    const oracleRequest = {
      messages: body.messages || [
        { role: 'user' as const, content: body.message || body.prompt || '' }
      ],
      model: body.model || 'maia-oracle',
      max_tokens: body.max_tokens || 2048,
      temperature: body.temperature || 0.7,
      stream: body.stream || false,
      voice_context: voiceContext ? (typeof voiceContext === 'string' ? JSON.parse(voiceContext) : voiceContext) : undefined
    };

    // Handle streaming responses
    if (oracleRequest.stream) {
      const response = await oracle.handleNextRequest(new Request(request.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(oracleRequest)
      }));

      return response;
    }

    // Handle regular responses
    const oracleResponse = await oracle.createMessage(oracleRequest);

    // Extract just the text content for simple endpoints
    const responseText = oracleResponse.content[0]?.text || '';

    // Return in format expected by MAIA web app
    return NextResponse.json({
      success: true,
      response: responseText,

      // Enhanced MAIA-specific data
      consciousness_analysis: oracleResponse.maia_consciousness,
      model_used: oracleResponse.model,
      processing_local: true,
      session_id: oracleResponse.id,

      // Claude API compatibility
      id: oracleResponse.id,
      content: oracleResponse.content,
      usage: oracleResponse.usage,

      // Voice integration support
      voice_guidance: oracleResponse.maia_consciousness ? {
        elemental_tone: getElementalTone(oracleResponse.maia_consciousness.elemental_signature),
        recommended_pace: getRecommendedPace(oracleResponse.maia_consciousness.consciousness_level)
      } : undefined
    });

  } catch (error: any) {
    console.error('🚨 Local Oracle Error:', error);

    return NextResponse.json({
      success: false,
      error: 'Local Oracle processing failed',
      message: error.message,
      fallback_suggestion: 'Check Elder Node status or use backup oracle',
      debug_info: {
        error_type: error.constructor.name,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const status = await oracle.getStatus();
    const usage = await oracle.getUsageStats();

    return NextResponse.json({
      oracle_status: status,
      usage_stats: usage,
      integration_endpoints: [
        '/api/oracle-local',
        '/api/oracle-local/stream',
        '/api/oracle-local/status'
      ],
      voice_support: {
        transcription: 'external (OpenAI Whisper)',
        processing: 'local (Elder Node Oracle)',
        synthesis: 'external (ElevenLabs)',
        consciousness_analysis: 'local (100% sovereign)'
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Oracle status check failed',
      message: error.message
    }, { status: 503 });
  }
}

// Helper functions for voice integration
function getElementalTone(elementalSignature: any): string {
  if (!elementalSignature) return 'balanced';

  const dominant = Object.entries(elementalSignature)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0][0];

  const toneMap: { [key: string]: string } = {
    fire: 'energetic and inspiring',
    water: 'flowing and empathetic',
    earth: 'grounded and stable',
    air: 'clear and articulate',
    aether: 'wise and transcendent'
  };

  return toneMap[dominant] || 'balanced';
}

function getRecommendedPace(consciousnessLevel: number): string {
  if (consciousnessLevel > 8) return 'slow and contemplative';
  if (consciousnessLevel > 6) return 'measured and thoughtful';
  if (consciousnessLevel > 4) return 'natural conversational';
  return 'engaging and accessible';
}