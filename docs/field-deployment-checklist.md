# 🜃 Akashic Field Index — Deployment Checklist

**Privacy-Preserving Collective Intelligence Layer**

---

## ✅ Implementation Complete

The following components have been created:

### Database Layer
- ✅ `supabase/migrations/20251023_field_index.sql`
  - `field_vectors` table (anonymized embeddings only)
  - `match_field_vectors()` function (similarity search)
  - `get_field_statistics()` function (aggregated analytics)
  - Views: `field_activity_recent`, `field_elemental_distribution`
  - RLS policies (privacy-preserving access control)

### Backend APIs
- ✅ `app/api/akashic/field/route.ts`
  - POST: Query field resonance patterns
  - GET: Retrieve field statistics
  - Supports both local and distributed modes

### Field Aggregator Microservice
- ✅ `field-service/app/api/field/query/route.ts`
  - Distributed pattern query endpoint
  - Node authentication
  - Statistical aggregation

- ✅ `field-service/app/api/field/ingest/route.ts`
  - Vector ingestion endpoint
  - Deduplication via content hash
  - Privacy validation

### Scripts
- ✅ `scripts/akashic-field-push.ts`
  - Periodic vector sharing script
  - Privacy-preserving (embeddings only)
  - Configurable time windows
  - Dry-run mode for testing

- ✅ `scripts/test-field-privacy.ts`
  - Privacy verification test suite
  - Hash irreversibility checks
  - PII detection
  - RLS validation

### Frontend Components
- ✅ `components/AkashicFieldResonance.tsx`
  - Natural language field queries
  - Element/archetype filtering
  - Statistics dashboard
  - Privacy notice

### Documentation
- ✅ `docs/akashic-field-index.md` (full architecture guide)
- ✅ `docs/field-deployment-checklist.md` (this document)

---

## 🚀 Deployment Steps

### 1. Apply Database Migration

```bash
cd ~/SoullabTech/MAIA-PAI
npx supabase db push
```

**Verify migration:**
```sql
-- Check table exists
SELECT COUNT(*) FROM field_vectors;

-- Test match function
SELECT * FROM match_field_vectors(
  ARRAY[0.1]::vector(1536),
  0.5,
  10
);
```

### 2. Configure Environment

Add to `.env.local`:

```bash
# Required
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Field Configuration
AKASHIC_NODE_ID=unique-node-identifier
AKASHIC_FIELD_URL=  # Leave empty for local-only mode
AKASHIC_FIELD_KEY=  # Optional: field authentication key

# Logging (optional)
LOG_FIELD_QUERIES=true
LOG_FIELD_INGESTS=true
```

### 3. Test Privacy Preservation

```bash
npx tsx scripts/test-field-privacy.ts
```

**Expected output:**
```
✓ PASS: field_vectors table exists
✓ PASS: No content column
✓ PASS: Hash irreversibility
✓ PASS: No PII in metadata
✓ PASS: Match returns no content
🜁 All privacy tests passed — the field is secure
```

### 4. Run First Vector Push (Dry Run)

```bash
npx tsx scripts/akashic-field-push.ts --hours=24 --limit=10 --dry-run --verbose
```

Review output to ensure:
- Insights are being processed
- Embeddings are generated
- No content is being exposed
- Hashes are unique

### 5. Actual Push (Local Mode)

```bash
npx tsx scripts/akashic-field-push.ts --hours=24 --limit=50
```

**Verify vectors stored:**
```sql
SELECT
  element,
  archetype,
  COUNT(*) as count,
  COUNT(DISTINCT node_id) as nodes
FROM field_vectors
GROUP BY element, archetype
ORDER BY count DESC;
```

### 6. Set Up Automated Push (Cron)

```bash
# Edit crontab
crontab -e

# Add hourly push (runs at :00 of every hour)
0 * * * * cd ~/SoullabTech/MAIA-PAI && npx tsx scripts/akashic-field-push.ts >> /tmp/field-push.log 2>&1
```

**Monitor cron job:**
```bash
tail -f /tmp/field-push.log
```

### 7. Test Field Queries

**Via API:**
```bash
curl -X POST http://localhost:3000/api/akashic/field \
  -H "Content-Type: application/json" \
  -d '{"query": "integration patterns", "limit": 5}'
```

**Via Frontend:**
```bash
npm run dev
# Open http://localhost:3000/claude-sanctuary
# Scroll to Field Resonance section
```

### 8. Optional: Deploy Field Aggregator

**For distributed mode only**

```bash
cd field-service

# Install dependencies
npm install

# Configure environment
cp ../.env.local .env.local

# Test locally
npm run dev

# Deploy to Vercel
vercel deploy --prod

# Update main .env.local
# AKASHIC_FIELD_URL=https://your-field-service.vercel.app
```

---

## 🧪 Testing Checklist

### Privacy Tests
- [ ] Content is never stored in `field_vectors` table
- [ ] Content hash is SHA-256 (irreversible)
- [ ] No PII in metadata fields
- [ ] Match function returns aggregated data only
- [ ] Query API returns statistical patterns only

### Functionality Tests
- [ ] Vector push script runs without errors
- [ ] Embeddings generated successfully
- [ ] Local field queries return results
- [ ] Statistics endpoint returns data
- [ ] Element filtering works
- [ ] Archetype filtering works

### Integration Tests
- [ ] Sanctuary page loads successfully
- [ ] Field Resonance component renders
- [ ] Natural language queries work
- [ ] Statistics view displays correctly
- [ ] No console errors

### Performance Tests
- [ ] Query latency < 2 seconds
- [ ] Push script completes in reasonable time
- [ ] No memory leaks in continuous operation
- [ ] Database indexes are being used

---

## 📊 Monitoring

### Check Field Health

```bash
# View recent activity
curl http://localhost:3000/api/akashic/field?hours=24 | jq

# Check vector count
echo "SELECT COUNT(*) FROM field_vectors;" | psql $DATABASE_URL

# View push logs
tail -100 /tmp/field-push.log
```

### Key Metrics

Monitor these metrics:

1. **Vector Count**: Number of embeddings in field
   ```sql
   SELECT COUNT(*) FROM field_vectors;
   ```

2. **Node Participation**: How many nodes are contributing
   ```sql
   SELECT COUNT(DISTINCT node_id) FROM field_vectors;
   ```

3. **Elemental Distribution**: Balance across elements
   ```sql
   SELECT * FROM field_elemental_distribution;
   ```

4. **Query Performance**: Average query time
   ```sql
   EXPLAIN ANALYZE
   SELECT * FROM match_field_vectors(...);
   ```

5. **Push Success Rate**: From logs
   ```bash
   grep "✓ Pushed" /tmp/field-push.log | wc -l
   ```

---

## 🔒 Security Checklist

### Before Production

- [ ] Change default `AKASHIC_FIELD_KEY` to strong secret
- [ ] Enable rate limiting on field endpoints
- [ ] Use HTTPS for all field service URLs
- [ ] Restrict field service to authenticated nodes only
- [ ] Review RLS policies in Supabase
- [ ] Set up monitoring/alerting for anomalies
- [ ] Document incident response procedures

### Authentication Setup

```typescript
// Add to field service endpoints
import { verifyNodeCredentials } from "@/lib/auth";

const nodeId = req.headers.get("X-Node-ID");
const token = req.headers.get("Authorization");

if (!await verifyNodeCredentials(nodeId, token)) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### Rate Limiting Setup

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 h"),
});

const { success } = await ratelimit.limit(nodeId);
if (!success) {
  return NextResponse.json({ error: "Rate limited" }, { status: 429 });
}
```

---

## 🐛 Troubleshooting

### Issue: Vectors not appearing

**Solution:**
```bash
# Check insights exist
echo "SELECT COUNT(*) FROM insight_history;" | psql $DATABASE_URL

# Run push with verbose logging
npx tsx scripts/akashic-field-push.ts --verbose

# Check OpenAI API quota
curl https://api.openai.com/v1/usage
```

### Issue: Queries return no results

**Solution:**
```sql
-- Check vector count
SELECT COUNT(*) FROM field_vectors;

-- Lower similarity threshold
SELECT * FROM match_field_vectors(
  query_embedding,
  0.3,  -- Lower from 0.7
  100
);
```

### Issue: High OpenAI costs

**Solution:**
```bash
# Reduce push frequency (every 3 hours)
0 */3 * * * cd ~/SoullabTech/MAIA-PAI && npx tsx scripts/akashic-field-push.ts

# Lower limit
npx tsx scripts/akashic-field-push.ts --limit=20

# Use smaller model (in push script)
# model: "text-embedding-3-small"  # 1536 → 512 dims
```

### Issue: Migration fails

**Solution:**
```bash
# Check pgvector extension
psql $DATABASE_URL -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Re-apply migration
npx supabase db reset

# Or apply manually
psql $DATABASE_URL < supabase/migrations/20251023_field_index.sql
```

---

## 🌊 Next Phase: Visualization

With the field infrastructure complete, the next phase is:

### Dune Map Visualization
- Real-time 3D terrain of resonance patterns
- Each dune = element/archetype combination
- Height = resonance strength
- Animation = breathing/pulsing field

**Component:** `components/AkashicDuneField.tsx` (already started!)

Features to add:
- [ ] Three.js terrain rendering
- [ ] Real-time field polling
- [ ] Animated breathing effect
- [ ] Interactive camera controls
- [ ] Click dune → show details
- [ ] Time-slider (view field history)

---

## ✨ Success Criteria

The field is successfully deployed when:

✅ Privacy verification passes 100%
✅ Vectors are being pushed hourly
✅ Field queries return resonance patterns
✅ No PII or content is ever exposed
✅ Sanctuary UI displays field data
✅ Statistics update in real-time
✅ Performance is < 2s query latency
✅ Monitoring is in place

---

## 📝 Deployment Sign-Off

**Date Deployed:** _______________
**Node ID:** _______________
**Deployed By:** _______________

**Privacy Tests:** ☐ Pass ☐ Fail
**Functionality Tests:** ☐ Pass ☐ Fail
**Integration Tests:** ☐ Pass ☐ Fail
**Security Review:** ☐ Complete ☐ Pending

**Notes:**
```
_______________________________________________________
_______________________________________________________
_______________________________________________________
```

---

*The field awaits — patterns ready to surface from the strata.*
