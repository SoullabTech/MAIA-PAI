'use client';

import { useState } from 'react';
import SacredGeometryBackground, { SacredGeometryPresets } from '@/components/consciousness/SacredGeometryBackground';
import { ConsciousnessMapPlaceholder } from '@/components/consciousness/TorusBackgroundMap';

// All available sacred geometry images - HIGH QUALITY SVGs & PNGs
const sacredGeometryImages = [
  // Main Torus (Clean SVG)
  { path: '/consciousness-torus.svg', name: 'Consciousness Torus Field', category: 'Torus & Vortex' },

  // Holoflower Sacred Geometry (SVGs)
  { path: '/holoflower-sacred.svg', name: 'Sacred Holoflower', category: 'Holoflower' },
  { path: '/holoflower-spectrum.svg', name: 'Holoflower Spectrum', category: 'Holoflower' },
  { path: '/holoflower.svg', name: 'Elemental Holoflower', category: 'Holoflower' },
  { path: '/holoflower-interactive.svg', name: 'Interactive Holoflower', category: 'Holoflower' },

  // Sacred Mirror
  { path: '/favicon-sacred-mirror.svg', name: 'Sacred Mirror Portal', category: 'Portals' },

  // Rachel White Art Collection (High-Quality PNGs - Black)
  { path: '/sacred-geometry/black/rachel white art 01.png', name: 'Sacred Portal 1 (Dark)', category: 'Rachel White - Dark' },
  { path: '/sacred-geometry/black/rachel white art 02.png', name: 'Sacred Portal 2 (Dark)', category: 'Rachel White - Dark' },
  { path: '/sacred-geometry/black/rachel white art 03.png', name: 'Sacred Portal 3 (Dark)', category: 'Rachel White - Dark' },
  { path: '/sacred-geometry/black/rachel white art 04.png', name: 'Sacred Portal 4 (Dark)', category: 'Rachel White - Dark' },
  { path: '/sacred-geometry/black/rachel white art 05.png', name: 'Sacred Portal 5 (Dark)', category: 'Rachel White - Dark' },
  { path: '/sacred-geometry/black/rachel white art 06.png', name: 'Sacred Portal 6 (Dark)', category: 'Rachel White - Dark' },

  // Rachel White Art Collection (High-Quality PNGs - Light)
  { path: '/sacred-geometry/white/rachel white art 01.png', name: 'Sacred Portal 1 (Light)', category: 'Rachel White - Light' },
  { path: '/sacred-geometry/white/rachel white art 02.png', name: 'Sacred Portal 2 (Light)', category: 'Rachel White - Light' },
  { path: '/sacred-geometry/white/rachel white art 03.png', name: 'Sacred Portal 3 (Light)', category: 'Rachel White - Light' },
  { path: '/sacred-geometry/white/rachel white art 04.png', name: 'Sacred Portal 4 (Light)', category: 'Rachel White - Light' },
  { path: '/sacred-geometry/white/rachel white art 05.png', name: 'Sacred Portal 5 (Light)', category: 'Rachel White - Light' },
  { path: '/sacred-geometry/white/rachel white art 06.png', name: 'Sacred Portal 6 (Light)', category: 'Rachel White - Light' },
];

export default function SacredGeometryGallery() {
  const [selectedImage, setSelectedImage] = useState(sacredGeometryImages[0]);
  const [opacity, setOpacity] = useState(0.35);
  const [tint, setTint] = useState('#D4A574');
  const [category, setCategory] = useState<string>('All');

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(sacredGeometryImages.map(img => img.category)))];

  // Filter images by category
  const filteredImages = category === 'All'
    ? sacredGeometryImages
    : sacredGeometryImages.filter(img => img.category === category);

  // Preset tint colors
  const tintPresets = [
    { name: 'Amber', color: '#D4A574' },
    { name: 'Gold', color: '#C9B896' },
    { name: 'Sepia', color: '#B8AFA0' },
    { name: 'Warm Gray', color: '#A89D8E' },
    { name: 'Cool Gray', color: '#8B7D6B' },
    { name: 'Rose', color: '#D4B5A0' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2C2520 0%, #1A1614 100%)',
      padding: '3rem',
      color: '#E8DFD0'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontFamily: 'serif',
          fontStyle: 'italic',
          fontWeight: 'normal',
          color: '#D4A574',
          marginBottom: '1rem',
          textShadow: '0 2px 20px rgba(212,165,116,0.4)'
        }}>
          Sacred Geometry Gallery
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#B8AFA0',
          fontStyle: 'italic',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          Explore {sacredGeometryImages.length} sacred geometry backgrounds for your consciousness components.
          Click any image to preview it with your consciousness map.
        </p>
      </div>

      {/* Main Preview */}
      <div style={{
        display: 'flex',
        gap: '3rem',
        maxWidth: '1600px',
        margin: '0 auto',
        marginBottom: '4rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {/* Live Preview */}
        <div style={{
          flex: '0 0 auto'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontFamily: 'serif',
            fontStyle: 'italic',
            color: '#D4A574',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Live Preview
          </h2>
          <SacredGeometryBackground
            imagePath={selectedImage.path}
            size={700}
            opacity={opacity}
            tint={tint}
            label={selectedImage.name}
            showLabels={true}
          >
            <ConsciousnessMapPlaceholder />
          </SacredGeometryBackground>
        </div>

        {/* Controls */}
        <div style={{
          flex: '1 1 400px',
          minWidth: '300px',
          maxWidth: '500px'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontFamily: 'serif',
            fontStyle: 'italic',
            color: '#D4A574',
            marginBottom: '1.5rem'
          }}>
            Customize
          </h2>

          {/* Selected Image Info */}
          <div style={{
            background: 'rgba(212,165,116,0.1)',
            border: '1px solid rgba(212,165,116,0.3)',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#D4A574' }}>
              {selectedImage.name}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#B8AFA0', marginBottom: '0.5rem' }}>
              Category: {selectedImage.category}
            </p>
            <code style={{
              fontSize: '0.85rem',
              color: '#A89D8E',
              background: 'rgba(0,0,0,0.3)',
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'block',
              marginTop: '0.5rem',
              wordBreak: 'break-all'
            }}>
              {selectedImage.path}
            </code>
          </div>

          {/* Opacity Control */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              color: '#D4A574',
              fontFamily: 'serif',
              fontStyle: 'italic'
            }}>
              Opacity: {Math.round(opacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: `linear-gradient(to right,
                  rgba(212,165,116,0.2) 0%,
                  rgba(212,165,116,0.8) 100%)`,
                outline: 'none',
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Tint Color Presets */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              color: '#D4A574',
              fontFamily: 'serif',
              fontStyle: 'italic'
            }}>
              Tint Color
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem'
            }}>
              {tintPresets.map(preset => (
                <button
                  key={preset.color}
                  onClick={() => setTint(preset.color)}
                  style={{
                    padding: '0.75rem',
                    border: tint === preset.color
                      ? '2px solid #D4A574'
                      : '1px solid rgba(212,165,116,0.3)',
                    borderRadius: '6px',
                    background: `linear-gradient(135deg, ${preset.color}40, ${preset.color}20)`,
                    color: '#E8DFD0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontFamily: 'serif',
                    fontStyle: 'italic',
                    transition: 'all 0.2s'
                  }}
                >
                  {preset.name}
                  <div style={{
                    width: '100%',
                    height: '20px',
                    background: preset.color,
                    borderRadius: '4px',
                    marginTop: '0.5rem',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }} />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Tint Input */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              color: '#D4A574',
              fontFamily: 'serif',
              fontStyle: 'italic'
            }}>
              Custom Tint (Hex)
            </label>
            <input
              type="text"
              value={tint}
              onChange={(e) => setTint(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(212,165,116,0.3)',
                borderRadius: '6px',
                color: '#E8DFD0',
                fontSize: '1rem',
                fontFamily: 'monospace'
              }}
              placeholder="#D4A574"
            />
          </div>

          {/* Code Sample */}
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(212,165,116,0.2)',
            borderRadius: '8px',
            padding: '1rem',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            color: '#B8AFA0',
            lineHeight: '1.6'
          }}>
            <div style={{ color: '#D4A574', marginBottom: '0.5rem' }}>Usage:</div>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{`<SacredGeometryBackground
  imagePath="${selectedImage.path}"
  opacity={${opacity}}
  tint="${tint}"
  label="${selectedImage.name}"
>
  <YourComponent />
</SacredGeometryBackground>`}
            </pre>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto 2rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '0.75rem 1.5rem',
                background: category === cat
                  ? 'linear-gradient(135deg, #D4A574, #C9B896)'
                  : 'rgba(212,165,116,0.1)',
                border: category === cat
                  ? '2px solid #D4A574'
                  : '1px solid rgba(212,165,116,0.3)',
                borderRadius: '25px',
                color: category === cat ? '#1A1614' : '#D4A574',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontFamily: 'serif',
                fontStyle: 'italic',
                fontWeight: category === cat ? 'bold' : 'normal',
                transition: 'all 0.3s',
                boxShadow: category === cat
                  ? '0 4px 15px rgba(212,165,116,0.4)'
                  : 'none'
              }}
            >
              {cat} {cat !== 'All' && `(${sacredGeometryImages.filter(img => img.category === cat).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontFamily: 'serif',
          fontStyle: 'italic',
          color: '#D4A574',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Browse All Images ({filteredImages.length})
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredImages.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(image)}
              style={{
                background: selectedImage.path === image.path
                  ? 'rgba(212,165,116,0.2)'
                  : 'rgba(212,165,116,0.05)',
                border: selectedImage.path === image.path
                  ? '2px solid #D4A574'
                  : '1px solid rgba(212,165,116,0.2)',
                borderRadius: '12px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textAlign: 'left',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '100%',
                background: '#F5F0E8',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '0.75rem'
              }}>
                <img
                  src={image.path}
                  alt={image.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div style={{
                fontSize: '0.95rem',
                color: '#D4A574',
                fontFamily: 'serif',
                fontStyle: 'italic',
                marginBottom: '0.25rem'
              }}>
                {image.name}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#B8AFA0',
                fontStyle: 'italic'
              }}>
                {image.category}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '4rem',
        padding: '2rem',
        borderTop: '1px solid rgba(212,165,116,0.2)',
        color: '#A89D8E',
        fontStyle: 'italic',
        fontSize: '0.9rem'
      }}>
        <p>
          Visit <strong style={{ color: '#D4A574' }}>/sacred-geometry-gallery</strong> to explore all {sacredGeometryImages.length} sacred geometry backgrounds
        </p>
      </div>
    </div>
  );
}
