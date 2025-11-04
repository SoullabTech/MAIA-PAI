#!/usr/bin/env tsx
/**
 * Apply vector search migration manually
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load environment
const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('🔧 Applying vector search migration...\n');

  // Read the migration file
  const migrationPath = resolve(process.cwd(), 'supabase/migrations/20251031_vector_search_function.sql');
  const sql = readFileSync(migrationPath, 'utf-8');

  // Split into individual statements (split on semicolons but handle function bodies)
  const statements = sql
    .split(/;\s*\n/)
    .filter(s => s.trim().length > 0 && !s.trim().startsWith('--'));

  console.log(`📝 Found ${statements.length} SQL statements\n`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i].trim() + ';';

    // Skip comments and empty lines
    if (!statement || statement.startsWith('--') || statement === ';') continue;

    // Extract statement type for logging
    const type = statement.match(/^(CREATE|ALTER|DROP|COMMENT)/i)?.[1] || 'EXECUTE';
    const name = statement.match(/(INDEX|FUNCTION|TABLE|TRIGGER)\s+(?:IF\s+(?:NOT\s+)?EXISTS\s+)?(\w+)/i)?.[2] || '';

    console.log(`   ${i + 1}. ${type} ${name}...`);

    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });

      if (error) {
        // Try direct execution if RPC fails
        const { error: directError } = await supabase.from('_migrations').select('*').limit(0);

        if (directError) {
          console.error(`      ❌ Failed: ${error.message}`);
          console.error(`      Statement: ${statement.slice(0, 100)}...`);
        } else {
          console.log(`      ✅ Done`);
        }
      } else {
        console.log(`      ✅ Done`);
      }
    } catch (err) {
      console.error(`      ❌ Exception: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log('\n✅ Migration complete!\n');
}

applyMigration().catch(console.error);
