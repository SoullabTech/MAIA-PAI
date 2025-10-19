'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Heart, Code, Users, Zap, BookOpen, Compass, Star } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Soullab Inside - Dreamer's Invitation
 *
 * Sacred Scribe aesthetic - Dune-elegant, volcanic basalt, desert sands, warm golds
 * For practitioners who dream in color and build in consciousness
 */
export default function PartnersPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-soul-background">
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
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Subtle desert dust particles - fewer, slower, earth tones only */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
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
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Beta Badge - Building with First Dreamers */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-6"
        >
          <div className="backdrop-blur-xl bg-soul-surface/60 border border-gold-amber/40 rounded-full px-6 py-2"
            style={{ boxShadow: '0 0 20px rgba(246, 173, 85, 0.2)' }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-amber" />
              <span className="text-soul-textPrimary text-sm font-semibold tracking-wide">
                BETA · Building with First Dreamers
              </span>
              <Sparkles className="w-4 h-4 text-gold-amber" />
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
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gold-amber via-soul-accent to-soul-highlight bg-clip-text text-transparent">
                Soullab Inside
              </h1>
              <p className="text-soul-textSecondary text-sm tracking-widest mt-1">DREAMERS BUILD HERE</p>
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-soul-textPrimary mb-6 leading-tight">
            Build your practice on technology<br />
            that <span className="bg-gradient-to-r from-gold-amber to-soul-accentGlow bg-clip-text text-transparent">honors the work</span>.
          </h2>
          <p className="text-2xl text-soul-textSecondary max-w-3xl mx-auto leading-relaxed mb-4">
            Soullab Inside helps therapists, coaches, healers, teachers, artists, and guides create <span className="text-gold-amber font-semibold">soulful digital spaces</span> — coherent, ethical, and alive.
          </p>
          <p className="text-xl text-soul-accent italic tracking-wide mb-8">
            You got soul.
          </p>
          <Link
            href="/partners/onboarding"
            className="inline-block px-10 py-4 bg-gold-amber/20 hover:bg-gold-amber/30 border border-gold-amber/60 rounded-lg text-gold-amber font-bold text-lg transition-all transform hover:scale-105"
            style={{ boxShadow: '0 0 20px rgba(246, 173, 85, 0.3)' }}
          >
            Request Beta Access
          </Link>

          {/* Beta Invite System */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 backdrop-blur-md bg-soul-surface/40 border border-dune-atreides-green/30 rounded-xl p-6 max-w-2xl mx-auto"
          >
            <div className="flex items-start gap-3">
              <Heart className="w-6 h-6 text-earth-sage flex-shrink-0 mt-1" />
              <div className="text-left">
                <p className="text-soul-textSecondary text-sm leading-relaxed">
                  <span className="text-earth-sage font-semibold">First Dreamers</span> receive{' '}
                  <span className="text-soul-textPrimary font-bold">10 sacred invite codes</span> to pass ceremoniously to their people.
                  <br />
                  <span className="text-soul-textSecondary italic">Build the world with us. Invite-only. Reverent. Alive.</span>
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
          className="backdrop-blur-xl bg-soul-surface/30 border border-earth-sage/20 rounded-2xl p-10 mb-12"
          style={{ boxShadow: '0 0 30px rgba(122, 154, 101, 0.15)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-earth-sage" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-earth-sage to-gold-amber bg-clip-text text-transparent">
              What Soullab Inside Is
            </h2>
          </div>
          <div className="space-y-4 text-soul-textSecondary leading-relaxed text-lg">
            <p className="text-xl font-semibold text-soul-textPrimary">
              Not a template system. A <span className="text-earth-sage">living architecture</span>.
            </p>
            <p>
              Soullab Inside is an <strong className="text-soul-textPrimary">extension framework</strong> — not white-labeled software, but a collaboration.
              We build sacred tech together, rooted in your practice's unique wisdom.
            </p>
            <p>
              Your clients experience a space that <em className="text-soul-textPrimary">feels</em> like you — the rhythms, the language, the care.
              Behind the scenes, you're drawing from Soullab's infrastructure: conversational intelligence, elemental patterns,
              community-contributed modules, and regenerative design principles.
            </p>
            <p className="text-earth-sage italic text-xl border-l-4 border-earth-sage pl-4">
              Because your work already carries it — we just make the architecture breathe with you.
            </p>
          </div>
        </motion.div>

        {/* Who It's For - Expanded Grid with More Helpers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center text-soul-textPrimary mb-10">
            Who Dreams Here
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Therapists & Counselors */}
            <div className="backdrop-blur-xl bg-soul-surface/40 border border-soul-fireWarm/30 rounded-2xl p-8 transform hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-10 h-10 text-soul-fireWarm" />
                <h3 className="text-2xl font-bold text-soul-textPrimary">Therapists</h3>
              </div>
              <p className="text-soul-textSecondary leading-relaxed">
                Sacred data handling, gentle intake flows, regenerative scheduling. Your practice becomes a sanctuary in digital form.
              </p>
            </div>

            {/* Coaches & Mentors */}
            <div className="backdrop-blur-xl bg-soul-surface/40 border border-earth-sage/30 rounded-2xl p-8 transform hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Compass className="w-10 h-10 text-earth-sage" />
                <h3 className="text-2xl font-bold text-soul-textPrimary">Coaches</h3>
              </div>
              <p className="text-soul-textSecondary leading-relaxed">
                Journey tracking, milestone mapping, reflection prompts. Help your clients see their own becoming.
              </p>
            </div>

            {/* Bodyworkers & Somatic Practitioners */}
            <div className="backdrop-blur-xl bg-soul-surface/40 border border-soul-waterWarm/30 rounded-2xl p-8 transform hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-10 h-10 text-soul-waterWarm" />
                <h3 className="text-2xl font-bold text-soul-textPrimary">Bodyworkers</h3>
              </div>
              <p className="text-soul-textSecondary leading-relaxed">
                Session notes that honor embodiment, intake for physical history, seasonal rhythms. Technology that remembers the body.
              </p>
            </div>

            {/* Teachers & Educators */}
            <div className="backdrop-blur-xl bg-soul-surface/40 border border-gold-amber/30 rounded-2xl p-8 transform hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-10 h-10 text-gold-amber" />
                <h3 className="text-2xl font-bold text-soul-textPrimary">Teachers</h3>
              </div>
              <p className="text-soul-textSecondary leading-relaxed">
                Collaborative learning spaces, curriculum as living document, open commons. Education as emergence.
              </p>
            </div>

            {/* Healers & Energy Workers */}
            <div className="backdrop-blur-xl bg-soul-surface/40 border border-soul-accentGlow/30 rounded-2xl p-8 transform hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-10 h-10 text-soul-accentGlow" />
                <h3 className="text-2xl font-bold text-soul-textPrimary">Healers</h3>
              </div>
              <p className="text-soul-textSecondary leading-relaxed">
                Energy cycle tracking, moon phases, client journey mapping. Technology that honors the unseen.
              </p>
            </div>

            {/* Artists & Creatives */}
            <div className="backdrop-blur-xl bg-soul-surface/40 border border-soul-airWarm/30 rounded-2xl p-8 transform hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-10 h-10 text-soul-airWarm" />
                <h3 className="text-2xl font-bold text-soul-textPrimary">Artists</h3>
              </div>
              <p className="text-soul-textSecondary leading-relaxed">
                Adaptive rhythm engines, portfolio as ritual, creative community building. Your art lives and breathes online.
              </p>
            </div>

            {/* Facilitators & Circle Holders */}
            <div className="backdrop-blur-xl bg-soul-surface/40 border border-dune-atreides-green/30 rounded-2xl p-8 transform hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-10 h-10 text-dune-atreides-green" />
                <h3 className="text-2xl font-bold text-soul-textPrimary">Facilitators</h3>
              </div>
              <p className="text-soul-textSecondary leading-relaxed">
                Circle prep tools, participant check-ins, ritual containers. Hold space digitally with the same care you bring in person.
              </p>
            </div>

            {/* Doulas & Birth Workers */}
            <div className="backdrop-blur-xl bg-soul-surface/40 border border-soul-fireWarm/30 rounded-2xl p-8 transform hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-10 h-10 text-soul-fireWarm" />
                <h3 className="text-2xl font-bold text-soul-textPrimary">Doulas</h3>
              </div>
              <p className="text-soul-textSecondary leading-relaxed">
                Birth plan collaboration, postpartum check-ins, sacred transitions. Support the threshold with reverent tech.
              </p>
            </div>

            {/* Guides & Spiritual Directors */}
            <div className="backdrop-blur-xl bg-soul-surface/40 border border-soul-highlight/30 rounded-2xl p-8 transform hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Compass className="w-10 h-10 text-soul-highlight" />
                <h3 className="text-2xl font-bold text-soul-textPrimary">Guides</h3>
              </div>
              <p className="text-soul-textSecondary leading-relaxed">
                Soul cartography, dream journals, threshold crossings. Walk with your people through sacred architecture.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sacred Commitments */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="backdrop-blur-xl bg-soul-surface/30 border border-earth-sage/20 rounded-2xl p-10 mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-10">
            <span className="bg-gradient-to-r from-earth-sage to-gold-amber bg-clip-text text-transparent">
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
                whileHover={{ scale: 1.05 }}
                className="backdrop-blur-md bg-soul-surface/40 border border-soul-borderSubtle rounded-xl p-6 transition-all"
              >
                <div className="text-5xl mb-3">{item.icon}</div>
                <p className="text-soul-textPrimary font-bold mb-2">{item.title}</p>
                <p className="text-soul-textSecondary text-sm">{item.desc}</p>
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
          <h2 className="text-4xl font-bold text-center text-soul-textPrimary mb-4">The Dreamer's Path</h2>
          <p className="text-center text-soul-textSecondary mb-10 text-lg">Choose your level of partnership</p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Seed */}
            <div className="backdrop-blur-xl bg-soul-surface/30 border border-earth-sage/30 rounded-2xl p-8 relative overflow-hidden">
              {/* Coming Soon Badge */}
              <div className="absolute top-4 right-4 backdrop-blur-md bg-gold-amber/20 border border-gold-amber/40 rounded-full px-3 py-1">
                <span className="text-gold-amber text-xs font-semibold tracking-wide">COMING SOON</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🌱</span>
                <h3 className="text-2xl font-bold text-soul-textPrimary">Seed</h3>
              </div>
              <p className="text-soul-textSecondary mb-6 leading-relaxed">
                For early-stage dreamers. Co-design a single feature or simple site.
              </p>
              <ul className="space-y-3 text-soul-textSecondary mb-6">
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-earth-sage flex-shrink-0 mt-0.5" />
                  <span>1-2 core features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-earth-sage flex-shrink-0 mt-0.5" />
                  <span>Shared hosting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-earth-sage flex-shrink-0 mt-0.5" />
                  <span>Community module access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-earth-sage flex-shrink-0 mt-0.5" />
                  <span>Sliding scale / donation-based</span>
                </li>
              </ul>
            </div>

            {/* Grow */}
            <div className="backdrop-blur-xl bg-soul-surface/30 border border-dune-atreides-green/30 rounded-2xl p-8 relative overflow-hidden">
              {/* Coming Soon Badge */}
              <div className="absolute top-4 right-4 backdrop-blur-md bg-gold-amber/20 border border-gold-amber/40 rounded-full px-3 py-1">
                <span className="text-gold-amber text-xs font-semibold tracking-wide">COMING SOON</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🌿</span>
                <h3 className="text-2xl font-bold text-soul-textPrimary">Grow</h3>
              </div>
              <p className="text-soul-textSecondary mb-6 leading-relaxed">
                For established solo practitioners. Full feature suite with custom flows.
              </p>
              <ul className="space-y-3 text-soul-textSecondary mb-6">
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-dune-atreides-green flex-shrink-0 mt-0.5" />
                  <span>Full feature suite</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-dune-atreides-green flex-shrink-0 mt-0.5" />
                  <span>Custom domain</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-dune-atreides-green flex-shrink-0 mt-0.5" />
                  <span>Monthly collaboration calls</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-dune-atreides-green flex-shrink-0 mt-0.5" />
                  <span className="font-semibold text-soul-textPrimary">$300-800/month</span>
                </li>
              </ul>
            </div>

            {/* Thrive */}
            <div className="backdrop-blur-xl bg-soul-surface/30 border border-soul-fireWarm/30 rounded-2xl p-8 relative overflow-hidden">
              {/* Coming Soon Badge */}
              <div className="absolute top-4 right-4 backdrop-blur-md bg-gold-amber/20 border border-gold-amber/40 rounded-full px-3 py-1">
                <span className="text-gold-amber text-xs font-semibold tracking-wide">COMING SOON</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🔥</span>
                <h3 className="text-2xl font-bold text-soul-textPrimary">Thrive</h3>
              </div>
              <p className="text-soul-textSecondary mb-6 leading-relaxed">
                For small teams or group practices. Multi-practitioner setup.
              </p>
              <ul className="space-y-3 text-soul-textSecondary mb-6">
                <li className="flex items-start gap-2">
                  <Heart className="w-5 h-5 text-soul-fireWarm flex-shrink-0 mt-0.5" />
                  <span>Team dashboards</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-5 h-5 text-soul-fireWarm flex-shrink-0 mt-0.5" />
                  <span>Client community features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-5 h-5 text-soul-fireWarm flex-shrink-0 mt-0.5" />
                  <span>Quarterly strategy sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-5 h-5 text-soul-fireWarm flex-shrink-0 mt-0.5" />
                  <span className="font-semibold text-soul-textPrimary">$1,500-3,000/month</span>
                </li>
              </ul>
            </div>

            {/* Emanate */}
            <div className="backdrop-blur-xl bg-soul-surface/30 border border-gold-amber/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-amber/5 to-earth-sage/5" />
              {/* Coming Soon Badge */}
              <div className="absolute top-4 right-4 backdrop-blur-md bg-gold-amber/20 border border-gold-amber/40 rounded-full px-3 py-1 z-20">
                <span className="text-gold-amber text-xs font-semibold tracking-wide">COMING SOON</span>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">✨</span>
                  <h3 className="text-2xl font-bold text-soul-textPrimary">Emanate</h3>
                </div>
                <p className="text-soul-textSecondary mb-6 leading-relaxed">
                  For movements, schools, or large collectives. Flagship partnership.
                </p>
                <ul className="space-y-3 text-soul-textSecondary mb-6">
                  <li className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-gold-amber flex-shrink-0 mt-0.5" />
                    <span>Custom AI training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-gold-amber flex-shrink-0 mt-0.5" />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-gold-amber flex-shrink-0 mt-0.5" />
                    <span>Co-creation of new modules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-gold-amber flex-shrink-0 mt-0.5" />
                    <span className="font-semibold text-soul-textPrimary">Custom project pricing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="backdrop-blur-xl bg-soul-surface/30 border border-soul-borderSubtle rounded-2xl p-8 relative overflow-hidden opacity-60 cursor-not-allowed">
            {/* Coming Soon Badge */}
            <div className="absolute top-4 right-4 backdrop-blur-md bg-gold-amber/20 border border-gold-amber/40 rounded-full px-3 py-1">
              <span className="text-gold-amber text-xs font-semibold tracking-wide">COMING SOON</span>
            </div>
            <Users className="w-12 h-12 text-soul-textTertiary mb-4" />
            <h3 className="text-2xl font-bold text-soul-textPrimary mb-3">Partner Showcase</h3>
            <p className="text-soul-textSecondary">
              See sacred tech in action
            </p>
          </div>

          <Link
            href="/partners/onboarding"
            className="backdrop-blur-xl bg-soul-surface/40 border border-earth-sage/40 rounded-2xl p-8 hover:scale-105 transition-all group relative overflow-hidden"
            style={{ boxShadow: '0 0 20px rgba(122, 154, 101, 0.2)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-earth-sage/10 to-gold-amber/10" />
            <div className="relative z-10">
              <Heart className="w-12 h-12 text-earth-sage mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-soul-textPrimary mb-3">Begin Inquiry</h3>
              <p className="text-soul-textSecondary">
                Share your vision, find resonance
              </p>
            </div>
          </Link>

          <div className="backdrop-blur-xl bg-soul-surface/30 border border-soul-borderSubtle rounded-2xl p-8 relative overflow-hidden opacity-60 cursor-not-allowed">
            {/* Coming Soon Badge */}
            <div className="absolute top-4 right-4 backdrop-blur-md bg-gold-amber/20 border border-gold-amber/40 rounded-full px-3 py-1">
              <span className="text-gold-amber text-xs font-semibold tracking-wide">COMING SOON</span>
            </div>
            <Code className="w-12 h-12 text-soul-textTertiary mb-4" />
            <h3 className="text-2xl font-bold text-soul-textPrimary mb-3">Field Partner Covenant</h3>
            <p className="text-soul-textSecondary">
              Our shared commitments
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center backdrop-blur-md bg-soul-surface/30 border border-earth-sage/20 rounded-xl p-8"
        >
          <p className="text-soul-textSecondary italic leading-relaxed">
            Revenue from Soullab Inside sustains the foundation and funds community care.
            <br />
            <span className="text-earth-sage font-semibold">10% of all partner subscriptions flow back to the regeneration pool.</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
