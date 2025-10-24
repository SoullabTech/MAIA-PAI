/**
 * Get User Subscription Status API
 *
 * Returns current subscription tier, status, trial info, and feature access
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserSubscription, getConversationLimitInfo, isTrialActive, getTrialDaysRemaining } from '@/lib/subscription/FeatureGating';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get full subscription data
    const subscription = await getUserSubscription(userId);

    // Get conversation limit info
    const conversationInfo = getConversationLimitInfo(subscription);

    // Get trial info if applicable
    const trialInfo = subscription.status === 'trialing' ? {
      active: isTrialActive(subscription),
      daysRemaining: getTrialDaysRemaining(subscription),
      endDate: subscription.trialEndDate
    } : null;

    return NextResponse.json({
      success: true,
      subscription: {
        tier: subscription.tier,
        status: subscription.status,
        isFounder: subscription.isFounder,
        founderDiscountPercent: subscription.founderDiscountPercent,
        currentPeriodEnd: subscription.currentPeriodEnd,
        stripeCustomerId: subscription.stripeCustomerId,
        trial: trialInfo,
        conversationLimit: conversationInfo
      }
    });

  } catch (error: any) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status', details: error.message },
      { status: 500 }
    );
  }
}
