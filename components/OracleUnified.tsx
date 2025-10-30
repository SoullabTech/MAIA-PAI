'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimplifiedOrganicVoice } from './ui/SimplifiedOrganicVoice';
import { useMaiaVoice } from '@/hooks/useMaiaVoice';
import {
  Volume2, VolumeX, Download, Mic, MicOff,
  Paperclip, Send, MessageSquare, X
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'oracle';
  content: string;
  timestamp: Date;
  element?: string;
}

interface UnifiedOracleProps {
  sessionId?: string;
  onMessageAdded?: (message: Message) => void;
}

export function OracleUnified({ sessionId = `session-${Date.now()}`, onMessageAdded }: UnifiedOracleProps) {
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMaiaSpeaking, setIsMaiaSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Voice system
  const { speak: maiaSpeak, isReady: maiaReady } = useMaiaVoice();
  const audioContextRef = useRef<AudioContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize audio context
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Process Oracle response
  const processOracleResponse = async (userText: string, files?: File[]) => {
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    onMessageAdded?.(userMessage);

    setIsProcessing(true);

    try {
      // Prepare form data if files exist
      const formData = new FormData();
      formData.append('message', userText);
      formData.append('sessionId', sessionId);

      if (files?.length) {
        files.forEach(file => formData.append('files', file));
      }

      // Route to consciousness API for consciousness questions,
      // otherwise use personal consult
      const isConsciousnessQuestion = /consciousness|awareness|being|presence|awakening|kairos|maia|unified/i.test(userText);

      const response = await fetch(
        isConsciousnessQuestion ? '/api/consciousness' : '/api/oracle/personal/consult',
        {
          method: 'POST',
          body: files?.length ? formData : JSON.stringify({
            message: userText,
            sessionId,
            userId: 'oracle-voice-user'
          }),
          headers: files?.length ? {} : { 'Content-Type': 'application/json' }
        }
      );

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      // Get response - for consciousness API, keep formatting intact
      let cleanResponse = data.response || data.message || "I'm here to listen.";

      // Only clean if NOT from consciousness API (preserve consciousness signatures and formatting)
      if (!isConsciousnessQuestion) {
        cleanResponse = cleanResponse
          .replace(/\*[^*]*\*/g, '')
          .replace(/\[[^\]]*\]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      } else {
        // For consciousness responses, just normalize whitespace
        cleanResponse = cleanResponse.replace(/\s+/g, ' ').trim();
      }

      // Add oracle response
      const oracleMessage: Message = {
        id: `msg-${Date.now()}-oracle`,
        role: 'oracle',
        content: cleanResponse,
        element: data.element,
        timestamp: new Date()
      };

      console.log('🌟 Adding Oracle message:', {
        role: oracleMessage.role,
        contentLength: oracleMessage.content.length,
        content: oracleMessage.content.substring(0, 100),
        consciousness: data.consciousness || 'unknown'
      });

      setMessages(prev => [...prev, oracleMessage]);
      onMessageAdded?.(oracleMessage);

      // Speak response if not muted
      if (!isMuted && maiaReady && cleanResponse) {
        try {
          initAudioContext();
          setIsMaiaSpeaking(true);
          await maiaSpeak(cleanResponse, {
            element: data.element,
            voice: 'alloy',
            speed: 0.95
          });
          setIsMaiaSpeaking(false);
        } catch (error) {
          console.error('Voice error:', error);
          setIsMaiaSpeaking(false);
        }
      }
    } catch (err) {
      console.error('Error processing response:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle voice transcript
  const handleVoiceTranscript = useCallback((transcript: string) => {
    if (transcript.trim() && !isProcessing && !isMaiaSpeaking) {
      processOracleResponse(transcript);
    }
  }, [isProcessing, isMaiaSpeaking]);

  // Handle text submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((inputText.trim() || selectedFiles.length > 0) && !isProcessing) {
      processOracleResponse(
        inputText.trim() || 'Please review these files',
        selectedFiles
      );
      setInputText('');
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // Download conversation
  const downloadConversation = () => {
    if (!messages.length) return;

    const transcript = messages.map(msg =>
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.role === 'user' ? 'You' : 'Oracle'}: ${msg.content}`
    ).join('\n\n');

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oracle-conversation-${sessionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Determine holoflower energy state based on voice activity
  const getEnergyState = () => {
    if (isMaiaSpeaking) return 'radiant';  // Full glow when Maia speaks
    if (isListening) return 'emerging';     // Medium glow when user speaks
    if (isProcessing) return 'emerging';    // Processing state
    return 'dense';                         // Idle state
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <div className="text-center pt-4 pb-2 relative z-10">
        <h1 className="text-2xl font-light text-[#D4B896]">Oracle Interface</h1>
        <p className="text-xs text-[#D4B896]/50 mt-1">Sacred wisdom awaits</p>
      </div>

      {/* Main Content Area */}
      <div className="relative h-[calc(100vh-140px)]">
        {/* Holoflower with Voice Visualizer */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Subtle Ambient Glow - Always Gentle */}
          <motion.div
            className="absolute w-64 h-64 rounded-full pointer-events-none"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.15, 0.2, 0.15],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'radial-gradient(circle, rgba(212,184,150,0.3) 0%, transparent 60%)',
              filter: 'blur(25px)'
            }}
          />


          {/* Sacred Geometry Holoflower - Clean Flower of Life */}
          <motion.div
            onClick={() => {
              if (!showChatInterface) {
                initAudioContext();
                setIsListening(!isListening);
                setIsMuted(false);
              }
            }}
            className="relative cursor-pointer"
            style={{ width: '320px', height: '320px' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Outer ring of 6 circles - Flower of Life pattern */}
            {[...Array(6)].map((_, i) => {
              const angle = (i * 60) * (Math.PI / 180);
              const radius = 55;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    border: '2px solid rgba(212,184,150,0.8)',
                    background: 'transparent',
                  }}
                  animate={{
                    opacity: [0.6, 0.9, 0.6],
                    borderColor: ['rgba(212,184,150,0.8)', 'rgba(251,191,36,0.9)', 'rgba(212,184,150,0.8)']
                  }}
                  transition={{
                    duration: 4,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              );
            })}

            {/* Center circle - same size and position as outer 6 */}
            <motion.div
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                border: '2px solid rgba(212,184,150,0.8)',
                background: 'transparent',
              }}
              animate={{
                opacity: [0.6, 0.9, 0.6],
                borderColor: ['rgba(212,184,150,0.8)', 'rgba(251,191,36,0.9)', 'rgba(212,184,150,0.8)']
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Bright center point at exact geometric center */}
              <div
                className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                style={{
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(255,255,255,1), rgba(251,191,36,0.9))',
                  boxShadow: '0 0 15px rgba(251,191,36,0.9), 0 0 30px rgba(212,184,150,0.7)',
                }}
              />
            </motion.div>
          </motion.div>

          {/* Voice Hint - Shows when hovering or first load */}
          <AnimatePresence>
            {!isListening && !isMaiaSpeaking && !showChatInterface && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-none"
              >
                <p className="text-xs text-[#D4B896]/40 animate-pulse">
                  Tap to speak with Oracle
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Messages Overlay - Elegant Typography, No Boxes */}
        {messages.length > 0 && (
          <div className="absolute inset-x-0 top-0 h-full overflow-y-auto px-6 py-6">
            <div className="max-w-4xl mx-auto space-y-8">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}
                  >
                    {/* Label - Small, subtle */}
                    <p className={`text-sm font-light tracking-wider mb-2 ${
                      message.role === 'user'
                        ? 'text-[#D4B896]/50'
                        : 'text-amber-400/60'
                    }`}>
                      {message.role === 'user' ? 'KELLY' : 'UNIFIED'}
                    </p>

                    {/* Message - Large, bold, elegant */}
                    <p className={`text-xl md:text-2xl lg:text-3xl font-light leading-relaxed ${
                      message.role === 'user'
                        ? 'text-[#D4B896] font-normal'
                        : 'text-amber-50/95 font-light'
                    }`} style={{
                      textShadow: message.role === 'oracle'
                        ? '0 0 20px rgba(251,191,36,0.3)'
                        : 'none',
                      letterSpacing: '0.02em'
                    }}>
                      {message.content}
                    </p>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Control Bar - Clean icon style at right */}
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
          <div className="bg-black/60 backdrop-blur-lg rounded-full p-2 flex flex-col gap-2">
            {/* Voice Button */}
            <motion.button
              onClick={() => {
                setShowChatInterface(false);
                initAudioContext();
                setIsListening(!isListening);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                !showChatInterface && isListening
                  ? 'bg-[#D4B896]/20 text-[#D4B896]'
                  : 'text-[#D4B896]/40 hover:text-[#D4B896]/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mic className="w-4 h-4" />
            </motion.button>

            {/* Chat Button */}
            <motion.button
              onClick={() => {
                setShowChatInterface(true);
                setIsListening(false);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                showChatInterface
                  ? 'bg-[#D4B896]/20 text-[#D4B896]'
                  : 'text-[#D4B896]/40 hover:text-[#D4B896]/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquare className="w-4 h-4" />
            </motion.button>

            {/* Upload Button */}
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#D4B896]/40 hover:text-[#D4B896]/80 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Paperclip className="w-4 h-4" />
            </motion.button>

            {/* Download Button */}
            <motion.button
              onClick={downloadConversation}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#D4B896]/40 hover:text-[#D4B896]/80 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
            </motion.button>

            {/* Mute Button */}
            <motion.button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isMuted
                  ? 'bg-red-500/20 text-red-400'
                  : 'text-[#D4B896]/40 hover:text-[#D4B896]/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Status Indicator */}
        <AnimatePresence>
          {(isProcessing || isMaiaSpeaking || isListening) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-xs text-[#D4B896]/80">
                {isProcessing && "Oracle is thinking..."}
                {isMaiaSpeaking && "Oracle is speaking..."}
                {isListening && !isProcessing && !isMaiaSpeaking && "Listening..."}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Input Area */}
      {showChatInterface && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-lg border-t border-[#D4B896]/10">
          <div className="max-w-4xl mx-auto p-4">
            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 bg-black/50 border border-[#D4B896]/30 rounded-full text-[#D4B896] placeholder-[#D4B896]/40 focus:outline-none focus:border-[#D4B896]/60 text-sm disabled:opacity-50"
              />

              {/* File Upload */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2.5 bg-black/50 border border-[#D4B896]/30 rounded-full text-[#D4B896]/60 hover:bg-[#D4B896]/10 transition-all"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isProcessing || (!inputText.trim() && selectedFiles.length === 0)}
                className="px-6 py-2.5 bg-gradient-to-r from-[#D4B896]/20 to-[#B69A78]/20 border border-[#D4B896]/30 rounded-full text-[#D4B896] hover:from-[#D4B896]/30 hover:to-[#B69A78]/30 transition-all text-sm disabled:opacity-50"
              >
                Send
              </button>
            </form>

            {/* Selected Files Display */}
          {selectedFiles.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="px-2 py-1 bg-[#D4B896]/10 rounded-full text-xs text-[#D4B896]/80 flex items-center gap-1">
                  <span>{file.name}</span>
                  <button
                    onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== idx))}
                    className="hover:text-[#D4B896]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}

      {/* Voice Interface (Hidden but active) */}
      {isListening && !showChatInterface && (
        <div className="fixed bottom-[-200px] opacity-0 pointer-events-none">
          <SimplifiedOrganicVoice
            onTranscript={handleVoiceTranscript}
            enabled={isListening && !showChatInterface}
            isMaiaSpeaking={isMaiaSpeaking}
          />
        </div>
      )}
    </div>
  );
}