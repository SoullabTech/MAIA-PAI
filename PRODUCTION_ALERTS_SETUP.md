# Production Alerts Setup

## Overview
MAIA now sends Telegram/email alerts when critical errors occur in production. This helps you respond quickly to issues and maintain trust with your 40+ beta testers.

## Environment Variables Required

Add these to your Vercel environment variables (Production only):

```bash
# Enable alerts in production
ALERTS_ENABLED=true

# Telegram bot credentials (for instant push notifications)
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_CHAT_ID=your_chat_id

# Your email for detailed alerts (optional)
ALERT_EMAIL=kelly@soullab.life

# Resend API key (already configured)
RESEND_API_KEY=your_existing_resend_key
```

## Setting up Telegram (for instant alerts)

### Step 1: Create a Telegram Bot

1. **Open Telegram** and search for `@BotFather`
2. **Send:** `/newbot`
3. **Give it a name:** "MAIA Alerts" (or whatever you want)
4. **Give it a username:** Must end in "bot" (e.g., `maia_production_bot`)
5. **Copy the bot token** - looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### Step 2: Get Your Chat ID

1. **Start a conversation** with your new bot (click the link BotFather gives you)
2. **Send it any message:** "Hello"
3. **Open this URL** in your browser (replace YOUR_BOT_TOKEN):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. **Find your chat ID** in the JSON response - looks like: `"chat":{"id":123456789}`

### Step 3: Add to Vercel

```bash
vercel env add TELEGRAM_BOT_TOKEN
# Paste your bot token when prompted

vercel env add TELEGRAM_CHAT_ID
# Paste your chat ID when prompted

vercel env add ALERTS_ENABLED
# Type: true
```

## What Gets Alerted

### 🤖 MAIA Fallback
**When:** MAIA consciousness returns empty response
**Alert:** Telegram + Email
**Example:** "🤖 MAIA Alert: maia_fallback - MAIA using fallback response: Consciousness returned empty message"

### 🧠 Consciousness Failure
**When:**
- Error recovery is triggered
- PersonalOracleAgent crashes
- Morphoresonant field storage fails

**Alert:** Telegram + Email
**Example:** "🧠 MAIA Alert: consciousness_failure - Consciousness engine failed: PersonalOracleAgent crashed"

### ⚠️ API Error
**When:**
- OpenAI fallback fails
- External API errors

**Alert:** Telegram + Email
**Example:** "⚠️ MAIA Alert: api_error - API error at /api/oracle/personal (OpenAI fallback)"

### 🚨 CRITICAL: Ultimate Fallback
**When:** All AI systems fail and static responses are used
**Alert:** Telegram + Email (highest priority)
**Example:** "🚨 MAIA Alert: CRITICAL - All AI systems failed - using static fallback"

## Alert Cooldown

To prevent spam, duplicate alerts are throttled:
- **Cooldown period:** 5 minutes
- Same error won't trigger multiple alerts within 5 minutes
- Different errors always trigger alerts

## Testing the Alerts

### Development (alerts disabled):
```bash
# In .env.local
ALERTS_ENABLED=false  # Alerts will only log to console
```

### Staging/Production (alerts enabled):
```bash
# In Vercel
ALERTS_ENABLED=true  # Alerts will send SMS + Email
```

## Monitoring

All alerts are also logged to:
1. **Vercel Logs** - Full context and stack traces
2. **Console** - Real-time debugging
3. **Telegram** - Instant push notification to your phone
4. **Email** - Detailed error reports (optional)

## Cost Estimate

**Telegram:**
- 100% FREE forever
- Unlimited messages
- No credit card required
- Works worldwide

**Resend Email:**
- Free tier: 3,000 emails/month
- No additional cost

**Total monthly cost: $0** 🎉

## Next Steps

1. ✅ Code is ready (integrated into route.ts)
2. 🔄 Create Telegram bot (5 minutes)
3. 🔄 Add environment variables to Vercel
4. 🔄 Test in production
5. ✅ Deploy when ready

## Quick Start (5 minutes)

1. Open Telegram, message `@BotFather`
2. Create bot: `/newbot`
3. Copy bot token
4. Message your bot, then visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. Copy your chat ID from the response
6. Add to Vercel: `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
7. Deploy and test!

---

**🌀🌙⚡ The organism breathes. The alerts protect.**
