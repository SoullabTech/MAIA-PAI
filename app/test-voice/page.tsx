'use client';

import { useEffect, useState } from 'react';
import { useMaiaVoice } from '@/app/hooks/useMaiaVoice';
import { subscribe } from '@/lib/voice/VoiceBus';

export default function TestVoicePage() {
  const voice = useMaiaVoice();
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    const addEvent = (event: string) => {
      console.log(event);
      setEvents(prev => [...prev.slice(-20), event]);
    };

    // Subscribe to VoiceBus events
    const unsub1 = subscribe('voice:start', () => addEvent('[VOICE_BUS] voice:start'));
    const unsub2 = subscribe('voice:stop', () => addEvent('[VOICE_BUS] voice:stop'));
    const unsub3 = subscribe('voice:listening', () => addEvent('[VOICE_BUS] voice:listening'));
    const unsub4 = subscribe('voice:transcript', (data: any) => addEvent('[VOICE_BUS] transcript: ' + data.text));
    const unsub5 = subscribe('voice:speaking', () => addEvent('[VOICE_BUS] voice:speaking'));
    const unsub6 = subscribe('voice:error', (data: any) => addEvent('[VOICE_BUS] error: ' + data.error.message));
    const unsub7 = subscribe('element:detected', (data: any) => addEvent('[VOICE_BUS] element: ' + data.element));
    const unsub8 = subscribe('prosody:analyzed', (data: any) => addEvent('[VOICE_BUS] prosody: tone=' + data.tone));

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
      unsub5();
      unsub6();
      unsub7();
      unsub8();
    };
  }, []);

  const handleStart = async () => {
    try {
      await voice.start();
    } catch (err: any) {
      console.error('[TEST] Start failed:', err.message);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', background: '#ffffff', minHeight: '100vh', color: '#000000' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>MAIA Voice Test</h1>

      <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Status</h2>
        <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>
          <p>System: {voice.systemVersion}</p>
          <p>Connected: {voice.isConnected ? 'YES' : 'NO'}</p>
          <p>Listening: {voice.isListening ? 'YES' : 'NO'}</p>
          <p>Speaking: {voice.isSpeaking ? 'YES' : 'NO'}</p>
        </div>
      </div>

      <button onClick={handleStart} style={{ padding: '12px 24px', fontSize: '16px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '20px' }}>
        Start Listening
      </button>

      <div style={{ padding: '20px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>VoiceBus Events</h3>
        <div style={{ fontSize: '12px', fontFamily: 'monospace', maxHeight: '300px', overflowY: 'auto', background: '#f8f9fa', padding: '10px' }}>
          {events.length === 0 && <p>No events yet. Click Start to begin.</p>}
          {events.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      </div>
    </div>
  );
}
