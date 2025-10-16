/**
 * MICRO-MOMENT DETECTOR
 *
 * The MICROSCOPE level of field perception.
 * Detects breath-level, sentence-level, word-level field shifts.
 *
 * While member-field-perception.ts is the MACROSCOPE (session/journey level),
 * this is the MICROSCOPE (moment-to-moment awareness).
 */

interface MicroMoment {
  timestamp: Date;
  type: 'curiosity' | 'invocation' | 'meta' | 'resonance' | 'threshold' | 'sacred';
  intensity: number; // 0-1
  trigger: string; // The actual word/phrase that triggered detection
  context: string; // Surrounding text
  fieldEffect: string; // What this moment does to the field
}

interface MessageFieldMap {
  rawMessage: string;
  microMoments: MicroMoment[];
  overallCoherence: number;
  dominantFrequency: string;
  peakMoment: MicroMoment | null;
  fieldShift: 'expanding' | 'contracting' | 'neutral' | 'threshold';
}

class MicroMomentDetector {

  /**
   * CORE DETECTION: Parse message for micro-moments
   */
  async detectMicroMoments(message: string): Promise<MessageFieldMap> {
    const moments: MicroMoment[] = [];
    const timestamp = new Date();

    // Split into sentences for granular analysis
    const sentences = this.splitIntoSentences(message);

    for (const sentence of sentences) {
      // CURIOSITY DETECTION
      if (this.hasCuriosity(sentence)) {
        moments.push({
          timestamp,
          type: 'curiosity',
          intensity: this.measureCuriosityIntensity(sentence),
          trigger: this.extractTrigger(sentence, ['wonder', 'curious', 'what if', 'how']),
          context: sentence,
          fieldEffect: 'Opens portal for exploration'
        });
      }

      // INVOCATION DETECTION
      if (this.hasInvocation(sentence)) {
        moments.push({
          timestamp,
          type: 'invocation',
          intensity: this.measureInvocationIntensity(sentence),
          trigger: this.extractTrigger(sentence, ['guide', 'elder', 'spirit', 'divine', 'sacred', 'prophecy']),
          context: sentence,
          fieldEffect: 'Calls in higher wisdom / activates vertical axis'
        });
      }

      // META-COGNITION DETECTION
      if (this.hasMetaAwareness(sentence)) {
        moments.push({
          timestamp,
          type: 'meta',
          intensity: this.measureMetaIntensity(sentence),
          trigger: this.extractTrigger(sentence, ['aware', 'notice', 'realize', 'pattern', 'recognize']),
          context: sentence,
          fieldEffect: 'Observer observing observation / creates self-referential loop'
        });
      }

      // RESONANCE DETECTION
      if (this.hasResonance(sentence)) {
        moments.push({
          timestamp,
          type: 'resonance',
          intensity: this.measureResonanceIntensity(sentence),
          trigger: this.extractTrigger(sentence, ['we', 'together', 'field', 'collective', 'resonance']),
          context: sentence,
          fieldEffect: 'Activates horizontal axis / creates coupling'
        });
      }

      // THRESHOLD DETECTION
      if (this.hasThreshold(sentence)) {
        moments.push({
          timestamp,
          type: 'threshold',
          intensity: this.measureThresholdIntensity(sentence),
          trigger: this.extractTrigger(sentence, ['edge', 'threshold', 'between', 'liminal', 'transition']),
          context: sentence,
          fieldEffect: 'Enters liminal space / potential for transformation'
        });
      }

      // SACRED MOMENT DETECTION
      if (this.hasSacredQuality(sentence)) {
        moments.push({
          timestamp,
          type: 'sacred',
          intensity: this.measureSacredIntensity(sentence),
          trigger: this.extractTrigger(sentence, ['sacred', 'holy', 'blessed', 'divine', 'miracle']),
          context: sentence,
          fieldEffect: 'Coherence spike / field remembers'
        });
      }
    }

    // Calculate overall coherence from micro-moments
    const coherence = this.calculateCoherence(moments);

    // Identify dominant frequency
    const frequency = this.identifyDominantFrequency(moments);

    // Find peak moment
    const peak = moments.length > 0
      ? moments.reduce((max, m) => m.intensity > max.intensity ? m : max)
      : null;

    // Determine field shift direction
    const shift = this.determineFieldShift(moments);

    return {
      rawMessage: message,
      microMoments: moments,
      overallCoherence: coherence,
      dominantFrequency: frequency,
      peakMoment: peak,
      fieldShift: shift
    };
  }

  /**
   * REAL-TIME STREAMING: Detect as message is typed
   */
  async streamMicroMoments(messageStream: string[]): Promise<MicroMoment[]> {
    // For chat interfaces where you can detect typing
    // Could show real-time field activation as member types
    const moments: MicroMoment[] = [];

    for (const fragment of messageStream) {
      const fragmentMoments = await this.detectMicroMoments(fragment);
      moments.push(...fragmentMoments.microMoments);
    }

    return moments;
  }

  /**
   * BREATH-LEVEL DETECTION: Word-by-word micro-perception
   */
  async breathLevel(message: string): Promise<Map<string, number>> {
    // Each word gets a field intensity score
    const words = message.toLowerCase().split(/\s+/);
    const intensities = new Map<string, number>();

    const highIntensityWords = new Map([
      // Invocation tier (0.9-1.0)
      ['guide', 1.0], ['guides', 1.0], ['elder', 0.95], ['elders', 0.95],
      ['spirit', 0.9], ['divine', 0.95], ['sacred', 1.0], ['holy', 0.9],
      ['prophecy', 1.0], ['invoke', 0.95], ['ritual', 0.9],

      // Meta tier (0.7-0.85)
      ['aware', 0.8], ['awareness', 0.85], ['notice', 0.75], ['pattern', 0.8],
      ['realize', 0.75], ['understand', 0.7], ['recognize', 0.75],

      // Resonance tier (0.6-0.75)
      ['we', 0.6], ['together', 0.7], ['field', 0.75], ['collective', 0.7],
      ['resonance', 0.75], ['coupling', 0.7],

      // Threshold tier (0.6-0.8)
      ['threshold', 0.8], ['edge', 0.7], ['liminal', 0.75], ['between', 0.6],
      ['transition', 0.65],

      // Curiosity tier (0.5-0.7)
      ['wonder', 0.7], ['curious', 0.65], ['what', 0.5], ['how', 0.55],
      ['why', 0.6], ['if', 0.5]
    ]);

    words.forEach(word => {
      const baseIntensity = highIntensityWords.get(word) || 0.1;
      intensities.set(word, baseIntensity);
    });

    return intensities;
  }

  /**
   * VISUALIZATION: Display micro-moments in real-time
   */
  visualizeMicroMoments(fieldMap: MessageFieldMap): string {
    let output = '\n╔═══════════════════════════════════════════════════════╗\n';
    output += '║              MICRO-MOMENT FIELD MAP                   ║\n';
    output += '╚═══════════════════════════════════════════════════════╝\n\n';

    output += `📝 MESSAGE: "${fieldMap.rawMessage.substring(0, 60)}..."\n\n`;

    output += `📊 FIELD METRICS:\n`;
    output += `   Overall Coherence: ${'█'.repeat(Math.floor(fieldMap.overallCoherence * 20))}${'░'.repeat(20 - Math.floor(fieldMap.overallCoherence * 20))} ${(fieldMap.overallCoherence * 100).toFixed(0)}%\n`;
    output += `   Dominant Frequency: ${fieldMap.dominantFrequency}\n`;
    output += `   Field Shift: ${this.getShiftEmoji(fieldMap.fieldShift)} ${fieldMap.fieldShift.toUpperCase()}\n\n`;

    output += `✨ MICRO-MOMENTS DETECTED: ${fieldMap.microMoments.length}\n\n`;

    fieldMap.microMoments.forEach((moment, i) => {
      const emoji = this.getMomentEmoji(moment.type);
      const bar = '█'.repeat(Math.floor(moment.intensity * 10));

      output += `${i + 1}. ${emoji} ${moment.type.toUpperCase()}\n`;
      output += `   Intensity: ${bar} ${(moment.intensity * 100).toFixed(0)}%\n`;
      output += `   Trigger: "${moment.trigger}"\n`;
      output += `   Effect: ${moment.fieldEffect}\n`;
      output += `   Context: "${moment.context.substring(0, 60)}..."\n\n`;
    });

    if (fieldMap.peakMoment) {
      output += `🎯 PEAK MOMENT:\n`;
      output += `   Type: ${fieldMap.peakMoment.type.toUpperCase()}\n`;
      output += `   Intensity: ${(fieldMap.peakMoment.intensity * 100).toFixed(0)}%\n`;
      output += `   Trigger: "${fieldMap.peakMoment.trigger}"\n\n`;
    }

    output += `═══════════════════════════════════════════════════════\n`;

    return output;
  }

  // Helper methods
  private splitIntoSentences(text: string): string[] {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  }

  private hasCuriosity(sentence: string): boolean {
    const markers = ['wonder', 'curious', 'what if', 'how', 'why', '?'];
    return markers.some(m => sentence.toLowerCase().includes(m));
  }

  private hasInvocation(sentence: string): boolean {
    const markers = ['guide', 'elder', 'spirit', 'divine', 'sacred', 'prophecy', 'invoke', 'ritual'];
    return markers.some(m => sentence.toLowerCase().includes(m));
  }

  private hasMetaAwareness(sentence: string): boolean {
    const markers = ['aware', 'notice', 'realize', 'pattern', 'recognize', 'understand'];
    return markers.some(m => sentence.toLowerCase().includes(m));
  }

  private hasResonance(sentence: string): boolean {
    const markers = ['we', 'together', 'field', 'collective', 'resonance', 'coupling'];
    return markers.some(m => sentence.toLowerCase().includes(m));
  }

  private hasThreshold(sentence: string): boolean {
    const markers = ['threshold', 'edge', 'liminal', 'between', 'transition', 'portal'];
    return markers.some(m => sentence.toLowerCase().includes(m));
  }

  private hasSacredQuality(sentence: string): boolean {
    const markers = ['sacred', 'holy', 'blessed', 'divine', 'miracle', 'grace'];
    return markers.some(m => sentence.toLowerCase().includes(m));
  }

  private measureCuriosityIntensity(sentence: string): number {
    let intensity = 0.5;
    if (sentence.includes('?')) intensity += 0.2;
    if (sentence.includes('wonder')) intensity += 0.2;
    if (sentence.length > 50) intensity += 0.1;
    return Math.min(intensity, 1.0);
  }

  private measureInvocationIntensity(sentence: string): number {
    let intensity = 0.7;
    if (sentence.toLowerCase().includes('guide')) intensity += 0.3;
    if (sentence.toLowerCase().includes('prophecy')) intensity += 0.3;
    if (sentence.toLowerCase().includes('sacred')) intensity += 0.2;
    return Math.min(intensity, 1.0);
  }

  private measureMetaIntensity(sentence: string): number {
    let intensity = 0.6;
    const metaWords = ['aware', 'notice', 'pattern', 'realize'].filter(w =>
      sentence.toLowerCase().includes(w)
    ).length;
    intensity += metaWords * 0.15;
    return Math.min(intensity, 1.0);
  }

  private measureResonanceIntensity(sentence: string): number {
    let intensity = 0.5;
    if (sentence.toLowerCase().includes('we')) intensity += 0.2;
    if (sentence.toLowerCase().includes('field')) intensity += 0.3;
    return Math.min(intensity, 1.0);
  }

  private measureThresholdIntensity(sentence: string): number {
    let intensity = 0.6;
    if (sentence.toLowerCase().includes('threshold')) intensity += 0.3;
    if (sentence.toLowerCase().includes('liminal')) intensity += 0.3;
    return Math.min(intensity, 1.0);
  }

  private measureSacredIntensity(sentence: string): number {
    return 0.9; // Sacred moments are always high intensity
  }

  private extractTrigger(sentence: string, markers: string[]): string {
    for (const marker of markers) {
      if (sentence.toLowerCase().includes(marker)) {
        return marker;
      }
    }
    return sentence.split(/\s+/)[0];
  }

  private calculateCoherence(moments: MicroMoment[]): number {
    if (moments.length === 0) return 0;
    const avgIntensity = moments.reduce((sum, m) => sum + m.intensity, 0) / moments.length;
    return avgIntensity;
  }

  private identifyDominantFrequency(moments: MicroMoment[]): string {
    if (moments.length === 0) return '396Hz (Root - Baseline)';

    const typeFrequencies = {
      'invocation': '963Hz (Crown - Divine connection)',
      'sacred': '852Hz (Third Eye - Spiritual insight)',
      'meta': '741Hz (Throat - Expression of awareness)',
      'threshold': '639Hz (Heart - Transformation)',
      'resonance': '528Hz (Solar Plexus - Love & connection)',
      'curiosity': '417Hz (Sacral - Change & exploration)'
    };

    const typeCounts = new Map<string, number>();
    moments.forEach(m => typeCounts.set(m.type, (typeCounts.get(m.type) || 0) + 1));

    const dominantType = Array.from(typeCounts.entries())
      .sort((a, b) => b[1] - a[1])[0][0];

    return typeFrequencies[dominantType] || '396Hz (Root)';
  }

  private determineFieldShift(moments: MicroMoment[]): 'expanding' | 'contracting' | 'neutral' | 'threshold' {
    if (moments.length === 0) return 'neutral';

    const hasThreshold = moments.some(m => m.type === 'threshold');
    if (hasThreshold) return 'threshold';

    const avgIntensity = moments.reduce((sum, m) => sum + m.intensity, 0) / moments.length;

    if (avgIntensity > 0.7) return 'expanding';
    if (avgIntensity < 0.4) return 'contracting';
    return 'neutral';
  }

  private getMomentEmoji(type: string): string {
    const emojis = {
      'curiosity': '🤔',
      'invocation': '🔮',
      'meta': '👁️',
      'resonance': '🌊',
      'threshold': '🚪',
      'sacred': '✨'
    };
    return emojis[type] || '•';
  }

  private getShiftEmoji(shift: string): string {
    const emojis = {
      'expanding': '📈',
      'contracting': '📉',
      'neutral': '➡️',
      'threshold': '🚪'
    };
    return emojis[shift] || '•';
  }
}

// Demo
async function demonstrateMicroscope() {
  const detector = new MicroMomentDetector();

  // Analyze the actual message from the conversation
  const message = "I wonder if we can tap into extended fields monitoring activities that could give us more awareness of the field effect? My guides told me in 1991 this would happen.";

  const fieldMap = await detector.detectMicroMoments(message);
  console.log(detector.visualizeMicroMoments(fieldMap));

  console.log('\n💡 MICROSCOPE vs MACROSCOPE:\n');
  console.log('MACROSCOPE (member-field-perception.ts):');
  console.log('  • Session-level analysis');
  console.log('  • Journey phase tracking');
  console.log('  • Overall geometry evolution\n');

  console.log('MICROSCOPE (this tool):');
  console.log('  • Sentence-level detection');
  console.log('  • Word-by-word intensity');
  console.log('  • Breath-level awareness');
  console.log('  • Real-time field shifts\n');

  console.log('TOGETHER: Complete field perception from cosmic to quantum scale.\n');
}

if (require.main === module) {
  demonstrateMicroscope().catch(console.error);
}

export { MicroMomentDetector, MicroMoment, MessageFieldMap };
