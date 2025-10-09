#!/usr/bin/env tsx
/**
 * Setup semantic_memories table in Supabase
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupTable() {
  console.log('🔧 Setting up semantic_memories table...\n');

  const sql = `
    -- Simple semantic_memories table
    CREATE TABLE IF NOT EXISTS public.semantic_memories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata JSONB DEFAULT '{}'::jsonb,
      memory_type TEXT DEFAULT 'episodic',
      importance FLOAT DEFAULT 0.5,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      accessed_at TIMESTAMPTZ DEFAULT NOW(),
      access_count INTEGER DEFAULT 0
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_semantic_memories_user_id ON public.semantic_memories(user_id);
    CREATE INDEX IF NOT EXISTS idx_semantic_memories_created_at ON public.semantic_memories(created_at DESC);

    -- RLS
    ALTER TABLE public.semantic_memories ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if any
    DROP POLICY IF EXISTS "Enable all for authenticated and anon users" ON public.semantic_memories;

    -- Create policy
    CREATE POLICY "Enable all for authenticated and anon users"
      ON public.semantic_memories
      FOR ALL
      USING (true)
      WITH CHECK (true);

    -- Permissions
    GRANT ALL ON public.semantic_memories TO authenticated;
    GRANT ALL ON public.semantic_memories TO anon;
  `;

  try {
    // Execute SQL via RPC or direct query
    console.log('Executing SQL...');

    // Try direct execution (this works with service role key)
    const { error } = await supabase.rpc('exec_sql', { sql_string: sql }).single();

    if (error) {
      // Fallback: Try creating via insert (will fail if table exists, which is OK)
      console.log('Creating table via fallback method...');

      // Just test if we can query the table
      const { error: testError } = await supabase
        .from('semantic_memories')
        .select('id')
        .limit(1);

      if (testError && testError.message.includes('does not exist')) {
        console.error('\n❌ Table creation failed. Please run the SQL manually:');
        console.error('\n1. Go to your Supabase dashboard');
        console.error('2. Navigate to SQL Editor');
        console.error('3. Copy and paste the contents of:');
        console.error('   scripts/create-semantic-memories-simple.sql');
        console.error('4. Run the query\n');
        process.exit(1);
      } else {
        console.log('✅ Table already exists or is accessible');
      }
    } else {
      console.log('✅ Table created successfully');
    }

    // Verify table exists
    console.log('\nVerifying table...');
    const { data, error: verifyError } = await supabase
      .from('semantic_memories')
      .select('id')
      .limit(1);

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError.message);
      console.error('\nPlease create the table manually using:');
      console.error('scripts/create-semantic-memories-simple.sql\n');
      process.exit(1);
    }

    console.log('✅ Table verified and accessible\n');
    console.log('🚀 semantic_memories setup complete!\n');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.error('\nPlease create the table manually:');
    console.error('1. Open Supabase Dashboard → SQL Editor');
    console.error('2. Run scripts/create-semantic-memories-simple.sql\n');
    process.exit(1);
  }
}

setupTable();
