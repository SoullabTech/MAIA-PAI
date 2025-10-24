'use client';

/**
 * Subscription Status Widget
 *
 * Displays user's current plan, usage, and upgrade prompts
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SubscriptionData {
  tier: string;
  status: string;
  conversationsThisMonth: number;
  conversationsLimit: number;
  isTrialing: boolean;
  trialDaysRemaining?: number;
  trialEndDate?: string;
}

interface SubscriptionStatusProps {
  userId: string;
  variant?: 'compact' | 'full';
}

export default function SubscriptionStatus({
  userId,
  variant = 'full'
}: SubscriptionStatusProps) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [userId]);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch(`/api/subscription/status?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setSubscription(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-800 rounded w-3/4"></div>
      </div>
    );
  }

  if (!subscription) {
    return null;
  }

  if (variant === 'compact') {
    return <CompactView subscription={subscription} />;
  }

  return <FullView subscription={subscription} />;
}

// ============================================================================
// COMPACT VIEW (for navbar/sidebar)
// ============================================================================

function CompactView({ subscription }: { subscription: SubscriptionData }) {
  const { tier, status, conversationsThisMonth, conversationsLimit, isTrialing, trialDaysRemaining } = subscription;

  const getTierColor = () => {
    switch (tier) {
      case 'free': return 'text-gray-400';
      case 'explorer': return 'text-blue-400';
      case 'practitioner': return 'text-purple-400';
      case 'studio': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getTierBadge = () => {
    if (isTrialing) {
      return (
        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">
          Trial • {trialDaysRemaining} days left
        </span>
      );
    }

    return (
      <span className={`${getTierColor()} text-xs font-medium uppercase`}>
        {tier}
      </span>
    );
  };

  const showUsage = tier === 'free' && status === 'free';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">Plan</span>
        {getTierBadge()}
      </div>

      {showUsage && (
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Conversations</span>
            <span>{conversationsThisMonth}/{conversationsLimit}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div
              className="bg-purple-500 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min(100, (conversationsThisMonth / conversationsLimit) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {tier === 'free' && !isTrialing && (
        <Link
          href="/subscription/pricing"
          className="block text-center bg-purple-600 hover:bg-purple-700 text-white text-xs py-1.5 rounded transition-colors"
        >
          Upgrade
        </Link>
      )}
    </div>
  );
}

// ============================================================================
// FULL VIEW (for dashboard/settings)
// ============================================================================

function FullView({ subscription }: { subscription: SubscriptionData }) {
  const {
    tier,
    status,
    conversationsThisMonth,
    conversationsLimit,
    isTrialing,
    trialDaysRemaining,
    trialEndDate
  } = subscription;

  const getTierDisplay = () => {
    const displays: Record<string, { name: string; color: string; gradient: string }> = {
      free: {
        name: 'Free',
        color: 'text-gray-400',
        gradient: 'from-gray-600 to-gray-700'
      },
      explorer: {
        name: 'Explorer',
        color: 'text-blue-400',
        gradient: 'from-blue-600 to-purple-600'
      },
      practitioner: {
        name: 'Practitioner',
        color: 'text-purple-400',
        gradient: 'from-purple-600 to-pink-600'
      },
      studio: {
        name: 'Studio',
        color: 'text-yellow-400',
        gradient: 'from-yellow-500 to-orange-500'
      }
    };

    return displays[tier] || displays.free;
  };

  const tierDisplay = getTierDisplay();
  const showUsage = tier === 'free' && status === 'free';
  const isUnlimited = tier !== 'free' || isTrialing;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${tierDisplay.gradient} p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {tierDisplay.name}
            </h3>
            {isTrialing ? (
              <p className="text-white/80 text-sm">
                Trial ends in {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''}
              </p>
            ) : (
              <p className="text-white/80 text-sm capitalize">{status}</p>
            )}
          </div>

          {tier !== 'studio' && (
            <Link
              href="/subscription/pricing"
              className="bg-white/20 hover:bg-white/30 backdrop-blur text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              {tier === 'free' ? 'Upgrade' : 'Change Plan'}
            </Link>
          )}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="p-6">
        {/* Trial Warning */}
        {isTrialing && trialDaysRemaining !== undefined && trialDaysRemaining <= 3 && (
          <div className="bg-orange-900/20 border border-orange-900 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏰</span>
              <div>
                <div className="text-orange-400 font-semibold mb-1">
                  Trial ending soon!
                </div>
                <p className="text-gray-300 text-sm">
                  Your trial ends on{' '}
                  {trialEndDate && new Date(trialEndDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric'
                  })}
                  . Add payment to continue unlimited access.
                </p>
                <Link
                  href="/subscription/pricing"
                  className="inline-block mt-3 bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
                >
                  Continue with Explorer
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Conversations Usage */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Conversations This Month</span>
            <span className="text-white font-semibold">
              {isUnlimited ? (
                <>
                  {conversationsThisMonth} <span className="text-gray-500">/ Unlimited</span>
                </>
              ) : (
                `${conversationsThisMonth} / ${conversationsLimit}`
              )}
            </span>
          </div>

          {showUsage && (
            <>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    conversationsThisMonth >= conversationsLimit
                      ? 'bg-red-500'
                      : conversationsThisMonth >= conversationsLimit * 0.8
                      ? 'bg-orange-500'
                      : 'bg-purple-500'
                  }`}
                  style={{ width: `${Math.min(100, (conversationsThisMonth / conversationsLimit) * 100)}%` }}
                />
              </div>

              {conversationsThisMonth >= conversationsLimit && (
                <div className="bg-red-900/20 border border-red-900 rounded-lg p-3 mt-3">
                  <p className="text-red-400 text-sm">
                    You've reached your monthly limit. Upgrade to continue unlimited conversations.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Features */}
        <div className="border-t border-gray-800 pt-4">
          <div className="text-sm text-gray-400 mb-3">Your Features</div>
          <div className="space-y-2">
            {getFeatures(tier, isTrialing).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Manage Subscription */}
        {tier !== 'free' && !isTrialing && (
          <div className="border-t border-gray-800 pt-4 mt-4">
            <Link
              href="/subscription/portal"
              className="block text-center bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Manage Billing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function getFeatures(tier: string, isTrialing: boolean): string[] {
  if (isTrialing) {
    return [
      'Unlimited conversations',
      'Full birth chart integration',
      'Sacred Scribe+ insights',
      'Akashic Field access',
      'All Explorer features'
    ];
  }

  const features: Record<string, string[]> = {
    free: [
      '3 conversations per month',
      'Basic transformation tracking',
      'Core MAIA wisdom'
    ],
    explorer: [
      'Unlimited conversations',
      'Full birth chart integration',
      'Sacred Scribe+ insights',
      'Akashic Field access',
      'Transformation tracking'
    ],
    practitioner: [
      'Everything in Explorer',
      'White-label client portals',
      'Up to 25 client accounts',
      'Custom branding',
      'Professional dashboard'
    ],
    studio: [
      'Everything in Practitioner',
      'Unlimited client portals',
      'Unlimited team seats',
      'API access',
      'Priority support'
    ]
  };

  return features[tier] || features.free;
}
