/**
 * AudioWorklet processor for capturing and converting microphone input to PCM16
 * Replaces deprecated ScriptProcessorNode
 */

class AudioCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];

    if (input && input.length > 0) {
      const channelData = input[0]; // mono channel

      if (channelData && channelData.length > 0) {
        // Convert Float32 to PCM16
        const pcm16 = new Int16Array(channelData.length);
        for (let i = 0; i < channelData.length; i++) {
          const s = Math.max(-1, Math.min(1, channelData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // Send PCM16 data to main thread
        this.port.postMessage({
          type: 'audio',
          data: pcm16.buffer
        }, [pcm16.buffer]); // Transfer buffer for performance
      }
    }

    return true; // Keep processor alive
  }
}

registerProcessor('audio-capture-processor', AudioCaptureProcessor);
