'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SPIRAL_FACETS,
  LIFE_SPIRAL_TEMPLATES,
  SpiralJourneyTracker,
  type LifeSpiral,
  type SpiralIntersection
} from '@/lib/spiral/SpiralJourneyTracker';

interface SpiralJourneyVisualizerProps {
  userId: string;
  currentMessage?: string;
  conversationHistory?: string[];
  onInsight?: (insights: string[]) => void;
}

export function SpiralJourneyVisualizer({
  userId,
  currentMessage,
  conversationHistory = [],
  onInsight
}: SpiralJourneyVisualizerProps) {
  const [tracker] = useState(() => new SpiralJourneyTracker(userId));
  const [activeSpirals, setActiveSpirals] = useState<LifeSpiral[]>([]);
  const [hoveredFacet, setHoveredFacet] = useState<string | null>(null);
  const [hoveredSpiral, setHoveredSpiral] = useState<string | null>(null);
  const [visualData, setVisualData] = useState<ReturnType<typeof tracker.getVisualizationData>>();
  const [insights, setInsights] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Detect and update spiral positions based on conversation
  useEffect(() => {
    if (currentMessage && currentMessage.length > 5) {
      const detections = tracker.detectSpiralContext(currentMessage, conversationHistory);

      detections.forEach(({ spiral, facet, confidence }) => {
        if (confidence > 0.3) {
          tracker.updateSpiralPosition(spiral, facet, confidence * 0.2);
        }
      });

      const newVisualData = tracker.getVisualizationData();
      setVisualData(newVisualData);

      const newInsights = tracker.getInsights();
      setInsights(newInsights);
      onInsight?.(newInsights);
    }
  }, [currentMessage, conversationHistory]);

  // Draw spiral visualization
  useEffect(() => {
    if (!canvasRef.current || !visualData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Center point
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw facet labels in circle
    SPIRAL_FACETS.forEach((facet, index) => {
      const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
      const radius = 140;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Draw facet point
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = facet.color + '40';
      if (hoveredFacet === facet.id) {
        ctx.fillStyle = facet.color + '80';
      }
      ctx.fill();

      // Draw facet number
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(facet.stage), x, y);
    });

    // Draw spirals
    visualData.spirals.forEach(spiral => {
      ctx.beginPath();
      ctx.strokeStyle = hoveredSpiral === spiral.id ? '#FFD700' : '#d4b89660';
      ctx.lineWidth = hoveredSpiral === spiral.id ? 2 : 1;

      // Draw spiral path
      for (let i = 0; i <= 360; i += 10) {
        const angle = (i / 360) * Math.PI * 2 - Math.PI / 2;
        const progress = i / 360;
        const radius = 80 + progress * 60;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw current position
      const posX = centerX + spiral.currentPosition.x;
      const posY = centerY + spiral.currentPosition.y;

      ctx.beginPath();
      ctx.arc(posX, posY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700';
      ctx.fill();
    });

    // Draw intersections
    visualData.intersections.forEach(intersection => {
      const facet = SPIRAL_FACETS.find(f => f.id === intersection.facet);
      if (!facet) return;

      const angle = ((facet.stage - 1) / 12) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * 100;
      const y = centerY + Math.sin(angle) * 100;

      ctx.beginPath();
      ctx.arc(x, y, 12 * intersection.strength, 0, Math.PI * 2);

      switch (intersection.type) {
        case 'harmonious':
          ctx.fillStyle = '#00FF0020';
          break;
        case 'tension':
          ctx.fillStyle = '#FF000020';
          break;
        case 'transformation':
          ctx.fillStyle = '#FFD70020';
          break;
      }
      ctx.fill();
    });
  }, [visualData, hoveredFacet, hoveredSpiral]);

  const getFacetProgress = (facetId: string): number => {
    const spiralsInFacet = visualData?.spirals.filter(s => {
      const currentFacet = SPIRAL_FACETS.find(f => f.id === facetId);
      return s.currentPosition === currentFacet;
    }).length || 0;

    return spiralsInFacet * 25; // Each spiral adds 25% to facet progress
  };

  return (
    <div className="w-full p-6 bg-black/40 backdrop-blur-sm rounded-2xl
                    border border-amber-500/20">
      <div className="mb-6">
        <h3 className="text-lg font-light text-amber-50 mb-4">Spiral Journey Tracking</h3>

        {/* Canvas Visualization */}
        <div className="relative mb-6">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full max-w-md mx-auto"
          />

          {/* Facet hover tooltip */}
          {hoveredFacet && (
            <div className="absolute top-4 right-4 p-3 bg-black/80 rounded-lg
                          border border-amber-500/30 max-w-xs">
              <div className="text-sm text-amber-50 mb-1">
                {SPIRAL_FACETS.find(f => f.id === hoveredFacet)?.name}
              </div>
              <div className="text-xs text-amber-200/70">
                {SPIRAL_FACETS.find(f => f.id === hoveredFacet)?.description}
              </div>
            </div>
          )}
        </div>

        {/* Active Spirals List */}
        <div className="mb-4 p-3 bg-black/30 rounded-lg">
          <div className="text-xs text-amber-200/60 mb-2">Active Life Spirals:</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(LIFE_SPIRAL_TEMPLATES).slice(0, 8).map(template => {
              const spiral = visualData?.spirals.find(s => s.id === template.id);
              const isActive = !!spiral;

              return (
                <motion.div
                  key={template.id}
                  onHoverStart={() => setHoveredSpiral(template.id)}
                  onHoverEnd={() => setHoveredSpiral(null)}
                  className={`
                    p-2 rounded-lg cursor-pointer transition-all text-xs
                    ${isActive
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-50'
                      : 'bg-black/20 border border-amber-500/10 text-amber-200/40'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <span>{template.name}</span>
                    {spiral && (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse" />
                        <span className="text-xs">
                          {SPIRAL_FACETS.find(f => f.id === spiral.currentPosition)?.name}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 12 Facets Progress */}
        <div className="mb-4">
          <div className="text-xs text-amber-200/60 mb-2">Facet Progression:</div>
          <div className="grid grid-cols-4 gap-2">
            {SPIRAL_FACETS.map(facet => (
              <motion.div
                key={facet.id}
                onHoverStart={() => setHoveredFacet(facet.id)}
                onHoverEnd={() => setHoveredFacet(null)}
                className="relative p-2 rounded-lg bg-black/30 border border-amber-500/20
                         hover:bg-black/40 hover:border-amber-500/30 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-xs text-amber-50 mb-1">
                  {facet.stage}. {facet.name.substring(0, 8)}
                </div>
                <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: facet.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${getFacetProgress(facet.id)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
            <div className="text-xs text-amber-200/60 mb-2">Journey Insights:</div>
            <div className="space-y-1">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-sm text-amber-50 flex items-start gap-2"
                >
                  <span className="text-amber-400">•</span>
                  <span>{insight}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Intersection Indicators */}
        {visualData && visualData.intersections.length > 0 && (
          <div className="mt-4 p-3 bg-black/30 rounded-lg">
            <div className="text-xs text-amber-200/60 mb-2">Spiral Intersections:</div>
            <div className="space-y-2">
              {visualData.intersections.map((intersection, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        intersection.type === 'harmonious'
                          ? 'bg-green-400'
                          : intersection.type === 'tension'
                          ? 'bg-red-400'
                          : 'bg-yellow-400'
                      }`}
                    />
                    <span className="text-amber-200/70">
                      {intersection.spiral1} × {intersection.spiral2}
                    </span>
                  </div>
                  <span className="text-amber-400">
                    {SPIRAL_FACETS.find(f => f.id === intersection.facet)?.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}