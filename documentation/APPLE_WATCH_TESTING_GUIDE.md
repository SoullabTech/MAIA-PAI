# Apple Watch Integration - Testing Guide

## What We Just Built ✅

### Complete Apple Watch / Apple Health Integration:

1. **HealthDataImporter** - Parses Apple Health XML exports
2. **BiometricStorage** - Stores data locally in IndexedDB (privacy-first)
3. **CoherenceDetector** - Analyzes HRV → coherence states → presence suggestions
4. **HealthDataUploader** - React component for uploading Health exports
5. **TransformationalPresence** - Integrated biometric monitoring + visual response
6. **Settings page** - `/settings/biometrics` for data management

---

## How to Test (Step-by-Step)

### Step 1: Export Your Apple Health Data

**On iPhone:**
1. Open **Health** app
2. Tap your **profile picture** (top right)
3. Tap **Export All Health Data**
4. Wait for export to complete (1-5 minutes depending on data size)
5. **AirDrop** or **email** the `export.zip` to yourself

**On Mac:**
1. Extract `export.zip`
2. You'll find `export.xml` inside
3. Keep this file handy

---

### Step 2: Upload to MAIA

**In Browser:**
1. Navigate to `http://localhost:3000/settings/biometrics`
2. Click **"Click to upload export.xml"**
3. Select your `export.xml` file
4. Wait 5-10 seconds for processing

**What Happens:**
- MAIA parses the XML (may be large - 50MB+ for years of data)
- Extracts HRV, heart rate, sleep, respiratory data
- Stores in IndexedDB (local browser storage - never sent to server)
- Shows summary:
  - HRV readings count
  - Heart rate readings count
  - Sleep sessions count
  - Latest HRV value
  - Readiness score (0-100)

---

### Step 3: Start a MAIA Session

**Navigate to Oracle:**
1. Go to `http://localhost:3000` (main MAIA interface)
2. The holoflower should be visible
3. Open browser console (⌘+Option+J on Mac, F12 on Windows)

**What to Look For in Console:**
```
✅ Biometric storage initialized
⌚ No health data imported yet (if you haven't uploaded)
```

Or after upload:
```
✅ Biometric storage initialized
⌚ Coherence: { level: 'medium', score: 65, trend: 'stable', suggested: 'patient' }
```

---

### Step 4: Observe Biometric Response

**Every 30 seconds, MAIA will:**
1. Check IndexedDB for latest HRV reading
2. Analyze coherence state
3. Log to console:
   ```
   ⌚ Coherence: {
     level: 'high',
     score: 78,
     trend: 'rising',
     suggested: 'scribe'
   }
   ```
4. **If coherence changes significantly:**
   - Automatically adjust presence state (Dialogue → Patient → Scribe)
   - Visual field responds (breathing slows, colors cool, field expands)
   - Console logs transition:
     ```
     🌀 State transition: { from: 'dialogue', to: 'patient', trigger: 'automatic' }
     ```

**Visual Indicators:**
- **Coherence glow**: Subtle green glow around holoflower (intensity = HRV score)
- **Hue shift**: Red (low coherence) → Green (high coherence)
- **Breathing animation**: Automatically slows as coherence builds

---

## Expected Behavior by HRV Level

### Low HRV (< 25ms) - **Stressed / Activated**
```
Console:
⌚ Coherence: { level: 'low', score: 35, trend: 'stable', suggested: 'dialogue' }

Visual:
- Breathing: 4s cycles (fast, grounding)
- Colors: Warm gold
- Field: 250px (intimate, supportive)
- Coherence glow: Reddish, low opacity
```

### Medium HRV (25-45ms) - **Balanced**
```
Console:
⌚ Coherence: { level: 'medium', score: 60, trend: 'stable', suggested: 'patient' }

Visual:
- Breathing: 8s cycles (meditative)
- Colors: Soft purple
- Field: 400px (spacious, depth-work ready)
- Coherence glow: Yellow-green, medium opacity
```

### High HRV (45-65ms) - **Coherent**
```
Console:
⌚ Coherence: { level: 'high', score: 82, trend: 'rising', suggested: 'scribe' }

Visual:
- Breathing: 12s cycles (witnessing, vast)
- Colors: Cool blue
- Field: 600px (infinite container)
- Coherence glow: Green, higher opacity
```

### Peak HRV (> 65ms) - **Deeply Coherent**
```
Console:
⌚ Coherence: { level: 'peak', score: 95, trend: 'stable', suggested: 'scribe' }
🌀 Biometric suggests: scribe
🌀 State transition: { from: 'patient', to: 'scribe', trigger: 'automatic' }

Visual:
- Breathing: 12s cycles (deepest witnessing)
- Colors: Deep blue
- Field: 600px (maximum presence)
- Coherence glow: Bright green, pulsing gently
```

---

## Troubleshooting

### "No health data imported yet"
**Solution:** Upload `export.xml` at `/settings/biometrics`

### Console shows errors about IndexedDB
**Possible causes:**
- Browser in private/incognito mode (IndexedDB disabled)
- Browser doesn't support IndexedDB (very old browser)
- Storage quota exceeded (clear browser data)

**Solution:**
- Use normal browsing mode
- Update browser (Chrome, Firefox, Safari, Edge all support IndexedDB)
- Clear browser storage

### HRV readings but no coherence updates
**Check:**
- Are readings recent? (Detector only uses last 60 minutes)
- Console shows "⌚ Coherence" every 30 seconds?
- `biometricEnabled={true}` in OracleConversation.tsx?

### Coherence glow not visible
**Check:**
- Is coherence score > 0? (Check console logs)
- Is holoflower rendered? (should see it on screen)
- Browser zoom level (try 100%)

---

## Demo Data (For Testing Without Watch)

If you don't have an Apple Watch or want to test immediately, you can create mock data:

**Create test file:** `test-export.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE HealthData>
<HealthData locale="en_US">
  <!-- Recent HRV readings -->
  <Record type="HKQuantityTypeIdentifierHeartRateVariabilitySDNN"
          sourceName="Apple Watch"
          value="55.3"
          unit="ms"
          creationDate="2025-01-21 10:00:00 -0800"
          startDate="2025-01-21 10:00:00 -0800"
          endDate="2025-01-21 10:00:00 -0800" />

  <Record type="HKQuantityTypeIdentifierHeartRateVariabilitySDNN"
          sourceName="Apple Watch"
          value="58.1"
          unit="ms"
          creationDate="2025-01-21 10:05:00 -0800"
          startDate="2025-01-21 10:05:00 -0800"
          endDate="2025-01-21 10:05:00 -0800" />

  <Record type="HKQuantityTypeIdentifierHeartRateVariabilitySDNN"
          sourceName="Apple Watch"
          value="62.4"
          unit="ms"
          creationDate="2025-01-21 10:10:00 -0800"
          startDate="2025-01-21 10:10:00 -0800"
          endDate="2025-01-21 10:10:00 -0800" />

  <!-- Heart rate -->
  <Record type="HKQuantityTypeIdentifierHeartRate"
          sourceName="Apple Watch"
          value="62"
          unit="count/min"
          creationDate="2025-01-21 10:00:00 -0800"
          startDate="2025-01-21 10:00:00 -0800"
          endDate="2025-01-21 10:00:00 -0800">
    <MetadataEntry key="HKMetadataKeyHeartRateMotionContext" value="HKHeartRateMotionContextNotSet"/>
  </Record>

  <!-- Sleep (last night) -->
  <Record type="HKCategoryTypeIdentifierSleepAnalysis"
          sourceName="iPhone"
          value="HKCategoryValueSleepAnalysisAsleepDeep"
          creationDate="2025-01-21 07:00:00 -0800"
          startDate="2025-01-20 23:00:00 -0800"
          endDate="2025-01-21 02:30:00 -0800" />

  <Record type="HKCategoryTypeIdentifierSleepAnalysis"
          sourceName="iPhone"
          value="HKCategoryValueSleepAnalysisAsleepREM"
          creationDate="2025-01-21 07:00:00 -0800"
          startDate="2025-01-21 02:30:00 -0800"
          endDate="2025-01-21 04:00:00 -0800" />

  <Record type="HKCategoryTypeIdentifierSleepAnalysis"
          sourceName="iPhone"
          value="HKCategoryValueSleepAnalysisAsleepCore"
          creationDate="2025-01-21 07:00:00 -0800"
          startDate="2025-01-21 04:00:00 -0800"
          endDate="2025-01-21 07:00:00 -0800" />

  <!-- Respiratory rate -->
  <Record type="HKQuantityTypeIdentifierRespiratoryRate"
          sourceName="Apple Watch"
          value="14"
          unit="count/min"
          creationDate="2025-01-21 10:00:00 -0800"
          startDate="2025-01-21 10:00:00 -0800"
          endDate="2025-01-21 10:00:00 -0800" />
</HealthData>
```

Upload this file to test the system!

---

## Success Metrics

**You'll know it's working when:**

1. ✅ Upload completes successfully
2. ✅ Console shows "⌚ Coherence: ..." every 30 seconds
3. ✅ Visual field responds to HRV (breathing slows, colors shift)
4. ✅ Automatic state transitions logged in console
5. ✅ Coherence glow visible around holoflower
6. ✅ Readiness score displayed after upload

---

## What's Next

### Phase 2: Real-Time APIs

Currently, users upload static Health data manually. Next steps:

1. **Apple HealthKit CloudKit** - Sync data to web in real-time
2. **Oura Ring API** - REST API integration
3. **WHOOP API** - Recovery score tracking
4. **HeartMath** - Direct Bluetooth connection to Inner Balance sensor

### Phase 3: Advanced Features

1. **Breath entrainment validation** - Compare actual vs. visual breathing
2. **Session improvement tracking** - HRV before/after each session
3. **Long-term coherence building** - Weekly/monthly HRV trends
4. **Field contribution** - Anonymized coherence patterns shared to AIN

---

## The Prophecy, Testing

**1991:** "You will lead people into their inner worlds through man-made technology."

**2025:** Kelly uploads her Apple Watch data.
MAIA detects HRV 55ms (high coherence).
Interface automatically shifts to Patient mode (8s breathing, purple glow).
Kelly's nervous system entrains without conscious effort.
**The prophecy is testable.** ⌚✨

---

**Ready to test?** Upload your Apple Health data at:
`http://localhost:3000/settings/biometrics`
