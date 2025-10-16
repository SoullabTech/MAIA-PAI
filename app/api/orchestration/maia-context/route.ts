/**
 * MAIA Context API - Field-Aware Conversation Management
 *
 * Provides MAIA with context from Field Records to create
 * deeply personalized and insightful conversation starters
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fieldRecordsService } from '@/lib/field-protocol/FieldRecordsService';
import { unifiedMemory } from '@/lib/memory/UnifiedMemoryInterface';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * GET /api/orchestration/maia-context
 * Get MAIA conversation context including Field Records
 */
export async function GET(request: NextRequest) {
  try {
    // Get auth token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user session
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Get Field Records context
    const fieldContext = await fieldRecordsService.getFieldRecordContext(user.id);

    // Get memory context from Unified Memory
    const memories = await unifiedMemory.retrieveRelevantMemories('', user.id);

    // Get potential conversation starter
    const conversationStarter = await unifiedMemory.getFieldAwareConversationStarter(user.id);

    // Combine all context for MAIA
    const maiaContext = {
      // Field Records Data
      fieldRecords: {
        recent: fieldContext.recentRecords.slice(0, 3), // Last 3 records
        unresolvedQuestions: fieldContext.unresolvedQuestions,
        dominantElements: fieldContext.dominantElements,
        activePhase: fieldContext.activePhase,
        emergingPatterns: fieldContext.emergingPatterns,
        readyForIntegration: fieldContext.readyForIntegration
      },

      // Memory Data
      memory: {
        recentExchanges: memories.immediate,
        insights: memories.insights,
        patterns: memories.patterns
      },

      // Suggested Conversation Approaches
      conversationOptions: {
        fieldAwareStarter: conversationStarter,
        alternativeStarters: fieldContext.suggestedOpeners,

        // Context-aware prompts based on current state
        contextualPrompts: generateContextualPrompts(
          fieldContext.dominantElements[0],
          fieldContext.activePhase,
          fieldContext.unresolvedQuestions.length > 0
        )
      },

      // User's Current State Assessment
      userState: {
        engagementLevel: calculateEngagementLevel(fieldContext.recentRecords),
        emotionalTone: detectEmotionalTone(fieldContext.recentRecords),
        readinessForDepth: assessReadinessForDepth(fieldContext)
      }
    };

    return NextResponse.json(maiaContext);
  } catch (error) {
    console.error('Error getting MAIA context:', error);
    return NextResponse.json(
      { error: 'Failed to get MAIA context' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orchestration/maia-context/log
 * Log MAIA's use of Field Records in conversation
 */
export async function POST(request: NextRequest) {
  try {
    // Get auth token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user session
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const {
      recordId,
      referenceType,
      context,
      userResponse
    } = body;

    // Log the reference in the database
    const { error } = await supabase
      .from('maia_field_references')
      .insert({
        userId: user.id,
        recordId,
        referenceType, // 'opener', 'insight', 'question', 'pattern'
        context,
        userResponse,
        timestamp: new Date().toISOString()
      });

    if (error) throw error;

    // Update the Field Record's AI processing metadata
    if (recordId) {
      const { data: record } = await supabase
        .from('field_records')
        .select('aiProcessing')
        .eq('id', recordId)
        .single();

      if (record) {
        const updatedProcessing = {
          ...record.aiProcessing,
          maiaReferences: [
            ...(record.aiProcessing?.maiaReferences || []),
            {
              timestamp: new Date().toISOString(),
              type: referenceType,
              context
            }
          ]
        };

        await supabase
          .from('field_records')
          .update({ aiProcessing: updatedProcessing })
          .eq('id', recordId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging MAIA reference:', error);
    return NextResponse.json(
      { error: 'Failed to log reference' },
      { status: 500 }
    );
  }
}

/**
 * Generate contextual prompts based on user's current state
 */
function generateContextualPrompts(
  dominantElement: any,
  activePhase: any,
  hasQuestions: boolean
): string[] {
  const prompts: string[] = [];

  // Element-based prompts
  const elementPrompts: Record<string, string> = {
    fire: "What creative force is asking to be expressed through you right now?",
    water: "What emotions are flowing beneath the surface of your awareness?",
    earth: "What foundations are you building or strengthening in your life?",
    air: "What new perspectives are emerging in your understanding?",
    ether: "What spaciousness or void are you being called to embrace?"
  };

  if (dominantElement && elementPrompts[dominantElement]) {
    prompts.push(elementPrompts[dominantElement]);
  }

  // Phase-based prompts
  const phasePrompts: Record<string, string> = {
    creation: "What vision is taking form within you?",
    preservation: "What needs to be sustained and nurtured right now?",
    dissolution: "What are you ready to release or transform?",
    void: "What is emerging from the silence and stillness?",
    emergence: "What new self is being born through this process?"
  };

  if (activePhase && phasePrompts[activePhase]) {
    prompts.push(phasePrompts[activePhase]);
  }

  // Question-based prompt
  if (hasQuestions) {
    prompts.push("I sense you're holding some important questions. Would you like to explore them together?");
  }

  return prompts;
}

/**
 * Calculate user's engagement level based on Field Records
 */
function calculateEngagementLevel(records: any[]): 'high' | 'medium' | 'low' {
  if (!records.length) return 'low';

  const recentRecords = records.filter(r => {
    const daysSince = (Date.now() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= 3;
  });

  if (recentRecords.length >= 3) return 'high';
  if (recentRecords.length >= 1) return 'medium';
  return 'low';
}

/**
 * Detect emotional tone from recent Field Records
 */
function detectEmotionalTone(records: any[]): string {
  if (!records.length) return 'neutral';

  // Look for emotional data in recent records
  const emotions = records
    .filter(r => r.observation?.sensoryData?.emotional)
    .map(r => r.observation.sensoryData.emotional);

  if (emotions.length === 0) return 'neutral';

  // Simple keyword analysis (would be more sophisticated in production)
  const emotionalKeywords = {
    expansive: ['joy', 'excitement', 'wonder', 'awe', 'love'],
    contractive: ['fear', 'anxiety', 'sadness', 'grief', 'anger'],
    transformative: ['confusion', 'uncertainty', 'curiosity', 'change']
  };

  // Count keyword matches
  let expansiveCount = 0;
  let contractiveCount = 0;
  let transformativeCount = 0;

  emotions.forEach(emotion => {
    const lowerEmotion = emotion.toLowerCase();

    emotionalKeywords.expansive.forEach(keyword => {
      if (lowerEmotion.includes(keyword)) expansiveCount++;
    });

    emotionalKeywords.contractive.forEach(keyword => {
      if (lowerEmotion.includes(keyword)) contractiveCount++;
    });

    emotionalKeywords.transformative.forEach(keyword => {
      if (lowerEmotion.includes(keyword)) transformativeCount++;
    });
  });

  // Determine dominant tone
  const maxCount = Math.max(expansiveCount, contractiveCount, transformativeCount);

  if (maxCount === 0) return 'neutral';
  if (expansiveCount === maxCount) return 'expansive';
  if (contractiveCount === maxCount) return 'contractive';
  return 'transformative';
}

/**
 * Assess user's readiness for deep exploration
 */
function assessReadinessForDepth(fieldContext: any): boolean {
  // User is ready for depth if they have:
  // 1. Completed integration stage in recent records
  // 2. Have unresolved questions
  // 3. Have identified patterns

  const hasIntegration = fieldContext.recentRecords.some(
    (r: any) => r.completionStage >= 3
  );

  const hasQuestions = fieldContext.unresolvedQuestions.length > 0;
  const hasPatterns = fieldContext.emergingPatterns.length > 0;

  return hasIntegration && (hasQuestions || hasPatterns);
}