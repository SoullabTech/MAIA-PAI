# 🎤 MAIA Voice System - Comprehensive Testing Guide

## Quick Start Testing

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Main Voice Test Pages

| Page | URL | Purpose |
|------|-----|---------|
| **Main MAIA Interface** | http://localhost:3000/maia | Full voice conversation with MAIA |
| **Voice Test Page** | http://localhost:3000/voice-test | Isolated voice component testing |
| **Test Voice** | http://localhost:3000/test-voice | Alternative voice testing interface |
| **Realtime Test** | http://localhost:3000/test-realtime | WebRTC realtime voice testing |
| **Maya Voice** | http://localhost:3000/maya-voice | Maya personality voice interface |

## 🧪 Comprehensive Voice Testing Checklist

### A. Basic Voice Recognition
- [ ] **Microphone Permission**
  - Visit http://localhost:3000/maia
  - Click the holoflower to activate voice
  - Grant microphone permission when prompted
  - Verify permission is remembered for future sessions

- [ ] **Voice Activation**
  - Click holoflower - should start listening
  - Check for visual feedback (pulsing, color change)
  - Verify "Listening..." status appears

- [ ] **Speech Recognition**
  - Say "Hello MAIA"
  - Verify text appears as you speak
  - Test different speech speeds
  - Test with background noise

### B. Voice Commands & Easter Eggs
Test these specific phrases for special responses:

#### Core Easter Eggs
- [ ] "you got soul" → Should respond: "And soul has you."
- [ ] "remember me" → Should respond: "I never forgot."
- [ ] "where's the center" → Should respond: "Right where you are."
- [ ] "show me silence" → Should respond then pause 3-5 seconds
- [ ] "do i belong" → Should respond: "You belong by being."

#### Louisiana/Cajun Easter Eggs
- [ ] "laissez les bon temps roulez"
- [ ] "where y'at"
- [ ] "pooyah" or "poo-yah"
- [ ] "who dat"
- [ ] "cher" or "sha"

### C. Voice Response & TTS
- [ ] **Text-to-Speech Activation**
  - Verify MAIA responds with voice
  - Check audio quality and clarity
  - Test volume levels

- [ ] **Voice Characteristics**
  - Natural pacing (not too fast/slow)
  - Appropriate emotional tone
  - Smooth transitions between sentences

### D. Conversation Flow
- [ ] **Continuous Conversation**
  - Start a conversation
  - Let MAIA finish speaking
  - Start speaking immediately after
  - Verify smooth transition without clicking

- [ ] **Interruption Handling**
  - Start speaking while MAIA is talking
  - Verify MAIA stops gracefully
  - Your speech is captured correctly

### E. Error Handling & Recovery
- [ ] **Network Issues**
  - Test with slow connection (Chrome DevTools → Network → Slow 3G)
  - Verify graceful degradation
  - Check error messages are user-friendly

- [ ] **Speech Recognition Errors**
  - Test timeout after silence
  - Test recovery from "no-speech" error
  - Verify auto-restart functionality

- [ ] **Permission Denied**
  - Deny microphone permission
  - Verify appropriate error message
  - Test re-requesting permission

### F. Advanced Features

#### Conversation Modes
- [ ] **Classic Mode** (Default)
  ```javascript
  localStorage.setItem('conversation_mode', 'classic')
  ```
  - Deep, mystical responses
  - Jung-inspired wisdom

- [ ] **Walking Mode**
  ```javascript
  localStorage.setItem('conversation_mode', 'walking')
  ```
  - Brief, natural responses
  - Conversational tone

- [ ] **Adaptive Mode**
  ```javascript
  localStorage.setItem('conversation_mode', 'adaptive')
  ```
  - Adjusts based on context

#### Model Selection
- [ ] **GPT-4o** (Default)
  ```javascript
  localStorage.setItem('ai_model', 'gpt-4o')
  ```

- [ ] **Claude**
  ```javascript
  localStorage.setItem('ai_model', 'claude')
  ```

- [ ] **Claude Code Brain** (Deep awareness)
  ```javascript
  localStorage.setItem('use_claude_code_brain', 'true')
  ```

### G. Mobile Testing
- [ ] **Mobile Browser**
  - Test on iOS Safari
  - Test on Chrome Android
  - Verify touch interactions with holoflower
  - Check responsive layout

- [ ] **Mobile-Specific Issues**
  - Audio playback policies
  - Background tab behavior
  - Screen lock impact

## 🔍 Debug Tools & Monitoring

### Browser Console Commands
```javascript
// Check current conversation mode
localStorage.getItem('conversation_mode')

// Check AI model
localStorage.getItem('ai_model')

// Check voice state
localStorage.getItem('maia_voice_enabled')

// Enable debug logging
localStorage.setItem('debug_voice', 'true')

// Clear all settings
localStorage.clear()
```

### API Health Checks
- **TTS Health**: http://localhost:3000/api/tts/health
- **Voice Health**: http://localhost:3000/api/voice
- **ElevenLabs Status**: http://localhost:3000/api/test-elevenlabs

## 📊 Performance Testing

### Metrics to Monitor
1. **Response Time**
   - Time from end of speech to start of response
   - Target: < 2 seconds

2. **Recognition Accuracy**
   - Percentage of correctly transcribed words
   - Target: > 90%

3. **Audio Quality**
   - No crackling or distortion
   - Consistent volume levels

4. **Memory Usage**
   - Check Chrome DevTools → Performance
   - Monitor for memory leaks during long sessions

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| No audio output | Check browser autoplay policies, ensure user interaction |
| Microphone not working | Check permissions in browser settings |
| Voice cuts off | Increase timeout settings, check network stability |
| Recognition stops | Check for JavaScript errors in console |
| Delayed responses | Monitor API response times, check server load |

## 🚀 Load Testing Script

Create a file `voice-load-test.js`:

```javascript
// Simulate multiple voice interactions
async function loadTest() {
  const testPhrases = [
    "Hello MAIA",
    "Tell me about fire element",
    "What is my purpose?",
    "Show me silence",
    "Thank you"
  ];

  for (const phrase of testPhrases) {
    console.log(`Testing: "${phrase}"`);

    const response = await fetch('http://localhost:3000/api/oracle/consult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test_user',
        userInput: phrase
      })
    });

    const data = await response.json();
    console.log('Response:', data.maiaResponse?.substring(0, 100) + '...');

    // Wait 2 seconds between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

loadTest();
```

## 📝 Testing Report Template

```markdown
## Voice Testing Report - [DATE]

### Environment
- Browser: [Chrome/Safari/Firefox] [Version]
- OS: [macOS/Windows/Linux/iOS/Android]
- Device: [Desktop/Mobile/Tablet]
- Network: [WiFi/Cellular/Ethernet]

### Test Results
- [ ] Microphone Permission: PASS/FAIL
- [ ] Voice Recognition: PASS/FAIL
- [ ] TTS Response: PASS/FAIL
- [ ] Easter Eggs: PASS/FAIL
- [ ] Continuous Conversation: PASS/FAIL
- [ ] Error Recovery: PASS/FAIL

### Issues Found
1. [Description of issue]
   - Steps to reproduce
   - Expected behavior
   - Actual behavior

### Performance Metrics
- Average response time: [X]ms
- Recognition accuracy: [X]%
- Audio quality: [Good/Fair/Poor]

### Notes
[Any additional observations]
```

## 🎯 Quick Test Sequence (5 minutes)

1. Open http://localhost:3000/maia
2. Click holoflower to activate voice
3. Say "Hello MAIA"
4. Wait for response
5. Say "you got soul"
6. Verify easter egg response
7. Say "show me silence"
8. Verify 3-second pause
9. Test interruption by speaking while MAIA talks
10. Let conversation timeout and verify auto-restart

---

## Need Help?

- Check browser console for errors
- Review network tab for failed API calls
- Ensure all environment variables are set
- Verify API keys are valid (OpenAI, ElevenLabs, Anthropic)

Happy Testing! 🎤✨