/**
 * Bardic Memory - Retrieval Protocol API
 *
 * Implements the 3-stage protocol for re-entering lived moments:
 * Stage 1: RECOGNITION - Detect morphic resonance
 * Stage 2: RE-ENTRY - Present portal with consent gate
 * Stage 3: RECALL - Provide full episode details
 *
 * @module app/api/bardic/recall
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  recognizeResonance,
  prepareReentry,
  recallEpisode,
  expressUncertainty,
  type RecognitionInput,
  type RecallDepth,
} from '@/lib/services/retrieval-protocol';
import { checkQuota, logUsage } from '@/lib/services/quota-service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ============================================================================
// HELPER: Get User ID from Auth
// ============================================================================

async function getUserIdFromAuth(request: NextRequest): Promise<string | null> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user.id;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

// ============================================================================
// POST: Execute Retrieval Protocol
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      );
    }

    // Check quota
    const quotaCheck = await checkQuota(userId);
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        { error: quotaCheck.reason, quota: quotaCheck.quota },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { stage, ...params } = body;

    if (!stage) {
      return NextResponse.json(
        { error: 'Missing required field: stage (recognition|reentry|recall)' },
        { status: 400 }
      );
    }

    // ========================================================================
    // STAGE 1: RECOGNITION
    // ========================================================================
    if (stage === 'recognition') {
      const {
        currentMessage,
        currentAffect,
        currentElementalState,
        minSimilarity,
      } = params;

      if (!currentMessage) {
        return NextResponse.json(
          { error: 'Missing required field: currentMessage' },
          { status: 400 }
        );
      }

      const input: RecognitionInput = {
        userId,
        currentMessage,
        currentAffect,
        currentElementalState,
        minSimilarity,
      };

      const signal = await recognizeResonance(input);

      // Log usage (recognition)
      await logUsage({
        userId,
        operation: 'bardic_recognition',
        inputTokens: Math.ceil(currentMessage.length / 4),
        outputTokens: signal ? 50 : 10, // Rough estimate
        totalTokens: Math.ceil(currentMessage.length / 4) + (signal ? 50 : 10),
        metadata: {
          foundResonance: !!signal,
          episodeId: signal?.episodeId,
        },
      });

      if (!signal) {
        return NextResponse.json({
          resonance: null,
          message: 'No morphic resonance detected in your memory field',
        });
      }

      return NextResponse.json({
        resonance: signal,
        uncertainty: expressUncertainty(signal.resonanceStrength),
        message: `I sense an echo: "${signal.sceneStanza || 'a previous moment'}"`,
      });
    }

    // ========================================================================
    // STAGE 2: RE-ENTRY (Consent Gate)
    // ========================================================================
    if (stage === 'reentry') {
      const {
        episodeId,
        checkCapacity,
        currentAffectArousal,
      } = params;

      if (!episodeId) {
        return NextResponse.json(
          { error: 'Missing required field: episodeId' },
          { status: 400 }
        );
      }

      const experience = await prepareReentry(episodeId, {
        checkCapacity,
        currentAffectArousal,
      });

      // Log usage (reentry preparation)
      await logUsage({
        userId,
        operation: 'bardic_reentry',
        inputTokens: 10,
        outputTokens: 50,
        totalTokens: 60,
        metadata: {
          episodeId,
          canEnter: experience.canEnter,
          requiresConsent: experience.consentRequired,
        },
      });

      return NextResponse.json({
        portal: experience,
        message: experience.canEnter
          ? 'Portal prepared. Ready to re-enter when you are.'
          : experience.reason,
      });
    }

    // ========================================================================
    // STAGE 3: RECALL
    // ========================================================================
    if (stage === 'recall') {
      const { episodeId, depth } = params;

      if (!episodeId) {
        return NextResponse.json(
          { error: 'Missing required field: episodeId' },
          { status: 400 }
        );
      }

      const recallDepth: RecallDepth = depth || 'full';
      const details = await recallEpisode(episodeId, recallDepth);

      // Log usage (recall)
      const outputTokens = recallDepth === 'deep' ? 500 : recallDepth === 'full' ? 300 : 100;
      await logUsage({
        userId,
        operation: 'bardic_recall',
        inputTokens: 10,
        outputTokens,
        totalTokens: 10 + outputTokens,
        metadata: {
          episodeId,
          depth: recallDepth,
          linkedEpisodesCount: details.linkedEpisodes.length,
          microactsCount: details.microacts.length,
        },
      });

      return NextResponse.json({
        details,
        narrativeThreads: details.narrativeThreads,
        message: 'Re-entry complete. You are here now.',
      });
    }

    return NextResponse.json(
      { error: `Unknown stage: ${stage}. Must be recognition|reentry|recall` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('POST /api/bardic/recall error:', error);
    return NextResponse.json(
      { error: error.message || 'Retrieval protocol failed' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET: Query Recognition Patterns
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const episodeId = searchParams.get('episodeId');
    const depth = searchParams.get('depth') as RecallDepth || 'full';

    if (!episodeId) {
      return NextResponse.json(
        { error: 'Missing required parameter: episodeId' },
        { status: 400 }
      );
    }

    // Get episode details directly (bypass consent for GET)
    const details = await recallEpisode(episodeId, depth);

    return NextResponse.json({ details });
  } catch (error: any) {
    console.error('GET /api/bardic/recall error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve episode details' },
      { status: 500 }
    );
  }
}
