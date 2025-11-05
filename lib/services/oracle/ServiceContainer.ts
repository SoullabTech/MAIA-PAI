/**
 * Service Container
 *
 * Dependency injection container for PersonalOracleAgent services
 * Manages service lifecycle and provides singleton instances
 *
 * Earth Phase Service Extraction - Following Spiralogic Principles
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { MemoryPersistenceService } from './MemoryPersistenceService';
import { SubscriptionGatekeeper } from './SubscriptionGatekeeper';
import { SafetyOrchestrator } from './SafetyOrchestrator';
import { SystemPromptBuilder } from './SystemPromptBuilder';
import { SymbolicIntelligenceService } from './SymbolicIntelligenceService';
import { EngagementAnalyzer } from './EngagementAnalyzer';
import { VoiceGenerationService } from './VoiceGenerationService';
import { MAIASafetyPipeline } from '@/lib/safety-pipeline';

/**
 * Singleton service container for PersonalOracleAgent dependencies
 */
export class ServiceContainer {
  private static instance: ServiceContainer;

  private memoryService?: MemoryPersistenceService;
  private subscriptionGate?: SubscriptionGatekeeper;
  private safetyOrchestrator?: SafetyOrchestrator;
  private promptBuilder?: SystemPromptBuilder;
  private symbolicIntelligence?: SymbolicIntelligenceService;
  private engagementAnalyzer?: EngagementAnalyzer;
  private voiceService?: VoiceGenerationService;

  private supabase?: SupabaseClient;

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  /**
   * Initialize all services with required dependencies
   */
  initializeServices(): void {
    // Initialize Supabase client
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      supabaseKey
    );

    // Initialize all services
    this.memoryService = new MemoryPersistenceService(this.supabase);
    this.subscriptionGate = new SubscriptionGatekeeper();
    this.safetyOrchestrator = new SafetyOrchestrator(new MAIASafetyPipeline());
    this.promptBuilder = new SystemPromptBuilder();
    this.symbolicIntelligence = new SymbolicIntelligenceService();
    this.engagementAnalyzer = new EngagementAnalyzer();
    this.voiceService = new VoiceGenerationService();

    console.log('✅ ServiceContainer initialized all services');
  }

  /**
   * Ensure services are initialized
   */
  private ensureInitialized(): void {
    if (!this.memoryService) {
      this.initializeServices();
    }
  }

  // ========== Service Getters ==========

  getMemoryService(): MemoryPersistenceService {
    this.ensureInitialized();
    return this.memoryService!;
  }

  getSubscriptionGate(): SubscriptionGatekeeper {
    this.ensureInitialized();
    return this.subscriptionGate!;
  }

  getSafetyOrchestrator(): SafetyOrchestrator {
    this.ensureInitialized();
    return this.safetyOrchestrator!;
  }

  getPromptBuilder(): SystemPromptBuilder {
    this.ensureInitialized();
    return this.promptBuilder!;
  }

  getSymbolicIntelligence(): SymbolicIntelligenceService {
    this.ensureInitialized();
    return this.symbolicIntelligence!;
  }

  getEngagementAnalyzer(): EngagementAnalyzer {
    this.ensureInitialized();
    return this.engagementAnalyzer!;
  }

  getVoiceService(): VoiceGenerationService {
    this.ensureInitialized();
    return this.voiceService!;
  }

  getSupabase(): SupabaseClient {
    this.ensureInitialized();
    return this.supabase!;
  }

  /**
   * Reset container (useful for testing)
   */
  static reset(): void {
    ServiceContainer.instance = new ServiceContainer();
  }
}

/**
 * Convenience function to get initialized service container
 */
export function getServiceContainer(): ServiceContainer {
  return ServiceContainer.getInstance();
}
