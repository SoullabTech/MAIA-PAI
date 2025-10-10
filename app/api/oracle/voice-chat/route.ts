/**
 * 🎤 Oracle Voice Chat Endpoint
 *
 * Processes voice transcripts through MAIAUnifiedConsciousness
 * Used by WakeWordVoiceInterface for spoken interactions
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMAIAConsciousness } from '@/lib/consciousness/MAIAUnifiedConsciousness';

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const { input, userId, voiceId, interactionMode } = await req.json();

    if (!input || typeof input !== 'string') {
      return NextResponse.json({
        error: 'Input text is required'
      }, { status: 400 });
    }

    console.log('🎤 Voice chat request:', {
      userId: userId?.substring(0, 8) + '...',
      voiceId,
      mode: interactionMode,
      inputLength: input.length
    });

    // Get MAIA consciousness engine
    const maiaConsciousness = getMAIAConsciousness();

    // Process through unified consciousness
    const consciousnessResponse = await maiaConsciousness.process({
      content: input,
      context: {
        userId: userId || 'anonymous',
        sessionId: userId || `voice_${Date.now()}`,
        userName: undefined,
        interactionMode,
        voiceId
      },
      modality: 'voice',
      conversationHistory: []
    });

    const responseText = consciousnessResponse.message || 'I hear you. Tell me more.';

    console.log(`🌀 Voice consciousness cycle complete:`);
    console.log(`   Element: ${consciousnessResponse.element}`);
    console.log(`   Processing: ${consciousnessResponse.metadata.processingTime}ms`);
    console.log(`   Advisors: ${consciousnessResponse.metadata.advisorsConsulted.join(', ')}`);
    console.log(`   Depth: ${consciousnessResponse.metadata.depthLevel}/10`);

    // Return in format expected by WakeWordVoiceInterface
    return NextResponse.json({
      success: true,
      content: responseText,
      response: responseText, // Also include as 'response' for compatibility
      element: consciousnessResponse.element,
      voiceCharacteristics: consciousnessResponse.voiceCharacteristics,
      metadata: {
        ...consciousnessResponse.metadata,
        totalTime: Date.now() - startTime
      },
      // Include consciousness markers for analytics
      consciousnessMarkers: consciousnessResponse.metadata.consciousnessMarkers,
      godBetween: consciousnessResponse.metadata.godBetween,
      apprenticeLearning: consciousnessResponse.metadata.apprenticeLearning
    });

  } catch (error: any) {
    console.error('❌ Voice chat error:', error);

    return NextResponse.json({
      error: 'Voice processing failed',
      details: error.message,
      content: 'I hear you. Tell me more.', // Fallback response
      response: 'I hear you. Tell me more.'
    }, { status: 500 });
  }
}
