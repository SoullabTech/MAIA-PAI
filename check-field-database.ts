/**
 * Check Field Database Status
 * Verifies which Supabase database contains field vectors
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

async function checkDatabase() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  console.log('🜃 Checking Field Database Status\n');
  console.log(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);

  // Count total vectors
  const { count: totalCount, error: countError } = await supabase
    .from('field_vectors')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Error counting vectors:', countError);
    return;
  }

  console.log(`Total vectors in database: ${totalCount}\n`);

  if (totalCount === 0) {
    console.log('❌ Database is EMPTY!');
    console.log('   Run: npx tsx populate-field-expanded.ts');
    return;
  }

  // Show distribution
  const { data: vectors } = await supabase
    .from('field_vectors')
    .select('element, archetype, node_id')
    .limit(100);

  if (vectors) {
    const dist: Record<string, number> = {};
    for (const v of vectors) {
      const key = `${v.element}/${v.archetype}`;
      dist[key] = (dist[key] || 0) + 1;
    }

    console.log('✅ Database populated!');
    console.log('\nTop combinations:');
    Object.entries(dist)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([combo, count]) => {
        console.log(`  ${combo}: ${count}`);
      });
  }

  // Test vector search
  console.log('\n🔍 Testing vector search...');

  const testEmbedding = Array(1536).fill(0.1); // Simple test vector

  const { data: searchResults, error: searchError } = await supabase.rpc('match_field_vectors', {
    query_embedding: testEmbedding as any,
    match_threshold: 0.7,
    match_count: 5
  });

  if (searchError) {
    console.error('❌ Search error:', searchError);
  } else {
    console.log(`✅ Search returned ${searchResults?.length || 0} results`);
  }
}

checkDatabase().catch(console.error);
