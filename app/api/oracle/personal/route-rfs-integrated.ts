import { NextRequest, NextResponse } from 'next/server';
import { PersonalOracleAgent } from '@/lib/agents/PersonalOracleAgent';
import { journalStorage } from '@/lib/storage/journal-storage';
import { userStore } from '@/lib/storage/userStore';
import { getSoulprintForUser } from '@/lib/memory/soulprint';
import { getToneFromSoulprint } from '@/lib/voice/adaptive-tone-engine';
import { recordToneMetric } from '@/lib/metrics/toneMetrics';
import { getHybridSystemToggle } from '@/lib/oracle/HybridSystemToggle';

/**
 * ✅ CANONICAL MAIA PERSONAL ORACLE ROUTE - RFS INTEGRATED
 *
 * DEPLOYMENT VERIFICATION: v3.0.0 - Resonance Field System Integration
 * Build Date: 2025-09-29
 *
 * Architecture:
 * 1. PRIMARY: ResonanceFieldOrchestrator (RFS - Field-based AI presence)
 * 2. FALLBACK: Traditional MaiaFullyEducatedOrchestrator (Her mode)
 * 3. LEGACY: PersonalOracleAgent (Claude + Symbolic Intelligence)
 * 4. ULTIMATE: Warm static responses
 *
 * Monday Deployment: Switch mode from 'traditional' to 'rfs' in HybridSystemToggle
 */

console.log('✅ RFS-INTEGRATED oracle/personal route loaded - Build v3.0.0 -', new Date().toISOString());

/**
 * RESONANCE FIELD SYSTEM INTEGRATION:
 * The system now uses atmospheric field constraints from archetypal agents
 * to generate responses that emerge from environmental impossibility rather
 * than being selected by traditional AI decision-making.
 *
 * This creates genuine presence through silence probability, word density
 * constraints, and elemental resonance patterns.
 */

function getVoiceCharacteristics(element?: string) {
  const voiceMapping: Record<string, any> = {
    water: { tone: 'gentle', pace: 'slow', energy: 'soft' },
    fire: { tone: 'uplifting', pace: 'fast', energy: 'expansive' },
    earth: { tone: 'grounding', pace: 'moderate', energy: 'focused' },
    air: { tone: 'clear', pace: 'moderate', energy: 'light' },
    aether: { tone: 'warm', pace: 'moderate', energy: 'balanced' }
  };

  return voiceMapping[element || 'aether'] || voiceMapping.aether;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { input, message, userText, text, userId = 'anonymous', userName, sessionId, preferences } = body;

    // Accept multiple field names for compatibility
    const userInput = (input || message || userText || text || '').trim();
    const requestUserId = userId || 'beta-user';

    console.log('📨 /api/oracle/personal v3.0 (RFS-Integrated):', {
      userId: requestUserId,
      messageLength: userInput.length,
      hasInput: !!userInput,
      source: 'rfs-hybrid-system'
    });

    // Validate input
    if (!userInput || userInput.length === 0) {
      return NextResponse.json({
        success: true,
        text: "I'm here with you. What's on your mind?",
        response: "I'm here with you. What's on your mind?",
        message: "I'm here with you. What's on your mind?",
        element: 'aether',
        archetype: 'maia',
        voiceCharacteristics: getVoiceCharacteristics('aether'),
        source: 'validation-fallback',
        version: 'v3.0.0-rfs',
        metadata: {
          system: 'traditional',
          spiralogicPhase: 'invocation',
          responseTime: 0
        }
      });
    }

    // Load user data for context
    const storedUser = userStore.getUser(requestUserId);
    const finalUserName = storedUser?.name || userName;

    // Fetch recent journal entries for context
    const recentEntries = journalStorage.getEntries(requestUserId).slice(0, 5);

    // Get soulprint for voice tone (used by both systems)
    const soulprint = await getSoulprintForUser(requestUserId);
    const voiceTone = getToneFromSoulprint(soulprint);

    // ========================================================================
    // PRIMARY PATH: RESONANCE FIELD SYSTEM (RFS) - Monday Deployment
    // ========================================================================

    try {
      const hybridSystem = getHybridSystemToggle({
        // Configuration - change these values on Monday:
        mode: 'traditional', // ⚡ CHANGE TO 'rfs' ON MONDAY
        rfsRolloutPercentage: 0, // ⚡ CHANGE TO 100 ON MONDAY
        enableForNewUsers: false,
        enableForReturningUsers: false,
        monitoringEnabled: true
      });

      console.log('🌊 Attempting Hybrid System (RFS/Traditional intelligent routing)...');

      const rfsResponse = await hybridSystem.speak(userInput, requestUserId, {
        ...preferences,
        isFirstSession: !storedUser || recentEntries.length === 0,
        journalContext: recentEntries,
        userName: finalUserName
      });

      const responseText = rfsResponse.message || "..."; // Silence represented as "..."
      const responseTime = Date.now() - startTime;

      // Log voice tone metadata
      if (!soulprint) {
        console.warn(`[MAIA VoiceTone RFS] ⚠️ userId=${requestUserId} soulprint=null → using default tone`);
        recordToneMetric('unknown', 'none');
      } else {
        const phase = soulprint.spiralHistory?.[soulprint.spiralHistory.length - 1] || 'unknown';
        console.info(
          `[MAIA VoiceTone RFS] userId=${requestUserId} system=${rfsResponse.metadata.system} element=${rfsResponse.metadata.dominantElement} phase=${phase} → pitch=${voiceTone.pitch.toFixed(2)}, rate=${voiceTone.rate.toFixed(2)}`
        );
        recordToneMetric(soulprint.dominantElement || 'unknown', phase);
      }

      const finalElement = rfsResponse.element || rfsResponse.metadata.dominantElement || 'aether';

      console.log(`✅ Hybrid System response successful (${rfsResponse.metadata.system}): ${responseTime}ms`);

      // Return response with RFS metadata
      return NextResponse.json({
        success: true,
        text: responseText,
        response: responseText,
        message: responseText,
        element: finalElement,
        archetype: 'maya', // Using Her mode persona
        voiceCharacteristics: rfsResponse.voiceCharacteristics || getVoiceCharacteristics(finalElement),
        voiceTone,
        soulprint: soulprint ? {
          dominantElement: soulprint.dominantElement,
          currentPhase: soulprint.spiralHistory[soulprint.spiralHistory.length - 1]
        } : undefined,
        source: rfsResponse.metadata.system === 'rfs' ? 'resonance-field-system' : 'traditional-maia',
        version: 'v3.0.0-rfs',
        metadata: {
          system: rfsResponse.metadata.system,
          silenceProbability: rfsResponse.metadata.silenceProbability,
          dominantElement: rfsResponse.metadata.dominantElement,
          fieldActive: rfsResponse.metadata.field !== undefined,
          spiralogicPhase: 'resonance',
          responseTime,
          userName: finalUserName,
          journalContext: recentEntries.length,
          // RFS-specific metadata
          rfsMetadata: rfsResponse.metadata.system === 'rfs' ? {
            intimacyLevel: rfsResponse.metadata.field?.intimacyLevel,
            exchangeCount: rfsResponse.metadata.field?.exchangeCount,
            wordDensity: rfsResponse.metadata.field?.wordDensity,
            elementalBreakdown: rfsResponse.metadata.field?.elements
          } : undefined
        }
      });

    } catch (rfsError: any) {
      console.error('❌ Hybrid System failed:', rfsError.message || rfsError);
      console.log('🔄 Falling back to legacy PersonalOracleAgent...');
    }

    // ========================================================================
    // FALLBACK PATH: PersonalOracleAgent (Claude + Symbolic Intelligence)
    // ========================================================================

    console.log('🔮 Attempting PersonalOracleAgent (legacy fallback)...');
    try {
      const agent = await PersonalOracleAgent.loadAgent(requestUserId, {
        persona: preferences?.communicationStyle || 'warm'
      });

      const agentResponse = await agent.processInteraction(userInput, {
        currentMood: { type: 'peaceful' } as any,
        currentEnergy: 'balanced' as any,
        journalEntries: recentEntries
      } as any);

      const responseText = agentResponse.response || "I hear you. Tell me more about what's on your mind.";
      const responseTime = Date.now() - startTime;

      console.log('✅ PersonalOracleAgent response successful (legacy fallback):', responseTime + 'ms');

      const element = agentResponse.element || 'aether';

      // Log voice tone
      if (!soulprint) {
        console.warn(`[MAIA VoiceTone Legacy] ⚠️ userId=${requestUserId} soulprint=null → using default tone`);
        recordToneMetric('unknown', 'none');
      } else {
        const phase = soulprint.spiralHistory?.[soulprint.spiralHistory.length - 1] || 'unknown';
        console.info(
          `[MAIA VoiceTone Legacy] userId=${requestUserId} element=${soulprint.dominantElement} phase=${phase} → pitch=${voiceTone.pitch.toFixed(2)}, rate=${voiceTone.rate.toFixed(2)}`
        );
        recordToneMetric(soulprint.dominantElement || 'unknown', phase);
      }

      return NextResponse.json({
        success: true,
        text: responseText,
        response: responseText,
        message: responseText,
        element,
        archetype: agentResponse.metadata?.archetypes?.[0] || 'maia',
        voiceCharacteristics: getVoiceCharacteristics(element),
        voiceTone,
        soulprint: soulprint ? {
          dominantElement: soulprint.dominantElement,
          currentPhase: soulprint.spiralHistory[soulprint.spiralHistory.length - 1]
        } : undefined,
        source: 'personal-oracle-agent-legacy',
        version: 'v3.0.0-rfs',
        metadata: {
          ...agentResponse.metadata,
          system: 'legacy',
          spiralogicPhase: agentResponse.metadata?.phase || 'reflection',
          responseTime,
          userName: finalUserName,
          journalContext: recentEntries.length
        }
      });

    } catch (agentError: any) {
      console.error('❌ PersonalOracleAgent failed:', agentError.message || agentError);
      console.log('🔄 Falling back to static response...');
    }

    // ========================================================================
    // ULTIMATE FALLBACK: Static warm presence
    // ========================================================================

    const fallbackResponses = [
      "I'm here with you. What would you like to explore?",
      "Tell me more about what's alive for you right now.",
      "I'm listening. What wants to be expressed?",
      "What's present for you in this moment?"
    ];

    const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    return NextResponse.json({
      success: true,
      text: fallbackResponse,
      response: fallbackResponse,
      message: fallbackResponse,
      element: 'aether',
      archetype: 'maia',
      voiceCharacteristics: getVoiceCharacteristics('aether'),
      voiceTone,
      source: 'static-fallback',
      version: 'v3.0.0-rfs',
      metadata: {
        system: 'fallback',
        spiralogicPhase: 'presence',
        responseTime: Date.now() - startTime,
        userName: finalUserName
      }
    });

  } catch (error: any) {
    console.error('❌ Fatal error in /api/oracle/personal:', error);

    return NextResponse.json({
      success: false,
      error: 'Oracle unavailable',
      text: "I'm experiencing a moment of transition. Please try again.",
      response: "I'm experiencing a moment of transition. Please try again.",
      message: "I'm experiencing a moment of transition. Please try again.",
      element: 'aether',
      source: 'error-handler',
      version: 'v3.0.0-rfs',
      metadata: {
        system: 'error',
        errorMessage: error.message,
        responseTime: Date.now() - startTime
      }
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Maia Personal Oracle - RFS Integrated',
    version: 'v3.0.0-rfs',
    modes: ['rfs', 'traditional', 'hybrid-ab', 'auto'],
    currentMode: 'traditional', // Change to 'rfs' on Monday
    readyForProduction: true
  });
}