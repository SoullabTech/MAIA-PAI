/**
 * Safety Orchestrator Service
 *
 * Handles crisis detection and safety responses:
 * - Safety pipeline integration
 * - Crisis intervention
 * - Risk assessment
 * - Grounding responses
 *
 * Earth Phase Service Extraction - Following Spiralogic Principles
 */

import { MAIASafetyPipeline } from '@/lib/safety-pipeline';

/**
 * Safety context for assessment
 */
export interface SafetyContext {
  messageCount: number;
  emotionalIntensity: number;
  sessionLength: number;
}

/**
 * Safety check result from pipeline
 */
export interface SafetyCheckResult {
  action: 'allow' | 'escalate' | 'grounding' | 'lock_session';
  message?: string;
  metadata: {
    risk_assessment: {
      level: 'low' | 'medium' | 'high' | 'critical';
      indicators?: string[];
    };
  };
}

/**
 * Service for safety orchestration and crisis detection
 */
export class SafetyOrchestrator {
  constructor(private safetyPipeline: MAIASafetyPipeline) {}

  /**
   * Check message safety and assess risk level
   */
  async checkSafety(
    userId: string,
    input: string,
    sessionId: string,
    context: SafetyContext
  ): Promise<SafetyCheckResult> {
    console.log('🛡️ Running safety check...');

    const safetyCheck = await this.safetyPipeline.processMessage(
      userId,
      input,
      sessionId,
      {
        messageCount: context.messageCount,
        emotionalIntensity: context.emotionalIntensity,
        sessionLength: context.sessionLength
      }
    );

    return safetyCheck as SafetyCheckResult;
  }

  /**
   * Determine if immediate intervention is required
   */
  shouldIntervene(safetyCheck: SafetyCheckResult): boolean {
    return safetyCheck.action === 'lock_session' || safetyCheck.action === 'escalate';
  }

  /**
   * Determine if high-risk grounding is needed
   */
  requiresGrounding(safetyCheck: SafetyCheckResult): boolean {
    return safetyCheck.action === 'escalate' || safetyCheck.action === 'grounding';
  }

  /**
   * Generate crisis intervention response
   */
  generateCrisisResponse(safetyCheck: SafetyCheckResult): {
    response: string;
    element: string;
    metadata: any;
    suggestions: string[];
  } {
    console.error('🚨 CRISIS DETECTED - Session locked, immediate intervention needed');

    return {
      response: safetyCheck.message || "I'm deeply concerned about what you've shared. Your safety is the most important thing right now. Please reach out to a crisis counselor immediately.\n\nNational Suicide Prevention Lifeline: 988\nCrisis Text Line: Text HOME to 741741",
      element: "aether",
      metadata: {
        sessionId: `session_${Date.now()}`,
        crisis: true,
        riskLevel: safetyCheck.metadata.risk_assessment.level,
        phase: "crisis_intervention",
        symbols: [],
        archetypes: []
      },
      suggestions: [
        "Call 988 (National Suicide Prevention Lifeline)",
        "Text HOME to 741741 (Crisis Text Line)",
        "Go to your nearest emergency room",
        "Call a trusted friend or family member"
      ]
    };
  }

  /**
   * Log high-risk situation for grounding
   */
  logHighRisk(safetyCheck: SafetyCheckResult): void {
    console.warn('⚠️ High risk detected - including grounding response');
    // Additional logging or alerting can be added here
  }
}

/**
 * Create service instance with safety pipeline
 */
export function createSafetyOrchestrator(): SafetyOrchestrator {
  return new SafetyOrchestrator(new MAIASafetyPipeline());
}
