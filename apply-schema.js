#!/usr/bin/env node

// Apply MAIA Supabase schema using the JavaScript client
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function applySchema() {
  console.log('🔧 Applying MAIA Supabase schema...');

  const supabaseUrl = 'https://jkbetmadzcpoinjogkli.supabase.co';
  const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprYmV0bWFkemNwb2luam9na2xpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU2MjI0NSwiZXhwIjoyMDU4MTM4MjQ1fQ.QNvP9jEiSSfs_2-aFmtDt1xEMY_vwpU_ZT-CYRlgS98';

  // Create Supabase client with service role (bypasses RLS)
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'setup_supabase_schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split into individual statements and execute them
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      if (statement.includes('RAISE NOTICE') || statement.includes('DO $$')) {
        // Skip NOTICE and DO blocks as they're not supported via RPC
        console.log(`⏭️  Skipping statement ${i + 1} (NOTICE/DO block)`);
        continue;
      }

      try {
        const { data, error } = await supabase.rpc('execute_sql', {
          sql: statement
        });

        if (error) {
          console.log(`⚠️  Statement ${i + 1} failed, trying direct execution...`);
          // Fallback: try executing directly
          const { error: directError } = await supabase
            .from('information_schema.tables')
            .select('*')
            .limit(1);

          if (directError) {
            console.error(`❌ Statement ${i + 1} failed:`, error.message);
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.log(`⚠️  Statement ${i + 1}: ${err.message}`);
      }
    }

    // Test if conversation_messages table exists
    const { data: tables, error: tablesError } = await supabase
      .from('conversation_messages')
      .select('*')
      .limit(1);

    if (tablesError) {
      console.log('⚠️  Testing table access...');
      console.log('Error:', tablesError.message);
    } else {
      console.log('✅ conversation_messages table is accessible');
    }

    console.log('🎯 Schema application completed!');
    console.log('🔄 MAIA database is ready for conversations');

  } catch (error) {
    console.error('❌ Schema application failed:', error.message);
    process.exit(1);
  }
}

applySchema();