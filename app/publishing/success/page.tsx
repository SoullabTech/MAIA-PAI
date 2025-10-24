'use client';

/**
 * Purchase Success Page
 * Confirmation and next steps after Elemental Alchemy pre-order
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SOULLAB_COLORS, SOULLAB_GRADIENTS } from '@/lib/soullab-theme';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Fetch session details from Stripe
      fetch(`/api/publishing/checkout-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setEmail(data.customer_email || '');
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div
          className="text-xl"
          style={{ color: SOULLAB_COLORS.air }}
        >
          Confirming your order...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Celebration background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            circle at 50% 30%,
            ${SOULLAB_COLORS.fire}20 0%,
            ${SOULLAB_COLORS.air}15 30%,
            transparent 60%
          )`
        }}
      />

      <div className="max-w-4xl mx-auto px-6 py-20 relative">
        {/* Success Icon */}
        <div className="text-center mb-12">
          <div
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{
              background: SOULLAB_GRADIENTS.fireToAir
            }}
          >
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1
            className="text-5xl font-light mb-4"
            style={{ color: SOULLAB_COLORS.air }}
          >
            Welcome to the Journey
          </h1>
          <p className="text-xl text-gray-400">
            Your pre-order for Elemental Alchemy is confirmed!
          </p>
        </div>

        {/* Order Details */}
        <div
          className="p-8 rounded-2xl border mb-12"
          style={{
            borderColor: `${SOULLAB_COLORS.air}30`,
            background: `${SOULLAB_COLORS.air}05`
          }}
        >
          <h2 className="text-2xl font-light mb-6 text-white">What Happens Next</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${SOULLAB_COLORS.fire}20` }}
              >
                <span style={{ color: SOULLAB_COLORS.fire }}>1</span>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-white">Confirmation Email</h3>
                <p className="text-gray-400">
                  Check your inbox{email && ` at ${email}`} for your order confirmation and receipt.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${SOULLAB_COLORS.air}20` }}
              >
                <span style={{ color: SOULLAB_COLORS.air }}>2</span>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-white">Early Access Content</h3>
                <p className="text-gray-400">
                  Within 24 hours, you'll receive access to exclusive pre-release materials including
                  the first chapter and bonus meditation audio.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${SOULLAB_COLORS.earth}20` }}
              >
                <span style={{ color: SOULLAB_COLORS.earth }}>3</span>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-white">Community Access</h3>
                <p className="text-gray-400">
                  Join the Elemental Alchemy Circle - our private community for practitioners.
                  Invitation link coming to your email.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${SOULLAB_COLORS.water}20` }}
              >
                <span style={{ color: SOULLAB_COLORS.water }}>4</span>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-white">Book Delivery</h3>
                <p className="text-gray-400">
                  Pre-order customers receive their copies 2 weeks before the official Spring 2026 release.
                  We'll email you with tracking information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exclusive Benefits */}
        <div
          className="p-8 rounded-2xl border mb-12"
          style={{
            borderColor: `${SOULLAB_COLORS.fire}30`,
            background: `${SOULLAB_COLORS.fire}05`
          }}
        >
          <h2 className="text-2xl font-light mb-6 text-white">Your Pre-Order Benefits</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: '🎁',
                title: 'Founding Member Status',
                desc: 'Lifetime 30% discount on all future Soullab Publishing titles'
              },
              {
                icon: '✨',
                title: 'Signed Copy',
                desc: 'Limited edition signature from the author (hardcover orders)'
              },
              {
                icon: '🎧',
                title: 'Bonus Interview Series',
                desc: 'Exclusive conversations with consciousness leaders'
              },
              {
                icon: '📖',
                title: 'Early Chapter Access',
                desc: 'Read Chapter 1: "The Fire Element" today'
              }
            ].map((benefit, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-lg"
                style={{ background: `${SOULLAB_COLORS.brown}20` }}
              >
                <div className="text-3xl">{benefit.icon}</div>
                <div>
                  <h3 className="font-medium mb-1 text-white">{benefit.title}</h3>
                  <p className="text-sm text-gray-400">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Share */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-light mb-6 text-white">Share Your Journey</h2>
          <p className="text-gray-400 mb-6">
            Know someone who would love this book? Share it with your community:
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                const text = "I just pre-ordered Elemental Alchemy from Soullab Publishing! Join me on this transformative journey 🔥💨💧🌍";
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin + '/publishing')}`, '_blank');
              }}
              className="px-6 py-3 rounded-full border transition-all hover:scale-105"
              style={{
                borderColor: `${SOULLAB_COLORS.air}60`,
                background: `${SOULLAB_COLORS.air}10`
              }}
            >
              Share on Twitter
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin + '/publishing');
                alert('Link copied to clipboard!');
              }}
              className="px-6 py-3 rounded-full border transition-all hover:scale-105"
              style={{
                borderColor: `${SOULLAB_COLORS.water}60`,
                background: `${SOULLAB_COLORS.water}10`
              }}
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-center">
          <h2 className="text-2xl font-light mb-6 text-white">Continue Exploring</h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/publishing"
              className="px-8 py-4 rounded-full border transition-all hover:scale-105"
              style={{
                borderColor: `${SOULLAB_COLORS.air}60`,
                background: `${SOULLAB_COLORS.air}10`,
                color: SOULLAB_COLORS.air
              }}
            >
              Back to Soullab Publishing
            </a>
            <a
              href="/publishing/preview"
              className="px-8 py-4 rounded-full transition-all hover:scale-105"
              style={{
                background: SOULLAB_GRADIENTS.fireToAir,
                color: 'white'
              }}
            >
              Read Book Preview
            </a>
          </div>
        </div>

        {/* Support */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Questions about your order?{' '}
            <a
              href="mailto:publishing@soullab.life"
              className="underline"
              style={{ color: SOULLAB_COLORS.air }}
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
