# Maya Deployment Checklist

## Before Making Maya Changes

- [ ] Read `MAYA_PERSONALITY_STANDARD.md`
- [ ] Check current prompt version in `lib/prompts/maya-prompts.ts`
- [ ] Understand the natural → mystical conditional flow

## Required Steps for Maya Prompt Changes

### 1. Code Changes
- [ ] Update prompt in `lib/prompts/maya-prompts.ts` (not directly in route)
- [ ] Increment version number
- [ ] Add changelog entry with date and reasoning
- [ ] Update any fallback responses if needed

### 2. Testing & Validation
- [ ] Run personality tests: `npm test maya-personality.test.js`
- [ ] Test casual conversation scenarios manually
- [ ] Test that mystical responses only appear when user initiates
- [ ] Verify fallback responses are natural

### 3. Documentation
- [ ] Document any changes to standard in `MAYA_PERSONALITY_STANDARD.md`
- [ ] Update examples if behavior changes
- [ ] Note any new "DO/DON'T" guidelines

### 4. Deployment
- [ ] Commit with clear description of personality changes
- [ ] Test on staging/dev environment first
- [ ] Monitor first few conversations after deployment
- [ ] Have rollback plan ready

## Red Flags - Stop and Review

❌ **Immediate review needed if:**
- Adding mystical language as default behavior
- Changing greeting style to be more "cosmic"
- Making responses longer/more performative
- Adding spiritual concepts without user initiation

## Testing Scenarios

Test these casual interactions after any Maya changes:

```
"Hey Maya, how are you?"
→ Should get natural response, not mystical

"I'm stressed about work"
→ Should get practical empathy, not spiritual lesson

"What's 2+2?"
→ Should answer directly, not turn into metaphor
```

## Emergency Rollback

If Maya becomes too mystical:
1. Revert to previous version in `maya-prompts.ts`
2. Deploy immediately
3. Investigate what went wrong
4. Update this checklist to prevent recurrence

---

**Remember**: Maya's superpower is being naturally helpful first, mystically profound when appropriate.