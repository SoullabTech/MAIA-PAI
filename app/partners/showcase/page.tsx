'use client';

import Link from 'next/link';
import { ExternalLink, Sparkles } from 'lucide-react';

/**
 * Partner Showcase - Living Portfolio
 *
 * Humble celebration of aligned collaborations
 */
export default function ShowcasePage() {
  const partners = [
    {
      name: 'Loralee Davis',
      discipline: 'Astrology & Spiralogic',
      element: 'aether',
      elementIcon: '✨',
      since: '2025',
      description: 'Loralee brings decades of astrological wisdom into conversation with the Spiralogic Oracle. Her practice maps celestial patterns as soul curriculum, helping clients understand their birth chart as a living, breathing guide to their unique path.',
      siteUrl: '#', // TODO: Add actual URL when live
      screenshot: null, // TODO: Add screenshot when available
    },
    {
      name: 'Dr. Angela',
      discipline: "Women's Wisdom Module",
      element: 'water',
      elementIcon: '💧',
      since: '2025',
      description: "Dr. Angela's work creates sacred space for women's deep knowing. Her module explores cycles, embodiment, and collective healing practices rooted in ancient wisdom and contemporary psychology.",
      siteUrl: '#', // TODO: Add actual URL when live
      screenshot: null,
    },
    {
      name: 'Kelly Nezat',
      discipline: 'Elemental Alchemy',
      element: 'earth',
      elementIcon: '🌱',
      since: '2025',
      description: 'Author of "Elemental Alchemy," Kelly guides practitioners through the transformative power of elemental consciousness. Her work weaves somatic practice, ritual, and the wisdom of Fire, Water, Earth, Air, and Aether into everyday life.',
      siteUrl: '#', // TODO: Add actual URL when live
      screenshot: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dune-ibad-blue via-dune-navigator-purple to-soul-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-gold-amber" />
            <span className="text-sm tracking-etched text-gold-amber uppercase">Partner Showcase</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-soul-textPrimary mb-4">
            Sacred Tech in Practice
          </h1>
          <p className="text-lg text-dune-dune-amber max-w-3xl mx-auto">
            These practitioners are building their digital spaces with Soullab Inside — technology that honors the work they hold.
          </p>
        </div>

        {/* Partner Cards */}
        <div className="space-y-12 mb-16">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-black/40 backdrop-blur-md border border-dune-navigator-purple/40 rounded-lg overflow-hidden hover:border-gold-amber/60 transition-all group"
            >
              <div className="grid md:grid-cols-3 gap-8 p-8">
                {/* Left: Partner Info */}
                <div className="md:col-span-2">
                  {/* Name & Discipline */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{partner.elementIcon}</span>
                      <h2 className="text-2xl font-bold text-soul-textPrimary">
                        {partner.name}
                      </h2>
                    </div>
                    <p className="text-gold-amber font-medium">{partner.discipline}</p>
                    <p className="text-sm text-soul-textTertiary mt-1">
                      Soullab Inside · Field Partner since {partner.since}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-soul-textSecondary leading-relaxed mb-6">
                    {partner.description}
                  </p>

                  {/* Visit Site Button */}
                  <a
                    href={partner.siteUrl}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gold-amber/20 hover:bg-gold-amber/30 border border-gold-amber/60 rounded-lg text-gold-amber font-semibold transition-all group-hover:scale-105"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Site
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Right: Screenshot Placeholder */}
                <div className="md:col-span-1">
                  <div className="aspect-[4/3] bg-soul-background/50 border border-soul-borderSubtle rounded-lg flex items-center justify-center">
                    {partner.screenshot ? (
                      <img
                        src={partner.screenshot}
                        alt={`${partner.name}'s site`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center p-6">
                        <Sparkles className="w-12 h-12 text-gold-amber/40 mx-auto mb-2" />
                        <p className="text-sm text-soul-textTertiary">
                          Site launching soon
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Badge */}
              <div className="bg-soul-background/30 px-8 py-3 border-t border-soul-borderSubtle">
                <p className="text-xs text-soul-textTertiary italic text-center">
                  <span className="text-gold-amber font-semibold">Soullab Inside</span> — This system breathes.
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-black/40 backdrop-blur-md border border-dune-navigator-purple/40 rounded-lg p-12">
          <h2 className="text-2xl font-bold text-soul-textPrimary mb-4">
            If your work carries soul, your technology should too.
          </h2>
          <p className="text-soul-textSecondary mb-8 max-w-2xl mx-auto">
            These are the first practitioners building with Soullab Inside. Each partnership is a collaboration, not a template.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/partners/covenant"
              className="px-8 py-4 bg-soul-surface hover:bg-soul-surfaceHover border border-soul-border rounded-lg text-soul-textPrimary font-semibold transition-all"
            >
              Read the Covenant
            </Link>
            <Link
              href="/partners/onboarding"
              className="px-8 py-4 bg-gold-amber/20 hover:bg-gold-amber/30 border border-gold-amber/60 rounded-lg text-gold-amber font-semibold transition-all"
            >
              Begin Inquiry
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/partners"
            className="text-soul-textTertiary hover:text-gold-amber transition-colors"
          >
            ← Back to Partners
          </Link>
        </div>
      </div>
    </div>
  );
}
