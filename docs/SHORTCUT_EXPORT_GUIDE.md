# How to Export & Share MAIA HRV Sync Shortcut

## Goal
Create a one-tap install link for the MAIA HRV sync shortcut.

---

## Method 1: iCloud Link (Recommended)

### Steps to Create Shareable Link:

1. **Open Shortcuts app** on your iPhone
2. **Find your working shortcut** ("Send HRV to MAIA" or similar)
3. **Long-press the shortcut** → tap "Share"
4. **Choose "Copy iCloud Link"**
5. **Paste link** into this file for distribution

### Once You Have the Link:

**Distribution:**
- Add to soullab.life homepage: "Download MAIA Sync"
- Share in WhatsApp/Telegram/Discord
- Include in white paper appendix
- Post on Twitter/LinkedIn with launch

**User Experience:**
1. User taps link on iPhone
2. Shortcuts app opens: "Add MAIA HRV Sync?"
3. User taps "Add Shortcut"
4. Done! Ready to run.

---

## Method 2: Manual Recreation Guide

### For Users Who Want to Build It Themselves:

**Steps:**

1. Open Shortcuts app → tap "+"
2. Search "Find Health Samples" → Add
   - Type: Heart Rate Variability
   - Limit: 1 (toggle ON)
   - Sort: Start Date, Latest First
3. Search "Find Health Samples" → Add again
   - Type: Heart Rate
   - Limit: 1 (toggle ON)
   - Sort: Start Date, Latest First
4. Search "Get Contents of URL" → Add
   - URL: `https://soullab.life/api/biometrics/stream`
   - Method: POST
   - Headers: Add "Content-Type" = "application/json"
   - Request Body: JSON → Add fields:
     - userId: (your username)
     - timestamp: Current Date variable
     - hrv: Health Samples (from step 2)
     - heartRate: Health Samples (from step 3)
     - source: "apple-shortcuts"
5. Search "Show Result" → Add
   - Show: Contents of URL (from step 4)
6. Name it "MAIA HRV Sync"
7. Done!

---

## Method 3: AirDrop/Files App

### Export as File:

1. Long-press shortcut → "Share"
2. Choose "Save to Files"
3. Save to iCloud Drive or Dropbox
4. Share `.shortcut` file directly

**User receives file:**
- Open in Shortcuts app
- Automatic import
- Ready to use

---

## Current Status

### Working Configuration:
- ✅ Network connectivity (iPhone → Mac server)
- ✅ API endpoint functional
- ⚠️ JSON body population needs fixing

### To Fix Before Distribution:

**Issue:** Dictionary fields show "0 items" and don't populate with health data

**Solution Options:**
1. **Recreate manually** with correct variable binding
2. **Use Text → JSON approach** instead of Dictionary
3. **Wait for iOS native app** (better UX anyway)

---

## Alternative: QR Code Generator

### Create QR Code for Quick Install:

```bash
# Generate QR code for iCloud link
# (Once we have working iCloud link)

qr "https://www.icloud.com/shortcuts/abc123..." > maia-sync-qr.png
```

**User scans QR → Shortcuts app opens → One tap install** ✅

---

## Next Steps

**Immediate:**
1. Fix the current shortcut's Dictionary/JSON issue
2. Test it works end-to-end
3. Generate iCloud share link
4. Add to soullab.life

**Long-term:**
1. Build iOS native app (see IOS_NATIVE_APP_PLAN.md)
2. Deprecate shortcut in favor of app
3. Keep shortcut as "advanced" option for power users

---

## For Beta Testers

**Testing Checklist:**
- [ ] Link opens Shortcuts app correctly
- [ ] Shortcut adds without errors
- [ ] First run requests HealthKit permissions
- [ ] Permissions granted successfully
- [ ] Shortcut executes and shows success
- [ ] Server receives data (check with Kelly)
- [ ] Coherence analysis shown in result

**Feedback Form:**
- Did the link work?
- Was setup confusing?
- Did you grant permissions?
- Do you see your coherence score?
- Would you use this daily?

---

**Goal:** Make consciousness tracking so easy that anyone can start in 30 seconds. 🚀
