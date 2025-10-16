'use client';

import { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageNoteButtonProps {
  messageText: string;
  speaker: 'user' | 'maia';
  messageId?: string;
  conversationId?: string;
  onSave?: (text: string) => void;
}

export function MessageNoteButton({
  messageText,
  speaker,
  messageId,
  conversationId,
  onSave
}: MessageNoteButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: messageText,
          source: 'tap',
          speaker,
          message_id: messageId,
          conversation_id: conversationId,
        }),
      });

      if (response.ok) {
        setIsSaved(true);
        onSave?.(messageText);

        // Reset after 3 seconds
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  return (
    <button
      onClick={handleSave}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "p-1.5 rounded-md transition-all duration-200",
        "hover:bg-white/10 active:scale-95",
        isSaved && "text-green-400",
        !isSaved && isHovered && "text-amber-400",
        !isSaved && !isHovered && "text-white/30"
      )}
      aria-label="Save to notebook"
    >
      {isSaved ? (
        <Check className="w-4 h-4" />
      ) : (
        <Sparkles className="w-4 h-4" />
      )}
    </button>
  );
}