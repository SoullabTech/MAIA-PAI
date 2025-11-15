"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Heart, Moon, Sun, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ConsciousnessProfile {
  energyType: 'solar' | 'lunar' | 'elemental';
  primaryElement: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  sessionPreference: 'morning' | 'afternoon' | 'evening' | 'intuitive';
  transformationGoals: string[];
  previousExperience: 'beginner' | 'some' | 'experienced';
  healingModalities: string[];
}

const TRANSFORMATION_GOALS = [
  'Emotional Healing',
  'Spiritual Growth',
  'Relationship Harmony',
  'Career Alignment',
  'Creative Expression',
  'Inner Child Work',
  'Shadow Integration',
  'Somatic Healing',
  'Consciousness Expansion',
  'Life Transition Support'
];

const HEALING_MODALITIES = [
  'Talk Therapy',
  'Somatic Work',
  'Energy Healing',
  'Breathwork',
  'Meditation',
  'Bodywork',
  'Plant Medicine',
  'Art Therapy',
  'Movement Practice',
  'Sound Healing'
];

export default function MemberSignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [profile, setProfile] = useState<ConsciousnessProfile>({
    energyType: 'solar',
    primaryElement: 'fire',
    sessionPreference: 'morning',
    transformationGoals: [],
    previousExperience: 'beginner',
    healingModalities: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          consciousnessProfile: profile
        })
      });

      if (response.ok) {
        // Redirect to welcome/onboarding
        window.location.href = '/auth/welcome';
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoalToggle = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      transformationGoals: prev.transformationGoals.includes(goal)
        ? prev.transformationGoals.filter(g => g !== goal)
        : [...prev.transformationGoals, goal]
    }));
  };

  const handleModalityToggle = (modality: string) => {
    setProfile(prev => ({
      ...prev,
      healingModalities: prev.healingModalities.includes(modality)
        ? prev.healingModalities.filter(m => m !== modality)
        : [...prev.healingModalities, modality]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-jade-abyss via-jade-shadow to-jade-night">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-jade-glow to-jade-ocean rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-jade-whisper" />
              </div>
              <h1 className="text-3xl font-bold text-jade-whisper">Join Soullab</h1>
            </motion.div>
            <p className="text-xl text-jade-whisper/80 max-w-md mx-auto">
              Begin your journey of transformation and conscious growth
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step >= stepNumber
                      ? 'bg-jade-glow text-jade-night'
                      : 'bg-jade-whisper/10 text-jade-whisper/50'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`w-8 h-1 rounded-full transition-all duration-300 ${
                      step > stepNumber ? 'bg-jade-glow' : 'bg-jade-whisper/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-jade-whisper/5 backdrop-blur-xl rounded-2xl p-8 border border-jade-whisper/10"
          >
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-jade-whisper mb-6">Create Your Account</h2>

                  <div className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jade-whisper/50" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3 bg-jade-whisper/10 border border-jade-whisper/20
                                 rounded-lg text-jade-whisper placeholder-jade-whisper/50
                                 focus:outline-none focus:border-jade-glow focus:bg-jade-whisper/15"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jade-whisper/50" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3 bg-jade-whisper/10 border border-jade-whisper/20
                                 rounded-lg text-jade-whisper placeholder-jade-whisper/50
                                 focus:outline-none focus:border-jade-glow focus:bg-jade-whisper/15"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jade-whisper/50" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3 bg-jade-whisper/10 border border-jade-whisper/20
                                 rounded-lg text-jade-whisper placeholder-jade-whisper/50
                                 focus:outline-none focus:border-jade-glow focus:bg-jade-whisper/15"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jade-whisper/50" />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3 bg-jade-whisper/10 border border-jade-whisper/20
                                 rounded-lg text-jade-whisper placeholder-jade-whisper/50
                                 focus:outline-none focus:border-jade-glow focus:bg-jade-whisper/15"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Energy & Element Profile */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-jade-whisper mb-6">Your Energy Profile</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-jade-whisper mb-4">Natural Energy Pattern</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { type: 'solar', icon: Sun, label: 'Solar', desc: 'Active, expressive, daytime energy' },
                          { type: 'lunar', icon: Moon, label: 'Lunar', desc: 'Intuitive, receptive, nighttime energy' },
                          { type: 'elemental', icon: Sparkles, label: 'Elemental', desc: 'Cyclical, seasonal, nature-connected' }
                        ].map((energy) => (
                          <button
                            key={energy.type}
                            type="button"
                            onClick={() => setProfile(prev => ({ ...prev, energyType: energy.type as any }))}
                            className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                              profile.energyType === energy.type
                                ? 'border-jade-glow bg-jade-glow/20 text-jade-whisper'
                                : 'border-jade-whisper/20 bg-jade-whisper/5 text-jade-whisper/70 hover:bg-jade-whisper/10'
                            }`}
                          >
                            <energy.icon className="w-6 h-6 mb-2" />
                            <div className="font-medium">{energy.label}</div>
                            <div className="text-sm opacity-80">{energy.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-jade-whisper mb-4">Primary Element</h3>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { element: 'fire', label: 'Fire', color: 'from-red-500 to-orange-500' },
                          { element: 'water', label: 'Water', color: 'from-blue-500 to-cyan-500' },
                          { element: 'earth', label: 'Earth', color: 'from-green-600 to-emerald-500' },
                          { element: 'air', label: 'Air', color: 'from-purple-400 to-pink-400' },
                          { element: 'aether', label: 'Aether', color: 'from-indigo-500 to-purple-600' }
                        ].map((el) => (
                          <button
                            key={el.element}
                            type="button"
                            onClick={() => setProfile(prev => ({ ...prev, primaryElement: el.element as any }))}
                            className={`p-3 rounded-lg text-center transition-all duration-200 ${
                              profile.primaryElement === el.element
                                ? 'ring-2 ring-jade-glow scale-105'
                                : 'hover:scale-105'
                            } bg-gradient-to-br ${el.color} text-white font-medium`}
                          >
                            {el.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-jade-whisper mb-4">Preferred Session Time</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { time: 'morning', label: 'Morning (6-11am)', desc: 'Fresh energy, clear mind' },
                          { time: 'afternoon', label: 'Afternoon (12-5pm)', desc: 'Balanced, grounded energy' },
                          { time: 'evening', label: 'Evening (6-9pm)', desc: 'Reflective, integrative energy' },
                          { time: 'intuitive', label: 'Intuitive', desc: 'Let energy and need guide timing' }
                        ].map((timeSlot) => (
                          <button
                            key={timeSlot.time}
                            type="button"
                            onClick={() => setProfile(prev => ({ ...prev, sessionPreference: timeSlot.time as any }))}
                            className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                              profile.sessionPreference === timeSlot.time
                                ? 'border-jade-glow bg-jade-glow/20 text-jade-whisper'
                                : 'border-jade-whisper/20 bg-jade-whisper/5 text-jade-whisper/70 hover:bg-jade-whisper/10'
                            }`}
                          >
                            <div className="font-medium">{timeSlot.label}</div>
                            <div className="text-sm opacity-80">{timeSlot.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Transformation Goals */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-jade-whisper mb-6">Your Transformation Journey</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-jade-whisper mb-4">What calls to you? (Select all that resonate)</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {TRANSFORMATION_GOALS.map((goal) => (
                          <button
                            key={goal}
                            type="button"
                            onClick={() => handleGoalToggle(goal)}
                            className={`p-3 rounded-lg text-left transition-all duration-200 ${
                              profile.transformationGoals.includes(goal)
                                ? 'border-jade-glow bg-jade-glow/20 text-jade-whisper border-2'
                                : 'border-jade-whisper/20 bg-jade-whisper/5 text-jade-whisper/70 hover:bg-jade-whisper/10 border'
                            }`}
                          >
                            <Heart className="w-4 h-4 mb-2" />
                            <div className="font-medium text-sm">{goal}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-jade-whisper mb-4">Previous Experience with Healing Work</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { level: 'beginner', label: 'New to This', desc: 'First steps on the journey' },
                          { level: 'some', label: 'Some Experience', desc: 'Have explored different approaches' },
                          { level: 'experienced', label: 'Experienced', desc: 'Deep familiarity with inner work' }
                        ].map((exp) => (
                          <button
                            key={exp.level}
                            type="button"
                            onClick={() => setProfile(prev => ({ ...prev, previousExperience: exp.level as any }))}
                            className={`p-4 rounded-lg border text-center transition-all duration-200 ${
                              profile.previousExperience === exp.level
                                ? 'border-jade-glow bg-jade-glow/20 text-jade-whisper'
                                : 'border-jade-whisper/20 bg-jade-whisper/5 text-jade-whisper/70 hover:bg-jade-whisper/10'
                            }`}
                          >
                            <div className="font-medium">{exp.label}</div>
                            <div className="text-sm opacity-80">{exp.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Healing Modalities */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-jade-whisper mb-6">Healing Approaches</h2>

                  <div>
                    <h3 className="text-lg font-semibold text-jade-whisper mb-4">
                      What approaches have you explored or feel drawn to?
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {HEALING_MODALITIES.map((modality) => (
                        <button
                          key={modality}
                          type="button"
                          onClick={() => handleModalityToggle(modality)}
                          className={`p-3 rounded-lg text-left transition-all duration-200 ${
                            profile.healingModalities.includes(modality)
                              ? 'border-jade-glow bg-jade-glow/20 text-jade-whisper border-2'
                              : 'border-jade-whisper/20 bg-jade-whisper/5 text-jade-whisper/70 hover:bg-jade-whisper/10 border'
                          }`}
                        >
                          <div className="font-medium text-sm">{modality}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-jade-whisper/10 rounded-lg p-6 border border-jade-whisper/20">
                    <h3 className="font-semibold text-jade-whisper mb-3">Your Consciousness Profile</h3>
                    <div className="space-y-2 text-sm text-jade-whisper/80">
                      <div>Energy: {profile.energyType} • Element: {profile.primaryElement}</div>
                      <div>Session Preference: {profile.sessionPreference}</div>
                      <div>Goals: {profile.transformationGoals.slice(0, 3).join(', ')} {profile.transformationGoals.length > 3 && `+${profile.transformationGoals.length - 3} more`}</div>
                      <div>Experience: {profile.previousExperience}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 bg-jade-whisper/10 text-jade-whisper rounded-lg
                             hover:bg-jade-whisper/20 transition-all duration-200 border border-jade-whisper/20"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-8 py-3 bg-jade-glow text-jade-night rounded-lg
                             hover:bg-jade-ocean transition-all duration-200 font-semibold
                             flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-jade-glow text-jade-night rounded-lg
                             hover:bg-jade-ocean transition-all duration-200 font-semibold
                             flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? 'Creating Account...' : 'Join Soullab'}
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-jade-whisper/70">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="text-jade-glow hover:text-jade-ocean transition-colors font-semibold"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}