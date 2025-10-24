'use client';

/**
 * Upgrade Prompt Component
 *
 * Strategic CTAs shown at key moments to encourage upgrades
 */

import Link from 'next/link';
import { useState } from 'react';

type PromptVariant = 'limit-reached' | 'trial-ending' | 'feature-locked' | 'subtle-banner';

interface UpgradePromptProps {
  variant: PromptVariant;
  conversationsRemaining?: number;
  trialDaysLeft?: number;
  featureName?: string;
  onDismiss?: () => void;
}

export default function UpgradePrompt({
  variant,
  conversationsRemaining = 0,
  trialDaysLeft = 0,
  featureName = 'this feature',
  onDismiss
}: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  switch (variant) {
    case 'limit-reached':
      return <LimitReachedPrompt conversationsRemaining={conversationsRemaining} />;
    case 'trial-ending':
      return <TrialEndingPrompt daysLeft={trialDaysLeft} onDismiss={handleDismiss} />;
    case 'feature-locked':
      return <FeatureLockedPrompt featureName={featureName} />;
    case 'subtle-banner':
      return <SubtleBanner conversationsRemaining={conversationsRemaining} onDismiss={handleDismiss} />;
    default:
      return null;
  }
}

// ============================================================================
// VARIANT: Limit Reached (Modal/Blocking)
// ============================================================================

function LimitReachedPrompt({ conversationsRemaining }: { conversationsRemaining: number }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-8 shadow-2xl">
        {/* Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-3">
          {conversationsRemaining === 0 ? "You've Reached Your Limit" : "Almost Out of Conversations"}
        </h2>

        {/* Message */}
        <p className="text-gray-400 text-center mb-6">
          {conversationsRemaining === 0 ? (
            <>
              You've used all <strong>3 free conversations</strong> this month.
              Start a 14-day free trial for unlimited access!
            </>
          ) : (
            <>
              You have <strong>{conversationsRemaining} conversation{conversationsRemaining !== 1 ? 's' : ''}</strong> remaining this month.
              Upgrade for unlimited conversations.
            </>
          )}
        </p>

        {/* Benefits */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-300 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-purple-400">✓</span>
              <span>Unlimited conversations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">✓</span>
              <span>14 days free - no payment required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">✓</span>
              <span>All premium features unlocked</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Link
            href="/subscription/pricing"
            className="block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-center py-3 rounded-lg font-semibold transition-all shadow-lg"
          >
            Start Free Trial
          </Link>

          {conversationsRemaining > 0 && (
            <button
              onClick={() => window.history.back()}
              className="block w-full bg-gray-800 hover:bg-gray-700 text-white text-center py-3 rounded-lg font-semibold transition-all"
            >
              Maybe Later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VARIANT: Trial Ending (Banner)
// ============================================================================

function TrialEndingPrompt({ daysLeft, onDismiss }: { daysLeft: number; onDismiss: () => void }) {
  return (
    <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 border-l-4 border-orange-500 p-4 rounded-lg shadow-lg">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
            <span className="text-xl">⏰</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">
            Trial Ending {daysLeft === 0 ? 'Today' : `in ${daysLeft} Day${daysLeft !== 1 ? 's' : ''}`}
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            Your 14-day free trial is ending soon. Add payment to continue unlimited access to MAIA.
          </p>
          <div className="flex gap-3">
            <Link
              href="/subscription/pricing"
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
            >
              Continue with Explorer
            </Link>
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Remind me later
            </button>
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// VARIANT: Feature Locked (Inline)
// ============================================================================

function FeatureLockedPrompt({ featureName }: { featureName: string }) {
  return (
    <div className="bg-gray-900 border border-purple-500/50 rounded-xl p-8 text-center shadow-xl">
      {/* Lock Icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-2">
        Unlock {featureName}
      </h3>

      {/* Description */}
      <p className="text-gray-400 mb-6">
        This feature is available on the Explorer plan and above.
        Start your free 14-day trial to get full access.
      </p>

      {/* CTA */}
      <Link
        href="/subscription/pricing"
        className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
      >
        Start Free Trial
      </Link>

      {/* Fine Print */}
      <p className="text-gray-500 text-xs mt-4">
        No credit card required • Cancel anytime
      </p>
    </div>
  );
}

// ============================================================================
// VARIANT: Subtle Banner (Top of page)
// ============================================================================

function SubtleBanner({ conversationsRemaining, onDismiss }: { conversationsRemaining: number; onDismiss: () => void }) {
  return (
    <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-b border-purple-500/30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-purple-400">✨</span>
          <p className="text-sm text-gray-300">
            <strong className="text-white">{conversationsRemaining} conversation{conversationsRemaining !== 1 ? 's' : ''}</strong> remaining this month.
            Upgrade for unlimited access.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/subscription/pricing"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
          >
            Start Free Trial
          </Link>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
