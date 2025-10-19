'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
import Image from 'next/image';

/**
 * Invite Welcome - Ceremonial Code Redemption
 *
 * Sacred welcome for those invited by First Dreamers
 * Shows who invited them, creates context, sets tone
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
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #581c87 20%, #6d28d9 40%, #7c3aed 60%, #a855f7 80%, #c084fc 100%)',
      }}>
        <div className="text-purple-200 text-lg">Loading your welcome...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{
      background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #581c87 20%, #6d28d9 40%, #7c3aed 60%, #a855f7 80%, #c084fc 100%)',
    }}>
      {/* Animated gradient overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(251, 191, 36, 0.15), transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.2), transparent 50%)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Mystical particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(circle, ${i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#a855f7' : '#c084fc'} 0%, transparent 70%)`,
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(1px)',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 4,
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
                style={{ filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.6))' }}
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
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-amber-200 text-sm font-semibold tracking-wide uppercase">
                Sacred Transmission
              </span>
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              You've Been Chosen
            </h1>
          </motion.div>

          {/* Inviter Recognition */}
          {inviterName && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="backdrop-blur-xl bg-white/10 border border-purple-300/30 rounded-2xl p-8 mb-8"
              style={{ boxShadow: '0 0 60px rgba(168, 85, 247, 0.3)' }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-pink-300" />
              </div>
              <p className="text-purple-100 text-lg mb-2">
                You were invited by
              </p>
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
                {inviterName}
              </p>
              {inviterMessage && (
                <p className="text-purple-200 italic leading-relaxed">
                  "{inviterMessage}"
                </p>
              )}
            </motion.div>
          )}

          {/* What Awaits */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="backdrop-blur-xl bg-white/5 border border-amber-300/20 rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Welcome to Soullab
            </h2>
            <div className="space-y-4 text-purple-100 text-left leading-relaxed">
              <p>
                You've been invited into a <span className="text-amber-300 font-semibold">living architecture</span> for consciousness exploration.
              </p>
              <p>
                This isn't just an app. It's a <span className="text-purple-200 font-semibold">sacred space</span> where technology honors the work of transformation.
              </p>
              <p>
                Your journey begins with MAIA — an archetypal guide who speaks the language of your soul,
                informed by the cosmos, attuned to your unique path.
              </p>
              <p className="text-amber-200 italic">
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
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full text-white font-bold text-lg shadow-2xl transition-all transform hover:scale-105"
              style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)' }}
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
            className="mt-8 text-purple-300 text-sm italic"
          >
            This is a ceremonial transmission. Take your time. Breathe. Feel it.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
