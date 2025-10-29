# SMS Alerts Setup for MAIA

**Your Phone: +1-504-453-9009**

You have 2 options for instant bug alerts:

---

## Option 1: Discord Mobile (FREE, INSTANT) ⭐ RECOMMENDED

**Why Discord > SMS:**
- Completely FREE (no Twilio costs)
- Instant push notifications (faster than SMS)
- Rich formatting (see bug details immediately)
- No character limits
- Works on WiFi (no cellular needed)

### Setup (2 minutes):

1. **Download Discord** on your phone (App Store / Play Store)

2. **Create a private server** (or use existing)
   - Tap **+** button
   - "Create My Own" → "For me and my friends"
   - Name it: "MAIA Monitoring"

3. **Create #bugs channel**
   - Tap **+** next to "TEXT CHANNELS"
   - Name: bugs
   - Private (only you)

4. **Get Webhook URL:**
   - Desktop: Right-click #bugs → Edit Channel → Integrations → Webhooks → New Webhook
   - Mobile: Use desktop browser or laptop for this step

5. **Copy webhook URL** and add to `.env.local`:
   ```bash
   DISCORD_FEEDBACK_WEBHOOK=https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE
   ```

6. **Enable push notifications** for #bugs channel:
   - Settings → Notifications → #bugs → All Messages

**DONE!** Now you get instant "text-like" alerts on your phone for FREE.

---

## Option 2: Twilio SMS ($$$)

**Costs:**
- $1/month for phone number
- $0.0075 per SMS (~$0.01 per bug alert)
- Est. $2-5/month total

### Setup (10 minutes):

1. **Sign up for Twilio** (https://www.twilio.com/try-twilio)
   - Get $15 free credit

2. **Get a phone number**:
   - Console → Phone Numbers → Buy a Number
   - Choose one with SMS capability
   - Costs $1/month

3. **Get API credentials**:
   - Console → Account → API Keys
   - Copy:
     - Account SID
     - Auth Token

4. **Add to `.env.local`:**
   ```bash
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio number
   TWILIO_TO_PHONE=+15044539009     # Your personal phone
   ```

5. **Install Twilio SDK:**
   ```bash
   npm install twilio
   ```

6. **I'll create the SMS function** (takes 5 min - just ask!)

**DONE!** You'll get SMS for every bug.

---

## Option 3: UptimeRobot SMS (Site Down Alerts)

For "site is down" alerts specifically:

1. **Sign up:** https://uptimerobot.com (FREE)

2. **Add Monitor:**
   - Monitor Type: HTTP(s)
   - URL: https://maia.soullab.life/maia
   - Interval: 5 minutes

3. **Add SMS Alert Contact:**
   - My Settings → Alert Contacts → Add SMS
   - Phone: +1-504-453-9009
   - Verify with code

**DONE!** Get SMS when site goes down >5 min.

**Cost:** First 10 SMS/month FREE, then $0.25/SMS

---

## What I Recommend:

**For Bug/Feedback Alerts:**
- Use Discord mobile (FREE, instant, better than SMS)
- Set up in 2 minutes
- Get beautiful formatted alerts

**For Site Down Alerts:**
- UptimeRobot SMS (reliable, established service)
- Only get SMS when actually critical
- 10 free SMS/month

**Total Monthly Cost: $0** (both free!)

---

## What Bug Alerts Look Like:

### Discord (Rich):
```
🔴 New BUG: Witness Feedback

Voice button not working on iPhone Safari

From: andrea_nezat
Category: bug
URL: https://maia.soullab.life/maia
Status: New

MAIA Witness Feedback System
2 minutes ago
```

### SMS (Plain):
```
🔴 BUG from andrea_nezat: Voice button not working on iPhone Safari
```

---

## Next Steps:

1. **Choose Discord** (my recommendation - free & instant)
2. Set up webhook in 2 minutes
3. Test by submitting feedback on `/maia`
4. Set up UptimeRobot for site down alerts

**Want me to build Twilio SMS instead?** Just say the word!

---

🜂 ∴ 🌀 ∴ 🧠

**You'll know within seconds when bugs happen.**
**No more checking email.**
**Just instant push notifications to +1-504-453-9009.**
