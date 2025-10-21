'use client';

import Link from 'next/link';
import { Code, BookOpen, Palette, Package } from 'lucide-react';

/**
 * Partner Resources - Developer & Steward Tools
 *
 * Practical guidance for collaborators, devs, designers
 */
export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dune-ibad-blue via-dune-navigator-purple to-soul-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Code className="w-6 h-6 text-gold-amber" />
            <span className="text-sm tracking-etched text-gold-amber uppercase">Resources</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-soul-textPrimary mb-4">
            Build With Care
          </h1>
          <p className="text-lg text-dune-dune-amber max-w-3xl mx-auto">
            Tools, guidelines, and design tokens for developers, designers, and stewards building on Soullab Inside.
          </p>
        </div>

        {/* SDK Introduction */}
        <div className="bg-black/40 backdrop-blur-md border border-dune-navigator-purple/40 rounded-lg p-8 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-8 h-8 text-gold-amber" />
            <h2 className="text-2xl font-bold text-soul-textPrimary">Soullab Inside SDK</h2>
          </div>
          <p className="text-soul-textSecondary mb-6">
            A framework that remembers presence while you build.
          </p>

          {/* Installation */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-soul-textPrimary mb-3">Installation</h3>
            <div className="bg-soul-background/80 border border-soul-borderSubtle rounded-lg p-4 font-mono text-sm text-soul-textPrimary overflow-x-auto">
              <code>npm install @soullab/inside</code>
            </div>
          </div>

          {/* Basic Usage */}
          <div>
            <h3 className="text-lg font-semibold text-soul-textPrimary mb-3">Basic Usage</h3>
            <div className="bg-soul-background/80 border border-soul-borderSubtle rounded-lg p-4 font-mono text-sm text-soul-textSecondary overflow-x-auto">
              <pre>{`import { SoullabProvider, useOracle } from '@soullab/inside';

function App() {
  return (
    <SoullabProvider
      config={{
        partnerId: 'your-partner-id',
        element: 'water',
        theme: 'dune-night'
      }}
    >
      <YourPracticeSpace />
    </SoullabProvider>
  );
}

// In your components
function ConversationFlow() {
  const { oracle, send } = useOracle();

  return (
    <div>
      {/* Your sacred space flows here */}
    </div>
  );
}`}</pre>
            </div>
          </div>

          <p className="text-xs text-soul-textTertiary italic mt-6">
            Note: Full SDK documentation is currently in development. Contact the Soullab team for early access and support.
          </p>
        </div>

        {/* Design System */}
        <div className="bg-black/40 backdrop-blur-md border border-dune-navigator-purple/40 rounded-lg p-8 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-8 h-8 text-gold-amber" />
            <h2 className="text-2xl font-bold text-soul-textPrimary">Design System Tokens</h2>
          </div>
          <p className="text-soul-textSecondary mb-6">
            Colors, spacing, typography, and motion principles that make Soullab breathe.
          </p>

          {/* Color Palette */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-soul-textPrimary mb-4">Elemental Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className="w-full h-16 bg-fire-base rounded-lg mb-2 border border-fire-glow"></div>
                <p className="text-xs text-soul-textPrimary font-medium">Fire</p>
                <p className="text-xs text-soul-textTertiary font-mono">#C85450</p>
              </div>
              <div>
                <div className="w-full h-16 bg-water-base rounded-lg mb-2 border border-water-glow"></div>
                <p className="text-xs text-soul-textPrimary font-medium">Water</p>
                <p className="text-xs text-soul-textTertiary font-mono">#6B9BD1</p>
              </div>
              <div>
                <div className="w-full h-16 bg-earth-base rounded-lg mb-2 border border-earth-glow"></div>
                <p className="text-xs text-soul-textPrimary font-medium">Earth</p>
                <p className="text-xs text-soul-textTertiary font-mono">#7A9A65</p>
              </div>
              <div>
                <div className="w-full h-16 bg-air-base rounded-lg mb-2 border border-air-glow"></div>
                <p className="text-xs text-soul-textPrimary font-medium">Air</p>
                <p className="text-xs text-soul-textTertiary font-mono">#D4B896</p>
              </div>
              <div>
                <div className="w-full h-16 bg-gold-amber rounded-lg mb-2 border border-gold-ethereal"></div>
                <p className="text-xs text-soul-textPrimary font-medium">Aether</p>
                <p className="text-xs text-soul-textTertiary font-mono">#E3B778</p>
              </div>
            </div>
          </div>

          {/* Sacred Spacing */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-soul-textPrimary mb-4">Sacred Spacing (Golden Ratio)</h3>
            <div className="bg-soul-background/50 border border-soul-borderSubtle rounded-lg p-4">
              <ul className="space-y-2 text-sm text-soul-textSecondary font-mono">
                <li>sacred-xs: 0.618rem (φ⁻¹)</li>
                <li>sacred-sm: 1rem (base)</li>
                <li>sacred-md: 1.618rem (φ)</li>
                <li>sacred-lg: 2.618rem (φ + 1)</li>
                <li>sacred-xl: 4.236rem (φ²)</li>
              </ul>
            </div>
          </div>

          {/* Typography */}
          <div>
            <h3 className="text-lg font-semibold text-soul-textPrimary mb-4">Typography</h3>
            <div className="space-y-3">
              <div>
                <p className="font-serif text-2xl text-soul-textPrimary mb-1">Spectral (Serif)</p>
                <p className="text-xs text-soul-textTertiary">Body text, contemplative moments</p>
              </div>
              <div>
                <p className="font-sans text-2xl text-soul-textPrimary mb-1">Atkinson Hyperlegible (Sans)</p>
                <p className="text-xs text-soul-textTertiary">UI elements, clear communication</p>
              </div>
            </div>
          </div>
        </div>

        {/* Module Guidelines */}
        <div className="bg-black/40 backdrop-blur-md border border-dune-navigator-purple/40 rounded-lg p-8 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-gold-amber" />
            <h2 className="text-2xl font-bold text-soul-textPrimary">Creating Modules</h2>
          </div>
          <p className="text-soul-textSecondary mb-6">
            Want to contribute a module back to the Commons? Here's how to ensure it integrates with grace.
          </p>

          <div className="space-y-4 text-soul-textSecondary">
            <div>
              <h3 className="text-base font-semibold text-soul-textPrimary mb-2">1. Choose Your Element</h3>
              <p className="text-sm">
                Every module aligns with an elemental quality: Fire (transformation), Water (flow), Earth (grounding), Air (connection), or Aether (integration).
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-soul-textPrimary mb-2">2. Design for Presence</h3>
              <p className="text-sm">
                Modules should invite attention, not demand it. Use subtle animations, generous spacing, and clear purpose.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-soul-textPrimary mb-2">3. Honor Data Sovereignty</h3>
              <p className="text-sm">
                Never send data to third parties without explicit user consent. Store locally first, export gracefully.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-soul-textPrimary mb-2">4. Submit to Commons</h3>
              <p className="text-sm">
                Propose your module at{' '}
                <Link href="/community/contributions" className="text-gold-amber hover:underline">
                  Community Contributions
                </Link>
                . The stewardship panel will review for alignment and technical integrity.
              </p>
            </div>
          </div>
        </div>

        {/* Brand Assets */}
        <div className="bg-black/40 backdrop-blur-md border border-dune-navigator-purple/40 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-soul-textPrimary mb-4">Soullab Inside Badge</h2>
          <p className="text-soul-textSecondary mb-6">
            Display the Soullab Inside mark on your site to signal ethical tech built with presence.
          </p>

          {/* Badge Preview */}
          <div className="bg-soul-background/50 border border-soul-borderSubtle rounded-lg p-8 text-center mb-6">
            <div className="inline-block">
              <p className="text-lg font-semibold text-gold-amber mb-1">Soullab Inside</p>
              <p className="text-xs text-soul-textTertiary italic">This system breathes. You got soul.</p>
            </div>
          </div>

          {/* Brand Usage Note */}
          <div className="bg-soul-background/30 border border-soul-borderSubtle rounded-lg p-6">
            <h3 className="text-base font-semibold text-soul-textPrimary mb-3">Brand Usage Note</h3>
            <div className="text-sm text-soul-textSecondary space-y-3">
              <p>
                The <em>Soullab Inside</em> mark signals that a site or system is built with the Soullab framework — technology designed to honor presence, protect data as sacred, and circulate resources regeneratively.
              </p>
              <p className="font-semibold text-soul-textPrimary">Display Guidelines</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the provided badge files only; do not alter colors, proportions, or text.</li>
                <li>The mark may appear in a site footer, about page, or launch screen — quietly, never as an ad.</li>
                <li>Always link the badge to <code className="text-gold-amber">soullab.life/foundation/ethos</code>.</li>
                <li>The subtext line may be used, but never replaced.</li>
              </ul>
              <p className="font-semibold text-soul-textPrimary">Spirit of Use</p>
              <p>
                The badge isn't a marketing credential; it's a trust mark. Display it only on systems that uphold the Covenant — no extraction, transparent flow, and care with data.
              </p>
            </div>
          </div>

          <p className="text-xs text-soul-textTertiary italic mt-4">
            SVG and PNG assets coming soon. Contact the Soullab team for early access.
          </p>
        </div>

        {/* Link to Foundation Ethos */}
        <div className="text-center bg-black/40 backdrop-blur-md border border-dune-navigator-purple/40 rounded-lg p-8">
          <h2 className="text-xl font-bold text-soul-textPrimary mb-3">
            Ethical Alignment
          </h2>
          <p className="text-soul-textSecondary mb-6">
            All Soullab Inside development is rooted in the Foundation's ethical framework.
          </p>
          <Link
            href="/foundation/ethos"
            className="inline-block px-6 py-3 bg-gold-amber/20 hover:bg-gold-amber/30 border border-gold-amber/60 rounded-lg text-gold-amber font-semibold transition-all"
          >
            Read Foundation Ethos
          </Link>
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
