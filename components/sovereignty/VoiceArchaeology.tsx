/**
 * VOICE ARCHAEOLOGY
 *
 * Identifies whose voice speaks in your head during critical moments.
 * Essential deprogramming work - separating internalized voices from true self.
 *
 * Philosophy:
 * - Most "self-talk" isn't the self talking
 * - Critical voices are usually inherited (parent, teacher, media, algorithm)
 * - Integration = dialoguing with the voice, understanding its origin, reclaiming or releasing
 * - True self speaks calmly, without shame or urgency
 *
 * Counter to:
 * - Tavistock (installed trauma responses)
 * - Parental conditioning
 * - Religious/cultural authority internalization
 * - Algorithm-induced anxiety voices
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { VoiceArchaeology as VoiceArchaeologyType } from '@/lib/consciousness/sovereignty-reclamation';

interface VoiceArchaeologyProps {
  userId: string;
  onVoiceIdentified?: (voice: VoiceArchaeologyType) => void;
}

type ArchaeologyStep =
  | 'listen'
  | 'capture'
  | 'tone'
  | 'source'
  | 'trigger'
  | 'dialogue'
  | 'transform'
  | 'complete';

const toneLabels = {
  critical: 'Critical/Harsh',
  encouraging: 'Encouraging/Supportive',
  fearful: 'Fearful/Anxious',
  authoritative: 'Authoritative/Commanding',
  shaming: 'Shaming/Guilt-inducing',
  loving: 'Loving/Gentle',
};

const sourceLabels = {
  mother: 'Mother',
  father: 'Father',
  teacher: 'Teacher/Authority Figure',
  'religious-authority': 'Religious Authority',
  media: 'Media/Cultural Messaging',
  algorithm: 'Social Media Algorithm',
  'true-self': 'True Self',
  unknown: 'Unknown/Investigating',
};

export function VoiceArchaeology({
  userId,
  onVoiceIdentified,
}: VoiceArchaeologyProps) {
  const [step, setStep] = useState<ArchaeologyStep>('listen');
  const [voice, setVoice] = useState<Partial<VoiceArchaeologyType>>({
    userId,
    status: 'identified',
  });

  const handleNext = () => {
    const steps: ArchaeologyStep[] = [
      'listen',
      'capture',
      'tone',
      'source',
      'trigger',
      'dialogue',
      'transform',
      'complete',
    ];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleComplete = () => {
    if (onVoiceIdentified) {
      onVoiceIdentified({
        ...voice,
        id: `voice-${Date.now()}`,
        userId,
        recognizedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: voice.status || 'identified',
      } as VoiceArchaeologyType);
    }
    // Reset
    setVoice({ userId, status: 'identified' });
    setStep('listen');
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🗣️</div>
        <h2 className="text-3xl font-serif text-stone-100 mb-2">
          Voice Archaeology
        </h2>
        <p className="text-stone-400 max-w-xl mx-auto">
          Whose voice speaks in your head? Excavate the internalized voices and
          reclaim your inner authority.
        </p>
      </div>

      {/* Core Principle */}
      {step === 'listen' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-2xl"
        >
          <h3 className="text-lg font-serif text-blue-200 mb-3">
            The Voice That Isn't Yours
          </h3>
          <div className="space-y-2 text-sm text-stone-300">
            <p>
              Most of your "self-talk" isn't your self talking. It's internalized
              voices - parents, teachers, media, algorithms - speaking through you.
            </p>
            <p className="text-blue-300/80 italic">
              Your TRUE voice is calm, doesn't shame, and feels like coming home.
              Everything else is archaeology work.
            </p>
          </div>
        </motion.div>
      )}

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-12">
        {['listen', 'capture', 'tone', 'source', 'trigger', 'dialogue', 'transform', 'complete'].map(
          (s, i) => (
            <div
              key={s}
              className={`flex items-center gap-2 ${i > 0 ? 'ml-2' : ''}`}
            >
              {i > 0 && (
                <div
                  className={`h-0.5 w-5 ${
                    ['listen', 'capture', 'tone', 'source', 'trigger', 'dialogue', 'transform', 'complete'].indexOf(
                      step
                    ) >= i
                      ? 'bg-blue-500'
                      : 'bg-stone-700'
                  }`}
                />
              )}
              <div
                className={`w-3 h-3 rounded-full transition-all ${
                  step === s
                    ? 'bg-blue-500 scale-125'
                    : ['listen', 'capture', 'tone', 'source', 'trigger', 'dialogue', 'transform', 'complete'].indexOf(
                        step
                      ) > i
                    ? 'bg-blue-600'
                    : 'bg-stone-700'
                }`}
              />
            </div>
          )
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 'listen' && <StepListen onNext={handleNext} />}
          {step === 'capture' && (
            <StepCapture voice={voice} setVoice={setVoice} onNext={handleNext} />
          )}
          {step === 'tone' && (
            <StepTone voice={voice} setVoice={setVoice} onNext={handleNext} />
          )}
          {step === 'source' && (
            <StepSource voice={voice} setVoice={setVoice} onNext={handleNext} />
          )}
          {step === 'trigger' && (
            <StepTrigger voice={voice} setVoice={setVoice} onNext={handleNext} />
          )}
          {step === 'dialogue' && (
            <StepDialogue voice={voice} setVoice={setVoice} onNext={handleNext} />
          )}
          {step === 'transform' && (
            <StepTransform voice={voice} setVoice={setVoice} onNext={handleNext} />
          )}
          {step === 'complete' && (
            <StepArchaeologyComplete voice={voice} onComplete={handleComplete} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function StepListen({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          How to Listen for the Voices
        </h3>

        <div className="space-y-4 text-sm text-stone-300">
          <p>Pay attention to your internal dialogue during:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-stone-800/40 rounded-lg">
              <div className="text-blue-300 font-medium mb-1">When you mess up:</div>
              <div className="text-xs text-stone-400">
                "You're such an idiot" or "You always fail"
              </div>
            </div>
            <div className="p-3 bg-stone-800/40 rounded-lg">
              <div className="text-blue-300 font-medium mb-1">
                When you're deciding:
              </div>
              <div className="text-xs text-stone-400">
                "You should..." or "What will people think?"
              </div>
            </div>
            <div className="p-3 bg-stone-800/40 rounded-lg">
              <div className="text-blue-300 font-medium mb-1">
                When you're creating:
              </div>
              <div className="text-xs text-stone-400">
                "Who do you think you are?" or "This isn't good enough"
              </div>
            </div>
            <div className="p-3 bg-stone-800/40 rounded-lg">
              <div className="text-blue-300 font-medium mb-1">
                When you're resting:
              </div>
              <div className="text-xs text-stone-400">
                "You're lazy" or "You should be productive"
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl mt-4">
            <div className="text-indigo-200 font-medium mb-2">The Test:</div>
            <div className="text-xs text-indigo-300/80">
              If a voice creates shame, urgency, or makes you feel small - it's not
              your true self. Your true voice is calm, spacious, and kind.
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-200 font-medium hover:bg-blue-500/30 transition-all"
      >
        I'm Ready to Capture a Voice
      </button>
    </div>
  );
}

function StepCapture({
  voice,
  setVoice,
  onNext,
}: {
  voice: Partial<VoiceArchaeologyType>;
  setVoice: (v: Partial<VoiceArchaeologyType>) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          Capture the Voice
        </h3>
        <p className="text-sm text-stone-400 mb-6">
          Write down EXACTLY what the voice says. Use quotes - as if you're
          transcribing someone speaking.
        </p>

        <textarea
          value={voice.internalStatement || ''}
          onChange={(e) =>
            setVoice({ ...voice, internalStatement: e.target.value })
          }
          placeholder='Example: "You\'re not good enough" or "Everyone will judge you" or "You should be doing more" or "You\'re wasting your life"'
          className="w-full h-32 bg-stone-800/40 border border-stone-700/40 rounded-xl p-4 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-blue-500/50"
        />

        <div className="mt-4 text-xs text-stone-500">
          Tip: The more precise you are, the easier it is to identify whose voice
          this is.
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!voice.internalStatement}
        className="w-full py-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-200 font-medium hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Identify Tone
      </button>
    </div>
  );
}

function StepTone({
  voice,
  setVoice,
  onNext,
}: {
  voice: Partial<VoiceArchaeologyType>;
  setVoice: (v: Partial<VoiceArchaeologyType>) => void;
  onNext: () => void;
}) {
  const tones: Array<VoiceArchaeologyType['tone']> = [
    'critical',
    'encouraging',
    'fearful',
    'authoritative',
    'shaming',
    'loving',
  ];

  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          What's the Tone?
        </h3>
        <p className="text-sm text-stone-400 mb-4">
          The voice says: <span className="text-blue-300 italic">"{voice.internalStatement}"</span>
        </p>
        <p className="text-sm text-stone-400 mb-6">
          How does this voice sound? What's its emotional quality?
        </p>

        <div className="grid grid-cols-2 gap-3">
          {tones.map((tone) => (
            <button
              key={tone}
              onClick={() => setVoice({ ...voice, tone })}
              className={`p-4 rounded-xl border transition-all ${
                voice.tone === tone
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-200'
                  : 'bg-stone-800/20 border-stone-700/30 text-stone-400 hover:border-stone-600/50'
              }`}
            >
              {toneLabels[tone]}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!voice.tone}
        className="w-full py-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-200 font-medium hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Source Identification
      </button>
    </div>
  );
}

function StepSource({
  voice,
  setVoice,
  onNext,
}: {
  voice: Partial<VoiceArchaeologyType>;
  setVoice: (v: Partial<VoiceArchaeologyType>) => void;
  onNext: () => void;
}) {
  const sources: Array<VoiceArchaeologyType['voiceSource']> = [
    'mother',
    'father',
    'teacher',
    'religious-authority',
    'media',
    'algorithm',
    'true-self',
    'unknown',
  ];

  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          Whose Voice Is This?
        </h3>
        <p className="text-sm text-stone-400 mb-6">
          Who originally said this to you? Or who would say this?
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {sources.map((source) => (
            <button
              key={source}
              onClick={() => setVoice({ ...voice, voiceSource: source })}
              className={`p-4 rounded-xl border transition-all ${
                voice.voiceSource === source
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-200'
                  : 'bg-stone-800/20 border-stone-700/30 text-stone-400 hover:border-stone-600/50'
              }`}
            >
              {sourceLabels[source]}
            </button>
          ))}
        </div>

        {voice.voiceSource && voice.voiceSource !== 'true-self' && (
          <div className="space-y-3">
            <label className="text-sm text-stone-400">Specific details:</label>
            <input
              type="text"
              value={voice.sourceDetails || ''}
              onChange={(e) =>
                setVoice({ ...voice, sourceDetails: e.target.value })
              }
              placeholder='Example: "My father when I got a B" or "Catholic school nun" or "Every Instagram influencer"'
              className="w-full bg-stone-800/40 border border-stone-700/40 rounded-xl p-3 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        )}

        {voice.voiceSource === 'true-self' && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="text-green-200 font-medium mb-1">
              This is your true voice:
            </div>
            <div className="text-xs text-green-300/80">
              Celebrate this. Your true voice is calm, loving, and doesn't create
              shame. Keep listening for it.
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={!voice.voiceSource}
        className="w-full py-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-200 font-medium hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Situational Trigger
      </button>
    </div>
  );
}

function StepTrigger({
  voice,
  setVoice,
  onNext,
}: {
  voice: Partial<VoiceArchaeologyType>;
  setVoice: (v: Partial<VoiceArchaeologyType>) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          When Does This Voice Speak?
        </h3>
        <p className="text-sm text-stone-400 mb-6">
          What situations trigger this voice? What makes it speak up?
        </p>

        <textarea
          value={voice.situationalTrigger || ''}
          onChange={(e) =>
            setVoice({ ...voice, situationalTrigger: e.target.value })
          }
          placeholder="Example: 'When I'm about to share my work publicly' or 'Whenever I rest during the day' or 'When someone criticizes me' or 'When I scroll social media'"
          className="w-full h-32 bg-stone-800/40 border border-stone-700/40 rounded-xl p-4 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-blue-500/50"
        />

        <div className="mt-4 text-xs text-stone-500">
          Knowing the trigger helps you recognize the voice before it takes over.
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!voice.situationalTrigger}
        className="w-full py-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-200 font-medium hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Dialogue
      </button>
    </div>
  );
}

function StepDialogue({
  voice,
  setVoice,
  onNext,
}: {
  voice: Partial<VoiceArchaeologyType>;
  setVoice: (v: Partial<VoiceArchaeologyType>) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          Dialogue With the Voice
        </h3>
        <p className="text-sm text-stone-400 mb-4">
          Now that you know whose voice this is and when it speaks, you can choose
          how to work with it.
        </p>

        <div className="space-y-3 mb-6">
          <label className="text-sm text-stone-400">
            Where are you in this process?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { status: 'identified', label: 'Just Identified' },
              { status: 'dialoguing', label: 'In Dialogue' },
              { status: 'integrating', label: 'Integrating' },
              { status: 'dissolved', label: 'Dissolved/Released' },
              { status: 'reclaimed', label: 'Reclaimed/Transformed' },
            ].map(({ status, label }) => (
              <button
                key={status}
                onClick={() =>
                  setVoice({
                    ...voice,
                    status: status as VoiceArchaeologyType['status'],
                  })
                }
                className={`p-3 rounded-xl border text-sm transition-all ${
                  voice.status === status
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-200'
                    : 'bg-stone-800/20 border-stone-700/30 text-stone-400 hover:border-stone-600/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <div className="text-purple-200 font-medium mb-2">Integration Options:</div>
          <div className="text-xs text-purple-300/80 space-y-1">
            <p>• <strong>Dissolved:</strong> The voice loses power when you see its source</p>
            <p>• <strong>Reclaimed:</strong> Sometimes the voice has wisdom beneath the harshness - you transform it</p>
            <p>• <strong>Dialoguing:</strong> You're in conversation with it, understanding it</p>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!voice.status || voice.status === 'identified'}
        className="w-full py-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-200 font-medium hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Transformation
      </button>
    </div>
  );
}

function StepTransform({
  voice,
  setVoice,
  onNext,
}: {
  voice: Partial<VoiceArchaeologyType>;
  setVoice: (v: Partial<VoiceArchaeologyType>) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          How This Voice Transforms
        </h3>
        <p className="text-sm text-stone-400 mb-4">
          Original voice: <span className="text-red-300 italic">"{voice.internalStatement}"</span>
        </p>
        <p className="text-sm text-stone-400 mb-6">
          If you're reclaiming/transforming this voice, what does it become? What's
          the wisdom beneath the harshness?
        </p>

        <textarea
          value={voice.transformedVoice || ''}
          onChange={(e) =>
            setVoice({ ...voice, transformedVoice: e.target.value })
          }
          placeholder='Example: "You\'re not good enough" becomes "I want you to grow and become your fullest self" OR "You should be productive" dissolves into nothing - there was no wisdom, just conditioning'
          className="w-full h-32 bg-stone-800/40 border border-stone-700/40 rounded-xl p-4 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-blue-500/50"
        />

        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div className="text-green-200 font-medium mb-2">The Shift:</div>
          <div className="text-xs text-green-300/80">
            Once you see whose voice this is, it loses its power. You can choose
            whether to keep it (transformed) or release it entirely.
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-200 font-medium hover:bg-blue-500/30 transition-all"
      >
        Complete Archaeology
      </button>
    </div>
  );
}

function StepArchaeologyComplete({
  voice,
  onComplete,
}: {
  voice: Partial<VoiceArchaeologyType>;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/40 rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🗣️✨</div>
          <h3 className="text-2xl font-serif text-stone-100 mb-2">
            Voice Excavated
          </h3>
          <p className="text-stone-400">
            You've identified whose voice this is. That awareness is the immunity.
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <div className="p-4 bg-stone-900/40 rounded-xl">
            <div className="text-stone-500 mb-1">The voice says:</div>
            <div className="text-red-300 italic">"{voice.internalStatement}"</div>
          </div>

          <div className="text-center text-2xl">↓</div>

          <div className="p-4 bg-stone-900/40 rounded-xl">
            <div className="text-stone-500 mb-1">This is actually:</div>
            <div className="text-blue-300">
              {voice.voiceSource && sourceLabels[voice.voiceSource]}
            </div>
            {voice.sourceDetails && (
              <div className="text-stone-400 text-xs mt-1">{voice.sourceDetails}</div>
            )}
          </div>

          {voice.transformedVoice && (
            <>
              <div className="text-center text-2xl">↓</div>
              <div className="p-4 bg-stone-900/40 rounded-xl">
                <div className="text-stone-500 mb-1">Transformed into:</div>
                <div className="text-green-300">{voice.transformedVoice}</div>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
          <div className="text-sm text-amber-200">
            Now when you hear this voice, you'll recognize it instantly. It won't
            have the same power. This is sovereignty.
          </div>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full py-4 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-200 font-medium hover:bg-blue-500/30 transition-all"
      >
        Excavate Another Voice
      </button>
    </div>
  );
}
