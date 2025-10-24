/**
 * Apply Birth Chart Migration to Supabase
 *
 * Adds birth chart fields to the explorers table so beta testers
 * can have persistent astrology data across devices and sessions.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function applyMigration() {
  console.log('🌟 Applying Birth Chart Migration to Supabase...\n');

  try {
    // Read the SQL migration file
    const migrationPath = join(process.cwd(), 'db', 'migrations', 'add-birth-chart-to-explorers.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📝 Migration SQL:');
    console.log(migrationSQL);
    console.log('\n');

    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📊 Executing ${statements.length} SQL statements...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`[${i + 1}/${statements.length}] Executing...`);

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });

        if (error) {
          // Some errors are OK (like "column already exists")
          if (error.message.includes('already exists')) {
            console.log(`✓ Already exists (skipping)\n`);
          } else {
            console.error(`❌ Error:`, error.message);
            console.log(`Failed statement: ${statement}\n`);
          }
        } else {
          console.log(`✓ Success\n`);
        }
      } catch (err: any) {
        console.error(`❌ Error:`, err.message);
        console.log(`Failed statement: ${statement}\n`);
      }
    }

    console.log('\n✨ Migration complete!');
    console.log('\nNext steps:');
    console.log('1. Beta testers can now enter their birth data');
    console.log('2. Birth charts will persist across devices and sessions');
    console.log('3. Charts are linked to their explorer account');
    console.log('4. Test by visiting /astrology and entering birth data\n');

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    console.log('\nAlternative: Run the SQL directly in Supabase Dashboard:');
    console.log('1. Go to your Supabase project');
    console.log('2. Click "SQL Editor"');
    console.log('3. Copy the contents of db/migrations/add-birth-chart-to-explorers.sql');
    console.log('4. Paste and run\n');
    process.exit(1);
  }
}

// Check for required env vars
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local\n');
  process.exit(1);
}

applyMigration()
  .then(() => {
    console.log('🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
