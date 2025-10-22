"use client";

import React, { useState } from 'react';
import { DailyCheckIn } from '@/components/DailyCheckIn';

export default function DailyCheckInDemo() {
  const [scenario, setScenario] = useState<'firstVisit' | 'returning' | 'breakthrough' | 'longAbsence'>('firstVisit');
  const [demoUserName, setDemoUserName] = useState('Explorer');

  const scenarios = {
    firstVisit: {
      userName: demoUserName,
      userId: 'demo-user-1',
      lastVisit: undefined,
      lastConversationTheme: undefined,
      hasHadBreakthrough: false
    },
    returning: {
      userName: demoUserName,
      userId: 'demo-user-1',
      lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      lastConversationTheme: 'self-worth patterns',
      hasHadBreakthrough: false
    },
    breakthrough: {
      userName: demoUserName,
      userId: 'demo-user-1',
      lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      lastConversationTheme: 'transformation',
      hasHadBreakthrough: true
    },
    longAbsence: {
      userName: demoUserName,
      userId: 'demo-user-1',
      lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      lastConversationTheme: 'boundaries',
      hasHadBreakthrough: false
    }
  };

  const currentScenario = scenarios[scenario];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Demo Controls */}
      <div className="fixed top-4 right-4 z-50 bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-xl p-4 max-w-xs">
        <div className="text-xs font-semibold text-white/60 mb-3">Demo Scenarios</div>
        <div className="space-y-2">
          <button
            onClick={() => setScenario('firstVisit')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              scenario === 'firstVisit'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            First Visit
          </button>
          <button
            onClick={() => setScenario('returning')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              scenario === 'returning'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Returning (1 day)
          </button>
          <button
            onClick={() => setScenario('breakthrough')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              scenario === 'breakthrough'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            After Breakthrough
          </button>
          <button
            onClick={() => setScenario('longAbsence')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              scenario === 'longAbsence'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Long Absence (14 days)
          </button>
        </div>

        {/* Current Time Display */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-xs text-white/40">
            Current time: {new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="pt-12 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-light text-white/90 mb-2">
            Daily Check-In Demo
          </h1>
          <p className="text-sm text-white/50">
            Soullab greetings system - Time-aware, context-aware, lab partner energy
          </p>
        </div>
      </div>

      {/* Daily Check-In Component */}
      <div className="pb-24">
        <DailyCheckIn
          {...currentScenario}
          onStartConversation={() => {
            console.log('Starting conversation...');
            alert('This would start a Maia conversation session');
          }}
        />
      </div>

      {/* Footer Info */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-8 pb-4">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="text-xs text-white/40 space-y-1">
              <div><span className="text-white/60">Active Scenario:</span> {scenarioDescriptions[scenario]}</div>
              <div><span className="text-white/60">Greeting Pool:</span> Randomized from time-aware options</div>
              <div><span className="text-white/60">Voice:</span> Lab partner (collaborative, experimental, modern sacred)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const scenarioDescriptions: Record<string, string> = {
  firstVisit: 'New user - welcoming to the lab, explaining the experiment',
  returning: 'Regular user returning after 1 day - continuing the work',
  breakthrough: 'User had recent breakthrough - checking integration',
  longAbsence: 'User returning after 14 days - acknowledging gap, curiosity about shifts'
};