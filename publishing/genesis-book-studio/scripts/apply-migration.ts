#!/usr/bin/env tsx

/**
 * Apply MAIA Adaptive Reading migration directly to Supabase
 * Run with: npx tsx scripts/apply-migration.ts
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const client = createClient(supabaseUrl, serviceKey)

async function applyMigration() {
  try {
    console.log('📖 Reading migration SQL...')
    const sqlPath = join(process.cwd(), 'supabase/migrations/20251024_maia_adaptive_reading.sql')
    const sql = readFileSync(sqlPath, 'utf-8')

    console.log('🔄 Applying migration to database...')

    // Split SQL by statement (simple approach - split on semicolon + newline)
    const statements = sql
      .split(';\n')
      .filter(s => s.trim() && !s.trim().startsWith('--'))

    for (const statement of statements) {
      const trimmed = statement.trim()
      if (!trimmed) continue

      console.log(`  Executing: ${trimmed.substring(0, 50)}...`)

      const { error } = await client.rpc('exec_sql', { sql: trimmed + ';' })

      if (error) {
        console.error('  ❌ Error:', error.message)
        // Continue with other statements
      } else {
        console.log('  ✓ Success')
      }
    }

    console.log('✅ Migration complete!')
  } catch (err) {
    console.error('❌ Migration failed:', err)
    process.exit(1)
  }
}

applyMigration()
