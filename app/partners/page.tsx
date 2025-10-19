'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Heart, Code, Users, Zap, BookOpen, Compass, Star } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Soullab Inside - Dreamer's Invitation
 *
 * Sacred Scribe aesthetic - deep purples, golds, mystical gradients
 * For practitioners who dream in color and build in consciousness
 */
export default function PartnersPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
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
        {[...Array(60)].map((_, i) => (
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

      {/* Twinkling stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() > 0.8 ? '2px' : '1px',
              height: Math.random() > 0.8 ? '2px' : '1px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Beta Badge - Building with First Dreamers */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-6"
        >
          <div className="backdrop-blur-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-300/50 rounded-full px-6 py-2 shadow-xl"
            style={{ boxShadow: '0 0 30px rgba(251, 191, 36, 0.3)' }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-amber-200 text-sm font-semibold tracking-wide">
                BETA · Building with First Dreamers
              </span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
          </div>
        </motion.div>

        {/* Header with Holoflower Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          {/* Holoflower Logo */}
          <div className="flex justify-center items-center gap-4 mb-8">
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
                width={80}
                height={80}
                className="drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))' }}
              />
            </motion.div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Soullab Inside
              </h1>
              <p className="text-purple-200 text-sm tracking-widest mt-1">DREAMERS BUILD HERE</p>
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Build your practice on technology<br />
            that <span className="bg-gradient-to-r from-amber-300 to-purple-300 bg-clip-text text-transparent">honors the work</span>.
          </h2>
          <p className="text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed mb-4">
            Soullab Inside helps therapists, teachers, artists, and healers create <span className="text-amber-300 font-semibold">soulful digital spaces</span> — coherent, ethical, and alive.
          </p>
          <p className="text-xl text-amber-200 italic tracking-wide mb-8">
            You got soul. ✨
          </p>
          <Link
            href="/partners/onboarding"
            className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full text-white font-bold text-lg shadow-2xl transition-all transform hover:scale-105"
            style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)' }}
          >
            Request Beta Access
          </Link>

          {/* Beta Invite System */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 backdrop-blur-md bg-white/5 border border-amber-300/20 rounded-xl p-6 max-w-2xl mx-auto"
          >
            <div className="flex items-start gap-3">
              <Heart className="w-6 h-6 text-amber-300 flex-shrink-0 mt-1" />
              <div className="text-left">
                <p className="text-purple-100 text-sm leading-relaxed">
                  <span className="text-amber-200 font-semibold">First Dreamers</span> receive{' '}
                  <span className="text-white font-bold">10 sacred invite codes</span> to pass ceremoniously to their people.
                  <br />
                  <span className="text-purple-200 italic">Build the world with us. Invite-only. Reverent. Alive.</span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* What It Is */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="backdrop-blur-xl bg-white/10 border border-purple-300/30 rounded-2xl p-10 mb-12 shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(168, 85, 247, 0.3)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-amber-300" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-purple-300 bg-clip-text text-transparent">
              What Soullab Inside Is
            </h2>
          </div>
          <div className="space-y-4 text-purple-50 leading-relaxed text-lg">
            <p className="text-xl font-semibold text-white">
              Not a template system. A <span className="text-amber-300">living architecture</span>.
            </p>
            <p>
              Soullab Inside is an <strong className="text-purple-200">extension framework</strong> — not white-labeled software, but a collaboration.
              We build sacred tech together, rooted in your practice's unique wisdom.
            </p>
            <p>
              Your clients experience a space that <em className="text-purple-200">feels</em> like you — the rhythms, the language, the care.
              Behind the scenes, you're drawing from Soullab's infrastructure: conversational intelligence, elemental patterns,
              community-contributed modules, and regenerative design principles.
            </p>
            <p className="text-amber-200 italic text-xl border-l-4 border-amber-300 pl-4">
              Because your work already carries it — we just make the architecture breathe with you.
            </p>
          </div>
        </motion.div>

        {/* Who It's For - Colorful Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center text-white mb-10">
            Who Dreams Here
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-orange-300/40 rounded-2xl p-8 transform hover:scale-105 transition-all shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-10 h-10 text-orange-300" />
                <h3 className="text-2xl font-bold text-white">Therapists</h3>
              </div>
              <p className="text-orange-50 leading-relaxed">
                Sacred data handling, gentle intake flows, regenerative scheduling. Your practice becomes a sanctuary in digital form.
              </p>
            </div>

            <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-300/40 rounded-2xl p-8 transform hover:scale-105 transition-all shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-10 h-10 text-cyan-300" />
                <h3 className="text-2xl font-bold text-white">Teachers</h3>
              </div>
              <p className="text-cyan-50 leading-relaxed">
                Collaborative learning spaces, curriculum as living document, open commons. Education as emergence.
              </p>
            </div>

            <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-emerald-300/40 rounded-2xl p-8 transform hover:scale-105 transition-all shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Compass className="w-10 h-10 text-emerald-300" />
                <h3 className="text-2xl font-bold text-white">Artists</h3>
              </div>
              <p className="text-emerald-50 leading-relaxed">
                Adaptive rhythm engines, portfolio as ritual, creative community building. Your art lives and breathes online.
              </p>
            </div>

            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-pink-300/40 rounded-2xl p-8 transform hover:scale-105 transition-all shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-10 h-10 text-pink-300" />
                <h3 className="text-2xl font-bold text-white">Healers</h3>
              </div>
              <p className="text-pink-50 leading-relaxed">
                Energy cycle tracking, moon phases, client journey mapping. Technology that honors the unseen.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Ethical Commitments - Glowing Badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="backdrop-blur-xl bg-white/10 border border-purple-300/30 rounded-2xl p-10 mb-16 shadow-2xl"
        >
          <h2 className="text-4xl font-bold text-center mb-10">
            <span className="bg-gradient-to-r from-amber-300 to-purple-300 bg-clip-text text-transparent">
              Sacred Commitments
            </span>
          </h2>
          <div className="grid md:grid-cols-5 gap-6 text-center">
            {[
              { icon: '🚫', title: 'No Extraction', desc: 'Your data is yours' },
              { icon: '🔒', title: 'Data Sovereignty', desc: 'Full portability' },
              { icon: '🌊', title: 'Regenerative Flow', desc: '10% to commons' },
              { icon: '👁️', title: 'Transparency', desc: 'Open stewardship' },
              { icon: '🕊️', title: 'Graceful Endings', desc: 'Exit with dignity' },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="backdrop-blur-md bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-300/30 rounded-xl p-6"
              >
                <div className="text-5xl mb-3">{item.icon}</div>
                <p className="text-white font-bold mb-2">{item.title}</p>
                <p className="text-purple-200 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Service Tiers - Dreamer's Path */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center text-white mb-4">The Dreamer's Path</h2>
          <p className="text-center text-purple-200 mb-10 text-lg">Choose your level of partnership</p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Seed */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/15 to-emerald-500/15 border border-emerald-300/40 rounded-2xl p-8 shadow-xl relative overflow-hidden">
              {/* Coming Soon Badge */}
              <div className="absolute top-4 right-4 backdrop-blur-md bg-amber-500/20 border border-amber-300/40 rounded-full px-3 py-1">
                <span className="text-amber-200 text-xs font-semibold tracking-wide">COMING SOON</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🌱</span>
                <h3 className="text-2xl font-bold text-white">Seed</h3>
              </div>
              <p className="text-emerald-100 mb-6 leading-relaxed">
                For early-stage dreamers. Co-design a single feature or simple site.
              </p>
              <ul className="space-y-3 text-emerald-50 mb-6">
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span>1-2 core features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span>Shared hosting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span>Community module access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span>Sliding scale / donation-based</span>
                </li>
              </ul>
            </div>

            {/* Grow */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/15 to-cyan-500/15 border border-cyan-300/40 rounded-2xl p-8 shadow-xl relative overflow-hidden">
              {/* Coming Soon Badge */}
              <div className="absolute top-4 right-4 backdrop-blur-md bg-amber-500/20 border border-amber-300/40 rounded-full px-3 py-1">
                <span className="text-amber-200 text-xs font-semibold tracking-wide">COMING SOON</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🌿</span>
                <h3 className="text-2xl font-bold text-white">Grow</h3>
              </div>
              <p className="text-cyan-100 mb-6 leading-relaxed">
                For established solo practitioners. Full feature suite with custom flows.
              </p>
              <ul className="space-y-3 text-cyan-50 mb-6">
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                  <span>Full feature suite</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                  <span>Custom domain</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                  <span>Monthly collaboration calls</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">$300-800/month</span>
                </li>
              </ul>
            </div>

            {/* Thrive */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-orange-500/15 to-red-500/15 border border-orange-300/40 rounded-2xl p-8 shadow-xl relative overflow-hidden">
              {/* Coming Soon Badge */}
              <div className="absolute top-4 right-4 backdrop-blur-md bg-amber-500/20 border border-amber-300/40 rounded-full px-3 py-1">
                <span className="text-amber-200 text-xs font-semibold tracking-wide">COMING SOON</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🔥</span>
                <h3 className="text-2xl font-bold text-white">Thrive</h3>
              </div>
              <p className="text-orange-100 mb-6 leading-relaxed">
                For small teams or group practices. Multi-practitioner setup.
              </p>
              <ul className="space-y-3 text-orange-50 mb-6">
                <li className="flex items-start gap-2">
                  <Heart className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                  <span>Team dashboards</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                  <span>Client community features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                  <span>Quarterly strategy sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">$1,500-3,000/month</span>
                </li>
              </ul>
            </div>

            {/* Emanate */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/15 to-pink-500/15 border border-pink-300/40 rounded-2xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10" />
              {/* Coming Soon Badge */}
              <div className="absolute top-4 right-4 backdrop-blur-md bg-amber-500/20 border border-amber-300/40 rounded-full px-3 py-1 z-20">
                <span className="text-amber-200 text-xs font-semibold tracking-wide">COMING SOON</span>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">✨</span>
                  <h3 className="text-2xl font-bold text-white">Emanate</h3>
                </div>
                <p className="text-pink-100 mb-6 leading-relaxed">
                  For movements, schools, or large collectives. Flagship partnership.
                </p>
                <ul className="space-y-3 text-pink-50 mb-6">
                  <li className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-pink-300 flex-shrink-0 mt-0.5" />
                    <span>Custom AI training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-pink-300 flex-shrink-0 mt-0.5" />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-pink-300 flex-shrink-0 mt-0.5" />
                    <span>Co-creation of new modules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-pink-300 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">Custom project pricing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="backdrop-blur-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-purple-300/40 rounded-2xl p-8 shadow-xl relative overflow-hidden opacity-60 cursor-not-allowed">
            {/* Coming Soon Badge */}
            <div className="absolute top-4 right-4 backdrop-blur-md bg-amber-500/20 border border-amber-300/40 rounded-full px-3 py-1">
              <span className="text-amber-200 text-xs font-semibold tracking-wide">COMING SOON</span>
            </div>
            <Users className="w-12 h-12 text-purple-300 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Partner Showcase</h3>
            <p className="text-purple-100">
              See sacred tech in action
            </p>
          </div>

          <Link
            href="/partners/onboarding"
            className="backdrop-blur-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-300/50 rounded-2xl p-8 hover:scale-105 transition-all group shadow-2xl relative overflow-hidden"
            style={{ boxShadow: '0 0 40px rgba(251, 191, 36, 0.4)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-400/10" />
            <div className="relative z-10">
              <Heart className="w-12 h-12 text-amber-300 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-3">Begin Inquiry</h3>
              <p className="text-amber-100">
                Share your vision, find resonance
              </p>
            </div>
          </Link>

          <div className="backdrop-blur-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-300/40 rounded-2xl p-8 shadow-xl relative overflow-hidden opacity-60 cursor-not-allowed">
            {/* Coming Soon Badge */}
            <div className="absolute top-4 right-4 backdrop-blur-md bg-amber-500/20 border border-amber-300/40 rounded-full px-3 py-1">
              <span className="text-amber-200 text-xs font-semibold tracking-wide">COMING SOON</span>
            </div>
            <Code className="w-12 h-12 text-pink-300 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Field Partner Covenant</h3>
            <p className="text-pink-100">
              Our shared commitments
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center backdrop-blur-md bg-white/5 border border-purple-300/20 rounded-xl p-8"
        >
          <p className="text-purple-200 italic leading-relaxed">
            Revenue from Soullab Inside sustains the foundation and funds community care.
            <br />
            <span className="text-amber-300 font-semibold">10% of all partner subscriptions flow back to the regeneration pool.</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
