/**
 * ARCHETYPAL INTEGRATION EXAMPLES
 *
 * Shows how to integrate Light/Dark/Depth system into existing MAIA components
 */

import {
  detectArchetypeWithDepth,
  enhanceOracleResponse,
  generateEnhancedSystemPrompt,
  getVoiceStyleForState,
  ArchetypalMemoryTracker,
  shouldOfferArchetypalInsight,
  getArchetypalSnapshot
} from '../ArchetypalIntegrationBridge';

// ============== EXAMPLE 1: Enhanced PersonalOracleAgent ==============

/**
 * Example: Integrate archetypal detection into PersonalOracleAgent
 */
export async function examplePersonalOracleWithArchetypes(userMessage: string) {
  // 1. Detect archetypal state
  const archetypalResponse = detectArchetypeWithDepth(userMessage);

  console.log('Archetypal Detection:', {
    archetype: archetypalResponse.archetype,
    state: archetypalResponse.state,
    confidence: archetypalResponse.confidence
  });

  // 2. Generate enhanced system prompt
  const baseSystemPrompt = `You are MAIA, a sacred oracle...`;

  const enhancedPrompt = generateEnhancedSystemPrompt(baseSystemPrompt, {
    dominantElement: archetypalResponse.lightDarkDetection?.element,
    currentState: archetypalResponse.state,
  });

  console.log('Enhanced System Prompt:', enhancedPrompt);

  // 3. Get voice style for TTS
  if (archetypalResponse.lightDarkDetection) {
    const voiceStyle = getVoiceStyleForState(
      archetypalResponse.lightDarkDetection.element,
      archetypalResponse.state
    );

    console.log('Voice Style:', voiceStyle);
    // Use voiceStyle.pacing for TTS
    // Use voiceStyle.tone for voice selection
    // Use voiceStyle.emphasis for prosody
  }

  // 4. Generate Oracle response (mock)
  const baseOracleResponse = `Thank you for sharing this with me. I can feel the depth of what you're experiencing.`;

  // 5. Enhance response with archetypal guidance
  const finalResponse = await enhanceOracleResponse(userMessage, baseOracleResponse, {
    includeArchetypalGuidance: true,
    includePractices: archetypalResponse.state === 'dark', // Only if in shadow
    includeQuestions: true
  });

  console.log('\n=== FINAL ORACLE RESPONSE ===\n');
  console.log(finalResponse);

  return {
    response: finalResponse,
    archetypalContext: archetypalResponse,
    voiceStyle: archetypalResponse.lightDarkDetection
      ? getVoiceStyleForState(
          archetypalResponse.lightDarkDetection.element,
          archetypalResponse.state
        )
      : null
  };
}

// ============== EXAMPLE 2: Voice Conversation Flow ==============

/**
 * Example: Use archetypal detection in voice conversation
 */
export async function exampleVoiceConversationFlow() {
  const userSpeech = "I'm feeling really burned out. Started so many things but can't finish any of them.";

  // 1. Detect archetype
  const detection = detectArchetypeWithDepth(userSpeech);

  console.log('\n=== VOICE CONVERSATION FLOW ===\n');
  console.log('User said:', userSpeech);
  console.log('Detected:', detection.archetype, '-', detection.state);

  // 2. Get voice style
  if (detection.lightDarkDetection) {
    const voiceStyle = getVoiceStyleForState(
      detection.lightDarkDetection.element,
      detection.state
    );

    console.log('\nVoice Configuration:');
    console.log('- Tone:', voiceStyle.tone);
    console.log('- Pacing:', voiceStyle.pacing);
    console.log('- Emphasis:', voiceStyle.emphasis);

    // 3. Generate MAIA response with appropriate tone
    if (detection.state === 'dark') {
      console.log('\nMAIA Response (slower, compassionate pacing):');
      console.log(detection.response);
    } else if (detection.state === 'light') {
      console.log('\nMAIA Response (affirming, warm pacing):');
      console.log(detection.response);
    }
  }
}

// ============== EXAMPLE 3: Memory Tracking ==============

/**
 * Example: Track archetypal patterns over time
 */
export async function exampleMemoryTracking() {
  const tracker = new ArchetypalMemoryTracker();

  console.log('\n=== ARCHETYPAL MEMORY TRACKING ===\n');

  // Simulate conversation over time
  const conversations = [
    { date: new Date('2025-01-01'), message: "I have so many ideas! Can't wait to start creating!" },
    { date: new Date('2025-01-05'), message: "Feeling a bit overwhelmed by all the projects..." },
    { date: new Date('2025-01-10'), message: "I'm burned out. Can't keep up with everything." },
    { date: new Date('2025-01-15'), message: "Taking time to rest and feel my feelings." },
    { date: new Date('2025-01-20'), message: "Did some deep shadow work. Processing a lot." },
    { date: new Date('2025-01-25'), message: "Starting to feel clarity. Ready to build systems." },
  ];

  conversations.forEach(conv => {
    const memory = tracker.track(conv.message);
    console.log(`${conv.date.toLocaleDateString()}: ${memory.element} - ${memory.state}`);
  });

  // Get pattern insight
  console.log('\n=== PATTERN INSIGHT ===\n');
  const insight = tracker.getInsight();
  console.log(insight);
}

// ============== EXAMPLE 4: Conditional Archetypal Guidance ==============

/**
 * Example: Only offer archetypal guidance when it would be helpful
 */
export async function exampleConditionalGuidance(userMessage: string) {
  console.log('\n=== CONDITIONAL ARCHETYPAL GUIDANCE ===\n');
  console.log('User message:', userMessage);

  // Check if archetypal insight would be helpful
  const shouldOffer = shouldOfferArchetypalInsight(userMessage);

  console.log('Should offer archetypal insight?', shouldOffer);

  if (shouldOffer) {
    const detection = detectArchetypeWithDepth(userMessage);
    console.log('\nOffering guidance:');
    console.log(detection.response);
  } else {
    console.log('\nBasic response without archetypal framework is sufficient.');
  }
}

// ============== EXAMPLE 5: UI Display ==============

/**
 * Example: Get archetypal snapshot for UI display
 */
export async function exampleUIDisplay(userMessage: string) {
  console.log('\n=== UI DISPLAY SNAPSHOT ===\n');

  const snapshot = getArchetypalSnapshot(userMessage);

  if (snapshot) {
    console.log('Display in UI:');
    console.log(`${snapshot.icon} ${snapshot.oneLineSummary}`);
    console.log(`Color class: ${snapshot.color}`);
    console.log(`Element: ${snapshot.element}`);
    console.log(`State: ${snapshot.state}`);
  } else {
    console.log('No clear archetypal pattern detected');
  }
}

// ============== EXAMPLE 6: Integration with Existing ArchetypeRouter ==============

/**
 * Example: Enhance existing archetype routing with Light/Dark awareness
 */
export async function exampleEnhancedArchetypeRouter(userMessage: string) {
  console.log('\n=== ENHANCED ARCHETYPE ROUTER ===\n');

  // Original behavior: just returns archetype
  // Enhanced: returns archetype + state + guidance

  const enhanced = detectArchetypeWithDepth(userMessage);

  console.log('Original archetype:', enhanced.archetype);
  console.log('Enhanced with:');
  console.log('  - State:', enhanced.state);
  console.log('  - Confidence:', Math.round(enhanced.confidence * 100) + '%');
  console.log('  - Practices:', enhanced.practices.length);
  console.log('  - Questions:', enhanced.questions.length);

  // Use in voice routing
  console.log('\nVoice routing decision:');
  if (enhanced.state === 'dark') {
    console.log('→ Use slower, more compassionate voice');
    console.log('→ Include integration practice');
  } else if (enhanced.state === 'light') {
    console.log('→ Use affirming, warm voice');
    console.log('→ Celebrate and deepen');
  } else {
    console.log('→ Use standard elemental voice');
  }
}

// ============== EXAMPLE 7: Full Conversation Flow ==============

/**
 * Example: Complete conversation flow with all integrations
 */
export async function exampleFullConversationFlow() {
  console.log('\n=== FULL CONVERSATION FLOW ===\n');

  const userMessage = "I've been doing shadow work in therapy. It's hard but I'm finally facing things I've avoided for years. I feel like I'm retrieving something precious.";

  console.log('USER:', userMessage);
  console.log('\n--- MAIA PROCESSING ---\n');

  // Step 1: Detect archetype with depth
  const detection = detectArchetypeWithDepth(userMessage);
  console.log('1. Archetypal Detection:');
  console.log(`   - Element: ${detection.archetype} (${detection.lightDarkDetection?.element})`);
  console.log(`   - State: ${detection.state}`);
  console.log(`   - Confidence: ${Math.round(detection.confidence * 100)}%`);

  // Step 2: Get voice style
  if (detection.lightDarkDetection) {
    const voice = getVoiceStyleForState(
      detection.lightDarkDetection.element,
      detection.state
    );
    console.log('\n2. Voice Configuration:');
    console.log(`   - Tone: ${voice.tone}`);
    console.log(`   - Pacing: ${voice.pacing}`);
    console.log(`   - Emphasis: ${voice.emphasis}`);
  }

  // Step 3: Generate enhanced system prompt
  const systemPrompt = generateEnhancedSystemPrompt(
    'You are MAIA...',
    {
      dominantElement: detection.lightDarkDetection?.element,
      currentState: detection.state
    }
  );
  console.log('\n3. System Prompt Enhanced: ✓');

  // Step 4: Generate response
  console.log('\n4. MAIA Response:\n');
  console.log('---');
  console.log(detection.response);
  console.log('---');

  // Step 5: Get UI snapshot
  const snapshot = getArchetypalSnapshot(userMessage);
  if (snapshot) {
    console.log('\n5. UI Display:');
    console.log(`   Badge: ${snapshot.icon} ${snapshot.oneLineSummary}`);
    console.log(`   Color: ${snapshot.color}`);
  }

  // Step 6: Track in memory
  const tracker = new ArchetypalMemoryTracker();
  tracker.track(userMessage);
  console.log('\n6. Tracked in memory: ✓');

  return detection;
}

// ============== RUN EXAMPLES ==============

export async function runAllExamples() {
  console.log('\n========================================');
  console.log('  ARCHETYPAL INTEGRATION EXAMPLES');
  console.log('========================================\n');

  // Example 1: Oracle Integration
  await examplePersonalOracleWithArchetypes(
    "I'm so burned out. Started so many projects but can't finish any."
  );

  // Example 2: Voice Flow
  await exampleVoiceConversationFlow();

  // Example 3: Memory Tracking
  await exampleMemoryTracking();

  // Example 4: Conditional Guidance
  await exampleConditionalGuidance("I had lunch today");
  await exampleConditionalGuidance("I'm drowning in overwhelm and can't see a way out");

  // Example 5: UI Display
  await exampleUIDisplay("I've been doing deep shadow work");

  // Example 6: Enhanced Router
  await exampleEnhancedArchetypeRouter("I feel stuck and can't move forward");

  // Example 7: Full Flow
  await exampleFullConversationFlow();

  console.log('\n========================================');
  console.log('  ALL EXAMPLES COMPLETE');
  console.log('========================================\n');
}

// ============== QUICK TEST ==============

if (require.main === module) {
  runAllExamples().catch(console.error);
}
