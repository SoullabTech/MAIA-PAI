# Deploy Genesis Book Studio to Vercel

**Easy deployment guide for books.soullab.life**

---

## Prerequisites

- [x] Vercel account (sign up at vercel.com with GitHub if needed)
- [x] Supabase credentials ready
- [x] AWS Route 53 access for DNS

---

## Step 1: Prepare Environment Variables

Create production environment file:

```bash
cd /Users/soullab/SoullabTech/MAIA-PAI/publishing/genesis-book-studio

# Create .env.production
cat > .env.production << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App Config
NEXT_PUBLIC_APP_URL=https://books.soullab.life
EOF
```

**Get your Supabase credentials**:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 2: Test Build Locally

Make sure everything works before deploying:

```bash
cd /Users/soullab/SoullabTech/MAIA-PAI/publishing/genesis-book-studio

# Install dependencies (if not already done)
npm install

# Build for production
npm run build

# Test the production build
npm run start
```

**Test in browser**:
- Open http://localhost:3000
- Try the adaptive reading flow: http://localhost:3000/read-adaptive
- Select an intent, verify path generation works
- Check that Supabase connection works

If everything looks good, proceed! ✅

---

## Step 3: Install Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login
# Follow prompts - use your GitHub/email
```

---

## Step 4: Deploy to Vercel Staging

First deploy to staging to test:

```bash
cd /Users/soullab/SoullabTech/MAIA-PAI/publishing/genesis-book-studio

# Initial deploy (staging)
vercel
```

**You'll be asked**:
```
? Set up and deploy "~/SoullabTech/MAIA-PAI/publishing/genesis-book-studio"? [Y/n]
> Y

? Which scope do you want to deploy to?
> Select your account/organization

? Link to existing project? [y/N]
> N

? What's your project's name?
> genesis-book-studio

? In which directory is your code located?
> ./ (just press Enter)

? Want to override the settings? [y/N]
> N
```

**Vercel will**:
- Build your project
- Deploy it
- Give you a URL like: `https://genesis-book-studio-abc123.vercel.app`

**Test the staging URL**:
- Visit the URL Vercel gave you
- Try adaptive reading
- Verify everything works

---

## Step 5: Add Environment Variables in Vercel

**In Vercel Dashboard** (https://vercel.com/dashboard):

1. Go to your project: `genesis-book-studio`
2. Settings → Environment Variables
3. Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your_anon_key` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_service_role_key` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://books.soullab.life` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://genesis-book-studio-abc123.vercel.app` | Preview, Development |

4. **Save**

---

## Step 6: Deploy to Production

```bash
cd /Users/soullab/SoullabTech/MAIA-PAI/publishing/genesis-book-studio

# Deploy to production
vercel --prod
```

This creates your production deployment!

**You'll get a production URL** like: `https://genesis-book-studio.vercel.app`

**Test it** - verify everything still works.

---

## Step 7: Add Custom Domain (books.soullab.life)

**In Vercel Dashboard**:

1. Go to your project → Settings → Domains
2. Click "Add"
3. Enter: `books.soullab.life`
4. Click "Add"

Vercel will show you DNS instructions. You'll see something like:

```
Add a CNAME record:
Name: books
Value: cname.vercel-dns.com
```

---

## Step 8: Configure AWS Route 53 DNS

**In AWS Console**:

1. Go to **Route 53** → Hosted Zones
2. Click on `soullab.life`
3. Click **Create record**

**Record details**:
```
Record name: books
Record type: CNAME
Value: cname.vercel-dns.com
TTL: 300 (or default)
Routing policy: Simple routing
```

4. Click **Create records**

---

## Step 9: Wait for DNS Propagation

**In Vercel Dashboard**:
- Go back to Domains section
- Vercel will automatically check DNS
- When verified, you'll see a green checkmark ✅
- SSL certificate will be auto-issued (takes 1-2 minutes)

**DNS propagation** can take:
- Usually: 5-15 minutes
- Sometimes: up to 24 hours

**Check DNS status**:
```bash
# Check if DNS is propagating
dig books.soullab.life

# Should show CNAME pointing to vercel
```

---

## Step 10: Test Production Site

Once DNS is verified:

```bash
# Open in browser
open https://books.soullab.life
```

**Full test**:
- ✅ Site loads at books.soullab.life
- ✅ HTTPS works (green lock icon)
- ✅ Adaptive reading works: https://books.soullab.life/read-adaptive
- ✅ Can select intent and get path
- ✅ Supabase connection works
- ✅ Reading path saves to database

---

## Step 11: Update Newsletter Links

Now that you have the production URL, update the newsletter:

**In WEEK-4-NEWSLETTER.md**:

```markdown
# Find and replace:
[Try MAIA Adaptive Reading →]
# With:
[Try MAIA Adaptive Reading →](https://books.soullab.life/read-adaptive)

# And:
[MAIA Adaptive Reading]
# With:
[MAIA Adaptive Reading](https://books.soullab.life/read-adaptive)
```

**See**: `NEWSLETTER-LINKS-UPDATE.md` for complete checklist

---

## Ongoing: Auto-Deploy from Git

**Optional but recommended**:

In Vercel Dashboard → Settings → Git:
- Connect your GitHub repository
- Enable auto-deploy for `main` branch
- Now every `git push` auto-deploys! 🚀

```bash
# Future deployments are just:
git add .
git commit -m "Update content"
git push

# Vercel automatically builds and deploys!
```

---

## Troubleshooting

### Build Fails

**Check build logs** in Vercel dashboard:
- Common issue: Missing environment variables
- Solution: Add them in Settings → Environment Variables

### 404 on Pages

**Verify routing**:
- Next.js pages should be in `app/` directory
- Check `app/read-adaptive/page.tsx` exists

### Supabase Connection Fails

**Check**:
- Environment variables are set correctly
- RLS policies allow authenticated access
- Supabase project is not paused

### DNS Not Resolving

**Wait longer** - DNS can take time
**Check in Route 53**: Record exists and is correct
**Test**: `dig books.soullab.life` should show CNAME

---

## Commands Cheat Sheet

```bash
# Deploy to staging
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove a deployment
vercel rm [deployment-url]

# Open project in browser
vercel open
```

---

## Cost

**Vercel Hobby Plan** (Free):
- Unlimited personal projects
- 100GB bandwidth/month
- Serverless functions
- Custom domains
- Auto SSL

**Should be free for beta!** If you need more, Vercel Pro is $20/month.

---

## Security Checklist

Before going live:

- [ ] Environment variables set (not hardcoded in code)
- [ ] `.env.production` is in `.gitignore` (don't commit secrets!)
- [ ] Supabase RLS policies are enabled
- [ ] Service role key only used server-side
- [ ] HTTPS enforced (Vercel does this automatically)

---

## Post-Deployment

### Monitor Performance

Vercel Dashboard → Analytics:
- Page views
- Response times
- Error rates

### Test with Beta Members

1. Send test newsletter to 1-2 members
2. Have them try books.soullab.life/read-adaptive
3. Watch for issues
4. Fix critical bugs
5. Then send to all

### Set Up Alerts

Vercel Dashboard → Settings → Notifications:
- Email on deployment failures
- Email on build errors

---

## Weekend Timeline

**Saturday Morning** (2-3 hours):
- [ ] Set up environment variables
- [ ] Test build locally
- [ ] Deploy to Vercel staging
- [ ] Add env vars in Vercel dashboard
- [ ] Deploy to production

**Saturday Afternoon** (1 hour):
- [ ] Add custom domain in Vercel
- [ ] Configure AWS Route 53
- [ ] Wait for DNS propagation

**Saturday Evening** (30 min):
- [ ] Test production site thoroughly
- [ ] Update newsletter links
- [ ] Create feedback form

**Sunday Evening** (1 hour):
- [ ] Send test newsletter to 1-2 members
- [ ] Have them test books.soullab.life
- [ ] Fix any critical issues
- [ ] Get confirmation to send

**Monday 9am**:
- [ ] Send newsletter to all beta members! 🚀

---

## Support

**Vercel Docs**: https://vercel.com/docs
**Vercel Discord**: https://vercel.com/discord
**Soullab Team**: hello@soullab.life

---

## Summary

```bash
# 1. Test locally
npm run build && npm run start

# 2. Deploy to Vercel
vercel --prod

# 3. Add domain in Vercel Dashboard
# books.soullab.life

# 4. Update Route 53
# CNAME: books → cname.vercel-dns.com

# 5. Wait for DNS + SSL
# Usually 5-15 minutes

# 6. Test and launch!
# https://books.soullab.life/read-adaptive
```

**That's it!** Vercel makes it easy. 🎉

---

**Created**: October 25, 2025
**For**: Genesis Book Studio Production Deployment
**Target**: books.soullab.life
**Timeline**: This weekend (before Monday newsletter)
