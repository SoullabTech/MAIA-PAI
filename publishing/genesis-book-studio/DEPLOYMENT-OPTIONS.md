# Genesis Book Studio - Deployment Options

**Decision needed before Monday's Week 4 newsletter send**

---

## Current State

Genesis Book Studio exists as:
- **Location**: `/Users/soullab/SoullabTech/MAIA-PAI/publishing/genesis-book-studio`
- **Tech**: Next.js 14, TypeScript, Supabase, Tailwind
- **Port**: Runs on `localhost:3002` (dev)
- **Status**: ✅ Complete and functional
  - Backend: Database schema, API routes, scoring algorithm
  - Frontend: Adaptive reading experience, UI components
  - Research: Beta framework, reflection prompts, demon detection

---

## Deployment Options

### Option 1: Subdomain (Recommended)

**URL Structure**: `https://books.soullab.life` or `https://genesis.soullab.life`

**Pros**:
- Clean, memorable URL
- Independent deployment and scaling
- Can have different auth/database from main platform if needed
- Professional appearance for beta members
- Easy to share (books.soullab.life/read-adaptive)

**Cons**:
- Requires DNS setup
- Separate deployment configuration
- May need CORS setup if sharing auth with main site

**Implementation**:
```bash
# Option A: Vercel (recommended for Next.js)
cd /Users/soullab/SoullabTech/MAIA-PAI/publishing/genesis-book-studio
vercel --prod
# Then add custom domain in Vercel dashboard

# Option B: Deploy to existing infrastructure
# Point DNS subdomain to deployment
```

**Timeline**: 1-2 hours (DNS propagation may take up to 24 hours)

**Newsletter Link**: `https://books.soullab.life/read-adaptive`

---

### Option 2: Path-Based (Integrated)

**URL Structure**: `https://soullab.life/genesis/read-adaptive`

**Pros**:
- Single domain
- Shared authentication automatically
- Unified platform appearance
- Simpler for users (one place for everything)

**Cons**:
- Requires integrating into main codebase
- Main platform must be Next.js or support reverse proxy
- More complex deployment
- Less independent

**Implementation**:
```bash
# Move genesis-book-studio into main app
mv /publishing/genesis-book-studio/app/* /apps/web/app/genesis/
mv /publishing/genesis-book-studio/lib/* /apps/web/lib/genesis/
# Update imports and paths
# Deploy main platform
```

**Timeline**: 3-4 hours (more integration work)

**Newsletter Link**: `https://soullab.life/genesis/read-adaptive`

---

### Option 3: Separate Domain

**URL Structure**: `https://genesis.soullab.ai` or `https://maia-reads.com`

**Pros**:
- Completely independent brand
- Can evolve separately from Soullab
- Professional dedicated experience
- Great for future productization

**Cons**:
- Must purchase domain
- Separate infrastructure costs
- More to maintain
- May confuse beta members (is this Soullab or something else?)

**Implementation**:
```bash
# Purchase domain
# Point DNS to deployment
# Same as Option 1 but with custom domain
```

**Timeline**: 2-3 hours + domain purchase

**Newsletter Link**: `https://genesis.soullab.ai/read-adaptive`

---

### Option 4: Staging URL (Quick Start)

**URL Structure**: `https://genesis-book-studio-beta.vercel.app/read-adaptive`

**Pros**:
- Deploy immediately (15 minutes)
- No DNS setup required
- Can upgrade to custom domain later
- Perfect for beta testing

**Cons**:
- Long, unmemorable URL
- Looks less professional
- Temporary solution

**Implementation**:
```bash
cd /Users/soullab/SoullabTech/MAIA-PAI/publishing/genesis-book-studio
vercel  # No --prod flag for staging
```

**Timeline**: 15 minutes

**Newsletter Link**: `https://genesis-book-studio-beta.vercel.app/read-adaptive`

---

### Option 5: Private Access (VPN/Localhost)

**URL Structure**: `http://localhost:3002/read-adaptive` + beta member access

**Pros**:
- No deployment needed
- Complete control
- Very private beta
- Easy to update in real-time

**Cons**:
- Requires giving beta members VPN access or special instructions
- Not scalable
- Complex for non-technical users
- Must keep development server running 24/7

**Implementation**:
```bash
# Keep dev server running
npm run dev
# Give beta members access via ngrok, Tailscale, or similar
```

**Timeline**: Immediate (but complex setup for users)

**Newsletter Link**: *Varies per member* (not recommended)

---

## Recommendation

**Start with Option 4 (Staging), upgrade to Option 1 (Subdomain) later**

### Why This Approach

**Phase 1: This Week (for Monday newsletter)**
1. Deploy to Vercel staging URL immediately
2. Send newsletter with staging link
3. Beta members can access and test
4. Get feedback and fix any deployment issues

**Phase 2: After Beta Testing (Week 5-6)**
1. Set up custom subdomain (books.soullab.life)
2. Point it to the same Vercel deployment
3. Update links in dashboard
4. Professional URL for public launch

### Benefits
- **Speed**: Deploy today, send Monday
- **Safety**: Test with staging first
- **Flexibility**: Upgrade URL without changing deployment
- **Professional**: Beta members understand "beta.vercel.app" signals testing phase

---

## Implementation Steps (Recommended Path)

### This Weekend (Before Monday Send)

```bash
# 1. Ensure all environment variables are set
cd /Users/soullab/SoullabTech/MAIA-PAI/publishing/genesis-book-studio
# Create .env.production with Supabase credentials

# 2. Test build locally
npm run build
npm run start
# Verify at http://localhost:3000

# 3. Deploy to Vercel staging
vercel
# Follow prompts, note the staging URL

# 4. Test deployed version
# Visit staging URL, try adaptive reading
# Verify database connections work

# 5. Update newsletter with staging URL
# Replace [Try MAIA Adaptive Reading →] with actual URL
```

### Monday Morning

```bash
# 1. Send test newsletter to 1-2 beta members
# 2. Watch them try it (screen share if possible)
# 3. Fix any critical issues
# 4. Send to full beta list
```

### Week 5-6 (After Beta Feedback)

```bash
# 1. Set up custom domain in Vercel
# 2. Add DNS records for books.soullab.life
# 3. Update newsletter links
# 4. Professional deployment complete
```

---

## Environment Variables Needed

Create `.env.production` with:

```bash
# Supabase (from main platform)
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Deployment
NEXT_PUBLIC_BASE_URL=https://genesis-book-studio-beta.vercel.app  # Update after deployment
```

---

## DNS Configuration (For Future Subdomain)

When ready for `books.soullab.life`:

**At your DNS provider** (Vercel, Cloudflare, or wherever soullab.life is hosted):

```
Type: CNAME
Name: books
Value: cname.vercel-dns.com
TTL: Auto
```

**In Vercel Dashboard**:
1. Go to project settings
2. Add domain: `books.soullab.life`
3. Verify ownership
4. Wait for DNS propagation (up to 24 hours)

---

## Security Considerations

### Authentication
- Genesis Book Studio should share Supabase auth with main platform
- Beta members log in once, access both platforms
- RLS policies ensure data isolation

### Database
- Same Supabase project as main platform
- Separate tables (reading_paths, reader_profiles, etc.)
- RLS ensures users only see their own data

### CORS
If deployed to subdomain:
```typescript
// In main Supabase config
const corsOrigins = [
  'https://soullab.life',
  'https://www.soullab.life',
  'https://books.soullab.life',  // Add this
]
```

---

## Cost Estimates

**Vercel (Hobby Plan)**:
- Free for personal projects
- Pro plan: $20/month if needed
- Custom domains included

**Cloudflare DNS** (if needed):
- Free for DNS management

**Supabase**:
- Already using for main platform
- No additional cost for same project

**Total**: $0-20/month depending on traffic

---

## Monitoring After Deploy

Track these metrics:

1. **Deployment Health**
   - Vercel analytics (build times, errors)
   - Uptime monitoring

2. **User Experience**
   - Time to interactive
   - API response times
   - Error rates

3. **Beta Member Access**
   - Who's accessing?
   - Completion rates
   - Database logs

4. **Feedback**
   - Bug reports
   - User satisfaction
   - Feature requests

---

## Decision Template

Fill this out before Monday:

**Deployment Choice**: ☐ Option 1  ☐ Option 2  ☐ Option 3  ☑ Option 4  ☐ Option 5

**URL for Week 4 Newsletter**: ________________________________

**Target Deploy Time**: ________________________________

**Who's Testing First** (1-2 people): ________________________________

**Backup Plan if Deploy Fails**:
☐ Delay newsletter to Tuesday
☐ Invite smaller test group (5-10 people)
☐ Share screenshots + "coming next week" message

---

## Support

If issues during deployment:
- Vercel docs: https://vercel.com/docs
- Supabase docs: https://supabase.com/docs
- Soullab team: hello@soullab.life

---

**Created**: October 25, 2025
**Status**: Awaiting deployment decision
**For**: Week 4 Beta Newsletter (Monday send)
