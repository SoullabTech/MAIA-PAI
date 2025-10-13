/**
 * Simple Witness Mode Hook
 * Minimal implementation that just tracks whether MAIA should respond
 * Completely separate from voice processing to avoid timing issues
 */

import { useState, useCallback, useRef } from 'react';

export function useSimpleWitnessMode() {
  // Simple boolean flag - nothing complex
  const [isWitnessMode, setIsWitnessMode] = useState(false);

  // Store messages while in witness mode (no complex state)
  const witnessBuffer = useRef<string[]>([]);

  // Toggle function - simple and direct
  const toggleWitnessMode = useCallback(() => {
    setIsWitnessMode(prev => {
      const newMode = !prev;

      // If ending witness mode, clear buffer
      if (prev === true && newMode === false) {
        const messages = witnessBuffer.current;
        witnessBuffer.current = [];

        // Return the buffered messages for processing
        return {
          mode: false,
          messages
        };
      }

      return newMode;
    });
  }, []);

  // Add message to buffer (only if in witness mode)
  const addToBuffer = useCallback((message: string) => {
    if (isWitnessMode) {
      witnessBuffer.current.push(message);
    }
  }, [isWitnessMode]);

  // Get buffer without ending session
  const getBuffer = useCallback(() => {
    return [...witnessBuffer.current];
  }, []);

  // End session and get all messages
  const endWitnessSession = useCallback(() => {
    const messages = [...witnessBuffer.current];
    witnessBuffer.current = [];
    setIsWitnessMode(false);
    return messages;
  }, []);

  return {
    isWitnessMode,
    toggleWitnessMode,
    addToBuffer,
    getBuffer,
    endWitnessSession
  };
}

/**
 * INTEGRATION NOTES:
 *
 * In OracleConversation or voice handler:
 *
 * const { isWitnessMode, addToBuffer } = useSimpleWitnessMode();
 *
 * // When receiving voice/text input:
 * if (isWitnessMode) {
 *   addToBuffer(transcript);
 *   // DON'T send to MAIA for response
 * } else {
 *   // Normal flow - send to MAIA
 *   sendToMaia(transcript);
 * }
 *
 * That's it! No complex timing, no React effect chains, no interference.
 */