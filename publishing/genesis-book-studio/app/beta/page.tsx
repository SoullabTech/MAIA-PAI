import Link from 'next/link'
import {
  BookOpen,
  Users,
  Sparkles,
  Zap,
  Heart,
  Gift,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'

export default function BetaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fire/5 via-air/5 to-water/5">
      {/* Header */}
      <header className="border-b border-leather/20 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-heading font-bold text-gray-900">
              Genesis Book Studio
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Home
              </Link>
              <Link
                href="https://forms.soullab.life/beta-genesis-book-studio"
                className="px-6 py-2 bg-fire text-white rounded-lg hover:bg-fire-dark transition font-semibold"
              >
                Apply for Beta
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-fire/10 text-fire rounded-full text-sm font-semibold mb-6">
          <Gift size={16} />
          Beta Tester Gift Program
        </div>

        <h1 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
          Create Your Book with<br />
          <span className="bg-gradient-to-r from-fire via-air to-water bg-clip-text text-transparent">
            AI-Powered Collaboration
          </span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Join select creators in beta testing Genesis Book Studio - a revolutionary
          platform for writing, editing, and publishing transformative books.
        </p>

        <div className="flex items-center justify-center gap-4 mb-12">
          <Link
            href="https://forms.soullab.life/beta-genesis-book-studio"
            className="px-8 py-4 bg-fire text-white rounded-lg hover:bg-fire-dark transition font-semibold text-lg flex items-center gap-2"
          >
            Apply for Free Beta Access
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/editor/elemental-alchemy"
            className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-fire hover:text-fire transition font-semibold text-lg"
          >
            See Demo
          </Link>
        </div>

        <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-fire" />
            <span>6 Months Free</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-fire" />
            <span>50% Lifetime Discount</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-fire" />
            <span>Shape the Product</span>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              What Beta Testers Receive
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to create a professional book
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Full Platform Access */}
            <div className="bg-gradient-to-br from-fire/5 to-fire/10 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-fire/20 flex items-center justify-center mb-4">
                <BookOpen className="text-fire" size={24} />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">
                Full Platform Access
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-fire mt-1 flex-shrink-0" />
                  <span>Collaborative rich text editor</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-fire mt-1 flex-shrink-0" />
                  <span>Team workspace (5 members)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-fire mt-1 flex-shrink-0" />
                  <span>MAIA AI writing assistants</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-fire mt-1 flex-shrink-0" />
                  <span>Multi-format export</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-fire mt-1 flex-shrink-0" />
                  <span>6 months completely free</span>
                </li>
              </ul>
            </div>

            {/* Early Adopter Benefits */}
            <div className="bg-gradient-to-br from-air/5 to-air/10 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-air/20 flex items-center justify-center mb-4">
                <Zap className="text-air" size={24} />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">
                Early Adopter Perks
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-air mt-1 flex-shrink-0" />
                  <span>50% lifetime discount after beta</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-air mt-1 flex-shrink-0" />
                  <span>Your feedback shapes features</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-air mt-1 flex-shrink-0" />
                  <span>Featured case study opportunity</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-air mt-1 flex-shrink-0" />
                  <span>Priority feature requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-air mt-1 flex-shrink-0" />
                  <span>Founding beta tester badge</span>
                </li>
              </ul>
            </div>

            {/* Support Package */}
            <div className="bg-gradient-to-br from-water/5 to-water/10 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-water/20 flex items-center justify-center mb-4">
                <Heart className="text-water" size={24} />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">
                Premium Support
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-water mt-1 flex-shrink-0" />
                  <span>30-min onboarding call</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-water mt-1 flex-shrink-0" />
                  <span>Weekly office hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-water mt-1 flex-shrink-0" />
                  <span>Private Slack community</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-water mt-1 flex-shrink-0" />
                  <span>Direct line to founders</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-water mt-1 flex-shrink-0" />
                  <span>Priority bug fixes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
            Simple Application Process
          </h2>
          <p className="text-xl text-gray-600">
            From application to publishing in days, not months
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-fire/10 flex items-center justify-center text-fire font-bold text-2xl mx-auto mb-4">
              1
            </div>
            <h3 className="font-heading font-bold mb-2">Apply</h3>
            <p className="text-gray-600 text-sm">
              Tell us about your book project and why you want to beta test
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-air/10 flex items-center justify-center text-air font-bold text-2xl mx-auto mb-4">
              2
            </div>
            <h3 className="font-heading font-bold mb-2">Quick Chat</h3>
            <p className="text-gray-600 text-sm">
              15-min call to learn about your needs and explain the platform
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-earth/10 flex items-center justify-center text-earth font-bold text-2xl mx-auto mb-4">
              3
            </div>
            <h3 className="font-heading font-bold mb-2">Get Access</h3>
            <p className="text-gray-600 text-sm">
              Receive your gift code and welcome packet within 24 hours
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-water/10 flex items-center justify-center text-water font-bold text-2xl mx-auto mb-4">
              4
            </div>
            <h3 className="font-heading font-bold mb-2">Start Creating</h3>
            <p className="text-gray-600 text-sm">
              Import your manuscript, invite your team, and start writing!
            </p>
          </div>
        </div>
      </section>

      {/* Ideal Beta Tester */}
      <section className="bg-gradient-to-br from-parchment/20 to-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-6">
            Is This Right for You?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            We&apos;re looking for creators who are:
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="flex gap-4">
              <CheckCircle className="text-fire flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-1">
                  Writing transformative content
                </h3>
                <p className="text-gray-600 text-sm">
                  Consciousness, spirituality, personal growth, or wisdom teachings
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="text-fire flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-1">
                  Working with teams
                </h3>
                <p className="text-gray-600 text-sm">
                  Authors, editors, designers collaborating on projects
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="text-fire flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-1">
                  Interested in AI assistance
                </h3>
                <p className="text-gray-600 text-sm">
                  Curious about how AI can enhance creativity and flow
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="text-fire flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-1">
                  Creating &ldquo;living books&rdquo;
                </h3>
                <p className="text-gray-600 text-sm">
                  Books that integrate with digital platforms and communities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-fire via-air to-water py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Ready to Create Your Book?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the beta program and receive 6 months free access plus lifetime benefits
          </p>
          <Link
            href="https://forms.soullab.life/beta-genesis-book-studio"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-fire rounded-lg hover:bg-gray-100 transition font-bold text-lg"
          >
            Apply for Beta Access
            <ArrowRight size={24} />
          </Link>
          <p className="mt-6 text-sm opacity-75">
            Limited spots available • Rolling acceptance • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-heading font-bold text-white mb-4">
                Genesis Book Studio
              </h3>
              <p className="text-sm">
                Part of the Soullab ecosystem - tools for consciousness expansion
                and transformative learning.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition">
                    Platform Home
                  </Link>
                </li>
                <li>
                  <Link href="/editor/elemental-alchemy" className="hover:text-white transition">
                    Live Demo
                  </Link>
                </li>
                <li>
                  <a href="https://docs.soullab.life" className="hover:text-white transition">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:beta@soullab.life"
                    className="hover:text-white transition"
                  >
                    beta@soullab.life
                  </a>
                </li>
                <li>
                  <a
                    href="https://soullab.life"
                    className="hover:text-white transition"
                  >
                    soullab.life
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>© 2025 Soullab Media. Built with consciousness. 🔥💨💧🌍</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
