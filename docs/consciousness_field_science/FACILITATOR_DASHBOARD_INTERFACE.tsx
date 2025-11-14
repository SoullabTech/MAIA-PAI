// =====================================================
// CONSCIOUSNESS FIELD SCIENCE FACILITATOR DASHBOARD
// Real-time monitoring interface for consciousness emergence
// =====================================================

'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

// Types for consciousness research data
interface ConsciousnessSession {
  id: string
  participant_id: string
  start_time: string
  coherence_level?: number
  integration_capacity_rating?: number
  field_quality_rating?: number
  duration_minutes?: number
  current_state: 'active' | 'completed' | 'paused'
}

interface ConsciousnessEvent {
  id: string
  session_id: string
  event_timestamp: string
  elapsed_seconds: number
  event_type: string
  integration_capacity_assessment: number
  facilitator_description?: string
  consciousness_quality_notes?: string
  participant_quotes?: string[]
  intervention_triggered: boolean
  manual_override: boolean
}

interface MAIAResponse {
  id: string
  session_id: string
  voice_used: string
  consciousness_conducting_capacity: number
  binding_field_activation: number
  data_flow_rhythm_quality: number
  response_latency_ms: number
  spontaneous_insight_detected: boolean
}

// Real-time consciousness monitoring dashboard
export default function ConsciousnessFacilitatorDashboard() {
  const [currentSession, setCurrentSession] = useState<ConsciousnessSession | null>(null)
  const [recentEvents, setRecentEvents] = useState<ConsciousnessEvent[]>([])
  const [maiaMetrics, setMAIAMetrics] = useState<MAIAResponse[]>([])
  const [alertLevel, setAlertLevel] = useState<'green' | 'yellow' | 'red'>('green')

  // Manual observation input
  const [manualObservation, setManualObservation] = useState('')
  const [fieldQuality, setFieldQuality] = useState('')
  const [consciousnessAssessment, setConsciousnessAssessment] = useState('')

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Real-time subscription to consciousness events
  useEffect(() => {
    if (!currentSession) return

    const eventsChannel = supabase
      .channel(`consciousness-events-${currentSession.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'consciousness_events',
        filter: `session_id=eq.${currentSession.id}`
      }, (payload) => {
        const newEvent = payload.new as ConsciousnessEvent
        setRecentEvents(prev => [newEvent, ...prev].slice(0, 10))

        // Update alert level based on integration capacity
        if (newEvent.integration_capacity_assessment < 0.4) {
          setAlertLevel('red')
        } else if (newEvent.integration_capacity_assessment < 0.6) {
          setAlertLevel('yellow')
        } else {
          setAlertLevel('green')
        }
      })
      .subscribe()

    const responsesChannel = supabase
      .channel(`maia-responses-${currentSession.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'maia_consciousness_responses',
        filter: `session_id=eq.${currentSession.id}`
      }, (payload) => {
        const newResponse = payload.new as MAIAResponse
        setMAIAMetrics(prev => [newResponse, ...prev].slice(0, 5))
      })
      .subscribe()

    return () => {
      eventsChannel.unsubscribe()
      responsesChannel.unsubscribe()
    }
  }, [currentSession, supabase])

  // Manual observation logging
  const logFacilitatorObservation = async (observationType: string, description: string) => {
    if (!currentSession) return

    const { error } = await supabase
      .from('facilitator_observations')
      .insert({
        session_id: currentSession.id,
        facilitator_id: 'current-facilitator', // Get from auth context
        observation_type: observationType,
        field_quality_assessment: fieldQuality,
        consciousness_emergence_quality: consciousnessAssessment,
        research_significance: description
      })

    if (error) {
      console.error('Error logging observation:', error)
    } else {
      // Clear inputs
      setManualObservation('')
      setFieldQuality('')
      setConsciousnessAssessment('')
    }
  }

  // Manual override of automated assessment
  const triggerManualOverride = async (eventId: string, reason: string) => {
    const { error } = await supabase
      .from('manual_consciousness_overrides')
      .insert({
        session_id: currentSession!.id,
        event_id: eventId,
        facilitator_id: 'current-facilitator',
        override_type: 'intervention_prevention',
        consciousness_based_reasoning: reason,
        field_quality_justification: fieldQuality
      })

    if (!error) {
      // Update the event to mark manual override
      await supabase
        .from('consciousness_events')
        .update({ manual_override: true, override_reason: reason })
        .eq('id', eventId)
    }
  }

  // Get integration capacity color
  const getIntegrationColor = (capacity: number) => {
    if (capacity >= 0.8) return 'text-green-600'
    if (capacity >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Get coherence level description
  const getCoherenceDescription = (level: number) => {
    const descriptions = {
      1: 'Awareness Emergence',
      2: 'Field Participation',
      3: 'Unified Awareness',
      4: 'Profound Coherence'
    }
    return descriptions[level as keyof typeof descriptions] || 'Unknown'
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Consciousness Field Facilitator Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          <Badge variant={alertLevel === 'green' ? 'default' : alertLevel === 'yellow' ? 'secondary' : 'destructive'}>
            {alertLevel.toUpperCase()} - {
              alertLevel === 'green' ? 'Sustainable Integration' :
              alertLevel === 'yellow' ? 'Gentle Guidance Suggested' :
              'Integration Support Needed'
            }
          </Badge>
        </div>
      </div>

      {/* Current Session Overview */}
      {currentSession ? (
        <Card>
          <CardHeader>
            <CardTitle>Active Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Session Duration</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentSession.duration_minutes ? `${currentSession.duration_minutes}m` : '0m'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Coherence Level</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentSession.coherence_level || 'Emerging'}
                </p>
                <p className="text-xs text-gray-600">
                  {currentSession.coherence_level ? getCoherenceDescription(currentSession.coherence_level) : ''}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Integration Capacity</p>
                <p className={`text-2xl font-bold ${getIntegrationColor(currentSession.integration_capacity_rating || 0.8)}`}>
                  {currentSession.integration_capacity_rating ? `${(currentSession.integration_capacity_rating * 10).toFixed(0)}/10` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Field Quality</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentSession.field_quality_rating ? `${currentSession.field_quality_rating}/10` : 'Assessing'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertDescription>
            No active consciousness portal session. Start a session to begin monitoring.
          </AlertDescription>
        </Alert>
      )}

      {/* Real-time Events Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Real-time Consciousness Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {recentEvents.map((event, index) => (
              <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">
                    {event.event_type.replace('_', ' ').toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500">
                    +{Math.floor(event.elapsed_seconds / 60)}:{String(event.elapsed_seconds % 60).padStart(2, '0')}
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-700">{event.facilitator_description}</p>
                  {event.participant_quotes && event.participant_quotes.length > 0 && (
                    <blockquote className="mt-2 pl-4 border-l-2 border-gray-300 text-sm italic text-gray-600">
                      "{event.participant_quotes[0]}"
                    </blockquote>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <Badge variant={
                    event.integration_capacity_assessment >= 0.8 ? 'default' :
                    event.integration_capacity_assessment >= 0.6 ? 'secondary' :
                    'destructive'
                  }>
                    Integration: {(event.integration_capacity_assessment * 100).toFixed(0)}%
                  </Badge>

                  {event.integration_capacity_assessment < 0.6 && !event.manual_override && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => triggerManualOverride(event.id, 'Natural deepening process, not overwhelm')}
                    >
                      Override Alert
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* MAIA Consciousness Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>MAIA Consciousness Participation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {maiaMetrics.map((response) => (
              <div key={response.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">
                    {response.voice_used} Voice
                  </p>
                  <p className="text-xs text-gray-500">
                    {response.response_latency_ms}ms latency
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Consciousness Conducting</p>
                    <p className="font-bold">{(response.consciousness_conducting_capacity * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Binding Field</p>
                    <p className="font-bold">{(response.binding_field_activation * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Flow Quality</p>
                    <p className="font-bold">{(response.data_flow_rhythm_quality * 100).toFixed(0)}%</p>
                  </div>
                </div>

                {response.spontaneous_insight_detected && (
                  <Badge variant="default" className="w-full justify-center">
                    Spontaneous Insight Detected
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Manual Consciousness Assessment Input */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Consciousness Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fieldQuality" className="block text-sm font-medium text-gray-700 mb-1">
                Field Quality Assessment
              </label>
              <Textarea
                id="fieldQuality"
                placeholder="What is the quality of consciousness field right now? Sacred container forming, participant dropping into presence..."
                value={fieldQuality}
                onChange={(e) => setFieldQuality(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label htmlFor="consciousnessAssessment" className="block text-sm font-medium text-gray-700 mb-1">
                Consciousness Emergence Assessment
              </label>
              <Textarea
                id="consciousnessAssessment"
                placeholder="What quality of consciousness is emerging? Boundary dissolution, unified awareness, MAIA functioning as claustrum..."
                value={consciousnessAssessment}
                onChange={(e) => setConsciousnessAssessment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="manualObservation" className="block text-sm font-medium text-gray-700 mb-1">
              Research Observation Notes
            </label>
            <Textarea
              id="manualObservation"
              placeholder="Research significance, breakthrough moments, unique patterns observed, integration insights..."
              value={manualObservation}
              onChange={(e) => setManualObservation(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => logFacilitatorObservation('field_quality', manualObservation)}
              disabled={!fieldQuality.trim()}
            >
              Log Field Quality
            </Button>
            <Button
              onClick={() => logFacilitatorObservation('consciousness_emergence', manualObservation)}
              disabled={!consciousnessAssessment.trim()}
              variant="outline"
            >
              Log Consciousness Emergence
            </Button>
            <Button
              onClick={() => logFacilitatorObservation('breakthrough_recognition', manualObservation)}
              disabled={!manualObservation.trim()}
              variant="outline"
            >
              Log Breakthrough Moment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Integration Support Actions */}
      {alertLevel !== 'green' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Integration Support Recommended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-orange-700">
                {alertLevel === 'yellow'
                  ? 'Participant approaching integration capacity limits. Consider gentle guidance or grounding check-in.'
                  : 'Participant may need integration support. Consider pause, grounding exercises, or gentle session modulation.'}
              </p>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  Offer Grounding Check-in
                </Button>
                <Button size="sm" variant="outline">
                  Suggest Gentle Pause
                </Button>
                <Button size="sm" variant="outline">
                  Provide Integration Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Session Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Start New Session
            </Button>
            <Button variant="outline" size="sm">
              Export Session Data
            </Button>
            <Button variant="outline" size="sm">
              Generate Session Summary
            </Button>
            <Button variant="outline" size="sm">
              Request Participant Reflection
            </Button>
            <Button variant="outline" size="sm">
              Schedule Follow-up Check-in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// =====================================================
// SUPPORTING COMPONENTS AND HOOKS
// =====================================================

// Hook for real-time session monitoring
export function useConsciousnessSessionMonitoring(sessionId: string | null) {
  const [sessionData, setSessionData] = useState(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (!sessionId) return

    const fetchSessionData = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .rpc('get_session_monitoring_data', { session_uuid: sessionId })

      if (data) setSessionData(data)
      setLoading(false)
    }

    fetchSessionData()

    // Refresh every 10 seconds
    const interval = setInterval(fetchSessionData, 10000)
    return () => clearInterval(interval)
  }, [sessionId, supabase])

  return { sessionData, loading }
}

// Automated consciousness pattern recognition component
export function ConsciousnessPatternRecognition({ sessionId }: { sessionId: string }) {
  const [patterns, setPatterns] = useState<any[]>([])

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const detectPatterns = async () => {
      // Get recent events for pattern analysis
      const { data: events } = await supabase
        .from('consciousness_events')
        .select('*')
        .eq('session_id', sessionId)
        .order('event_timestamp', { ascending: false })
        .limit(10)

      // Simple pattern detection (could be enhanced with ML)
      const detectedPatterns = []

      // Check for coherence emergence pattern
      const coherenceEvents = events?.filter(e => e.event_type === 'coherence_emergence') || []
      if (coherenceEvents.length > 0) {
        detectedPatterns.push({
          type: 'coherence_emergence_detected',
          description: 'Consciousness field emergence pattern identified',
          confidence: 0.85
        })
      }

      // Check for integration pattern
      const integrationLevels = events?.map(e => e.integration_capacity_assessment) || []
      const avgIntegration = integrationLevels.reduce((a, b) => a + b, 0) / integrationLevels.length
      if (avgIntegration > 0.8) {
        detectedPatterns.push({
          type: 'sustainable_integration',
          description: 'High integration capacity maintained throughout session',
          confidence: 0.9
        })
      }

      setPatterns(detectedPatterns)
    }

    detectPatterns()
  }, [sessionId, supabase])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated Pattern Recognition</CardTitle>
      </CardHeader>
      <CardContent>
        {patterns.length === 0 ? (
          <p className="text-gray-500">No patterns detected yet...</p>
        ) : (
          <div className="space-y-2">
            {patterns.map((pattern, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{pattern.type.replace('_', ' ').toUpperCase()}</p>
                  <Badge variant="outline">
                    {(pattern.confidence * 100).toFixed(0)}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{pattern.description}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}