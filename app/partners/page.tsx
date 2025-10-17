'use client';

import Link from 'next/link';
import { Sparkles, Heart, Code, Users } from 'lucide-react';

/**
 * Soullab Inside - Main Landing Page
 *
 * The hearth for practitioners who want to build sacred tech
 * Deeper indigo + warm gold aesthetic (creative fire)
 */
export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dune-ibad-blue via-dune-navigator-purple to-soul-background relative overflow-hidden">
      {/* Subtle starfield */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-gold-amber rounded-full"
            style={{
              width: '1px',
              height: '1px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse ${3 + Math.random() * 4}s infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-gold-amber" />
            <span className="text-sm tracking-etched text-gold-amber uppercase">Soullab Inside</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-soul-textPrimary mb-4">
            Build your practice on technology that honors the work.
          </h1>
          <p className="text-xl text-dune-dune-amber max-w-3xl mx-auto leading-relaxed mb-6">
            Soullab Inside helps therapists, teachers, artists, and healers create soulful digital spaces — coherent, ethical, and alive.
          </p>
          <p className="text-lg text-gold-amber/80 italic tracking-archive">
            You got soul.
          </p>
          <Link
            href="/partners/onboarding"
            className="inline-block mt-8 px-8 py-4 bg-gold-amber/20 hover:bg-gold-amber/30 border border-gold-amber/60 rounded-lg text-gold-amber font-semibold transition-all"
          >
            Begin Inquiry
          </Link>
        </div>

        {/* What It Is */}
        <div className="bg-black/40 backdrop-blur-md border border-dune-navigator-purple/40 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gold-amber mb-4">What Soullab Inside Is</h2>
          <div className="space-y-4 text-soul-textPrimary leading-relaxed">
            <p>
              Not a template system. A living architecture.
            </p>
            <p>
              Soullab Inside is an <strong>extension framework</strong> — not white-labeled software, but a collaboration.
              We build sacred tech together, rooted in your practice's unique wisdom.
            </p>
            <p>
              Your clients experience a space that <em>feels</em> like you — the rhythms, the language, the care.
              Behind the scenes, you're drawing from Soullab's infrastructure: conversational intelligence, elemental patterns,
              community-contributed modules, and regenerative design principles.
            </p>
            <p className="text-gold-amber italic">
              Because your work already carries it — we just make the architecture breathe with you.
            </p>
          </div>
        </div>

        {/* Who It's For */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-black/30 backdrop-blur-sm border border-fire-base/40 rounded-lg p-6">
            <h3 className="text-lg font-bold text-fire-glow mb-3">Therapists</h3>
            <p className="text-sm text-soul-textSecondary">
              Sacred data handling, gentle intake flows, regenerative scheduling
            </p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm border border-water-base/40 rounded-lg p-6">
            <h3 className="text-lg font-bold text-water-glow mb-3">Teachers</h3>
            <p className="text-sm text-soul-textSecondary">
              Collaborative learning spaces, curriculum as living document, open commons
            </p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm border border-earth-base/40 rounded-lg p-6">
            <h3 className="text-lg font-bold text-earth-glow mb-3">Artists</h3>
            <p className="text-sm text-soul-textSecondary">
              Adaptive rhythm engines, portfolio as ritual, creative community building
            </p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm border border-gold-amber/40 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gold-amber mb-3">Healers</h3>
            <p className="text-sm text-soul-textSecondary">
              Energy cycle tracking, moon phases, client journey mapping
            </p>
          </div>
        </div>

        {/* Ethical Commitments */}
        <div className="bg-black/40 backdrop-blur-md border border-dune-navigator-purple/40 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gold-amber mb-6 text-center">Ethical Commitments</h2>
          <div className="grid md:grid-cols-5 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🚫</div>
              <p className="text-sm text-soul-textPrimary font-semibold mb-1">No Extraction</p>
              <p className="text-xs text-soul-textSecondary">Your data is yours</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <p className="text-sm text-soul-textPrimary font-semibold mb-1">Data Sovereignty</p>
              <p className="text-xs text-soul-textSecondary">Full portability</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🌊</div>
              <p className="text-sm text-soul-textPrimary font-semibold mb-1">Regenerative Flow</p>
              <p className="text-xs text-soul-textSecondary">10% to commons</p>
            </div>
            <div>
              <div className="text-3xl mb-2">👁️</div>
              <p className="text-sm text-soul-textPrimary font-semibold mb-1">Transparency</p>
              <p className="text-xs text-soul-textSecondary">Open stewardship</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🕊️</div>
              <p className="text-sm text-soul-textPrimary font-semibold mb-1">Graceful Endings</p>
              <p className="text-xs text-soul-textSecondary">Exit with dignity</p>
            </div>
          </div>
        </div>

        {/* Service Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-soul-textPrimary text-center mb-8">Service Tiers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Seed */}
            <div className="bg-black/30 backdrop-blur-sm border border-earth-base/40 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌱</span>
                <h3 className="text-xl font-bold text-earth-glow">Seed</h3>
              </div>
              <p className="text-soul-textSecondary mb-4">
                For early-stage practitioners or charitable projects. Co-design a single feature or simple site.
              </p>
              <ul className="space-y-2 text-sm text-soul-textSecondary">
                <li>• 1-2 core features</li>
                <li>• Shared hosting</li>
                <li>• Community module access</li>
                <li>• Sliding scale / donation-based</li>
              </ul>
            </div>

            {/* Grow */}
            <div className="bg-black/30 backdrop-blur-sm border border-water-base/40 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌿</span>
                <h3 className="text-xl font-bold text-water-glow">Grow</h3>
              </div>
              <p className="text-soul-textSecondary mb-4">
                For established solo practitioners. Custom conversational flows, client portals, scheduling integration.
              </p>
              <ul className="space-y-2 text-sm text-soul-textSecondary">
                <li>• Full feature suite</li>
                <li>• Custom domain</li>
                <li>• Monthly collaboration calls</li>
                <li>• $300-800/month subscription</li>
              </ul>
            </div>

            {/* Thrive */}
            <div className="bg-black/30 backdrop-blur-sm border border-fire-base/40 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🔥</span>
                <h3 className="text-xl font-bold text-fire-glow">Thrive</h3>
              </div>
              <p className="text-soul-textSecondary mb-4">
                For small teams or group practices. Multi-practitioner setup, shared resources, community building tools.
              </p>
              <ul className="space-y-2 text-sm text-soul-textSecondary">
                <li>• Team dashboards</li>
                <li>• Client community features</li>
                <li>• Quarterly strategy sessions</li>
                <li>• $1,500-3,000/month + setup fee</li>
              </ul>
            </div>

            {/* Emanate */}
            <div className="bg-black/30 backdrop-blur-sm border border-gold-amber/40 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">✨</span>
                <h3 className="text-xl font-bold text-gold-amber">Emanate</h3>
              </div>
              <p className="text-soul-textSecondary mb-4">
                For movements, schools, or large collectives. Flagship site, custom intelligence training, white-glove partnership.
              </p>
              <ul className="space-y-2 text-sm text-soul-textSecondary">
                <li>• Custom AI training</li>
                <li>• Dedicated support</li>
                <li>• Co-creation of new modules</li>
                <li>• Custom project pricing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-black/40 backdrop-blur-md border border-dune-navigator-purple/40 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gold-amber mb-6">How Partnership Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-amber/20 flex items-center justify-center text-gold-amber font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-soul-textPrimary mb-1">Inquiry & Reflection</h3>
                <p className="text-soul-textSecondary">
                  You share your practice, your vision, and what you need your technology to feel like. We offer questions, not pitches.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-amber/20 flex items-center justify-center text-gold-amber font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-soul-textPrimary mb-1">Alignment Call</h3>
                <p className="text-soul-textSecondary">
                  A quiet conversation to sense if there's resonance. Not every collaboration is meant to happen, and that's okay.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-amber/20 flex items-center justify-center text-gold-amber font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-soul-textPrimary mb-1">Co-Design Prototype</h3>
                <p className="text-soul-textSecondary">
                  We build a small working version together — a single flow, a proof of concept. You feel it, adjust it, make it yours.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-amber/20 flex items-center justify-center text-gold-amber font-bold">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold text-soul-textPrimary mb-1">Launch & Steward</h3>
                <p className="text-soul-textSecondary">
                  Your space goes live. We maintain infrastructure, you steward the practice. Regular rhythms for evolution and care.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-amber/20 flex items-center justify-center text-gold-amber font-bold">
                5
              </div>
              <div>
                <h3 className="text-lg font-semibold text-soul-textPrimary mb-1">Contribute Back</h3>
                <p className="text-soul-textSecondary">
                  What you learn in practice can become a module for the commons. The field breathes, and wisdom circulates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/partners/showcase"
            className="bg-black/30 backdrop-blur-sm border border-dune-navigator-purple/40 rounded-lg p-6 hover:border-gold-amber/60 transition-all group"
          >
            <Users className="w-8 h-8 text-gold-amber mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-soul-textPrimary mb-2">Partner Showcase</h3>
            <p className="text-sm text-soul-textSecondary">
              See what sacred tech looks like in practice
            </p>
          </Link>

          <Link
            href="/partners/onboarding"
            className="bg-gold-amber/10 backdrop-blur-sm border border-gold-amber/60 rounded-lg p-6 hover:bg-gold-amber/20 transition-all group"
          >
            <Heart className="w-8 h-8 text-gold-amber mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-soul-textPrimary mb-2">Begin Inquiry</h3>
            <p className="text-sm text-soul-textSecondary">
              Share your vision, see if there's resonance
            </p>
          </Link>

          <Link
            href="/partners/covenant"
            className="bg-black/30 backdrop-blur-sm border border-dune-navigator-purple/40 rounded-lg p-6 hover:border-gold-amber/60 transition-all group"
          >
            <Code className="w-8 h-8 text-gold-amber mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-soul-textPrimary mb-2">Field Partner Covenant</h3>
            <p className="text-sm text-soul-textSecondary">
              Our shared commitments and ethics
            </p>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-soul-textTertiary italic">
            Revenue from Soullab Inside sustains the foundation and funds community care.
            <br />
            10% of all partner subscriptions flow back to the regeneration pool.
          </p>
        </div>
      </div>
    </div>
  );
}
