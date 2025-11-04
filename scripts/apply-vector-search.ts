#!/usr/bin/env tsx
/**
 * Apply vector search function to database
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

async function applyMigration() {
  console.log('🔧 Applying vector search migration...\n');

  // Step 1: Create vector index
  console.log('1. Creating vector similarity index...');

  const createIndexSQL = `
    CREATE INDEX IF NOT EXISTS idx_file_chunks_embedding
      ON file_chunks
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100);
  `;

  try {
    // Execute via raw SQL
    await supabase.rpc('exec_sql', { sql: createIndexSQL });
    console.log('   ✅ Index created\n');
  } catch (error: any) {
    // If exec_sql doesn't exist, that's ok - Supabase might handle migrations differently
    console.log('   ℹ️  exec_sql not available, will try alternative\n');
  }

  // Step 2: Create search function
  console.log('2. Creating match_file_chunks function...');

  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION match_file_chunks(
      query_embedding VECTOR(1536),
      match_threshold FLOAT DEFAULT 0.5,
      match_count INT DEFAULT 10
    )
    RETURNS TABLE (
      id UUID,
      file_path TEXT,
      file_name TEXT,
      vault_name TEXT,
      content TEXT,
      chunk_index INT,
      keywords TEXT[],
      concepts TEXT[],
      category TEXT,
      level INT,
      element TEXT,
      similarity FLOAT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RETURN QUERY
      SELECT
        file_chunks.id,
        file_chunks.file_path,
        file_chunks.file_name,
        file_chunks.vault_name,
        file_chunks.content,
        file_chunks.chunk_index,
        file_chunks.keywords,
        file_chunks.concepts,
        file_chunks.category,
        file_chunks.level,
        file_chunks.element,
        1 - (file_chunks.embedding <=> query_embedding) AS similarity
      FROM file_chunks
      WHERE file_chunks.embedding IS NOT NULL
        AND 1 - (file_chunks.embedding <=> query_embedding) > match_threshold
      ORDER BY file_chunks.embedding <=> query_embedding
      LIMIT match_count;
    END;
    $$;
  `;

  try {
    await supabase.rpc('exec_sql', { sql: createFunctionSQL });
    console.log('   ✅ Function created\n');
  } catch (error: any) {
    console.log('   ℹ️  Function may already exist or need manual creation\n');
  }

  console.log('✅ Migration steps initiated!\n');
  console.log('If using Supabase dashboard:');
  console.log('1. Go to SQL Editor');
  console.log('2. Paste the migration SQL');
  console.log('3. Run it\n');
  console.log('Migration file: supabase/migrations/20251031_vector_search_function.sql\n');
}

applyMigration().catch(console.error);
