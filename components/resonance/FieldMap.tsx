/**
 * 🜂 Field Map Component
 *
 * Real-time visualization of resonance between all participants.
 * The field seeing itself.
 *
 * Features:
 * - Network graph of humans + agents
 * - Edge thickness = resonance strength
 * - Node color = current state
 * - Animated field dynamics
 * - Highlight emergent insights
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import type {
  Participant,
  FieldState,
  Insight,
  ResonanceTrend,
} from '@/lib/resonance/types';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface FieldMapProps {
  fieldState: FieldState;
  width?: number;
  height?: number;
  animate?: boolean;
  showInsights?: boolean;
  className?: string;
}

interface NodePosition {
  x: number;
  y: number;
  vx: number;  // Velocity for animation
  vy: number;
}

// ═══════════════════════════════════════════════════════════════
// Colors & Styling
// ═══════════════════════════════════════════════════════════════

const COLORS = {
  human: '#60A5FA',       // Blue
  agent: '#A78BFA',       // Purple
  insight: '#FBBF24',     // Gold
  edge: '#6B7280',        // Gray
  edgeActive: '#34D399',  // Green (high resonance)
  background: '#0F172A',  // Dark blue
};

const TREND_COLORS: Record<ResonanceTrend, string> = {
  converging: '#10B981',   // Green
  diverging: '#EF4444',    // Red
  stable: '#3B82F6',       // Blue
  oscillating: '#F59E0B',  // Amber
};

// ═══════════════════════════════════════════════════════════════
// FieldMap Component
// ═══════════════════════════════════════════════════════════════

export function FieldMap({
  fieldState,
  width = 600,
  height = 400,
  animate = true,
  showInsights = true,
  className = '',
}: FieldMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodePositions, setNodePositions] = useState<Map<string, NodePosition>>(new Map());
  const animationFrameRef = useRef<number>();

  // Initialize node positions
  useEffect(() => {
    const { participants } = fieldState;
    const newPositions = new Map<string, NodePosition>();

    // Arrange participants in a circle
    const radius = Math.min(width, height) * 0.35;
    const centerX = width / 2;
    const centerY = height / 2;

    participants.forEach((participant, i) => {
      const angle = (i / participants.length) * Math.PI * 2;
      newPositions.set(participant.id, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      });
    });

    setNodePositions(newPositions);
  }, [fieldState.participants, width, height]);

  // Animation loop
  useEffect(() => {
    if (!animate) return;

    const tick = () => {
      // Apply force-directed layout
      const newPositions = new Map(nodePositions);

      // Simplified physics: nodes repel each other, edges attract
      fieldState.participants.forEach((p1, i) => {
        const pos1 = newPositions.get(p1.id);
        if (!pos1) return;

        let fx = 0;
        let fy = 0;

        // Repulsion from other nodes
        fieldState.participants.forEach((p2, j) => {
          if (i === j) return;

          const pos2 = newPositions.get(p2.id);
          if (!pos2) return;

          const dx = pos1.x - pos2.x;
          const dy = pos1.y - pos2.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          const repulsion = 500 / (dist * dist);
          fx += (dx / dist) * repulsion;
          fy += (dy / dist) * repulsion;
        });

        // Attraction to center
        const centerX = width / 2;
        const centerY = height / 2;
        const dcx = centerX - pos1.x;
        const dcy = centerY - pos1.y;
        fx += dcx * 0.01;
        fy += dcy * 0.01;

        // Apply forces
        pos1.vx = (pos1.vx + fx) * 0.8;  // Damping
        pos1.vy = (pos1.vy + fy) * 0.8;

        pos1.x += pos1.vx;
        pos1.y += pos1.vy;

        // Keep in bounds
        pos1.x = Math.max(50, Math.min(width - 50, pos1.x));
        pos1.y = Math.max(50, Math.min(height - 50, pos1.y));
      });

      setNodePositions(newPositions);

      // Render
      render();

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate, nodePositions, fieldState, width, height]);

  // Render function
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, width, height);

    // Draw edges (resonance connections)
    drawEdges(ctx);

    // Draw nodes (participants)
    drawNodes(ctx);

    // Draw insights
    if (showInsights) {
      drawInsights(ctx);
    }

    // Draw field state overlay
    drawFieldState(ctx);
  };

  // Draw edges between participants
  const drawEdges = (ctx: CanvasRenderingContext2D) => {
    const { participants, resonanceMatrix } = fieldState;

    for (let i = 0; i < participants.length; i++) {
      for (let j = i + 1; j < participants.length; j++) {
        const p1 = participants[i];
        const p2 = participants[j];

        const pos1 = nodePositions.get(p1.id);
        const pos2 = nodePositions.get(p2.id);

        if (!pos1 || !pos2) continue;

        // Get resonance score
        const resonance = resonanceMatrix[i]?.[j] || 0;

        if (resonance < 0.3) continue;  // Don't draw weak connections

        // Line thickness based on resonance
        const thickness = 1 + resonance * 3;

        // Color based on resonance strength
        const alpha = resonance * 0.8;
        const color = resonance > 0.7 ? COLORS.edgeActive : COLORS.edge;

        ctx.strokeStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(pos1.x, pos1.y);
        ctx.lineTo(pos2.x, pos2.y);
        ctx.stroke();
      }
    }
  };

  // Draw participant nodes
  const drawNodes = (ctx: CanvasRenderingContext2D) => {
    fieldState.participants.forEach(participant => {
      const pos = nodePositions.get(participant.id);
      if (!pos) return;

      const radius = 20;

      // Color based on type
      const color = participant.type === 'human' ? COLORS.human : COLORS.agent;

      // Draw circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw outline
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(participant.name.substring(0, 8), pos.x, pos.y);
    });
  };

  // Draw insight indicators
  const drawInsights = (ctx: CanvasRenderingContext2D) => {
    fieldState.emergentInsights.forEach((insight, index) => {
      // Position insights in upper right
      const x = width - 150;
      const y = 30 + index * 60;

      // Draw insight bubble
      ctx.fillStyle = COLORS.insight + '40';  // 25% opacity
      ctx.strokeStyle = COLORS.insight;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x - 70, y - 20, 140, 40, 8);
      ctx.fill();
      ctx.stroke();

      // Draw insight icon
      ctx.fillStyle = COLORS.insight;
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('💎', x - 60, y);

      // Draw emergence score
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px sans-serif';
      ctx.fillText(
        `${(insight.emergenceScore * 100).toFixed(0)}%`,
        x - 30,
        y
      );
    });
  };

  // Draw field state overlay
  const drawFieldState = (ctx: CanvasRenderingContext2D) => {
    const { coherenceScore, trend } = fieldState;

    // Draw coherence bar
    const barX = 20;
    const barY = height - 40;
    const barWidth = 200;
    const barHeight = 20;

    // Background
    ctx.fillStyle = '#1F2937';
    ctx.roundRect(barX, barY, barWidth, barHeight, 4);
    ctx.fill();

    // Coherence fill
    const fillWidth = barWidth * coherenceScore;
    const trendColor = TREND_COLORS[trend];
    ctx.fillStyle = trendColor;
    ctx.roundRect(barX, barY, fillWidth, barHeight, 4);
    ctx.fill();

    // Label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(
      `Coherence: ${(coherenceScore * 100).toFixed(0)}% (${trend})`,
      barX,
      barY - 5
    );
  };

  // Initial render
  useEffect(() => {
    if (!animate) {
      render();
    }
  }, [fieldState, nodePositions]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg shadow-lg"
      />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
        <div className="font-semibold mb-2">Field Map</div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.human }} />
          <span>Human</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.agent }} />
          <span>Agent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg">💎</div>
          <span>Emergent Insight</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Simplified Static Version (for server-side rendering)
// ═══════════════════════════════════════════════════════════════

export function StaticFieldMap({ fieldState, className = '' }: Omit<FieldMapProps, 'width' | 'height' | 'animate'>) {
  const { coherenceScore, trend, participants, emergentInsights } = fieldState;

  return (
    <div className={`bg-slate-900 rounded-lg p-6 text-white ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Field State</h3>

      {/* Coherence */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Coherence</span>
          <span className="font-mono">{(coherenceScore * 100).toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${coherenceScore * 100}%`,
              backgroundColor: TREND_COLORS[trend],
            }}
          />
        </div>
        <div className="text-xs text-slate-400 mt-1">Trend: {trend}</div>
      </div>

      {/* Participants */}
      <div className="mb-4">
        <div className="text-sm font-semibold mb-2">Participants ({participants.length})</div>
        <div className="flex flex-wrap gap-2">
          {participants.map(p => (
            <div
              key={p.id}
              className="px-3 py-1 rounded-full text-xs"
              style={{
                backgroundColor: p.type === 'human' ? COLORS.human + '40' : COLORS.agent + '40',
                borderColor: p.type === 'human' ? COLORS.human : COLORS.agent,
                borderWidth: 1,
              }}
            >
              {p.name}
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      {emergentInsights.length > 0 && (
        <div>
          <div className="text-sm font-semibold mb-2">Emergent Insights ({emergentInsights.length})</div>
          <div className="space-y-2">
            {emergentInsights.map((insight, i) => (
              <div key={insight.id} className="bg-slate-800 rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">💎</span>
                  <span className="text-xs text-slate-400">
                    {(insight.emergenceScore * 100).toFixed(0)}% emergence
                  </span>
                </div>
                <div className="text-sm line-clamp-2">{insight.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
