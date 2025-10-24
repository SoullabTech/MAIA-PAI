'use client';

/**
 * Interactive Book Preview with Page Flip Animation
 * Official Soullab brand colors
 */

import { useState } from 'react';
import { SOULLAB_COLORS } from '@/lib/soullab-theme';

interface Page {
  number: number;
  title: string;
  content: string;
  element?: 'fire' | 'air' | 'water' | 'earth';
}

const SAMPLE_PAGES: Page[] = [
  {
    number: 1,
    title: 'Introduction',
    content: 'Welcome to the path of elemental transformation. This journey will awaken your consciousness through the ancient wisdom of Fire, Air, Water, and Earth.',
    element: 'fire'
  },
  {
    number: 2,
    title: 'The Fire Element',
    content: 'Fire represents vision, creation, and transformation. It is the spark of inspiration that ignites change and fuels the journey of awakening.',
    element: 'fire'
  },
  {
    number: 3,
    title: 'Embodying Fire',
    content: 'To embody Fire is to embrace your creative power. Learn to channel this elemental force into purposeful action and transformative vision.',
    element: 'fire'
  },
  {
    number: 4,
    title: 'The Air Element',
    content: 'Air brings clarity, communication, and expression. It is the breath of life that carries intention and meaning across all dimensions.',
    element: 'air'
  },
  {
    number: 5,
    title: 'The Water Element',
    content: 'Water flows with emotion, intuition, and adaptability. It teaches us to move with grace through the ever-changing currents of life.',
    element: 'water'
  },
  {
    number: 6,
    title: 'The Earth Element',
    content: 'Earth provides grounding, structure, and manifestation. It is the foundation upon which all transformation takes physical form.',
    element: 'earth'
  }
];

export default function BookPreview() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const page = SAMPLE_PAGES[currentPage];
  const elementColor = page.element ? SOULLAB_COLORS[page.element] : SOULLAB_COLORS.air;

  const nextPage = () => {
    if (currentPage < SAMPLE_PAGES.length - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-light mb-4" style={{ color: SOULLAB_COLORS.air }}>
          Preview: Elemental Alchemy
        </h2>
        <p className="text-gray-400">Click the arrows or edges to turn pages</p>
      </div>

      {/* Book Container */}
      <div className="relative perspective-container mb-8">
        <div
          className={`book-page ${isFlipping ? 'flipping' : ''}`}
          onClick={nextPage}
        >
          {/* Page Background */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${elementColor}08 0%, ${elementColor}15 100%)`,
              border: `1px solid ${elementColor}30`
            }}
          />

          {/* Sacred Geometry Background */}
          <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 600 800">
            {[...Array(6)].map((_, i) => (
              <circle
                key={i}
                cx="300"
                cy="400"
                r={100 + i * 60}
                fill="none"
                stroke={elementColor}
                strokeWidth="0.5"
              />
            ))}
            {[...Array(20)].map((_, i) => (
              <line
                key={`v${i}`}
                x1={i * 30}
                y1="0"
                x2={i * 30}
                y2="800"
                stroke={elementColor}
                strokeWidth="0.2"
                opacity="0.3"
              />
            ))}
          </svg>

          {/* Content */}
          <div className="relative z-10 p-16 h-full flex flex-col">
            {/* Page Number */}
            <div className="text-sm tracking-wider mb-8" style={{ color: `${elementColor}aa` }}>
              PAGE {page.number}
            </div>

            {/* Title */}
            <h3
              className="text-3xl font-light mb-8"
              style={{ color: elementColor }}
            >
              {page.title}
            </h3>

            {/* Element Symbol */}
            {page.element && (
              <div className="flex items-center gap-4 mb-8">
                <div className="text-5xl" style={{ color: elementColor }}>
                  {page.element === 'fire' || page.element === 'air' ? '△' : '▽'}
                </div>
                <div className="text-sm tracking-wider uppercase" style={{ color: `${elementColor}cc` }}>
                  {page.element} element
                </div>
              </div>
            )}

            {/* Content */}
            <p className="text-gray-300 leading-relaxed text-lg flex-1">
              {page.content}
            </p>

            {/* Page indicator */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {SAMPLE_PAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isFlipping) {
                      setIsFlipping(true);
                      setTimeout(() => {
                        setCurrentPage(i);
                        setIsFlipping(false);
                      }, 600);
                    }
                  }}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    background: i === currentPage ? elementColor : `${elementColor}40`,
                    transform: i === currentPage ? 'scale(1.5)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); prevPage(); }}
          disabled={currentPage === 0 || isFlipping}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-all disabled:opacity-30 hover:scale-110"
          style={{
            background: `${SOULLAB_COLORS.gray}40`,
            border: `1px solid ${SOULLAB_COLORS.gray}60`
          }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); nextPage(); }}
          disabled={currentPage === SAMPLE_PAGES.length - 1 || isFlipping}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-all disabled:opacity-30 hover:scale-110"
          style={{
            background: `${SOULLAB_COLORS.gray}40`,
            border: `1px solid ${SOULLAB_COLORS.gray}60`
          }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-gray-400 mb-6">
          This is just a preview. Get the full book with all chapters and practices.
        </p>
        <a
          href="/publishing/purchase"
          className="inline-block px-8 py-4 rounded-full font-medium transition-all shadow-xl hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${SOULLAB_COLORS.fire}, ${SOULLAB_COLORS.air})`,
            color: 'white'
          }}
        >
          Pre-Order Full Book - $29.99
        </a>
      </div>

      {/* Styles */}
      <style jsx>{`
        .perspective-container {
          perspective: 2000px;
        }

        .book-page {
          width: 600px;
          height: 800px;
          position: relative;
          cursor: pointer;
          transform-style: preserve-3d;
          transition: transform 0.6s ease-in-out;
        }

        .book-page.flipping {
          animation: flip 0.6s ease-in-out;
        }

        @keyframes flip {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(-90deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }

        @media (max-width: 768px) {
          .book-page {
            width: 90vw;
            height: calc(90vw * 1.33);
          }
        }
      `}</style>
    </div>
  );
}
