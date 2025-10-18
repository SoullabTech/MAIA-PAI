import { NextRequest, NextResponse } from 'next/server';
import { extractConversationEssence, ConversationMessage } from '@/lib/services/conversationEssenceExtractor';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Get auth token from header
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('❌ [API] Missing or invalid Authorization header');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify the session and get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('❌ [API] Invalid auth token:', authError);
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const authenticatedUserId = user.id;

    const { messages, conversationId, sessionId } = await req.json();

    console.log('📝 [API] save-conversation called', {
      messageCount: messages?.length,
      authenticatedUserId,
      conversationId: conversationId?.substring(0, 10) + '...',
      sessionId: sessionId?.substring(0, 10) + '...'
    });

    if (!messages || !Array.isArray(messages)) {
      console.error('❌ [API] Missing or invalid messages array');
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Extract the essence using MAIA
    console.log('🔮 [API] Extracting conversation essence...');
    const essence = await extractConversationEssence(messages, {
      conversationId,
      userId: authenticatedUserId,
      focusOnBreakthroughs: true
    });
    console.log('✅ [API] Essence extracted:', {
      title: essence.title,
      hasInsight: !!essence.coreInsight
    });

    // Store in the journal_entries table
    // Schema uses: user_id (not oracle_agent_id)
    console.log('💾 [API] Saving to Supabase journal_entries...');

    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: authenticatedUserId,  // ✅ Using authenticated user ID from token
        title: essence.title || 'Conversation Reflection',
        content: essence.synthesizedEntry,
        entry_type: 'reflection',
        elemental_focus: determineElement(essence.elementalSignature),
        ritual_practice: 'conversation',
        is_private: true
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [journal.save] insert failed', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        userId,
        hasContent: !!essence.synthesizedEntry,
      });
      return NextResponse.json(
        { ok: false, error: error.message, details: error.details },
        { status: 400 }
      );
    }

    console.log('✅ [journal.save] Entry saved successfully:', data.id);
    return NextResponse.json({
      ok: true,
      success: true,
      entry: data,
      essence
    });
  } catch (error: any) {
    console.error('Error in save-conversation endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Determine dominant element from signature
 */
function determineElement(signature: { fire?: number; water?: number; earth?: number; air?: number }): string {
  const elements = [
    { name: 'fire', value: signature.fire || 0 },
    { name: 'water', value: signature.water || 0 },
    { name: 'earth', value: signature.earth || 0 },
    { name: 'air', value: signature.air || 0 }
  ];

  elements.sort((a, b) => b.value - a.value);
  return elements[0].name;
}
