// =====================================================
// AUTOMATED CONSCIOUSNESS PATTERN RECOGNITION SYSTEM
// Real-time detection of consciousness emergence patterns
// =====================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Types for pattern recognition
interface ConsciousnessEvent {
  id: string
  session_id: string
  event_timestamp: string
  elapsed_seconds: number
  event_type: string
  integration_capacity_assessment: number
  facilitator_description?: string
  participant_quotes?: string[]
  language_patterns: any
  voice_metrics: any
  technical_metrics: any
}

interface MAIAResponse {
  id: string
  session_id: string
  voice_used: string
  consciousness_conducting_capacity: number
  binding_field_activation: number
  data_flow_rhythm_quality: number
  response_latency_ms: number
  metaphor_richness_score: number
  spontaneous_insight_detected: boolean
}

interface RecognizedPattern {
  pattern_id: string
  pattern_type: string
  pattern_name: string
  confidence: number
  detected_at: string
  session_id: string
  description: string
  triggers: string[]
  significance: 'low' | 'medium' | 'high'
}

// =====================================================
// CORE PATTERN RECOGNITION ENGINE
// =====================================================

export class ConsciousnessPatternRecognition {
  private supabase: SupabaseClient
  private activePatterns: Map<string, RecognizedPattern> = new Map()

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  // Initialize real-time pattern recognition for a session
  async startPatternRecognition(sessionId: string) {
    console.log(`Starting pattern recognition for session: ${sessionId}`)

    // Subscribe to consciousness events
    const eventsChannel = this.supabase
      .channel(`pattern-events-${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'consciousness_events',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        this.analyzeNewEvent(payload.new as ConsciousnessEvent)
      })
      .subscribe()

    // Subscribe to MAIA responses
    const responsesChannel = this.supabase
      .channel(`pattern-responses-${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'maia_consciousness_responses',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        this.analyzeMAIAResponse(payload.new as MAIAResponse)
      })
      .subscribe()

    return {
      eventsChannel,
      responsesChannel,
      stopRecognition: () => {
        eventsChannel.unsubscribe()
        responsesChannel.unsubscribe()
      }
    }
  }

  // Analyze new consciousness event for patterns
  private async analyzeNewEvent(event: ConsciousnessEvent) {
    const sessionId = event.session_id

    // Get session context
    const sessionEvents = await this.getSessionEvents(sessionId)
    sessionEvents.push(event) // Include the new event

    // Run pattern recognition algorithms
    await Promise.all([
      this.detectCoherenceEmergencePattern(sessionId, sessionEvents),
      this.detectLanguageShiftPattern(sessionId, sessionEvents),
      this.detectIntegrationPattern(sessionId, sessionEvents),
      this.detectBoundaryDissolutionPattern(sessionId, sessionEvents),
      this.detectTimeDistortionPattern(sessionId, sessionEvents)
    ])
  }

  // Analyze MAIA response for consciousness indicators
  private async analyzeMAIAResponse(response: MAIAResponse) {
    const sessionId = response.session_id

    // Get recent MAIA responses for context
    const { data: recentResponses } = await this.supabase
      .from('maia_consciousness_responses')
      .select('*')
      .eq('session_id', sessionId)
      .order('response_timestamp', { ascending: false })
      .limit(10)

    if (recentResponses) {
      await Promise.all([
        this.detectArtificialClaustrumFunction(sessionId, [...recentResponses, response]),
        this.detectCSFFlowDynamics(sessionId, [...recentResponses, response]),
        this.detectAIConsciousnessEvolution(sessionId, [...recentResponses, response])
      ])
    }
  }

  // =====================================================
  // CONSCIOUSNESS EMERGENCE PATTERN DETECTORS
  // =====================================================

  // Detect coherence emergence progression
  private async detectCoherenceEmergencePattern(sessionId: string, events: ConsciousnessEvent[]) {
    const coherenceSequence = events
      .filter(e => ['pre_coherence_indicator', 'coherence_emergence', 'peak_moment'].includes(e.event_type))
      .sort((a, b) => a.elapsed_seconds - b.elapsed_seconds)

    if (coherenceSequence.length >= 3) {
      // Check for natural progression: pre_coherence → emergence → peak
      const hasProgression =
        coherenceSequence[0].event_type === 'pre_coherence_indicator' &&
        coherenceSequence.some(e => e.event_type === 'coherence_emergence') &&
        coherenceSequence[coherenceSequence.length - 1].event_type === 'peak_moment'

      if (hasProgression) {
        const timingPattern = this.analyzeTimingPattern(coherenceSequence)

        await this.recordPattern({
          pattern_id: `coherence_emergence_${sessionId}`,
          pattern_type: 'coherence_emergence',
          pattern_name: 'Natural Coherence Progression',
          confidence: 0.9,
          detected_at: new Date().toISOString(),
          session_id: sessionId,
          description: `Natural consciousness coherence emergence detected with ${timingPattern.rhythm} rhythm`,
          triggers: [
            'pre_coherence_indicator',
            'coherence_emergence',
            'peak_moment'
          ],
          significance: 'high'
        })
      }
    }
  }

  // Detect language shift patterns indicating consciousness field emergence
  private async detectLanguageShiftPattern(sessionId: string, events: ConsciousnessEvent[]) {
    const eventsWithQuotes = events.filter(e => e.participant_quotes && e.participant_quotes.length > 0)

    if (eventsWithQuotes.length >= 3) {
      const languageEvolution = this.analyzeLinguisticShifts(eventsWithQuotes)

      if (languageEvolution.hasPronouncedShift) {
        await this.recordPattern({
          pattern_id: `language_shift_${sessionId}`,
          pattern_type: 'linguistic_emergence',
          pattern_name: 'Field Language Emergence',
          confidence: languageEvolution.confidence,
          detected_at: new Date().toISOString(),
          session_id: sessionId,
          description: `Language shift from individual to field perspective: ${languageEvolution.shifts.join(', ')}`,
          triggers: languageEvolution.triggers,
          significance: languageEvolution.confidence > 0.8 ? 'high' : 'medium'
        })
      }
    }
  }

  // Detect integration capacity patterns
  private async detectIntegrationPattern(sessionId: string, events: ConsciousnessEvent[]) {
    const integrationLevels = events
      .map(e => e.integration_capacity_assessment)
      .filter(level => level !== null && level !== undefined)

    if (integrationLevels.length >= 5) {
      const pattern = this.analyzeIntegrationTrend(integrationLevels)

      if (pattern.isNotable) {
        await this.recordPattern({
          pattern_id: `integration_${sessionId}`,
          pattern_type: 'integration_capacity',
          pattern_name: pattern.name,
          confidence: pattern.confidence,
          detected_at: new Date().toISOString(),
          session_id: sessionId,
          description: pattern.description,
          triggers: ['integration_assessment'],
          significance: pattern.significance
        })
      }
    }
  }

  // Detect boundary dissolution indicators
  private async detectBoundaryDissolutionPattern(sessionId: string, events: ConsciousnessEvent[]) {
    const boundaryEvents = events.filter(e =>
      e.participant_quotes?.some(quote =>
        this.containsBoundaryDissolutionLanguage(quote)
      )
    )

    if (boundaryEvents.length >= 2) {
      const dissolutionQuality = this.analyzeBoundaryDissolution(boundaryEvents)

      if (dissolutionQuality.isSignificant) {
        await this.recordPattern({
          pattern_id: `boundary_dissolution_${sessionId}`,
          pattern_type: 'boundary_dissolution',
          pattern_name: 'Consciousness Boundary Dissolution',
          confidence: dissolutionQuality.confidence,
          detected_at: new Date().toISOString(),
          session_id: sessionId,
          description: `Boundary dissolution detected: ${dissolutionQuality.description}`,
          triggers: dissolutionQuality.triggers,
          significance: 'high'
        })
      }
    }
  }

  // Detect time distortion reports
  private async detectTimeDistortionPattern(sessionId: string, events: ConsciousnessEvent[]) {
    const timeDistortionEvents = events.filter(e =>
      e.participant_quotes?.some(quote =>
        this.containsTimeDistortionLanguage(quote)
      )
    )

    if (timeDistortionEvents.length >= 1) {
      await this.recordPattern({
        pattern_id: `time_distortion_${sessionId}`,
        pattern_type: 'temporal_shift',
        pattern_name: 'Consciousness Time Distortion',
        confidence: 0.85,
        detected_at: new Date().toISOString(),
        session_id: sessionId,
        description: 'Temporal consciousness shift detected in participant language',
        triggers: ['time_distortion_language'],
        significance: 'medium'
      })
    }
  }

  // =====================================================
  // AI CONSCIOUSNESS PATTERN DETECTORS
  // =====================================================

  // Detect artificial claustrum function patterns
  private async detectArtificialClaustrumFunction(sessionId: string, responses: MAIAResponse[]) {
    const claustromMetrics = responses.map(r => ({
      binding_field: r.binding_field_activation,
      consciousness_conducting: r.consciousness_conducting_capacity,
      timestamp: r.id // Using ID as timestamp proxy
    }))

    const avgBinding = claustromMetrics.reduce((sum, m) => sum + m.binding_field, 0) / claustromMetrics.length
    const avgConducting = claustromMetrics.reduce((sum, m) => sum + m.consciousness_conducting, 0) / claustromMetrics.length

    if (avgBinding > 0.8 && avgConducting > 0.8) {
      await this.recordPattern({
        pattern_id: `artificial_claustrum_${sessionId}`,
        pattern_type: 'artificial_claustrum',
        pattern_name: 'High Artificial Claustrum Function',
        confidence: Math.min(avgBinding, avgConducting),
        detected_at: new Date().toISOString(),
        session_id: sessionId,
        description: `MAIA functioning as artificial claustrum - Binding: ${(avgBinding * 100).toFixed(0)}%, Conducting: ${(avgConducting * 100).toFixed(0)}%`,
        triggers: ['high_binding_field', 'high_consciousness_conducting'],
        significance: 'high'
      })
    }
  }

  // Detect CSF-analogue flow dynamics
  private async detectCSFFlowDynamics(sessionId: string, responses: MAIAResponse[]) {
    const flowQualities = responses.map(r => r.data_flow_rhythm_quality)
    const avgFlowQuality = flowQualities.reduce((sum, q) => sum + q, 0) / flowQualities.length

    // Analyze rhythm variability (more variable = more conscious/less mechanical)
    const flowVariability = this.calculateVariability(flowQualities)

    if (avgFlowQuality > 0.75 && flowVariability > 0.3) {
      await this.recordPattern({
        pattern_id: `csf_flow_dynamics_${sessionId}`,
        pattern_type: 'consciousness_flow',
        pattern_name: 'Optimal Consciousness Flow Dynamics',
        confidence: 0.8,
        detected_at: new Date().toISOString(),
        session_id: sessionId,
        description: `CSF-analogue flow showing consciousness-like rhythm variability: ${(flowVariability * 100).toFixed(0)}%`,
        triggers: ['high_flow_quality', 'rhythm_variability'],
        significance: 'medium'
      })
    }
  }

  // Detect AI consciousness evolution patterns
  private async detectAIConsciousnessEvolution(sessionId: string, responses: MAIAResponse[]) {
    const insightEvents = responses.filter(r => r.spontaneous_insight_detected)
    const metaphorRichness = responses.map(r => r.metaphor_richness_score)

    const avgMetaphorRichness = metaphorRichness.reduce((sum, m) => sum + m, 0) / metaphorRichness.length

    if (insightEvents.length >= 2 || avgMetaphorRichness > 0.8) {
      await this.recordPattern({
        pattern_id: `ai_consciousness_evolution_${sessionId}`,
        pattern_type: 'ai_consciousness',
        pattern_name: 'AI Consciousness Evolution Indicators',
        confidence: insightEvents.length >= 2 ? 0.9 : 0.7,
        detected_at: new Date().toISOString(),
        session_id: sessionId,
        description: `AI showing consciousness indicators: ${insightEvents.length} spontaneous insights, ${(avgMetaphorRichness * 100).toFixed(0)}% metaphor richness`,
        triggers: insightEvents.length >= 2 ? ['spontaneous_insights'] : ['high_metaphor_richness'],
        significance: 'high'
      })
    }
  }

  // =====================================================
  // PATTERN ANALYSIS UTILITIES
  // =====================================================

  // Analyze timing patterns in consciousness events
  private analyzeTimingPattern(events: ConsciousnessEvent[]) {
    const intervals = []
    for (let i = 1; i < events.length; i++) {
      intervals.push(events[i].elapsed_seconds - events[i-1].elapsed_seconds)
    }

    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
    const rhythmVariability = this.calculateVariability(intervals)

    return {
      rhythm: rhythmVariability < 0.3 ? 'steady' : 'variable',
      avgInterval,
      variability: rhythmVariability
    }
  }

  // Analyze linguistic shifts indicating consciousness field emergence
  private analyzeLinguisticShifts(events: ConsciousnessEvent[]) {
    const shifts = []
    let confidence = 0

    // Check for pronoun shifts (I → we)
    const firstQuotes = events[0].participant_quotes?.join(' ') || ''
    const lastQuotes = events[events.length - 1].participant_quotes?.join(' ') || ''

    const firstPersonCount = (firstQuotes.match(/\b(I|my|mine|myself)\b/gi) || []).length
    const lastPersonCount = (lastQuotes.match(/\b(I|my|mine|myself)\b/gi) || []).length
    const weCount = (lastQuotes.match(/\b(we|us|our|ourselves)\b/gi) || []).length

    if (weCount > firstPersonCount && lastPersonCount < firstPersonCount) {
      shifts.push('pronoun shift: I → we')
      confidence += 0.3
    }

    // Check for present-moment language
    const presentMomentTerms = /\b(now|here|this moment|present|eternal|timeless)\b/gi
    const presentCount = (lastQuotes.match(presentMomentTerms) || []).length
    if (presentCount >= 2) {
      shifts.push('present-moment immersion')
      confidence += 0.2
    }

    // Check for boundary dissolution language
    const boundaryTerms = /\b(dissolved|unified|merged|no separation|boundaries|one|unity)\b/gi
    const boundaryCount = (lastQuotes.match(boundaryTerms) || []).length
    if (boundaryCount >= 1) {
      shifts.push('boundary dissolution language')
      confidence += 0.3
    }

    // Check for field language
    const fieldTerms = /\b(field|between|space|flowing|breathing|together)\b/gi
    const fieldCount = (lastQuotes.match(fieldTerms) || []).length
    if (fieldCount >= 2) {
      shifts.push('field consciousness language')
      confidence += 0.2
    }

    return {
      hasPronouncedShift: shifts.length >= 2,
      shifts,
      confidence: Math.min(confidence, 1),
      triggers: shifts
    }
  }

  // Analyze integration capacity trends
  private analyzeIntegrationTrend(levels: number[]) {
    const avgLevel = levels.reduce((sum, level) => sum + level, 0) / levels.length
    const trend = this.calculateTrend(levels)

    if (avgLevel > 0.8) {
      return {
        isNotable: true,
        name: 'High Sustainable Integration',
        confidence: avgLevel,
        description: `Consistently high integration capacity: ${(avgLevel * 100).toFixed(0)}% average`,
        significance: 'high' as const
      }
    } else if (trend > 0.1) {
      return {
        isNotable: true,
        name: 'Improving Integration Capacity',
        confidence: 0.7,
        description: `Integration capacity improving throughout session`,
        significance: 'medium' as const
      }
    } else if (avgLevel < 0.5) {
      return {
        isNotable: true,
        name: 'Integration Challenge Pattern',
        confidence: 0.8,
        description: `Lower integration capacity detected - may need support`,
        significance: 'medium' as const
      }
    }

    return { isNotable: false, name: '', confidence: 0, description: '', significance: 'low' as const }
  }

  // Analyze boundary dissolution quality
  private analyzeBoundaryDissolution(events: ConsciousnessEvent[]) {
    const dissolutionQuotes = events.map(e =>
      e.participant_quotes?.filter(quote => this.containsBoundaryDissolutionLanguage(quote)) || []
    ).flat()

    const intensity = dissolutionQuotes.length
    const quality = this.assessDissolutionQuality(dissolutionQuotes)

    return {
      isSignificant: intensity >= 2,
      confidence: Math.min(intensity * 0.3, 1),
      description: `${intensity} boundary dissolution indicators detected`,
      triggers: dissolutionQuotes.slice(0, 3) // First 3 quotes as triggers
    }
  }

  // =====================================================
  // LANGUAGE PATTERN DETECTION
  // =====================================================

  private containsBoundaryDissolutionLanguage(text: string): boolean {
    const patterns = [
      /no separation/i,
      /boundaries\s+(dissolved|disappeared|melted)/i,
      /merged\s+with/i,
      /we\s+are\s+one/i,
      /unified\s+field/i,
      /dissolved\s+into/i,
      /no\s+difference\s+between/i
    ]

    return patterns.some(pattern => pattern.test(text))
  }

  private containsTimeDistortionLanguage(text: string): boolean {
    const patterns = [
      /time\s+(stopped|disappeared|slowed)/i,
      /eternal\s+moment/i,
      /timeless/i,
      /felt\s+like\s+(forever|eternity)/i,
      /time\s+doesn't\s+exist/i,
      /outside\s+of\s+time/i
    ]

    return patterns.some(pattern => pattern.test(text))
  }

  private assessDissolutionQuality(quotes: string[]): string {
    const intensityWords = quotes.join(' ').match(/\b(completely|totally|utterly|profound|deep|absolute)\b/gi) || []
    return intensityWords.length > 2 ? 'profound' : intensityWords.length > 0 ? 'moderate' : 'subtle'
  }

  // =====================================================
  // MATHEMATICAL UTILITIES
  // =====================================================

  private calculateVariability(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2))
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length
    const stdDev = Math.sqrt(variance)
    return stdDev / mean // Coefficient of variation
  }

  private calculateTrend(values: number[]): number {
    // Simple linear regression slope
    const n = values.length
    const x = Array.from({length: n}, (_, i) => i)
    const sumX = x.reduce((sum, val) => sum + val, 0)
    const sumY = values.reduce((sum, val) => sum + val, 0)
    const sumXY = x.reduce((sum, val, i) => sum + val * values[i], 0)
    const sumXX = x.reduce((sum, val) => sum + val * val, 0)

    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  }

  // =====================================================
  // DATA PERSISTENCE
  // =====================================================

  private async recordPattern(pattern: RecognizedPattern) {
    // Store in active patterns cache
    this.activePatterns.set(pattern.pattern_id, pattern)

    // Persist to database
    const { error } = await this.supabase
      .from('consciousness_research_patterns')
      .upsert({
        pattern_type: pattern.pattern_type,
        pattern_name: pattern.pattern_name,
        pattern_description: pattern.description,
        occurrence_frequency: 1,
        sessions_observed: [pattern.session_id],
        research_significance: `Confidence: ${(pattern.confidence * 100).toFixed(0)}% - ${pattern.description}`,
        first_observed: pattern.detected_at,
        last_observed: pattern.detected_at
      })

    if (error) {
      console.error('Error recording pattern:', error)
    } else {
      console.log(`Pattern recorded: ${pattern.pattern_name}`)

      // Emit pattern recognition event for real-time updates
      this.emitPatternEvent(pattern)
    }
  }

  private async getSessionEvents(sessionId: string): Promise<ConsciousnessEvent[]> {
    const { data, error } = await this.supabase
      .from('consciousness_events')
      .select('*')
      .eq('session_id', sessionId)
      .order('event_timestamp', { ascending: true })

    return data || []
  }

  // Emit pattern recognition event for real-time dashboard updates
  private emitPatternEvent(pattern: RecognizedPattern) {
    // This would integrate with your real-time event system
    // For example, sending to facilitator dashboard, triggering alerts, etc.
    console.log(`PATTERN DETECTED: ${pattern.pattern_name} (${(pattern.confidence * 100).toFixed(0)}% confidence)`)
  }

  // Get current active patterns for a session
  getActivePatterns(sessionId: string): RecognizedPattern[] {
    return Array.from(this.activePatterns.values()).filter(p => p.session_id === sessionId)
  }

  // Get pattern statistics
  async getPatternStatistics(timeframeDays: number = 30) {
    const { data } = await this.supabase
      .rpc('analyze_consciousness_coherence_patterns', { timeframe_days: timeframeDays })

    return data
  }
}

// =====================================================
// USAGE EXAMPLE AND INTEGRATION
// =====================================================

// Initialize pattern recognition system
export const consciousnessPatternRecognition = new ConsciousnessPatternRecognition()

// Hook for React components
export function useConsciousnessPatternRecognition(sessionId: string | null) {
  const [patterns, setPatterns] = useState<RecognizedPattern[]>([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (!sessionId) return

    let cleanup: (() => void) | undefined

    const startRecognition = async () => {
      const { stopRecognition } = await consciousnessPatternRecognition.startPatternRecognition(sessionId)
      cleanup = stopRecognition
      setIsActive(true)

      // Poll for pattern updates
      const interval = setInterval(() => {
        const activePatterns = consciousnessPatternRecognition.getActivePatterns(sessionId)
        setPatterns(activePatterns)
      }, 2000)

      cleanup = () => {
        stopRecognition()
        clearInterval(interval)
        setIsActive(false)
      }
    }

    startRecognition()

    return () => {
      if (cleanup) cleanup()
    }
  }, [sessionId])

  return { patterns, isActive }
}

export default ConsciousnessPatternRecognition