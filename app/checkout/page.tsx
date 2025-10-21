'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MiniHoloflower } from '@/components/holoflower/MiniHoloflower';

/**
 * Checkout Page - Redirects to Stripe Checkout
 *
 * Receives tier from query params, creates checkout session,
 * redirects user to Stripe hosted checkout page.
 */
export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tier = searchParams?.get('tier');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tier) {
      setError('No tier selected');
      setIsLoading(false);
      return;
    }

    // Get user email from localStorage (or Supabase session)
    const userEmail = localStorage.getItem('explorerEmail') || localStorage.getItem('userEmail');
    const userId = localStorage.getItem('explorerId');

    if (!userEmail) {
      setError('Please sign in first');
      setIsLoading(false);
      setTimeout(() => router.push('/checkin'), 2000);
      return;
    }

    // Default to monthly billing (can add toggle later)
    const billingPeriod = 'monthly';

    // Create checkout session
    createCheckoutSession(tier, billingPeriod, userId || '', userEmail);
  }, [tier, router]);

  const createCheckoutSession = async (
    tier: string,
    billingPeriod: string,
    userId: string,
    userEmail: string
  ) => {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, billingPeriod, userId, userEmail }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setIsLoading(false);
        return;
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Failed to create checkout session');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #2C3640 0%, #3E4A54 15%, #5A4A3A 35%, #8B6F47 55%, #B8935C 70%, #D4AF37 85%, #FFB84D 100%)',
      }}
    >
      {/* Film grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' /%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Stars in night sky */}
      {[...Array(80)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 2 + 0.5 + 'px',
            height: Math.random() * 2 + 0.5 + 'px',
            top: Math.random() * 30 + '%',
            left: Math.random() * 100 + '%',
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {isLoading && !error && (
          <>
            <motion.div
              className="mb-8"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <MiniHoloflower size={120} />
            </motion.div>
            <h1
              className="text-2xl md:text-3xl font-serif tracking-wider mb-4"
              style={{
                color: '#2C1810',
                textShadow: '0 1px 2px rgba(212, 175, 55, 0.2)',
              }}
            >
              Opening portal to checkout...
            </h1>
            <p
              className="text-sm md:text-base font-serif"
              style={{
                color: '#5A4A3A',
              }}
            >
              Redirecting you to secure payment
            </p>
          </>
        )}

        {error && (
          <>
            <div className="mb-8">
              <MiniHoloflower size={100} />
            </div>
            <h1
              className="text-2xl md:text-3xl font-serif tracking-wider mb-4"
              style={{
                color: '#8B0000',
                textShadow: '0 1px 2px rgba(139, 0, 0, 0.2)',
              }}
            >
              {error}
            </h1>
            <button
              onClick={() => router.push('/pricing')}
              className="mt-6 px-8 py-3 rounded-lg font-serif tracking-wide transition-all"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFB84D 100%)',
                color: '#2C1810',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
              }}
            >
              Return to Pricing
            </button>
          </>
        )}
      </div>
    </div>
  );
}
