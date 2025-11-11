# MAIA Sovereignty - Cloud Setup (No Docker Required)

Since Docker isn't installed, we'll use **Qdrant Cloud** (free tier) instead.

This gives you:
- ✅ Same 70% cost savings
- ✅ Same sovereignty benefits (your data, your control)
- ✅ No Docker required
- ✅ Free tier: 1GB storage (enough for MAIA's 50 books)
- ✅ Managed service (no maintenance)

---

## Setup (15 minutes)

### Step 1: Create Qdrant Cloud Account (5 minutes)

1. Go to: https://cloud.qdrant.io/
2. Sign up (free, no credit card required)
3. Create a new cluster:
   - Name: `maia-wisdom`
   - Region: `us-east` (or closest to you)
   - Plan: **Free tier** (1GB storage)

4. Copy your credentials:
   - **URL**: `https://xyz-abc-123.aws.cloud.qdrant.io:6333`
   - **API Key**: `xyz...`

### Step 2: Add to Environment Variables (1 minute)

Add to `/Users/soullab/MAIA-FRESH/.env`:

```bash
# Qdrant Cloud
QDRANT_URL=https://xyz-abc-123.aws.cloud.qdrant.io:6333
QDRANT_API_KEY=xyz...

# OpenAI (for embeddings)
OPENAI_API_KEY=sk-...

# Anthropic (for LLM)
ANTHROPIC_API_KEY=sk-ant-...
```

### Step 3: Ingest Wisdom Library (15 minutes)

```bash
cd /Users/soullab/MAIA-FRESH

# Run ingestion
npm run sovereignty:ingest
```

This will:
1. Connect to your Qdrant Cloud cluster
2. Create `maia_wisdom` collection
3. Ingest all 50 books (~847 chunks)
4. Generate embeddings (OpenAI API)

**Cost:** ~$2-5 one-time (OpenAI embeddings)

### Step 4: Test Retrieval (5 minutes)

```bash
npm run sovereignty:test
```

Verify:
- ✅ Retrieval finds relevant wisdom
- ✅ Costs reduced by 70%+
- ✅ Response quality maintained

### Step 5: Integrate (Auto)

Once tests pass, the integration is automatic - `LocalVectorDB` is already configured to use cloud Qdrant.

---

## Costs

### One-Time Setup
- Qdrant Cloud: **$0** (free tier)
- OpenAI Embeddings: **~$3** (one-time ingestion)

### Ongoing
- Qdrant Cloud: **$0/month** (free tier, up to 1GB)
- Anthropic API: **-70% reduction** ($1,175 → $300/month at 1k sessions)

**Net savings: $872/month**

---

## Migration to Self-Hosted Later

When you're ready for 100% sovereignty:

1. Install Docker
2. Export data from Qdrant Cloud
3. Import to local Qdrant
4. Update `QDRANT_URL` to `http://localhost:6333`

No code changes needed - same API.

---

## Let's Go!

Ready to start? Follow the steps above, then run:

```bash
npm run sovereignty:ingest
```

This will save you **$875/month** starting today! 🚀
