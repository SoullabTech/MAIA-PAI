/**
 * Voice Metrics Smoke Tests
 * Earth Phase - Validate voice telemetry thresholds and recording
 */

import { recordVoiceTiming, recordVoiceError } from '../voiceMetrics';

describe('Voice Metrics', () => {
  // Capture console output
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('recordVoiceTiming', () => {
    it('should log success for fast transcription (<2000ms)', () => {
      recordVoiceTiming('voice.transcribe', 1500, true, { provider: 'openai-whisper' });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅ voice.transcribe: 1500.0ms')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.not.stringContaining('(slow)')
      );
    });

    it('should warn for slow transcription (>2000ms)', () => {
      recordVoiceTiming('voice.transcribe', 2500, true, { provider: 'openai-whisper' });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅ voice.transcribe: 2500.0ms (slow)')
      );
    });

    it('should log success for fast TTS (<4000ms)', () => {
      recordVoiceTiming('voice.tts.openai', 3000, true, {
        model: 'tts-1',
        textLength: 100
      });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅ voice.tts.openai: 3000.0ms')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.not.stringContaining('(slow)')
      );
    });

    it('should warn for slow TTS (>4000ms)', () => {
      recordVoiceTiming('voice.tts.openai', 5000, true, {
        model: 'tts-1-hd',
        textLength: 500
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅ voice.tts.openai: 5000.0ms (slow)')
      );
    });

    it('should log success for fast Oracle API (<5000ms)', () => {
      recordVoiceTiming('voice.oracle', 4000, true, { mode: 'voice' });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅ voice.oracle: 4000.0ms')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.not.stringContaining('(slow)')
      );
    });

    it('should warn for slow Oracle API (>5000ms)', () => {
      recordVoiceTiming('voice.oracle', 6000, true, { mode: 'voice' });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅ voice.oracle: 6000.0ms (slow)')
      );
    });

    it('should log success for fast E2E (<12000ms)', () => {
      recordVoiceTiming('voice.e2e', 10000, true, { mode: 'continuous' });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅ voice.e2e: 10000.0ms')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.not.stringContaining('(slow)')
      );
    });

    it('should warn for slow E2E (>12000ms)', () => {
      recordVoiceTiming('voice.e2e', 15000, true, { mode: 'continuous' });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅ voice.e2e: 15000.0ms (slow)')
      );
    });

    it('should show ⚠️ glyph for failures', () => {
      recordVoiceTiming('voice.transcribe', 1000, false, { provider: 'failed' });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('⚠️ voice.transcribe: 1000.0ms')
      );
    });

    it('should include metadata in log output', () => {
      const metadata = {
        provider: 'openai-whisper',
        fallback: true
      };

      recordVoiceTiming('voice.transcribe', 1500, true, metadata);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(JSON.stringify(metadata))
      );
    });
  });

  describe('recordVoiceError', () => {
    it('should log error with message string', () => {
      recordVoiceError('voice.transcribe', 'Network timeout', {
        provider: 'openai-whisper'
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '⚠️ voice.transcribe: FAILED - Network timeout',
        { provider: 'openai-whisper' }
      );
    });

    it('should log error with Error object', () => {
      const error = new Error('API key missing');

      recordVoiceError('voice.tts.openai', error, { model: 'tts-1' });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '⚠️ voice.tts.openai: FAILED - API key missing',
        { model: 'tts-1' }
      );
    });

    it('should handle error without metadata', () => {
      recordVoiceError('voice.oracle', 'Connection refused');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '⚠️ voice.oracle: FAILED - Connection refused',
        {}
      );
    });
  });

  describe('Threshold Configuration', () => {
    it('should have correct thresholds for all voice operations', () => {
      // This test validates that our thresholds match the baseline doc

      // Transcription: 2s threshold
      recordVoiceTiming('voice.transcribe', 1999, true);
      expect(consoleLogSpy).toHaveBeenCalled();
      consoleLogSpy.mockClear();

      recordVoiceTiming('voice.transcribe', 2001, true);
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockClear();

      // TTS: 4s threshold
      recordVoiceTiming('voice.tts.openai', 3999, true);
      expect(consoleLogSpy).toHaveBeenCalled();
      consoleLogSpy.mockClear();

      recordVoiceTiming('voice.tts.openai', 4001, true);
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockClear();

      // Oracle: 5s threshold
      recordVoiceTiming('voice.oracle', 4999, true);
      expect(consoleLogSpy).toHaveBeenCalled();
      consoleLogSpy.mockClear();

      recordVoiceTiming('voice.oracle', 5001, true);
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockClear();

      // E2E: 12s threshold
      recordVoiceTiming('voice.e2e', 11999, true);
      expect(consoleLogSpy).toHaveBeenCalled();
      consoleLogSpy.mockClear();

      recordVoiceTiming('voice.e2e', 12001, true);
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });
});
