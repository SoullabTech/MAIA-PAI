'use client';

/**
 * Elemental Alchemy Book Cover Component
 * Full 3D book with dragonfly and cinematic effects
 * Official Soullab brand colors
 */

import { useState } from 'react';
import { SOULLAB_COLORS, SOULLAB_GRADIENTS } from '@/lib/soullab-theme';

export default function ElementalAlchemyBook() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / 20;
    const y = (e.clientX - rect.left - rect.width / 2) / 20;
    setRotation({ x: -x, y });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div
        className="book-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="book-3d"
          style={{
            transform: `perspective(2000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          }}
        >
          {/* Book Cover */}
          <div className="book-cover relative w-[400px] h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            {/* Background Gradient - Official Soullab colors */}
            <div className="absolute inset-0">
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(135deg,
                      ${SOULLAB_COLORS.fire} 0%,
                      ${SOULLAB_COLORS.fireLight} 20%,
                      ${SOULLAB_COLORS.air} 40%,
                      ${SOULLAB_COLORS.airLight} 60%,
                      ${SOULLAB_COLORS.water} 80%,
                      ${SOULLAB_COLORS.waterLight} 100%
                    )
                  `
                }}
              />

              {/* Overlay texture */}
              <div className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3' /%3E%3C/svg%3E")`
                }}
              />
            </div>

            {/* Sacred Geometry Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 600">
              {/* Radiating circles from center */}
              {[...Array(8)].map((_, i) => (
                <circle
                  key={i}
                  cx="200"
                  cy="300"
                  r={50 + i * 35}
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  opacity={0.3 - i * 0.03}
                />
              ))}

              {/* Vertical grid lines */}
              {[...Array(20)].map((_, i) => (
                <line
                  key={`v${i}`}
                  x1={i * 20}
                  y1="0"
                  x2={i * 20}
                  y2="600"
                  stroke="white"
                  strokeWidth="0.3"
                  opacity="0.2"
                />
              ))}

              {/* Horizontal grid lines */}
              {[...Array(30)].map((_, i) => (
                <line
                  key={`h${i}`}
                  x1="0"
                  y1={i * 20}
                  x2="400"
                  y2={i * 20}
                  stroke="white"
                  strokeWidth="0.3"
                  opacity="0.2"
                />
              ))}
            </svg>

            {/* Title Section */}
            <div className="absolute top-0 left-0 right-0 p-12 text-center">
              <h1
                className="text-5xl font-bold tracking-tight mb-2"
                style={{
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                  color: '#1a1a1a'
                }}
              >
                ELEMENTAL
              </h1>
              <h1
                className="text-5xl font-light tracking-[0.3em]"
                style={{
                  textShadow: '0 2px 20px rgba(255,255,255,0.5)',
                  color: 'white'
                }}
              >
                ALCHEMY
              </h1>
            </div>

            {/* Dragonfly Illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full p-16 animate-float"
              >
                {/* Dragonfly body */}
                <ellipse
                  cx="200"
                  cy="200"
                  rx="8"
                  ry="60"
                  fill="#1a1a1a"
                  opacity="0.8"
                />

                {/* Head */}
                <circle cx="200" cy="140" r="15" fill="#1a1a1a" opacity="0.8" />

                {/* Left wings - top */}
                <ellipse
                  cx="150"
                  cy="180"
                  rx="80"
                  ry="40"
                  fill="url(#wing-gradient)"
                  opacity="0.7"
                  transform="rotate(-30 150 180)"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="-30 150 180"
                    to="-35 150 180"
                    dur="2s"
                    repeatCount="indefinite"
                    additive="sum"
                  />
                </ellipse>

                {/* Right wings - top */}
                <ellipse
                  cx="250"
                  cy="180"
                  rx="80"
                  ry="40"
                  fill="url(#wing-gradient)"
                  opacity="0.7"
                  transform="rotate(30 250 180)"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="30 250 180"
                    to="35 250 180"
                    dur="2s"
                    repeatCount="indefinite"
                    additive="sum"
                  />
                </ellipse>

                {/* Left wings - bottom */}
                <ellipse
                  cx="160"
                  cy="220"
                  rx="70"
                  ry="35"
                  fill="url(#wing-gradient-2)"
                  opacity="0.6"
                  transform="rotate(-40 160 220)"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="-40 160 220"
                    to="-45 160 220"
                    dur="2s"
                    repeatCount="indefinite"
                    additive="sum"
                  />
                </ellipse>

                {/* Right wings - bottom */}
                <ellipse
                  cx="240"
                  cy="220"
                  rx="70"
                  ry="35"
                  fill="url(#wing-gradient-2)"
                  opacity="0.6"
                  transform="rotate(40 240 220)"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="40 240 220"
                    to="45 240 220"
                    dur="2s"
                    repeatCount="indefinite"
                    additive="sum"
                  />
                </ellipse>

                {/* Wing patterns - sacred geometry */}
                <g opacity="0.3">
                  <circle cx="150" cy="180" r="20" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
                  <circle cx="250" cy="180" r="20" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
                  <circle cx="160" cy="220" r="15" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
                  <circle cx="240" cy="220" r="15" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
                </g>

                {/* Gradients for wings */}
                <defs>
                  <linearGradient id="wing-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={SOULLAB_COLORS.water} stopOpacity="0.4" />
                    <stop offset="50%" stopColor={SOULLAB_COLORS.air} stopOpacity="0.3" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  <linearGradient id="wing-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={SOULLAB_COLORS.waterLight} stopOpacity="0.4" />
                    <stop offset="50%" stopColor={SOULLAB_COLORS.earth} stopOpacity="0.3" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Elemental Symbols at bottom */}
            <div className="absolute bottom-16 left-0 right-0">
              <div className="flex items-center justify-center gap-8">
                {/* Fire */}
                <div className="flex flex-col items-center">
                  <svg width="30" height="30" viewBox="0 0 30 30">
                    <path d="M 15,5 L 20,15 L 10,15 Z" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
                  </svg>
                  <span className="text-[10px] tracking-widest mt-1" style={{ color: '#1a1a1a' }}>Earth</span>
                </div>

                {/* Air */}
                <div className="flex flex-col items-center">
                  <svg width="30" height="30" viewBox="0 0 30 30">
                    <path d="M 15,5 L 20,15 L 10,15 Z M 10,12 L 20,12" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
                  </svg>
                  <span className="text-[10px] tracking-widest mt-1" style={{ color: '#1a1a1a' }}>Fire</span>
                </div>

                {/* Water */}
                <div className="flex flex-col items-center">
                  <svg width="30" height="30" viewBox="0 0 30 30">
                    <path d="M 15,25 L 20,15 L 10,15 Z M 10,18 L 20,18" fill="none" stroke="white" strokeWidth="1.5" />
                  </svg>
                  <span className="text-[10px] tracking-widest mt-1 text-white">Water</span>
                </div>

                {/* Earth */}
                <div className="flex flex-col items-center">
                  <svg width="30" height="30" viewBox="0 0 30 30">
                    <path d="M 15,25 L 20,15 L 10,15 Z" fill="none" stroke="white" strokeWidth="1.5" />
                  </svg>
                  <span className="text-[10px] tracking-widest mt-1 text-white">Air</span>
                </div>
              </div>
            </div>

            {/* Publisher info at bottom */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-xs tracking-[0.3em]" style={{ color: '#1a1a1a', opacity: 0.6 }}>
                SOULLAB PUBLISHING
              </p>
            </div>

            {/* Light effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                  filter: 'blur(40px)'
                }}
              />
            </div>
          </div>

          {/* Book spine (3D effect) */}
          <div
            className="absolute top-0 left-0 w-8 h-full"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.3), transparent)',
              transform: 'rotateY(-90deg) translateZ(-4px)',
              transformOrigin: 'left'
            }}
          />
        </div>
      </div>

      <style jsx>{`
        .book-container {
          perspective: 2000px;
          cursor: pointer;
        }

        .book-3d {
          transition: transform 0.3s ease-out;
          transform-style: preserve-3d;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
