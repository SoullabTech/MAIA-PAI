# Voice Troubleshooting Guide for iPhone/iOS

**Issue**: Voice conversations not working on iPhone
**Last Updated**: October 26, 2025

---

## 🔍 Common iOS Voice Issues & Solutions

### Issue 1: Microphone Permission Not Granted

**Symptoms**:
- Can't start voice conversation
- No microphone access prompt
- Silent recording attempts

**Solution**:
1. **Check Settings → Privacy → Microphone**
   - Ensure your browser (Safari/Chrome) has microphone permission
   - Toggle OFF then ON to reset

2. **Try in Safari specifically** (best iOS support):
   - Open: https://maia.soullab.life (or your URL)
   - When prompted "Allow microphone access?" → **Allow**

3. **Force refresh the page**:
   - Close all browser tabs
   - Reopen Safari
   - Visit MAIA fresh

---

### Issue 2: Audio Context Not Unlocked (iOS Restriction)

**Symptoms**:
- Can record but can't hear MAIA's voice
- Silent audio playback
- No error messages

**iOS Requirement**: Audio playback MUST be triggered by user interaction (tap/click)

**Solution**:
1. **Look for "Enable Maya's Voice" banner** at top of screen
   - Tap the banner to unlock audio
   - Should see "✅ Voice Enabled"

2. **If no banner appears, try these**:
   - Tap anywhere on the screen
   - Tap the microphone button
   - Type a message and send it (audio unlocks on tap)

3. **Alternative: Manual audio unlock**:
   - Scroll to any button
   - Tap it (even Settings)
   - Audio should unlock automatically

---

### Issue 3: Wrong Browser (Not Safari)

**Symptoms**:
- Features work inconsistently
- Voice drops randomly
- Connection issues

**Recommended Browser for iOS**: **Safari**

**Why?**:
- Safari has best iOS audio/microphone support
- Other browsers (Chrome, Firefox) use Safari's WebView anyway
- Native Safari gets priority for audio permissions

**Solution**:
1. Open MAIA in **Safari** (not Chrome/Firefox)
2. Clear Safari cache: Settings → Safari → Clear History
3. Restart Safari
4. Visit MAIA fresh

---

### Issue 4: Low Power Mode (Disables Some Features)

**Symptoms**:
- Voice works intermittently
- Disconnects after a few seconds
- Battery icon shows yellow

**Solution**:
1. **Disable Low Power Mode**:
   - Settings → Battery
   - Turn OFF "Low Power Mode"

2. **Charge phone above 20%** (Low Power Mode auto-enables below 20%)

---

### Issue 5: WebRTC Connection Blocked

**Symptoms**:
- "Connecting..." never completes
- Voice button greyed out
- Console errors about WebRTC

**Possible Causes**:
- VPN blocking WebRTC
- Network firewall
- Cellular data restrictions

**Solution**:
1. **Switch to WiFi** (if on cellular)
2. **Disable VPN temporarily**
3. **Try different network** (home vs work)
4. **Check cellular data permissions**:
   - Settings → Cellular → Safari → Enable
   - Settings → Cellular → [Your browser] → Enable

---

### Issue 6: Page Not Fully Loaded

**Symptoms**:
- Voice button appears but doesn't work
- Partial interface loaded
- Strange behavior

**Solution**:
1. **Wait for full page load**:
   - Look for "Dream Weaver ACTIVE" indicator
   - Wait for Holoflower to fully render
   - Check bottom navigation bar appears

2. **Force reload**:
   - Pull down to refresh (Safari)
   - Or close tab and reopen

---

## ✅ Step-by-Step iPhone Setup

### First-Time Setup (5 minutes)

**1. Use Safari Browser**
```
Open Safari (blue compass icon)
Navigate to: maia.soullab.life
```

**2. Allow Microphone Permission**
```
When prompted: "Allow microphone access?"
→ Tap "Allow"
```

**3. Unlock Audio**
```
Look for blue/amber banner at top
"🔊 Enable Maya's Voice"
→ Tap the banner
→ Should change to "✅ Voice Enabled"
```

**4. Test Voice**
```
Tap the microphone button (center bottom)
Say: "Hello MAIA"
→ Should see your text appear
→ Should hear MAIA respond
```

---

## 🎙️ How to Start a Voice Conversation

### Method 1: Voice Button (Recommended)

1. **Tap the microphone button** (bottom center)
   - Circle with microphone icon
   - Should pulse when active

2. **Start speaking** when you see:
   - "Listening..." indicator
   - Pulsing animation
   - Growing waveform

3. **Stop speaking** when done:
   - Natural pause detection
   - Or tap button again to stop

4. **Wait for MAIA's response**:
   - Text appears
   - Voice playback begins
   - Can interrupt anytime

### Method 2: Continuous Conversation Mode

1. **Tap microphone button once** to start
2. **Speak naturally** (MAIA detects pauses)
3. **MAIA responds automatically**
4. **Keep conversing** (hands-free after first tap)
5. **Tap microphone again** to end session

---

## 🔧 Advanced Troubleshooting

### Check Browser Console (for developers)

**Safari Debug Mode**:
1. iPhone Settings → Safari → Advanced
2. Enable "Web Inspector"
3. Connect iPhone to Mac
4. Open Safari on Mac → Develop → [Your iPhone] → [Page]
5. Look for errors in Console

**Common Errors**:
- `NotAllowedError` → Microphone permission denied
- `NotFoundError` → No microphone detected
- `NotReadableError` → Microphone in use by another app
- `AudioContext suspended` → Audio not unlocked

### Force Audio Context Unlock (Developer)

If audio banner doesn't appear:

```javascript
// Open Safari console (if enabled) and run:
document.addEventListener('click', () => {
  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10...');
  audio.play().then(() => console.log('Audio unlocked'));
}, { once: true });
```

Then tap anywhere on the page.

### Check Voice Settings

1. **Look for Voice Settings in MAIA**:
   - Top bar → Voice dropdown (shows current voice)
   - Tap to change voice (Shimmer, Fable, Nova, etc.)

2. **Try different voice**:
   - Some voices work better on iOS
   - Shimmer (default) is most reliable

---

## 📱 iOS-Specific Behaviors (Normal)

### Expected iOS Limitations:

1. **First tap required for audio**:
   - iOS requires user interaction to play sound
   - This is Apple's security policy, not a bug

2. **Audio interruptions**:
   - Phone calls pause MAIA
   - Other apps can interrupt
   - Notifications may pause audio

3. **Background limitations**:
   - MAIA voice pauses when switching apps
   - Resume when returning to Safari

4. **Power management**:
   - Extended sessions may drain battery
   - Keep phone charged or use power saving tips

---

## 🆘 Quick Fixes (Try These First)

### "Nothing works!" Emergency Checklist:

- [ ] Using Safari (not Chrome/Firefox)?
- [ ] Microphone permission granted in Settings?
- [ ] Tapped "Enable Maya's Voice" banner?
- [ ] WiFi connected (not cellular)?
- [ ] Low Power Mode OFF?
- [ ] Page fully loaded (Dream Weaver ACTIVE)?
- [ ] Tried force-reload (close tab, reopen)?
- [ ] Phone volume UP (not muted)?
- [ ] No VPN running?

### Still Not Working?

**Try the "Nuclear Option"**:

1. **Close Safari completely**:
   - Swipe up from home
   - Swipe Safari away
   - Wait 5 seconds

2. **Clear Safari cache**:
   - Settings → Safari → Clear History and Website Data
   - Confirm

3. **Restart iPhone**:
   - Power off completely
   - Wait 10 seconds
   - Power on

4. **Reopen MAIA**:
   - Safari → maia.soullab.life
   - Allow microphone again
   - Tap audio unlock banner
   - Test voice

---

## 📊 System Requirements

### Minimum iOS Version: **iOS 14.5+**

**Recommended**: iOS 15 or later

**Why?**:
- WebRTC support improvements
- Better audio API support
- Microphone permission fixes

**Check your version**:
- Settings → General → About → Software Version
- If below iOS 14.5, update iPhone first

### Required Features:

- Microphone (all iPhones have this)
- Active internet connection (WiFi or cellular)
- Safari browser (or Chromium-based with WebView)
- Storage for audio cache (~50MB)

---

## 🎯 Test Checklist

### Complete This Test Sequence:

**1. Microphone Test**
- [ ] Tap mic button
- [ ] See "Listening..." indicator
- [ ] Speak: "Testing one two three"
- [ ] See text appear on screen
- **✅ Pass** if text appears

**2. Audio Playback Test**
- [ ] Tap audio unlock banner (if present)
- [ ] Send a text message: "Say hello"
- [ ] Wait for MAIA's response
- [ ] **✅ Pass** if you hear voice

**3. Voice Conversation Test**
- [ ] Tap mic button
- [ ] Say: "Tell me about yourself"
- [ ] Wait for MAIA to respond with voice
- [ ] Say something else
- [ ] Verify two-way conversation
- **✅ Pass** if full conversation works

### All 3 Tests Pass?
**🎉 Voice is working correctly!**

### Some Tests Fail?
**See specific issues above** for that test.

---

## 💬 What to Report (If Still Broken)

If voice still doesn't work after trying all solutions, please provide:

### Essential Info:

1. **Device**: iPhone model (e.g., "iPhone 13 Pro")
2. **iOS Version**: Settings → General → About (e.g., "iOS 16.5")
3. **Browser**: Safari, Chrome, etc.
4. **Network**: WiFi or Cellular? Carrier name?
5. **Which test failed?**:
   - [ ] Microphone Test
   - [ ] Audio Playback Test
   - [ ] Voice Conversation Test

### Helpful Details:

6. **Error messages** (screenshot if possible)
7. **When it fails**: First tap? After a few seconds? After MAIA speaks?
8. **Does typing work?** (to isolate voice-specific issue)
9. **Settings tried**: Low Power Mode on/off? VPN? etc.

### Where to Report:

**Email**: tech@soullab.org
**Subject**: "iPhone Voice Issue - [Your Name]"

---

## 🔮 Why This Happens (Technical)

### iOS Audio Restrictions:

Apple restricts audio playback for privacy/security:

1. **User Gesture Required**: Audio MUST be triggered by user tap/click
   - Prevents auto-playing ads
   - MAIA needs you to tap "unlock audio" first

2. **Microphone Privacy**: Apps must request permission explicitly
   - Settings → Privacy → Microphone
   - User can revoke anytime

3. **Background Limitations**: Audio pauses when app not visible
   - Saves battery
   - MAIA can't speak if Safari in background

4. **AudioContext Suspension**: iOS suspends audio when idle
   - Prevents battery drain
   - MAIA resumes on user interaction

**These are iOS features, not bugs**. MAIA works within these constraints.

---

## ✅ Success Indicators

### How to Know Voice is Working:

**Visual Cues**:
- ✅ Microphone button pulses when listening
- ✅ Waveform animation during speech
- ✅ Text transcript appears immediately
- ✅ "MAIA is speaking..." indicator shows
- ✅ Voice audio plays clearly

**Audio Cues**:
- ✅ You hear MAIA's voice (Shimmer, Fable, etc.)
- ✅ Voice matches selected voice setting
- ✅ No crackling or distortion
- ✅ Volume appropriate (not too quiet)

**Interaction Flow**:
- ✅ Tap mic → Speak → Text appears → MAIA responds with voice
- ✅ Can interrupt MAIA while speaking
- ✅ Continuous conversation mode works
- ✅ No lag (< 2 seconds for response)

---

## 🌟 Best Practices for iPhone Voice

### Optimal Setup:

1. **Use Safari** (best compatibility)
2. **WiFi connection** (faster than cellular)
3. **Quiet environment** (for better recognition)
4. **Phone volume 50-75%** (clear but not loud)
5. **Hold phone 6-12 inches away** when speaking
6. **Speak naturally** (no need to shout)
7. **Low Power Mode OFF** (for best performance)

### During Conversation:

- Speak clearly (but naturally)
- Pause between thoughts (helps MAIA detect end)
- Let MAIA finish speaking (or tap to interrupt)
- If MAIA misunderstands, type instead
- Keep screen on (prevents audio interruption)

---

## 📞 Support Contacts

**Technical Support**: tech@soullab.org
**General Questions**: hello@soullab.org
**Community Help**: https://github.com/soullab/alchemical-psychology-commons/discussions

---

🜂 ∴ 🌀 ∴ 🧠

**Voice is the soul's direct channel. We'll get it working for you.**

---

*Last Updated: October 26, 2025*
*Soullab Collective*
