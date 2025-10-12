import { NextRequest, NextResponse } from 'next/server';
import { extractConversationEssence, ConversationMessage } from '@/lib/services/conversationEssenceExtractor';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { messages, userId, conversationId, sessionId } = await req.json();

    console.log('📝 [API] save-conversation called', {
      messageCount: messages?.length,
      userId,
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

    if (!userId) {
      console.error('❌ [API] Missing userId');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Extract the essence using MAIA
    console.log('🔮 [API] Extracting conversation essence...');
    const essence = await extractConversationEssence(messages, {
      conversationId,
      userId,
      focusOnBreakthroughs: true
    });
    console.log('✅ [API] Essence extracted:', {
      title: essence.title,
      hasInsight: !!essence.coreInsight
    });

    // Store in the journal_entries table
    console.log('💾 [API] Saving to Supabase journal_entries...');
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        entry: essence.synthesizedEntry,
        reflection: {
          title: essence.title,
          coreInsight: essence.coreInsight,
          spiralMovement: essence.spiralMovement,
          userVoiceExcerpts: essence.userVoiceExcerpts,
          breakthroughMoment: essence.breakthroughMoment,
          elementalSignature: essence.elementalSignature
        },
        mode: 'conversation', // New mode for conversation-based entries
        element: determineElement(essence.elementalSignature),
        session_id: sessionId,
        conversation_id: conversationId
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [API] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save journal entry', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ [API] Journal entry saved successfully:', data.id);
    return NextResponse.json({
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
