import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import VoiceService from '../services/VoiceService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function MAIAScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Initialize voice service
    VoiceService.initialize({
      onResult: handleUserSpeech,
      onError: (error) => {
        console.error('Voice error:', error);
        setIsListening(false);
      },
      onStart: () => setIsListening(true),
      onEnd: () => setIsListening(false),
    });

    // Start listening on mount
    startConversation();

    return () => {
      VoiceService.destroy();
    };
  }, []);

  const startConversation = async () => {
    await VoiceService.startListening();
  };

  const handleUserSpeech = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Stop listening while processing
    await VoiceService.stopListening();
    setIsProcessing(true);

    try {
      // Call MAIA backend API
      // TODO: Replace with your production URL when deployed
      const API_BASE_URL = __DEV__
        ? 'http://localhost:3000'
        : 'https://your-production-url.vercel.app';

      const response = await fetch(`${API_BASE_URL}/api/maia/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userId: 'mobile_user_' + Date.now(), // TODO: Use real user ID from auth
          conversationMode: 'walking', // Brief responses for mobile
          voiceEnabled: true,
        }),
      });

      const data = await response.json();
      const maiaText = data.response;

      // Add MAIA's response
      const maiaMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: maiaText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, maiaMessage]);

      // Speak MAIA's response
      setIsSpeaking(true);
      await VoiceService.speak(maiaText);
      setIsSpeaking(false);

    } catch (error) {
      console.error('Failed to get response:', error);
    } finally {
      setIsProcessing(false);
      // Resume listening
      await VoiceService.startListening();
    }
  };

  const toggleVoice = async () => {
    if (isListening) {
      await VoiceService.stopListening();
    } else {
      await VoiceService.startListening();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>MAIA</Text>
        <Text style={styles.subtitle}>Soul Companion</Text>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messages}>
        {messages.map(msg => (
          <View
            key={msg.id}
            style={[
              styles.message,
              msg.isUser ? styles.userMessage : styles.maiaMessage,
            ]}
          >
            <Text style={styles.messageLabel}>
              {msg.isUser ? 'You' : 'MAIA'}
            </Text>
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Voice Status */}
      <View style={styles.statusContainer}>
        {isListening && (
          <View style={styles.listeningIndicator}>
            <Text style={styles.statusText}>🎤 Listening...</Text>
          </View>
        )}
        {isSpeaking && (
          <View style={styles.speakingIndicator}>
            <Text style={styles.statusText}>🔊 Speaking...</Text>
          </View>
        )}
        {isProcessing && (
          <View style={styles.processingIndicator}>
            <ActivityIndicator color="#D4B896" />
            <Text style={styles.statusText}>Processing...</Text>
          </View>
        )}
      </View>

      {/* Voice Toggle */}
      <TouchableOpacity
        style={styles.voiceButton}
        onPress={toggleVoice}
        disabled={isSpeaking || isProcessing}
      >
        <Text style={styles.voiceButtonText}>
          {isListening ? '🔇 Mute' : '🎤 Speak'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1513',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D4B896',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D4B896',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#D4B896',
    opacity: 0.6,
    marginTop: 4,
  },
  messages: {
    flex: 1,
    padding: 16,
  },
  message: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
  },
  userMessage: {
    backgroundColor: '#2A2520',
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  maiaMessage: {
    backgroundColor: '#3A3530',
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageLabel: {
    fontSize: 12,
    color: '#D4B896',
    opacity: 0.6,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  statusContainer: {
    padding: 16,
    alignItems: 'center',
  },
  listeningIndicator: {
    backgroundColor: '#2A5530',
    padding: 12,
    borderRadius: 8,
  },
  speakingIndicator: {
    backgroundColor: '#553530',
    padding: 12,
    borderRadius: 8,
  },
  processingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3A3020',
    padding: 12,
    borderRadius: 8,
  },
  statusText: {
    color: '#D4B896',
    fontSize: 14,
  },
  voiceButton: {
    margin: 20,
    backgroundColor: '#D4B896',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  voiceButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1513',
  },
});
