'use client';

/**
 * Soullab Blog Platform
 * Articles on consciousness, elemental wisdom, and awakening
 */

import { useState } from 'react';
import Link from 'next/link';
import { SOULLAB_COLORS } from '@/lib/soullab-theme';

interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  author: string;
  authorRole: string;
  publishedDate: string;
  readTime: string;
  element: 'fire' | 'air' | 'water' | 'earth' | 'aether';
  category: string;
  coverImage?: string;
  featured?: boolean;
}

// Sample blog posts
const BLOG_POSTS: BlogPost[] = [
  {
    id: 'fire-element-transformation',
    title: 'The Fire Element',
    subtitle: 'Igniting Your Creative Power',
    excerpt: 'Fire is the spark of inspiration that ignites change and fuels the journey of awakening. Learn how to harness this primal force for transformation and vision.',
    author: 'Dr. Sarah Chen',
    authorRole: 'Elemental Researcher',
    publishedDate: '2025-01-15',
    readTime: '8 min read',
    element: 'fire',
    category: 'Elemental Wisdom',
    featured: true
  },
  {
    id: 'neuroscience-of-consciousness',
    title: 'The Neuroscience of Awakening',
    subtitle: 'How Your Brain Changes During Transformation',
    excerpt: 'New research reveals how contemplative practices physically rewire the brain. Discover the science behind consciousness expansion.',
    author: 'Marcus Webb',
    authorRole: 'Neuroscientist',
    publishedDate: '2025-01-12',
    readTime: '12 min read',
    element: 'air',
    category: 'Science & Spirit',
    featured: true
  },
  {
    id: 'water-element-flow',
    title: 'Flow Like Water',
    subtitle: 'Embracing Emotional Intelligence',
    excerpt: 'Water teaches us to move with grace through life\'s changes. Explore practices for developing emotional fluidity and intuitive wisdom.',
    author: 'Aria Thompson',
    authorRole: 'Embodiment Coach',
    publishedDate: '2025-01-10',
    readTime: '6 min read',
    element: 'water',
    category: 'Elemental Wisdom',
    featured: false
  },
  {
    id: 'sacred-geometry-basics',
    title: 'Sacred Geometry 101',
    subtitle: 'The Patterns That Structure Reality',
    excerpt: 'From the Flower of Life to the Golden Ratio, discover how geometric patterns reveal the hidden order of consciousness.',
    author: 'Dr. Sarah Chen',
    authorRole: 'Elemental Researcher',
    publishedDate: '2025-01-08',
    readTime: '10 min read',
    element: 'air',
    category: 'Sacred Geometry'
  },
  {
    id: 'earth-element-grounding',
    title: 'Grounding in the Earth Element',
    subtitle: 'Finding Stability in Uncertain Times',
    excerpt: 'Earth provides the foundation for all transformation. Learn grounding practices to anchor yourself in the present moment.',
    author: 'Aria Thompson',
    authorRole: 'Embodiment Coach',
    publishedDate: '2025-01-05',
    readTime: '7 min read',
    element: 'earth',
    category: 'Elemental Wisdom'
  },
  {
    id: 'integration-practice',
    title: 'The Art of Integration',
    subtitle: 'Bringing Insights into Daily Life',
    excerpt: 'Peak experiences are transformative, but integration is where real change happens. Discover practices for embodying your insights.',
    author: 'Marcus Webb',
    authorRole: 'Neuroscientist',
    publishedDate: '2025-01-02',
    readTime: '9 min read',
    element: 'aether',
    category: 'Practice'
  }
];

const CATEGORIES = ['All', 'Elemental Wisdom', 'Science & Spirit', 'Sacred Geometry', 'Practice', 'Book Updates'];
const ELEMENTS = ['all', 'fire', 'air', 'water', 'earth', 'aether'] as const;

export default function BlogPage() {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [elementFilter, setElementFilter] = useState<typeof ELEMENTS[number]>('all');

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = categoryFilter === 'All' || post.category === categoryFilter;
    const matchesElement = elementFilter === 'all' || post.element === elementFilter;
    return matchesCategory && matchesElement;
  });

  const featuredPosts = BLOG_POSTS.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="relative py-20 px-6 overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(
              circle at 50% 0%,
              ${SOULLAB_COLORS.air}20 0%,
              ${SOULLAB_COLORS.fire}15 40%,
              transparent 70%
            )`
          }}
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-8">
            <h1
              className="text-6xl md:text-7xl font-light mb-6"
              style={{ color: SOULLAB_COLORS.air }}
            >
              Soullab Insights
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Exploring consciousness, elemental wisdom, and the science of awakening
            </p>
          </div>

          {/* Element filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {ELEMENTS.map((element) => (
              <button
                key={element}
                onClick={() => setElementFilter(element)}
                className="px-6 py-2 rounded-full border transition-all hover:scale-105 capitalize flex items-center gap-2"
                style={{
                  borderColor: element === 'all'
                    ? `${SOULLAB_COLORS.gray}40`
                    : elementFilter === element
                    ? SOULLAB_COLORS[element === 'aether' ? 'air' : element]
                    : `${SOULLAB_COLORS.gray}40`,
                  background: elementFilter === element
                    ? element === 'all'
                      ? `${SOULLAB_COLORS.gray}15`
                      : `${SOULLAB_COLORS[element === 'aether' ? 'air' : element]}15`
                    : 'transparent',
                  color: elementFilter === element
                    ? element === 'all'
                      ? SOULLAB_COLORS.gray
                      : SOULLAB_COLORS[element === 'aether' ? 'air' : element]
                    : SOULLAB_COLORS.gray
                }}
              >
                {element !== 'all' && (
                  <span className="text-xl">
                    {element === 'fire' || element === 'air' || element === 'aether' ? '△' : '▽'}
                  </span>
                )}
                {element}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Featured Posts */}
      {elementFilter === 'all' && categoryFilter === 'All' && featuredPosts.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-light mb-8 text-white">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group relative rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
                >
                  <div
                    className="p-8 min-h-[300px] flex flex-col justify-end"
                    style={{
                      background: `linear-gradient(135deg, ${SOULLAB_COLORS[post.element]}20 0%, ${SOULLAB_COLORS[post.element]}05 100%)`,
                      border: `1px solid ${SOULLAB_COLORS[post.element]}30`
                    }}
                  >
                    {/* Element icon */}
                    <div
                      className="absolute top-6 right-6 text-6xl opacity-20"
                      style={{ color: SOULLAB_COLORS[post.element] }}
                    >
                      {post.element === 'fire' || post.element === 'air' || post.element === 'aether' ? '△' : '▽'}
                    </div>

                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className="text-xs tracking-wider uppercase"
                          style={{ color: SOULLAB_COLORS[post.element] }}
                        >
                          {post.category}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{post.readTime}</span>
                      </div>

                      <h3 className="text-3xl font-light mb-2 text-white group-hover:text-opacity-80 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-lg mb-4" style={{ color: SOULLAB_COLORS[post.element] }}>
                        {post.subtitle}
                      </p>
                      <p className="text-gray-400 mb-6 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-400">
                          by <span className="text-white">{post.author}</span>
                        </div>
                        <span className="text-gray-600">•</span>
                        <div className="text-sm text-gray-500">
                          {new Date(post.publishedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category filters */}
      <section className="py-8 px-6 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className="px-5 py-2 rounded-full text-sm transition-all hover:scale-105"
                style={{
                  background: categoryFilter === category ? `${SOULLAB_COLORS.air}15` : 'transparent',
                  border: `1px solid ${categoryFilter === category ? SOULLAB_COLORS.air : SOULLAB_COLORS.gray}40`,
                  color: categoryFilter === category ? SOULLAB_COLORS.air : SOULLAB_COLORS.gray
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No articles found for this filter.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group"
                >
                  <article
                    className="rounded-xl overflow-hidden border transition-all hover:scale-[1.02]"
                    style={{
                      background: `${SOULLAB_COLORS[post.element]}05`,
                      borderColor: `${SOULLAB_COLORS[post.element]}20`
                    }}
                  >
                    {/* Cover image placeholder */}
                    <div
                      className="aspect-video relative"
                      style={{
                        background: `linear-gradient(135deg, ${SOULLAB_COLORS[post.element]}30 0%, ${SOULLAB_COLORS[post.element]}10 100%)`
                      }}
                    >
                      <div
                        className="absolute inset-0 flex items-center justify-center text-6xl opacity-20"
                        style={{ color: SOULLAB_COLORS[post.element] }}
                      >
                        {post.element === 'fire' || post.element === 'air' || post.element === 'aether' ? '△' : '▽'}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="text-xs tracking-wider uppercase"
                          style={{ color: SOULLAB_COLORS[post.element] }}
                        >
                          {post.category}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-xs text-gray-500">{post.readTime}</span>
                      </div>

                      <h3 className="text-xl font-medium mb-2 text-white group-hover:text-opacity-80 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="text-xs text-gray-500">
                          {new Date(post.publishedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-gray-400">{post.author}</div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section
        className="py-20 px-6"
        style={{ background: `${SOULLAB_COLORS.brown}40` }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl font-light mb-4"
            style={{ color: SOULLAB_COLORS.air }}
          >
            Never Miss an Insight
          </h2>
          <p className="text-gray-400 mb-8">
            Get our latest articles on consciousness, elemental wisdom, and book updates delivered to your inbox.
          </p>

          <form className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-full bg-[#1a1a1a] border text-white placeholder-gray-500"
              style={{ borderColor: `${SOULLAB_COLORS.gray}40` }}
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-full font-medium transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${SOULLAB_COLORS.fire}, ${SOULLAB_COLORS.air})`,
                color: 'white'
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
