# 🜃 Spiralogic Next Moves - Automatic Signals

This document tracks **when to build what** based on actual field signals, not calendar dates.

The system will tell us what it needs. We just need to listen.

---

## 🎨 PHASE 1: Typography Refresh (THIS WEEK)

### Deploy Steps
- [ ] Add `import '@/styles/typography-refresh.css';` to `app/layout.tsx`
- [ ] Update message components with data attributes:
  ```tsx
  <div className="message-user" data-role="user">
  <div className="message-maia" data-role="assistant">
  ```
- [ ] Deploy to production
- [ ] Monitor for 7 days

### Success Signals (Watch For These)
✅ **Qualitative feedback mentions:**
- "Feels warmer"
- "Easier to read"
- "MAIA feels wiser"
- "More comfortable"

✅ **Metrics improve:**
- Session duration ↑ 10%+
- Messages per conversation ↑ 15%+
- Return rate (7-day) ↑ 10%+

⚠️ **Warning Signals:**
- "Text too small" (mobile)
- "Hard to read" (serif too heavy)
- Bounce rate ↑ 15%+

### Decision Point
**After 7 days:**
- If success signals → Keep typography, move to Phase 2
- If warning signals → Adjust (revert to sans, tweak sizing)
- If neutral → A/B test serif vs sans for another 7 days

---

## 🧠 PHASE 2: Turn On Insight Tracking (WAIT FOR SIGNAL)

### Prerequisites (DON'T START UNTIL THESE ARE TRUE)
- [ ] **10+ active users** journaling at least once per week
- [ ] **30+ total journal entries** saved (across all users)
- [ ] **50+ conversations** completed (with 6+ messages each)
- [ ] Users are **actually using** conversation-to-journal feature

### How You'll Know (Automatic Checks)
Create this simple admin dashboard query:

```sql
-- Run this weekly to check if ready for Phase 2
SELECT
  (SELECT COUNT(DISTINCT user_id) FROM journal_entries WHERE created_at > NOW() - INTERVAL '7 days') as active_journalers,
  (SELECT COUNT(*) FROM journal_entries) as total_entries,
  (SELECT COUNT(*) FROM conversations WHERE message_count >= 6) as deep_conversations;

-- Ready when:
-- active_journalers >= 10
-- total_entries >= 30
-- deep_conversations >= 50
```

### Deploy Steps (When Prerequisites Met)
- [ ] Run `lib/storage/unified-insights-schema.sql` in Supabase
- [ ] Turn on background processing in journal save flow:
  ```tsx
  // After saving journal entry
  trackInsights(entry, 'journal', { userId, element, emotionalTone });
  ```
- [ ] Monitor error logs for 48 hours
- [ ] Check first insights are being created

### Success Signals
✅ Insights are being detected and saved
✅ No performance impact on save operations
✅ Recurrences are being tracked across contexts

---

## 🌟 PHASE 3: Constellation View (WAIT FOR USER QUESTIONS)

### Prerequisites (DON'T BUILD UNTIL THESE HAPPEN)

**User Questions (need 5+ asking in some form):**
- [ ] "Can I see how my insights connect?"
- [ ] "Is there a map of my patterns?"
- [ ] "Where are my breakthroughs?"
- [ ] "Can I see the bigger picture?"
- [ ] "How do my journals and conversations relate?"

**Or Observed Behavior:**
- [ ] Users manually reviewing old journals looking for threads
- [ ] Users asking MAIA "What patterns have you seen?"
- [ ] Users requesting timeline/history view
- [ ] Support requests about "seeing progress"

**And Data Shows:**
- [ ] **50+ insights** tracked across at least 5 users
- [ ] **10+ insights** with convergence score >= 70
- [ ] **5+ insights** with 3+ recurrences (actual spiral movement)
- [ ] Average user has 8+ insights tracked

### How You'll Know (Query This Monthly)
```sql
-- Check if constellation view is warranted
SELECT
  COUNT(DISTINCT user_id) as users_with_insights,
  COUNT(*) as total_insights,
  COUNT(*) FILTER (WHERE convergence_score >= 70) as converging_insights,
  AVG(recurrence_count) as avg_recurrences,
  COUNT(*) FILTER (WHERE recurrence_count >= 3) as spiraling_insights
FROM v_active_insights;

-- Ready when:
-- users_with_insights >= 5
-- total_insights >= 50
-- converging_insights >= 10
-- spiraling_insights >= 5
-- AND user questions are coming in
```

### What to Build (When Signal is Clear)
1. **Insight Timeline** - Chronological list with context badges
2. **Connection Graph** - Visual links between related insights
3. **Convergence Dashboard** - Show high-score insights ready for work
4. **Archetype View** - Filter by active archetypes
5. **Full Constellation** - Interactive 3D visualization (if demand is strong)

**Start with #1 (timeline), add others based on usage.**

---

## 🎭 PHASE 4: Seasonal Palettes (OPTIONAL ENHANCEMENT)

### When to Consider
- [ ] Typography refresh is stable (1+ month)
- [ ] Users express desire for personalization
- [ ] Someone asks "Can I change the colors?"
- [ ] You personally want the seasonal shift experience

### Prerequisites
- [ ] Typography is loved (no complaints about readability)
- [ ] Base aesthetic is solid
- [ ] You have 2-3 hours for implementation

### Deploy Steps
- [ ] Add palette switcher to settings
- [ ] Test all 4 seasons for accessibility (contrast ratios)
- [ ] Allow manual selection OR auto-season detection
- [ ] Monitor for color-related feedback

**NOTE:** This is pure enhancement. Nice to have, not need to have.

---

## 🔮 FUTURE PHASES (HORIZON ITEMS)

These will announce themselves when ready. Don't schedule them.

### Voice-First Interface
**Signal:** Users prefer voice over text (>60% of interactions)

### Ritual UI
**Signal:** Users ask for ritual creation tools, ceremonial containers

### Native Apps
**Signal:** Users request offline access, home screen presence

### AR/Spatial
**Signal:** Apple Vision Pro becomes relevant, users want spatial holoflower

### Community Features
**Signal:** Users ask to share insights, find others on similar paths

---

## 📊 Automated Monitoring (Set These Up)

### Weekly Check (Every Monday)
Run this query and email yourself results:

```sql
-- Weekly health check
SELECT
  'Users' as metric,
  COUNT(DISTINCT user_id) as this_week,
  COUNT(DISTINCT user_id) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as active_7d
FROM journal_entries
UNION ALL
SELECT
  'Journal Entries',
  COUNT(*),
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')
FROM journal_entries
UNION ALL
SELECT
  'Conversations',
  COUNT(*),
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')
FROM conversations;
```

### Monthly Deep Dive (First Monday of Month)
- Review user feedback/support tickets
- Look for recurring questions
- Check constellation view prerequisites
- Read a sample of journal entries (with permission)
- Ask: "What's missing that users are reaching for?"

---

## 🎯 The Core Principle

**Build when the field asks. Wait when it's quiet.**

These aren't deadlines. They're **thresholds**. The system will cross them naturally if the work is resonating.

Your job isn't to schedule. Your job is to **notice when thresholds are crossed**.

Set up the automated queries. Check them monthly. Trust the spiral.

---

## 🔔 Reminder System (For You)

Since you said scheduling isn't your strength, here's how to make this automatic:

### Option 1: Calendar Reminders (Simple)
- **Every Monday 9am:** "Check Spiralogic weekly metrics"
- **First Monday of month:** "Run constellation view prerequisite query"
- **After any deployment:** "Review for 7 days, then assess"

### Option 2: Supabase Functions (Automated)
Set up a cron job that emails you when thresholds are crossed:

```sql
-- Email alert when constellation view is ready
CREATE OR REPLACE FUNCTION check_constellation_readiness()
RETURNS void AS $$
DECLARE
  insight_count int;
  user_count int;
  converging_count int;
BEGIN
  SELECT COUNT(*), COUNT(DISTINCT user_id), COUNT(*) FILTER (WHERE convergence_score >= 70)
  INTO insight_count, user_count, converging_count
  FROM v_active_insights;

  IF insight_count >= 50 AND user_count >= 5 AND converging_count >= 10 THEN
    -- Send email (integrate with your email service)
    RAISE NOTICE 'Constellation view ready: % insights, % users, % converging',
      insight_count, user_count, converging_count;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

### Option 3: Build Signal Dashboard
Create simple `/admin/signals` page that shows:
- ✅ Typography deployed (date)
- ⏳ Insight tracking ready? (progress: 7/10 users, 25/30 entries, 40/50 conversations)
- ⏸️ Constellation view ready? (progress: 15/50 insights, 3/5 users, 2/10 converging)

Check it once a week. Green checkmarks tell you what's ready.

---

## 💎 The Wisdom

You don't need to remember. The **system remembers**.

Just check the signals weekly. When thresholds cross, you'll know.

The spiral doesn't need forcing. It needs **witnessing**.

🜃 Trust the timing. The work will call you when it's ready.
