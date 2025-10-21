# 🍎 MAIA Health Sync Shortcut - Quick Setup

## Copy-Paste Shortcut (5 Minutes)

### Step 1: Get Your User ID

Open MAIA in browser and run this in console:
```javascript
localStorage.getItem('maia_user_id')
```

Or go to: `http://localhost:3000/settings` and it should show your user ID.

### Step 2: Create the Shortcut

1. Open **Shortcuts** app on iPhone
2. Tap **+** (new shortcut)
3. Add these actions in order:

#### Action 1: Get HRV
- Add Action: **"Get Health Sample"**
- Type: **Heart Rate Variability**
- Get: **Most Recent Sample**
- Limit: **1**

#### Action 2: Get Heart Rate
- Add Action: **"Get Health Sample"**
- Type: **Heart Rate**
- Get: **Most Recent Sample**
- Limit: **1**

#### Action 3: Send to MAIA
- Add Action: **"Get Contents of URL"**
- URL: `http://localhost:3000/api/biometrics/stream`
  (Or your deployed URL: `https://your-domain.com/api/biometrics/stream`)
- Method: **POST**
- Headers: Add `Content-Type`: `application/json`
- Request Body: **JSON**

#### JSON Body Template:
```json
{
  "userId": "YOUR_USER_ID_HERE",
  "timestamp": "CURRENT_DATE_VARIABLE",
  "hrv": "HEALTH_SAMPLE_1",
  "heartRate": "HEALTH_SAMPLE_2",
  "source": "apple-shortcuts"
}
```

**How to add variables:**
- Tap the field, then select variables:
  - `CURRENT_DATE_VARIABLE` → Select "Current Date"
  - `HEALTH_SAMPLE_1` → Select the first Health Sample (HRV)
  - `HEALTH_SAMPLE_2` → Select the second Health Sample (Heart Rate)

### Step 3: Name Your Shortcut
- Tap "..." (top right)
- Name it: **"MAIA Health Sync"**
- Tap **Done**

### Step 4: Test Manually
- Tap the shortcut to run it
- You should see a success response!
- Check `/settings/biometrics` - BPM should update!

### Step 5: Automate It
1. Go to **Automation** tab
2. Tap **+** → **Create Personal Automation**
3. Select **Time of Day**
4. Choose: **Repeat Every 5 Minutes**
5. **Run Immediately**: ON
6. **Ask Before Running**: OFF ⚠️ IMPORTANT!
7. Add your "MAIA Health Sync" shortcut
8. Tap **Done**

## 🎯 Testing Checklist

- [ ] Shortcut runs manually without errors
- [ ] `/settings/biometrics` shows updated BPM
- [ ] Holoflower pulse changes speed
- [ ] Automation triggers every 5 minutes
- [ ] Live status badges appear below holoflower

## 🔧 Troubleshooting

### "No HRV data"
- Apple Watch needs to measure HRV first
- Try: Breathe app for 1 minute
- Or: Wait for overnight HRV measurement

### "Connection refused"
- If testing locally, make sure:
  - iPhone is on same WiFi
  - Use your Mac's IP: `http://192.168.X.X:3000/api/biometrics/stream`
  - Or deploy to production first

### Find Your Mac's IP:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

## ✨ What Happens Next

Once automation is running:
1. Every 5 minutes, iPhone sends HRV + Heart Rate to MAIA
2. Biometric service updates your live status
3. Holoflower syncs to your actual pulse
4. Coherence level updates
5. MAIA knows when you're stressed vs. coherent!

---

**Ready for next step?** Build the native iOS app for even better integration! 📱
