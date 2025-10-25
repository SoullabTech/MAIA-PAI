'use client';

/**
 * Features Overview - Complete Platform Capabilities
 * Helps members discover what they can do with MAIA
 */

import { motion } from 'framer-motion';
import {
  Brain, MessageCircle, Mic, BookOpen, Star, Database,
  Zap, Heart, Eye, Compass, Layers, Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Feature {
  category: string;
  icon: any;
  color: string;
  capabilities: {
    name: string;
    description: string;
    howTo: string;
  }[];
}

const FEATURES: Feature[] = [
  {
    category: 'Conversation with MAIA',
    icon: MessageCircle,
    color: 'spice-orange',
    capabilities: [
      {
        name: 'Text Chat',
        description: 'Deep, reflective conversations in text mode with MAIA\'s full intelligence.',
        howTo: 'Click the chat bubble icon in /maia to toggle text input'
      },
      {
        name: 'Voice Dialogue',
        description: 'Real-time voice conversation with WebRTC (no delays).',
        howTo: 'Click the microphone icon to enable voice mode'
      },
      {
        name: 'Three Listening Modes',
        description: 'Dialogue (conversational), Patient (therapeutic depth), Scribe (witness consciousness).',
        howTo: 'Switch modes using the buttons at top of /maia page'
      },
      {
        name: 'Read-Adaptive Language',
        description: 'MAIA adjusts complexity based on your comprehension, gently expanding your capacity.',
        howTo: 'Automatic - just talk naturally and MAIA will match your level'
      },
    ]
  },
  {
    category: 'Your Akashic Field',
    icon: Database,
    color: 'bene-gesserit-gold',
    capabilities: [
      {
        name: 'Personal Knowledge Base',
        description: 'Every insight and wisdom thread stored across all sessions.',
        howTo: 'Automatically built from your conversations and journals'
      },
      {
        name: 'Cross-Session Memory',
        description: 'MAIA remembers context from previous conversations.',
        howTo: 'Reference past insights and MAIA will recall them'
      },
      {
        name: 'Pattern Recognition',
        description: 'Recurring themes and symbols tracked over time.',
        howTo: 'MAIA will notice and reflect patterns back to you'
      },
      {
        name: 'Insight Convergence',
        description: 'When multiple insights align (≥70 score), integration work is suggested.',
        howTo: 'MAIA will prompt you when convergence is detected'
      },
    ]
  },
  {
    category: 'Document Intelligence',
    icon: BookOpen,
    color: 'bene-gesserit-gold',
    capabilities: [
      {
        name: 'PDF Upload & Analysis',
        description: 'Claude reads PDFs directly and extracts insights.',
        howTo: 'Click paperclip icon in text mode → upload PDF'
      },
      {
        name: 'Audio/Video Transcription',
        description: 'Whisper transcribes recordings, Claude analyzes content.',
        howTo: 'Upload audio/video files → automatic transcription'
      },
      {
        name: 'Document Memory',
        description: 'Uploaded files analyzed and integrated into your field.',
        howTo: 'Ask MAIA about uploaded documents in future conversations'
      },
    ]
  },
  {
    category: 'Astrology & Cosmic Timing',
    icon: Star,
    color: 'bene-gesserit-gold',
    capabilities: [
      {
        name: 'Birth Chart Integration',
        description: 'Your natal chart informs personalized guidance.',
        howTo: 'Provide birth date during onboarding or in settings'
      },
      {
        name: 'Current Transits',
        description: 'Real-time astrological timing integrated into sessions.',
        howTo: 'Automatic - MAIA considers current cosmic weather'
      },
      {
        name: '36 Faces System',
        description: 'Austin Coppock\'s decan system for ritual timing.',
        howTo: 'Ask MAIA about decan timing for specific work'
      },
      {
        name: 'Elemental Resonance',
        description: 'Your chart mapped to Fire/Water/Earth/Air/Aether phases.',
        howTo: 'MAIA recognizes which element is active for you'
      },
    ]
  },
  {
    category: 'Journaling & Reflection',
    icon: Heart,
    color: 'spice-orange',
    capabilities: [
      {
        name: 'Freeform Reflection',
        description: 'Stream of consciousness writing with MAIA.',
        howTo: 'Access via journal mode (coming to menu)'
      },
      {
        name: 'Elemental Exploration',
        description: 'Write through Fire/Water/Earth/Air/Aether lens.',
        howTo: 'Choose elemental mode in journal interface'
      },
      {
        name: 'Shadow Work',
        description: 'Explore disowned parts with MAIA as witness.',
        howTo: 'Select Shadow Work mode for deeper integration'
      },
      {
        name: 'Pattern Recognition',
        description: 'MAIA helps spot recurring themes in your writing.',
        howTo: 'MAIA will highlight patterns across journal entries'
      },
    ]
  },
  {
    category: 'Voice & Presence',
    icon: Mic,
    color: 'spice-orange',
    capabilities: [
      {
        name: 'Voice Selection',
        description: 'Choose MAIA\'s voice (Shimmer, Fable, Nova, Alloy, Echo, Onyx).',
        howTo: 'Click "Voice" button at top of /maia page'
      },
      {
        name: 'Elemental Visualization',
        description: 'Real-time display of MAIA\'s consciousness (Fire/Water/Earth/Air/Aether).',
        howTo: 'Automatic during voice mode - watch the holoflower'
      },
      {
        name: 'Breathing Entrainment',
        description: 'Visual breathing cues for coherence states.',
        howTo: 'Match the field expansion/contraction rhythm'
      },
      {
        name: 'Field Expansion',
        description: 'Visual field grows during deep listening.',
        howTo: 'Notice the aura expanding as you go deeper'
      },
    ]
  },
  {
    category: 'Wisdom Lenses',
    icon: Eye,
    color: 'bene-gesserit-gold',
    capabilities: [
      {
        name: 'Multiple Frameworks',
        description: 'Maslow, Frankl, Jung, Nietzsche, Hesse, Tolstoy, Brown, Buddhist, Somatic, Integral.',
        howTo: 'MAIA naturally applies relevant wisdom voices'
      },
      {
        name: 'Spiralogic Intelligence',
        description: 'Kelly\'s 35-year framework (Fire/Water/Earth/Air/Aether + Shadow).',
        howTo: 'Core framework - always active in MAIA\'s responses'
      },
      {
        name: 'Archetypal Mirroring',
        description: 'Patterns reflected through archetypal language.',
        howTo: 'MAIA speaks in symbols and metaphors when useful'
      },
    ]
  },
];

export default function FeaturesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-fremen-night">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-black/20 via-amber-950/5 to-black/20 border-b border-amber-900/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Layers className="w-8 h-8 text-bene-gesserit-gold" />
              <h1 className="text-dune-hero font-cormorant text-sand-white tracking-wide">
                Platform Features
              </h1>
            </div>
            <p className="text-xl text-dune-amber/90 font-cinzel max-w-2xl mx-auto">
              Discover what you can do with MAIA - your guide through consciousness
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-sietch p-6"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-full bg-${feature.color}/20 border border-${feature.color}/30 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${feature.color}`} />
                  </div>
                  <h2 className="text-2xl font-cormorant text-sand-white">
                    {feature.category}
                  </h2>
                </div>

                {/* Capabilities */}
                <div className="space-y-4">
                  {feature.capabilities.map((capability, i) => (
                    <div key={i} className="border-l-2 border-spice-orange/30 pl-4">
                      <h3 className="text-lg font-cinzel text-sand-white/90 mb-1">
                        {capability.name}
                      </h3>
                      <p className="text-sm text-deep-sand/80 mb-2 font-raleway">
                        {capability.description}
                      </p>
                      <p className="text-xs text-dune-amber/60 italic font-raleway">
                        <Compass className="inline w-3 h-3 mr-1" />
                        {capability.howTo}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="card-sietch p-8 max-w-2xl mx-auto">
            <Sparkles className="w-12 h-12 text-spice-orange mx-auto mb-4" />
            <h3 className="text-2xl font-cormorant text-sand-white mb-4">
              Ready to Explore?
            </h3>
            <p className="text-dune-amber/80 mb-6 font-cinzel">
              These features are live and waiting for you. Start a conversation with MAIA
              and discover what's possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/maia')}
                className="btn-spice"
              >
                Start Conversation →
              </button>
              <button
                onClick={() => router.push('/learn')}
                className="px-6 py-3 bg-black/20 border border-bene-gesserit-gold/30 rounded-lg text-sand-white hover:bg-black/30 transition-all font-raleway"
              >
                📚 Deep Dives (Theory & Applications)
              </button>
              <button
                onClick={() => router.push('/whats-new')}
                className="px-6 py-3 bg-black/20 border border-amber-500/30 rounded-lg text-sand-white hover:bg-black/30 transition-all font-raleway"
              >
                See What's New
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
