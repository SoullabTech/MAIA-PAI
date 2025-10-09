#!/usr/bin/env node
/**
 * Check the ACTUAL schema of memory_events in Supabase
 */

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkSchema() {
  console.log('🔍 Checking actual memory_events schema in Supabase...\n');

  try {
    // Try to insert a test record with all fields
    const testData = {
      user_id: 'schema-test-' + Date.now(),
      session_id: 'test-session',
      memory_type: 'test',
      content: 'Test content',
      emotional_tone: 'neutral',
      significance_score: 0.5
    };

    console.log('Attempting to insert test record with fields:', Object.keys(testData));

    const { data, error } = await supabase
      .from('memory_events')
      .insert(testData)
      .select();

    if (error) {
      console.error('\n❌ Insert failed:');
      console.error('   Code:', error.code);
      console.error('   Message:', error.message);
      console.error('   Details:', error.details);
      console.error('   Hint:', error.hint);

      if (error.code === 'PGRST204') {
        console.log('\n⚠️  Schema cache issue detected!');
        console.log('   Missing columns in PostgREST cache');
        console.log('\n📋 REQUIRED ACTION:');
        console.log('   1. Go to Supabase Dashboard > SQL Editor');
        console.log('   2. Run the following SQL:');
        console.log('\n--- COPY THIS SQL ---');
        console.log(`
ALTER TABLE memory_events ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE memory_events ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Refresh the PostgREST schema cache
NOTIFY pgrst, 'reload schema';
        `);
        console.log('--- END SQL ---\n');
      }
    } else {
      console.log('✅ Insert successful!');
      console.log('   Record:', data);

      // Clean up
      await supabase
        .from('memory_events')
        .delete()
        .eq('user_id', testData.user_id);

      console.log('\n✅ Schema is correct and working!');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

checkSchema();
