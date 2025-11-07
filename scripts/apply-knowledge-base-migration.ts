/**
 * Apply Knowledge Base Migration
 *
 * Runs the 20251031_knowledge_base_tables.sql migration
 * to create file_chunks and related tables.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function applyMigration() {
  console.log('🔧 Applying knowledge base migration...\n');

  // Read the migration file
  const migrationPath = path.join(
    __dirname,
    '../supabase/migrations/20251031_knowledge_base_tables.sql'
  );

  const sql = fs.readFileSync(migrationPath, 'utf-8');

  console.log('📄 Migration SQL loaded');
  console.log(`   File: ${migrationPath}`);
  console.log(`   Size: ${sql.length} characters\n`);

  // Execute the migration
  try {
    console.log('⚙️  Executing migration...');

    // Supabase client doesn't support raw SQL directly
    // We need to use the SQL editor or CLI
    console.log('\n⚠️  IMPORTANT: This migration needs to be run via Supabase SQL Editor');
    console.log('    1. Go to: https://supabase.com/dashboard/project/jkbetmadzcpoinjogkli/sql/new');
    console.log('    2. Copy the migration from: supabase/migrations/20251031_knowledge_base_tables.sql');
    console.log('    3. Paste and run it');
    console.log('\n    OR use Supabase CLI:');
    console.log('    npx supabase db push\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

applyMigration();
