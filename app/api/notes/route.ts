import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { text, source, speaker, conversation_id, message_id, element, tags, metadata } = body;

    // Auto-detect element if not provided
    let detectedElement = element;
    if (!element && text) {
      const { data: elementData } = await supabase.rpc('detect_element', { note_text: text });
      detectedElement = elementData;
    }

    // Create the note
    const { data, error } = await supabase
      .from('user_notes')
      .insert({
        user_id: user.id,
        text,
        source,
        speaker,
        conversation_id,
        message_id,
        element: detectedElement,
        tags,
        metadata
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating note:', error);
      return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
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
    const conversation_id = searchParams.get('conversation_id');
    const element = searchParams.get('element');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    let query = supabase
      .from('user_notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (conversation_id) {
      query = query.eq('conversation_id', conversation_id);
    }

    if (element) {
      query = query.eq('element', element);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    if (offset) {
      const offsetNum = parseInt(offset);
      const limitNum = limit ? parseInt(limit) : 10;
      query = query.range(offsetNum, offsetNum + limitNum - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notes:', error);
      return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}