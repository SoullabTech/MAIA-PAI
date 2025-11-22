#!/usr/bin/env node

// Check current MAIA Supabase schema
const { createClient } = require('@supabase/supabase-js');

async function checkSchema() {
  console.log('🔍 Checking current MAIA Supabase schema...');

  const supabaseUrl = 'https://jkbetmadzcpoinjogkli.supabase.co';
  const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprYmV0bWFkemNwb2luam9na2xpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU2MjI0NSwiZXhwIjoyMDU4MTM4MjQ1fQ.QNvP9jEiSSfs_2-aFmtDt1xEMY_vwpU_ZT-CYRlgS98';

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Check conversation_messages table
    console.log('📋 Checking conversation_messages table...');
    const { data: messages, error: messagesError } = await supabase
      .from('conversation_messages')
      .select('*')
      .limit(5);

    if (messagesError) {
      console.log('❌ conversation_messages error:', messagesError.message);
    } else {
      console.log('✅ conversation_messages table exists with', messages.length, 'rows');
    }

    // Check users table
    console.log('👥 Checking users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);

    if (usersError) {
      console.log('❌ users error:', usersError.message);
    } else {
      console.log('✅ users table exists with', users.length, 'rows');
    }

    // Check oracle_agents table
    console.log('🔮 Checking oracle_agents table...');
    const { data: agents, error: agentsError } = await supabase
      .from('oracle_agents')
      .select('*')
      .limit(5);

    if (agentsError) {
      console.log('❌ oracle_agents error:', agentsError.message);
    } else {
      console.log('✅ oracle_agents table exists with', agents.length, 'rows');
    }

    // Check memories table
    console.log('💭 Checking memories table...');
    const { data: memories, error: memoriesError } = await supabase
      .from('memories')
      .select('*')
      .limit(5);

    if (memoriesError) {
      console.log('❌ memories error:', memoriesError.message);
    } else {
      console.log('✅ memories table exists with', memories.length, 'rows');
    }

    // Test insert into conversation_messages to check RLS
    console.log('🧪 Testing conversation_messages insert...');
    const { data: insertData, error: insertError } = await supabase
      .from('conversation_messages')
      .insert({
        session_id: 'test-session-' + Date.now(),
        user_id: 'test-user',
        role: 'user',
        content: 'Test message from schema check',
        timestamp: new Date().toISOString(),
        metadata: { test: true }
      })
      .select()
      .single();

    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message);
    } else {
      console.log('✅ Insert test successful:', insertData.id);

      // Clean up test message
      await supabase
        .from('conversation_messages')
        .delete()
        .eq('id', insertData.id);
      console.log('🧹 Test message cleaned up');
    }

  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
  }

  console.log('🎯 Schema check completed!');
}

checkSchema();