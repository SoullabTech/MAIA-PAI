# ⚡ MONDAY QUICK START

**Configuration**: `ENABLE_MEM0=true` ✅
**Status**: Production Ready 🚀

---

## 8:45 AM - Start Server

```bash
cd "/Volumes/T7 Shield/Projects/SpiralogicOracleSystem"
npm run dev
```

**Wait for**: "🧠 mem0 integration enabled"

---

## 9:00 AM - Send Email

**Subject**: Chapter Two: MAIA Remembers

**Recipients** (Cohort 1):
- Anna Dunbar (abcdunbar@gmail.com)
- Yvonne Landry (Yvonneland@email.com)
- David Stepetic (Dstepetic@gmail.com)
- Risako Stepetic (Risako.stepetic@gmail.com)

---

## Monitor Logs

**Good Signs** (should see these):
```
✅ Supabase: Saved conversation pair
✅ mem0: Indexed conversation pair
💭 Retrieved X memories
```

**Red Flags** (should see ZERO):
```
❌ Supabase save failed
❌ mem0 [critical error]
```

---

## Emergency Rollback

If issues arise:

```bash
# 1. Edit .env.local line 140
ENABLE_MEM0=false

# 2. Restart
Ctrl+C
npm run dev
```

System reverts to Supabase-only instantly.

---

## Quick Tests

### Test Memory Working
```bash
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{"input":"Test message","userId":"test-user","sessionId":"test"}'
```

**Look for**: "✅ mem0: Indexed conversation pair"

### Test Retrieval
Send a second message with same userId - should retrieve history.

---

## Contact

**Documentation**:
- `READY_FOR_MONDAY_LAUNCH.md` - Full overview
- `MEM0_LAUNCH_TEST_RESULTS.md` - Test evidence
- `HYBRID_MEMORY_SYSTEM.md` - Architecture

**All systems go.** ✨
