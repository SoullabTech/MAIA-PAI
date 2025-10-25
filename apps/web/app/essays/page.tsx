'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

interface Essay {
  slug: string
  title: string
  subtitle: string
  date: string
  excerpt: string
  tags: string[]
  featured?: boolean
}

const essays: Essay[] = [
  {
    slug: 'beyond-algorithmic-personalization',
    title: 'Beyond Algorithmic Personalization',
    subtitle: 'Toward Relational Intelligence in Adaptive Knowledge Systems',
    date: '2025-10-25',
    excerpt: 'We built an AI that learns how you think, not just what you click. Here's what becomes possible when technology moves from prediction to relationship.',
    tags: ['AI', 'Adaptive Learning', 'Relational Intelligence'],
    featured: true
  }
]

export default function EssaysPage() {
  const featuredEssay = essays.find(e => e.featured)
  const otherEssays = essays.filter(e => !e.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition mb-4">
            ← Back to Soullab
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Essays</h1>
          <p className="text-slate-600">
            Field notes from the edge of consciousness design
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Featured Essay */}
        {featuredEssay && (
          <Link
            href={`/essays/${featuredEssay.slug}`}
            className="block mb-16 group"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-400 transition shadow-lg hover:shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-blue-600" size={20} />
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                  Featured
                </span>
              </div>

              <h2 className="text-3xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                {featuredEssay.title}
              </h2>

              <p className="text-lg text-slate-600 mb-4">
                {featuredEssay.subtitle}
              </p>

              <p className="text-slate-700 mb-6 leading-relaxed">
                {featuredEssay.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {featuredEssay.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/80 border border-blue-200 rounded-full text-xs font-medium text-blue-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                  Read essay
                  <ArrowRight size={18} />
                </div>
              </div>

              <p className="text-sm text-slate-500 mt-6">
                {new Date(featuredEssay.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </Link>
        )}

        {/* Other Essays */}
        {otherEssays.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              More Essays
            </h2>

            <div className="grid gap-6">
              {otherEssays.map(essay => (
                <Link
                  key={essay.slug}
                  href={`/essays/${essay.slug}`}
                  className="block group"
                >
                  <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                      {essay.title}
                    </h3>

                    <p className="text-slate-600 mb-4">
                      {essay.subtitle}
                    </p>

                    <p className="text-slate-700 mb-4 text-sm">
                      {essay.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {essay.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <span className="text-sm text-slate-500">
                        {new Date(essay.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {essays.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-600">
              No essays yet. Check back soon.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
