# MAIA SDK Architecture
## Sovereign Voice & AI Integration Layer

**Vision**: Own the integration layer. Never be locked into a single provider again.

**Core Principle**: A unified SDK that can route to ANY provider (OpenAI, Anthropic, local models) with intelligent cost optimization, automatic failover, and zero vendor lock-in.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     MAIA Application Layer                   │
│              (OracleConversation, Voice UI, etc)             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      MAIA SDK (Unified)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Session    │  │   Router &   │  │  Analytics   │      │
│  │   Manager    │  │  Optimizer   │  │  & Metrics   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Provider Adapters                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  OpenAI  │  │ Anthropic│  │  Local   │  │  Future  │   │
│  │ Realtime │  │  Claude  │  │ Whisper/ │  │ Providers│   │
│  │   API    │  │   API    │  │   XTTS   │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  External Services / Models                  │
│    OpenAI • Anthropic • Local GPU • Future Providers        │
└─────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
lib/maia-sdk/
├── core/
│   ├── types.ts                    # Core type definitions
│   ├── session.ts                  # Session management
│   ├── router.ts                   # Intelligent routing logic
│   ├── realtime-client.ts          # WebSocket client base
│   ├── audio-processor.ts          # Audio streaming & processing
│   └── event-emitter.ts            # Event system
│
├── providers/
│   ├── base-provider.ts            # Abstract provider interface
│   ├── openai/
│   │   ├── realtime-adapter.ts     # OpenAI Realtime API
│   │   ├── tts-adapter.ts          # OpenAI TTS
│   │   └── transcription-adapter.ts # OpenAI Whisper
│   ├── anthropic/
│   │   ├── claude-adapter.ts       # Claude API
│   │   └── streaming-adapter.ts    # Claude streaming
│   ├── local/
│   │   ├── whisper-adapter.ts      # Local Whisper
│   │   ├── xtts-adapter.ts         # Local XTTS (your voices!)
│   │   └── llama-adapter.ts        # Local LLM fallback
│   └── registry.ts                 # Provider registry & discovery
│
├── middleware/
│   ├── cost-optimizer.ts           # Route to cheapest option
│   ├── fallback-handler.ts         # Auto-retry & failover
│   ├── rate-limiter.ts             # Prevent overuse
│   ├── cache.ts                    # Response caching
│   └── analytics.ts                # Usage tracking & metrics
│
├── utils/
│   ├── audio-utils.ts              # Audio format conversion
│   ├── websocket-manager.ts        # WebSocket lifecycle
│   ├── logger.ts                   # Structured logging
│   └── error-handler.ts            # Error normalization
│
├── config/
│   ├── providers.config.ts         # Provider configurations
│   ├── routing.config.ts           # Routing rules
│   └── costs.config.ts             # Cost tables per provider
│
└── index.ts                        # Main SDK export
```

---

## Core Types & Interfaces

### 1. Provider Interface
```typescript
// lib/maia-sdk/providers/base-provider.ts

export type ProviderCapability = 'realtime' | 'tts' | 'stt' | 'llm' | 'streaming';

export interface ProviderMetadata {
  id: string;
  name: string;
  capabilities: ProviderCapability[];
  costPer1kTokens: number;
  latencyMs: number; // Average response time
  reliability: number; // 0-1 score
  maxConcurrent: number;
}

export interface AudioConfig {
  sampleRate: number;
  channels: number;
  encoding: 'pcm16' | 'opus' | 'mp3';
}

export interface ConversationContext {
  userId: string;
  sessionId: string;
  conversationHistory: Message[];
  userPreferences: {
    voice: string;
    speed: number;
    conversationMode: string;
  };
  metadata?: Record<string, any>;
}

export abstract class BaseProvider {
  abstract metadata: ProviderMetadata;

  abstract initialize(config: ProviderConfig): Promise<void>;
  abstract connect(context: ConversationContext): Promise<Connection>;
  abstract sendAudio(audioData: ArrayBuffer): Promise<void>;
  abstract sendText(text: string): Promise<void>;
  abstract disconnect(): Promise<void>;

  // Event handlers
  abstract onTranscription(callback: (text: string) => void): void;
  abstract onResponse(callback: (text: string, audio?: ArrayBuffer) => void): void;
  abstract onError(callback: (error: Error) => void): void;
}
```

### 2. Session Manager
```typescript
// lib/maia-sdk/core/session.ts

export interface SessionConfig {
  userId: string;
  sessionId: string;
  preferredProvider?: string;
  fallbackProviders?: string[];
  audioConfig: AudioConfig;
  conversationMode: 'realtime' | 'turn-based';
}

export class MAIASession {
  private currentProvider: BaseProvider;
  private router: IntelligentRouter;
  private analytics: AnalyticsCollector;

  constructor(config: SessionConfig) {
    this.router = new IntelligentRouter(config);
    this.analytics = new AnalyticsCollector(config.userId);
  }

  async start(): Promise<void> {
    // Select optimal provider
    this.currentProvider = await this.router.selectProvider({
      capability: 'realtime',
      budget: 'optimize', // or 'quality' or 'speed'
    });

    await this.currentProvider.connect();
    this.setupEventHandlers();
  }

  async sendAudio(audioData: ArrayBuffer): Promise<void> {
    try {
      await this.currentProvider.sendAudio(audioData);
      this.analytics.trackAudioSent(audioData.byteLength);
    } catch (error) {
      await this.handleProviderFailure(error);
    }
  }

  private async handleProviderFailure(error: Error): Promise<void> {
    console.warn(`Provider ${this.currentProvider.metadata.id} failed, switching...`);

    // Automatic failover
    const fallbackProvider = await this.router.selectFallbackProvider();
    await this.currentProvider.disconnect();
    this.currentProvider = fallbackProvider;
    await this.currentProvider.connect();
  }
}
```

### 3. Intelligent Router
```typescript
// lib/maia-sdk/core/router.ts

export type RoutingStrategy = 'cost' | 'quality' | 'speed' | 'balanced';

export interface RoutingDecision {
  provider: string;
  reason: string;
  estimatedCost: number;
  estimatedLatency: number;
  confidence: number;
}

export class IntelligentRouter {
  private providers: Map<string, BaseProvider>;
  private costTracker: CostOptimizer;

  constructor(private config: SessionConfig) {
    this.loadProviders();
  }

  async selectProvider(criteria: {
    capability: ProviderCapability;
    budget: RoutingStrategy;
    currentCost?: number;
  }): Promise<BaseProvider> {
    const candidates = this.getEligibleProviders(criteria.capability);

    switch (criteria.budget) {
      case 'cost':
        return this.selectCheapest(candidates);
      case 'quality':
        return this.selectBestQuality(candidates);
      case 'speed':
        return this.selectFastest(candidates);
      case 'balanced':
      default:
        return this.selectBalanced(candidates);
    }
  }

  private selectBalanced(candidates: BaseProvider[]): BaseProvider {
    // Score each provider on: cost (40%), quality (30%), speed (30%)
    const scored = candidates.map(provider => ({
      provider,
      score:
        (1 - provider.metadata.costPer1kTokens / 100) * 0.4 +
        provider.metadata.reliability * 0.3 +
        (1 - provider.metadata.latencyMs / 5000) * 0.3
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored[0].provider;
  }

  async selectFallbackProvider(): Promise<BaseProvider> {
    // Always fallback to local models if available
    if (this.providers.has('local-whisper-xtts')) {
      return this.providers.get('local-whisper-xtts')!;
    }

    // Otherwise pick next best available
    return this.selectProvider({
      capability: 'realtime',
      budget: 'balanced'
    });
  }
}
```

### 4. Cost Optimizer
```typescript
// lib/maia-sdk/middleware/cost-optimizer.ts

export interface CostThreshold {
  daily: number;
  monthly: number;
  perSession: number;
}

export interface ProviderCosts {
  openai: {
    realtimeAudio: 0.06 / 1000,    // per 1k audio tokens
    realtimeText: 0.005 / 1000,    // per 1k text tokens
    tts: 0.015 / 1000,             // per 1k characters
  },
  local: {
    realtimeAudio: 0,              // Free!
    realtimeText: 0,               // Free!
    tts: 0,                        // Free!
  }
}

export class CostOptimizer {
  private currentSpend = { daily: 0, monthly: 0 };

  constructor(private thresholds: CostThreshold) {}

  shouldSwitchToLocal(): boolean {
    return (
      this.currentSpend.daily >= this.thresholds.daily * 0.8 ||
      this.currentSpend.monthly >= this.thresholds.monthly * 0.8
    );
  }

  estimateCost(provider: string, tokens: number): number {
    const costs = ProviderCosts[provider as keyof typeof ProviderCosts];
    return costs.realtimeText * tokens;
  }

  trackSpend(provider: string, cost: number): void {
    this.currentSpend.daily += cost;
    this.currentSpend.monthly += cost;

    // Alert if approaching limits
    if (this.shouldSwitchToLocal()) {
      console.warn('💰 Approaching cost threshold, switching to local providers');
    }
  }
}
```

---

## Usage Example

```typescript
// In your OracleConversation component

import { MAIASession } from '@/lib/maia-sdk';

const session = new MAIASession({
  userId: 'user123',
  sessionId: 'session456',
  preferredProvider: 'openai-realtime', // Start with OpenAI
  fallbackProviders: ['local-whisper-xtts'], // Fallback to local
  audioConfig: {
    sampleRate: 24000,
    channels: 1,
    encoding: 'pcm16'
  },
  conversationMode: 'realtime'
});

// Start session - SDK automatically selects best provider
await session.start();

// Send audio - SDK handles everything
session.sendAudio(audioBuffer);

// Listen for responses
session.on('transcription', (text) => {
  console.log('User said:', text);
  setMessages(prev => [...prev, { role: 'user', text }]);
});

session.on('response', (text, audio) => {
  console.log('MAIA said:', text);
  setMessages(prev => [...prev, { role: 'oracle', text }]);
  if (audio) playAudio(audio);
});

// SDK automatically handles:
// ✅ Provider failures → switches to fallback
// ✅ Cost limits → switches to local models
// ✅ Rate limits → queues or retries
// ✅ Audio format conversion
// ✅ Analytics & monitoring
```

---

## Key Benefits

### 1. **Vendor Independence**
- Drop OpenAI tomorrow, switch to Anthropic or local models
- No code changes in your app layer
- Gradual migration path

### 2. **Cost Control**
- Automatic switch to local models when budget reached
- Real-time cost tracking
- Predictable monthly expenses

### 3. **Reliability**
- Automatic failover if provider is down
- Multiple fallback options
- Never leave users stranded

### 4. **Analytics**
- Track usage per provider
- Compare quality metrics
- Data-driven decisions

### 5. **Future-Proof**
- New providers = new adapter (no app changes)
- Own the integration layer
- Competitive advantage

---

## Next Steps

1. **Phase 1**: Build core SDK structure (Week 1-2)
2. **Phase 2**: Implement OpenAI adapter (Week 2-3)
3. **Phase 3**: Add local Whisper/XTTS adapter (Week 3-4)
4. **Phase 4**: Build router & cost optimizer (Week 4-5)
5. **Phase 5**: Beta test with real users (Week 5-6)
6. **Phase 6**: Add Anthropic adapter (Week 7-8)

---

## Success Metrics

- **Cost Reduction**: Target 60-80% reduction vs pure OpenAI
- **Reliability**: 99.9% uptime (with failover)
- **Latency**: <500ms average response time
- **Quality**: Match or exceed current voice quality
- **Developer Experience**: <10 lines of code to integrate

---

**Status**: Architecture design complete, ready for implementation
**Owner**: SOULLAB Engineering Team
**Timeline**: 6-8 weeks to production-ready SDK
