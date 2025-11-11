/**
 * Run Bardic Memory Migration
 *
 * Applies the bardic memory schema to Supabase database
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigration() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env');
    process.exit(1);
  }

  console.log('🔥 Connecting to Supabase...');
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('📖 Reading migration file...');
  const migrationPath = join(__dirname, '../supabase/migrations/20251107_bardic_memory_schema.sql');
  const sql = readFileSync(migrationPath, 'utf-8');

  console.log('⚡ Executing Bardic Memory migration...');

  try {
    // Note: Supabase client doesn't expose raw SQL execution in the same way
    // We need to use the REST API directly or run this via psql

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      throw new Error(`Migration failed: ${response.statusText}`);
    }

    console.log('✅ Bardic Memory schema created successfully!');
    console.log('\n📦 Tables created:');
    console.log('  - episodes (lived scenes with affect/place/elemental signatures)');
    console.log('  - episode_vectors (embeddings for similarity search)');
    console.log('  - episode_links (graph of resonance: echoes, contrasts, fulfills)');
    console.log('  - cues (sensory triggers: place, scent, music, ritual, threshold)');
    console.log('  - episode_cues (many-to-many with potency scores)');
    console.log('  - teloi (future-pull: what wants to become)');
    console.log('  - telos_alignment_log (tracking convergence over time)');
    console.log('  - microacts (tiny embodied practices)');
    console.log('  - microact_logs (practice tracking)');
    console.log('  - field_edges (graph-level continuity support)');
    console.log('\n🔮 Ready for Fire-Air time-intelligence!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n💡 Alternative: Run migration manually via Supabase dashboard');
    console.log('   1. Go to https://supabase.com/dashboard/project/jkbetmadzcpoinjogkli/sql');
    console.log('   2. Paste contents of: supabase/migrations/20251107_bardic_memory_schema.sql');
    console.log('   3. Click "Run"');
    process.exit(1);
  }
}

runMigration();
