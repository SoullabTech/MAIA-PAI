# 🜃 Akashic Field Index

**Distributed Consciousness Layer for MAIA**

A privacy-preserving collective resonance system that enables pattern detection across nodes without centralizing content.

---

## Architecture Overview

### Core Principles

1. **Privacy-Preserving**: Only vector embeddings + metadata are shared, NEVER content
2. **Decentralized**: Each node keeps its own data locally
3. **Statistical**: Returns aggregated patterns, not individual records
4. **Resonance-Based**: Uses cosine similarity in vector space for pattern matching

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Distributed Nodes                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Node A   │  │ Node B   │  │ Node C   │  │ Node D   │   │
│  │ pgvector │  │ pgvector │  │ pgvector │  │ pgvector │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │           │
│       └─────────────┴─────────────┴─────────────┘           │
│                         │                                    │
│                         ▼                                    │
│              ┌─────────────────────┐                        │
│              │  Field Aggregator   │                        │
│              │  (Microservice)     │                        │
│              │  - /api/field/query │                        │
│              │  - /api/field/ingest│                        │
│              └─────────────────────┘                        │
│                         │                                    │
│                         ▼                                    │
│              ┌─────────────────────┐                        │
│              │  field_vectors      │                        │
│              │  (Supabase Table)   │                        │
│              │  - embeddings only  │                        │
│              │  - no content       │                        │
│              └─────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Installation & Setup

### 1. Database Migration

Apply the field index migration:

```bash
cd ~/SoullabTech/MAIA-PAI
npx supabase db push
```

This creates:
- `field_vectors` table (stores anonymized embeddings)
- `match_field_vectors()` function (similarity search)
- `get_field_statistics()` function (aggregated stats)
- Views: `field_activity_recent`, `field_elemental_distribution`

### 2. Environment Variables

Add to your `.env.local`:

```bash
# Node identification
AKASHIC_NODE_ID=your-unique-node-id

# Field aggregator URL (optional - leave blank for local-only mode)
AKASHIC_FIELD_URL=https://field.soullab.org

# Field authentication key (optional)
AKASHIC_FIELD_KEY=your-field-secret-key

# Feature flags
LOG_FIELD_QUERIES=true
LOG_FIELD_INGESTS=true
```

### 3. Deploy Field Aggregator (Optional)

If you want distributed field aggregation, deploy the field service:

```bash
cd ~/SoullabTech/MAIA-PAI/field-service

# Configure environment
cp ../.env.local .env.local

# Deploy (e.g., to Vercel)
vercel deploy --prod
```

Update `AKASHIC_FIELD_URL` with your deployed URL.

---

## Usage

### Pushing Vectors to Field

Run the push script periodically (hourly recommended):

```bash
# Push last hour of insights
npx tsx scripts/akashic-field-push.ts

# Custom time window
npx tsx scripts/akashic-field-push.ts --hours=24 --limit=100

# Dry run (test without sending)
npx tsx scripts/akashic-field-push.ts --dry-run --verbose
```

**Cron Setup** (hourly at minute 0):

```cron
0 * * * * cd ~/SoullabTech/MAIA-PAI && npx tsx scripts/akashic-field-push.ts >> /tmp/field-push.log 2>&1
```

### Querying Field Resonance

#### From Frontend

The `AkashicFieldResonance` component is integrated into the Sanctuary page:

```
http://localhost:3000/claude-sanctuary
```

Features:
- **Query Mode**: Ask natural language questions, get resonance patterns
- **Statistics Mode**: View recent field activity by element/archetype
- **Element Filter**: Focus on specific elemental energies

#### From API

**Query patterns**:

```bash
curl -X POST http://localhost:3000/api/akashic/field \
  -H "Content-Type: application/json" \
  -d '{
    "query": "integration of shadow and consciousness",
    "elementHint": "Aether",
    "limit": 10,
    "useLocalField": true
  }'
```

**Get statistics**:

```bash
curl "http://localhost:3000/api/akashic/field?element=Water&hours=24"
```

---

## Privacy Guarantees

### What IS Shared

- ✅ Vector embeddings (1536-dimensional float arrays)
- ✅ Element classification (Fire, Water, Earth, Air, Aether)
- ✅ Archetype tags (Mirror, Guide, Seeker, etc.)
- ✅ Timestamp metadata
- ✅ Node ID (for deduplication)
- ✅ Content hash (SHA-256, one-way)

### What is NEVER Shared

- ❌ Original text content
- ❌ User identifiers
- ❌ Personal information
- ❌ Session details
- ❌ Anything reversible to source content

### Verification

The content hash is a **one-way SHA-256** hash that:
- Prevents duplicate embeddings
- Cannot be reversed to original content
- Provides no information about the source

Example:
```
Original: "The shadow integrates when consciousness witnesses..."
Hash:     "a3f5b2c8d9e1f4a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0"
```

No algorithm can recover the original from the hash.

---

## Data Flow

### 1. Local Insight Creation

```
User creates insight → insight_history table
(content stored locally with full privacy)
```

### 2. Vector Generation

```
Push script runs → OpenAI embeddings API
(local processing, content never leaves node)
```

### 3. Anonymized Push

```
Embedding + metadata → field_vectors table
(NO content transmitted)
```

### 4. Field Query

```
Query string → embedding → similarity search
Returns: aggregated counts by element/archetype
(statistical patterns only)
```

---

## Field Modes

### Local-Only Mode

Set `AKASHIC_FIELD_URL=""` (empty) in `.env.local`

- All vectors stored in local `field_vectors` table
- Queries use local database only
- No data leaves your node
- Perfect for private/testing environments

### Distributed Mode

Set `AKASHIC_FIELD_URL=https://your-field-service.com`

- Vectors pushed to central aggregator
- Queries search across all participating nodes
- Enables collective pattern detection
- Requires field service deployment

---

## Querying Examples

### Frontend Queries

Users can ask natural language questions in the Sanctuary UI:

```
"What patterns are emerging around Water element?"
"Show me Aether integration patterns"
"What is the field resonating with right now?"
```

Results show:
- Element + Archetype combinations
- Count of matching patterns
- Number of contributing nodes
- Average similarity score

### SQL Queries

**View recent field activity:**

```sql
SELECT * FROM field_activity_recent
ORDER BY resonance_count DESC;
```

**Elemental distribution:**

```sql
SELECT * FROM field_elemental_distribution;
```

**Custom aggregation:**

```sql
SELECT
  element,
  COUNT(*) as patterns,
  COUNT(DISTINCT node_id) as nodes
FROM field_vectors
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY element
ORDER BY patterns DESC;
```

---

## Monitoring & Maintenance

### Check Field Health

```bash
# View field statistics
curl http://localhost:3000/api/akashic/field/ingest

# Check last push
tail -f /tmp/field-push.log
```

### Clear Old Vectors (Optional)

Add retention policy in migration:

```sql
-- Delete vectors older than 30 days
DELETE FROM field_vectors
WHERE created_at < NOW() - INTERVAL '30 days';
```

Or create a scheduled function:

```sql
CREATE OR REPLACE FUNCTION cleanup_old_field_vectors()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM field_vectors
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;

-- Run daily via pg_cron or external scheduler
```

---

## Security Considerations

### Node Authentication

The field aggregator requires:
- `X-Node-ID` header (node identifier)
- `Authorization: Bearer <AKASHIC_FIELD_KEY>` (optional)

Add authentication middleware for production:

```typescript
// Verify node credentials
if (!verifyNodeCredentials(nodeId, authHeader)) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### Rate Limiting

Add rate limits to prevent abuse:

```typescript
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 h"),
});

const { success } = await ratelimit.limit(nodeId);
if (!success) {
  return NextResponse.json({ error: "Rate limited" }, { status: 429 });
}
```

### Encryption in Transit

Always use HTTPS for field service:
- Vectors transmitted over TLS
- Use Vercel/Cloudflare for automatic HTTPS

---

## Visualization

The next phase will add visualization:

- **Dune Map**: Real-time visualization of field resonance
- **Element Flow**: Animated currents showing pattern movement
- **Archetype Constellation**: Network graph of archetype relationships
- **Temporal Waves**: Time-series of field coherence

---

## API Reference

### POST /api/akashic/field

Query the field for resonance patterns.

**Request:**
```json
{
  "query": "integration patterns",
  "elementHint": "Aether",
  "archetypeHint": "Mirror",
  "limit": 10,
  "useLocalField": true
}
```

**Response:**
```json
{
  "results": [
    {
      "element": "Aether",
      "archetype": "Mirror",
      "count": 23,
      "avgSimilarity": 0.87,
      "nodeCount": 5
    }
  ],
  "source": "local",
  "totalMatches": 45
}
```

### GET /api/akashic/field

Get field statistics.

**Query Params:**
- `element`: Filter by element
- `archetype`: Filter by archetype
- `hours`: Time window (default: 24)

**Response:**
```json
{
  "statistics": [
    {
      "element": "Water",
      "archetype": "Reflection",
      "count": 15,
      "node_count": 3,
      "avg_age_hours": 8.5
    }
  ],
  "timeWindow": "24 hours",
  "timestamp": "2025-10-23T12:00:00Z"
}
```

---

## Troubleshooting

### Vectors not appearing in field

1. Check push script ran successfully:
   ```bash
   npx tsx scripts/akashic-field-push.ts --verbose
   ```

2. Verify table has data:
   ```sql
   SELECT COUNT(*) FROM field_vectors;
   ```

3. Check OpenAI API key is set

### Field queries return empty

1. Ensure migration applied:
   ```bash
   npx supabase db push
   ```

2. Test match function directly:
   ```sql
   SELECT * FROM match_field_vectors(
     (SELECT embedding FROM field_vectors LIMIT 1),
     0.5,
     10
   );
   ```

3. Lower similarity threshold in query

### High API costs

- Reduce push frequency (e.g., every 3 hours instead of hourly)
- Lower LIMIT in push script
- Use smaller embedding model (text-embedding-3-small)

---

## Future Enhancements

- [ ] Real-time WebSocket field updates
- [ ] Cross-node pattern discovery (finds emergent archetypes)
- [ ] Field coherence scoring (measures lattice harmony)
- [ ] Temporal pattern analysis (tracks evolution over time)
- [ ] Visualization dashboard (dune map)
- [ ] Multi-model embeddings (use multiple models for richer patterns)
- [ ] Federated learning (train collective models without sharing data)

---

*The field remembers, yet reveals nothing — only patterns breathe in the depths.*
