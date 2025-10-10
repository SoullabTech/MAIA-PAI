# How to Test MAIA and Share Logs

## The Problem
We can't see server-side logs in the browser console. We need to see what happens when the API route processes your message.

## Option 1: Filter Console Logs

1. Open DevTools Console
2. In the **filter box** (top of console), type: `🌀 Processing`
3. This will show only logs related to MAIAUnifiedConsciousness
4. Click "Listen" and speak to MAIA
5. After she responds, copy ONLY the filtered logs

**The logs we're looking for:**
```
🌀 Processing through MAIAUnifiedConsciousness...
📊 Input data: ...
🚀 Calling maiaConsciousness.process()...
```

OR

```
❌ MAIA Consciousness not initialized
❌ PersonalOracleAgent CRITICAL ERROR: ...
```

## Option 2: Check Network Tab

1. Open DevTools → **Network** tab
2. Click "Listen" and speak to MAIA
3. Find the request to `/api/oracle/personal`
4. Click on it
5. Go to **"Response"** tab
6. Copy the response JSON
7. Share just that response

## Option 3: Use Test Script

Run this in the console AFTER clicking "Listen":

```javascript
// Intercept fetch to log API responses
const originalFetch = window.fetch;
window.fetch = function(...args) {
  return originalFetch.apply(this, args).then(response => {
    if (args[0].includes('/api/oracle/personal')) {
      response.clone().json().then(data => {
        console.log('🎯 API RESPONSE:', JSON.stringify(data, null, 2));
      });
    }
    return response;
  });
};
console.log('✅ Fetch interceptor installed. Now speak to MAIA and watch for 🎯 API RESPONSE');
```

Then speak to MAIA and share the `🎯 API RESPONSE` log.

## What We're Trying to Find

The server is returning fallback responses, but we don't know WHY. The logs I added will tell us:

1. Did MAIAUnifiedConsciousness initialize?
2. Did it reach the `.process()` call?
3. What error occurred?

Without these logs, we're flying blind!
