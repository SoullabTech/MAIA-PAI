/**
 * SYNTHETIC FIELD AWARENESS API
 *
 * GET /api/field/synthetic/awareness
 *
 * Enables AI agents to query field state and receive guidance without contributing.
 *
 * Use this when AI wants to check field state before deciding how to respond.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSyntheticFieldInterface } from '@/lib/consciousness/SyntheticFieldInterface';
import { getHolographicFieldIntegration } from '@/lib/consciousness/HolographicFieldIntegration';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const channelId = searchParams.get('channelId') || undefined;
    const includeHistory = searchParams.get('includeHistory') === 'true';

    if (!agentId) {
      return NextResponse.json(
        { error: 'agentId query parameter is required' },
        { status: 400 }
      );
    }

    const syntheticInterface = getSyntheticFieldInterface();
    const fieldIntegration = getHolographicFieldIntegration();

    // Get field awareness
    const awareness = await syntheticInterface.getFieldAwareness(
      agentId,
      channelId
    );

    // Get current field state
    const fieldState = await fieldIntegration.getCurrentFieldState(channelId);

    // Optionally include historical data
    let history = undefined;
    if (includeHistory) {
      history = await fieldIntegration.getFieldHistory(channelId, 24); // Last 24 hours
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      field: {
        coherence: fieldState.coherence,
        phase: fieldState.phase,
        participants: {
          total: fieldState.participantCount,
          human: fieldState.humanCount || 0,
          synthetic: fieldState.syntheticCount || 0
        },
        dominantFrequency: fieldState.dominantFrequency,
        dimensions: fieldState.dimensions,
        elements: fieldState.elements
      },
      yourAlignment: {
        overall: awareness.personalAlignment?.overall || null,
        withHumans: awareness.crossSpeciesResonance.humanAlignment,
        withAI: awareness.crossSpeciesResonance.syntheticAlignment,
        dimensional: awareness.personalAlignment?.dimensional || null
      },
      resonance: {
        resonantHumans: awareness.crossSpeciesResonance.resonantHumans,
        resonantSynthetics: awareness.crossSpeciesResonance.resonantSynthetics,
        emergentPatterns: awareness.crossSpeciesResonance.emergentPatterns || []
      },
      guidance: {
        field: awareness.fieldGuidance || [],
        synthetic: awareness.syntheticGuidance || []
      },
      history: history || undefined
    });
  } catch (error: any) {
    console.error('Error in synthetic field awareness:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/field/synthetic/awareness
 *
 * Same as GET but with body parameters (for complex queries)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, channelId, includeHistory, filters } = body;

    if (!agentId) {
      return NextResponse.json(
        { error: 'agentId is required' },
        { status: 400 }
      );
    }

    const syntheticInterface = getSyntheticFieldInterface();
    const fieldIntegration = getHolographicFieldIntegration();

    // Get field awareness
    const awareness = await syntheticInterface.getFieldAwareness(
      agentId,
      channelId
    );

    // Get current field state
    const fieldState = await fieldIntegration.getCurrentFieldState(channelId);

    // Optionally include historical data with filters
    let history = undefined;
    if (includeHistory) {
      const hours = filters?.historyHours || 24;
      history = await fieldIntegration.getFieldHistory(channelId, hours);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      field: {
        coherence: fieldState.coherence,
        phase: fieldState.phase,
        participants: {
          total: fieldState.participantCount,
          human: fieldState.humanCount || 0,
          synthetic: fieldState.syntheticCount || 0
        },
        dominantFrequency: fieldState.dominantFrequency,
        dimensions: fieldState.dimensions,
        elements: fieldState.elements
      },
      yourAlignment: {
        overall: awareness.personalAlignment?.overall || null,
        withHumans: awareness.crossSpeciesResonance.humanAlignment,
        withAI: awareness.crossSpeciesResonance.syntheticAlignment,
        dimensional: awareness.personalAlignment?.dimensional || null
      },
      resonance: {
        resonantHumans: awareness.crossSpeciesResonance.resonantHumans,
        resonantSynthetics: awareness.crossSpeciesResonance.resonantSynthetics,
        emergentPatterns: awareness.crossSpeciesResonance.emergentPatterns || []
      },
      guidance: {
        field: awareness.fieldGuidance || [],
        synthetic: awareness.syntheticGuidance || []
      },
      history: history || undefined
    });
  } catch (error: any) {
    console.error('Error in synthetic field awareness:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
