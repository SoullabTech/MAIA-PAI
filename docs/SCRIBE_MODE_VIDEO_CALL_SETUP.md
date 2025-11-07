# Scribe Mode Video Call Setup Guide

## The Problem

When you're on a video call (TeamMeet, Zoom, etc.) and want MAIA to record the session:

- **With headphones:** MAIA only hears you, not your client
- **With speakers:** MAIA hears both, but causes echo/feedback
- **Solution needed:** Route both audio streams to MAIA without echo

This guide shows you how to set up professional audio routing so MAIA captures everything while you use headphones.

---

## Solution Overview

We'll create a **virtual audio pipeline** that:
1. Sends your client's voice from TeamMeet → MAIA
2. Sends your voice from mic → MAIA
3. Lets you hear client through headphones
4. Prevents echo (client won't hear themselves)

**Time to setup:** 15-30 minutes (one time)
**Cost:** Free (BlackHole) or $99 (Loopback)

---

## Option 1: BlackHole (Free, Open Source)

### What is BlackHole?

A virtual audio driver that creates "invisible speakers" that other apps can listen to. Think of it as a wire connecting one app's output to another app's input.

### Prerequisites

- macOS 10.15 or later
- Homebrew installed ([install here](https://brew.sh) if needed)
- Administrator access

---

### Step 1: Install BlackHole

Open **Terminal** and run:

```bash
brew install blackhole-2ch
```

Wait for installation to complete (2-3 minutes).

**Verify installation:**
1. Open **System Settings → Sound → Output**
2. You should see "BlackHole 2ch" in the list

---

### Step 2: Create Multi-Output Device

This device sends audio to multiple places at once (your headphones + BlackHole).

1. Open **Audio MIDI Setup** app
   - Spotlight search: `Audio MIDI Setup`
   - Or: `/Applications/Utilities/Audio MIDI Setup.app`

2. Click the **+** button (bottom left)
3. Select **"Create Multi-Output Device"**

4. In the right panel, check these boxes:
   - ✅ **BlackHole 2ch**
   - ✅ **Your headphones** (e.g., "AirPods" or "External Headphones")

5. **Important:** Make sure your headphones are listed FIRST
   - Drag them above BlackHole if needed
   - This ensures you hear audio without delay

6. Rename the device:
   - Right-click → Rename
   - Name it: **"Headphones + BlackHole"**

**What this does:** When an app plays audio to this device, it goes to both your headphones AND BlackHole.

---

### Step 3: Create Aggregate Device

This device combines multiple audio inputs into one (your mic + BlackHole).

1. Still in **Audio MIDI Setup**, click **+** again
2. Select **"Create Aggregate Device"**

3. In the right panel, check these boxes:
   - ✅ **Your microphone** (e.g., "MacBook Pro Microphone" or external mic name)
   - ✅ **BlackHole 2ch**

4. **Important:** Make sure your microphone is listed FIRST
   - This sets it as the "clock source" (timing reference)

5. Rename the device:
   - Right-click → Rename
   - Name it: **"Mic + BlackHole"**

**What this does:** Apps listening to this device hear both your mic AND whatever's playing through BlackHole.

---

### Step 4: Configure TeamMeet/Zoom

**In your video call app settings:**

1. **Output (Speaker):** "Headphones + BlackHole"
   - This sends client audio to your headphones AND to BlackHole

2. **Input (Microphone):** Your regular microphone
   - NOT the Aggregate Device (that's for MAIA)
   - TeamMeet still needs to hear you normally

**TeamMeet-specific:**
- Settings → Audio → Speaker → Select "Headphones + BlackHole"
- Settings → Audio → Microphone → Your regular mic

**Zoom-specific:**
- Settings → Audio → Speaker → Select "Headphones + BlackHole"
- Settings → Audio → Microphone → Your regular mic

---

### Step 5: Configure MAIA (Browser)

**In Chrome/Edge:**

1. Go to `chrome://settings/content/microphone`
2. Find "MAIA" or soullab.life in the site list
3. Click dropdown → Select **"Mic + BlackHole"** (Aggregate Device)

**Or when MAIA first asks for mic permission:**
- Look for "Mic + BlackHole" in the dropdown
- Select it and Allow

**In Safari:**
- Safari → Settings → Websites → Microphone
- Find soullab.life
- Change to **"Mic + BlackHole"**

---

### Step 6: Test the Setup

1. **Start a test TeamMeet call** (you can call yourself or a friend)
2. **Open MAIA** at soullab.life/maia
3. **Start Scribe Mode**
4. **Speak into your mic** → MAIA should transcribe your words
5. **Have your call partner speak** → MAIA should transcribe their words too
6. **Check your headphones** → You should hear your partner clearly

**Troubleshooting tests:**

| Issue | Test | Fix |
|-------|------|-----|
| Can't hear client | Play music through TeamMeet | Check Multi-Output has headphones checked |
| MAIA doesn't hear client | Client speaks, no transcription | Check Aggregate Device has BlackHole checked |
| MAIA doesn't hear you | You speak, no transcription | Check Aggregate Device has your mic checked |
| Echo/feedback | Client hears themselves | Make sure TeamMeet output is Multi-Output, NOT regular speakers |

---

### Audio Flow Diagram

```
┌─────────────────┐
│   Your Voice    │
└────────┬────────┘
         │
         v
┌─────────────────┐      ┌──────────────────┐
│  Your Real Mic  │─────→│  AGGREGATE       │
└─────────────────┘      │  "Mic+BlackHole" │───→ MAIA Browser
                         └──────────────────┘         ↓
                                   ↑              Scribe Mode
┌─────────────────┐                │              Transcribes
│   TeamMeet      │                │              Everything!
│   (Client's     │                │
│   Voice)        │                │
└────────┬────────┘                │
         │                         │
         v                         │
┌─────────────────┐      ┌─────────────┐
│  MULTI-OUTPUT   │─────→│  BlackHole  │
│  "Headphones +  │      └─────────────┘
│   BlackHole"    │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Your Headphones│  ← You hear client
└─────────────────┘
```

---

## Option 2: Loopback by Rogue Amoeba ($99)

### Why Choose Loopback?

- **Simpler interface:** Visual drag-and-drop routing
- **No MIDI Setup confusion:** All in one app
- **Monitoring:** See audio levels in real-time
- **Presets:** Save configurations for different scenarios

### Purchase & Install

1. Download from: https://rogueamoeba.com/loopback/
2. Free trial available (20 minutes per session)
3. Purchase: $99 one-time (no subscription)

---

### Setup with Loopback

**Step 1: Create New Virtual Device**

1. Open Loopback
2. Click **"New Virtual Device"**
3. Name it: **"MAIA Session Recorder"**

**Step 2: Add Sources**

Click **"Add Source"** twice to add:

1. **Source 1:** Your microphone
   - Select your mic from dropdown
   - Channels: Stereo or Mono (your choice)

2. **Source 2:** TeamMeet (application audio)
   - Select "TeamMeet" from application list
   - Channels: Stereo

**Visual layout in Loopback:**

```
┌─────────────────────────────────────┐
│  MAIA Session Recorder (Virtual)    │
│                                     │
│  Sources:                           │
│  ┌─────────────────┐               │
│  │ Your Mic        │ ──┐           │
│  └─────────────────┘   │           │
│                         ├──→ Output │──→ Available to MAIA
│  ┌─────────────────┐   │           │
│  │ TeamMeet App    │ ──┘           │
│  └─────────────────┘               │
└─────────────────────────────────────┘
```

**Step 3: Set Monitoring**

- Monitors: Select your **headphones**
- This lets you hear the client while recording

**Step 4: Enable Device**

- Toggle switch to **ON** (top right)
- You'll see "Loopback Audio" or device name in system audio list

---

### Configure Apps

**TeamMeet:**
- Microphone: Your regular mic
- Speaker: Your regular headphones
- (Loopback captures TeamMeet's output automatically)

**MAIA Browser:**
- Microphone: **"MAIA Session Recorder"** (the Loopback device)

---

### Loopback Presets

**Save this configuration:**
1. File → Save Preset → "MAIA TeamMeet Setup"
2. Next time: Just select the preset and click ON

**Other useful presets you can create:**
- "MAIA Zoom Setup" (Zoom instead of TeamMeet)
- "MAIA In-Person" (just your mic, no app audio)
- "MAIA Phone Call" (route iPhone via Bluetooth)

---

## Option 3: Quick & Dirty Solutions

### For Testing or Occasional Use

**1. Use Speakers (Accept Echo)**
- Play TeamMeet through speakers
- Position mic between you and speakers
- Client will hear slight echo (usually tolerable)
- Enable echo cancellation in TeamMeet if available

**2. Record Separately, Process Later**
- Record TeamMeet call with built-in recorder
- Export audio file
- Upload to MAIA after session
- Lose real-time consultation feature

**3. Phone on Speaker**
- If client calls your phone
- Put phone on speaker near your computer
- MAIA mic picks up phone audio
- Works in a pinch, lower quality

---

## Platform-Specific Notes

### Windows Users

**Virtual Audio Cable (VB-Audio)**
- Free: VB-Cable
- Paid: Voicemeeter Banana ($0-donate what you want)
- Similar concept to BlackHole
- Guide: https://vb-audio.com/Cable/

**Loopback Alternative:**
- Voicemeeter Banana (free, similar functionality)

### iPad/iPhone

**Current limitation:** iOS doesn't support virtual audio routing easily.

**Workaround:**
1. Use iPad for TeamMeet call
2. Use Mac/laptop for MAIA with speakers + mic setup
3. Place devices near each other

**Future possibility:** We're exploring iOS audio routing APIs for native app.

---

## Advanced Configurations

### Multi-Participant Calls

If you have 2+ clients on a call:

**BlackHole/Loopback handles this automatically**
- All participants mix into one audio stream to MAIA
- Transcription will show all voices
- Elemental analysis combines all participants

**Limitation:** Can't separate individual speakers (speaker diarization)
- MAIA doesn't know who said what
- Future feature: AI speaker separation

### Recording Quality Tips

**Mic placement:**
- 6-12 inches from your mouth
- Angle slightly off-axis (reduces plosives)
- Away from computer fan noise

**Room treatment:**
- Close doors/windows
- Soft furnishings absorb echo (curtains, rugs)
- Avoid hard parallel walls if possible

**Bitrate:**
- BlackHole: 24-bit/48kHz (excellent)
- Loopback: Up to 24-bit/96kHz (audiophile grade)
- Both are overkill for voice—16-bit/44.1kHz is fine

---

## Troubleshooting

### "MAIA isn't hearing anything"

**Check browser permissions:**
1. Site Settings → soullab.life → Microphone
2. Make sure "Mic + BlackHole" or Loopback device is selected
3. Try reloading the page

**Check device status:**
- BlackHole: Is Aggregate Device selected in browser?
- Loopback: Is virtual device toggled ON?

**Test with system:**
- macOS: System Settings → Sound → Input → Select device
- Speak and watch input level bars
- If they move, device is working

### "I can't hear my client"

**Check Multi-Output:**
- Audio MIDI Setup → Multi-Output Device
- Verify your headphones are checked
- Verify they're listed FIRST (above BlackHole)

**Check TeamMeet output:**
- TeamMeet settings → Audio → Speaker
- Should be "Headphones + BlackHole" (Multi-Output)
- NOT just "BlackHole" alone

### "Client hears echo of themselves"

**This means TeamMeet output is going to speakers:**
- Change TeamMeet output to Multi-Output device
- Make sure real speakers are NOT checked in Multi-Output
- Only headphones + BlackHole should be checked

**If echo persists:**
- Enable "Echo Cancellation" in TeamMeet audio settings
- Reduce TeamMeet volume in your headphones
- Check that mic isn't too close to headphones

### "Choppy or distorted audio"

**CPU overload:**
- Close unnecessary browser tabs
- Quit background apps
- Virtual audio devices use CPU—older Macs may struggle

**Sample rate mismatch:**
- Audio MIDI Setup → Aggregate Device → Format
- Set to 48000 Hz (matches most video call apps)
- Make sure all devices use same sample rate

**Buffer size (advanced):**
- Smaller buffer = lower latency but higher CPU
- Larger buffer = higher latency but more stable
- BlackHole defaults are usually fine

---

## Uninstallation

### Remove BlackHole

```bash
brew uninstall blackhole-2ch
```

Then delete virtual devices:
1. Audio MIDI Setup
2. Select Multi-Output and Aggregate devices
3. Press Delete key

### Remove Loopback

1. Open Loopback
2. Help → Uninstall Loopback
3. Follows uninstaller prompts

---

## Security & Privacy Notes

### What Has Access to What?

**BlackHole:**
- System-level audio driver
- No internet access
- No data collection
- Open source (auditable)

**Loopback:**
- Runs as local application
- No cloud component
- Audio never leaves your computer
- Rogue Amoeba has strong privacy policy

**MAIA:**
- Only receives audio you explicitly grant via browser
- Transcription happens via OpenAI API (encrypted)
- Session data stored locally in your downloads
- See main Scribe Mode Guide for privacy details

### Compliance (HIPAA/Therapists)

**Check with your compliance officer:**
- Virtual audio routing is considered local processing
- Similar to using a mixer or external sound card
- No PHI transmitted beyond what MAIA already receives
- Document your audio setup in security policies

---

## FAQ

**Q: Can I use AirPods?**
A: Yes! AirPods show up as "AirPods" in Multi-Output device list. Select them along with BlackHole.

**Q: Does this work with Bluetooth headphones?**
A: Yes, any Bluetooth audio device works. Slight latency (50-100ms) is normal.

**Q: Can I record in-person sessions with this?**
A: For in-person, you don't need BlackHole—just use your regular mic. Scribe Mode works with simple mic input.

**Q: Will this slow down my computer?**
A: Minimal impact on modern Macs (2018+). Older machines may notice 5-10% CPU usage increase.

**Q: Can I use this for podcasting/interviews?**
A: Absolutely! This setup is identical to many podcast recording workflows.

**Q: Does TeamMeet need to support this?**
A: No, this works at the system level. TeamMeet (or any video app) doesn't need special features.

**Q: What if I restart my computer?**
A: Virtual devices persist. You may need to re-select them in browser settings.

**Q: Can multiple apps use BlackHole at once?**
A: Yes, multiple apps can listen to the same BlackHole device simultaneously.

**Q: Is there a simpler way coming?**
A: We're exploring native integrations, but macOS security makes this challenging. Current solution is industry-standard for now.

---

## Video Tutorials

**Coming soon:**
- BlackHole setup walkthrough (5 min)
- Loopback quick start (3 min)
- Troubleshooting common issues (7 min)

Check soullab.life/support for latest video guides.

---

## Support

**Still stuck?**
- Email: support@soullab.life
- Subject: "Scribe Mode Audio Setup Help"
- Include: macOS version, video app name, what's not working

**Community Help:**
- Join practitioner community (link TBD)
- Others often have clever solutions

---

**Last updated:** November 7, 2025
