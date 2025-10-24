#!/usr/bin/env node

// Apply the subscription function migration
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = "https://jkbetmadzcpoinjogkli.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprYmV0bWFkemNwb2luam9na2xpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU2MjI0NSwiZXhwIjoyMDU4MTM4MjQ1fQ.QNvP9jEiSSfs_2-aFmtDt1xEMY_vwpU_ZT-CYRlgS98";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('🔧 Applying subscription function migration...\n');

  const sql = fs.readFileSync('fix-subscription-function.sql', 'utf8');

  // Split into individual statements
  const statements = sql
    .split(/;\s*$/gm)
    .filter(s => s.trim() && !s.trim().startsWith('--'))
    .map(s => s.trim() + ';');

  console.log(`📝 Found ${statements.length} SQL statements\n`);

  for (let i = 0; i < statements.length; i++) {
    console.log(`Executing statement ${i + 1}/${statements.length}...`);

    // Execute via RPC using a custom SQL function, or use the REST API
    // Supabase JS client doesn't support raw SQL, so we need to use fetch
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({ query: statements[i] })
    });

    if (!response.ok) {
      // This method might not work, let's try a different approach
      console.log('⚠️  Direct SQL execution not available via REST API');
      console.log('📋 Please apply the migration manually:');
      console.log('\n1. Go to Supabase Dashboard → SQL Editor');
      console.log('2. Run the contents of fix-subscription-function.sql\n');

      console.log('Or run this command in psql:');
      console.log(`psql $DATABASE_URL < fix-subscription-function.sql\n`);
      break;
    }
  }
}

main().catch(console.error);
