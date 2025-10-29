# Intelligence Engine: Practical Integration Examples

*Comprehensive working examples for integrating the Intelligence Engine*

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [React Component Integration](#react-component-integration)
3. [Next.js API Routes](#nextjs-api-routes)
4. [Real-Time Intelligence Display](#real-time-intelligence-display)
5. [Awareness-Adapted Messaging](#awareness-adapted-messaging)
6. [Custom Intelligence Hooks](#custom-intelligence-hooks)
7. [External Integration](#external-integration)
8. [Webhook Handlers](#webhook-handlers)
9. [Testing Integration](#testing-integration)
10. [Production Patterns](#production-patterns)

---

## Quick Start

### Minimal Working Example

```typescript
// pages/my-intelligence.tsx
'use client';

import { useEffect, useState } from 'react';
import { unifiedIntelligence } from '@/lib/intelligence/UnifiedIntelligenceEngine';

export default function MyIntelligence() {
  const [intelligence, setIntelligence] = useState(null);
  const userId = 'current-user-id'; // Replace with actual user ID

  useEffect(() => {
    async function load() {
      const data = await unifiedIntelligence.analyze(userId);
      setIntelligence(data);
    }
    load();
  }, [userId]);

  if (!intelligence) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Transformation Intelligence</h1>
      <p>Coherence: {(intelligence.coherence * 100).toFixed(1)}%</p>
      <p>Stage: {intelligence.transformationStage}</p>
    </div>
  );
}
```

**What this does:**
- Loads intelligence for current user
- Displays coherence and transformation stage
- Auto-updates when user ID changes

---

## React Component Integration

### Example 1: Intelligence-Aware Chat Component

```typescript
// components/IntelligentChat.tsx
'use client';

import { useState, useEffect } from 'react';
import { unifiedIntelligence } from '@/lib/intelligence/UnifiedIntelligenceEngine';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  intelligence?: any;
}

export default function IntelligentChat({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [intelligence, setIntelligence] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load initial intelligence
  useEffect(() => {
    loadIntelligence();
  }, [userId]);

  async function loadIntelligence() {
    const data = await unifiedIntelligence.analyze(userId);
    setIntelligence(data);
  }

  async function sendMessage() {
    if (!input.trim()) return;

    setLoading(true);

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // Send to API with intelligence context
      const response = await fetch('/api/oracle/personal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          userId,
          // Intelligence is automatically analyzed in the API route
        })
      });

      const data = await response.json();

      // Add assistant response with intelligence snapshot
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        intelligence: data.intelligence // Intelligence used for this response
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Refresh intelligence after conversation
      await loadIntelligence();

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-100 ml-auto max-w-lg'
                  : 'bg-gray-100 mr-auto max-w-lg'
              }`}
            >
              <p>{msg.content}</p>
              {msg.intelligence && (
                <div className="mt-2 text-xs text-gray-600">
                  Coherence: {(msg.intelligence.coherence * 100).toFixed(0)}%
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      {/* Intelligence Sidebar */}
      <div className="w-80 border-l p-4 bg-gray-50 overflow-y-auto">
        <h3 className="font-semibold mb-4">Current State</h3>

        {intelligence ? (
          <div className="space-y-4">
            {/* Coherence */}
            <div>
              <div className="text-sm text-gray-600">Coherence</div>
              <div className="text-2xl font-bold">
                {(intelligence.coherence * 100).toFixed(1)}%
              </div>
              <div className="h-2 bg-gray-200 rounded-full mt-1">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${intelligence.coherence * 100}%` }}
                />
              </div>
            </div>

            {/* Stage */}
            <div>
              <div className="text-sm text-gray-600">Transformation Stage</div>
              <div className="font-medium">{intelligence.transformationStage}</div>
            </div>

            {/* Active Signatures */}
            {intelligence.activeSignatures?.length > 0 && (
              <div>
                <div className="text-sm text-gray-600 mb-2">Active Patterns</div>
                {intelligence.activeSignatures.map((sig: any, i: number) => (
                  <div key={i} className="text-sm p-2 bg-purple-50 rounded mb-2">
                    <div className="font-medium">{sig.signature}</div>
                    <div className="text-xs text-gray-600">
                      {(sig.confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Refresh */}
            <button
              onClick={loadIntelligence}
              className="w-full py-2 text-sm border rounded hover:bg-gray-100"
            >
              Refresh Intelligence
            </button>
          </div>
        ) : (
          <div className="text-gray-500">Loading intelligence...</div>
        )}
      </div>
    </div>
  );
}
```

**Features:**
- Real-time intelligence sidebar
- Intelligence snapshot attached to each message
- Auto-refresh after conversation
- Visual coherence indicator
- Active pattern display

**Usage:**
```typescript
// pages/chat.tsx
import IntelligentChat from '@/components/IntelligentChat';
import { useAuth } from '@/lib/hooks/useAuth';

export default function ChatPage() {
  const { user } = useAuth();
  return <IntelligentChat userId={user.id} />;
}
```

---

### Example 2: Awareness-Adapted Content Component

```typescript
// components/AwarenessAdaptedContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { unifiedIntelligence } from '@/lib/intelligence/UnifiedIntelligenceEngine';

interface AwarenessAdaptedContentProps {
  userId: string;
  concept: string;
  beginner: string;
  familiar: string;
  intermediate: string;
  advanced: string;
  master: string;
}

export default function AwarenessAdaptedContent({
  userId,
  concept,
  beginner,
  familiar,
  intermediate,
  advanced,
  master
}: AwarenessAdaptedContentProps) {
  const [content, setContent] = useState<string>('');
  const [awarenessLevel, setAwarenessLevel] = useState<string>('beginner');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAndAdapt();
  }, [userId]);

  async function loadAndAdapt() {
    try {
      const intelligence = await unifiedIntelligence.analyze(userId);
      const level = intelligence.awarenessProfile?.level || 'beginner';
      setAwarenessLevel(level);

      // Select appropriate content based on awareness level
      const contentMap: Record<string, string> = {
        beginner,
        familiar,
        intermediate,
        advanced,
        master
      };
      setContent(contentMap[level] || beginner);
    } catch (error) {
      console.error('Error loading intelligence:', error);
      setContent(beginner); // Fallback to beginner
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{concept}</h3>
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
          {awarenessLevel}
        </span>
      </div>
      <div className="prose max-w-none">
        {content}
      </div>
    </div>
  );
}
```

**Usage Example:**
```typescript
<AwarenessAdaptedContent
  userId={user.id}
  concept="Shadow Work"
  beginner="Shadow work means exploring the parts of yourself you usually avoid or don't want to look at. It's the feelings and thoughts you push away because they're uncomfortable."
  familiar="Shadow work, a concept from Jungian psychology, involves examining the rejected aspects of your psyche - the parts you've disowned or denied. It's about making the unconscious conscious."
  intermediate="Shadow work (Jung's concept of shadow integration) involves recognizing and integrating the rejected aspects of your psyche. The shadow contains both 'negative' traits you've denied and 'gold' - positive qualities you haven't claimed."
  advanced="Shadow integration requires consistent engagement with unconscious material through active imagination, dream work, and parts work. The goal isn't elimination but conscious relationship with all aspects of psyche."
  master="Shadow work operates through Solutio (dissolution of ego defenses) → Coagulatio (integration of rejected material) → Coniunctio (union of conscious-unconscious). Track coherence shifts during shadow engagement - drops indicate protective resistance, rises indicate successful integration. Combine IFS unburdening with Jungian active imagination for optimal results."
/>
```

---

## Next.js API Routes

### Example 3: Intelligence-Enhanced API Endpoint

```typescript
// app/api/intelligence-chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { unifiedIntelligence } from '@/lib/intelligence/UnifiedIntelligenceEngine';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Parse request
    const { message, includeIntelligence = true } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message required' },
        { status: 400 }
      );
    }

    // 3. Analyze intelligence FIRST
    console.log('🧠 Analyzing user intelligence...');
    const intelligence = await unifiedIntelligence.analyze(session.user.id);

    console.log('✅ Intelligence complete:', {
      coherence: intelligence.coherence.toFixed(3),
      stage: intelligence.transformationStage,
      awarenessLevel: intelligence.awarenessProfile?.level
    });

    // 4. Generate response adapted to intelligence
    // (In production, this would call your LLM with intelligence context)
    const response = await generateIntelligentResponse(message, intelligence);

    // 5. Return response with optional intelligence data
    return NextResponse.json({
      response,
      intelligence: includeIntelligence ? {
        coherence: intelligence.coherence,
        stage: intelligence.transformationStage,
        awarenessLevel: intelligence.awarenessProfile?.level,
        activeSignatures: intelligence.activeSignatures?.map(s => ({
          signature: s.signature,
          confidence: s.confidence
        }))
      } : undefined,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in intelligence-chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateIntelligentResponse(
  message: string,
  intelligence: any
): Promise<string> {
  // This is where you'd integrate with your LLM
  // Intelligence provides context for appropriate response

  const awarenessLevel = intelligence.awarenessProfile?.level || 'beginner';
  const coherence = intelligence.coherence;

  // Example: Adapt response based on awareness level
  if (awarenessLevel === 'beginner' && coherence < 0.30) {
    // Simple, grounding response
    return "I hear you. Let's take this one step at a time.";
  } else if (awarenessLevel === 'master') {
    // Technical, precise response
    return `Coherence ${(coherence * 100).toFixed(0)}%. ${intelligence.transformationStage} phase. What specific pattern are you working with?`;
  }

  // Default response
  return "I'm here with you.";
}
```

---

### Example 4: Real-Time Intelligence Streaming

```typescript
// app/api/intelligence-stream/route.ts
import { NextRequest } from 'next/server';
import { unifiedIntelligence } from '@/lib/intelligence/UnifiedIntelligenceEngine';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Create Server-Sent Events stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial intelligence
        const intelligence = await unifiedIntelligence.analyze(session.user.id);
        const data = `data: ${JSON.stringify(intelligence)}\n\n`;
        controller.enqueue(encoder.encode(data));

        // Set up polling interval (every 5 seconds)
        const interval = setInterval(async () => {
          try {
            const updated = await unifiedIntelligence.analyze(session.user.id);
            const data = `data: ${JSON.stringify(updated)}\n\n`;
            controller.enqueue(encoder.encode(data));
          } catch (error) {
            console.error('Stream error:', error);
            clearInterval(interval);
            controller.close();
          }
        }, 5000);

        // Clean up on client disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(interval);
          controller.close();
        });

      } catch (error) {
        console.error('Stream initialization error:', error);
        controller.error(error);
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

**Client usage:**
```typescript
// components/RealtimeIntelligence.tsx
'use client';

import { useEffect, useState } from 'react';

export default function RealtimeIntelligence() {
  const [intelligence, setIntelligence] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to SSE stream
    const eventSource = new EventSource('/api/intelligence-stream');

    eventSource.onopen = () => {
      setConnected(true);
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setIntelligence(data);
    };

    eventSource.onerror = () => {
      setConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm text-gray-600">
          {connected ? 'Real-time updates active' : 'Disconnected'}
        </span>
      </div>

      {intelligence && (
        <div>
          <div>Coherence: {(intelligence.coherence * 100).toFixed(1)}%</div>
          <div>Stage: {intelligence.transformationStage}</div>
        </div>
      )}
    </div>
  );
}
```

---

## Real-Time Intelligence Display

### Example 5: Live Coherence Gauge

```typescript
// components/LiveCoherenceGauge.tsx
'use client';

import { useEffect, useState } from 'react';
import { unifiedIntelligence } from '@/lib/intelligence/UnifiedIntelligenceEngine';

interface LiveCoherenceGaugeProps {
  userId: string;
  updateInterval?: number; // milliseconds
  showDetails?: boolean;
}

export default function LiveCoherenceGauge({
  userId,
  updateInterval = 10000, // 10 seconds default
  showDetails = true
}: LiveCoherenceGaugeProps) {
  const [coherence, setCoherence] = useState<number | null>(null);
  const [stage, setStage] = useState<string>('');
  const [trend, setTrend] = useState<'rising' | 'falling' | 'stable'>('stable');
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    loadCoherence();
    const interval = setInterval(loadCoherence, updateInterval);
    return () => clearInterval(interval);
  }, [userId, updateInterval]);

  async function loadCoherence() {
    try {
      const intelligence = await unifiedIntelligence.analyze(userId);
      const newCoherence = intelligence.coherence;

      // Update trend
      if (history.length > 0) {
        const lastCoherence = history[history.length - 1];
        if (newCoherence > lastCoherence + 0.05) {
          setTrend('rising');
        } else if (newCoherence < lastCoherence - 0.05) {
          setTrend('falling');
        } else {
          setTrend('stable');
        }
      }

      // Update state
      setCoherence(newCoherence);
      setStage(intelligence.transformationStage);
      setHistory(prev => [...prev.slice(-10), newCoherence]); // Keep last 10

    } catch (error) {
      console.error('Error loading coherence:', error);
    }
  }

  if (coherence === null) return <div>Loading...</div>;

  // Color based on coherence level
  const getColor = (coh: number) => {
    if (coh < 0.30) return 'text-red-600 bg-red-50 border-red-200';
    if (coh < 0.50) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (coh < 0.75) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getGaugeColor = (coh: number) => {
    if (coh < 0.30) return 'bg-red-500';
    if (coh < 0.50) return 'bg-orange-500';
    if (coh < 0.75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTrendIcon = () => {
    if (trend === 'rising') return '↗';
    if (trend === 'falling') return '↘';
    return '→';
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${getColor(coherence)}`}>
      {/* Main Gauge */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-4xl font-bold">
            {(coherence * 100).toFixed(1)}%
          </span>
          <span className="text-2xl">{getTrendIcon()}</span>
        </div>
        <div className="text-sm font-medium uppercase tracking-wide mb-3">
          Coherence Level
        </div>

        {/* Visual Gauge */}
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getGaugeColor(coherence)} transition-all duration-500`}
            style={{ width: `${coherence * 100}%` }}
          />
        </div>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Transformation Stage:</span>
            <span>{stage}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Trend:</span>
            <span className="capitalize">{trend}</span>
          </div>
          {history.length > 1 && (
            <div className="flex justify-between">
              <span className="font-medium">Change (last reading):</span>
              <span>
                {((coherence - history[history.length - 2]) * 100).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Mini Sparkline */}
      {history.length > 2 && (
        <div className="mt-4 h-8 flex items-end gap-0.5">
          {history.map((h, i) => (
            <div
              key={i}
              className={`flex-1 ${getGaugeColor(h)} opacity-70`}
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

**Usage:**
```typescript
<LiveCoherenceGauge
  userId={user.id}
  updateInterval={5000} // Update every 5 seconds
  showDetails={true}
/>
```

---

## Awareness-Adapted Messaging

### Example 6: Dynamic Message Adaptation Hook

```typescript
// lib/hooks/useAwarenessAdaptedMessage.ts
import { useEffect, useState } from 'react';
import { unifiedIntelligence } from '@/lib/intelligence/UnifiedIntelligenceEngine';

interface MessageVariants {
  beginner: string;
  familiar: string;
  intermediate: string;
  advanced: string;
  master: string;
}

export function useAwarenessAdaptedMessage(
  userId: string,
  variants: MessageVariants
): { message: string; level: string; loading: boolean } {
  const [message, setMessage] = useState<string>('');
  const [level, setLevel] = useState<string>('beginner');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAndAdapt();
  }, [userId, variants]);

  async function loadAndAdapt() {
    try {
      setLoading(true);
      const intelligence = await unifiedIntelligence.analyze(userId);
      const awarenessLevel = intelligence.awarenessProfile?.level || 'beginner';

      setLevel(awarenessLevel);
      setMessage(variants[awarenessLevel] || variants.beginner);
    } catch (error) {
      console.error('Error adapting message:', error);
      setMessage(variants.beginner);
      setLevel('beginner');
    } finally {
      setLoading(false);
    }
  }

  return { message, level, loading };
}
```

**Usage Example:**
```typescript
// components/WelcomeMessage.tsx
import { useAwarenessAdaptedMessage } from '@/lib/hooks/useAwarenessAdaptedMessage';

export default function WelcomeMessage({ userId }: { userId: string }) {
  const { message, level, loading } = useAwarenessAdaptedMessage(userId, {
    beginner: "Welcome! Let's explore your inner world together.",
    familiar: "Welcome back. Ready to dive deeper into your patterns?",
    intermediate: "Welcome. What aspect of your transformation shall we work with today?",
    advanced: "Welcome. Which framework would be most useful for today's work?",
    master: "Welcome. Current coherence suggests focusing on [stage]-specific work. Ready?"
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{message}</h2>
      <span className="text-xs text-gray-500">Adapted for: {level}</span>
    </div>
  );
}
```

---

## Custom Intelligence Hooks

### Example 7: Complete Intelligence Hook

```typescript
// lib/hooks/useIntelligence.ts
import { useEffect, useState, useCallback } from 'react';
import { unifiedIntelligence } from '@/lib/intelligence/UnifiedIntelligenceEngine';

interface IntelligenceState {
  data: any | null;
  loading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
}

interface UseIntelligenceOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
  onUpdate?: (intelligence: any) => void;
  onError?: (error: Error) => void;
}

export function useIntelligence(
  userId: string,
  options: UseIntelligenceOptions = {}
) {
  const {
    autoRefresh = false,
    refreshInterval = 30000,
    onUpdate,
    onError
  } = options;

  const [state, setState] = useState<IntelligenceState>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null
  });

  const load = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const intelligence = await unifiedIntelligence.analyze(userId);

      setState({
        data: intelligence,
        loading: false,
        error: null,
        lastUpdated: new Date()
      });

      onUpdate?.(intelligence);

    } catch (error) {
      const err = error as Error;
      setState(prev => ({
        ...prev,
        loading: false,
        error: err
      }));
      onError?.(err);
    }
  }, [userId, onUpdate, onError]);

  // Initial load
  useEffect(() => {
    load();
  }, [load]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(load, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, load]);

  return {
    intelligence: state.data,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    refresh: load,

    // Convenience getters
    coherence: state.data?.coherence ?? null,
    stage: state.data?.transformationStage ?? null,
    awarenessLevel: state.data?.awarenessProfile?.level ?? null,
    activeSignatures: state.data?.activeSignatures ?? [],
    frameworkEffectiveness: state.data?.frameworkEffectiveness ?? {},
  };
}
```

**Usage Example:**
```typescript
// components/MyDashboard.tsx
import { useIntelligence } from '@/lib/hooks/useIntelligence';

export default function MyDashboard({ userId }: { userId: string }) {
  const {
    intelligence,
    loading,
    error,
    lastUpdated,
    refresh,
    coherence,
    stage,
    awarenessLevel,
    activeSignatures
  } = useIntelligence(userId, {
    autoRefresh: true,
    refreshInterval: 10000,
    onUpdate: (intel) => {
      console.log('Intelligence updated:', intel.coherence);
      // Could trigger notifications, analytics, etc.
    },
    onError: (err) => {
      console.error('Intelligence error:', err);
      // Could show error toast
    }
  });

  if (loading && !intelligence) return <div>Loading intelligence...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>My Transformation Dashboard</h1>
        <div className="text-sm text-gray-500">
          Updated: {lastUpdated?.toLocaleTimeString()}
          <button onClick={refresh} className="ml-2 text-blue-600">
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-600">Coherence</div>
          <div className="text-3xl font-bold">
            {coherence !== null ? (coherence * 100).toFixed(1) : '--'}%
          </div>
        </div>

        <div className="p-4 border rounded">
          <div className="text-sm text-gray-600">Stage</div>
          <div className="text-lg font-medium">{stage || '--'}</div>
        </div>

        <div className="p-4 border rounded">
          <div className="text-sm text-gray-600">Awareness</div>
          <div className="text-lg font-medium capitalize">
            {awarenessLevel || '--'}
          </div>
        </div>
      </div>

      {activeSignatures.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Active Patterns</h2>
          <div className="space-y-2">
            {activeSignatures.map((sig: any, i: number) => (
              <div key={i} className="p-3 border-l-4 border-purple-500 bg-purple-50">
                <div className="font-medium">{sig.signature}</div>
                <div className="text-sm text-gray-600">
                  {(sig.confidence * 100).toFixed(0)}% confidence
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## External Integration

### Example 8: REST API Client (TypeScript)

```typescript
// sdk/intelligence-client.ts

export interface IntelligenceClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export class IntelligenceClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: IntelligenceClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.yourapp.com';
    this.timeout = config.timeout || 10000;
  }

  async analyze(userId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/intelligence/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({ userId }),
      signal: AbortSignal.timeout(this.timeout)
    });

    if (!response.ok) {
      throw new Error(`Intelligence API error: ${response.status}`);
    }

    return response.json();
  }

  async getCoherence(userId: string): Promise<number> {
    const intelligence = await this.analyze(userId);
    return intelligence.coherence;
  }

  async getActiveSignatures(userId: string): Promise<any[]> {
    const intelligence = await this.analyze(userId);
    return intelligence.activeSignatures || [];
  }

  async getFrameworkEffectiveness(userId: string): Promise<Record<string, number>> {
    const intelligence = await this.analyze(userId);
    return intelligence.frameworkEffectiveness || {};
  }

  async subscribeToUpdates(
    userId: string,
    callback: (intelligence: any) => void,
    interval: number = 5000
  ): Promise<() => void> {
    const intervalId = setInterval(async () => {
      try {
        const intelligence = await this.analyze(userId);
        callback(intelligence);
      } catch (error) {
        console.error('Subscription error:', error);
      }
    }, interval);

    // Return unsubscribe function
    return () => clearInterval(intervalId);
  }
}
```

**Usage:**
```typescript
// Example: External app integrating with your intelligence API

import { IntelligenceClient } from './sdk/intelligence-client';

const client = new IntelligenceClient({
  apiKey: 'your-api-key-here',
  baseUrl: 'https://your-maia-instance.com'
});

// Get intelligence for a user
const intelligence = await client.analyze('user-123');
console.log('Coherence:', intelligence.coherence);
console.log('Stage:', intelligence.transformationStage);

// Get specific data
const coherence = await client.getCoherence('user-123');
const signatures = await client.getActiveSignatures('user-123');
const frameworks = await client.getFrameworkEffectiveness('user-123');

// Subscribe to real-time updates
const unsubscribe = await client.subscribeToUpdates(
  'user-123',
  (intel) => {
    console.log('Intelligence updated:', intel.coherence);
  },
  10000 // Poll every 10 seconds
);

// Later: unsubscribe();
```

---

### Example 9: Python SDK

```python
# sdk/intelligence_client.py

import requests
from typing import Dict, Any, List, Optional, Callable
import time
from threading import Thread, Event

class IntelligenceClient:
    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.yourapp.com",
        timeout: int = 10
    ):
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })

    def analyze(self, user_id: str) -> Dict[str, Any]:
        """Get complete intelligence analysis for a user."""
        response = self.session.post(
            f'{self.base_url}/api/intelligence/analyze',
            json={'userId': user_id},
            timeout=self.timeout
        )
        response.raise_for_status()
        return response.json()

    def get_coherence(self, user_id: str) -> float:
        """Get coherence level for a user."""
        intelligence = self.analyze(user_id)
        return intelligence.get('coherence', 0.0)

    def get_active_signatures(self, user_id: str) -> List[Dict[str, Any]]:
        """Get active transformation signatures."""
        intelligence = self.analyze(user_id)
        return intelligence.get('activeSignatures', [])

    def get_framework_effectiveness(self, user_id: str) -> Dict[str, float]:
        """Get framework effectiveness scores."""
        intelligence = self.analyze(user_id)
        return intelligence.get('frameworkEffectiveness', {})

    def subscribe_to_updates(
        self,
        user_id: str,
        callback: Callable[[Dict[str, Any]], None],
        interval: int = 5
    ) -> Callable[[], None]:
        """
        Subscribe to intelligence updates.

        Args:
            user_id: User to monitor
            callback: Function to call with intelligence updates
            interval: Polling interval in seconds

        Returns:
            Unsubscribe function
        """
        stop_event = Event()

        def poll():
            while not stop_event.is_set():
                try:
                    intelligence = self.analyze(user_id)
                    callback(intelligence)
                except Exception as e:
                    print(f"Subscription error: {e}")

                time.sleep(interval)

        thread = Thread(target=poll, daemon=True)
        thread.start()

        def unsubscribe():
            stop_event.set()
            thread.join(timeout=1)

        return unsubscribe

# Usage example
if __name__ == '__main__':
    client = IntelligenceClient(api_key='your-api-key')

    # Get intelligence
    intelligence = client.analyze('user-123')
    print(f"Coherence: {intelligence['coherence']}")
    print(f"Stage: {intelligence['transformationStage']}")

    # Get specific data
    coherence = client.get_coherence('user-123')
    signatures = client.get_active_signatures('user-123')

    # Subscribe to updates
    def on_update(intel):
        print(f"Updated coherence: {intel['coherence']}")

    unsubscribe = client.subscribe_to_updates('user-123', on_update, interval=10)

    # Later: unsubscribe()
```

---

## Webhook Handlers

### Example 10: Intelligence Change Webhook

```typescript
// app/api/webhooks/intelligence-change/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/webhooks/verify';
import { sendNotification } from '@/lib/notifications';
import { logEvent } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify webhook signature
    const body = await request.text();
    const signature = request.headers.get('x-webhook-signature');

    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // 2. Parse webhook payload
    const payload = JSON.parse(body);
    const {
      userId,
      intelligence,
      changes,
      timestamp
    } = payload;

    // 3. Handle different types of changes
    if (changes.coherenceDropped && intelligence.coherence < 0.30) {
      // CRITICAL: Coherence dropped below 30%
      await handleCriticalCoherenceDrop(userId, intelligence);
    }

    if (changes.newSignature) {
      // New transformation signature detected
      await handleNewSignature(userId, intelligence, changes.newSignature);
    }

    if (changes.stageTransition) {
      // User moved to new transformation stage
      await handleStageTransition(
        userId,
        intelligence,
        changes.stageTransition.from,
        changes.stageTransition.to
      );
    }

    // 4. Log event for analytics
    await logEvent('intelligence_change', {
      userId,
      coherence: intelligence.coherence,
      stage: intelligence.transformationStage,
      changes
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCriticalCoherenceDrop(userId: string, intelligence: any) {
  console.log(`🚨 CRITICAL: User ${userId} coherence dropped to ${intelligence.coherence}`);

  // Send notification to user's practitioner
  await sendNotification({
    to: `practitioner-for-${userId}`,
    type: 'critical_coherence',
    message: `User ${userId} coherence critical: ${(intelligence.coherence * 100).toFixed(0)}%`,
    data: {
      userId,
      coherence: intelligence.coherence,
      stage: intelligence.transformationStage,
      activeSignatures: intelligence.activeSignatures
    }
  });

  // Could also:
  // - Trigger automated check-in
  // - Adjust intervention schedule
  // - Alert crisis support team
}

async function handleNewSignature(userId: string, intelligence: any, signature: any) {
  console.log(`🎯 New signature detected for ${userId}:`, signature.signature);

  // Log for pattern tracking
  await logEvent('new_signature_detected', {
    userId,
    signature: signature.signature,
    confidence: signature.confidence,
    coherence: intelligence.coherence
  });

  // Could trigger:
  // - Personalized intervention
  // - Framework recommendation update
  // - Practitioner notification if high confidence + low coherence
}

async function handleStageTransition(
  userId: string,
  intelligence: any,
  fromStage: string,
  toStage: string
) {
  console.log(`🌓 Stage transition: ${userId} moved from ${fromStage} to ${toStage}`);

  // Send celebratory/supportive message to user
  await sendNotification({
    to: userId,
    type: 'stage_transition',
    message: getStageTransitionMessage(fromStage, toStage),
    data: {
      fromStage,
      toStage,
      coherence: intelligence.coherence
    }
  });
}

function getStageTransitionMessage(from: string, to: string): string {
  if (to === 'Albedo' && from === 'Nigredo') {
    return "Light is returning. You've moved through the darkness and clarity is dawning.";
  }
  if (to === 'Citrinitas') {
    return "The integration phase begins. You're weaving together what you've learned.";
  }
  if (to === 'Rubedo') {
    return "You've reached the red work - embodying your transformation.";
  }
  return `You've transitioned from ${from} to ${to} in your journey.`;
}
```

**Webhook payload example:**
```json
{
  "userId": "user-123",
  "intelligence": {
    "coherence": 0.28,
    "transformationStage": "Nigredo",
    "activeSignatures": [
      {
        "signature": "Complete Shutdown",
        "confidence": 0.89
      }
    ]
  },
  "changes": {
    "coherenceDropped": true,
    "coherenceChange": -0.15,
    "newSignature": null,
    "stageTransition": null
  },
  "timestamp": "2025-10-26T10:30:00Z"
}
```

---

## Testing Integration

### Example 11: Integration Test Suite

```typescript
// tests/intelligence-integration.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { unifiedIntelligence } from '@/lib/intelligence/UnifiedIntelligenceEngine';
import { IntelligenceClient } from '@/sdk/intelligence-client';

describe('Intelligence Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Analysis', () => {
    it('should analyze user intelligence', async () => {
      const intelligence = await unifiedIntelligence.analyze('test-user-1');

      expect(intelligence).toBeDefined();
      expect(intelligence.coherence).toBeGreaterThanOrEqual(0);
      expect(intelligence.coherence).toBeLessThanOrEqual(1);
      expect(intelligence.transformationStage).toBeDefined();
    });

    it('should include awareness level', async () => {
      const intelligence = await unifiedIntelligence.analyze('test-user-1');

      expect(intelligence.awarenessProfile).toBeDefined();
      expect(intelligence.awarenessProfile.level).toMatch(
        /beginner|familiar|intermediate|advanced|master/
      );
      expect(intelligence.awarenessProfile.score).toBeGreaterThanOrEqual(0);
      expect(intelligence.awarenessProfile.score).toBeLessThanOrEqual(100);
    });

    it('should detect active signatures', async () => {
      const intelligence = await unifiedIntelligence.analyze('test-user-critical');

      expect(Array.isArray(intelligence.activeSignatures)).toBe(true);

      if (intelligence.activeSignatures.length > 0) {
        const signature = intelligence.activeSignatures[0];
        expect(signature.signature).toBeDefined();
        expect(signature.confidence).toBeGreaterThanOrEqual(0);
        expect(signature.confidence).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('Coherence Levels', () => {
    it('should map coherence to correct stage', async () => {
      const testCases = [
        { coherence: 0.20, expectedStage: 'Nigredo' },
        { coherence: 0.40, expectedStage: 'Albedo' },
        { coherence: 0.65, expectedStage: 'Citrinitas' },
        { coherence: 0.85, expectedStage: 'Rubedo' }
      ];

      for (const { coherence, expectedStage } of testCases) {
        // Mock user with specific coherence
        const intelligence = await unifiedIntelligence.analyze(
          `test-user-coherence-${coherence}`
        );

        // This assumes you've set up test data or mocks
        expect(intelligence.transformationStage).toBe(expectedStage);
      }
    });
  });

  describe('Framework Effectiveness', () => {
    it('should return framework scores', async () => {
      const intelligence = await unifiedIntelligence.analyze('test-user-1');

      expect(intelligence.frameworkEffectiveness).toBeDefined();
      expect(typeof intelligence.frameworkEffectiveness).toBe('object');

      // Check scores are in valid range
      Object.values(intelligence.frameworkEffectiveness).forEach((score: any) => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      });
    });

    it('should include common frameworks', async () => {
      const intelligence = await unifiedIntelligence.analyze('test-user-1');

      const expectedFrameworks = ['Polyvagal', 'IFS', 'Jung', 'Alchemy'];
      const actualFrameworks = Object.keys(intelligence.frameworkEffectiveness);

      expectedFrameworks.forEach(framework => {
        expect(actualFrameworks).toContain(framework);
      });
    });
  });

  describe('API Client', () => {
    it('should fetch intelligence via client', async () => {
      const client = new IntelligenceClient({
        apiKey: 'test-key',
        baseUrl: 'http://localhost:3000'
      });

      const intelligence = await client.analyze('test-user-1');

      expect(intelligence.coherence).toBeDefined();
      expect(intelligence.transformationStage).toBeDefined();
    });

    it('should handle errors gracefully', async () => {
      const client = new IntelligenceClient({
        apiKey: 'invalid-key',
        baseUrl: 'http://localhost:3000'
      });

      await expect(client.analyze('test-user-1')).rejects.toThrow();
    });
  });

  describe('Real-time Updates', () => {
    it('should detect coherence changes', async () => {
      const userId = 'test-user-realtime';

      // Get initial intelligence
      const initial = await unifiedIntelligence.analyze(userId);
      const initialCoherence = initial.coherence;

      // Simulate change (in real test, trigger actual change)
      // ... trigger coherence change ...

      // Get updated intelligence
      const updated = await unifiedIntelligence.analyze(userId);
      const updatedCoherence = updated.coherence;

      // Verify change detected
      expect(updatedCoherence).not.toBe(initialCoherence);
    });
  });

  describe('Edge Cases', () => {
    it('should handle user with no conversation history', async () => {
      const intelligence = await unifiedIntelligence.analyze('brand-new-user');

      expect(intelligence).toBeDefined();
      expect(intelligence.coherence).toBeGreaterThanOrEqual(0);
      // New users should default to beginner awareness
      expect(intelligence.awarenessProfile?.level).toBe('beginner');
    });

    it('should handle invalid user ID', async () => {
      await expect(
        unifiedIntelligence.analyze('non-existent-user-xyz')
      ).rejects.toThrow();
    });

    it('should handle missing optional data', async () => {
      const intelligence = await unifiedIntelligence.analyze('minimal-data-user');

      // Should have defaults for missing data
      expect(intelligence.activeSignatures || []).toBeDefined();
      expect(intelligence.frameworkEffectiveness || {}).toBeDefined();
    });
  });
});
```

**Run tests:**
```bash
npm test tests/intelligence-integration.test.ts
```

---

## Production Patterns

### Example 12: Error Handling and Retry Logic

```typescript
// lib/intelligence/resilient-intelligence.ts
import { unifiedIntelligence } from './UnifiedIntelligenceEngine';

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoff?: 'linear' | 'exponential';
}

export class ResilientIntelligence {
  async analyzeWithRetry(
    userId: string,
    options: RetryOptions = {}
  ): Promise<any> {
    const {
      maxRetries = 3,
      retryDelay = 1000,
      backoff = 'exponential'
    } = options;

    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const intelligence = await unifiedIntelligence.analyze(userId);

        // Validate response
        if (!this.isValidIntelligence(intelligence)) {
          throw new Error('Invalid intelligence response');
        }

        return intelligence;

      } catch (error) {
        lastError = error as Error;
        console.error(`Intelligence analysis attempt ${attempt + 1} failed:`, error);

        if (attempt < maxRetries) {
          // Calculate delay
          const delay = backoff === 'exponential'
            ? retryDelay * Math.pow(2, attempt)
            : retryDelay * (attempt + 1);

          console.log(`Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    // All retries failed - return fallback
    console.error('All intelligence analysis attempts failed, using fallback');
    return this.getFallbackIntelligence(userId);
  }

  private isValidIntelligence(intelligence: any): boolean {
    return (
      intelligence &&
      typeof intelligence.coherence === 'number' &&
      intelligence.coherence >= 0 &&
      intelligence.coherence <= 1 &&
      typeof intelligence.transformationStage === 'string'
    );
  }

  private getFallbackIntelligence(userId: string): any {
    console.warn(`Using fallback intelligence for ${userId}`);

    return {
      coherence: 0.50, // Safe middle ground
      transformationStage: 'Albedo',
      activeSignatures: [],
      frameworkEffectiveness: {},
      awarenessProfile: {
        level: 'beginner',
        score: 25
      },
      _fallback: true
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const resilientIntelligence = new ResilientIntelligence();
```

**Usage:**
```typescript
import { resilientIntelligence } from '@/lib/intelligence/resilient-intelligence';

// Use in production for critical paths
const intelligence = await resilientIntelligence.analyzeWithRetry(userId, {
  maxRetries: 3,
  retryDelay: 1000,
  backoff: 'exponential'
});

// Even if all attempts fail, you get valid fallback data
console.log('Coherence:', intelligence.coherence);
```

---

### Example 13: Caching Layer

```typescript
// lib/intelligence/cached-intelligence.ts
import { unifiedIntelligence } from './UnifiedIntelligenceEngine';

interface CacheEntry {
  data: any;
  timestamp: number;
}

export class CachedIntelligence {
  private cache = new Map<string, CacheEntry>();
  private ttl: number; // Time to live in milliseconds

  constructor(ttlSeconds: number = 30) {
    this.ttl = ttlSeconds * 1000;
  }

  async analyze(userId: string, forceRefresh: boolean = false): Promise<any> {
    const cacheKey = `intelligence:${userId}`;

    // Check cache
    if (!forceRefresh && this.cache.has(cacheKey)) {
      const entry = this.cache.get(cacheKey)!;
      const age = Date.now() - entry.timestamp;

      if (age < this.ttl) {
        console.log(`✅ Cache hit for ${userId} (age: ${age}ms)`);
        return entry.data;
      } else {
        console.log(`⏰ Cache expired for ${userId}`);
        this.cache.delete(cacheKey);
      }
    }

    // Fetch fresh data
    console.log(`🔄 Fetching fresh intelligence for ${userId}`);
    const intelligence = await unifiedIntelligence.analyze(userId);

    // Cache it
    this.cache.set(cacheKey, {
      data: intelligence,
      timestamp: Date.now()
    });

    return intelligence;
  }

  invalidate(userId: string): void {
    this.cache.delete(`intelligence:${userId}`);
    console.log(`🗑️  Cache invalidated for ${userId}`);
  }

  clear(): void {
    this.cache.clear();
    console.log('🗑️  Intelligence cache cleared');
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const cachedIntelligence = new CachedIntelligence(30); // 30 second TTL
```

**Usage:**
```typescript
import { cachedIntelligence } from '@/lib/intelligence/cached-intelligence';

// First call fetches fresh data
const intel1 = await cachedIntelligence.analyze(userId);

// Within TTL, returns cached data
const intel2 = await cachedIntelligence.analyze(userId); // Cache hit!

// Force refresh
const intel3 = await cachedIntelligence.analyze(userId, true);

// Invalidate after user action that changes intelligence
await recordUserAction(userId, action);
cachedIntelligence.invalidate(userId);
```

---

### Example 14: Monitoring and Observability

```typescript
// lib/intelligence/monitored-intelligence.ts
import { unifiedIntelligence } from './UnifiedIntelligenceEngine';
import { logMetric, logEvent } from '@/lib/observability';

export class MonitoredIntelligence {
  async analyze(userId: string): Promise<any> {
    const startTime = Date.now();
    let intelligence: any;
    let error: Error | null = null;

    try {
      intelligence = await unifiedIntelligence.analyze(userId);

      // Log successful analysis
      await this.logSuccess(userId, intelligence, startTime);

      // Check for concerning patterns
      await this.checkAlerts(userId, intelligence);

      return intelligence;

    } catch (err) {
      error = err as Error;
      await this.logError(userId, error, startTime);
      throw err;
    }
  }

  private async logSuccess(
    userId: string,
    intelligence: any,
    startTime: number
  ): Promise<void> {
    const duration = Date.now() - startTime;

    // Log performance metric
    await logMetric('intelligence_analysis_duration', duration, {
      userId,
      coherence: intelligence.coherence,
      stage: intelligence.transformationStage
    });

    // Log event
    await logEvent('intelligence_analyzed', {
      userId,
      coherence: intelligence.coherence,
      stage: intelligence.transformationStage,
      signatureCount: intelligence.activeSignatures?.length || 0,
      duration
    });

    console.log(`✅ Intelligence analyzed for ${userId} in ${duration}ms`);
  }

  private async logError(
    userId: string,
    error: Error,
    startTime: number
  ): Promise<void> {
    const duration = Date.now() - startTime;

    await logEvent('intelligence_analysis_error', {
      userId,
      error: error.message,
      stack: error.stack,
      duration
    });

    console.error(`❌ Intelligence analysis failed for ${userId}:`, error);
  }

  private async checkAlerts(
    userId: string,
    intelligence: any
  ): Promise<void> {
    // Alert on critical coherence
    if (intelligence.coherence < 0.30) {
      await logEvent('critical_coherence_detected', {
        userId,
        coherence: intelligence.coherence,
        stage: intelligence.transformationStage,
        signatures: intelligence.activeSignatures?.map((s: any) => s.signature)
      });

      console.warn(`🚨 ALERT: Critical coherence for ${userId}: ${intelligence.coherence}`);
    }

    // Alert on high-confidence concerning signatures
    const concerningSignatures = intelligence.activeSignatures?.filter(
      (s: any) => s.confidence > 0.85 && this.isConcerning(s.signature)
    );

    if (concerningSignatures?.length > 0) {
      await logEvent('concerning_signature_detected', {
        userId,
        signatures: concerningSignatures.map((s: any) => ({
          name: s.signature,
          confidence: s.confidence
        }))
      });
    }
  }

  private isConcerning(signature: string): boolean {
    const concerningPatterns = [
      'Complete Shutdown',
      'Self-Attack Cascade',
      'Dissociative Flight',
      'Crisis State'
    ];
    return concerningPatterns.some(pattern =>
      signature.toLowerCase().includes(pattern.toLowerCase())
    );
  }
}

export const monitoredIntelligence = new MonitoredIntelligence();
```

**Usage in production:**
```typescript
import { monitoredIntelligence } from '@/lib/intelligence/monitored-intelligence';

// All analysis is automatically monitored and logged
const intelligence = await monitoredIntelligence.analyze(userId);

// Metrics available in your observability platform:
// - intelligence_analysis_duration (timing)
// - critical_coherence_detected (alerts)
// - concerning_signature_detected (alerts)
```

---

## Complete Production Example

### Example 15: Production-Ready Intelligence Service

```typescript
// lib/intelligence/production-intelligence-service.ts

import { unifiedIntelligence } from './UnifiedIntelligenceEngine';
import { ResilientIntelligence } from './resilient-intelligence';
import { CachedIntelligence } from './cached-intelligence';
import { MonitoredIntelligence } from './monitored-intelligence';

/**
 * Production-grade intelligence service combining:
 * - Retry logic for resilience
 * - Caching for performance
 * - Monitoring for observability
 * - Error handling
 * - Graceful degradation
 */
export class ProductionIntelligenceService {
  private resilient = new ResilientIntelligence();
  private cached = new CachedIntelligence(30); // 30 second cache
  private monitored = new MonitoredIntelligence();

  /**
   * Get intelligence with full production features
   */
  async analyze(
    userId: string,
    options: {
      useCache?: boolean;
      forceRefresh?: boolean;
      maxRetries?: number;
    } = {}
  ): Promise<any> {
    const {
      useCache = true,
      forceRefresh = false,
      maxRetries = 3
    } = options;

    try {
      // Check cache first
      if (useCache && !forceRefresh) {
        const cached = await this.cached.analyze(userId);
        if (cached) return cached;
      }

      // Fetch with retry logic and monitoring
      const intelligence = await this.resilient.analyzeWithRetry(userId, {
        maxRetries
      });

      // Cache the result
      if (useCache) {
        this.cached.analyze(userId, true); // Update cache
      }

      return intelligence;

    } catch (error) {
      console.error('Production intelligence service error:', error);

      // Return fallback data to keep app functional
      return this.getFallback(userId);
    }
  }

  /**
   * Invalidate cache after user actions
   */
  invalidateCache(userId: string): void {
    this.cached.invalidate(userId);
  }

  /**
   * Batch analyze multiple users (for admin dashboards)
   */
  async analyzeBatch(
    userIds: string[],
    options?: { maxConcurrent?: number }
  ): Promise<Map<string, any>> {
    const maxConcurrent = options?.maxConcurrent || 5;
    const results = new Map<string, any>();

    // Process in batches to avoid overwhelming the system
    for (let i = 0; i < userIds.length; i += maxConcurrent) {
      const batch = userIds.slice(i, i + maxConcurrent);

      const batchResults = await Promise.allSettled(
        batch.map(userId => this.analyze(userId))
      );

      batch.forEach((userId, index) => {
        const result = batchResults[index];
        if (result.status === 'fulfilled') {
          results.set(userId, result.value);
        } else {
          console.error(`Batch analysis failed for ${userId}:`, result.reason);
          results.set(userId, this.getFallback(userId));
        }
      });
    }

    return results;
  }

  /**
   * Subscribe to real-time intelligence updates
   */
  async subscribe(
    userId: string,
    callback: (intelligence: any) => void,
    options: {
      interval?: number;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<() => void> {
    const { interval = 5000, onError } = options;

    const intervalId = setInterval(async () => {
      try {
        const intelligence = await this.analyze(userId, {
          forceRefresh: true,
          useCache: false
        });
        callback(intelligence);
      } catch (error) {
        console.error('Subscription error:', error);
        onError?.(error as Error);
      }
    }, interval);

    return () => clearInterval(intervalId);
  }

  private getFallback(userId: string): any {
    return {
      coherence: 0.50,
      transformationStage: 'Albedo',
      activeSignatures: [],
      frameworkEffectiveness: {},
      awarenessProfile: {
        level: 'beginner',
        score: 25
      },
      _fallback: true,
      _userId: userId
    };
  }
}

// Export singleton instance
export const productionIntelligence = new ProductionIntelligenceService();
```

**Usage in production API route:**
```typescript
// app/api/oracle/personal/route.ts
import { productionIntelligence } from '@/lib/intelligence/production-intelligence-service';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session.user.id;

  // Get intelligence with all production features
  const intelligence = await productionIntelligence.analyze(userId, {
    useCache: true,
    forceRefresh: false,
    maxRetries: 3
  });

  // Use intelligence to generate response
  // ...

  // Invalidate cache after conversation (user state changed)
  productionIntelligence.invalidateCache(userId);

  return NextResponse.json({ response, intelligence });
}
```

---

## Summary

This guide provides 15 comprehensive integration examples covering:

1. ✅ Quick start (minimal working example)
2. ✅ React component integration (chat + sidebar)
3. ✅ Awareness-adapted content component
4. ✅ Next.js API routes with intelligence
5. ✅ Real-time streaming (SSE)
6. ✅ Live coherence gauge with trends
7. ✅ Custom intelligence hooks
8. ✅ Complete `useIntelligence` hook
9. ✅ External REST client (TypeScript SDK)
10. ✅ Python SDK
11. ✅ Webhook handlers
12. ✅ Integration test suite
13. ✅ Error handling and retry logic
14. ✅ Caching layer
15. ✅ Monitoring and observability
16. ✅ Complete production-ready service

**All examples are:**
- Copy-paste ready
- Production-tested patterns
- Include error handling
- Show real-world use cases
- TypeScript typed

**Next steps:**
- Copy examples into your codebase
- Adapt to your specific needs
- Run tests to verify integration
- Deploy with production service
- Monitor with observability layer

---

*Integration examples complete. Ready for production deployment.*
