'use client';

import { useState, useRef, useEffect } from 'react';
import { CollectivePulse } from './CollectivePulse';
import { detectBreakthrough } from '@/lib/utils/breakthroughDetection';

export default function ChatWithPulseExample() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputText, setInputText] = useState('');
  const [breakthrough, setBreakthrough] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState('');

  const handleSendMessage = (text: string) => {
    const analysis = detectBreakthrough(text);

    if (analysis.isBreakthrough) {
      console.log('🌟 Breakthrough detected!', {
        depth: analysis.depth,
        markers: analysis.markers
      });

      setBreakthrough(true);

      setTimeout(() => {
        setBreakthrough(false);
      }, 5000);
    }

    setLastUserMessage(text);
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputText('');
  };

  return (
    <div className="relative h-screen">
      <div className="flex flex-col h-full">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}

        <div className="input-area">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Share what's present..."
          />
          <button onClick={() => handleSendMessage(inputText)}>
            Send
          </button>
        </div>
      </div>

      <CollectivePulse
        conversation={{
          depth: detectBreakthrough(lastUserMessage).depth,
          content: lastUserMessage
        }}
        breakthrough={breakthrough}
      />
    </div>
  );
}