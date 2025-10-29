'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Heart, Zap, Cloud, Target } from 'lucide-react';

interface WeatherPattern {
  id: string;
  weatherType: string;
  transitPlanet: string;
  natalPlanet: string;
  aspect: string;
  orb: number;
  intensity: string;
  archetypalTerrain: {
    transitPrinciple: string;
    natalPrinciple: string;
    dynamic: string;
    questions: string[];
  };
  processImpact: {
    impactType: string;
    description: string;
  };
}

interface WeatherPatternExplainerProps {
  pattern: WeatherPattern;
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

/**
 * Everyday Language Explainer for Archetypal Weather Patterns
 *
 * Translates archetypal/astrological language into conversational, accessible explanations
 * that help users understand what's happening in their lives RIGHT NOW.
 */
export function WeatherPatternExplainer({ pattern, isOpen, onClose, userName }: WeatherPatternExplainerProps) {

  // Generate everyday explanation based on pattern
  const getEverydayExplanation = () => {
    const { weatherType, transitPlanet, natalPlanet, aspect, intensity } = pattern;

    // Pattern-specific everyday translations
    const explanations: Record<string, any> = {
      // Uranus-Moon Opposition (Lightning to emotional foundation)
      'uranus-moon-opposition': {
        title: "Life is Shaking Things Up",
        subtitle: "Your inner world is being disrupted—and that's okay",
        icon: Zap,
        color: 'from-yellow-500 to-orange-500',
        whatIsThis: `Right now, your emotional life—the way you feel safe, secure, and connected—is getting jolted. It's like someone pulled the rug out from under your normal routines and comfort zones.`,
        whyItMatters: `This isn't random chaos. Something in you is ready to break free from old patterns that no longer serve you. The disruption is actually awakening you to a new way of being.`,
        whatYouMightNotice: [
          "Sudden mood swings or emotional surprises",
          "Feeling restless in situations that used to feel comfortable",
          "An urge to break routines or rebel against what's expected",
          "Unexpected emotional reactions to seemingly small things",
          "A sense of liberation mixed with anxiety"
        ],
        howToWorkWithIt: [
          {
            do: "Let yourself feel unstable—don't force yourself to be 'fine'",
            why: "Trying to maintain stability right now actually blocks the breakthrough"
          },
          {
            do: "Ask: 'What old security pattern is ready to die?'",
            why: "This helps you see the disruption as transformation, not just chaos"
          },
          {
            do: "Experiment with small acts of emotional freedom",
            why: "Meeting the energy with conscious choice helps you ride the lightning instead of getting fried"
          },
          {
            do: "Give yourself permission to NOT have it all figured out",
            why: "The point isn't clarity—it's liberation from old certainties"
          }
        ],
        realLifeExamples: [
          "Suddenly questioning a long-term relationship that felt 'safe but dead'",
          "Feeling called to quit a stable job even though it makes no logical sense",
          "Having emotional breakthroughs in unexpected moments",
          "Realizing you've been living according to someone else's expectations",
          "Feeling simultaneously terrified and alive for the first time in years"
        ],
        commonMistakes: [
          {
            mistake: "Trying to 'get back to normal'",
            better: "There's no going back—only through. The old normal was already dying."
          },
          {
            mistake: "Thinking something is 'wrong' with you",
            better: "Nothing is wrong—you're experiencing a necessary disruption for growth."
          },
          {
            mistake: "Making permanent decisions immediately",
            better: "Feel the impulse, understand it, but don't blow up your life yet. The energy will clarify."
          }
        ],
        timeframe: "This weather pattern is EXTREME intensity—expect 2-4 weeks of peak disruption, with echoes for 2-3 months."
      },

      // Neptune-Mercury Trine (Fog in thinking/communication)
      'neptune-mercury-trine': {
        title: "Your Mind is Dissolving into Something Bigger",
        subtitle: "Logic is softening—intuition is rising",
        icon: Cloud,
        color: 'from-blue-400 to-purple-500',
        whatIsThis: `Your normal way of thinking and communicating is getting fuzzy. Words might fail you. Linear logic might feel less interesting than sensing, feeling, or just knowing without knowing how you know.`,
        whyItMatters: `You're being invited beyond the limits of language into a more direct, intuitive, mystical way of perceiving. This is soul-level communication trying to emerge.`,
        whatYouMightNotice: [
          "Difficulty articulating thoughts that used to be clear",
          "Feeling like you're 'spacing out' more than usual",
          "Sudden creative or intuitive downloads",
          "Dreams feeling more vivid and meaningful",
          "Preferring silence or music over conversation"
        ],
        howToWorkWithIt: [
          {
            do: "Trust what you sense before you can explain it",
            why: "This transit is teaching you non-verbal knowing"
          },
          {
            do: "Journal or create art without trying to 'make sense'",
            why: "The fog clears when you stop demanding clarity"
          },
          {
            do: "Notice what emerges when you soften your grip on logic",
            why: "The answers are coming through the spaces between thoughts"
          }
        ],
        realLifeExamples: [
          "Having a clear knowing about someone's feelings without them saying anything",
          "Writing or creating something that surprises you with its depth",
          "Feeling more connected to nature, music, or art than to people",
          "Getting answers in dreams or during walks instead of through thinking"
        ],
        commonMistakes: [
          {
            mistake: "Thinking you're becoming 'scattered' or 'losing it'",
            better: "You're expanding—not losing—your perceptual range."
          },
          {
            mistake: "Forcing yourself to be concrete and practical",
            better: "This is a time to float, not to anchor. Trust the fog."
          }
        ],
        timeframe: "Intense phase: 1-3 weeks. Subtle influence: 2-3 months."
      },

      // Saturn-Sun Square (Pressure on identity)
      'saturn-sun-square': {
        title: "Life is Testing What You're Made Of",
        subtitle: "Your identity is being refined under pressure",
        icon: Target,
        color: 'from-gray-600 to-blue-700',
        whatIsThis: `Right now, you're probably feeling tested. Things might feel harder than usual. Your sense of who you are and what you're meant to do is being challenged, compressed, refined.`,
        whyItMatters: `This isn't punishment—it's a cosmic compression chamber. Whatever is false, inflated, or borrowed in your identity falls away. What remains is the real you.`,
        whatYouMightNotice: [
          "Feeling blocked or slowed down in areas that used to flow",
          "Questioning your life direction or purpose",
          "Increased self-doubt or imposter syndrome",
          "A sense of being tested by circumstances",
          "Feeling older, wiser, or more serious than usual"
        ],
        howToWorkWithIt: [
          {
            do: "Ask: 'What false version of me is being exposed?'",
            why: "Saturn strips away pretense—this is actually a gift"
          },
          {
            do: "Do the hard work even when it feels thankless",
            why: "This transit rewards integrity and persistence, not shortcuts"
          },
          {
            do: "Let go of needing external validation",
            why: "The compression is teaching you to validate yourself"
          },
          {
            do: "Be patient with the process—it's building something lasting",
            why: "Saturn's gifts come slowly but they're permanent"
          }
        ],
        realLifeExamples: [
          "Feeling underappreciated at work while knowing you're doing important work",
          "Realizing you've been living up to others' expectations instead of your own",
          "Hitting obstacles that force you to prove your commitment",
          "Experiencing delays that actually deepen your skill and wisdom"
        ],
        commonMistakes: [
          {
            mistake: "Giving up when things get hard",
            better: "The hardness is the point—it's forging something real in you."
          },
          {
            mistake: "Taking the pressure personally",
            better: "Everyone goes through this transit—it's a universal initiatory experience."
          }
        ],
        timeframe: "Peak intensity: 3-6 weeks. Total influence: 3-6 months with several exact hits."
      },

      // Pluto squares (Storm - creative friction/growth through challenge)
      'pluto-square': {
        title: "You're Being Pushed to Transform",
        subtitle: "Creative friction is forcing growth",
        icon: Zap,
        color: 'from-purple-700 to-red-600',
        whatIsThis: `Something or someone is challenging you intensely right now. There's friction, tension, maybe even power struggles. It feels like you're being forced to change.`,
        whyItMatters: `Pluto doesn't do surface-level shifts. This is about fundamental transformation—death of old patterns and rebirth into something more powerful and authentic.`,
        whatYouMightNotice: [
          "Power dynamics becoming more obvious (in relationships, work, etc.)",
          "Feeling obsessed or intensely focused on certain issues",
          "Hidden things coming to light (yours or others')",
          "Sensing that something needs to die for you to grow",
          "Feeling like you're in a pressure cooker"
        ],
        howToWorkWithIt: [
          {
            do: "Face what you've been avoiding",
            why: "Pluto exposes what's hidden—resistance only increases the pressure"
          },
          {
            do: "Ask: 'What am I being called to let die?'",
            why: "Something needs to end for transformation to begin"
          },
          {
            do: "Use the intensity as fuel for deep change",
            why: "This energy can destroy OR transform—your choice determines which"
          }
        ],
        realLifeExamples: [
          "Ending a relationship that's been slowly dying",
          "Finally addressing a wound you've been carrying for years",
          "Discovering your own power after feeling powerless",
          "Completely changing your life direction"
        ],
        commonMistakes: [
          {
            mistake: "Trying to control or manipulate the situation",
            better: "Pluto wins. Surrender to the transformation and guide it consciously."
          },
          {
            mistake: "Staying in situations that are clearly dying",
            better: "Let it die. The resurrection comes AFTER death, not before."
          }
        ],
        timeframe: "Extreme intensity: 2-4 weeks. Total transformation cycle: 6-18 months with multiple phases."
      }
    };

    // Generate key from pattern
    const key = `${transitPlanet.toLowerCase()}-${natalPlanet.toLowerCase()}-${aspect.toLowerCase()}`;

    // Try to find specific explanation, fall back to generic
    const specific = explanations[key];
    if (specific) return specific;

    // Generic explanation based on weather type
    const genericByType: Record<string, any> = {
      lightning: {
        title: "Sudden Awakening Energy",
        subtitle: "Something is about to shift rapidly",
        icon: Zap,
        color: 'from-yellow-400 to-orange-500',
        whatIsThis: `Lightning energy means sudden change, breakthrough, or awakening. What felt stable might suddenly shift.`,
        whyItMatters: `These disruptions aren't random—they're freeing you from patterns that have become too rigid.`
      },
      fog: {
        title: "Dissolving Boundaries",
        subtitle: "Things are softening, becoming less defined",
        icon: Cloud,
        color: 'from-blue-300 to-purple-400',
        whatIsThis: `Fog energy makes things less clear, more mystical. Logic softens, intuition rises.`,
        whyItMatters: `Sometimes we need to not-know in order to know in a deeper way.`
      },
      storm: {
        title: "Intense Transformation",
        subtitle: "Creative friction is pushing you to grow",
        icon: Zap,
        color: 'from-purple-600 to-red-500',
        whatIsThis: `Storm energy brings intensity, challenge, and the potential for profound growth.`,
        whyItMatters: `The friction is transformative—it's making you stronger and more authentic.`
      },
      'pressure-system': {
        title: "Testing & Refinement",
        subtitle: "You're being compressed into your essential form",
        icon: Target,
        color: 'from-gray-600 to-blue-600',
        whatIsThis: `Pressure system energy tests you, slows you down, and refines what's real.`,
        whyItMatters: `What survives this pressure is real, lasting, and truly yours.`
      }
    };

    return genericByType[weatherType] || {
      title: "Archetypal Weather Pattern",
      subtitle: "Energy shifting in your consciousness field",
      icon: HelpCircle,
      color: 'from-amber-500 to-amber-700',
      whatIsThis: `This is an active pattern in your consciousness field right now.`,
      whyItMatters: `It's shaping how you experience life at this moment.`
    };
  };

  const explanation = getEverydayExplanation();
  const Icon = explanation.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[90vh] bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-2xl shadow-2xl overflow-hidden z-50 border border-white/10"
          >
            {/* Header with gradient */}
            <div className={`relative bg-gradient-to-r ${explanation.color} p-6`}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Icon className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {explanation.title}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {explanation.subtitle}
                  </p>
                  {userName && (
                    <p className="text-white/60 text-xs mt-2">
                      What this means for you, {userName}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
              {/* What is This? */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="text-2xl">🔍</span>
                  What's Happening Right Now?
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {explanation.whatIsThis}
                </p>
              </div>

              {/* Why It Matters */}
              {explanation.whyItMatters && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-400" />
                    Why This Matters
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {explanation.whyItMatters}
                  </p>
                </div>
              )}

              {/* What You Might Notice */}
              {explanation.whatYouMightNotice && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-2xl">👁️</span>
                    What You Might Notice
                  </h3>
                  <ul className="space-y-2">
                    {explanation.whatYouMightNotice.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-white/70">
                        <span className="text-amber-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* How to Work With It */}
              {explanation.howToWorkWithIt && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-2xl">🛠️</span>
                    How to Work With This Energy
                  </h3>
                  <div className="space-y-4">
                    {explanation.howToWorkWithIt.map((item: any, i: number) => (
                      <div key={i} className="bg-black/30 rounded-lg p-4 border border-white/5">
                        <p className="text-white font-medium mb-2">
                          ✅ {item.do}
                        </p>
                        <p className="text-white/60 text-sm">
                          <span className="text-white/40">Why: </span>
                          {item.why}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Real Life Examples */}
              {explanation.realLifeExamples && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    Real-Life Examples
                  </h3>
                  <ul className="space-y-2">
                    {explanation.realLifeExamples.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-white/70 bg-white/5 rounded p-3">
                        <span className="text-blue-400">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common Mistakes */}
              {explanation.commonMistakes && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    Common Mistakes (and What to Do Instead)
                  </h3>
                  <div className="space-y-3">
                    {explanation.commonMistakes.map((item: any, i: number) => (
                      <div key={i} className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <p className="text-red-300 font-medium mb-2">
                          ❌ {item.mistake}
                        </p>
                        <p className="text-green-300 text-sm">
                          ✅ {item.better}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeframe */}
              {explanation.timeframe && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">⏱️</span>
                    How Long Does This Last?
                  </h3>
                  <p className="text-white/70 text-sm">
                    {explanation.timeframe}
                  </p>
                </div>
              )}

              {/* Technical Info (collapsible) */}
              <details className="bg-black/20 rounded-lg p-4 border border-white/5">
                <summary className="text-white/60 text-sm cursor-pointer hover:text-white/80 transition-colors">
                  📊 Technical Details (for astrology nerds)
                </summary>
                <div className="mt-3 space-y-2 text-white/50 text-xs">
                  <p><strong>Transit:</strong> {pattern.transitPlanet} {pattern.aspect} natal {pattern.natalPlanet}</p>
                  <p><strong>Orb:</strong> {pattern.orb.toFixed(2)}° ({pattern.intensity} intensity)</p>
                  <p><strong>Archetypal Dynamic:</strong> {pattern.archetypalTerrain.dynamic}</p>
                  <p><strong>Process Impact:</strong> {pattern.processImpact.description}</p>
                </div>
              </details>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
