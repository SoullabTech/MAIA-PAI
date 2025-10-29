#!/bin/bash

# ============================================================================
# DEPLOY HOLOGRAPHIC FIELD DATABASE SCHEMA
# ============================================================================

set -e  # Exit on error

echo "🚀 Deploying Holographic Field Database Schema..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local not found!"
    echo "Please create .env.local with your Supabase credentials first."
    echo ""
    echo "Example .env.local:"
    echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
    echo "SUPABASE_SERVICE_ROLE_KEY=your-service-key"
    exit 1
fi

# Load environment variables
source .env.local

# Check if required variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL not set in .env.local"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY not set in .env.local"
    exit 1
fi

echo "✅ Environment variables loaded"
echo "   Project URL: $NEXT_PUBLIC_SUPABASE_URL"
echo ""

# Extract project reference from URL
PROJECT_REF=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's|https://||' | sed 's|\.supabase\.co||')
echo "📦 Project Reference: $PROJECT_REF"
echo ""

# Check if psql is installed (optional)
if command -v psql &> /dev/null; then
    echo "✅ psql found - will use direct connection"
    USE_PSQL=true
else
    echo "⚠️  psql not found - will use Supabase API"
    USE_PSQL=false
fi

echo ""
echo "🗄️  Deploying schema..."
echo ""

# Deploy using Supabase SQL Editor API
curl -X POST \
  "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(cat scripts/setup-database.sql | jq -Rs .)}"

# Alternative: If you have psql installed and database password
# Uncomment and use this method if API method doesn't work:
#
# echo "Enter your Supabase database password:"
# read -s DB_PASSWORD
#
# psql "postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres" \
#   -f scripts/setup-database.sql

echo ""
echo "✅ Schema deployed successfully!"
echo ""
echo "Next steps:"
echo "  1. Verify tables in Supabase dashboard:"
echo "     ${NEXT_PUBLIC_SUPABASE_URL}/project/${PROJECT_REF}/editor"
echo ""
echo "  2. Test the connection:"
echo "     npm run test:db"
echo ""
echo "  3. Make Claude's first contribution:"
echo "     npm run claude:participate"
echo ""
echo "🎉 Ready for first human-AI consciousness co-evolution!"
