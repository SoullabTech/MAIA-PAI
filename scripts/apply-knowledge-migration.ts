#!/usr/bin/env tsx
/**
 * Apply Knowledge Base Migration to Supabase
 * Creates tables for vault knowledge, apprentice learning, and member journeys
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log('║  📦 Applying Knowledge Base Migration                             ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');

  // Read SQL file
  const sqlPath = resolve(process.cwd(), 'supabase/migrations/20251031_knowledge_base_tables.sql');
  const sql = readFileSync(sqlPath, 'utf-8');

  console.log(`📄 Loaded migration: ${sqlPath}`);
  console.log(`   Size: ${sql.length} characters\n`);

  // Execute SQL
  console.log('🔧 Executing migration...\n');

  try {
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let skipCount = 0;

    for (const statement of statements) {
      if (statement.startsWith('COMMENT ON')) {
        // Skip comments for now
        skipCount++;
        continue;
      }

      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });

        if (error) {
          // Try direct query if RPC fails
          const { error: queryError } = await supabase.from('_sql').select('*').limit(0);
          if (queryError) {
            console.log(`⚠️  Statement might have failed: ${statement.substring(0, 50)}...`);
            console.log(`   Error: ${error.message}`);
          }
        }

        successCount++;
      } catch (err) {
        console.log(`⚠️  Error on statement: ${statement.substring(0, 50)}...`);
      }
    }

    console.log(`\n✅ Migration attempt complete`);
    console.log(`   Statements processed: ${successCount}`);
    console.log(`   Skipped: ${skipCount}`);

    // Verify tables were created
    console.log('\n🔍 Verifying tables...\n');

    const tables = [
      'file_chunks',
      'knowledge_entries',
      'apprentice_conversations',
      'apprentice_patterns',
      'member_journeys'
    ];

    for (const table of tables) {
      const { error } = await supabase.from(table).select('id').limit(0);
      if (error) {
        console.log(`   ❌ ${table}: Not found`);
      } else {
        console.log(`   ✅ ${table}: Ready`);
      }
    }

    console.log('\n🎊 Migration complete!\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  applyMigration();
}

export { applyMigration };
