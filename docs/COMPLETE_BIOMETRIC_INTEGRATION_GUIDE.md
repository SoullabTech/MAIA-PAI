# 🏜️💗 Complete MAIA Biometric Integration Guide

## Your Three-Phase Journey to Live Coherence Feedback

This guide walks you through all three options for integrating your biometric data with MAIA:

- **Option A**: Apple Shortcuts (15 mins) - Works NOW, 5-min updates
- **Option B**: Native iOS App (30 mins) - Live streaming, sub-second updates
- **Option C**: MAIA Conversation Integration (Already done!) - Real-time coherence-responsive sessions

---

## 🍎 Option A: Apple Shortcuts Integration (START HERE)

**Time: 15 minutes**
**Result: Auto-sync every 5 minutes**

### Step 1: Get Your User ID

1. Open MAIA: `http://localhost:3000/settings/biometrics`
2. Open browser console (F12)
3. Run:
   ```javascript
   localStorage.getItem('maia_user_id')
   ```
4. Copy the result (something like `user_1234567890`)

### Step 2: Create the Shortcut

**On your iPhone:**

1. Open **Shortcuts** app
2. Tap **+** (new shortcut)
3. Add these actions:

#### **Action 1: Get HRV**
- Search: "Get Health Sample"
- Type: **Heart Rate Variability**
- Get: **Most Recent Sample**
- Limit: **1**

#### **Action 2: Get Heart Rate**
- Add: "Get Health Sample"
- Type: **Heart Rate**
- Get: **Most Recent Sample**
- Limit: **1**

#### **Action 3: Send to MAIA**
- Add: "Get Contents of URL"
- URL: Your MAIA server URL + `/api/biometrics/stream`
  - Local testing: `http://YOUR_MAC_IP:3000/api/biometrics/stream`
  - Production: `https://your-domain.com/api/biometrics/stream`
- Method: **POST**
- Add Header:
  - Key: `Content-Type`
  - Value: `application/json`
- Request Body: **JSON**
- Body content:
  ```json
  {
    "userId": "YOUR_USER_ID_FROM_STEP_1",
    "timestamp": <CURRENT_DATE>,
    "hrv": <HEALTH_SAMPLE_1>,
    "heartRate": <HEALTH_SAMPLE_2>,
    "source": "apple-shortcuts"
  }
  ```

**To add variables:**
- Tap `<CURRENT_DATE>` → Select "Current Date" variable
- Tap `<HEALTH_SAMPLE_1>` → Select first Health Sample (HRV)
- Tap `<HEALTH_SAMPLE_2>` → Select second Health Sample (HR)

### Step 3: Find Your Mac's IP (for local testing)

**On your Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Look for something like `inet 192.168.1.XXX`

Use: `http://192.168.1.XXX:3000/api/biometrics/stream`

### Step 4: Test It!

1. Tap the shortcut to run
2. You should see a success JSON response
3. Go to `/settings/biometrics` in browser
4. Watch the holoflower speed change!
5. See live status badges appear

### Step 5: Automate It

1. **Automation** tab in Shortcuts
2. **+** → **Create Personal Automation**
3. **Time of Day**
4. **Repeat**: Every 5 Minutes
5. **Run Immediately**: ON ✅
6. **Ask Before Running**: OFF ❌ (IMPORTANT!)
7. Add your "MAIA Health Sync" shortcut
8. **Done**

### ✨ What You'll See

Once running:
- **Pulsing holoflower** synced to YOUR heart rate
- **Live dot** (red pulsing = streaming)
- **HRV reading** in milliseconds
- **Coherence %** with glowing indicator
- **Trend arrow** (↑ rising, ↓ falling, − stable)
- **Recommended mode** badge (Dialogue/Patient/Scribe)

---

## 📱 Option B: Native iOS App (NEXT LEVEL)

**Time: 30 minutes**
**Result: Live HealthKit streaming, background monitoring**

### Prerequisites

- Xcode 15+ installed on Mac
- Apple Developer account (free is fine)
- iPhone connected via cable

### Step 1: Build Next.js App

```bash
cd /Users/soullab/MAIA-FRESH
npm run build
```

Wait for build to complete...

### Step 2: Copy to iOS

```bash
npx cap copy ios
```

This copies your web app to the native project.

### Step 3: Open in Xcode

```bash
npx cap open ios
```

Xcode will launch with the MAIA project.

### Step 4: Add HealthKit Permissions

In Xcode:

1. Open `ios/App/App/Info.plist`
2. Right-click → **Open As** → **Source Code**
3. Add before the closing `</dict>`:

```xml
<key>NSHealthShareUsageDescription</key>
<string>MAIA needs access to your heart rate and HRV data to provide real-time coherence feedback during sessions.</string>

<key>NSHealthUpdateUsageDescription</key>
<string>MAIA stores session insights to your Health app for your records.</string>
```

4. Save file

### Step 5: Enable HealthKit Capability

1. Select **App** target (top of project navigator)
2. **Signing & Capabilities** tab
3. Click **+ Capability**
4. Add **HealthKit**
5. Under HealthKit, check:
   - ☑️ **Clinical Health Records** (optional)
   - ☑️ **Health Records**

### Step 6: Sign the App

1. **Signing & Capabilities** tab
2. **Team**: Select your Apple ID
3. If needed: Xcode → Preferences → Accounts → Add your Apple ID

### Step 7: Run on iPhone

1. Connect iPhone via cable
2. Trust computer on iPhone if prompted
3. Select your iPhone from device menu (top)
4. Click **Run** (⌘R)
5. Wait for build...
6. MAIA launches on your iPhone! 🎉

### Step 8: Enable HealthKit in App

**First launch:**
1. App will request HealthKit permissions
2. Tap **Turn On All** or select specific data
3. Tap **Allow**

### Step 9: Start Live Streaming

Add this to your biometrics page or settings:

```typescript
import { healthKitBridge } from '@/lib/biometrics/HealthKitBridge';

// Start live streaming
await healthKitBridge.startLiveStreaming(5000); // Update every 5 seconds
```

### ✨ Native App Benefits

- **5-second updates** (vs 5-minute with Shortcuts)
- **Background monitoring** - Works even when app is closed
- **More accurate** - Direct HealthKit access
- **Better battery life** - Native optimizations
- **Offline capable** - Works without internet

---

## 💗 Option C: MAIA Conversation Integration (ALREADY DONE!)

**This is already built in!** Here's what happens automatically:

### Real-Time Coherence Response

When biometric data updates, MAIA automatically:

1. **Adjusts presence mode**
   - Low coherence (stressed) → Dialogue mode (gentle 4s breathing)
   - Medium coherence (balanced) → Patient mode (deeper 8s breathing)
   - High coherence (coherent) → Scribe mode (witnessing 12s breathing)

2. **Changes holoflower motion**
   - Idle: Low energy, gentle pulse
   - Breathing: Rhythmic expansion/contraction
   - Breakthrough: High coherence + rising = celebration moment!

3. **Updates voice visualization**
   - Ring color intensity matches coherence
   - Pulse speed syncs to your actual heart rate

### Using in Your Components

Any component can access live biometric state:

```typescript
import { useBiometricCoherence } from '@/hooks/useBiometricCoherence';

function MyComponent() {
  const {
    coherenceLevel,
    heartRate,
    recommendedMode,
    coherenceTrend,
    isStreaming
  } = useBiometricCoherence();

  return (
    <div>
      {isStreaming && (
        <div>
          Coherence: {Math.round(coherenceLevel * 100)}%
          Heart Rate: {heartRate} BPM
          Mode: {recommendedMode}
          Trend: {coherenceTrend}
        </div>
      )}
    </div>
  );
}
```

### Automatic Behaviors

**Already implemented:**

✅ Holoflower pulses at your heart rate
✅ Live status badges on biometrics page
✅ Coherence trending (rising/stable/falling)
✅ Mode recommendations
✅ Readiness scoring

**Coming soon (easy to add):**

- Auto-switch conversation mode based on coherence
- Gentle notifications when coherence drops
- Celebration animations on coherence breakthroughs
- Session summaries with HRV trends

---

## 🎯 Quick Start Checklist

### Today (15 minutes):
- [ ] Set up Apple Shortcut (Option A)
- [ ] Test manual sync
- [ ] Enable automation
- [ ] Watch holoflower sync to your pulse

### This Week (30 minutes):
- [ ] Build iOS app (Option B)
- [ ] Run on iPhone
- [ ] Enable HealthKit
- [ ] Experience live streaming

### Already Done:
- [x] Real-time biometric service
- [x] Live status dashboard
- [x] Coherence calculations
- [x] Mode recommendations
- [x] React hooks for integration

---

## 🔮 Future Enhancements

### Coming Soon:
1. **Session Coherence Graphs** - See your HRV journey
2. **Coherence Challenges** - Daily coherence goals
3. **Breath Training** - Guided HRV optimization
4. **Sleep Integration** - Recovery-based recommendations
5. **Community Field** - Anonymous coherence contribution

### Advanced Features:
- **HeartMath Protocol** - Validated coherence measurement
- **Stress Resilience Tracking** - Baseline HRV trends
- **Meditation Analytics** - Session-to-session improvements
- **Wearable Integration** - Oura, WHOOP, Muse support

---

## 🆘 Troubleshooting

### Option A (Shortcuts):

**"No HRV data"**
- Apple Watch needs to measure HRV first
- Try: Breathe app for 1 minute
- Or: Sleep with watch overnight

**"Connection failed"**
- Check Mac and iPhone on same WiFi
- Verify IP address is correct
- Try deploying to production server

**"Automation not running"**
- Make sure "Ask Before Running" is OFF
- Check Settings → Screen Time → automation permissions
- Try manual run first to debug

### Option B (iOS App):

**"Build failed"**
- Update Xcode to latest
- Run `pod install` in `ios/App` folder
- Check deployment target is iOS 13.0+

**"HealthKit not available"**
- Test on real device (simulator limited)
- Check Info.plist permissions
- Verify HealthKit capability enabled

**"App crashes on launch"**
- Check Xcode console for errors
- Verify `out` folder has index.html
- Try rebuilding: `npm run build && npx cap copy ios`

### Option C (Integration):

**"No live status showing"**
- Make sure Option A or B is working first
- Check browser console for errors
- Verify biometric service started

**"Holoflower not pulsing"**
- Upload health data or enable live streaming
- Check that BPM value updated
- Refresh page

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│  Apple Watch    │
│  (HealthKit)    │
└────────┬────────┘
         │
    ┌────▼─────┐
    │ iPhone   │
    │ Health   │
    └────┬─────┘
         │
    ┌────▼──────────┬──────────────┐
    │               │              │
┌───▼────┐    ┌────▼─────┐   ┌───▼────┐
│Shortcut│    │Native App│   │Manual  │
│5min    │    │5sec      │   │Upload  │
└───┬────┘    └────┬─────┘   └───┬────┘
    │              │             │
    └──────┬───────┴──────┬──────┘
           │              │
      ┌────▼──────────────▼────┐
      │  MAIA API              │
      │  /api/biometrics/stream│
      └────────┬────────────────┘
               │
      ┌────────▼─────────────┐
      │ Realtime Biometric   │
      │ Service (Browser)    │
      └────────┬─────────────┘
               │
    ┌──────────┴────────────┐
    │                       │
┌───▼──────┐        ┌──────▼────────┐
│Holoflower│        │MAIA           │
│Pulse     │        │Conversation   │
│Animation │        │Mode Switching │
└──────────┘        └───────────────┘
```

---

## 💗 You're All Set!

### What You've Built:

1. **Real-time biometric monitoring** - HRV, HR, coherence
2. **Three integration methods** - Shortcuts, Native App, Manual
3. **Live coherence feedback** - Visual + recommended modes
4. **Beautiful Dune UI** - Desert rose wellness aesthetic
5. **Hybrid deployment** - PWA + Native app from same codebase

### Next Commands:

**Test Shortcuts:**
```bash
# Just wait 5 minutes after setting up automation
# Then check localhost:3000/settings/biometrics
```

**Build iOS App:**
```bash
npm run build
npx cap copy ios
npx cap open ios
# Then hit Run in Xcode
```

**Deploy to Production:**
```bash
git push
# Your PWA and app both update!
```

---

## 🌟 The Vision

MAIA now knows:
- When you're stressed (low HRV) → Offers gentle support
- When you're balanced (medium HRV) → Deepens inquiry
- When you're coherent (high HRV) → Witnesses your insight
- When you're breaking through (rising HRV) → Celebrates with you

**This is biofeedback meditation.** Your nervous system guides the journey. MAIA responds to what's true. 🏜️💗✨

---

Ready to experience it? Start with Option A (15 mins) and feel the magic! ⌚🌹
