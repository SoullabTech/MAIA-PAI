'use client';

import Link from 'next/link';
import { FileText, Download, Heart } from 'lucide-react';

/**
 * Field Partner Covenant - Public Display
 *
 * Legal clarity meets poetic care
 */
export default function CovenantPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dune-ibad-blue via-dune-navigator-purple to-soul-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-gold-amber" />
            <span className="text-sm tracking-etched text-gold-amber uppercase">Field Partner Covenant</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-soul-textPrimary mb-4">
            Our Mutual Agreement
          </h1>
          <p className="text-lg text-dune-dune-amber max-w-2xl mx-auto">
            This is the sacred agreement that protects coherence, honors sovereignty, and ensures every partnership breathes with integrity.
          </p>
        </div>

        {/* Download Option */}
        <div className="flex justify-center mb-12">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gold-amber/20 hover:bg-gold-amber/30 border border-gold-amber/60 rounded-lg text-gold-amber font-semibold transition-all">
            <Download className="w-4 h-4" />
            Download PDF for Review
          </button>
        </div>

        {/* Covenant Content */}
        <div className="bg-black/40 backdrop-blur-md border border-dune-navigator-purple/40 rounded-lg p-8 md:p-12 space-y-8 text-soul-textPrimary">

          {/* Preamble */}
          <section>
            <h2 className="text-2xl font-bold text-gold-amber mb-4">Preamble</h2>
            <p className="leading-relaxed text-soul-textSecondary">
              This Covenant establishes the terms, expectations, and ethical foundations for collaboration between
              Soullab Foundation (the "Stewards") and Field Partners who wish to build upon the Soullab Inside framework.
            </p>
            <p className="leading-relaxed text-soul-textSecondary mt-4">
              It is designed to protect both parties, honor the work, and ensure that technology built through this partnership
              remains coherent with the principles of sacred presence, regenerative design, and data sovereignty.
            </p>
          </section>

          {/* Section 1: Definitions */}
          <section>
            <h2 className="text-2xl font-bold text-gold-amber mb-4">1. Definitions</h2>
            <div className="space-y-3 text-soul-textSecondary">
              <p><strong className="text-soul-textPrimary">Field Partner:</strong> An individual practitioner, organization, or collective who enters into this Covenant to build a digital practice space using Soullab Inside infrastructure.</p>
              <p><strong className="text-soul-textPrimary">Soullab Inside:</strong> The technical and ethical framework provided by Soullab Foundation, including shared infrastructure, conversational intelligence modules, design systems, and community-contributed components.</p>
              <p><strong className="text-soul-textPrimary">Partner Instance:</strong> The unique digital environment created for and stewarded by the Field Partner, including custom flows, content, data, and client interactions.</p>
              <p><strong className="text-soul-textPrimary">The Commons:</strong> The shared repository of community-contributed modules, patterns, and practices available to all Field Partners and the broader Soullab community.</p>
            </div>
          </section>

          {/* Section 2: Mutual Commitments */}
          <section>
            <h2 className="text-2xl font-bold text-gold-amber mb-4">2. Mutual Commitments</h2>

            <h3 className="text-lg font-semibold text-soul-textPrimary mt-6 mb-3">2.1 Soullab Foundation Commits To:</h3>
            <ul className="list-disc list-inside space-y-2 text-soul-textSecondary ml-4">
              <li>Maintain infrastructure reliability, security, and performance standards</li>
              <li>Provide ongoing technical support and collaborative evolution of features</li>
              <li>Honor data sovereignty: Partner data remains Partner property</li>
              <li>Transparent communication about system changes, updates, or challenges</li>
              <li>Regular stewardship reports showing how partner contributions flow back to the Commons</li>
              <li>Protection of Partner brand integrity and practice sovereignty</li>
            </ul>

            <h3 className="text-lg font-semibold text-soul-textPrimary mt-6 mb-3">2.2 Field Partner Commits To:</h3>
            <ul className="list-disc list-inside space-y-2 text-soul-textSecondary ml-4">
              <li>Uphold ethical use of technology aligned with Soullab's foundational values</li>
              <li>Maintain responsibility for content, client relationships, and practice standards within their instance</li>
              <li>Provide feedback, bug reports, and collaborative insights to improve the shared system</li>
              <li>Honor financial agreements (subscription, project fees, or sliding scale arrangements)</li>
              <li>Credit Soullab Inside appropriately in public-facing materials (badge, footer attribution)</li>
              <li>Contribute learnings back to the Commons when appropriate and possible</li>
            </ul>
          </section>

          {/* Section 3: Data Sovereignty */}
          <section>
            <h2 className="text-2xl font-bold text-gold-amber mb-4">3. Data Sovereignty & Privacy</h2>
            <div className="space-y-3 text-soul-textSecondary">
              <p><strong className="text-soul-textPrimary">3.1 Partner Data Ownership:</strong> All client data, conversation logs, intake forms, session notes, and custom content created within the Partner Instance belong solely to the Field Partner.</p>
              <p><strong className="text-soul-textPrimary">3.2 Data Portability:</strong> At any time, Field Partner may request full export of their data in standard formats (JSON, CSV, etc.). Soullab will facilitate this within 14 days.</p>
              <p><strong className="text-soul-textPrimary">3.3 No Training on Private Data:</strong> Soullab Foundation will never use Partner client data to train AI models or improve systems without explicit, written consent.</p>
              <p><strong className="text-soul-textPrimary">3.4 Anonymized Insights:</strong> With Partner permission, anonymized, aggregated patterns (e.g., "common themes in therapeutic intake flows") may be used to improve the Commons.</p>
            </div>
          </section>

          {/* Section 4: Financial Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gold-amber mb-4">4. Financial Terms & Regenerative Flow</h2>
            <div className="space-y-3 text-soul-textSecondary">
              <p><strong className="text-soul-textPrimary">4.1 Service Tiers:</strong> Partners select a tier (Seed, Grow, Thrive, Emanate) based on scope, features, and organizational capacity.</p>
              <p><strong className="text-soul-textPrimary">4.2 Subscription Model:</strong> Monthly or annual subscriptions sustain infrastructure, support, and ongoing development.</p>
              <p><strong className="text-soul-textPrimary">4.3 Sliding Scale for Seed Tier:</strong> Early-stage practitioners or charitable projects may negotiate reduced fees or donation-based arrangements.</p>
              <p><strong className="text-soul-textPrimary">4.4 Regenerative Tithe:</strong> 10% of all partner subscription revenue flows to the Community Care & Regeneration Pool, funding:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Commons infrastructure and open-source development</li>
                  <li>Grants for Seed-tier partners who cannot afford full fees</li>
                  <li>Community stewardship and moderation</li>
                </ul>
              </p>
            </div>
          </section>

          {/* Section 5: Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gold-amber mb-4">5. Intellectual Property & Contributions</h2>
            <div className="space-y-3 text-soul-textSecondary">
              <p><strong className="text-soul-textPrimary">5.1 Soullab Inside Framework:</strong> The core framework (code, design system, modules) remains the intellectual property of Soullab Foundation and is shared under open-source licenses (MIT/CC-BY-SA).</p>
              <p><strong className="text-soul-textPrimary">5.2 Partner-Created Content:</strong> All custom content, branding, and unique features created by or for the Field Partner belong to the Partner.</p>
              <p><strong className="text-soul-textPrimary">5.3 Contributions to the Commons:</strong> If a Partner develops a module or feature they wish to share, they may contribute it to the Commons under open licenses. This is encouraged but never required.</p>
              <p><strong className="text-soul-textPrimary">5.4 Attribution:</strong> Partners agree to display "Soullab Inside" badge or footer attribution on their public-facing site.</p>
            </div>
          </section>

          {/* Section 6: Graceful Endings */}
          <section>
            <h2 className="text-2xl font-bold text-gold-amber mb-4">6. Graceful Endings & Transition</h2>
            <div className="space-y-3 text-soul-textSecondary">
              <p><strong className="text-soul-textPrimary">6.1 Partner-Initiated Exit:</strong> Partners may end their subscription at any time with 30 days' notice. All data will be exported and provided to Partner.</p>
              <p><strong className="text-soul-textPrimary">6.2 Soullab-Initiated Transition:</strong> If partnership becomes misaligned with foundational values, Soullab may initiate a transition with 90 days' notice and support for migration.</p>
              <p><strong className="text-soul-textPrimary">6.3 Data Deletion:</strong> After Partner exit, Soullab will delete all Partner data from active systems within 60 days, retaining only anonymized logs required for security/legal compliance.</p>
              <p><strong className="text-soul-textPrimary">6.4 Continued Access to Commons:</strong> Even after ending a partnership, former Partners retain access to community-contributed modules under their open licenses.</p>
            </div>
          </section>

          {/* Section 7: Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-gold-amber mb-4">7. Dispute Resolution & Amendments</h2>
            <div className="space-y-3 text-soul-textSecondary">
              <p><strong className="text-soul-textPrimary">7.1 Conflict Resolution:</strong> Before legal action, both parties commit to 60 days of good-faith mediation facilitated by a neutral third party.</p>
              <p><strong className="text-soul-textPrimary">7.2 Covenant Amendments:</strong> Soullab may update this Covenant to reflect evolving practices. Partners will receive 60 days' notice and opportunity to review changes before they take effect.</p>
              <p><strong className="text-soul-textPrimary">7.3 Governing Law:</strong> This agreement is governed by the laws of [State/Country where Soullab Foundation is registered].</p>
            </div>
          </section>

          {/* Signature Section */}
          <section className="border-t border-soul-border pt-8 mt-12">
            <h2 className="text-2xl font-bold text-gold-amber mb-4">Acknowledgment</h2>
            <p className="text-soul-textSecondary leading-relaxed mb-6">
              By signing this Covenant (or indicating agreement via digital signature at onboarding), both parties acknowledge
              they have read, understood, and commit to these terms in the spirit of mutual respect, sacred practice, and regenerative collaboration.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <p className="text-sm text-soul-textTertiary mb-2">Field Partner Signature:</p>
                <div className="border-b border-soul-border pb-2 mb-1"></div>
                <p className="text-xs text-soul-textTertiary">Name & Date</p>
              </div>
              <div>
                <p className="text-sm text-soul-textTertiary mb-2">Soullab Foundation Representative:</p>
                <div className="border-b border-soul-border pb-2 mb-1"></div>
                <p className="text-xs text-soul-textTertiary">Name & Date</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/partners"
            className="px-6 py-3 bg-soul-surface hover:bg-soul-surfaceHover border border-soul-border rounded-lg text-soul-textPrimary transition-all"
          >
            Back to Partners
          </Link>
          <Link
            href="/partners/onboarding"
            className="px-6 py-3 bg-gold-amber/20 hover:bg-gold-amber/30 border border-gold-amber/60 rounded-lg text-gold-amber font-semibold transition-all"
          >
            Begin Inquiry
          </Link>
        </div>

        {/* Reference Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-soul-textTertiary">
            For full Foundation Charter and governance principles, see{' '}
            <Link href="/foundation/charter-full.pdf" className="text-gold-amber hover:underline">
              Foundation Charter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
