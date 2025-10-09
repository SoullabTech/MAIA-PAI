#!/usr/bin/env tsx
/**
 * Diagnose Memory Capture System
 * Tests direct Supabase connection and insert
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔍 MEMORY CAPTURE DIAGNOSTICS\n');
console.log('Environment Check:');
console.log('- SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('- SUPABASE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
  console.log('\n1️⃣ Testing table existence...');

  const { data: tableCheck, error: tableError } = await supabase
    .from('memory_events')
    .select('*')
    .limit(1);

  if (tableError) {
    console.error('❌ Table check failed:', tableError.message);
    console.error('   Details:', tableError);
    return;
  }
  console.log('✅ Table exists');

  console.log('\n2️⃣ Testing direct insert...');

  const testMemory = {
    user_id: 'diagnostic-test-' + Date.now(),
    session_id: 'session-diagnostic',
    memory_type: 'key_moment',
    content: 'Diagnostic test memory',
    emotional_tone: 'neutral',
    significance_score: 0.5,
    created_at: new Date().toISOString()
  };

  console.log('Inserting:', testMemory);

  const { data: insertData, error: insertError } = await supabase
    .from('memory_events')
    .insert([testMemory])
    .select();

  if (insertError) {
    console.error('❌ Insert failed:', insertError.message);
    console.error('   Code:', insertError.code);
    console.error('   Details:', insertError.details);
    console.error('   Hint:', insertError.hint);

    // Check RLS policies
    console.log('\n3️⃣ Checking RLS policies...');
    const { data: policies, error: policyError } = await supabase
      .rpc('pg_policies')
      .eq('tablename', 'memory_events');

    if (!policyError) {
      console.log('RLS Policies:', policies);
    }
  } else {
    console.log('✅ Insert successful!');
    console.log('   Inserted data:', insertData);
  }

  console.log('\n4️⃣ Counting total memories...');
  const { count, error: countError } = await supabase
    .from('memory_events')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Count failed:', countError.message);
  } else {
    console.log(`✅ Total memories in database: ${count}`);
  }

  console.log('\n5️⃣ Testing SimpleMemoryCapture service...');

  // Dynamic import to use the actual service
  const { simpleMemoryCapture } = await import('../lib/services/simple-memory-capture');

  await simpleMemoryCapture.capture({
    userId: 'service-test-' + Date.now(),
    sessionId: 'session-service',
    userInput: 'I feel scared and anxious about the future',
    mayaResponse: 'Your fear is valid',
    emotionalTone: 'water',
    isKeyMoment: true,
    isTransformative: false
  });

  console.log('\n6️⃣ Final count check...');
  const { count: finalCount } = await supabase
    .from('memory_events')
    .select('*', { count: 'exact', head: true });

  console.log(`Final memory count: ${finalCount}`);

  if (finalCount && finalCount > 0) {
    console.log('\n✅ SUCCESS: Memory system is working!');
  } else {
    console.log('\n❌ FAILURE: Memories are not being saved');
  }
}

diagnose().catch(console.error);
