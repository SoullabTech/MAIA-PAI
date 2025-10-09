// Quick Memory Integration Check - Run before Monday launch
// This verifies OracleConversation → Memory Service → Supabase flow

import { createClient } from '@supabase/supabase-js';
import { saveConversationMemory, getOracleAgentId } from '@/lib/services/memoryService';

async function quickMemoryCheck() {
  console.log('\n🧪 MAIA Memory Integration Check\n');
  console.log('════════════════════════════════════════\n');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Step 1: Check if tables exist
  console.log('1️⃣  Checking Supabase tables...');
  try {
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    const { data: agents, error: agentError } = await supabase
      .from('oracle_agents')
      .select('id')
      .limit(1);

    const { data: memories, error: memoryError } = await supabase
      .from('memories')
      .select('id')
      .limit(1);

    if (userError || agentError || memoryError) {
      console.error('❌ Database tables missing:', { userError, agentError, memoryError });
      return false;
    }

    console.log('   ✅ All tables exist\n');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }

  // Step 2: Check recent onboarded users
  console.log('2️⃣  Checking for onboarded users...');
  const { data: recentUsers } = await supabase
    .from('users')
    .select('id, sacred_name, beta_onboarded_at')
    .not('beta_onboarded_at', 'is', null)
    .order('beta_onboarded_at', { ascending: false })
    .limit(5);

  if (!recentUsers || recentUsers.length === 0) {
    console.log('   ⚠️  No onboarded users yet (expected for pre-launch)\n');
  } else {
    console.log(`   ✅ Found ${recentUsers.length} onboarded users:`);
    recentUsers.forEach(u => {
      console.log(`      - ${u.sacred_name} (${u.id.slice(0, 8)}...)`);
    });
    console.log('');
  }

  // Step 3: Check oracle agents
  console.log('3️⃣  Checking oracle agents...');
  const { data: oracleAgents } = await supabase
    .from('oracle_agents')
    .select('id, name, user_id, conversations_count, wisdom_level')
    .limit(5);

  if (!oracleAgents || oracleAgents.length === 0) {
    console.log('   ⚠️  No oracle agents created yet\n');
  } else {
    console.log(`   ✅ Found ${oracleAgents.length} oracle agents:`);
    oracleAgents.forEach(a => {
      console.log(`      - ${a.name} (${a.conversations_count} conversations, wisdom: ${a.wisdom_level})`);
    });
    console.log('');
  }

  // Step 4: Test memory save (if we have an agent)
  if (oracleAgents && oracleAgents.length > 0) {
    console.log('4️⃣  Testing memory save...');
    const testAgent = oracleAgents[0];

    try {
      const testMemory = {
        oracleAgentId: testAgent.id,
        content: `[INTEGRATION TEST] User: "Testing memory system" | MAIA: "All systems functional"`,
        memoryType: 'conversation' as const,
        sourceType: 'text' as const,
        wisdomThemes: ['integration-test'],
        emotionalTone: 'technical',
        sessionId: `test-session-${Date.now()}`
      };

      const result = await saveConversationMemory(testMemory);

      if (result.success) {
        console.log(`   ✅ Memory saved successfully! (ID: ${result.memory?.id?.slice(0, 8)}...)\n`);
      } else {
        console.error('   ❌ Memory save failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('   ❌ Memory save error:', error);
      return false;
    }
  }

  // Step 5: Check memory count
  console.log('5️⃣  Checking stored memories...');
  const { data: memoryCount } = await supabase
    .from('memories')
    .select('id', { count: 'exact', head: true });

  const count = (memoryCount as any)?.count || 0;
  console.log(`   📊 Total memories in database: ${count}`);

  if (count > 0) {
    const { data: recentMemories } = await supabase
      .from('memories')
      .select('created_at, memory_type, source_type, wisdom_themes')
      .order('created_at', { ascending: false })
      .limit(3);

    console.log('   📝 Recent memories:');
    recentMemories?.forEach(m => {
      const time = new Date(m.created_at).toLocaleTimeString();
      console.log(`      - ${time} | ${m.memory_type} (${m.source_type}) | Themes: ${m.wisdom_themes?.join(', ') || 'none'}`);
    });
  }

  console.log('\n');

  // Final verdict
  console.log('╔══════════════════════════════════════╗');
  console.log('║   MEMORY SYSTEM STATUS REPORT        ║');
  console.log('╠══════════════════════════════════════╣');
  console.log('║ ✅ Database tables: READY            ║');
  console.log(`║ ${recentUsers && recentUsers.length > 0 ? '✅' : '⚠️'}  Users onboarded: ${recentUsers?.length || 0} users      ║`);
  console.log(`║ ${oracleAgents && oracleAgents.length > 0 ? '✅' : '⚠️'}  Oracle agents: ${oracleAgents?.length || 0} agents       ║`);
  console.log(`║ ${count > 0 ? '✅' : '⚠️'}  Memories saved: ${count} entries       ║`);
  console.log('╚══════════════════════════════════════╝\n');

  console.log('🚀 Integration check complete!\n');
  return true;
}

// Run the check
quickMemoryCheck()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Check failed:', error);
    process.exit(1);
  });