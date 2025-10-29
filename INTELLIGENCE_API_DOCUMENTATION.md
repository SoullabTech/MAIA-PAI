# Intelligence Engine - API Documentation

*Version: 2.0*
*Last Updated: October 26, 2025*

---

## Overview

The Intelligence Engine provides real-time transformation intelligence analysis for users. This document covers all API endpoints, request/response formats, and integration examples.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Core Endpoints](#core-endpoints)
3. [Request/Response Formats](#requestresponse-formats)
4. [Integration Examples](#integration-examples)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Webhooks](#webhooks)

---

## Authentication

All API requests require authentication via:
- **Session cookie** (web app)
- **Bearer token** (API access)
- **API key** (external integrations)

```typescript
// Web app (automatic)
fetch('/api/intelligence/analyze', {
  credentials: 'include' // Sends session cookie
});

// API access
fetch('/api/intelligence/analyze', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

// External integration
fetch('/api/intelligence/analyze', {
  headers: {
    'X-API-Key': process.env.MAIA_API_KEY
  }
});
```

---

## Core Endpoints

### 1. Analyze User Intelligence

**Endpoint:** `POST /api/intelligence/analyze`

**Description:** Analyzes a user's complete transformation intelligence state.

**Request:**
```typescript
POST /api/intelligence/analyze
Content-Type: application/json

{
  "userId": "string",
  "includeHistory": boolean, // optional, default: true
  "includeComparative": boolean, // optional, default: false
  "messageText": "string" // optional, for real-time analysis
}
```

**Response:**
```typescript
{
  "success": true,
  "intelligence": {
    // Core metrics
    "coherence": number, // 0-1
    "transformationStage": "Nigredo" | "Albedo" | "Citrinitas" | "Rubedo",

    // Awareness level
    "awarenessLevel": "beginner" | "familiar" | "intermediate" | "advanced" | "master",
    "awarenessProfile": {
      "level": string,
      "score": number, // 0-100
      "frameworkFamiliarity": {
        "alchemy": number,
        "spiralogic": number,
        "jung": number,
        "ifs": number,
        "polyvagal": number,
        "mcgilchrist": number,
        "levin": number
      },
      "indicators": string[],
      "suggestedLanguageStyle": string
    },

    // Active patterns
    "activeSignatures": [
      {
        "signature": string,
        "confidence": number, // 0-1
        "description": string,
        "response": string,
        "urgency": "critical" | "high" | "moderate" | "low",
        "frameworks": string[]
      }
    ],

    // Journey tracking
    "journeyTrajectory": {
      "direction": "ascending" | "descending" | "stable" | "oscillating",
      "momentum": number, // 0-1
      "predictedNextStage": string,
      "interventionWindow": {
        "optimal": string, // e.g., "Morning (6-9am)"
        "description": string
      }
    },

    // Framework effectiveness (personalized)
    "frameworkEffectiveness": {
      "[Framework Name]": number // 0-1 effectiveness score
    },

    // Intervention guidance
    "interventionWindows": [
      {
        "window": string,
        "description": string,
        "activities": string[]
      }
    ],

    // Comparative analytics (if requested)
    "comparativeAnalytics": {
      "percentile": number, // 0-100
      "similarJourneys": number,
      "averageCoherence": number,
      "typicalDuration": {
        "stage": string,
        "days": number
      }
    }
  },
  "timestamp": string, // ISO 8601
  "processingTimeMs": number
}
```

**Example:**
```bash
curl -X POST https://api.maia.soullab.com/api/intelligence/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "includeComparative": true
  }'
```

---

### 2. Get MAIA Response (with Intelligence)

**Endpoint:** `POST /api/oracle/personal`

**Description:** Get MAIA's response with integrated intelligence analysis.

**Request:**
```typescript
POST /api/oracle/personal
Content-Type: application/json

{
  "input": "string", // User message
  "userId": "string",
  "sessionId": "string", // optional
  "modality": "voice" | "text", // optional, default: "text"
  "preferences": {
    "isVoice": boolean,
    "conversationStyle": "classic" | "walking" | "adaptive"
  }
}
```

**Response:**
```typescript
{
  "success": true,
  "text": string, // MAIA's response
  "response": string, // Same as text
  "message": string, // Same as text
  "element": "fire" | "water" | "earth" | "air" | "aether",
  "archetype": string,
  "voiceCharacteristics": {
    "pace": number,
    "tone": string,
    "energy": string
  },
  "voiceTone": {
    "pitch": number,
    "rate": number,
    "style": string
  },
  "source": "unified-consciousness",
  "version": "v2.0.0",
  "metadata": {
    "spiralogicPhase": string,
    "responseTime": number,
    "userName": string,
    "journalContext": number,

    // Intelligence metadata (NEW)
    "intelligence": {
      "coherence": number,
      "transformationStage": string,
      "awarenessLevel": string,
      "activeSignatures": [...],
      "frameworksUsed": string[]
    }
  }
}
```

**Example:**
```typescript
const response = await fetch('/api/oracle/personal', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input: "I keep starting projects but never finishing them",
    userId: "user123",
    preferences: {
      conversationStyle: "classic"
    }
  })
});

const data = await response.json();
console.log(data.text); // MAIA's awareness-adapted response
console.log(data.metadata.intelligence); // Intelligence analysis
```

---

### 3. Get Dashboard Data

**Endpoint:** `GET /api/intelligence/dashboard/:userId`

**Description:** Get formatted data for intelligence dashboard display.

**Request:**
```bash
GET /api/intelligence/dashboard/user123
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```typescript
{
  "success": true,
  "dashboard": {
    "coherence": {
      "value": number,
      "percentage": string,
      "color": "red" | "orange" | "yellow" | "green",
      "urgency": "critical" | "high" | "moderate" | "low",
      "description": string
    },
    "transformationStage": {
      "stage": string,
      "icon": string,
      "description": string,
      "guidance": string
    },
    "signatures": [
      {
        "name": string,
        "confidence": number,
        "description": string,
        "urgency": string,
        "action": string
      }
    ],
    "trajectory": {
      "direction": string,
      "momentum": number,
      "predictedNext": string
    },
    "frameworks": [
      {
        "name": string,
        "effectiveness": number,
        "usage": number // times used
      }
    ],
    "windows": [
      {
        "time": string,
        "type": string,
        "activities": string[]
      }
    ],
    "comparative": {
      "percentile": number,
      "similar": number
    }
  }
}
```

---

### 4. Track Intelligence Update

**Endpoint:** `POST /api/intelligence/track`

**Description:** Track real-time intelligence changes (for streaming/websocket).

**Request:**
```typescript
POST /api/intelligence/track
Content-Type: application/json

{
  "userId": "string",
  "event": "coherence_change" | "signature_detected" | "stage_transition",
  "data": {
    // Event-specific data
  }
}
```

**Response:**
```typescript
{
  "success": true,
  "tracked": true,
  "timestamp": string
}
```

---

### 5. Get Awareness Profile

**Endpoint:** `GET /api/intelligence/awareness/:userId`

**Description:** Get detailed awareness level profile for a user.

**Request:**
```bash
GET /api/intelligence/awareness/user123
```

**Response:**
```typescript
{
  "success": true,
  "awareness": {
    "level": "intermediate",
    "score": 60,
    "frameworkFamiliarity": {
      "alchemy": 0.45,
      "spiralogic": 0.50,
      "jung": 0.65,
      "ifs": 0.70,
      "polyvagal": 0.55,
      "mcgilchrist": 0.40,
      "levin": 0.30
    },
    "indicators": [
      "Uses framework language occasionally",
      "Asks clarifying questions about concepts",
      "Shows pattern recognition"
    ],
    "suggestedLanguageStyle": "Framework concepts with brief explanations",
    "progression": {
      "startLevel": "beginner",
      "currentLevel": "intermediate",
      "timeInLevel": "45 days",
      "nextMilestone": "advanced"
    }
  }
}
```

---

### 6. Get Framework Effectiveness

**Endpoint:** `GET /api/intelligence/frameworks/:userId`

**Description:** Get personalized framework effectiveness scores.

**Request:**
```bash
GET /api/intelligence/frameworks/user123?top=10
```

**Response:**
```typescript
{
  "success": true,
  "frameworks": [
    {
      "name": "Shadow Work (Jung)",
      "effectiveness": 0.82,
      "usageCount": 15,
      "avgCoherenceChange": 0.15,
      "userResonance": "high",
      "suggestedUsage": "Primary framework for this user"
    },
    // ... more frameworks
  ],
  "recommendations": [
    "Prioritize Shadow Work and IFS for this user",
    "CFT showing increasing effectiveness",
    "ACT less effective - use sparingly"
  ]
}
```

---

### 7. Get Comparative Analytics

**Endpoint:** `GET /api/intelligence/comparative/:userId`

**Description:** Get comparative analytics for user vs similar journeys.

**Request:**
```bash
GET /api/intelligence/comparative/user123
```

**Response:**
```typescript
{
  "success": true,
  "comparative": {
    "userCoherence": 0.65,
    "percentile": 72, // Better than 72% of similar users
    "similarJourneys": 127,
    "comparisons": {
      "averageCoherence": 0.58,
      "typicalDuration": {
        "nigredo": 14,
        "albedo": 21,
        "citrinitas": 28,
        "rubedo": 35
      },
      "commonSignatures": [
        "Nigredo-Rubedo Oscillation",
        "Self-Attack Cascade"
      ]
    },
    "insights": [
      "Your coherence is higher than average for this stage",
      "Similar users typically spent 21 days in Albedo",
      "You're progressing faster than 68% of comparable journeys"
    ]
  }
}
```

---

## Request/Response Formats

### Error Response Format

All endpoints return errors in this format:

```typescript
{
  "success": false,
  "error": {
    "code": string, // e.g., "INVALID_USER", "INSUFFICIENT_DATA"
    "message": string, // Human-readable error message
    "details": any, // Optional additional details
    "timestamp": string
  }
}
```

**Common Error Codes:**
- `INVALID_USER`: User ID not found
- `INSUFFICIENT_DATA`: Not enough data to analyze
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `UNAUTHORIZED`: Invalid or missing authentication
- `INTERNAL_ERROR`: Server error

### Pagination

For endpoints returning lists:

```typescript
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": number,
    "pageSize": number,
    "total": number,
    "hasMore": boolean
  }
}
```

---

## Integration Examples

### Example 1: React Component with Intelligence

```typescript
// components/UserIntelligence.tsx
import { useEffect, useState } from 'react';
import { unifiedIntelligence } from '@/lib/intelligence/UnifiedIntelligenceEngine';

export function UserIntelligence({ userId }: { userId: string }) {
  const [intelligence, setIntelligence] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIntelligence() {
      try {
        const data = await unifiedIntelligence.analyze(userId);
        setIntelligence(data);
      } catch (error) {
        console.error('Error loading intelligence:', error);
      } finally {
        setLoading(false);
      }
    }

    loadIntelligence();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadIntelligence, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!intelligence) return <div>No data available</div>;

  return (
    <div>
      <h2>Transformation Intelligence</h2>
      <div>Coherence: {(intelligence.coherence * 100).toFixed(1)}%</div>
      <div>Stage: {intelligence.transformationStage}</div>
      <div>Awareness: {intelligence.awarenessLevel}</div>
    </div>
  );
}
```

### Example 2: API Integration (External)

```typescript
// external-app/intelligence-client.ts
class MAIAIntelligenceClient {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string, baseURL = 'https://api.maia.soullab.com') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async analyze(userId: string): Promise<IntelligenceData> {
    const response = await fetch(`${this.baseURL}/api/intelligence/analyze`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.intelligence;
  }

  async getMAIAResponse(userId: string, message: string): Promise<string> {
    const response = await fetch(`${this.baseURL}/api/oracle/personal`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        input: message
      })
    });

    const data = await response.json();
    return data.text;
  }
}

// Usage
const client = new MAIAIntelligenceClient(process.env.MAIA_API_KEY);
const intelligence = await client.analyze('user123');
console.log('Coherence:', intelligence.coherence);
console.log('Stage:', intelligence.transformationStage);
```

### Example 3: Webhook Integration

```typescript
// webhook-handler.ts
import express from 'express';

const app = express();
app.use(express.json());

// Register webhook endpoint with MAIA
async function registerWebhook() {
  await fetch('https://api.maia.soullab.com/api/webhooks/register', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.MAIA_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: 'https://yourapp.com/webhooks/maia',
      events: ['coherence_critical', 'signature_detected', 'stage_transition']
    })
  });
}

// Handle incoming webhooks
app.post('/webhooks/maia', (req, res) => {
  const { event, data } = req.body;

  switch (event) {
    case 'coherence_critical':
      // User's coherence dropped below 0.30
      handleCriticalCoherence(data);
      break;

    case 'signature_detected':
      // New transformation signature detected
      handleSignatureDetection(data);
      break;

    case 'stage_transition':
      // User transitioned between alchemical stages
      handleStageTransition(data);
      break;
  }

  res.status(200).json({ received: true });
});

function handleCriticalCoherence(data: any) {
  console.log(`CRITICAL: User ${data.userId} coherence at ${data.coherence}`);
  // Send alert, notify practitioner, etc.
}
```

### Example 4: Real-time Intelligence Streaming

```typescript
// real-time-intelligence.ts
import { io } from 'socket.io-client';

const socket = io('wss://api.maia.soullab.com', {
  auth: {
    token: process.env.MAIA_API_KEY
  }
});

// Subscribe to user's intelligence updates
socket.emit('subscribe', { userId: 'user123' });

// Receive real-time updates
socket.on('intelligence:update', (data) => {
  console.log('Intelligence updated:', data);
  updateUI(data);
});

socket.on('intelligence:coherence_change', (data) => {
  console.log('Coherence changed:', data.oldCoherence, '→', data.newCoherence);
});

socket.on('intelligence:signature_detected', (data) => {
  console.log('New signature detected:', data.signature);
  showAlert(data);
});
```

---

## Error Handling

### Best Practices

```typescript
async function safeIntelligenceAnalysis(userId: string) {
  try {
    const intelligence = await unifiedIntelligence.analyze(userId);
    return { success: true, data: intelligence };
  } catch (error) {
    if (error.code === 'INSUFFICIENT_DATA') {
      // Not enough conversation history yet
      return {
        success: false,
        error: 'Need more data',
        fallback: getDefaultIntelligence()
      };
    }

    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      // Too many requests
      return {
        success: false,
        error: 'Rate limited',
        retryAfter: error.retryAfter
      };
    }

    // Unknown error
    console.error('Intelligence analysis error:', error);
    return {
      success: false,
      error: 'Unknown error',
      details: error.message
    };
  }
}
```

---

## Rate Limiting

**Limits:**
- **Free tier:** 100 requests/hour per user
- **Pro tier:** 1000 requests/hour per user
- **Enterprise:** Custom limits

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1698789600
```

**Rate Limit Exceeded Response:**
```typescript
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 3600, // seconds
    "limit": 100,
    "remaining": 0,
    "reset": 1698789600 // Unix timestamp
  }
}
```

---

## Webhooks

### Available Events

1. **`coherence_critical`**: Coherence drops below 0.30
2. **`coherence_high`**: Coherence rises above 0.75
3. **`signature_detected`**: New transformation signature detected (confidence > 75%)
4. **`stage_transition`**: User transitions between alchemical stages
5. **`awareness_levelup`**: User progresses to next awareness level
6. **`intervention_window`**: User enters optimal intervention window

### Webhook Payload Format

```typescript
{
  "event": string,
  "timestamp": string, // ISO 8601
  "userId": string,
  "data": {
    // Event-specific data
  },
  "signature": string // HMAC SHA256 for verification
}
```

### Webhook Verification

```typescript
import crypto from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return signature === digest;
}

// In your webhook handler
app.post('/webhooks/maia', (req, res) => {
  const signature = req.headers['x-maia-signature'];
  const payload = JSON.stringify(req.body);

  if (!verifyWebhook(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process webhook
  // ...
});
```

---

## SDK Support

### Official SDKs

- **JavaScript/TypeScript**: `@maia/intelligence-sdk`
- **Python**: `maia-intelligence`
- **Ruby**: `maia-intelligence-ruby`
- **PHP**: `maia/intelligence-sdk`

### Installation

```bash
# JavaScript/TypeScript
npm install @maia/intelligence-sdk

# Python
pip install maia-intelligence

# Ruby
gem install maia-intelligence

# PHP
composer require maia/intelligence-sdk
```

### Quick Start (JavaScript)

```typescript
import { MAIAIntelligence } from '@maia/intelligence-sdk';

const maia = new MAIAIntelligence({
  apiKey: process.env.MAIA_API_KEY
});

// Analyze intelligence
const intelligence = await maia.analyze('user123');

// Get MAIA response
const response = await maia.chat('user123', 'I need help');

// Subscribe to updates
maia.on('coherence_critical', (data) => {
  console.log('Critical coherence:', data);
});
```

---

## Support

- **Documentation**: https://docs.maia.soullab.com
- **API Status**: https://status.maia.soullab.com
- **Support Email**: api-support@soullab.org
- **GitHub**: https://github.com/soullab/maia-intelligence

---

*API Documentation v2.0 - Complete*
