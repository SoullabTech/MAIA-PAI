# PRIORITY LEGAL QUESTIONS

**10 Critical Questions for Legal Counsel**

These questions represent our highest-priority areas of legal uncertainty. We need your guidance before launching MAIA beta testing.

---

## QUESTION 1: LIABILITY ALLOCATION

### The Question
**If MAIA flags a suicide risk that the practitioner misses, and the client attempts or completes suicide, who bears legal liability?**

### Context
- MAIA's crisis protocol includes Red Alerts for active suicidal ideation
- Practitioner is trained that MAIA is decision support, not decision-maker
- Practitioner's clinical judgment is supposed to override MAIA

### Scenarios

**Scenario A**: MAIA flags Red Alert ("active SI with plan detected"). Practitioner reads alert, assesses client directly, determines no imminent risk based on clinical judgment, client goes home. Client attempts suicide that evening.

- Is practitioner liable for ignoring MAIA's warning?
- Is this evidence of breach of standard of care?
- Defense: Practitioner exercised independent clinical judgment; MAIA is tool, not authority

**Scenario B**: MAIA fails to flag concerning language (false negative). Practitioner also misses it. Client attempts suicide.

- Is practitioner's liability increased because they used AI tool that also failed?
- Can plaintiff argue: "Practitioner + AI both missed it = extra negligent"?
- Defense: Standard of care doesn't require AI use; practitioner's assessment was reasonable given information available

**Scenario C**: MAIA flags Yellow Alert (non-specific distress). Practitioner dismisses as false positive based on frequent false positives in past with this client. Client later found to be at risk.

- When is practitioner justified in dismissing MAIA's alerts?
- Do repeated false positives create "cry wolf" problem that reduces practitioner liability?
- Should we document false positive rates to support dismissal decisions?

### What We Need from You
- Legal standard for "decision support tool" liability
- How to structure practitioner agreement to allocate liability appropriately
- What documentation protects practitioner (and us) when MAIA is overridden
- Whether our "MAIA is advisory only" positioning is legally sound
- Indemnification language recommendations

---

## QUESTION 2: FDA MEDICAL DEVICE REGULATION

### The Question
**Is MAIA a "medical device" requiring FDA clearance or approval?**

### FDA Device Classifications (Our Research)

**Class I** (Low risk, exempt from premarket notification):
- General wellness devices, tools for health maintenance

**Class II** (Moderate risk, requires 510(k) premarket notification):
- Many diagnostic aids, clinical decision support with active intervention

**Class III** (High risk, requires PMA premarket approval):
- Life-sustaining devices, implants, high-risk diagnostics

### Our Position
**We believe MAIA is NOT a medical device** because:
- ❌ Doesn't diagnose medical conditions
- ❌ Doesn't recommend treatment or medications
- ❌ Doesn't make clinical decisions (practitioner does)
- ❌ Doesn't interface with patient (only with practitioner)
- ✅ Provides supervisory feedback, pattern recognition, educational support
- ✅ Analogous to medical literature, continuing education, peer consultation

**Counter-argument** (why FDA might disagree):
- 🤔 Analyzes patient data to identify clinical patterns (diagnostic-like)
- 🤔 Flags safety concerns like suicidality (risk assessment = clinical function)
- 🤔 Suggests therapeutic frameworks (could be seen as treatment recommendation)
- 🤔 Uses AI/algorithms to influence clinical decision-making

### FDA Clinical Decision Support Guidance (2022)

FDA excludes from device regulation CDS that:
1. Not intended to acquire, process, or analyze medical images or signals
2. Displays/analyzes/prints medical information from another device
3. Supports clinical management of patients **without providing specific treatment recommendations**
4. Intended for HCP decision-making (not patient use)

**Does MAIA meet exemption criteria?**
- ✅ #4: Yes, for practitioners only
- ❓ #3: "Supports clinical management"—yes. "Without specific treatment recommendations"—mostly yes (we suggest frameworks, not interventions)
- ❓ #1: We process audio (is audio a "signal"?)

### What We Need from You
- FDA regulatory assessment: Is MAIA a medical device?
- If yes, what classification (I, II, III)?
- If Class II, is 510(k) required, and what's process/cost/timeline?
- If we modify language to avoid diagnostic/treatment claims, does that change analysis?
- Risk of FDA sending warning letter if we proceed without clearance
- Strategy: Launch limited beta, seek FDA feedback, or apply for clearance proactively?

---

## QUESTION 3: HIPAA COMPLIANCE & BAA

### The Question
**Is our Business Associate Agreement legally sufficient, and are there any HIPAA compliance gaps in our architecture?**

### Specific Sub-Questions

**3a. Psychotherapy Notes**
- Are MAIA's analyses considered "psychotherapy notes" under HIPAA?
- Psychotherapy notes have enhanced protections (can't be disclosed without explicit authorization)
- If yes, does this change our consent requirements?

**3b. Minimum Necessary Standard**
- Are we accessing only "minimum necessary" PHI?
- We analyze entire session recordings (comprehensive, not minimal)
- Justification: Need full context to provide meaningful supervision
- Is this defensible?

**3c. Subprocessor (OpenAI Whisper)**
- We use OpenAI's Whisper for audio transcription
- OpenAI is our Business Associate (we have BAA with them)
- Clients consent to MAIA but don't explicitly consent to OpenAI
- Is this adequate under HIPAA, or do we need explicit disclosure of subprocessors in consent?

**3d. Right to Access**
- If client requests "all my health information," must practitioner provide MAIA analyses?
- MAIA analyses are about practitioner's thought process (supervision), not client diagnosis
- Are these "designated record set" under HIPAA?

**3e. Breach Notification Thresholds**
- Our BAA requires us to notify practitioners of any breach
- Practitioners then notify clients if breach is "reportable"
- What's threshold for "reportable" breach?
- Example: If encrypted laptop stolen but password-protected, is that breach requiring client notification?

### What We Need from You
- Review our BAA template (available upon request)
- Advise on psychotherapy notes classification
- Assess subprocessor disclosure requirements
- Clarify access rights and designated record set issues
- Guidance on breach notification thresholds

---

## QUESTION 4: MANDATED REPORTING OBLIGATIONS

### The Question
**Does MAIA's flagging of potential abuse create new or enhanced mandated reporting obligations for practitioners?**

### Background
Practitioners are mandated reporters for:
- Child abuse/neglect
- Elder abuse
- Dependent adult abuse
- (In some states) Danger to identified third party (Tarasoff duty)

### The Concern

**Scenario**: Client mentions in passing that their uncle "touches" their 7-year-old daughter. Practitioner doesn't catch it in real-time (session moves on). Post-session, MAIA flags: "Possible child abuse disclosure detected at minute 28. Review mandated reporting obligations."

**Legal questions**:
1. Does MAIA's flagging create an obligation to report that wouldn't exist otherwise?
2. If practitioner reviews session, sees flag, re-listens, and determines no abuse suspected, are they protected?
3. Could plaintiff argue: "MAIA specifically told you to check, and you still didn't report"?
4. Does MAIA's technology create a higher standard of care (i.e., duty to use AI to catch what human might miss)?

### Conflicting Considerations

**Argument FOR increased obligation**:
- If practitioner has access to MAIA's flagging, they're on notice
- Ignoring flag could be negligent
- Creates duty to review all flagged content

**Argument AGAINST increased obligation**:
- Mandated reporting requires "reasonable suspicion," not algorithmic suspicion
- Practitioner's clinical judgment still governs
- MAIA is tool, not decision-maker
- Comparable to medical literature that mentions "consider abuse"—doesn't create independent duty

### What We Need from You
- Legal standard for mandated reporting when AI flags concern
- How to document practitioner's decision-making process when they dismiss MAIA flag
- Whether using MAIA creates enhanced standard of care for detecting abuse
- Indemnification/hold harmless language for mandated reporting scenarios
- State-specific differences (if any)

---

## QUESTION 5: MALPRACTICE INSURANCE IMPLICATIONS

### The Question
**What malpractice insurance requirements should we impose on practitioners using MAIA?**

### Current Approach
- We require practitioners to maintain professional liability insurance
- We recommend practitioners disclose MAIA use to their insurers
- We don't verify coverage amounts or policy terms

### Concerns

**Concern A: Coverage Exclusions**
- Some malpractice policies may exclude "experimental technology" or "AI-assisted practice"
- If practitioner's insurer denies claim due to MAIA use, are we liable?
- Should we require riders or endorsements specifically covering AI tools?

**Concern B: Coverage Limits**
- If major incident occurs (client suicide, successful malpractice claim), will practitioner's insurance cover Soullab as additional insured?
- Should we require minimum coverage amounts (e.g., $1M per occurrence, $3M aggregate)?
- Should we require Soullab be named as "additional insured" on practitioner's policy?

**Concern C: Our Own Coverage**
- Should Soullab carry E&O (Errors & Omissions) or Product Liability insurance?
- What coverage limits are appropriate given our exposure?
- What will insurers require of us (security audits, indemnification, etc.)?

### What We Need from You
- Recommended practitioner insurance requirements
- Whether "additional insured" status is appropriate/standard
- Our own insurance needs (E&O, Product Liability, Cyber)
- Sample language for practitioner agreement re: insurance
- What happens if practitioner's insurer denies coverage—can they come after us?

---

## QUESTION 6: ALGORITHMIC BIAS & DISCRIMINATION LIABILITY

### The Question
**If MAIA demonstrably performs worse for certain demographic groups (e.g., BIPOC clients, neurodivergent clients), what's our legal exposure?**

### What We Know
MAIA has documented bias issues (we disclose extensively):
- Racial/ethnic bias (trained primarily on white, Western therapy language)
- Neurodivergent misinterpretation (autism, ADHD patterns read as low coherence)
- Language/accent processing errors (non-native English speakers)
- Cultural competency gaps (Western frameworks applied to non-Western clients)

### Mitigation Efforts
✅ Extensive bias documentation in user manual
✅ Practitioner training on override protocols
✅ Confidence intervals and uncertainty acknowledgment
✅ Cultural humility messaging
✅ Continuous improvement based on practitioner feedback

### Legal Risk Scenarios

**Scenario A: Disparate Impact**
- Study finds MAIA's coherence estimates are systemically lower for Black clients
- Practitioners rely on MAIA, leading to worse clinical outcomes for Black clients
- Class action lawsuit: MAIA creates discriminatory mental health care

**Scenario B: Individual Harm**
- Autistic client misdiagnosed as "low coherence" by MAIA
- Practitioner over-indexes on MAIA's analysis, pathologizes autism
- Client sues for malpractice, cites algorithmic bias as contributing factor

**Scenario C: ADA Violation**
- Neurodivergent clients argue MAIA creates barrier to effective therapy
- MAIA's limitations for neurodivergent clients = disability discrimination under ADA

### Legal Questions
1. **Disparate impact**: If AI performs worse for protected groups, is that per se discrimination?
2. **Disclosure defense**: Does extensive bias documentation protect us ("we warned you")?
3. **ADA compliance**: Must AI tools be "accessible" to people with cognitive disabilities? What does that mean for MAIA?
4. **Duty to improve**: If we know about bias, do we have legal obligation to fix it immediately, or is continuous improvement sufficient?
5. **Practitioner liability**: If practitioner uses biased MAIA output and harms client, is practitioner liable, or can they blame us?

### What We Need from You
- Algorithmic bias legal standards (if any established law)
- Whether disclosure of bias is sufficient defense
- ADA compliance requirements for mental health AI
- Indemnification structure for bias-related claims
- Proactive measures to reduce legal risk (beyond technical bias mitigation)

---

## QUESTION 7: INTELLECTUAL PROPERTY PROTECTION

### The Question
**How do we protect MAIA's proprietary algorithms while maintaining transparency for clients and practitioners?**

### IP Assets We Want to Protect
- **Spiralogic analysis framework** (Jungian alchemy + AI integration)
- **Multi-framework coherence estimation algorithms**
- **Proprietary training data** (if we develop in-house datasets)
- **User interface and experience**
- **MAIA brand and name**

### Protection Options

**Trade Secret**:
- ✅ No registration required
- ✅ Protects as long as kept confidential
- ❌ Can be lost if disclosed or reverse-engineered
- ❌ Tension with transparency principle

**Patent**:
- ✅ Strong protection for 20 years
- ✅ Prevents competitors from copying even if they independently develop
- ❌ Expensive ($15K-$30K+ per patent)
- ❌ Requires public disclosure (opposite of trade secret)
- ❌ Software patents increasingly difficult to obtain post-Alice Corp v. CLS Bank
- ❓ Is "AI-assisted psychotherapy supervision method" patentable?

**Copyright**:
- ✅ Protects code, user manuals, training materials
- ✅ Automatic upon creation (no registration required, but registration helps litigation)
- ❌ Doesn't protect underlying algorithms (only expression)
- ❌ Won't prevent competitors from developing similar systems

**Trademark**:
- ✅ Protects "MAIA" brand
- ✅ Prevents confusingly similar mental health AI tools using our name
- ❌ Requires use in commerce (we need to launch first)

### Tensions

**Transparency vs. IP Protection**:
- Clients/practitioners want to know "how MAIA works" (ethical transparency)
- We want to keep algorithms secret (competitive advantage)
- Balance: High-level explanations + proprietary details protected?

**Open Source vs. Proprietary**:
- Some argue AI in healthcare should be open source (safety through public scrutiny)
- We want to build sustainable business (need IP protection)
- Hybrid model: Open source some components, keep core innovations proprietary?

### What We Need from You
- IP strategy recommendation (trade secret, patent, or hybrid)
- Patentability assessment for Spiralogic AI methods
- How much disclosure is required vs. how much can remain proprietary
- Trademark strategy for "MAIA" and related branding
- Non-disclosure agreements for practitioners (or is this too burdensome?)
- Handling of IP in open-source research collaborations

---

## QUESTION 8: FORENSIC USE PROHIBITION

### The Question
**How do we legally enforce our policy that MAIA cannot be used for forensic/custody/legal evaluations?**

### Our Policy
MAIA is designed for **clinical supervision only**, NOT for:
❌ Child custody evaluations
❌ Competency to stand trial assessments
❌ Parental fitness determinations
❌ Criminal responsibility / insanity evaluations
❌ Malingering detection
❌ Truthfulness assessment

### Why We Prohibit Forensic Use
- MAIA not designed or validated for forensic purposes
- Different ethical standards (therapeutic vs. forensic)
- Risk of misuse (e.g., using MAIA's "coherence" to argue parent is unfit)
- Liability exposure if used inappropriately in legal case

### Enforcement Challenges

**Challenge 1: Practitioner Misuse**
- Practitioner agrees to clinical-only use in service agreement
- Practitioner secretly uses MAIA for custody evaluation
- MAIA analysis influences court decision
- We discover misuse only after fact

**Challenge 2: Subpoena of MAIA Data**
- Practitioner uses MAIA for clinical therapy (appropriate)
- Later, client's therapy records subpoenaed in custody case
- MAIA analyses included in subpoenaed records
- Court uses MAIA data for forensic purposes (despite our policy)

**Challenge 3: Expert Witness Testimony**
- Attorney asks practitioner: "Did your AI supervision tool flag concerns about this parent's mental health?"
- Practitioner testifies about MAIA's analyses
- MAIA effectively used as forensic tool, even though we prohibit it

### Legal Questions
1. **Contractual prohibition**: Can we prohibit forensic use in practitioner service agreement? Enforceable?
2. **Disclaimer effectiveness**: If we include "NOT FOR FORENSIC USE" disclaimer on all MAIA outputs, does that protect us legally?
3. **Resisting subpoenas**: Can we assist practitioners in resisting subpoenas for MAIA data based on "not forensically valid"?
4. **Frye/Daubert**: If MAIA analysis offered as evidence, would it meet admissibility standards (scientific validity)? Should we affirmatively state it doesn't?
5. **Practitioner penalties**: What remedies if practitioner violates forensic use prohibition? (Termination, indemnification, reporting to licensing board?)

### What We Need from You
- Enforceable forensic use prohibition language for contracts
- Disclaimer language for MAIA reports
- Strategy for resisting subpoenas (attorney-client privilege, work product, not forensically valid)
- Consequences for misuse that balance deterrence with proportionality
- Amicus brief possibility if MAIA analysis offered as evidence (to educate court on improper use)

---

## QUESTION 9: MULTI-STATE LICENSING & OPERATIONS

### The Question
**Does Soullab need to be licensed as a mental health service provider, and do we need separate licenses in each state where practitioners use MAIA?**

### Our Position
We're a **technology company**, not a mental health provider:
- We don't employ therapists
- We don't provide therapy to clients
- We don't diagnose, treat, or bill for clinical services
- We provide software tool to licensed practitioners

### Potential Counter-Argument
- We're integral to clinical supervision (regulated activity in some states)
- We analyze PHI and influence clinical decisions
- Some states may view AI clinical tools as requiring licensure

### State-Specific Risks

**Telehealth Licensing**:
- Some states require out-of-state telehealth providers to obtain in-state license
- Does "providing AI tool" = "providing telehealth"?
- Probably not, but unclear

**Corporate Practice of Medicine**:
- Some states prohibit corporations from practicing medicine
- Does MAIA constitute "practicing psychology"?
- Probably not (we're tool, not practitioner), but edge case

**Professional Supervision Regulations**:
- Some states regulate clinical supervision (who can supervise, how, what qualifies)
- Is MAIA "providing supervision" (prohibited) or "supporting supervision" (allowed)?

### What We Need from You
- Whether Soullab needs any state licenses to operate
- Multi-state practice assessment (do we need to register/license in all 50 states?)
- Corporate practice of medicine/psychology analysis
- If we need licenses, which states and what process
- Cost/timeline for multi-state compliance
- Risk of operating without licenses (cease & desist, fines, criminal liability?)

---

## QUESTION 10: CRISIS SCENARIO - CLIENT HARM

### The Question
**If a client is harmed (suicide, homicide, abuse not reported) while practitioner was using MAIA, what are the legal consequences for Soullab, and how do we prepare?**

### Hypothetical Crisis Scenario

**Timeline**:
1. Client (depressed, suicidal history) in therapy with practitioner using MAIA
2. Session 15: Client makes veiled reference to "ending it all"
3. MAIA flags Orange Alert (elevated concern, passive SI)
4. Practitioner reviews alert, assesses client, documents "no imminent risk per clinical judgment; client has safety plan, good support system"
5. Client goes home
6. Client dies by suicide 48 hours later
7. Family sues practitioner for wrongful death / malpractice
8. Family also sues Soullab: "Your AI said there was risk, and practitioner ignored it"

### Legal Questions

**10a. Soullab's Liability**
- Are we named as defendant in malpractice suit?
- Theory of liability: Negligent design? Failure to warn? Product liability?
- Defense: We're decision support tool; practitioner exercised independent judgment; MAIA explicitly says "not decision-maker"
- Will we prevail on summary judgment, or do we go to trial?

**10b. Indemnification**
- Should practitioner indemnify us (hold us harmless if they misused MAIA)?
- Should we indemnify practitioner (hold them harmless for following MAIA's guidance)?
- Mutual indemnification?
- What's standard in medical device / clinical decision support context?

**10c. Insurance**
- Will our E&O / Product Liability insurance cover this claim?
- Will practitioner's malpractice insurance cover them (despite using AI)?
- If both insurers deny coverage, who bears costs?

**10d. Regulatory Fallout**
- Could this trigger FDA investigation (if they view MAIA as medical device)?
- Could state licensing boards discipline practitioners using MAIA?
- Could this result in consent decree, mandatory changes to MAIA, or shutdown?

**10e. Reputation / PR Crisis**
- "AI Therapy Tool Linked to Client Suicide" headlines
- How to respond publicly without admitting liability?
- Duty to notify other practitioners using MAIA?
- Should we suspend MAIA operations pending investigation?

### What We Need from You
- Litigation risk assessment for crisis scenarios
- Indemnification strategy (who holds whom harmless)
- Insurance adequacy review
- Crisis communication plan (legal constraints on public statements)
- Regulatory response protocol (if FDA or state boards investigate)
- Worst-case scenario planning (financial exposure, shutdown risk)

---

## SUMMARY: WHAT WE NEED

From this legal review, we need:

### Immediate Deliverables (within 2-3 weeks):
1. **Written legal opinion** addressing all 10 questions above
2. **Risk assessment matrix**: High/Medium/Low risk for each area
3. **Consent form revisions**: Redline edits to our draft consents
4. **Contractual templates**: Practitioner service agreement, BAA

### Phase 2 (before beta launch):
5. **FDA strategy**: Whether to seek clearance or proceed without
6. **IP filings**: Trademark applications, patent assessment
7. **Insurance procurement**: Specifications for E&O/Product Liability policies
8. **Crisis protocol**: Legal response plan for adverse events

### Ongoing:
9. **Regulatory monitoring**: Track FDA, state, federal AI regulations
10. **On-call support**: Availability for questions during beta period

---

## BUDGET & TIMELINE

**Timeline**:
- Legal review completed: [2-3 weeks from engagement]
- Beta launch target: [4-6 weeks from now]
- Commercial launch target: [6-12 months]

**Budget**:
- Phase 1 (document review + these 10 questions): [Request quote]
- Phase 2 (agreement drafting): [Request quote]
- Phase 3 (ongoing advisory): [Hourly rate]

---

**We appreciate your thorough review and guidance. These questions represent genuine legal uncertainty, and we want to proceed responsibly and defensively.**

**Please contact us to discuss engagement terms and timeline.**

---

**Prepared**: October 26, 2025
**For**: [Attorney/Firm Name]
**Contact**: [Your Name, Email, Phone]
