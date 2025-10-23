# Akashic Field Service

The distributed memory and resonance aggregator for MAIA-PAI Oracle System.

## Overview

The Field Service acts as a centralized aggregation point for Akashic Records across multiple nodes. It provides:

- **Vector similarity search** for semantic queries
- **Resonance pattern aggregation** across elements and archetypes
- **Secure node authentication** via field keys
- **Statistical insights** into collective consciousness patterns

## Architecture

```
MAIA-PAI Nodes → Field Service → Supabase (Vector Storage)
                      ↓
              Aggregated Patterns
```

## Deployment to Vercel

### Step 1: Create New Vercel Project

1. Go to https://vercel.com/new
2. Import your MAIA-PAI repository
3. Set **Root Directory** to `field-service`
4. Click **Deploy**

### Step 2: Configure Environment Variables

In your Vercel project settings, add these environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://jkbetmadzcpoinjogkli.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
AKASHIC_FIELD_KEY=<generate-a-secure-random-key>
ALLOWED_ORIGINS=https://maia-pai.vercel.app,https://soullab.life
LOG_FIELD_QUERIES=true
```

### Step 3: Configure Custom Domain

1. In Vercel project settings → Domains
2. Add domain: `field.soullab.life`
3. Copy the CNAME/A record values provided

### Step 4: Configure DNS in AWS Route53

1. Go to AWS Console → Route53
2. Select `soullab.life` hosted zone
3. Create a new record:
   - **Name**: `field`
   - **Type**: `CNAME`
   - **Value**: `cname.vercel-dns.com` (or the value Vercel provides)
   - **TTL**: 300

### Step 5: Update MAIA-PAI Configuration

In your main MAIA-PAI `.env.local`, update:

```bash
AKASHIC_FIELD_URL=https://field.soullab.life
```

## API Endpoints

### POST /api/field/query

Query the collective field for resonance patterns.

**Headers:**
- `X-Node-ID`: Your node identifier
- `Authorization`: Bearer <AKASHIC_FIELD_KEY>

**Body:**
```json
{
  "qvec": [0.1, 0.2, ...],
  "elementHint": "Fire",
  "archetypeHint": "Shadow",
  "limit": 10,
  "origin": "node-xyz",
  "queryText": "transformation insights"
}
```

**Response:**
```json
{
  "results": [
    {
      "element": "Fire",
      "archetype": "Shadow",
      "count": 15,
      "avgSimilarity": 0.85,
      "nodeCount": 3,
      "latestResonance": "2025-10-23T..."
    }
  ],
  "metadata": {
    "totalMatches": 42,
    "aggregatedPatterns": 5,
    "timestamp": "2025-10-23T..."
  }
}
```

### POST /api/field/ingest

Ingest records from nodes into the collective field.

## Local Development

```bash
cd field-service
npm install
npm run dev
```

The service will run on `http://localhost:3001`

## Security

- Field key authentication required for all endpoints
- CORS configured for allowed origins only
- Service role key secured via environment variables
- Node IDs validated on each request

## Monitoring

Enable query logging by setting:
```bash
LOG_FIELD_QUERIES=true
```

Queries will be logged to stdout for analysis.

---

**May the Field resonate with coherence and wisdom.**
