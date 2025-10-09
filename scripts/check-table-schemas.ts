import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableSchemas() {
  console.log('\n🔍 Checking Exact Table Schemas...\n');

  // Try to insert a test record to see what fields are required/allowed
  const testId = `test_schema_check_${Date.now()}`;

  // Check beta_users
  console.log('📊 Testing beta_users table:');
  const { error: betaError } = await supabase
    .from('beta_users')
    .insert({
      id: testId,
      email: 'test@test.com',
      passcode: 'TEST',  // This field might not exist
    });

  if (betaError) {
    console.log('❌ Error with passcode field:', betaError.message);

    // Try without passcode
    const { error: beta2Error } = await supabase
      .from('beta_users')
      .insert({
        id: testId + '_2',
        email: 'test@test.com',
      });

    if (beta2Error) {
      console.log('❌ Error without passcode:', beta2Error.message);
    } else {
      console.log('✅ Insert works without passcode field');
      // Clean up
      await supabase.from('beta_users').delete().eq('id', testId + '_2');
    }
  } else {
    console.log('✅ Insert works with passcode field');
    // Clean up
    await supabase.from('beta_users').delete().eq('id', testId);
  }

  // Check oracle_agents
  console.log('\n📊 Testing oracle_agents table:');
  const { error: agentError } = await supabase
    .from('oracle_agents')
    .insert({
      user_id: testId,
      name: 'Test Agent',
      archetype: 'test',
      personality_config: { test: true },
      updated_at: new Date().toISOString()
    });

  if (agentError) {
    console.log('❌ Error:', agentError.message);
  } else {
    console.log('✅ Insert works');
    await supabase.from('oracle_agents').delete().eq('user_id', testId);
  }

  // Check user_preferences
  console.log('\n📊 Testing user_preferences table:');
  const { error: prefError } = await supabase
    .from('user_preferences')
    .insert({
      user_id: testId,
      tone: 70,
      style: 'auto',
      theme: 'dark',
      voice_enabled: true,
      voice_speed: 0.95,
      show_thinking: true,
      auto_play_voice: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

  if (prefError) {
    console.log('❌ Error:', prefError.message);
  } else {
    console.log('✅ Insert works');
    await supabase.from('user_preferences').delete().eq('user_id', testId);
  }

  // Check explorers
  console.log('\n📊 Testing explorers table:');
  const { error: expError } = await supabase
    .from('explorers')
    .insert({
      explorer_id: testId,
      explorer_name: 'Test Explorer',
      email: 'test@test.com',
      status: 'active',
      signup_date: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

  if (expError) {
    console.log('❌ Error:', expError.message);
  } else {
    console.log('✅ Insert works');
    await supabase.from('explorers').delete().eq('explorer_id', testId);
  }

  console.log('\n✅ Done!\n');
}

checkTableSchemas().catch(console.error);
