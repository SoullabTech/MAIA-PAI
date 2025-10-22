# MAIA SDK Quick Start Guide
## Get Started in 30 Minutes

This guide will help you set up the MAIA SDK foundation and start building your first provider adapter.

---

## Prerequisites

- Node.js 18+ installed
- TypeScript knowledge
- Access to OpenAI API (for initial adapter)
- Basic understanding of WebSockets

---

## Step 1: Create SDK Directory Structure (5 minutes)

```bash
cd /Users/soullab/MAIA-FRESH

# Create SDK directories
mkdir -p lib/maia-sdk/{core,providers,middleware,utils,config}

# Create provider subdirectories
mkdir -p lib/maia-sdk/providers/{openai,anthropic,local}

# Create core files
touch lib/maia-sdk/core/{types.ts,session.ts,router.ts,realtime-client.ts,audio-processor.ts,event-emitter.ts}

# Create provider files
touch lib/maia-sdk/providers/base-provider.ts
touch lib/maia-sdk/providers/registry.ts
touch lib/maia-sdk/providers/openai/{realtime-adapter.ts,tts-adapter.ts,transcription-adapter.ts}
touch lib/maia-sdk/providers/local/{whisper-adapter.ts,xtts-adapter.ts}

# Create middleware files
touch lib/maia-sdk/middleware/{cost-optimizer.ts,fallback-handler.ts,rate-limiter.ts,cache.ts,analytics.ts}

# Create utils
touch lib/maia-sdk/utils/{audio-utils.ts,websocket-manager.ts,logger.ts,error-handler.ts}

# Create config
touch lib/maia-sdk/config/{providers.config.ts,routing.config.ts,costs.config.ts}

# Main SDK export
touch lib/maia-sdk/index.ts

echo "✅ SDK directory structure created!"
```

---

## Step 2: Define Core Types (10 minutes)

Create the foundation types that all providers will use:

```typescript
// lib/maia-sdk/core/types.ts

export type ProviderCapability = 'realtime' | 'tts' | 'stt' | 'llm' | 'streaming';

export interface ProviderMetadata {
  id: string;
  name: string;
  capabilities: ProviderCapability[];
  costPer1kTokens: number;
  latencyMs: number;
  reliability: number; // 0-1
  maxConcurrent: number;
}

export interface AudioConfig {
  sampleRate: number;
  channels: number;
  encoding: 'pcm16' | 'opus' | 'mp3';
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
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

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  voice?: string;
  [key: string]: any;
}

export interface Connection {
  id: string;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  provider: string;
}

export type ProviderEvent =
  | { type: 'transcription'; text: string }
  | { type: 'response'; text: string; audio?: ArrayBuffer }
  | { type: 'error'; error: Error }
  | { type: 'status'; status: Connection['status'] };
```

---

## Step 3: Create Base Provider Interface (5 minutes)

```typescript
// lib/maia-sdk/providers/base-provider.ts

import {
  ProviderMetadata,
  ProviderConfig,
  ConversationContext,
  Connection,
  ProviderEvent
} from '../core/types';

export abstract class BaseProvider {
  abstract metadata: ProviderMetadata;

  protected eventListeners: Map<string, Function[]> = new Map();

  /**
   * Initialize the provider with configuration
   */
  abstract initialize(config: ProviderConfig): Promise<void>;

  /**
   * Connect to the provider service
   */
  abstract connect(context: ConversationContext): Promise<Connection>;

  /**
   * Send audio data to the provider
   */
  abstract sendAudio(audioData: ArrayBuffer): Promise<void>;

  /**
   * Send text to the provider
   */
  abstract sendText(text: string): Promise<void>;

  /**
   * Disconnect from the provider
   */
  abstract disconnect(): Promise<void>;

  /**
   * Event handling
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  protected emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => callback(...args));
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.eventListeners.clear();
  }
}
```

---

## Step 4: Create Your First Provider - OpenAI Adapter (10 minutes)

```typescript
// lib/maia-sdk/providers/openai/realtime-adapter.ts

import { BaseProvider } from '../base-provider';
import {
  ProviderMetadata,
  ProviderConfig,
  ConversationContext,
  Connection
} from '../../core/types';

export class OpenAIRealtimeAdapter extends BaseProvider {
  metadata: ProviderMetadata = {
    id: 'openai-realtime',
    name: 'OpenAI Realtime API',
    capabilities: ['realtime', 'tts', 'stt'],
    costPer1kTokens: 0.06,
    latencyMs: 300,
    reliability: 0.98,
    maxConcurrent: 10
  };

  private ws: WebSocket | null = null;
  private config: ProviderConfig = {};
  private connection: Connection | null = null;

  async initialize(config: ProviderConfig): Promise<void> {
    this.config = config;

    if (!config.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    console.log('✅ OpenAI Realtime adapter initialized');
  }

  async connect(context: ConversationContext): Promise<Connection> {
    const url = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01`;

    this.ws = new WebSocket(url, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'OpenAI-Beta': 'realtime=v1'
      }
    });

    this.connection = {
      id: context.sessionId,
      status: 'connecting',
      provider: this.metadata.id
    };

    return new Promise((resolve, reject) => {
      this.ws!.onopen = () => {
        console.log('✅ Connected to OpenAI Realtime API');
        this.connection!.status = 'connected';
        this.emit('status', 'connected');

        // Send session configuration
        this.sendSessionUpdate(context);

        resolve(this.connection!);
      };

      this.ws!.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data));
      };

      this.ws!.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.connection!.status = 'error';
        this.emit('error', error);
        reject(error);
      };

      this.ws!.onclose = () => {
        console.log('🔌 Disconnected from OpenAI');
        this.connection!.status = 'disconnected';
        this.emit('status', 'disconnected');
      };
    });
  }

  private sendSessionUpdate(context: ConversationContext): void {
    const sessionConfig = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: 'You are MAIA, a wise and compassionate guide.',
        voice: context.userPreferences.voice || 'shimmer',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: { model: 'whisper-1' },
        turn_detection: { type: 'server_vad' }
      }
    };

    this.ws!.send(JSON.stringify(sessionConfig));
  }

  private handleMessage(message: any): void {
    switch (message.type) {
      case 'conversation.item.input_audio_transcription.completed':
        // User's speech was transcribed
        this.emit('transcription', message.transcript);
        break;

      case 'response.audio.delta':
        // MAIA's audio response chunk
        const audioData = this.base64ToArrayBuffer(message.delta);
        this.emit('audio_delta', audioData);
        break;

      case 'response.text.delta':
        // MAIA's text response chunk
        this.emit('text_delta', message.delta);
        break;

      case 'response.done':
        // Response complete
        const fullText = message.response.output[0]?.content[0]?.text || '';
        this.emit('response', fullText);
        break;

      case 'error':
        this.emit('error', new Error(message.error.message));
        break;
    }
  }

  async sendAudio(audioData: ArrayBuffer): Promise<void> {
    if (!this.ws || this.connection?.status !== 'connected') {
      throw new Error('Not connected to OpenAI');
    }

    const base64Audio = this.arrayBufferToBase64(audioData);

    this.ws.send(JSON.stringify({
      type: 'input_audio_buffer.append',
      audio: base64Audio
    }));
  }

  async sendText(text: string): Promise<void> {
    if (!this.ws || this.connection?.status !== 'connected') {
      throw new Error('Not connected to OpenAI');
    }

    this.ws.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text }]
      }
    }));

    // Trigger response
    this.ws.send(JSON.stringify({ type: 'response.create' }));
  }

  async disconnect(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connection = null;
  }

  // Utility methods
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}
```

---

## Step 5: Create SDK Entry Point

```typescript
// lib/maia-sdk/index.ts

export { BaseProvider } from './providers/base-provider';
export { OpenAIRealtimeAdapter } from './providers/openai/realtime-adapter';
export * from './core/types';

// Simple factory function
export function createProvider(type: 'openai' | 'local', config: any) {
  switch (type) {
    case 'openai':
      const provider = new OpenAIRealtimeAdapter();
      provider.initialize(config);
      return provider;
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}
```

---

## Step 6: Use in Your App (5 minutes)

Update your OracleConversation component:

```typescript
// components/OracleConversation.tsx

import { createProvider } from '@/lib/maia-sdk';

// Inside your component
const provider = createProvider('openai', {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  model: 'gpt-4o-realtime-preview-2024-10-01'
});

// Connect
await provider.connect({
  userId: explorerId,
  sessionId,
  conversationHistory: [],
  userPreferences: {
    voice: selectedVoice,
    speed: 1.0,
    conversationMode: 'realtime'
  }
});

// Listen for events
provider.on('transcription', (text) => {
  console.log('User said:', text);
  setMessages(prev => [...prev, { role: 'user', text }]);
});

provider.on('response', (text) => {
  console.log('MAIA said:', text);
  setMessages(prev => [...prev, { role: 'oracle', text }]);
});

provider.on('audio_delta', (audioData) => {
  // Play audio chunk
  playAudioChunk(audioData);
});

// Send audio
provider.sendAudio(audioBuffer);

// Cleanup
provider.disconnect();
```

---

## Next Steps

### Immediate (This Week)
1. ✅ Set up directory structure
2. ✅ Implement core types
3. ✅ Build OpenAI adapter
4. 🔲 Test in your app
5. 🔲 Verify it works end-to-end

### Week 2
1. Build local Whisper/XTTS adapter
2. Implement provider registry
3. Add simple router (pick cheapest)

### Week 3-4
1. Add intelligent routing
2. Implement cost tracking
3. Build fallback logic
4. Add analytics

---

## Testing Your Setup

```typescript
// Quick test script: test-sdk.ts

import { createProvider } from './lib/maia-sdk';

async function testSDK() {
  const provider = createProvider('openai', {
    apiKey: process.env.OPENAI_API_KEY
  });

  provider.on('transcription', (text) => {
    console.log('📝 Transcription:', text);
  });

  provider.on('response', (text) => {
    console.log('🤖 Response:', text);
  });

  await provider.connect({
    userId: 'test-user',
    sessionId: 'test-session',
    conversationHistory: [],
    userPreferences: {
      voice: 'shimmer',
      speed: 1.0,
      conversationMode: 'realtime'
    }
  });

  // Send a test message
  await provider.sendText('Hello MAIA, this is a test!');

  // Wait for response
  await new Promise(resolve => setTimeout(resolve, 3000));

  await provider.disconnect();
  console.log('✅ SDK test complete!');
}

testSDK().catch(console.error);
```

Run it:
```bash
npx tsx test-sdk.ts
```

---

## Troubleshooting

### Issue: WebSocket connection fails
**Solution**: Check your OpenAI API key has Realtime API access

### Issue: No audio playback
**Solution**: Ensure you're converting base64 to ArrayBuffer correctly

### Issue: TypeScript errors
**Solution**: Run `npm install --save-dev @types/node @types/ws`

---

## Resources

- **Full Architecture**: See `MAIA_SDK_ARCHITECTURE.md`
- **Rollout Plan**: See `MAIA_SOVEREIGNTY_ROLLOUT_PLAN.md`
- **OpenAI Realtime Docs**: https://platform.openai.com/docs/guides/realtime
- **Your voice training**: `/Users/soullab/MAIA-FRESH/voice-training/`

---

**Ready to build?** Start with Step 1 and you'll have a working SDK in 30 minutes! 🚀
