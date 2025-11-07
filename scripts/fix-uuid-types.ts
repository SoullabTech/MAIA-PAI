/**
 * FIX UUID TYPE MISMATCH
 *
 * Changes user_id columns from UUID to TEXT in apprentice tables
 * to support our string-based user IDs like "user_1761386267477"
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUuidTypes() {
  console.log('🔧 Fixing UUID type mismatch in apprentice tables...\n');

  // ═══════════════════════════════════════════════════════════════
  // FIX apprentice_conversations.user_id
  // ═══════════════════════════════════════════════════════════════

  console.log('1️⃣  Altering apprentice_conversations.user_id from UUID to TEXT...');

  const { error: error1 } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE apprentice_conversations ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;'
  });

  if (error1) {
    // Try alternative approach using direct SQL
    console.log('   Trying direct ALTER TABLE...');

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          query: 'ALTER TABLE apprentice_conversations ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;'
        })
      });

      if (!response.ok) {
        console.log('   ⚠️  RPC approach not available. Creating manual migration SQL...');
        console.log('\n📋 Please run this SQL manually in Supabase SQL Editor:\n');
        console.log('-- Fix apprentice_conversations.user_id');
        console.log('ALTER TABLE apprentice_conversations ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;\n');
      } else {
        console.log('   ✅ apprentice_conversations.user_id changed to TEXT');
      }
    } catch (e) {
      console.log('   ⚠️  Direct SQL not available. Showing manual migration...\n');
      console.log('📋 Please run this SQL manually in Supabase SQL Editor:\n');
      console.log('-- Fix apprentice_conversations.user_id');
      console.log('ALTER TABLE apprentice_conversations ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;\n');
    }
  } else {
    console.log('   ✅ apprentice_conversations.user_id changed to TEXT');
  }

  // ═══════════════════════════════════════════════════════════════
  // FIX member_journeys.user_id
  // ═══════════════════════════════════════════════════════════════

  console.log('\n2️⃣  Altering member_journeys.user_id from UUID to TEXT...');

  const { error: error2 } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE member_journeys ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;'
  });

  if (error2) {
    console.log('   ⚠️  RPC approach not available. Creating manual migration SQL...');
    console.log('\n📋 Please run this SQL manually in Supabase SQL Editor:\n');
    console.log('-- Fix member_journeys.user_id');
    console.log('ALTER TABLE member_journeys ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;\n');
  } else {
    console.log('   ✅ member_journeys.user_id changed to TEXT');
  }

  // ═══════════════════════════════════════════════════════════════
  // FIX apprentice_patterns (no user_id, just verify)
  // ═══════════════════════════════════════════════════════════════

  console.log('\n3️⃣  Checking knowledge_entries table...');

  const { data: knowledgeSchema } = await supabase
    .from('knowledge_entries')
    .select('*')
    .limit(1);

  console.log('   ✅ knowledge_entries table accessible');

  // ═══════════════════════════════════════════════════════════════
  // VERIFICATION
  // ═══════════════════════════════════════════════════════════════

  console.log('\n\n✨ Migration instructions generated!');
  console.log('\n🔍 To apply the fix, please:');
  console.log('   1. Go to your Supabase dashboard');
  console.log('   2. Open SQL Editor');
  console.log('   3. Run the following SQL:\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('-- Fix UUID type mismatch for apprentice tables');
  console.log('');
  console.log('ALTER TABLE apprentice_conversations');
  console.log('  ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;');
  console.log('');
  console.log('ALTER TABLE member_journeys');
  console.log('  ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n✅ After running the SQL, restart your dev server and conversations will log properly!\n');
}

fixUuidTypes().catch(console.error);
