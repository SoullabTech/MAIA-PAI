'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import Link from 'next/link';

/**
 * Pricing Page - Soullab Tiers
 *
 * Dune aesthetic, clear value, generous pricing
 * Shows Free, Explorer, Practitioner, Studio tiers
 * Founder pricing badges for limited-time offer
 */

const tiers = [
  {
    name: 'Free',
    tagline: 'Taste the Field',
    price: { monthly: 0, annual: 0 },
    founderPrice: null,
    description: 'Experience MAIA and Sacred Scribe',
    features: [
      '3 MAIA conversations per month',
      'Basic birth chart generation',
      'Genesis chapter from Sacred Scribe',
      'Access to community forums',
      'Single documentary aesthetic',
    ],
    cta: 'Start Free',
    href: '/week2-welcome',
    popular: false,
    color: '#8B7355',
  },
  {
    name: 'Explorer',
    tagline: 'Your Personal Oracle',
    price: { monthly: 29, annual: 290 },
    founderPrice: { monthly: 19, annual: 190 },
    description: 'Unlimited depth work with MAIA',
    features: [
      'Unlimited MAIA conversations (voice + text)',
      'Full birth chart with Tarnas synthesis',
      'Sacred Scribe (Genesis + 3 chapters)',
      'Mission tracking (up to 5 missions)',
      'Journey timeline (unlimited sessions)',
      'All 6 documentary aesthetic presets',
      'Monthly astrology forecast',
      'Priority voice processing',
    ],
    cta: 'Start Explorer',
    href: '/checkout?tier=explorer',
    popular: true,
    color: '#D4AF37',
  },
  {
    name: 'Practitioner',
    tagline: 'Build Your Practice',
    price: { monthly: 149, annual: 1490 },
    founderPrice: { monthly: 99, annual: 990 },
    description: 'White-label sacred technology',
    features: [
      'Everything in Explorer tier',
      'Your branded portal (yourname.soullab.life)',
      'Client management dashboard',
      'Up to 25 client portals',
      'Shared session notes with clients',
      'Collaborative mission tracking',
      'Intake flow customization',
      'Scheduling integration',
      'Progress reports and analytics',
      'Export client data (ethical portability)',
    ],
    cta: 'Start Practitioner',
    href: '/checkout?tier=practitioner',
    popular: false,
    color: '#B8935C',
  },
  {
    name: 'Studio',
    tagline: 'Sacred Infrastructure',
    price: { monthly: 499, annual: 4990 },
    founderPrice: null,
    description: 'Full platform for serious practices',
    features: [
      'Everything in Practitioner tier',
      'Unlimited client portals',
      'Team member seats (assistants, co-facilitators)',
      'Custom documentary aesthetic designed for you',
      'Group program support (cohorts up to 50)',
      'Payment processing integration',
      'Admin dashboard (revenue, analytics)',
      'API access for custom builds',
      'White-label mobile app',
      'Monthly strategy call with Soullab team',
      'Priority support (24hr response)',
    ],
    cta: 'Start Studio',
    href: '/checkout?tier=studio',
    popular: false,
    color: '#FFB84D',
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [showFounderPricing, setShowFounderPricing] = useState(true);

  return (
    <div className="min-h-screen text-stone-900 relative overflow-hidden" style={{
      background: 'linear-gradient(to bottom, #2C3640 0%, #3E4A54 15%, #5A4A3A 35%, #8B6F47 55%, #B8935C 70%, #D4AF37 85%, #FFB84D 100%)',
    }}>
      {/* Film grain texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' /%3E%3C/svg%3E")',
        backgroundRepeat: 'repeat',
      }} />

      {/* Stars in night sky */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(80)].map((_, i) => {
          const top = Math.random() * 30;
          return (
            <motion.div
              key={`star-${i}`}
              className="absolute rounded-full"
              style={{
                background: '#E8DCC4',
                width: Math.random() > 0.8 ? '2px' : '1px',
                height: Math.random() > 0.8 ? '2px' : '1px',
                left: `${Math.random() * 100}%`,
                top: `${top}%`,
                filter: 'blur(0.5px)',
                boxShadow: '0 0 2px rgba(232, 220, 196, 0.5)',
              }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
            />
          );
        })}
      </div>

      {/* Golden sand particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => {
          const top = 40 + Math.random() * 60;
          return (
            <motion.div
              key={`sand-${i}`}
              className="absolute rounded-full"
              style={{
                background: '#D4AF37',
                width: Math.random() > 0.7 ? '3px' : '2px',
                height: Math.random() > 0.7 ? '3px' : '2px',
                left: `${Math.random() * 100}%`,
                top: `${top}%`,
                filter: 'blur(1px)',
                opacity: 0.3,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 8 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-serif mb-4" style={{
            color: '#6B4423',
            textShadow: '0 2px 8px rgba(107, 68, 35, 0.3)',
            fontWeight: 500,
          }}>
            Choose Your Journey
          </h1>
          <p className="text-xl font-serif mb-6" style={{
            color: '#5A4A3A',
            textShadow: '0 1px 2px rgba(90, 74, 58, 0.2)',
          }}>
            Technology that honors the work
          </p>

          {/* Founder Pricing Badge */}
          {showFounderPricing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block mb-8"
            >
              <div className="backdrop-blur-md rounded-full px-6 py-3 border" style={{
                background: 'rgba(255, 248, 240, 0.9)',
                borderColor: '#D4AF37',
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
              }}>
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5" style={{ color: '#D4AF37' }} />
                  <span className="text-sm font-serif font-medium" style={{
                    color: '#6B4423',
                  }}>
                    Founder Pricing Available — Lock in 35% off forever
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className="px-6 py-2 rounded-lg font-serif transition-all"
              style={billingPeriod === 'monthly' ? {
                background: 'rgba(184, 147, 92, 0.3)',
                border: '1px solid rgba(139, 111, 71, 0.6)',
                color: '#6B4423',
              } : {
                background: 'rgba(255, 248, 240, 0.3)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#8B7355',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className="px-6 py-2 rounded-lg font-serif transition-all"
              style={billingPeriod === 'annual' ? {
                background: 'rgba(184, 147, 92, 0.3)',
                border: '1px solid rgba(139, 111, 71, 0.6)',
                color: '#6B4423',
              } : {
                background: 'rgba(255, 248, 240, 0.3)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#8B7355',
              }}
            >
              Annual <span className="ml-2" style={{ color: '#D4AF37' }}>(Save 20%)</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative backdrop-blur-md rounded-2xl p-8 border"
              style={{
                background: tier.popular
                  ? 'rgba(255, 248, 240, 0.95)'
                  : 'rgba(255, 248, 240, 0.85)',
                borderColor: tier.popular ? tier.color : 'rgba(201, 168, 106, 0.4)',
                boxShadow: tier.popular
                  ? `0 8px 32px rgba(107, 68, 35, 0.3), 0 0 0 2px ${tier.color}`
                  : '0 4px 20px rgba(107, 68, 35, 0.15)',
              }}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="backdrop-blur-md rounded-full px-4 py-1 flex items-center gap-1" style={{
                    background: 'rgba(212, 175, 55, 0.9)',
                    border: '1px solid rgba(212, 175, 55, 1)',
                  }}>
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-xs font-serif font-medium text-white">MOST POPULAR</span>
                  </div>
                </div>
              )}

              {/* Tier Name */}
              <div className="mb-6">
                <h3 className="text-2xl font-serif font-medium mb-1" style={{
                  color: tier.color,
                  textShadow: `0 0 8px ${tier.color}40`,
                }}>
                  {tier.name}
                </h3>
                <p className="text-sm font-serif italic" style={{ color: '#8B7355' }}>
                  {tier.tagline}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                {tier.price.monthly === 0 ? (
                  <div className="text-4xl font-serif font-bold" style={{ color: '#6B4423' }}>
                    Free
                  </div>
                ) : (
                  <>
                    {showFounderPricing && tier.founderPrice ? (
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-4xl font-serif font-bold" style={{ color: '#6B4423' }}>
                            ${billingPeriod === 'monthly' ? tier.founderPrice.monthly : tier.founderPrice.annual}
                          </span>
                          <span className="text-sm font-serif" style={{ color: '#8B7355' }}>
                            /{billingPeriod === 'monthly' ? 'month' : 'year'}
                          </span>
                        </div>
                        <div className="text-sm font-serif line-through" style={{ color: '#8B7355', opacity: 0.6 }}>
                          ${billingPeriod === 'monthly' ? tier.price.monthly : tier.price.annual}
                        </div>
                        <div className="text-xs font-serif mt-1" style={{ color: '#D4AF37' }}>
                          Founder pricing — locked forever
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-serif font-bold" style={{ color: '#6B4423' }}>
                          ${billingPeriod === 'monthly' ? tier.price.monthly : tier.price.annual}
                        </span>
                        <span className="text-sm font-serif" style={{ color: '#8B7355' }}>
                          /{billingPeriod === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                    )}
                  </>
                )}
                {billingPeriod === 'annual' && tier.price.monthly > 0 && (
                  <div className="text-xs font-serif mt-1" style={{ color: '#8B7355' }}>
                    Save ${(tier.price.monthly * 12) - tier.price.annual}/year
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm font-serif mb-6" style={{ color: '#5A4A3A' }}>
                {tier.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
                    <span className="text-sm font-serif" style={{ color: '#5A4A3A' }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href={tier.href}
                className="block w-full py-3 rounded-lg font-serif font-medium text-center transition-all"
                style={tier.popular ? {
                  background: `linear-gradient(135deg, ${tier.color} 0%, #8B6F47 100%)`,
                  color: '#FFF8F0',
                  boxShadow: `0 4px 12px ${tier.color}40`,
                } : {
                  background: 'rgba(184, 147, 92, 0.2)',
                  border: '1px solid rgba(139, 111, 71, 0.4)',
                  color: '#6B4423',
                }}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-lg font-serif italic mb-4" style={{
            color: '#5A4A3A',
            textShadow: '0 1px 2px rgba(90, 74, 58, 0.2)',
          }}>
            "Not software. Sacred partnership."
          </p>
          <p className="text-sm font-serif" style={{ color: '#8B7355' }}>
            All plans include ethical data handling, full export capability, and graceful exits.
            <br />
            Cancel anytime. No tricks. No extraction.
          </p>
        </motion.div>

        {/* BIRTHED BY SOULLAB Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.2 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-8" style={{
              background: 'linear-gradient(to right, transparent, #D4AF37, transparent)',
            }} />
            <p className="text-xs font-serif tracking-wider" style={{
              color: '#D4AF37',
              textShadow: '0 0 6px rgba(212, 175, 55, 0.2)',
              letterSpacing: '0.12em',
            }}>
              BIRTHED BY SOULLAB
            </p>
            <div className="h-px w-8" style={{
              background: 'linear-gradient(to right, transparent, #D4AF37, transparent)',
            }} />
          </div>
          <p className="text-xs font-serif italic" style={{
            color: '#8B7355',
            opacity: 0.7,
          }}>
            Technology that honors the work
          </p>
        </motion.div>
      </div>
    </div>
  );
}
