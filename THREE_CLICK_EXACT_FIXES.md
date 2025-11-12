# Exact Code Changes for Three-Click Bug Fix

## File: `/Users/soullab/MAIA-PAI/apps/web/components/voice/ContinuousConversation.tsx`

---

## Change 1: Add Debounce Ref (After line 66)

```typescript
// EXISTING CODE
const isCallingProcessRef = useRef(false); // CRITICAL: Prevent concurrent processAccumulatedTranscript calls
const isRestartingRef = useRef(false);
const networkErrorCount = useRef<number>(0);
const lastNetworkErrorTime = useRef<number>(0);

// ADD THIS NEW REF:
const startListeningInProgressRef = useRef(false); // Prevent concurrent startListening calls
```

---

## Change 2: Move isRestartingRef Flag Earlier (Line 270-306)

### BEFORE:
```typescript
recognition.onend = () => {
  console.log('🏁 [onend] Recognition stopped');
  setIsRecording(false);
  isRecordingRef.current = false;
  onRecordingStateChange?.(false);

  // Clear timeout
  if (recognitionTimeoutRef.current) {
    clearTimeout(recognitionTimeoutRef.current);
    recognitionTimeoutRef.current = null;
  }

  // CRITICAL: Prevent infinite restart loop
  // Check if already restarting to prevent multiple simultaneous attempts
  if (isRestartingRef.current) {
    console.log('⚠️ [onend] Already restarting, skipping');
    return;
  }

  // Only restart if we're actively listening and not processing/speaking
  // CRITICAL: Use refs instead of closure state to avoid stale values
  if (isListeningRef.current && !isProcessingRef.current && !isSpeakingRef.current) {
    // ... (backoff calculation code)
    
    console.log(`🔄 [onend] Will restart recognition after ${backoffDelay}ms delay (errors: ${networkErrorCount.current})...`);
    isRestartingRef.current = true;

    setTimeout(() => {
      // Double-check conditions before restart to prevent race conditions
      // ... (restart attempt code)
      // Clear the restarting flag
      isRestartingRef.current = false;
    }, backoffDelay);
```

### AFTER:
```typescript
recognition.onend = () => {
  console.log('🏁 [onend] Recognition stopped');
  setIsRecording(false);
  isRecordingRef.current = false;
  onRecordingStateChange?.(false);

  // Clear timeout
  if (recognitionTimeoutRef.current) {
    clearTimeout(recognitionTimeoutRef.current);
    recognitionTimeoutRef.current = null;
  }

  // CRITICAL FIX: Set flag IMMEDIATELY to prevent concurrent restarts
  if (isRestartingRef.current) {
    console.log('⚠️ [onend] Already restarting, skipping');
    return;
  }
  
  // Set flag immediately, BEFORE any async operations
  isRestartingRef.current = true;

  // Only restart if we're actively listening and not processing/speaking
  // CRITICAL: Use refs instead of closure state to avoid stale values
  if (isListeningRef.current && !isProcessingRef.current && !isSpeakingRef.current) {
    // Calculate backoff delay based on network error count
    const timeSinceLastError = Date.now() - lastNetworkErrorTime.current;

    // Reset error count if it's been more than 30 seconds since last error
    if (timeSinceLastError > 30000) {
      networkErrorCount.current = 0;
    }

    // Exponential backoff: 300ms, 600ms, 1200ms, 2400ms, 4800ms
    const backoffDelay = networkErrorCount.current > 0
      ? Math.min(300 * Math.pow(2, networkErrorCount.current - 1), 5000)
      : 300;

    console.log(`🔄 [onend] Will restart recognition after ${backoffDelay}ms delay (errors: ${networkErrorCount.current})...`);

    setTimeout(() => {
      try {
        // Double-check conditions before restart to prevent race conditions
        if (recognitionRef.current && isListeningRef.current && !isRecordingRef.current && !isProcessingRef.current && !isSpeakingRef.current) {
          try {
            recognitionRef.current.start();
            console.log('✅ [onend] Recognition restarted');
          } catch (err: any) {
            // If start fails, it's likely already running or in a bad state
            console.log('⚠️ [onend] Could not restart recognition:', err.message);
            // Don't retry to avoid infinite loop
          }
        } else {
          console.log('🚫 [onend] Conditions changed, not restarting. State:', {
            hasRecognition: !!recognitionRef.current,
            isListening: isListeningRef.current,
            isRecording: isRecordingRef.current,
            isProcessing: isProcessingRef.current,
            isSpeaking: isSpeakingRef.current
          });
        }
      } finally {
        // Clear flag AFTER attempting restart
        isRestartingRef.current = false;
      }
    }, backoffDelay);
  } else {
    // Clear flag immediately if conditions aren't met
    isRestartingRef.current = false;
    console.log('🚫 [onend] Not restarting - conditions not met. State:', {
      isListening: isListeningRef.current,
      isProcessing: isProcessingRef.current,
      isSpeaking: isSpeakingRef.current
    });
  }
};
```

---

## Change 3: Wrap startListening with Debounce (Line 577-628)

### BEFORE:
```typescript
const startListening = useCallback(async () => {
  console.log('🎤 [ContinuousConversation] startListening called');

  try {
    // Initialize audio monitoring
    const audioReady = await initializeAudioMonitoring();
    if (!audioReady) {
      console.error('❌ [ContinuousConversation] Audio monitoring failed');
      throw new Error('MICROPHONE_UNAVAILABLE');
    }

    console.log('✅ [ContinuousConversation] Audio monitoring ready');

  // Initialize speech recognition
  if (!recognitionRef.current) {
    recognitionRef.current = initializeSpeechRecognition();
    console.log('🔧 [ContinuousConversation] Speech recognition initialized');
  }

  if (recognitionRef.current) {
    setIsListening(true);
    isListeningRef.current = true;
    isProcessingRef.current = false;

    try {
      recognitionRef.current.start();
      console.log('🎙️ [ContinuousConversation] Recognition started');
    } catch (err: any) {
      if (err?.message?.includes('already started')) {
        console.log('⏸️ [ContinuousConversation] Recognition already active');
      } else {
        console.error('❌ [ContinuousConversation] Error starting recognition:', err);
      }
    }
  }
  } catch (error: any) {
    console.error('❌ [ContinuousConversation] Failed to start listening:', error);
    setIsListening(false);
    isListeningRef.current = false;
    throw error;
  }
}, [initializeSpeechRecognition, initializeAudioMonitoring]);
```

### AFTER:
```typescript
const startListening = useCallback(async () => {
  // CRITICAL FIX: Debounce concurrent calls
  if (startListeningInProgressRef.current) {
    console.log('🚫 [Debounce] startListening already in progress, ignoring duplicate click');
    return;
  }

  startListeningInProgressRef.current = true;

  try {
    console.log('🎤 [ContinuousConversation] startListening called');

    // Initialize audio monitoring
    const audioReady = await initializeAudioMonitoring();
    if (!audioReady) {
      console.error('❌ [ContinuousConversation] Audio monitoring failed');
      throw new Error('MICROPHONE_UNAVAILABLE');
    }

    console.log('✅ [ContinuousConversation] Audio monitoring ready');

    // Initialize speech recognition
    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition();
      console.log('🔧 [ContinuousConversation] Speech recognition initialized');
    }

    if (recognitionRef.current) {
      setIsListening(true);
      isListeningRef.current = true;
      isProcessingRef.current = false;

      try {
        recognitionRef.current.start();
        console.log('✅ [ContinuousConversation] Recognition started successfully');
      } catch (err: any) {
        if (err?.message?.includes('already started')) {
          console.log('✅ [ContinuousConversation] Recognition already active, continuing');
          // Expected behavior - recognition is already running
        } else {
          console.error('❌ [ContinuousConversation] Unexpected error starting recognition:', err);
          setIsListening(false);
          isListeningRef.current = false;
          throw err;
        }
      }
    }
  } catch (error: any) {
    console.error('❌ [ContinuousConversation] Failed to start listening:', error);
    setIsListening(false);
    isListeningRef.current = false;
    throw error;
  } finally {
    // Always clear debounce flag
    startListeningInProgressRef.current = false;
  }
}, [initializeSpeechRecognition, initializeAudioMonitoring]);
```

---

## Summary of Changes

1. **Added `startListeningInProgressRef`** - Prevents concurrent startListening calls
2. **Moved `isRestartingRef = true`** - Now set immediately in onend, not in setTimeout
3. **Wrapped startListening in try/finally** - Ensures debounce flag is always cleared
4. **Changed error logging** - "already started" is now treated as success, not silent failure

---

## Testing After Changes

```javascript
// In browser console:

// Single click should show:
✅ [ContinuousConversation] Audio monitoring ready
🔧 [ContinuousConversation] Speech recognition initialized
✅ [ContinuousConversation] Recognition started successfully

// Rapid clicks (click 3 times fast) should show:
🚫 [Debounce] startListening already in progress, ignoring duplicate click
🚫 [Debounce] startListening already in progress, ignoring duplicate click

// This proves debounce is working!
```

