'use client';

import { useState, useCallback, useRef } from 'react';

export interface NoteIntent {
  hasIntent: boolean;
  type: 'save_previous' | 'save_next' | 'none';
  confidence: number;
}

export interface NotesIntegrationOptions {
  onNoteSaved?: (note: any) => void;
  onNoteIntent?: (intent: NoteIntent, transcript: string) => void;
}

export function useNotesIntegration(options: NotesIntegrationOptions = {}) {
  const [isWaitingForNote, setIsWaitingForNote] = useState(false);
  const [pendingNoteType, setPendingNoteType] = useState<'save_previous' | 'save_next' | null>(null);
  const lastMessageRef = useRef<{ text: string; speaker: 'user' | 'maia' } | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  // Detect note-taking intent from transcript
  const detectNoteIntent = useCallback((transcript: string): NoteIntent => {
    const lowerTranscript = transcript.toLowerCase();

    const savePreviousPhrases = [
      'note that',
      'save that',
      'make a note of that',
      'keep that',
      'remember that',
      'note what we just',
      'save what we just',
      'can you note that',
      'please note that',
      'mark that down',
      'bookmark that'
    ];

    const saveNextPhrases = [
      'note what i\'m about to',
      'save what i\'m going to',
      'make a note, ',
      'here\'s a note',
      'note this:',
      'save this:',
      'i want to note',
      'let me note'
    ];

    for (const phrase of savePreviousPhrases) {
      if (lowerTranscript.includes(phrase)) {
        return {
          hasIntent: true,
          type: 'save_previous',
          confidence: 0.9
        };
      }
    }

    for (const phrase of saveNextPhrases) {
      if (lowerTranscript.includes(phrase)) {
        return {
          hasIntent: true,
          type: 'save_next',
          confidence: 0.9
        };
      }
    }

    return {
      hasIntent: false,
      type: 'none',
      confidence: 0
    };
  }, []);

  // Process transcript for note intent
  const processTranscriptForNotes = useCallback(async (
    transcript: string,
    speaker: 'user' | 'maia' = 'user'
  ): Promise<{ hasNoteIntent: boolean; response?: string }> => {
    const intent = detectNoteIntent(transcript);

    if (options.onNoteIntent) {
      options.onNoteIntent(intent, transcript);
    }

    if (intent.hasIntent) {
      if (intent.type === 'save_previous') {
        // Save the previous message
        if (lastMessageRef.current) {
          await saveNote(lastMessageRef.current.text, lastMessageRef.current.speaker);
          return {
            hasNoteIntent: true,
            response: "I've saved that to your notebook. What would you like to explore next?"
          };
        } else {
          return {
            hasNoteIntent: true,
            response: "I don't have a previous message to save. Could you tell me what you'd like to note?"
          };
        }
      } else if (intent.type === 'save_next') {
        // Wait for the next message to save
        setIsWaitingForNote(true);
        setPendingNoteType('save_next');

        // Extract the actual note content if it's in the same message
        const noteMatch = transcript.match(/(?:note this:|save this:|here's a note:)\s*(.+)/i);
        if (noteMatch && noteMatch[1]) {
          await saveNote(noteMatch[1].trim(), speaker);
          setIsWaitingForNote(false);
          setPendingNoteType(null);
          return {
            hasNoteIntent: true,
            response: "I've saved your note. Let's continue our conversation."
          };
        }

        return {
          hasNoteIntent: true,
          response: "I'm ready to save your note. Go ahead and tell me what you'd like to remember."
        };
      }
    }

    // If we're waiting for a note, save this transcript
    if (isWaitingForNote && pendingNoteType === 'save_next') {
      await saveNote(transcript, speaker);
      setIsWaitingForNote(false);
      setPendingNoteType(null);
      return {
        hasNoteIntent: true,
        response: "Perfect! I've saved that note for you. What would you like to explore next?"
      };
    }

    // Store this message as the last message for potential future noting
    lastMessageRef.current = { text: transcript, speaker };

    return { hasNoteIntent: false };
  }, [isWaitingForNote, pendingNoteType, options]);

  // Save a note to the backend
  const saveNote = useCallback(async (
    text: string,
    speaker: 'user' | 'maia',
    metadata?: any
  ) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          source: 'voice',
          speaker,
          conversation_id: conversationIdRef.current,
          metadata
        }),
      });

      if (response.ok) {
        const { data } = await response.json();
        if (options.onNoteSaved) {
          options.onNoteSaved(data);
        }
        return data;
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    }
    return null;
  }, [options]);

  // Set the current conversation ID
  const setConversationId = useCallback((id: string) => {
    conversationIdRef.current = id;
  }, []);

  // Update the last message (for Maia's responses)
  const updateLastMessage = useCallback((text: string, speaker: 'user' | 'maia') => {
    lastMessageRef.current = { text, speaker };
  }, []);

  return {
    detectNoteIntent,
    processTranscriptForNotes,
    saveNote,
    setConversationId,
    updateLastMessage,
    isWaitingForNote,
    pendingNoteType
  };
}