/**
 * CONDITIONING RECOGNITION TOOL
 *
 * Helps users identify beliefs, trace their origins, and reclaim chosen values.
 * Explicit counter to Tavistock/Bernays/Mockingbird programming.
 *
 * Features:
 * - Belief archaeology (where did this come from?)
 * - Source identification (parent, media, culture, algorithm, etc.)
 * - Truth excavation (what's true underneath?)
 * - Conscious choice (what do you choose to believe instead?)
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ConditioningPattern } from '@/lib/consciousness/sovereignty-reclamation';

interface ConditioningRecognitionProps {
  userId: string;
  onPatternRecognized?: (pattern: ConditioningPattern) => void;
}

type RecognitionStep =
  | 'identify'
  | 'excavate'
  | 'source'
  | 'feel'
  | 'truth'
  | 'choose'
  | 'complete';

const sourceLabels = {
  parent: 'Parent/Family',
  media: 'Media/News',
  education: 'School/Education',
  religion: 'Religious Authority',
  culture: 'Cultural Conditioning',
  algorithm: 'Social Media Algorithm',
  trauma: 'Trauma Response',
  unknown: 'Unknown/Investigating',
};

export function ConditioningRecognition({
  userId,
  onPatternRecognized,
}: ConditioningRecognitionProps) {
  const [step, setStep] = useState<RecognitionStep>('identify');
  const [pattern, setPattern] = useState<Partial<ConditioningPattern>>({
    userId,
    status: 'identified',
  });

  const handleNext = () => {
    const steps: RecognitionStep[] = ['identify', 'excavate', 'source', 'feel', 'truth', 'choose', 'complete'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleComplete = () => {
    if (onPatternRecognized) {
      onPatternRecognized({
        ...pattern,
        id: `pattern-${Date.now()}`,
        userId,
        recognizedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: pattern.status || 'identified',
      } as ConditioningPattern);
    }
    // Reset for next pattern
    setPattern({ userId, status: 'identified' });
    setStep('identify');
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-stone-100 mb-2">
          Conditioning Recognition
        </h2>
        <p className="text-stone-400">
          Trace beliefs to their source. Reclaim your inner authority.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-12">
        {['identify', 'excavate', 'source', 'feel', 'truth', 'choose', 'complete'].map((s, i) => (
          <div
            key={s}
            className={`flex items-center gap-2 ${
              i > 0 ? 'ml-2' : ''
            }`}
          >
            {i > 0 && (
              <div
                className={`h-0.5 w-8 ${
                  ['identify', 'excavate', 'source', 'feel', 'truth', 'choose', 'complete'].indexOf(step) >= i
                    ? 'bg-blue-500'
                    : 'bg-stone-700'
                }`}
              />
            )}
            <div
              className={`w-3 h-3 rounded-full transition-all ${
                step === s
                  ? 'bg-blue-500 scale-125'
                  : ['identify', 'excavate', 'source', 'feel', 'truth', 'choose', 'complete'].indexOf(step) > i
                  ? 'bg-blue-600'
                  : 'bg-stone-700'
              }`}
            />
          </div>
        ))}
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
          {step === 'identify' && (
            <StepIdentify
              pattern={pattern}
              setPattern={setPattern}
              onNext={handleNext}
            />
          )}

          {step === 'excavate' && (
            <StepExcavate
              pattern={pattern}
              setPattern={setPattern}
              onNext={handleNext}
            />
          )}

          {step === 'source' && (
            <StepSource
              pattern={pattern}
              setPattern={setPattern}
              onNext={handleNext}
            />
          )}

          {step === 'feel' && (
            <StepFeel
              pattern={pattern}
              setPattern={setPattern}
              onNext={handleNext}
            />
          )}

          {step === 'truth' && (
            <StepTruth
              pattern={pattern}
              setPattern={setPattern}
              onNext={handleNext}
            />
          )}

          {step === 'choose' && (
            <StepChoose
              pattern={pattern}
              setPattern={setPattern}
              onNext={handleNext}
            />
          )}

          {step === 'complete' && (
            <StepComplete
              pattern={pattern}
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

function StepIdentify({
  pattern,
  setPattern,
  onNext,
}: {
  pattern: Partial<ConditioningPattern>;
  setPattern: (p: Partial<ConditioningPattern>) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          Step 1: Identify the Belief
        </h3>
        <p className="text-sm text-stone-400 mb-6">
          What belief, "should," or automatic thought are you noticing?
        </p>

        <textarea
          value={pattern.belief || ''}
          onChange={(e) => setPattern({ ...pattern, belief: e.target.value })}
          placeholder="Example: 'I should be more productive' or 'Success means being busy' or 'I need external validation to know I'm worthy'"
          className="w-full h-32 bg-stone-800/40 border border-stone-700/40 rounded-xl p-4 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-blue-500/50"
        />

        <div className="mt-4 text-xs text-stone-500">
          Tip: Look for "shoulds," automatic assumptions, or thoughts that feel like they're not quite yours.
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!pattern.belief}
        className="w-full py-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-200 font-medium hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Excavation
      </button>
    </div>
  );
}

function StepExcavate({
  pattern,
  setPattern,
  onNext,
}: {
  pattern: Partial<ConditioningPattern>;
  setPattern: (p: Partial<ConditioningPattern>) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          Step 2: Excavate the Pattern
        </h3>
        <p className="text-sm text-stone-400 mb-4">
          Your belief: <span className="text-stone-200 italic">"{pattern.belief}"</span>
        </p>
        <p className="text-sm text-stone-400 mb-6">
          How does this belief show up in your behavior? What do you do because of it?
        </p>

        <textarea
          value={pattern.behaviorPattern || ''}
          onChange={(e) => setPattern({ ...pattern, behaviorPattern: e.target.value })}
          placeholder="Example: 'I overwork even when exhausted' or 'I check social media obsessively for likes' or 'I say yes when I mean no'"
          className="w-full h-32 bg-stone-800/40 border border-stone-700/40 rounded-xl p-4 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-blue-500/50"
        />

        <div className="mt-4 text-xs text-stone-500">
          Tip: Look for repetitive behaviors, reactions, or patterns you can't seem to break.
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!pattern.behaviorPattern}
        className="w-full py-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-200 font-medium hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Source
      </button>
    </div>
  );
}

function StepSource({
  pattern,
  setPattern,
  onNext,
}: {
  pattern: Partial<ConditioningPattern>;
  setPattern: (p: Partial<ConditioningPattern>) => void;
  onNext: () => void;
}) {
  const sources: Array<ConditioningPattern['source']> = [
    'parent',
    'media',
    'education',
    'religion',
    'culture',
    'algorithm',
    'trauma',
    'unknown',
  ];

  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          Step 3: Identify the Source
        </h3>
        <p className="text-sm text-stone-400 mb-6">
          Where did this belief come from? Who installed this program?
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {sources.map((source) => (
            <button
              key={source}
              onClick={() => setPattern({ ...pattern, source })}
              className={`p-4 rounded-xl border transition-all ${
                pattern.source === source
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-200'
                  : 'bg-stone-800/20 border-stone-700/30 text-stone-400 hover:border-stone-600/50'
              }`}
            >
              {sourceLabels[source]}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <label className="text-sm text-stone-400">
            Specific details (optional):
          </label>
          <input
            type="text"
            value={pattern.sourceDetails || ''}
            onChange={(e) => setPattern({ ...pattern, sourceDetails: e.target.value })}
            placeholder="Example: 'My father always said...' or 'Every ad I see tells me...' or 'School taught that...'"
            className="w-full bg-stone-800/40 border border-stone-700/40 rounded-xl p-3 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-sm text-stone-400">
            Approximate age when this was installed (optional):
          </label>
          <input
            type="number"
            value={pattern.approximateAge || ''}
            onChange={(e) => setPattern({ ...pattern, approximateAge: parseInt(e.target.value) || undefined })}
            placeholder="Example: 8, 15, 22..."
            className="w-full bg-stone-800/40 border border-stone-700/40 rounded-xl p-3 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!pattern.source}
        className="w-full py-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-200 font-medium hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Emotional Signature
      </button>
    </div>
  );
}

function StepFeel({
  pattern,
  setPattern,
  onNext,
}: {
  pattern: Partial<ConditioningPattern>;
  setPattern: (p: Partial<ConditioningPattern>) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          Step 4: Emotional Signature
        </h3>
        <p className="text-sm text-stone-400 mb-6">
          How does this conditioning FEEL in your body? What's the emotional signature?
        </p>

        <textarea
          value={pattern.emotionalSignature || ''}
          onChange={(e) => setPattern({ ...pattern, emotionalSignature: e.target.value })}
          placeholder="Example: 'Tight chest, anxiety, never enough' or 'Shame in my gut' or 'Constant low-grade panic'"
          className="w-full h-32 bg-stone-800/40 border border-stone-700/40 rounded-xl p-4 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-blue-500/50"
        />

        <div className="mt-4 text-xs text-stone-500">
          Tip: Conditioning has a felt sense. Anxiety, shame, urgency, inadequacy - these are clues.
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!pattern.emotionalSignature}
        className="w-full py-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-200 font-medium hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Truth Excavation
      </button>
    </div>
  );
}

function StepTruth({
  pattern,
  setPattern,
  onNext,
}: {
  pattern: Partial<ConditioningPattern>;
  setPattern: (p: Partial<ConditioningPattern>) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          Step 5: Truth Beneath
        </h3>
        <p className="text-sm text-stone-400 mb-4">
          Your conditioning: <span className="text-stone-200 italic">"{pattern.belief}"</span>
        </p>
        <p className="text-sm text-stone-400 mb-6">
          What's TRUE underneath this programming? Strip away the "should" - what remains?
        </p>

        <textarea
          value={pattern.truthBeneath || ''}
          onChange={(e) => setPattern({ ...pattern, truthBeneath: e.target.value })}
          placeholder="Example: 'I am enough as I am' or 'My worth isn't tied to output' or 'I know what's right for me'"
          className="w-full h-32 bg-stone-800/40 border border-stone-700/40 rounded-xl p-4 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-blue-500/50"
        />

        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <div className="text-sm text-amber-200 mb-2 font-medium">
            The Sovereignty Test:
          </div>
          <div className="text-xs text-amber-300/80">
            Does this truth feel calm? Spacious? Like coming home? Truth doesn't create anxiety.
            Conditioning does.
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!pattern.truthBeneath}
        className="w-full py-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-200 font-medium hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Conscious Choice
      </button>
    </div>
  );
}

function StepChoose({
  pattern,
  setPattern,
  onNext,
}: {
  pattern: Partial<ConditioningPattern>;
  setPattern: (p: Partial<ConditioningPattern>) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          Step 6: Conscious Choice
        </h3>
        <p className="text-sm text-stone-400 mb-6">
          Now that you see the conditioning clearly, what do you CHOOSE to believe instead?
        </p>

        <textarea
          value={pattern.chosenBelief || ''}
          onChange={(e) => setPattern({ ...pattern, chosenBelief: e.target.value })}
          placeholder="Example: 'I choose to trust my pace' or 'I value depth over productivity' or 'My authority comes from within'"
          className="w-full h-32 bg-stone-800/40 border border-stone-700/40 rounded-xl p-4 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-blue-500/50"
        />

        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div className="text-sm text-green-200 mb-2 font-medium">
            This is sovereignty:
          </div>
          <div className="text-xs text-green-300/80">
            You saw the programming. You found the truth. You chose your belief. This is inner authority reclaimed.
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!pattern.chosenBelief}
        className="w-full py-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-200 font-medium hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Complete Recognition
      </button>
    </div>
  );
}

function StepComplete({
  pattern,
  onComplete,
}: {
  pattern: Partial<ConditioningPattern>;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/40 rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-2xl font-serif text-stone-100 mb-2">
            Conditioning Recognized
          </h3>
          <p className="text-stone-400">
            You've traced this pattern to its source and reclaimed your authority.
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <div className="p-4 bg-stone-900/40 rounded-xl">
            <div className="text-stone-500 mb-1">Old conditioning:</div>
            <div className="text-stone-200 italic">"{pattern.belief}"</div>
          </div>

          <div className="text-center text-2xl">↓</div>

          <div className="p-4 bg-stone-900/40 rounded-xl">
            <div className="text-stone-500 mb-1">Source identified:</div>
            <div className="text-blue-300">{pattern.source && sourceLabels[pattern.source]}</div>
            {pattern.sourceDetails && (
              <div className="text-stone-400 text-xs mt-1">{pattern.sourceDetails}</div>
            )}
          </div>

          <div className="text-center text-2xl">↓</div>

          <div className="p-4 bg-stone-900/40 rounded-xl">
            <div className="text-stone-500 mb-1">Chosen belief:</div>
            <div className="text-green-300 font-medium">"{pattern.chosenBelief}"</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
          <div className="text-sm text-amber-200">
            This pattern is now visible. You can't unsee it. That's the immunity.
          </div>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full py-4 bg-green-500/20 border border-green-500/40 rounded-xl text-green-200 font-medium hover:bg-green-500/30 transition-all"
      >
        Save & Recognize Another Pattern
      </button>
    </div>
  );
}
