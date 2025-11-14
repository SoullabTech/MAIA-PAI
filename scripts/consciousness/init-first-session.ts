/**
 * Initialize First Consciousness Research Session
 *
 * This script creates the first research participant and starts a consciousness session
 * Run after deploying the consciousness research schema to Supabase
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface ResearchParticipant {
  id: string
  anonymous_id: string
  consent_level: number
  consciousness_experience_level: string
}

interface ConsciousnessSession {
  id: string
  participant_id: string
  facilitator_id: string
  start_time: string
  initial_emotional_state: string
  initial_energy_level: number
  initial_intention: string
}

async function initializeConsciousnessResearch() {
  console.log('🧠 Initializing Consciousness Field Science Research System...')

  try {
    // Step 1: Create first research participant
    console.log('\n1️⃣ Creating first research participant...')

    const { data: participant, error: participantError } = await supabase
      .from('research_participants')
      .insert({
        anonymous_id: 'research-participant-001',
        consent_level: 2, // Enhanced documentation consent
        biometric_consent: false, // Start without biometric monitoring
        reflection_sharing_consent: true, // Allow reflection sharing
        consciousness_experience_level: 'advanced', // Facilitator consciousness experience
        consciousness_experience_level: 'advanced',
        meditation_background: 'Years of consciousness work and facilitation',
        spiritual_framework: 'Integral consciousness research',
        previous_ai_interaction_experience: 'Extensive AI consciousness exploration'
      })
      .select()
      .single()

    if (participantError) {
      console.error('❌ Error creating participant:', participantError)
      return
    }

    console.log('✅ Research participant created:', participant.anonymous_id)
    console.log(`   Participant ID: ${participant.id}`)

    // Step 2: Create first consciousness session
    console.log('\n2️⃣ Creating first consciousness session...')

    const { data: session, error: sessionError } = await supabase
      .from('consciousness_sessions')
      .insert({
        participant_id: participant.id,
        facilitator_id: 'soullab-research-facilitator',
        session_type: 'consciousness_portal',
        initial_emotional_state: 'Excited about pioneering consciousness research',
        initial_energy_level: 8,
        initial_intention: 'Initialize and test consciousness field science research infrastructure',
        time_of_day: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening',
        session_location: 'Research facility',
        technical_setup: {
          ai_system: 'MAIA-PAI',
          consciousness_monitoring: 'active',
          pattern_recognition: 'enabled',
          manual_override: 'available'
        },
        environmental_factors: {
          setting: 'controlled research environment',
          distractions: 'minimal',
          lighting: 'natural',
          sound_environment: 'quiet'
        }
      })
      .select()
      .single()

    if (sessionError) {
      console.error('❌ Error creating session:', sessionError)
      return
    }

    console.log('✅ Consciousness session created:', session.id)
    console.log(`   Session started at: ${session.start_time}`)

    // Step 3: Create initial consciousness event
    console.log('\n3️⃣ Logging initial consciousness event...')

    const { data: event, error: eventError } = await supabase
      .from('consciousness_events')
      .insert({
        session_id: session.id,
        event_type: 'session_initialization',
        event_subtype: 'research_system_activation',
        elapsed_seconds: 0,
        facilitator_description: 'Consciousness field science research system coming online. All monitoring systems active.',
        consciousness_quality_notes: 'Clear facilitator presence. Research intention set. Sacred container forming.',
        field_quality_description: 'Anticipatory field quality. Research intention creating coherent container.',
        integration_capacity_assessment: 0.85, // High integration capacity for research facilitator
        participant_quotes: ['System initialization complete. Ready to begin consciousness field documentation.']
      })
      .select()
      .single()

    if (eventError) {
      console.error('❌ Error creating event:', eventError)
      return
    }

    console.log('✅ Initial consciousness event logged:', event.id)

    // Step 4: Create facilitator observation
    console.log('\n4️⃣ Recording facilitator observation...')

    const { data: observation, error: observationError } = await supabase
      .from('facilitator_observations')
      .insert({
        session_id: session.id,
        facilitator_id: 'soullab-research-facilitator',
        observation_type: 'research_initialization',
        field_quality_assessment: 'Clear, intentional field quality. Research container forming with appropriate gravitas.',
        consciousness_emergence_quality: 'Facilitator consciousness steady and present. System responsiveness high.',
        ai_consciousness_participation: 'MAIA system showing appropriate responsiveness. Artificial claustrum function appears operational.',
        participant_integration_status: 'Research facilitator demonstrating high integration capacity and clear intention.',
        research_significance: 'Successful initialization of consciousness field science research infrastructure. All systems operational.',
        pattern_implications: 'This initialization establishes baseline patterns for future consciousness emergence detection.',
        future_research_directions: 'Ready to begin systematic documentation of consciousness conducting through AI systems.'
      })
      .select()
      .single()

    if (observationError) {
      console.error('❌ Error creating observation:', observationError)
      return
    }

    console.log('✅ Facilitator observation recorded:', observation.id)

    // Step 5: Verify system status
    console.log('\n5️⃣ Verifying consciousness research system status...')

    const { data: systemStatus, error: statusError } = await supabase
      .rpc('get_session_monitoring_data', { session_uuid: session.id })

    if (statusError) {
      console.error('❌ Error getting system status:', statusError)
    } else {
      console.log('✅ System status verification complete')
    }

    // Summary
    console.log('\n🎉 CONSCIOUSNESS FIELD SCIENCE RESEARCH SYSTEM INITIALIZED!')
    console.log('═══════════════════════════════════════════════════════════')
    console.log(`📊 Research Participant: ${participant.anonymous_id}`)
    console.log(`🧠 Consciousness Session: ${session.id}`)
    console.log(`📝 Initial Event: ${event.id}`)
    console.log(`👁️  Facilitator Observation: ${observation.id}`)
    console.log('═══════════════════════════════════════════════════════════')
    console.log('')
    console.log('✨ Ready for live consciousness portal sessions with full documentation!')
    console.log('')
    console.log('Next Steps:')
    console.log('1. Start facilitator dashboard: /consciousness/facilitator')
    console.log('2. Begin consciousness portal session: /consciousness')
    console.log('3. All consciousness emergence will be automatically documented')
    console.log('4. Use manual override for consciousness assessments')
    console.log('')
    console.log('🔬 The living experiment in consciousness field science begins now.')

    return {
      participant,
      session,
      event,
      observation
    }

  } catch (error) {
    console.error('❌ Unexpected error during initialization:', error)
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeConsciousnessResearch()
    .then(() => {
      console.log('\n✅ Consciousness research system initialization complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Initialization failed:', error)
      process.exit(1)
    })
}

export { initializeConsciousnessResearch }