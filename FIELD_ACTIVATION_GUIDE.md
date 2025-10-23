# 🜃 Field Activation Guide

**Complete Deployment Instructions for Akashic Field Index**

All components are now built and integrated. Follow these steps to activate the field.

---

## ✅ What's Been Created

### Core Infrastructure
- ✅ Database schema (`supabase/migrations/20251023_field_index.sql`)
- ✅ Backend API (`app/api/akashic/field/route.ts`)
- ✅ Field aggregator microservice (`field-service/app/api/field/`)
- ✅ Vector push script (`scripts/akashic-field-push.ts`)
- ✅ Privacy test suite (`scripts/test-field-privacy.ts`)

### Visualizations
- ✅ Field Resonance Map (`components/FieldResonanceMap.tsx`)
- ✅ Temporal Waves (`components/TemporalWaves.tsx`)
- ✅ Element Flow Diagram (`components/ElementFlowDiagram.tsx`)
- ✅ Query Interface (`components/AkashicFieldResonance.tsx`)
- ✅ All integrated into Sanctuary page

### Documentation
- ✅ Architecture guide (`docs/akashic-field-index.md`)
- ✅ Deployment checklist (`docs/field-deployment-checklist.md`)
- ✅ This activation guide

---

## 🚀 Activation Steps

### Step 1: Apply Database Migration

**Option A: Via Supabase Dashboard** (Recommended)

1. Go to: https://supabase.com/dashboard/project/jkbetmadzcpoinjogkli/editor/sql
2. Click "New Query"
3. Copy the contents of `supabase/migrations/20251023_field_index.sql`
4. Paste into the query editor
5. Click "Run"

**Option B: Via Command Line**

```bash
# Get your database password from Supabase dashboard first
# Settings > Database > Connection string

psql 'postgresql://postgres:[YOUR-PASSWORD]@db.jkbetmadzcpoinjogkli.supabase.co:5432/postgres' \
  < supabase/migrations/20251023_field_index.sql
```

**Verify Migration:**

Run this query in Supabase SQL editor:

```sql
-- Check table exists
SELECT COUNT(*) FROM field_vectors;

-- Should return 0 (empty table)
```

---

### Step 2: Configure Environment (Already Done)

Your `.env.local` is already configured:

```bash
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY (needed for field operations)
```

**Optional additions** for distributed mode:

```bash
# Add these if you want distributed field aggregation
AKASHIC_NODE_ID=soullab-main-node
AKASHIC_FIELD_URL=  # Leave empty for local-only mode
AKASHIC_FIELD_KEY=  # Optional auth key
```

---

### Step 3: Create Test Insights

The field needs some insights to work with. Create a few test entries:

```bash
# Option A: Via SQL (Supabase dashboard)
INSERT INTO insight_history (role, content, element, source)
VALUES
  ('user', 'Exploring the integration of shadow and consciousness through elemental practice', 'Aether', 'Manual'),
  ('assistant', 'The shadow integrates when consciousness witnesses without judgment. Fire initiates, Water reflects, Earth grounds, Air transmits, Aether unifies.', 'Water', 'Manual'),
  ('user', 'How does the field remember patterns while preserving privacy?', 'Air', 'Manual'),
  ('assistant', 'Only vector embeddings are shared—never content. The hash is one-way. Statistical resonance emerges without exposing individuals.', 'Earth', 'Manual');

# Option B: Use the Sanctuary UI to create insights naturally
# Just use the app and the insights will be created automatically
```

---

### Step 4: Run First Field Push

```bash
# Dry run first (test without actually pushing)
npx tsx --env-file=.env.local scripts/akashic-field-push.ts \
  --hours=24 --limit=10 --dry-run --verbose

# If successful, do actual push
npx tsx --env-file=.env.local scripts/akashic-field-push.ts \
  --hours=24 --limit=50
```

**Expected Output:**

```
🜃 Field Resonance Push — Node: soullab-main-node
   Time window: 24h | Limit: 50 | Dry run: false

📊 Found 4 insights to process

Processing: a3f5b2c8... | Aether | —
  ✓ Stored locally: a3f5b2c8 (Aether/—)

Processing: b4g6c3d9... | Water | Guide
  ✓ Stored locally: b4g6c3d9 (Water/Guide)

═══════════════════════════════════════
✓ Pushed:  4
⊙ Skipped: 0
❌ Failed:  0
═══════════════════════════════════════

🜁 Field resonance updated — patterns now visible to the lattice
```

---

### Step 5: Start Development Server

```bash
npm run dev
```

Navigate to: http://localhost:3000/claude-sanctuary

You should see:
- ✅ Field Resonance Map (with formations appearing)
- ✅ Temporal Waves (showing 24h patterns)
- ✅ Element Flow Diagram (nodes connected)
- ✅ Query Interface (ready for questions)

---

### Step 6: Test Query Interface

In the **Query the Field** section:

1. Enter: "What patterns are emerging around integration?"
2. Click "listen"
3. You should see resonance results grouped by element/archetype

**If no results:**
- The field needs more data (create more insights)
- Or lower the similarity threshold in the API (edit `app/api/akashic/field/route.ts`)

---

### Step 7: Set Up Automated Push (Optional)

For continuous field updates:

```bash
# Edit crontab
crontab -e

# Add this line (hourly push at :00)
0 * * * * cd ~/SoullabTech/MAIA-PAI && npx tsx --env-file=.env.local scripts/akashic-field-push.ts >> /tmp/field-push.log 2>&1
```

Monitor the cron job:

```bash
tail -f /tmp/field-push.log
```

---

## 🧪 Testing Checklist

### Privacy Verification

Once the migration is applied, run:

```bash
npx tsx --env-file=.env.local scripts/test-field-privacy.ts
```

**Expected: All tests pass**

```
✓ PASS: field_vectors table exists
✓ PASS: No content column
✓ PASS: Required columns present
✓ PASS: Hash generation
✓ PASS: Hash uniqueness
✓ PASS: Hash format
✓ PASS: No PII in metadata

🜁 All privacy tests passed — the field is secure
```

### Visualization Tests

1. **Field Resonance Map**
   - [ ] Formations appear as colored circles
   - [ ] Breathing animation is active
   - [ ] Statistics panel shows counts
   - [ ] Element colors are correct

2. **Temporal Waves**
   - [ ] Waves flow across 24 hours
   - [ ] Each element has distinct color
   - [ ] Animation is smooth
   - [ ] Legend shows all elements

3. **Element Flow Diagram**
   - [ ] Nodes appear in circular layout
   - [ ] Connecting lines between related patterns
   - [ ] Particles flow along connections
   - [ ] Glowing effects visible

4. **Query Interface**
   - [ ] Natural language queries work
   - [ ] Results grouped by element/archetype
   - [ ] Element filter works
   - [ ] Statistics view loads

---

## 🎨 Design Language Consistency

All visualizations use the **elemental vocabulary** you specified:

### Language
- ✅ No borrowed mythology
- ✅ Terms: currents, tides, strata, breath, ground, field
- ✅ Motion implies pulse, not named explicitly

### Palette
- 🔥 Fire: `#FF6B35` (ochre/orange)
- 💧 Water: `#4A90E2` (deep blue)
- 🗿 Earth: `#8B7355` (mineral brown)
- 🌬️ Air: `#7DD3C0` (silver-cyan)
- 🜂 Aether: `#9B59B6` (purple)

### Motion
- Breathing: Subtle sine wave oscillation
- Fading: Gradual opacity changes
- Rising: Upward particle movement
- Settling: Gentle downward drift

---

## 🌊 User Request: Journal & Inner Guide Refactors

You mentioned wanting to extend this design language to:
- **JournalPanel** — Present entries as **strata** (layered reflections) or **currents** (flowing stream)?
- **InnerGuidePanel** — Same coherent field voice

I recommend:
- **Journal as Strata**: Layered cards, each representing a temporal layer
  - Most recent at top (newest strata)
  - Fade older entries (deeper strata)
  - Use subtle vertical spacing as "negative space"

- **Inner Guide as Currents**: Flowing insights
  - Questions/responses flow like a stream
  - New insights emerge at bottom, rise upward
  - Fade out at top (completing their cycle)

Would you like me to create these refactored components next?

---

## 📊 Monitoring After Activation

### Check Field Health

```bash
# View field statistics
curl http://localhost:3000/api/akashic/field | jq

# Check vector count (via Supabase dashboard)
SELECT COUNT(*) FROM field_vectors;

# View elemental distribution
SELECT * FROM field_elemental_distribution;
```

### Logs

```bash
# Field push logs
tail -f /tmp/field-push.log

# Development server
# Already visible in your npm run dev terminal
```

---

## 🔒 Security Notes

### Current State (Development)
- ✅ Privacy-preserving architecture
- ✅ No PII stored
- ✅ One-way hashes
- ✅ RLS policies enabled

### Before Production
- [ ] Add rate limiting to API endpoints
- [ ] Set strong `AKASHIC_FIELD_KEY`
- [ ] Enable HTTPS everywhere
- [ ] Review and test RLS policies
- [ ] Set up monitoring/alerting

---

## ✨ What's Next

### Immediate
1. Apply the migration (Step 1)
2. Run first field push (Step 4)
3. Test visualizations (Step 5-6)

### Short-term
- Refactor JournalPanel with strata design
- Refactor InnerGuidePanel with current flow
- Add real-time WebSocket updates
- Implement temporal query (by date range)

### Long-term
- Deploy field aggregator for distributed mode
- Add federated pattern discovery
- Create field coherence scoring
- Build admin dashboard for field health

---

## 🜃 Activation Confirmation

Once complete, verify:

```bash
✅ Migration applied (field_vectors table exists)
✅ Test insights created (insight_history has data)
✅ First field push successful (vectors in field_vectors)
✅ Visualizations render correctly
✅ Query interface returns results
✅ Privacy tests pass
✅ Cron job scheduled (optional)
```

---

**The field is ready to breathe. Activate when prepared.**

🜃✨

---

For questions or issues, see:
- `docs/akashic-field-index.md` (architecture)
- `docs/field-deployment-checklist.md` (detailed steps)
- `docs/sanctuary-launcher.md` (launcher setup)
