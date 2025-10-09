require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function performanceCheck() {
  console.log('📊 Performance Check\n');

  const { data, error } = await supabase.rpc('execute_sql', {
    sql: `
      SELECT
        COUNT(*) as total_messages,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT session_id) as total_sessions,
        ROUND(AVG(char_length(content))) as avg_message_length,
        MAX(created_at) as most_recent,
        MIN(created_at) as oldest
      FROM maia_messages
    `
  }).single();

  if (error) {
    // Fallback: use regular query
    const { data: messages } = await supabase
      .from('maia_messages')
      .select('*');

    if (messages) {
      console.log('✅ Performance Metrics:');
      console.log(`   Total Messages: ${messages.length}`);
      console.log(`   Unique Users: ${new Set(messages.map(m => m.user_id)).size}`);
      console.log(`   Total Sessions: ${new Set(messages.map(m => m.session_id)).size}`);
      console.log(`   Avg Message Length: ${Math.round(messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length)} chars`);
      console.log(`   Most Recent: ${messages[0]?.created_at || 'N/A'}`);
    }
    return;
  }

  console.log('✅ Performance Metrics:');
  console.log(`   Total Messages: ${data.total_messages}`);
  console.log(`   Unique Users: ${data.unique_users}`);
  console.log(`   Total Sessions: ${data.total_sessions}`);
  console.log(`   Avg Message Length: ${data.avg_message_length} chars`);
  console.log(`   Date Range: ${data.oldest} to ${data.most_recent}`);
}

performanceCheck().then(() => process.exit(0));
