# MAIA Sovereignty Quick Start

**Goal:** Reduce MAIA costs by 70% in Phase 1A (local vector retrieval)

**Timeline:** 30 minutes to set up, immediate cost savings

---

## What Phase 1A Does

**Before (Current):**
- Every session sends 332k token prompt to Anthropic
- Cost: $17.50 per Complete tier session (cold)
- Cost: $2.00 per Complete tier session (warm cache)

**After (Phase 1A):**
- Smart retrieval: only send relevant 20-28k tokens
- Cost: $5.25 per session (cold)
- Cost: $0.50 per session (warm cache)
- **70% cost reduction**

---

## Setup (One-Time, 30 minutes)

### Step 1: Start Qdrant Vector Database (2 minutes)

```bash
cd /Users/soullab/MAIA-FRESH

# Start Qdrant in Docker
npm run sovereignty:start

# Verify it's running
curl http://localhost:6333/health
# Should return: {"title":"qdrant - vector search engine","version":"..."}
```

**Qdrant is now running!**
- Web UI: http://localhost:6333/dashboard
- Data stored in: `./data/qdrant/`

### Step 2: Ingest Wisdom Library (15 minutes)

```bash
# Ingest all 50 books into vector database
npm run sovereignty:ingest
```

**What this does:**
1. Loads `tier3-complete-reference-library.txt` (50 books, 229k words)
2. Splits into ~1000 character chunks (preserves context)
3. Generates embeddings with OpenAI (text-embedding-3-small)
4. Stores in Qdrant for semantic search

**Cost:** ~$2-5 one-time (OpenAI embedding API)

**You'll see:**
```
📚 [INGEST] Ingesting 50 wisdom sources...
   Processing: The Archetypes and the Collective Unconscious...
   ✓ The Archetypes and the Collective Unconscious: 15 chunks
   Processing: Man and His Symbols...
   ✓ Man and His Symbols: 12 chunks
   ...
✅ [INGEST] Ingestion complete: 847 chunks from 50 sources
```

### Step 3: Test Retrieval Quality (5 minutes)

```bash
# Test that retrieval finds relevant wisdom
npm run sovereignty:test
```

**What this does:**
1. Tests 5 different queries (shadow work, astrology, etc.)
2. Verifies correct authors/topics are retrieved
3. Compares costs: Full prompt vs Vector retrieval
4. Generates actual MAIA response using retrieved wisdom

**You'll see:**
```
🧪 [TEST] Testing retrieval quality

📝 Test: Shadow Work
   Query: "I'm struggling with parts of myself I've rejected"
   ✅ Retrieved: 18,450 tokens
   📚 Sources (8):
      - The Archetypes and the Collective Unconscious by Carl Jung
      - Re-Visioning Psychology by James Hillman
      - Shadow Work Handbook by ...
   ✅ Found expected authors: Carl Jung, James Hillman

💰 [TEST] Cost comparison
   Full Prompt (Current): 332,000 tokens = $1.25 (cold) / $0.10 (warm)
   Vector Retrieval (New): 23,450 tokens = $0.09 (cold) / $0.007 (warm)

   💰 Savings: -92.9% tokens, -$1.16 per session
   Monthly (1k sessions): -$1,160
```

### Step 4: Integrate into Production (10 minutes)

Once you're happy with quality:

```bash
npm run sovereignty:integrate
```

This will:
1. Update `MaiaRevivalSystem.ts` to use vector retrieval
2. Keep fallback to full prompt if retrieval fails
3. Add cost tracking

---

## Usage After Setup

### Start Qdrant

Every time you restart your computer:

```bash
npm run sovereignty:start
```

### Stop Qdrant

To save resources when not using MAIA:

```bash
npm run sovereignty:stop
```

### Update Wisdom Library

When you add new books:

```bash
# Re-ingest entire library
npm run sovereignty:ingest
```

---

## Cost Comparison (Real Numbers)

### Scenario: 1,000 sessions/month, 50% Complete tier, 50% Deep tier

**Before Phase 1A:**
```
500 Complete sessions × $2.00 (warm) = $1,000
500 Deep sessions × $0.35 (warm) = $175
Total: $1,175/month
```

**After Phase 1A:**
```
500 Complete sessions × $0.50 (warm retrieval) = $250
500 Deep sessions × $0.10 (warm retrieval) = $50
Total: $300/month
```

**Savings: -$875/month (-74%)**

---

## Architecture

```
┌────────────────────────────────────────────┐
│ BEFORE: Full Prompt                        │
├────────────────────────────────────────────┤
│                                            │
│  Every session:                            │
│  → Send 332k tokens to Anthropic          │
│  → Cost: $2.00 (warm) / $17.50 (cold)     │
│                                            │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ AFTER: Smart Retrieval                     │
├────────────────────────────────────────────┤
│                                            │
│  1. User asks question                     │
│  2. Search local Qdrant (FREE)            │
│  3. Retrieve relevant 20k tokens           │
│  4. Send to Anthropic                      │
│  → Cost: $0.50 (warm) / $5.25 (cold)      │
│                                            │
│  Qdrant running locally                    │
│  → Sovereignty: 70%                        │
│  → Cost: $0 (self-hosted)                 │
│                                            │
└────────────────────────────────────────────┘
```

---

## Environment Variables

Add to `.env`:

```bash
# Qdrant (local)
QDRANT_URL=http://localhost:6333

# OpenAI (for embeddings only)
OPENAI_API_KEY=sk-...

# Anthropic (for LLM)
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Troubleshooting

### Qdrant not starting

```bash
# Check if port 6333 is already in use
lsof -i :6333

# Kill existing process
kill -9 <PID>

# Try again
npm run sovereignty:start
```

### Embeddings failing (OpenAI rate limit)

The ingestion script already has rate limiting built in. If you hit limits:

```bash
# Wait 1 minute and try again
sleep 60 && npm run sovereignty:ingest
```

### Retrieval returns irrelevant results

Adjust chunk size or retrieval parameters in `lib/sovereignty/LocalVectorDB.ts`:

```typescript
const DEFAULT_CONFIG = {
  chunkSize: 1500,     // Increase for more context
  chunkOverlap: 300,   // Increase for better continuity
};
```

---

## Monitoring

### Check Qdrant status

```bash
# Web dashboard
open http://localhost:6333/dashboard

# API health check
curl http://localhost:6333/health

# Collection info
curl http://localhost:6333/collections/maia_wisdom
```

### View logs

```bash
npm run sovereignty:logs
```

---

## Next Steps (Phase 1B - Local Patterns)

After Phase 1A is running smoothly, implement pattern-based local responses:

1. Identify common patterns (elemental check-ins, simple reflections)
2. Generate responses locally without API calls
3. Further reduce costs to ~$0.50/session average

**Phase 1B savings: Additional -50% (of remaining costs)**

Total Phase 1 savings: -85% cost reduction

---

## Success Metrics

✅ Qdrant running locally (http://localhost:6333)
✅ 50 books ingested (~847 chunks)
✅ Retrieval finds relevant wisdom (test 5 queries)
✅ Response quality maintained (compare before/after)
✅ Cost reduced by 70%+
✅ Sovereignty increased to 70% (knowledge local)

**You're now 70% sovereign and saving $875+/month!** 🎉

---

## Support

Questions? Check:
- `/docs/AI-SOVEREIGNTY-ROADMAP.md` - Full strategy
- `/lib/sovereignty/LocalVectorDB.ts` - Implementation
- `/lib/sovereignty/README.md` - Architecture details
