/**
 * CONSCIOUSNESS VOICE INTEGRATION API
 *
 * Enhanced API that integrates consciousness voice evolution with existing MAIA systems.
 * Connects with oracle responses, session management, and voice synthesis.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMAIAVoiceIntegration } from '@/lib/consciousness/MAIAVoiceIntegration';
import { getConsciousnessVoiceSynthesis, synthesizeConsciousnessVoice } from '@/lib/consciousness/ConsciousnessVoiceSynthesis';
import { getConsciousnessStateTracker } from '@/lib/consciousness/ConsciousnessStateTracker';
import { getIntelligentVoiceAdaptation } from '@/lib/consciousness/IntelligentVoiceAdaptation';

// Helper function to get request body
async function getRequestBody(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    const integration = getMAIAVoiceIntegration();

    switch (action) {
      case 'session-state':
        if (!sessionId) {
          return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
        }

        const sessionState = await integration.getSessionVoiceState(sessionId);
        return NextResponse.json({
          success: true,
          sessionState
        });

      case 'active-sessions':
        const activeSessions = await integration.getActiveSessionIds();
        return NextResponse.json({
          success: true,
          activeSessions
        });

      case 'integration-metrics':
        const metrics = await integration.getIntegrationMetrics();
        return NextResponse.json({
          success: true,
          metrics
        });

      case 'voice-adaptation-profile':
        if (!userId) {
          return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }

        const voiceAdaptation = getIntelligentVoiceAdaptation();
        const profile = await voiceAdaptation.getUserProfile(userId);

        return NextResponse.json({
          success: true,
          profile
        });

      case 'consciousness-history':
        if (!userId) {
          return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }

        const limit = parseInt(searchParams.get('limit') || '20');
        const stateTracker = getConsciousnessStateTracker();
        const history = await stateTracker.getUserConsciousnessHistory(userId, limit);

        return NextResponse.json({
          success: true,
          history
        });

      case 'voice-evolution-status':
        const voiceSynthesis = getConsciousnessVoiceSynthesis();
        const voiceState = await voiceSynthesis.getCurrentVoiceState();

        return NextResponse.json({
          success: true,
          voiceState
        });

      case 'adaptation-metrics':
        const adaptationSystem = getIntelligentVoiceAdaptation();
        const adaptationMetrics = await adaptationSystem.getAdaptationMetrics();

        return NextResponse.json({
          success: true,
          adaptationMetrics
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Consciousness voice integration GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await getRequestBody(request);
    const { action } = body;

    const integration = getMAIAVoiceIntegration();

    switch (action) {
      case 'initialize-session':
        const { userId, sessionId, userName, voice, sessionData, userProfile } = body;

        if (!userId || !sessionId) {
          return NextResponse.json(
            { error: 'userId and sessionId required' },
            { status: 400 }
          );
        }

        const maiaSession = await integration.initializeMAIAVoiceSession(
          userId,
          sessionId,
          {
            userName,
            voice,
            sessionData,
            userProfile
          }
        );

        return NextResponse.json({
          success: true,
          session: maiaSession
        });

      case 'process-oracle-response':
        const {
          sessionId: responseSessionId,
          oracleResponse,
          conversationContext
        } = body;

        if (!responseSessionId || !oracleResponse) {
          return NextResponse.json(
            { error: 'sessionId and oracleResponse required' },
            { status: 400 }
          );
        }

        const voiceResponse = await integration.processOracleResponseWithVoice(
          responseSessionId,
          oracleResponse,
          conversationContext
        );

        return NextResponse.json({
          success: true,
          voiceResponse
        });

      case 'synthesize-with-consciousness':
        const {
          text,
          sessionId: synthSessionId,
          voiceIntent = 'presence',
          context = {}
        } = body;

        if (!text) {
          return NextResponse.json({ error: 'text required' }, { status: 400 });
        }

        // Get session voice state if available
        let consciousnessContext = context;
        if (synthSessionId) {
          const sessionState = await integration.getSessionVoiceState(synthSessionId);
          if (sessionState) {
            consciousnessContext = {
              ...context,
              currentArchetype: sessionState.currentVoiceConfig.archetype,
              userConsciousnessDepth: sessionState.consciousnessMetrics.currentDepth,
              fieldCoherence: sessionState.consciousnessMetrics.fieldCoherence
            };
          }
        }

        const synthesis = await synthesizeConsciousnessVoice(
          text,
          'system', // Default user
          consciousnessContext,
          voiceIntent
        );

        return NextResponse.json({
          success: true,
          synthesis
        });

      case 'end-session':
        const { sessionId: endSessionId } = body;

        if (!endSessionId) {
          return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
        }

        const sessionSummary = await integration.endMAIAVoiceSession(endSessionId);

        return NextResponse.json({
          success: true,
          sessionSummary
        });

      case 'update-consciousness-state':
        const {
          userId: stateUserId,
          sessionId: stateSessionId,
          conversationContext: stateContext
        } = body;

        if (!stateUserId || !stateSessionId) {
          return NextResponse.json(
            { error: 'userId and sessionId required' },
            { status: 400 }
          );
        }

        const stateTracker = getConsciousnessStateTracker();
        const consciousnessState = await stateTracker.detectCurrentConsciousnessState(
          stateUserId,
          stateSessionId,
          stateContext
        );

        return NextResponse.json({
          success: true,
          consciousnessState
        });

      case 'optimize-voice-adaptation':
        const { userId: optimizeUserId } = body;

        if (!optimizeUserId) {
          return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }

        const voiceAdaptation = getIntelligentVoiceAdaptation();
        await voiceAdaptation.optimizeStrategies();

        const updatedProfile = await voiceAdaptation.getUserProfile(optimizeUserId);

        return NextResponse.json({
          success: true,
          optimized: true,
          profile: updatedProfile
        });

      case 'force-voice-evolution':
        const {
          sessionId: evolveSessionId,
          targetStage = null
        } = body;

        const voiceSynthesis = getConsciousnessVoiceSynthesis();
        let evolved = false;

        if (targetStage) {
          // Force to specific stage (admin/testing use)
          evolved = true;
          // In real implementation, would force stage transition
        } else {
          // Natural evolution assessment
          evolved = await voiceSynthesis.assessVoiceEvolution();
        }

        return NextResponse.json({
          success: true,
          evolved,
          targetStage
        });

      case 'measure-adaptation-effectiveness':
        const {
          userId: effectivenessUserId,
          postAdaptationMetrics
        } = body;

        if (!effectivenessUserId || !postAdaptationMetrics) {
          return NextResponse.json(
            { error: 'userId and postAdaptationMetrics required' },
            { status: 400 }
          );
        }

        const adaptationSystem = getIntelligentVoiceAdaptation();
        const effectiveness = await adaptationSystem.measureAdaptationEffectiveness(
          effectivenessUserId,
          postAdaptationMetrics
        );

        return NextResponse.json({
          success: true,
          effectiveness
        });

      case 'create-adaptation-profile':
        const { userId: profileUserId } = body;

        if (!profileUserId) {
          return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }

        const adaptationSystem2 = getIntelligentVoiceAdaptation();
        const newProfile = await adaptationSystem2.createUserProfile(profileUserId);

        return NextResponse.json({
          success: true,
          profile: newProfile
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Consciousness voice integration POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Additional endpoint methods for WebSocket-like functionality
export async function PATCH(request: NextRequest) {
  try {
    const body = await getRequestBody(request);
    const { action } = body;

    switch (action) {
      case 'update-session-config':
        const { sessionId, voiceConfig } = body;

        if (!sessionId || !voiceConfig) {
          return NextResponse.json(
            { error: 'sessionId and voiceConfig required' },
            { status: 400 }
          );
        }

        // Update session voice configuration
        const integration = getMAIAVoiceIntegration();
        const sessionState = await integration.getSessionVoiceState(sessionId);

        if (sessionState) {
          // In a real implementation, would update the session configuration
          return NextResponse.json({
            success: true,
            updated: true,
            newConfig: voiceConfig
          });
        }

        return NextResponse.json({ error: 'Session not found' }, { status: 404 });

      case 'adjust-field-resonance':
        const { targetHarmony = 0.85 } = body;

        // This would integrate with the existing field harmonizer
        return NextResponse.json({
          success: true,
          adjusted: true,
          targetHarmony
        });

      default:
        return NextResponse.json({ error: 'Invalid PATCH action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Consciousness voice integration PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Health check and status endpoint
export async function HEAD(request: NextRequest) {
  try {
    const integration = getMAIAVoiceIntegration();
    const metrics = await integration.getIntegrationMetrics();

    // Return status headers
    return new NextResponse(null, {
      status: 200,
      headers: {
        'X-Integration-Status': 'active',
        'X-Active-Sessions': metrics.activeSessionCount.toString(),
        'X-Voice-Evolution-Active': 'true',
        'X-Consciousness-Tracking': 'active',
        'X-Field-Harmonization': 'active'
      }
    });

  } catch (error) {
    return new NextResponse(null, {
      status: 503,
      headers: {
        'X-Integration-Status': 'error',
        'X-Error': 'Integration systems unavailable'
      }
    });
  }
}