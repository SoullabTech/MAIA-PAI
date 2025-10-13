# Service Worker & Cache Reset Guide

## When to Use This
- After updating service worker code
- When experiencing cache quota errors
- When you see stale cached content
- After major code changes to cached assets

---

## Complete Reset Procedure

### 1. Terminal - Clear Next.js Build Cache

```bash
rm -rf .next
npm run dev
```

This removes the Next.js build cache for a fresh compile.

---

### 2. Chrome DevTools - Clear All Site Data

1. Open your site (http://localhost:3000)
2. Press **F12** (Mac: **Cmd+Opt+I**) → DevTools
3. Go to **Application** tab
4. Left sidebar → **Storage** → **Clear site data**
5. ✅ Ensure these are checked:
   - Unregister service workers
   - Clear storage
6. Click **Clear site data** button

**This removes:**
- Service worker registrations
- All caches (STATIC, RUNTIME, IMAGE)
- IndexedDB
- LocalStorage
- Session Storage

---

### 3. Hard Reload

Force browser to bypass cache:

- **Mac**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + R`
- **Alternative**: Hold `Shift` + click refresh button

---

### 4. Verify Installation

#### Check Service Worker Status
**DevTools → Application → Service Workers**

Should show:
```
maya-v2.0.0 (new) - Activated and is running
Status: activated
```

#### Check Console Logs
Should see:
```
✅ Maya SW Install complete
✅ Maya SW Activated
🚀 Maya SW Installing: v2.0.0
```

#### Verify Quota Protection
Trigger a cache operation, console should show:
```
⚠️ Cache quota exceeded, clearing oldest entries...
🗑️ Cleared [N] cache entries
```

---

## Troubleshooting

### Service Worker Won't Update
1. **DevTools → Application → Service Workers**
2. Check "Update on reload"
3. Click "Unregister" on old service worker
4. Hard reload

### Still Seeing Old Errors
```bash
# Nuclear option - clear ALL Chrome data for localhost
# DevTools → Application → Storage → Clear site data
# Then close ALL Chrome tabs
# Restart Chrome
# Open fresh tab → localhost:3000
```

### Cache Quota Still Exceeded
```javascript
// In browser console, manually clear all caches:
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
  console.log('🗑️ All caches cleared');
});
```

---

## Quick Reference Commands

```bash
# Full reset sequence
rm -rf .next && npm run dev

# Then in browser:
# F12 → Application → Clear site data → Cmd+Shift+R
```

---

## What Got Fixed

### 1. QuotaExceededError
- ✅ Added `safeCachePut()` with automatic cleanup
- ✅ Clears oldest 50% of entries when quota exceeded
- ✅ Applied to all caching strategies

### 2. API Failures
- ✅ Root cause was service worker quota blocking requests
- ✅ Fixed by quota handling above

### 3. Supabase 400 Errors
- ✅ Added UUID validation in `trackActivity()`
- ✅ Skips DB writes for non-UUID users like 'guest'

### 4. Speech Recognition Error Spam
- ✅ Suppressed harmless "no-speech" logs
- ✅ Proper handling for network/permission errors

---

## Expected Behavior After Reset

### Console - Clean Logs ✅
```
🚀 Maya SW Installing: v2.0.0
✅ Maya SW Install complete
⚡ Maya SW Activating: v2.0.0
🗑️ Deleting old cache: maya-runtime-v1.0.0
✅ Maya SW Activated
🎤 [ContinuousConversation] Recognition started
```

### Console - No More ❌
- ~~QuotaExceededError~~
- ~~Failed to fetch (from service worker)~~
- ~~PATCH users 400 Bad Request~~
- ~~❌ [Continuous] Speech recognition error: no-speech~~

### What You Should See
- Voice recognition working smoothly
- API calls succeeding
- No Supabase errors for guest users
- Only meaningful errors logged

---

## Files Modified

1. `/public/sw-enhanced.js` - Service worker with quota protection
2. `/lib/tracking/userActivityTracker.ts` - UUID validation
3. `/apps/web/components/voice/ContinuousConversation.tsx` - Better error handling

---

## Support

If issues persist after following this guide:
1. Check browser console for new error messages
2. Verify `npm run dev` is running without errors
3. Check Network tab in DevTools for failing requests
4. Ensure microphone permissions are granted
