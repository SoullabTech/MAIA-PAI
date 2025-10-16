// Enhanced Oracle Conversation with Notes Integration
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen } from 'lucide-react';
import { ContinuousConversation, ContinuousConversationRef } from '../apps/web/components/voice/ContinuousConversation';
import { useNotesIntegration } from '@/hooks/useNotesIntegration';
import { MessageNoteButton } from './notes/MessageNoteButton';
import { NotebookPanel } from './notes/NotebookPanel';
import { toast } from 'react-hot-toast';

// Import the original OracleConversation component to extend it
import { OracleConversation as BaseOracleConversation } from './OracleConversation';

interface OracleConversationWithNotesProps {
  userId?: string;
  userName?: string;
  sessionId: string;
  initialCheckIns?: Record<string, number>;
  showAnalytics?: boolean;
  voiceEnabled?: boolean;
  onMessageAdded?: (message: any) => void;
  onSessionEnd?: (reason?: string) => void;
}

export const OracleConversationWithNotes: React.FC<OracleConversationWithNotesProps> = (props) => {
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const conversationRef = useRef<ContinuousConversationRef>(null);

  const {
    detectNoteIntent,
    processTranscriptForNotes,
    updateLastMessage,
    setConversationId,
    isWaitingForNote
  } = useNotesIntegration({
    onNoteSaved: (note) => {
      toast.success('✨ Saved to your notebook', {
        duration: 2000,
        position: 'bottom-center',
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        },
      });
    },
    onNoteIntent: (intent, transcript) => {
      if (intent.hasIntent) {
        console.log('📝 Note intent detected:', intent.type, transcript);
      }
    }
  });

  // Set conversation ID when session starts
  useEffect(() => {
    setConversationId(props.sessionId);
  }, [props.sessionId, setConversationId]);

  // Enhanced message handler that includes note detection
  const handleMessageAdded = useCallback((message: any) => {
    setMessages(prev => [...prev, message]);

    // Update last message for notes context
    updateLastMessage(message.text, message.role === 'oracle' ? 'maia' : 'user');

    // Check for note intent in user messages
    if (message.role === 'user') {
      processTranscriptForNotes(message.text, 'user').then(result => {
        if (result.hasNoteIntent && result.response) {
          // Add Maia's confirmation as a system message
          const confirmationMessage = {
            id: `note-confirm-${Date.now()}`,
            role: 'oracle',
            text: result.response,
            timestamp: new Date(),
            source: 'system'
          };
          setMessages(prev => [...prev, confirmationMessage]);
        }
      });
    }

    // Call the original handler if provided
    props.onMessageAdded?.(message);
  }, [processTranscriptForNotes, updateLastMessage, props]);

  return (
    <div className="relative h-full w-full">
      {/* Base Oracle Conversation */}
      <BaseOracleConversation
        {...props}
        onMessageAdded={handleMessageAdded}
      />

      {/* Floating Notebook Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsNotebookOpen(true)}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-lg flex items-center justify-center z-30"
        aria-label="Open notebook"
      >
        <BookOpen className="w-6 h-6 text-white" />
      </motion.button>

      {/* Notebook Panel */}
      <NotebookPanel
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
      />

      {/* Note Intent Indicator */}
      {isWaitingForNote && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-40 left-1/2 -translate-x-1/2 bg-amber-500/20 backdrop-blur-md px-4 py-2 rounded-full border border-amber-400/30 z-20"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-sm text-amber-300">Ready to save your note...</span>
          </div>
        </motion.div>
      )}

      {/* Enhanced Messages Display with Note Buttons */}
      <style jsx global>{`
        /* Add note button to each message */
        .oracle-message-wrapper {
          position: relative;
        }

        .oracle-message-wrapper:hover .note-button {
          opacity: 1;
        }

        .note-button {
          position: absolute;
          right: -2rem;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0;
          transition: opacity 0.2s;
        }
      `}</style>
    </div>
  );
};