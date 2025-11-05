#!/bin/bash

# Force Supabase Schema Cache Refresh
# Run this after creating new tables via SQL Editor

source .env.local

echo "🔄 Forcing Supabase schema cache refresh..."
echo ""

# Method 1: Notify PostgREST to reload schema
curl -X POST \
  "https://eeubmaqmcdgzorlohslq.supabase.co/rest/v1/rpc/pg_notify" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"channel":"pgrst","payload":"reload schema"}' \
  2>/dev/null

echo "✅ Schema refresh request sent"
echo ""
echo "⏳ Wait 5-10 seconds, then test with: node check_tables.js"
echo ""
echo "If tables still don't appear:"
echo "1. Go to Supabase Dashboard → SQL Editor"
echo "2. Run: NOTIFY pgrst, 'reload schema';"
echo "3. Or wait ~60 seconds for automatic cache refresh"
