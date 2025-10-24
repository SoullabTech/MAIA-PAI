/**
 * Apply Field Migration
 * Creates the match_akashic_insights RPC function directly
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const migration = `
-- Create RPC function for semantic search of Akashic insights
CREATE OR REPLACE FUNCTION match_akashic_insights(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  content text,
  element text,
  archetype text,
  similarity float,
  metadata jsonb,
  created_at timestamptz,
  user_id uuid
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    insight_history.id,
    insight_history.content,
    insight_history.element,
    insight_history.archetype,
    1 - (insight_history.embedding <=> query_embedding) AS similarity,
    insight_history.metadata,
    insight_history.created_at,
    insight_history.user_id
  FROM insight_history
  WHERE 1 - (insight_history.embedding <=> query_embedding) > match_threshold
  ORDER BY insight_history.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION match_akashic_insights TO authenticated, anon;
`;

async function applyMigration() {
  console.log('🜃 Applying field migration...');

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: migration });

    if (error) {
      console.error('❌ Migration failed:', error);

      // Try direct execution via REST API
      console.log('\n🔄 Trying direct SQL execution...');
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ query: migration })
      });

      if (!response.ok) {
        console.error('❌ Direct execution also failed');
        console.log('\n📝 Please run this SQL manually in Supabase SQL Editor:');
        console.log(migration);
      } else {
        console.log('✅ Migration applied successfully!');
      }
    } else {
      console.log('✅ Migration applied successfully!', data);
    }

    // Test the function
    console.log('\n🧪 Testing match_akashic_insights function...');
    const testEmbedding = new Array(1536).fill(0).map(() => Math.random());

    const { data: testResults, error: testError } = await supabase
      .rpc('match_akashic_insights', {
        query_embedding: testEmbedding,
        match_threshold: 0.5,
        match_count: 5
      });

    if (testError) {
      console.error('❌ Function test failed:', testError);
    } else {
      console.log(`✅ Function works! Found ${testResults?.length || 0} insights`);
    }

  } catch (err) {
    console.error('❌ Error:', err);
    console.log('\n📝 Please run this SQL manually in Supabase SQL Editor:');
    console.log(migration);
  }
}

applyMigration();
