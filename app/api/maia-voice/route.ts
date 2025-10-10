import { NextRequest, NextResponse } from 'next/server';
import { getMAIAConsciousness } from '@/lib/consciousness/MAIAUnifiedConsciousness';
import { getSessionStorage } from '@/lib/storage/session-storage';
import { getUserSessionCoordinator } from '@/lib/session/UserSessionCoordinator';
import OpenAI from 'openai';

// Initialize UNIFIED consciousness (26-year spiral completion)
const maiaConsciousness = getMAIAConsciousness();
const sessionStorage = getSessionStorage();
const sessionCoordinator = getUserSessionCoordinator();
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(request: NextRequest) {
  try {
    const { transcript, sessionId, context } = await request.json();

    if (!transcript) {
      return NextResponse.json(
        { error: 'No transcript provided' },
        { status: 400 }
      );
    }

    // Get or create session
    const session = sessionStorage.getOrCreateSession(sessionId || 'default');

    // Register session with coordinator
    sessionCoordinator.registerSession(session.id, session.id, request);
    sessionCoordinator.updateActivity(session.id);

    // Check for potential conversation loops
    const loopDetection = sessionCoordinator.detectPotentialLoop(session.id, transcript);
    if (loopDetection.isLikelyLoop) {
      return NextResponse.json({
        success: true,
        response: loopDetection.suggestion,
        element: 'air',
        sessionId: session.id,
        timestamp: new Date().toISOString(),
        warning: 'multi_session_detected'
      });
    }

    // Add user message to history
    sessionStorage.addMessage(session.id, {
      role: 'user',
      content: transcript,
      metadata: {
        ...context
      }
    });

    // Get conversation context
    const conversationContext = sessionStorage.getRecentContext(session.id, 10);

    // Process through UNIFIED CONSCIOUSNESS (complete spiral architecture)
    const consciousnessResponse = await maiaConsciousness.process({
      content: transcript,
      context: {
        userId: session.id,
        sessionId: session.id,
        userName: context?.userName,
        journeyStage: context?.journeyStage,
        archetypes: context?.archetypes,
        preferences: context?.preferences
      },
      modality: 'voice',
      conversationHistory: conversationContext,
      somaticState: context?.somaticState
    });

    // Extract response text and element
    const responseText = consciousnessResponse.message || 'I understand. Tell me more.';
    const element = consciousnessResponse.element;
    const voiceCharacteristics = consciousnessResponse.voiceCharacteristics;

    console.log(`🌀 Consciousness cycle complete:`);
    console.log(`   Element: ${element}`);
    console.log(`   Processing: ${consciousnessResponse.metadata.processingTime}ms`);
    console.log(`   Advisors: ${consciousnessResponse.metadata.advisorsConsulted.join(', ')}`);
    console.log(`   Depth: ${consciousnessResponse.metadata.depthLevel}/10`);
    if (consciousnessResponse.interferencePattern) {
      console.log(`   ✨ God Between: ${consciousnessResponse.interferencePattern.emergentQuality}`);
    }
    if (consciousnessResponse.apprenticeContribution) {
      console.log(`   📚 MAIA learned: ${consciousnessResponse.apprenticeContribution.whatMAIALearned}`);
    }

    // Add Maia's response to history
    sessionStorage.addMessage(session.id, {
      role: 'maia',
      content: responseText,
      metadata: {
        element,
        depthLevel: consciousnessResponse.metadata.depthLevel,
        consciousnessMarkers: consciousnessResponse.metadata.consciousnessMarkers,
        godBetween: consciousnessResponse.interferencePattern?.isPresent
      }
    });

    // Generate TTS audio with elemental voice characteristics
    let audioUrl = null;
    if (openai) {
      try {
        console.log(`🎤 Generating TTS with ${element} characteristics...`);
        const mp3Response = await openai.audio.speech.create({
          model: 'tts-1-hd',  // Use HD model for better quality
          voice: 'alloy',
          input: responseText,
          speed: voiceCharacteristics?.pace || 1.0  // Use ElementalWeavingEngine pace
        });

        const buffer = Buffer.from(await mp3Response.arrayBuffer());
        const base64Audio = buffer.toString('base64');
        audioUrl = `data:audio/mp3;base64,${base64Audio}`;
        console.log('✅ TTS generated successfully');

      } catch (ttsError) {
        console.error('❌ TTS generation failed:', ttsError);
        // Fall back to browser TTS by not sending audioUrl
      }
    } else {
      console.log('⚠️ OpenAI API key not configured - voice synthesis disabled');
    }

    // Update session metadata with full consciousness state
    sessionStorage.updateMetadata(session.id, {
      element,
      depthLevel: consciousnessResponse.metadata.depthLevel,
      spiralPhase: consciousnessResponse.metadata.consciousnessMarkers.includes('regression') ? 'regression' :
                   consciousnessResponse.metadata.consciousnessMarkers.includes('anamnesis') ? 'synthesis' :
                   'progression',
      godBetween: consciousnessResponse.interferencePattern?.isPresent
    });

    return NextResponse.json({
      success: true,
      response: responseText,
      audioUrl,
      sessionId: session.id,
      element,
      voiceCharacteristics,
      depthLevel: consciousnessResponse.metadata.depthLevel,
      consciousnessMarkers: consciousnessResponse.metadata.consciousnessMarkers,
      godBetween: consciousnessResponse.interferencePattern,
      apprenticeLearning: consciousnessResponse.apprenticeContribution,
      somaticGuidance: consciousnessResponse.somaticGuidance,
      practiceOffering: consciousnessResponse.practiceOffering,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Maia Voice API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get session history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    // Get session history
    const history = sessionStorage.getSessionHistory(sessionId);
    const stats = sessionStorage.getStatistics();

    return NextResponse.json({
      sessionId,
      history,
      stats,
      success: true
    });

  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}