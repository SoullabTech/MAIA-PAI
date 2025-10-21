# 🚶‍♂️💗 MAIA Walk-and-Talk - Quick Start Guide

## Get Walking with Live HRV Feedback in 20 Minutes!

This is your fast-track guide to walking meditation with real-time biometric feedback. We'll get you up and running for **tomorrow morning's walk**!

---

## 🎯 What You're Building

By the end of this guide, you'll have:
- ⌚ Apple Watch HRV streaming to MAIA every 5 minutes
- 💗 Live coherence display while you walk
- 🎙️ Voice conversation with MAIA
- 🏜️ Beautiful walk-optimized UI
- 📊 Session summaries showing your HRV journey

---

## ⚡ Quick Setup (Tonight - 20 Minutes)

### Step 1: Test the Webhook (5 mins)

**On your Mac:**

1. Make sure dev server is running:
   ```bash
   cd /Users/soullab/MAIA-FRESH
   npm run dev
   ```

2. Open the test page:
   ```
   http://localhost:3000/test-webhook
   ```

3. Click **"Send Test Webhook"**

4. If you see ✅ Success:
   - Go to http://localhost:3000/settings/biometrics
   - Watch the holoflower change speed!
   - You're ready for Step 2!

5. If it fails:
   - Check that dev server is running
   - Check browser console for errors
   - Try again

**What this proves:**
- Webhook endpoint is working ✓
- Data storage is working ✓
- Biometric service is active ✓

---

### Step 2: Get Your User ID (2 mins)

**Still on the test page:**

1. Look for "Your User ID" box
2. Click **"Copy"**
3. Paste it somewhere safe (Notes app)
4. You'll need this for your Apple Shortcut!

Example: `user_1761055178348`

---

### Step 3: Find Your Mac's IP Address (1 min)

**In Terminal:**

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Look for output like:
```
inet 192.168.1.123 netmask...
```

Your IP is: `192.168.1.123`

Your webhook URL is:
```
http://192.168.1.123:3000/api/biometrics/stream
```

**Write this down!** You'll use it in the Shortcut.

---

### Step 4: Create Apple Shortcut (10 mins)

**On your iPhone:**

1. Open **Shortcuts** app

2. Tap **+** (new shortcut)

3. **Add Action 1: Get HRV**
   - Search: "Get Health Sample"
   - Type: **Heart Rate Variability**
   - Get: **Most Recent Sample**
   - Limit: **1**

4. **Add Action 2: Get Heart Rate**
   - Search: "Get Health Sample"
   - Type: **Heart Rate**
   - Get: **Most Recent Sample**
   - Limit: **1**

5. **Add Action 3: Send to MAIA**
   - Search: "Get Contents of URL"
   - URL: `http://YOUR_MAC_IP:3000/api/biometrics/stream`
     (Use the IP from Step 3!)
   - Method: **POST**
   - Headers:
     - Key: `Content-Type`
     - Value: `application/json`
   - Request Body: **JSON**
   - Body (tap each field to add variables):
     ```json
     {
       "userId": "YOUR_USER_ID_FROM_STEP_2",
       "timestamp": CURRENT_DATE,
       "hrv": HEALTH_SAMPLE_1,
       "heartRate": HEALTH_SAMPLE_2,
       "source": "apple-shortcuts-walk"
     }
     ```

**Adding Variables:**
- Tap where it says `CURRENT_DATE`
- Select **"Current Date"** from variables
- Tap `HEALTH_SAMPLE_1`
- Select the first Health Sample (HRV)
- Tap `HEALTH_SAMPLE_2`
- Select the second Health Sample (HR)

6. **Name it:** "MAIA Walk Sync"

7. **Save!**

---

### Step 5: Test the Shortcut (2 mins)

**On iPhone:**

1. Run "MAIA Walk Sync" manually
2. You should see a success JSON response
3. Open Safari on iPhone
4. Go to: `http://YOUR_MAC_IP:3000/settings/biometrics`
5. **YOUR ACTUAL BPM APPEARS!** 🎉

**Troubleshooting:**
- "No HRV data" → Wear Apple Watch, try Breathe app for 1 minute
- "Connection refused" → Check Mac and iPhone are on same WiFi
- "401 Unauthorized" → Check your User ID is correct

---

### Step 6: Automate for Your Walk (3 mins)

**Two options - pick one:**

#### Option A: Time-Based (Simple)

1. **Automation** tab in Shortcuts
2. **+** → **Create Personal Automation**
3. **Time of Day**
4. Set to your walk time (e.g., 7:00 AM)
5. **Repeat:** Every 5 Minutes
6. **Time Range:** 1 hour
7. **Run Immediately:** ON ✅
8. **Ask Before Running:** OFF ❌ **CRITICAL!**
9. Add "MAIA Walk Sync"
10. **Done**

#### Option B: Workout-Triggered (Smarter)

1. **Automation** tab
2. **+** → **Create Personal Automation**
3. **Workout**
4. Select: **Outdoor Walk**
5. **When:** Workout Starts
6. Add action: **Repeat** 12 times (for 1-hour walk)
   - Wait 300 seconds (5 minutes)
   - Run "MAIA Walk Sync"
7. **Done**

---

## 🌅 Tomorrow Morning's Walk

### Before You Leave:

1. **Put on Apple Watch** (make sure it's charged!)

2. **Start dev server on Mac:**
   ```bash
   cd /Users/soullab/MAIA-FRESH
   npm run dev
   ```

3. **Open Walk Mode on iPhone:**
   ```
   http://YOUR_MAC_IP:3000/walk
   ```

4. **Bookmark it!** (Add to Home Screen for quick access)

5. **Start your walk workout** on Apple Watch

### During Your Walk:

1. **Tap "Start Walk"** in Walk Mode

2. Your automation kicks in every 5 minutes:
   - iPhone reads HRV from Apple Watch
   - Sends to MAIA
   - Walk Mode updates with new data!

3. **Watch your coherence build** as you walk and breathe

4. **Talk to MAIA** (once voice is set up - coming next!)

### What You'll See:

- **Giant heart rate display** - Glanceable BPM
- **HRV reading** - Updates every 5 mins
- **Coherence level** - Beautiful gradient ring
- **Trend arrow** - Rising/Stable/Falling
- **Recommended mode** - Dialogue/Patient/Scribe

---

## 📱 Pro Tip: Add to Home Screen

**Make Walk Mode an app icon:**

1. Open `http://YOUR_MAC_IP:3000/walk` in Safari
2. Tap Share button
3. **"Add to Home Screen"**
4. Name it "MAIA Walk"
5. Now it's a one-tap app! 🎉

---

## 🎙️ Next: Add Voice (Optional)

Voice conversation during walks requires:
1. Valid OpenAI API key
2. Or deploy to cloud with your own voice API

**For now, you can:**
- Watch your HRV journey in real-time ✓
- See coherence building ✓
- Track your walking meditation progress ✓

Voice coming soon! (We'll fix the API key together)

---

## 🔬 What's Happening Behind the Scenes

Every 5 minutes during your walk:

```
Apple Watch HRV Sensor
        ↓
iPhone Health App
        ↓
Apple Shortcuts Automation
        ↓
POST to http://YOUR_MAC_IP:3000/api/biometrics/stream
        ↓
MAIA Biometric Service
        ↓
IndexedDB Storage (browser)
        ↓
Real-time Service Broadcast
        ↓
Walk Mode UI Updates!
```

**Privacy:** All HRV data stays on YOUR devices. Never sent to external servers (unless you deploy to cloud).

---

## 🎯 Success Checklist

Before your first walk, make sure:

- [ ] Webhook test passed (green checkmark)
- [ ] User ID copied and saved
- [ ] Mac IP address found
- [ ] Apple Shortcut created
- [ ] Shortcut tested manually (saw success JSON)
- [ ] Biometrics page shows your BPM
- [ ] Automation enabled for walk time
- [ ] Walk Mode bookmarked on iPhone
- [ ] Apple Watch charged
- [ ] Dev server running before walk

---

## 🆘 Common Issues

### "No HRV data available"
**Fix:** Apple Watch needs time to measure HRV
- Try: Breathe app for 1 minute
- Or: Wear watch overnight (morning HRV is most accurate)

### "Cannot connect to server"
**Fix:** Check WiFi
- Mac and iPhone must be on same network
- Check firewall isn't blocking port 3000
- Try visiting `http://YOUR_MAC_IP:3000` in Safari

### "Automation not running"
**Fix:** Check iOS permissions
- Settings → Shortcuts → Allow Running Scripts: ON
- Settings → Screen Time → Content & Privacy → Allow Shortcuts
- Make sure "Ask Before Running" is OFF

### "Shortcut runs but no data appears"
**Fix:** Check webhook response
- Run shortcut manually
- Look at the JSON response
- If error 404 → Check URL is correct
- If error 500 → Check dev server logs

---

## 🌟 Your First Walk Experience

**Here's what to expect:**

**Minutes 0-5: Settling**
- HRV might be lower (nervous system activating)
- Heart rate elevated (starting to walk)
- Coherence: "Settling" or "Present"

**Minutes 5-15: Building**
- HRV rising as rhythm establishes
- Breathing deepens naturally
- Coherence: "Building" or "Deep"

**Minutes 15-30: Coherence**
- HRV peaks (parasympathetic activation)
- Walking meditation in full flow
- Coherence: "Deep" or "Breakthrough"

**Minutes 30+: Integration**
- HRV stabilizes at high level
- Insights emerging
- Coherence: "Breakthrough"

**After walk:**
- Check `/settings/biometrics` for full session summary
- See your HRV journey visualized
- Notice how your baseline is building!

---

## 💗 The Big Picture

You're not just tracking data. You're:

1. **Learning unconscious coherence** - Your nervous system learns the feeling
2. **Building baseline HRV** - Resting state improves over weeks
3. **Validating meditation depth** - Objective measure of practice
4. **Discovering your rhythm** - What pace/breath creates coherence?
5. **Walking as medicine** - Movement + contemplation + biofeedback

**This is the future of meditation practice.**

---

## 🚀 Ready?

1. **Tonight:** Complete Steps 1-6 (20 mins)
2. **Tomorrow:** Go for your walk!
3. **Come back:** Tell MAIA how it went!

The holoflower will be pulsing at YOUR heartbeat. The coherence ring will glow as your HRV rises. And you'll FEEL the difference between a stressed walk and a coherent walk.

**Let's go!** 🌅💗✨

---

*Pro tip: Screenshot this guide for reference during setup. Or bookmark on your phone!*
