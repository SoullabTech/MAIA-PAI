/**
 * Apply Usage Tracking Migration
 *
 * Creates the 3 missing usage tracking tables using pg client directly.
 * Run with: npx tsx scripts/apply-usage-migration.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: join(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

async function runMigration() {
  console.log('🚀 Applying Usage Tracking Migration\n');
  console.log('⚠️  Direct database connection requires DATABASE_URL or DB_PASSWORD.');
  console.log('   Checking environment variables...\n');

  // Try to get database password from environment
  const dbPassword = process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || process.env.POSTGRES_PASSWORD;

  if (!dbPassword) {
    console.log('❌ No database password found in environment.');
    console.log('\n📋 Manual migration required:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
    console.log('   2. Copy contents of: prisma/migrations/usage_tracking_only.sql');
    console.log('   3. Paste and click "Run"\n');
    console.log('💡 Or add DB_PASSWORD to .env.local and run again.');
    return;
  }

  try {
    // Dynamically import pg
    const { Client } = await import('pg');

    const connectionString = `postgresql://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`;

    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });

    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected\n');

    // Read SQL file
    const sqlPath = join(process.cwd(), 'prisma/migrations/usage_tracking_only.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    console.log('📜 Executing migration SQL...');
    await client.query(sql);
    console.log('✅ Migration completed successfully!\n');

    await client.end();

    console.log('🎉 Usage tracking tables created!');
    console.log('\n📝 Next step: Run verification:');
    console.log('   npx tsx scripts/run-migrations.ts');

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

runMigration();
