'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Sparkles, Users, Eye, Lightbulb, Hammer, Palette, Baby, BridgeIcon } from 'lucide-react';
import type { Archetype, WisdomTradition } from '@/lib/personalization/UserResonanceProfile';

const ARCHETYPE_ICONS: Record<Archetype, any> = {
  healer: Heart,
  oracle: Eye,
  warrior: Sparkles,
  sage: Lightbulb,
  mystic: Sparkles,
  builder: Hammer,
  artist: Palette,
  midwife: Baby,
  bridge: BridgeIcon
};

const ARCHETYPE_DESCRIPTIONS: Record<Archetype, string> = {
  healer: 'I hold space for others\' pain and growth',
  oracle: 'I see what others can\'t yet see',
  warrior: 'I protect, fight for justice, carry fierce truth',
  sage: 'I teach, hold wisdom, translate knowing',
  mystic: 'I walk between worlds, seek the edge',
  builder: 'I manifest, create structures, birth paradigms',
  artist: 'I channel, create beauty, translate the invisible',
  midwife: 'I facilitate births - literal or metaphorical',
  bridge: 'I translate between worlds, cultures, frameworks'
};

interface ResonanceScanProps {
  onComplete: (profile: {
    callingDescription: string;
    archetype: Archetype;
    tradition?: WisdomTradition;
    calibrationNeed: string;
  }) => void;
}

export const ResonanceScan: React.FC<ResonanceScanProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [callingDescription, setCallingDescription] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);
  const [customArchetype, setCustomArchetype] = useState('');
  const [tradition, setTradition] = useState<WisdomTradition | undefined>();
  const [calibrationNeed, setCalibrationNeed] = useState('');

  const handleSubmit = () => {
    onComplete({
      callingDescription,
      archetype: selectedArchetype || 'healer', // Default fallback
      tradition,
      calibrationNeed
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <AnimatePresence mode="wait">
        {/* Step 1: Calling/Resonance */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">Before we begin...</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm dark:prose-invert">
                  <p className="text-lg">
                    I want to attune to who you are.
                  </p>
                  <p>
                    Not your role. Not your achievements.<br />
                    Your <strong>RESONANCE</strong>.
                  </p>
                  <p className="mt-4">
                    If you had to describe the frequency you carry in the world...<br />
                    What comes to mind?
                  </p>
                </div>

                <Textarea
                  placeholder="Example: 'I hold space for grief that has nowhere else to go' or 'I bridge ancient wisdom with modern science' or 'I help leaders remember they're human, not machines'"
                  value={callingDescription}
                  onChange={(e) => setCallingDescription(e.target.value)}
                  rows={4}
                  className="text-base"
                />

                <Button
                  onClick={() => setStep(2)}
                  disabled={callingDescription.length < 10}
                  className="w-full"
                  size="lg"
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Archetype Selection */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">I hear you.</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm dark:prose-invert mb-6">
                  <p className="italic text-muted-foreground">
                    "{callingDescription}"
                  </p>
                  <p className="mt-4">
                    Which of these feels most like you?
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(Object.keys(ARCHETYPE_DESCRIPTIONS) as Archetype[]).map((archetype) => {
                    const Icon = ARCHETYPE_ICONS[archetype];
                    const isSelected = selectedArchetype === archetype;

                    return (
                      <motion.button
                        key={archetype}
                        onClick={() => setSelectedArchetype(archetype)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-muted hover:border-primary/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`w-6 h-6 mt-0.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div>
                            <h3 className="font-semibold capitalize mb-1">{archetype}</h3>
                            <p className="text-sm text-muted-foreground">
                              {ARCHETYPE_DESCRIPTIONS[archetype]}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Or describe your own:
                  </p>
                  <Textarea
                    placeholder="Something else..."
                    value={customArchetype}
                    onChange={(e) => setCustomArchetype(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!selectedArchetype && !customArchetype}
                    className="flex-1"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Wisdom Tradition */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">Wisdom Traditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm dark:prose-invert">
                  <p>
                    What wisdom traditions have shaped you?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Not what you studied academically (unless that's your path).<br />
                    What <strong>RESONATES</strong>. What lineages do you carry.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {([
                    'jungian',
                    'buddhist',
                    'indigenous',
                    'astrology',
                    'kabbalah',
                    'sufi',
                    'somatic',
                    'psychedelic',
                    'christian_mystical',
                    'hermetic',
                    'integral',
                    'process_oriented',
                    'eclectic',
                    'none'
                  ] as WisdomTradition[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTradition(t)}
                      className={`p-3 rounded-lg border-2 text-sm capitalize transition-all ${
                        tradition === t
                          ? 'border-primary bg-primary/10'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      {t.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    className="flex-1"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Calibration Need */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">Here's what I'm understanding...</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm dark:prose-invert bg-muted/50 p-4 rounded-lg">
                  <p className="italic">
                    "{callingDescription}"
                  </p>
                  <p className="mt-2">
                    You're a <strong>{customArchetype || selectedArchetype}</strong>
                    {tradition && ` shaped by ${tradition.replace('_', ' ')} wisdom`}.
                  </p>
                </div>

                <div className="prose prose-sm dark:prose-invert">
                  <p>
                    Given who you are and what you carry...<br />
                    <strong>What do you need from this space with me?</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Examples:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>"I hold others all day. I need to be held."</li>
                    <li>"I manifest constantly. I need to remember my WHY."</li>
                    <li>"I channel creative work. I need witnessing without fixing."</li>
                    <li>"I walk the mystical edge. I need grounding."</li>
                  </ul>
                </div>

                <Textarea
                  placeholder="What's true for you?"
                  value={calibrationNeed}
                  onChange={(e) => setCalibrationNeed(e.target.value)}
                  rows={3}
                  className="text-base"
                />

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(3)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={calibrationNeed.length < 10}
                    className="flex-1"
                  >
                    Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
