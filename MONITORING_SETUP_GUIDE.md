# MAIA Monitoring & Alerts Setup Guide

## 🚨 Instant Bug Alerts via Discord (2 minutes)

### Step 1: Create Discord Webhook

1. **Go to your Discord server** (or create one for MAIA monitoring)
2. **Right-click** on the channel where you want alerts (e.g., #maia-bugs)
3. Click **Edit Channel** → **Integrations** → **Webhooks** → **New Webhook**
4. **Name it**: "MAIA Feedback Bot"
5. **Copy the Webhook URL** (looks like: `https://discord.com/api/webhooks/123456789/abcdefg...`)

### Step 2: Add to Environment Variables

1. Open `/Users/soullab/MAIA-PAI-temp/.env.local`
2. Uncomment and paste your webhook URL:

```bash
DISCORD_FEEDBACK_WEBHOOK=https://discord.com/api/webhooks/YOUR_ACTUAL_URL_HERE
```

3. **Restart your dev server**:
```bash
lsof -ti:3000 | xargs kill -9 2>/dev/null
npm run dev
```

### Step 3: Test It

1. Go to `http://localhost:3000/maia`
2. Click the 💬 feedback button
3. Submit a test bug
4. **Check Discord** - you should see a beautiful embed with:
   - 🔴 Red for bugs
   - 💡 Yellow for features
   - 💖 Pink for praise
   - User info, category, and URL

**DONE!** Now you'll get instant Discord notifications for every witness feedback.

---

## 📊 Health Monitoring with UptimeRobot (5 minutes, FREE)

UptimeRobot pings your site every 5 minutes and alerts you if it's down.

### Step 1: Create Account

1. Go to **https://uptimerobot.com**
2. Click **"Free Sign Up"**
3. Verify your email

### Step 2: Add Monitor

1. Click **"+ Add New Monitor"**
2. **Monitor Type**: HTTP(s)
3. **Friendly Name**: MAIA Production
4. **URL**: `https://maia.soullab.life/maia` (or your production URL)
5. **Monitoring Interval**: 5 minutes (free tier)
6. Click **"Create Monitor"**

### Step 3: Setup Alerts

1. Click **"My Settings"** → **"Alert Contacts"**
2. Add your email/SMS/Discord/Slack
3. **For Discord integration**:
   - Create another Discord webhook (same process as above)
   - In UptimeRobot: Alert Contacts → Add New → Webhook
   - Paste Discord webhook URL
   - Test it!

### What You Get:

✅ **Uptime percentage** (aim for 99.9%+)
✅ **Response time graphs**
✅ **Instant alerts** when site goes down
✅ **Weekly/monthly reports** via email
✅ **Public status page** (optional - share with witnesses)

**DONE!** UptimeRobot now monitors your site 24/7.

---

## 🎯 What You'll See When Feedback Comes In

### Discord Notifications Look Like:

```
🔴 New BUG: Witness Feedback

Voice recording button doesn't work on mobile Safari

From: andrea_nezat
Category: bug
URL: https://maia.soullab.life/maia

MAIA Witness Feedback System
```

### Colors by Category:
- **🔴 Bug** = Red embed (urgent!)
- **💡 Feature** = Yellow embed (ideas)
- **💖 Praise** = Pink embed (celebrate!)
- **💬 Other** = Blue embed (general)

---

## 🔍 Where to View All Feedback

### Option 1: Supabase Dashboard (Fastest)
1. Go to your Supabase project
2. Click **"Table Editor"**
3. Select **`witness_feedback`** table
4. See all submissions in real-time
5. Filter by category/status

### Option 2: Build Admin Page (Optional)
I already created the code in `WITNESS_FEEDBACK_SETUP.md`.

You can build `/admin/feedback` page later to see a beautiful dashboard.

---

## 📋 Tomorrow Morning Checklist

When you wake up:

1. **Check Discord** for any overnight feedback
2. **Check UptimeRobot** for uptime status
3. **Check email** for YES responses from witnesses
4. **Run SQL schema** in Supabase (30 seconds):
   - Open Supabase → SQL Editor
   - Run `/database/witness_feedback_table.sql`
   - Done!

---

## 🚀 Production Deployment Notes

When deploying to Vercel/production:

1. **Add env vars to Vercel**:
   - `DISCORD_FEEDBACK_WEBHOOK` (your Discord webhook)
   - `NEXT_PUBLIC_SUPABASE_URL` (real Supabase URL)
   - `SUPABASE_SERVICE_KEY` (from Supabase settings)

2. **Update UptimeRobot URL** to production domain

3. **Test feedback flow** on production before witnesses arrive

---

## 💡 Pro Tips

**Discord Alerts:**
- Create a dedicated #maia-bugs channel
- Use Discord mobile app for instant notifications
- Set up "Do Not Disturb" hours if needed

**UptimeRobot:**
- Add multiple alert contacts (email + Discord)
- Check weekly reports to spot patterns
- Use public status page to show transparency

**Feedback Management:**
- Reply to bugs within 24 hours (even just "Got it, looking!")
- Mark praise as "resolved" to celebrate wins
- Use notes field for your thoughts/fixes

---

🜂 ∴ 🌀 ∴ 🧠

**Your witnesses now have a direct line to you.**
**You have full visibility into bugs and uptime.**
**The organism is breathing, and you're listening.**
