/**
 * Cooldown Gate Test - Voice Layer Echo Prevention
 * Simulates TTS playback + cooldown window to prevent MAIA hearing herself
 *
 * Run: npx ts-node test/cooldown-gate-test.ts
 */

type TranscriptEvent = {
  timestamp: number;
  text: string;
  source: 'user' | 'tts-playback';
};

class CooldownGate {
  private isSpeaking = false;
  private cooldownUntil = 0;
  private suppressedCount = 0;

  startTTS(durationMs: number, cooldownMs: number = 300) {
    this.isSpeaking = true;
    this.cooldownUntil = Date.now() + durationMs + cooldownMs;
    console.log(`   🔊 TTS started (${durationMs}ms playback + ${cooldownMs}ms cooldown)`);
  }

  stopTTS() {
    this.isSpeaking = false;
    console.log(`   🔇 TTS ended, cooldown active until ${this.cooldownUntil - Date.now()}ms`);
  }

  shouldAcceptInput(timestamp: number): boolean {
    const now = timestamp;

    if (this.isSpeaking) {
      this.suppressedCount++;
      console.log(`   ⛔ [Echo Suppressed] Input during TTS playback`);
      return false;
    }

    if (now < this.cooldownUntil) {
      this.suppressedCount++;
      console.log(`   ⛔ [Echo Suppressed] Input during cooldown (${this.cooldownUntil - now}ms remaining)`);
      return false;
    }

    return true;
  }

  getSuppressedCount() {
    return this.suppressedCount;
  }
}

class PauseBuffer {
  private buffer = '';
  private lastInputTime = 0;
  private boundaryThresholdMs = 800;

  addInput(text: string, timestamp: number): { shouldSend: boolean; content: string } {
    this.buffer += text;
    this.lastInputTime = timestamp;

    // Check for sentence boundary
    const hasPunctuation = /[.?!]$/.test(text.trim());
    const pauseMs = timestamp - this.lastInputTime;

    if (hasPunctuation || pauseMs >= this.boundaryThresholdMs) {
      const content = this.buffer.trim();
      this.buffer = '';
      return { shouldSend: true, content };
    }

    console.log(`   ⏸️  Mid-thought, buffering... (pause: ${pauseMs}ms)`);
    return { shouldSend: false, content: '' };
  }

  clear() {
    this.buffer = '';
  }
}

// Test scenarios
const scenarios = [
  {
    name: 'Scenario 1: Normal conversation (no echo)',
    events: [
      { time: 0, text: 'Hello MAIA', source: 'user' as const },
      { time: 100, action: 'tts-start', duration: 2000 }, // MAIA speaks for 2s
      { time: 2500, text: 'Hello MAIA', source: 'tts-playback' as const }, // Echo during cooldown
      { time: 3000, text: 'How are you?', source: 'user' as const } // Real user after cooldown
    ]
  },
  {
    name: 'Scenario 2: User speaks during MAIA response',
    events: [
      { time: 0, text: 'Tell me something', source: 'user' as const },
      { time: 100, action: 'tts-start', duration: 3000 },
      { time: 1000, text: 'Wait, hold on', source: 'user' as const }, // User interrupts
      { time: 3500, text: 'Never mind', source: 'user' as const } // After cooldown
    ]
  },
  {
    name: 'Scenario 3: Multiple rapid echoes',
    events: [
      { time: 0, text: 'Testing', source: 'user' as const },
      { time: 100, action: 'tts-start', duration: 1500 },
      { time: 1600, text: 'Testing', source: 'tts-playback' as const },
      { time: 1650, text: 'Testing', source: 'tts-playback' as const },
      { time: 1700, text: 'Testing', source: 'tts-playback' as const },
      { time: 2000, text: 'Real message', source: 'user' as const }
    ]
  }
];

async function runScenario(scenario: any) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📋 ${scenario.name}`);
  console.log('─'.repeat(60));

  const gate = new CooldownGate();
  const buffer = new PauseBuffer();
  let startTime = Date.now();
  let acceptedCount = 0;

  for (const event of scenario.events) {
    const eventTime = startTime + event.time;

    // Wait for event time
    await new Promise(resolve => setTimeout(resolve, event.time));

    if (event.action === 'tts-start') {
      gate.startTTS(event.duration);
      setTimeout(() => gate.stopTTS(), event.duration);
    } else {
      console.log(`\n   💬 Input: "${event.text}" (source: ${event.source})`);

      if (gate.shouldAcceptInput(eventTime)) {
        console.log(`   ✅ Accepted`);
        acceptedCount++;

        // In real implementation, this would go to Claude
        const { shouldSend, content } = buffer.addInput(event.text, eventTime);
        if (shouldSend) {
          console.log(`   📤 Sending to Claude: "${content}"`);
        }
      }
    }
  }

  console.log(`\n   📊 Results:`);
  console.log(`   • Accepted: ${acceptedCount}`);
  console.log(`   • Suppressed: ${gate.getSuppressedCount()}`);
  console.log(`   • Success: ${gate.getSuppressedCount() > 0 ? '✅' : '⚠️'}`);
}

async function runAllTests() {
  console.log('🧪 Cooldown Gate Test Suite');
  console.log('Testing voice layer echo prevention\n');

  for (const scenario of scenarios) {
    await runScenario(scenario);
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log('\n✅ Cooldown gate tests complete!\n');
  console.log('Architecture:');
  console.log('┌──────────────────────────────────┐');
  console.log('│ Voice Layer (this test)          │');
  console.log('│ • Cooldown gate blocks echoes    │');
  console.log('│ • Pause buffer prevents cuts     │');
  console.log('└────────────┬─────────────────────┘');
  console.log('             │');
  console.log('             ▼');
  console.log('┌──────────────────────────────────┐');
  console.log('│ Message Layer (echo-prevention)  │');
  console.log('│ • Source field filtering         │');
  console.log('│ • Few-shot Claude examples       │');
  console.log('└────────────┬─────────────────────┘');
  console.log('             │');
  console.log('             ▼');
  console.log('       [Claude API]');
  console.log('');
}

runAllTests().catch(console.error);