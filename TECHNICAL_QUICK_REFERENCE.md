# MAIA Technical Quick Reference Card
## Print this - bring it to your session tomorrow

---

## THE TECHNICAL FLOW (3 Steps)

```
┌─────────────────────────────────────────────────────┐
│  BEFORE SESSION (5 min)                             │
├─────────────────────────────────────────────────────┤
│  1. Open recording app (Zoom/Otter/Voice Memos)    │
│  2. Open MAIA platform in browser tab               │
│     → localhost:3000 or your domain                 │
│     → Navigate to Oracle/Chat                       │
│  3. Start session (recording app in background)     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  DURING SESSION (90-120 min)                        │
├─────────────────────────────────────────────────────┤
│  • Recording runs in background                     │
│  • You focus 100% on client                         │
│  • NO tech interaction during session               │
│  • Last 10-15 min: Introduce MAIA (optional)        │
│  • Stop recording at end                            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  AFTER SESSION (15 min)                             │
├─────────────────────────────────────────────────────┤
│  1. Get transcript (5 min)                          │
│     • Zoom: Documents/Zoom/.../audio_transcript.vtt │
│     • Otter: Export → Text                          │
│     • Voice Memos: Upload to Otter for transcription│
│                                                      │
│  2. Copy transcript text to clipboard               │
│                                                      │
│  3. Go to MAIA platform → Oracle Chat               │
│                                                      │
│  4. Paste transcript + ask for analysis:            │
│     "Please analyze this session transcript:        │
│      [PASTE TRANSCRIPT]                             │
│      Provide: coherence, stage, frameworks,         │
│      key moments, practitioner insights"            │
│                                                      │
│  5. Wait 1-2 min for MAIA response                  │
│                                                      │
│  6. Review analysis (10 min)                        │
│     • Note 1-2 insights for next session            │
│     • Save to your client notes                     │
└─────────────────────────────────────────────────────┘
```

---

## URLS & LOCATIONS

**MAIA Platform**:
```
http://localhost:3000           (local development)
OR
https://your-production-url.com (if deployed)
```

**Navigate to**: `/oracle` or `/maia` or "MAIA Oracle Chat"

**API Endpoint** (if using direct POST):
```
POST /api/oracle/personal
```

---

## RECORDING APP BUTTONS

**Zoom**:
- Start: Click "Record" button → "Record on this Computer"
- Stop: Click "Stop Recording"
- Find: Documents/Zoom/[Meeting Name]/[Date]/audio_transcript.vtt

**Otter.ai**:
- Start: Red record button
- Stop: Stop button
- Export: "Export" → "Text" (.txt file)

**iPhone Voice Memos**:
- Start: Red record button
- Stop: Red stop button
- Upload to Otter.ai for transcription

---

## SAMPLE MAIA PROMPT (Copy This)

```
Please analyze this session transcript:

[PASTE FULL TRANSCRIPT HERE]

Provide:
1. Coherence score and transformation stage
2. Active alchemical elements and operations
3. Framework suggestions (IFS, Polyvagal, Gestalt, etc.)
4. Key moments I should note
5. Practitioner insights - what worked or didn't work
6. Recommendations for next session
```

---

## WHAT MAIA WILL RETURN

- **Coherence score**: 0-1 scale (0.0-0.3 = Nigredo, 0.3-0.5 = Albedo, etc.)
- **Transformation stage**: Which alchemical phase (Nigredo/Albedo/Citrinitas/Rubedo)
- **Active elements**: Fire/Water/Earth/Air/Shadow/Aether
- **Framework suggestions**: IFS, Polyvagal, Gestalt, etc. with confidence scores
- **Key moments**: Timestamps of significant shifts
- **Practitioner insights**: What you did that worked or didn't
- **Next session recommendations**: Specific suggestions

---

## TROUBLESHOOTING

**Recording didn't save?**
→ Check default save location in app settings
→ Rename file clearly: ClientInitial_2025-01-27.m4a

**Transcript not accurate?**
→ Zoom auto-transcribe can have errors
→ Use Otter.ai for better accuracy
→ Or use Rev.com ($1.50/min) for high quality

**MAIA not responding?**
→ Check browser console for errors (F12)
→ Verify you're logged in to platform
→ Try refreshing page
→ Check that MAIA API is running (localhost:3000)

**Can't find Oracle Chat?**
→ Check your platform's navigation menu
→ Look for "Oracle" or "MAIA" or "Chat"
→ If doesn't exist, let me know - I'll build it (30 min)

---

## TIME BREAKDOWN

| Task | Time |
|------|------|
| Start recording | 30 sec |
| Regular session | 90-120 min |
| Stop recording | 30 sec |
| Get transcript | 5 min |
| Paste to MAIA | 2 min |
| MAIA analysis | 1-2 min |
| Review insights | 10 min |
| **TOTAL ADDED TIME** | **~20 min per session** |

---

## TONIGHT'S TEST CHECKLIST

- [ ] Open MAIA platform in browser
- [ ] Find Oracle/Chat interface
- [ ] Open SAMPLE_TRANSCRIPT_FOR_TESTING.md
- [ ] Copy sample transcript
- [ ] Paste into MAIA chat
- [ ] Ask for analysis
- [ ] Verify MAIA responds (30-120 sec)
- [ ] Review sample analysis
- [ ] If it works → Ready for tomorrow ✅
- [ ] If it doesn't → Ask for help

---

## THE SIMPLEST VERSION

**If you're short on time, minimum viable workflow**:

1. **Record session** (press one button)
2. **Get transcript** (Zoom auto-generates OR upload to Otter)
3. **Paste to MAIA** (copy/paste into chat)
4. **Read analysis** (MAIA responds in 1-2 min)
5. **Note 1-2 insights** (for next session)

**That's it. 20 minutes of work for deep intelligence.**

---

## EMERGENCY CONTACTS

**If tech fails tomorrow**:
- Don't panic
- Have regular session as normal
- Introduce MAIA at end (if planned)
- Start recording NEXT session instead
- You have 12 weeks - one delay is fine

---

## SUCCESS METRICS (Week 1)

After your first MAIA-analyzed session, check:

- [ ] Did MAIA catch patterns I missed?
- [ ] Was coherence score accurate to my sense?
- [ ] Were framework suggestions appropriate?
- [ ] Did I learn something useful for next session?
- [ ] Did the process take < 20 minutes?

**If YES to 3+ → Continue using MAIA**
**If NO to most → Adjust or refine approach**

---

## PRINT THIS PAGE

Bring it tomorrow as your technical reference card.

Everything you need on one sheet.

🜂 ∴ 🌀 ∴ 🧠
