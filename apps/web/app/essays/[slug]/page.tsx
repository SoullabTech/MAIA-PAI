'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import { useState, useEffect } from 'react'

interface EssayMetadata {
  title: string
  subtitle: string
  date: string
  author: string
  tags: string[]
  excerpt: string
}

export default function EssayPage() {
  const params = useParams()
  const slug = params.slug as string

  const [content, setContent] = useState<string>('')
  const [metadata, setMetadata] = useState<EssayMetadata | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In production, this would fetch from CMS or markdown files
    // For now, we'll load the content we have
    if (slug === 'beyond-algorithmic-personalization') {
      setMetadata({
        title: 'Beyond Algorithmic Personalization',
        subtitle: 'Toward Relational Intelligence in Adaptive Knowledge Systems',
        date: '2025-10-25',
        author: 'Soullab Collective',
        tags: ['AI', 'Adaptive Learning', 'Relational Intelligence', 'Consciousness Tech'],
        excerpt: 'We built an AI that learns how you think, not just what you click.'
      })

      // Fetch the markdown content
      fetch('/content/essays/beyond-algorithmic-personalization.md')
        .then(res => res.text())
        .then(text => {
          // Strip frontmatter and convert to HTML (simplified)
          const withoutFrontmatter = text.replace(/---[\s\S]*?---/, '')
          setContent(withoutFrontmatter)
          setLoading(false)
        })
        .catch(() => {
          // Fallback content
          setContent('<p>Essay content loading...</p>')
          setLoading(false)
        })
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading essay...</p>
        </div>
      </div>
    )
  }

  if (!metadata) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Essay Not Found</h1>
          <p className="text-slate-600 mb-6">This essay doesn't exist yet.</p>
          <Link
            href="/essays"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeft size={18} />
            Back to Essays
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/essays"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition text-sm"
          >
            <ArrowLeft size={16} />
            All Essays
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Metadata */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4 leading-tight">
            {metadata.title}
          </h1>

          {metadata.subtitle && (
            <p className="text-2xl text-slate-600 mb-8 font-light">
              {metadata.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 mb-8">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>
                {new Date(metadata.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{metadata.author}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {metadata.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 border border-blue-200 rounded-full text-xs font-medium text-blue-700"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div
          className="prose prose-lg prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-slate-900
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
            prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-600
            prose-strong:text-slate-900 prose-strong:font-semibold
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-ul:list-disc prose-ul:pl-6
            prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-slate-700 prose-li:mb-2
            prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
          "
          dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
        />

        {/* Footer CTA */}
        <div className="mt-16 p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Experience It Yourself
          </h3>

          <p className="text-slate-700 mb-6">
            Try the MAIA Adaptive Reading system and feel what relational intelligence is like.
          </p>

          <div className="flex gap-4">
            <Link
              href="/publishing/genesis-book-studio/read-adaptive"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Try MAIA
            </Link>

            <a
              href="https://github.com/soullab"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white border-2 border-blue-300 text-blue-700 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition font-semibold"
            >
              View Code
            </a>
          </div>
        </div>
      </article>
    </div>
  )
}

// Simple markdown-to-HTML converter (you'd use a library like marked or remark in production)
function formatMarkdown(md: string): string {
  return md
    // Headings
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Paragraphs
    .split('\n\n')
    .map(para => {
      if (para.startsWith('<h') || para.startsWith('<blockquote')) {
        return para
      }
      return `<p>${para}</p>`
    })
    .join('\n')
}
