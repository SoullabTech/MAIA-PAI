'use client';

/**
 * Soullab Publishing Platform
 * Complete book showcase with official brand colors
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SOULLAB_COLORS } from '@/lib/soullab-theme';

export default function PublishingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [emailSignup, setEmailSignup] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouse);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/publishing/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailSignup,
          source: 'publishing_page'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSignupSuccess(true);
        setEmailSignup('');
        setTimeout(() => setSignupSuccess(false), 5000);
      } else {
        console.error('Signup error:', data.error);
        alert(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Cinematic Background - Official Soullab Colors */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient with elemental colors */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(
              circle at ${mousePos.x}% ${mousePos.y}%,
              ${SOULLAB_COLORS.fire}15 0%,
              ${SOULLAB_COLORS.air}12 25%,
              ${SOULLAB_COLORS.earth}10 50%,
              ${SOULLAB_COLORS.water}08 75%,
              transparent 100%
            )`
          }}
        />

        {/* Animated gradient layer */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0 animate-gradient-slow"
            style={{
              background: `linear-gradient(
                135deg,
                ${SOULLAB_COLORS.fire}20 0%,
                ${SOULLAB_COLORS.air}15 25%,
                ${SOULLAB_COLORS.earth}12 50%,
                ${SOULLAB_COLORS.water}15 75%,
                ${SOULLAB_COLORS.fire}20 100%
              )`
            }}
          />
        </div>

        {/* Sacred geometry grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 100px, ${SOULLAB_COLORS.air}30 100px, ${SOULLAB_COLORS.air}30 101px),
              repeating-linear-gradient(-45deg, transparent, transparent 100px, ${SOULLAB_COLORS.water}30 100px, ${SOULLAB_COLORS.water}30 101px)
            `,
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        />

        {/* Floating particles with element colors */}
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: Math.random() * 4 + 1 + 'px',
                height: Math.random() * 4 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                background: [SOULLAB_COLORS.fire, SOULLAB_COLORS.air, SOULLAB_COLORS.earth, SOULLAB_COLORS.water][i % 4],
                animation: `float ${Math.random() * 15 + 20}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-4">
                <SoullabSpiral className="w-10 h-10" />
                <div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: SOULLAB_COLORS.fire }} className="text-xl font-light tracking-wider">SOUL</span>
                    <span style={{ color: SOULLAB_COLORS.water }} className="text-xl font-light tracking-wider">LAB</span>
                  </div>
                  <div style={{ color: SOULLAB_COLORS.air }} className="text-xs tracking-[0.3em]">PUBLISHING</div>
                </div>
              </Link>

              {/* Nav */}
              <nav className="hidden md:flex items-center gap-8">
                <Link href="#catalog" className="text-sm hover:opacity-70 transition-opacity">Catalog</Link>
                <Link href="#about" className="text-sm hover:opacity-70 transition-opacity">About</Link>
                <Link
                  href="/subscription/pricing"
                  className="px-6 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${SOULLAB_COLORS.fire}, ${SOULLAB_COLORS.air})`,
                    color: 'white'
                  }}
                >
                  Member Pricing
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Animated Title */}
            <div className="mb-8">
              <h1
                className="text-8xl md:text-9xl font-light tracking-wider mb-4 animate-fade-in"
                style={{
                  background: `linear-gradient(135deg, ${SOULLAB_COLORS.fire} 0%, ${SOULLAB_COLORS.air} 50%, ${SOULLAB_COLORS.water} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% 200%',
                  animation: 'gradient-shift 8s ease infinite'
                }}
              >
                ELEMENTAL
              </h1>
              <h1
                className="text-8xl md:text-9xl font-light tracking-[0.3em]"
                style={{
                  background: `linear-gradient(135deg, ${SOULLAB_COLORS.earth} 0%, ${SOULLAB_COLORS.water} 50%, white 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                ALCHEMY
              </h1>
            </div>

            <p className="text-2xl md:text-3xl font-light italic mb-12" style={{ color: SOULLAB_COLORS.air }}>
              Transform Your Consciousness Through the Elements
            </p>

            <div style={{ color: SOULLAB_COLORS.fire }} className="text-sm tracking-[0.4em] mb-16">
              BY SOULLAB
            </div>

            {/* Feature Book Card */}
            <div className="max-w-3xl mx-auto mb-16">
              <FeatureBookCard />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                href="#preview"
                className="px-8 py-4 rounded-full font-medium transition-all backdrop-blur-sm"
                style={{
                  background: `linear-gradient(135deg, ${SOULLAB_COLORS.fire}20, ${SOULLAB_COLORS.air}20)`,
                  border: `1px solid ${SOULLAB_COLORS.air}50`,
                  color: SOULLAB_COLORS.air
                }}
              >
                Preview Inside
              </Link>
              <Link
                href="#purchase"
                className="px-8 py-4 rounded-full font-medium transition-all shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${SOULLAB_COLORS.fire}, ${SOULLAB_COLORS.air})`,
                  color: 'white'
                }}
              >
                Pre-Order Now
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="animate-bounce" style={{ color: SOULLAB_COLORS.water }}>
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>

        {/* Email Signup Section */}
        <section className="py-32 px-6" id="notify">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <div
                className="inline-block text-5xl mb-6"
                style={{ color: SOULLAB_COLORS.air }}
              >
                ✧
              </div>
              <h2 className="text-4xl font-light mb-4" style={{ color: SOULLAB_COLORS.air }}>
                Be the First to Know
              </h2>
              <p className="text-gray-400 mb-8">
                Sign up for updates on launch date, exclusive content, and special offers.
              </p>
            </div>

            <form onSubmit={handleEmailSignup} className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  value={emailSignup}
                  onChange={(e) => setEmailSignup(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-4 rounded-full bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: `${SOULLAB_COLORS.air}30`,
                    boxShadow: `0 0 0 0 ${SOULLAB_COLORS.air}00`,
                    ':focus': {
                      borderColor: SOULLAB_COLORS.air,
                      boxShadow: `0 0 20px ${SOULLAB_COLORS.air}40`
                    }
                  }}
                />
                <button
                  type="submit"
                  className="px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${SOULLAB_COLORS.fire}, ${SOULLAB_COLORS.air})`,
                    color: 'white'
                  }}
                >
                  Notify Me
                </button>
              </div>

              {signupSuccess && (
                <div className="mt-4 p-4 rounded-lg" style={{ background: `${SOULLAB_COLORS.earth}20`, border: `1px solid ${SOULLAB_COLORS.earth}` }}>
                  <p style={{ color: SOULLAB_COLORS.earth }}>✓ You're on the list! We'll be in touch soon.</p>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* Elements Section */}
        <section className="py-32 px-6" id="elements">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-light text-center mb-20" style={{ color: SOULLAB_COLORS.air }}>
              The Four Elements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ElementCard
                symbol="△"
                element="FIRE"
                color={SOULLAB_COLORS.fire}
                description="Vision • Creation • Transformation"
              />
              <ElementCard
                symbol="△"
                element="AIR"
                color={SOULLAB_COLORS.air}
                description="Communication • Clarity • Expression"
              />
              <ElementCard
                symbol="▽"
                element="WATER"
                color={SOULLAB_COLORS.water}
                description="Emotion • Intuition • Flow"
              />
              <ElementCard
                symbol="▽"
                element="EARTH"
                color={SOULLAB_COLORS.earth}
                description="Grounding • Structure • Manifestation"
              />
            </div>
          </div>
        </section>

        {/* Video Trailer Section */}
        <section className="py-32 px-6" id="trailer">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-light mb-6" style={{ color: SOULLAB_COLORS.water }}>
                Experience the Journey
              </h2>
              <p className="text-gray-400 text-lg">
                Watch the book trailer and discover how elemental wisdom transforms consciousness
              </p>
            </div>

            {/* Video Player Preview */}
            <div
              onClick={() => setShowVideoModal(true)}
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              style={{
                paddingTop: '56.25%', // 16:9 aspect ratio
                background: `linear-gradient(135deg, ${SOULLAB_COLORS.water}20, ${SOULLAB_COLORS.earth}20)`,
                border: `1px solid ${SOULLAB_COLORS.water}30`
              }}
            >
              {/* Background Pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 450">
                {[...Array(8)].map((_, i) => (
                  <circle
                    key={i}
                    cx="400"
                    cy="225"
                    r={60 + i * 40}
                    fill="none"
                    stroke={SOULLAB_COLORS.water}
                    strokeWidth="0.5"
                  />
                ))}
              </svg>

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-2xl"
                  style={{
                    background: `${SOULLAB_COLORS.fire}`,
                    boxShadow: `0 0 40px ${SOULLAB_COLORS.fire}60`
                  }}
                >
                  <svg className="w-10 h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Overlay text */}
              <div className="absolute inset-0 flex items-end justify-center pb-12">
                <p className="text-white text-sm tracking-wider">CLICK TO WATCH TRAILER (2:30)</p>
              </div>

              {/* Thumbnail overlay with element symbols */}
              <div className="absolute top-8 left-8 flex gap-4 opacity-30 group-hover:opacity-50 transition-opacity">
                {['fire', 'air', 'water', 'earth'].map((element, i) => (
                  <div
                    key={element}
                    className="text-3xl"
                    style={{ color: SOULLAB_COLORS[element as keyof typeof SOULLAB_COLORS] }}
                  >
                    {element === 'fire' || element === 'air' ? '△' : '▽'}
                  </div>
                ))}
              </div>
            </div>

            {/* Video Stats */}
            <div className="mt-8 grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-light mb-2" style={{ color: SOULLAB_COLORS.fire }}>
                  2:30
                </div>
                <div className="text-sm text-gray-400">Duration</div>
              </div>
              <div>
                <div className="text-3xl font-light mb-2" style={{ color: SOULLAB_COLORS.air }}>
                  4K
                </div>
                <div className="text-sm text-gray-400">Resolution</div>
              </div>
              <div>
                <div className="text-3xl font-light mb-2" style={{ color: SOULLAB_COLORS.water }}>
                  12
                </div>
                <div className="text-sm text-gray-400">Chapters Preview</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              {/* Logo */}
              <div>
                <SoullabSpiral className="w-16 h-16 mb-4" />
                <p className="text-sm text-gray-500">
                  Bringing order and organization to Soul & Spirit
                </p>
              </div>

              {/* Links */}
              <div>
                <h3 className="text-sm font-semibold mb-4" style={{ color: SOULLAB_COLORS.air }}>EXPLORE</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="/publishing/catalog" className="hover:text-white transition-colors">Book Catalog</Link></li>
                  <li><Link href="/oracle" className="hover:text-white transition-colors">Oracle</Link></li>
                  <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                  <li><Link href="/subscription/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-sm font-semibold mb-4" style={{ color: SOULLAB_COLORS.air }}>CONNECT</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="mailto:kelly@soullab.org" className="hover:text-white transition-colors">Email Us</a></li>
                  <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-white/10">
              <p className="text-sm text-gray-500">
                © 2025 Soullab Publishing. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Video Modal */}
        {showVideoModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
            onClick={() => setShowVideoModal(false)}
          >
            <div
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: `${SOULLAB_COLORS.gray}40`,
                  border: `1px solid ${SOULLAB_COLORS.gray}60`
                }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Video Container */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  paddingTop: '56.25%',
                  background: '#000'
                }}
              >
                {/* Placeholder for video player */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* YouTube/Vimeo embed would go here */}
                  {/* Example: <iframe src="https://www.youtube.com/embed/VIDEO_ID" ... /> */}

                  {/* Temporary placeholder */}
                  <div className="text-center p-12">
                    <div
                      className="text-6xl mb-6"
                      style={{ color: SOULLAB_COLORS.air }}
                    >
                      🎬
                    </div>
                    <h3
                      className="text-3xl font-light mb-4"
                      style={{ color: SOULLAB_COLORS.air }}
                    >
                      Video Coming Soon
                    </h3>
                    <p className="text-gray-400 mb-8">
                      The Elemental Alchemy trailer is in production. Check back soon for an immersive
                      journey through the four elements.
                    </p>

                    {/* Preview stats */}
                    <div className="flex justify-center gap-12 mb-8">
                      {[
                        { label: 'Chapters', value: '12', color: SOULLAB_COLORS.fire },
                        { label: 'Duration', value: '2:30', color: SOULLAB_COLORS.air },
                        { label: 'Elements', value: '4', color: SOULLAB_COLORS.water }
                      ].map((stat) => (
                        <div key={stat.label}>
                          <div className="text-2xl font-light mb-1" style={{ color: stat.color }}>
                            {stat.value}
                          </div>
                          <div className="text-sm text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setShowVideoModal(false)}
                      className="px-8 py-3 rounded-full border transition-all hover:scale-105"
                      style={{
                        borderColor: `${SOULLAB_COLORS.air}60`,
                        background: `${SOULLAB_COLORS.air}10`,
                        color: SOULLAB_COLORS.air
                      }}
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Description */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  To add your video: Replace the placeholder with an iframe embed from YouTube or Vimeo
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
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
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }

        .animate-gradient-slow {
          animation: gradient-slow 15s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fadeIn 1.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Soullab Spiral Logo Component
function SoullabSpiral({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="spiral-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={SOULLAB_COLORS.fire} />
          <stop offset="33%" stopColor={SOULLAB_COLORS.air} />
          <stop offset="66%" stopColor={SOULLAB_COLORS.earth} />
          <stop offset="100%" stopColor={SOULLAB_COLORS.water} />
        </linearGradient>
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
                fill="url(#spiral-gradient)"
                opacity={0.9 - (ring * 0.05)}
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

// Feature Book Card
function FeatureBookCard() {
  return (
    <div
      className="relative rounded-3xl overflow-hidden shadow-2xl group transition-all duration-700 hover:scale-105"
      style={{
        background: `linear-gradient(135deg, ${SOULLAB_COLORS.fire}10, ${SOULLAB_COLORS.air}15, ${SOULLAB_COLORS.water}10)`,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${SOULLAB_COLORS.air}30`
      }}
    >
      <div className="p-12 relative z-10">
        {/* Elemental symbols */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <ElementSymbol symbol="△" color={SOULLAB_COLORS.fire} label="FIRE" />
          <ElementSymbol symbol="△" color={SOULLAB_COLORS.air} label="AIR" />
          <ElementSymbol symbol="▽" color={SOULLAB_COLORS.water} label="WATER" />
          <ElementSymbol symbol="▽" color={SOULLAB_COLORS.earth} label="EARTH" />
        </div>

        <h3 className="text-3xl font-light mb-4" style={{ color: SOULLAB_COLORS.air }}>
          The Path of Transformation
        </h3>
        <p className="text-gray-300 leading-relaxed mb-8">
          Journey through the ancient wisdom of elemental alchemy.
          Learn to harmonize Fire's vision, Water's flow, Earth's grounding,
          and Air's clarity into one coherent field of consciousness.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="#preview"
            className="px-6 py-3 rounded-full font-medium transition-all"
            style={{
              background: `${SOULLAB_COLORS.fire}20`,
              border: `1px solid ${SOULLAB_COLORS.fire}`,
              color: SOULLAB_COLORS.fire
            }}
          >
            Look Inside
          </Link>
          <Link
            href="#purchase"
            className="px-6 py-3 rounded-full font-medium transition-all shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${SOULLAB_COLORS.fire}, ${SOULLAB_COLORS.air})`,
              color: 'white'
            }}
          >
            Pre-Order $29.99
          </Link>
        </div>
      </div>
    </div>
  );
}

// Element Symbol Component
function ElementSymbol({ symbol, color, label }: { symbol: string; color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-4xl" style={{ color }}>{symbol}</div>
      <span className="text-xs tracking-wider" style={{ color: `${color}cc` }}>{label}</span>
    </div>
  );
}

// Element Card Component
function ElementCard({ symbol, element, color, description }: {
  symbol: string;
  element: string;
  color: string;
  description: string;
}) {
  return (
    <div
      className="group relative rounded-2xl overflow-hidden p-8 text-center transition-all duration-500 hover:scale-105 cursor-pointer"
      style={{
        background: `${color}10`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${color}30`
      }}
    >
      <div className="text-6xl mb-4 transition-transform duration-500 group-hover:scale-110" style={{ color }}>
        {symbol}
      </div>
      <h3 className="text-xl font-light tracking-[0.2em] mb-4" style={{ color }}>
        {element}
      </h3>
      <p className="text-sm text-gray-400 leading-relaxed">
        {description}
      </p>

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`
        }}
      />
    </div>
  );
}
