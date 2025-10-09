/**
 * Apprentice Maya Migration Runner
 * Creates database tables for consciousness transfer training
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
  console.log('🧬 Starting Apprentice Maya migration...\n');

  // Load environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in environment variables');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  console.log('✓ Environment variables loaded');
  console.log(`  URL: ${supabaseUrl}`);
  console.log(`  Key: ${supabaseKey.substring(0, 20)}...\n`);

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('✓ Supabase client created\n');

  // Read migration file
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250102_apprentice_maya_training.sql');

  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    process.exit(1);
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
  console.log('✓ Migration file loaded');
  console.log(`  Path: ${migrationPath}`);
  console.log(`  Size: ${migrationSQL.length} characters\n`);

  // Split SQL into individual statements (Supabase doesn't support multi-statement queries via client)
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📋 Found ${statements.length} SQL statements to execute\n`);

  // Execute each statement
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];

    // Skip comments
    if (statement.startsWith('COMMENT')) {
      console.log(`⏭️  Skipping comment statement ${i + 1}/${statements.length}`);
      continue;
    }

    console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);

    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });

      if (error) {
        // Try direct query if RPC fails
        const result = await (supabase as any).from('_').select('*').limit(0);

        // If we can't use RPC, we need to use the SQL Editor in Supabase Dashboard
        console.log(`⚠️  Cannot execute via client. Please run migration manually in Supabase SQL Editor.`);
        console.log(`   Statement: ${statement.substring(0, 100)}...`);
        errorCount++;
      } else {
        console.log(`   ✓ Success`);
        successCount++;
      }
    } catch (err: any) {
      console.log(`   ⚠️  ${err.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary');
  console.log('='.repeat(60));
  console.log(`✓ Successful: ${successCount}`);
  console.log(`⚠️  Errors: ${errorCount}`);
  console.log(`📋 Total: ${statements.length}\n`);

  if (errorCount > 0) {
    console.log('⚠️  Some statements could not be executed via client.');
    console.log('📝 Manual action required:');
    console.log('   1. Go to Supabase Dashboard → SQL Editor');
    console.log('   2. Paste the migration file content');
    console.log('   3. Run the migration manually');
    console.log(`   4. File location: ${migrationPath}\n`);
  }

  // Test if tables exist
  console.log('🔍 Verifying table creation...\n');

  const tables = [
    'maya_training_corpus',
    'maya_training_metrics',
    'maya_wisdom_patterns'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`   ❌ Table "${table}" not accessible: ${error.message}`);
      } else {
        console.log(`   ✓ Table "${table}" exists and accessible`);
      }
    } catch (err: any) {
      console.log(`   ❌ Table "${table}" check failed: ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('🧬 Apprentice Maya Database Setup Complete');
  console.log('='.repeat(60));
  console.log('\nNext Steps:');
  console.log('1. If tables exist: Deploy the application');
  console.log('2. If errors occurred: Run migration manually in Supabase Dashboard');
  console.log('3. Visit /beta/monitor → Apprentice tab to verify');
  console.log('4. Have a conversation with Maya to capture first exchange\n');
}

// Run migration
runMigration().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
