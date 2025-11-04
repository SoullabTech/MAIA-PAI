'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sparkles, BookOpen, Library, Compass, ArrowRight } from 'lucide-react';

/**
 * Sacred Offerings Hub
 *
 * A cinematic showcase of all sacred experiences and tools
 * Philosophy: Each offering is a doorway to deeper wisdom
 */

interface Offering {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  gradient: string;
  borderColor: string;
  glowColor: string;
  path: string;
  badge?: string;
}

const OFFERINGS: Offering[] = [
  {
    id: 'story-creator',
    title: 'Sacred Story Creator',
    subtitle: '46+ Global Wisdom Traditions',
    description: 'Share what\'s alive in your heart, and MAIA will weave a personalized teaching story from ancient wisdom traditions—speaking directly to your soul\'s journey.',
    icon: Sparkles,
    gradient: 'from-amber-500/10 to-purple-500/10',
    borderColor: 'border-amber-500/30',
    glowColor: 'shadow-amber-500/20',
    path: '/story-creator',
    badge: 'New'
  },
  {
    id: 'library',
    title: 'Library of Alexandria',
    subtitle: 'Your Sacred Knowledge Base',
    description: 'Upload texts, audio, images—MAIA analyzes their elemental essence and weaves them into your personal wisdom library with sacred geometry.',
    icon: Library,
    gradient: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-blue-500/20',
    path: '/library'
  },
  {
    id: 'oracle',
    title: 'Oracle Consultation',
    subtitle: 'Divine Guidance & Insight',
    description: 'Consult the oracle for guidance on life\'s crossroads. Receive wisdom channeled through sacred symbols, archetypes, and timeless teachings.',
    icon: Compass,
    gradient: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/30',
    glowColor: 'shadow-purple-500/20',
    path: '/oracle',
    badge: 'Coming Soon'
  },
  {
    id: 'holoflower',
    title: 'Holoflower Journey',
    subtitle: 'Your Soul Blueprint',
    description: 'Explore your unique soul signature through the sacred geometry of the Holoflower—a living map of your archetypal patterns and elemental balance.',
    icon: BookOpen,
    gradient: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-500/30',
    glowColor: 'shadow-green-500/20',
    path: '/holoflower',
    badge: 'Coming Soon'
  }
];

export default function OfferingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1a1f3a] text-white">
      {/* Sacred Geometry Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <svg viewBox="0 0 1000 1000" className="w-full h-full">
          <circle cx="500" cy="500" r="400" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="500" cy="500" r="200" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="4 4" />
          <path d="M 500 100 L 900 500 L 500 900 L 100 500 Z" fill="none" stroke="#F6AD55" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-amber-500/10 bg-[#1a1f3a]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            {/* Holoflower Logo */}
            <div className="w-12 h-12 relative opacity-80 hover:opacity-100 transition-opacity">
              <Image
                src="/holoflower.svg"
                alt="Soullab"
                width={48}
                height={48}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <Sparkles className="w-6 h-6 text-amber-400" />
                <h1 className="text-3xl font-light text-amber-50 tracking-wide">
                  Sacred Offerings
                </h1>
              </div>
              <p className="text-sm text-amber-400/60">
                Experiences woven from ancient wisdom and consciousness technology
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Intro Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-16"
        >
          <p className="text-lg text-amber-100/80 max-w-3xl mx-auto leading-relaxed">
            Each offering is a doorway to deeper wisdom. Choose your path and let MAIA guide you through transformative experiences designed to resonate with your soul.
          </p>
        </motion.div>

        {/* Offerings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {OFFERINGS.map((offering, index) => {
            const Icon = offering.icon;
            const isComingSoon = offering.badge === 'Coming Soon';

            return (
              <motion.button
                key={offering.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                onClick={() => !isComingSoon && router.push(offering.path)}
                disabled={isComingSoon}
                className={`
                  relative p-8 rounded-2xl text-left transition-all duration-300
                  bg-gradient-to-br ${offering.gradient}
                  border-2 ${offering.borderColor}
                  ${!isComingSoon ? `hover:scale-[1.02] hover:shadow-2xl ${offering.glowColor} cursor-pointer` : 'opacity-60 cursor-not-allowed'}
                  group
                `}
                whileHover={!isComingSoon ? { y: -5 } : {}}
              >
                {/* Badge */}
                {offering.badge && (
                  <div className="absolute top-4 right-4">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${offering.badge === 'New'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-white/10 text-white/60 border border-white/20'}
                    `}>
                      {offering.badge}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`
                  w-16 h-16 rounded-xl bg-white/5 border ${offering.borderColor}
                  flex items-center justify-center mb-6
                  ${!isComingSoon && 'group-hover:scale-110 group-hover:rotate-3'}
                  transition-all duration-300
                `}>
                  <Icon className="w-8 h-8 text-amber-400" />
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h2 className="text-2xl font-medium text-amber-50 mb-2">
                    {offering.title}
                  </h2>
                  <p className="text-sm text-amber-400/80 mb-4">
                    {offering.subtitle}
                  </p>
                  <p className="text-base text-amber-100/70 leading-relaxed">
                    {offering.description}
                  </p>
                </div>

                {/* Arrow */}
                {!isComingSoon && (
                  <div className="flex items-center gap-2 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Enter</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 text-center"
        >
          <p className="text-sm text-amber-100/70 leading-relaxed">
            More sacred offerings are being woven into the tapestry. Each tool is crafted with intention to deepen your connection to ancient wisdom and your inner knowing.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
