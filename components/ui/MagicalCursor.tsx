'use client';

/**
 * Magical Cursor - Wand with Glowing Trail
 * Brings the sacred tech aesthetic to every interaction
 */

import { useState, useEffect } from 'react';
import { SOULLAB_COLORS } from '@/lib/soullab-theme';

interface MagicalCursorProps {
  enabled?: boolean;
  showWand?: boolean;
  glowIntensity?: 'subtle' | 'medium' | 'strong';
}

export function MagicalCursor({
  enabled = true,
  showWand = true,
  glowIntensity = 'medium'
}: MagicalCursorProps) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (!enabled) return;

    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [enabled]);

  if (!enabled) return null;

  const intensityMap = {
    subtle: '0.08',
    medium: '0.15',
    strong: '0.25'
  };

  const opacity = intensityMap[glowIntensity];

  return (
    <>
      {/* Magical Glow Trail */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          background: `radial-gradient(
            circle at ${mousePos.x}% ${mousePos.y}%,
            ${SOULLAB_COLORS.fire}${opacity.replace('.', '')} 0%,
            ${SOULLAB_COLORS.air}${Math.floor(parseFloat(opacity) * 0.8 * 100)} 25%,
            ${SOULLAB_COLORS.earth}${Math.floor(parseFloat(opacity) * 0.6 * 100)} 50%,
            ${SOULLAB_COLORS.water}${Math.floor(parseFloat(opacity) * 0.4 * 100)} 75%,
            transparent 100%
          )`,
          transition: 'background 0.3s ease-out'
        }}
      />

      {/* Custom Wand Cursor - Subtle and Ethereal */}
      {showWand && (
        <style jsx global>{`
          * {
            cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g><circle cx="4" cy="4" r="1.5" fill="%23D4AF37" opacity="0.9"/><circle cx="4" cy="4" r="3" fill="%23D4AF37" opacity="0.2"/><line x1="4" y1="4" x2="20" y2="20" stroke="%23D4AF37" stroke-width="1" stroke-linecap="round" opacity="0.6"/><circle cx="20" cy="20" r="0.8" fill="%23D4AF37" opacity="0.7"/><circle cx="8" cy="8" r="0.6" fill="%23FFD700" opacity="0.4"/></g></svg>') 4 4, auto !important;
          }

          a, button, [role="button"] {
            cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g><circle cx="4" cy="4" r="2" fill="%23D4AF37" opacity="1"/><circle cx="4" cy="4" r="4" fill="%23D4AF37" opacity="0.3"/><line x1="4" y1="4" x2="20" y2="20" stroke="%23D4AF37" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/><circle cx="20" cy="20" r="1" fill="%23D4AF37" opacity="0.8"/><circle cx="8" cy="8" r="0.8" fill="%23FFD700" opacity="0.5"/><circle cx="12" cy="12" r="0.6" fill="%23FFD700" opacity="0.4"/></g></svg>') 4 4, pointer !important;
          }

          input, textarea {
            cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g><circle cx="4" cy="4" r="1.5" fill="%23D4AF37" opacity="0.8"/><line x1="4" y1="4" x2="20" y2="20" stroke="%23D4AF37" stroke-width="1" stroke-linecap="round" opacity="0.5"/><line x1="20" y1="18" x2="20" y2="20" stroke="%23D4AF37" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/></g></svg>') 4 4, text !important;
          }
        `}</style>
      )}
    </>
  );
}
