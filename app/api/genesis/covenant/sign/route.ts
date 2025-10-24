/**
 * POST /api/genesis/covenant/sign
 * Handles covenant signature submissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nodeName, practice, signature, date, timestamp, covenantVersion } = body;

    // Validate required fields
    if (!nodeName || !signature || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: nodeName, signature, date' },
        { status: 400 }
      );
    }

    // Store in Supabase
    const { data, error } = await supabase
      .from('genesis_covenants')
      .insert({
        node_name: nodeName,
        practice,
        signature,
        signed_date: date,
        covenant_version: covenantVersion || '1.0',
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('[GENESIS] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save covenant signature', details: error.message },
        { status: 500 }
      );
    }

    console.log('[GENESIS] Covenant signed:', {
      id: data.id,
      nodeName,
      practice,
      timestamp
    });

    return NextResponse.json({
      success: true,
      message: 'Covenant signed successfully',
      covenantId: data.id,
      nodeName,
      signedDate: date
    });

  } catch (error: any) {
    console.error('[GENESIS] Covenant signature failed:', error);
    return NextResponse.json(
      { error: 'Failed to record covenant signature', details: error?.message },
      { status: 500 }
    );
  }
}
