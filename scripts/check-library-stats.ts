#!/usr/bin/env tsx
/**
 * Check Library of Alexandria Statistics
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment
const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStats() {
  console.log('🔮 LIBRARY OF ALEXANDRIA - Current Stats\n');

  // Total chunks
  const { count: totalChunks } = await supabase
    .from('file_chunks')
    .select('*', { count: 'exact', head: true });

  console.log(`📚 Total Chunks: ${totalChunks || 0}`);

  // Chunks with embeddings
  const { count: withEmbeddings } = await supabase
    .from('file_chunks')
    .select('*', { count: 'exact', head: true })
    .not('embedding', 'is', null);

  console.log(`🧠 With Embeddings: ${withEmbeddings || 0}`);

  // By category
  const { data: categories } = await supabase
    .from('file_chunks')
    .select('category')
    .not('category', 'is', null);

  if (categories) {
    const categoryCounts = categories.reduce((acc: any, row: any) => {
      acc[row.category] = (acc[row.category] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📂 By Category:');
    Object.entries(categoryCounts)
      .sort((a: any, b: any) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count}`);
      });
  }

  // Sample files
  const { data: sampleFiles } = await supabase
    .from('file_chunks')
    .select('file_name')
    .limit(10);

  if (sampleFiles && sampleFiles.length > 0) {
    console.log('\n📄 Sample Files:');
    const uniqueFiles = [...new Set(sampleFiles.map((f: any) => f.file_name))];
    uniqueFiles.slice(0, 5).forEach(name => {
      console.log(`   - ${name}`);
    });
    if (uniqueFiles.length > 5) {
      console.log(`   ... and ${uniqueFiles.length - 5} more`);
    }
  }

  console.log('\n✨ The Library grows! ✨\n');
}

checkStats().catch(console.error);
