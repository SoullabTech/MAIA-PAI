'use client';

/**
 * Maia Realtime Voice Client - WebRTC Implementation
 *
 * Uses WebRTC (recommended by OpenAI for browser clients) with ephemeral tokens
 * for secure, low-latency voice conversations.
 *
 * References:
 * - https://platform.openai.com/docs/guides/realtime
 * - WebRTC is the recommended approach for browser-based clients (Dec 2024+)
 */

export interface MaiaRealtimeConfig {
  model?: string;
  voice?: 'alloy' | 'echo' | 'shimmer' | 'ash' | 'ballad' | 'coral' | 'sage' | 'verse';
  systemPrompt?: string;
  userId?: string;
  element?: string;
  conversationStyle?: string;
  onTranscript?: (text: string, isUser: boolean) => void;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
  onError?: (error: Error) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export class MaiaRealtimeWebRTC {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private config: Required<MaiaRealtimeConfig>;
  private audioElement: HTMLAudioElement | null = null;
  private isConnecting: boolean = false;

  constructor(config: MaiaRealtimeConfig) {
    this.config = {
      model: config.model || 'gpt-4o-realtime-preview-2024-12-17',
      voice: config.voice || 'shimmer',
      systemPrompt: config.systemPrompt || '',
      userId: config.userId || 'anonymous',
      element: config.element || 'aether',
      conversationStyle: config.conversationStyle || 'natural',
      onTranscript: config.onTranscript || (() => {}),
      onAudioStart: config.onAudioStart || (() => {}),
      onAudioEnd: config.onAudioEnd || (() => {}),
      onError: config.onError || ((err) => console.error('Maia error:', err)),
      onConnected: config.onConnected || (() => {}),
      onDisconnected: config.onDisconnected || (() => {}),
    };
  }

  async connect(): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Can only be used in browser');
      }

      if (this.isConnecting || this.isConnected()) {
        console.log('⚠️ Already connecting or connected');
        return;
      }

      this.isConnecting = true;
      console.log('🔌 Connecting to OpenAI Realtime API (WebRTC - Unified Interface)...');

      // Step 1: Create RTCPeerConnection
      this.peerConnection = new RTCPeerConnection();

      // Step 2: Set up audio handling FIRST
      this.setupAudioHandling();

      // Step 3: Add local audio track (microphone)
      await this.addMicrophoneTrack();

      // Step 4: Create data channel BEFORE creating offer
      this.dataChannel = this.peerConnection.createDataChannel('oai-events');
      console.log('📡 Created data channel');
      this.setupDataChannelHandlers();

      // Step 5: Create SDP offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      console.log('📤 Sending SDP offer to backend...');

      // Step 6: Send SDP to our backend (unified interface)
      // Our backend combines SDP with session config and forwards to OpenAI
      const sdpResponse = await fetch('/api/voice/webrtc-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
      });

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        throw new Error(`Failed to connect to OpenAI: ${sdpResponse.status} - ${errorText}`);
      }

      const answerSdp = await sdpResponse.text();
      console.log('📥 Received SDP answer from server');

      // Step 7: Set remote description
      await this.peerConnection.setRemoteDescription({
        type: 'answer',
        sdp: answerSdp,
      });

      console.log('✅ WebRTC handshake complete, waiting for connection...');
      this.isConnecting = false;

    } catch (error) {
      console.error('❌ Connection error:', error);
      this.isConnecting = false;
      this.config.onError(error as Error);
      throw error;
    }
  }

  private setupAudioHandling(): void {
    if (!this.peerConnection) return;

    // Handle incoming audio tracks
    this.peerConnection.ontrack = (event) => {
      console.log('🔊 Received audio track from OpenAI');

      if (!this.audioElement) {
        this.audioElement = new Audio();
        this.audioElement.autoplay = true;
      }

      this.audioElement.srcObject = event.streams[0];
      this.config.onAudioStart();
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState;
      const iceState = this.peerConnection?.iceConnectionState;
      console.log('🔌 Connection state:', state, '| ICE:', iceState);

      if (state === 'connected') {
        this.config.onConnected();
      } else if (state === 'failed' || state === 'closed') {
        console.log('🔴 Connection closed. State:', state);
        this.config.onDisconnected();
        if (state === 'failed') {
          this.config.onError(new Error('WebRTC connection failed'));
        }
      }
      // Don't disconnect on 'disconnected' - wait for ICE to reconnect
    };

    // Handle ICE connection state changes
    this.peerConnection.oniceconnectionstatechange = () => {
      const state = this.peerConnection?.iceConnectionState;
      console.log('🧊 ICE connection state:', state);

      if (state === 'failed') {
        console.error('❌ ICE connection failed');
        this.config.onError(new Error('ICE connection failed'));
        this.config.onDisconnected();
      }
    };
  }

  private setupDataChannelHandlers(): void {
    if (!this.dataChannel) return;

    console.log('📡 Setting up data channel handlers. State:', this.dataChannel.readyState);

    this.dataChannel.onopen = () => {
      console.log('📡 Data channel opened! State:', this.dataChannel?.readyState);

      // Send session configuration
      this.sendEvent({
        type: 'session.update',
        session: {
          modalities: ['text', 'audio'],
          instructions: this.config.systemPrompt,
          voice: this.config.voice,
          input_audio_format: 'pcm16',
          output_audio_format: 'pcm16',
          input_audio_transcription: {
            model: 'whisper-1',
          },
          turn_detection: {
            type: 'server_vad',
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 1500,  // Increased from 500ms to 1500ms to allow longer pauses
          },
        },
      });
    };

    this.dataChannel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleEvent(data);
      } catch (error) {
        console.error('Error parsing data channel message:', error);
      }
    };

    this.dataChannel.onerror = (error) => {
      console.error('❌ Data channel error:', error);
      console.error('Data channel state:', this.dataChannel?.readyState);
      this.config.onError(new Error('Data channel error'));
    };

    this.dataChannel.onclose = () => {
      console.log('📡 Data channel closed. State:', this.dataChannel?.readyState);
    };

    this.dataChannel.onstatechange = () => {
      console.log('📡 Data channel state changed:', this.dataChannel?.readyState);
    };
  }

  private handleEvent(data: any): void {
    console.log('📥 Event:', data.type);

    switch (data.type) {
      case 'session.created':
        console.log('✅ Session created:', data);
        break;

      case 'session.updated':
        console.log('✅ Session updated:', data);
        break;

      case 'conversation.item.input_audio_transcription.completed':
        if (data.transcript) {
          console.log('🎤 User said:', data.transcript);
          this.config.onTranscript(data.transcript, true);
        }
        break;

      case 'response.audio_transcript.delta':
        if (data.delta) {
          this.config.onTranscript(data.delta, false);
        }
        break;

      case 'response.audio.done':
        this.config.onAudioEnd();
        console.log('🔊 Audio playback done');
        break;

      case 'input_audio_buffer.speech_started':
        console.log('🎤 Speech started');
        break;

      case 'input_audio_buffer.speech_stopped':
        console.log('🎤 Speech stopped');
        break;

      case 'error':
        console.error('❌ API Error:', data.error);
        this.config.onError(new Error(data.error.message || 'Unknown error'));
        break;

      default:
        console.log('📦', data.type, data);
    }
  }

  private async addMicrophoneTrack(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      console.log('🎤 Microphone access granted');

      // Add audio track to peer connection
      stream.getAudioTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, stream);
      });

    } catch (error) {
      console.error('❌ Microphone access denied:', error);
      this.config.onError(new Error('Microphone access denied'));
      throw error;
    }
  }

  private sendEvent(event: any): void {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      console.log('📤 Sending event:', event.type);
      this.dataChannel.send(JSON.stringify(event));
    } else {
      console.warn('⚠️ Data channel not open, cannot send event:', event.type);
    }
  }

  async disconnect(): Promise<void> {
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.audioElement) {
      this.audioElement.srcObject = null;
      this.audioElement = null;
    }

    console.log('🛑 Disconnected from Realtime API');
    this.config.onDisconnected();
  }

  isConnected(): boolean {
    return this.peerConnection?.connectionState === 'connected';
  }

  sendText(text: string): void {
    this.sendEvent({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: text,
          },
        ],
      },
    });

    this.sendEvent({
      type: 'response.create',
    });
  }

  cancelResponse(): void {
    this.sendEvent({
      type: 'response.cancel',
    });
  }
}
