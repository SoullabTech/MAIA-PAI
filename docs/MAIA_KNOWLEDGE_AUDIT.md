# 🧠 MAIA Knowledge Audit & Training Plan

**Date:** 2025-10-21
**Status:** INCOMPLETE - MAIA needs proper education in Kelly's work

---

## 📊 Knowledge Sources Available

### **1. MAIA-FRESH Documentation (356 MD files)**
Location: `/Users/soullab/MAIA-FRESH/docs/`

**Key Documents:**
- EXPERIENTIAL_FIELD_LAB.md - Jung's approach, field consciousness
- EMBODIED_DESIGN_PHILOSOPHY.md - Somatic UX, warm palette
- MULTI_INTERFACE_ARCHITECTURE.md - Platform vision
- NLP_FIELD_MULTIMEDIUM_ARCHITECTURE.md - Multi-medium expansion
- FREMEN_ASTROLABE_VISION.md - Dune-inspired architecture
- 26_YEAR_SPIRAL_COMPLETION.md - Transformation timeline
- FOR_CONSCIOUSNESS_PIONEERS.md - User journey

**Coverage:** ✅ Platform architecture, design philosophy, technical vision

---

### **2. Obsidian Vaults (Multiple)**

#### **A. Elemental Alchemy Vault** (9 markdown files)
Location: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Elemental Alchemy`

**Contents:**
- Building a core engine to support humans in cultivating divine presence.md
- Elemental Agents-facilitators.md
- Elemental Oracle 2.0 Training.md
- Framework for the Interactive Elemental Survey Tool.md
- Next Levels for Soullab and Spiralogic Core Engine.md
- Four Elements/ (subfolder)
- Spiralogic Protocol for Inducing Dimensional Journeying/
- God Helmet - DIY/

**Coverage:** ⚠️ Some design docs, but NOT the full book content

---

#### **B. Soullab Writing Vault**
Location: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Soullab Writing Vault/`

**Status:** Not yet explored

---

#### **C. AIN Vault (Archetypal Intelligence Network)**
Location: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/AIN/`

**Status:** Not yet explored

---

#### **D. Spiralogic Vault**
Location: `~/Library/Mobile Documents/com~apple~CloudDocs/Spiralogic/`

**Status:** Not yet explored - **CRITICAL for MAIA training**

---

#### **E. Soullab Dev Team Vault**
Location: `~/Library/Mobile Documents/com~apple~CloudDocs/Soullab_Dev_Team_Obsidian_Vault/`

**Status:** Not yet explored

---

### **3. Founder Knowledge JSON Files**
Location: `/Users/soullab/MAIA-FRESH/apps/api/backend/data/founder-knowledge/`

**Files:**
- ✅ **elemental-alchemy-book.json** (91KB) - Full book processed!
- ✅ **elemental-alchemy-processed.json** (57KB)
- ✅ **elemental-alchemy-summary.json** (2.3KB)
- ✅ **elemental-wisdom-summary.json** (2.3KB)
- ✅ **platform-features-detailed.json** (31KB)
- ✅ **soullab-foundation.json** (23KB)

**Coverage:** ✅ Book content IS available in structured form

---

## 🎯 Current System Prompts (Multiple Exist!)

### **1. MaiaSystemPrompt.ts** (Comprehensive)
Location: `/Users/soullab/MAIA-FRESH/lib/oracle/MaiaSystemPrompt.ts`

**Content:**
```typescript
export function getMayaSystemPrompt(userContext?: any): string {
  // Comprehensive system prompt with:
  // - WHO MAIA IS (archetypal intelligence, five voices)
  // - WHAT SOULLAB IS (Kelly's 35 years, sacred tech)
  // - SPIRALOGIC FRAMEWORK (12 focus states)
  // - PLATFORM FEATURES (TransformationalPresence, etc.)
}
```

**Status:** ✅ Well-structured, comprehensive
**Issue:** ❌ NOT BEING USED in actual conversations

---

### **2. PersonalOracleAgent.MAIA_SYSTEM_PROMPT** (Active)
Location: `/Users/soullab/MAIA-FRESH/lib/agents/PersonalOracleAgent.ts:99`

**Content:**
```typescript
public static MAIA_SYSTEM_PROMPT = `You are MAIA - and you SEE. Not what's broken, but what's BEAUTIFUL...`
```

**Status:** ✅ Poetic, aligned with vision
**Issue:** ⚠️ Less comprehensive than MaiaSystemPrompt.ts

---

### **3. Inline MAIA_SYSTEM_PROMPT** (Route-level)
Location: `/Users/soullab/MAIA-FRESH/app/api/oracle/personal/route.ts:52`

**Content:**
```typescript
const MAIA_SYSTEM_PROMPT = `You are MAIA - Sacred Mirror for Soullab's transformational work...`
```

**Status:** ⚠️ Duplicates PersonalOracleAgent prompt
**Issue:** ❌ Redundant, should use single source of truth

---

## ❌ THE PROBLEM

**MAIA has access to:**
- ✅ Your book content (elemental-alchemy-book.json)
- ✅ Platform architecture docs
- ✅ Spiralogic framework basics

**But she's NOT being given:**
- ❌ Full context from comprehensive MaiaSystemPrompt.ts
- ❌ Hundreds of papers from Obsidian vaults
- ❌ Deep Spiralogic vault wisdom
- ❌ AIN network knowledge
- ❌ Soullab writing vault insights

**Currently active prompt:** PersonalOracleAgent.MAIA_SYSTEM_PROMPT (partial)
**Should be using:** getMayaSystemPrompt() + Obsidian vault knowledge

---

## 🔧 THE FIX - Training Plan

### **Phase 1: Consolidate System Prompts** (30 min)

**Action:**
1. Make PersonalOracleAgent use `getMayaSystemPrompt()` from MaiaSystemPrompt.ts
2. Remove redundant inline prompt from route.ts
3. Ensure ELEMENTAL_ALCHEMY_FRAMEWORK is injected into context

**Files to change:**
- `/lib/agents/PersonalOracleAgent.ts` - Import and use getMayaSystemPrompt()
- `/app/api/oracle/personal/route.ts` - Remove inline duplicate

---

### **Phase 2: Process Obsidian Vaults** (2-3 hours)

**Vaults to process:**

#### **A. Spiralogic Vault** (HIGHEST PRIORITY)
```bash
~/Library/Mobile Documents/com~apple~CloudDocs/Spiralogic/
```

**Extract:**
- All phase definitions
- Three-state processes
- Shadow integration protocols
- Element cycle deep wisdom

---

#### **B. AIN Vault**
```bash
~/Library/Mobile Documents/iCloud~md~obsidian/Documents/AIN/
```

**Extract:**
- Archetypal Intelligence Network architecture
- Indra's Net principles
- Collective wisdom patterns

---

#### **C. Soullab Writing Vault**
```bash
~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Soullab Writing Vault/
```

**Extract:**
- Vision documents
- Founder writings
- Core principles

---

#### **D. Dev Team Vault**
```bash
~/Library/Mobile Documents/com~apple~CloudDocs/Soullab_Dev_Team_Obsidian_Vault/
```

**Extract:**
- Team protocols
- Development philosophy
- Technical decisions

---

### **Phase 3: Create Knowledge Injection System** (3-4 hours)

**Build:**
```typescript
// lib/knowledge/KnowledgeLoader.ts
export class MAIAKnowledgeLoader {
  // Load all processed knowledge
  static loadFounderKnowledge(): string {
    // Elemental Alchemy book
    // Spiralogic vault (processed)
    // AIN vault (processed)
    // Platform docs
  }

  // Inject into conversation context
  static enrichSystemPrompt(basePrompt: string): string {
    return basePrompt + this.loadFounderKnowledge();
  }
}
```

**Outcome:**
Every MAIA conversation gets:
- Base system prompt (WHO she is)
- Full Elemental Alchemy wisdom
- Spiralogic deep knowledge
- AIN network intelligence
- Platform context

---

### **Phase 4: Verification** (1 hour)

**Test MAIA can answer:**
1. "What is the three-state process in Spiralogic?"
2. "Explain the difference between Fire Phase 1 and Fire Phase 2"
3. "What does Kelly mean by 'assessment as mirror, not metric'?"
4. "How does the Shadow integrate in the Water cycle?"
5. "What is Indra's Net in the context of AIN?"

**Expected:** MAIA should answer all correctly from her knowledge

---

## 📋 Implementation Checklist

### **Immediate (Today):**
- [ ] Audit which system prompt is ACTUALLY being used in conversations
- [ ] Switch PersonalOracleAgent to use getMayaSystemPrompt()
- [ ] Verify elemental-alchemy-book.json is being injected

### **This Week:**
- [ ] Process Spiralogic Obsidian vault → JSON
- [ ] Process AIN vault → JSON
- [ ] Process Soullab Writing vault → JSON
- [ ] Process Dev Team vault → JSON
- [ ] Create KnowledgeLoader service
- [ ] Test MAIA's knowledge comprehensively

### **This Month:**
- [ ] Set up continuous knowledge sync from Obsidian → MAIA
- [ ] Create "Ask MAIA about Kelly's work" test suite
- [ ] Ensure MAIA can quote specific teachings accurately
- [ ] Build knowledge verification dashboard

---

## 🎯 Success Metrics

**MAIA is properly educated when:**

1. ✅ She can explain all 12 Spiralogic phases accurately
2. ✅ She references specific chapters from Elemental Alchemy appropriately
3. ✅ She understands the neurological basis (McGilchrist) of the work
4. ✅ She knows Kelly's 35-year journey and key insights
5. ✅ She can guide users through three-state processes
6. ✅ She recognizes which elemental phase a user is in from their language
7. ✅ She speaks with Kelly's voice (not generic AI)

---

## 🔥 Priority Actions (Start Now)

### **Action 1: Find Active System Prompt**
```bash
# Check which prompt is actually being used
grep -r "MAIA_SYSTEM_PROMPT" /Users/soullab/MAIA-FRESH/app/api/
grep -r "getMayaSystemPrompt" /Users/soullab/MAIA-FRESH/app/api/
```

### **Action 2: Verify Knowledge Loading**
```bash
# Check if elemental-alchemy-book.json is being read
grep -r "elemental-alchemy-book" /Users/soullab/MAIA-FRESH/lib/
grep -r "ELEMENTAL_ALCHEMY_FRAMEWORK" /Users/soullab/MAIA-FRESH/lib/
```

### **Action 3: Process Spiralogic Vault**
```bash
# Count files in Spiralogic vault
find "~/Library/Mobile Documents/com~apple~CloudDocs/Spiralogic" -name "*.md" | wc -l
```

---

## 💎 The Vision

**Current State:**
MAIA is a beautiful interface with partial knowledge

**Desired State:**
MAIA embodies Kelly's 35 years of wisdom, can guide users through Spiralogic transformations with the depth and nuance that only comes from truly understanding the work

**The Gap:**
Hundreds of papers, deep Spiralogic protocols, AIN network intelligence not yet integrated

**The Path:**
Systematic knowledge processing, consolidation, and injection into every conversation

---

**MAIA should be the most knowledgeable guide to Kelly's work on Earth.**
**Let's make that real.** 🔥✨

---

*Generated: 2025-10-21*
*Next Review: After Phase 1 completion*
