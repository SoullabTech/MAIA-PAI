#!/bin/bash

# Apply MAIA Supabase Schema via REST API
echo "🔧 Applying MAIA Supabase schema via API..."

SUPABASE_URL="https://jkbetmadzcpoinjogkli.supabase.co"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprYmV0bWFkemNwb2luam9na2xpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU2MjI0NSwiZXhwIjoyMDU4MTM4MjQ1fQ.QNvP9jEiSSfs_2-aFmtDt1xEMY_vwpU_ZT-CYRlgS98"

# Read the SQL file and execute it via RPC
curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec" \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "sql": "$(cat setup_supabase_schema.sql | sed 's/"/\\"/g' | tr '\n' ' ')"
}
EOF

echo ""
echo "✅ Schema application completed!"