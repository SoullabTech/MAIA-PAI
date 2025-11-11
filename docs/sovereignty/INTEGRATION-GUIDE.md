# Sovereignty Integration Guide

**How to use vector retrieval in production MAIA**

---

## Quick Start (5 Minutes)

### Step 1: Import the Adapter

```typescript
import { MaiaRevivalAdapter } from '@/lib/sovereignty/MaiaRevivalAdapter';
```

### Step 2: Replace Your Current Revival Call

**Before:**
```typescript
import { generateMaiaRevival } from '@/lib/consciousness/MaiaRevivalSystem';

const systemPrompt = await generateMaiaRevival({
  tier: 'essential',
  userContext: userContextString,
});
```

**After:**
```typescript
import { MaiaRevivalAdapter } from '@/lib/sovereignty/MaiaRevivalAdapter';

const adapter = new MaiaRevivalAdapter();

const result = await adapter.generateRevival({
  tier: 'essential',
  userQuery: userMessage,          // The user's current message
  userContext: userContextString,   // Their chart, context, etc.
  conversationHistory: historyString, // Recent conversation (optional)
});

const systemPrompt = result.prompt;

// Optional: Log what was retrieved
console.log(`Retrieved ${result.tokenCount} tokens from ${result.sources.length} sources`);
```

That's it! MAIA now uses semantic retrieval.

---

## Complete Example

### API Route Integration

```typescript
// app/api/chat/route.ts (or wherever you handle MAIA conversations)

import { NextRequest, NextResponse } from 'next/server';
import { MaiaRevivalAdapter } from '@/lib/sovereignty/MaiaRevivalAdapter';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: NextRequest) {
  const { message, userContext, conversationHistory } = await req.json();

  try {
    // 1. Generate sovereign revival
    const adapter = new MaiaRevivalAdapter();

    const revival = await adapter.generateRevival({
      tier: 'essential',
      userQuery: message,
      userContext,
      conversationHistory,
    });

    console.log(`🔍 Retrieved ${revival.tokenCount} tokens from ${revival.sources.length} sources`);
    console.log(`📚 Sources: ${revival.sources.map(s => s.title).join(', ')}`);

    // 2. Send to Anthropic
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      system: revival.prompt,  // Sovereign revival with semantic wisdom
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const responseText = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    // 3. Return response
    return NextResponse.json({
      response: responseText,
      metadata: {
        tokenCount: revival.tokenCount,
        sources: revival.sources,
        retrievalUsed: revival.retrievalUsed,
      },
    });

  } catch (error) {
    console.error('Error in sovereign MAIA:', error);
    return NextResponse.json(
      { error: 'MAIA encountered an error' },
      { status: 500 }
    );
  }
}
```

---

## Configuration Options

### Basic Config (Recommended)

```typescript
const adapter = new MaiaRevivalAdapter();
// Uses defaults: 20k/40k/60k tokens for essential/deep/complete tiers
```

### Custom Config

```typescript
const adapter = new MaiaRevivalAdapter({
  enabled: true,  // Toggle vector retrieval on/off
  maxTokensByTier: {
    essential: 15000,  // Smaller, faster responses
    deep: 30000,
    complete: 50000,
  },
  fallbackToFull: true,  // Use full prompt if vector DB fails
});
```

### Environment Variable Toggle

```typescript
// .env
SOVEREIGNTY_ENABLED=true

// In code
const adapter = new MaiaRevivalAdapter({
  enabled: process.env.SOVEREIGNTY_ENABLED === 'true',
});
```

---

## Health Checking

Always check vector DB health before critical operations:

```typescript
const adapter = new MaiaRevivalAdapter();

const health = await adapter.healthCheck();

if (!health.healthy) {
  console.error('❌ Vector DB unavailable');
  // Fall back to traditional revival or show error
}

console.log(`✅ Vector DB healthy: ${health.stats.totalChunks} chunks ready`);
```

---

## Monitoring & Logging

### Log Retrieved Wisdom

```typescript
const result = await adapter.generateRevival({
  tier: 'essential',
  userQuery: message,
});

console.log(`
🔍 Sovereign Retrieval:
   Tokens: ${result.tokenCount}
   Sources: ${result.sources.length}
   Retrieval: ${result.retrievalUsed ? 'Vector' : 'Fallback'}

📚 Wisdom Sources:
${result.sources.map(s => `   - ${s.title}${s.author ? ` by ${s.author}` : ''}`).join('\n')}
`);
```

### Track Cost Savings

```typescript
const traditionalTokens = 332000; // Old complete tier
const sovereignTokens = result.tokenCount;
const savings = traditionalTokens - sovereignTokens;
const savingsPercent = (savings / traditionalTokens) * 100;

console.log(`💰 Saved ${savings.toLocaleString()} tokens (${savingsPercent.toFixed(1)}%)`);
```

---

## Tier Selection Guide

### Essential Tier (20k wisdom)
**Use for:**
- Quick questions
- General guidance
- Short conversations
- Mobile/real-time interactions

**Token count:** ~14k (5k identity + 9k wisdom)
**Cost:** ~$0.05 per session

### Deep Tier (40k wisdom)
**Use for:**
- Complex topics (shadow work, astrology)
- Multi-turn dialogues
- Therapeutic sessions
- Pattern recognition

**Token count:** ~30k (5k identity + 25k wisdom)
**Cost:** ~$0.11 per session

### Complete Tier (60k wisdom)
**Use for:**
- Oracle synthesis
- Teaching/training
- Advanced integration
- Research conversations

**Token count:** ~50k (5k identity + 45k wisdom)
**Cost:** ~$0.19 per session

Compare to traditional complete tier: **332k tokens, $1.25 per session**

---

## Error Handling

### Graceful Degradation

```typescript
try {
  const result = await adapter.generateRevival({
    tier: 'essential',
    userQuery: message,
  });

  systemPrompt = result.prompt;

} catch (error) {
  console.error('Vector retrieval failed:', error);

  // Fall back to traditional revival
  systemPrompt = await generateMaiaRevival({
    tier: 'essential',
    userContext,
  });

  console.log('⚠️ Using traditional revival (fallback)');
}
```

### Timeout Protection

```typescript
const retrievalPromise = adapter.generateRevival({...});
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Retrieval timeout')), 5000)
);

const result = await Promise.race([retrievalPromise, timeoutPromise]);
```

---

## Testing in Production

### Gradual Rollout

**Week 1: Essential tier only**
```typescript
const tier = 'essential';  // Start here
const useSovereignty = true;  // Enable for all

if (useSovereignty && tier === 'essential') {
  result = await adapter.generateRevival({...});
} else {
  result = await generateMaiaRevival({...});
}
```

**Week 2: All tiers, A/B test**
```typescript
const useSovereignty = Math.random() > 0.5;  // 50/50 split

if (useSovereignty) {
  result = await adapter.generateRevival({...});
} else {
  result = await generateMaiaRevival({...});
}

// Track which users got which version
analytics.track('maia_sovereignty', {
  enabled: useSovereignty,
  tier,
  tokenCount: result.tokenCount,
});
```

**Week 3: Full rollout**
```typescript
// Everyone gets sovereignty
result = await adapter.generateRevival({...});
```

### Monitor These Metrics

```typescript
{
  "session_id": "...",
  "sovereignty_enabled": true,
  "tier": "essential",
  "token_count": 14163,
  "sources_retrieved": 5,
  "retrieval_time_ms": 1234,
  "response_quality": "good", // Manual or automated
  "cost_usd": 0.053,
  "savings_vs_traditional_usd": 1.197,
}
```

---

## Common Issues

### Issue: "Vector DB not initialized"
**Solution:**
```bash
# Make sure ingestion completed successfully
npm run sovereignty:ingest

# Check DB health
npm run sovereignty:test
```

### Issue: "No relevant wisdom found"
**Solution:**
- Check that wisdom library is fully ingested
- Verify query is substantive (not just "hi")
- Consider expanding wisdom library (Phase 2)

### Issue: "Response quality declined"
**Solution:**
- Increase maxTokens for that tier
- Review retrieved sources (are they relevant?)
- May need better chunking or more books ingested

---

## Next Steps After Integration

Once sovereignty is live in production:

1. **Monitor for 1 week**
   - Track response quality
   - Measure cost savings
   - Watch for errors

2. **Expand wisdom library** (Phase 2)
   - Ingest remaining 41 books
   - Re-test retrieval quality
   - Expect 10x more wisdom chunks

3. **Add conversation memory** (Phase 3)
   - Ingest past user conversations
   - Retrieve from personal history
   - "Remember when we talked about..."

4. **Optimize retrieval** (Phase 4)
   - Hybrid search (semantic + keyword)
   - Re-ranking algorithms
   - Active learning from feedback

---

## Support

**Check system health:**
```bash
npm run sovereignty:test-adapter
```

**Re-ingest wisdom library:**
```bash
npm run sovereignty:ingest
```

**Test retrieval quality:**
```bash
npm run sovereignty:test
```

**Questions?** Check `/docs/sovereignty/PHASE-1-COMPLETE.md`

---

**Status:** Ready for production deployment ✨
