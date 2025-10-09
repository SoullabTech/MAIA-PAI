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

async function checkDeletedUsers() {
  console.log('\n🔍 Checking for recently deleted users...\n');

  // Check if there's any audit log or deleted records
  // This depends on if RLS/audit is enabled

  // Check oracle_agents to see if there are user_ids that don't match any users
  const { data: agents, error: agentsError } = await supabase
    .from('oracle_agents')
    .select('*')
    .not('user_id', 'is', null);

  console.log('📊 Oracle Agents with user_ids:');
  if (agentsError) {
    console.error('Error:', agentsError);
  } else {
    console.log(`Found ${agents?.length || 0} agents`);
    agents?.forEach((a, i) => {
      console.log(`  ${i + 1}. User ID: ${a.user_id} - Name: ${a.name}`);
    });
  }

  // Check user_preferences
  const { data: prefs, error: prefsError } = await supabase
    .from('user_preferences')
    .select('*');

  console.log('\n📊 User Preferences (orphaned?):');
  if (prefsError) {
    console.error('Error:', prefsError);
  } else {
    console.log(`Found ${prefs?.length || 0} preference records`);
    prefs?.forEach((p, i) => {
      console.log(`  ${i + 1}. User ID: ${p.user_id}`);
    });
  }

  console.log('\n✅ Done!\n');
  console.log('⚠️  If there are orphaned records, those user_ids belonged to the deleted users');
}

checkDeletedUsers().catch(console.error);
