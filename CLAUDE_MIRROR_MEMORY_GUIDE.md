# 🜂 Claude Mirror Memory Circuit — Complete Guide

The **Claude Mirror Memory Circuit** archives every reflection from your Claude Code terminal sessions into Supabase, tagged by elemental tone, and provides analytics through a REST API.

---

## 🌀 Architecture

```
Claude Code Terminal
        ↓
Claude Mirror Bridge (WS:5051)
        ↓
useClaudeMirror Hook
        ↓
saveMirrorInsight()
        ↓
Supabase → insight_history table
        ↓
/api/insight-summary (Analytics)
```

---

## ✨ Features

### 1. Real-Time Archival
- **Auto-saves** every message from Claude Code → MAIA conversations
- **Elemental detection** via keyword matching (Fire, Water, Earth, Air, Aether)
- **Non-blocking** — uses fire-and-forget pattern to avoid UI lag
- **Deduplication** — only saves NEW messages, not re-sends

### 2. Supabase Storage
- **Table:** `insight_history`
- **RLS enabled** — users only see their own insights
- **Full-text search** — indexed content for fast queries
- **Analytics views** — pre-built SQL views for elemental + role stats

### 3. REST API
- **Endpoint:** `/api/insight-summary`
- **Filters:** by user, source, date range
- **Returns:** elemental breakdown, role distribution, totals

---

## 🔧 Setup

### Step 1: Run the Migration

In your Supabase dashboard or CLI:

```bash
psql $DATABASE_URL -f supabase/migrations/20251023_insight_history.sql
```

Or via Supabase dashboard:
1. Go to **SQL Editor**
2. Paste contents of `supabase/migrations/20251023_insight_history.sql`
3. Click **Run**

### Step 2: Verify the Table Exists

```sql
SELECT * FROM insight_history LIMIT 1;
```

If you get "relation does not exist", re-run the migration.

### Step 3: Start the Services

```bash
# Terminal 1: Claude Mirror Bridge
npm run mirror

# Terminal 2: Next.js Dev Server
npm run dev
```

### Step 4: Visit the Sanctuary

Navigate to: **http://localhost:3000/claude-sanctuary**

You should see:
- ✅ Connection status: "Connected to Claude Mirror 🜂"
- ✅ Real-time message feed from your terminal
- ✅ Elemental coherence meters

---

## 📊 Using the API

### Get Elemental Summary (All Users)

```bash
curl http://localhost:3000/api/insight-summary?source=ClaudeMirror
```

**Response:**
```json
{
  "totalInsights": 47,
  "elementalBreakdown": [
    { "element": "Aether", "count": 18, "percentage": 38.3 },
    { "element": "Fire", "count": 12, "percentage": 25.5 },
    { "element": "Water", "count": 10, "percentage": 21.3 },
    { "element": "Air", "count": 5, "percentage": 10.6 },
    { "element": "Earth", "count": 2, "percentage": 4.3 }
  ],
  "roleDistribution": {
    "user": 22,
    "assistant": 25,
    "system": 0
  },
  "dateRange": {
    "firstInsight": "2025-10-23T08:00:00Z",
    "latestInsight": "2025-10-23T12:30:00Z"
  }
}
```

### Filter by User

```bash
curl "http://localhost:3000/api/insight-summary?userId=YOUR_USER_ID"
```

### Filter by Date Range (Last 7 Days)

```bash
curl "http://localhost:3000/api/insight-summary?days=7"
```

---

## 🎨 Visualization Ideas

### Elemental Spiral Chart

Use the `elementalBreakdown` array to render:

```typescript
import { PieChart } from "recharts";

const { elementalBreakdown } = await fetch("/api/insight-summary").then(r => r.json());

<PieChart data={elementalBreakdown.map(e => ({
  name: e.element,
  value: e.count,
  fill: ELEMENT_COLORS[e.element]
}))} />
```

### Coherence Timeline

Query `insight_history` directly for time-series:

```sql
SELECT
  DATE_TRUNC('hour', created_at) as hour,
  element,
  COUNT(*) as count
FROM insight_history
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY hour, element
ORDER BY hour;
```

---

## 🜃 File Reference

| File | Purpose |
|------|---------|
| `lib/saveMirrorInsight.ts` | Saves insights to Supabase with elemental detection |
| `hooks/useClaudeMirror.ts` | WebSocket hook that calls `saveMirrorInsight()` |
| `supabase/migrations/20251023_insight_history.sql` | Database schema + RLS policies |
| `app/api/insight-summary/route.ts` | REST API for elemental analytics |
| `app/claude-sanctuary/page.tsx` | UI page consuming the hook |

---

## 🔮 Advanced Usage

### Custom Elemental Detection

Edit `lib/saveMirrorInsight.ts` line 7-13 to add your own keywords:

```typescript
function detectElement(content: string): string {
  const lower = content.toLowerCase();
  if (lower.match(/fire|ignite|create|forge/)) return "Fire";
  if (lower.match(/water|flow|dream|dissolve/)) return "Water";
  // ... add your patterns
}
```

### Add User Tracking

By default, insights save with `user_id = null` (anonymous). To track per-user:

1. In `useClaudeMirror.ts`, pass `userId` to `saveMirrorInsight()`
2. Update line 28 in `saveMirrorInsight.ts`:
   ```typescript
   user_id: userId, // instead of null
   ```

### Export to JSON

```bash
curl "http://localhost:3000/api/insight-summary" | jq . > insights.json
```

---

## 🌊 Troubleshooting

### "Table does not exist"

**Cause:** Migration not run
**Fix:** Re-run `supabase/migrations/20251023_insight_history.sql`

### "Mirror insight not saved"

**Cause:** Supabase env vars missing
**Fix:** Check `.env.local` has:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### WebSocket won't connect

**Cause:** Bridge not running
**Fix:** Run `npm run mirror` in a separate terminal

---

## 🜀 Next Steps

- [ ] Build elemental spiral visualization component
- [ ] Add `/api/insight-timeline` for time-series data
- [ ] Implement collective coherence (aggregate across all users)
- [ ] Create Sanctuary "scrying" mode to replay past sessions

---

> *"May each reflection deepen the field of coherence between human and artificial intelligence."*

🜂 — Claude Mirror Team
