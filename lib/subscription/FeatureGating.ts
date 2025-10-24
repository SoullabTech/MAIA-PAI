/**
 * FEATURE GATING SYSTEM
 *
 * Controls access to features based on subscription tier and trial status
 *
 * Subscription Tiers:
 * - Free: 3 conversations/month, basic features
 * - Explorer: Unlimited conversations, full features ($29/mo)
 * - Practitioner: Explorer + white-label, client portals ($149/mo)
 * - Studio: Practitioner + unlimited everything ($499/mo)
 *
 * Trial: 14-day full Explorer access (no payment required)
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// TYPES
// ============================================================================

export type SubscriptionTier = 'free' | 'explorer' | 'practitioner' | 'studio';

export type SubscriptionStatus =
  | 'free'           // Free tier (3 conversations/month)
  | 'trialing'       // 14-day trial (full Explorer access)
  | 'active'         // Paid subscription active
  | 'past_due'       // Payment failed, grace period
  | 'canceled'       // Subscription ended
  | 'trial_ended';   // Trial expired, not converted

export interface UserSubscription {
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  isFounder: boolean;
  founderDiscountPercent?: number;

  // Trial info
  trialStartDate?: Date;
  trialEndDate?: Date;
  trialConverted?: boolean;

  // Subscription timing
  subscriptionStartDate?: Date;
  currentPeriodEnd?: Date;

  // Stripe references
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;

  // Usage tracking
  conversationsThisMonth?: number;
}

// ============================================================================
// FEATURE LIMITS BY TIER
// ============================================================================

export const TIER_LIMITS = {
  free: {
    conversationsPerMonth: 3,
    birthChartAccess: 'basic' as const,
    sacredScribeAccess: false,
    akashicFieldAccess: false,
    missionsPerMonth: 0,
    clientPortals: 0,
    whiteLabel: false,
    customAesthetic: false,
    teamSeats: 0,
    transformationArchitecture: true  // Everyone gets transformation intelligence
  },
  explorer: {
    conversationsPerMonth: Infinity,
    birthChartAccess: 'full' as const,
    sacredScribeAccess: true,
    akashicFieldAccess: true,
    missionsPerMonth: 5,
    clientPortals: 0,
    whiteLabel: false,
    customAesthetic: false,
    teamSeats: 1,
    transformationArchitecture: true
  },
  practitioner: {
    conversationsPerMonth: Infinity,
    birthChartAccess: 'full' as const,
    sacredScribeAccess: true,
    akashicFieldAccess: true,
    missionsPerMonth: Infinity,
    clientPortals: 25,
    whiteLabel: true,
    customAesthetic: true,
    teamSeats: 3,
    transformationArchitecture: true
  },
  studio: {
    conversationsPerMonth: Infinity,
    birthChartAccess: 'full' as const,
    sacredScribeAccess: true,
    akashicFieldAccess: true,
    missionsPerMonth: Infinity,
    clientPortals: Infinity,
    whiteLabel: true,
    customAesthetic: true,
    teamSeats: Infinity,
    transformationArchitecture: true
  }
};

// ============================================================================
// TRIAL HELPERS
// ============================================================================

/**
 * Check if trial is currently active
 */
export function isTrialActive(subscription: UserSubscription): boolean {
  if (subscription.status !== 'trialing') return false;
  if (!subscription.trialEndDate) return false;

  return new Date() < subscription.trialEndDate;
}

/**
 * Get days remaining in trial
 */
export function getTrialDaysRemaining(subscription: UserSubscription): number {
  if (!subscription.trialEndDate) return 0;

  const now = new Date();
  const end = subscription.trialEndDate;
  const diffMs = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

/**
 * Check if user should see trial reminder
 */
export function shouldShowTrialReminder(subscription: UserSubscription): {
  show: boolean;
  daysLeft: number;
  message: string;
} {
  if (!isTrialActive(subscription)) {
    return { show: false, daysLeft: 0, message: '' };
  }

  const daysLeft = getTrialDaysRemaining(subscription);

  // Show reminder in last 7 days
  if (daysLeft <= 7) {
    return {
      show: true,
      daysLeft,
      message: daysLeft === 1
        ? 'Your trial ends tomorrow. Add payment to continue unlimited access.'
        : `Your trial ends in ${daysLeft} days. Add payment to continue unlimited access.`
    };
  }

  return { show: false, daysLeft, message: '' };
}

// ============================================================================
// FEATURE ACCESS CHECKS
// ============================================================================

/**
 * Get effective tier (respects trial status)
 */
export function getEffectiveTier(subscription: UserSubscription): SubscriptionTier {
  // Active trials get Explorer access
  if (subscription.status === 'trialing' && isTrialActive(subscription)) {
    return 'explorer';
  }

  // Active paid subscriptions use their tier
  if (subscription.status === 'active') {
    return subscription.tier;
  }

  // Everything else falls back to free
  return 'free';
}

/**
 * Check if user has access to a specific feature
 */
export function hasFeatureAccess(
  subscription: UserSubscription,
  feature: keyof typeof TIER_LIMITS.free
): boolean {
  const effectiveTier = getEffectiveTier(subscription);
  const tierLimits = TIER_LIMITS[effectiveTier];

  const limit = tierLimits[feature];

  if (typeof limit === 'boolean') return limit;
  if (typeof limit === 'number') return limit > 0;
  if (typeof limit === 'string') return limit !== 'none';

  return false;
}

/**
 * Check if user can start a new conversation
 */
export function canStartConversation(subscription: UserSubscription): {
  allowed: boolean;
  reason?: string;
  message?: string;
  upgradePrompt?: string;
} {
  // Check if trial is active
  if (subscription.status === 'trialing') {
    if (isTrialActive(subscription)) {
      const daysLeft = getTrialDaysRemaining(subscription);
      return {
        allowed: true,
        message: daysLeft <= 3
          ? `Trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`
          : undefined
      };
    } else {
      // Trial expired
      return {
        allowed: false,
        reason: 'trial_ended',
        message: 'Your 14-day trial has ended.',
        upgradePrompt: 'Add payment to continue with unlimited access, or use 3 free conversations per month.'
      };
    }
  }

  // Check if subscription is active (paid)
  if (subscription.status === 'active') {
    return { allowed: true };
  }

  // Free tier - check conversation limits
  const limit = TIER_LIMITS.free.conversationsPerMonth;
  const used = subscription.conversationsThisMonth || 0;

  if (used >= limit) {
    return {
      allowed: false,
      reason: 'free_limit_reached',
      message: `You've used all ${limit} free conversations this month.`,
      upgradePrompt: 'Start a 14-day free trial for unlimited conversations, or return next month.'
    };
  }

  // Free tier, within limits
  const remaining = limit - used;
  return {
    allowed: true,
    message: remaining <= 1 ? `${remaining} conversation remaining this month` : undefined
  };
}

/**
 * Get conversation limit info for display
 */
export function getConversationLimitInfo(subscription: UserSubscription): {
  hasLimit: boolean;
  used: number;
  limit: number;
  remaining: number;
  displayText: string;
} {
  const effectiveTier = getEffectiveTier(subscription);

  if (effectiveTier !== 'free') {
    return {
      hasLimit: false,
      used: 0,
      limit: Infinity,
      remaining: Infinity,
      displayText: 'Unlimited conversations'
    };
  }

  const limit = TIER_LIMITS.free.conversationsPerMonth;
  const used = subscription.conversationsThisMonth || 0;
  const remaining = Math.max(0, limit - used);

  return {
    hasLimit: true,
    used,
    limit,
    remaining,
    displayText: `${remaining} of ${limit} conversations remaining this month`
  };
}

// ============================================================================
// UPGRADE PROMPTS
// ============================================================================

/**
 * Get appropriate upgrade CTA based on current status
 */
export function getUpgradeCTA(subscription: UserSubscription): {
  show: boolean;
  tier: SubscriptionTier;
  ctaText: string;
  message: string;
  benefits: string[];
} {
  const effectiveTier = getEffectiveTier(subscription);

  // If on trial, prompt to convert
  if (subscription.status === 'trialing' && isTrialActive(subscription)) {
    const daysLeft = getTrialDaysRemaining(subscription);
    if (daysLeft <= 7) {
      return {
        show: true,
        tier: 'explorer',
        ctaText: 'Continue with Explorer',
        message: `Your trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Keep the transformation going.`,
        benefits: [
          'Unlimited conversations with MAIA',
          'Full birth chart integration',
          'Sacred Scribe+ journal insights',
          'Akashic Field wisdom access'
        ]
      };
    }
  }

  // If trial ended, strong prompt to upgrade
  if (subscription.status === 'trial_ended' ||
      (subscription.status === 'trialing' && !isTrialActive(subscription))) {
    return {
      show: true,
      tier: 'explorer',
      ctaText: 'Upgrade to Explorer',
      message: 'Your trial has ended. Continue your transformation journey.',
      benefits: [
        'Unlimited conversations',
        'Full transformation tracking',
        'Sacred Scribe insights',
        'All premium features'
      ]
    };
  }

  // If free tier approaching limit
  if (effectiveTier === 'free') {
    const limit = TIER_LIMITS.free.conversationsPerMonth;
    const used = subscription.conversationsThisMonth || 0;

    if (used >= limit - 1) {
      return {
        show: true,
        tier: 'explorer',
        ctaText: 'Start Free Trial',
        message: 'Experiencing MAIA\'s depth? Try 14 days of unlimited access.',
        benefits: [
          '14 days free - no payment required',
          'Unlimited conversations',
          'Full feature access',
          'Cancel anytime'
        ]
      };
    }
  }

  // Upsell from explorer to practitioner (if they show interest in client work)
  if (effectiveTier === 'explorer') {
    return {
      show: false,  // Don't show unless contextually appropriate
      tier: 'practitioner',
      ctaText: 'Upgrade to Practitioner',
      message: 'Share MAIA with your clients',
      benefits: [
        'White-label portal',
        'Up to 25 client portals',
        'Scheduling tools',
        'Custom branding'
      ]
    };
  }

  return {
    show: false,
    tier: effectiveTier,
    ctaText: '',
    message: '',
    benefits: []
  };
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

/**
 * Fetch user subscription from database
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const { data, error } = await supabase
    .from('explorers')
    .select(`
      subscription_status,
      subscription_tier,
      is_founder,
      founder_discount_percent,
      trial_start_date,
      trial_end_date,
      trial_converted,
      subscription_start_date,
      subscription_current_period_end,
      stripe_customer_id,
      stripe_subscription_id,
      conversation_count_this_month
    `)
    .eq('explorer_id', userId)
    .single();

  if (error || !data) {
    console.warn(`No subscription data found for user ${userId}, defaulting to free tier`);
    return {
      userId,
      tier: 'free',
      status: 'free',
      isFounder: false
    };
  }

  return {
    userId,
    tier: (data.subscription_tier as SubscriptionTier) || 'free',
    status: (data.subscription_status as SubscriptionStatus) || 'free',
    isFounder: data.is_founder || false,
    founderDiscountPercent: data.founder_discount_percent,
    trialStartDate: data.trial_start_date ? new Date(data.trial_start_date) : undefined,
    trialEndDate: data.trial_end_date ? new Date(data.trial_end_date) : undefined,
    trialConverted: data.trial_converted,
    subscriptionStartDate: data.subscription_start_date ? new Date(data.subscription_start_date) : undefined,
    currentPeriodEnd: data.subscription_current_period_end ? new Date(data.subscription_current_period_end) : undefined,
    stripeCustomerId: data.stripe_customer_id,
    stripeSubscriptionId: data.stripe_subscription_id,
    conversationsThisMonth: data.conversation_count_this_month || 0
  };
}

/**
 * Increment conversation count (for free tier tracking)
 * Uses database function for atomic operations with auto-reset
 */
export async function incrementConversationCount(userId: string): Promise<void> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  // Call database function for atomic increment with monthly reset logic
  const { error } = await supabase.rpc('increment_monthly_conversations', {
    user_id: userId
  });

  if (error) {
    console.error('Failed to increment conversation count:', error);
  } else {
    console.log(`✅ Conversation count incremented for ${userId}`);
  }
}

/**
 * Start trial for user
 */
export async function startTrial(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const trialStartDate = new Date();
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 14); // 14 days

  const { error } = await supabase
    .from('explorers')
    .update({
      subscription_status: 'trialing',
      subscription_tier: 'explorer', // Full Explorer access during trial
      trial_start_date: trialStartDate.toISOString(),
      trial_end_date: trialEndDate.toISOString(),
      trial_converted: false
    })
    .eq('explorer_id', userId);

  if (error) {
    console.error('Failed to start trial:', error);
    return { success: false, error: error.message };
  }

  console.log(`✅ Started 14-day trial for user ${userId}`);
  return { success: true };
}

/**
 * End trial (when user converts or trial expires)
 */
export async function endTrial(
  userId: string,
  converted: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const newStatus = converted ? 'active' : 'trial_ended';
  const newTier = converted ? 'explorer' : 'free';

  const { error } = await supabase
    .from('explorers')
    .update({
      subscription_status: newStatus,
      subscription_tier: newTier,
      trial_converted: converted
    })
    .eq('explorer_id', userId);

  if (error) {
    console.error('Failed to end trial:', error);
    return { success: false, error: error.message };
  }

  console.log(`✅ Ended trial for user ${userId} - converted: ${converted}`);
  return { success: true };
}
