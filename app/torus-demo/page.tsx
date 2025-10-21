'use client';

import TorusEmbracedMap, { ConsciousnessMapPlaceholder as SVGMapPlaceholder } from '@/components/consciousness/TorusEmbracedMap';
import TorusBackgroundMap, { ConsciousnessMapPlaceholder } from '@/components/consciousness/TorusBackgroundMap';

export default function TorusDemoPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F5F0E8 0%, #E8DFD0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        gap: '3rem'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            color: '#8B7D6B',
            fontFamily: 'serif',
            fontStyle: 'italic',
            fontSize: '2.5rem',
            marginBottom: '0.75rem',
            fontWeight: 'normal'
          }}
        >
          Torus-Embraced Consciousness Map
        </h1>
        <p
          style={{
            color: '#9B8A76',
            fontFamily: 'serif',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}
        >
          Two approaches: Sacred geometry image background (top) vs. SVG rendered torus (bottom)
        </p>
      </div>

      {/* NEW: Image-based torus background */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <h2 style={{
          color: '#8B7D6B',
          fontFamily: 'serif',
          fontStyle: 'italic',
          fontSize: '1.3rem',
          fontWeight: 'normal'
        }}>
          Sacred Geometry Torus Background (iStock-1008544140)
        </h2>
        <TorusBackgroundMap size={800} showLabels={true} torusOpacity={0.35} amberTint="#D4A574">
          <ConsciousnessMapPlaceholder />
        </TorusBackgroundMap>
        <p style={{
          color: '#9B8A76',
          fontFamily: 'serif',
          fontStyle: 'italic',
          fontSize: '0.95rem',
          maxWidth: '700px',
          textAlign: 'center',
          opacity: 0.8
        }}>
          Light amber tint (#D4A574) at 35% opacity fills the full box, centering the consciousness map in the heart of the torus field.
        </p>
      </div>

      {/* Variations */}
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <TorusBackgroundMap size={350} showLabels={false} torusOpacity={0.25} amberTint="#D4A574">
            <ConsciousnessMapPlaceholder />
          </TorusBackgroundMap>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#8B7D6B', fontStyle: 'italic' }}>
            Subtle (25% opacity)
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <TorusBackgroundMap size={350} showLabels={false} torusOpacity={0.45} amberTint="#C9B896">
            <ConsciousnessMapPlaceholder />
          </TorusBackgroundMap>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#8B7D6B', fontStyle: 'italic' }}>
            Stronger (45% opacity, warmer tint)
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        width: '80%',
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(139,125,107,0.3), transparent)'
      }} />

      {/* ORIGINAL: SVG-based torus */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <h2 style={{
          color: '#8B7D6B',
          fontFamily: 'serif',
          fontStyle: 'italic',
          fontSize: '1.3rem',
          fontWeight: 'normal'
        }}>
          SVG Rendered Torus (Original)
        </h2>
        <TorusEmbracedMap size={800} showLabels={true}>
          <SVGMapPlaceholder />
        </TorusEmbracedMap>
        <p style={{
          color: '#9B8A76',
          fontFamily: 'serif',
          fontStyle: 'italic',
          fontSize: '0.95rem',
          maxWidth: '700px',
          textAlign: 'center',
          opacity: 0.8
        }}>
          Hand-coded SVG torus with nested vortex layers. Shows the apple → tree → universe fractal nesting.
        </p>
      </div>

      {/* Footer note */}
      <div
        style={{
          marginTop: '1rem',
          maxWidth: '800px',
          color: '#8B7D6B',
          fontFamily: 'serif',
          fontStyle: 'italic',
          fontSize: '0.9rem',
          textAlign: 'center',
          lineHeight: '1.7',
          padding: '1.5rem',
          background: 'rgba(212,165,116,0.08)',
          borderRadius: '8px',
          border: '1px solid rgba(212,165,116,0.15)'
        }}
      >
        <p style={{ marginBottom: '1rem' }}>
          <strong>Usage:</strong> Replace <code style={{ background: 'rgba(139,125,107,0.15)', padding: '2px 6px', borderRadius: '3px' }}>ConsciousnessMapPlaceholder</code> with your actual consciousness map component.
        </p>
        <p style={{ opacity: 0.85 }}>
          The image-based version provides a more authentic sacred geometry aesthetic, while the SVG version offers more programmatic control over colors and animations.
        </p>
      </div>
    </div>
  );
}
