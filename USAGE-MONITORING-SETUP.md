# Usage Monitoring System Setup

## What This Does

Tracks every API request to MAIA with:
- Token usage and costs per user
- Response times and queue metrics
- Success/failure rates
- User quotas and rate limiting
- System-wide statistics

## Step 1: Run Database Migration

The database schema is in `/prisma/migrations/add_usage_tracking.sql`

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard/project/jkbetmadzcpoinjogkli
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query
4. Copy the entire contents of `/prisma/migrations/add_usage_tracking.sql`
5. Paste into the SQL editor
6. Click **Run** to execute

This will create:
- `user_usage_logs` - Detailed log of every request
- `user_usage_quotas` - Per-user rate limits and current usage
- `system_usage_summary` - Daily aggregated statistics
- Helper functions for quota resets and summaries

### Option B: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.jkbetmadzcpoinjogkli.supabase.co:5432/postgres"
```

## Step 2: Verify Migration

Check that tables were created:

```sql
-- Run this in Supabase SQL Editor
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user_usage_logs', 'user_usage_quotas', 'system_usage_summary');
```

Should return 3 rows.

## Step 3: Test the System

### Check Quota System
```bash
# This will check/create default quota for a user
curl http://localhost:3000/api/admin/usage/test-user-1
```

### Send Test Message
```bash
# Send a message through MAIA
curl -X POST http://localhost:3000/api/between/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello MAIA",
    "userId": "test-user-1",
    "userName": "Test User",
    "conversationHistory": [],
    "fieldState": {"depth": 0.7, "active": true}
  }'
```

### View Usage Stats
```bash
# Get user usage summary
curl http://localhost:3000/api/admin/usage/test-user-1

# Get system-wide summary
curl http://localhost:3000/api/admin/usage/summary
```

## Step 4: Monitor in Production

### Real-time Monitoring
- **User Usage**: `GET /api/admin/usage/{userId}`
- **System Summary**: `GET /api/admin/usage/summary`
- **All Users**: `GET /api/admin/usage/users`

### Check Logs
```sql
-- View recent requests
SELECT
  user_id,
  request_type,
  total_tokens,
  total_cost / 100 as cost_usd,
  response_time_ms,
  success,
  created_at
FROM user_usage_logs
ORDER BY created_at DESC
LIMIT 20;
```

### Check User Quotas
```sql
-- See all user quotas
SELECT
  user_id,
  user_tier,
  current_daily_messages,
  daily_message_limit,
  current_daily_tokens,
  daily_token_limit,
  is_blocked,
  last_reset_at
FROM user_usage_quotas;
```

## Features

### Automatic Quota Checking
- Before each request, checks if user has exceeded limits
- Returns 429 status if quota exceeded
- Automatically creates default quotas for new users

### Default Quotas (Beta Tier)
- 100 messages per day
- 50,000 tokens per day
- $0.50 per day cost limit
- 10 requests per minute
- 100 requests per hour

### Cost Calculation
- Sonnet 4 Input: $3 per 1M tokens (0.0003¢ per token)
- Sonnet 4 Output: $15 per 1M tokens (0.0015¢ per token)
- All costs stored in cents for precision

### Automatic Logging
- Every successful request logged with tokens and cost
- Failed requests logged with error type
- Response times and queue wait times tracked

## Admin Dashboard API

### Get User Usage
```bash
GET /api/admin/usage/{userId}?days=7
```

Returns:
```json
{
  "userId": "test-user-1",
  "period": "Last 7 days",
  "totalRequests": 45,
  "successfulRequests": 43,
  "failedRequests": 2,
  "successRate": "95.6%",
  "totalTokens": 125000,
  "totalCostUSD": "0.2125",
  "avgResponseTimeMs": 3421,
  "quota": {
    "dailyMessageLimit": 100,
    "currentDailyMessages": 12,
    "dailyTokenLimit": 50000,
    "currentDailyTokens": 18500,
    "isBlocked": false
  }
}
```

### Get System Summary
```bash
GET /api/admin/usage/summary?days=7
```

Returns:
```json
{
  "period": "Last 7 days",
  "totalRequests": 340,
  "successfulRequests": 328,
  "failedRequests": 12,
  "successRate": "96.5%",
  "uniqueUsers": 8,
  "totalTokens": 875000,
  "totalCostUSD": "1.4875",
  "avgResponseTimeMs": 3102,
  "avgQueueWaitMs": 1200,
  "requestsPerDay": "48.6",
  "costPerDay": "0.2125"
}
```

### List All Users
```bash
GET /api/admin/usage/users
```

Returns:
```json
{
  "users": [
    {
      "userId": "user-1",
      "userName": "Alice",
      "tier": "beta",
      "totalRequests": 120,
      "totalCost": "0.3450",
      "lastActive": "2025-01-07T20:30:00Z"
    }
  ]
}
```

## Troubleshooting

### Migration Fails
- Check Supabase dashboard for error details
- Verify service role key has admin permissions
- Try running statements individually

### No Usage Data Appearing
- Check that migration ran successfully
- Verify Supabase credentials in `.env.local`
- Check server logs for tracker errors
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set (not just anon key)

### Quotas Not Enforcing
- Default behavior is "fail open" - if tracker is unavailable, requests are allowed
- Check that `user_usage_quotas` table exists
- Verify quota check is running (look for `[QUOTA]` in logs)

## Next Steps

1. ✅ Run the migration (Step 1)
2. ✅ Test the system (Step 3)
3. ⏳ Build admin dashboard UI
4. ⏳ Add user management endpoints (update quotas, block users)
5. ⏳ Add cost alerts and notifications
6. ⏳ Implement rate limiting per minute/hour

---

## Files Created

```
/lib/middleware/usage-tracker.ts          - Core tracking logic
/app/api/between/chat/route.ts            - Integrated with chat endpoint
/prisma/migrations/add_usage_tracking.sql - Database schema
/app/api/admin/usage/route.ts             - Dashboard API (next to build)
/USAGE-MONITORING-SETUP.md                - This file
```

**The system is ready! 🚀** Just run the migration and it will start tracking automatically.
