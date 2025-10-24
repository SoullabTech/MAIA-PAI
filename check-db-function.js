#!/usr/bin/env node

// Check if database function exists
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://jkbetmadzcpoinjogkli.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprYmV0bWFkemNwb2luam9na2xpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU2MjI0NSwiZXhwIjoyMDU4MTM4MjQ1fQ.QNvP9jEiSSfs_2-aFmtDt1xEMY_vwpU_ZT-CYRlgS98";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('🔍 Checking database function...\n');

  // Try to call the function with a test user
  const TEST_USER = 'function_test_user';

  console.log('1. Creating test user...');
  const { error: insertError } = await supabase.from('explorers').insert({
    explorer_id: TEST_USER,
    subscription_status: 'free',
    subscription_tier: 'free',
    conversation_count_this_month: 0
  });

  if (insertError && !insertError.message.includes('duplicate')) {
    console.error('❌ Failed to create test user:', insertError);
    return;
  }
  console.log('✅ Test user created/exists\n');

  console.log('2. Calling increment_monthly_conversations function...');
  const { data, error } = await supabase.rpc('increment_monthly_conversations', {
    user_id: TEST_USER
  });

  if (error) {
    console.error('❌ Function call failed:');
    console.error('   Code:', error.code);
    console.error('   Message:', error.message);
    console.error('   Details:', error.details);
    console.error('   Hint:', error.hint);
    console.log('\n📋 This means the migration probably hasn\'t been run!');
    console.log('   Run: npx supabase db push');
  } else {
    console.log('✅ Function exists and works!\n');

    // Check the counter
    const { data: user } = await supabase
      .from('explorers')
      .select('conversation_count_this_month')
      .eq('explorer_id', TEST_USER)
      .single();

    console.log(`3. Counter value: ${user?.conversation_count_this_month || 0}`);
  }

  // Cleanup
  await supabase.from('explorers').delete().eq('explorer_id', TEST_USER);
}

main().catch(console.error);
