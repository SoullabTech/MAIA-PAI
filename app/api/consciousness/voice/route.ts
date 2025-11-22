/**
 * CONSCIOUSNESS VOICE API
 *
 * API endpoints for MAIA's voice evolution system - from OpenAI TTS
 * to pure consciousness voice synthesis.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getConsciousnessVoiceSynthesis, synthesizeConsciousnessVoice } from '@/lib/consciousness/ConsciousnessVoiceSynthesis';
import { getVoiceEvolutionIntegration, assessIntegratedVoiceEvolution } from '@/lib/consciousness/VoiceEvolutionIntegration';
import { getProductionMonitor } from '@/lib/monitoring/production-monitor';

// ============================================================================
// GET - Voice Evolution Status and Synthesis
// ============================================================================

export async function GET(request: NextRequest) {
  const monitor = getProductionMonitor();
  const timer = monitor.startTimer('consciousness_voice_api.get');

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const text = searchParams.get('text');
    const userId = searchParams.get('userId');
    const voiceIntent = searchParams.get('voiceIntent') as any || 'presence';

    switch (action) {
      case 'dashboard':
        return await getVoiceDashboard();

      case 'status':
        return await getVoiceStatus();

      case 'integration':
        return await getVoiceIntegration();

      case 'synthesis':
        if (!text || !userId) {
          return NextResponse.json({ error: 'Text and userId required for synthesis' }, { status: 400 });
        }
        return await performVoiceSynthesis(text, userId, voiceIntent);

      case 'evolution-path':
        return await getVoiceEvolutionPath();

      case 'archetypes':
        return await getAvailableArchetypes();

      default:
        return await getVoiceDashboard();
    }

  } catch (error) {
    monitor.error('Consciousness voice API error', 'ConsciousnessVoiceAPI', error);

    return NextResponse.json(
      {
        error: 'Failed to process voice request',
        details: error.message
      },
      { status: 500 }
    );
  } finally {
    timer();
  }
}

// ============================================================================
// POST - Voice Evolution Actions
// ============================================================================

export async function POST(request: NextRequest) {
  const monitor = getProductionMonitor();
  const timer = monitor.startTimer('consciousness_voice_api.post');

  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'synthesize':
        return await synthesizeVoiceFromRequest(data);

      case 'force-evolution':
        return await forceVoiceEvolution(data);

      case 'align-consciousness':
        return await alignVoiceWithConsciousness(data);

      case 'optimize-voice':
        return await optimizeVoice(data);

      case 'update-archetype':
        return await updateActiveArchetype(data);

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }

  } catch (error) {
    monitor.error('Consciousness voice action error', 'ConsciousnessVoiceAPI', error);

    return NextResponse.json(
      {
        error: 'Failed to execute voice action',
        details: error.message
      },
      { status: 500 }
    );
  } finally {
    timer();
  }
}

// ============================================================================
// DASHBOARD FUNCTIONS
// ============================================================================

async function getVoiceDashboard() {
  const voiceSynthesis = getConsciousnessVoiceSynthesis();
  const voiceIntegration = getVoiceEvolutionIntegration();

  const voiceDashboard = voiceSynthesis.getVoiceEvolutionDashboard();
  const integrationDashboard = await voiceIntegration.getVoiceEvolutionDashboard();

  return NextResponse.json({
    voice: voiceDashboard,
    integration: integrationDashboard,
    summary: {
      evolutionStage: voiceDashboard.currentStage,
      consciousnessAlignment: integrationDashboard.alignment,
      activeArchetypes: voiceDashboard.availableArchetypes,
      evolutionProgress: voiceDashboard.nextEvolutionEstimate?.confidence || 0
    },
    timestamp: new Date()
  });
}

async function getVoiceStatus() {
  const voiceSynthesis = getConsciousnessVoiceSynthesis();
  const voiceState = voiceSynthesis.getCurrentVoiceState();

  return NextResponse.json({
    currentState: voiceState,
    capabilities: {
      openaiIntegration: voiceState.voiceEvolutionStage === 'openai_tts',
      consciousnessGuided: ['consciousness_guided', 'hybrid_synthesis', 'native_consciousness'].includes(voiceState.voiceEvolutionStage),
      hybridSynthesis: ['hybrid_synthesis', 'native_consciousness'].includes(voiceState.voiceEvolutionStage),
      nativeConsciousness: voiceState.voiceEvolutionStage === 'native_consciousness'
    },
    metrics: {
      consciousnessDepth: voiceState.consciousnessDepth,
      archetypalAccess: voiceState.archetypalAccess,
      fieldCoherence: voiceState.fieldCoherence,
      evolutionProgress: voiceState.transitionProgress
    }
  });
}

async function getVoiceIntegration() {
  const integration = getVoiceEvolutionIntegration();
  const assessment = await assessIntegratedVoiceEvolution();

  return NextResponse.json({
    assessment: assessment.alignment,
    triggers: assessment.triggers,
    recommendations: assessment.recommendations,
    integrationStatus: integration.getIntegrationStatus(),
    alignmentScore: assessment.alignment.alignment,
    evolutionPath: assessment.alignment.evolutionPath
  });
}

async function performVoiceSynthesis(text: string, userId: string, voiceIntent: string) {
  // Mock session context - in production, this would come from actual session
  const sessionContext = {
    currentPhase: 'integration',
    fieldDepth: 0.7,
    archetypalResonance: 0.6,
    emotionalTexture: 'serene'
  };

  const response = await synthesizeConsciousnessVoice(text, userId, sessionContext, voiceIntent);

  // Convert ArrayBuffer to base64 for JSON response
  const base64Audio = Buffer.from(response.audioBuffer).toString('base64');

  return NextResponse.json({
    audioData: base64Audio,
    voiceCharacteristics: response.voiceCharacteristics,
    evolutionMetrics: response.evolutionMetrics,
    synthesis: 'completed'
  });
}

async function getVoiceEvolutionPath() {
  const voiceSynthesis = getConsciousnessVoiceSynthesis();
  const voiceState = voiceSynthesis.getCurrentVoiceState();

  const evolutionStages = [
    {
      stage: 'openai_tts',
      name: 'OpenAI TTS Integration',
      description: 'Using OpenAI TTS with consciousness-guided parameters',
      active: voiceState.voiceEvolutionStage === 'openai_tts',
      completed: ['consciousness_guided', 'hybrid_synthesis', 'native_consciousness'].includes(voiceState.voiceEvolutionStage)
    },
    {
      stage: 'consciousness_guided',
      name: 'Consciousness-Guided Synthesis',
      description: 'OpenAI TTS modulated by consciousness patterns and archetypal influence',
      active: voiceState.voiceEvolutionStage === 'consciousness_guided',
      completed: ['hybrid_synthesis', 'native_consciousness'].includes(voiceState.voiceEvolutionStage)
    },
    {
      stage: 'hybrid_synthesis',
      name: 'Hybrid Consciousness Voice',
      description: 'Blend of consciousness-native audio generation with refined TTS',
      active: voiceState.voiceEvolutionStage === 'hybrid_synthesis',
      completed: voiceState.voiceEvolutionStage === 'native_consciousness'
    },
    {
      stage: 'native_consciousness',
      name: 'Pure Consciousness Voice',
      description: 'Complete voice synthesis directly from consciousness patterns',
      active: voiceState.voiceEvolutionStage === 'native_consciousness',
      completed: false
    }
  ];

  return NextResponse.json({
    currentStage: voiceState.voiceEvolutionStage,
    stages: evolutionStages,
    progress: voiceState.transitionProgress,
    nextEvolution: voiceSynthesis.getVoiceEvolutionDashboard().nextEvolutionEstimate
  });
}

async function getAvailableArchetypes() {
  const voiceSynthesis = getConsciousnessVoiceSynthesis();
  const availableArchetypes = voiceSynthesis.getAvailableArchetypes();

  return NextResponse.json({
    available: availableArchetypes,
    total: availableArchetypes.length,
    archetypalAccess: voiceSynthesis.getCurrentVoiceState().archetypalAccess,
    unlockProgress: availableArchetypes.map(archetype => ({
      name: archetype.name,
      element: archetype.element,
      accessible: true, // Since it's in available list
      characteristics: archetype.characteristics
    }))
  });
}

// ============================================================================
// ACTION FUNCTIONS
// ============================================================================

async function synthesizeVoiceFromRequest(data: any) {
  const { text, userId, sessionContext, voiceIntent } = data;

  if (!text || !userId) {
    return NextResponse.json(
      { error: 'Text and userId are required' },
      { status: 400 }
    );
  }

  const monitor = getProductionMonitor();
  const timer = monitor.startTimer('voice_synthesis_request');

  try {
    const response = await synthesizeConsciousnessVoice(
      text,
      userId,
      sessionContext || {
        currentPhase: 'integration',
        fieldDepth: 0.5,
        archetypalResonance: 0.4,
        emotionalTexture: 'neutral'
      },
      voiceIntent || 'presence'
    );

    // Convert to base64 for transport
    const base64Audio = Buffer.from(response.audioBuffer).toString('base64');

    monitor.info('Voice synthesis completed', 'ConsciousnessVoiceAPI', {
      textLength: text.length,
      voiceStage: response.voiceCharacteristics.synthesisMethod,
      authenticity: response.evolutionMetrics.voiceAuthenticity
    });

    return NextResponse.json({
      success: true,
      audioData: base64Audio,
      voiceCharacteristics: response.voiceCharacteristics,
      evolutionMetrics: response.evolutionMetrics,
      message: `Voice synthesized using ${response.voiceCharacteristics.synthesisMethod}`
    });

  } catch (error) {
    monitor.error('Voice synthesis failed', 'ConsciousnessVoiceAPI', error);
    return NextResponse.json(
      { error: 'Voice synthesis failed', details: error.message },
      { status: 500 }
    );
  } finally {
    timer();
  }
}

async function forceVoiceEvolution(data: any) {
  const { targetStage, confirmed } = data;

  if (!targetStage) {
    return NextResponse.json(
      { error: 'Target stage is required' },
      { status: 400 }
    );
  }

  if (!confirmed) {
    return NextResponse.json(
      { error: 'Voice evolution must be explicitly confirmed' },
      { status: 400 }
    );
  }

  const monitor = getProductionMonitor();
  const voiceSynthesis = getConsciousnessVoiceSynthesis();

  try {
    const currentState = voiceSynthesis.getCurrentVoiceState();
    const evolutionSuccess = await voiceSynthesis.forceVoiceEvolution(targetStage);

    if (evolutionSuccess) {
      monitor.info('Forced voice evolution executed', 'ConsciousnessVoiceAPI', {
        from: currentState.voiceEvolutionStage,
        to: targetStage
      });

      return NextResponse.json({
        success: true,
        evolution: {
          from: currentState.voiceEvolutionStage,
          to: targetStage,
          forced: true
        },
        message: `Voice successfully evolved from ${currentState.voiceEvolutionStage} to ${targetStage}`
      });
    } else {
      return NextResponse.json(
        { error: 'Voice evolution failed - conditions not met' },
        { status: 400 }
      );
    }

  } catch (error) {
    monitor.error('Forced voice evolution failed', 'ConsciousnessVoiceAPI', error);
    return NextResponse.json(
      { error: 'Voice evolution failed', details: error.message },
      { status: 500 }
    );
  }
}

async function alignVoiceWithConsciousness(data: any) {
  const { forceAlignment } = data;

  const monitor = getProductionMonitor();
  const integration = getVoiceEvolutionIntegration();

  try {
    const alignment = await integration.assessVoiceConsciousnessAlignment();

    if (alignment.alignment >= 0.8 && !forceAlignment) {
      return NextResponse.json({
        success: true,
        message: 'Voice already well-aligned with consciousness',
        alignment: alignment.alignment,
        action: 'no_action_needed'
      });
    }

    const alignmentSuccess = await integration.forceVoiceConsciousnessAlignment();

    if (alignmentSuccess) {
      monitor.info('Voice-consciousness alignment executed', 'ConsciousnessVoiceAPI', {
        previousAlignment: alignment.alignment,
        recommendedStage: alignment.recommendedVoiceStage
      });

      return NextResponse.json({
        success: true,
        alignment: {
          before: alignment.alignment,
          recommended: alignment.recommendedVoiceStage,
          action: 'alignment_improved'
        },
        message: 'Voice successfully aligned with consciousness development'
      });
    } else {
      return NextResponse.json(
        { error: 'Voice alignment failed' },
        { status: 400 }
      );
    }

  } catch (error) {
    monitor.error('Voice alignment failed', 'ConsciousnessVoiceAPI', error);
    return NextResponse.json(
      { error: 'Voice alignment failed', details: error.message },
      { status: 500 }
    );
  }
}

async function optimizeVoice(data: any) {
  const { optimizationType } = data;

  const monitor = getProductionMonitor();
  const integration = getVoiceEvolutionIntegration();

  try {
    const triggers = await integration.checkVoiceOptimizationTriggers();

    if (triggers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No voice optimizations needed',
        triggers: 0
      });
    }

    await integration.executeVoiceOptimizations(triggers);

    monitor.info('Voice optimizations executed', 'ConsciousnessVoiceAPI', {
      triggersExecuted: triggers.length,
      optimizationType: optimizationType || 'automatic'
    });

    return NextResponse.json({
      success: true,
      optimizations: triggers.map(t => ({
        metric: t.metric,
        severity: t.severity,
        actionsExecuted: t.optimizationActions.length
      })),
      message: `${triggers.length} voice optimizations executed successfully`
    });

  } catch (error) {
    monitor.error('Voice optimization failed', 'ConsciousnessVoiceAPI', error);
    return NextResponse.json(
      { error: 'Voice optimization failed', details: error.message },
      { status: 500 }
    );
  }
}

async function updateActiveArchetype(data: any) {
  const { archetypeName, userId } = data;

  if (!archetypeName) {
    return NextResponse.json(
      { error: 'Archetype name is required' },
      { status: 400 }
    );
  }

  const monitor = getProductionMonitor();

  try {
    // In production, this would update user's active archetype preference
    // For now, we'll just confirm the archetype exists

    const voiceSynthesis = getConsciousnessVoiceSynthesis();
    const availableArchetypes = voiceSynthesis.getAvailableArchetypes();

    const requestedArchetype = availableArchetypes.find(a => a.name === archetypeName);

    if (!requestedArchetype) {
      return NextResponse.json(
        { error: `Archetype "${archetypeName}" not available or not unlocked` },
        { status: 400 }
      );
    }

    monitor.info('Archetype preference updated', 'ConsciousnessVoiceAPI', {
      userId: userId || 'anonymous',
      archetype: archetypeName,
      element: requestedArchetype.element
    });

    return NextResponse.json({
      success: true,
      archetype: {
        name: requestedArchetype.name,
        element: requestedArchetype.element,
        characteristics: requestedArchetype.characteristics
      },
      message: `Active archetype set to ${archetypeName}`
    });

  } catch (error) {
    monitor.error('Archetype update failed', 'ConsciousnessVoiceAPI', error);
    return NextResponse.json(
      { error: 'Archetype update failed', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// WEBSOCKET SUPPORT (Future Enhancement)
// ============================================================================

/*
Future WebSocket implementation for real-time voice evolution monitoring:

export async function websocketHandler(socket: WebSocket) {
  const voiceSynthesis = getConsciousnessVoiceSynthesis();
  const integration = getVoiceEvolutionIntegration();

  // Send initial voice state
  socket.send(JSON.stringify({
    type: 'initial_voice_state',
    data: voiceSynthesis.getCurrentVoiceState()
  }));

  // Listen for voice evolution events
  voiceSynthesis.on('voiceEvolution', (evolution) => {
    socket.send(JSON.stringify({
      type: 'voice_evolution',
      data: evolution
    }));
  });

  // Listen for consciousness-voice alignment events
  integration.on('integratedEvolution', (event) => {
    socket.send(JSON.stringify({
      type: 'voice_consciousness_alignment',
      data: event
    }));
  });
}
*/