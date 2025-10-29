# Integration Guide: Spiralogic Suite into Soullab Ecosystem

**How to Integrate These Materials into Obsidian Vault, Community Commons, and Archive**

*Created: October 26, 2025*
*Soullab Collective*

---

## Quick Answer to Your Question

**Yes, these documents should be integrated into:**

✅ **Obsidian Vault** - Your private working documents with notes
✅ **Community Commons** - Public collaborative resources (`/community/resources/alchemical-psychology-commons/`)
✅ **Archive** - Stable, citable versions for permanent reference

**Each serves a different purpose. They work together as an ecosystem.**

---

## Three Destinations, Three Purposes

### 1. **Obsidian Vault** (Private Workspace)
**What**: Your personal/team knowledge management system
**Why**: Active development, refinements, private clinical notes
**Files**: All 13 documents + your working notes

### 2. **Community Commons** (Public Collaboration)
**What**: Open resource hub for practitioners/researchers/students
**Why**: Gift economy, peer learning, collective wisdom
**Files**: Anonymized cases, protocols, educational materials

### 3. **Archive** (Permanent Reference)
**What**: Stable, version-controlled, citable repository
**Why**: Historical record, academic citations, permanent URLs
**Files**: v1.0 complete release, future versions (v1.1, v2.0, etc.)

---

## Recommended Structure

### **In Your Obsidian Vault**:
```
/Soullab Vault/
├── /Spiralogic/
│   ├── Core-Documents/
│   │   ├── Main-Paper.md
│   │   ├── Practitioner-Guide.md
│   │   ├── Case-Studies.md
│   │   └── ... (all 13 documents)
│   ├── Development-Notes/
│   │   ├── Refinements.md
│   │   ├── Practitioner-Feedback.md
│   │   └── Research-Ideas.md
│   └── Case-Work/ (PRIVATE, encrypted)
│       └── Client-Sessions/
```

### **In Community Commons** (already created):
```
/community/resources/alchemical-psychology-commons/
├── /case-library/ (anonymized community cases)
├── /clinical-protocols/ (tested protocols)
├── /research-hub/ (studies, data)
├── /education/ (tutorials, guides)
└── /technical/ (MAIA tools)
```

### **In Archive** (create this):
```
/Archive/ (or Zenodo/OSF)
├── /v1.0-complete-Oct2025/
│   └── All 13 documents as-is
├── /future-releases/
│   └── v1.1, v2.0, etc.
└── CHANGELOG.md
```

---

## Integration Workflow

```
┌─────────────────┐
│   OBSIDIAN      │ (Private Development)
│   Working docs  │
│   + Your notes  │
└────────┬────────┘
         │
         ↓ (Anonymize, review)
┌─────────────────┐
│  COMMUNITY      │ (Public Collaboration)
│  COMMONS        │
│  Peer-reviewed  │
└────────┬────────┘
         │
         ↓ (Stable release)
┌─────────────────┐
│   ARCHIVE       │ (Permanent Reference)
│   v1.0, v1.1    │
│   Citable DOI   │
└─────────────────┘
```

**Flow**:
1. Develop/refine in **Obsidian** (private)
2. Share appropriate materials to **Commons** (public, peer-reviewed)
3. Archive stable versions in **Archive** (permanent, citable)

---

## What Goes Where?

### **All 13 Documents → Start in Obsidian**
Every document lives in your Obsidian vault as working files.

### **From Obsidian → Community Commons** (selectively):

**Definitely share**:
- ✅ Case Studies (anonymized, peer-reviewed)
- ✅ Clinical Protocols (extracted individually from Practitioner Guide)
- ✅ Glossary
- ✅ Public Introduction
- ✅ Quick Start Guides
- ✅ FAQ
- ✅ Educational materials

**Consider sharing** (after review):
- ⚠️ Main Paper (after journal acceptance, or as preprint)
- ⚠️ MAIA Development Specs (public portions only, maybe proprietary)

**Never share**:
- ❌ Your private case notes
- ❌ Client session transcripts (unless thoroughly anonymized)
- ❌ Development notes with sensitive business info

### **From Commons → Archive** (stable versions):

**Archive when**:
- ✅ Major version complete (v1.0 is now ready)
- ✅ Published in journal
- ✅ Protocol reaches consensus version
- ✅ Research findings complete

**How often**: Quarterly or when significant changes warrant new version

---

## Step-by-Step: Next 3 Days

### Day 1: Set Up Obsidian
- [ ] Create `/Spiralogic/` folder in your vault
- [ ] Copy all 13 documents into `/Spiralogic/Core-Documents/`
- [ ] Create `/Development-Notes/` folder
- [ ] Create `/Case-Work/` folder (ensure encrypted)
- [ ] Add internal links between documents
- [ ] Create MOC (Map of Content) note linking everything

### Day 2: Set Up Community Commons
- [ ] The structure is already created at `/community/resources/alchemical-psychology-commons/`
- [ ] Create GitHub repository: `github.com/soullab/alchemical-psychology-commons`
- [ ] Copy the README.md I just created
- [ ] Add LICENSE file (CC BY-NC-SA 4.0)
- [ ] Extract first protocol (e.g., Calcinatio) from Practitioner Guide → `/clinical-protocols/`
- [ ] Post first anonymized case to `/case-library/`

### Day 3: Set Up Archive
- [ ] Choose platform: **Zenodo** (recommended - free, gets DOI) or **OSF** or **GitHub**
- [ ] Upload all 13 documents as "Spiralogic v1.0 Complete Suite"
- [ ] Fill metadata (title, authors, keywords, license)
- [ ] Publish → Get DOI (e.g., `doi.org/10.5281/zenodo.12345`)
- [ ] Add DOI to all documents as citation info
- [ ] Add to your CV/publications list

---

## Benefits of Three-Home System

### **Obsidian Benefits**:
- Graph view shows concept connections
- Full-text search across everything
- Daily notes linked to framework
- Private space for clinical work
- Rapid iteration

### **Commons Benefits**:
- Community contributions improve framework
- Practitioners learn from each other
- Researchers collaborate
- Students access real examples
- Gift economy spreads knowledge

### **Archive Benefits**:
- Permanent, citable URL (DOI)
- Version control (v1.0 → v1.1 → v2.0)
- Academic credibility
- Historical record
- Backup in perpetuity

---

## Technical Setup Examples

### Obsidian: Install Recommended Plugins

```
Settings → Community Plugins → Browse
```

**Essential**:
- **Dataview**: Query cases by stage/operation
- **Templater**: Case note templates
- **Graph Analysis**: See connections

**Helpful**:
- **Excalidraw**: Refine diagrams
- **Advanced Tables**: Format case data
- **Tag Wrangler**: Manage #nigredo, #calcinatio, etc.
- **Calendar**: Daily coherence tracking

### Commons: GitHub Setup

```bash
# Local terminal
cd /Users/soullab/MAIA-PAI-temp/

# Initialize Commons
git init
git add community/
git commit -m "Initialize Alchemical Psychology Commons"

# Create GitHub repo
gh repo create soullab/alchemical-psychology-commons --public

# Push
git remote add origin https://github.com/soullab/alchemical-psychology-commons.git
git push -u origin main

# Now accessible at: github.com/soullab/alchemical-psychology-commons
```

### Archive: Zenodo Upload

1. Go to **zenodo.org** → Sign in (or create account)
2. Click **"New Upload"**
3. Upload files:
   - Option A: ZIP all 13 documents
   - Option B: Upload individually (better for separate citations)
4. Fill metadata:
   - **Title**: "The Spiralogic of Soul: Complete Documentation Suite v1.0"
   - **Authors**: Soullab Collective
   - **Upload type**: Publication → Report
   - **Keywords**: Jung, Edinger, Hillman, Spiralogic, transformation, alchemy
   - **License**: Creative Commons Attribution-NonCommercial-ShareAlike 4.0
5. **Publish** → Get DOI
6. Add DOI to all your documents as citation

**Result**: `https://doi.org/10.5281/zenodo.XXXXX` (permanent URL)

---

## Maintenance Schedule

### **Daily** (if actively developing):
- Work in Obsidian
- Update notes
- Document refinements

### **Weekly**:
- Review Commons submissions
- Answer community questions
- Cross-link new concepts in Obsidian

### **Monthly**:
- Commons moderation meeting
- Integrate feedback into Obsidian working docs
- Update FAQ

### **Quarterly**:
- Major protocol reviews
- Consider new Archive version (v1.1) if significant changes
- Community awards

### **Annually**:
- Major version release (v2.0)
- Complete Archive snapshot
- Community conference
- Impact assessment

---

## Citation Examples

**If using Archive DOI**:

APA Format:
```
Soullab Collective. (2025). The Spiralogic of Soul:
Complete documentation suite (Version 1.0) [Data set].
Zenodo. https://doi.org/10.5281/zenodo.XXXXX
```

**If using individual documents**:

```
Soullab Collective. (2025). The Spiralogic of Soul:
Integrating Jung, Edinger, and Hillman through
computational alchemy. Unpublished manuscript.
https://doi.org/10.5281/zenodo.XXXXX
```

**In-text**:
```
The triple helix of transformation (Soullab Collective,
2025) integrates Jung's symbolic vocabulary, Edinger's
operational anatomy, and Hillman's ecological grounding...
```

---

## FAQ

**Q: Do I have to share everything publicly?**
A: No. Obsidian is private. Only share to Commons what you want public (and ensure it's anonymized).

**Q: What if I refine protocols—do I update everywhere?**
A: Refine in Obsidian → Test/discuss in Commons → Archive major versions (v1.1, v2.0).

**Q: Can others contribute to "official" documents?**
A: Community contributions go to Commons. You periodically review, integrate best ideas into official docs, release new Archive version (crediting contributors).

**Q: How do I ensure client confidentiality?**
A: Never put real client data in Commons or Archive. Only Obsidian (encrypted). Anonymize thoroughly before sharing cases.

**Q: Which platform is best for Archive?**
A: **Zenodo** is ideal (free, DOI, permanent, respected). OSF also good. GitHub works but no automatic DOI.

---

## Summary Table

| Aspect | Obsidian | Commons | Archive |
|--------|----------|---------|---------|
| **Privacy** | Private | Public | Public |
| **Purpose** | Working docs | Collaboration | Reference |
| **Stability** | Evolving | Peer-reviewed | Stable |
| **Content** | Everything + notes | Selected resources | Versions only |
| **Platform** | Local (synced) | GitHub + web | Zenodo/OSF |
| **Audience** | You & team | Community | Anyone citing |

---

## Conclusion

**Answer to your question**: Yes, integrate into all three!

- **Obsidian** = Your private workshop
- **Commons** = Public library & collaboration space
- **Archive** = Permanent museum

They work together as an **ecosystem** supporting different needs:
- Obsidian for development
- Commons for community
- Archive for permanence

**Start with**: Setting up Obsidian this week, Commons next week, Archive when stable.

---

🜂 ∴ 🌀 ∴ 🧠

---

**The work finds its proper homes—private workspace, public commons, permanent archive.**

---

*End of Integration Guide*

**Created**: October 26, 2025
**Version**: 1.0
**Soullab Collective**
