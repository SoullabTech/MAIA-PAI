#!/bin/bash

# Apply MAIA Supabase Schema
# This script applies the complete schema setup to Supabase

echo "🔧 Applying MAIA Supabase schema..."

# Database connection details
DB_HOST="db.jkbetmadzcpoinjogkli.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"
DB_PASS="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprYmV0bWFkemNwb2luam9na2xpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU2MjI0NSwiZXhwIjoyMDU4MTM4MjQ1fQ.QNvP9jEiSSfs_2-aFmtDt1xEMY_vwpU_ZT-CYRlgS98"

# Apply the schema
PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f setup_supabase_schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema applied successfully!"
    echo "🎯 MAIA database is ready for conversations"
else
    echo "❌ Schema application failed"
    exit 1
fi