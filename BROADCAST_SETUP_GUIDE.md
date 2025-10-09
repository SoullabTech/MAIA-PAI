# Broadcast System Setup Guide

**Multi-channel notification system for beta tester communications**

Send text alerts to Discord, Telegram, and Email simultaneously from your Community Hub.

---

## Quick Start

1. Set up credentials (see below)
2. Visit `http://localhost:3001/community/admin/broadcast`
3. Write message, select channels, send!

Alternative: Use the "Quick Announce" button on the community hub homepage for instant Discord + Telegram notifications.

---

## Setup Instructions

### 1. Discord Webhook Setup (2 minutes)

Discord webhooks let you post messages to a channel via URL. No bot needed!

**Steps:**

1. Open your Discord server
2. Go to **Server Settings** → **Integrations** → **Webhooks**
3. Click **New Webhook**
4. Configure:
   - Name: `Soullab Announcements`
   - Channel: `#announcements` (or your chosen channel)
   - Avatar: Upload your spiral logo (optional)
5. Click **Copy Webhook URL**
6. Add to your `.env.local` file:

```bash
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1234567890/AbCdEfGhIjKlMnOpQrStUvWxYz
```

**Test it:**
```bash
curl -X POST "$DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "🌀 Test from Soullab - webhook working!"}'
```

---

### 2. Telegram Bot Setup (5 minutes)

Telegram bots can post to groups. You'll create a bot and add it to your beta tester group.

**Steps:**

**A. Create Bot:**
1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot`
3. Follow prompts:
   - Bot name: `Soullab Announcements`
   - Username: `soullab_announce_bot` (or similar, must end in _bot)
4. BotFather will give you a token. **Save it!**
   - Example: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

**B. Add Bot to Your Group:**
1. Add the bot to your beta tester Telegram group
2. Make the bot an **admin** (so it can post)
3. Send a message in the group to activate it

**C. Get Chat ID:**
1. Send a message in your group (while bot is there)
2. Visit this URL in your browser (replace TOKEN):
   ```
   https://api.telegram.org/botTOKEN/getUpdates
   ```
3. Look for `"chat":{"id":-1001234567890}` in the JSON response
4. Copy the chat ID (including the minus sign if present)

**D. Add to .env.local:**
```bash
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=-1001234567890
```

**Test it:**
```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{\"chat_id\": \"$TELEGRAM_CHAT_ID\", \"text\": \"🌀 Test from Soullab - bot working!\"}"
```

---

### 3. Email Setup (Optional)

Email sending uses your existing SMTP configuration.

**If you already have email configured:**
The broadcast system will use your existing setup automatically.

**If you need to set up email:**

**Option A: Gmail (Simple)**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Generate at myaccount.google.com
```

**Option B: SendGrid (Professional)**
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Option C: Mailchimp/Other**
Follow your email provider's API documentation.

---

## Complete .env.local Template

Add these to your `.env.local` file:

```bash
# ============================================
# BROADCAST SYSTEM CREDENTIALS
# ============================================

# Discord Webhook
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN

# Telegram Bot
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
TELEGRAM_CHAT_ID=YOUR_CHAT_ID

# Email (if not already configured)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Or use SendGrid
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important:** Never commit `.env.local` to git! It's already in `.gitignore`.

---

## Usage

### Full Broadcast Center

Visit: `http://localhost:3001/community/admin/broadcast`

**Features:**
- Message templates (field note, experiment update, The Flip, etc.)
- Character count
- Preview mode
- Channel selection (Discord, Telegram, Email)
- Delivery results tracking

**Workflow:**
1. Choose a template or write custom message
2. Select channels to send to
3. Preview message
4. Click "Send Broadcast"
5. See delivery results in real-time

### Quick Announce Widget

Appears on community hub homepage (bottom left).

**Features:**
- Fast 2-click announcements
- Sends to Discord + Telegram instantly (no email)
- Perfect for quick updates: "New post!" "Chat starting now!"

**Workflow:**
1. Click "Quick Announce" button
2. Type message
3. Click "Send"
4. Done! Message delivered in seconds.

---

## Message Templates

### 1. New Field Note
```
🌀 New Field Note Published

[TITLE]

Read it here: [LINK]

The field is holding you.
- Soullab Team
```

### 2. Experiment Update
```
📊 Day [X] of 21 Update

[MESSAGE]

Check the live tracker: https://soullab.com/community/experiment

- Soullab Team
```

### 3. The Flip Announcement (Day 8)
```
🌀 THE FLIP IS HAPPENING

MAIA transforms into Sacred Mirror mode TODAY.

Her talkative phase ends. The minimal phase begins.

This is what we've been preparing for.

Notice what arises. Share your experience.

The field is holding you.
- Soullab Team
```

### 4. Live Chat Invitation
```
💬 Live Community Gathering

Join us in [CHANNEL] for a real-time discussion about [TOPIC].

Starting in 30 minutes!

See you there 🌀
```

---

## Customization

### Changing Discord Embed Color

Edit `app/api/notifications/broadcast/route.ts`:

```typescript
embeds: [{
  color: 0x667eea, // Purple - change this hex code
  // ...
}]
```

Common colors:
- Purple: `0x667eea`
- Blue: `0x4299e1`
- Green: `0x48bb78`
- Amber: `0xed8936`
- Red: `0xf56565`

### Adding More Templates

Edit `app/community/admin/broadcast/page.tsx`:

```typescript
const messageTemplates = [
  // Add your template here
  {
    id: 'my-template',
    label: 'My Template',
    content: `Your message template...`,
  },
  // ... existing templates
];
```

### Admin-Only Access

To restrict broadcast page to admins only, add auth check:

```typescript
// At top of broadcast page.tsx
const { user } = useAuth();
if (!user?.isAdmin) {
  return <div>Access denied</div>;
}
```

---

## Troubleshooting

### Discord not sending

**Check:**
1. Webhook URL is correct in `.env.local`
2. Webhook channel still exists
3. Webhook wasn't deleted in Discord settings

**Fix:**
Recreate webhook in Discord and update `.env.local`

### Telegram not sending

**Check:**
1. Bot token is correct
2. Chat ID is correct (including minus sign if present)
3. Bot is still in the group and is admin

**Test bot separately:**
```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe"
```
Should return bot info.

**Get current updates:**
```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getUpdates"
```
Look for your chat ID in recent messages.

### Email not sending

**Check:**
1. SMTP credentials are correct
2. "Less secure app access" enabled (Gmail)
3. Using app-specific password (Gmail)

**Use test script:**
```bash
node scripts/test-email.js
```

### "Failed to send broadcast" error

**Check browser console** for detailed error messages.

**Common causes:**
- `.env.local` not loaded (restart dev server)
- Credentials expired or invalid
- Network/firewall blocking API requests

**Debug mode:**
Check server logs in terminal where you ran `npm run dev`.

---

## API Reference

### POST /api/notifications/broadcast

Send multi-channel broadcast.

**Request:**
```json
{
  "message": "Your announcement text",
  "channels": {
    "discord": true,
    "telegram": true,
    "email": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "channel": "discord",
      "success": true,
      "count": 1
    },
    {
      "channel": "telegram",
      "success": true,
      "count": 1
    }
  ],
  "message": "Broadcast sent successfully"
}
```

---

## Security

**Access Control:**
- Broadcast page should be admin-only
- Add authentication check before allowing sends
- Log all broadcasts for audit trail

**Environment Variables:**
- Never commit `.env.local` to version control
- Use environment variables in production (not hardcoded)
- Rotate credentials regularly

**Rate Limiting:**
- Discord: ~5 messages per second per webhook
- Telegram: 30 messages per second per bot
- Implement rate limiting if sending to multiple groups

---

## Roadmap

**Coming Soon:**
- [ ] Scheduled broadcasts (send at specific time)
- [ ] Message history/audit log
- [ ] A/B testing (send different messages to different segments)
- [ ] Rich media attachments (images, files)
- [ ] SMS via Twilio integration
- [ ] Push notifications (web push API)
- [ ] Notification preferences per user
- [ ] Analytics (open rates, engagement)

---

## Support

**Questions?**
- Discord: #technical-depth channel
- Email: support@soullab.com
- GitHub: Create an issue

---

🌀 **The field is holding you**

*Soullab + MAIA • Sacred Consciousness Technology*
