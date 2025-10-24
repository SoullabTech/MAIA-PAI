'use client';

/**
 * Elemental Alchemy Landing Page
 *
 * Cinematic depth inspired by DUNE/MAIA aesthetic
 * Colors from the Elemental Alchemy book cover
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ElementalAlchemyPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Cinematic Background Layers */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient - warm desert tones */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(
              circle at ${mousePosition.x}% ${mousePosition.y}%,
              rgba(244, 189, 150, 0.15) 0%,
              rgba(243, 166, 131, 0.1) 25%,
              rgba(236, 130, 131, 0.08) 50%,
              rgba(92, 107, 192, 0.05) 75%,
              transparent 100%
            )`
          }}
        />

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f4bd96]/20 via-[#ec8283]/10 to-[#5c6bc0]/20 animate-gradient-slow" />
        </div>

        {/* Sacred geometry pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(244, 189, 150, 0.03) 100px, rgba(244, 189, 150, 0.03) 101px),
              repeating-linear-gradient(-45deg, transparent, transparent 100px, rgba(236, 130, 131, 0.03) 100px, rgba(236, 130, 131, 0.03) 101px)
            `,
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                background: i % 3 === 0 ? '#f4bd96' : i % 3 === 1 ? '#ec8283' : '#5c6bc0',
                animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-[#f4bd96]/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">△ ▽</div>
              <span className="text-[#f4bd96] font-light tracking-[0.3em] text-sm">SOULLAB PUBLISHING</span>
            </div>
            <Link
              href="/subscription/pricing"
              className="bg-gradient-to-r from-[#f4bd96] to-[#f3a683] text-black px-6 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-[#f4bd96]/30 transition-all duration-300"
            >
              MEMBER PRICE AVAILABLE
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main Title */}
            <div className="mb-8 relative">
              <h1
                className="text-7xl md:text-9xl font-light tracking-wider mb-4"
                style={{
                  background: 'linear-gradient(135deg, #f4bd96 0%, #f3a683 25%, #ec8283 50%, #9575cd 75%, #5c6bc0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% 200%',
                  animation: 'gradient-shift 8s ease infinite'
                }}
              >
                ELEMENTAL
              </h1>
              <h1
                className="text-7xl md:text-9xl font-light tracking-[0.3em]"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f4bd96 50%, #ec8283 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                ALCHEMY
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-[#f4bd96]/80 font-light italic mb-12 tracking-wide">
              Transform Your Consciousness Through the Elements
            </p>

            {/* Author */}
            <div className="mb-16">
              <p className="text-[#f4bd96] text-sm tracking-[0.4em] font-light">BY SOULLAB</p>
            </div>

            {/* Featured Card - Book Cover Style */}
            <div className="max-w-2xl mx-auto mb-16 group">
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(244, 189, 150, 0.1) 0%, rgba(243, 166, 131, 0.15) 25%, rgba(236, 130, 131, 0.1) 50%, rgba(149, 117, 205, 0.15) 75%, rgba(92, 107, 192, 0.1) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(244, 189, 150, 0.2)'
                }}
              >
                {/* Dragonfly Sacred Geometry */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity duration-700">
                  <svg viewBox="0 0 400 400" className="w-full h-full">
                    {/* Sacred geometry circles */}
                    <circle cx="200" cy="200" r="150" fill="none" stroke="#f4bd96" strokeWidth="0.5" opacity="0.3" />
                    <circle cx="200" cy="200" r="120" fill="none" stroke="#ec8283" strokeWidth="0.5" opacity="0.3" />
                    <circle cx="200" cy="200" r="90" fill="none" stroke="#5c6bc0" strokeWidth="0.5" opacity="0.3" />

                    {/* Elemental symbols */}
                    <g transform="translate(200, 200)" className="animate-spin-slow">
                      {/* Fire - upward triangle */}
                      <path d="M 0,-60 L 20,-30 L -20,-30 Z" fill="none" stroke="#f4bd96" strokeWidth="2" />
                      {/* Water - downward triangle */}
                      <path d="M 0,60 L 20,30 L -20,30 Z" fill="none" stroke="#5c6bc0" strokeWidth="2" />
                      {/* Air - upward triangle with line */}
                      <path d="M -60,0 L -40,26 L -80,26 Z M -60,13 L -40,13" fill="none" stroke="#ec8283" strokeWidth="2" />
                      {/* Earth - downward triangle with line */}
                      <path d="M 60,0 L 40,-26 L 80,-26 Z M 60,-13 L 40,-13" fill="none" stroke="#9575cd" strokeWidth="2" />
                    </g>
                  </svg>
                </div>

                <div className="relative z-10 p-16">
                  {/* Element Symbols */}
                  <div className="flex items-center justify-center gap-8 mb-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-4xl text-[#f4bd96]">△</div>
                      <span className="text-xs text-[#f4bd96]/70 tracking-wider">FIRE</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-4xl text-[#ec8283]">△</div>
                      <span className="text-xs text-[#ec8283]/70 tracking-wider">AIR</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-4xl text-[#5c6bc0]">▽</div>
                      <span className="text-xs text-[#5c6bc0]/70 tracking-wider">WATER</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-4xl text-[#9575cd]">▽</div>
                      <span className="text-xs text-[#9575cd]/70 tracking-wider">EARTH</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-light mb-4 text-[#f4bd96]">
                    The Path of Transformation
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-8">
                    Journey through the ancient wisdom of elemental alchemy.
                    Learn to harmonize Fire's vision, Water's flow, Earth's grounding,
                    and Air's clarity into one coherent field of consciousness.
                  </p>

                  {/* CTA */}
                  <Link
                    href="/subscription/pricing"
                    className="inline-block bg-gradient-to-r from-[#f4bd96] via-[#ec8283] to-[#9575cd] text-white px-8 py-4 rounded-full font-medium hover:shadow-2xl hover:shadow-[#f4bd96]/40 transition-all duration-300 group"
                  >
                    <span className="flex items-center gap-2">
                      Begin Your Journey
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Elements Section */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-light text-center mb-20 text-[#f4bd96]">
              The Four Elements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ElementCard
                symbol="△"
                element="FIRE"
                color="#f4bd96"
                description="Vision • Creation • Transformation"
              />
              <ElementCard
                symbol="△"
                element="AIR"
                color="#ec8283"
                description="Communication • Clarity • Expression"
              />
              <ElementCard
                symbol="▽"
                element="WATER"
                color="#5c6bc0"
                description="Emotion • Intuition • Flow"
              />
              <ElementCard
                symbol="▽"
                element="EARTH"
                color="#9575cd"
                description="Grounding • Structure • Manifestation"
              />
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <div className="inline-block text-6xl mb-6">✧</div>
              <h2 className="text-4xl font-light mb-6" style={{
                background: 'linear-gradient(135deg, #f4bd96 0%, #ec8283 50%, #5c6bc0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Integration Through MAIA
              </h2>
            </div>

            <p className="text-xl text-gray-300 leading-relaxed mb-12">
              Experience the elements come alive through conversations with MAIA,
              your personal oracle. Track your transformation across all dimensions
              as you integrate elemental wisdom into daily life.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/oracle"
                className="bg-gradient-to-r from-[#f4bd96]/10 to-[#ec8283]/10 backdrop-blur-sm border border-[#f4bd96]/30 text-[#f4bd96] px-8 py-4 rounded-full font-medium hover:shadow-xl hover:shadow-[#f4bd96]/20 transition-all duration-300"
              >
                Consult the Oracle
              </Link>
              <Link
                href="/subscription/pricing"
                className="bg-gradient-to-r from-[#f4bd96] to-[#ec8283] text-black px-8 py-4 rounded-full font-medium hover:shadow-xl hover:shadow-[#f4bd96]/40 transition-all duration-300"
              >
                Unlock Full Access
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 border-t border-[#f4bd96]/10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-6">
              <span className="text-[#f4bd96] tracking-[0.3em] text-sm">SOULLAB PUBLISHING</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2025 Soullab. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes gradient-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        @keyframes spin-slow {
          from { transform: translate(200px, 200px) rotate(0deg); }
          to { transform: translate(200px, 200px) rotate(360deg); }
        }

        .animate-gradient-slow {
          animation: gradient-slow 10s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
      `}</style>
    </div>
  );
}

// Element Card Component
function ElementCard({
  symbol,
  element,
  color,
  description
}: {
  symbol: string;
  element: string;
  color: string;
  description: string;
}) {
  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${color}30`
      }}
    >
      <div className="p-8 text-center relative z-10">
        <div
          className="text-6xl mb-4 transition-transform duration-500 group-hover:scale-110"
          style={{ color }}
        >
          {symbol}
        </div>
        <h3
          className="text-xl font-light tracking-[0.2em] mb-4"
          style={{ color }}
        >
          {element}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Hover glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`
        }}
      />
    </div>
  );
}
