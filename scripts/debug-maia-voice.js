// MAIA Voice Debug & Fix Script
// Run this in your browser console to diagnose WebRTC issues
// Usage: Copy this entire file, paste into DevTools Console (F12), press Enter

(async function debugMaiaVoice() {
  console.log('🔍 MAIA Voice Diagnostic Starting...\n');

  const results = {
    environment: {},
    webrtc: {},
    api: {},
    audio: {},
    recommendations: []
  };

  // ============================================
  // 1. Environment Check
  // ============================================
  console.log('1️⃣ Checking Environment...');

  results.environment = {
    url: window.location.href,
    protocol: window.location.protocol,
    isSecure: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
    userAgent: navigator.userAgent,
    browser: getBrowserInfo()
  };

  console.log('   URL:', results.environment.url);
  console.log('   Protocol:', results.environment.protocol);
  console.log('   Secure Context:', results.environment.isSecure ? '✅' : '❌');
  console.log('   Browser:', results.environment.browser);

  if (!results.environment.isSecure) {
    results.recommendations.push({
      severity: 'CRITICAL',
      issue: 'Not running on HTTPS or localhost',
      fix: 'WebRTC requires secure context. Use https:// or localhost:3000',
      code: 'Change URL to https://your-domain.com or http://localhost:3000'
    });
  }

  // ============================================
  // 2. WebRTC Capabilities
  // ============================================
  console.log('\n2️⃣ Checking WebRTC Support...');

  results.webrtc = {
    supported: !!window.RTCPeerConnection,
    dataChannelSupported: !!window.RTCDataChannel,
    mediaDevicesSupported: !!navigator.mediaDevices,
    getUserMediaSupported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  };

  console.log('   RTCPeerConnection:', results.webrtc.supported ? '✅' : '❌');
  console.log('   RTCDataChannel:', results.webrtc.dataChannelSupported ? '✅' : '❌');
  console.log('   MediaDevices API:', results.webrtc.mediaDevicesSupported ? '✅' : '❌');
  console.log('   getUserMedia:', results.webrtc.getUserMediaSupported ? '✅' : '❌');

  if (!results.webrtc.supported) {
    results.recommendations.push({
      severity: 'CRITICAL',
      issue: 'Browser does not support WebRTC',
      fix: 'Update to latest Chrome, Firefox, Safari, or Edge',
      code: null
    });
    console.error('❌ WebRTC not supported - cannot proceed');
    return results;
  }

  // ============================================
  // 3. Microphone Access
  // ============================================
  console.log('\n3️⃣ Testing Microphone Access...');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    results.audio.microphoneAccess = true;
    results.audio.tracks = stream.getAudioTracks().map(track => ({
      label: track.label,
      enabled: track.enabled,
      muted: track.muted,
      readyState: track.readyState,
      settings: track.getSettings()
    }));

    console.log('   Microphone Access:', '✅');
    console.log('   Device:', results.audio.tracks[0]?.label || 'Unknown');
    console.log('   Sample Rate:', results.audio.tracks[0]?.settings?.sampleRate || 'Unknown');
    console.log('   Channel Count:', results.audio.tracks[0]?.settings?.channelCount || 'Unknown');

    // Clean up
    stream.getTracks().forEach(track => track.stop());

  } catch (error) {
    results.audio.microphoneAccess = false;
    results.audio.error = error.message;

    console.error('   Microphone Access:', '❌');
    console.error('   Error:', error.message);

    results.recommendations.push({
      severity: 'CRITICAL',
      issue: `Microphone access denied: ${error.message}`,
      fix: 'Grant microphone permissions',
      code: `
// On macOS: System Preferences → Security & Privacy → Microphone
// In Browser: Click 🔒 icon in address bar → Site Settings → Microphone → Allow
      `.trim()
    });
  }

  // ============================================
  // 4. OpenAI API Connection Test
  // ============================================
  console.log('\n4️⃣ Testing OpenAI API Connection...');

  try {
    const response = await fetch('/api/voice/webrtc-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sdp: 'test',
        mode: 'dialogue'
      })
    });

    results.api.endpointReachable = true;
    results.api.statusCode = response.status;

    if (response.ok) {
      console.log('   API Endpoint:', '✅');
      console.log('   Status:', response.status);
      results.api.working = true;
    } else {
      const errorText = await response.text();
      console.error('   API Endpoint:', '❌');
      console.error('   Status:', response.status);
      console.error('   Error:', errorText);

      results.api.working = false;
      results.api.error = errorText;

      if (response.status === 401 || response.status === 403) {
        results.recommendations.push({
          severity: 'CRITICAL',
          issue: 'OpenAI API Key invalid or missing',
          fix: 'Check OPENAI_API_KEY in .env.local',
          code: `
# In .env.local file:
OPENAI_API_KEY=sk-proj-...

# Verify key has Realtime API access:
# https://platform.openai.com/api-keys
          `.trim()
        });
      } else if (response.status === 429) {
        results.recommendations.push({
          severity: 'HIGH',
          issue: 'OpenAI rate limit exceeded',
          fix: 'Wait a few minutes or upgrade plan',
          code: 'Check usage: https://platform.openai.com/usage'
        });
      } else {
        results.recommendations.push({
          severity: 'HIGH',
          issue: `API returned status ${response.status}`,
          fix: 'Check server logs and OpenAI dashboard',
          code: errorText
        });
      }
    }

  } catch (error) {
    results.api.endpointReachable = false;
    results.api.error = error.message;

    console.error('   API Endpoint:', '❌');
    console.error('   Error:', error.message);

    results.recommendations.push({
      severity: 'CRITICAL',
      issue: `Cannot reach API endpoint: ${error.message}`,
      fix: 'Check if Next.js dev server is running',
      code: 'npm run dev'
    });
  }

  // ============================================
  // 5. WebSocket Connection Test
  // ============================================
  console.log('\n5️⃣ Testing WebSocket Connection...');

  // Check if WebSocket is available
  if (typeof WebSocket !== 'undefined') {
    console.log('   WebSocket API:', '✅');
    results.webrtc.webSocketSupported = true;
  } else {
    console.error('   WebSocket API:', '❌');
    results.webrtc.webSocketSupported = false;
    results.recommendations.push({
      severity: 'CRITICAL',
      issue: 'WebSocket not supported',
      fix: 'Update browser to latest version',
      code: null
    });
  }

  // ============================================
  // 6. Local Storage Check
  // ============================================
  console.log('\n6️⃣ Checking Local Storage...');

  try {
    const conversations = localStorage.getItem('maya_conversation');
    const sessions = localStorage.getItem('oracle_conversations');

    console.log('   Maya Conversations:', conversations ? '✅ Found' : '⚠️ None');
    console.log('   Oracle Sessions:', sessions ? '✅ Found' : '⚠️ None');

    results.storage = {
      mayaConversations: !!conversations,
      oracleSessions: !!sessions
    };
  } catch (error) {
    console.error('   Local Storage:', '❌', error.message);
    results.storage = { error: error.message };
  }

  // ============================================
  // 7. Check Current Connection State
  // ============================================
  console.log('\n7️⃣ Checking Current MAIA State...');

  // Try to find MAIA's WebRTC connection in window
  const maiaClient = window.__MAIA_REALTIME_CLIENT__ || null;

  if (maiaClient) {
    console.log('   MAIA Client Found:', '✅');
    console.log('   Connection State:', maiaClient.connectionState || 'Unknown');
    results.maiaClient = {
      found: true,
      state: maiaClient.connectionState
    };
  } else {
    console.log('   MAIA Client Found:', '⚠️ Not found');
    results.maiaClient = {
      found: false
    };
  }

  // ============================================
  // Summary & Recommendations
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('📊 DIAGNOSTIC SUMMARY');
  console.log('='.repeat(60) + '\n');

  if (results.recommendations.length === 0) {
    console.log('✅ All checks passed! No issues found.');
    console.log('\nIf Maia still not working, try:');
    console.log('1. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)');
    console.log('2. Clear browser cache');
    console.log('3. Restart browser');
    console.log('4. Check console for other errors');
  } else {
    console.log('❌ Issues found:\n');

    results.recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. [${rec.severity}] ${rec.issue}`);
      console.log(`   Fix: ${rec.fix}`);
      if (rec.code) {
        console.log(`   Code:\n${rec.code}\n`);
      }
      console.log('');
    });
  }

  console.log('='.repeat(60));
  console.log('Full diagnostic results stored in: window.__MAIA_DEBUG__');
  console.log('='.repeat(60));

  // Store results globally
  window.__MAIA_DEBUG__ = results;

  return results;

  // ============================================
  // Helper Functions
  // ============================================

  function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';

    if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
      browser = 'Chrome';
    } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
      browser = 'Safari';
    } else if (ua.indexOf('Firefox') > -1) {
      browser = 'Firefox';
    } else if (ua.indexOf('Edg') > -1) {
      browser = 'Edge';
    }

    return browser;
  }
})();

console.log('\n💡 Tip: Results saved to window.__MAIA_DEBUG__ for inspection');
console.log('Run again anytime by refreshing and pasting this script.\n');
