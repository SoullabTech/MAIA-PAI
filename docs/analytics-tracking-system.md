# MAIA Analytics Tracking System

## Overview

This system provides comprehensive analytics for data-driven decision making about MAIA's performance, conversation quality, and user engagement.

## What's Tracked

### 1. Voice Interaction Metrics (`VoiceInteractionMetrics`)
Captures real-time voice conversation quality:
- **User speech duration** - How long the user spoke (milliseconds)
- **MAIA response duration** - How long MAIA's TTS response took
- **Listening pauses** - Times recognition was paused (e.g., when MAIA speaks)
- **Interruptions** - Times user interrupted MAIA mid-response
- **Silence duration** - Pause before user started speaking
- **Transcription confidence** - Speech recognition accuracy (0-1)
- **Audio quality** - Subjective quality rating (excellent/good/fair/poor)

### 2. Model Performance Metrics (`ModelPerformanceMetrics`)
Tracks AI model efficiency and cost:
- **Model used** - Which AI model processed the request (gpt-4o, gpt-5, claude-3-5-sonnet)
- **Provider** - OpenAI or Anthropic
- **Response time** - Milliseconds from API request to first token
- **Token usage** - Input, output, and total tokens consumed
- **Cost** - Estimated USD cost based on current pricing
- **Retries** - Number of API retries due to errors
- **Cache hit** - Whether prompt caching was used (cost savings)

### 3. Conversation Quality Metrics (`ConversationQualityMetrics`)
Evaluates conversation effectiveness:
- **Conversation mode** - Walking, Classic, Adaptive, or Her
- **Response word count** - Words in MAIA's response
- **Response sentence count** - Sentences in MAIA's response
- **User word count** - Words in user's input
- **Brevity score** - 0-1 rating (1 = very brief, ideal for Walking mode)
- **Coherence score** - Estimated conversation flow quality
- **Emotional resonance** - Deep, moderate, light, or disconnected

### 4. Session Context Metrics (`SessionContextMetrics`)
Captures session-level information:
- **Session ID** - Unique identifier for this conversation session
- **Exchange number** - Position in conversation (1st, 2nd, 3rd exchange)
- **Time in session** - Milliseconds since session started
- **Device type** - Mobile, desktop, or tablet
- **Browser type** - User's browser
- **Voice enabled** - Whether voice interaction was used
- **TTS enabled** - Whether text-to-speech was active

## Analytics Queries

The `JournalStorage` class provides powerful analytics methods:

### `getModelComparison(userId, timeRangeMs?)`
Compare performance across AI models:
```typescript
{
  'gpt-4o': {
    totalUses: 45,
    avgResponseTime: 1234,
    avgWordCount: 8.2,
    avgBrevityScore: 0.85,
    avgCost: 0.000042,
    errorRate: 0.02
  },
  'gpt-5': { ... },
  'claude-3-5-sonnet': { ... }
}
```

**Use this to answer:**
- Which model is fastest?
- Which model stays briefest in Walking mode?
- Which model is most cost-effective?
- Which model has the lowest error rate?

### `getModeEffectiveness(userId)`
Evaluate conversation modes:
```typescript
{
  'walking': {
    totalUses: 120,
    avgBrevity: 0.82,
    avgUserEngagement: 15.3, // avg user words
    avgSessionLength: 180000, // ms
    deepResonanceRate: 0.65 // 65% deep emotional resonance
  },
  'classic': { ... },
  'adaptive': { ... }
}
```

**Use this to answer:**
- Which mode keeps users engaged longest?
- Which mode achieves deepest emotional resonance?
- Is Walking mode actually staying brief?
- Do users speak more in certain modes?

### `getVoiceQualityStats(userId)`
Voice interaction quality:
```typescript
{
  avgSpeechDuration: 4500,
  avgMaiaResponseDuration: 3200,
  avgInterruptions: 0.8,
  avgListeningPauses: 2.1,
  avgTranscriptionConfidence: 0.92,
  poorAudioRate: 0.05
}
```

**Use this to answer:**
- Are users interrupting MAIA too often?
- Is transcription quality acceptable?
- How long do natural exchanges last?
- Is audio quality affecting UX?

### `getTimeSeriesData(userId, metric, bucketSizeDays)`
Track trends over time:
```typescript
[
  {
    startDate: Date,
    endDate: Date,
    value: 0.82, // e.g., avg brevity score
    count: 15 // exchanges in this bucket
  },
  // ... more buckets
]
```

**Metrics available:**
- `'brevity'` - Is MAIA getting more or less brief over time?
- `'engagement'` - Are users speaking more or less?
- `'cost'` - Is cost per interaction rising or falling?
- `'responseTime'` - Is API latency improving?

## Analytics Dashboard

Access at `/analytics` - real-time visualization of:

1. **Model Performance Comparison**
   - Side-by-side stats for GPT-4o, GPT-5, Claude
   - Response time, word count, brevity, cost, errors

2. **Conversation Mode Effectiveness**
   - Walking vs Classic vs Adaptive vs Her
   - Brevity, user engagement, session length, deep resonance

3. **Voice Interaction Quality**
   - Speech durations, interruptions, pauses
   - Transcription confidence, audio quality

4. **Live Session Metrics**
   - Current session duration
   - Exchange count
   - Total speaking time (user + MAIA)

5. **Decision-Making Insights**
   - Best model for brevity
   - Fastest model
   - Most cost-effective model
   - Most engaging mode
   - Deepest resonance mode

## How Data Flows

```
User speaks → SimplifiedOrganicVoice (tracks voice metrics)
             ↓
Message sent → PersonalOracleAgent (tracks model performance)
             ↓
Response generated → Calculate quality metrics
             ↓
Journal entry saved → StoredJournalEntry with all metadata
             ↓
Analytics queries → Aggregate and analyze data
             ↓
Dashboard → Visualize insights
```

## Making Data-Driven Decisions

### Example: "Should we use GPT-5 or Claude for Walking mode?"

```typescript
const comparison = journalStorage.getModelComparison('user123', 7 * 24 * 60 * 60 * 1000); // last 7 days
const gpt5 = comparison['gpt-5'];
const claude = comparison['claude-3-5-sonnet'];

if (gpt5.avgBrevityScore > claude.avgBrevityScore) {
  console.log('GPT-5 is briefer');
}
if (gpt5.avgResponseTime < claude.avgResponseTime) {
  console.log('GPT-5 is faster');
}
if (gpt5.avgCost < claude.avgCost) {
  console.log('GPT-5 is cheaper');
}
```

### Example: "Is Walking mode achieving its brevity goal?"

```typescript
const modes = journalStorage.getModeEffectiveness('user123');
const walking = modes['walking'];

if (walking.avgBrevity >= 0.75) {
  console.log('✅ Walking mode is staying brief (avg 5-8 words)');
} else {
  console.log('❌ Walking mode is too verbose, tune prompts');
}

if (walking.deepResonanceRate >= 0.6) {
  console.log('✅ Brevity isn\'t sacrificing emotional depth');
}
```

### Example: "Are voice interruptions a problem?"

```typescript
const voice = journalStorage.getVoiceQualityStats('user123');

if (voice.avgInterruptions > 2) {
  console.log('⚠️ Users interrupt MAIA often - responses may be too long');
}

if (voice.avgTranscriptionConfidence < 0.8) {
  console.log('⚠️ Poor transcription quality - investigate audio issues');
}
```

## Future Enhancements

1. **Export to CSV** - Download analytics for external analysis
2. **A/B Testing Framework** - Automatically test prompt variations
3. **Alerting System** - Notify when metrics degrade (e.g., cost spike, quality drop)
4. **User Cohort Analysis** - Compare metrics across user segments
5. **Sentiment Analysis** - Track emotional tone over time
6. **Conversation Thread Analysis** - Identify transformational moments

## Files Modified

- `lib/storage/journal-storage.ts` - Added metrics interfaces and analytics queries
- `lib/agents/PersonalOracleAgent.ts` - Added model performance tracking
- `components/ui/SimplifiedOrganicVoice.tsx` - Added voice interaction tracking
- `app/analytics/page.tsx` - Created dashboard UI

## Accessing Live Metrics

```typescript
// From browser console or parent components:
const liveMetrics = (window as any).__getVoiceAnalytics();
console.log(liveMetrics);
// {
//   sessionId: "voice_1234567890",
//   sessionDurationMs: 45000,
//   exchangeCount: 3,
//   totalUserSpeechDurationMs: 12000,
//   totalMaiaSpeechDurationMs: 8000,
//   ...
// }
```

---

**This system enables you to make informed decisions about:**
- Which AI model to use for different conversation modes
- Whether prompt changes improve brevity without sacrificing depth
- If voice interaction quality is acceptable
- Where to invest in optimization (speed vs cost vs quality)
- How MAIA's performance evolves over time
