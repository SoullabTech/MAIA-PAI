'use client';

/**
 * Soullab Blog Platform - Ancient Manuscript Edition
 * Deep cinematic Dune aesthetic with leather journal feel
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
    <div className="min-h-screen relative" style={{ background: '#0a0605' }}>
      {/* Deep atmospheric background - Dune-like */}
      <div className="fixed inset-0 z-0">
        {/* Base layer - deep shadows */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at top, ${SOULLAB_COLORS.leather}08 0%, transparent 50%),
              radial-gradient(ellipse at bottom, ${SOULLAB_COLORS.brown}15 0%, transparent 50%)
            `
          }}
        />

        {/* Leather grain texture overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, ${SOULLAB_COLORS.leather}05 2px, ${SOULLAB_COLORS.leather}05 4px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, ${SOULLAB_COLORS.leather}05 2px, ${SOULLAB_COLORS.leather}05 4px)
            `,
            mixBlendMode: 'overlay'
          }}
        />

        {/* Scratched leather effect */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="scratch" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path
                d="M0,50 Q50,45 100,50 T200,50"
                stroke={SOULLAB_COLORS.leather}
                strokeWidth="0.5"
                fill="none"
                opacity="0.3"
              />
              <path
                d="M0,100 Q50,95 100,100 T200,100"
                stroke={SOULLAB_COLORS.leather}
                strokeWidth="0.3"
                fill="none"
                opacity="0.2"
              />
              <path
                d="M50,0 Q45,50 50,100 T50,200"
                stroke={SOULLAB_COLORS.leather}
                strokeWidth="0.4"
                fill="none"
                opacity="0.25"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#scratch)" />
        </svg>

        {/* Vignette - deeper edges */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header - Ancient manuscript title */}
        <header className="relative py-32 px-6 overflow-hidden">
          {/* Subtle glow behind title */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-10 blur-3xl"
            style={{
              background: `radial-gradient(ellipse, ${SOULLAB_COLORS.parchment}40 0%, transparent 70%)`
            }}
          />

          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-12">
              {/* Soullab Holoflower Logo */}
              <div className="flex justify-center mb-8">
                <SoullabSpiral className="w-20 h-20 opacity-60" />
              </div>

              <h1
                className="text-7xl md:text-8xl font-light mb-6 tracking-wider"
                style={{
                  color: SOULLAB_COLORS.parchment,
                  textShadow: `0 2px 30px ${SOULLAB_COLORS.leather}40, 0 0 60px ${SOULLAB_COLORS.leather}20`,
                  fontVariant: 'small-caps',
                  letterSpacing: '0.1em'
                }}
              >
                Codex
              </h1>

              <p
                className="text-xl tracking-widest mb-2"
                style={{
                  color: SOULLAB_COLORS.leather,
                  textShadow: `0 1px 10px ${SOULLAB_COLORS.leather}30`
                }}
              >
                SOULLAB ARCHIVES
              </p>

              <p className="text-base max-w-2xl mx-auto" style={{ color: `${SOULLAB_COLORS.parchment}80` }}>
                Ancient wisdom recorded • Modern science illuminated • Consciousness explored
              </p>

              {/* Decorative bottom border */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <div className="h-px w-20" style={{ background: `linear-gradient(to right, transparent, ${SOULLAB_COLORS.leather}60, transparent)` }} />
                <div className="w-2 h-2 rounded-full" style={{ background: SOULLAB_COLORS.leather, opacity: 0.4 }} />
                <div className="h-px w-20" style={{ background: `linear-gradient(to right, transparent, ${SOULLAB_COLORS.leather}60, transparent)` }} />
              </div>
            </div>

            {/* Element filters - manuscript style */}
            <div className="flex flex-wrap justify-center gap-3">
              {ELEMENTS.map((element) => {
                const isActive = elementFilter === element;
                const elColor = element === 'all'
                  ? SOULLAB_COLORS.leather
                  : SOULLAB_COLORS[element === 'aether' ? 'air' : element];

                return (
                  <button
                    key={element}
                    onClick={() => setElementFilter(element)}
                    className="px-6 py-2 rounded border transition-all hover:scale-105 capitalize flex items-center gap-2 relative overflow-hidden"
                    style={{
                      borderColor: isActive ? `${elColor}60` : `${SOULLAB_COLORS.leather}30`,
                      background: isActive
                        ? `linear-gradient(135deg, ${elColor}15 0%, ${elColor}08 100%)`
                        : `${SOULLAB_COLORS.brown}40`,
                      color: isActive ? elColor : SOULLAB_COLORS.leather,
                      backdropFilter: 'blur(10px)',
                      boxShadow: isActive ? `0 4px 20px ${elColor}20` : 'none'
                    }}
                  >
                    {element !== 'all' && (
                      <span className="text-xl">
                        {element === 'fire' || element === 'air' || element === 'aether' ? '△' : '▽'}
                      </span>
                    )}
                    {element}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Featured Posts - Large manuscript pages */}
        {elementFilter === 'all' && categoryFilter === 'All' && featuredPosts.length > 0 && (
          <section className="py-12 px-6">
            <div className="max-w-7xl mx-auto">
              <h2
                className="text-3xl font-light mb-12 text-center tracking-wider"
                style={{
                  color: SOULLAB_COLORS.parchment,
                  fontVariant: 'small-caps'
                }}
              >
                Featured Scrolls
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="group relative rounded-lg overflow-hidden transition-all hover:scale-[1.02]"
                  >
                    {/* Leather-bound card */}
                    <div
                      className="p-10 min-h-[400px] flex flex-col justify-end relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${SOULLAB_COLORS.brown}80 0%, ${SOULLAB_COLORS.brown}60 100%)`,
                        border: `1px solid ${SOULLAB_COLORS.leather}40`,
                        backdropFilter: 'blur(20px)',
                        boxShadow: `
                          inset 0 1px 0 ${SOULLAB_COLORS.parchment}10,
                          0 20px 60px rgba(0,0,0,0.5)
                        `
                      }}
                    >
                      {/* Aged paper texture overlay */}
                      <div
                        className="absolute inset-0 opacity-30 mix-blend-overlay"
                        style={{
                          backgroundImage: `
                            repeating-linear-gradient(0deg, transparent, transparent 1px, ${SOULLAB_COLORS.leather}10 1px, ${SOULLAB_COLORS.leather}10 2px)
                          `
                        }}
                      />

                      {/* Large element symbol watermark */}
                      <div
                        className="absolute top-8 right-8 text-9xl opacity-5 transition-all group-hover:opacity-10"
                        style={{ color: SOULLAB_COLORS[post.element] }}
                      >
                        {post.element === 'fire' || post.element === 'air' || post.element === 'aether' ? '△' : '▽'}
                      </div>

                      {/* Subtle glow */}
                      <div
                        className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${SOULLAB_COLORS[post.element]}40 0%, transparent 60%)`
                        }}
                      />

                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                          <span
                            className="text-xs tracking-widest uppercase"
                            style={{
                              color: SOULLAB_COLORS[post.element],
                              textShadow: `0 0 10px ${SOULLAB_COLORS[post.element]}40`
                            }}
                          >
                            {post.category}
                          </span>
                          <span style={{ color: `${SOULLAB_COLORS.leather}60` }}>•</span>
                          <span className="text-xs" style={{ color: `${SOULLAB_COLORS.parchment}60` }}>
                            {post.readTime}
                          </span>
                        </div>

                        <h3
                          className="text-4xl font-light mb-3 group-hover:text-opacity-80 transition-colors"
                          style={{
                            color: SOULLAB_COLORS.parchment,
                            textShadow: `0 2px 10px rgba(0,0,0,0.5)`
                          }}
                        >
                          {post.title}
                        </h3>

                        <p
                          className="text-lg mb-6"
                          style={{
                            color: SOULLAB_COLORS[post.element],
                            textShadow: `0 1px 5px ${SOULLAB_COLORS[post.element]}30`
                          }}
                        >
                          {post.subtitle}
                        </p>

                        <p className="mb-8 leading-relaxed line-clamp-2" style={{ color: `${SOULLAB_COLORS.parchment}90` }}>
                          {post.excerpt}
                        </p>

                        <div className="flex items-center gap-3">
                          <div className="text-sm" style={{ color: `${SOULLAB_COLORS.parchment}80` }}>
                            by <span style={{ color: SOULLAB_COLORS.parchment }}>{post.author}</span>
                          </div>
                          <span style={{ color: `${SOULLAB_COLORS.leather}40` }}>•</span>
                          <div className="text-sm" style={{ color: `${SOULLAB_COLORS.parchment}60` }}>
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

        {/* Category filters - manuscript tabs */}
        <section
          className="py-8 px-6 border-y relative"
          style={{
            borderColor: `${SOULLAB_COLORS.leather}20`,
            background: `${SOULLAB_COLORS.brown}30`,
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {CATEGORIES.map((category) => {
                const isActive = categoryFilter === category;
                return (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className="px-5 py-2 rounded text-sm transition-all hover:scale-105 border"
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${SOULLAB_COLORS.leather}40 0%, ${SOULLAB_COLORS.leather}20 100%)`
                        : `${SOULLAB_COLORS.brown}40`,
                      border: `1px solid ${isActive ? SOULLAB_COLORS.leather : `${SOULLAB_COLORS.leather}30`}`,
                      color: isActive ? SOULLAB_COLORS.parchment : SOULLAB_COLORS.leather,
                      backdropFilter: 'blur(10px)',
                      boxShadow: isActive ? `0 4px 15px ${SOULLAB_COLORS.leather}20` : 'none'
                    }}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* All Posts Grid - Manuscript pages */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg" style={{ color: `${SOULLAB_COLORS.leather}80` }}>
                  No scrolls found for this element.
                </p>
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
                      className="rounded-lg overflow-hidden border transition-all hover:scale-[1.02] hover:shadow-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${SOULLAB_COLORS.brown}70 0%, ${SOULLAB_COLORS.brown}50 100%)`,
                        borderColor: `${SOULLAB_COLORS.leather}30`,
                        backdropFilter: 'blur(20px)'
                      }}
                    >
                      {/* Cover image placeholder with aged paper look */}
                      <div
                        className="aspect-video relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${SOULLAB_COLORS[post.element]}15 0%, ${SOULLAB_COLORS[post.element]}05 100%)`
                        }}
                      >
                        {/* Paper grain */}
                        <div
                          className="absolute inset-0 opacity-50 mix-blend-overlay"
                          style={{
                            backgroundImage: `
                              repeating-linear-gradient(0deg, transparent, transparent 1px, ${SOULLAB_COLORS.leather}08 1px, ${SOULLAB_COLORS.leather}08 2px)
                            `
                          }}
                        />

                        {/* Element symbol */}
                        <div
                          className="absolute inset-0 flex items-center justify-center text-7xl opacity-20 group-hover:opacity-30 transition-opacity"
                          style={{ color: SOULLAB_COLORS[post.element] }}
                        >
                          {post.element === 'fire' || post.element === 'air' || post.element === 'aether' ? '△' : '▽'}
                        </div>

                        {/* Subtle light effect */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                          style={{
                            background: `radial-gradient(circle at 50% 30%, ${SOULLAB_COLORS[post.element]}30 0%, transparent 60%)`
                          }}
                        />
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="text-xs tracking-wider uppercase"
                            style={{
                              color: SOULLAB_COLORS[post.element],
                              textShadow: `0 0 8px ${SOULLAB_COLORS[post.element]}40`
                            }}
                          >
                            {post.category}
                          </span>
                          <span style={{ color: `${SOULLAB_COLORS.leather}40` }}>•</span>
                          <span className="text-xs" style={{ color: `${SOULLAB_COLORS.parchment}60` }}>
                            {post.readTime}
                          </span>
                        </div>

                        <h3
                          className="text-xl font-medium mb-2 group-hover:text-opacity-80 transition-colors"
                          style={{
                            color: SOULLAB_COLORS.parchment,
                            textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                          }}
                        >
                          {post.title}
                        </h3>

                        <p className="text-sm mb-4 line-clamp-3" style={{ color: `${SOULLAB_COLORS.parchment}80` }}>
                          {post.excerpt}
                        </p>

                        <div
                          className="flex items-center justify-between pt-4 border-t"
                          style={{ borderColor: `${SOULLAB_COLORS.leather}20` }}
                        >
                          <div className="text-xs" style={{ color: `${SOULLAB_COLORS.parchment}60` }}>
                            {new Date(post.publishedDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-xs" style={{ color: `${SOULLAB_COLORS.parchment}70` }}>
                            {post.author}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA - Ancient scroll invitation */}
        <section
          className="py-24 px-6 relative"
          style={{
            background: `linear-gradient(135deg, ${SOULLAB_COLORS.brown}90 0%, ${SOULLAB_COLORS.brown}70 100%)`,
            borderTop: `1px solid ${SOULLAB_COLORS.leather}30`,
            borderBottom: `1px solid ${SOULLAB_COLORS.leather}30`
          }}
        >
          {/* Decorative pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 50px, ${SOULLAB_COLORS.leather} 50px, ${SOULLAB_COLORS.leather} 51px)`
            }}
          />

          <div className="max-w-2xl mx-auto text-center relative">
            {/* Soullab Holoflower */}
            <div className="flex justify-center mb-8">
              <SoullabSpiral className="w-16 h-16 opacity-50" />
            </div>

            <h2
              className="text-4xl font-light mb-6 tracking-wider"
              style={{
                color: SOULLAB_COLORS.parchment,
                textShadow: `0 2px 15px ${SOULLAB_COLORS.leather}40`,
                fontVariant: 'small-caps'
              }}
            >
              Join the Archives
            </h2>

            <p className="mb-10 text-lg" style={{ color: `${SOULLAB_COLORS.parchment}80` }}>
              Receive new scrolls of wisdom delivered to your chambers.
              <br />
              Ancient teachings • Modern insights • Consciousness codex
            </p>

            <form className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-5 py-4 rounded border text-base"
                style={{
                  background: `${SOULLAB_COLORS.brown}60`,
                  borderColor: `${SOULLAB_COLORS.leather}50`,
                  color: SOULLAB_COLORS.parchment,
                  backdropFilter: 'blur(10px)'
                }}
              />
              <button
                type="submit"
                className="px-8 py-4 rounded font-medium transition-all hover:scale-105 border"
                style={{
                  background: `linear-gradient(135deg, ${SOULLAB_COLORS.leather}60, ${SOULLAB_COLORS.leather}40)`,
                  borderColor: SOULLAB_COLORS.leather,
                  color: SOULLAB_COLORS.parchment,
                  boxShadow: `0 8px 30px ${SOULLAB_COLORS.leather}30`
                }}
              >
                Subscribe
              </button>
            </form>

            {/* Decorative bottom */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="h-px w-20" style={{ background: `linear-gradient(to right, transparent, ${SOULLAB_COLORS.leather}60, transparent)` }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: SOULLAB_COLORS.leather, opacity: 0.6 }} />
              <div className="h-px w-20" style={{ background: `linear-gradient(to right, transparent, ${SOULLAB_COLORS.leather}60, transparent)` }} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Soullab Holoflower (Spiral Logo) Component
function SoullabSpiral({ className = 'w-full h-full', variant = 'parchment' }: { className?: string; variant?: 'full' | 'parchment' }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        {variant === 'full' ? (
          <linearGradient id="spiral-gradient-blog" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={SOULLAB_COLORS.fire} />
            <stop offset="33%" stopColor={SOULLAB_COLORS.air} />
            <stop offset="66%" stopColor={SOULLAB_COLORS.earth} />
            <stop offset="100%" stopColor={SOULLAB_COLORS.water} />
          </linearGradient>
        ) : (
          <linearGradient id="spiral-gradient-blog" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={SOULLAB_COLORS.parchment} />
            <stop offset="50%" stopColor={SOULLAB_COLORS.leather} />
            <stop offset="100%" stopColor={SOULLAB_COLORS.parchment} />
          </linearGradient>
        )}
      </defs>
      {[...Array(12)].map((_, ring) => (
        <g key={ring}>
          {[...Array(24)].map((_, dot) => {
            const angle = (dot / 24) * Math.PI * 2 + (ring * Math.PI / 12);
            const radius = 10 + ring * 3.5;
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;
            const size = 1.8 - (ring * 0.1);

            return (
              <circle
                key={dot}
                cx={x}
                cy={y}
                r={size}
                fill="url(#spiral-gradient-blog)"
                opacity={0.9 - (ring * 0.05)}
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}
