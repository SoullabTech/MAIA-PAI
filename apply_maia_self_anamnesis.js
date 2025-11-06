#!/usr/bin/env node

/**
 * Apply maia_self_anamnesis migration to production Supabase
 * Fixes the missing table error on soullab.life
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Read the migration SQL
const migrationPath = path.join(__dirname, 'supabase/migrations/20250104_maia_self_anamnesis.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

console.log('🔧 Applying maia_self_anamnesis migration to production...');
console.log(`📍 Supabase URL: ${SUPABASE_URL}`);
console.log(`📄 Migration: ${migrationPath}\n`);

async function applyMigration() {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  try {
    // First check if table already exists
    console.log('🔍 Checking if table exists...');
    const { data: existingTable, error: checkError } = await supabase
      .from('maia_self_anamnesis')
      .select('id')
      .limit(1);

    if (!checkError) {
      console.log('✅ Table already exists!');
      console.log('📊 MAIA self-memory is accessible.');
      process.exit(0);
    }

    // If table doesn't exist, we need to create it via SQL Editor
    console.log('⚠️  Table does not exist. Creating via Supabase...\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 MANUAL MIGRATION REQUIRED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('Please follow these steps:\n');
    console.log('1. Open Supabase SQL Editor:');
    console.log('   🔗 https://supabase.com/dashboard/project/jkbetmadzcpoinjogkli/sql/new\n');
    console.log('2. Copy the SQL migration from:');
    console.log(`   📄 ${migrationPath}\n`);
    console.log('3. Paste it into the SQL Editor and click "Run"\n');
    console.log('4. After running, come back and run this script again to verify\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Copy SQL to clipboard if available
    try {
      const { exec } = require('child_process');
      exec(`echo "${migrationSQL.replace(/"/g, '\\"')}" | pbcopy`, (err) => {
        if (!err) {
          console.log('✨ SQL copied to clipboard! Just paste in SQL Editor.\n');
        }
      });
    } catch (e) {
      // Clipboard copy failed, that's ok
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 You need to apply the migration manually via Supabase Dashboard.');
    process.exit(1);
  }
}

applyMigration();
