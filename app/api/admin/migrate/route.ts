/**
 * Database Migration Endpoint
 *
 * Runs the usage tracking schema migration
 * ADMIN ONLY - Should be protected in production
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Read the migration SQL file
    const migrationPath = path.join(process.cwd(), 'prisma/migrations/add_usage_tracking.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('🔄 [MIGRATION] Running usage tracking schema migration...');

    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && s.length > 0);

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      try {
        // Execute each statement
        const { data, error } = await supabase.rpc('exec_sql', {
          query: statement
        });

        if (error) {
          console.error(`❌ [MIGRATION] Error in statement ${i + 1}:`, error);
          results.push({
            statement: i + 1,
            success: false,
            error: error.message,
            sql: statement.substring(0, 100) + '...'
          });
          errorCount++;
        } else {
          console.log(`✅ [MIGRATION] Statement ${i + 1} executed successfully`);
          results.push({
            statement: i + 1,
            success: true
          });
          successCount++;
        }
      } catch (err) {
        console.error(`❌ [MIGRATION] Exception in statement ${i + 1}:`, err);
        results.push({
          statement: i + 1,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          sql: statement.substring(0, 100) + '...'
        });
        errorCount++;
      }
    }

    console.log(`✅ [MIGRATION] Complete: ${successCount} successful, ${errorCount} errors`);

    return NextResponse.json({
      success: errorCount === 0,
      message: `Migration complete: ${successCount} statements executed, ${errorCount} errors`,
      results,
      totalStatements: statements.length,
      successCount,
      errorCount
    });

  } catch (error) {
    console.error('❌ [MIGRATION] Error running migration:', error);
    return NextResponse.json(
      {
        error: 'Failed to run migration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/admin/migrate',
    description: 'Runs database migrations for usage tracking',
    method: 'POST',
    warning: 'ADMIN ONLY - Modifies database schema'
  });
}
