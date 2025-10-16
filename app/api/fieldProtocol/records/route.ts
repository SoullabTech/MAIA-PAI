import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { FieldRecord } from '@/types/fieldProtocol';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as Partial<FieldRecord>;

    // Add user ID to the record
    const recordWithUser = {
      ...body,
      meta: {
        ...body.meta,
        practitionerId: user.id
      }
    };

    // Insert the record
    const { data, error } = await supabase
      .from('field_protocol_records')
      .insert(recordWithUser)
      .select()
      .single();

    if (error) {
      console.error('Error creating field record:', error);
      return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const visibility = searchParams.get('visibility');
    const stage = searchParams.get('stage');
    const element = searchParams.get('element');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    let query = supabase
      .from('field_protocol_records')
      .select('*');

    // Filter by visibility
    if (visibility === 'mine') {
      query = query.eq('meta->practitionerId', user.id);
    } else if (visibility === 'commons') {
      query = query.or('meta->visibility.eq.commons,meta->visibility.eq.public');
    } else if (visibility === 'public') {
      query = query.eq('meta->visibility', 'public');
    }

    // Filter by stage
    if (stage) {
      query = query.eq('currentStage', stage);
    }

    // Filter by element (contains)
    if (element) {
      query = query.contains('elementalContext->dominant', [element]);
    }

    // Pagination
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    if (offset) {
      const offsetNum = parseInt(offset);
      const limitNum = limit ? parseInt(limit) : 10;
      query = query.range(offsetNum, offsetNum + limitNum - 1);
    }

    // Order by timestamp
    query = query.order('timestamp', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching field records:', error);
      return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Record ID required' }, { status: 400 });
    }

    // Update the record (only if user owns it)
    const { data, error } = await supabase
      .from('field_protocol_records')
      .update(updates)
      .eq('id', id)
      .eq('meta->practitionerId', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating field record:', error);
      return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Record not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}