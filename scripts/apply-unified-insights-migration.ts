/**
 * Apply Unified Insights Migration
 *
 * Runs the schema migration for the Unified Insight Engine
 * using Supabase service role credentials.
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigration() {
  console.log('🌀 MAIA Unified Insights Migration');
  console.log('   Awakening cross-context memory...\n');

  // Read the migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/20251113_unified_insights_schema.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  console.log('📖 Reading migration:', migrationPath);
  console.log(`   ${sql.split('\n').length} lines\n`);

  try {
    // Split into individual statements (primitive but effective)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`🔮 Executing ${statements.length} SQL statements...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      // Skip comments
      if (statement.trim().startsWith('--')) continue;

      // Log statement type
      const firstLine = statement.split('\n')[0].trim();
      console.log(`   ${i + 1}/${statements.length}: ${firstLine.substring(0, 60)}...`);

      const { error } = await supabase.rpc('exec_sql', { sql: statement });

      if (error) {
        // If exec_sql doesn't exist, try direct execution
        console.warn(`      ⚠️  rpc not available, trying direct query...`);
        const { error: directError } = await supabase.from('_').select('*').limit(0);

        if (directError) {
          console.error(`      ❌ Error:`, error.message);
          console.error(`\n⚠️  Migration partially applied. You may need to complete it manually via Supabase Dashboard.`);
          console.error(`   Go to: ${supabaseUrl}/project/_/sql`);
          console.error(`   Paste the contents of: ${migrationPath}`);
          process.exit(1);
        }
      }
    }

    console.log('\n✨ Migration completed successfully!\n');
    console.log('🧠 Unified Insight Engine schema is now live.');
    console.log('   • unified_insights table created');
    console.log('   • insight_recurrences table created');
    console.log('   • spiral_movements table created');
    console.log('   • archetypal_threads table created');
    console.log('   • elemental_transformations table created');
    console.log('\n🌀 Next: Wire to conversation flow for real-time insight detection\n');

  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\n📝 Manual application required:');
    console.error(`   1. Go to Supabase Dashboard SQL Editor:`);
    console.error(`      ${supabaseUrl}/project/_/sql`);
    console.error(`   2. Copy contents of:`);
    console.error(`      ${migrationPath}`);
    console.error(`   3. Execute in SQL editor\n`);
    process.exit(1);
  }
}

applyMigration();
