# PRIVACY & SECURITY ARCHITECTURE

**Technical Compliance Overview for Legal Review**

---

## 1. REGULATORY COMPLIANCE FRAMEWORK

### Primary Regulations
✅ **HIPAA** (Health Insurance Portability and Accountability Act)
✅ **HITECH Act** (Health Information Technology for Economic and Clinical Health)
✅ **State Privacy Laws** (where applicable: CCPA, state mental health confidentiality laws)

### Compliance Posture
- MAIA designed as **HIPAA-compliant** from ground up
- Soullab Collective acts as **Business Associate** to practitioners (Covered Entities)
- Practitioners remain **Covered Entities** with primary HIPAA obligations
- Business Associate Agreement (BAA) required with each practitioner

---

## 2. HIPAA COMPLIANCE ARCHITECTURE

### 2.1 Business Associate Relationship

**Structure**:
```
CLIENT (Patient)
    ↓
PRACTITIONER (Covered Entity)
    ↓ BAA
SOULLAB/MAIA (Business Associate)
```

**Soullab's Role as Business Associate**:
- Provides technology platform for PHI processing
- Analyzes session recordings (which contain PHI)
- Returns analysis reports to practitioner
- Does NOT use PHI for own purposes beyond contracted service

**BAA Requirements We Meet**:
✅ Implement appropriate safeguards (see Technical Safeguards below)
✅ Report security incidents and breaches
✅ Ensure subcontractors (if any) sign BAAs
✅ Make internal practices available for HIPAA compliance review
✅ Return or destroy PHI upon contract termination
✅ Prohibit unauthorized use or disclosure of PHI

### 2.2 HIPAA Security Rule Compliance

**Administrative Safeguards**:
- ✅ Security officer designated
- ✅ Workforce training on HIPAA requirements
- ✅ Risk assessment conducted annually
- ✅ Sanction policy for violations
- ✅ Incident response plan
- ✅ Contingency/disaster recovery plan

**Physical Safeguards**:
- ✅ Facility access controls (cloud servers in secure data centers)
- ✅ Workstation security policies
- ✅ Device and media controls (encryption on all devices)

**Technical Safeguards** (detailed below):
- ✅ Access controls (unique user IDs, automatic logoff, encryption)
- ✅ Audit controls (logging all access to PHI)
- ✅ Integrity controls (hash verification of data)
- ✅ Transmission security (TLS 1.3 encryption)

### 2.3 HIPAA Privacy Rule Compliance

**Minimum Necessary Standard**:
- MAIA accesses only session audio/transcripts needed for analysis
- No access to full EHR or unrelated client information
- Client identifiers stripped where technically feasible

**Individual Rights**:
- ✅ **Right to access**: Clients can request MAIA analyses of their sessions
- ✅ **Right to amend**: Practitioners can correct MAIA analyses in clinical record
- ✅ **Right to accounting**: Log of all MAIA access to client PHI available
- ✅ **Right to restrict**: Clients can decline MAIA use (consent model)

**Notice of Privacy Practices**:
- Practitioners must update NPP to disclose MAIA use
- Sample NPP language: "We may use AI-assisted supervision tools to analyze session recordings for quality improvement and clinical supervision purposes."

---

## 3. TECHNICAL SECURITY ARCHITECTURE

### 3.1 Encryption

**Data at Rest**:
- **Algorithm**: AES-256 encryption
- **Key management**: Encryption keys managed via AWS KMS (Key Management Service) or equivalent
- **Practitioner-controlled keys**: Each practitioner has unique encryption key
- **Zero-knowledge architecture**: Soullab servers cannot decrypt data without practitioner's key

**Data in Transit**:
- **Protocol**: TLS 1.3 (Transport Layer Security)
- **Cipher suites**: Only strong, modern ciphers (no weak/deprecated algorithms)
- **Certificate validation**: Valid SSL certificates required for all connections

**Encrypted Fields**:
- Session audio recordings
- Session transcripts
- Client identifiers
- MAIA analysis reports
- Any metadata containing PHI

### 3.2 Access Controls

**Authentication**:
- Multi-factor authentication (MFA) required for practitioner login
- Password requirements: Minimum 12 characters, complexity rules
- Session timeout: 15 minutes of inactivity
- Failed login lockout: 5 attempts → temporary account lock

**Authorization**:
- Role-based access control (RBAC)
- Practitioners can access only their own clients' data
- Admin access limited to minimum necessary personnel
- Principle of least privilege enforced

**Unique User IDs**:
- Each practitioner has unique login
- No shared credentials
- User activity tied to individual accounts for audit trail

### 3.3 Audit Logging

**What We Log**:
- All access to PHI (who, what, when, where)
- All data uploads (session recordings)
- All MAIA analyses generated
- All data downloads/exports
- All login attempts (successful and failed)
- All system administrator actions
- All data deletion/modification events

**Log Characteristics**:
- Immutable (cannot be altered after creation)
- Retained for minimum 7 years (exceeds HIPAA 6-year requirement)
- Reviewed quarterly for unusual activity
- Available for audit upon request

**Sample Audit Log Entry**:
```
{
  "timestamp": "2025-10-26T14:32:17Z",
  "user_id": "practitioner_12345",
  "action": "upload_session_recording",
  "client_id": "client_67890_pseudonym",
  "file_hash": "sha256:abc123...",
  "ip_address": "192.168.1.1",
  "status": "success"
}
```

### 3.4 Data Integrity

**Hash Verification**:
- SHA-256 hashes generated for all uploaded recordings
- Verifies data not tampered with during transmission or storage

**Version Control**:
- MAIA analyses timestamped and versioned
- If practitioner requests re-analysis, prior versions retained

**Backup & Recovery**:
- Daily encrypted backups to geographically separate location
- 30-day backup retention
- Quarterly disaster recovery drills

### 3.5 Network Security

**Firewalls**:
- Web application firewall (WAF) blocks malicious traffic
- Database accessible only via secure internal network (no public internet access)

**Intrusion Detection**:
- Automated monitoring for suspicious activity
- Real-time alerts for potential security incidents

**DDoS Protection**:
- Cloudflare or AWS Shield for distributed denial-of-service mitigation

**Vulnerability Management**:
- Quarterly penetration testing by third-party security firm
- Automated vulnerability scanning weekly
- Security patches applied within 30 days of release

---

## 4. DATA STORAGE & RETENTION

### 4.1 Where Data Is Stored

**Primary Servers**:
- Cloud provider: AWS (Amazon Web Services) or Google Cloud Platform
- Geographic location: US-based data centers (practitioner can choose region)
- Redundancy: Multi-availability-zone for high availability

**Subprocessors** (if applicable):
- **Whisper ASR**: OpenAI (audio-to-text transcription)
  - BAA in place with OpenAI
  - Data encrypted in transit and at rest
  - Zero retention policy: OpenAI deletes data after processing
- **Analytics storage**: TimescaleDB (time-series database for coherence tracking)
  - Self-hosted on MAIA infrastructure (no third-party access)

### 4.2 Data Retention Policies

**Practitioner-Controlled Retention**:

**Option 1: Immediate Deletion**
- Recording analyzed by MAIA
- Analysis report delivered to practitioner
- Recording and transcript deleted immediately
- Only MAIA report retained in clinical record

**Option 2: Duration of Treatment**
- Recordings retained while client is in active treatment
- Upon termination, practitioner chooses:
  - Delete all recordings immediately, or
  - Retain per standard clinical records policy

**Option 3: Standard Clinical Records Retention**
- Recordings retained per practitioner's state requirements (typically 7 years for adults, longer for minors)
- Same retention period as other clinical documentation

**Data Deletion Process**:
- "Soft delete" (marked for deletion, but recoverable for 30 days in case of error)
- "Hard delete" (permanent, cryptographic erasure after 30 days)
- Practitioner can request immediate hard delete for sensitive cases

### 4.3 Data Portability

**Client Rights**:
- Clients can request all MAIA analyses of their sessions
- Provided in readable format (PDF report) within 30 days
- No fee for first copy (standard HIPAA requirement)

**Practitioner Data Export**:
- Practitioners can export all client data upon termination of service
- Provided in standard format (JSON, CSV, PDF)
- Export includes all recordings, transcripts, MAIA analyses

---

## 5. BREACH NOTIFICATION PROTOCOL

### 5.1 Breach Definition

**Security breach includes**:
- Unauthorized access to PHI
- Unauthorized disclosure of PHI
- Data theft or loss
- Ransomware attack
- Misconfigured access controls exposing data

**Breach assessment**:
- Low risk (< 500 individuals): Notify affected individuals within 60 days
- High risk (≥ 500 individuals): Notify HHS, media, and individuals immediately

### 5.2 Breach Response Process

**Within 24 hours**:
1. Contain breach (isolate affected systems)
2. Assess scope (how many clients, what data exposed)
3. Notify security officer and legal counsel
4. Begin forensic investigation

**Within 48 hours**:
5. Notify affected practitioners (our Business Associate obligation)
6. Practitioners notify affected clients (their Covered Entity obligation)

**Within 60 days**:
7. Submit breach report to HHS (if ≥ 500 individuals)
8. Notify affected individuals by mail
9. Provide credit monitoring if financial data exposed (if applicable)

**Ongoing**:
10. Remediate vulnerability
11. Update security policies to prevent recurrence
12. Document lessons learned

### 5.3 Practitioner Notification

**What we tell practitioners**:
- Date and time of breach
- What data was exposed (recordings, transcripts, client IDs, etc.)
- How many of their clients affected
- What we've done to contain breach
- What they need to do (notify clients, offer services)
- Contact person for questions

**Sample Practitioner Breach Notice**:
```
URGENT: Security Breach Notification

On [DATE], MAIA experienced a security incident involving unauthorized
access to encrypted session recordings. We have contained the breach
and are conducting a full investigation.

Your clients affected: [NUMBER]
Data exposed: [SESSION RECORDINGS / TRANSCRIPTS / OTHER]
Risk level: [LOW / MEDIUM / HIGH]

Your obligations:
1. Notify affected clients within 60 days
2. Offer [credit monitoring / counseling referrals / other support]
3. Document notifications in client records

Contact [SECURITY OFFICER] at [EMAIL/PHONE] with questions.
```

---

## 6. THIRD-PARTY VENDORS & SUBPROCESSORS

### 6.1 Vendor Management

**All vendors with PHI access must**:
- ✅ Sign Business Associate Agreement
- ✅ Demonstrate HIPAA compliance
- ✅ Undergo security assessment before onboarding
- ✅ Submit to annual security audits

**Current Subprocessors**:

| Vendor | Service | PHI Access | BAA Status |
|--------|---------|------------|------------|
| AWS | Cloud hosting | Encrypted data at rest | ✅ Signed |
| OpenAI (Whisper) | Audio transcription | Audio files (encrypted) | ✅ Signed |
| [Email provider] | Practitioner notifications | No PHI (notifications only) | N/A |

**Vendor Risk Assessment**:
- SOC 2 Type II audit required
- HITRUST certification preferred
- Annual recertification

### 6.2 International Data Transfers

**Current policy: US-only data storage**
- No transfer of PHI outside United States
- Cloud servers in US regions only
- If international practitioners use MAIA: Data stored in US, subject to US privacy laws

**Future consideration**:
- EU data residency option for GDPR compliance (if expanding internationally)
- Standard Contractual Clauses (SCCs) for cross-border transfers

---

## 7. STATE-SPECIFIC PRIVACY LAWS

### 7.1 California (CCPA/CPRA)

**Applicability**: If MAIA has California clients
- **Consumer rights**: Access, deletion, opt-out of sale (we don't sell data)
- **Notice**: Privacy policy must disclose AI use, data retention, third parties
- **Sensitive data**: Mental health information is "sensitive personal information" under CPRA
  - Enhanced protections required
  - Cannot use for purposes beyond providing service without explicit consent

**Our compliance**:
- ✅ Privacy policy updated with CCPA disclosures
- ✅ Do not sell client data
- ✅ Consent model allows opt-out
- ✅ Data deletion mechanism in place

### 7.2 New York (SHIELD Act)

**Applicability**: If MAIA has New York clients
- **Data security**: Requires "reasonable" safeguards
- **Breach notification**: Notify within "most expedient time" (not to exceed regulatory limits)

**Our compliance**:
- ✅ Encryption and access controls meet "reasonable" standard
- ✅ Breach notification protocol complies

### 7.3 Mental Health Confidentiality Laws (State-Specific)

Many states have **enhanced confidentiality protections** for psychotherapy notes and mental health records beyond HIPAA.

**Examples**:
- **California**: Psychotherapist-patient privilege (Evidence Code § 1014)
- **New York**: Mental hygiene records (Mental Hygiene Law § 33.13)
- **Texas**: Mental health records confidentiality (Health & Safety Code § 611)

**Implications for MAIA**:
- Session recordings may qualify as "psychotherapy notes"
- Some states prohibit disclosure without explicit client consent (✅ we require consent)
- Some states require court order to compel disclosure (✅ we assist practitioners in resisting inappropriate subpoenas)

**Our approach**:
- Practitioners responsible for knowing their state's mental health confidentiality laws
- MAIA provides technical compliance (encryption, access controls)
- Legal counsel should advise practitioners on state-specific obligations

---

## 8. AI-SPECIFIC PRIVACY CONSIDERATIONS

### 8.1 Algorithmic Transparency

**Transparency Principle**:
- Clients have right to know when AI is used in their care
- Consent forms explicitly disclose MAIA's role
- Practitioners can explain (in lay terms) how MAIA works

**What we disclose**:
- ✅ MAIA uses AI/machine learning to analyze sessions
- ✅ MAIA has limitations and biases (documented)
- ✅ Practitioner makes final decisions, not MAIA

**What we don't disclose** (proprietary):
- ❌ Specific algorithms or model architectures
- ❌ Training data sources (beyond high-level description)
- ❌ Trade secret methods

**Balance**: Transparency for clients vs. IP protection for Soullab

### 8.2 De-Identification vs. Anonymization

**Current approach**: **Pseudonymization**
- Client names replaced with pseudonyms ("Client A", "Client 12345")
- Pseudonyms consistent across sessions (allows tracking over time)
- Mapping table (pseudonym → real identity) secured separately
- Practitioners can re-identify clients (necessary for clinical care)

**Not full anonymization** because:
- Voice biometrics could potentially re-identify clients
- Session content may contain identifying details (place names, relationships)

**Legal classification**: Still PHI under HIPAA (pseudonymization ≠ de-identification per HIPAA Safe Harbor or Expert Determination methods)

### 8.3 Training Data Privacy

**Question**: Does Soullab use client session data to train MAIA's models?

**Current policy: NO**
- Client session data used **only** for providing contracted service (analysis)
- Not used to improve models or train new algorithms
- If we want to use aggregated data for research/improvement:
  - Require separate explicit consent
  - Apply rigorous de-identification (exceed HIPAA standard)
  - IRB approval for research use

**Future consideration**:
- Federated learning: Improve models without centralizing data
- Differential privacy: Add noise to aggregated data to prevent re-identification

---

## 9. INCIDENT SCENARIOS & LEGAL OBLIGATIONS

### Scenario 1: Ransomware Attack Encrypts Client Data

**Legal obligations**:
1. Assess breach: Was data exfiltrated or just encrypted?
2. If exfiltrated → HIPAA breach, notify practitioners + HHS + clients
3. If only encrypted (no exfiltration) → May not be breach, but disclose to practitioners as precaution
4. Restore from backups
5. Forensics to determine attack vector
6. Remediate vulnerability
7. Consider cyber insurance claim

**Liability**:
- Soullab liable for technical failure to prevent breach
- Practitioners may have secondary liability to clients
- Cyber insurance should cover breach costs, credit monitoring, legal fees

---

### Scenario 2: MAIA Employee Inappropriately Accesses Session Data

**Legal obligations**:
1. Immediately revoke employee access
2. Investigate: What data accessed? Why?
3. Determine if HIPAA breach (unauthorized access = breach)
4. Notify affected practitioners
5. Practitioners notify affected clients
6. Terminate employee, report to law enforcement if criminal
7. Workforce retraining on HIPAA

**Liability**:
- Soullab liable for workforce member's violation
- HIPAA civil penalties possible ($100-$50,000 per violation)
- State law penalties possible
- Civil liability to affected clients

---

### Scenario 3: Cloud Provider (AWS) Has Data Breach

**Legal obligations**:
1. AWS notifies us of breach (per their BAA)
2. We assess impact on MAIA clients
3. Notify affected practitioners
4. Practitioners notify clients
5. Cooperate with AWS investigation
6. Consider switching vendors if trust eroded

**Liability**:
- AWS primarily liable (they're our Business Associate)
- Soullab may have secondary liability if we chose inadequate vendor
- "Due diligence" defense: We selected reputable vendor, required BAA, verified SOC 2 compliance

---

### Scenario 4: Practitioner's Device Stolen with MAIA Session Recordings

**Legal obligations**:
1. Practitioner notifies us of device theft
2. We remotely wipe device (if MDM enabled)
3. Assess: Was data encrypted? Was device password-protected?
4. If encrypted → Low breach risk
5. If not encrypted → HIPAA breach, notify clients
6. Review practitioner's security practices

**Liability**:
- **Practitioner primarily liable** (their device, their responsibility to secure)
- Soullab **not liable** if we provided encryption and practitioner failed to use it
- Importance of practitioner training and contractual security obligations

---

## 10. LEGAL QUESTIONS FOR REVIEW

**Attorney, please advise on**:

1. **BAA sufficiency**: Does our BAA template meet HIPAA requirements? (Template available upon request)

2. **Multi-state compliance**: Do we need to comply with mental health confidentiality laws in all 50 states, or only states where practitioners are licensed?

3. **Psychotherapy notes**: Are MAIA analyses considered "psychotherapy notes" under HIPAA (which have extra protections)?

4. **Consent vs. authorization**: Do we need separate HIPAA authorization in addition to our consent forms?

5. **Subprocessor liability**: If OpenAI (Whisper ASR) has a breach, what's our exposure?

6. **International expansion**: If we expand to EU, what GDPR compliance is needed? Is data localization required?

7. **Law enforcement requests**: How do we handle subpoenas for MAIA data? Can we resist?

8. **De-identification standard**: If we want to use aggregated data for research, what de-identification standard is legally sufficient?

9. **State breach notification laws**: Do we need to comply with state breach laws in addition to HIPAA? (Some states have shorter timelines)

10. **AI-specific regulations**: Are there emerging AI regulations (EU AI Act, state AI laws) we should prepare for?

---

## SUMMARY

**Our privacy/security posture is**:
- ✅ HIPAA-compliant by design
- ✅ Strong encryption (AES-256 at rest, TLS 1.3 in transit)
- ✅ Robust access controls (MFA, RBAC, audit logging)
- ✅ Comprehensive breach notification protocol
- ✅ Practitioner-controlled data retention
- ✅ Business Associate Agreements with all vendors
- ✅ Regular security audits and penetration testing

**We need legal review to**:
- Validate our architecture meets all legal requirements
- Identify gaps or additional state-specific obligations
- Ensure BAA and consent forms are legally sufficient
- Advise on emerging AI privacy regulations

---

**Prepared**: October 26, 2025
**For**: Legal review by [Attorney/Firm Name]
**Technical Contact**: [Name/Email for architecture questions]
