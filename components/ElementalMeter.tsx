// components/ElementalMeter.tsx
// 🌀 Elemental Coherence Meter — Visual feedback for conversation energy

"use client";

import React from "react";
import { motion } from "framer-motion";

interface ElementalBalance {
  fire: number;   // 0-1: User initiation energy
  water: number;  // 0-1: Assistant reflection energy
  air: number;    // 0-1: System transmission energy
  earth: number;  // 0-1: Grounding balance
  aether: number; // 0-1: Overall coherence
}

interface ElementalMeterProps {
  balance: ElementalBalance;
  coherence: number; // 0-1: Overall coherence score
}

export const ElementalMeter: React.FC<ElementalMeterProps> = ({
  balance,
  coherence,
}) => {
  const elements = [
    {
      name: "Fire",
      symbol: "🜃",
      value: balance.fire,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/20",
      description: "Initiation",
    },
    {
      name: "Water",
      symbol: "🜂",
      value: balance.water,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/20",
      description: "Reflection",
    },
    {
      name: "Air",
      symbol: "🜁",
      value: balance.air,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/20",
      description: "Transmission",
    },
    {
      name: "Earth",
      symbol: "🜄",
      value: balance.earth,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/20",
      description: "Grounding",
    },
    {
      name: "Aether",
      symbol: "🜀",
      value: balance.aether,
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-violet-500/20",
      description: "Integration",
    },
  ];

  // Compute overall field strength from coherence
  const fieldStrength = Math.round(coherence * 100);
  const pulseSpeed = 2 - coherence; // Higher coherence = faster pulse

  return (
    <div className="space-y-6">
      {/* Central Coherence Spiral */}
      <div className="relative flex items-center justify-center">
        <div className="relative w-32 h-32">
          {/* Outer pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: pulseSpeed,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Inner spiral */}
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="text-white text-center">
              <div className="text-3xl font-bold">{fieldStrength}%</div>
              <div className="text-xs opacity-80">Coherence</div>
            </div>
          </motion.div>

          {/* Orbiting particles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                top: "50%",
                left: "50%",
              }}
              animate={{
                x: [0, 60 * Math.cos((i * 120 * Math.PI) / 180)],
                y: [0, 60 * Math.sin((i * 120 * Math.PI) / 180)],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Elemental Balance Bars */}
      <div className="space-y-3">
        {elements.map((element) => (
          <div key={element.name} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">{element.symbol}</span>
                <span className="text-gray-300">{element.name}</span>
                <span className="text-xs text-gray-500">
                  {element.description}
                </span>
              </div>
              <span className="text-gray-400 font-mono text-xs">
                {Math.round(element.value * 100)}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${element.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${element.value * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Field Status */}
      <div className="pt-4 border-t border-gray-700">
        <div className="text-center text-sm text-gray-400">
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {coherence > 0.8 && "✨ Field Harmonized"}
            {coherence > 0.5 && coherence <= 0.8 && "🌀 Field Stabilizing"}
            {coherence > 0.3 && coherence <= 0.5 && "🌊 Field Forming"}
            {coherence <= 0.3 && "🌱 Field Emerging"}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
