'use client';

/**
 * Subscription Success Page
 *
 * Shown after successful Stripe checkout
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    // Verify session and get details
    fetch(`/api/subscription/verify-session?session_id=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setSession(data.session);
        }
      })
      .catch(err => {
        setError('Failed to verify session');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying your subscription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-900 border border-red-900 rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/subscription/pricing"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Pricing
          </Link>
        </div>
      </div>
    );
  }

  const isTrialing = session?.subscription?.status === 'trialing';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-gray-900 border border-purple-500/50 rounded-2xl p-12 text-center shadow-2xl shadow-purple-500/20">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-4">
            {isTrialing ? 'Your Trial Has Started! 🎉' : 'Welcome to MAIA! ✨'}
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-8">
            {isTrialing ? (
              <>
                You have <strong className="text-purple-400">14 days of full access</strong> to explore
                everything MAIA has to offer.
              </>
            ) : (
              <>
                Your subscription is now active. Welcome to unlimited transformation.
              </>
            )}
          </p>

          {/* What's Next */}
          <div className="bg-gray-800/50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-white mb-4">What's Next?</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-xl">→</span>
                <div>
                  <div className="text-white font-medium">Start a conversation with MAIA</div>
                  <div className="text-gray-400 text-sm">Unlimited conversations now available</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-xl">→</span>
                <div>
                  <div className="text-white font-medium">Explore your full birth chart</div>
                  <div className="text-gray-400 text-sm">Deep astrological insights unlocked</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-xl">→</span>
                <div>
                  <div className="text-white font-medium">Access Sacred Scribe+</div>
                  <div className="text-gray-400 text-sm">AI-powered journal insights</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-xl">→</span>
                <div>
                  <div className="text-white font-medium">Connect to the Akashic Field</div>
                  <div className="text-gray-400 text-sm">Collective wisdom access</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trial Reminder */}
          {isTrialing && (
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-300">
                💡 Your trial ends on{' '}
                <strong className="text-white">
                  {new Date(session.subscription.trial_end * 1000).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </strong>
                . We'll send you a reminder 3 days before.
              </p>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/oracle"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Start a Conversation
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              Questions? Email us at{' '}
              <a
                href="mailto:kelly@soullab.org"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                kelly@soullab.org
              </a>
            </p>
          </div>
        </div>

        {/* Receipt Notice */}
        <div className="mt-6 text-center text-sm text-gray-500">
          A confirmation email has been sent to your email address.
        </div>
      </div>
    </div>
  );
}
