# Community Chat Setup Guide

## ✅ What's Built

A fully functional field-aware community chat system with:

- **8 Pre-seeded Channels**: Introductions, Field Sessions, Week 1, Sacred Mirror, Technical Depth, Integration, Feedback, Sacred Lounge
- **Threaded Discussions**: Create threads, reply, nested conversations
- **Elemental Reactions**: 🪨 Earth, 💧 Water, 🌬️ Air, 🔥 Fire, 🌀 Resonance, 👁️ Witnessed, ✨ Integration
- **Field Atmosphere Visualization**: Real-time collective field state with intensity/depth/coherence metrics
- **Session Sharing**: One-click share MAIA conversations with full field data
- **User Presence**: See who's active in each channel

## 🚀 Deployment Steps

### 1. Run Database Migration

```bash
# Apply the schema to Supabase
cd supabase
supabase migration up
```

Or manually run the SQL in `/supabase/migrations/20250930_community_chat.sql` in your Supabase SQL editor.

### 2. Set Environment Variables

Add to your `.env.local`:

```bash
# Supabase (should already exist)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cron secret for field state calculator
CRON_SECRET=your_random_secret_here
```

### 3. Setup Field State Calculator Cron

The field state calculator needs to run every 5 minutes to update atmosphere metrics.

#### Option A: Vercel Cron Jobs (Recommended)

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/community/calculate-field-state",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

Then in Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add `CRON_SECRET` with a secure random value
3. Deploy

#### Option B: External Cron Service (e.g., Cron-Job.org, EasyCron)

1. Create a cron job that calls: `https://your-domain.com/api/community/calculate-field-state`
2. Set schedule: `*/5 * * * *` (every 5 minutes)
3. Add header: `Authorization: Bearer YOUR_CRON_SECRET`

#### Option C: Manual Testing (Development)

```bash
# Test in dev mode
curl http://localhost:3000/api/community/calculate-field-state
```

### 4. Test the System

1. **Visit Community Hub**: `/community`
2. **Click "Community Chat"** (no longer shows "Coming Soon")
3. **Create a thread**: Click "New Thread" → Fill form → Post
4. **Reply to a thread**: Open any thread → Add reply
5. **Add reactions**: Click "+" on any thread/reply → Select elemental reaction
6. **Check field state**: Sidebar shows live atmosphere metrics
7. **Share a session**: From MAIA Studio → "Share to Community" button

## 📊 Database Tables Created

- `community_channels` - Discussion channels
- `community_threads` - Top-level posts
- `community_replies` - Comments on threads
- `community_reactions` - Elemental reactions
- `community_presence` - User online status
- `community_field_state` - Collective atmosphere metrics

## 🎨 Key Components

### Client Library
- `lib/community/chat-client.ts` - Supabase interface

### UI Components
- `components/community/FieldAtmosphere.tsx` - Field state visualization
- `components/community/ReactionBar.tsx` - Elemental reactions picker
- `components/community/ShareSessionButton.tsx` - Session sharing modal

### Pages
- `/community/chat` - Channel list + thread list
- `/community/chat/create` - New thread form
- `/community/chat/thread/[id]` - Thread detail with replies

### Background Jobs
- `lib/community/field-state-calculator.ts` - Atmosphere metrics calculator
- `/api/community/calculate-field-state` - Cron endpoint

## 🔐 Security & Permissions

Row Level Security (RLS) is enabled:

- **Anyone can read** public threads/replies/reactions (anon + authenticated)
- **Authenticated users can create** their own threads/replies
- **Authors can update** their own content
- **Users can react** and manage their own reactions
- **Service role key required** for field state calculator

## 🌀 Field State Metrics

The atmosphere calculation considers:

### Elemental Balance
- Averaged from all session shares in the channel (last 24h)
- Falls back to neutral (25% each) if no sessions shared

### Intensity Level (0-1)
- Based on message frequency (messages per hour)
- 10+ msgs/hr = maximum intensity

### Depth Level (0-1)
- Based on average message length
- 500+ characters = deep discussion

### Coherence Level (0-1)
- Based on reply ratio (replies per thread)
- 3+ replies per thread = high coherence

## 🎯 Next Steps

1. **Monitor field state accuracy** - Adjust calculator weights if needed
2. **Add moderation tools** - Flag inappropriate content, admin actions
3. **Implement search** - Full-text search across threads
4. **Add notifications** - Email/push when someone replies to your thread
5. **User profiles** - Avatar, bio, field signature
6. **Private messages** - DM between community members
7. **Voice channels** - Live group conversations (Phase 2)

## 🐛 Troubleshooting

**Field state not updating?**
- Check if cron job is running
- Verify `CRON_SECRET` matches in both cron and env vars
- Check Vercel/Supabase logs for errors

**Can't create threads?**
- Ensure user is authenticated
- Check Supabase RLS policies are enabled
- Verify `auth.users` table exists

**Reactions not working?**
- Check unique constraint on reactions (user can't double-react with same type)
- Verify RLS policies allow authenticated users to insert

**Session shares missing field data?**
- MAIA Studio needs to pass `fieldMetrics` prop to `ShareSessionButton`
- Check that RFS is enabled and calculating field data

## 📱 Mobile Responsiveness

All pages are responsive:
- Chat list uses 3-column grid on desktop, stacks on mobile
- Thread detail is single-column, optimized for reading
- Reaction picker is touch-friendly
- Field atmosphere adapts to small screens

## 🎉 Launch Checklist

- [ ] Database migration applied
- [ ] Environment variables set
- [ ] Cron job configured and running
- [ ] Test thread creation
- [ ] Test replies and reactions
- [ ] Test session sharing from MAIA Studio
- [ ] Verify field state updates
- [ ] Check mobile experience
- [ ] Announce to beta testers!

---

**Built with restraint as technology** 🌀
