'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Element = 'fire' | 'water' | 'earth' | 'air' | 'aether';

interface Invocation {
  invocation: string;
  essence: string;
  color: string;
  frequency: number;
}

const elementSymbols: Record<Element, string> = {
  fire: '🜂',
  water: '🜄',
  earth: '🜃',
  air: '🜁',
  aether: '🜀'
};

export function InvocationCard() {
  const [currentElement, setCurrentElement] = useState<Element>('aether');
  const [invocation, setInvocation] = useState<Invocation | null>(null);
  const [invocations, setInvocations] = useState<Record<Element, Invocation>>({} as Record<Element, Invocation>);

  useEffect(() => {
    // Load invocations
    fetch('/data/invocations.json')
      .then(res => res.json())
      .then(data => {
        setInvocations(data);
        // Determine element by day of week
        const dayElement = getDailyElement();
        setCurrentElement(dayElement);
        setInvocation(data[dayElement]);
      });
  }, []);

  const getDailyElement = (): Element => {
    const elements: Element[] = ['fire', 'water', 'earth', 'air', 'aether'];
    const dayOfWeek = new Date().getDay();
    // Sunday = Aether, Monday = Water, Tuesday = Fire, Wednesday = Air, Thursday = Earth, Friday = Water, Saturday = Fire
    const mapping: Element[] = ['aether', 'water', 'fire', 'air', 'earth', 'water', 'fire'];
    return mapping[dayOfWeek];
  };

  if (!invocation) {
    return (
      <div className="p-6 bg-gradient-to-br from-indigo-950 to-purple-950 rounded-lg border border-indigo-800/30">
        <div className="animate-pulse">Loading invocation...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-6 bg-gradient-to-br from-indigo-950 to-purple-950 rounded-lg border border-indigo-800/30 relative overflow-hidden"
      style={{
        boxShadow: `0 0 30px ${invocation.color}20`
      }}
    >
      {/* Breathing background pulse */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{ backgroundColor: invocation.color }}
        animate={{
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10">
        {/* Element symbol */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl" style={{ color: invocation.color }}>
            {elementSymbols[currentElement]}
          </span>
          <div>
            <h3 className="text-lg font-cinzel text-amber-300 capitalize">
              {currentElement}
            </h3>
            <p className="text-xs text-indigo-300">
              {invocation.frequency} Hz
            </p>
          </div>
        </div>

        {/* Invocation text */}
        <blockquote className="text-amber-100 italic text-lg mb-3 font-light leading-relaxed">
          "{invocation.invocation}"
        </blockquote>

        {/* Essence */}
        <p className="text-indigo-300 text-sm">
          {invocation.essence}
        </p>

        {/* Element selector */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-indigo-800/30">
          {(Object.keys(elementSymbols) as Element[]).map((element) => (
            <button
              key={element}
              onClick={() => {
                setCurrentElement(element);
                setInvocation(invocations[element]);
              }}
              className={`
                text-2xl transition-all duration-300 hover:scale-125
                ${element === currentElement ? 'opacity-100 scale-110' : 'opacity-30'}
              `}
              style={{
                color: element === currentElement ? invocations[element]?.color : '#94a3b8'
              }}
              title={element}
            >
              {elementSymbols[element]}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
