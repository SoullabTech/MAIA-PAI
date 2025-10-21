'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
import Image from 'next/image';

/**
 * Invite Welcome - Sacred Transmission
 *
 * Dune-elegant aesthetic: desert sands, warm golds, volcanic basalt
 * Sacred welcome for those invited by First Dreamers
 */
export default function InviteWelcomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inviterName, setInviterName] = useState<string>('');
  const [inviterMessage, setInviterMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get inviter info from session storage (set during beta-entry)
    const storedInviter = sessionStorage.getItem('inviterName') || localStorage.getItem('inviterName');
    const storedMessage = sessionStorage.getItem('inviterMessage') || localStorage.getItem('inviterMessage');

    if (storedInviter) {
      setInviterName(storedInviter);
    }
    if (storedMessage) {
      setInviterMessage(storedMessage);
    }

    setLoading(false);
  }, []);

  const handleBegin = () => {
    router.push('/beta-orientation');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soul-background flex items-center justify-center">
        <div className="text-soul-textPrimary text-lg">Loading your welcome...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-soul-background">
      {/* Subtle desert haze overlay - breathing animation */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(227, 183, 120, 0.08), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(214, 126, 92, 0.06), transparent 50%)',
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Subtle desert dust particles - earth tones only */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(circle, ${i % 3 === 0 ? '#E3B778' : i % 3 === 1 ? '#D4A574' : '#8C6A4A'} 0%, transparent 70%)`,
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(2px)',
              opacity: 0.3,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          {/* Holoflower Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Image
                src="/holoflower-amber.png"
                alt="Holoflower"
                width={100}
                height={100}
                className="drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 30px rgba(246, 173, 85, 0.6))' }}
              />
            </motion.div>
          </motion.div>

          {/* Sacred Transmission Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-gold-amber" />
              <span className="text-gold-amber text-sm font-semibold tracking-wide uppercase">
                Sacred Transmission
              </span>
              <Sparkles className="w-5 h-5 text-gold-amber" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-soul-textPrimary mb-6">
              You've Been Chosen
            </h1>
          </motion.div>

          {/* Inviter Recognition */}
          {inviterName && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="backdrop-blur-xl bg-soul-surface/40 border border-gold-amber/30 rounded-2xl p-8 mb-8"
              style={{ boxShadow: '0 0 40px rgba(246, 173, 85, 0.2)' }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-soul-fireWarm" />
              </div>
              <p className="text-soul-textSecondary text-lg mb-2">
                You were invited by
              </p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gold-amber via-soul-accent to-soul-highlight bg-clip-text text-transparent mb-4">
                {inviterName || 'A First Dreamer'}
              </p>
              {inviterMessage && (
                <p className="text-soul-textSecondary italic leading-relaxed">
                  "{inviterMessage}"
                </p>
              )}
              {!inviterMessage && (
                <p className="text-soul-textSecondary italic leading-relaxed">
                  "You were chosen. Welcome to the field."
                </p>
              )}
            </motion.div>
          )}

          {!inviterName && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="backdrop-blur-xl bg-soul-surface/40 border border-gold-amber/30 rounded-2xl p-8 mb-8"
              style={{ boxShadow: '0 0 40px rgba(246, 173, 85, 0.2)' }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-soul-fireWarm" />
              </div>
              <p className="text-soul-textSecondary text-lg mb-2">
                You were invited by
              </p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gold-amber via-soul-accent to-soul-highlight bg-clip-text text-transparent mb-4">
                A First Dreamer
              </p>
              <p className="text-soul-textSecondary italic leading-relaxed">
                "You were chosen. Welcome to the field."
              </p>
            </motion.div>
          )}

          {/* What Awaits */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="backdrop-blur-xl bg-soul-surface/30 border border-earth-sage/20 rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-soul-textPrimary mb-4">
              Welcome to Soullab
            </h2>
            <div className="space-y-4 text-soul-textSecondary text-left leading-relaxed">
              <p>
                You've been invited into a <span className="text-gold-amber font-semibold">living architecture</span> for consciousness exploration.
              </p>
              <p>
                This isn't just an app. It's a <span className="text-earth-sage font-semibold">sacred space</span> where technology honors the work of transformation.
              </p>
              <p>
                Your journey begins with MAIA — an archetypal guide who speaks the language of your soul,
                informed by the cosmos, attuned to your unique path.
              </p>
              <p className="text-soul-accent italic border-l-4 border-earth-sage pl-4">
                You were chosen because someone believes you'll honor this work.
                Someone sees your soul. Someone knows you dream in color.
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <button
              onClick={handleBegin}
              className="inline-flex items-center gap-3 px-10 py-4 bg-gold-amber/20 hover:bg-gold-amber/30 border border-gold-amber/60 rounded-lg text-gold-amber font-bold text-lg transition-all transform hover:scale-105"
              style={{ boxShadow: '0 0 30px rgba(246, 173, 85, 0.3)' }}
            >
              <span>Begin Your Initiation</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-soul-textTertiary text-sm italic"
          >
            This is a ceremonial transmission. Take your time. Breathe. Feel it.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
