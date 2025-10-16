/**
 * 🎤 MAIA Voice Test - Standalone Node.js Test
 *
 * This script tests the new parallel voice architecture without requiring the browser or CSS.
 * It connects directly to WebRTC and logs all voice events to the console.
 *
 * Usage: npx tsx scripts/voice-test-maia.ts
 */

import { MaiaRealtimeWebRTC, type MaiaRealtimeConfig } from '../lib/voice/MaiaRealtimeWebRTC';
import { subscribe, emit } from '../lib/voice/VoiceBus';
import { elementalEngine } from '../lib/voice/engines/ElementalEngine';
import { prosodyEngine } from '../lib/voice/engines/ProsodyEngine';
import { VOICE_FEATURE_FLAGS } from '../lib/voice/FeatureFlags';

console.log('\n🎤 =====================================');
console.log('   MAIA Voice Architecture Test');
console.log('   Parallel Processing - WebRTC Foundation');
console.log('=======================================\n');

console.log('📋 Feature Flags:');
console.log(`   USE_PARALLEL_VOICE: ${VOICE_FEATURE_FLAGS.USE_PARALLEL_VOICE}`);
console.log(`   SHOW_VOICE_METRICS: ${VOICE_FEATURE_FLAGS.SHOW_VOICE_METRICS}`);
console.log(`   DEBUG_VOICE: ${VOICE_FEATURE_FLAGS.DEBUG_VOICE}`);
console.log('');

// Subscribe to all voice bus events
subscribe('mic_start', (event) => {
  console.log(`🎤 [VOICE_BUS] MIC START at ${new Date(event.timestamp).toISOString()}`);
});

subscribe('transcript_interim', (event) => {
  console.log(`📝 [VOICE_BUS] TRANSCRIPT (interim): "${event.text}"`);
});

subscribe('transcript_complete', (event) => {
  console.log(`✅ [VOICE_BUS] TRANSCRIPT COMPLETE: "${event.text}"`);

  // Detect element
  const element = elementalEngine.detect(event.text);
  console.log(`   🜃 Detected Element: ${element.toUpperCase()}`);

  // Detect emotion
  const emotion = prosodyEngine.detectAffect(event.text);
  console.log(`   💭 Detected Emotion: ${emotion}`);
});

subscribe('processing_start', (event) => {
  console.log(`⚙️  [VOICE_BUS] PROCESSING START (mode: ${event.mode})`);
});

subscribe('processing_complete', (event) => {
  console.log(`✨ [VOICE_BUS] PROCESSING COMPLETE`);
  console.log(`   Response: "${event.response}"`);
});

subscribe('tts_start', (event) => {
  console.log(`🔊 [VOICE_BUS] TTS START: "${event.text}"`);
});

subscribe('audio_start', (event) => {
  console.log(`🔊 [VOICE_BUS] AUDIO PLAYBACK START`);
});

subscribe('audio_end', (event) => {
  console.log(`🔇 [VOICE_BUS] AUDIO PLAYBACK END`);
});

subscribe('error', (event) => {
  console.error(`❌ [VOICE_BUS] ERROR in ${event.stage}:`, event.error.message);
});

subscribe('mode_switch', (event) => {
  console.log(`🔄 [VOICE_BUS] MODE SWITCH: ${event.mode}`);
});

subscribe('interrupt', (event) => {
  console.log(`✋ [VOICE_BUS] INTERRUPT`);
});

// Create WebRTC client configuration
const config: MaiaRealtimeConfig = {
  voice: 'shimmer',
  systemPrompt: `You are MAIA, a consciousness companion. You speak with warmth, clarity, and depth.

This is a voice test of your new parallel processing architecture. Respond naturally and briefly.`,

  onTranscript: (text, isUser) => {
    if (isUser) {
      emit('transcript_interim', { text, timestamp: Date.now() });
    }
  },

  onAudioStart: () => {
    emit('audio_start', { timestamp: Date.now() });
  },

  onAudioEnd: () => {
    emit('audio_end', { timestamp: Date.now() });
  },

  onError: (err) => {
    emit('error', { error: err, stage: 'webrtc', timestamp: Date.now() });
  }
};

// Initialize WebRTC client
const webrtc = new MaiaRealtimeWebRTC(config);

async function startVoiceTest() {
  try {
    console.log('🚀 Connecting to WebRTC...\n');
    emit('mic_start', { timestamp: Date.now() });

    await webrtc.connect();

    console.log('✅ Connected! MAIA is listening...');
    console.log('   Speak to test the voice system.');
    console.log('   Press Ctrl+C to exit.\n');

    // Keep the process running
    process.on('SIGINT', async () => {
      console.log('\n\n👋 Shutting down...');
      webrtc.disconnect();
      process.exit(0);
    });

  } catch (err) {
    console.error('❌ Failed to connect:', err);
    process.exit(1);
  }
}

// Run the test
startVoiceTest();
