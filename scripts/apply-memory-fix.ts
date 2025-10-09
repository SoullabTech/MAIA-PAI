#!/usr/bin/env node
/**
 * Apply Memory Events Table Fix
 * Recreates the memory_events table with correct schema
 */

import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function applyFix() {
  console.log('🔧 Applying memory_events table fix...\n');

  try {
    // First, check current table structure
    console.log('1. Checking current table structure...');
    const { data: currentData, error: currentError } = await supabase
      .from('memory_events')
      .select('*')
      .limit(1);

    if (!currentError) {
      console.log('   ✅ Table exists');
    } else {
      console.log('   ⚠️  Table issue:', currentError.message);
    }

    // Drop and recreate table
    console.log('\n2. Recreating table with correct schema...');

    const schema = `
      DROP TABLE IF EXISTS memory_events CASCADE;

      CREATE TABLE memory_events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id TEXT NOT NULL,
          session_id TEXT,
          memory_type TEXT NOT NULL,
          content TEXT,
          emotional_tone TEXT,
          significance_score DECIMAL(3,2),
          created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_memory_events_user_id ON memory_events(user_id);
      CREATE INDEX IF NOT EXISTS idx_memory_events_session_id ON memory_events(session_id);
      CREATE INDEX IF NOT EXISTS idx_memory_events_memory_type ON memory_events(memory_type);
      CREATE INDEX IF NOT EXISTS idx_memory_events_created_at ON memory_events(created_at DESC);
    `;

    // Execute via RPC or direct SQL
    const { error: rpcError } = await supabase.rpc('exec_sql', { sql: schema });

    if (rpcError) {
      console.log('   ⚠️  RPC not available, trying alternative method...');

      // Try using REST API directly
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ sql: schema })
      });

      if (!response.ok) {
        throw new Error('Could not execute SQL directly. You need to run the SQL manually in Supabase Studio.');
      }
    }

    console.log('   ✅ Table recreated successfully');

    // Verify the fix
    console.log('\n3. Verifying table structure...');
    const { error: verifyError } = await supabase
      .from('memory_events')
      .insert({
        user_id: 'test-verify',
        session_id: 'test-session',
        memory_type: 'test',
        content: 'Test memory',
        emotional_tone: 'neutral',
        significance_score: 0.5
      });

    if (verifyError) {
      console.error('   ❌ Verification failed:', verifyError.message);
      console.log('\n⚠️  Please apply the SQL manually in Supabase Studio:');
      console.log('   File: scripts/fix-memory-events-table.sql');
    } else {
      console.log('   ✅ Table structure verified - can insert data');

      // Clean up test data
      await supabase
        .from('memory_events')
        .delete()
        .eq('user_id', 'test-verify');

      console.log('\n✅ Fix applied successfully! Memory capture is now ready.');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Manual action required:');
    console.log('   1. Open Supabase Studio SQL Editor');
    console.log('   2. Run: scripts/fix-memory-events-table.sql');
    process.exit(1);
  }
}

applyFix();
