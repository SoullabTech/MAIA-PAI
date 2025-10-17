'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Heart, FileText, Users, ArrowRight } from 'lucide-react';

/**
 * Community Contributions - A Living Commons
 *
 * A quiet studio where ideas take root and grow into modules
 * that serve the field. Built with humility and discernment.
 */

interface Module {
  id: string;
  name: string;
  summary: string;
  contributor: string;
  element: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  status: 'active' | 'considering' | 'proposed';
  dateAdded: string;
  link?: string;
  attunements?: number;
}

// Sample data - will be replaced with database
const activeModules: Module[] = [
  {
    id: '1',
    name: 'Dr Angela - Women\'s Wisdom Module',
    summary: 'Guidance pathways specifically attuned to women\'s embodied wisdom, cycles, and archetypal journeys.',
    contributor: 'Community Beta Tester',
    element: 'water',
    status: 'active',
    dateAdded: '2025-01-15',
  },
];

const underConsideration: Module[] = [
  {
    id: '2',
    name: 'Somatic Integration Practice',
    summary: 'Body-centered practices for grounding insights into lived experience and cellular memory.',
    contributor: 'Field Researcher',
    element: 'earth',
    status: 'considering',
    dateAdded: '2025-01-10',
    attunements: 12,
  },
];

const contributors = [
  { name: 'Community Beta Tester', modules: ['Women\'s Wisdom Module'] },
  { name: 'Field Researcher', modules: ['Somatic Integration'] },
];

// Element color mapping
const elementColors = {
  fire: 'from-fire-base to-fire-glow',
  water: 'from-water-base to-water-glow',
  earth: 'from-earth-base to-earth-glow',
  air: 'from-air-base to-air-glow',
  aether: 'from-purple-600 to-purple-400',
};

const elementIcons = {
  fire: '🔥',
  water: '💧',
  earth: '🌍',
  air: '🌬️',
  aether: '✨',
};

export default function ContributionsPage() {
  const [formData, setFormData] = useState({
    name: '',
    summary: '',
    element: 'fire' as Module['element'],
    benefit: '',
    link: '',
    consent: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [attunedModules, setAttunedModules] = useState<Set<string>>(new Set());

  const handleAttune = (moduleId: string) => {
    setAttunedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      alert('Please acknowledge the contribution ethos to continue.');
      return;
    }

    // TODO: Send to backend/database
    console.log('Submitting idea:', formData);

    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        summary: '',
        element: 'fire',
        benefit: '',
        link: '',
        consent: false,
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-soul-background via-soul-surface to-soul-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-soul-accent" />
            <h1 className="text-4xl font-bold text-soul-textPrimary">Community Contributions</h1>
          </div>
          <p className="text-lg text-soul-textSecondary max-w-2xl mx-auto leading-relaxed">
            A living commons where ideas take root and grow into modules that serve the field.
          </p>
        </div>

        {/* Active Modules */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-soul-border" />
            <h2 className="text-2xl font-semibold text-soul-textPrimary flex items-center gap-2">
              <span className="text-soul-accent">✦</span>
              Active Modules
            </h2>
            <div className="h-px flex-1 bg-soul-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeModules.map(module => (
              <div
                key={module.id}
                className="bg-soul-surface/80 backdrop-blur border border-soul-border rounded-lg p-6 hover:border-soul-accent/40 transition-all duration-300 shadow-sacred-subtle hover:shadow-sacred-glow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{elementIcons[module.element]}</span>
                    <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${elementColors[module.element]} text-white font-medium`}>
                      {module.element}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-soul-accent/20 text-soul-accent font-medium">
                    Live
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-soul-textPrimary mb-2">
                  {module.name}
                </h3>

                <p className="text-soul-textSecondary text-sm mb-4 leading-relaxed">
                  {module.summary}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-soul-borderSubtle">
                  <span className="text-xs text-soul-textTertiary">
                    by {module.contributor}
                  </span>
                  <span className="text-xs text-soul-textTertiary">
                    {new Date(module.dateAdded).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Under Consideration */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-soul-border" />
            <h2 className="text-2xl font-semibold text-soul-textPrimary flex items-center gap-2">
              <span className="text-soul-accent">◇</span>
              Under Consideration
            </h2>
            <div className="h-px flex-1 bg-soul-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {underConsideration.map(module => (
              <div
                key={module.id}
                className="bg-soul-surface/60 backdrop-blur border border-soul-borderSubtle rounded-lg p-6 hover:border-soul-accent/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{elementIcons[module.element]}</span>
                    <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${elementColors[module.element]} text-white font-medium`}>
                      {module.element}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-soul-textTertiary/20 text-soul-textSecondary font-medium">
                    In Review
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-soul-textPrimary mb-2">
                  {module.name}
                </h3>

                <p className="text-soul-textSecondary text-sm mb-4 leading-relaxed">
                  {module.summary}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-soul-borderSubtle">
                  <span className="text-xs text-soul-textTertiary">
                    by {module.contributor}
                  </span>
                  <button
                    onClick={() => handleAttune(module.id)}
                    className={`flex items-center gap-1 text-xs transition-colors ${
                      attunedModules.has(module.id)
                        ? 'text-soul-accent'
                        : 'text-soul-textTertiary hover:text-soul-accent'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${attunedModules.has(module.id) ? 'fill-current' : ''}`} />
                    <span>Attune</span>
                    {module.attunements && (
                      <span className="ml-1">({module.attunements + (attunedModules.has(module.id) ? 1 : 0)})</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Submit Your Idea */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-soul-border" />
            <h2 className="text-2xl font-semibold text-soul-textPrimary flex items-center gap-2">
              <span className="text-soul-accent">○</span>
              Submit Your Idea
            </h2>
            <div className="h-px flex-1 bg-soul-border" />
          </div>

          <div className="bg-soul-surface/80 backdrop-blur border border-soul-border rounded-lg p-8 shadow-sacred-subtle">
            {submitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-soul-accent/20 mb-4">
                  <Sparkles className="w-8 h-8 text-soul-accent" />
                </div>
                <h3 className="text-2xl font-semibold text-soul-textPrimary mb-2">
                  Thank you for your contribution
                </h3>
                <p className="text-soul-textSecondary">
                  Your idea has been received and will be reviewed with care.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-soul-textPrimary mb-2">
                    Module Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-soul-background border border-soul-borderSubtle rounded-lg text-soul-textPrimary placeholder-soul-textTertiary focus:outline-none focus:border-soul-accent transition-colors"
                    placeholder="What would you call this module?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-soul-textPrimary mb-2">
                    Summary <span className="text-soul-textTertiary text-xs">(300 characters max)</span>
                  </label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value.slice(0, 300) })}
                    className="w-full px-4 py-3 bg-soul-background border border-soul-borderSubtle rounded-lg text-soul-textPrimary placeholder-soul-textTertiary focus:outline-none focus:border-soul-accent transition-colors resize-none"
                    rows={3}
                    placeholder="Briefly describe what this module would do..."
                    required
                  />
                  <div className="text-right text-xs text-soul-textTertiary mt-1">
                    {formData.summary.length}/300
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-soul-textPrimary mb-2">
                    Primary Element
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {(['fire', 'water', 'earth', 'air', 'aether'] as const).map(element => (
                      <button
                        key={element}
                        type="button"
                        onClick={() => setFormData({ ...formData, element })}
                        className={`p-3 rounded-lg border transition-all ${
                          formData.element === element
                            ? 'border-soul-accent bg-soul-accent/10 shadow-sacred-glow'
                            : 'border-soul-borderSubtle hover:border-soul-accent/40'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{elementIcons[element]}</div>
                          <div className="text-xs text-soul-textSecondary capitalize">{element}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-soul-textPrimary mb-2">
                    Intended Benefit
                  </label>
                  <textarea
                    value={formData.benefit}
                    onChange={(e) => setFormData({ ...formData, benefit: e.target.value })}
                    className="w-full px-4 py-3 bg-soul-background border border-soul-borderSubtle rounded-lg text-soul-textPrimary placeholder-soul-textTertiary focus:outline-none focus:border-soul-accent transition-colors resize-none"
                    rows={2}
                    placeholder="How would this serve the field?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-soul-textPrimary mb-2">
                    Additional Link <span className="text-soul-textTertiary text-xs">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-3 bg-soul-background border border-soul-borderSubtle rounded-lg text-soul-textPrimary placeholder-soul-textTertiary focus:outline-none focus:border-soul-accent transition-colors"
                    placeholder="Link to a deeper document or reference"
                  />
                </div>

                <div className="bg-soul-background/50 border border-soul-borderSubtle rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded border-soul-borderSubtle text-soul-accent focus:ring-soul-accent"
                      required
                    />
                    <span className="text-sm text-soul-textSecondary leading-relaxed">
                      I share this idea freely for potential inclusion and credit. I understand the team will review all contributions with discernment to maintain harmony in the field.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-soul-accent hover:bg-soul-accentGlow text-soul-background font-semibold rounded-lg transition-all duration-300 shadow-sacred-subtle hover:shadow-sacred-glow flex items-center justify-center gap-2"
                >
                  <span>Share Your Idea</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Hall of Contributors */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-soul-border" />
            <h2 className="text-2xl font-semibold text-soul-textPrimary flex items-center gap-2">
              <span className="text-soul-accent">☆</span>
              Hall of Contributors
            </h2>
            <div className="h-px flex-1 bg-soul-border" />
          </div>

          <p className="text-center text-soul-textSecondary italic mb-8">
            Those who've added to the spiral
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {contributors.map((contributor, idx) => (
              <div
                key={idx}
                className="bg-soul-surface/60 backdrop-blur border border-soul-borderSubtle rounded-lg p-4 text-center hover:border-soul-accent/30 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-soul-accent/20 to-soul-highlight/20 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-soul-accent" />
                </div>
                <h3 className="text-sm font-semibold text-soul-textPrimary mb-1">
                  {contributor.name}
                </h3>
                <p className="text-xs text-soul-textTertiary">
                  {contributor.modules.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Ethos Banner */}
        <div className="bg-gradient-to-r from-soul-surface/60 via-soul-surface/80 to-soul-surface/60 backdrop-blur border border-soul-border rounded-lg p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-4">
              <span className="text-4xl text-soul-accent">✧</span>
            </div>
            <p className="text-lg text-soul-textPrimary leading-relaxed mb-2">
              We build together what the field invites.
            </p>
            <p className="text-soul-textSecondary">
              All voices are welcome; discernment keeps the harmony.
            </p>
          </div>
        </div>

        {/* Back to Community */}
        <div className="mt-12 text-center">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-soul-accent hover:text-soul-accentGlow transition-colors"
          >
            <span>← Back to Community</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
