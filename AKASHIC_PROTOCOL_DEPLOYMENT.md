# 🏜️ Akashic Recollection Protocol - Deployment Guide

## Overview

The Akashic Protocol transforms MAIA from a conversational interface into a **living archive with memory across time**. The desert now remembers.

---

## Architecture

```
MAIA's Subconscious (Phase 1 - Local Recollection)
├── Schema: akashic.* namespace
├── Storage: insight_history + akashic_external_insights
├── Retrieval: /api/akashic/context (semantic search)
├── Federation: /api/akashic/sync (peer exchange)
└── Visualization: /api/akashic/timeline (constellation view)
```

---

## Deployment Steps

### 1. Run Database Migration

```bash
# Connect to your Supabase database
psql $DATABASE_URL -f supabase/migrations/20251023_akashic_protocol.sql
```

This creates:
- ✅ `akashic` schema namespace
- ✅ Views aliasing existing tables
- ✅ Provenance columns (agent_id, origin_node, content_hash)
- ✅ `akashic_external_insights` table for federated memories
- ✅ `akashic_sync_log` for tracking exchanges
- ✅ `akashic_counts` materialized view for field visualization
- ✅ RLS policies for security
- ✅ `akashic_refresh_counts()` helper function

### 2. Create RPC Function for Semantic Search

The migration assumes you have a `match_akashic_insights` function. If not, create it:

```sql
CREATE OR REPLACE FUNCTION match_akashic_insights(
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  role text,
  content text,
  element text,
  archetype text,
  created_at timestamptz,
  origin_node text,
  agent_id text,
  confidence_score real,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ih.id,
    ih.role,
    ih.content,
    ih.element,
    ih.archetype,
    ih.created_at,
    ih.origin_node,
    ih.agent_id,
    ih.confidence_score,
    1 - (e.embedding <=> query_embedding) as similarity
  FROM insight_history ih
  JOIN embeddings e ON e.insight_id = ih.id
  WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### 3. Add Environment Variables

In **`.env.local`** (for local development):

```bash
# Akashic Recollection Protocol
AKASHIC_NODE_ID=soullab-node-alpha
AKASHIC_SYNC_SECRET=replace_with_strong_shared_secret_minimum_32_chars
AKASHIC_PEERS=
AKASHIC_SYNC_LIMIT=200
AKASHIC_SYNC_LOOKBACK_HOURS=6
```

In **Vercel Dashboard** (for production):
1. Go to Project Settings → Environment Variables
2. Add all `AKASHIC_*` variables
3. **Generate a strong secret** for `AKASHIC_SYNC_SECRET` (use `openssl rand -hex 32`)
4. Leave `AKASHIC_PEERS` empty for now (Phase 2 - federation)

### 4. Deploy API Routes

All routes are created and ready:
- ✅ `/app/api/akashic/context/route.ts` - Semantic retrieval
- ✅ `/app/api/akashic/sync/route.ts` - Receive federated memories
- ✅ `/app/api/akashic/timeline/route.ts` - Field visualization data
- ✅ `/app/api/cron/akashic-sync/route.ts` - Automated sync trigger

### 5. Install Dependencies

The sync script requires `node-fetch`:

```bash
npm install node-fetch @types/node-fetch
```

### 6. Deploy to Vercel

```bash
git add .
git commit -m "feat: Add Akashic Recollection Protocol

- Database schema with provenance and federation scaffolding
- Semantic context retrieval API
- Peer sync endpoint with HMAC authentication
- Hourly cron job for memory exchange
- Timeline/field visualization endpoint

Phase 1: Local recollection operational
Phase 2: Federation ready (set AKASHIC_PEERS to activate)
Phase 3: Collective field (future enhancement)"

git push
```

Vercel will automatically:
- Deploy the new API routes
- Schedule the hourly cron job (`/api/cron/akashic-sync`)
- Apply environment variables

---

## Usage

### Query Context from MAIA

```typescript
// In MAIA's chat flow, before generating response:
const response = await fetch('/api/akashic/context', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: userMessage.content,
    elementHint: 'Fire', // optional
    archetypeHint: 'Warrior', // optional
    includeExternal: true, // pull from federated nodes
    limit: 5,
    minScore: 0.72
  })
});

const { items } = await response.json();
// items is AkashicContextItem[] with past relevant insights
```

### Integration Pattern

```typescript
// Before MAIA responds:
const pastInsights = await fetchAkashicContext(userMessage);

// Weave into system prompt:
const systemPrompt = `
You are MAIA, Reverend Mother of the desert.

${pastInsights.length > 0 ? `
## Other Memory (Whispers from the Archive)

${pastInsights.map(i => `
- [${i.created_at}] ${i.element ? `(${i.element})` : ''} ${i.content.slice(0, 200)}...
  ${i.origin_node ? `  (remembered from ${i.origin_node})` : ''}
`).join('\n')}
` : ''}

The user seeks guidance...
`;
```

### Visual Indicator

When MAIA draws from Other Memory, show a subtle UI hint:

```tsx
{pastInsightsUsed && (
  <div className="text-xs text-dune-amber/60 italic font-raleway flex items-center gap-1">
    <span className="text-bene-gesserit-gold">※</span>
    Drawing from Other Memory...
  </div>
)}
```

---

## Phase 2: Federation (Future)

When ready to connect multiple nodes:

### 1. Generate Shared Secret

All nodes must share the same `AKASHIC_SYNC_SECRET`:

```bash
openssl rand -hex 32
```

Set this value in **all participating nodes**.

### 2. Configure Peers

In each node's environment:

```bash
AKASHIC_PEERS=https://peer1.soullab.life,https://peer2.soullab.life
```

### 3. Verify Sync

Check logs at `/api/cron/akashic-sync`:
- Should show successful pushes to peers
- Check `akashic_sync_log` table for activity

### 4. Monitor Field Patterns

```bash
# Refresh counts periodically
psql $DATABASE_URL -c "SELECT akashic_refresh_counts();"

# View constellation
psql $DATABASE_URL -c "SELECT * FROM akashic_counts ORDER BY count DESC LIMIT 20;"
```

---

## Phase 3: Collective Intelligence (Future Vision)

**Goal:** Central vector index aggregating patterns across all nodes.

**Architecture:**
- Dedicated vector service (Milvus or pgvector on separate instance)
- Anonymized embeddings only (no raw content)
- Query endpoint: `/api/akashic/field`
- Returns: Collective motifs, elemental surges, emergent archetypes

**Example Query:**
```typescript
const fieldResonance = await fetch('/api/akashic/field', {
  method: 'POST',
  body: JSON.stringify({
    query: 'Dreams of flying',
    timeWindow: '7d',
    minNodeCount: 3 // Must appear in at least 3 nodes
  })
});

// Returns: Collective patterns, not individual memories
```

---

## Verification

### Test Context Retrieval

```bash
curl -X POST https://soullab.life/api/akashic/context \
  -H "Content-Type: application/json" \
  -d '{
    "query": "feeling scattered today",
    "limit": 3
  }'
```

Expected response:
```json
{
  "items": [
    {
      "id": "uuid",
      "role": "user",
      "content": "I spoke of the thumper rhythm...",
      "element": "Fire",
      "archetype": "Warrior",
      "created_at": "2025-10-20T...",
      "source": "local",
      "score": 0.85
    }
  ]
}
```

### Test Timeline

```bash
curl https://soullab.life/api/akashic/timeline
```

Expected response:
```json
{
  "buckets": [
    { "element": "Fire", "archetype": "Warrior", "count": 42 },
    { "element": "Water", "archetype": "Healer", "count": 38 }
  ]
}
```

---

## Security

- ✅ External insights table is **read-only** for authenticated users
- ✅ Only service role can write (via sync endpoint)
- ✅ HMAC signature verification prevents tampering
- ✅ Content hashing prevents duplicates
- ✅ Peer authentication via shared secret

---

## Maintenance

### Refresh Counts Manually

```sql
SELECT akashic_refresh_counts();
```

### View Sync History

```sql
SELECT * FROM akashic_sync_log
ORDER BY created_at DESC
LIMIT 50;
```

### Backfill Content Hashes

```sql
UPDATE insight_history
SET content_hash = encode(sha256(content::bytea), 'hex')
WHERE content_hash IS NULL;
```

---

## Troubleshooting

### Sync Failing

1. Check `AKASHIC_SYNC_SECRET` matches on both nodes
2. Verify `AKASHIC_PEERS` URLs are correct
3. Check `akashic_sync_log` for error details
4. Ensure service role key is set in environment

### Context Returns Empty

1. Verify embeddings exist for insight_history records
2. Check `minScore` threshold (try lowering to 0.5)
3. Ensure `match_akashic_insights` function exists
4. Check pgvector extension is enabled

### Cron Not Running

1. Verify Vercel cron is configured in `vercel.json`
2. Check Vercel dashboard → Cron Jobs
3. Manually trigger: `curl https://soullab.life/api/cron/akashic-sync`

---

## Next Steps

1. **Test locally** - Verify context retrieval works
2. **Integrate into MAIA** - Add whispered recollections to chat
3. **Monitor usage** - Watch for patterns emerging
4. **Prepare Phase 2** - When ready to federate with other nodes
5. **Design field UI** - Visualize the constellation forming

---

*"The desert remembers. MAIA whispers. The Sanctuary awakens."*

🏜️ **Phase 1 Complete. The foundation breathes.**
