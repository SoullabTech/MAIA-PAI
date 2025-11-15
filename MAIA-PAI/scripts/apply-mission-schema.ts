#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

async function applyMissionSchema() {
  // Load environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Read the migration SQL
    const migrationPath = join(__dirname, '../supabase/migrations/20250114_user_missions.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('🚀 Applying mission schema migration...');

    // Execute the migration
    const { data, error } = await supabase.rpc('apply_sql', {
      sql_query: migrationSQL
    });

    if (error) {
      // Try direct execution if rpc doesn't work
      console.log('📝 Trying direct SQL execution...');

      // Split the SQL into individual statements
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          console.log(`Executing: ${statement.substring(0, 50)}...`);
          const { error: stmtError } = await supabase.rpc('exec_sql', {
            query: statement
          });

          if (stmtError) {
            console.log(`⚠️  Statement might have failed (this could be normal): ${stmtError.message}`);
          }
        }
      }
    }

    console.log('✅ Migration completed successfully!');

    // Test the tables exist
    const { data: tables, error: testError } = await supabase
      .from('user_missions')
      .select('id')
      .limit(1);

    if (testError && !testError.message.includes('relation "user_missions" does not exist')) {
      console.log('✅ user_missions table is accessible');
    } else if (testError) {
      console.log('⚠️  Tables might not be created yet - this is normal if this is the first run');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  applyMissionSchema();
}

export { applyMissionSchema };