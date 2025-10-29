import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';

interface VoiceConfig {
  onResult: (text: string) => void;
  onError: (error: string) => void;
  onStart: () => void;
  onEnd: () => void;
}

class VoiceService {
  private isListening = false;
  private config: VoiceConfig | null = null;

  constructor() {
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechError = this.onSpeechError;
  }

  initialize(config: VoiceConfig) {
    this.config = config;
  }

  onSpeechStart = () => {
    console.log('🎤 Speech started');
    this.isListening = true;
    this.config?.onStart();
  };

  onSpeechEnd = () => {
    console.log('🎤 Speech ended');
    this.isListening = false;
    this.config?.onEnd();
  };

  onSpeechResults = (event: any) => {
    const text = event.value?.[0];
    if (text) {
      console.log('📝 Speech result:', text);
      this.config?.onResult(text);
    }
  };

  onSpeechError = (event: any) => {
    console.error('❌ Speech error:', event.error);
    this.config?.onError(event.error?.message || 'Speech recognition error');
  };

  async startListening() {
    try {
      await Voice.start('en-US');
      console.log('✅ Started listening');
    } catch (error) {
      console.error('Failed to start listening:', error);
      this.config?.onError('Failed to start voice recognition');
    }
  }

  async stopListening() {
    try {
      await Voice.stop();
      console.log('🛑 Stopped listening');
    } catch (error) {
      console.error('Failed to stop listening:', error);
    }
  }

  async speak(text: string) {
    try {
      // Stop listening while MAIA speaks
      if (this.isListening) {
        await this.stopListening();
      }

      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.95,
        onDone: () => {
          console.log('🔊 Speech completed');
          // Resume listening after speaking
          this.startListening();
        },
        onError: (error) => {
          console.error('Speech synthesis error:', error);
        }
      });
    } catch (error) {
      console.error('Failed to speak:', error);
    }
  }

  async destroy() {
    try {
      await Voice.destroy();
      Voice.removeAllListeners();
    } catch (error) {
      console.error('Failed to destroy voice:', error);
    }
  }

  getIsListening() {
    return this.isListening;
  }
}

export default new VoiceService();
