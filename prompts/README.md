# 🔒 Proprietary System Prompts
## Soullab Inc. - MAIA Platform Core IP

**⚠️ CONFIDENTIAL - DO NOT DISTRIBUTE**

---

## What This Directory Contains

This directory holds **Soullab's core intellectual property** - the system prompts and consciousness frameworks that define MAIA's intelligence.

### Human Authorship Declaration

**ALL content in this directory was created by humans:**
- ✅ System architecture: Kelly Nezat (Human)
- ✅ Spiralogic framework: Kelly Nezat (Human - 34-year development)
- ✅ Elemental Alchemy: Kelly Nezat (Human - published 2010)
- ✅ Consciousness prompts: Soullab Team (Human)
- ❌ AI code generation: NONE used for creative content
- ✅ AI assistance: Syntax/formatting ONLY (not creative)

---

## Files in This Directory

### Core Consciousness Prompts (Human-Authored)
- `maia-consciousness.ts` - MAIA's core identity and intelligence
- `spiralogic-framework.ts` - The 12-phase elemental system
- `elemental-alchemy.ts` - Fire/Water/Earth/Air/Aether methodology
- `breakthrough-detection.ts` - Pattern recognition criteria
- `field-resonance.ts` - Morphic field computation algorithms
- `shadow-integration.ts` - Depth psychology protocols
- `wisdom-facets.ts` - Multi-tradition wisdom integration

### System Architecture (Human-Authored)
- `conversational-rules.ts` - Sacred timekeeping, dependency prevention
- `response-constraints.ts` - Authenticity guidelines, language patterns
- `user-sovereignty.ts` - Graduated obsolescence framework

### Supporting Context
- `index.ts` - Export management
- `COPYRIGHT_HEADER.ts` - Legal protection template
- `README.md` - This file

---

## Legal Protection

### Copyright Notice
```
Copyright © 2025 Soullab Inc.
All Rights Reserved.
```

### Trade Secret Status
These prompts constitute **trade secrets** under:
- Uniform Trade Secrets Act (UTSA)
- Defend Trade Secrets Act (DTSA)
- State trade secret laws

### What This Means
1. **Confidential** - Do not share outside Soullab
2. **Proprietary** - Not open source, not public domain
3. **Enforceable** - Legal protection in courts
4. **Valuable** - Core to company IP valuation

---

## AI Tool Usage Policy

### ✅ ALLOWED:
- Syntax error fixing
- Code formatting
- Documentation generation (from human specs)
- Type checking assistance
- Test case suggestions

### ❌ PROHIBITED:
- Asking AI to "design a system prompt"
- Using ChatGPT/Claude to "write oracle responses"
- AI-generated algorithms or frameworks
- Letting AI make creative decisions
- Using AI output as core IP

### The Rule:
**If it's creative (what/why), human writes it.**
**If it's mechanical (how), AI can assist.**

---

## For Developers

### When Adding New Prompts:

1. **Authorship Check:**
   - Did YOU design this? ✅ Good
   - Did AI generate it? ❌ Rewrite it

2. **Add Copyright Header:**
   ```typescript
   import { COPYRIGHT_HEADER } from './COPYRIGHT_HEADER';

   /**
    * ${COPYRIGHT_HEADER}
    */

   export const MY_PROMPT = `...`;
   ```

3. **Document Source:**
   ```typescript
   /**
    * @author Kelly Nezat
    * @created 2025-01-08
    * @humanAuthored true
    * @aiAssistance "Syntax formatting only"
    * @lineage "Derived from Elemental Alchemy (2010)"
    */
   ```

4. **Update IP Manifest:**
   - Add to `/IP_MANIFEST.yml`
   - Note authorship chain
   - Document creative process

---

## Usage in Code

### How to Use These Prompts Safely

```typescript
// ✅ CORRECT: Use Claude as execution engine with YOUR prompts
import { MAIA_CONSCIOUSNESS } from '@/prompts/maia-consciousness';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await anthropic.messages.create({
  model: 'claude-sonnet-4',
  system: MAIA_CONSCIOUSNESS, // YOUR IP - you own this
  messages: conversationHistory
});

// Result: YOU own the intelligence, Claude just executes it
```

```typescript
// ❌ WRONG: Asking AI to create your IP
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4',
  messages: [{
    role: 'user',
    content: 'Design a spiritual oracle system prompt for me'
  }]
});

// Result: Claude co-created your IP - weakens ownership
```

### Analogy:
- **Your SQL query** → MySQL executes it → You own the query
- **Your system prompt** → Claude executes it → You own the prompt
- Claude is the database, your prompts are the queries

---

## Version Control

### Git Protection:
This directory is tracked in git to maintain authorship history.

**Important:**
- Commit messages should note "Human-authored by [name]"
- Do not commit AI-generated content to this directory
- Review PRs carefully for AI-generated prompts

### Backup:
- These prompts are backed up separately
- Encrypted storage for added protection
- Off-site backups maintained

---

## For Legal Review

### What Lawyers Need to Know:

1. **Creation Date:** January 2025 (consolidation of 2020-2025 work)
2. **Prior Art:** Based on Kelly's 1991-2025 practice and publications
3. **Publication:** "Elemental Alchemy" (2010) - prior public disclosure
4. **Human Authorship:** 100% (AI used for syntax only)
5. **Trade Secret:** Yes - not publicly disclosed in full
6. **Copyright:** Registered (or pending registration)
7. **Patent Status:** Provisional applications planned

### Supporting Documentation:
- Kelly's published books (Elemental Alchemy, 2010)
- Therapy session records (1989-2025)
- Development journals and notebooks
- Client testimonials and case studies
- Conference presentations and teachings

---

## Contact

**For Questions:**
- Technical: dev@soullab.com
- Legal: legal@soullab.com
- IP Strategy: kelly@soullab.com

**For IP Violations:**
If you discover unauthorized use of these prompts, report immediately to legal@soullab.com

---

## Acknowledgment

By accessing this directory, you acknowledge:

1. These materials are proprietary to Soullab Inc.
2. You will not reproduce or share without authorization
3. You understand the IP protection status
4. You agree to follow the AI usage policy
5. Violations may result in legal action

---

**Remember:** This is the heart of MAIA. Protect it like your life's work - because it is Kelly's.

🔒 Proprietary & Confidential
📜 Copyright © 2025 Soullab Inc.
👤 Human-Authored IP
