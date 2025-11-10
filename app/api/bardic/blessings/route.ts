/**
 * Bardic Blessings API
 *
 * POST /api/bardic/blessings - Check for blessing moment
 * POST /api/bardic/blessings/dismiss - Record dismissal
 * POST /api/bardic/blessings/accept - Record acceptance
 * GET /api/bardic/blessings/analytics - Get blessing analytics
 *
 * @module app/api/bardic/blessings/route
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getUserIdFromAuth,
  withAuthAndQuota,
  safeLogUsage,
} from '@/lib/middleware/quota-middleware';
import {
  checkForBlessing,
  recordBlessingDismissal,
  clearBlessingDismissal,
  logBlessingInteraction,
  getUserBlessingAcceptanceRate,
  getMostAcceptedBlessingTypes,
} from '@/lib/bardic/blessing-service';

// ============================================================================
// CHECK FOR BLESSING
// ============================================================================

export async function POST(request: NextRequest) {
  // Auth check only (no quota enforcement for blessing detection)
  const userId = await getUserIdFromAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentMessage, action, offeringType, blessingType, confidence } =
      await request.json();

    // ========================================================================
    // ACTION: Check for blessing
    // ========================================================================
    if (!action || action === 'check') {
      const result = await checkForBlessing({
        userId,
        currentMessage,
      });

      // Log if blessing was shown
      if (result.hasBlessing && result.shouldShow && result.blessing) {
        logBlessingInteraction({
          userId,
          blessingType: result.blessing.type,
          offeringType: result.blessing.suggestedOffering,
          action: 'shown',
          timestamp: new Date(),
          confidence: result.blessing.confidence,
        });
      }

      return NextResponse.json({
        hasBlessing: result.hasBlessing,
        shouldShow: result.shouldShow,
        blessing: result.blessing,
      });
    }

    // ========================================================================
    // ACTION: Dismiss blessing
    // ========================================================================
    if (action === 'dismiss') {
      if (!offeringType) {
        return NextResponse.json(
          { error: 'offeringType required for dismissal' },
          { status: 400 }
        );
      }

      recordBlessingDismissal(userId, offeringType);

      // Log dismissal
      logBlessingInteraction({
        userId,
        blessingType: blessingType as any,
        offeringType: offeringType as any,
        action: 'dismissed',
        timestamp: new Date(),
        confidence: confidence ?? 0,
      });

      return NextResponse.json({
        success: true,
        message: 'Blessing dismissed',
      });
    }

    // ========================================================================
    // ACTION: Accept blessing
    // ========================================================================
    if (action === 'accept') {
      if (!offeringType) {
        return NextResponse.json(
          { error: 'offeringType required for acceptance' },
          { status: 400 }
        );
      }

      clearBlessingDismissal(userId, offeringType);

      // Log acceptance
      logBlessingInteraction({
        userId,
        blessingType: blessingType as any,
        offeringType: offeringType as any,
        action: 'accepted',
        timestamp: new Date(),
        confidence: confidence ?? 0,
      });

      return NextResponse.json({
        success: true,
        message: 'Blessing accepted',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: check, dismiss, or accept' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Blessing API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET ANALYTICS
// ============================================================================

export async function GET(request: NextRequest) {
  // Auth check only
  const userId = await getUserIdFromAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userAcceptanceRate = getUserBlessingAcceptanceRate(userId);
    const mostAcceptedTypes = getMostAcceptedBlessingTypes();

    return NextResponse.json({
      userAcceptanceRate,
      mostAcceptedTypes,
      message:
        userAcceptanceRate > 0.7
          ? 'Blessings are resonating with you'
          : userAcceptanceRate > 0.3
            ? 'Some blessings are landing well'
            : 'Still learning what offerings resonate',
    });
  } catch (error) {
    console.error('Blessing analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
