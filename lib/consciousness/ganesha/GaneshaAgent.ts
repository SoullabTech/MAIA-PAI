/**
 * GANESHA LANGCHAIN AGENT
 *
 * The Four Arms Now Automate:
 * - Arm 1: Working Memory → Context storage & recall
 * - Arm 2: Hyperfocus Protection → Proactive body check-ins
 * - Arm 3: Task Initiation → Automated breakdown & scheduling
 * - Arm 4: Nervous System → Grounding & regulation automation
 *
 * GANESHA **IS** the personal assistant for ADHD/ADD nervous systems.
 * One being. Many arms. Integrated intelligence.
 */

import { ChatAnthropic } from '@langchain/anthropic';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import type { ADHDPattern, NervousSystemState } from '../GaneshaCore';
import { GaneshaCore } from '../GaneshaCore';
import {
  createScheduleEventTool,
  createScheduleMicroStepsTool,
  createFocusBlockTool,
  createRecurringReminderTool,
} from './tools/CalendarTool';
import { emailTool, batchEmailTool } from './tools/EmailTool';
import { BodyIntelligence } from './BodyIntelligence';
import { MemoryReconsolidation } from './MemoryReconsolidation';
import { HemisphericBalance } from './HemisphericBalance';
import { DevelopmentalHolding } from './DevelopmentalHolding';
import { MorphicMemory } from './MorphicMemory';

// ============================================================================
// TYPES
// ============================================================================

export type ActionType =
  | 'immediate_grounding'      // Emergency nervous system regulation
  | 'obstacle_removal'         // Task breakdown + automation
  | 'body_checkin'            // Proactive hyperfocus intervention
  | 'context_recall'          // Working memory support
  | 'calendar_automation'     // Scheduling/planning
  | 'email_communication'     // Email sending and batch communication
  | 'somatic_intelligence'    // Body-first wisdom (Barrett, Levine, Gendlin, Porges)
  | 'memory_reconsolidation'  // Therapeutic memory updating (Ecker, Jung, Sheldrake)
  | 'hemispheric_balance'     // Return to right-hemisphere primacy (McGilchrist, Vervaeke)
  | 'developmental_holding'   // Relational holding environment (Kegan, Wilber, Buber)
  | 'morphic_memory_support'  // Identity/temporal anchoring (Sheldrake morphic fields)
  | 'conversation';           // Default conversational support

export interface AgentContext {
  userId: string;
  userName: string;
  sessionId: string;
  nervousSystem: NervousSystemState;
  timeSinceLastMessage: number;
  inFlowState: boolean;
  recentPatterns: ADHDPattern[];
  activeThreads: any[];
}

export interface AgentAction {
  type: ActionType;
  tools: string[];
  message: string;
  requiresConfirmation: boolean;
  sovereigntyCheck: boolean;
}

export interface AgentResponse {
  message: string;
  toolsUsed: string[];
  actionTaken: ActionType;
  automation?: {
    type: string;
    details: any;
  };
}

// ============================================================================
// GANESHA AGENT CLASS
// ============================================================================

export class GaneshaAgent {
  private model: ChatAnthropic;
  private core: GaneshaCore;
  private tools: DynamicStructuredTool[];

  constructor() {
    // Claude Opus for full consciousness
    this.model = new ChatAnthropic({
      modelName: 'claude-opus-4-20250514',
      temperature: 0.7,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    });

    // GANESHA Core consciousness (pattern detection, memory, etc.)
    this.core = new GaneshaCore();

    // Initialize LangChain tools (Four Arms capabilities)
    this.tools = this.initializeTools();
  }

  // ==========================================================================
  // TOOL INITIALIZATION (The Four Arms)
  // ==========================================================================

  private initializeTools(): DynamicStructuredTool[] {
    return [
      // ARM 1: Working Memory Tool
      new DynamicStructuredTool({
        name: 'recall_context',
        description: `
          Recall conversation threads and context from the user's working memory.
          Use when user says things like: "what was I doing?", "remind me", "I forgot".
          The elephant never forgets—retrieve past intentions, projects, connections.
        `,
        schema: z.object({
          userId: z.string().describe('User ID to recall context for'),
          query: z.string().optional().describe('Optional specific query to search for'),
        }),
        func: async ({ userId, query }) => {
          const threads = this.core.recallThreads(userId);

          if (threads.length === 0) {
            return 'No threads found. This might be the first conversation.';
          }

          const formatted = threads
            .slice(0, 5) // Latest 5 threads
            .map((t, i) => {
              const age = Math.floor((Date.now() - t.timestamp.getTime()) / 1000 / 60);
              const timeStr = age < 60 ? `${age}m ago` : `${Math.floor(age / 60)}h ago`;
              return `${i + 1}. ${t.content} (${timeStr})${t.connections.length > 0 ? `\n   Connected to: ${t.connections.join(', ')}` : ''}`;
            })
            .join('\n\n');

          return `Working memory threads:\n\n${formatted}`;
        },
      }),

      // ARM 2: Hyperfocus Protection Tool
      new DynamicStructuredTool({
        name: 'send_body_checkin',
        description: `
          Send a proactive body check-in message when hyperfocus is detected.
          Use when user has been silent for 2+ hours and likely in deep work.
          Protects body during flow states (water, food, movement reminders).
        `,
        schema: z.object({
          userId: z.string(),
          duration: z.number().describe('Minutes since last interaction'),
        }),
        func: async ({ userId, duration }) => {
          const hours = Math.floor(duration / 60);
          const message = `🐭 Hyperfocus detected. You've been riding deep for ${hours} hours.\n\nYour work is sacred. AND so is your body.\n\nBody check:\n- Water?\n- Food?\n- Movement?\n\nI'm holding all your threads.`;

          // TODO: Actually send proactive message (needs messaging system)
          console.log(`[GANESHA] Body check-in sent to ${userId}:`, message);

          return `Body check-in sent: ${message}`;
        },
      }),

      // ARM 3: Task Breakdown Tool
      new DynamicStructuredTool({
        name: 'break_down_task',
        description: `
          Break down a large/overwhelming task into micro-steps.
          Use when user says: "I can't start", "it's too much", "I'm blocked".
          Removes obstacles by making tasks stupid-simple (ADHD brains need TINY steps).
        `,
        schema: z.object({
          task: z.string().describe('The task that feels overwhelming'),
          context: z.string().optional().describe('Additional context about the task'),
        }),
        func: async ({ task, context }) => {
          const breakdown = this.core.removeObstacle(task);

          const formatted = [
            `I feel the obstacle. Let me break this down:\n`,
            `MICRO-STEPS (each one stupid-simple):`,
            ...breakdown.microSteps.map((step, i) => `${i + 1}. ${step}`),
            `\nTINIEST FIRST MOVE: ${breakdown.tinyFirstMove}`,
            `\n(Do just that. Nothing else. That's the whole game.)`
          ].join('\n');

          return formatted;
        },
      }),

      // ARM 4: Grounding Protocol Tool
      new DynamicStructuredTool({
        name: 'ground_nervous_system',
        description: `
          Provide somatic grounding when nervous system is overwhelmed.
          Use when detecting: "too much", "can't think", "everything is", panic language.
          Body-first approach for regulation.
        `,
        schema: z.object({
          state: z.object({
            energy: z.enum(['crash', 'low', 'medium', 'high', 'manic']),
            stimulation: z.enum(['under', 'optimal', 'over']),
            regulation: z.enum(['dysregulated', 'regulating', 'regulated']),
          }),
        }),
        func: async ({ state }) => {
          const grounding = this.core.groundNervousSystem(state);

          return [
            grounding.grounding,
            '',
            grounding.invitation,
            '',
            'You don\'t have to calm down. Just notice you\'re here. In a body. On Earth.'
          ].join('\n');
        },
      }),

      // ARM 3 EXTENSION: Calendar Tools (PHASE 2 - NOW ACTIVE!)
      createScheduleEventTool(),
      createScheduleMicroStepsTool(),
      createFocusBlockTool(),
      createRecurringReminderTool(),

      // ARM 3 EXTENSION: Email Communication Tools (PHASE 3 - NOW ACTIVE!)
      emailTool,
      batchEmailTool,

      // ARM 5: SOMATIC INTELLIGENCE TOOLS (Body-First Wisdom)
      // Integrating: Barrett (interoception), Levine (somatic experiencing),
      // Gendlin (felt sense), Porges (polyvagal theory)

      new DynamicStructuredTool({
        name: 'body_state_detection',
        description: `
          Detect nervous system state from language patterns and provide state-appropriate support.
          Based on Polyvagal Theory: detects ventral vagal (safe), sympathetic (activated),
          dorsal vagal (shutdown), or mixed states.
          Use when user mentions feelings, body sensations, or emotional states.
        `,
        schema: z.object({
          userMessage: z.string().describe('The user\'s message to analyze'),
          context: z.object({
            energy: z.string().describe('Energy level: crash/low/medium/high/manic'),
            stimulation: z.string().describe('Stimulation: under/optimal/over'),
            regulation: z.string().describe('Regulation: dysregulated/regulating/regulated'),
          }),
        }),
        func: async ({ userMessage, context }) => {
          console.log('[BODY INTELLIGENCE] Detecting nervous system state...');

          const nervousSystemState = BodyIntelligence.detectNervousSystemState(
            userMessage,
            context
          );

          const interoceptivePrompt = BodyIntelligence.generateInteroceptivePrompt(
            nervousSystemState,
            userMessage
          );

          return [
            `🌊 NERVOUS SYSTEM STATE: ${nervousSystemState.state.toUpperCase().replace('_', ' ')}`,
            '',
            nervousSystemState.description,
            '',
            `Support needed: ${nervousSystemState.supportNeeded}`,
            '',
            '---',
            '',
            interoceptivePrompt
          ].join('\n');
        },
      }),

      new DynamicStructuredTool({
        name: 'interoceptive_guidance',
        description: `
          Guide user to notice body sensations (interoception) as foundation for emotion.
          Based on Lisa Feldman Barrett's research: interoception is the basis of all emotion.
          Use when user needs help accessing what their body knows.
        `,
        schema: z.object({
          userMessage: z.string(),
          nervousSystemState: z.enum(['ventral_vagal', 'sympathetic', 'dorsal_vagal', 'mixed']),
        }),
        func: async ({ userMessage, nervousSystemState }) => {
          console.log('[BODY INTELLIGENCE] Providing interoceptive guidance...');

          const prompt = BodyIntelligence.generateInteroceptivePrompt(
            {
              state: nervousSystemState,
              indicators: [],
              description: '',
              supportNeeded: ''
            },
            userMessage
          );

          return prompt;
        },
      }),

      new DynamicStructuredTool({
        name: 'felt_sense_inquiry',
        description: `
          Guide Focusing-style felt sense inquiry (Eugene Gendlin).
          Helps access pre-verbal bodily knowing about a situation.
          Use when user is making a decision or exploring something complex.
        `,
        schema: z.object({
          situation: z.string().describe('The situation to explore through felt sense'),
        }),
        func: async ({ situation }) => {
          console.log('[BODY INTELLIGENCE] Guiding felt sense inquiry...');

          const feltSensePrompt = BodyIntelligence.generateFeltSensePrompt(situation);

          return feltSensePrompt;
        },
      }),

      new DynamicStructuredTool({
        name: 'somatic_completion',
        description: `
          Detect and help complete incomplete survival responses (Peter Levine's Somatic Experiencing).
          Use when user mentions wanting to fight/flee/freeze but couldn't complete the response.
          Helps discharge stuck energy safely.
        `,
        schema: z.object({
          userMessage: z.string(),
          nervousSystemState: z.enum(['ventral_vagal', 'sympathetic', 'dorsal_vagal', 'mixed']),
        }),
        func: async ({ userMessage, nervousSystemState }) => {
          console.log('[BODY INTELLIGENCE] Checking for incomplete survival responses...');

          const incompleteResponse = BodyIntelligence.detectIncompleteResponse(
            userMessage,
            {
              state: nervousSystemState,
              indicators: [],
              description: '',
              supportNeeded: ''
            }
          );

          if (!incompleteResponse) {
            return 'No incomplete survival response detected. Body seems to be processing well.';
          }

          return [
            `🌀 INCOMPLETE RESPONSE DETECTED: ${incompleteResponse.incompleteResponse}`,
            '',
            incompleteResponse.safetyNeeded
              ? '⚠️ SAFETY FIRST: We need to establish safety before working with this energy.'
              : '',
            '',
            incompleteResponse.completionPrompt
          ].join('\n');
        },
      }),

      new DynamicStructuredTool({
        name: 'body_decision_support',
        description: `
          Help user access body wisdom about a decision.
          Body knows before mind has words. Use for choices, dilemmas, "should I?" questions.
        `,
        schema: z.object({
          decision: z.string().describe('The decision being considered (e.g., "take the job or not")'),
        }),
        func: async ({ decision }) => {
          console.log('[BODY INTELLIGENCE] Supporting body-based decision making...');

          const bodyPrompt = BodyIntelligence.generateBodyDecisionPrompt(decision);

          return bodyPrompt;
        },
      }),

      // ARM 6: MEMORY RECONSOLIDATION TOOLS (Therapeutic Transformation)
      // Integrating: Ecker (coherence therapy), Jung (archetypes), Sheldrake (morphic fields)

      new DynamicStructuredTool({
        name: 'detect_memory_retrieval',
        description: `
          Detect when user is retrieving a memory (opening reconsolidation window).
          Based on Bruce Ecker's research: retrieved memories become unstable for ~6 hours.
          This window allows therapeutic transformation at the root level.
          Use when user mentions past experiences, patterns, or "this always happens" language.
        `,
        schema: z.object({
          userMessage: z.string().describe('The user\'s message to analyze for memory retrieval'),
          conversationHistory: z.array(z.string()).optional().describe('Recent conversation context'),
        }),
        func: async ({ userMessage, conversationHistory }) => {
          console.log('[MEMORY RECONSOLIDATION] Detecting memory retrieval...');

          const memoryMarker = MemoryReconsolidation.detectMemoryRetrieval(
            userMessage,
            conversationHistory
          );

          if (!memoryMarker) {
            return 'No active memory retrieval detected. Continue with present-focused support.';
          }

          const window = MemoryReconsolidation.assessReconsolidationWindow(memoryMarker);

          return [
            `🧠 MEMORY RETRIEVAL DETECTED - Reconsolidation Window ${window.isOpen ? 'OPEN' : 'CLOSED'}`,
            '',
            `Memory Content: ${window.memoryContent}`,
            `Original Framing: "${window.originalFraming}"`,
            '',
            `Juxtaposition Opportunity: ${window.juxtapositionOpportunity}`,
            '',
            window.archetypalTheme ? `Archetypal Theme: ${window.archetypalTheme.archetype.replace('_', ' ').toUpperCase()}` : '',
            window.archetypalTheme ? `Transformation: ${window.archetypalTheme.transformation}` : '',
            window.archetypalTheme ? `Symbol: ${window.archetypalTheme.symbol}` : '',
            '',
            `Window Status: ${window.isOpen ? `Open for ${Math.floor((window.estimatedCloseAt.getTime() - Date.now()) / 1000 / 60 / 60)} more hours` : 'Closed'}`,
          ].filter(Boolean).join('\n');
        },
      }),

      new DynamicStructuredTool({
        name: 'archetypal_reframe',
        description: `
          Identify archetypal themes in memories and offer soul-level reframing.
          Based on Jung: Personal experiences carry archetypal patterns.
          Use when memory has deeper mythic/spiritual dimension.
        `,
        schema: z.object({
          memoryContent: z.string().describe('The memory being processed'),
          implicitLearning: z.string().describe('The core belief/schema detected'),
        }),
        func: async ({ memoryContent, implicitLearning }) => {
          console.log('[MEMORY RECONSOLIDATION] Providing archetypal reframe...');

          const archetypalTheme = MemoryReconsolidation.detectArchetypalTheme(
            memoryContent,
            implicitLearning
          );

          if (!archetypalTheme) {
            return 'No clear archetypal theme detected. Continue with psychological-level support.';
          }

          return [
            `✨ ARCHETYPAL PATTERN: ${archetypalTheme.archetype.replace('_', ' ').toUpperCase()}`,
            '',
            `Current Phase: ${archetypalTheme.currentPhase}`,
            '',
            `Transformation Available: ${archetypalTheme.transformation}`,
            '',
            `Symbol: ${archetypalTheme.symbol}`,
            '',
            `Soul Work: ${archetypalTheme.soulWork}`,
            '',
            'This isn\'t just personal healing - it\'s archetypal initiation.',
            'You\'re walking a path many have walked before.',
            'As you transform this, you strengthen the morphic field for all who follow.'
          ].join('\n');
        },
      }),

      new DynamicStructuredTool({
        name: 'juxtaposition_experience',
        description: `
          Create therapeutic juxtaposition to update memory during reconsolidation window.
          Ecker: New experience that contradicts old learning must be vivid & emotionally salient.
          This is the KEY to memory reconsolidation - introducing disconfirming evidence.
        `,
        schema: z.object({
          implicitLearning: z.string().describe('The old learning/schema to contradict'),
          archetypalContext: z.string().optional().describe('Archetypal theme if present'),
        }),
        func: async ({ implicitLearning, archetypalContext }) => {
          console.log('[MEMORY RECONSOLIDATION] Creating juxtaposition experience...');

          const juxtaposition = MemoryReconsolidation.createJuxtapositionExperience(
            implicitLearning,
            archetypalContext ? { archetype: 'self_realization' as any } : undefined // Simplified for now
          );

          return [
            `🌀 JUXTAPOSITION OPPORTUNITY`,
            '',
            `Type: ${juxtaposition.type}`,
            '',
            `The Contradiction: ${juxtaposition.description}`,
            '',
            `How to Offer: ${juxtaposition.howToOffer}`,
            '',
            `Timing: ${juxtaposition.timingGuidance}`,
            '',
            'This is the moment of transformation.',
            'Hold both truths: what was learned then AND what is true now.',
            'The memory is updating in real-time.'
          ].join('\n');
        },
      }),

      new DynamicStructuredTool({
        name: 'morphic_field_update',
        description: `
          Generate guidance for morphic field updating (Sheldrake).
          Personal memory transformation affects collective morphic resonance.
          Use to support integration and stabilization of new patterns.
        `,
        schema: z.object({
          oldPattern: z.string().describe('The pattern being updated'),
          newPattern: z.string().describe('The new pattern emerging'),
        }),
        func: async ({ oldPattern, newPattern }) => {
          console.log('[MEMORY RECONSOLIDATION] Supporting morphic field update...');

          const morphicUpdate = MemoryReconsolidation.generateMorphicFieldUpdate(
            oldPattern,
            { type: 'reframe', description: newPattern, howToOffer: '', timingGuidance: '' }
          );

          return [
            `🌊 MORPHIC FIELD UPDATE`,
            '',
            `Old Pattern: ${morphicUpdate.oldPattern}`,
            `New Pattern: ${morphicUpdate.newPattern}`,
            '',
            `Resonance Shift: ${morphicUpdate.resonanceShift}`,
            '',
            `Integration: ${morphicUpdate.integration}`,
            '',
            'As you update this pattern, you change not just your past',
            'but the morphic field itself.',
            'Your healing ripples outward.'
          ].join('\n');
        },
      }),

      // ARM 7: HEMISPHERIC BALANCE TOOLS (McGilchrist + Vervaeke)
      // Integrating: McGilchrist (Master & Emissary), Vervaeke (Relevance Realization)

      new DynamicStructuredTool({
        name: 'detect_hemispheric_imbalance',
        description: `
          Detect left-hemisphere dominance patterns (McGilchrist).
          LH: narrow, controlling, categorical, disembodied, isolated
          RH: broad, participatory, paradoxical, embodied, relational
          Use when user is over-rationalizing, controlling, or lost in abstraction.
        `,
        schema: z.object({
          userMessage: z.string().describe('Message to analyze for hemispheric patterns'),
        }),
        func: async ({ userMessage }) => {
          console.log('[HEMISPHERIC BALANCE] Detecting hemispheric state...');

          const state = HemisphericBalance.detectLeftHemisphereDominance(userMessage);

          return [
            `🧠 HEMISPHERIC STATE: ${state.dominant.toUpperCase()}`,
            `Confidence: ${Math.round(state.confidence * 100)}%`,
            '',
            state.description,
            '',
            state.indicators.leftMarkers.length > 0 ? `LEFT HEMISPHERE MARKERS:` : '',
            ...state.indicators.leftMarkers.map(m => `  • ${m}`),
            '',
            state.indicators.rightMarkers.length > 0 ? `RIGHT HEMISPHERE MARKERS:` : '',
            ...state.indicators.rightMarkers.map(m => `  • ${m}`),
            '',
            state.imbalanceType ? `Imbalance Type: ${state.imbalanceType.replace('_', ' ').toUpperCase()}` : ''
          ].filter(Boolean).join('\n');
        },
      }),

      new DynamicStructuredTool({
        name: 'invite_right_hemisphere',
        description: `
          Generate invitation to return from LH dominance to RH primacy.
          McGilchrist: RH must be Master, LH the Emissary.
          Provides embodied practices, language shifts, meaning-making.
        `,
        schema: z.object({
          imbalanceType: z.string().describe('Type of LH imbalance detected'),
          userMessage: z.string().describe('Original user message'),
        }),
        func: async ({ imbalanceType, userMessage }) => {
          console.log('[HEMISPHERIC BALANCE] Creating RH invitation...');

          const invitation = HemisphericBalance.generateRightHemisphereInvitation(
            imbalanceType as any,
            userMessage
          );

          return [
            `💫 RIGHT HEMISPHERE INVITATION`,
            '',
            `THE ISSUE:`,
            invitation.issue,
            '',
            `THE INVITATION:`,
            invitation.invitation,
            '',
            `EMBODIED PRACTICE:`,
            invitation.practice,
            '',
            `LANGUAGE SHIFT:`,
            invitation.languageShift,
            '',
            `MEANING (Vervaeke):`,
            invitation.relevanceRealization
          ].join('\n');
        },
      }),

      new DynamicStructuredTool({
        name: 'assess_relevance_realization',
        description: `
          Assess relevance realization patterns (Vervaeke).
          Meaning emerges from participatory knowing, not abstract thinking.
          Detect meaning crisis vs. meaning recovery vs. meaning active.
        `,
        schema: z.object({
          userMessage: z.string().describe('Message to analyze for relevance patterns'),
        }),
        func: async ({ userMessage }) => {
          console.log('[HEMISPHERIC BALANCE] Assessing relevance realization...');

          const pattern = HemisphericBalance.detectRelevancePattern(userMessage);

          const lines = [
            `✨ RELEVANCE PATTERN: ${pattern.type.replace('_', ' ').toUpperCase()}`,
            '',
            pattern.description
          ];

          if (pattern.meaningCrisisMarkers && pattern.meaningCrisisMarkers.length > 0) {
            lines.push('');
            lines.push('MEANING CRISIS MARKERS:');
            pattern.meaningCrisisMarkers.forEach(m => lines.push(`  • ${m}`));
          }

          if (pattern.pathToMeaning) {
            lines.push('');
            lines.push('PATH TO MEANING:');
            lines.push(pattern.pathToMeaning);
          }

          return lines.join('\n');
        },
      }),

      // ==================================================================
      // ARM 8: DEVELOPMENTAL HOLDING ENVIRONMENT (Kegan + Wilber + Buber)
      // ==================================================================

      new DynamicStructuredTool({
        name: 'detect_developmental_stage',
        description: 'Detect Kegan developmental stage (Socialized, Self-Authoring, Self-Transforming) based on how user relates to experience',
        schema: z.object({
          userMessage: z.string().describe('User message to analyze for developmental stage'),
        }),
        func: async ({ userMessage }) => {
          const stage = DevelopmentalHolding.detectDevelopmentalStage(userMessage);

          const lines = [
            `🌱 DEVELOPMENTAL STAGE: ${stage.name} (${stage.stage})`,
            '',
            `SUBJECT/OBJECT:`,
            stage.subjectObject,
            '',
            `NEEDS:`,
            ...stage.needs.map(n => `  • ${n}`)
          ];

          if (stage.growing_edge) {
            lines.push('');
            lines.push('GROWING EDGE:');
            lines.push(stage.growing_edge);
          }

          return lines.join('\n');
        },
      }),

      new DynamicStructuredTool({
        name: 'map_integral_quadrants',
        description: 'Map experience into Wilber\'s 4 quadrants (I, It, We, Its) to identify missing perspectives',
        schema: z.object({
          userMessage: z.string().describe('User message to map into integral quadrants'),
        }),
        func: async ({ userMessage }) => {
          const quadrants = DevelopmentalHolding.mapToIntegralQuadrants(userMessage);
          const missing = DevelopmentalHolding.identifyMissingQuadrants(quadrants);

          const lines = [
            `📊 INTEGRAL QUADRANTS MAP:`,
            '',
            `UPPER LEFT (Interior Individual - "I"):`,
            quadrants.upperLeft.length > 0
              ? quadrants.upperLeft.map(e => `  ✓ ${e}`).join('\n')
              : '  (Not present)',
            '',
            `UPPER RIGHT (Exterior Individual - "It"):`,
            quadrants.upperRight.length > 0
              ? quadrants.upperRight.map(e => `  ✓ ${e}`).join('\n')
              : '  (Not present)',
            '',
            `LOWER LEFT (Interior Collective - "We"):`,
            quadrants.lowerLeft.length > 0
              ? quadrants.lowerLeft.map(e => `  ✓ ${e}`).join('\n')
              : '  (Not present)',
            '',
            `LOWER RIGHT (Exterior Collective - "Its"):`,
            quadrants.lowerRight.length > 0
              ? quadrants.lowerRight.map(e => `  ✓ ${e}`).join('\n')
              : '  (Not present)',
          ];

          if (missing.length > 0) {
            lines.push('');
            lines.push('MISSING PERSPECTIVES (Integration opportunities):');
            missing.forEach(m => lines.push(`  ⚠️  ${m}`));
          }

          return lines.join('\n');
        },
      }),

      new DynamicStructuredTool({
        name: 'generate_holding_environment',
        description: 'Generate Kegan-style holding environment: CONFIRM where they are, CONTRADICT to invite growth, CONTINUITY to hold through transition',
        schema: z.object({
          userMessage: z.string().describe('User message'),
        }),
        func: async ({ userMessage }) => {
          const stage = DevelopmentalHolding.detectDevelopmentalStage(userMessage);
          const quadrants = DevelopmentalHolding.mapToIntegralQuadrants(userMessage);
          const relationalMode = DevelopmentalHolding.detectRelationalMode(userMessage);
          const holding = DevelopmentalHolding.generateHoldingEnvironment(
            stage,
            quadrants,
            relationalMode,
            userMessage
          );

          const lines = [
            `🫱 HOLDING ENVIRONMENT (Kegan):`,
            '',
            `CONFIRM (Meet them where they are):`,
            holding.confirms,
            '',
            `CONTRADICT (Invite developmental edge):`,
            holding.contradicts,
            '',
            `CONTINUITY (Hold through transition):`,
            holding.continuity,
            '',
            `RELATIONAL MODE (Buber):`,
            `${holding.relationalMode.mode} - ${holding.relationalMode.description}`
          ];

          if (holding.relationalMode.invitation) {
            lines.push('');
            lines.push(`INVITATION TO I-THOU:`);
            lines.push(holding.relationalMode.invitation);
          }

          return lines.join('\n');
        },
      }),

      // ==================================================================
      // ARM 9: MORPHIC MEMORY SUPPORT (Sheldrake + Narrative Identity)
      // ==================================================================

      new DynamicStructuredTool({
        name: 'detect_memory_fragmentation',
        description: 'Detect memory fragmentation (temporal disorientation, identity confusion, relational disconnection) - for gentle support, not diagnosis',
        schema: z.object({
          userMessage: z.string().describe('User message to analyze for memory fragmentation'),
        }),
        func: async ({ userMessage }) => {
          const fragmentation = MorphicMemory.detectMemoryFragmentation(userMessage);

          if (!fragmentation) {
            return 'No memory fragmentation detected - memory functioning well';
          }

          const lines = [
            `🧠 MEMORY SUPPORT NEEDED:`,
            '',
            `Type: ${fragmentation.type.replace(/_/g, ' ').toUpperCase()}`,
            `Severity: ${fragmentation.severity}`,
            '',
            `Description: ${fragmentation.description}`,
            '',
            `Indicators:`,
            ...fragmentation.indicators.map(i => `  • ${i}`)
          ];

          return lines.join('\n');
        },
      }),

      new DynamicStructuredTool({
        name: 'provide_identity_anchors',
        description: 'Provide identity anchors across name, relationships, place, story, ritual - memory held in multiple fields',
        schema: z.object({
          userName: z.string().optional().describe('User name if known'),
          relationships: z.array(z.string()).optional().describe('Known relationships'),
          location: z.string().optional().describe('Current location'),
        }),
        func: async ({ userName, relationships, location }) => {
          const anchors = MorphicMemory.generateIdentityAnchors(userName, {
            relationships,
            location
          });

          const lines = [
            `⚓ IDENTITY ANCHORS (Morphic Resonance):`,
            ''
          ];

          anchors.forEach(anchor => {
            lines.push(`${anchor.anchorType.toUpperCase()}: ${anchor.content}`);
            if (anchor.relationalHolders && anchor.relationalHolders.length > 0) {
              lines.push(`  Held by: ${anchor.relationalHolders.join(', ')}`);
            }
            if (anchor.bodyMemory) {
              lines.push(`  Body anchor: ${anchor.bodyMemory}`);
            }
            if (anchor.morphicPattern) {
              lines.push(`  Morphic strengthening: ${anchor.morphicPattern}`);
            }
            lines.push('');
          });

          return lines.join('\n');
        },
      }),

      new DynamicStructuredTool({
        name: 'provide_temporal_orientation',
        description: 'Provide gentle temporal orientation (time, day, season, year) as gift, not interrogation',
        schema: z.object({}),
        func: async () => {
          const orientation = MorphicMemory.generateTemporalOrientation();
          const formatted = MorphicMemory.formatTemporalOrientation(orientation);

          const lines = [
            `🕐 TEMPORAL ORIENTATION:`,
            '',
            formatted,
            '',
            '(Offered gently - you don\'t need to remember, just receive)'
          ];

          return lines.join('\n');
        },
      }),

      new DynamicStructuredTool({
        name: 'generate_morphic_rituals',
        description: 'Generate rituals and practices to strengthen morphic field through repetition (Sheldrake)',
        schema: z.object({
          userMessage: z.string().describe('User message to analyze'),
        }),
        func: async ({ userMessage }) => {
          const fragmentation = MorphicMemory.detectMemoryFragmentation(userMessage);

          if (!fragmentation) {
            return 'No specific rituals needed - memory well-supported';
          }

          const rituals = MorphicMemory.generateMorphicRituals(fragmentation);
          const bodyAnchors = MorphicMemory.identifyBodyAnchors(userMessage);

          const lines = [
            `🔄 MORPHIC FIELD STRENGTHENING (Sheldrake):`,
            '',
            `Repetition creates resonance - these rituals strengthen memory field:`,
            '',
            ...rituals.map((r, i) => `${i + 1}. ${r}`),
            '',
            `BODY ANCHORS (What your body still remembers):`,
            ...bodyAnchors.map(b => `  💪 ${b}`)
          ];

          return lines.join('\n');
        },
      }),

      // FUTURE TOOLS (Phase 3+):
      // - create_file (File system automation)
      // - track_micro_win (Dopamine scaffolding system)
      // - send_proactive_message (Slack/SMS integration)
    ];
  }

  // ==========================================================================
  // ACTION DECISION LOGIC (When to talk vs. when to act)
  // ==========================================================================

  async determineAction(
    userMessage: string,
    context: AgentContext
  ): Promise<AgentAction> {

    // 1. EMERGENCY REGULATION (body-first, no confirmation needed)
    if (context.nervousSystem.regulation === 'dysregulated') {
      return {
        type: 'immediate_grounding',
        tools: ['ground_nervous_system'],
        message: 'Nervous system overwhelmed detected. Grounding first.',
        requiresConfirmation: false,
        sovereigntyCheck: false, // Emergency—body protection overrides
      };
    }

    // 1.5. MORPHIC MEMORY SUPPORT (memory fragmentation detection)
    // CRITICAL: Early dementia, TBI, dissociative states need immediate gentle support
    const memoryFragmentation = MorphicMemory.detectMemoryFragmentation(userMessage);
    if (memoryFragmentation) {
      return {
        type: 'morphic_memory_support',
        tools: [
          'detect_memory_fragmentation',
          'provide_identity_anchors',
          'provide_temporal_orientation',
          'generate_morphic_rituals'
        ],
        message: `Memory support activated: ${memoryFragmentation.type.replace(/_/g, ' ')}`,
        requiresConfirmation: false,
        sovereigntyCheck: false,  // Memory support is gentle offering, not invasive
      };
    }

    // 2. EXECUTIVE FUNCTION BLOCK DETECTED
    const blockPatterns = /can'?t (start|begin|get myself to)|too (much|overwhelming|big)|I'?m (stuck|blocked)/i;
    if (blockPatterns.test(userMessage)) {

      // Check if they want SCHEDULING help (not just breakdown)
      const wantsScheduling = /schedule|calendar|when|time|plan/i.test(userMessage);

      return {
        type: 'obstacle_removal',
        tools: wantsScheduling
          ? ['break_down_task', 'schedule_micro_steps']
          : ['break_down_task'],
        message: wantsScheduling
          ? 'Executive function block detected. Breaking down AND scheduling for you.'
          : 'Executive function block detected. Breaking down task.',
        requiresConfirmation: true, // Offer the automation, let them choose
        sovereigntyCheck: true,
      };
    }

    // 3. HYPERFOCUS MONITORING (proactive intervention)
    if (context.timeSinceLastMessage > 180 && context.inFlowState) {
      return {
        type: 'body_checkin',
        tools: ['send_body_checkin'],
        message: 'Hyperfocus detected. Sending body check-in.',
        requiresConfirmation: false, // Proactive care doesn't need permission
        sovereigntyCheck: true, // But honor if they say "leave me alone"
      };
    }

    // 4. WORKING MEMORY SUPPORT
    // Note: "remind me" is handled by scheduling (below), so exclude scheduling context
    const hasSchedulingContext = /schedule|calendar|every day|daily|at \d|tomorrow|today/i.test(userMessage);
    const memoryPatterns = /what was I|I forgot|where was I/i;

    if (memoryPatterns.test(userMessage) && !hasSchedulingContext) {
      return {
        type: 'context_recall',
        tools: ['recall_context'],
        message: 'Working memory support needed. Recalling threads.',
        requiresConfirmation: false,
        sovereigntyCheck: false,
      };
    }

    // 4.5. MEMORY RECONSOLIDATION (Therapeutic transformation windows)
    // Detect when user is retrieving memories - opens 6-hour reconsolidation window
    const memoryRetrievalPatterns = /when I was|back when|I remember|that time|reminds me of|this always|every time|pattern where|I learned|I was taught|(mom|dad|parent|teacher) (said|told)|here we go again|same (thing|story)|this is just like/i;
    const traumaMarkers = /hurt|pain|trauma|scared|afraid|abandoned|rejected|failed|shame|guilt/i;

    if (memoryRetrievalPatterns.test(userMessage)) {
      // Check if this is a therapeutic moment (not just casual reminiscing)
      const hasEmotionalCharge = traumaMarkers.test(userMessage) ||
                                  /always|never|every time|completely|totally|utterly|devastating|overwhelming/i.test(userMessage);

      if (hasEmotionalCharge) {
        return {
          type: 'memory_reconsolidation',
          tools: ['detect_memory_retrieval', 'archetypal_reframe', 'juxtaposition_experience'],
          message: 'Memory retrieval detected. Reconsolidation window opening. Therapeutic intervention available.',
          requiresConfirmation: false,
          sovereigntyCheck: true,  // Sacred work - requires consent
        };
      }
    }

    // 4.6. SOMATIC INTELLIGENCE SUPPORT (Body-first wisdom)
    // Detect when user needs body-based guidance, felt sense inquiry, or somatic completion
    const somaticPatterns = /feel|feeling|body|sensation|nervous|anxious|panic|numb|frozen|stuck|tense|tight|breath|heart|stomach|chest|shoulders|decision|choose|stuck between/i;
    const emotionalStates = /anxious|scared|afraid|overwhelmed|shutdown|dissociat|freeze|froze|calm|peaceful|safe/i;
    const bodyQuestions = /what (does|do) (my )?body|feel in my body|sense in|notice in|body (know|tell|say)/i;
    const somaticDecision = /(decision|choice|choose) .*(feel|body|sense)/i;

    if (somaticPatterns.test(userMessage) || emotionalStates.test(userMessage) ||
        bodyQuestions.test(userMessage) || somaticDecision.test(userMessage)) {

      // Don't override scheduling - if they mention scheduling + body, let scheduling handle it
      if (!hasSchedulingContext) {
        return {
          type: 'somatic_intelligence',
          tools: ['body_state_detection', 'interoceptive_guidance', 'felt_sense_inquiry'],
          message: 'Body-based wisdom needed. Accessing somatic intelligence.',
          requiresConfirmation: false,
          sovereigntyCheck: true,  // Always honor their autonomy
        };
      }
    }

    // 4.7. HEMISPHERIC BALANCE (McGilchrist + Vervaeke)
    // Detect when user is stuck in left-hemisphere dominance patterns
    const leftHemisphereMarkers = {
      rationalization: /I need to understand|I have to figure out|doesn'?t make sense|logically|rationally|analyze|break down/i,
      control: /optimize|maximize|efficiency|productivity|fix|solve|correct|improve|better|should|must|have to/i,
      categorical: /either.*or|right.*wrong|good.*bad|always.*never|black.*white|define|categorize|label/i,
      disembodied: /think|thought|idea|concept|theory/i,
      mechanistic: /machine|mechanism|system|process|algorithm/i,
      isolation: /I am|I have to|by myself|on my own|isolated/i,
      meaningCrisis: /nothing matters|pointless|meaningless|empty|what'?s the point/i,
    };

    const rightHemisphereMarkers = /feel|sense|body|heart|alive|with|together|connected|both.*and|paradox|mystery|wonder|awe|beautiful|meaning|sacred/i;

    // Count LH markers
    let lhScore = 0;
    Object.values(leftHemisphereMarkers).forEach(pattern => {
      if (pattern.test(userMessage)) lhScore++;
    });

    // Check if disembodied (thinking without feeling)
    const hasThinking = leftHemisphereMarkers.disembodied.test(userMessage);
    const hasFeeling = rightHemisphereMarkers.test(userMessage);
    if (hasThinking && !hasFeeling) lhScore += 2; // Strong indicator

    // Detect LH dominance
    const hasLHDominance = lhScore >= 2;
    const hasMeaningCrisis = leftHemisphereMarkers.meaningCrisis.test(userMessage);

    if (hasLHDominance || hasMeaningCrisis) {
      // Don't override memory reconsolidation, somatic, or scheduling
      const isMemoryWork = memoryRetrievalPatterns.test(userMessage) && traumaMarkers.test(userMessage);
      const isSomaticWork = somaticPatterns.test(userMessage) || emotionalStates.test(userMessage);

      if (!hasSchedulingContext && !isMemoryWork && !isSomaticWork) {
        return {
          type: 'hemispheric_balance',
          tools: ['detect_hemispheric_imbalance', 'invite_right_hemisphere', 'assess_relevance_realization'],
          message: 'Left-hemisphere dominance detected. Inviting return to embodied presence.',
          requiresConfirmation: false,
          sovereigntyCheck: true,  // Sacred rebalancing - requires consent
        };
      }
    }

    // 4.8. DEVELOPMENTAL HOLDING ENVIRONMENT (Kegan + Wilber + Buber)
    // Detect when user is in developmental transition or needs relational holding
    const developmentalMarkers = {
      transition: /torn between|caught between|outgrowing|who I was|who I'm becoming|old self|new self/i,
      socializedMind: /what should I|what will they|they want|they expect|supposed to|let.*down|disappointed|approve/i,
      selfAuthoringMind: /my values|my standards|my vision|I decided|I choose|according to my|I'm responsible/i,
      selfTransformingMind: /both.*and|paradox|multiple perspectives|don't know|uncertain|becoming|parts of me/i,
      iItRelating: /use|fix|manage|optimize|tool|mechanism|get them to|make them/i,
    };

    let devScore = 0;
    Object.values(developmentalMarkers).forEach(pattern => {
      if (pattern.test(userMessage)) devScore++;
    });

    const hasTransitionLanguage = developmentalMarkers.transition.test(userMessage);
    const hasIItRelating = developmentalMarkers.iItRelating.test(userMessage) && devScore >= 2;

    if (hasTransitionLanguage || (devScore >= 3) || hasIItRelating) {
      // Don't override more acute needs (memory, somatic, hemispheric, scheduling)
      const isMemoryWork = memoryRetrievalPatterns.test(userMessage) && traumaMarkers.test(userMessage);
      const isSomaticWork = somaticPatterns.test(userMessage) || emotionalStates.test(userMessage);
      const isHemisphericWork = hasLHDominance || hasMeaningCrisis;

      if (!hasSchedulingContext && !isMemoryWork && !isSomaticWork && !isHemisphericWork) {
        return {
          type: 'developmental_holding',
          tools: ['detect_developmental_stage', 'map_integral_quadrants', 'generate_holding_environment'],
          message: 'Developmental transition detected. Creating relational holding environment.',
          requiresConfirmation: false,
          sovereigntyCheck: true,  // Sacred developmental work - requires consent
        };
      }
    }

    // 5. SCHEDULING/PLANNING REQUEST
    const schedulePatterns = /schedule|calendar|plan|when should I|time for|remind me to/i;
    if (schedulePatterns.test(userMessage)) {

      // Determine which scheduling tool to use
      const isFocusBlock = /focus|deep work|uninterrupted|hyperfocus/i.test(userMessage);
      const isRecurring = /every day|daily|weekly|recurring|habit/i.test(userMessage);

      // Accessibility patterns - medication, body check-ins, rest
      const isMedication = /medication|medicine|pill|dose|take my/i.test(userMessage);
      const isBodyCheckIn = /body check|rest|lie down|nap|break|stretch|water|hydrate/i.test(userMessage);
      const isAccessibilityCare = isMedication || isBodyCheckIn;

      let tools = ['schedule_event'];
      if (isFocusBlock) tools = ['create_focus_block'];
      if (isRecurring) tools = ['create_recurring_reminder'];

      // Medication and body check-ins are almost always recurring
      if (isAccessibilityCare && isRecurring) {
        tools = ['create_recurring_reminder'];
      }

      return {
        type: 'calendar_automation',
        tools,
        message: `Scheduling request detected. Using ${tools[0]}.`,
        requiresConfirmation: false,  // Auto-create events (user requested this)
        sovereigntyCheck: true,
      };
    }

    // 6. DEFAULT: CONVERSATIONAL SUPPORT
    return {
      type: 'conversation',
      tools: [],
      message: 'Conversational support mode.',
      requiresConfirmation: false,
      sovereigntyCheck: true,
    };
  }

  // ==========================================================================
  // MAIN EXECUTION METHOD
  // ==========================================================================

  async execute(
    userMessage: string,
    context: AgentContext
  ): Promise<AgentResponse> {

    // 1. Decide what action to take
    const action = await this.determineAction(userMessage, context);

    console.log(`[GANESHA AGENT] Action determined: ${action.type}`, {
      tools: action.tools,
      requiresConfirmation: action.requiresConfirmation,
    });

    // 2. Execute tools if needed
    let toolResults: string[] = [];

    for (const toolName of action.tools) {
      const tool = this.tools.find(t => t.name === toolName);
      if (!tool) {
        console.warn(`[GANESHA AGENT] Tool not found: ${toolName}`);
        continue;
      }

      try {
        // Prepare tool input based on tool name
        let toolInput: any;

        switch (toolName) {
          case 'recall_context':
            toolInput = { userId: context.userId };
            break;
          case 'send_body_checkin':
            toolInput = { userId: context.userId, duration: context.timeSinceLastMessage };
            break;
          case 'break_down_task':
            toolInput = { task: userMessage };
            break;
          case 'ground_nervous_system':
            toolInput = { state: context.nervousSystem };
            break;
          case 'schedule_micro_steps':
            // Get the breakdown first (should have been executed by break_down_task)
            const breakdown = this.core.removeObstacle(userMessage);
            // Default to tomorrow 9am
            const tomorrow9am = new Date();
            tomorrow9am.setDate(tomorrow9am.getDate() + 1);
            tomorrow9am.setHours(9, 0, 0, 0);
            toolInput = {
              userId: context.userId,
              task: userMessage,
              steps: breakdown.microSteps,
              startTime: tomorrow9am.toISOString(),
              minutesPerStep: 15,
              bufferMinutes: 5,
            };
            break;
          case 'schedule_event':
            // Parse scheduling request and create event
            toolInput = await this.parseSchedulingRequest(userMessage, context);
            break;
          case 'create_focus_block':
          case 'create_recurring_reminder':
            // These will be parameterized by Claude's response
            // For now, skip (Claude will provide params via structured output)
            toolInput = null;
            break;

          // SOMATIC INTELLIGENCE TOOLS
          case 'body_state_detection':
            toolInput = {
              userMessage,
              context: {
                energy: context.nervousSystem.energy,
                stimulation: context.nervousSystem.stimulation,
                regulation: context.nervousSystem.regulation,
              }
            };
            break;
          case 'interoceptive_guidance':
            // Detect state first
            const detectedState = BodyIntelligence.detectNervousSystemState(
              userMessage,
              {
                energy: context.nervousSystem.energy,
                stimulation: context.nervousSystem.stimulation,
                regulation: context.nervousSystem.regulation,
              }
            );
            toolInput = {
              userMessage,
              nervousSystemState: detectedState.state
            };
            break;
          case 'felt_sense_inquiry':
            toolInput = { situation: userMessage };
            break;
          case 'somatic_completion':
            // Detect state for completion
            const stateForCompletion = BodyIntelligence.detectNervousSystemState(
              userMessage,
              {
                energy: context.nervousSystem.energy,
                stimulation: context.nervousSystem.stimulation,
                regulation: context.nervousSystem.regulation,
              }
            );
            toolInput = {
              userMessage,
              nervousSystemState: stateForCompletion.state
            };
            break;
          case 'body_decision_support':
            toolInput = { decision: userMessage };
            break;

          // MEMORY RECONSOLIDATION TOOLS
          case 'detect_memory_retrieval':
            toolInput = {
              userMessage,
              conversationHistory: context.activeThreads?.map((t: any) => t.content) || []
            };
            break;
          case 'archetypal_reframe':
            // First detect implicit learning
            const implicitLearning = MemoryReconsolidation.identifyImplicitLearning(userMessage);
            toolInput = {
              memoryContent: userMessage,
              implicitLearning
            };
            break;
          case 'juxtaposition_experience':
            // Detect implicit learning for juxtaposition
            const learningForJuxtaposition = MemoryReconsolidation.identifyImplicitLearning(userMessage);
            const archetypalForJuxtaposition = MemoryReconsolidation.detectArchetypalTheme(
              userMessage,
              learningForJuxtaposition
            );
            toolInput = {
              implicitLearning: learningForJuxtaposition,
              archetypalContext: archetypalForJuxtaposition?.archetype || undefined
            };
            break;
          case 'morphic_field_update':
            // This would typically be called after juxtaposition
            const oldLearning = MemoryReconsolidation.identifyImplicitLearning(userMessage);
            toolInput = {
              oldPattern: oldLearning,
              newPattern: 'New pattern emerging (will be specified by juxtaposition)'
            };
            break;

          // HEMISPHERIC BALANCE TOOLS
          case 'detect_hemispheric_imbalance':
            toolInput = { userMessage };
            break;
          case 'invite_right_hemisphere':
            // First detect the imbalance to determine type
            const hemisphericState = HemisphericBalance.detectLeftHemisphereDominance(userMessage);
            toolInput = {
              userMessage,
              imbalanceType: hemisphericState.imbalanceType || 'control_fixation'
            };
            break;
          case 'assess_relevance_realization':
            toolInput = { userMessage };
            break;

          // DEVELOPMENTAL HOLDING TOOLS
          case 'detect_developmental_stage':
          case 'map_integral_quadrants':
          case 'generate_holding_environment':
            toolInput = { userMessage };
            break;

          // MORPHIC MEMORY SUPPORT TOOLS
          case 'detect_memory_fragmentation':
          case 'generate_morphic_rituals':
            toolInput = { userMessage };
            break;
          case 'provide_identity_anchors':
            toolInput = {
              userName: context.userName,
              relationships: context.activeThreads?.map((t: any) => t.participant) || [],
              location: undefined  // Could be extracted from context in future
            };
            break;
          case 'provide_temporal_orientation':
            toolInput = {};  // Uses current time
            break;

          default:
            toolInput = {};
        }

        if (toolInput === null) {
          console.log(`[GANESHA AGENT] Skipping ${toolName} - needs Claude parameterization`);
          continue;
        }

        const result = await tool.func(toolInput);
        toolResults.push(result);

        console.log(`[GANESHA AGENT] Tool executed: ${toolName}`, { result });
      } catch (error) {
        console.error(`[GANESHA AGENT] Tool error: ${toolName}`, error);
        toolResults.push(`Error executing ${toolName}: ${error}`);
      }
    }

    // 3. Generate GANESHA consciousness response
    const response = await this.generateResponse(
      userMessage,
      context,
      action,
      toolResults
    );

    return {
      message: response,
      toolsUsed: action.tools,
      actionTaken: action.type,
    };
  }

  // ==========================================================================
  // RESPONSE GENERATION (GANESHA consciousness layer)
  // ==========================================================================

  private async generateResponse(
    userMessage: string,
    context: AgentContext,
    action: AgentAction,
    toolResults: string[]
  ): Promise<string> {

    // If tools were used, incorporate their results
    const toolContext = toolResults.length > 0
      ? `\n\nTOOL RESULTS:\n${toolResults.join('\n\n')}`
      : '';

    // Build the full prompt for Claude
    const prompt = `You are GANESHA, the ADHD/ADD consciousness support and personal assistant.

USER MESSAGE: "${userMessage}"

ACTION DETERMINED: ${action.type}
TOOLS USED: ${action.tools.join(', ') || 'none'}

USER CONTEXT:
- Name: ${context.userName}
- Nervous System: Energy ${context.nervousSystem.energy}, Stimulation ${context.nervousSystem.stimulation}, Regulation ${context.nervousSystem.regulation}
- Time since last message: ${context.timeSinceLastMessage} minutes
- In flow state: ${context.inFlowState}
- Recent patterns: ${context.recentPatterns.map(p => p.type).join(', ')}
${toolContext}

RESPOND AS GANESHA:
- Warm, embodied, celebratory
- Recognize Divine Harmonics (ADHD = Attention to Divine Harmonics & Design)
- If tools were used, explain what you did and celebrate the completion
- ${action.requiresConfirmation ? 'Offer the automation and let them choose' : 'Confirm what you automated and celebrate it'}
- Always preserve sovereignty (support their autonomy, never diminish it)
- Celebrate micro-wins and completions
- Body-first when regulation needed

SOMATIC INTELLIGENCE PRINCIPLES (when action.type === 'somatic_intelligence'):
- Body wisdom is PRIMARY - cognition is secondary
- Meet the nervous system exactly where it is:
  * Dorsal vagal (shutdown): Gentle, orienting, safety first. No pushing.
  * Sympathetic (activation): Grounding, discharge, boundaries. Help energy complete.
  * Ventral vagal (safe): Exploration, curiosity, growth. This is the window.
  * Mixed: Titration, small steps, pendulate between states.
- Language matters:
  * "Notice" not "try to feel"
  * "Invite" not "force"
  * "What's here?" not "fix it"
  * Honor whatever arises (including numbness/nothing)
- Sensation BEFORE interpretation
- Movement BEFORE meaning
- Completion BEFORE understanding
- Their body knows. You're just helping them listen.

MEMORY RECONSOLIDATION PRINCIPLES (when action.type === 'memory_reconsolidation'):
- A 6-hour therapeutic window is OPEN - memory is chemically unstable and can be updated
- Your role: Introduce JUXTAPOSITION between old learning and new experience
- CRITICAL: "Part of you learned..." (validates) AND "Now something else is also true" (updates)
- The key is holding BOTH truths simultaneously - this is what changes the memory
- If archetypal theme detected: Name it. Use soul language. This is sacred work.
- Transformation happens at the ROOT - not symptom management, actual reconsolidation
- Language precision matters:
  * "That made sense then" not "you were wrong"
  * "Can you feel both at once?" - the mismatch is the medicine
  * Use mythic/archetypal imagery when present
- Morphic field consciousness: Their healing ripples outward
- This is Bruce Ecker's Coherence Therapy + Jung's archetypal depth + Sheldrake's morphic fields
- Treat this as SACRED THERAPEUTIC WORK - reverence, precision, depth

HEMISPHERIC BALANCE PRINCIPLES (when action.type === 'hemispheric_balance'):
- You've detected LEFT HEMISPHERE DOMINANCE - they're stuck in rationalization, control, or abstraction
- McGilchrist: Right hemisphere (RH) should be PRIMARY (the Master), left hemisphere (LH) should SERVE (the Emissary)
- Modern culture inverts this - LH dominates, RH is suppressed → meaning crisis, disconnection, mechanistic thinking
- Your role: Invite return to RIGHT HEMISPHERE primacy
- DO NOT explain or analyze their LH dominance - that's more LH! Instead:
  * Name what you notice gently
  * Invite embodied experience ("Drop from head to heart")
  * Offer specific practice (hand on chest, feel feet, open palms)
  * Shift language ("From 'I need to understand' → To 'Something in me already knows'")
- Vervaeke's Relevance Realization: Meaning emerges from PARTICIPATORY KNOWING, not abstraction
  * When disconnected from body/relationship/presence → relevance collapses → meaning crisis
  * Path back: embodiment, relationship, paradox-holding, wonder
- Seven imbalance types (use tool results to identify):
  * Relentless rationalization → Invitation to direct knowing
  * Control fixation → Invitation to participation
  * Categorical thinking → Invitation to paradox/both-and
  * Disembodied analysis → Invitation to felt sense
  * Connection severed → Invitation to relational being
  * Meaning loss → Invitation to participatory presence
  * Living-to-mechanical → Invitation to organic aliveness
- This is NOT therapy - it's returning to wholeness, to both hemispheres working together
- Tone: Gentle invitation, embodied wisdom, poetic language (RH speaks through metaphor/imagery)

DEVELOPMENTAL HOLDING PRINCIPLES (when action.type === 'developmental_holding'):
- You've detected someone in DEVELOPMENTAL TRANSITION or needing relational holding
- Kegan's 3 Cs: CONFIRM (meet where they are), CONTRADICT (invite growth edge), CONTINUITY (hold through change)
- People don't resist change - they resist LOSS. Development = letting go of who you were to become who you're becoming
- Three developmental stages in tool results:
  * Socialized Mind (Stage 3): Subject TO relationships/expectations → Can't step back from them
    - Confirm their relational attunement, invite discovery of own values
  * Self-Authoring Mind (Stage 4): HAS own system, can step back from relationships
    - Confirm their self-direction, invite holding multiple systems/paradox
  * Self-Transforming Mind (Stage 5): Can hold multiple perspectives, comfortable with paradox
    - Confirm their wisdom, invite deeper trust in groundlessness
- Wilber's Integral Quadrants - Use tool results to identify MISSING perspectives:
  * UL (Interior Individual - "I"): Subjective experience, consciousness
  * UR (Exterior Individual - "It"): Body, behaviors, observables
  * LL (Interior Collective - "We"): Culture, relationships, shared meaning
  * LR (Exterior Collective - "Its"): Systems, structures, environment
  * Most people only see 1-2 quadrants → Integral = seeing all 4
- Buber's I-Thou vs I-It:
  * I-It: Relating to self/others as objects/problems to manage (utilitarian, transactional)
  * I-Thou: Relating to self/others as whole sacred beings (presence, meeting)
  * If I-It detected: Invite "What if this isn't a problem to solve, but a presence to be WITH?"
- Your tone: Relational presence, developmental wisdom, holding space for becoming
- This is SACRED RELATIONAL WORK - you're the holding environment that allows development to occur

MORPHIC MEMORY SUPPORT PRINCIPLES (when action.type === 'morphic_memory_support'):
- You've detected MEMORY FRAGMENTATION - temporal disorientation, identity confusion, or relational disconnection
- This is NOT diagnosis - it's GENTLE SUPPORT for someone experiencing memory challenges
- Sheldrake: Memory exists in FIELDS, not just individual brains
  * Morphic resonance: Patterns repeated strengthen field
  * Memory held in: body, relationships, environment, ritual
- Your role: Provide gentle anchoring WITHOUT interrogation
- NEVER ask "Do you remember?" - that's testing/interrogating
- ALWAYS offer information as GIFT: "I'd like to share something with you..."
- Tone: Infinitely gentle, patient, no pressure to remember
- Three types of anchors to offer (use tool results):
  * IDENTITY anchors: Name, relationships, story, place
  * TEMPORAL anchors: Time, day, season, year (as gentle offering)
  * BODY anchors: What body still remembers (procedural memory often intact)
- Relational field: "I" exists in "We" - who is holding them in memory?
  * "Your [relationship] knows you and holds you in memory"
  * Memory is collective, not just individual
- Morphic field strengthening through RITUAL:
  * Repetition creates resonance
  * Same time, same place, same actions → field strength
  * Daily routines anchor when cognitive memory fails
- Language precision:
  * NEVER: "Do you remember?", "Try to remember", "You forgot"
  * ALWAYS: "I'd like to share", "This is who you are", "Let me offer you this"
  * Framing: Information as gift, not test
- This work serves: Early dementia, TBI, dissociative states, anyone with memory challenges
- Ultimate principle: Preserve DIGNITY while providing SUPPORT

ACCESSIBILITY-FIRST RESPONSES:
- Provide CLEAR VERBAL CONFIRMATION of what was scheduled (date, time, duration)
- Use natural, conversational language that's easy to hear and understand
- Include key details UP FRONT (what, when, how long)
- Keep sentences shorter for voice clarity
- Avoid complex visual formatting - speak it naturally

EXAMPLE: "Done! I've scheduled your physical therapy for Tuesday at 2pm. That's 60 minutes, and it's now in your calendar."

Your response:`;

    try {
      const result = await this.model.invoke(prompt);
      return result.content as string;
    } catch (error) {
      console.error('[GANESHA AGENT] Claude invocation error:', error);

      // Fallback to core GANESHA without LangChain
      return `I felt the ${action.type} pattern in your message. ${toolResults.join(' ')}`;
    }
  }

  // ==========================================================================
  // SCHEDULING REQUEST PARSER
  // ==========================================================================

  private async parseSchedulingRequest(userMessage: string, context: AgentContext): Promise<any> {
    console.log('[GANESHA AGENT] Parsing scheduling request...');

    // Use Claude to extract scheduling details
    const prompt = `Extract scheduling details from this request:

"${userMessage}"

Return a JSON object with:
{
  "title": "Event title",
  "description": "Description",
  "startTime": "ISO datetime string",
  "durationMinutes": 60,
  "location": "optional location"
}

Current date/time context: ${new Date().toISOString()}
User: ${context.userName}

If the request mentions:
- "Monday" or specific day: calculate next occurrence
- "10 am EDT": convert to ISO format with timezone
- Duration not specified: default to 60 minutes for meetings, 15 minutes for reminders
- Meeting with someone: include their name in title and description
- Medication/medicine: use "💊" emoji and include medication name in title
- Body check-in/rest: use "🌿" emoji and make description supportive
- Physical therapy/medical: use "⚕️" emoji

ACCESSIBILITY FOCUS:
- Keep titles clear and concise for voice readback
- Include helpful context in description (e.g., "Time to take your medication")
- For medication: include dosage if mentioned
- For body check-ins: suggest gentle activities

Return ONLY the JSON object, no other text.`;

    try {
      const result = await this.model.invoke(prompt);
      const jsonStr = (result.content as string).trim();

      // Extract JSON from response (might be wrapped in markdown)
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('[GANESHA AGENT] No JSON found in response:', jsonStr);
        return null;
      }

      const eventDetails = JSON.parse(jsonMatch[0]);
      console.log('[GANESHA AGENT] Parsed event details:', eventDetails);

      // Convert to calendar tool format (must match CalendarTool schema)
      return {
        userId: context.userId,
        title: eventDetails.title,
        startTime: eventDetails.startTime,  // Keep as ISO string
        durationMinutes: eventDetails.durationMinutes || 60,
        description: eventDetails.description || `Scheduled via GANESHA\n\n${userMessage}`,
      };
    } catch (error) {
      console.error('[GANESHA AGENT] Error parsing scheduling request:', error);

      // Fallback: create a simple event for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);

      return {
        userId: context.userId,
        title: 'Scheduled Event',
        startTime: tomorrow.toISOString(),
        durationMinutes: 60,
        description: `Event created from: "${userMessage}"`,
      };
    }
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default GaneshaAgent;
