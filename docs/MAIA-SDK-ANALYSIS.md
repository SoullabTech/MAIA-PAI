# MAIA Realtime SDK - Analysis & Implementation Guide

## Executive Summary

You're building a **protocol-agnostic realtime voice SDK** that gives you:
- ✅ Full control over provider routing (OpenAI/Anthropic/Local)
- ✅ Cost optimization (route to cheapest available)
- ✅ Automatic failover when providers fail
- ✅ Real-time streaming audio with buffering
- ✅ Per-request cost tracking

This is **excellent architecture** - you own the protocol, not OpenAI.

---

## Architecture Review

### What You've Built (Strong Foundation)

```
┌─────────────────────────────────────────────────────────┐
│                  MAIARealtimeSDK                        │
│  (Your Protocol - Provider Agnostic)                    │
└──────────────┬──────────────────────────┬───────────────┘
               │                          │
        ┌──────▼──────┐          ┌────────▼────────┐
        │  Provider   │          │   Failover      │
        │  Selection  │          │   Chain         │
        │  (Cost-     │          │   (Auto         │
        │   based)    │          │    Recovery)    │
        └──────┬──────┘          └────────┬────────┘
               │                          │
    ┌──────────┼──────────────────────────┼──────────┐
    │          │                          │          │
┌───▼───┐  ┌──▼─────┐  ┌────────▼─────┐  ┌──▼─────┐
│ Local │  │ OpenAI │  │  Anthropic   │  │ Local  │
│Whisper│  │Realtime│  │   (Future)   │  │  XTTS  │
│ (STT) │  │  API   │  │              │  │ (TTS)  │
└───────┘  └────────┘  └──────────────┘  └────────┘
    ↓          ↓              ↓               ↓
  FREE       $0.006        $0.003           FREE
```

### Cost Optimization Matrix

| Component | Provider | Cost | Your Routing |
|-----------|----------|------|--------------|
| STT | Local Whisper | **FREE** | ✅ Priority 100 |
| STT | OpenAI | $0.006/min | Fallback |
| LLM | Anthropic | $0.003/1K tokens | ✅ Priority 90 |
| LLM | OpenAI | $0.006/1K tokens | Fallback |
| TTS | Local XTTS | **FREE** | ✅ Priority 100 |
| TTS | OpenAI | $0.015/1K chars | Fallback |

**Your potential savings: ~90% if local models work**

---

## Critical Issues to Fix

### 1. WebSocket Protocol Mismatch

**Problem:** OpenAI Realtime API doesn't use WebSocket event format you're expecting.

**Your Code:**
```typescript
this.ws.on('message', (data) => {
  const message = JSON.parse(data.toString());

  switch (message.type) {
    case 'audio.output':  // ❌ This format doesn't exist
    case 'transcript.delta':  // ❌ Wrong event name
  }
});
```

**Actual OpenAI Format:**
```typescript
// OpenAI Realtime API events
{
  type: 'response.audio.delta',  // Not 'audio.output'
  delta: 'base64audio...'
}

{
  type: 'conversation.item.input_audio_transcription.completed',
  transcript: 'user said...'
}

{
  type: 'response.audio_transcript.delta',
  delta: 'AI said...'
}
```

**Fix:**
```typescript
private handleMessage(data: WebSocket.Data): void {
  const message = JSON.parse(data.toString());

  switch (message.type) {
    // Audio output from AI
    case 'response.audio.delta':
      this.emit('audio', this.decodeAudio(message.delta));
      this.trackCost('tts', message.delta.length);
      break;

    // User transcription (from mic)
    case 'conversation.item.input_audio_transcription.completed':
      this.activeSession?.transcript.push(message.transcript);
      this.emit('transcript', { text: message.transcript, isUser: true });
      break;

    // AI text response
    case 'response.audio_transcript.delta':
      this.emit('transcript', { text: message.delta, isUser: false });
      break;

    case 'response.done':
      this.emit('response.complete', {
        transcript: this.activeSession?.transcript.join(''),
        cost: this.costAccumulator
      });
      break;

    case 'error':
      this.handleError(new Error(message.error.message));
      break;
  }
}
```

### 2. Missing Session Creation Step

**Problem:** You're connecting to WebSocket directly, but OpenAI requires ephemeral token exchange first.

**Required Flow:**
```
1. Browser → Your Backend: Request ephemeral token
2. Your Backend → OpenAI: Create session with API key
3. OpenAI → Your Backend: Return client_secret
4. Your Backend → Browser: Return ephemeral token
5. Browser → OpenAI: Connect WebSocket with token
```

**Add this method:**
```typescript
private async getEphemeralToken(): Promise<string> {
  // Call YOUR backend endpoint that exchanges API key for ephemeral token
  const response = await fetch('/api/voice/webrtc-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: this.config.model,
      voice: this.config.voice,
      instructions: this.config.instructions
    })
  });

  const data = await response.json();
  return data.client_secret.value; // Ephemeral token
}

async connect(instructions: string): Promise<void> {
  const provider = this.selectOptimalProvider('llm');

  // Get ephemeral token first
  const token = await this.getEphemeralToken();

  // Connect with token in URL, not headers
  const wsUrl = `${provider.endpoint}?model=${this.config.model}`;
  this.ws = new WebSocket(wsUrl, {
    headers: {
      'Authorization': `Bearer ${token}`,  // Use ephemeral token
      'OpenAI-Beta': 'realtime=v1'
    }
  });

  // ... rest of connection logic
}
```

### 3. Audio Format Conversion Issues

**Problem:** OpenAI expects **base64-encoded PCM16 at 24kHz**, but your encoding may not match.

**Current Code:**
```typescript
private encodeAudio(samples: Float32Array): string {
  const pcm16 = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    pcm16[i] = Math.max(-32768, Math.min(32767, samples[i] * 32768));
  }
  return Buffer.from(pcm16.buffer).toString('base64');
}
```

**Issues:**
- ❌ Not handling sample rate conversion (mic might be 48kHz, OpenAI wants 24kHz)
- ❌ Not handling mono/stereo conversion
- ❌ Buffer module doesn't exist in browser (Node.js only)

**Browser-Safe Fix:**
```typescript
private encodeAudio(samples: Float32Array): string {
  // Resample to 24kHz if needed (assuming input is 48kHz)
  const resampled = this.resample(samples, 48000, 24000);

  // Convert to PCM16
  const pcm16 = new Int16Array(resampled.length);
  for (let i = 0; i < resampled.length; i++) {
    const s = Math.max(-1, Math.min(1, resampled[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }

  // Convert to base64 (browser-safe)
  const uint8 = new Uint8Array(pcm16.buffer);
  return btoa(String.fromCharCode.apply(null, Array.from(uint8)));
}

private resample(samples: Float32Array, fromRate: number, toRate: number): Float32Array {
  if (fromRate === toRate) return samples;

  const ratio = fromRate / toRate;
  const newLength = Math.round(samples.length / ratio);
  const result = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const srcIndex = i * ratio;
    const srcIndexFloor = Math.floor(srcIndex);
    const srcIndexCeil = Math.min(srcIndexFloor + 1, samples.length - 1);
    const t = srcIndex - srcIndexFloor;

    // Linear interpolation
    result[i] = samples[srcIndexFloor] * (1 - t) + samples[srcIndexCeil] * t;
  }

  return result;
}
```

### 4. Missing Turn Detection Configuration

**Problem:** OpenAI won't know when to start/stop listening without VAD config.

**Add to sendConfig():**
```typescript
private sendConfig(instructions: string): void {
  this.ws?.send(JSON.stringify({
    type: 'session.update',
    session: {
      modalities: ['text', 'audio'],
      instructions,
      voice: 'shimmer', // or 'alloy', 'echo'
      input_audio_format: 'pcm16',
      output_audio_format: 'pcm16',
      input_audio_transcription: {
        model: 'whisper-1'
      },
      turn_detection: {
        type: 'server_vad',  // Server-side Voice Activity Detection
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 500
      },
      tools: [],
      tool_choice: 'auto',
      temperature: 0.8,
      max_response_output_tokens: 4096
    }
  }));
}
```

---

## Implementation Recommendations

### 1. Hybrid Architecture (Best of Both Worlds)

**Option A: All-OpenAI (Simplest)**
- Use OpenAI Realtime API for everything
- Cost: $0.06/minute + $3/MTok + $15/MTok
- Latency: ~500ms
- **Pro:** Single connection, no orchestration
- **Con:** Expensive, vendor lock-in

**Option B: Hybrid (Your SDK Approach)** ⭐ **RECOMMENDED**
```
User Audio → Local Whisper (FREE STT)
     ↓
Text → Anthropic Claude ($0.003/1K tok, CHEAPER)
     ↓
Text Response → Local XTTS (FREE TTS)
     ↓
Audio → User
```

**Benefits:**
- 90% cost savings
- Own your data
- No vendor lock-in
- Local processing = low latency

**Challenges:**
- Need to run local Whisper + XTTS servers
- More complex orchestration
- Need fallback to OpenAI when local fails

### 2. Recommended Tech Stack

**Local STT (Whisper):**
```bash
# Use faster-whisper (5x faster than openai-whisper)
pip install faster-whisper

# Or use whisper.cpp for even faster inference
git clone https://github.com/ggerganov/whisper.cpp
```

**Local TTS (XTTS v2):**
```bash
# Best open-source TTS (matches OpenAI quality)
pip install TTS
tts-server --model_name tts_models/multilingual/multi-dataset/xtts_v2
```

**WebSocket Servers:**
```typescript
// whisper-server.ts
import Fastify from 'fastify';
import { FastifyWSOptions } from '@fastify/websocket';

const fastify = Fastify();
await fastify.register(require('@fastify/websocket'));

fastify.get('/whisper', { websocket: true }, (connection, req) => {
  connection.socket.on('message', async (audioChunk) => {
    const transcript = await runWhisper(audioChunk);
    connection.socket.send(JSON.stringify({
      type: 'transcript',
      text: transcript
    }));
  });
});

await fastify.listen({ port: 8001 });
```

### 3. Cost Comparison Calculator

Add this to your SDK:

```typescript
export class CostCalculator {
  private readonly rates = {
    openai: {
      stt: 0.006 / 60,        // $0.006/min
      llm: 0.006 / 1000,      // $0.006/1K input tokens
      tts: 0.015 / 1000       // $0.015/1K chars
    },
    anthropic: {
      llm: 0.003 / 1000       // $0.003/1K input tokens
    },
    local: {
      stt: 0,
      llm: 0,  // If running local LLM
      tts: 0
    }
  };

  calculateSessionCost(duration: number, tokens: number, chars: number, provider: 'openai' | 'hybrid'): number {
    if (provider === 'openai') {
      return (
        (duration * this.rates.openai.stt) +
        (tokens * this.rates.openai.llm) +
        (chars * this.rates.openai.tts)
      );
    } else {
      // Hybrid: local STT/TTS, Anthropic LLM
      return tokens * this.rates.anthropic.llm;
    }
  }

  // Example: 10-minute conversation, 5K tokens, 2K TTS chars
  // OpenAI: $0.06 + $0.03 + $0.03 = $0.12
  // Hybrid: $0.015 (87.5% savings!)
}
```

---

## Integration with Existing MAIA-FRESH App

### Current State (from your logs):

```
❌ WebRTC not connected
❌ Falling back to browser TTS (creates echo)
❌ Input audio transcription failing
❌ States stuck in processing loop
```

### How to Integrate Your SDK:

**Step 1: Replace MaiaRealtimeWebRTC**

```typescript
// components/OracleConversation.tsx

import { MAIARealtimeSDK } from '@/lib/voice/MAIARealtimeSDK';

const sdk = new MAIARealtimeSDK({
  providers: [
    {
      name: 'local-whisper',
      endpoint: 'ws://localhost:8001/whisper',
      priority: 100,
      capabilities: ['stt']
    },
    {
      name: 'anthropic',
      endpoint: process.env.NEXT_PUBLIC_ANTHROPIC_REALTIME_ENDPOINT!, // Future
      apiKey: process.env.ANTHROPIC_API_KEY,
      priority: 90,
      capabilities: ['llm']
    },
    {
      name: 'local-xtts',
      endpoint: 'ws://localhost:8000/tts',
      priority: 100,
      capabilities: ['tts']
    },
    {
      name: 'openai',
      endpoint: 'wss://api.openai.com/v1/realtime',
      apiKey: process.env.OPENAI_API_KEY,
      priority: 50,
      capabilities: ['stt', 'llm', 'tts']
    }
  ],
  fallbackChain: ['local-whisper', 'openai'],
  costOptimization: true
});

// Use it
sdk.on('transcript', ({ text, isUser }) => {
  if (isUser) {
    handleVoiceTranscript(text);
  } else {
    // Maia's response
    setMessages(prev => [...prev, { role: 'oracle', text }]);
  }
});

sdk.on('audio', (samples) => {
  // Play Maia's voice
  playAudioSamples(samples);
});

await sdk.connect('You are Maya, a wise oracle...');
```

**Step 2: Add Cost Dashboard**

```tsx
// components/CostDashboard.tsx

export function CostDashboard() {
  const [cost, setCost] = useState({ total: 0, breakdown: {} });

  useEffect(() => {
    sdk.on('cost.update', (data) => {
      setCost(prev => ({
        total: data.total,
        breakdown: {
          ...prev.breakdown,
          [data.type]: (prev.breakdown[data.type] || 0) + data.cost
        }
      }));
    });
  }, []);

  return (
    <div className="p-4 bg-spice-orange/10 rounded-lg">
      <h3 className="text-sm font-semibold mb-2">Session Cost</h3>
      <div className="text-2xl font-bold text-spice-orange">
        ${cost.total.toFixed(4)}
      </div>
      <div className="text-xs text-gray-600 mt-2 space-y-1">
        <div>STT: ${cost.breakdown.stt?.toFixed(4) || '0.0000'}</div>
        <div>LLM: ${cost.breakdown.llm?.toFixed(4) || '0.0000'}</div>
        <div>TTS: ${cost.breakdown.tts?.toFixed(4) || '0.0000'}</div>
      </div>
    </div>
  );
}
```

---

## Next Steps

### Phase 1: Get OpenAI Working (1-2 days)
1. Fix event types to match OpenAI's actual format
2. Add ephemeral token exchange
3. Fix audio encoding (browser-safe base64)
4. Add proper turn detection config
5. Test with your existing MAIA-FRESH app

### Phase 2: Add Local STT (3-5 days)
1. Set up faster-whisper server
2. Create WebSocket endpoint for Whisper
3. Route STT requests to local Whisper
4. Keep OpenAI as fallback

### Phase 3: Add Local TTS (3-5 days)
1. Set up XTTS v2 server
2. Create WebSocket endpoint for XTTS
3. Route TTS to local XTTS
4. Compare quality vs OpenAI

### Phase 4: Add Anthropic (when available)
1. Wait for Anthropic Realtime API (rumored Q1 2025)
2. Route LLM to Anthropic (50% cheaper than OpenAI)
3. Full hybrid: Local STT → Anthropic LLM → Local TTS

---

## Testing Checklist

```bash
# 1. Test OpenAI connection
npm run test:voice-openai

# 2. Test local Whisper
npm run test:voice-whisper

# 3. Test local XTTS
npm run test:voice-xtts

# 4. Test failover (kill local servers)
npm run test:voice-failover

# 5. Test cost tracking
npm run test:cost-tracking

# 6. Integration test
npm run test:voice-integration
```

---

## Questions for You

1. **Do you want to prioritize**:
   - A) Getting OpenAI working ASAP (fix current issues)
   - B) Setting up local Whisper/XTTS servers first
   - C) Both in parallel (I can help with both)

2. **Cost vs Quality tradeoff**:
   - Are you okay with slightly lower quality from local models if it saves 90%?
   - Or do you want OpenAI-quality audio at all costs?

3. **Hosting**:
   - Where will you run Whisper/XTTS servers?
   - Local dev machine? Cloud VM? Docker containers?

4. **Current priority**:
   - Should I help debug why WebRTC isn't connecting in your current app?
   - Or focus on getting this new SDK working end-to-end?

Let me know and I'll help implement! 🚀
