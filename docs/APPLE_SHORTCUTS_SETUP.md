# 🍎⌚ Apple Shortcuts Setup for Real-Time Biometrics

This guide shows you how to set up an Apple Shortcut that automatically sends your heart rate and HRV data to MAIA every 5 minutes.

## Prerequisites

- iPhone with iOS 16+
- Apple Watch with HRV tracking enabled
- Health app with HRV data (check: Health app → Browse → Heart → Heart Rate Variability)

## Quick Setup (5 minutes)

### Step 1: Create the Shortcut

1. Open **Shortcuts** app on your iPhone
2. Tap **+** (top right) to create new shortcut
3. Tap **Add Action**

### Step 2: Get Health Data

Add these actions in order:

#### Action 1: Get HRV
1. Search for "Get Health Sample"
2. Select **Heart Rate Variability**
3. Set:
   - **Get**: Most Recent Sample
   - **Limit**: 1

#### Action 2: Get Heart Rate
1. Add another "Get Health Sample"
2. Select **Heart Rate**
3. Set:
   - **Get**: Most Recent Sample
   - **Limit**: 1

### Step 3: Send to MAIA

#### Action 3: Get Contents of URL
1. Add action: "Get Contents of URL"
2. Set **URL** to:
   ```
   https://your-maia-domain.com/api/biometrics/stream
   ```
   *Replace with your actual MAIA URL*

3. Set **Method**: POST

4. Set **Headers**:
   - `Content-Type`: `application/json`

5. Set **Request Body**: JSON

6. Tap **Add Field** and paste this JSON (you'll need to customize):
   ```json
   {
     "userId": "user_YOUR_ID_HERE",
     "timestamp": "Current Date",
     "hrv": "Health Sample 1",
     "heartRate": "Health Sample 2",
     "source": "apple-shortcuts"
   }
   ```

   To add dynamic values:
   - Tap `"Current Date"` → Select **Current Date** variable
   - Tap `"Health Sample 1"` → Select the **HRV** sample (first one)
   - Tap `"Health Sample 2"` → Select the **Heart Rate** sample (second one)

### Step 4: Get Your User ID

Your user ID can be found at:
- MAIA app → Settings → Account → Copy User ID

Or use the browser console:
```javascript
localStorage.getItem('maia_user_id')
```

### Step 5: Set Up Automation

1. Go to **Automation** tab in Shortcuts
2. Tap **+** → **Create Personal Automation**
3. Select **Time of Day**
4. Set:
   - **Time**: Choose a time (e.g., 12:00 PM)
   - **Repeat**: **Every 5 Minutes** (or your preference)
   - **Run Immediately**: ON

5. Search for and add your shortcut from Step 1
6. **Important**: Turn OFF "Ask Before Running"
7. Tap **Done**

## Testing Your Setup

### Test the Shortcut Manually

1. Open Shortcuts app
2. Tap your new shortcut
3. Check the output - you should see a success response

### Check MAIA Received It

1. Open MAIA biometrics page: `/settings/biometrics`
2. The holoflower should pulse at your heart rate
3. BPM display should show your actual BPM

### Verify Automation

- Wait 5 minutes
- Check if data updated automatically
- Look for the timestamp changing

## Troubleshooting

### "No HRV data available"

- Make sure your Apple Watch has measured HRV
- HRV is typically measured:
  - While sleeping
  - During mindful breathing in Breathe app
  - Periodically during the day when relaxed

### "Shortcut didn't run automatically"

- Check Settings → Screen Time → See All Activity
- Make sure "Run Immediately" is ON
- Try setting a longer interval (15 minutes) first

### "Connection failed"

- Check your MAIA URL is correct
- Make sure you're on WiFi or cellular
- Verify your user ID is correct

## Advanced: Custom Intervals

For different update frequencies:

- **Every 1 minute**: Real-time during meditation sessions
- **Every 5 minutes**: Good balance for daily monitoring
- **Every 15 minutes**: Battery-friendly option
- **Every hour**: Minimal, just for daily trends

## Privacy Note

- Your health data goes directly from your iPhone to your MAIA instance
- It's stored only in your browser (IndexedDB)
- No third-party servers involved
- You can delete all data anytime from Settings

## Example Shortcut JSON

Here's a complete example you can customize:

```json
{
  "userId": "user_1234567890",
  "timestamp": "{{current_date}}",
  "hrv": {{hrv_sample_value}},
  "heartRate": {{heart_rate_sample_value}},
  "respiratoryRate": {{respiratory_rate_sample_value}},
  "source": "apple-shortcuts"
}
```

## Next Steps

Once this is working:

1. **Try a meditation session** - watch MAIA respond to your coherence in real-time
2. **Check coherence trends** - see how your HRV changes throughout the day
3. **Experiment with presence modes** - MAIA will automatically adjust based on your state

## Future: Native App

We're building a native iOS app that will provide:
- Sub-second HRV updates (not just every 5 minutes)
- Background monitoring without Shortcuts
- Richer biometric insights
- Apple Health integration

The Shortcuts approach works great now and will continue to work alongside the app!

---

💗 **Questions?** Open an issue or ask MAIA for help setting this up!
