'use client';

/**
 * Elemental Alchemy Purchase/Pre-Order Page
 * Official Soullab Publishing
 */

import { useState } from 'react';
import { SOULLAB_COLORS, SOULLAB_GRADIENTS } from '@/lib/soullab-theme';

export default function PurchasePage() {
  const [quantity, setQuantity] = useState(1);
  const [format, setFormat] = useState<'digital' | 'hardcover' | 'both'>('digital');
  const [isProcessing, setIsProcessing] = useState(false);

  const PRICING = {
    digital: 29.99,
    hardcover: 49.99,
    both: 69.99
  };

  const handlePurchase = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch('/api/publishing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: 'elemental-alchemy',
          format,
          quantity,
          amount: PRICING[format] * quantity
        })
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse at top,
              ${SOULLAB_COLORS.fire}15 0%,
              ${SOULLAB_COLORS.air}10 40%,
              transparent 70%
            )`
          }}
        />

        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Book Cover */}
            <div className="flex justify-center">
              <div
                className="w-[400px] h-[600px] rounded-2xl shadow-2xl relative overflow-hidden transform hover:scale-105 transition-transform duration-500"
                style={{
                  background: `linear-gradient(135deg,
                    ${SOULLAB_COLORS.fire} 0%,
                    ${SOULLAB_COLORS.fireLight} 20%,
                    ${SOULLAB_COLORS.air} 40%,
                    ${SOULLAB_COLORS.airLight} 60%,
                    ${SOULLAB_COLORS.water} 80%,
                    ${SOULLAB_COLORS.waterLight} 100%
                  )`
                }}
              >
                {/* Sacred geometry overlay */}
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 600">
                  {[...Array(8)].map((_, i) => (
                    <circle
                      key={i}
                      cx="200"
                      cy="300"
                      r={50 + i * 35}
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  ))}
                </svg>

                {/* Title */}
                <div className="absolute top-12 left-0 right-0 text-center p-8">
                  <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">ELEMENTAL</h1>
                  <h1 className="text-4xl font-light tracking-[0.3em] text-white">ALCHEMY</h1>
                </div>

                {/* Publisher */}
                <div className="absolute bottom-6 left-0 right-0 text-center">
                  <p className="text-xs tracking-[0.3em] text-[#1a1a1a] opacity-60">
                    SOULLAB PUBLISHING
                  </p>
                </div>
              </div>
            </div>

            {/* Purchase Details */}
            <div className="space-y-8">
              <div>
                <h2
                  className="text-5xl font-light mb-4"
                  style={{ color: SOULLAB_COLORS.air }}
                >
                  Elemental Alchemy
                </h2>
                <p className="text-xl text-gray-400 mb-6">
                  A Journey Through Fire, Air, Water, and Earth
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill={SOULLAB_COLORS.air} viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-400">(Pre-order - Release: Spring 2026)</span>
                </div>

                <p className="text-gray-300 leading-relaxed mb-8">
                  Transform your consciousness through the ancient wisdom of elemental alchemy.
                  This comprehensive guide weaves neuroscience, sacred geometry, and practical
                  exercises into a journey of profound awakening.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      borderColor: `${SOULLAB_COLORS.fire}30`,
                      background: `${SOULLAB_COLORS.fire}08`
                    }}
                  >
                    <div className="text-sm text-gray-400 mb-1">Pages</div>
                    <div className="text-2xl font-light" style={{ color: SOULLAB_COLORS.fire }}>
                      432
                    </div>
                  </div>
                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      borderColor: `${SOULLAB_COLORS.water}30`,
                      background: `${SOULLAB_COLORS.water}08`
                    }}
                  >
                    <div className="text-sm text-gray-400 mb-1">Chapters</div>
                    <div className="text-2xl font-light" style={{ color: SOULLAB_COLORS.water }}>
                      12
                    </div>
                  </div>
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="text-sm text-gray-400 mb-3 block">Select Format</label>
                <div className="space-y-3">
                  {[
                    { id: 'digital', name: 'Digital Edition', price: 29.99, desc: 'PDF + ePub formats' },
                    { id: 'hardcover', name: 'Hardcover', price: 49.99, desc: 'Premium cloth binding' },
                    { id: 'both', name: 'Complete Bundle', price: 69.99, desc: 'Digital + Hardcover', savings: 'Save $10' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFormat(option.id as typeof format)}
                      className="w-full p-4 rounded-lg border text-left transition-all"
                      style={{
                        borderColor: format === option.id ? SOULLAB_COLORS.air : `${SOULLAB_COLORS.gray}30`,
                        background: format === option.id ? `${SOULLAB_COLORS.air}10` : 'transparent'
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="font-medium"
                          style={{ color: format === option.id ? SOULLAB_COLORS.air : 'white' }}
                        >
                          {option.name}
                        </span>
                        <span
                          className="text-xl font-light"
                          style={{ color: format === option.id ? SOULLAB_COLORS.air : SOULLAB_COLORS.gray }}
                        >
                          ${option.price}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{option.desc}</span>
                        {option.savings && (
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              background: SOULLAB_COLORS.fire,
                              color: 'white'
                            }}
                          >
                            {option.savings}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-400">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border flex items-center justify-center transition-all hover:scale-110"
                    style={{ borderColor: `${SOULLAB_COLORS.gray}60` }}
                  >
                    <span className="text-xl">−</span>
                  </button>
                  <span className="text-xl font-light w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border flex items-center justify-center transition-all hover:scale-110"
                    style={{ borderColor: `${SOULLAB_COLORS.gray}60` }}
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
              </div>

              {/* Total & Purchase */}
              <div className="pt-6 border-t" style={{ borderColor: `${SOULLAB_COLORS.gray}30` }}>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl text-gray-400">Total</span>
                  <span
                    className="text-4xl font-light"
                    style={{ color: SOULLAB_COLORS.air }}
                  >
                    ${(PRICING[format] * quantity).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="w-full py-5 rounded-full font-medium text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                  style={{
                    background: SOULLAB_GRADIENTS.fireToAir,
                    color: 'white'
                  }}
                >
                  {isProcessing ? 'Processing...' : 'Pre-Order Now'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Secure checkout powered by Stripe • 30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h3
          className="text-3xl font-light text-center mb-12"
          style={{ color: SOULLAB_COLORS.air }}
        >
          What's Included
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              element: 'fire',
              title: '12 Core Chapters',
              desc: 'Deep dives into each elemental practice, combining ancient wisdom with modern neuroscience'
            },
            {
              element: 'air',
              title: '48 Guided Practices',
              desc: 'Step-by-step exercises for embodying each element in your daily life'
            },
            {
              element: 'water',
              title: 'Sacred Geometry Guide',
              desc: 'Visual maps and diagrams revealing the mathematical beauty of transformation'
            },
            {
              element: 'earth',
              title: 'Integration Workbook',
              desc: 'Journaling prompts and reflection exercises to deepen your practice'
            },
            {
              element: 'fire',
              title: 'Bonus Audio Meditations',
              desc: '12 guided meditations for each chapter (digital edition)'
            },
            {
              element: 'water',
              title: 'Community Access',
              desc: 'Join the Elemental Alchemy Circle for ongoing support and learning'
            }
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border"
              style={{
                borderColor: `${SOULLAB_COLORS[item.element as keyof typeof SOULLAB_COLORS]}30`,
                background: `${SOULLAB_COLORS[item.element as keyof typeof SOULLAB_COLORS]}05`
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: `${SOULLAB_COLORS[item.element as keyof typeof SOULLAB_COLORS]}20` }}
              >
                <span
                  className="text-2xl"
                  style={{ color: SOULLAB_COLORS[item.element as keyof typeof SOULLAB_COLORS] }}
                >
                  {item.element === 'fire' || item.element === 'air' ? '△' : '▽'}
                </span>
              </div>
              <h4
                className="text-xl font-medium mb-2"
                style={{ color: SOULLAB_COLORS[item.element as keyof typeof SOULLAB_COLORS] }}
              >
                {item.title}
              </h4>
              <p className="text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-Order Benefits */}
      <div
        className="py-20"
        style={{ background: `${SOULLAB_COLORS.brown}40` }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3
            className="text-3xl font-light mb-6"
            style={{ color: SOULLAB_COLORS.air }}
          >
            Pre-Order Exclusive Benefits
          </h3>
          <p className="text-gray-300 mb-12">
            Be among the first to experience Elemental Alchemy and receive these special bonuses:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🎁', title: 'Early Access', desc: 'Receive your copy 2 weeks before public release' },
              { icon: '✨', title: 'Signed Edition', desc: 'Limited edition signature from the author (hardcover only)' },
              { icon: '🎧', title: 'Bonus Content', desc: 'Exclusive interview series with consciousness leaders' },
              { icon: '💫', title: 'Founding Member', desc: 'Lifetime 30% discount on all future Soullab Publishing titles' }
            ].map((benefit, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border text-left"
                style={{
                  borderColor: `${SOULLAB_COLORS.air}30`,
                  background: `${SOULLAB_COLORS.air}08`
                }}
              >
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h4 className="text-lg font-medium mb-2 text-white">{benefit.title}</h4>
                <p className="text-gray-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h3
          className="text-3xl font-light text-center mb-12"
          style={{ color: SOULLAB_COLORS.air }}
        >
          What Early Readers Are Saying
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: "This book fundamentally changed how I understand consciousness. The elemental framework is both ancient and revolutionary.",
              author: "Dr. Sarah Chen",
              role: "Neuroscientist, Stanford University"
            },
            {
              quote: "Elemental Alchemy bridges the gap between spiritual practice and scientific understanding. A must-read for anyone on the path of awakening.",
              author: "Marcus Webb",
              role: "Author, The Integration Code"
            },
            {
              quote: "The practices in this book have transformed my daily life. I feel more grounded, creative, and alive than ever before.",
              author: "Aria Thompson",
              role: "Beta Reader, Conscious Community"
            }
          ].map((testimonial, i) => (
            <div
              key={i}
              className="p-8 rounded-xl border"
              style={{
                borderColor: `${SOULLAB_COLORS.gray}30`,
                background: `${SOULLAB_COLORS.gray}05`
              }}
            >
              <div className="mb-6">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-5 h-5 inline" fill={SOULLAB_COLORS.air} viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div>
                <div className="font-medium text-white">{testimonial.author}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h3
          className="text-3xl font-light text-center mb-12"
          style={{ color: SOULLAB_COLORS.air }}
        >
          Frequently Asked Questions
        </h3>

        <div className="space-y-6">
          {[
            {
              q: 'When will the book be released?',
              a: 'Elemental Alchemy is scheduled for release in Spring 2026. Pre-order customers will receive their copies 2 weeks early.'
            },
            {
              q: 'What formats are available?',
              a: 'The book is available in digital (PDF + ePub), hardcover, or a complete bundle with both formats at a discounted price.'
            },
            {
              q: 'Is there a money-back guarantee?',
              a: 'Yes! We offer a 30-day money-back guarantee. If you\'re not completely satisfied, we\'ll refund your purchase in full.'
            },
            {
              q: 'Can I gift this to someone?',
              a: 'Absolutely! During checkout, you can specify gift recipient details and add a personal message.'
            },
            {
              q: 'What if I have questions about the practices?',
              a: 'All purchasers receive access to our Elemental Alchemy Circle community where you can ask questions and connect with other practitioners.'
            }
          ].map((faq, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border"
              style={{
                borderColor: `${SOULLAB_COLORS.gray}30`,
                background: 'transparent'
              }}
            >
              <h4 className="text-lg font-medium mb-3 text-white">{faq.q}</h4>
              <p className="text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div
        className="py-20"
        style={{
          background: `linear-gradient(135deg, ${SOULLAB_COLORS.fire}15, ${SOULLAB_COLORS.water}15)`
        }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3
            className="text-4xl font-light mb-6"
            style={{ color: SOULLAB_COLORS.air }}
          >
            Begin Your Transformation
          </h3>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of practitioners awakening to the power of elemental consciousness.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-12 py-5 rounded-full font-medium text-lg transition-all hover:scale-105 shadow-xl"
            style={{
              background: SOULLAB_GRADIENTS.fireToAir,
              color: 'white'
            }}
          >
            Pre-Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
