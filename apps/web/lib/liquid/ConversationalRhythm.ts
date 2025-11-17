/**
 * ConversationalRhythm - Tracks and analyzes conversational flow patterns
 * 🌊 LIQUID AI - Conversational rhythm tracking for natural dialogue flow
 */

export interface RhythmMetrics {
  conversationTempo: string; // "slow", "medium", "fast", "dynamic"
  wordsPerMinute: number;
  rhythmCoherence: number; // 0-1, how consistent the rhythm is
  breathAlignment: number; // 0-1, how well pauses align with natural breathing
  silenceComfort: number; // 0-1, comfort level with silence
  averagePauseDuration: number; // milliseconds
  turntakingLatency: number; // milliseconds between user speech end and MAIA response
  totalUtterances: number;
  intensityLevel: number; // 0-1, overall conversation intensity for holoflower
}

interface UtteranceData {
  timestamp: number;
  transcript: string;
  wordCount: number;
  duration: number;
  pauseBefore: number;
}

export class ConversationalRhythm {
  private utterances: UtteranceData[] = [];
  private lastSpeechStart: number | null = null;
  private lastSpeechEnd: number | null = null;
  private lastMAIAResponse: number | null = null;
  private onMetricsUpdate: (metrics: RhythmMetrics) => void;
  private isUserSpeaking = false;

  constructor(onMetricsUpdate: (metrics: RhythmMetrics) => void) {
    this.onMetricsUpdate = onMetricsUpdate;
  }

  /**
   * Called when user starts speaking
   */
  onSpeechStart(): void {
    const now = Date.now();
    this.lastSpeechStart = now;
    this.isUserSpeaking = true;

    console.log('🌊 [RHYTHM] Speech started at', new Date(now).toLocaleTimeString());
  }

  /**
   * Called when user finishes speaking with their transcript
   */
  onSpeechEnd(transcript: string): void {
    const now = Date.now();
    this.lastSpeechEnd = now;
    this.isUserSpeaking = false;

    if (!this.lastSpeechStart) {
      console.warn('🌊 [RHYTHM] Speech end without start detected');
      return;
    }

    const duration = now - this.lastSpeechStart;
    const wordCount = transcript.trim().split(/\s+/).length;

    // Calculate pause before this utterance
    const pauseBefore = this.utterances.length > 0
      ? this.lastSpeechStart - this.utterances[this.utterances.length - 1].timestamp
      : 0;

    const utterance: UtteranceData = {
      timestamp: now,
      transcript,
      wordCount,
      duration,
      pauseBefore: Math.max(0, pauseBefore)
    };

    this.utterances.push(utterance);

    // Keep only last 20 utterances for performance
    if (this.utterances.length > 20) {
      this.utterances = this.utterances.slice(-20);
    }

    console.log('🌊 [RHYTHM] Speech ended, words:', wordCount, 'duration:', duration + 'ms');

    this.updateMetrics();
  }

  /**
   * Called when MAIA starts responding
   */
  onMAIAResponse(): void {
    const now = Date.now();
    this.lastMAIAResponse = now;

    console.log('🌊 [RHYTHM] MAIA response started at', new Date(now).toLocaleTimeString());

    this.updateMetrics();
  }

  /**
   * Calculates and emits updated rhythm metrics
   */
  private updateMetrics(): void {
    const metrics = this.calculateMetrics();
    this.onMetricsUpdate(metrics);
  }

  /**
   * Calculate comprehensive rhythm metrics
   */
  private calculateMetrics(): RhythmMetrics {
    if (this.utterances.length === 0) {
      return this.getDefaultMetrics();
    }

    const recentUtterances = this.utterances.slice(-10); // Focus on recent conversation
    const totalWords = recentUtterances.reduce((sum, u) => sum + u.wordCount, 0);
    const totalDuration = recentUtterances.reduce((sum, u) => sum + u.duration, 0);

    // Words per minute calculation
    const avgDurationMinutes = totalDuration / (1000 * 60);
    const wordsPerMinute = avgDurationMinutes > 0 ? totalWords / avgDurationMinutes : 0;

    // Pause analysis
    const pauses = recentUtterances.map(u => u.pauseBefore).filter(p => p > 0);
    const averagePauseDuration = pauses.length > 0
      ? pauses.reduce((sum, p) => sum + p, 0) / pauses.length
      : 1000;

    // Turn-taking latency
    const turntakingLatency = this.lastMAIAResponse && this.lastSpeechEnd
      ? Math.max(0, this.lastMAIAResponse - this.lastSpeechEnd)
      : 2000;

    // Rhythm coherence (consistency of timing)
    const rhythmCoherence = this.calculateRhythmCoherence(recentUtterances);

    // Breath alignment (how well pauses align with natural breathing)
    const breathAlignment = this.calculateBreathAlignment(pauses);

    // Silence comfort (based on pause durations)
    const silenceComfort = this.calculateSilenceComfort(pauses);

    // Conversation tempo classification
    const conversationTempo = this.classifyTempo(wordsPerMinute, averagePauseDuration);

    // Overall intensity for visualization
    const intensityLevel = this.calculateIntensityLevel(wordsPerMinute, rhythmCoherence, turntakingLatency);

    return {
      conversationTempo,
      wordsPerMinute: Math.round(wordsPerMinute),
      rhythmCoherence,
      breathAlignment,
      silenceComfort,
      averagePauseDuration: Math.round(averagePauseDuration),
      turntakingLatency: Math.round(turntakingLatency),
      totalUtterances: this.utterances.length,
      intensityLevel
    };
  }

  private calculateRhythmCoherence(utterances: UtteranceData[]): number {
    if (utterances.length < 3) return 0.5;

    const intervals = [];
    for (let i = 1; i < utterances.length; i++) {
      const interval = utterances[i].timestamp - utterances[i-1].timestamp;
      intervals.push(interval);
    }

    const avg = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
    const variance = intervals.reduce((sum, i) => sum + Math.pow(i - avg, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    // Lower standard deviation relative to mean = higher coherence
    const coherence = Math.max(0, Math.min(1, 1 - (stdDev / avg)));
    return coherence;
  }

  private calculateBreathAlignment(pauses: number[]): number {
    if (pauses.length === 0) return 0.5;

    // Natural breathing pauses are typically 2-4 seconds
    const naturalBreathRange = [2000, 4000];
    const alignedPauses = pauses.filter(p =>
      p >= naturalBreathRange[0] && p <= naturalBreathRange[1]
    );

    return alignedPauses.length / pauses.length;
  }

  private calculateSilenceComfort(pauses: number[]): number {
    if (pauses.length === 0) return 0.5;

    // Comfort with longer pauses indicates higher silence comfort
    const longPauses = pauses.filter(p => p > 3000);
    const comfortRatio = longPauses.length / pauses.length;

    // Also factor in average pause length
    const avgPause = pauses.reduce((sum, p) => sum + p, 0) / pauses.length;
    const lengthFactor = Math.min(1, avgPause / 5000); // 5s+ indicates high comfort

    return (comfortRatio + lengthFactor) / 2;
  }

  private classifyTempo(wpm: number, avgPause: number): string {
    if (wpm > 180 && avgPause < 1500) return "fast";
    if (wpm > 120 && avgPause < 2500) return "medium";
    if (wpm < 80 && avgPause > 3000) return "slow";
    return "dynamic";
  }

  private calculateIntensityLevel(wpm: number, coherence: number, latency: number): number {
    // Normalize factors
    const wpmFactor = Math.min(1, wpm / 200); // 200 WPM = max intensity
    const coherenceFactor = coherence;
    const latencyFactor = Math.max(0, 1 - (latency / 5000)); // 5s+ = low intensity

    // Weighted combination
    return (wpmFactor * 0.4 + coherenceFactor * 0.3 + latencyFactor * 0.3);
  }

  private getDefaultMetrics(): RhythmMetrics {
    return {
      conversationTempo: "medium",
      wordsPerMinute: 120,
      rhythmCoherence: 0.5,
      breathAlignment: 0.5,
      silenceComfort: 0.5,
      averagePauseDuration: 2000,
      turntakingLatency: 2000,
      totalUtterances: 0,
      intensityLevel: 0.5
    };
  }

  /**
   * Reset all tracking data
   */
  reset(): void {
    this.utterances = [];
    this.lastSpeechStart = null;
    this.lastSpeechEnd = null;
    this.lastMAIAResponse = null;
    this.isUserSpeaking = false;
    console.log('🌊 [RHYTHM] Conversation rhythm tracker reset');
  }

  /**
   * Get current metrics without updating
   */
  getCurrentMetrics(): RhythmMetrics {
    return this.calculateMetrics();
  }
}