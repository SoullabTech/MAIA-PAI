'use client';

/**
 * THE FORGE - Member Dashboard
 *
 * Daily portal to your practices with wisdom mana.
 * "This can help bring us together across our differences around what we share in common - we alchemize."
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Droplet, Zap, Moon, Sparkles, Flame, Mountain, Wind, ArrowLeft, BookOpen } from 'lucide-react';
import { getWisdomForTimeOfDay, WisdomTeaching } from '@/lib/forge/wisdom-library';

export default function ForgeDashboard() {
  const router = useRouter();
  const [wisdom, setWisdom] = useState<WisdomTeaching | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Get wisdom mana for current time
    const dailyWisdom = getWisdomForTimeOfDay();
    setWisdom(dailyWisdom);

    // Update time display
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
      setCurrentTime(`${timeString} • ${dateString}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getElementIcon = (element: string) => {
    switch (element) {
      case 'fire': return <Flame className="w-5 h-5" />;
      case 'water': return <Droplet className="w-5 h-5" />;
      case 'earth': return <Mountain className="w-5 h-5" />;
      case 'air': return <Wind className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getElementColor = (element: string) => {
    switch (element) {
      case 'fire': return 'from-red-500/20 via-orange-500/10';
      case 'water': return 'from-blue-500/20 via-cyan-500/10';
      case 'earth': return 'from-amber-500/20 via-yellow-500/10';
      case 'air': return 'from-purple-500/20 via-violet-500/10';
      default: return 'from-emerald-500/20 via-teal-500/10';
    }
  };

  const getTraditionBadgeColor = (tradition: string) => {
    switch (tradition) {
      case 'taoist': return 'bg-red-900/40 border-red-400/30 text-red-300';
      case 'buddhist': return 'bg-orange-900/40 border-orange-400/30 text-orange-300';
      case 'tibetan': return 'bg-purple-900/40 border-purple-400/30 text-purple-300';
      case 'indigenous': return 'bg-amber-900/40 border-amber-400/30 text-amber-300';
      case 'jungian': return 'bg-indigo-900/40 border-indigo-400/30 text-indigo-300';
      case 'mystical': return 'bg-violet-900/40 border-violet-400/30 text-violet-300';
      case 'regression': return 'bg-blue-900/40 border-blue-400/30 text-blue-300';
      case 'shamanic': return 'bg-green-900/40 border-green-400/30 text-green-300';
      default: return 'bg-emerald-900/40 border-emerald-400/30 text-emerald-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 relative overflow-hidden">
      {/* Jade consciousness field */}
      <div className="fixed inset-0 opacity-[0.15] pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(2px 2px at 10% 20%, #6ee7b7, transparent),
                             radial-gradient(1px 1px at 80% 80%, #34d399, transparent),
                             radial-gradient(2px 2px at 30% 60%, #10b981, transparent),
                             radial-gradient(1px 1px at 70% 30%, #6ee7b7, transparent)`,
            backgroundSize: '200px 200px',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Pulsing jade field */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-emerald-500/20 via-teal-600/10 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="border-b border-emerald-500/20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/forge')}
                  className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors text-emerald-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-white">The Forge</h1>
                  <p className="text-sm text-emerald-300/70">{currentTime}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          {/* Wisdom Mana */}
          {wisdom && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-emerald-900/60 via-teal-900/50 to-emerald-800/60 backdrop-blur-2xl border-2 border-emerald-400/30 rounded-2xl p-8 shadow-2xl shadow-emerald-950/80 overflow-hidden group">
                {/* Elemental glow */}
                <div className={`absolute inset-0 bg-gradient-radial ${getElementColor(wisdom.element)} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Light refraction */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20"
                  animate={{
                    background: [
                      'radial-gradient(circle at 0% 0%, rgba(110,231,183,0.3) 0%, transparent 50%)',
                      'radial-gradient(circle at 100% 100%, rgba(110,231,183,0.3) 0%, transparent 50%)',
                      'radial-gradient(circle at 0% 0%, rgba(110,231,183,0.3) 0%, transparent 50%)',
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-800/40 rounded-xl border border-emerald-400/30">
                        <Sparkles className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-emerald-300">Wisdom Mana</h2>
                        <p className="text-sm text-emerald-400/70">Nourishment for your journey</p>
                      </div>
                    </div>

                    {/* Elemental indicator */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-900/40 border border-emerald-400/30 rounded-lg">
                      <div className="text-emerald-400">
                        {getElementIcon(wisdom.element)}
                      </div>
                      <div className="text-xs">
                        <div className="text-emerald-300 font-medium capitalize">
                          {wisdom.element} • {wisdom.phase}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-2xl md:text-3xl font-serif text-emerald-50 leading-relaxed mb-6 italic">
                    "{wisdom.quote}"
                  </blockquote>

                  {/* Attribution */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-emerald-300 font-medium">— {wisdom.teacher}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-xl ${getTraditionBadgeColor(wisdom.tradition)} capitalize`}>
                      {wisdom.tradition}
                    </span>
                    {wisdom.source && (
                      <span className="text-emerald-400/60 text-sm italic">
                        {wisdom.source}
                      </span>
                    )}
                  </div>

                  {/* Explore tradition link (future) */}
                  <div className="mt-6 pt-6 border-t border-emerald-400/20">
                    <button
                      className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors text-sm font-medium group/link"
                      onClick={() => {
                        // Future: navigate to tradition portal
                        console.log(`Exploring ${wisdom.tradition} tradition`);
                      }}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Explore {wisdom.tradition === 'mystical' ? 'this teaching' : `${wisdom.tradition} wisdom`}</span>
                      <span className="opacity-0 group-hover/link:opacity-100 transition-opacity">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Daily Practices */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Today's Practices</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Morning Attunement */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                onClick={() => router.push('/forge/morning-attunement')}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative text-left bg-gradient-to-br from-emerald-900/60 via-teal-900/50 to-emerald-800/60 backdrop-blur-2xl border-2 border-emerald-400/30 rounded-2xl p-6 hover:border-emerald-300/50 transition-all shadow-2xl shadow-emerald-950/80 group overflow-hidden"
              >
                {/* Inner glow */}
                <div className="absolute inset-0 bg-gradient-radial from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-emerald-800/40 rounded-xl border border-emerald-400/30">
                      <Droplet className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Morning Attunement</h3>
                      <p className="text-sm text-emerald-300/70">5-10 minutes</p>
                    </div>
                  </div>
                  <p className="text-emerald-200 text-sm">
                    Conscious arrival • Spiral assessment • Intention setting
                  </p>
                </div>
              </motion.button>

              {/* Midday Catalyst */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                onClick={() => router.push('/forge/midday-catalyst')}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative text-left bg-gradient-to-br from-orange-900/60 via-amber-900/50 to-orange-800/60 backdrop-blur-2xl border-2 border-orange-400/30 rounded-2xl p-6 hover:border-orange-300/50 transition-all shadow-2xl shadow-orange-950/80 group overflow-hidden"
              >
                {/* Inner glow */}
                <div className="absolute inset-0 bg-gradient-radial from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-orange-800/40 rounded-xl border border-orange-400/30">
                      <Zap className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Midday Catalyst</h3>
                      <p className="text-sm text-orange-300/70">3-5 minutes</p>
                    </div>
                  </div>
                  <p className="text-orange-200 text-sm">
                    Reality check • Momentum assessment • Course correction
                  </p>
                </div>
              </motion.button>

              {/* Evening Integration */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                onClick={() => router.push('/forge/evening-integration')}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative text-left bg-gradient-to-br from-purple-900/60 via-violet-900/50 to-purple-800/60 backdrop-blur-2xl border-2 border-purple-400/30 rounded-2xl p-6 hover:border-purple-300/50 transition-all shadow-2xl shadow-purple-950/80 group overflow-hidden"
              >
                {/* Inner glow */}
                <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-800/40 rounded-xl border border-purple-400/30">
                      <Moon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Evening Integration</h3>
                      <p className="text-sm text-purple-300/70">5-10 minutes</p>
                    </div>
                  </div>
                  <p className="text-purple-200 text-sm">
                    Harvest • Release • Integration • Rest
                  </p>
                </div>
              </motion.button>
            </div>
          </div>

          {/* About elemental alchemy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-emerald-900/40 via-teal-900/30 to-emerald-800/40 backdrop-blur-xl border border-emerald-400/20 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-emerald-300 mb-3">Elemental Alchemy</h3>
            <p className="text-emerald-200/80 text-sm leading-relaxed">
              Every wisdom tradition speaks the language of elemental transformation. Fire, Water, Earth, Air - these are the universal patterns of consciousness evolution. The Forge brings traditions together around what we share in common, honoring both unity and unique expression.
            </p>
            <p className="text-emerald-200/80 text-sm leading-relaxed mt-3 italic">
              "This can help bring us together across our differences around what we share in common - we alchemize." — Kelly
            </p>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
