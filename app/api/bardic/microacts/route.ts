/**
 * Bardic Memory - Microacts API
 *
 * Handles virtue tracking through repeated small actions (Earth layer)
 * Tracks the slow accrual of character through consistent practice
 *
 * @module app/api/bardic/microacts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  createMicroact,
  getMicroact,
  getUserMicroacts,
  getMicroactsByVirtue,
  getTopMicroacts,
  updateMicroact,
  deleteMicroact,
  logMicroactOccurrence,
  logMicroactByPhrase,
  getMicroactLogs,
  getRecentMicroactActivity,
  getVirtueLedger,
  getMicroactStreak,
  getMicroactFrequency,
  getAcceleratingMicroacts,
  type CreateMicroactParams,
  type LogMicroactParams,
} from '@/lib/services/microact-service';
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
// GET: Retrieve Microacts & Analytics
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
    const microactId = searchParams.get('id');
    const virtue = searchParams.get('virtue');
    const analytics = searchParams.get('analytics');
    const ledger = searchParams.get('ledger');
    const accelerating = searchParams.get('accelerating');
    const recent = searchParams.get('recent');
    const top = searchParams.get('top');
    const logs = searchParams.get('logs');
    const streak = searchParams.get('streak');
    const frequency = searchParams.get('frequency');

    // Single microact by ID
    if (microactId) {
      const microact = await getMicroact(microactId);

      if (!microact) {
        return NextResponse.json(
          { error: 'Microact not found' },
          { status: 404 }
        );
      }

      // Verify ownership
      if (microact.userId !== userId) {
        return NextResponse.json(
          { error: 'Forbidden - not your microact' },
          { status: 403 }
        );
      }

      // Include analytics if requested
      if (analytics === 'true') {
        const [streakCount, freq, logHistory] = await Promise.all([
          getMicroactStreak(microactId),
          getMicroactFrequency(microactId),
          getMicroactLogs(microactId, { limit: 10 }),
        ]);

        return NextResponse.json({
          microact,
          streak: streakCount,
          frequency: freq,
          recentLogs: logHistory,
        });
      }

      return NextResponse.json({ microact });
    }

    // Microact logs
    if (logs && microactId) {
      const limit = searchParams.get('limit');
      const offset = searchParams.get('offset');

      const logHistory = await getMicroactLogs(microactId, {
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
      });

      return NextResponse.json({ logs: logHistory });
    }

    // Streak calculation
    if (streak && microactId) {
      const streakCount = await getMicroactStreak(microactId);
      return NextResponse.json({
        microactId,
        streak: streakCount,
        message: streakCount > 0
          ? `${streakCount} day streak! 🔥`
          : 'No current streak',
      });
    }

    // Frequency calculation
    if (frequency && microactId) {
      const days = searchParams.get('days');
      const freq = await getMicroactFrequency(
        microactId,
        days ? parseInt(days) : undefined
      );

      return NextResponse.json({
        microactId,
        frequency: freq,
        perDay: freq.toFixed(2),
        days: days ? parseInt(days) : 30,
      });
    }

    // Virtue Ledger (summary of all virtues)
    if (ledger === 'true') {
      const virtueLedger = await getVirtueLedger(userId);
      return NextResponse.json({
        ledger: virtueLedger,
        totalVirtues: virtueLedger.length,
        message: 'The slow accrual of character',
      });
    }

    // Accelerating microacts
    if (accelerating === 'true') {
      const acceleratingMicroacts = await getAcceleratingMicroacts(userId);
      return NextResponse.json({
        microacts: acceleratingMicroacts,
        count: acceleratingMicroacts.length,
        message: acceleratingMicroacts.length > 0
          ? 'These practices are gaining momentum'
          : 'No accelerating patterns detected',
      });
    }

    // Recent activity
    if (recent === 'true') {
      const days = searchParams.get('days');
      const activity = await getRecentMicroactActivity(
        userId,
        days ? parseInt(days) : undefined
      );

      return NextResponse.json({
        activity,
        count: activity.length,
        days: days ? parseInt(days) : 7,
      });
    }

    // Top microacts (most practiced)
    if (top === 'true') {
      const limit = searchParams.get('limit');
      const topMicroacts = await getTopMicroacts(
        userId,
        limit ? parseInt(limit) : undefined
      );

      return NextResponse.json({
        microacts: topMicroacts,
        message: 'Your most cultivated virtues',
      });
    }

    // Filter by virtue category
    if (virtue) {
      const microacts = await getMicroactsByVirtue(userId, virtue);
      return NextResponse.json({
        virtue,
        microacts,
        count: microacts.length,
      });
    }

    // All microacts for user
    const microacts = await getUserMicroacts(userId);
    return NextResponse.json({
      microacts,
      count: microacts.length,
    });
  } catch (error: any) {
    console.error('GET /api/bardic/microacts error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve microacts' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST: Create Microact or Log Occurrence
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
    // Log Occurrence (most common action)
    // ========================================================================
    if (action === 'log' || !action) {
      const {
        actionPhrase,
        microactId,
        episodeId,
        virtueCategory,
        contextNote,
      } = params;

      // Log by phrase (auto-creates if needed)
      if (actionPhrase) {
        const log = await logMicroactByPhrase(userId, actionPhrase, {
          episodeId,
          virtueCategory,
          contextNote,
        });

        // Log usage
        await logUsage({
          userId,
          operation: 'microact_log',
          inputTokens: Math.ceil(actionPhrase.length / 4),
          outputTokens: 10,
          totalTokens: Math.ceil(actionPhrase.length / 4) + 10,
          metadata: {
            microactId: log.microactId,
            episodeId,
          },
        });

        // Get updated microact with streak
        const microact = await getMicroact(log.microactId);
        const streak = await getMicroactStreak(log.microactId);

        return NextResponse.json({
          log,
          microact,
          streak,
          message: streak > 1
            ? `Logged! ${streak} day streak 🔥`
            : 'Virtue noted',
        }, { status: 201 });
      }

      // Log by microact ID
      if (microactId) {
        const logParams: LogMicroactParams = {
          microactId,
          episodeId,
          contextNote,
        };

        const log = await logMicroactOccurrence(logParams);

        // Get streak
        const streak = await getMicroactStreak(microactId);

        return NextResponse.json({
          log,
          streak,
          message: streak > 1 ? `${streak} day streak! 🔥` : 'Logged',
        }, { status: 201 });
      }

      return NextResponse.json(
        { error: 'Must provide either actionPhrase or microactId' },
        { status: 400 }
      );
    }

    // ========================================================================
    // Create Microact Definition
    // ========================================================================
    if (action === 'create') {
      const { actionPhrase, virtueCategory } = params;

      if (!actionPhrase) {
        return NextResponse.json(
          { error: 'Missing required field: actionPhrase' },
          { status: 400 }
        );
      }

      const createParams: CreateMicroactParams = {
        userId,
        actionPhrase,
        virtueCategory,
      };

      const microact = await createMicroact(createParams);

      return NextResponse.json({
        microact,
        message: `Microact created: "${actionPhrase}"`,
      }, { status: 201 });
    }

    return NextResponse.json(
      { error: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('POST /api/bardic/microacts error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to log microact' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH: Update Microact
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
    const { microactId, ...updateFields } = body;

    if (!microactId) {
      return NextResponse.json(
        { error: 'Missing required field: microactId' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await getMicroact(microactId);
    if (!existing) {
      return NextResponse.json(
        { error: 'Microact not found' },
        { status: 404 }
      );
    }

    if (existing.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden - not your microact' },
        { status: 403 }
      );
    }

    // Update microact
    const updated = await updateMicroact(microactId, updateFields);

    return NextResponse.json({
      microact: updated,
      message: 'Microact updated',
    });
  } catch (error: any) {
    console.error('PATCH /api/bardic/microacts error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update microact' },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE: Delete Microact
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
    const microactId = searchParams.get('id');

    if (!microactId) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await getMicroact(microactId);
    if (!existing) {
      return NextResponse.json(
        { error: 'Microact not found' },
        { status: 404 }
      );
    }

    if (existing.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden - not your microact' },
        { status: 403 }
      );
    }

    // Delete microact
    await deleteMicroact(microactId);

    return NextResponse.json({
      success: true,
      message: 'Microact deleted',
    });
  } catch (error: any) {
    console.error('DELETE /api/bardic/microacts error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete microact' },
      { status: 500 }
    );
  }
}
