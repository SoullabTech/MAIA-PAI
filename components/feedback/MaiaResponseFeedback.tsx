"use client";

import React, { useState } from 'react';
import { Heart, Sparkles, Wind } from 'lucide-react';

interface MaiaResponseFeedbackProps {
  responseId: string;
  userId: string;
  element?: string;
  voiceTone?: { style: string; pitch: number; rate: number };
  onFeedback?: (feedback: FeedbackData) => void;
}

export interface FeedbackData {
  responseId: string;
  userId: string;
  satisfaction?: 'positive' | 'negative';
  elementAccurate?: boolean;
  prosodyNoticed?: 'yes' | 'no' | 'subtle';
  comments?: string;
  timestamp: string;
}

export function MaiaResponseFeedback({
  responseId,
  userId,
  element,
  voiceTone,
  onFeedback
}: MaiaResponseFeedbackProps) {
  const [loved, setLoved] = useState(false);
  const [elementFeedback, setElementFeedback] = useState<boolean | null>(null);
  const [prosodyFeedback, setProsodyFeedback] = useState<'yes' | 'no' | 'subtle' | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleLove = () => {
    setLoved(!loved);

    // If toggling on, submit immediately
    if (!loved) {
      submitFeedback({ satisfaction: 'positive' });

      // Show additional feedback options if element/voice present
      if (element || voiceTone) {
        setShowDetails(true);
      }
    }
  };

  const handleElementFeedback = (accurate: boolean) => {
    setElementFeedback(accurate);
  };

  const handleProsodyFeedback = (noticed: 'yes' | 'no' | 'subtle') => {
    setProsodyFeedback(noticed);
  };

  const submitFeedback = async (partialFeedback?: Partial<FeedbackData>) => {
    const feedback: FeedbackData = {
      responseId,
      userId,
      satisfaction: partialFeedback?.satisfaction || (loved ? 'positive' : undefined),
      elementAccurate: elementFeedback || undefined,
      prosodyNoticed: prosodyFeedback || undefined,
      timestamp: new Date().toISOString()
    };

    // Save to database
    try {
      await fetch('/api/feedback/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback)
      });

      console.log('📊 Feedback submitted:', feedback);
      onFeedback?.(feedback);
      setSubmitted(true);

      // Auto-hide after 2 seconds
      setTimeout(() => {
        setSubmitted(false);
        setShowDetails(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 animate-in fade-in">
        <Sparkles className="w-4 h-4" />
        <span>Thank you for your feedback</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-2">
      {/* Heart Appreciation */}
      <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
        <button
          onClick={handleLove}
          className={`p-1.5 rounded-full transition-all ${
            loved
              ? 'text-red-500 dark:text-red-400 scale-110'
              : 'text-gray-400 dark:text-gray-500 hover:text-red-400 hover:scale-105'
          }`}
          aria-label="Love this response"
        >
          <Heart
            className={`w-5 h-5 transition-all ${loved ? 'fill-current' : ''}`}
          />
        </button>
      </div>

      {/* Detailed Feedback (shows after rating) */}
      {showDetails && (
        <div className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 animate-in slide-in-from-top">

          {/* Element Accuracy */}
          {element && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Did the {element.toUpperCase()} energy feel accurate?
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleElementFeedback(true)}
                  className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                    elementFeedback === true
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:border-blue-300'
                  }`}
                >
                  Yes, spot on
                </button>
                <button
                  onClick={() => handleElementFeedback(false)}
                  className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                    elementFeedback === false
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-700'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:border-orange-300'
                  }`}
                >
                  Not quite
                </button>
              </div>
            </div>
          )}

          {/* Voice Prosody */}
          {voiceTone && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Wind className="w-3 h-3" />
                Did you notice the voice matching the {voiceTone.style.split('-')[0]} quality?
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleProsodyFeedback('yes')}
                  className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                    prosodyFeedback === 'yes'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-700'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:border-purple-300'
                  }`}
                >
                  Definitely
                </button>
                <button
                  onClick={() => handleProsodyFeedback('subtle')}
                  className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                    prosodyFeedback === 'subtle'
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:border-indigo-300'
                  }`}
                >
                  Subtle
                </button>
                <button
                  onClick={() => handleProsodyFeedback('no')}
                  className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                    prosodyFeedback === 'no'
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-400 dark:border-gray-600'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:border-gray-400'
                  }`}
                >
                  Didn't notice
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {(loved || elementFeedback !== null || prosodyFeedback) && (
            <button
              onClick={() => submitFeedback()}
              className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Submit Feedback
            </button>
          )}
        </div>
      )}
    </div>
  );
}
