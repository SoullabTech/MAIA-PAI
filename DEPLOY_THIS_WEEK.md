# 🚀 DEPLOY SPIRALOGIC THIS WEEK
**5-Day Action Plan: Monday → Friday Launch**

---

## QUICK OVERVIEW

**Monday**: Obsidian setup (3h)
**Tuesday**: GitHub Commons (4h)
**Wednesday**: Zenodo Archive + DOI (2h)
**Thursday**: Landing page (2h)
**Friday**: LAUNCH (2h)

**Total time investment**: ~13 hours spread over 5 days

---

# MONDAY: Obsidian Vault (3 hours)

## Task 1: Create Folders (15 min)
```bash
cd /Users/soullab/
mkdir -p "Obsidian-Vault/Spiralogic"/{Core-Documents,Development-Notes,Case-Work,Templates}
```

## Task 2: Copy All Files (15 min)
```bash
cp /Users/soullab/MAIA-PAI-temp/*.md /Users/soullab/Obsidian-Vault/Spiralogic/Core-Documents/
```

## Task 3: Install Plugins (30 min)
Open Obsidian → Settings → Community Plugins:
- [ ] Dataview
- [ ] Templater
- [ ] Excalidraw
- [ ] Advanced Tables
- [ ] Tag Wrangler

## Task 4: Create MOC Note (30 min)
Create `Spiralogic-MOC.md` linking all documents

## Task 5: Setup Backup (30 min)
```bash
cd /Users/soullab/Obsidian-Vault/
git init
echo "Spiralogic/Case-Work/**" > .gitignore
git add .
git commit -m "Initial Spiralogic Vault"
```

## Task 6: Test Everything (30 min)
- [ ] Open vault in Obsidian
- [ ] Search works (Cmd+O)
- [ ] Graph view loads (Cmd+G)
- [ ] Links work

✅ **DONE: Private workspace ready**

---

# TUESDAY: GitHub Commons (4 hours)

## Task 1: Create Repository (30 min)
```bash
cd /Users/soullab/MAIA-PAI-temp/community/resources/alchemical-psychology-commons/

git init
git add README.md
git commit -m "Initial commit"

# Create on GitHub (web interface or CLI)
gh repo create soullab/alchemical-psychology-commons --public

git remote add origin https://github.com/soullab/alchemical-psychology-commons.git
git push -u origin main
```

## Task 2: Add Governance Files (1 hour)

Create `LICENSE`:
```
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
[Copy from creativecommons.org/licenses/by-nc-sa/4.0/legalcode]
```

Create `CONTRIBUTING.md`:
```markdown
# Contributing to Alchemical Psychology Commons

## How to Contribute
1. Fork repository
2. Create branch
3. Make changes
4. Submit pull request

## Case Studies
- Use template in /case-library/case-template.md
- Anonymize thoroughly
- Follow ethics guidelines

[See full version in Commons README]
```

Create `CODE_OF_CONDUCT.md`:
```markdown
# Code of Conduct

## Our Pledge
Respectful, inclusive, collaborative community...

## Standards
- Respect confidentiality
- No harassment
- Constructive feedback
- Ethical practice

[See full version in Commons README]
```

```bash
git add LICENSE CONTRIBUTING.md CODE_OF_CONDUCT.md
git commit -m "Add governance documents"
git push
```

## Task 3: Create Directory Structure (30 min)
```bash
mkdir -p case-library/submitted-cases
mkdir -p case-library/transformation-signatures
mkdir -p clinical-protocols/operation-protocols
mkdir -p clinical-protocols/crisis-protocols
mkdir -p research-hub/{published-studies,active-research,methods}
mkdir -p education/{learning-paths,study-materials,workshops}
mkdir -p technical/maia-development
mkdir -p community/{forums,peer-support,events}
mkdir -p governance

# Add .gitkeep to empty folders
find . -type d -empty -exec touch {}/.gitkeep \;

git add .
git commit -m "Create directory structure"
git push
```

## Task 4: Seed First Content (2 hours)

I'll create extracted versions of key content files next, then:

```bash
# Copy first case, protocol, educational material
# (Files created in next step)

git add .
git commit -m "Seed initial content"
git push
```

## Task 5: Enable Features (15 min)
Go to repo Settings:
- [ ] Enable Issues
- [ ] Enable Discussions
- [ ] Enable Wiki
- [ ] Add description
- [ ] Add topics (tags): jung, edinger, hillman, psychology, transformation

✅ **DONE: Public commons live**

---

# WEDNESDAY: Archive + DOI (2 hours)

## Task 1: Prepare Package (30 min)
```bash
cd /Users/soullab/MAIA-PAI-temp/

mkdir -p Archive/v1.0-complete-Oct2025
cp *.md Archive/v1.0-complete-Oct2025/

# Create manifest
cat > Archive/v1.0-complete-Oct2025/MANIFEST.txt << 'EOF'
Spiralogic Suite v1.0 Complete
Release Date: October 26, 2025
Files: 17 documents
Total: ~90,000 words
License: CC BY-NC-SA 4.0
GitHub: https://github.com/soullab/alchemical-psychology-commons
EOF

# Create ZIP
cd Archive/
zip -r spiralogic-v1.0.zip v1.0-complete-Oct2025/
```

## Task 2: Upload to Zenodo (1 hour)

1. Go to **zenodo.org/deposit/new**
2. Upload `spiralogic-v1.0.zip`
3. Fill form:
   - **Title**: The Spiralogic of Soul: Complete Documentation Suite v1.0
   - **Authors**: Soullab Collective
   - **Description**: [Paste from Executive Summary]
   - **Keywords**: Jung, Edinger, Hillman, Spiralogic, transformation, alchemy, depth psychology
   - **License**: CC BY-NC-SA 4.0
   - **Related**: Link to GitHub
4. Click **Publish**
5. **Copy DOI**: Will be format `10.5281/zenodo.XXXXXX`

## Task 3: Add DOI Everywhere (30 min)
Update these files with DOI:
- [ ] Main Paper
- [ ] Academic Submission
- [ ] Executive Summary
- [ ] Master Index
- [ ] Community Commons README

Add badge:
```markdown
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.XXXXXX.svg)](https://doi.org/10.5281/zenodo.XXXXXX)
```

```bash
git commit -am "Add DOI to all documents"
git push
```

✅ **DONE: Permanent citable archive**

---

# THURSDAY: Landing Page (2 hours)

## Quick Option: Use GitHub Pages (1 hour)

```bash
cd /Users/soullab/MAIA-PAI-temp/community/resources/alchemical-psychology-commons/

# GitHub will auto-render README.md as homepage
# Just enable Pages in Settings

# Go to: Settings → Pages
# Source: Deploy from branch "main", folder "/ (root)"
# Wait 2 minutes
# Live at: https://soullab.github.io/alchemical-psychology-commons/
```

## Better Option: Add Simple index.html (2 hours)

Create `docs/index.html` with landing page (I'll create template next)

```bash
mkdir docs
# Copy index.html template (creating next)

# Update GitHub Pages to use /docs folder
# Settings → Pages → Source: main → /docs

git add docs/
git commit -m "Add landing page"
git push
```

✅ **DONE: Public website live**

---

# FRIDAY: LAUNCH (2 hours)

## Task 1: Write Announcement (30 min)

**Email draft**:
```
Subject: Introducing Spiralogic: Jung-Edinger-Hillman Integrated

Dear colleagues,

I'm excited to share The Spiralogic of Soul—a comprehensive framework
integrating three depth psychology lineages into a trackable system for
transformation.

📚 90,000+ words of documentation
🔬 Research-ready protocols
👥 Open collaborative commons
🔓 Fully open source (CC BY-NC-SA 4.0)

Explore: https://github.com/soullab/alchemical-psychology-commons
Archive: https://doi.org/10.5281/zenodo.XXXXXX

Get involved as practitioner, researcher, student, or developer.

The spiral begins,
[Name]
```

## Task 2: Prepare Social Posts (30 min)

**Twitter/X**:
```
🜂 Introducing Spiralogic: First framework integrating Jung, Edinger,
& Hillman into computational alchemy for transformation.

90K words. Clinical protocols. Training curriculum. Open source.

Dive in: [link]
```

**LinkedIn**:
```
After months of development, I'm sharing The Spiralogic of Soul—
a comprehensive integration of three major depth psychology lineages.

[3 paragraph summary]

This is open source. Join the commons: [link]
```

## Task 3: Launch Sequence (1 hour)

**10am**:
- [ ] Post to personal social media
- [ ] Post to LinkedIn

**11am**:
- [ ] Email depth psychology networks
- [ ] Email academic contacts

**12pm**:
- [ ] Post to Reddit (r/Jung, r/psychology)
- [ ] Post to relevant Facebook groups

**1pm**:
- [ ] Monitor responses
- [ ] Answer first questions
- [ ] Thank engagers

✅ **DONE: SPIRALOGIC IS LIVE! 🎉**

---

# POST-LAUNCH: First Week

## Daily:
- [ ] Check GitHub Issues/Discussions
- [ ] Respond to questions
- [ ] Welcome new members
- [ ] Document feedback

## Week 1 Goal:
- 50+ GitHub stars
- 10+ practitioners interested
- 5+ researchers reaching out
- First contribution submitted

## Week 2:
- Host first community call
- Launch beta cohort (10 practitioners)
- Review first submissions

---

# CRITICAL: Before You Start

## Add Contact Information

Update all files with hello@soullab.org placeholders:

Recommended:
- **General**: hello@soullab.org
- **Practitioners**: practitioners@soullab.org
- **Research**: research@soullab.org
- **Technical**: tech@soullab.org

Files to update:
- [ ] Community Commons README
- [ ] Executive Summary
- [ ] Master Index
- [ ] Comprehensive FAQ
- [ ] Quick Start Guides

---

# BACKUPS (Critical!)

Before launching:
- [ ] All files backed up to external drive
- [ ] Obsidian vault synced to cloud
- [ ] GitHub cloned locally
- [ ] Copy of Zenodo archive downloaded

---

# YOU'RE READY! 🚀

**This week**: Mon-Fri deployment
**Next week**: Community building
**Next month**: Training cohort, research studies

**The spiral begins Monday.**

---

🜂 ∴ 🌀 ∴ 🧠

---

*Created: October 26, 2025*
*Status: READY FOR DEPLOYMENT*
*Target: Launch by [This Friday]*
