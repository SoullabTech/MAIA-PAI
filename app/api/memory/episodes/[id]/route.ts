/**
 * GET /api/memory/episodes/[id] - Get episode by ID
 * PATCH /api/memory/episodes/[id] - Update episode
 * DELETE /api/memory/episodes/[id] - Delete episode
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClientComponentClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const supabase = createClientComponentClient();
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ episode: data });
  } catch (error) {
    console.error('[API /memory/episodes/[id]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch episode' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId, ...updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const supabase = createClientComponentClient();
    const { data, error } = await supabase
      .from('episodes')
      .update(updates)
      .eq('id', params.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('[API /memory/episodes/[id]] Error updating:', error);
      return NextResponse.json(
        { error: 'Failed to update episode' },
        { status: 500 }
      );
    }

    return NextResponse.json({ episode: data });
  } catch (error) {
    console.error('[API /memory/episodes/[id]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update episode' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const supabase = createClientComponentClient();
    const { error } = await supabase
      .from('episodes')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId);

    if (error) {
      console.error('[API /memory/episodes/[id]] Error deleting:', error);
      return NextResponse.json(
        { error: 'Failed to delete episode' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API /memory/episodes/[id]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete episode' },
      { status: 500 }
    );
  }
}
