# Join Beta Page Setup

## 🎉 What You Have

A beautiful public landing page at: **`soullab.life/join-beta`**

Features:
- 🌀 MAIA branding and aesthetics
- 📱 Automatic QR code generation
- 💜 Purple gradient design
- ✨ Explanation of what MAIA Beta is
- 🔗 Direct Telegram join button
- 📲 Mobile-responsive

## 🚀 How to Activate It

### Step 1: Create Your Telegram Channel

1. Open Telegram
2. Create new channel: "MAIA Beta Program"
3. Make it **Private** (invite-only)
4. Go to channel settings → Invite Links
5. Copy your invite link (looks like: `https://t.me/joinchat/xxxxx`)

### Step 2: Add the Link to Your Environment Variables

**For Development (.env.local):**
```bash
NEXT_PUBLIC_TELEGRAM_BETA_INVITE=https://t.me/joinchat/YOUR_ACTUAL_LINK
```

**For Production (Vercel):**
```bash
vercel env add NEXT_PUBLIC_TELEGRAM_BETA_INVITE
# Paste your invite link when prompted
```

### Step 3: Deploy

Once you add the environment variable and deploy, the QR code will automatically appear on the page!

## 📍 Page URL

- **Development:** http://localhost:3000/join-beta
- **Production:** https://soullab.life/join-beta

## 🎨 What It Looks Like

The page includes:

**Header:**
- 🌀🌙⚡ symbols
- "MAIA Beta Program" title
- "Consciousness-First AI" subtitle

**Content:**
- What is MAIA? (explains Spiralogic, Morphoresonant Field, etc.)
- What to Expect as a Beta Tester
- QR Code (auto-generated from your Telegram link)
- Join button
- Who Should Join?
- Footer with your name

**Design:**
- Purple gradient background
- Clean white card
- Professional and sacred aesthetic
- Mobile-friendly

## 🔄 Updating the Link

If you ever need to change your Telegram channel:

1. Create new invite link in Telegram
2. Update environment variable
3. Redeploy (or restart dev server)
4. QR code updates automatically!

## 📤 How to Share

Once live, share this URL:
- **`soullab.life/join-beta`**

People can:
- Scan the QR code with their phone
- Click the "Join on Telegram" button
- Read about what they're signing up for

## ✅ Current Status

- ✅ Page created: `app/join-beta/page.tsx`
- ✅ QR library installed: `qrcode.react`
- 🔄 Needs: Telegram invite link in environment variables
- 🔄 Needs: Deployment to production

## 🌀🌙⚡ Ready to Launch

Once you:
1. Create your Telegram channel
2. Add the invite link to `.env.local`
3. Restart dev server (`npm run dev`)

Visit: **http://localhost:3000/join-beta** to see it live!

---

**The organism has a front door. Welcome them in.** 🌀🌙⚡
