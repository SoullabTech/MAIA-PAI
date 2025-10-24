# 🌐 Genesis Subdomain Setup Guide

## Recommended Subdomain: **genesis.soullab.life**

*"Where new consciousness platforms are born"*

---

## 🎯 Quick Setup Options (Choose One)

### Option 1: Use Existing MAIA Hosting (Easiest - 5 minutes)

If MAIA is already deployed at `maia.soullab.ai`, you can:

**Step 1:** The file is already created at:
```
public/genesis/index.html
```

**Step 2:** Access it at:
```
https://maia.soullab.ai/genesis
```

**Step 3:** Set up a redirect (in your DNS):
```
genesis.soullab.life → https://maia.soullab.ai/genesis
```

**Done!** genesis.soullab.life now shows your Genesis Builder page.

---

### Option 2: Deploy to GitHub Pages (Free Forever - 15 minutes)

**Step 1: Create GitHub Repo**
```bash
cd /Users/soullab/SoullabTech
mkdir genesis-soullab
cd genesis-soullab
git init
```

**Step 2: Copy the HTML file**
```bash
cp /Users/soullab/SoullabTech/MAIA-PAI/public/genesis-soullab-life/index.html index.html
git add index.html
git commit -m "Initial Genesis landing page"
```

**Step 3: Push to GitHub**
```bash
# Create repo on GitHub: https://github.com/new
# Name it: genesis-soullab
git remote add origin https://github.com/SoullabTech/genesis-soullab.git
git push -u origin main
```

**Step 4: Enable GitHub Pages**
- Go to repo settings
- Pages section
- Source: Deploy from main branch
- Save
- GitHub will give you a URL like: `soullabtech.github.io/genesis-soullab`

**Step 5: Point Your Subdomain**
In your DNS settings for soullab.life:
```
Type: CNAME
Name: genesis
Value: soullabtech.github.io
```

Wait 5-60 minutes for DNS to propagate.

**Done!** genesis.soullab.life is live and free forever!

---

### Option 3: Deploy to Vercel (Modern & Fast - 10 minutes)

**Step 1: Install Vercel CLI** (if you don't have it)
```bash
npm install -g vercel
```

**Step 2: Deploy**
```bash
cd /Users/soullab/SoullabTech/MAIA-PAI/public/genesis-soullab-life
vercel
```

Follow the prompts:
- Set up and deploy? Y
- Which scope? Your account
- Link to existing project? N
- Project name? genesis-soullab
- Directory? ./
- Override settings? N

**Step 3: Add Custom Domain**
```bash
vercel domains add genesis.soullab.life
```

Follow instructions to update your DNS.

**Done!** Super fast, auto-SSL, free tier is generous.

---

### Option 4: Upload to Your Existing Web Host (Traditional - 10 minutes)

If you already have hosting for soullab.life:

**Step 1: Access via FTP/cPanel**

**Step 2: Upload index.html to:**
```
public_html/genesis/index.html
```
or
```
www/genesis/index.html
```
(depends on your host)

**Step 3: Set up subdomain in cPanel**
- Subdomains section
- Create: genesis
- Document root: /public_html/genesis

**Done!** genesis.soullab.life should work immediately.

---

## 🎨 Subdomain Options & Vibes

If you want a different subdomain name, here are alternatives:

### genesis.soullab.life ⭐ Recommended
- **Vibe:** Mythic, origin story, birth of spirals
- **Message:** "Where new platforms are born"
- **Best for:** Consciousness-focused, archetypal language

### yourfuture.soullab.life
- **Vibe:** Aspirational, personal, possibility
- **Message:** "Your future consciousness platform"
- **Best for:** Forward-looking, individual empowerment

### build.soullab.life
- **Vibe:** Active, maker-focused, creative
- **Message:** "Build your own platform"
- **Best for:** DIY, hands-on, entrepreneurial

### spiral.soullab.life
- **Vibe:** On-brand, poetic, philosophical
- **Message:** "Create your piece of the spiral"
- **Best for:** Aligned with existing language

### business.soullab.life
- **Vibe:** Professional, practical, revenue-focused
- **Message:** "Build your astrology business"
- **Best for:** Professional astrologers, monetization angle

---

## 📧 Update Email References

Once you choose your subdomain, update these:

**In your emails:**
```
Visit: https://genesis.soullab.life
```

**In your social posts:**
```
Build your own consciousness platform: genesis.soullab.life
```

**In your beta tester email:**
```
Learn more and join waitlist: genesis.soullab.life
```

---

## ✅ Post-Launch Checklist

After your subdomain is live:

- [ ] Test on desktop browser
- [ ] Test on mobile
- [ ] Test all button links
- [ ] Test email link (genesis@soullab.ai)
- [ ] Share with one friend for feedback
- [ ] Update email templates with correct URL
- [ ] Post on social media
- [ ] Email beta testers with link

---

## 🎯 What You Get

**URL:** genesis.soullab.life

**What it shows:**
- Full Genesis Builder pitch
- All 3 pricing tiers
- "Join Waitlist" CTA
- "Try MAIA First" link
- Contact: genesis@soullab.ai
- Professional, beautiful, mobile-responsive

**What happens when someone visits:**
1. They read about Genesis Builder
2. They see pricing (SEED/GROVE/FOREST)
3. They click "Join Waitlist" → Email genesis@soullab.ai
4. You respond personally with next steps
5. They become a customer! 💰

---

## 💡 Pro Tips

### Start Simple
- Don't wait for perfect DNS setup
- Share maia.soullab.ai/genesis first if that's faster
- Custom domain can come later

### Test Before Sharing Widely
- Send link to 2-3 trusted people first
- Get feedback
- Fix any issues
- Then blast to beta testers

### Track Interest
- Every email to genesis@soullab.ai = lead
- Keep a simple spreadsheet:
  - Name, Email, Tier Interest, Status
- Follow up within 24 hours

---

## 🆘 Troubleshooting

**"DNS isn't working"**
→ Wait 30-60 minutes, can take time to propagate
→ Try incognito/private browser
→ Check DNS settings are correct (CNAME to right target)

**"Page shows but looks broken"**
→ Check that index.html uploaded completely
→ Clear browser cache
→ Check browser console for errors (F12)

**"I don't know how to do any of this"**
→ Option 1 (redirect) is easiest - just update DNS
→ Or hire someone on Fiverr ($20-50 for simple deployment)
→ Or I can talk you through it step by step!

---

## 🚀 Recommended Path

**For fastest launch (today):**
1. Use Option 1 (redirect to maia.soullab.ai/genesis)
2. Just update one DNS record
3. Share link immediately

**For cleanest long-term:**
1. Use Option 2 (GitHub Pages)
2. Free forever, no maintenance
3. Professional and stable

**For most flexibility:**
1. Use Option 3 (Vercel)
2. Can add features later
3. Super fast globally

---

## 📍 Current Status

**File created:** ✅ `/Users/soullab/SoullabTech/MAIA-PAI/public/genesis-soullab-life/index.html`

**Also available:** ✅ `/Users/soullab/SoullabTech/MAIA-PAI/public/genesis/index.html`

**Next step:** Choose deployment option and set up subdomain!

---

**Questions? Let me know which option you want to use and I'll walk you through it step-by-step!** 🌟
