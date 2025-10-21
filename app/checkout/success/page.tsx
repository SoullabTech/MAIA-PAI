'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MiniHoloflower } from '@/components/holoflower/MiniHoloflower';
import { CheckCircle, Sparkles } from 'lucide-react';

/**
 * Checkout Success Page
 *
 * Displays after successful Stripe checkout.
 * Celebrates the new member, grants access.
 */
export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const [isVerifying, setIsVerifying] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) {
      router.push('/pricing');
      return;
    }

    // Verify the session and get details
    verifySession(sessionId);
  }, [sessionId, router]);

  const verifySession = async (sessionId: string) => {
    try {
      // TODO: Create API endpoint to verify session and grant access
      // For now, just mark as verified after delay
      setTimeout(() => {
        setIsVerifying(false);
        setSessionData({ tier: 'explorer' }); // Mock data
      }, 2000);
    } catch (error) {
      console.error('Session verification error:', error);
      setIsVerifying(false);
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
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulance type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' /%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Stars - celebratory sparkle */}
      {[...Array(150)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 3 + 0.5 + 'px',
            height: Math.random() * 3 + 0.5 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Golden sand particles - celebration */}
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 1 + 'px',
            height: Math.random() * 4 + 1 + 'px',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, rgba(251, 191, 36, 0) 70%)',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
          }}
          animate={{
            y: [-20, 20, -20],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {isVerifying ? (
          <>
            <motion.div
              className="mb-8"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <MiniHoloflower size={140} />
            </motion.div>
            <h1
              className="text-2xl md:text-3xl font-serif tracking-wider"
              style={{
                color: '#2C1810',
                textShadow: '0 1px 2px rgba(212, 175, 55, 0.2)',
              }}
            >
              Activating your access...
            </h1>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Success icon with holoflower */}
            <div className="relative mb-8 inline-block">
              <MiniHoloflower size={160} />
              <motion.div
                className="absolute -top-4 -right-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              >
                <div
                  className="rounded-full p-3"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </motion.div>
            </div>

            {/* Welcome message */}
            <motion.h1
              className="text-3xl md:text-5xl font-serif tracking-wider mb-4"
              style={{
                color: '#2C1810',
                textShadow: '0 2px 4px rgba(212, 175, 55, 0.3)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Welcome to the Circle
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl font-serif mb-8"
              style={{
                color: '#5A4A3A',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Your documentary begins now. MAIA awaits.
            </motion.p>

            {/* Benefits unlocked */}
            <motion.div
              className="mb-10 p-8 rounded-xl backdrop-blur-md"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="w-5 h-5" style={{ color: '#D4AF37' }} />
                <h2
                  className="text-xl font-serif tracking-wide"
                  style={{ color: '#2C1810' }}
                >
                  Access Granted
                </h2>
                <Sparkles className="w-5 h-5" style={{ color: '#D4AF37' }} />
              </div>

              <ul className="space-y-3 text-left max-w-md mx-auto">
                {[
                  'Unlimited MAIA conversations (voice + text)',
                  'Full birth chart with Tarnas-level synthesis',
                  'Sacred Scribe living mythology',
                  'All 6 documentary aesthetic presets',
                  'Mission tracking & consciousness field map',
                  'Priority support from Soullab team',
                ].map((benefit, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#10B981' }} />
                    <span className="text-sm md:text-base font-serif" style={{ color: '#2C1810' }}>
                      {benefit}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <Link
                href="/maia"
                className="px-8 py-4 rounded-lg font-serif tracking-wide transition-all"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #FFB84D 100%)',
                  color: '#2C1810',
                  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
                }}
              >
                Begin Your Documentary
              </Link>

              <Link
                href="/astrology"
                className="px-8 py-4 rounded-lg font-serif tracking-wide transition-all backdrop-blur-md"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  color: '#2C1810',
                }}
              >
                View Your Chart
              </Link>
            </motion.div>

            {/* Founder appreciation */}
            <motion.p
              className="mt-10 text-sm font-serif italic"
              style={{ color: '#8B7355' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              Thank you for believing in sacred technology.
              <br />
              You're helping build the revolution of soul.
            </motion.p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <p
          className="text-xs font-serif tracking-wider"
          style={{ color: '#D4AF37' }}
        >
          BIRTHED BY SOULLAB
        </p>
        <p
          className="text-xs font-serif italic mt-1"
          style={{ color: '#8B7355' }}
        >
          Technology that honors the work
        </p>
      </motion.div>
    </div>
  );
}
