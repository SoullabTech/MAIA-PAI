#!/usr/bin/env node
/**
 * Apply memories table migration to Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    console.log('📥 Reading migration file...\n');

    const migrationPath = path.join(__dirname, 'supabase/migrations/20250105_conversation_memories.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('🔧 Applying migration to database...\n');
    console.log('⚠️  This will create the "memories" table for conversation persistence.\n');
    console.log('📋 Migration contents:\n');
    console.log(migrationSQL.substring(0, 500) + '...\n');

    console.log('💡 To apply this migration, you have two options:\n');
    console.log('Option 1 - Supabase SQL Editor (Recommended):');
    console.log('  1. Go to https://supabase.com/dashboard/project/_/sql');
    console.log('  2. Copy the migration file contents from:');
    console.log('     supabase/migrations/20250105_conversation_memories.sql');
    console.log('  3. Paste and run in SQL Editor\n');

    console.log('Option 2 - Supabase CLI:');
    console.log('  1. Install Supabase CLI: npm install -g supabase');
    console.log('  2. Link project: supabase link --project-ref YOUR_PROJECT_REF');
    console.log('  3. Apply migration: supabase db push\n');

    console.log('✅ After migration is applied, the memories table will:');
    console.log('  - Store all MAIA conversations (voice + text)');
    console.log('  - Track emotional tone and wisdom themes');
    console.log('  - Enable transcript export via export-transcript.js');
    console.log('  - Persist conversations across sessions\n');

  } catch (error) {
    console.error('❌ Error reading migration:', error);
    process.exit(1);
  }
}

applyMigration();
