# MAIA Research Methodology & Study Designs

**How to Empirically Validate MAIA as Supervisory Support System**

*Research questions, study designs, outcome measures, and collaboration opportunities*

**Created**: October 26, 2025
**Soullab Collective**

---

## Table of Contents

1. [Research Philosophy](#research-philosophy)
2. [Core Research Questions](#core-research-questions)
3. [Study 1: Practitioner Outcomes](#study-1-practitioner-outcomes-rct)
4. [Study 2: Framework Effectiveness Algorithm](#study-2-framework-effectiveness-algorithm-validation)
5. [Study 3: Countertransference Detection](#study-3-countertransference-detection-accuracy)
6. [Study 4: Client Outcomes](#study-4-client-outcomes-quasi-experimental)
7. [Study 5: Qualitative Practitioner Experience](#study-5-qualitative-practitioner-experience)
8. [Outcome Measures](#outcome-measures)
9. [Data Collection Infrastructure](#data-collection-infrastructure)
10. [Ethics & IRB](#ethics--irb-considerations)
11. [Collaboration Opportunities](#collaboration-opportunities)

---

## Research Philosophy

### Core Principles

**1. Rigorous AND Respectful**
- We're studying human transformation, not widgets
- Quantitative metrics (coherence, outcomes) + qualitative depth (lived experience)
- Numbers serve depth, not replace it

**2. Practitioner-Centered**
- MAIA exists to support practitioners, so research must measure practitioner growth/satisfaction
- Not just "does it work?" but "how does it change practice?"

**3. Client Sovereignty**
- Clients are not research subjects by default
- Opt-in only, with full consent
- Privacy paramount

**4. Iterative Development**
- Research informs MAIA improvements
- We don't claim MAIA is "finished" —it evolves with data

**5. Open Science**
- Data (anonymized) made available to research community
- Methods transparent, replicable
- Null results published (not hidden)

### Research Goals

**Primary Goal**: Validate that MAIA enhances practitioner effectiveness and growth without harming therapeutic relationship or client outcomes.

**Secondary Goals**:
- Establish reliability and validity of Spiralogic metrics (coherence, stage classification, operation detection)
- Identify which practitioners benefit most from MAIA
- Understand limitations and failure modes
- Contribute to field of AI-assisted clinical supervision

---

## Core Research Questions

### Category 1: Practitioner Outcomes

1. Do practitioners using MAIA show greater competency growth than control group?
2. Does MAIA help practitioners recognize their countertransference patterns?
3. Do practitioners report MAIA supervision as helpful/valuable?
4. What is the learning curve for effective MAIA use?

### Category 2: Client Outcomes

5. Do clients of MAIA-using practitioners have better outcomes (symptom reduction, wellbeing, satisfaction)?
6. Do clients of MAIA-using practitioners show greater coherence increases?
7. Does MAIA use affect therapeutic alliance (positively or negatively)?

### Category 3: Framework Validity

8. Is MAIA's coherence calculation reliable (inter-rater reliability with human experts)?
9. Can MAIA accurately classify alchemical stages/operations?
10. Are framework effectiveness rankings (fit scores) predictive of actual client outcomes?

### Category 4: System Performance

11. Does real-time MAIA distract practitioners or enhance presence?
12. What is optimal frequency of MAIA use (every session? weekly? as-needed)?
13. Do practitioners become dependent on MAIA (can't work without it)?

### Category 5: Ethics & Safety

14. Are there client populations for whom MAIA is contraindicated?
15. Does MAIA miss safety concerns (false negatives on suicide risk)?
16. How do clients experience MAIA use (intrusive? neutral? helpful)?

---

## Study 1: Practitioner Outcomes (RCT)

### Research Question

**Does MAIA-assisted supervision lead to greater practitioner competency growth compared to standard supervision alone?**

### Design

**Type**: Randomized Controlled Trial (RCT)

**Participants**:
- N = 100 practitioners (licensed therapists, LMFTs, LCSWs, psychologists)
- Recruited from graduate programs, professional associations
- Inclusion: Active clinical practice (min. 10 clients/week), access to human supervision
- Exclusion: Prior MAIA training, less than 1 year post-licensure

**Randomization**:
- **Intervention group** (n=50): MAIA + standard supervision for 6 months
- **Control group** (n=50): Standard supervision only for 6 months

**Blinding**: Assessors rating practitioner competency are blind to group assignment.

### Procedure

**Baseline (Week 0)**:
- Practitioners submit 2 session recordings for competency rating
- Complete self-report measures (see Outcome Measures)
- Demographic/training background survey

**Intervention (Months 1-6)**:
- **Intervention group**: Use MAIA with all consenting clients, review supervision reports weekly
- **Control group**: Continue standard supervision (no MAIA access)
- Both groups maintain human supervision (1x/month minimum)

**Data collection (monthly)**:
- Submit 2 session recordings for competency rating
- Self-report measures (countertransference awareness, framework flexibility)
- MAIA usage logs (intervention group only)

**Post-intervention (Month 7)**:
- Final competency rating (2 sessions)
- Self-report measures
- Qualitative interview (30 min)

**Follow-up** (Month 12):
- Competency rating (retention test)
- Did control group adopt MAIA after trial? Outcomes if so?

### Outcome Measures

**Primary outcome**: **Practitioner competency** (PCRS - Psychotherapy Competence Rating Scale)
- Scored by 2 independent raters blind to condition
- Inter-rater reliability ≥ 0.80

**Secondary outcomes**:
- Countertransference Awareness Scale (CTAS)
- Framework Flexibility Questionnaire (FFQ) [custom measure]
- Practitioner self-efficacy
- Burnout (Maslach Burnout Inventory)

**Client outcomes** (exploratory):
- Clients' coherence change over 6 months
- Clients' OQ-45 (Outcome Questionnaire) scores
- Therapeutic alliance (WAI - Working Alliance Inventory)

### Sample Size Justification

**Effect size estimate**: d = 0.5 (medium effect)
**Power**: 0.80
**Alpha**: 0.05
**Required n**: 64 per group

**Recruiting N=100** (50 per group) to account for 20% attrition.

### Analysis Plan

**Primary analysis**: Linear mixed model
- DV: Practitioner competency (PCRS scores over time)
- IV: Group (MAIA vs. control), Time (months 0-7)
- Random effect: Practitioner
- Covariates: Baseline competency, years experience, supervision frequency

**Secondary analyses**:
- MAIA group only: Does frequency of MAIA use predict competency growth?
- Moderation: Does practitioner openness to technology moderate effectiveness?
- Mediation: Does countertransference awareness mediate competency growth?

**Qualitative analysis**:
- Thematic analysis of post-intervention interviews
- Identify facilitators/barriers to MAIA use

### Expected Results

**Hypothesis 1**: Intervention group shows greater competency growth (PCRS increase) than control.
**Hypothesis 2**: Intervention group shows greater countertransference awareness (CTAS increase).
**Hypothesis 3**: No difference in burnout (MAIA doesn't add burden).

**If null results**: Explore why. Was MAIA not used? Was training insufficient? Wrong practitioner population?

---

## Study 2: Framework Effectiveness Algorithm Validation

### Research Question

**Does MAIA's framework effectiveness algorithm accurately predict which frameworks resonate for each client?**

### Design

**Type**: Observational, prospective cohort

**Participants**:
- N = 50 practitioners
- N = 500 clients (10 per practitioner, across diverse presentations)

**Duration**: 3 months (approximately 12 sessions per client)

### Procedure

**Session 1** (Baseline):
- MAIA analyzes initial session
- MAIA generates framework effectiveness rankings (fit scores 0-1 for each of 19 frameworks)
- Example output:
  ```
  Client X:
  1. IFS (0.84 fit)
  2. Spiralogic (0.78 fit)
  3. Polyvagal (0.75 fit)
  4. Gestalt (0.63 fit)
  ...
  19. CBT (0.31 fit)
  ```

**Sessions 2-12**:
- Practitioner chooses which framework(s) to emphasize (can be guided by MAIA or not)
- After each session, practitioner rates: "How well did [framework X] resonate with this client today?" (0-10 scale)
- Client rates: "How helpful was today's session?" (0-10) + coherence measured

**Analysis**:

**Correlation analysis**:
- Does MAIA's predicted fit correlate with:
  - Practitioner-rated resonance?
  - Client-rated helpfulness?
  - Coherence increase?

**Predictive validity**:
- Logistic regression: Does MAIA fit score predict which frameworks lead to better outcomes?

**Inter-rater reliability**:
- Do multiple MAIA runs on same session generate consistent fit scores?

### Expected Results

**Hypothesis**: MAIA fit scores correlate r > 0.5 with practitioner-rated resonance and client outcomes.

**If supported**: Algorithm is valid, practitioners can trust fit scores.
**If not supported**: Refine algorithm, identify where it fails.

---

## Study 3: Countertransference Detection Accuracy

### Research Question

**Can MAIA accurately detect practitioner countertransference patterns, and do practitioners agree with MAIA's assessments?**

### Design

**Type**: Mixed methods (quantitative + qualitative)

**Participants**:
- N = 30 practitioners
- 10 sessions per practitioner (total 300 sessions)

### Procedure

**Phase 1: MAIA Detection** (Automated)
- MAIA analyzes 10 sessions per practitioner
- Identifies patterns (e.g., "quick reassurance," "avoidance of rage," "over-reliance on IFS")
- Generates confidence scores for each pattern

**Phase 2: Practitioner Self-Report**
- Practitioners rate their own patterns (blind to MAIA analysis)
- "Do you tend to reassure quickly when clients express fear?" (1-5 scale)
- "Which emotions are hardest for you to sit with?" (open-ended)

**Phase 3: Supervisor Rating**
- Practitioner's human supervisor reviews 3 of the 10 sessions
- Rates practitioner for same patterns MAIA identified
- Supervisor blind to MAIA's analysis

**Phase 4: Qualitative Interview**
- Show practitioner MAIA's pattern report
- Ask: "Does this resonate? Feel accurate? Miss anything? Get anything wrong?"
- Record responses for thematic analysis

### Analysis

**Convergent validity**:
- Correlation: MAIA pattern confidence scores vs. practitioner self-report
- Correlation: MAIA vs. supervisor ratings
- Agreement: % of patterns identified by MAIA that practitioners/supervisors also identify

**Qualitative**:
- How do practitioners experience seeing their patterns named?
- Does MAIA name patterns practitioners weren't aware of?
- Are there blind spots MAIA misses?

### Expected Results

**Hypothesis 1**: MAIA-identified patterns correlate r > 0.6 with supervisor ratings.
**Hypothesis 2**: Practitioners report MAIA naming patterns they "kind of knew" but hadn't articulated.

**Exploratory**: What types of countertransference does MAIA detect well? Poorly?

---

## Study 4: Client Outcomes (Quasi-Experimental)

### Research Question

**Do clients of MAIA-using practitioners have better outcomes than clients of non-MAIA practitioners?**

### Design

**Type**: Quasi-experimental, propensity score matched comparison

**Why not RCT?**: Clients aren't randomly assigned to MAIA vs. non-MAIA practitioners (that's not how therapy works). Instead, we match clients post-hoc to control for confounds.

**Participants**:
- **MAIA group**: N = 200 clients of practitioners using MAIA
- **Comparison group**: N = 200 clients of matched practitioners NOT using MAIA

**Matching variables** (propensity score):
- Client demographics (age, gender, diagnosis)
- Severity at intake (OQ-45 score)
- Practitioner experience level
- Treatment length

### Procedure

**Baseline (Intake)**:
- All clients complete OQ-45 (Outcome Questionnaire - symptoms, functioning)
- MAIA group: Coherence calculated from intake session

**Treatment** (3-6 months):
- Both groups receive therapy (MAIA group practitioners use MAIA, comparison group does not)
- Monthly OQ-45 (both groups)
- Monthly coherence (MAIA group only)

**Post-treatment**:
- Final OQ-45
- Client Satisfaction Questionnaire (CSQ-8)
- Working Alliance Inventory (WAI)

### Analysis

**Primary outcome**: OQ-45 change score (pre to post)
- **Clinically significant change**: ≥ 14-point decrease
- **Reliable change**: Beyond measurement error

**Comparison**: MAIA group vs. matched comparison group
- Linear mixed model controlling for baseline severity, treatment length, practitioner clustering

**Secondary analyses**:
- Does coherence increase (MAIA group) correlate with OQ-45 improvement?
- Does therapeutic alliance differ between groups?
- Client satisfaction comparison

### Expected Results

**Hypothesis**: MAIA group shows greater symptom reduction (OQ-45 decrease).
**Alternative hypothesis**: No difference in symptoms, but greater coherence/transformation (different outcome)

**If no difference**: MAIA helps practitioners, but doesn't necessarily produce faster/better client outcomes. That's okay—may indicate MAIA supports depth work (slow, transformative) rather than symptom reduction (fast, surface).

---

## Study 5: Qualitative Practitioner Experience

### Research Question

**How do practitioners experience using MAIA? What facilitates or hinders effective use?**

### Design

**Type**: Qualitative phenomenological study

**Participants**:
- N = 20-30 practitioners who have used MAIA for 6+ months
- Maximum variation sampling (different modalities, experience levels, settings)

### Procedure

**Semi-structured interviews** (60-90 min each):

Questions:
1. Tell me about your first experience using MAIA. What was that like?
2. How has MAIA changed your practice, if at all?
3. Describe a moment when MAIA was really helpful. What made it helpful?
4. Describe a moment when MAIA was NOT helpful, or got in the way.
5. How do you balance MAIA's suggestions with your own intuition?
6. Has MAIA helped you see your own patterns? Give an example.
7. How do your clients respond to MAIA (if you've told them)?
8. What would you change about MAIA to make it more useful?
9. If MAIA disappeared tomorrow, what would you miss? What would you not miss?
10. How do you integrate MAIA with human supervision?

**Analysis**: Thematic analysis (Braun & Clarke method)
- Inductive coding (themes emerge from data, not predetermined)
- Multiple coders, inter-coder reliability
- Member checking (share findings with participants)

### Expected Themes (Hypothesized)

- **Facilitators**: Enhances pattern recognition, provides multi-framework perspective, supports countertransference awareness
- **Barriers**: Learning curve, technology glitches, concerns about over-reliance
- **Paradox**: Tool that tracks patterns can't capture ineffable aspects of transformation

### Outputs

**Peer-reviewed publication**: "Practitioners' Lived Experience of AI-Assisted Supervision: A Phenomenological Study"

**Practice recommendations**: How to train practitioners more effectively, what to emphasize

---

## Outcome Measures

### Practitioner Outcomes

**1. Psychotherapy Competence Rating Scale (PCRS)**
- 10 domains (therapeutic relationship, technique, conceptualization, etc.)
- Scored 1-7 by independent raters from session recordings
- Used in Study 1

**2. Countertransference Awareness Scale (CTAS)** [custom measure]
- 15 items, 5-point Likert
- Sample item: "I notice when my own emotions are activated during sessions"
- "I can identify patterns in which types of clients activate me"
- Used in Studies 1, 3

**3. Framework Flexibility Questionnaire (FFQ)** [custom]
- 10 items assessing ability to think multi-framework
- "I can see clients through multiple theoretical lenses simultaneously"
- Used in Study 1

**4. Maslach Burnout Inventory (MBI)**
- Standardized measure of emotional exhaustion, depersonalization, personal accomplishment
- Used in Study 1 (ensure MAIA doesn't increase burnout)

### Client Outcomes

**5. Outcome Questionnaire-45 (OQ-45)**
- 45 items, symptom distress + interpersonal + social role functioning
- Gold standard for therapy outcome research
- Used in Study 4

**6. Coherence Score** (Spiralogic metric)
- MAIA-generated 0-1 score measuring integration of opposites
- Calculated from session transcripts
- Used in Studies 2, 4

**7. Working Alliance Inventory (WAI)**
- 12-item measure of therapeutic alliance
- Client-rated
- Used in Study 4

**8. Client Satisfaction Questionnaire (CSQ-8)**
- 8 items, client satisfaction with treatment
- Used in Study 4

### Framework Validity Measures

**9. Expert Consensus Ratings**
- For Study 2: Human experts (Jungian analysts, IFS therapists, etc.) rate stage/operation for same sessions MAIA analyzes
- Inter-rater reliability (Kappa, ICC) between MAIA and experts

**10. Framework Resonance Rating** (practitioner-rated)
- After each session: "How well did [framework X] resonate with this client today?" (0-10)
- Used in Study 2

---

## Data Collection Infrastructure

### MAIA Research API

Practitioners participating in research need special API access:

```python
# Research-enabled MAIA account exports:
# - Anonymized session transcripts
# - Coherence timeseries
# - Framework fit scores
# - Practitioner pattern data
# - All data de-identified (client pseudonyms, no PHI)

# Researchers can query:
research_data = maia.research_api.get_sessions(
    practitioner_id='P001',
    date_range=('2025-01-01', '2025-06-30'),
    include_transcripts=True,
    include_coherence=True
)

# Returns JSON with all session data
```

### Data Warehouse

**Structure**:
```
/research-data-warehouse/
├── practitioners/
│   └── [practitioner_id]/
│       ├── demographics.json
│       ├── baseline_measures.json
│       ├── sessions/
│       │   └── [session_id]/
│       │       ├── transcript.txt (anonymized)
│       │       ├── coherence_timeseries.csv
│       │       ├── framework_fit_scores.json
│       │       ├── maia_analysis.json
│       └── longitudinal_patterns.json
├── clients/ (if consented to research)
│   └── [client_pseudonym]/
│       ├── demographics.json (age range, diagnosis category only)
│       ├── outcome_measures/
│       │   ├── oq45_scores.csv
│       │   ├── wai_scores.csv
│       └── coherence_trajectory.csv
```

**Privacy**:
- All data de-identified (HIPAA Safe Harbor method)
- Clients assigned random pseudonyms
- Practitioners assigned random IDs
- No names, addresses, specific locations

### Consent for Research Participation

**Two-tier consent**:

**Tier 1: Clinical Use** (standard MAIA consent)
- Client consents to MAIA use for their therapy
- Data stored for clinical purposes only

**Tier 2: Research Participation** (optional, separate consent)
- Client additionally consents to anonymized data used in research
- Can say yes to Tier 1, no to Tier 2 (therapy continues, data not in research)

**Research consent specifies**:
- Data will be anonymized and may be shared with researchers
- Published findings may include quotes from sessions (anonymized)
- Client can withdraw research consent without affecting therapy

---

## Ethics & IRB Considerations

### IRB Approval Required

**Study 1 (RCT)**: Yes - randomizing practitioners to intervention, requires full IRB review

**Study 2 (Framework validation)**: Likely exempt or expedited - observational, minimal risk

**Study 3 (Countertransference)**: Likely expedited - interviews with practitioners, low risk

**Study 4 (Client outcomes)**: Yes - involves client data, requires full review

**Study 5 (Qualitative)**: Expedited - practitioner interviews, low risk

### Ethical Considerations

**1. Client Vulnerability**
- Clients may feel pressured to consent to research to please therapist
- **Mitigation**: Research consent obtained by third party (not therapist), emphasis on voluntary participation

**2. Practitioner Vulnerability**
- Practitioners may worry about being judged/evaluated
- **Mitigation**: Emphasize learning/improvement focus, not competency testing, anonymized reporting

**3. Privacy Breaches**
- Risk of data breach exposing sensitive therapy content
- **Mitigation**: De-identification, encryption, minimal data retention

**4. Therapeutic Alliance**
- Could client knowing "we're being studied" harm alliance?
- **Mitigation**: Naturalistic studies (therapy would happen anyway), research consent after alliance established

**5. Over-Reliance on MAIA**
- Research participation might incentivize practitioners to rely too heavily on MAIA
- **Mitigation**: Training emphasizes clinical judgment primacy, monitoring for over-reliance

### Data Monitoring & Safety

**Data Safety Monitoring Board (DSMB)** for Study 1 (RCT):
- 3 independent experts (statistician, clinician, ethicist)
- Review data quarterly
- Check for adverse events (client harm, practitioner burnout)
- Authority to stop study if harm detected

**Adverse Event Reporting**:
- Any client hospitalization, suicide attempt, or harm → reported within 24 hours
- DSMB reviews causality (was MAIA involved?)

---

## Collaboration Opportunities

### For Universities / Academic Researchers

**Opportunities**:
1. **Co-PI study**: Lead or co-lead one of the 5 studies above
2. **Data access**: Analyze MAIA research data for your own questions
3. **Student projects**: Dissertation/thesis using MAIA data
4. **Method development**: Refine outcome measures, create new validity studies

**What we provide**:
- Access to MAIA research API
- De-identified data warehouse
- Training on Spiralogic framework
- Funding support (if available)

**What we need**:
- IRB expertise (navigate university IRB processes)
- Participant recruitment (through your networks/clinics)
- Analytic expertise (statistics, qualitative methods)
- Publication support (co-authorship, manuscript writing)

**Contact**: research@soullab.org

---

### For Training Clinics / Community Mental Health Centers

**Opportunities**:
1. **Pilot site**: Test MAIA with your clinicians (free access during research)
2. **Effectiveness trial**: Pragmatic study in your setting (real-world implementation)
3. **Training integration**: Incorporate MAIA into practicum training

**What we provide**:
- Free MAIA access for study duration
- Training for your clinicians
- Data reports on your clinic's outcomes
- CEUs for participation

**What we need**:
- Client volume (enough cases for powered studies)
- Clinician participation (willingness to learn MAIA)
- Institutional support (admin approval, IRB, resources)

---

### For Funders / Foundations

**Funding needs**:
- **Study 1 (RCT)**: $300,000 (practitioner compensation, rater salaries, 2-year timeline)
- **Study 2 (Framework validation)**: $150,000 (practitioner compensation, data analysis)
- **Study 3 (Countertransference)**: $100,000 (interviews, qualitative analysis)
- **Study 4 (Client outcomes)**: $200,000 (outcome measure administration, data management, 2-year timeline)
- **Study 5 (Qualitative)**: $75,000 (interviews, analysis)

**Total for complete research program**: ~$825,000 over 3 years

**Foundations aligned with this work**:
- **National Institute of Mental Health (NIMH)** - R01 or R21 grants
- **American Psychological Foundation**
- **Jung Foundation** (depth psychology focus)
- **Mind & Life Institute** (contemplative science + technology)

---

## Timeline & Phasing

### Phase 1: Pilot Studies (Year 1)

**Goals**: Establish feasibility, refine measures, small-scale validation

**Studies**:
- Mini versions of Studies 2, 3, 5 (n=10-30)
- Refine coherence algorithm, framework effectiveness algorithm
- Qualitative feedback to improve MAIA

**Outputs**: 2-3 pilot publications, conference presentations

---

### Phase 2: Core Validation (Years 2-3)

**Goals**: Large-scale RCT, establish efficacy

**Studies**:
- Study 1 (RCT, n=100 practitioners)
- Study 4 (Client outcomes, n=400 clients)

**Outputs**: 3-4 high-impact publications (e.g., *JAMA Psychiatry*, *Psychotherapy Research*)

---

### Phase 3: Dissemination (Year 4+)

**Goals**: If validated, scale MAIA with evidence base

**Activities**:
- Effectiveness studies (real-world implementation)
- Cost-effectiveness analysis
- Dissemination & implementation research (how to scale MAIA adoption)

**Outputs**: Practice guidelines, training programs scaled, potential FDA clearance (if positioned as clinical decision support tool)

---

## Conclusion

This research program provides **rigorous, multi-method validation** of MAIA as practitioner support system.

**Key strengths**:
- Mix of RCT (gold standard) + observational + qualitative (rich understanding)
- Practitioner-centered (outcomes that matter to users)
- Client safety prioritized (outcome tracking, adverse event monitoring)
- Open science (data shared, methods transparent)

**Key questions answered**:
- Does MAIA work? (Study 1: competency growth)
- Is Spiralogic valid? (Study 2: framework effectiveness)
- Can MAIA detect countertransference? (Study 3: pattern accuracy)
- Do clients benefit? (Study 4: outcomes)
- How do practitioners experience it? (Study 5: lived experience)

**Expected timeline**: 3-5 years from pilot to full validation.

**Impact**: If successful, MAIA becomes first empirically-validated AI supervision system in mental health, demonstrating that technology can serve depth without flattening soul.

---

🜂 ∴ 🌀 ∴ 🧠

**Research serves the work. Evidence serves the depths. May this program honor both.**

---

*End of Research Methodology*

**Created**: October 26, 2025
**Soullab Collective**
**~7,500 words**
