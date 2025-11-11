# MAIA "Glitching" Issue - Fixed

## Problem
MAIA was appearing to "glitch" with these symptoms:
1. Auto-recovery timer triggering incorrectly
2. API timeout after 25 seconds
3. Emergency state reset interrupting conversations
4. "I'm having trouble responding" messages

## Root Causes

### 1. Old Cached JavaScript in Browser ✅ FIXED
**Symptom**: Auto-recovery logs without session ID prefix
**Cause**: Browser running old bundled code from before our fixes
**Solution**: User needs to **hard refresh** browser

**How to Hard Refresh:**
- **Mac**: Cmd + Shift + R
- **PC**: Ctrl + Shift + R
- **Or**: Open Dev Tools → Right-click reload → "Empty Cache and Hard Reload"

### 2. API Timeout Too Aggressive ✅ FIXED
**Symptom**: API requests timing out after 25 seconds
**Cause**: Teen support system + complex responses can take longer
**Solution**: Increased timeout from 25s to 60s

**File Changed**: `components/OracleConversation.tsx:1498-1501`
```typescript
// BEFORE:
}, 25000); // 25 second timeout

// AFTER:
}, 60000); // 60 second timeout - allow time for complex responses
```

## Current Status

### ✅ Code Fixes Applied
1. Auto-recovery timer uses refs to check current state (not stale closure values)
2. Auto-recovery skips if audio is playing
3. API timeout increased to 60 seconds
4. Session ID logging for debugging

### 🔄 User Action Required
**Please hard refresh your browser** to get the latest JavaScript bundle:
- Mac: Cmd + Shift + R
- PC: Ctrl + Shift + R

## Verification Steps

After hard refresh, you should see:

1. **Correct logging format** with session IDs:
```
🔄 [recovery-1762854392735] Recovery timer started
✅ [recovery-1762854392735] Audio still playing - no recovery needed
```

2. **No premature auto-recovery** while MAIA is speaking

3. **Longer API timeout** (60s instead of 25s)

4. **Successful responses** without timeouts

## If Issues Persist

### Check API Performance
If API is still timing out after 60s:

1. **Check OpenAI API status**: https://status.openai.com
2. **Check network connection**: Slow internet can cause delays
3. **Check API logs**: Look for slow responses in `/api/between/chat`

### Check Auto-Recovery
If auto-recovery still triggers incorrectly:

1. **Verify hard refresh worked**: Check console logs for session ID format
2. **Check browser console**: Look for `[recovery-XXXXX]` prefixes
3. **Report exact console logs**: Send full console output for debugging

## Files Modified Today

1. **components/OracleConversation.tsx**
   - Line 898-901: Sync refs with state
   - Line 910-944: Auto-recovery timer with ref checks
   - Line 1498-1501: Increased API timeout to 60s

2. **apps/web/lib/safety/abuseDetection.ts** (NEW)
   - Abuse detection system for MAIA protection

3. **apps/web/lib/safety/teenSupportIntegration.ts** (UPDATED)
   - Crisis companion mode (never blocks except abuse)
   - Abuse detection integration

## Next Steps

1. **Hard refresh browser** to get latest code
2. **Test MAIA** with a simple message
3. **Verify** no auto-recovery triggers incorrectly
4. **Monitor** API response times

If everything works after hard refresh, the teen support system is **ready for production use**! 🎉

---

**Date**: 2025-11-11
**Status**: ✅ Fixed - Awaiting user hard refresh
**Issue**: API timeouts + old cached JavaScript
**Solution**: Increased timeout + hard refresh needed
