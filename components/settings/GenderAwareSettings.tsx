'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Info, Check, X, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/utils/supabase/client';

interface GenderAwarePreferences {
  genderAwarenessEnabled: boolean;
  genderIdentity?: 'feminine' | 'masculine' | 'non-binary' | 'fluid' | 'prefer-not-to-say';
  genderPronouns?: string;
  cycleTrackingEnabled: boolean;
  cycleType?: 'menstrual' | 'testosterone' | 'cortisol' | 'custom' | 'none';
}

export function GenderAwareSettings() {
  const [preferences, setPreferences] = useState<GenderAwarePreferences>({
    genderAwarenessEnabled: false,
    cycleTrackingEnabled: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Load preferences from database
  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('gender_awareness_enabled, gender_identity, gender_pronouns, cycle_tracking_enabled, cycle_type')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setPreferences({
          genderAwarenessEnabled: data.gender_awareness_enabled || false,
          genderIdentity: data.gender_identity,
          genderPronouns: data.gender_pronouns,
          cycleTrackingEnabled: data.cycle_tracking_enabled || false,
          cycleType: data.cycle_type
        });
      }
    } catch (error) {
      console.error('Error loading gender preferences:', error);
    }
  }

  async function savePreferences() {
    setIsSaving(true);
    setSaveMessage(null);

    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSaveMessage('Not authenticated');
        setIsSaving(false);
        return;
      }

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          gender_awareness_enabled: preferences.genderAwarenessEnabled,
          gender_identity: preferences.genderIdentity,
          gender_pronouns: preferences.genderPronouns,
          cycle_tracking_enabled: preferences.cycleTrackingEnabled,
          cycle_type: preferences.cycleType,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving preferences:', error);
        setSaveMessage('Failed to save');
      } else {
        setSaveMessage('Saved!');
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error saving gender preferences:', error);
      setSaveMessage('Error occurred');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Info */}
      <div>
        <div className="flex items-start gap-3 mb-2">
          <Brain className="w-5 h-5 text-purple-400 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-white">Gender-Aware Conversation</h3>
            <p className="text-sm text-white/60 mt-1">
              MAIA can adapt her conversation style based on research-backed patterns
              in emotional processing, communication preferences, and integration styles.
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-200">
              <strong>How this works:</strong> MAIA adapts to YOUR actual behavior, not assumptions.
              Gender is one contextual factor among many (like generation, neurodivergence, etc.).
              Your observed patterns always override any profile assumptions.
            </div>
          </div>
          <a
            href="/docs/gender-aware-design"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2"
          >
            Learn about our research-backed approach
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Enable Toggle */}
      <div className="flex items-start justify-between p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex-1">
          <label className="text-sm font-medium text-white cursor-pointer">
            Enable Gender-Aware Conversation
          </label>
          <p className="text-xs text-white/50 mt-1">
            Opt-in to research-backed conversation adaptations
          </p>
        </div>
        <button
          onClick={() => {
            const newEnabled = !preferences.genderAwarenessEnabled;
            setPreferences({ ...preferences, genderAwarenessEnabled: newEnabled });
          }}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            preferences.genderAwarenessEnabled ? 'bg-purple-500' : 'bg-white/20'
          }`}
        >
          <motion.div
            className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full"
            animate={{ x: preferences.genderAwarenessEnabled ? 24 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      {/* Gender Identity (if enabled) */}
      {preferences.genderAwarenessEnabled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pl-4 border-l-2 border-purple-500/30"
        >
          {/* Gender Identity */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Gender Identity (Optional)
            </label>
            <p className="text-xs text-white/50 mb-3">
              This is a weak prior only. Your actual communication style matters more.
            </p>
            <select
              value={preferences.genderIdentity || ''}
              onChange={(e) => setPreferences({
                ...preferences,
                genderIdentity: e.target.value as any || undefined
              })}
              className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
            >
              <option value="">Select (Optional)</option>
              <option value="feminine">Feminine</option>
              <option value="masculine">Masculine</option>
              <option value="non-binary">Non-binary</option>
              <option value="fluid">Fluid</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          {/* Pronouns */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Pronouns (Optional)
            </label>
            <input
              type="text"
              value={preferences.genderPronouns || ''}
              onChange={(e) => setPreferences({
                ...preferences,
                genderPronouns: e.target.value || undefined
              })}
              placeholder="e.g., she/her, he/him, they/them, xe/xir"
              className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Cycle Tracking (Opt-in) */}
          <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <label className="text-sm font-medium text-pink-200 cursor-pointer">
                  Hormonal Cycle Awareness
                </label>
                <p className="text-xs text-white/50 mt-1">
                  Optional: MAIA can be aware of hormonal cycles (menstrual, testosterone, cortisol, etc.)
                </p>
              </div>
              <button
                onClick={() => setPreferences({
                  ...preferences,
                  cycleTrackingEnabled: !preferences.cycleTrackingEnabled
                })}
                className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-3 ${
                  preferences.cycleTrackingEnabled ? 'bg-pink-500' : 'bg-white/20'
                }`}
              >
                <motion.div
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                  animate={{ x: preferences.cycleTrackingEnabled ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {preferences.cycleTrackingEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3"
              >
                <select
                  value={preferences.cycleType || 'none'}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    cycleType: e.target.value as any
                  })}
                  className="w-full px-3 py-2 bg-black/30 border border-pink-500/20 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/50"
                >
                  <option value="none">None</option>
                  <option value="menstrual">Menstrual Cycle</option>
                  <option value="testosterone">Testosterone Cycle</option>
                  <option value="cortisol">Cortisol/Stress Cycle</option>
                  <option value="custom">Custom</option>
                </select>
                <p className="text-xs text-white/40 mt-2">
                  MAIA will be aware that hormonal cycles affect emotional processing and energy.
                </p>
              </motion.div>
            )}
          </div>

          {/* What This Means */}
          <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
            <h4 className="text-xs font-medium text-white/80 mb-2">What to expect:</h4>
            <ul className="text-xs text-white/60 space-y-1">
              <li>• Subtle adjustments to communication style based on YOUR behavior</li>
              <li>• Support for different emotional processing patterns</li>
              <li>• Recognition of various integration styles (verbal, embodied, systemic)</li>
              <li>• All adaptations cite peer-reviewed research</li>
              <li>• Individual variance always respected</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Save Button */}
      <div className="flex items-center gap-3 pt-4">
        <button
          onClick={savePreferences}
          disabled={isSaving}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Brain className="w-4 h-4" />
              </motion.div>
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Save Preferences
            </>
          )}
        </button>

        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-sm ${
              saveMessage === 'Saved!' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {saveMessage}
          </motion.div>
        )}
      </div>

      {/* Privacy Note */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <div className="flex gap-2">
          <Info className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-200/80">
            <strong>Privacy:</strong> All gender context observations are private to you.
            You can disable this feature anytime. System works identically without it.
          </div>
        </div>
      </div>
    </div>
  );
}
