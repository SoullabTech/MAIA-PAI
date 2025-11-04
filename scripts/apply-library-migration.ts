/**
 * Apply Library of Alexandria Database Migration
 *
 * Creates 5 tables for the knowledge base:
 * - file_chunks: Vault content with semantic embeddings
 * - knowledge_entries: Structured teachings
 * - apprentice_conversations: Learning from interactions
 * - apprentice_patterns: Recognized patterns
 * - member_journeys: Individual transformation tracking
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('🔮 LIBRARY OF ALEXANDRIA - Database Migration');
  console.log('━'.repeat(60));

  // Read migration file
  const migrationPath = join(process.cwd(), 'supabase/migrations/20251031_knowledge_base_tables.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf-8');

  console.log('📖 Read migration file:', migrationPath);
  console.log('📏 SQL length:', migrationSQL.length, 'characters');
  console.log();

  // Enable pgvector extension first
  console.log('🔧 Enabling pgvector extension...');
  const { error: extError } = await supabase.rpc('exec_sql', {
    sql: 'CREATE EXTENSION IF NOT EXISTS vector;'
  });

  if (extError) {
    console.log('⚠️  Extension creation warning (might already exist):', extError.message);
  } else {
    console.log('✅ Vector extension enabled');
  }
  console.log();

  // Split migration into statements (rough split by semicolons)
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && s !== '');

  console.log(`📦 Found ${statements.length} SQL statements to execute`);
  console.log();

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';
    const preview = statement.substring(0, 80).replace(/\n/g, ' ');

    process.stdout.write(`[${i + 1}/${statements.length}] ${preview}... `);

    try {
      // Execute via RPC (this is a workaround - normally you'd use Supabase CLI)
      const { error } = await supabase.rpc('exec_sql', { sql: statement });

      if (error) {
        console.log('❌');
        console.log('   Error:', error.message);
        errorCount++;
      } else {
        console.log('✅');
        successCount++;
      }
    } catch (err) {
      console.log('❌');
      console.log('   Error:', err instanceof Error ? err.message : String(err));
      errorCount++;
    }
  }

  console.log();
  console.log('━'.repeat(60));
  console.log('📊 Migration Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log();

  if (errorCount === 0) {
    console.log('🎉 Migration completed successfully!');
    console.log('🔮 The Library of Alexandria database is ready!');
    console.log();
    console.log('Next steps:');
    console.log('   npm run import:wisdom    # Process uploaded files');
    return true;
  } else {
    console.log('⚠️  Migration completed with errors');
    console.log('   This might be OK if tables already exist');
    return false;
  }
}

// Run it
applyMigration()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    console.error('💥 Fatal error:', err);
    process.exit(1);
  });
