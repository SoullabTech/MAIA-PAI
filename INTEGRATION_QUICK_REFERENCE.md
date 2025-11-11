# MAIA Integration - Quick Reference Guide

## The Problem in 30 Seconds

MAIA has incredible systems that don't talk to each other:
- **ArchetypalTypologyAgent** analyzes personality types but MAIA doesn't use it
- **Soulprint** tracks elements and archetypes but ignores personality type
- **Journal** system exists but doesn't inform personality confidence
- **Daimonic Agent framework** sits unused for MAIA's main voice

Result: MAIA treats all users similarly, missing huge personalization opportunities.

## The Solution in 30 Seconds

Wire the systems together:
1. Load personality profile + soulprint + journal themes at conversation start
2. Include personality info in system prompt (type, growth edge, communication style)
3. Adapt response depth/tone based on detected type and preferences
4. Update all profiles after each conversation
5. Give MAIA its own personality using the Daimonic framework

## Key Files to Understand

| File | What It Does | Integration Role |
|------|-------------|-----------------|
| `apps/api/backend/src/agents/ArchetypalTypologyAgent.ts` | Analyzes personality types | **Source of type data (needs to be used)** |
| `lib/memory/soulprint.ts` | Tracks element + archetypes | **Needs personality type data added** |
| `apps/api/backend/src/memory/journalMemory.ts` | Retrieves journal entries | **Should analyze for personality indicators** |
| `app/api/oracle/personal/route.ts` | Main MAIA endpoint | **Needs to load and use all data** |
| `apps/api/backend/src/core/AgentBase.ts` | Daimonic personality framework | **Template for MAIA personality** |

## 8 Opportunities Ranked by Impact

### HIGH IMPACT (Do First)
1. **Load Personality Profile in MAIA** (1-2 days)
   - Add personality loading to `/api/oracle/personal/route.ts`
   - Include in context sent to response generation
   - Test with existing conversations

2. **Add Type to System Prompt** (1-2 days)
   - Include user's Enneagram + MBTI in prompt
   - Add communication style guidance
   - Add growth path information

3. **Update Personality After Each Chat** (1 day)
   - Analyze response for type indicators
   - Update confidence scores
   - Track evidence in progressiveProfiling

### MEDIUM IMPACT (Do Second)
4. **Analyze Journal for Personality** (2-3 days)
   - When journal entry saved, extract type indicators
   - Update personality profile from journal analysis
   - Weight journal evidence in confidence scoring

5. **Enhance Soulprint with Type Data** (2-3 days)
   - Add personality type tracking to SoulprintSnapshot
   - Track type history over time
   - Add growth metrics (type mobility, element stability)

6. **Enrich Session Context** (1-2 days)
   - Create EnrichedSessionContext interface
   - Populate with personality + journal + growth data
   - Pass to all response generation

### LOWER IMPACT (Nice to Have)
7. **Type Refinement Conversation** (2-3 days)
   - After 10+ interactions, MAIA asks clarifying questions
   - Updates confidence scores based on feedback
   - Improves downstream personalization

8. **Coherence Dashboard** (3-4 days)
   - New endpoint showing system alignment
   - Visualizes type-element-journal correlation
   - Helpful for debugging and validation

## Implementation Checklist

### Phase 1 (Week 1-2): Foundation
- [ ] Understand current ArchetypalTypologyAgent output format
- [ ] Create PersonalityIntegrationService to load profiles
- [ ] Modify `/api/oracle/personal/route.ts` to load personality
- [ ] Extract communicationGuidance from profile
- [ ] Add to system prompt
- [ ] Test with sample conversations

### Phase 2 (Week 3-4): Memory Connection
- [ ] Create JournalPersonalityIntegration service
- [ ] Analyze journal entries for type indicators
- [ ] Update personality from journal
- [ ] Enhance SoulprintSnapshot with personality type
- [ ] Create typeElementMap tracking
- [ ] Update on each conversation

### Phase 3 (Week 5-6): Personalization
- [ ] Expand system prompt with personality sections
- [ ] Implement depth/breadth adjustment
- [ ] Implement communication style application
- [ ] Test with different types
- [ ] Iterate on prompt language

### Phase 4 (Week 7-8): MAIA Character
- [ ] Define MAIA's AgentPersonality
- [ ] Configure resistance patterns
- [ ] Define gifts and blind spots
- [ ] Integrate into response generation
- [ ] Test for authenticity

### Phase 5 (Week 9-10): Advanced
- [ ] Type refinement conversation flow
- [ ] Coherence analysis service
- [ ] Dashboard visualization
- [ ] Production testing

## Code Patterns to Implement

### Pattern 1: Load Enriched Context
```typescript
// In /api/oracle/personal/route.ts
const [soulprint, personality, journalThemes] = await Promise.all([
  getSoulprintForUser(userId),
  loadPersonalityProfile(userId),  // NEW
  searchJournalThemes(userId, 5)    // NEW
]);

const enrichedContext = {
  soulprint,
  personality,
  journalThemes,
  communicationMode: personality?.conversationalPatterns?.style,
  depthPreference: personality?.conversationalPatterns?.depth,
  growthEdge: personality?.spiralEvolution?.nextPhase
};
```

### Pattern 2: Include in System Prompt
```typescript
const systemPrompt = `
...existing prompt...

## User's Personality Profile
- Enneagram Type: ${personality.enneagram.type}
- MBTI: ${personality.mbti.type}
- Communication Style: ${personality.conversationalPatterns.style}
- Current Phase: ${personality.elementalMapping.currentPhase}
- Growth Edge: ${personality.spiralEvolution.nextPhase}

Adapt your communication to their style while maintaining authenticity.
`;
```

### Pattern 3: Update After Response
```typescript
// After generating response
const updatedPersonality = await archetypalTypologyService.processInput(
  userMessage,
  userId,
  { personalityProfile: personality }
);

// Save updated profile
await savePersonalityProfile(updatedPersonality);

// Update soulprint if needed
if (updatedPersonality.spiralEvolution.currentPhase !== soulprint.dominantElement) {
  soulprint.personalityTypes = updatedPersonality;
  await saveSoulprintSnapshot(soulprint);
}
```

## Success Metrics

Track these to know if integration is working:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Profile Load Rate | 100% | Check logs for successful loads |
| Type Confidence Growth | 0.3 → 0.8 over 10 conversations | Track confidence score changes |
| System Prompt Variation | 80%+ use personality | Analyze prompts sent to Claude |
| User Feedback | "Feel seen" mentioned | Survey after updates |
| Response Personalization | 70%+ personalized | Human review sample |

## Common Mistakes to Avoid

1. **Stereotyping by Type**
   - Always use "I notice..." not "As a Type 4, you..."
   - Invite correction and calibration
   - Remember person transcends type

2. **False Confidence**
   - Don't claim high confidence until 10+ evidence pieces
   - Decay confidence if no recent supporting evidence
   - Require user confirmation for major type claims

3. **Journal Privacy**
   - Only analyze with explicit opt-in
   - Show what was extracted
   - Let users block certain entries

4. **Over-Personalization**
   - Personalization should enhance, not limit
   - Keep offering some variety
   - Don't use type to excuse problems

## Quick Debugging

### "Personality not loading"
1. Check that personality profile exists in storage
2. Verify userId is being passed correctly
3. Check PersonalityIntegrationService.loadProfile() logs

### "Type not showing in response"
1. Verify personality was added to system prompt
2. Check prompt template includes ${personality.enneagram.type}
3. Look at actual prompt sent to Claude

### "Confidence not increasing"
1. Check that analysis is running after response
2. Verify evidence is being added to progressiveProfiling
3. Check confidence score calculation logic

### "Journal not informing personality"
1. Verify journal analysis is enabled
2. Check that type indicators are being extracted
3. Verify personality update is being called

## Resources in This Project

- `MAIA_INTEGRATION_ANALYSIS.md` - Full 7-part analysis
- `MAIA_INTEGRATION_VISUAL_SUMMARY.md` - Visual architecture
- `CLAUDE.md` - Project philosophy and principles
- `/apps/api/backend/src/agents/ArchetypalTypologyAgent.ts` - Type detection logic
- `/lib/memory/soulprint.ts` - Element/archetype tracking

## Timeline Estimate

- Phase 1 (Load + System Prompt): 1 week
- Phase 2 (Memory Connection): 1 week  
- Phase 3 (Personalization): 1-2 weeks
- Phase 4 (MAIA Character): 1-2 weeks
- Phase 5 (Advanced): 1 week
- Testing/Refinement: 1-2 weeks

**Total: 6-9 weeks to full integration**

Can be done incrementally—Phase 1 alone delivers real value.

## Next Steps

1. Read `MAIA_INTEGRATION_ANALYSIS.md` (detailed understanding)
2. Read `MAIA_INTEGRATION_VISUAL_SUMMARY.md` (architecture picture)
3. Review the three key files (Typology, Soulprint, Oracle)
4. Start with Phase 1: Load personality + add to prompt
5. Test and iterate before moving to Phase 2

---

**Questions?** Check the detailed analysis documents or review the specific file implementations mentioned above.
