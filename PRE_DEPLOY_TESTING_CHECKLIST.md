# Pre-Deploy Testing Checklist

## All Fixes Made Today (2025-10-21)

### 1. React Hydration Errors ✅
**Fixed:** TransformationalPresence component hydration mismatch
**Files changed:**
- `components/nlp/TransformationalPresence.tsx`
**What to test:**
- [ ] Go to main conversation page
- [ ] Check browser console - should see NO hydration warnings
- [ ] Animated breathing should appear smoothly

### 2. OpenAI WebRTC API Error ✅
**Fixed:** Missing `session.type` parameter in WebRTC connection
**Files changed:**
- `apps/web/app/api/voice/webrtc-session/route.ts`
**What to test:**
- [ ] Try to connect MAIA voice on conversation page
- [ ] Should NOT see "Missing required parameter: 'session.type'" error
- [ ] Voice connection should establish (may still fail for other reasons - that's separate)

### 3. MAIA Personality Health Check ✅
**Fixed:** False positives on greeting responses
**Files changed:**
- `lib/constants/dev-mode.ts`
**What to test:**
- [ ] Say "hi MAIA" and get a response
- [ ] Should NOT see personality health warnings for short greetings
- [ ] Console should show: `✓ MAIA personality health: Good`

### 4. Excessive BiometricStorage Logs ✅
**Fixed:** Duplicate initialization preventing spam
**Files changed:**
- `lib/biometrics/BiometricStorage.ts`
- `components/nlp/TransformationalPresence.tsx`
**What to test:**
- [ ] Go to main conversation page
- [ ] Check console - should see "✅ Biometric storage initialized" ONCE
- [ ] Should NOT see hundreds of repeated logs

### 5. Apple Health Import - White Text ✅
**Fixed:** Text color in success message
**Files changed:**
- `components/biometrics/HealthDataUploader.tsx`
**What to test:**
- [ ] Go to http://localhost:3000/settings/biometrics
- [ ] All text should be readable (no white-on-white)
- [ ] Numbers should show in dark gray/green colors

### 6. Apple Health Import - Large Files ✅
**Fixed:** Automatic server-side filtering for files > 100 MB
**Files changed:**
- `app/api/health/import/route.ts` (NEW)
- `components/biometrics/HealthDataUploader.tsx`
- `scripts/extract-hrv-from-apple-health.py` (NEW)
**What to test:**
- [ ] Upload the original large `export.xml` (1 GB)
- [ ] Should see: "File is large, using server-side processing..."
- [ ] Should automatically filter and import successfully
- [ ] Console should show server filtering happened

---

## Critical Tests Before Deploy

### Test 1: MAIA Voice Connection
**URL:** http://localhost:3000

**Steps:**
1. Open browser console (F12)
2. Click microphone icon to enable voice
3. Say "hi MAIA can you hear me"
4. Check console for errors

**Expected behavior:**
- ✅ Should see: "🔌 Connecting MAIA Realtime..."
- ✅ Should see WebRTC connection attempt
- ✅ Should NOT see "Missing required parameter: 'session.type'"
- ⚠️ May see other connection errors (OpenAI API key issues, etc.) - those are separate

**Current status from logs earlier:**
```
❌ Connection error: Error: Failed to connect to OpenAI: 400
Missing required parameter: 'session.type'
```
This should now be FIXED.

---

### Test 2: Apple Health Large File Import
**URL:** http://localhost:3000/settings/biometrics

**Steps:**
1. Click "Click to upload export.xml"
2. Select the ORIGINAL `export.xml` file (1 GB)
3. Watch browser console

**Expected behavior:**
- ✅ Should see: "📤 File is large (1004 MB), using server-side processing..."
- ✅ Should upload to `/api/health/import`
- ✅ Server processes and filters in < 60 seconds
- ✅ Returns filtered XML
- ✅ Browser parses and stores HRV data
- ✅ Success message with readable text

**What could fail:**
- Server timeout (60s limit)
- Memory issues on server
- Regex filtering bugs

---

### Test 3: Biometric Coherence Detection
**URL:** http://localhost:3000

**Steps:**
1. Make sure HRV data is imported
2. Go to main conversation
3. Open console
4. Wait 30 seconds

**Expected behavior:**
- ✅ Every 30 seconds, should see: "⌚ Coherence: {...}"
- ✅ Should analyze your HRV and suggest presence states
- ✅ Interface may subtly shift based on coherence

---

### Test 4: Mobile Upload Flow (iPhone)
**URL:** http://localhost:3000/settings/biometrics (on iPhone)

**Steps:**
1. AirDrop `export_hrv_filtered.xml` (762 KB) to iPhone
2. Save to Files app
3. Open MAIA PWA on iPhone
4. Try to upload the filtered file

**Expected behavior:**
- ✅ Small file (762 KB) should upload successfully
- ✅ Text should be readable
- ✅ Should complete in < 10 seconds

**Known limitations:**
- Large file (1 GB) upload may not work on mobile Safari
- That's why we created the filtered version

---

## Quick Test Script

Run these commands to verify everything works:

```bash
# 1. Check dev server is running
curl http://localhost:3000 -I

# 2. Test API endpoint exists
curl http://localhost:3000/api/health/import -I

# 3. Check for compilation errors
# (Already done - server is running)

# 4. Verify filtered file exists
ls -lh ~/Desktop/export_hrv_filtered.xml
```

---

## What to Check Before Deploy

- [ ] All console.log debugging removed or converted to proper logging
- [ ] No sensitive data in code
- [ ] Environment variables set correctly
- [ ] `.env.local` has OPENAI_API_KEY
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] All tests pass (if you have tests)

---

## Known Issues (Not Fixed Today)

1. **OpenAI API Key** - You need a valid key for voice to fully work
2. **WebRTC connection** - May fail for other reasons beyond the `session.type` fix
3. **Mobile file upload** - Safari on iOS has strict limits
4. **Webpack cache warnings** - Cosmetic, not critical

---

## Files Changed Summary

### New Files:
- `app/api/health/import/route.ts` - Server-side large file filtering
- `scripts/extract-hrv-from-apple-health.py` - Python script for manual filtering
- `HOW_TO_IMPORT_APPLE_HEALTH.md` - User documentation
- `PRE_DEPLOY_TESTING_CHECKLIST.md` - This file

### Modified Files:
- `components/nlp/TransformationalPresence.tsx` - Hydration fix + biometric monitoring
- `components/biometrics/HealthDataUploader.tsx` - Text colors + server-side filtering
- `lib/biometrics/BiometricStorage.ts` - Idempotent initialization
- `lib/constants/dev-mode.ts` - Smarter personality health checks
- `apps/web/app/api/voice/webrtc-session/route.ts` - Fixed session.type parameter

---

## Ready to Deploy?

**Before you say yes:**
1. Test voice connection manually
2. Test large file upload manually
3. Check console for errors
4. Verify text is readable on settings page

**Then:**
```bash
git add .
git commit -m "fix: React hydration, WebRTC session.type, biometric storage, and Apple Health import

- Fix TransformationalPresence hydration mismatch
- Add session.type parameter to WebRTC API call
- Make BiometricStorage.init() idempotent
- Improve personality health check to allow short greetings
- Fix white-on-white text in health import success message
- Add server-side filtering for large Apple Health exports (>100MB)
- Create Python script for manual health data filtering
- Add comprehensive documentation for health data import"

git push
```
