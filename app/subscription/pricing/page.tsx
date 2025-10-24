'use client';

/**
 * MAIA Subscription Pricing Page
 *
 * Beautiful tier comparison with Stripe checkout integration
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  price: {
    monthly: number;
    annual: number;
  };
  features: string[];
  limitations?: string[];
  cta: string;
  highlighted?: boolean;
  popular?: boolean;
}

const TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Begin Your Journey',
    price: {
      monthly: 0,
      annual: 0
    },
    features: [
      '3 conversations per month',
      'Basic transformation tracking',
      'Access to MAIA\'s core wisdom'
    ],
    limitations: [
      'Limited conversation history',
      'No birth chart integration',
      'No Sacred Scribe access'
    ],
    cta: 'Start Free'
  },
  {
    id: 'explorer',
    name: 'Explorer',
    tagline: 'Unlimited Transformation',
    price: {
      monthly: 29,
      annual: 290
    },
    features: [
      '✨ Unlimited conversations with MAIA',
      '🌟 Full birth chart integration',
      '📝 Sacred Scribe+ journal insights',
      '🔮 Akashic Field wisdom access',
      '🎯 Advanced transformation tracking',
      '💫 Priority AI response times'
    ],
    cta: 'Start 14-Day Free Trial',
    highlighted: true,
    popular: true
  },
  {
    id: 'practitioner',
    name: 'Practitioner',
    tagline: 'Share MAIA with Clients',
    price: {
      monthly: 149,
      annual: 1490
    },
    features: [
      '✅ Everything in Explorer, plus:',
      '🏷️ White-label client portals',
      '👥 Up to 25 client accounts',
      '🎨 Custom branding & aesthetics',
      '📊 Client progress tracking',
      '📅 Scheduling & session tools',
      '💼 Professional dashboard'
    ],
    cta: 'Upgrade to Practitioner'
  },
  {
    id: 'studio',
    name: 'Studio',
    tagline: 'Unlimited Everything',
    price: {
      monthly: 499,
      annual: 4990
    },
    features: [
      '✅ Everything in Practitioner, plus:',
      '♾️ Unlimited client portals',
      '👨‍👩‍👧‍👦 Unlimited team seats',
      '🏢 Multi-location support',
      '🔧 API access & integrations',
      '📞 Priority support & onboarding',
      '🎓 Training & certification'
    ],
    cta: 'Contact Sales'
  }
];

export default function PricingPage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (tierId: string) => {
    if (tierId === 'free') {
      router.push('/signup');
      return;
    }

    if (tierId === 'studio') {
      window.location.href = 'mailto:kelly@soullab.org?subject=Studio%20Tier%20Inquiry';
      return;
    }

    setLoading(tierId);

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: tierId,
          billingPeriod
        })
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Choose Your Path
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Begin your transformation journey with MAIA. All plans include our core wisdom and guidance.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-900 rounded-full p-1 mb-12">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'annual'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {TIERS.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              billingPeriod={billingPeriod}
              onSubscribe={() => handleSubscribe(tier.id)}
              loading={loading === tier.id}
            />
          ))}
        </div>

        {/* Trust Signals */}
        <div className="text-center py-12 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <TrustSignal
              icon="🔒"
              title="Secure & Private"
              description="Your data is encrypted and never shared"
            />
            <TrustSignal
              icon="↩️"
              title="Cancel Anytime"
              description="No contracts, no commitments"
            />
            <TrustSignal
              icon="✨"
              title="14-Day Free Trial"
              description="Full access, no credit card required"
            />
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="What happens when my trial ends?"
              answer="After 14 days, you'll automatically move to the free tier (3 conversations/month) unless you upgrade. You can upgrade anytime to continue unlimited access."
            />
            <FAQItem
              question="Can I change my plan later?"
              answer="Yes! You can upgrade or downgrade anytime. Upgrades take effect immediately, downgrades apply at the end of your billing period."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards via Stripe. Annual plans can also be paid via invoice for Studio tier."
            />
            <FAQItem
              question="Is there a refund policy?"
              answer="Yes, we offer a 30-day money-back guarantee for annual plans, and pro-rated refunds for monthly plans within 14 days."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

function PricingCard({
  tier,
  billingPeriod,
  onSubscribe,
  loading
}: {
  tier: PricingTier;
  billingPeriod: 'monthly' | 'annual';
  onSubscribe: () => void;
  loading: boolean;
}) {
  const price = billingPeriod === 'monthly' ? tier.price.monthly : tier.price.annual;
  const monthlyPrice = billingPeriod === 'annual' ? Math.floor(price / 12) : price;

  return (
    <div
      className={`relative rounded-2xl p-8 transition-all ${
        tier.highlighted
          ? 'bg-gradient-to-b from-purple-900/40 to-purple-950/20 border-2 border-purple-500 shadow-2xl shadow-purple-500/20 scale-105'
          : 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
      }`}
    >
      {/* Popular Badge */}
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      {/* Tier Name */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
        <p className="text-gray-400 text-sm">{tier.tagline}</p>
      </div>

      {/* Price */}
      <div className="text-center mb-6">
        {price === 0 ? (
          <div className="text-4xl font-bold text-white">Free</div>
        ) : (
          <>
            <div className="text-5xl font-bold text-white mb-1">
              ${monthlyPrice}
              <span className="text-lg text-gray-400">/mo</span>
            </div>
            {billingPeriod === 'annual' && (
              <div className="text-sm text-gray-500">
                ${price}/year (save ${tier.price.monthly * 12 - price})
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA Button */}
      <button
        onClick={onSubscribe}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold transition-all mb-6 ${
          tier.highlighted
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
            : 'bg-gray-800 hover:bg-gray-700 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? 'Loading...' : tier.cta}
      </button>

      {/* Features */}
      <div className="space-y-3">
        {tier.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-gray-300">{feature}</span>
          </div>
        ))}
      </div>

      {/* Limitations */}
      {tier.limitations && (
        <div className="mt-4 pt-4 border-t border-gray-800 space-y-2">
          {tier.limitations.map((limitation, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <span className="text-gray-600 mt-0.5">×</span>
              <span className="text-gray-500">{limitation}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TrustSignal({
  icon,
  title,
  description
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function FAQItem({
  question,
  answer
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-white font-medium">{question}</span>
        <span className="text-gray-400 text-xl">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <p className="mt-3 text-gray-400 text-sm leading-relaxed">{answer}</p>
      )}
    </div>
  );
}
