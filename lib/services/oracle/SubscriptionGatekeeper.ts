/**
 * Subscription Gatekeeper Service
 *
 * Handles feature access control and conversation limits:
 * - Subscription tier checking
 * - Conversation limit enforcement
 * - Upgrade prompts and CTAs
 *
 * Earth Phase Service Extraction - Following Spiralogic Principles
 */

/**
 * Subscription information
 */
export interface SubscriptionInfo {
  tier: 'free' | 'explorer' | 'seeker' | 'mystic';
  status: 'free' | 'active' | 'expired' | 'cancelled';
  conversationsThisMonth: number;
  conversationLimit?: number;
}

/**
 * Access check result
 */
export interface AccessCheckResult {
  allowed: boolean;
  message?: string;
  upgradePrompt?: string;
  subscription: SubscriptionInfo;
}

/**
 * Service for managing subscription-based feature access
 */
export class SubscriptionGatekeeper {
  /**
   * Check if user can start a new conversation
   */
  async checkConversationAccess(userId: string): Promise<AccessCheckResult> {
    // Import feature gating dynamically to avoid circular dependencies
    const { getUserSubscription, canStartConversation } = await import('@/lib/subscription/FeatureGating');

    const subscription = await getUserSubscription(userId);
    const conversationCheck = canStartConversation(subscription);

    if (!conversationCheck.allowed) {
      console.warn(`⚠️ User ${userId} hit conversation limit:`, conversationCheck.reason);

      return {
        allowed: false,
        message: conversationCheck.message || 'Conversation limit reached',
        upgradePrompt: conversationCheck.upgradePrompt || 'Upgrade to Explorer for unlimited conversations',
        subscription
      };
    }

    return {
      allowed: true,
      subscription
    };
  }

  /**
   * Increment conversation count (for free tier users)
   */
  async incrementConversationCount(userId: string): Promise<void> {
    const { incrementConversationCount } = await import('@/lib/subscription/FeatureGating');
    await incrementConversationCount(userId);
    console.log(`📊 Conversation counted for user ${userId}`);
  }

  /**
   * Get appropriate upgrade CTA for subscription tier
   */
  async getUpgradeCTA(subscription: SubscriptionInfo): Promise<{ ctaText: string; action: string }> {
    const { getUpgradeCTA } = await import('@/lib/subscription/FeatureGating');
    return getUpgradeCTA(subscription);
  }

  /**
   * Generate limit-reached response with upgrade prompts
   */
  generateLimitResponse(accessCheck: AccessCheckResult): {
    response: string;
    element: string;
    metadata: any;
    suggestions: string[];
  } {
    const { subscription, message, upgradePrompt } = accessCheck;
    const upgradeCTA = { ctaText: upgradePrompt || 'Upgrade for unlimited access', action: 'upgrade' };

    return {
      response: message || 'Conversation limit reached',
      element: 'aether',
      metadata: {
        sessionId: `session_${Date.now()}`,
        limitReached: true,
        subscription: {
          tier: subscription.tier,
          status: subscription.status,
          conversationsThisMonth: subscription.conversationsThisMonth
        }
      },
      suggestions: [
        upgradePrompt || 'Upgrade to Explorer for unlimited conversations',
        upgradeCTA.ctaText
      ]
    };
  }
}

/**
 * Create service instance
 */
export function createSubscriptionGatekeeper(): SubscriptionGatekeeper {
  return new SubscriptionGatekeeper();
}
