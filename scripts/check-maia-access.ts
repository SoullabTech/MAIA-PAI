import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMaiaAccess() {
  console.log('\n🔍 Checking who has accessed Maia...\n');

  // Check sanctuary_sessions table (sessions with Maia)
  const { data: sessions, error: sessionsError } = await supabase
    .from('sanctuary_sessions')
    .select('*')
    .order('created_at', { ascending: false });

  console.log('📊 Sanctuary Sessions:');
  if (sessionsError) {
    console.error('Error:', sessionsError);
  } else {
    console.log(`Found ${sessions?.length || 0} sessions`);
    const uniqueUsers = new Set(sessions?.map(s => s.user_id) || []);
    console.log(`Unique users with sessions: ${uniqueUsers.size}`);
    sessions?.slice(0, 10).forEach((s, i) => {
      console.log(`  ${i + 1}. User: ${s.user_id} - Created: ${s.created_at} - Protected: ${s.protection_active}`);
    });
  }

  // Check oracle_agents table (Maia instances)
  const { data: agents, error: agentsError } = await supabase
    .from('oracle_agents')
    .select('*');

  console.log('\n📊 Oracle Agents (Maia instances):');
  if (agentsError) {
    console.error('Error:', agentsError);
  } else {
    console.log(`Found ${agents?.length || 0} Maia instances`);
    agents?.forEach((a, i) => {
      console.log(`  ${i + 1}. User: ${a.user_id} - Name: ${a.name} - Active: ${a.is_active}`);
    });
  }

  // Check users with any login activity
  const { data: activeUsers, error: activeError } = await supabase
    .from('users')
    .select('*')
    .not('last_login', 'is', null);

  console.log('\n📊 Users with login activity:');
  if (activeError) {
    console.error('Error:', activeError);
  } else {
    console.log(`Found ${activeUsers?.length || 0} users who have logged in`);
    activeUsers?.forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.name} (${u.email}) - Last login: ${u.last_login}`);
    });
  }

  console.log('\n✅ Done!\n');
}

checkMaiaAccess().catch(console.error);
