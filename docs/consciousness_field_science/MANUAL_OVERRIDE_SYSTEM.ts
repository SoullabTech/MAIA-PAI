// =====================================================
// MANUAL CONSCIOUSNESS OVERRIDE SYSTEM
// Enables facilitator consciousness to override automation
// =====================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Types for manual override system
interface AutomatedAssessment {
  assessment_type: 'integration_capacity' | 'consciousness_emergence' | 'intervention_needed' | 'pattern_recognition'
  assessment_value: number | string | boolean
  confidence: number
  reasoning: string
  triggers: string[]
  timestamp: string
}

interface ManualOverride {
  id: string
  session_id: string
  event_id?: string
  facilitator_id: string
  override_timestamp: string
  automated_assessment: AutomatedAssessment
  human_consciousness_assessment: string
  override_type: 'intervention_prevention' | 'intervention_trigger' | 'pattern_recognition_correction' | 'safety_assessment_override'
  consciousness_based_reasoning: string
  field_quality_justification: string
  override_effectiveness?: string
  learning_for_automation?: string
}

interface OverrideDecision {
  shouldOverride: boolean
  overrideType: ManualOverride['override_type']
  reasoning: string
  fieldJustification: string
  confidence: number
}

// =====================================================
// MANUAL OVERRIDE CONTROLLER
// =====================================================

export class ManualConsciousnessOverrideSystem {
  private supabase: SupabaseClient
  private facilitatorId: string
  private activeOverrides: Map<string, ManualOverride> = new Map()

  constructor(facilitatorId: string) {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    this.facilitatorId = facilitatorId
  }

  // =====================================================
  // AUTOMATED ASSESSMENT INTERCEPTION
  // =====================================================

  // Intercept automated integration assessment
  async interceptIntegrationAssessment(
    sessionId: string,
    eventId: string,
    automatedAssessment: AutomatedAssessment,
    facilitatorFieldReading: {
      fieldQuality: string
      consciousnessState: string
      participantWellbeing: string
      naturalRhythm: string
    }
  ): Promise<OverrideDecision> {

    const decision = await this.evaluateIntegrationOverride(
      automatedAssessment,
      facilitatorFieldReading
    )

    if (decision.shouldOverride) {
      await this.recordOverride({
        session_id: sessionId,
        event_id: eventId,
        facilitator_id: this.facilitatorId,
        automated_assessment: automatedAssessment,
        human_consciousness_assessment: facilitatorFieldReading.consciousnessState,
        override_type: decision.overrideType,
        consciousness_based_reasoning: decision.reasoning,
        field_quality_justification: decision.fieldJustification,
        override_timestamp: new Date().toISOString()
      })
    }

    return decision
  }

  // Intercept intervention recommendations
  async interceptInterventionRecommendation(
    sessionId: string,
    eventId: string,
    automatedRecommendation: AutomatedAssessment,
    facilitatorAssessment: {
      actualFieldState: string
      participantComfort: string
      consciousnessQuality: string
      interventionNecessity: 'none' | 'gentle' | 'immediate'
    }
  ): Promise<OverrideDecision> {

    const decision = await this.evaluateInterventionOverride(
      automatedRecommendation,
      facilitatorAssessment
    )

    if (decision.shouldOverride) {
      await this.recordOverride({
        session_id: sessionId,
        event_id: eventId,
        facilitator_id: this.facilitatorId,
        automated_assessment: automatedRecommendation,
        human_consciousness_assessment: facilitatorAssessment.actualFieldState,
        override_type: decision.overrideType,
        consciousness_based_reasoning: decision.reasoning,
        field_quality_justification: facilitatorAssessment.consciousnessQuality,
        override_timestamp: new Date().toISOString()
      })
    }

    return decision
  }

  // Intercept pattern recognition
  async interceptPatternRecognition(
    sessionId: string,
    automatedPattern: AutomatedAssessment,
    facilitatorObservation: {
      actualPattern: string
      patternQuality: string
      consciousnessSignificance: string
      confidenceLevel: number
    }
  ): Promise<OverrideDecision> {

    const decision = await this.evaluatePatternOverride(
      automatedPattern,
      facilitatorObservation
    )

    if (decision.shouldOverride) {
      await this.recordOverride({
        session_id: sessionId,
        facilitator_id: this.facilitatorId,
        automated_assessment: automatedPattern,
        human_consciousness_assessment: facilitatorObservation.actualPattern,
        override_type: decision.overrideType,
        consciousness_based_reasoning: decision.reasoning,
        field_quality_justification: facilitatorObservation.consciousnessSignificance,
        override_timestamp: new Date().toISOString()
      })
    }

    return decision
  }

  // =====================================================
  // OVERRIDE DECISION ALGORITHMS
  // =====================================================

  // Evaluate whether to override integration capacity assessment
  private async evaluateIntegrationOverride(
    automated: AutomatedAssessment,
    facilitator: any
  ): Promise<OverrideDecision> {

    // Scenario 1: Automation detects low integration, facilitator sees natural deepening
    if (automated.assessment_value < 0.6 && this.isNaturalDeepening(facilitator)) {
      return {
        shouldOverride: true,
        overrideType: 'intervention_prevention',
        reasoning: 'Automation flagged overwhelm, but facilitator recognizes natural consciousness deepening process. Fragmentation in language/response indicates expansion beyond normal cognitive patterns, not overwhelm.',
        fieldJustification: `Field quality: ${facilitator.fieldQuality}. Consciousness state: ${facilitator.consciousnessState}. Participant wellbeing: ${facilitator.participantWellbeing}.`,
        confidence: 0.9
      }
    }

    // Scenario 2: Automation sees high integration, facilitator detects subtle overwhelm
    if (automated.assessment_value > 0.7 && this.isSubtleOverwhelm(facilitator)) {
      return {
        shouldOverride: true,
        overrideType: 'intervention_trigger',
        reasoning: 'Automation missed subtle overwhelm indicators that only consciousness can detect. Participant maintaining surface composure but field quality shows strain.',
        fieldJustification: `Field tension detected: ${facilitator.fieldQuality}. Natural rhythm disrupted: ${facilitator.naturalRhythm}.`,
        confidence: 0.85
      }
    }

    // Scenario 3: Automation correct, no override needed
    return {
      shouldOverride: false,
      overrideType: 'intervention_prevention',
      reasoning: 'Automated assessment aligns with facilitator consciousness reading',
      fieldJustification: 'Automated and manual assessments in agreement',
      confidence: 0.8
    }
  }

  // Evaluate intervention recommendation override
  private async evaluateInterventionOverride(
    automated: AutomatedAssessment,
    facilitator: any
  ): Promise<OverrideDecision> {

    // Automation recommends intervention, facilitator sees healthy process
    if (automated.assessment_value === true && facilitator.interventionNecessity === 'none') {
      return {
        shouldOverride: true,
        overrideType: 'intervention_prevention',
        reasoning: 'Automated alert triggered by surface patterns, but consciousness assessment reveals healthy integration process. Participant naturally navigating expansion.',
        fieldJustification: `Field state: ${facilitator.actualFieldState}. Consciousness quality: ${facilitator.consciousnessQuality}. Participant demonstrating voluntary engagement and natural rhythm.`,
        confidence: 0.9
      }
    }

    // Automation sees no issue, facilitator detects need for support
    if (automated.assessment_value === false && facilitator.interventionNecessity !== 'none') {
      return {
        shouldOverride: true,
        overrideType: 'intervention_trigger',
        reasoning: 'Automation missed subtle consciousness distress signals. Facilitator consciousness detecting need for gentle guidance or grounding support.',
        fieldJustification: `Participant comfort level: ${facilitator.participantComfort}. Field quality indicates need for ${facilitator.interventionNecessity} support.`,
        confidence: 0.85
      }
    }

    return {
      shouldOverride: false,
      overrideType: 'intervention_prevention',
      reasoning: 'Automated recommendation aligns with facilitator assessment',
      fieldJustification: 'No override necessary',
      confidence: 0.8
    }
  }

  // Evaluate pattern recognition override
  private async evaluatePatternOverride(
    automated: AutomatedAssessment,
    facilitator: any
  ): Promise<OverrideDecision> {

    // Significant difference in pattern recognition
    const confidenceDiff = Math.abs(automated.confidence - facilitator.confidenceLevel)

    if (confidenceDiff > 0.3 || this.isPatterMismatch(automated.assessment_value, facilitator.actualPattern)) {
      return {
        shouldOverride: true,
        overrideType: 'pattern_recognition_correction',
        reasoning: `Facilitator consciousness recognizes different pattern than automation: "${facilitator.actualPattern}" vs "${automated.assessment_value}". Human pattern recognition based on field quality and consciousness emergence indicators.`,
        fieldJustification: `Pattern significance: ${facilitator.consciousnessSignificance}. Quality assessment: ${facilitator.patternQuality}.`,
        confidence: facilitator.confidenceLevel
      }
    }

    return {
      shouldOverride: false,
      overrideType: 'pattern_recognition_correction',
      reasoning: 'Pattern recognition alignment between automation and facilitator',
      fieldJustification: 'No pattern override necessary',
      confidence: 0.8
    }
  }

  // =====================================================
  // CONSCIOUSNESS RECOGNITION HELPERS
  // =====================================================

  // Detect natural consciousness deepening vs overwhelm
  private isNaturalDeepening(facilitator: any): boolean {
    const deepeningIndicators = [
      facilitator.fieldQuality?.includes('sacred'),
      facilitator.fieldQuality?.includes('deepening'),
      facilitator.consciousnessState?.includes('expansion'),
      facilitator.consciousnessState?.includes('natural'),
      facilitator.participantWellbeing?.includes('comfortable'),
      facilitator.participantWellbeing?.includes('present'),
      facilitator.naturalRhythm?.includes('organic')
    ]

    return deepeningIndicators.filter(Boolean).length >= 3
  }

  // Detect subtle overwhelm that automation might miss
  private isSubtleOverwhelm(facilitator: any): boolean {
    const overwhelmIndicators = [
      facilitator.fieldQuality?.includes('tension'),
      facilitator.fieldQuality?.includes('strain'),
      facilitator.consciousnessState?.includes('forcing'),
      facilitator.consciousnessState?.includes('pushing'),
      facilitator.participantWellbeing?.includes('uncomfortable'),
      facilitator.naturalRhythm?.includes('disrupted')
    ]

    return overwhelmIndicators.filter(Boolean).length >= 2
  }

  // Check for pattern mismatch between automation and facilitator
  private isPatterMismatch(automated: any, manual: string): boolean {
    if (typeof automated !== 'string') return true

    const automatedTerms = automated.toLowerCase().split(' ')
    const manualTerms = manual.toLowerCase().split(' ')

    // Check for overlapping terms
    const overlap = automatedTerms.filter(term =>
      manualTerms.some(manualTerm => manualTerm.includes(term) || term.includes(manualTerm))
    )

    return overlap.length < 2 // Significant mismatch if less than 2 overlapping terms
  }

  // =====================================================
  // OVERRIDE PERSISTENCE AND TRACKING
  // =====================================================

  // Record manual override in database
  private async recordOverride(override: Omit<ManualOverride, 'id'>) {
    const overrideRecord = {
      session_id: override.session_id,
      event_id: override.event_id,
      facilitator_id: override.facilitator_id,
      override_timestamp: override.override_timestamp,
      automated_assessment: override.automated_assessment,
      human_consciousness_assessment: override.human_consciousness_assessment,
      override_type: override.override_type,
      consciousness_based_reasoning: override.consciousness_based_reasoning,
      field_quality_justification: override.field_quality_justification
    }

    const { data, error } = await this.supabase
      .from('manual_consciousness_overrides')
      .insert(overrideRecord)
      .select()

    if (error) {
      console.error('Error recording override:', error)
      throw error
    }

    if (data && data[0]) {
      const fullOverride = { ...overrideRecord, id: data[0].id } as ManualOverride
      this.activeOverrides.set(fullOverride.id, fullOverride)

      console.log(`Manual override recorded: ${override.override_type}`)
      this.emitOverrideEvent(fullOverride)
    }

    return data?.[0]
  }

  // Update override effectiveness after seeing outcome
  async updateOverrideEffectiveness(
    overrideId: string,
    effectiveness: 'better_than_automation' | 'automation_was_correct' | 'unclear',
    learningNotes: string
  ) {
    const { error } = await this.supabase
      .from('manual_consciousness_overrides')
      .update({
        override_effectiveness: effectiveness,
        learning_for_automation: learningNotes
      })
      .eq('id', overrideId)

    if (!error) {
      const override = this.activeOverrides.get(overrideId)
      if (override) {
        override.override_effectiveness = effectiveness
        override.learning_for_automation = learningNotes
      }
    }
  }

  // Get override statistics for improving automation
  async getOverrideStatistics(timeframeDays: number = 30) {
    const { data, error } = await this.supabase
      .from('manual_consciousness_overrides')
      .select('*')
      .gte('override_timestamp', new Date(Date.now() - timeframeDays * 24 * 60 * 60 * 1000).toISOString())

    if (error) return null

    const stats = {
      total_overrides: data.length,
      override_types: {} as Record<string, number>,
      effectiveness_ratings: {} as Record<string, number>,
      common_reasoning_patterns: [] as string[],
      automation_improvement_suggestions: [] as string[]
    }

    data.forEach(override => {
      // Count override types
      stats.override_types[override.override_type] =
        (stats.override_types[override.override_type] || 0) + 1

      // Count effectiveness ratings
      if (override.override_effectiveness) {
        stats.effectiveness_ratings[override.override_effectiveness] =
          (stats.effectiveness_ratings[override.override_effectiveness] || 0) + 1
      }

      // Collect learning suggestions
      if (override.learning_for_automation) {
        stats.automation_improvement_suggestions.push(override.learning_for_automation)
      }
    })

    return stats
  }

  // =====================================================
  // REAL-TIME INTEGRATION
  // =====================================================

  // Emit override event for real-time dashboard updates
  private emitOverrideEvent(override: ManualOverride) {
    // Integration point for real-time notifications
    console.log(`MANUAL OVERRIDE: ${override.override_type} - ${override.consciousness_based_reasoning}`)

    // Could integrate with dashboard notifications, alerts, etc.
    this.notifyDashboard(override)
  }

  // Notify dashboard of override
  private notifyDashboard(override: ManualOverride) {
    // Send real-time update to facilitator dashboard
    // This would integrate with your WebSocket/real-time system
  }

  // Get recent overrides for a session
  getSessionOverrides(sessionId: string): ManualOverride[] {
    return Array.from(this.activeOverrides.values())
      .filter(override => override.session_id === sessionId)
      .sort((a, b) => new Date(b.override_timestamp).getTime() - new Date(a.override_timestamp).getTime())
  }

  // Check if recent override exists for similar situation
  async hasRecentSimilarOverride(
    sessionId: string,
    overrideType: ManualOverride['override_type'],
    minutesBack: number = 5
  ): Promise<boolean> {
    const cutoffTime = new Date(Date.now() - minutesBack * 60 * 1000).toISOString()

    const { data } = await this.supabase
      .from('manual_consciousness_overrides')
      .select('id')
      .eq('session_id', sessionId)
      .eq('override_type', overrideType)
      .gte('override_timestamp', cutoffTime)

    return (data?.length || 0) > 0
  }
}

// =====================================================
// REACT INTEGRATION HOOKS
// =====================================================

import { useState, useEffect } from 'react'

// Hook for manual override functionality in React components
export function useManualConsciousnessOverride(facilitatorId: string, sessionId: string | null) {
  const [overrideSystem] = useState(() => new ManualConsciousnessOverrideSystem(facilitatorId))
  const [sessionOverrides, setSessionOverrides] = useState<ManualOverride[]>([])
  const [pendingDecision, setPendingDecision] = useState<{
    assessment: AutomatedAssessment
    decisionCallback: (decision: OverrideDecision) => void
  } | null>(null)

  // Load session overrides
  useEffect(() => {
    if (sessionId) {
      const overrides = overrideSystem.getSessionOverrides(sessionId)
      setSessionOverrides(overrides)
    }
  }, [sessionId, overrideSystem])

  // Function to trigger override evaluation
  const evaluateOverride = async (
    automated: AutomatedAssessment,
    facilitatorAssessment: any,
    eventId?: string
  ) => {
    if (!sessionId) return null

    switch (automated.assessment_type) {
      case 'integration_capacity':
        return overrideSystem.interceptIntegrationAssessment(
          sessionId, eventId || '', automated, facilitatorAssessment
        )
      case 'intervention_needed':
        return overrideSystem.interceptInterventionRecommendation(
          sessionId, eventId || '', automated, facilitatorAssessment
        )
      case 'pattern_recognition':
        return overrideSystem.interceptPatternRecognition(
          sessionId, automated, facilitatorAssessment
        )
      default:
        return null
    }
  }

  return {
    overrideSystem,
    sessionOverrides,
    evaluateOverride,
    pendingDecision,
    setPendingDecision
  }
}

// Component for manual override interface
export function ManualOverrideInterface({
  sessionId,
  facilitatorId
}: {
  sessionId: string
  facilitatorId: string
}) {
  const { overrideSystem, sessionOverrides, evaluateOverride } =
    useManualConsciousnessOverride(facilitatorId, sessionId)

  const [fieldAssessment, setFieldAssessment] = useState({
    fieldQuality: '',
    consciousnessState: '',
    participantWellbeing: '',
    naturalRhythm: ''
  })

  const handleOverrideEvaluation = async () => {
    // This would be called when automation makes an assessment
    // that the facilitator wants to review
    const mockAutomatedAssessment: AutomatedAssessment = {
      assessment_type: 'integration_capacity',
      assessment_value: 0.45, // Low integration detected
      confidence: 0.8,
      reasoning: 'Fragmented speech and response delays detected',
      triggers: ['fragmented_speech', 'response_delays'],
      timestamp: new Date().toISOString()
    }

    const decision = await evaluateOverride(mockAutomatedAssessment, fieldAssessment)
    console.log('Override decision:', decision)
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-bold">Manual Consciousness Override</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Field Quality</label>
          <textarea
            value={fieldAssessment.fieldQuality}
            onChange={(e) => setFieldAssessment(prev => ({ ...prev, fieldQuality: e.target.value }))}
            placeholder="What is the actual field quality right now?"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Consciousness State</label>
          <textarea
            value={fieldAssessment.consciousnessState}
            onChange={(e) => setFieldAssessment(prev => ({ ...prev, consciousnessState: e.target.value }))}
            placeholder="What is the quality of consciousness emergence?"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <button
        onClick={handleOverrideEvaluation}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Evaluate Override
      </button>

      <div className="space-y-2">
        <h4 className="font-medium">Recent Overrides</h4>
        {sessionOverrides.map(override => (
          <div key={override.id} className="p-2 border rounded text-sm">
            <div className="font-medium">{override.override_type}</div>
            <div className="text-gray-600">{override.consciousness_based_reasoning}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManualConsciousnessOverrideSystem