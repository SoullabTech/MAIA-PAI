"use client";

/**
 * Unified Voice Recognition Service
 * Single source of truth for all voice recognition functionality
 * Replaces: OptimizedVoiceRecognition, useVoiceInput, and scattered recognition code
 */

export interface VoiceRecognitionConfig {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  silenceTimeoutMs?: number;
  maxAlternatives?: number;
}

export interface VoiceRecognitionCallbacks {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onAutoStop?: (finalTranscript: string) => void;
}

export class OptimizedVoiceRecognition {
  private recognition: any = null;
  private isInitializing = false;
  private isActive = false;
  private initializationTimeout: NodeJS.Timeout | null = null;
  private restartDebounce: NodeJS.Timeout | null = null;
  private lastStartTime = 0;
  private MIN_START_INTERVAL = 500;

  private callbacks: VoiceRecognitionCallbacks;
  private config: VoiceRecognitionConfig;

  private finalTranscriptRef = '';
  private silenceTimeoutRef: NodeJS.Timeout | null = null;
  private retryAttempts = 0;
  private MAX_RETRY_ATTEMPTS = 3;

  private LOG_ENABLED = process.env.NODE_ENV === 'development';
  private logCount = 0;
  private MAX_LOGS = 10;

  constructor(callbacks: VoiceRecognitionCallbacks, config: VoiceRecognitionConfig = {}) {
    this.callbacks = callbacks;
    this.config = {
      continuous: config.continuous ?? true,
      interimResults: config.interimResults ?? true,
      language: config.language ?? 'en-US',
      silenceTimeoutMs: config.silenceTimeoutMs ?? 1500,
      maxAlternatives: config.maxAlternatives ?? 1,
    };
  }

  private log(message: string, ...args: any[]) {
    if (!this.LOG_ENABLED || this.logCount >= this.MAX_LOGS) return;
    console.log(message, ...args);
    this.logCount++;
  }

  /**
   * Initialize speech recognition with proper guards
   */
  public async startListening(): Promise<boolean> {
    // Guard: Check if already initializing
    if (this.isInitializing) {
      this.log('⏳ Already initializing, skipping...');
      return false;
    }

    // Guard: Check if already active
    if (this.isActive) {
      this.log('✅ Already listening');
      return true;
    }

    // Guard: Rate limit starts
    const now = Date.now();
    if (now - this.lastStartTime < this.MIN_START_INTERVAL) {
      this.log('⚠️ Rate limit: Too soon since last start');
      return false;
    }

    this.lastStartTime = now;
    this.isInitializing = true;

    try {
      // Initialize if needed
      if (!this.recognition) {
        const success = await this.initialize();
        if (!success) {
          this.isInitializing = false;
          return false;
        }
      }

      // Start recognition with timeout protection
      await this.startWithTimeout();

      this.isActive = true;
      this.isInitializing = false;
      this.retryAttempts = 0; // Reset retry counter on successful start
      return true;

    } catch (error) {
      this.log('❌ Start listening error:', error);
      this.isInitializing = false;
      this.isActive = false;

      // Retry logic for failed activation
      if (this.retryAttempts < this.MAX_RETRY_ATTEMPTS) {
        this.retryAttempts++;
        this.log(`🔄 Retrying activation (attempt ${this.retryAttempts}/${this.MAX_RETRY_ATTEMPTS})`);

        // Wait before retry with exponential backoff
        const retryDelay = 1000 * Math.pow(2, this.retryAttempts - 1);
        setTimeout(() => {
          this.startListening();
        }, retryDelay);

        return false;
      } else {
        this.callbacks.onError?.('Failed to start voice recognition after multiple attempts. Please refresh the page.');
        this.retryAttempts = 0; // Reset for next time
        return false;
      }
    }
  }

  /**
   * Start recognition with timeout protection
   */
  private async startWithTimeout(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Set timeout for start
      this.initializationTimeout = setTimeout(() => {
        reject(new Error('Recognition start timeout'));
      }, 3000);

      try {
        this.recognition.start();

        // Clear timeout on successful start
        if (this.initializationTimeout) {
          clearTimeout(this.initializationTimeout);
          this.initializationTimeout = null;
        }

        resolve();
      } catch (error: any) {
        if (this.initializationTimeout) {
          clearTimeout(this.initializationTimeout);
          this.initializationTimeout = null;
        }

        // Ignore "already started" errors
        if (error.message?.includes('already started')) {
          this.log('⚠️ Recognition already started');
          resolve();
        } else {
          reject(error);
        }
      }
    });
  }

  /**
   * Initialize speech recognition
   */
  private async initialize(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const SpeechRecognition = (window as any).webkitSpeechRecognition ||
                             (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      this.onError?.('Speech recognition not supported');
      return false;
    }

    try {
      // iPad Safari specific fixes
      const isIPadSafari = /iPad.*Safari/.test(navigator.userAgent);

      if (isIPadSafari) {
        this.log('🎯 Applying iPad Safari fixes');

        // Create audio context to ensure proper permission flow on iPad
        try {
          const audioContext = new AudioContext();
          await audioContext.resume();
          await audioContext.close();
        } catch (e) {
          this.log('⚠️ Audio context setup failed', e);
        }

        // Add delay for iPad Safari permission dialog
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Additional delay for iPad Safari after permission granted
      if (isIPadSafari) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      this.recognition = new SpeechRecognition();

      // iPad Safari specific configuration
      if (isIPadSafari) {
        this.log('🎯 Configuring for iPad Safari');
        // Start with single recognition to avoid issues
        this.recognition.continuous = false;
        this.recognition.interimResults = false;

        // Enable continuous mode after a brief delay
        setTimeout(() => {
          if (this.recognition) {
            this.recognition.continuous = this.config.continuous ?? true;
            this.recognition.interimResults = this.config.interimResults ?? true;
            this.log('🎯 iPad Safari: Enabled continuous mode');
          }
        }, 500);
      } else {
        this.recognition.continuous = this.config.continuous ?? true;
        this.recognition.interimResults = this.config.interimResults ?? true;
      }

      this.recognition.lang = this.config.language || 'en-US';
      this.recognition.maxAlternatives = this.config.maxAlternatives || 1;

      this.setupEventHandlers();

      this.log('✅ Recognition initialized');
      return true;

    } catch (error: any) {
      this.log('❌ Initialization error:', error);

      // Provide more specific error messages for iPad Safari
      if (error.name === 'NotAllowedError') {
        this.callbacks.onError?.('Microphone permission denied. Please allow microphone access in Safari settings and try again.');
      } else if (error.name === 'NotFoundError') {
        this.callbacks.onError?.('No microphone found. Please check your device settings and try again.');
      } else if (error.name === 'AbortError') {
        this.callbacks.onError?.('Voice activation was interrupted. Please try again.');
      } else if (error.message?.includes('getUserMedia')) {
        this.callbacks.onError?.('Unable to access microphone. Please check permissions and try again.');
      } else {
        this.callbacks.onError?.('Voice activation failed. Please refresh the page and try again.');
      }
      return false;
    }
  }

  /**
   * Setup event handlers with proper error handling
   */
  private setupEventHandlers() {
    this.recognition.onstart = () => {
      this.isActive = true;
      this.callbacks.onStart?.();
      this.log('🟢 Recognition started');
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let hasFinalResult = false;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const isFinal = event.results[i].isFinal;

        if (isFinal) {
          this.finalTranscriptRef += transcript + ' ';
          hasFinalResult = true;
        } else {
          interimTranscript += transcript;
        }

        this.callbacks.onResult?.(transcript, isFinal);
      }

      if (this.silenceTimeoutRef) {
        clearTimeout(this.silenceTimeoutRef);
      }

      if (this.config.continuous && this.config.silenceTimeoutMs && (hasFinalResult || interimTranscript)) {
        this.silenceTimeoutRef = setTimeout(() => {
          const finalText = this.finalTranscriptRef.trim();
          if (finalText.length >= 3) {
            this.log(`🎤 Auto-stopping after ${this.config.silenceTimeoutMs}ms silence`);
            this.recognition?.stop();
            this.callbacks.onAutoStop?.(finalText);
          }
        }, this.config.silenceTimeoutMs);
      }
    };

    this.recognition.onerror = (event: any) => {
      const error = event.error;

      if (error !== 'no-speech' && error !== 'aborted') {
        this.log('❌ Recognition error:', error);
        this.callbacks.onError?.(error);
      }

      if (error === 'aborted') {
        this.isActive = false;
      }
    };

    this.recognition.onend = () => {
      this.isActive = false;
      this.callbacks.onEnd?.();

      if (this.restartDebounce) {
        clearTimeout(this.restartDebounce);
        this.restartDebounce = null;
      }

      this.log('🔇 Recognition ended');
    };
  }

  /**
   * Stop listening
   */
  public stopListening(): void {
    if (!this.recognition || !this.isActive) return;

    try {
      // Clear any timeouts
      if (this.initializationTimeout) {
        clearTimeout(this.initializationTimeout);
        this.initializationTimeout = null;
      }

      if (this.restartDebounce) {
        clearTimeout(this.restartDebounce);
        this.restartDebounce = null;
      }

      this.recognition.stop();
      this.isActive = false;
      this.log('🛑 Stopping recognition');

    } catch (error) {
      this.log('❌ Stop error:', error);
    }
  }

  /**
   * Restart with debouncing
   */
  public restartListening(delayMs: number = 500): void {
    // Clear any pending restart
    if (this.restartDebounce) {
      clearTimeout(this.restartDebounce);
    }

    // Stop current session
    this.stopListening();

    // Debounced restart
    this.restartDebounce = setTimeout(() => {
      this.startListening();
    }, delayMs);
  }

  /**
   * Check if currently active
   */
  public isListening(): boolean {
    return this.isActive;
  }

  /**
   * Cleanup
   */
  public resetTranscript(): void {
    this.finalTranscriptRef = '';
  }

  public getTranscript(): string {
    return this.finalTranscriptRef.trim();
  }

  public updateConfig(newConfig: Partial<VoiceRecognitionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public destroy(): void {
    this.stopListening();

    if (this.initializationTimeout) {
      clearTimeout(this.initializationTimeout);
    }

    if (this.restartDebounce) {
      clearTimeout(this.restartDebounce);
    }

    if (this.silenceTimeoutRef) {
      clearTimeout(this.silenceTimeoutRef);
    }

    this.recognition = null;
    this.log('🧹 Voice recognition destroyed');
  }

  static isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition);
  }
}

export default OptimizedVoiceRecognition;