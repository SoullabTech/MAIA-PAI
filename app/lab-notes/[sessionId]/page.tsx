'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MessageCircle, User, Sparkles, Volume2, VolumeX, Play, Pause, Square } from 'lucide-react';
import { Holoflower } from '@/components/ui/Holoflower';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number | Date;
}

interface Session {
  id: string;
  date: Date;
  messageCount: number;
  messages: ConversationMessage[];
}

export default function SessionDetail() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Voice playback state
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(0.95);
  const [pitch, setPitch] = useState(1.05);
  const [volume, setVolume] = useState(0.9);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  useEffect(() => {
    loadSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Initialize voice synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);

        // Try to select a female English voice for MAIA
        const femaleEnglishVoice = voices.find(v =>
          v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('female'))
        );
        const anyEnglishVoice = voices.find(v => v.lang.startsWith('en'));
        setSelectedVoice(femaleEnglishVoice || anyEnglishVoice || voices[0] || null);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  const playMessage = (messageIndex: number, text: string) => {
    if (!speechSynthesis || !selectedVoice) return;

    // Stop any currently playing message
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onend = () => {
      setCurrentlyPlaying(null);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setCurrentlyPlaying(null);
      setIsPaused(false);
    };

    setCurrentlyPlaying(messageIndex);
    setIsPaused(false);
    speechSynthesis.speak(utterance);
  };

  const pausePlayback = () => {
    if (speechSynthesis) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumePlayback = () => {
    if (speechSynthesis) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopPlayback = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setCurrentlyPlaying(null);
      setIsPaused(false);
    }
  };

  const loadSession = () => {
    try {
      const savedMessages = localStorage.getItem('maya_conversation');
      if (savedMessages) {
        const messages: ConversationMessage[] = JSON.parse(savedMessages);

        const sessionMessages = messages.filter(msg => {
          const msgDate = new Date(msg.timestamp);
          const msgDateKey = msgDate.toISOString().split('T')[0];
          return msgDateKey === sessionId;
        });

        if (sessionMessages.length > 0) {
          setSession({
            id: sessionId,
            date: new Date(sessionId),
            messageCount: sessionMessages.length,
            messages: sessionMessages
          });
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: number | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1f3a] flex items-center justify-center">
        <Holoflower size="lg" glowIntensity="high" animate={true} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#1a1f3a] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-amber-200/50">Session not found</p>
          <button
            onClick={() => router.push('/lab-notes')}
            className="mt-4 text-amber-400/60 hover:text-amber-400/90 transition-colors"
          >
            ← Back to Lab Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f3a] px-4 py-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <svg viewBox="0 0 1000 1000" className="w-full h-full">
          <circle cx="500" cy="500" r="400" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx="500" cy="500" r="200" fill="none" stroke="#F6AD55" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/lab-notes')}
          className="flex items-center gap-2 text-amber-200/60 hover:text-amber-200/90 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Lab Notes
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-amber-400/60" />
            <h1 className="text-2xl font-extralight text-amber-50">
              {formatDate(session.date)}
            </h1>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-amber-200/40">
              <MessageCircle className="w-4 h-4" />
              <span>{session.messageCount} messages</span>
            </div>

            {/* Voice Controls Toggle */}
            {speechSynthesis && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                    voiceEnabled
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      : 'bg-black/20 border border-amber-500/20 text-amber-200/50 hover:text-amber-200/80'
                  }`}
                  title={voiceEnabled ? 'Voice playback enabled' : 'Enable voice playback'}
                >
                  {voiceEnabled ? (
                    <><Volume2 className="w-4 h-4" /> Voice ON</>
                  ) : (
                    <><VolumeX className="w-4 h-4" /> Voice OFF</>
                  )}
                </button>

                {voiceEnabled && currentlyPlaying !== null && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={isPaused ? resumePlayback : pausePlayback}
                      className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-all"
                      title={isPaused ? 'Resume' : 'Pause'}
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={stopPlayback}
                      className="p-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 transition-all"
                      title="Stop"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Voice Settings Panel */}
          {voiceEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-black/30 border border-amber-500/20 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-amber-200/80">Voice Settings</h3>
                <button
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className="text-xs text-amber-400/60 hover:text-amber-400/90"
                >
                  {showVoiceSettings ? 'Hide' : 'Show'} options
                </button>
              </div>

              {showVoiceSettings && (
                <div className="space-y-3">
                  {/* Voice Selection */}
                  <div>
                    <label className="block text-xs text-amber-200/60 mb-1">Voice</label>
                    <select
                      value={selectedVoice?.name || ''}
                      onChange={(e) => {
                        const voice = availableVoices.find(v => v.name === e.target.value);
                        setSelectedVoice(voice || null);
                      }}
                      className="w-full px-2 py-1.5 bg-black/40 border border-amber-500/20 rounded text-xs text-amber-100 focus:border-amber-500/40 focus:outline-none"
                    >
                      {availableVoices
                        .filter(v => v.lang.startsWith('en'))
                        .map(voice => (
                          <option key={voice.name} value={voice.name}>
                            {voice.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Rate Control */}
                  <div>
                    <label className="block text-xs text-amber-200/60 mb-1">
                      Speed: {rate.toFixed(2)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.05"
                      value={rate}
                      onChange={(e) => setRate(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  {/* Pitch Control */}
                  <div>
                    <label className="block text-xs text-amber-200/60 mb-1">
                      Pitch: {pitch.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.05"
                      value={pitch}
                      onChange={(e) => setPitch(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  {/* Volume Control */}
                  <div>
                    <label className="block text-xs text-amber-200/60 mb-1">
                      Volume: {Math.round(volume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>
              )}

              <div className="mt-3 text-xs text-amber-200/40">
                Click the play button on any MAIA message to hear it spoken
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          {session.messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className="flex-shrink-0">
                {message.role === 'assistant' ? (
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Holoflower size="sm" glowIntensity="low" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-amber-400/60" />
                  </div>
                )}
              </div>

              <div className={`flex-1 ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-4 relative ${
                    message.role === 'user'
                      ? 'bg-amber-500/20 border border-amber-500/30'
                      : 'bg-black/30 border border-amber-500/20'
                  }`}
                >
                  <p className="text-amber-100/90 text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {/* Voice playback button for MAIA messages */}
                  {message.role === 'assistant' && voiceEnabled && (
                    <button
                      onClick={() => playMessage(index, message.content)}
                      className={`absolute -right-2 -bottom-2 p-2 rounded-full transition-all ${
                        currentlyPlaying === index
                          ? 'bg-amber-500/40 border-2 border-amber-400/60 text-amber-200'
                          : 'bg-amber-500/20 border border-amber-500/30 text-amber-300/60 hover:text-amber-300 hover:bg-amber-500/30'
                      }`}
                      title="Play message"
                    >
                      {currentlyPlaying === index ? (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <Volume2 className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
                <span className="text-xs text-amber-200/30 mt-2 px-2">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/maia')}
            className="px-6 py-3 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Continue conversation
          </button>
        </div>
      </div>
    </div>
  );
}