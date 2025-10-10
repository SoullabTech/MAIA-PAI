# MAIA Analytics System - Complete Implementation

## ✅ What's Been Built

A comprehensive analytics system that tracks every aspect of MAIA's voice conversations, enabling data-driven decisions about model selection, conversation modes, and user engagement.

---

## 📊 Database Schema (Supabase)

### Migration File
`supabase/migrations/20251010_add_voice_analytics_fields.sql`

### New Fields Added to `journal_entries` Table

**Model Performance:**
- `ai_model` - Which AI model (gpt-4o, gpt-5, claude-3-5-sonnet)
- `ai_provider` - Provider (openai, anthropic)
- `response_time_ms` - API response time in milliseconds
- `input_tokens`, `output_tokens`, `total_tokens` - Token usage
- `cost_usd` - Estimated cost per exchange
- `api_retries` - Number of retries due to errors

**Conversation Quality:**
- `conversation_mode` - walking, classic, adaptive, her
- `response_word_count` - Words in MAIA's response
- `response_sentence_count` - Sentences in MAIA's response
- `user_word_count` - Words in user's input
- `brevity_score` - 0.0 to 1.0 (higher = more brief)
- `emotional_resonance` - deep, moderate, light, disconnected

**Voice Interaction:**
- `user_spoke_duration_ms` - How long user spoke
- `maia_spoke_duration_ms` - How long MAIA responded
- `listening_pauses` - Times recognition was paused
- `interruptions` - Times user interrupted MAIA
- `silence_duration_ms` - Silence before user spoke
- `transcription_confidence` - Speech recognition accuracy (0-1)
- `audio_quality` - excellent, good, fair, poor

**Session Context:**
- `session_id` - Unique session identifier
- `exchange_number` - Position in conversation (1st, 2nd, 3rd)
- `time_in_session_ms` - Time since session started
- `device_type` - mobile, desktop, tablet
- `voice_enabled` - Whether voice was used
- `tts_enabled` - Whether text-to-speech was active

### Analytics Views (Supabase)

Three pre-computed views for fast queries:

1. **`analytics_model_performance`** - Model comparison by user and conversation mode
2. **`analytics_voice_quality`** - Voice interaction quality metrics by user
3. **`analytics_mode_effectiveness`** - Conversation mode effectiveness by user

---

## 🔧 Backend Services

### 1. Conversation Analytics Service
`lib/services/conversation-analytics-service.ts`

**Functions:**
- `saveConversationWithAnalytics()` - Save conversation with full metadata
- `getModelPerformanceComparison()` - Query model stats from Supabase
- `getModeEffectiveness()` - Query mode effectiveness
- `getVoiceQualityStats()` - Query voice quality
- `getLiveVoiceAnalytics()` - Get real-time metrics from voice component
- `detectDeviceType()` - Auto-detect user's device

### 2. PersonalOracleAgent Updates
`lib/agents/PersonalOracleAgent.ts` (lines 997-1265)

**Tracks:**
- API response times
- Token usage (input/output/total)
- API retries
- Model used and provider
- Response quality (word count, brevity score)
- Estimated cost

**Logs to console:**
```
📊 Analytics: 8 words, 1234ms, $0.000042, brevity=0.85
```

### 3. SimplifiedOrganicVoice Updates
`components/ui/SimplifiedOrganicVoice.tsx` (lines 93-101, 203, 336-342, 688, 799-819)

**Tracks:**
- Session ID and start time
- Exchange count
- User speech duration
- MAIA speech duration
- Listening pauses
- Interruptions

**Exposes via window global:**
```typescript
window.__getVoiceAnalytics() => {
  sessionId, sessionDurationMs, exchangeCount,
  totalUserSpeechDurationMs, totalMaiaSpeechDurationMs,
  listeningPauses, interruptions,
  avgUserSpeechDurationMs, avgMaiaSpeechDurationMs
}
```

---

## 📱 Analytics Dashboard

### Location
`app/analytics/page.tsx`

### Features

**1. Time Range Selector**
- Last 7 Days
- Last 30 Days
- All Time

**2. Model Performance Comparison**
Shows for each AI model + conversation mode combo:
- Total uses
- Avg response time
- Avg word count
- Brevity score
- Avg cost per exchange
- Error rate
- Total cost

**3. Conversation Mode Effectiveness**
Shows for each mode (walking/classic/adaptive/her):
- Total uses
- Avg brevity score
- User engagement (avg words)
- Avg session length
- Deep resonance rate

**4. Voice Interaction Quality**
- Avg user speech duration
- Avg MAIA response duration
- Avg interruptions
- Avg listening pauses
- Transcription confidence
- Poor audio rate
- Total voice sessions

**5. Live Session Metrics**
Real-time updates every 5 seconds:
- Current session duration
- Exchange count
- Total user speaking time
- Total MAIA speaking time

**6. Decision-Making Insights**
Auto-calculated recommendations:
- Best model for brevity
- Fastest model
- Most cost-effective model
- Most engaging conversation mode
- Deepest resonance mode

---

## 🔄 Data Flow

```
1. User speaks → SimplifiedOrganicVoice tracks timing
                 ↓
2. Message sent → PersonalOracleAgent processes with selected model
                 ↓
3. Model responds → PersonalOracleAgent calculates metrics
                 ↓
4. Response returned → metadata includes all analytics
                 ↓
5. Save to Supabase → saveConversationWithAnalytics()
                 ↓
6. Analytics views → Pre-computed aggregations
                 ↓
7. Dashboard → Queries views and displays insights
```

---

## 📝 How to Use

### 1. Run the Migration

```bash
cd supabase
supabase db push
```

This creates all new columns and analytics views.

### 2. Save Conversations with Analytics

In your conversation handler (wherever PersonalOracleAgent is called):

```typescript
import {
  saveConversationWithAnalytics,
  getLiveVoiceAnalytics,
  detectDeviceType
} from '@/lib/services/conversation-analytics-service';

// After getting response from PersonalOracleAgent
const voiceMetrics = getLiveVoiceAnalytics();

await saveConversationWithAnalytics({
  userId: user.id,
  prompt: userMessage,
  response: maiaResponse.response,

  // From PersonalOracleAgent response metadata
  aiModel: maiaResponse.metadata.modelMetrics.model,
  aiProvider: maiaResponse.metadata.modelMetrics.provider,
  responseTimeMs: maiaResponse.metadata.modelMetrics.responseTimeMs,
  inputTokens: maiaResponse.metadata.modelMetrics.inputTokens,
  outputTokens: maiaResponse.metadata.modelMetrics.outputTokens,
  totalTokens: maiaResponse.metadata.modelMetrics.totalTokens,
  costUsd: maiaResponse.metadata.modelMetrics.costUsd,
  apiRetries: maiaResponse.metadata.modelMetrics.retries,

  conversationMode: maiaResponse.metadata.qualityMetrics.conversationMode,
  responseWordCount: maiaResponse.metadata.qualityMetrics.responseWordCount,
  responseSentenceCount: maiaResponse.metadata.qualityMetrics.responseSentenceCount,
  userWordCount: maiaResponse.metadata.qualityMetrics.userWordCount,
  brevityScore: maiaResponse.metadata.qualityMetrics.brevityScore,

  // From voice analytics (if voice was used)
  userSpokeDurationMs: voiceMetrics?.totalUserSpeechDurationMs,
  maiaSpokeDurationMs: voiceMetrics?.totalMaiaSpeechDurationMs,
  listeningPauses: voiceMetrics?.listeningPauses,
  interruptions: voiceMetrics?.interruptions,

  // Session context
  sessionId: voiceMetrics?.sessionId,
  exchangeNumber: voiceMetrics?.exchangeCount,
  timeInSessionMs: voiceMetrics?.sessionDurationMs,
  deviceType: detectDeviceType(),
  voiceEnabled: !!voiceMetrics,
  ttsEnabled: true // or based on user settings
});
```

### 3. View Analytics

Navigate to `/analytics` in your app to see the dashboard.

---

## 🎯 Making Data-Driven Decisions

### Example Queries You Can Answer

**"Is GPT-5 worth the extra cost over GPT-4o?"**
```typescript
const models = await getModelPerformanceComparison(userId, 7); // last 7 days

const gpt5 = models.find(m => m.ai_model === 'gpt-5');
const gpt4o = models.find(m => m.ai_model === 'gpt-4o');

if (gpt5.avg_brevity_score > gpt4o.avg_brevity_score + 0.1 &&
    gpt5.avg_response_time_ms < gpt4o.avg_response_time_ms) {
  console.log('✅ GPT-5 is briefer AND faster - worth the cost');
}
```

**"Is Walking mode actually staying brief?"**
```typescript
const modes = await getModeEffectiveness(userId);
const walking = modes.find(m => m.conversation_mode === 'walking');

if (walking.avg_brevity >= 0.75) {
  console.log('✅ Walking mode achieving 5-8 word target');
} else {
  console.log('❌ Walking mode too verbose - tune prompts');
}
```

**"Are users interrupting MAIA too much?"**
```typescript
const voice = await getVoiceQualityStats(userId);

if (voice.avg_interruptions > 2) {
  console.log('⚠️ High interruption rate - responses may be too long');
}
```

---

## 📈 Future Enhancements

1. **Trend Charts** - Line graphs showing metrics over time
2. **A/B Testing Framework** - Automated prompt variation testing
3. **Alerts** - Notify when metrics degrade (cost spike, quality drop)
4. **Cohort Analysis** - Compare metrics across user segments
5. **Sentiment Tracking** - Track emotional tone evolution
6. **Export to CSV** - Download raw data for external analysis

---

## 🚀 What's Working Right Now

**Fully Implemented:**
- ✅ Database schema and migrations
- ✅ Analytics tracking in PersonalOracleAgent
- ✅ Voice metrics tracking in SimplifiedOrganicVoice
- ✅ Supabase analytics views
- ✅ Service layer for saving and querying data
- ✅ Dashboard with real-time and historical analytics
- ✅ Decision-making insights

**Needs Integration:**
- ⚠️ Wire `saveConversationWithAnalytics()` into your main conversation flow
- ⚠️ Test with real conversations to populate data

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `supabase/migrations/20251010_add_voice_analytics_fields.sql` | Database schema |
| `lib/services/conversation-analytics-service.ts` | Service layer |
| `lib/agents/PersonalOracleAgent.ts` | Model performance tracking |
| `components/ui/SimplifiedOrganicVoice.tsx` | Voice interaction tracking |
| `app/analytics/page.tsx` | Analytics dashboard UI |
| `docs/analytics-tracking-system.md` | Detailed documentation |
| `docs/ANALYTICS-SYSTEM-COMPLETE.md` | This file |

---

**You now have everything needed to make data-driven decisions about MAIA's development!** 🎉
