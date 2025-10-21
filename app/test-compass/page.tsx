'use client';

import { SacredSpaceLayout } from '@/components/navigation/SacredSpaceLayout';
import { useState } from 'react';

/**
 * Test page for Sacred Compass navigation
 *
 * Purpose: Feel test the foundation before refactoring
 * Question: Does it breathe or does it announce itself?
 */
export default function TestCompassPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to the sacred space.\n\nNotice the compass in the corner—it's quiet until you need it.\n\nTry the arrow keys on your keyboard:\n→ Right for analytical framework\n← Left for imaginal realm\n↓ Down for transcendent practices\n↑ Up for depths and shadow\n\nDoes the navigation feel like breath, or like mechanism?"
    }
  ]);

  return (
    <SacredSpaceLayout userId="test-user">
      {/* MAIA Conversation - Sacred Center */}
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`
                p-6 rounded-lg
                ${msg.role === 'assistant' ? 'bg-white/5 border border-white/10' : 'bg-blue-500/10 border border-blue-500/20'}
              `}
            >
              <div className="text-xs text-white/40 mb-2 font-serif">
                {msg.role === 'assistant' ? 'MAIA' : 'You'}
              </div>
              <div className="text-white/80 whitespace-pre-line font-serif leading-relaxed">
                {msg.content}
              </div>
            </div>
          ))}

          {/* Simple input */}
          <div className="pt-4">
            <input
              type="text"
              placeholder="Speak from presence..."
              className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  setMessages([
                    ...messages,
                    { role: 'user', content: e.currentTarget.value },
                    {
                      role: 'assistant',
                      content: `I hear you.\n\nNow try navigating the compass—let the directions guide you to different aspects of your experience.\n\nThe framework (→), the poetic (←), the transcendent (↓), the depths (↑).\n\nNotice: does it feel invasive or invisible?`
                    }
                  ]);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>

          <div className="text-center text-white/30 text-xs pt-8">
            <p>This is a feel test for the sacred space architecture.</p>
            <p className="mt-2">The center should feel uncluttered. The compass should feel optional.</p>
            <p className="mt-2">Touch each direction slowly. Does it invite or announce?</p>
          </div>
        </div>
      </div>
    </SacredSpaceLayout>
  );
}
