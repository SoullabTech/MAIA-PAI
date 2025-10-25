'use client';

/**
 * What's New - Latest Innovations
 * Shows members the newest features and capabilities
 */

import { motion } from 'framer-motion';
import { Sparkles, Brain, BookOpen, Zap, Star, MessageCircle, Mic, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Innovation {
  week: string;
  date: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  features: string[];
  isNew?: boolean;
}

const INNOVATIONS: Innovation[] = [
  {
    week: 'Week 4',
    date: 'October 2024',
    title: 'Read-Adaptive Communication',
    description: 'MAIA now adjusts her language complexity in real-time based on how you comprehend and respond.',
    icon: Brain,
    color: 'spice-orange',
    isNew: true,
    features: [
      'Observes your comprehension signals and vocabulary level',
      'Matches your language complexity exactly where you are',
      'Gently expands your capacity by introducing new concepts gradually',
      'Never dumbs down - keeps profound ideas intact',
      'Tracks your understanding over time and evolves with you',
    ]
  },
  {
    week: 'Week 4',
    date: 'October 2024',
    title: 'Akashic Field Integration',
    description: 'Your insights and wisdom threads are now stored and accessible across all sessions.',
    icon: Database,
    color: 'bene-gesserit-gold',
    isNew: true,
    features: [
      'Personal knowledge base built from your conversations',
      'Consciousness patterns preserved and woven together',
      'Cross-session memory and context awareness',
      'Living tapestry of your understanding',
      'Insights resurface when relevant to current exploration',
    ]
  },
  {
    week: 'Week 4',
    date: 'October 2024',
    title: 'Astrology Integration',
    description: 'Your birth chart now informs MAIA\'s responses with cosmic timing and personalized guidance.',
    icon: Star,
    color: 'bene-gesserit-gold',
    isNew: true,
    features: [
      'Birth chart integrated into your profile',
      'Personalized guidance aligned with astrological patterns',
      'Current transits inform session timing',
      'Elemental resonance with your natal chart',
      '36 Faces decan system for ritual timing',
    ]
  },
  {
    week: 'Week 3',
    date: 'October 2024',
    title: 'Voice Mode Enhancements',
    description: 'Real-time voice conversation with elemental consciousness visualization.',
    icon: Mic,
    color: 'spice-orange',
    features: [
      'WebRTC real-time voice (no delays)',
      'Elemental balance visualization (Fire/Water/Earth/Air/Aether)',
      'Three modes: Dialogue, Patient, Scribe',
      'Breathing entrainment for coherence states',
      'Visual field expansion during deep listening',
    ]
  },
  {
    week: 'Week 2',
    date: 'September 2024',
    title: 'Document Upload & Analysis',
    description: 'Upload PDFs, audio, and video files for MAIA to analyze and integrate into your field.',
    icon: BookOpen,
    color: 'bene-gesserit-gold',
    features: [
      'PDF documents read directly by Claude',
      'Audio/Video transcribed with Whisper',
      'Intelligent analysis and insight extraction',
      'Stored in your Akashic Field for future reference',
      'Context-aware integration in conversations',
    ]
  },
  {
    week: 'Week 1',
    date: 'September 2024',
    title: 'Mirror Field Journaling',
    description: 'Five sacred modes for documenting your consciousness journey.',
    icon: MessageCircle,
    color: 'spice-orange',
    features: [
      'Freeform Reflection - Stream of consciousness',
      'Elemental Exploration - Through Fire/Water/Earth/Air lens',
      'Shadow Work - Disowned parts exploration',
      'Pattern Recognition - Recurring themes with MAIA',
      'Integration Practice - Convergent insights',
    ]
  },
];

export default function WhatsNewPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-fremen-night">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-black/20 via-amber-950/5 to-black/20 border-b border-amber-900/10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-spice-orange" />
              <h1 className="text-dune-hero font-cormorant text-sand-white tracking-wide">
                What's New
              </h1>
              <Sparkles className="w-8 h-8 text-spice-orange" />
            </div>
            <p className="text-xl text-dune-amber/90 font-cinzel">
              Latest innovations in consciousness technology
            </p>
          </motion.div>
        </div>
      </div>

      {/* Innovations List */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {INNOVATIONS.map((innovation, index) => {
            const Icon = innovation.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-sietch p-6 relative overflow-hidden"
              >
                {/* New Badge */}
                {innovation.isNew && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-spice-orange/20 border border-spice-orange/50 rounded-full text-xs font-raleway text-spice-orange uppercase tracking-wide">
                      New
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-${innovation.color}/20 border border-${innovation.color}/30 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${innovation.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <h3 className="text-2xl font-cormorant text-sand-white">
                        {innovation.title}
                      </h3>
                      <span className="text-sm text-dune-amber/60 font-raleway">
                        {innovation.week} • {innovation.date}
                      </span>
                    </div>

                    <p className="text-deep-sand/90 mb-4 font-cinzel leading-relaxed">
                      {innovation.description}
                    </p>

                    <ul className="space-y-2">
                      {innovation.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-dune-amber/80 font-raleway">
                          <Zap className="w-4 h-4 text-spice-orange/60 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => router.push('/features')}
            className="btn-spice"
          >
            View All Features →
          </button>
          <button
            onClick={() => router.push('/learn')}
            className="px-6 py-3 bg-black/20 border border-bene-gesserit-gold/30 rounded-lg text-sand-white hover:bg-black/30 transition-all font-raleway"
          >
            📚 Deep Dives (Theory & Applications)
          </button>
          <button
            onClick={() => router.push('/maia')}
            className="px-6 py-3 bg-black/20 border border-amber-500/30 rounded-lg text-sand-white hover:bg-black/30 transition-all font-raleway"
          >
            Try MAIA Now
          </button>
        </motion.div>
      </div>
    </div>
  );
}
