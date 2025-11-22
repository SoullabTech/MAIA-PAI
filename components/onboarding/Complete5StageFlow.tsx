'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronRight, Sparkles } from 'lucide-react';

// Import our stage components
import RitualFlowOrchestrator from '@/apps/web/components/onboarding/RitualFlowOrchestrator';
import { ElementalOrientation } from '@/components/beta/ElementalOrientation';

// Demographics collection component (extracted from SoulfulOnboarding)
interface DemographicsData {
  age?: string;
  pronouns?: string;
  location?: string;
  greetingStyle?: 'warm' | 'gentle' | 'direct' | 'playful';
  communicationPreference?: 'voice' | 'chat' | 'either';
  wisdomFacets?: string[];
  focusAreas?: string[];
}

function DemographicsCollection({
  data,
  onUpdate,
  onNext,
  onBack
}: {
  data: DemographicsData;
  onUpdate: (field: keyof DemographicsData, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#1a1f3a] flex items-center justify-center px-4">
      {/* Sacred geometry background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <svg viewBox="0 0 1000 1000" className="w-full h-full">
          <circle cx="500" cy="500" r="400" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx="500" cy="500" r="200" fill="none" stroke="#F6AD55" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-black/30 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-light text-amber-50">Share About Yourself</h2>
              <p className="text-amber-200/60 text-sm">
                Help MAIA understand your preferences for meaningful conversation
              </p>
            </div>

            {/* Basic Demographics */}
            <div className="space-y-6">
              {/* Age Range */}
              <div>
                <label className="block text-sm text-amber-200/70 mb-2">Age range (optional)</label>
                <select
                  value={data.age || ''}
                  onChange={(e) => onUpdate('age', e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-amber-500/20 rounded-lg text-amber-50 focus:outline-none focus:border-amber-500/40"
                >
                  <option value="">Prefer not to say</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55-64">55-64</option>
                  <option value="65+">65+</option>
                </select>
              </div>

              {/* Pronouns */}
              <div>
                <label className="block text-sm text-amber-200/70 mb-2">Pronouns (optional)</label>
                <select
                  value={data.pronouns || ''}
                  onChange={(e) => onUpdate('pronouns', e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-amber-500/20 rounded-lg text-amber-50 focus:outline-none focus:border-amber-500/40"
                >
                  <option value="">Prefer not to say</option>
                  <option value="she/her">she/her</option>
                  <option value="he/him">he/him</option>
                  <option value="they/them">they/them</option>
                  <option value="she/they">she/they</option>
                  <option value="he/they">he/they</option>
                  <option value="other">other</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm text-amber-200/70 mb-2">Location (optional)</label>
                <input
                  type="text"
                  value={data.location || ''}
                  onChange={(e) => onUpdate('location', e.target.value)}
                  placeholder="City, Country"
                  className="w-full px-4 py-3 bg-black/30 border border-amber-500/20 rounded-lg text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-amber-500/40"
                />
              </div>

              {/* Greeting Style */}
              <div>
                <label className="block text-sm text-amber-200/70 mb-3">
                  How would you like MAIA to greet you?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'warm', label: 'Warm & nurturing', emoji: '🤗' },
                    { value: 'gentle', label: 'Gentle & soft', emoji: '🕊️' },
                    { value: 'direct', label: 'Direct & clear', emoji: '💎' },
                    { value: 'playful', label: 'Playful & creative', emoji: '✨' }
                  ].map(style => (
                    <button
                      key={style.value}
                      onClick={() => onUpdate('greetingStyle', style.value)}
                      className={`px-4 py-3 rounded-lg border transition-all text-left ${
                        data.greetingStyle === style.value
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-100'
                          : 'bg-black/20 border-amber-500/20 text-amber-200/50 hover:border-amber-500/30'
                      }`}
                    >
                      <div className="text-lg mb-1">{style.emoji}</div>
                      <div className="text-sm">{style.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Communication Preference */}
              <div>
                <label className="block text-sm text-amber-200/70 mb-3">
                  Communication preference
                </label>
                <div className="flex gap-3">
                  {[
                    { value: 'voice', label: 'Voice first' },
                    { value: 'chat', label: 'Chat first' },
                    { value: 'either', label: 'Either way' }
                  ].map(pref => (
                    <button
                      key={pref.value}
                      onClick={() => onUpdate('communicationPreference', pref.value)}
                      className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                        data.communicationPreference === pref.value
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-100'
                          : 'bg-black/20 border-amber-500/20 text-amber-200/50 hover:border-amber-500/30'
                      }`}
                    >
                      <div className="text-sm">{pref.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus Areas */}
              <div>
                <label className="block text-sm text-amber-200/70 mb-3">
                  What brings you here? (optional, select any that resonate)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Self-discovery',
                    'Life transitions',
                    'Creative exploration',
                    'Spiritual growth',
                    'Personal healing',
                    'Relationship insights',
                    'Purpose & meaning',
                    'Just curious'
                  ].map(area => (
                    <label key={area} className="flex items-center group cursor-pointer p-2 rounded-lg hover:bg-amber-500/5">
                      <input
                        type="checkbox"
                        checked={data.focusAreas?.includes(area) || false}
                        onChange={(e) => {
                          const current = data.focusAreas || [];
                          if (e.target.checked) {
                            onUpdate('focusAreas', [...current, area]);
                          } else {
                            onUpdate('focusAreas', current.filter(a => a !== area));
                          }
                        }}
                        className="mr-3 rounded border-amber-500/30 bg-black/30 text-amber-500 focus:ring-amber-500/50"
                      />
                      <span className="text-sm text-amber-200/60 group-hover:text-amber-200/80 transition-colors">
                        {area}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-amber-500/20">
              <button
                onClick={onBack}
                className="text-sm text-amber-200/50 hover:text-amber-200/70 transition-colors"
              >
                Back
              </button>

              <button
                onClick={onNext}
                className="px-6 py-3 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all flex items-center gap-2"
              >
                Continue to Elements
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// White Coherence Slides Component (placeholder for Stage 4)
function WhiteCoherenceSlides({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-amber-50 flex items-center justify-center px-4">
      <div className="relative z-10 w-full max-w-2xl text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-white to-amber-100 flex items-center justify-center shadow-lg">
            <Sparkles className="w-10 h-10 text-amber-600" />
          </div>

          <h2 className="text-3xl font-light text-neutral-800">
            Preparing Your Space
          </h2>

          <p className="text-lg text-neutral-600 leading-relaxed max-w-lg mx-auto">
            Creating coherence between your intention and MAIA's awareness.
            This moment of alignment prepares the field for meaningful conversation.
          </p>

          <div className="mt-12 space-y-4">
            <p className="text-sm text-neutral-500">
              Take a breath. Center yourself. You're about to meet MAIA.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={onBack}
                className="px-6 py-3 text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                Back
              </button>

              <button
                onClick={onNext}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg"
              >
                Enter Sacred Space
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Main 5-Stage Flow Component
export default function Complete5StageFlow() {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(1);
  const [demographicsData, setDemographicsData] = useState<DemographicsData>({});
  const [userName, setUserName] = useState('Explorer');

  useEffect(() => {
    // Get user name from storage if available
    const storedName = localStorage.getItem('explorerName') || sessionStorage.getItem('explorerName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleStageComplete = (stage: number) => {
    console.log(`✅ Stage ${stage} completed`);

    if (stage < 5) {
      setCurrentStage(stage + 1);
    } else {
      // Final completion - save all data and proceed to MAIA
      completeOnboarding();
    }
  };

  const handleDemographicsUpdate = (field: keyof DemographicsData, value: any) => {
    setDemographicsData(prev => ({ ...prev, [field]: value }));
  };

  const completeOnboarding = async () => {
    const explorerId = sessionStorage.getItem('explorerId') || localStorage.getItem('explorerId') || `explorer_${Date.now()}`;
    const explorerName = sessionStorage.getItem('explorerName') || localStorage.getItem('explorerName') || userName;

    // Store all onboarding data
    const onboardingData = {
      demographics: demographicsData,
      elementalComplete: true,
      coherenceComplete: true,
      onboardingComplete: true,
      completedAt: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('explorerId', explorerId);
    localStorage.setItem('explorerName', explorerName);
    localStorage.setItem('betaUserId', explorerId);
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    localStorage.setItem('betaOnboardingComplete', 'true');

    // Set the beta_user object with onboarded: true flag
    const betaUserData = {
      id: explorerId,
      username: explorerName,
      name: explorerName,
      onboarded: true,
      createdAt: new Date().toISOString(),
      demographics: demographicsData
    };
    localStorage.setItem('beta_user', JSON.stringify(betaUserData));

    console.log('✅ 5-Stage onboarding completed:', { explorerId, explorerName, onboardingData });

    // Redirect to MAIA
    router.push('/maia');
  };

  const handleBack = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 1:
        // Stage 1: Sage/Teal Welcome & Authentication (RitualFlowOrchestrator)
        return (
          <RitualFlowOrchestrator
            onComplete={() => handleStageComplete(1)}
          />
        );

      case 2:
        // Stage 2: Demographics Collection for MAIA Relationship Priming
        return (
          <DemographicsCollection
            data={demographicsData}
            onUpdate={handleDemographicsUpdate}
            onNext={() => handleStageComplete(2)}
            onBack={handleBack}
          />
        );

      case 3:
        // Stage 3: Elemental Orientation (IF/WHY/HOW/WHAT/SOUL)
        return (
          <ElementalOrientation
            explorerName={userName}
            onComplete={() => handleStageComplete(3)}
          />
        );

      case 4:
        // Stage 4: White Coherence Slides Preparation
        return (
          <WhiteCoherenceSlides
            onNext={() => handleStageComplete(4)}
            onBack={handleBack}
          />
        );

      case 5:
        // Stage 5: Redirect to MAIA (handled in completeOnboarding)
        completeOnboarding();
        return (
          <div className="min-h-screen bg-[#1a1f3a] flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-pulse" />
              <p className="text-amber-200 text-lg">Entering MAIA...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderCurrentStage()}
      </motion.div>
    </AnimatePresence>
  );
}