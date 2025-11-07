/**
 * PersonalOracleAgent - Simplified Coordinator
 *
 * Pure orchestration of seven specialized services.
 * Earth Phase completion - each service speaks when called.
 *
 * Architecture: Coordinator (this) + 7 Services + 5 Specialized Modules
 */

import type { StoredJournalEntry } from '@/lib/storage/journal-storage';
import type { SymbolicContext } from '@/lib/memory/soulprint';
import type { AINMemoryPayload } from '@/lib/memory/AINMemoryPayload';
import { ServiceContainer } from '@/lib/services/oracle/ServiceContainer';
// 🔥 Fire Phase: Unified Memory System (typed)
import { UnifiedMemoryService } from '@/lib/memory/unified/UnifiedMemoryService';
import { ElementalOracle2Bridge } from '@/lib/elemental-oracle-2-bridge';
import { IntellectualPropertyEngine } from '@/lib/intellectual-property-engine';
import { ActiveListeningCore } from '@/lib/oracle/ActiveListeningCore';
import { ConversationFlowTracker } from '@/lib/voice/ConversationFlowTracker';
import { ConversationalEnhancer } from '@/lib/voice/ConversationalEnhancer';
import { ConservativeRefiner } from '@/lib/voice/ConservativeRefiner';
import { enhanceWithTransformation, type TransformationEnhancement } from './PersonalOracleAgent.TransformationEnhancement';

export interface PersonalOracleSettings {
  name?: string;
  voice?: {
    enabled: boolean;
    autoSpeak: boolean;
    rate: number;
    pitch: number;
    volume: number;
  };
  persona?: "warm" | "formal" | "playful";
  conversationStyle?: "walking" | "classic" | "adaptive";
}

/**
 * Simplified PersonalOracleAgent
 * ~100 LOC of pure orchestration
 */
export class PersonalOracleAgent {
  private userId: string;
  private settings: PersonalOracleSettings;
  private services: ServiceContainer;

  // Specialized modules that remain in coordinator
  private unifiedMemory: UnifiedMemoryService; // 🔥 Fire Phase: Typed unified memory
  private elementalOracle: ElementalOracle2Bridge;
  private ipEngine: IntellectualPropertyEngine;
  private activeListening: ActiveListeningCore;
  private flowTracker: ConversationFlowTracker;

  // Enhancement and refinement
  private enhancer: ConversationalEnhancer;
  private refiner: ConservativeRefiner;

  // Transformation cache
  private transformationCache: Map<string, TransformationEnhancement>;

  constructor(userId: string, settings: PersonalOracleSettings = {}) {
    this.userId = userId;
    this.settings = {
      voice: {
        enabled: true,
        autoSpeak: false,
        rate: 1.0,
        pitch: 1.0,
        volume: 0.8,
      },
      persona: "warm",
      conversationStyle: "walking",
      ...settings,
    };

    // Get service container
    this.services = ServiceContainer.getInstance();

    // Initialize specialized modules
    this.unifiedMemory = new UnifiedMemoryService(); // 🔥 Fire Phase: Typed memory coordinator
    this.elementalOracle = new ElementalOracle2Bridge({
      openaiApiKey: process.env.OPENAI_API_KEY || '',
      model: 'gpt-4-turbo',
      eoApiUrl: process.env.ELEMENTAL_ORACLE_API_URL,
      eoApiKey: process.env.ELEMENTAL_ORACLE_API_KEY,
      cacheResponses: true,
      fallbackToLocal: false
    });
    this.ipEngine = new IntellectualPropertyEngine();
    this.activeListening = new ActiveListeningCore();
    this.flowTracker = new ConversationFlowTracker();
    this.enhancer = new ConversationalEnhancer();
    this.refiner = new ConservativeRefiner();
    this.transformationCache = new Map();

    console.log('✅ PersonalOracleAgent initialized (simplified coordinator)');
  }

  /**
   * Static factory method
   */
  static async loadAgent(userId: string, settings?: PersonalOracleSettings): Promise<PersonalOracleAgent> {
    return new PersonalOracleAgent(userId, settings);
  }

  /**
   * Process user interaction - pure orchestration
   */
  async processInteraction(
    input: string,
    context?: {
      currentMood?: any;
      currentEnergy?: any;
      journalEntries?: StoredJournalEntry[];
      journalContext?: string;
      symbolicContext?: SymbolicContext;
    }
  ): Promise<{ response: string; element?: string; metadata?: any; suggestions?: string[]; ritual?: any }> {
    const startTime = Date.now();
    const trimmedInput = (input || '').trim();
    const sessionId = `session_${Date.now()}`;
    const entries = context?.journalEntries || [];

    console.log('🎯 [Coordinator] Processing interaction for user:', this.userId);

    // Validate input
    if (!trimmedInput) {
      return {
        response: "I'm here with you. What's on your mind?",
        element: "aether",
        metadata: { sessionId, phase: "invocation" },
        suggestions: [],
      };
    }

    try {
      // 1️⃣ SUBSCRIPTION CHECK - Gate access
      console.log('   [1/7] SubscriptionGatekeeper checking access...');
      const accessCheck = await this.services.getSubscriptionGate().checkConversationAccess(this.userId);
      if (!accessCheck.allowed) {
        console.log('   ❌ Access denied - returning limit response');
        return this.services.getSubscriptionGate().generateLimitResponse(accessCheck);
      }
      console.log('   ✅ Access granted');

      // 2️⃣ SAFETY CHECK - Detect crisis situations
      console.log('   [2/7] SafetyOrchestrator checking message safety...');
      const safetyCheck = await this.services.getSafetyOrchestrator().checkSafety(
        this.userId,
        trimmedInput,
        sessionId,
        { journalHistory: entries }
      );
      if (this.services.getSafetyOrchestrator().shouldIntervene(safetyCheck)) {
        console.log('   🛡️ Safety intervention triggered');
        return this.services.getSafetyOrchestrator().generateCrisisResponse(safetyCheck);
      }
      console.log('   ✅ Safety check passed');

      // 3️⃣ MEMORY LOAD - Get user context and history
      console.log('   [3/7] UnifiedMemoryService loading context...');
      const memory = await this.unifiedMemory.ensureMemoryLoaded(this.userId);
      const history = await this.unifiedMemory.getConversationHistory(this.userId, 10);
      const breakthroughs = await this.unifiedMemory.getBreakthroughMoments(this.userId, 3);
      console.log(`   ✅ Memory loaded (${history.length} messages, ${breakthroughs.length} breakthroughs)`);

      // 4️⃣ SYMBOLIC ANALYSIS - Extract patterns and meaning
      console.log('   [4/7] SymbolicIntelligenceService analyzing patterns...');
      const symbolic = this.services.getSymbolicIntelligence();
      const motifs = symbolic.extractSymbolicMotifs(trimmedInput);
      const themes = symbolic.detectEmotionalThemes(trimmedInput);
      const detectedPhase = symbolic.detectSpiralogicPhase(trimmedInput);
      const { mood, archetype } = symbolic.inferMoodAndArchetype(trimmedInput);
      const symbols = symbolic.extractSymbols(entries);
      const dominantElement = symbolic.detectDominantElement(entries);
      console.log(`   ✅ Symbolic analysis complete (phase: ${detectedPhase.phase}, element: ${dominantElement})`);

      // 5️⃣ PROMPT BUILDING - Construct context-aware system prompt
      console.log('   [5/7] SystemPromptBuilder constructing prompt...');
      const transformation = await this.getTransformationEnhancement(memory, entries);
      const listening = this.activeListening.processUserInput(trimmedInput, { phase: dominantElement });
      const patterns = await this.unifiedMemory.getUserPatterns(this.userId);
      const affinity = await this.unifiedMemory.getElementalAffinity(this.userId);

      const systemPrompt = await this.services.getPromptBuilder().buildPrompt({
        userId: this.userId,
        userInput: trimmedInput,
        conversationStyle: this.settings.conversationStyle || 'walking',
        conversationDepth: this.flowTracker.getCurrentDepth(),
        journalEntries: entries,
        journalContext: context?.journalContext,
        ainMemory: memory,
        conversationHistory: history,
        breakthroughs,
        symbolicContext: context?.symbolicContext,
        detectedPhase,
        detectedArchetype: archetype,
        mood,
        dominantElement,
        symbols,
        phaseTransitionPrediction: { nextPhaseLikely: null, confidence: 0, reasoning: '' },
        transformationEnhancement: transformation,
        listeningResponse: listening,
        elementalAffinity: affinity,
        userPatterns: patterns,
      });
      console.log(`   ✅ System prompt built (${systemPrompt.length} chars)`);

      // 6️⃣ LLM CALL - Generate response
      console.log('   [6/7] Calling LLM API...');
      const rawResponse = await this.callLLM(systemPrompt, trimmedInput);
      console.log(`   ✅ LLM response received (${rawResponse.length} chars)`);

      // 7️⃣ ENGAGEMENT ANALYSIS & MEMORY UPDATE
      console.log('   [7/7] EngagementAnalyzer + UnifiedMemoryService finalizing...');
      const engagement = this.services.getEngagementAnalyzer();
      const emotionalTone = engagement.detectEmotionalTone(trimmedInput);
      const engagementLevel = engagement.assessEngagementLevel(trimmedInput, rawResponse);
      const isTransformation = engagement.detectTransformation(trimmedInput, rawResponse);
      const isSacred = engagement.detectSacredMoment(trimmedInput, rawResponse);

      // Update memory with this exchange
      const threadSummary = `${trimmedInput.substring(0, 100)}... → ${rawResponse.substring(0, 100)}...`;
      await this.unifiedMemory.updateAfterExchange(this.userId, threadSummary);
      console.log('   ✅ Engagement analyzed, memory updated');

      // Enhance response with flow awareness
      const flowState = this.flowTracker.analyzeExchange(trimmedInput, rawResponse);
      const enhanced = this.enhancer.enhance(rawResponse, {
        element: dominantElement,
        arcState: flowState.currentArc,
        depth: engagementLevel === 'deep' ? 0.8 : 0.5,
      });
      const refined = this.refiner.refine(enhanced, { preserveEssence: true });

      // Record analytics
      await this.recordAnalytics({
        userId: this.userId,
        input: trimmedInput,
        response: refined,
        emotionalTone,
        engagementLevel,
        element: dominantElement,
        responseTime: Date.now() - startTime,
      });

      // Return final response
      return {
        response: refined,
        element: dominantElement,
        metadata: {
          sessionId,
          phase: detectedPhase.phase,
          archetype,
          symbols,
          isTransformation,
          isSacred,
          flowArc: flowState.currentArc,
        },
        suggestions: engagement.generateSuggestions(symbols, [archetype]),
      };

    } catch (error) {
      console.error('❌ PersonalOracleAgent error:', error);
      return {
        response: "I'm having trouble connecting right now. Can you try again?",
        element: "aether",
        metadata: { sessionId, error: true },
        suggestions: [],
      };
    }
  }

  /**
   * Call LLM with OpenAI API
   */
  private async callLLM(systemPrompt: string, userInput: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput },
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I'm listening...";
  }

  /**
   * Get transformation enhancement (cached)
   */
  private async getTransformationEnhancement(
    memory: AINMemoryPayload,
    entries: StoredJournalEntry[]
  ): Promise<TransformationEnhancement | null> {
    const cacheKey = `${this.userId}_${memory.lastUpdated}`;
    if (this.transformationCache.has(cacheKey)) {
      return this.transformationCache.get(cacheKey) || null;
    }

    const enhancement = await enhanceWithTransformation({
      ainMemory: memory,
      journalEntries: entries,
      conversationHistory: [],
    });

    this.transformationCache.set(cacheKey, enhancement);
    return enhancement;
  }

  /**
   * Record analytics to semantic memory
   */
  private async recordAnalytics(data: {
    userId: string;
    input: string;
    response: string;
    emotionalTone: string;
    engagementLevel: string;
    element: string;
    responseTime: number;
  }): Promise<void> {
    try {
      // 🔥 Fire Phase: Typed pattern observation recording
      const kind = data.emotionalTone === 'breakthrough' ? 'motif' : 'affinity';
      await this.unifiedMemory.recordInteraction({
        userId: data.userId as any, // Brand cast
        kind,
        label: `${data.element}-${data.engagementLevel}`,
        weight: data.engagementLevel === 'deep' ? 0.8 : 0.5,
        observedAt: new Date().toISOString(),
        metadata: {
          emotionalTone: data.emotionalTone,
          responseTime: data.responseTime,
        },
      });
    } catch (error) {
      console.warn('Failed to record analytics:', error);
    }
  }

  /**
   * Update settings
   */
  updateSettings(newSettings: Partial<PersonalOracleSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * Get current settings
   */
  getSettings(): PersonalOracleSettings {
    return { ...this.settings };
  }
}
