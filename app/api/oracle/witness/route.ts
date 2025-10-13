/**
 * Silent Witness Mode API Endpoints
 * Allows MAIA to observe sessions and provide personalized reflections
 */

import { NextRequest, NextResponse } from 'next/server';
import { SilentWitnessAgent } from '@/lib/agents/SilentWitnessAgent';
import { CreativeExpressionAnalyzer, ElementalWitnessResponses } from '@/lib/agents/CreativeWitnessMode';
import { MuseReceiverAgent } from '@/lib/agents/MuseReceiverMode';

// Store active witness sessions in memory (in production, use Redis or similar)
const activeWitnessSessions = new Map<string, SilentWitnessAgent>();
const activeMuseSessions = new Map<string, MuseReceiverAgent>();

/**
 * POST /api/oracle/witness
 * Start a witness session, add observations, or end session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, sessionId, ...params } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get or create agent for user
    let agent = activeWitnessSessions.get(`${userId}_${sessionId}`);

    switch (action) {
      case 'start':
        // Start a new witness session
        if (!sessionId) {
          return NextResponse.json(
            { error: 'sessionId is required to start session' },
            { status: 400 }
          );
        }

        agent = new SilentWitnessAgent(userId);
        activeWitnessSessions.set(`${userId}_${sessionId}`, agent);

        const startResult = await agent.startWitnessSession(
          sessionId,
          params.participants || [],
          params.metadata
        );

        return NextResponse.json({
          success: true,
          sessionId: startResult.sessionId,
          mode: 'silent_witness',
          message: '👁️ MAIA is now silently witnessing this session'
        });

      case 'observe':
        // Add observation to active session
        if (!agent) {
          return NextResponse.json(
            { error: 'No active session found. Start a session first.' },
            { status: 400 }
          );
        }

        const { speaker, content, metadata } = params;
        if (!speaker || !content) {
          return NextResponse.json(
            { error: 'speaker and content are required for observations' },
            { status: 400 }
          );
        }

        await agent.witness(speaker, content, metadata);

        return NextResponse.json({
          success: true,
          message: 'Observation recorded',
          sessionId
        });

      case 'creative':
        // Receive and analyze creative expression (poetry, lyrics, etc)
        if (!agent) {
          agent = new SilentWitnessAgent(userId);
          activeWitnessSessions.set(`${userId}_${sessionId || 'creative'}`, agent);
        }

        const { type, content: creativeContent, artistName } = params;
        if (!type || !creativeContent) {
          return NextResponse.json(
            { error: 'type and content are required for creative expressions' },
            { status: 400 }
          );
        }

        // Analyze the creative expression
        const analysis = await CreativeExpressionAnalyzer.analyzeExpression(
          creativeContent,
          type,
          artistName || userId
        );

        // Generate MAIA's elemental response
        const elementalResponse = ElementalWitnessResponses.generateElementalResponse(
          analysis as any,
          { userId }
        );

        // Store as special observation if in witness mode
        if (agent.isInWitnessMode()) {
          await agent.witness(artistName || userId, creativeContent, {
            emotionalTone: 'creative_expression',
            context: { type, analysis }
          });
        }

        return NextResponse.json({
          success: true,
          type,
          analysis,
          maiaResponse: elementalResponse,
          element: analysis.elementalResonance?.primary,
          message: '🎨 MAIA has received and witnessed your creative expression'
        });

      case 'end':
        // End witness session and get summary
        if (!agent) {
          return NextResponse.json(
            { error: 'No active session found' },
            { status: 400 }
          );
        }

        const session = await agent.endWitnessSession();

        // Clean up
        activeWitnessSessions.delete(`${userId}_${sessionId}`);

        if (!session) {
          return NextResponse.json(
            { error: 'Failed to end session' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          sessionId: session.sessionId,
          summary: {
            duration: session.endTime! - session.startTime,
            observationCount: session.observations.length,
            keyMoments: session.keyMoments.length,
            themes: session.overallThemes,
            elementalProgression: session.elementalProgression,
            patterns: session.collectivePatterns
          },
          message: '🔚 Witness session complete. Use /reflect to get MAIA\'s personalized insights.'
        });

      case 'start-muse':
        // Start a muse receiver session for walks/rambles
        const museType = params.type || 'walk';
        const museAgent = new MuseReceiverAgent(userId);

        const museResult = await museAgent.startMuseStream(
          museType,
          {
            location: params.location,
            mood: params.mood,
            intention: params.intention,
            triggers: params.triggers
          }
        );

        activeMuseSessions.set(`${userId}_${museResult.streamId}`, museAgent);

        return NextResponse.json({
          success: true,
          streamId: museResult.streamId,
          mode: 'muse_receiver',
          type: museType,
          message: '🎙️ MAIA is listening deeply to your stream of consciousness'
        });

      case 'receive-muse':
        // Receive long-form muse content
        const museStreamId = params.streamId;
        const mAgent = activeMuseSessions.get(`${userId}_${museStreamId}`);

        if (!mAgent) {
          return NextResponse.json(
            { error: 'No active muse session. Start one with action: start-muse' },
            { status: 400 }
          );
        }

        const { content: museContent, duration, energy } = params;
        if (!museContent) {
          return NextResponse.json(
            { error: 'content is required for muse entries' },
            { status: 400 }
          );
        }

        await mAgent.receiveMuse(museContent, { duration, energy });

        return NextResponse.json({
          success: true,
          message: 'Muse received and processed',
          streamId: museStreamId
        });

      case 'end-muse':
        // End muse session and get synthesis
        const endMuseStreamId = params.streamId;
        const endMAgent = activeMuseSessions.get(`${userId}_${endMuseStreamId}`);

        if (!endMAgent) {
          return NextResponse.json(
            { error: 'No active muse session found' },
            { status: 400 }
          );
        }

        const museStream = await endMAgent.endMuseStream();

        // Clean up
        activeMuseSessions.delete(`${userId}_${endMuseStreamId}`);

        if (!museStream) {
          return NextResponse.json(
            { error: 'Failed to end muse stream' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          streamId: museStream.id,
          duration: (museStream.endTime! - museStream.startTime) / 1000 / 60, // minutes
          entryCount: museStream.entries.length,
          insights: museStream.patterns.insightMoments.length,
          synthesis: museStream.synthesis,
          message: '✨ Your muse has been received and synthesized'
        });

      case 'reflect':
        // Generate personalized reflection on witnessed session
        const reflectionSessionId = params.reflectSessionId || sessionId;

        // Create new agent if needed for reflection
        if (!agent) {
          agent = new SilentWitnessAgent(userId);
        }

        const reflection = await agent.generatePersonalReflection(
          reflectionSessionId,
          params.userContext
        );

        return NextResponse.json({
          success: true,
          reflection,
          message: '✨ MAIA\'s reflection on the witnessed session'
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('❌ Witness mode error:', error);
    return NextResponse.json(
      {
        error: 'Witness operation failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/oracle/witness
 * Get witness session status or list sessions
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const sessionId = searchParams.get('sessionId');

  if (!userId) {
    return NextResponse.json(
      { error: 'userId is required' },
      { status: 400 }
    );
  }

  if (sessionId) {
    // Get specific session status
    const agent = activeWitnessSessions.get(`${userId}_${sessionId}`);

    if (!agent) {
      return NextResponse.json({
        active: false,
        message: 'No active session found'
      });
    }

    const session = agent.getCurrentSession();

    return NextResponse.json({
      active: true,
      inWitnessMode: agent.isInWitnessMode(),
      session: session ? {
        sessionId: session.sessionId,
        startTime: session.startTime,
        participants: session.participants,
        observationCount: session.observations.length,
        keyMomentCount: session.keyMoments.length,
        currentThemes: session.overallThemes
      } : null
    });
  }

  // List all sessions for user
  const userSessions = [];
  for (const [key, agent] of activeWitnessSessions.entries()) {
    if (key.startsWith(`${userId}_`)) {
      const session = agent.getCurrentSession();
      if (session) {
        userSessions.push({
          sessionId: session.sessionId,
          active: agent.isInWitnessMode(),
          startTime: session.startTime
        });
      }
    }
  }

  return NextResponse.json({
    userId,
    sessions: userSessions,
    endpoint: '/api/oracle/witness',
    actions: [
      'start - Begin a witness session',
      'observe - Add observation to active session',
      'creative - Submit creative expression for analysis',
      'end - End session and get summary',
      'reflect - Get personalized reflection on session',
      'start-muse - Start muse receiver mode for walks/rambles',
      'receive-muse - Send stream of consciousness content',
      'end-muse - End muse session and get synthesis'
    ],
    modes: {
      witness: 'Silent observation of conversations',
      creative: 'Receive poetry, lyrics, songs',
      muse: 'Deep listening for walks and stream of consciousness'
    }
  });
}