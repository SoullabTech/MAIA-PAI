import Link from 'next/link'
import { BookOpen, Sparkles, Users, Gift, ArrowRight, CheckCircle } from 'lucide-react'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fire/5 via-air/5 to-water/5">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-fire to-air mb-6">
          <Sparkles className="text-white" size={40} />
        </div>

        <h1 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-4">
          Welcome to Genesis Book Studio!
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          You&apos;re now part of our founding community. Let&apos;s create something extraordinary together.
        </p>

        <div className="inline-flex items-center gap-2 px-6 py-3 bg-fire/10 text-fire rounded-full font-semibold mb-12">
          <Gift size={20} />
          <span>Founding Beta Tester</span>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-lg border border-leather/10 p-8 mb-12 text-left">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6 text-center">
            Your Next Steps
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fire/10 flex items-center justify-center text-fire font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Create Your First Project</h3>
                <p className="text-gray-600 mb-3">
                  Start a new book or import your existing manuscript
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-fire text-white rounded-lg hover:bg-fire-dark transition font-semibold text-sm"
                >
                  <BookOpen size={16} />
                  Go to Dashboard
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-air/10 flex items-center justify-center text-air font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Join the Beta Community</h3>
                <p className="text-gray-600 mb-3">
                  Connect with fellow beta testers, get support, and share feedback
                </p>
                <a
                  href="https://slack.soullab.life/genesis-beta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-air text-white rounded-lg hover:bg-air-dark transition font-semibold text-sm"
                >
                  <Users size={16} />
                  Join Slack Community
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-water/10 flex items-center justify-center text-water font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Explore the Features</h3>
                <p className="text-gray-600 mb-3">
                  Watch quick tutorials and discover what you can do
                </p>
                <Link
                  href="/tutorials"
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-water text-water rounded-lg hover:bg-water/5 transition font-semibold text-sm"
                >
                  <Sparkles size={16} />
                  View Tutorials
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* What You Get */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 border border-leather/10">
            <div className="w-12 h-12 rounded-full bg-fire/10 flex items-center justify-center mb-4 mx-auto">
              <BookOpen className="text-fire" size={24} />
            </div>
            <h3 className="font-heading font-bold mb-2">Full Platform Access</h3>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-fire flex-shrink-0" />
                <span>Collaborative editor</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-fire flex-shrink-0" />
                <span>MAIA AI assistants</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-fire flex-shrink-0" />
                <span>Multi-format export</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 border border-leather/10">
            <div className="w-12 h-12 rounded-full bg-air/10 flex items-center justify-center mb-4 mx-auto">
              <Users className="text-air" size={24} />
            </div>
            <h3 className="font-heading font-bold mb-2">Premium Support</h3>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-air flex-shrink-0" />
                <span>Weekly office hours</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-air flex-shrink-0" />
                <span>Private Slack channel</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-air flex-shrink-0" />
                <span>Direct founder access</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 border border-leather/10">
            <div className="w-12 h-12 rounded-full bg-water/10 flex items-center justify-center mb-4 mx-auto">
              <Gift className="text-water" size={24} />
            </div>
            <h3 className="font-heading font-bold mb-2">Lifetime Benefits</h3>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-water flex-shrink-0" />
                <span>6 months free</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-water flex-shrink-0" />
                <span>50% discount forever</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-water flex-shrink-0" />
                <span>Founding member badge</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-fire via-air to-water text-white rounded-lg hover:shadow-lg transition font-bold text-lg"
        >
          Start Creating Your Book
          <ArrowRight size={24} />
        </Link>

        <p className="text-sm text-gray-500 mt-6">
          Need help?{' '}
          <a href="mailto:beta@soullab.life" className="text-fire hover:text-fire-dark">
            Contact us
          </a>{' '}
          or join{' '}
          <a
            href="https://slack.soullab.life/genesis-beta"
            className="text-fire hover:text-fire-dark"
          >
            Slack
          </a>
        </p>
      </div>
    </div>
  )
}
