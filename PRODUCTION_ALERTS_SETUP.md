# Production Alerts Setup

## Overview
MAIA now sends SMS/email alerts when critical errors occur in production. This helps you respond quickly to issues and maintain trust with your 40+ beta testers.

## Environment Variables Required

Add these to your Vercel environment variables (Production only):

```bash
# Enable alerts in production
ALERTS_ENABLED=true

# Your phone number for SMS alerts
ALERT_PHONE_NUMBER=+15044539009

# Your email for detailed alerts
ALERT_EMAIL=kelly@soullab.life

# Twilio credentials (for SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Resend API key (already configured)
RESEND_API_KEY=your_existing_resend_key
```

## Setting up Twilio (for SMS alerts)

1. **Sign up for Twilio** (free trial available):
   - Go to https://www.twilio.com/try-twilio
   - Get $15 free credit to test SMS alerts

2. **Get your credentials**:
   - Account SID: Found on Twilio dashboard
   - Auth Token: Found on Twilio dashboard
   - Phone Number: Get a free trial number from Twilio

3. **Add to Vercel**:
   ```bash
   vercel env add TWILIO_ACCOUNT_SID
   vercel env add TWILIO_AUTH_TOKEN
   vercel env add TWILIO_PHONE_NUMBER
   vercel env add ALERT_PHONE_NUMBER
   vercel env add ALERTS_ENABLED
   ```

## What Gets Alerted

### 🤖 MAIA Fallback
**When:** MAIA consciousness returns empty response
**Alert:** SMS + Email
**Example:** "MAIA using fallback response: Consciousness returned empty message"

### 🧠 Consciousness Failure
**When:**
- Error recovery is triggered
- PersonalOracleAgent crashes
- Morphoresonant field storage fails

**Alert:** SMS + Email
**Example:** "Consciousness engine failed: PersonalOracleAgent crashed"

### ⚠️ API Error
**When:**
- OpenAI fallback fails
- External API errors

**Alert:** SMS + Email
**Example:** "API error at /api/oracle/personal (OpenAI fallback)"

### 🚨 CRITICAL: Ultimate Fallback
**When:** All AI systems fail and static responses are used
**Alert:** SMS + Email (highest priority)
**Example:** "CRITICAL: All AI systems failed - using static fallback"

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
3. **Your Phone** - Immediate notification
4. **Your Email** - Detailed error reports

## Cost Estimate

**Twilio SMS:**
- Free trial: $15 credit (50-100 messages)
- Paid: $0.0075 per SMS
- Expected cost: <$5/month for production monitoring

**Resend Email:**
- Free tier: 3,000 emails/month
- No additional cost

## Next Steps

1. ✅ Code is ready (integrated into route.ts)
2. 🔄 Get Twilio credentials
3. 🔄 Add environment variables to Vercel
4. 🔄 Test in production
5. ✅ Deploy when ready

---

**🌀🌙⚡ The organism breathes. The alerts protect.**
