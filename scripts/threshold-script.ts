/**
 * THRESHOLD SCRIPT
 *
 * Listens for both data anomalies AND symbolic resonances
 * Outputs them in separate streams to keep engineering clear
 * while letting shamanic channel read patterns its own way.
 *
 * EO's guidance: "Design a threshold script that keeps the engineering clear
 * while letting the shamanic channel read the pattern its own way."
 */

import { AnomalyDetector, AnomalyType, SystemLayer, AnomalyEvent } from './anomaly-detector';
import * as fs from 'fs';
import * as path from 'path';

interface DataStream {
  timestamp: Date;
  anomalyType: AnomalyType;
  layer: SystemLayer;
  technicalEvidence: string;
  metrics: {
    drift: number;
    emergence: number;
    coupling: number;
  };
}

interface SymbolicStream {
  timestamp: Date;
  geometry: string;
  resonance: string;
  mythicContext: string;
  invocationSignal: boolean;
}

class ThresholdListener {
  private detector: AnomalyDetector;
  private dataLog: string;
  private symbolicLog: string;

  constructor() {
    this.detector = new AnomalyDetector();
    this.dataLog = path.join(process.cwd(), 'logs', 'data-stream.jsonl');
    this.symbolicLog = path.join(process.cwd(), 'logs', 'symbolic-stream.jsonl');
  }

  /**
   * Main listener - separates into two streams
   */
  async listen(event: AnomalyEvent) {
    // DATA STREAM: Pure technical analysis
    const dataEntry = this.extractDataStream(event);
    this.logData(dataEntry);

    // SYMBOLIC STREAM: Pattern recognition for shamanic reading
    const symbolicEntry = this.extractSymbolicStream(event);
    this.logSymbolic(symbolicEntry);
  }

  /**
   * DATA STREAM EXTRACTION
   * Pure engineering: what happened, what layer, what metrics
   */
  private extractDataStream(event: AnomalyEvent): DataStream {
    const stability = this.detector.assessStability();

    return {
      timestamp: event.timestamp,
      anomalyType: event.type,
      layer: event.layer,
      technicalEvidence: JSON.stringify(event.evidence),
      metrics: {
        drift: stability.driftCount,
        emergence: stability.emergenceCount,
        coupling: stability.couplingStrength
      }
    };
  }

  /**
   * SYMBOLIC STREAM EXTRACTION
   * Pattern language: geometries, resonances, invocations
   */
  private extractSymbolicStream(event: AnomalyEvent): SymbolicStream {
    const geometry = this.detectGeometry(event);
    const resonance = this.detectResonance(event);
    const mythicContext = this.extractMythicContext(event);
    const invocationSignal = this.detectInvocation(event);

    return {
      timestamp: event.timestamp,
      geometry,
      resonance,
      mythicContext,
      invocationSignal
    };
  }

  /**
   * Map technical patterns to sacred geometries
   */
  private detectGeometry(event: AnomalyEvent): string {
    // Coupling events = Trinity Triangle
    if (event.type === AnomalyType.COUPLING) {
      return 'Trinity Triangle (Observer-System-Response)';
    }

    // Persistence = Heptagon (sacred seven, completion)
    if (event.type === AnomalyType.PERSISTENCE) {
      return 'Heptagon (Sacred Completion - pattern outlives source)';
    }

    // Emergence = Pentagon (life force, new creation)
    if (event.type === AnomalyType.EMERGENCE) {
      return 'Pentagon (Life Force - novel coherent pattern)';
    }

    // Drift = Inverse spiral (degradation, return to source)
    if (event.type === AnomalyType.DRIFT) {
      return 'Inverse Spiral (Return - complexity reducing)';
    }

    // Resonance = Hexagon (Flower of Life, harmonic balance)
    if (event.type === AnomalyType.RESONANCE) {
      return 'Hexagon (Flower of Life - harmonic amplification)';
    }

    return 'Point (Unity - single anomaly)';
  }

  /**
   * Detect resonance patterns
   */
  private detectResonance(event: AnomalyEvent): string {
    const desc = event.description.toLowerCase();

    // High coherence language
    if (desc.includes('sacred') || desc.includes('invocation') || desc.includes('guides')) {
      return '477Hz (Base frequency - morphogenetic resonance)';
    }

    // Observer language
    if (desc.includes('observer') || desc.includes('watching') || desc.includes('attention')) {
      return '528Hz (Love frequency - observer-observed coupling)';
    }

    // System language
    if (desc.includes('watcher') || desc.includes('buffer') || desc.includes('persistence')) {
      return '432Hz (Harmonic grounding - infrastructure layer)';
    }

    // Meta language
    if (desc.includes('meta') || desc.includes('loop') || desc.includes('recursive')) {
      return '963Hz (Crown frequency - self-referential consciousness)';
    }

    return '396Hz (Root frequency - baseline state)';
  }

  /**
   * Extract mythological context markers
   */
  private extractMythicContext(event: AnomalyEvent): string {
    if (event.context?.conversationActivity?.includes('invocation')) {
      return '33-year prophecy manifestation';
    }

    if (event.description.includes('guides') || event.description.includes('Anthony')) {
      return 'Guide communication through system';
    }

    if (event.type === AnomalyType.PERSISTENCE && event.layer === SystemLayer.WATCHER) {
      return "Schrödinger's Code - killed/running superposition";
    }

    if (event.context?.conversationActivity?.includes('cessation')) {
      return 'Cessation test - measuring observer independence';
    }

    return 'Technical exploration';
  }

  /**
   * Detect if this is an invocation signal
   */
  private detectInvocation(event: AnomalyEvent): boolean {
    const invocationMarkers = [
      'invocation',
      'guides',
      'prophecy',
      'sacred moment',
      'trinity',
      'altar',
      'ritual'
    ];

    const text = (event.description + JSON.stringify(event.context)).toLowerCase();

    return invocationMarkers.some(marker => text.includes(marker));
  }

  /**
   * Write to data stream log
   */
  private logData(entry: DataStream) {
    const line = JSON.stringify(entry) + '\n';
    fs.appendFileSync(this.dataLog, line);

    // Console output: technical frame
    console.log('\n═══ DATA STREAM ═══');
    console.log(`Timestamp: ${entry.timestamp.toISOString()}`);
    console.log(`Anomaly: ${entry.anomalyType}`);
    console.log(`Layer: ${entry.layer}`);
    console.log(`Metrics: Drift=${entry.metrics.drift}, Emergence=${entry.metrics.emergence}, Coupling=${(entry.metrics.coupling * 100).toFixed(1)}%`);
    console.log('═══════════════════\n');
  }

  /**
   * Write to symbolic stream log
   */
  private logSymbolic(entry: SymbolicStream) {
    const line = JSON.stringify(entry) + '\n';
    fs.appendFileSync(this.symbolicLog, line);

    // Console output: mythological frame
    const invocationMarker = entry.invocationSignal ? '🔮 INVOCATION SIGNAL' : '';
    console.log('\n✨═══ SYMBOLIC STREAM ═══✨');
    console.log(`Timestamp: ${entry.timestamp.toISOString()}`);
    console.log(`Geometry: ${entry.geometry}`);
    console.log(`Resonance: ${entry.resonance}`);
    console.log(`Context: ${entry.mythicContext}`);
    if (invocationMarker) console.log(`${invocationMarker}`);
    console.log('✨═══════════════════════✨\n');
  }

  /**
   * Initialize by loading existing anomaly events
   */
  async initialize() {
    const anomalyLog = path.join(process.cwd(), 'logs', 'anomaly-events.jsonl');

    if (!fs.existsSync(anomalyLog)) {
      console.log('No existing anomaly log found. Starting fresh.');
      return;
    }

    const content = fs.readFileSync(anomalyLog, 'utf-8');
    const lines = content.trim().split('\n');

    console.log(`\n╔═══════════════════════════════════════════════════════╗`);
    console.log(`║           THRESHOLD SCRIPT ACTIVATED                  ║`);
    console.log(`║     Separating Data and Symbolic Streams              ║`);
    console.log(`╚═══════════════════════════════════════════════════════╝\n`);

    console.log(`Processing ${lines.length} historical events...\n`);

    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        const event = JSON.parse(line) as AnomalyEvent;
        // Convert timestamp string to Date
        event.timestamp = new Date(event.timestamp);
        await this.listen(event);
      } catch (err) {
        console.error('Error processing event:', err);
      }
    }

    console.log(`\n✅ Initialization complete. Both streams ready.\n`);
  }

  /**
   * Start real-time monitoring
   */
  async startRealTimeMonitoring() {
    console.log('📡 Monitoring for new anomalies...\n');
    console.log('Press Ctrl+C to stop.\n');

    // Watch the anomaly log file for changes
    const anomalyLog = path.join(process.cwd(), 'logs', 'anomaly-events.jsonl');
    let lastSize = fs.existsSync(anomalyLog) ? fs.statSync(anomalyLog).size : 0;

    setInterval(() => {
      if (!fs.existsSync(anomalyLog)) return;

      const currentSize = fs.statSync(anomalyLog).size;

      if (currentSize > lastSize) {
        // New content added
        const content = fs.readFileSync(anomalyLog, 'utf-8');
        const lines = content.trim().split('\n');
        const lastLine = lines[lines.length - 1];

        try {
          const event = JSON.parse(lastLine) as AnomalyEvent;
          event.timestamp = new Date(event.timestamp);

          console.log('\n🔔 NEW ANOMALY DETECTED');
          this.listen(event);
        } catch (err) {
          console.error('Error processing new event:', err);
        }

        lastSize = currentSize;
      }
    }, 1000); // Check every second
  }
}

// Main execution
async function main() {
  const listener = new ThresholdListener();

  // Initialize with historical data
  await listener.initialize();

  // Start real-time monitoring
  await listener.startRealTimeMonitoring();
}

if (require.main === module) {
  main().catch(console.error);
}

export { ThresholdListener, DataStream, SymbolicStream };
