# Admin Guide: Setting Up Team Member Uploads

## Quick Setup for Team Access

### For Kelly (Founder):

#### 1. Enable File Uploads in Production

Ensure `.env` has:
```bash
# File upload settings
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=pdf,docx,md,txt,json,csv

# Supabase for file storage
NEXT_PUBLIC_SUPABASE_URL=your-url
SUPABASE_SERVICE_ROLE_KEY=your-key
SUPABASE_STORAGE_BUCKET=user-files
```

#### 2. Set Up Supabase Storage Bucket

```sql
-- Create storage bucket for user files
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-files', 'user-files', false);

-- Set permissions
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);
```

#### 3. Configure User Roles

```sql
-- Add role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Set roles
UPDATE profiles SET role = 'founder' WHERE email = 'kelly@soullab.com';
UPDATE profiles SET role = 'team' WHERE email IN (
  'team-member-1@example.com',
  'team-member-2@example.com'
);
```

**Role Permissions:**

| Role | Can Upload | Can Mark Canonical | Can Delete Others' Files | Access Level |
|------|-----------|-------------------|------------------------|--------------|
| `founder` | ✅ All | ✅ Yes | ✅ Yes | Full admin |
| `team` | ✅ All | ❌ No | ❌ Own only | Team contributor |
| `contributor` | ✅ Limited | ❌ No | ❌ Own only | Guest |
| `user` | ✅ Personal | ❌ No | ❌ Own only | Standard user |

---

### For Team Members:

#### Getting Started (5 Minutes)

**Step 1: Get Credentials**
- Login to Soullab platform
- Navigate to `/oracle/library`
- You're authenticated automatically

**Step 2: Upload First File**
1. Drag & drop a PDF or markdown file
2. Add tags: `[your-name, test]`
3. Set category: `wisdom` or `reference`
4. Click Upload

**Step 3: Verify**
- Check "My Files" section
- Wait for "Processing → Ready"
- Read MAIA's reflection on your content

**Step 4: Test**
- Ask MAIA a question related to your upload
- Watch her reference YOUR work!

---

## Team Access Patterns

### Pattern 1: Individual Contributors

**Setup:**
- Each team member uploads via web interface
- Files tagged with their name
- Visibility set to "team-shared"

**Workflow:**
```
Team Member → Upload via Web → MAIA processes → Available to all
```

**Best for:**
- Remote team
- Different time zones
- Various expertise areas

---

### Pattern 2: Shared Obsidian Vault

**Setup:**
- Team shares one Obsidian vault
- Auto-sync enabled
- Each person has their folder

**Structure:**
```
SoullabDevTeam/
├── Kelly/
│   ├── Core-Teachings/
│   └── New-Insights/
├── TeamMember1/
│   ├── Research/
│   └── Practices/
├── TeamMember2/
│   ├── Client-Work/
│   └── Frameworks/
└── Shared/
    ├── Team-Frameworks/
    └── Collaborative-Docs/
```

**Workflow:**
```
Team Member → Edit in Obsidian → Auto-sync (30s) → Available in MAIA
```

**Best for:**
- Co-located team
- Tight collaboration
- Living documentation

---

### Pattern 3: Hybrid (Recommended)

**Setup:**
- Obsidian for ongoing work
- Web upload for finished pieces
- Both feed into MAIA

**Workflow:**
```
Draft in Obsidian → Iterate → Finalize → Upload PDF → Both accessible
```

**Best for:**
- Mix of finished and evolving content
- Different working styles
- Publication workflow

---

## Managing Team Contributions

### Admin Dashboard

Access at: `http://localhost:3000/admin`

**Features:**
- View all uploaded files
- Filter by contributor
- See citation counts
- Mark content as "canonical"
- Delete or archive files

**Key Metrics:**
```javascript
{
  totalFiles: 342,
  contributors: 12,
  totalCitations: 4,567,
  storageUsed: "2.3 GB",
  avgProcessingTime: "2.4 seconds",
  mostCited: "Fire-Activation-Practice.md",
  topContributor: "Kelly"
}
```

---

### Review Workflow

**For New Team Member Uploads:**

1. **Auto-Process** (immediate)
   - File uploaded → Processed → Available

2. **Review** (within 24 hours)
   - Admin checks "Recent Uploads"
   - Reads MAIA's reflection
   - Verifies alignment with Soullab values

3. **Mark as Canonical** (for core teachings)
   - Kelly reviews
   - Marks "canonical: true"
   - These get priority in MAIA's responses

4. **Track Impact**
   - Monitor citation counts
   - See which content resonates
   - Provide feedback to contributors

---

## Content Guidelines for Team

### What to Upload

**✅ Encouraged:**
- Your unique practices and rituals
- Research you've conducted or curated
- Frameworks you've developed
- Case studies (anonymized)
- Teaching materials
- Insights from your practice

**⚠️ Needs Review:**
- Content from other sources (credit required)
- Client stories (anonymize thoroughly)
- Controversial or edge-case teachings
- Experimental practices not yet tested

**❌ Don't Upload:**
- Plagiarized content
- Client-identifiable information
- Unvetted medical/health claims
- Content that contradicts Soullab values

---

### Quality Standards

**Before uploading, ask:**

1. **Is this complete?** (Not a fragment or draft)
2. **Is this clear?** (Can MAIA quote it coherently?)
3. **Is this aligned?** (Fits Soullab philosophy?)
4. **Is this yours to share?** (You have permission?)
5. **Is this helpful?** (Serves users' growth?)

**If yes to all 5: Upload! ✅**

---

## Setting Up Auto-Sync (For Obsidian Teams)

### Server-Side Setup

**1. Create systemd service (Linux) or LaunchDaemon (macOS):**

```bash
# macOS: ~/Library/LaunchAgents/com.soullab.obsidian-sync.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.soullab.obsidian-sync</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/npx</string>
        <string>tsx</string>
        <string>/path/to/scripts/start-obsidian-integration.ts</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/obsidian-sync.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/obsidian-sync-error.log</string>
</dict>
</plist>
```

**2. Load the service:**
```bash
launchctl load ~/Library/LaunchAgents/com.soullab.obsidian-sync.plist
launchctl start com.soullab.obsidian-sync
```

**3. Verify it's running:**
```bash
launchctl list | grep obsidian-sync
tail -f /tmp/obsidian-sync.log
```

---

## Monitoring and Maintenance

### Daily Checks

**Automated:**
- File processing queue (should be empty)
- Failed uploads (alert if > 5)
- Storage usage (alert if > 80%)

**Manual:**
- Review new uploads
- Read MAIA's reflections
- Check citation counts

### Weekly Reviews

**Team Meeting Agenda:**
1. Top 5 most-cited content this week
2. New contributions from team
3. User feedback on MAIA's responses
4. Content gaps identified
5. Upcoming uploads planned

### Monthly Audits

**Content Audit:**
- [ ] All files processing correctly?
- [ ] Any stale/outdated content to remove?
- [ ] Permission status up to date?
- [ ] Storage optimization needed?

**Impact Analysis:**
- Total files: ___
- Total citations: ___
- Top contributor: ___
- Most valuable content: ___
- Areas needing more depth: ___

---

## Troubleshooting Common Issues

### "Team member can't upload"

**Check:**
1. User authenticated?
2. Role set correctly in database?
3. Supabase permissions configured?
4. File size under limit?

**Fix:**
```sql
-- Verify user role
SELECT email, role FROM profiles WHERE email = 'team-member@example.com';

-- Update role if needed
UPDATE profiles SET role = 'team' WHERE email = 'team-member@example.com';
```

### "Auto-sync not working"

**Check:**
1. Is service running? `launchctl list | grep obsidian-sync`
2. Check logs: `tail -f /tmp/obsidian-sync.log`
3. Vault path correct in .env?
4. File permissions okay?

**Fix:**
```bash
# Restart service
launchctl stop com.soullab.obsidian-sync
launchctl start com.soullab.obsidian-sync

# Or run manually to see errors
npx tsx scripts/start-obsidian-integration.ts
```

### "MAIA not citing team content"

**Check:**
1. Content processed (status = 'ready')?
2. Appropriate tags added?
3. Emotional weight set (should be 0.6+)?
4. Visibility not set to "private"?

**Fix:**
```sql
-- Check file status
SELECT filename, status, tags, metadata
FROM user_files
WHERE user_id = 'team-member-id';

-- Update metadata if needed
UPDATE user_files
SET metadata = metadata || '{"emotionalWeight": 0.8}'::jsonb
WHERE id = 'file-id';
```

---

## Security Best Practices

### File Access Control

**Principle:** Users can only access their own files unless marked for sharing

```sql
-- Row Level Security (RLS)
ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own files"
ON user_files FOR SELECT
USING (auth.uid() = user_id OR visibility = 'team-shared');

CREATE POLICY "Founders see all"
ON user_files FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'founder'
  )
);
```

### Sensitive Content

**For uploads containing:**
- Client information (anonymize)
- Personal stories (get permission)
- Proprietary methods (mark as "team-only")

**Protocol:**
1. Upload with `visibility: "private"` initially
2. Kelly reviews
3. Anonymize if needed
4. Change to `visibility: "team-shared"` or `"maya-only"`

---

## Scaling Considerations

### Current Capacity

**Limits:**
- 10MB per file
- 100 files per user (default)
- 10GB total storage (free tier)

### Growth Plan

**At 100 users:**
- Upgrade Supabase plan
- Increase file size limit to 50MB
- Add CDN for file delivery

**At 1,000 users:**
- Dedicated storage service (S3)
- File compression pipeline
- Archival system for old content

**At 10,000 users:**
- Distributed storage
- AI-powered content curation
- Automated quality control

---

## Team Member Onboarding Checklist

**For each new team member:**

- [ ] Create account
- [ ] Set role to 'team' in database
- [ ] Send welcome email with:
  - Link to [TEAM_UPLOAD_BEST_PRACTICES.md](TEAM_UPLOAD_BEST_PRACTICES.md)
  - Credentials for Obsidian vault (if applicable)
  - Example uploads to review
- [ ] Schedule onboarding call
- [ ] Demo file upload process
- [ ] Upload first test file together
- [ ] Review MAIA's reflection
- [ ] Test asking MAIA about their content
- [ ] Add to team sync schedule

---

## Success Metrics

**Track these to measure impact:**

### Individual Contributor Metrics
- Files uploaded
- Total citations
- Average citation per file
- User feedback on their content
- Impact score (citations × quality)

### Team Metrics
- Total knowledge base size
- Contributors count
- Citation velocity (citations per day)
- Content diversity (element coverage)
- User satisfaction with MAIA responses

### System Health
- Upload success rate (target: >99%)
- Processing time (target: <3 seconds)
- Storage efficiency
- Auto-sync reliability (target: >99.5%)

---

## Next Steps

1. **This Week:**
   - Set up first team member access
   - Test upload flow
   - Enable auto-sync for Obsidian

2. **This Month:**
   - Onboard 3-5 team members
   - Collect 50+ team uploads
   - Review citation patterns

3. **This Quarter:**
   - Full team access enabled
   - 200+ collective uploads
   - Automated quality metrics
   - Impact dashboard live

---

## Support Resources

**Documentation:**
- [TEAM_UPLOAD_BEST_PRACTICES.md](TEAM_UPLOAD_BEST_PRACTICES.md) - For team members
- [MAYA_FILE_INGESTION_ARCHITECTURE.md](documentation/06-maya-oracle/MAYA_FILE_INGESTION_ARCHITECTURE.md) - Technical details
- [OBSIDIAN_VAULT_INTEGRATION_GUIDE.md](OBSIDIAN_VAULT_INTEGRATION_GUIDE.md) - Vault setup

**Contact:**
- Technical issues: Dev team
- Content questions: Kelly
- Access issues: Admin

---

**Your team's wisdom is ready to serve the world.** 🌍✨

**Let's make it happen!**
