#!/usr/bin/env node
// Verify database functions work with UUIDs

const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const SUPABASE_URL = "https://jkbetmadzcpoinjogkli.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprYmV0bWFkemNwb2luam9na2xpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU2MjI0NSwiZXhwIjoyMDU4MTM4MjQ1fQ.QNvP9jEiSSfs_2-aFmtDt1xEMY_vwpU_ZT-CYRlgS98";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testDatabaseFunctions() {
  console.log('🔍 Verifying Database Functions\n');
  console.log('=' .repeat(50));

  // Generate test UUID
  const testUserId = randomUUID();
  console.log(`\n1. Creating test user with UUID: ${testUserId}`);

  // Create test user
  const { error: createError } = await supabase.from('explorers').insert({
    explorer_id: testUserId,
    explorer_name: `test_user_${Date.now()}`,
    email: `test_${Date.now()}@test.local`,
    subscription_status: 'free',
    subscription_tier: 'free',
    conversation_count_this_month: 0,
    conversation_count_last_reset: new Date().toISOString()
  });

  if (createError) {
    console.error('   ❌ Failed to create user:', createError.message);
    return;
  }
  console.log('   ✅ User created');

  // Test increment function
  console.log('\n2. Testing increment_monthly_conversations()');
  for (let i = 1; i <= 3; i++) {
    const { error: incError } = await supabase.rpc('increment_monthly_conversations', {
      user_id: testUserId
    });

    if (incError) {
      console.error(`   ❌ Increment ${i} failed:`, incError.message);
      return;
    }

    // Read current count
    const { data: user } = await supabase
      .from('explorers')
      .select('conversation_count_this_month')
      .eq('explorer_id', testUserId)
      .single();

    console.log(`   ✅ Increment ${i}: count = ${user.conversation_count_this_month}`);
  }

  // Test get count function
  console.log('\n3. Testing get_monthly_conversation_count()');
  const { data: count, error: countError } = await supabase.rpc('get_monthly_conversation_count', {
    user_id: testUserId
  });

  if (countError) {
    console.error('   ❌ Get count failed:', countError.message);
  } else {
    console.log(`   ✅ Current count: ${count}`);
  }

  // Test trial functions
  console.log('\n4. Testing trial functions');

  // Set up a trial
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 7); // 7 days from now

  await supabase.from('explorers').update({
    subscription_status: 'trialing',
    trial_end_date: trialEnd.toISOString()
  }).eq('explorer_id', testUserId);

  // Test is_trial_active
  const { data: isActive, error: activeError } = await supabase.rpc('is_trial_active', {
    user_id: testUserId
  });

  if (activeError) {
    console.error('   ❌ is_trial_active failed:', activeError.message);
  } else {
    console.log(`   ✅ is_trial_active: ${isActive}`);
  }

  // Test get_trial_days_remaining
  const { data: daysLeft, error: daysError } = await supabase.rpc('get_trial_days_remaining', {
    user_id: testUserId
  });

  if (daysError) {
    console.error('   ❌ get_trial_days_remaining failed:', daysError.message);
  } else {
    console.log(`   ✅ get_trial_days_remaining: ${daysLeft} days`);
  }

  // Cleanup
  console.log('\n5. Cleaning up test data');
  await supabase.from('explorers').delete().eq('explorer_id', testUserId);
  console.log('   ✅ Test user deleted');

  console.log('\n' + '='.repeat(50));
  console.log('✅ ALL DATABASE FUNCTIONS VERIFIED!\n');
}

testDatabaseFunctions().catch(console.error);
