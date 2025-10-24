#!/usr/bin/env node

// Debug script to test conversation counter
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://jkbetmadzcpoinjogkli.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprYmV0bWFkemNwb2luam9na2xpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU2MjI0NSwiZXhwIjoyMDU4MTM4MjQ1fQ.QNvP9jEiSSfs_2-aFmtDt1xEMY_vwpU_ZT-CYRlgS98";

const TEST_USER = `debug_test_${Date.now()}`;
const API_URL = "http://localhost:3000/api/oracle/personal/consult";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function getConversationCount() {
  const { data } = await supabase
    .from('explorers')
    .select('conversation_count_this_month')
    .eq('explorer_id', TEST_USER)
    .single();

  return data?.conversation_count_this_month || 0;
}

async function makeRequest(attemptNum) {
  console.log(`\n📞 Attempt ${attemptNum}:`);

  // Check counter BEFORE request
  const countBefore = await getConversationCount();
  console.log(`   Counter BEFORE: ${countBefore}`);

  // Make API request
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: TEST_USER,
      input: `Test conversation ${attemptNum}`,
      sessionId: 'debug_session'
    })
  });

  const result = await response.json();

  // Wait a bit for DB to update
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check counter AFTER request
  const countAfter = await getConversationCount();
  console.log(`   Counter AFTER: ${countAfter}`);
  console.log(`   Status: ${response.status} ${result.success ? '✅' : '❌'}`);

  if (!result.success) {
    console.log(`   Message: ${result.message}`);
    console.log(`   Error: ${result.error}`);
  }

  return { success: result.success, countBefore, countAfter };
}

async function main() {
  console.log('🧪 Conversation Counter Debug Test');
  console.log('===================================');
  console.log(`Test User: ${TEST_USER}`);

  for (let i = 1; i <= 4; i++) {
    const result = await makeRequest(i);

    if (!result.success) {
      console.log(`\n🎯 BLOCKING WORKED! Request ${i} was blocked.`);
      break;
    }
  }

  console.log('\n✅ Test complete!');
}

main().catch(console.error);
