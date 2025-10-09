# 🔒 Repository Security & Migration Checklist

## ⚠️ BACKUP FIRST - Critical Files to Save Locally
```bash
# Create secure backup folder
mkdir -p ~/SoullabBackup-$(date +%Y%m%d)
cd ~/SoullabBackup-$(date +%Y%m%d)

# Copy all sensitive documentation
cp /path/to/repo/*.md .
cp -r /path/to/repo/docs .
cp /path/to/repo/.env* .
cp /path/to/repo/scripts/*.ts .
```

**Essential files to backup:**
- [ ] All .env files
- [ ] BETA_USERS_LIST.md
- [ ] All *_IMPLEMENTATION.md files
- [ ] All *_INTEGRATION.md files
- [ ] All *_COMPLETE.md files
- [ ] scripts/ folder (invitation scripts)
- [ ] UPDATE_KEYS_TEMPLATE.md
- [ ] Any architecture diagrams

## 📝 GitHub Repo Renaming Steps

### Step 1: On GitHub.com
1. Go to: https://github.com/SoullabTech/SpiralogicOracleSystem
2. Click **Settings** → **General**
3. Under "Repository name", change to: `system-monitor-lite`
4. Click **Rename**
5. GitHub will create automatic redirects

### Step 2: Update Local Git Remote
```bash
# Update your local repo to point to new name
git remote set-url origin https://github.com/SoullabTech/system-monitor-lite.git

# Verify the change
git remote -v
```

### Step 3: Update Vercel/Deployment
- [ ] Go to Vercel dashboard
- [ ] Update GitHub integration to new repo name
- [ ] Trigger new deployment

## 🛡️ Immediate Privacy Actions

### 1. Make Repository Private (if you have GitHub Pro)
- Settings → General → Danger Zone → Change visibility → Make private

### 2. If Staying Public - Minimize Surface
- [ ] Settings → General → Features → Uncheck:
  - [ ] Wikis
  - [ ] Issues
  - [ ] Projects
  - [ ] Discussions

### 3. Remove Topics/Tags
- [ ] Go to repo homepage
- [ ] Click gear icon next to topics
- [ ] Remove ALL topics

### 4. Clean Git History (Nuclear Option)
```bash
# WARNING: This removes ALL commit history
# Only if you want complete privacy

# Create new branch with clean history
git checkout --orphan clean-main
git add .
git commit -m "Initial commit"
git branch -D main
git branch -m main
git push -f origin main
```

## 🔐 Security Hardening

### Update Package.json
Remove revealing information:
```json
{
  "name": "system-monitor",
  "description": "Monitoring utilities",
  "private": true
}
```

### Environment Variables
Ensure all keys are in .env files:
- [ ] Move all API keys to .env
- [ ] Remove hardcoded URLs
- [ ] Use process.env for all secrets

### Remove Internal Docs from Repo
Files to delete after backing up:
```bash
git rm *_IMPLEMENTATION.md
git rm *_INTEGRATION.md
git rm *_COMPLETE.md
git rm *_MANIFESTO.md
git rm *_FRAMEWORK.md
git rm BETA_*.md
git rm ROADMAP.md
git commit -m "Clean documentation"
```

## 🚀 Alternative: Full Migration to Private Infrastructure

### Option A: Move to Private GitLab
1. Create account at gitlab.com (free private repos)
2. Import from GitHub with one click
3. Delete GitHub repo after confirming

### Option B: Azure DevOps (Recommended for Enterprise)
- Unlimited private repos free
- Better security controls
- No public discovery

### Option C: Self-Hosted Gitea
- Complete control
- Run on your own server
- Zero external visibility

## ✅ Final Checklist

**Before Going Live:**
- [ ] All sensitive docs backed up locally
- [ ] .gitignore updated and committed
- [ ] README minimized
- [ ] Repo renamed to innocuous name
- [ ] Deployment configs updated
- [ ] Team notified of new repo URL
- [ ] Old repo name redirects working

**Security Verification:**
- [ ] Search GitHub for "SpiralogicOracleSystem" - should redirect
- [ ] Check no sensitive data in commit history
- [ ] Verify .env files not tracked
- [ ] Confirm all keys are environment variables

## 🎯 Quick Commands for Monday

```bash
# 1. Backup everything
tar -czf soullab-backup-$(date +%Y%m%d).tar.gz .

# 2. Update git remote after rename
git remote set-url origin https://github.com/SoullabTech/system-monitor-lite.git

# 3. Push with new remote
git push

# 4. Verify no sensitive files
git ls-files | grep -E "\.(env|key|pem|cert)"
```

---

**Remember:** Once public, assume everything is archived somewhere. Focus on:
1. Protecting future development
2. Securing production keys
3. Keeping architecture internal

The goal isn't perfect secrecy—it's reducing surface area and protecting your competitive advantage.

Good luck with the Monday launch! 🚀