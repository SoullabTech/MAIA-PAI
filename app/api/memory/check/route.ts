import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const checks: any = {};

    // Check relational_memory table
    const { data: relData, error: relError } = await supabase
      .from('relational_memory')
      .select('*')
      .limit(1);

    checks.relational_memory = {
      exists: !relError,
      error: relError?.message,
      count: relData?.length || 0
    };

    // Check memory_events table
    const { data: memData, error: memError } = await supabase
      .from('memory_events')
      .select('*')
      .limit(1);

    checks.memory_events = {
      exists: !memError,
      error: memError?.message,
      count: memData?.length || 0
    };

    // Get total counts if tables exist
    if (!relError) {
      const { count } = await supabase
        .from('relational_memory')
        .select('*', { count: 'exact', head: true });
      checks.relational_memory.totalCount = count;
    }

    if (!memError) {
      const { count } = await supabase
        .from('memory_events')
        .select('*', { count: 'exact', head: true });
      checks.memory_events.totalCount = count;
    }

    const allExist = checks.relational_memory.exists && checks.memory_events.exists;

    return NextResponse.json({
      success: true,
      ready: allExist,
      message: allExist
        ? '✅ All memory tables exist and are ready'
        : '❌ Some memory tables are missing',
      tables: checks
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
