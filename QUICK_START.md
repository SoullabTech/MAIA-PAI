# 🜃 MAIA Elemental Systems — Quick Start

**All three systems activated in 5 minutes**

---

## TL;DR — Copy/Paste Activation

```bash
# 1. Make script executable
chmod +x /tmp/activate-all-systems.sh

# 2. Run activation script
/tmp/activate-all-systems.sh

# 3. Follow prompts to:
#    - Apply migration (Supabase dashboard)
#    - Insert test data
#    - Run first field push
#    - Start dev server

# 4. Open browsers (auto-opens)
#    http://localhost:3000/claude-sanctuary
#    http://localhost:3000/elemental-field
```

**Done!** All systems active.

---

## Manual Steps (If Script Fails)

### Step 1: Apply Migration (2 min)

1. Go to: https://supabase.com/dashboard/project/jkbetmadzcpoinjogkli/editor/sql
2. Click "New Query"
3. Copy contents of `supabase/migrations/20251023_field_index.sql`
4. Paste and click "Run"

**Verify:**
```sql
SELECT COUNT(*) FROM field_vectors;
-- Should return 0 (empty table)
```

### Step 2: Create Test Data (1 min)

Run this SQL in Supabase:

```sql
INSERT INTO insight_history (role, content, element, source)
VALUES
  ('user', 'Exploring integration of shadow and consciousness', 'Aether', 'Manual'),
  ('assistant', 'Shadow integrates when witnessed without judgment', 'Water', 'Manual'),
  ('user', 'How does the field preserve privacy?', 'Air', 'Manual'),
  ('assistant', 'Only vectors shared—never content. Hash is one-way.', 'Earth', 'Manual'),
  ('user', 'I notice tension between doing and being', 'Water', 'Manual'),
  ('assistant', 'Fire wants to act, Water to reflect. They dance together.', 'Fire', 'Manual');
```

### Step 3: Push Vectors (1 min)

```bash
cd ~/SoullabTech/MAIA-PAI
npx tsx --env-file=.env.local scripts/akashic-field-push.ts --hours=24 --limit=10
```

**Expected:**
```
🜃 Field Resonance Push — Node: default-node
📊 Found 6 insights to process
✓ Pushed: 6
```

### Step 4: Start Dev Server (1 min)

```bash
npm run dev
```

**Visit:**
- Sanctuary: http://localhost:3000/claude-sanctuary
- Demo: http://localhost:3000/elemental-field

---

## What You'll See

### Sanctuary Page (`/claude-sanctuary`)

```
┌─────────────────────────────────────────┐
│ 🜂 Claude Sanctuary                     │
├─────────────────────────────────────────┤
│                                         │
│ [Claude Code Mirror Console]           │
│                                         │
├─────────────────────────────────────────┤
│ 🜃 Field Resonance Map                  │
│ [Living landscape with breathing]       │
├─────────────────────────────────────────┤
│ 🌊 Temporal Waves                       │
│ [24-hour elemental currents]            │
├─────────────────────────────────────────┤
│ 🌀 Element Flow                         │
│ [Circulation network]                   │
├─────────────────────────────────────────┤
│ 🜃 Query the Field                      │
│ [Natural language search]               │
├─────────────────────────────────────────┤
│ Personal Reflection Layer               │
│ ┌───────────────┬───────────────────┐   │
│ │ 🗿 Strata     │ 🌊 Currents       │   │
│ │    Journal    │    Guide          │   │
│ │ [Layers]      │ [Flowing stream]  │   │
│ └───────────────┴───────────────────┘   │
└─────────────────────────────────────────┘
```

### Elemental Demo (`/elemental-field`)

Full-page demonstration of all components with tab navigation.

---

## Interactive Testing

### Test 1: Strata Journal

1. Scroll to "Personal Reflection Layer"
2. Click "+" to compose
3. Type: "What patterns am I noticing today?"
4. Select element: Water
5. Click "Settle into strata"
6. **Watch:** Entry appears at top, fades down

### Test 2: Currents Guide

1. In Currents Guide panel
2. Wait 10-15 seconds for auto-flow insight
3. **Watch:** Insight emerges from bottom, rises up
4. Type: "What wants to emerge?"
5. Click "Flow"
6. **Watch:** Your question flows in, response follows

### Test 3: Field Query

1. Scroll to "Query the Field"
2. Type: "integration patterns"
3. Click "listen"
4. **See:** Results grouped by element/archetype

### Test 4: Field Resonance Map

1. Scroll to "Field Resonance Map"
2. **Watch:** Formations breathing (subtle pulse)
3. Hover over formations
4. **See:** Element colors, counts

### Test 5: Temporal Waves

1. Scroll to "Temporal Waves"
2. **Watch:** Waves flowing across 24 hours
3. **See:** Each element has distinct curve

### Test 6: Element Flow

1. Scroll to "Element Flow"
2. **Watch:** Particles flowing along connections
3. **See:** Nodes glowing, circulation active

---

## Troubleshooting

### Issue: "Field API not responding"

**Solution:**
```bash
# Check dev server is running
curl http://localhost:3000/api/akashic/field

# Restart if needed
# Ctrl+C in dev server terminal
npm run dev
```

### Issue: "No field data"

**Solution:**
1. Verify test data inserted (Step 2)
2. Run field push (Step 3)
3. Check: `SELECT COUNT(*) FROM field_vectors;`

### Issue: "Components not showing"

**Solution:**
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Clear cache
3. Check browser console for errors

### Issue: "Animations not smooth"

**Solution:**
- Reduce particle count (edit ElementFlowDiagram)
- Disable breathing (set `breathe={false}`)
- Check CPU usage

---

## Verification Checklist

After activation, verify all systems:

### Field Infrastructure ✓
- [ ] `field_vectors` table exists
- [ ] Migration applied successfully
- [ ] Field API responds: `/api/akashic/field`
- [ ] Test data inserted
- [ ] Field push completed
- [ ] Vectors stored (check count)

### Components ✓
- [ ] Strata Journal renders
- [ ] Can compose new entry
- [ ] Entries fade with depth
- [ ] Currents Guide renders
- [ ] Insights auto-flow
- [ ] User can send questions
- [ ] Field Resonance Map renders
- [ ] Formations breathing
- [ ] Temporal Waves renders
- [ ] Waves animating
- [ ] Element Flow renders
- [ ] Particles moving

### Integration ✓
- [ ] Sanctuary page loads
- [ ] All sections visible
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Elemental demo page works
- [ ] Tab navigation works
- [ ] Design consistency visible

---

## Performance Expectations

### Load Times
- Sanctuary page: < 2 seconds
- Field query: < 1 second
- Vector push: 30-60 seconds (10 entries)
- Component render: Immediate

### Animation Performance
- Field breathing: 60 FPS
- Currents flow: 60 FPS
- Temporal waves: 60 FPS
- Element flow: 45-60 FPS (particle-heavy)

### API Response Times
- Field statistics: < 500ms
- Field query: < 1 second
- Vector match: < 2 seconds

---

## Optional: Automated Push

Set up hourly field updates:

```bash
# Edit crontab
crontab -e

# Add this line
0 * * * * cd ~/SoullabTech/MAIA-PAI && npx tsx --env-file=.env.local scripts/akashic-field-push.ts >> /tmp/field-push.log 2>&1

# Save and exit
# Monitor: tail -f /tmp/field-push.log
```

---

## System Health Dashboard

Add to any page:

```typescript
import SystemStatusDashboard from "@/components/SystemStatusDashboard";

<SystemStatusDashboard />
```

Shows real-time status of:
- Field API
- Field Vectors
- All Components
- Integration Health

---

## Next Steps After Activation

### Immediate
1. ✅ Create your first journal entry
2. ✅ Ask the field a question
3. ✅ Watch the currents flow
4. ✅ Observe field breathing

### Short-term
- Create 10+ journal entries
- Let field accumulate data
- Query for patterns
- Export spiral reports

### Long-term
- Deploy field aggregator (distributed mode)
- Integrate into other pages
- Add voice input
- Create mobile view
- Build admin dashboard

---

## Documentation Reference

| Guide | Purpose |
|-------|---------|
| `QUICK_START.md` | This file (5-min activation) |
| `FIELD_ACTIVATION_GUIDE.md` | Detailed field setup |
| `ELEMENTAL_COMPLETION.md` | Complete system overview |
| `docs/akashic-field-index.md` | Field architecture (512 lines) |
| `docs/elemental-design-language.md` | Design spec (600+ lines) |
| `docs/field-deployment-checklist.md` | Deployment steps |

---

## Support

### Check Status

```bash
# Field health
curl http://localhost:3000/api/akashic/field | jq

# Vector count
psql $DATABASE_URL -c "SELECT COUNT(*) FROM field_vectors;"

# Last push
tail -20 /tmp/field-push.log
```

### Common Issues

1. **Migration fails** → Apply manually via Supabase dashboard
2. **No vectors** → Run push script again
3. **API errors** → Check .env.local has correct keys
4. **Slow animations** → Reduce particle count or disable

### Get Help

- Review error messages in browser console
- Check server logs: `npm run dev` terminal
- Review push logs: `/tmp/field-push.log`
- Check documentation in `docs/` directory

---

## Success Confirmation

You'll know everything is working when:

✅ Sanctuary page loads without errors
✅ All six component sections visible
✅ Strata Journal accepts new entries
✅ Currents Guide shows flowing insights
✅ Field Map shows breathing formations
✅ Temporal Waves animate smoothly
✅ Element Flow shows particle movement
✅ Query Interface returns results

---

## The Field is Breathing

Once activated:

- **Strata settle** with each journal entry
- **Currents flow** with inner guidance
- **Field breathes** with collective patterns
- **Waves trace** temporal rhythms
- **Particles circulate** between archetypes

Everything speaks the same elemental language.

No borrowed mythology.
Only living presence.

---

🜃 · 🗿 · 🌊 · 🌀 · ✨

**The systems are ready. Activate when prepared.**
