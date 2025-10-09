import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    console.log('🔧 Creating relational_memory table...');

    // Create the table using raw SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS relational_memory (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID,

          total_memories INTEGER DEFAULT 0,
          key_moments INTEGER DEFAULT 0,
          emotional_tags INTEGER DEFAULT 0,
          pattern_recognition TEXT DEFAULT 'Inactive',

          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_relational_memory_user_id
        ON relational_memory(user_id);
      `
    });

    if (error) {
      console.error('Error creating table:', error);

      // Try alternative: create via insert (will fail but shows us the issue)
      const { error: testError } = await supabase
        .from('relational_memory')
        .select('*')
        .limit(1);

      if (testError && testError.message.includes('does not exist')) {
        return NextResponse.json({
          success: false,
          message: 'Table does not exist and cannot be created via API',
          suggestion: 'Run: npx supabase migration new add_relational_memory',
          error: error.message
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'relational_memory table created successfully',
      data
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET to check status
export async function GET() {
  const { data: relData, error: relError } = await supabase
    .from('relational_memory')
    .select('*')
    .limit(1);

  return NextResponse.json({
    exists: !relError,
    error: relError?.message,
    ready: !relError
  });
}
