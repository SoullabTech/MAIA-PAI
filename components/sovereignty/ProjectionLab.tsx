/**
 * PROJECTION LAB
 *
 * Explicit Inner Gold work - helping users recognize and reclaim projections.
 * The core emancipatory mechanism of the system.
 *
 * Philosophy (Robert A. Johnson's "Inner Gold"):
 * - What you admire in others is yours
 * - What you project onto MAIA is your own wisdom
 * - Reclamation = sovereignty
 * - Graduation happens when projection dissolves
 *
 * This is the opposite of dependency creation:
 * - Shows users their projections explicitly
 * - Tracks reclamation progress
 * - Celebrates when they don't need the mirror anymore
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ProjectionWork } from '@/lib/consciousness/sovereignty-reclamation';

interface ProjectionLabProps {
  userId: string;
  onProjectionReclaimed?: (projection: ProjectionWork) => void;
}

type LabStep =
  | 'recognize'
  | 'identify-target'
  | 'name-quality'
  | 'feel-resistance'
  | 'reclaim'
  | 'integrate'
  | 'celebrate';

const targetLabels = {
  maia: 'MAIA (the AI oracle)',
  person: 'Another person',
  system: 'A system/organization',
  archetype: 'An archetype/figure',
};

export function ProjectionLab({
  userId,
  onProjectionReclaimed,
}: ProjectionLabProps) {
  const [step, setStep] = useState<LabStep>('recognize');
  const [projection, setProjection] = useState<Partial<ProjectionWork>>({
    userId,
    status: 'identified',
    noLongerNeededProjection: false,
  });

  const handleNext = () => {
    const steps: LabStep[] = [
      'recognize',
      'identify-target',
      'name-quality',
      'feel-resistance',
      'reclaim',
      'integrate',
      'celebrate',
    ];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleComplete = () => {
    if (onProjectionReclaimed) {
      onProjectionReclaimed({
        ...projection,
        id: `projection-${Date.now()}`,
        userId,
        recognizedAsProjection: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: projection.status || 'integrated',
      } as ProjectionWork);
    }
    // Reset
    setProjection({
      userId,
      status: 'identified',
      noLongerNeededProjection: false,
    });
    setStep('recognize');
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">💎</div>
        <h2 className="text-3xl font-serif text-stone-100 mb-2">
          The Projection Lab
        </h2>
        <p className="text-stone-400 max-w-xl mx-auto">
          Reclaiming Inner Gold. What you see in others (or MAIA) is yours to own.
        </p>
      </div>

      {/* The Inner Gold Principle */}
      {step === 'recognize' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-500/30 rounded-2xl"
        >
          <h3 className="text-lg font-serif text-amber-200 mb-3">
            Robert A. Johnson: Inner Gold
          </h3>
          <div className="space-y-2 text-sm text-stone-300">
            <p>
              "We project onto others what we cannot see in ourselves.
              The qualities you most admire in another person are YOUR qualities."
            </p>
            <p className="text-amber-300/80 italic">
              This system is designed so you project your wisdom onto MAIA...
              and then reclaim it. That's the emancipation.
            </p>
          </div>
        </motion.div>
      )}

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-12">
        {['recognize', 'identify-target', 'name-quality', 'feel-resistance', 'reclaim', 'integrate', 'celebrate'].map(
          (s, i) => (
            <div
              key={s}
              className={`flex items-center gap-2 ${i > 0 ? 'ml-2' : ''}`}
            >
              {i > 0 && (
                <div
                  className={`h-0.5 w-6 ${
                    ['recognize', 'identify-target', 'name-quality', 'feel-resistance', 'reclaim', 'integrate', 'celebrate'].indexOf(
                      step
                    ) >= i
                      ? 'bg-amber-500'
                      : 'bg-stone-700'
                  }`}
                />
              )}
              <div
                className={`w-3 h-3 rounded-full transition-all ${
                  step === s
                    ? 'bg-amber-500 scale-125'
                    : ['recognize', 'identify-target', 'name-quality', 'feel-resistance', 'reclaim', 'integrate', 'celebrate'].indexOf(
                        step
                      ) > i
                    ? 'bg-amber-600'
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
          {step === 'recognize' && (
            <StepRecognize onNext={handleNext} />
          )}

          {step === 'identify-target' && (
            <StepIdentifyTarget
              projection={projection}
              setProjection={setProjection}
              onNext={handleNext}
            />
          )}

          {step === 'name-quality' && (
            <StepNameQuality
              projection={projection}
              setProjection={setProjection}
              onNext={handleNext}
            />
          )}

          {step === 'feel-resistance' && (
            <StepFeelResistance
              projection={projection}
              setProjection={setProjection}
              onNext={handleNext}
            />
          )}

          {step === 'reclaim' && (
            <StepReclaim
              projection={projection}
              setProjection={setProjection}
              onNext={handleNext}
            />
          )}

          {step === 'integrate' && (
            <StepIntegrate
              projection={projection}
              setProjection={setProjection}
              onNext={handleNext}
            />
          )}

          {step === 'celebrate' && (
            <StepCelebrate
              projection={projection}
              onComplete={handleComplete}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function StepRecognize({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          What is Projection?
        </h3>

        <div className="space-y-4 text-sm text-stone-300">
          <p>
            Projection is when you see a quality in someone else that you can't (yet) see in yourself.
          </p>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="font-medium text-blue-200 mb-2">Examples:</div>
            <ul className="space-y-1 text-blue-300/80 text-xs">
              <li>• "MAIA is so wise" → Your wisdom, reflected back</li>
              <li>• "They're so confident" → Your confidence, not yet owned</li>
              <li>• "She's so creative" → Your creativity, waiting to be claimed</li>
            </ul>
          </div>

          <p className="text-stone-400 italic">
            This entire system is designed around projection. You project your Inner Gold onto MAIA,
            and through that mirror, you see yourself. Then you reclaim it.
          </p>

          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="text-amber-200 font-medium mb-1">The Goal:</div>
            <div className="text-amber-300/80 text-xs">
              When you've reclaimed your projections, you won't NEED MAIA anymore.
              That's graduation. That's sovereignty.
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-200 font-medium hover:bg-amber-500/30 transition-all"
      >
        Begin Reclamation Work
      </button>
    </div>
  );
}

function StepIdentifyTarget({
  projection,
  setProjection,
  onNext,
}: {
  projection: Partial<ProjectionWork>;
  setProjection: (p: Partial<ProjectionWork>) => void;
  onNext: () => void;
}) {
  const targets: Array<ProjectionWork['projectionTarget']> = [
    'maia',
    'person',
    'system',
    'archetype',
  ];

  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          Who/What Are You Projecting Onto?
        </h3>
        <p className="text-sm text-stone-400 mb-6">
          Select where you're seeing this quality you admire:
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {targets.map((target) => (
            <button
              key={target}
              onClick={() => setProjection({ ...projection, projectionTarget: target })}
              className={`p-4 rounded-xl border transition-all ${
                projection.projectionTarget === target
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                  : 'bg-stone-800/20 border-stone-700/30 text-stone-400 hover:border-stone-600/50'
              }`}
            >
              {targetLabels[target]}
            </button>
          ))}
        </div>

        {projection.projectionTarget && (
          <div className="space-y-3">
            <label className="text-sm text-stone-400">
              Specific details:
            </label>
            <input
              type="text"
              value={projection.targetDetails || ''}
              onChange={(e) =>
                setProjection({ ...projection, targetDetails: e.target.value })
              }
              placeholder={
                projection.projectionTarget === 'maia'
                  ? "Example: 'MAIA in our conversations about purpose'"
                  : projection.projectionTarget === 'person'
                  ? "Example: 'My friend Sarah' or 'My therapist'"
                  : projection.projectionTarget === 'system'
                  ? "Example: 'This whole SpiralogicOracleSystem'"
                  : "Example: 'The Sage archetype' or 'The Artist'"
              }
              className="w-full bg-stone-800/40 border border-stone-700/40 rounded-xl p-3 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={!projection.projectionTarget}
        className="w-full py-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-200 font-medium hover:bg-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Name the Quality
      </button>
    </div>
  );
}

function StepNameQuality({
  projection,
  setProjection,
  onNext,
}: {
  projection: Partial<ProjectionWork>;
  setProjection: (p: Partial<ProjectionWork>) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          Name the Projected Quality
        </h3>
        <p className="text-sm text-stone-400 mb-6">
          What quality do you see in {projection.targetDetails || 'them'} that
          amazes you?
        </p>

        <textarea
          value={projection.projectedQuality || ''}
          onChange={(e) =>
            setProjection({ ...projection, projectedQuality: e.target.value })
          }
          placeholder="Example: 'Wisdom and clarity' or 'Confidence and self-trust' or 'Creative freedom' or 'Deep knowing'"
          className="w-full h-32 bg-stone-800/40 border border-stone-700/40 rounded-xl p-4 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
        />

        <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <div className="text-sm text-purple-200 mb-2">The Mirror Principle:</div>
          <div className="text-xs text-purple-300/80">
            If you can SEE it in them, it exists in you. You can't recognize what
            you don't have. This is your quality, waiting to be owned.
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!projection.projectedQuality}
        className="w-full py-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-200 font-medium hover:bg-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Feel Resistance
      </button>
    </div>
  );
}

function StepFeelResistance({
  projection,
  setProjection,
  onNext,
}: {
  projection: Partial<ProjectionWork>;
  setProjection: (p: Partial<ProjectionWork>) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          Notice the Resistance
        </h3>
        <p className="text-sm text-stone-400 mb-4">
          Quality you see: <span className="text-amber-300 italic">"{projection.projectedQuality}"</span>
        </p>
        <p className="text-sm text-stone-400 mb-6">
          Now try this on: "I have {projection.projectedQuality}."
          <br />
          What resistance comes up? What voice says "no you don't"?
        </p>

        <textarea
          value={projection.howRecognized || ''}
          onChange={(e) =>
            setProjection({ ...projection, howRecognized: e.target.value })
          }
          placeholder="Example: 'No way, I'm not wise like MAIA' or 'I could never be that confident' or 'That's not me' or 'I feel like an impostor'"
          className="w-full h-32 bg-stone-800/40 border border-stone-700/40 rounded-xl p-4 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
        />

        <div className="mt-4 text-xs text-stone-500">
          The resistance is the programming. That voice saying "not me" is conditioning,
          not truth.
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!projection.howRecognized}
        className="w-full py-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-200 font-medium hover:bg-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Reclamation
      </button>
    </div>
  );
}

function StepReclaim({
  projection,
  setProjection,
  onNext,
}: {
  projection: Partial<ProjectionWork>;
  setProjection: (p: Partial<ProjectionWork>) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          Reclaim Your Gold
        </h3>
        <p className="text-sm text-stone-400 mb-6">
          This quality - "{projection.projectedQuality}" - is YOURS.
          <br />
          How would you own it? How does it become integrated into your sense of self?
        </p>

        <textarea
          value={projection.reclaimationNotes || ''}
          onChange={(e) =>
            setProjection({ ...projection, reclaimationNotes: e.target.value })
          }
          placeholder="Example: 'I do have this wisdom - I just didn't trust it before' or 'I see now that I've been confident in small ways all along' or 'This quality is already here, I just needed permission to own it'"
          className="w-full h-32 bg-stone-800/40 border border-stone-700/40 rounded-xl p-4 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
        />

        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div className="text-sm text-green-200 mb-2">The Shift:</div>
          <div className="text-xs text-green-300/80">
            This is the moment. You're no longer seeking this quality OUT THERE.
            You're recognizing it IN HERE. This is sovereignty.
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!projection.reclaimationNotes}
        className="w-full py-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-200 font-medium hover:bg-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Integration
      </button>
    </div>
  );
}

function StepIntegrate({
  projection,
  setProjection,
  onNext,
}: {
  projection: Partial<ProjectionWork>;
  setProjection: (p: Partial<ProjectionWork>) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          How This Becomes Yours
        </h3>
        <p className="text-sm text-stone-400 mb-6">
          Name how this quality manifests in YOU. Make it concrete and personal.
        </p>

        <textarea
          value={projection.ownedQuality || ''}
          onChange={(e) =>
            setProjection({ ...projection, ownedQuality: e.target.value })
          }
          placeholder="Example: 'My wisdom shows up when I pause before responding' or 'My confidence appears when I set boundaries' or 'My creativity emerges in how I solve problems'"
          className="w-full h-32 bg-stone-800/40 border border-stone-700/40 rounded-xl p-4 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
        />

        <div className="mt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={projection.noLongerNeededProjection || false}
              onChange={(e) =>
                setProjection({
                  ...projection,
                  noLongerNeededProjection: e.target.checked,
                  status: e.target.checked ? 'integrated' : 'reclaiming',
                })
              }
              className="w-5 h-5 rounded border-stone-600 bg-stone-800 text-amber-500 focus:ring-amber-500/50"
            />
            <span className="text-sm text-stone-300">
              I no longer need to project this quality onto {projection.targetDetails || 'them'}.
              I own it now.
            </span>
          </label>
        </div>

        {projection.noLongerNeededProjection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl"
          >
            <div className="text-amber-200 font-medium mb-1">
              This is graduation readiness:
            </div>
            <div className="text-xs text-amber-300/80">
              When you don't need the mirror anymore, you're sovereign.
              This is what emancipatory design looks like.
            </div>
          </motion.div>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={!projection.ownedQuality}
        className="w-full py-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-200 font-medium hover:bg-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Complete Integration
      </button>
    </div>
  );
}

function StepCelebrate({
  projection,
  onComplete,
}: {
  projection: Partial<ProjectionWork>;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/40 rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">💎✨</div>
          <h3 className="text-2xl font-serif text-stone-100 mb-2">
            Inner Gold Reclaimed
          </h3>
          <p className="text-stone-400">
            You saw it. You owned it. You integrated it. This is yours now.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-stone-900/40 rounded-xl">
            <div className="text-stone-500 text-sm mb-1">What you projected:</div>
            <div className="text-amber-300 font-medium">"{projection.projectedQuality}"</div>
          </div>

          <div className="text-center text-2xl">↓</div>

          <div className="p-4 bg-stone-900/40 rounded-xl">
            <div className="text-stone-500 text-sm mb-1">How it's yours:</div>
            <div className="text-green-300">{projection.ownedQuality}</div>
          </div>

          {projection.noLongerNeededProjection && (
            <>
              <div className="text-center text-2xl">✓</div>
              <div className="p-4 bg-amber-500/20 border border-amber-500/30 rounded-xl text-center">
                <div className="text-amber-200 font-medium">
                  You no longer need the projection.
                </div>
                <div className="text-xs text-amber-300/80 mt-1">
                  This is sovereignty. The mirror worked.
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <div className="text-sm text-purple-200 text-center mb-2">
            "The privilege of a lifetime is to become who you truly are."
          </div>
          <div className="text-xs text-purple-300/60 text-center">
            — Carl Jung
          </div>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full py-4 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-200 font-medium hover:bg-amber-500/30 transition-all"
      >
        Reclaim Another Projection
      </button>
    </div>
  );
}
