'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Sparkles } from 'lucide-react';

/**
 * Partner Onboarding - Inquiry Form
 *
 * Intimate, invitational. Fewer fields, more reflection.
 */
export default function OnboardingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    domain: '',
    feeling: '',
    workType: '',
    element: '',
    existingSite: '',
    covenantRead: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Connect to Supabase partners_inquiries table
    console.log('Partner Inquiry Submitted:', formData);

    // Simulate submission
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dune-ibad-blue via-dune-navigator-purple to-soul-background flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <Sparkles className="w-16 h-16 text-gold-amber mx-auto mb-4 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-soul-textPrimary mb-4">
            Your inquiry has been received.
          </h1>
          <p className="text-xl text-dune-dune-amber mb-8">
            We'll reach out within seven days for a quiet conversation.
          </p>
          <div className="text-2xl text-gold-amber font-semibold tracking-archive mb-8">
            You got soul.
          </div>
          <Link
            href="/partners"
            className="inline-block px-8 py-4 bg-gold-amber/20 hover:bg-gold-amber/30 border border-gold-amber/60 rounded-lg text-gold-amber font-semibold transition-all"
          >
            Return to Partners
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dune-ibad-blue via-dune-navigator-purple to-soul-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-gold-amber" />
            <span className="text-sm tracking-etched text-gold-amber uppercase">Begin Inquiry</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-soul-textPrimary mb-4">
            Let's Sense Resonance
          </h1>
          <p className="text-lg text-dune-dune-amber max-w-2xl mx-auto">
            Not every collaboration is meant to happen, and that's okay. This is an invitation to share your vision and see if there's alignment.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-md border border-dune-navigator-purple/40 rounded-lg p-8 md:p-12 space-y-8">

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-soul-textPrimary mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-soul-background border border-soul-borderSubtle rounded-lg text-soul-textPrimary placeholder-soul-textTertiary focus:outline-none focus:border-gold-amber transition-colors"
              placeholder="How should we address you?"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-soul-textPrimary mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-soul-background border border-soul-borderSubtle rounded-lg text-soul-textPrimary placeholder-soul-textTertiary focus:outline-none focus:border-gold-amber transition-colors"
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Domain */}
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-soul-textPrimary mb-2">
              Desired Domain <span className="text-soul-textTertiary text-xs">(if you have one in mind)</span>
            </label>
            <input
              type="text"
              id="domain"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className="w-full px-4 py-3 bg-soul-background border border-soul-borderSubtle rounded-lg text-soul-textPrimary placeholder-soul-textTertiary focus:outline-none focus:border-gold-amber transition-colors"
              placeholder="yourpractice.com"
            />
          </div>

          {/* What do you want it to feel like? */}
          <div>
            <label htmlFor="feeling" className="block text-sm font-medium text-soul-textPrimary mb-2">
              What do you want your technology to <em>feel</em> like?
            </label>
            <textarea
              id="feeling"
              value={formData.feeling}
              onChange={(e) => setFormData({ ...formData, feeling: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-soul-background border border-soul-borderSubtle rounded-lg text-soul-textPrimary placeholder-soul-textTertiary focus:outline-none focus:border-gold-amber transition-colors resize-none"
              placeholder="Describe the atmosphere, rhythm, or presence you want your clients to experience..."
              required
            />
          </div>

          {/* What kind of work do you hold? */}
          <div>
            <label htmlFor="workType" className="block text-sm font-medium text-soul-textPrimary mb-2">
              What kind of work do you hold?
            </label>
            <textarea
              id="workType"
              value={formData.workType}
              onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-soul-background border border-soul-borderSubtle rounded-lg text-soul-textPrimary placeholder-soul-textTertiary focus:outline-none focus:border-gold-amber transition-colors resize-none"
              placeholder="Therapy, teaching, healing, creative practice... tell us about the soul of your work."
              required
            />
          </div>

          {/* Element Selection */}
          <div>
            <label className="block text-sm font-medium text-soul-textPrimary mb-4">
              Which element feels closest to your practice?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { value: 'fire', label: 'Fire', emoji: '🔥', color: 'fire-base' },
                { value: 'water', label: 'Water', emoji: '💧', color: 'water-base' },
                { value: 'earth', label: 'Earth', emoji: '🌱', color: 'earth-base' },
                { value: 'air', label: 'Air', emoji: '🌬️', color: 'air-base' },
                { value: 'aether', label: 'Aether', emoji: '✨', color: 'gold-amber' },
              ].map((element) => (
                <button
                  key={element.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, element: element.value })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.element === element.value
                      ? `border-${element.color} bg-${element.color}/20`
                      : 'border-soul-borderSubtle bg-soul-background hover:border-soul-border'
                  }`}
                >
                  <div className="text-2xl mb-1">{element.emoji}</div>
                  <div className={`text-sm font-medium ${
                    formData.element === element.value ? 'text-soul-textPrimary' : 'text-soul-textSecondary'
                  }`}>
                    {element.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Existing Site (Optional) */}
          <div>
            <label htmlFor="existingSite" className="block text-sm font-medium text-soul-textPrimary mb-2">
              Link to existing site or work <span className="text-soul-textTertiary text-xs">(optional)</span>
            </label>
            <input
              type="url"
              id="existingSite"
              value={formData.existingSite}
              onChange={(e) => setFormData({ ...formData, existingSite: e.target.value })}
              className="w-full px-4 py-3 bg-soul-background border border-soul-borderSubtle rounded-lg text-soul-textPrimary placeholder-soul-textTertiary focus:outline-none focus:border-gold-amber transition-colors"
              placeholder="https://..."
            />
          </div>

          {/* Covenant Consent */}
          <div className="border-t border-soul-border pt-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.covenantRead}
                onChange={(e) => setFormData({ ...formData, covenantRead: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-soul-border bg-soul-background checked:bg-gold-amber checked:border-gold-amber focus:ring-2 focus:ring-gold-amber/50 transition-colors"
                required
              />
              <span className="text-sm text-soul-textSecondary group-hover:text-soul-textPrimary transition-colors">
                I've read the{' '}
                <Link href="/partners/covenant" className="text-gold-amber hover:underline" target="_blank">
                  Field Partner Covenant
                </Link>
                {' '}and feel aligned with its principles. I understand this is a mutual commitment to sacred practice, not a transactional service agreement.
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Link
              href="/partners"
              className="flex-1 px-6 py-4 bg-soul-surface hover:bg-soul-surfaceHover border border-soul-border rounded-lg text-soul-textPrimary text-center font-semibold transition-all"
            >
              Not Yet
            </Link>
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-gold-amber/20 hover:bg-gold-amber/30 border border-gold-amber/60 rounded-lg text-gold-amber font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!formData.covenantRead}
            >
              Submit Inquiry
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-soul-textTertiary text-center italic mt-4">
            This is the beginning of a conversation, not a binding commitment. We'll reach out to sense resonance together.
          </p>
        </form>
      </div>
    </div>
  );
}
