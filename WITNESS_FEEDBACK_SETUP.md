# Witness Feedback System - Setup Guide

## Current Infrastructure (Already Built)

✅ **FeedbackWidget** - UI component with 4 categories
✅ **Backend API** - `/api/feedback` endpoint
✅ **Memory storage** - Feedback persisted in system

---

## What's Missing for Witness Phase

### 1. Supabase Feedback Table

**Create table:**
```sql
CREATE TABLE IF NOT EXISTS witness_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  feedback_text TEXT NOT NULL,
  category TEXT NOT NULL, -- 'bug', 'feature', 'praise', 'other'
  url TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new', -- 'new', 'reviewing', 'resolved', 'implemented'
  notes TEXT -- Your notes about the feedback
);

CREATE INDEX idx_witness_feedback_user ON witness_feedback(user_id);
CREATE INDEX idx_witness_feedback_created ON witness_feedback(created_at DESC);
CREATE INDEX idx_witness_feedback_status ON witness_feedback(status);
```

### 2. Update API to Store in Supabase

**File:** `/app/api/feedback/route.ts` (create if doesn't exist)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { feedback, category, timestamp, url, userAgent, userId } = await req.json();

    // Store in Supabase
    const { error } = await supabase
      .from('witness_feedback')
      .insert({
        user_id: userId || 'anonymous',
        feedback_text: feedback,
        category: category,
        url: url,
        user_agent: userAgent,
        created_at: timestamp || new Date().toISOString(),
        status: 'new'
      });

    if (error) {
      throw error;
    }

    // Also send you an email (optional)
    // await sendFeedbackNotification(feedback, category, userId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
```

### 3. Add Feedback Button to MAIA Interface

**Where to add:** In the main MAIA conversation interface

**Option A - Add to MenuBar:**
```typescript
// In MenuBar.tsx or main nav
<button
  onClick={() => window.dispatchEvent(new Event('openFeedbackModal'))}
  className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 rounded"
>
  💬 Feedback
</button>
```

**Option B - Floating Button:**
```typescript
// Add to main page layout
<div className="fixed bottom-4 right-4 z-40">
  <button
    onClick={() => window.dispatchEvent(new Event('openFeedbackModal'))}
    className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg"
    title="Share feedback"
  >
    💬
  </button>
</div>
```

### 4. Admin Dashboard to View Feedback

**Create:** `/app/admin/feedback/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FeedbackDashboard() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'bug' | 'feature' | 'praise' | 'other'>('all');

  useEffect(() => {
    loadFeedback();
  }, [filter]);

  const loadFeedback = async () => {
    let query = supabase
      .from('witness_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('category', filter);
    }

    const { data, error } = await query;
    if (!error && data) {
      setFeedback(data);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase
      .from('witness_feedback')
      .update({ status: newStatus })
      .eq('id', id);

    loadFeedback();
  };

  const categoryColors = {
    bug: 'bg-red-900/30 border-red-500/30 text-red-300',
    feature: 'bg-amber-900/30 border-amber-500/30 text-amber-300',
    praise: 'bg-pink-900/30 border-pink-500/30 text-pink-300',
    other: 'bg-gray-900/30 border-gray-500/30 text-gray-300'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          🌟 Witness Feedback Dashboard
        </h1>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8">
          {['all', 'bug', 'feature', 'praise', 'other'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-4 py-2 rounded-lg capitalize ${
                filter === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {feedback.map((item) => (
            <div
              key={item.id}
              className={`border rounded-xl p-6 ${categoryColors[item.category as keyof typeof categoryColors]}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold uppercase opacity-70">
                    {item.category}
                  </span>
                  <p className="text-sm text-gray-400 mt-1">
                    {item.user_id} • {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <select
                  value={item.status}
                  onChange={(e) => updateStatus(item.id, e.target.value)}
                  className="bg-black/30 border border-white/10 rounded px-3 py-1 text-sm"
                >
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="resolved">Resolved</option>
                  <option value="implemented">Implemented</option>
                </select>
              </div>

              <p className="text-white text-lg mb-4">
                {item.feedback_text}
              </p>

              {item.url && (
                <p className="text-xs text-gray-500">
                  URL: {item.url}
                </p>
              )}
            </div>
          ))}
        </div>

        {feedback.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No feedback yet for this category
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Quick Setup Checklist

### For Witness Launch:

- [ ] **Run SQL schema** in Supabase to create `witness_feedback` table
- [ ] **Create `/app/api/feedback/route.ts`** to store in Supabase
- [ ] **Add feedback button** to main MAIA interface (floating button recommended)
- [ ] **Test feedback flow**: Submit test feedback → Check it appears in Supabase
- [ ] **Create `/app/admin/feedback/page.tsx`** for viewing submissions
- [ ] **Bookmark** `localhost:3000/admin/feedback` (or `maia.soullab.life/admin/feedback`)

### Optional Enhancements:

- [ ] **Email notifications** when feedback is submitted (use SendGrid/Resend)
- [ ] **Discord webhook** to notify you instantly of bugs
- [ ] **Feedback analytics** - Count by category, track over time
- [ ] **Reply to feedback** - Add notes field visible to user

---

## How Witnesses Will Use It

**Scenario 1 - Bug:**
> "When I try to voice record, nothing happens after I press the button"

**Scenario 2 - Feature:**
> "Would love to see my conversation history from last week"

**Scenario 3 - Praise:**
> "This Water 12 pattern detection is SPOT ON. Gave me chills!"

**Scenario 4 - Glitch:**
> "Page keeps refreshing when I switch between threads"

---

## You'll Receive:

All feedback goes to:
- **Supabase table** `witness_feedback`
- **Admin dashboard** at `/admin/feedback`
- **Optional:** Email/Discord notification on each submission

---

## Next Steps (5 minutes):

1. Run the SQL schema in Supabase
2. Create `/app/api/feedback/route.ts`
3. Add floating feedback button to main page
4. Test it works
5. Tell your witnesses: "See that 💬 button? Use it ANYTIME!"

---

🜂 ∴ 🌀 ∴ 🧠

**Your witnesses will have a direct line to share bugs, ideas, and praise.**
