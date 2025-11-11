/**
 * Migration Runner for MAIA Database
 *
 * Executes SQL migrations against Supabase PostgreSQL database.
 * Run with: npx tsx scripts/run-migrations.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function runMigration(sqlPath: string) {
  console.log(`\n🔄 Migration file: ${sqlPath}`);
  console.log('\n⚠️  Note: Supabase client library cannot execute raw SQL directly.');
  console.log('   You need to run this migration using one of these methods:\n');

  console.log('📋 Option 1: Supabase Dashboard (Recommended)');
  console.log('   1. Go to: https://supabase.com/dashboard/project/jkbetmadzcpoinjogkli/sql/new');
  console.log('   2. Copy the contents of: prisma/migrations/complete_bardic_memory.sql');
  console.log('   3. Paste into SQL Editor and click "Run"\n');

  console.log('📋 Option 2: Supabase CLI');
  console.log('   npx supabase db push --file prisma/migrations/complete_bardic_memory.sql\n');

  console.log('📋 Option 3: Direct psql Connection');
  console.log('   Get connection string from Supabase dashboard, then:');
  console.log('   psql "<connection-string>" -f prisma/migrations/complete_bardic_memory.sql\n');

  console.log('⏸️  Skipping automatic execution...\n');

  return false; // Return false to indicate manual execution needed
}

async function verifyTables() {
  console.log('🔍 Verifying tables...');

  const expectedTables = [
    'user_usage_logs',
    'user_usage_quotas',
    'system_usage_summary',
    'episodes',
    'episode_vectors',
    'episode_links',
    'cues',
    'episode_cues',
    'teloi',
    'telos_alignment_log',
    'microacts',
    'microact_logs',
    'field_edges',
  ];

  try {
    const foundTables: string[] = [];

    // Check each table individually by querying it
    for (const tableName of expectedTables) {
      const { error } = await supabase
        .from(tableName)
        .select('*')
        .limit(0);

      if (!error) {
        foundTables.push(tableName);
        console.log(`   ✓ ${tableName}`);
      }
    }

    if (foundTables.length === 13) {
      console.log(`\n🎉 All ${foundTables.length}/13 tables exist!`);
      return true;
    } else {
      console.log(`\n⚠️  Found ${foundTables.length}/13 tables`);
      const missing = expectedTables.filter(t => !foundTables.includes(t));
      if (missing.length > 0) {
        console.log('   Missing tables:', missing.join(', '));
      }
      return false;
    }
  } catch (err) {
    console.error('❌ Verification error:', err);
    return false;
  }
}

async function main() {
  console.log('🚀 MAIA Database Migration Runner');
  console.log('================================\n');
  console.log(`📍 Target: ${SUPABASE_URL}`);

  const migrationPath = join(process.cwd(), 'prisma/migrations/complete_bardic_memory.sql');

  // Show migration instructions
  await runMigration(migrationPath);

  console.log('🔄 Checking if tables already exist...\n');

  // Verify tables (check if migration was already run)
  const verified = await verifyTables();

  if (verified) {
    console.log('\n✅ All tables already exist! Database is ready for MAIA.');
    console.log('\n📝 Next steps:');
    console.log('   1. Test with: npm run dev');
    console.log('   2. View dashboard: http://localhost:3000/admin/usage');
    console.log('   3. Create test episode');
  } else {
    console.log('\n📋 Tables not found. Please run the migration using one of the methods above.');
    console.log('\n💡 After running the migration, run this script again to verify.');
  }
}

main().catch(console.error);
