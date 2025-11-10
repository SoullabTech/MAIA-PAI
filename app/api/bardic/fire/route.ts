/**
 * Bardic Memory - Fire Queries API
 *
 * Handles teleological tracking (future pressures, what wants to emerge)
 * Fire cognition: Right PFC orientation toward becoming
 *
 * @module app/api/bardic/fire
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  createTelos,
  getTelos,
  getActiveTeloi,
  updateTelos,
  deleteTelos,
  adjustTelosStrength,
  logTelosAlignment,
  getTelosAlignmentHistory,
  detectCrystallization,
  getCrystallizingTeloi,
  queryWhatWantsToEmerge,
  queryWhatsPullingForward,
  queryWhatsBecomingClearer,
  calculateTelosProgress,
  type CreateTelosParams,
  type UpdateTelosParams,
  type LogTelosAlignmentParams,
} from '@/lib/services/telos-service';
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
// GET: Fire Queries & Telos Retrieval
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
    const query = searchParams.get('query');
    const telosId = searchParams.get('id');
    const crystallization = searchParams.get('crystallization');
    const history = searchParams.get('history');

    // Single telos by ID
    if (telosId) {
      const telos = await getTelos(telosId);

      if (!telos) {
        return NextResponse.json(
          { error: 'Telos not found' },
          { status: 404 }
        );
      }

      // Verify ownership
      if (telos.userId !== userId) {
        return NextResponse.json(
          { error: 'Forbidden - not your telos' },
          { status: 403 }
        );
      }

      // Include history if requested
      if (history === 'true') {
        const alignmentHistory = await getTelosAlignmentHistory(telosId);
        const progress = await calculateTelosProgress(telosId);
        const crystallizationState = await detectCrystallization(telosId);

        return NextResponse.json({
          telos,
          alignmentHistory,
          progress,
          crystallization: crystallizationState,
        });
      }

      return NextResponse.json({ telos });
    }

    // Crystallization detection
    if (crystallization === 'true') {
      const crystallizing = await getCrystallizingTeloi(userId);
      return NextResponse.json({
        crystallizing,
        count: crystallizing.length,
        message: crystallizing.length > 0
          ? 'Future pressures are crystallizing into form'
          : 'No active crystallizations detected',
      });
    }

    // Fire Queries
    switch (query) {
      case 'emerge':
      case 'what-wants-to-emerge':
        const emerging = await queryWhatWantsToEmerge(userId);
        return NextResponse.json({
          query: 'What wants to emerge?',
          teloi: emerging,
          message: emerging.length > 0
            ? 'These forces seek manifestation'
            : 'The field is quiet - no strong pressures detected',
        });

      case 'forward':
      case 'whats-pulling-forward':
        const pulling = await queryWhatsPullingForward(userId);
        return NextResponse.json({
          query: "What's pulling me forward?",
          teloi: pulling,
          message: pulling.length > 0
            ? 'These teloi are gaining momentum'
            : 'No clear forward movement detected',
        });

      case 'clearer':
      case 'whats-becoming-clearer':
        const clearer = await queryWhatsBecomingClearer(userId);
        return NextResponse.json({
          query: "What's becoming clearer?",
          teloi: clearer,
          crystallizing: clearer,
          message: clearer.length > 0
            ? 'Clarity is forming - these are crystallizing'
            : 'Nothing crystallizing at this time',
        });

      default:
        // All active teloi
        const active = await getActiveTeloi(userId);
        return NextResponse.json({
          teloi: active,
          count: active.length,
        });
    }
  } catch (error: any) {
    console.error('GET /api/bardic/fire error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to execute fire query' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST: Create Telos or Log Alignment
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
    const { action, ...params } = body;

    // ========================================================================
    // Create Telos
    // ========================================================================
    if (!action || action === 'create') {
      const {
        phrase,
        originEpisodeId,
        strength,
        horizonDays,
        signals,
      } = params;

      if (!phrase) {
        return NextResponse.json(
          { error: 'Missing required field: phrase' },
          { status: 400 }
        );
      }

      const createParams: CreateTelosParams = {
        userId,
        phrase,
        originEpisodeId,
        strength,
        horizonDays,
        signals,
      };

      const telos = await createTelos(createParams);

      // Log usage
      await logUsage({
        userId,
        operation: 'telos_create',
        inputTokens: Math.ceil(phrase.length / 4),
        outputTokens: 10,
        totalTokens: Math.ceil(phrase.length / 4) + 10,
        metadata: { telosId: telos.id },
      });

      return NextResponse.json({
        telos,
        message: `Telos registered: "${phrase}"`,
      }, { status: 201 });
    }

    // ========================================================================
    // Log Alignment
    // ========================================================================
    if (action === 'align') {
      const { episodeId, telosId, delta, notes } = params;

      if (!episodeId || !telosId || delta === undefined) {
        return NextResponse.json(
          { error: 'Missing required fields: episodeId, telosId, delta' },
          { status: 400 }
        );
      }

      const alignParams: LogTelosAlignmentParams = {
        episodeId,
        telosId,
        delta,
        notes,
      };

      const alignmentLog = await logTelosAlignment(alignParams);

      // Check if crystallizing after alignment
      const crystallization = await detectCrystallization(telosId);

      // Log usage
      await logUsage({
        userId,
        operation: 'telos_align',
        inputTokens: notes ? Math.ceil(notes.length / 4) : 10,
        outputTokens: 20,
        totalTokens: (notes ? Math.ceil(notes.length / 4) : 10) + 20,
        metadata: {
          telosId,
          episodeId,
          delta,
          isCrystallizing: crystallization.isCrystallizing,
        },
      });

      return NextResponse.json({
        alignment: alignmentLog,
        crystallization: crystallization.isCrystallizing ? crystallization : null,
        message: crystallization.isCrystallizing
          ? '✨ Crystallization detected - this telos is manifesting'
          : 'Alignment logged',
      });
    }

    // ========================================================================
    // Adjust Strength
    // ========================================================================
    if (action === 'adjust') {
      const { telosId, delta } = params;

      if (!telosId || delta === undefined) {
        return NextResponse.json(
          { error: 'Missing required fields: telosId, delta' },
          { status: 400 }
        );
      }

      const updated = await adjustTelosStrength(telosId, delta);

      return NextResponse.json({
        telos: updated,
        message: `Strength adjusted: ${updated.strength.toFixed(2)}`,
      });
    }

    return NextResponse.json(
      { error: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('POST /api/bardic/fire error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to execute fire operation' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH: Update Telos
// ============================================================================

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { telosId, ...updateFields } = body;

    if (!telosId) {
      return NextResponse.json(
        { error: 'Missing required field: telosId' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await getTelos(telosId);
    if (!existing) {
      return NextResponse.json(
        { error: 'Telos not found' },
        { status: 404 }
      );
    }

    if (existing.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden - not your telos' },
        { status: 403 }
      );
    }

    // Update telos
    const params: UpdateTelosParams = updateFields;
    const updated = await updateTelos(telosId, params);

    return NextResponse.json({
      telos: updated,
      message: 'Telos updated',
    });
  } catch (error: any) {
    console.error('PATCH /api/bardic/fire error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update telos' },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE: Delete Telos
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const telosId = searchParams.get('id');

    if (!telosId) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await getTelos(telosId);
    if (!existing) {
      return NextResponse.json(
        { error: 'Telos not found' },
        { status: 404 }
      );
    }

    if (existing.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden - not your telos' },
        { status: 403 }
      );
    }

    // Delete telos
    await deleteTelos(telosId);

    return NextResponse.json({
      success: true,
      message: 'Telos dissolved',
    });
  } catch (error: any) {
    console.error('DELETE /api/bardic/fire error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete telos' },
      { status: 500 }
    );
  }
}
