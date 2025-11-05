/**
 * Voice Quality Feedback Component
 * Allows users to rate MAIA's voice for continuous improvement
 */

'use client';

import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Volume2 } from 'lucide-react';

interface VoiceFeedbackProps {
  messageId: string;
  text: string;
  onFeedback?: (rating: number, notes?: string) => void;
}

export function VoiceQualityFeedback({
  messageId,
  text,
  onFeedback
}: VoiceFeedbackProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleRating = async (value: number) => {
    setRating(value);
    setShowDetails(true);
  };

  const handleSubmit = async () => {
    if (rating === null) return;

    try {
      // Send feedback to training system
      const response = await fetch('/api/voice/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          text,
          rating,
          notes,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSubmitted(true);
        onFeedback?.(rating, notes);

        // Trigger sample collection for analysis
        if (rating >= 4) {
          // Good quality - use for training
          await fetch('/api/voice/train-sample', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text,
              context: {
                quality_rating: rating,
                user_notes: notes
              }
            })
          });
        }
      }
    } catch (error) {
      console.error('Error submitting voice feedback:', error);
    }
  };

  if (submitted) {
    return (
      <div className="text-xs text-green-400/80 flex items-center gap-1.5 px-2 py-1">
        <ThumbsUp size={12} />
        <span>Thanks for the feedback!</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Quick Rating */}
      <div className="flex items-center gap-2">
        <Volume2 size={12} className="text-amber-300/60" />
        <span className="text-xs text-amber-300/70">Rate voice quality:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleRating(value)}
              className={`transition-all ${
                rating !== null && value <= rating
                  ? 'text-amber-400'
                  : 'text-amber-300/30 hover:text-amber-300/60'
              }`}
            >
              <Star
                size={14}
                fill={rating !== null && value <= rating ? 'currentColor' : 'none'}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Feedback */}
      {showDetails && !submitted && (
        <div className="pl-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-wrap gap-2">
            {/* Quick feedback tags */}
            {[
              'Clear & Natural',
              'Good Emotion',
              'Nice Rhythm',
              'Too Robotic',
              'Unclear',
              'Wrong Tone'
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setNotes(prev =>
                    prev.includes(tag)
                      ? prev.replace(tag, '').trim()
                      : (prev + ' ' + tag).trim()
                  );
                }}
                className={`text-xs px-2 py-1 rounded-full transition-all ${
                  notes.includes(tag)
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'bg-amber-400/5 text-amber-300/60 border border-amber-300/20 hover:border-amber-300/40'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes (optional)..."
            className="w-full px-3 py-2 text-xs bg-black/30 border border-amber-300/20 rounded-lg
                     text-amber-100 placeholder-amber-300/40
                     focus:outline-none focus:border-amber-300/40 resize-none"
            rows={2}
          />

          <button
            onClick={handleSubmit}
            className="px-3 py-1.5 text-xs bg-amber-400/20 hover:bg-amber-400/30
                     text-amber-300 rounded-lg transition-all border border-amber-400/40"
          >
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Training Status Indicator
 * Shows background training progress
 */
export function VoiceTrainingStatus() {
  const [status, setStatus] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/voice/train-sample');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching training status:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => {
          fetchStatus();
          setShowDetails(!showDetails);
        }}
        className="p-2 bg-black/50 backdrop-blur-sm border border-amber-300/20 rounded-full
                 hover:border-amber-300/40 transition-all group"
        title="Voice Training Status"
      >
        <Volume2
          size={16}
          className="text-amber-300/60 group-hover:text-amber-300/80"
        />
      </button>

      {showDetails && status && (
        <div className="absolute bottom-full right-0 mb-2 p-3 min-w-[250px]
                      bg-black/90 backdrop-blur-sm border border-amber-300/20 rounded-lg
                      text-xs text-amber-100 space-y-1.5">
          <div className="font-medium text-amber-300 mb-2">
            Voice Training
          </div>
          <div className="space-y-1 text-amber-100/80">
            <div>Samples: {status.total_samples_collected || 0}</div>
            <div>Analyses: {status.total_analyses_run || 0}</div>
            <div>Status: {status.status || 'Active'}</div>
          </div>
          {status.last_collection && (
            <div className="pt-1.5 border-t border-amber-300/10 text-amber-300/60">
              Last: {new Date(status.last_collection).toLocaleTimeString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
