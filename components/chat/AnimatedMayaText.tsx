'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedMayaTextProps {
  text: string;
  onComplete?: () => void;
  mode?: 'typewriter' | 'words' | 'breath' | 'fade';
  showThinking?: boolean;
  thinkingDuration?: number;
}

export function AnimatedMayaText({
  text,
  onComplete,
  mode = 'breath',
  showThinking = true,
  thinkingDuration = 1500
}: AnimatedMayaTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isThinking, setIsThinking] = useState(showThinking);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    // Reset when new text comes in
    setDisplayedText('');
    setCurrentWordIndex(0);
    setIsThinking(showThinking);

    if (showThinking) {
      // Show thinking state first
      const thinkingTimer = setTimeout(() => {
        setIsThinking(false);
        startAnimation();
      }, thinkingDuration);

      return () => clearTimeout(thinkingTimer);
    } else {
      startAnimation();
    }
  }, [text]);

  const startAnimation = () => {
    switch (mode) {
      case 'typewriter':
        animateTypewriter();
        break;
      case 'words':
        animateWords();
        break;
      case 'breath':
        animateWithBreath();
        break;
      case 'fade':
        animateFade();
        break;
    }
  };

  const animateTypewriter = () => {
    let currentIndex = 0;
    const chars = text.split('');

    const typeNextChar = () => {
      if (currentIndex < chars.length) {
        setDisplayedText(prev => prev + chars[currentIndex]);

        // Variable speed based on character
        let delay = 20; // Base typing speed (faster than before)
        const char = chars[currentIndex];

        // Natural pauses at punctuation
        if (char === '.' || char === '!' || char === '?') {
          delay = 400; // Sentence end pause
        } else if (char === ',') {
          delay = 150; // Comma pause
        } else if (char === ' ') {
          delay = 30; // Slight pause between words
        }

        currentIndex++;
        setTimeout(typeNextChar, delay);
      } else {
        onComplete?.();
      }
    };

    typeNextChar();
  };

  const animateWords = () => {
    const words = text.split(' ');
    let index = 0;

    const interval = setInterval(() => {
      if (index < words.length) {
        setDisplayedText(prev =>
          prev + (prev ? ' ' : '') + words[index]
        );
        index++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, 120); // Natural speaking pace
  };

  const animateWithBreath = () => {
    // Split by punctuation but keep the punctuation
    const segments = text.split(/([.!?;,—])/);
    let delay = 0;

    segments.forEach((segment, index) => {
      setTimeout(() => {
        setDisplayedText(prev => prev + segment);

        if (index === segments.length - 1) {
          onComplete?.();
        }
      }, delay);

      // Natural pauses based on punctuation
      if (segment === '.' || segment === '!' || segment === '?') {
        delay += 600; // Sentence end pause
      } else if (segment === ',' || segment === ';') {
        delay += 300; // Clause pause
      } else if (segment === '—') {
        delay += 400; // Thought pause
      } else {
        // Regular text speed based on length
        delay += segment.length * 25;
      }
    });
  };

  const animateFade = () => {
    // Fade in the complete text
    setDisplayedText(text);
    onComplete?.();
  };

  return (
    <div className="maya-text-container">
      <AnimatePresence mode="wait">
        {isThinking && (
          <motion.div
            key="thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-amber-400/60 text-sm"
          >
            <span>Maya is reflecting</span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="inline-flex gap-1">
                <span className="w-1 h-1 bg-amber-400/60 rounded-full" />
                <span className="w-1 h-1 bg-amber-400/60 rounded-full" />
                <span className="w-1 h-1 bg-amber-400/60 rounded-full" />
              </span>
            </motion.span>
          </motion.div>
        )}

        {!isThinking && (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="maya-message"
          >
            {mode === 'fade' ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                {displayedText}
              </motion.span>
            ) : (
              <span>
                {displayedText}
                {displayedText !== text && (
                  <motion.span
                    className="inline-block w-0.5 h-4 bg-amber-400/50 ml-0.5"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "steps(2)"
                    }}
                  />
                )}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Usage in your chat component:
/*
<AnimatedMayaText
  text={mayaResponse}
  mode="breath"  // Most natural for conversation
  showThinking={true}
  thinkingDuration={2000}
  onComplete={() => setCanUserRespond(true)}
/>
*/