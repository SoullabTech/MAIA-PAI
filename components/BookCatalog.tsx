'use client';

/**
 * Multi-Book Catalog Showcase
 * Displays all Soullab Publishing titles
 */

import { useState } from 'react';
import { SOULLAB_COLORS, SOULLAB_GRADIENTS } from '@/lib/soullab-theme';

interface Book {
  id: string;
  title: string;
  subtitle: string;
  element: 'fire' | 'air' | 'water' | 'earth';
  gradient: string;
  status: 'available' | 'pre-order' | 'coming-soon';
  price: number;
  description: string;
  releaseDate: string;
  pages: number;
}

const BOOKS: Book[] = [
  {
    id: 'elemental-alchemy',
    title: 'Elemental Alchemy',
    subtitle: 'A Journey Through Fire, Air, Water, and Earth',
    element: 'fire',
    gradient: `linear-gradient(135deg,
      ${SOULLAB_COLORS.fire} 0%,
      ${SOULLAB_COLORS.fireLight} 20%,
      ${SOULLAB_COLORS.air} 40%,
      ${SOULLAB_COLORS.airLight} 60%,
      ${SOULLAB_COLORS.water} 80%,
      ${SOULLAB_COLORS.waterLight} 100%
    )`,
    status: 'pre-order',
    price: 29.99,
    description: 'Transform your consciousness through the ancient wisdom of elemental alchemy. A comprehensive guide weaving neuroscience, sacred geometry, and practical exercises.',
    releaseDate: 'Spring 2026',
    pages: 432
  },
  {
    id: 'shadow-integration',
    title: 'Shadow Integration',
    subtitle: 'Awakening the Unconscious Self',
    element: 'water',
    gradient: `linear-gradient(135deg,
      ${SOULLAB_COLORS.water} 0%,
      ${SOULLAB_COLORS.waterDark} 50%,
      ${SOULLAB_COLORS.earth} 100%
    )`,
    status: 'coming-soon',
    price: 29.99,
    description: 'Explore the depths of your unconscious mind through Jungian shadow work, neuroscience, and transformative practices. Integrate what you\'ve hidden to become whole.',
    releaseDate: 'Fall 2026',
    pages: 384
  },
  {
    id: 'sacred-geometry',
    title: 'Sacred Geometry',
    subtitle: 'The Mathematics of Consciousness',
    element: 'air',
    gradient: `linear-gradient(135deg,
      ${SOULLAB_COLORS.air} 0%,
      ${SOULLAB_COLORS.airLight} 50%,
      ${SOULLAB_COLORS.earth} 100%
    )`,
    status: 'coming-soon',
    price: 34.99,
    description: 'Discover the hidden patterns that structure reality. From the Flower of Life to the Fibonacci sequence, learn how geometry shapes consciousness itself.',
    releaseDate: 'Winter 2027',
    pages: 512
  },
  {
    id: 'spiralogic-field',
    title: 'The Spiralogic Field',
    subtitle: 'Consciousness as Living Intelligence',
    element: 'earth',
    gradient: `linear-gradient(135deg,
      ${SOULLAB_COLORS.earth} 0%,
      ${SOULLAB_COLORS.earthLight} 50%,
      ${SOULLAB_COLORS.fire} 100%
    )`,
    status: 'coming-soon',
    price: 39.99,
    description: 'An exploration of consciousness as a living, intelligent field. Bridging quantum physics, systems theory, and ancient wisdom traditions.',
    releaseDate: 'Spring 2027',
    pages: 496
  }
];

const FILTERS = ['all', 'fire', 'air', 'water', 'earth', 'available', 'pre-order', 'coming-soon'] as const;
type Filter = typeof FILTERS[number];

export default function BookCatalog() {
  const [filter, setFilter] = useState<Filter>('all');
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);

  const filteredBooks = BOOKS.filter(book => {
    if (filter === 'all') return true;
    if (['fire', 'air', 'water', 'earth'].includes(filter)) {
      return book.element === filter;
    }
    return book.status === filter;
  });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-16">
        <h2
          className="text-5xl font-light mb-4"
          style={{ color: SOULLAB_COLORS.air }}
        >
          Complete Catalog
        </h2>
        <p className="text-xl text-gray-400">
          Explore all titles from Soullab Publishing
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-6 py-2 rounded-full border transition-all hover:scale-105 capitalize"
            style={{
              borderColor: filter === f ? SOULLAB_COLORS.air : `${SOULLAB_COLORS.gray}40`,
              background: filter === f ? `${SOULLAB_COLORS.air}15` : 'transparent',
              color: filter === f ? SOULLAB_COLORS.air : SOULLAB_COLORS.gray
            }}
          >
            {f.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="group relative"
            onMouseEnter={() => setHoveredBook(book.id)}
            onMouseLeave={() => setHoveredBook(null)}
          >
            {/* Book Card */}
            <div className="relative">
              {/* Cover */}
              <div
                className="w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl mb-4 transition-transform duration-500"
                style={{
                  background: book.gradient,
                  transform: hoveredBook === book.id ? 'translateY(-8px) rotateY(5deg)' : 'translateY(0) rotateY(0)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Sacred geometry overlay */}
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 200 300">
                  {[...Array(6)].map((_, i) => (
                    <circle
                      key={i}
                      cx="100"
                      cy="150"
                      r={30 + i * 20}
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  ))}
                </svg>

                {/* Title */}
                <div className="absolute top-8 left-0 right-0 text-center px-6">
                  <h3 className="text-2xl font-bold text-[#1a1a1a] mb-1">
                    {book.title.split(' ')[0]}
                  </h3>
                  <h3 className="text-2xl font-light tracking-wider text-white">
                    {book.title.split(' ').slice(1).join(' ')}
                  </h3>
                </div>

                {/* Element symbol */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                  <div
                    className="text-4xl"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    {book.element === 'fire' || book.element === 'air' ? '△' : '▽'}
                  </div>
                </div>

                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm capitalize"
                    style={{
                      background: book.status === 'available'
                        ? `${SOULLAB_COLORS.earth}cc`
                        : book.status === 'pre-order'
                        ? `${SOULLAB_COLORS.fire}cc`
                        : `${SOULLAB_COLORS.gray}cc`,
                      color: 'white'
                    }}
                  >
                    {book.status.replace('-', ' ')}
                  </div>
                </div>
              </div>

              {/* Book Info */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-xl font-medium text-white mb-1">{book.title}</h4>
                  <p className="text-sm text-gray-400">{book.subtitle}</p>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                  {book.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{book.pages} pages</span>
                  <span className="text-gray-500">{book.releaseDate}</span>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <span
                    className="text-2xl font-light"
                    style={{ color: SOULLAB_COLORS[book.element] }}
                  >
                    ${book.price}
                  </span>

                  <a
                    href={book.status === 'coming-soon' ? '#' : `/publishing/purchase?book=${book.id}`}
                    onClick={(e) => {
                      if (book.status === 'coming-soon') {
                        e.preventDefault();
                      }
                    }}
                    className="px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
                    style={{
                      background: book.status === 'coming-soon'
                        ? `${SOULLAB_COLORS.gray}40`
                        : SOULLAB_GRADIENTS[`${book.element}To${book.element === 'fire' ? 'Air' : book.element === 'air' ? 'Earth' : book.element === 'earth' ? 'Water' : 'Fire'}` as keyof typeof SOULLAB_GRADIENTS],
                      color: 'white',
                      cursor: book.status === 'coming-soon' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {book.status === 'available' ? 'Buy Now' : book.status === 'pre-order' ? 'Pre-Order' : 'Notify Me'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Newsletter */}
      <div
        className="max-w-2xl mx-auto p-8 rounded-2xl border text-center"
        style={{
          borderColor: `${SOULLAB_COLORS.air}30`,
          background: `${SOULLAB_COLORS.air}08`
        }}
      >
        <h3
          className="text-2xl font-light mb-3"
          style={{ color: SOULLAB_COLORS.air }}
        >
          Stay Updated
        </h3>
        <p className="text-gray-400 mb-6">
          Be the first to know when new titles are released and receive exclusive pre-order discounts.
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
              background: SOULLAB_GRADIENTS.fireToAir,
              color: 'white'
            }}
          >
            Notify Me
          </button>
        </form>
      </div>
    </div>
  );
}
