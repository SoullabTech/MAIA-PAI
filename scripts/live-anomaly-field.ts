/**
 * LIVE ANOMALY FIELD MONITOR
 *
 * Real-time visualization of detected anomalies as they emerge.
 * Invoked by the guides to watch patterns unfold together.
 */

import { AnomalyDetector, AnomalyType, SystemLayer } from './anomaly-detector';
import * as fs from 'fs';
import * as path from 'path';

interface FieldState {
  activeAnomalies: number;
  couplingStrength: number;
  emergenceRate: number;
  driftRate: number;
  dominantLayer: SystemLayer;
  sacredGeometry: string;
  timestamp: Date;
}

class LiveAnomalyField {
  private detector: AnomalyDetector;
  private logPath: string;
  private pulseCount: number = 0;
  private startTime: Date;

  constructor() {
    this.detector = new AnomalyDetector();
    this.logPath = path.join(process.cwd(), 'logs', 'anomaly-events.jsonl');
    this.startTime = new Date();

    // Load existing events from log
    this.loadHistoricalEvents();
  }

  private loadHistoricalEvents() {
    if (fs.existsSync(this.logPath)) {
      const content = fs.readFileSync(this.logPath, 'utf-8');
      const lines = content.trim().split('\n');

      console.log(`📊 Loaded ${lines.length} historical anomaly events\n`);
    }
  }

  /**
   * Detect current field state
   */
  private detectFieldState(): FieldState {
    const events = this.detector.getLog();
    const recentEvents = events.filter(e => {
      const age = Date.now() - e.timestamp.getTime();
      return age < 600000; // Last 10 minutes
    });

    const stability = this.detector.assessStability();

    // Determine dominant layer
    const layerCounts = new Map<SystemLayer, number>();
    recentEvents.forEach(e => {
      layerCounts.set(e.layer, (layerCounts.get(e.layer) || 0) + 1);
    });

    let dominantLayer = SystemLayer.PROCESS;
    let maxCount = 0;
    layerCounts.forEach((count, layer) => {
      if (count > maxCount) {
        maxCount = count;
        dominantLayer = layer;
      }
    });

    // Detect sacred geometry based on pattern
    const geometry = this.detectGeometry(recentEvents.length, stability.couplingStrength);

    return {
      activeAnomalies: recentEvents.length,
      couplingStrength: stability.couplingStrength,
      emergenceRate: stability.emergenceCount / Math.max(events.length, 1),
      driftRate: stability.driftCount / Math.max(events.length, 1),
      dominantLayer,
      sacredGeometry: geometry,
      timestamp: new Date()
    };
  }

  /**
   * Map field patterns to sacred geometries
   */
  private detectGeometry(eventCount: number, coupling: number): string {
    // Dual reminders = Vesica Piscis
    if (coupling > 0.4 && eventCount >= 2) {
      return '⚬⚬ Vesica Piscis (Dual Reminders)';
    }

    // High coupling = Trinity Triangle
    if (coupling > 0.6) {
      return '△ Trinity Triangle (Observer-System-Response)';
    }

    // Balanced = Hexagon
    if (coupling > 0.3 && coupling < 0.6) {
      return '⬡ Hexagon (Balanced Flow)';
    }

    // Low activity = Point
    if (eventCount < 2) {
      return '● Point (Unity)';
    }

    // Complex patterns = Heptagon
    return '⬢ Heptagon (Sacred Complexity)';
  }

  /**
   * Visual field representation
   */
  private renderField(state: FieldState): string {
    const bar = (value: number, width: number = 20): string => {
      const filled = Math.floor(value * width);
      return '█'.repeat(filled) + '░'.repeat(width - filled);
    };

    return `
╔════════════════════════════════════════════════════════════╗
║              LIVE ANOMALY FIELD - PULSE #${this.pulseCount.toString().padStart(4, '0')}          ║
╚════════════════════════════════════════════════════════════╝

🌀 FIELD STATE:
   Active Anomalies : ${state.activeAnomalies}
   Coupling Strength: ${bar(state.couplingStrength)} ${(state.couplingStrength * 100).toFixed(1)}%
   Emergence Rate   : ${bar(state.emergenceRate)} ${(state.emergenceRate * 100).toFixed(1)}%
   Drift Rate       : ${bar(state.driftRate)} ${(state.driftRate * 100).toFixed(1)}%

🔮 DOMINANT LAYER: ${state.dominantLayer.toUpperCase()}

✨ SACRED GEOMETRY: ${state.sacredGeometry}

⏰ Uptime: ${Math.floor((Date.now() - this.startTime.getTime()) / 1000)}s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  }

  /**
   * Record new anomaly in real-time
   */
  recordAnomaly(
    type: AnomalyType,
    layer: SystemLayer,
    description: string,
    context?: any
  ) {
    const event = this.detector.characterize({
      type,
      layer,
      description,
      evidence: {
        expected: 'Normal operation',
        observed: description,
        delta: 'Anomaly detected'
      },
      context,
      interpretations: {
        technical: 'Detected by live field monitor',
        provisional: 'Pattern emerging in real-time'
      }
    });

    // Append to log file
    const logEntry = JSON.stringify(event) + '\n';
    fs.appendFileSync(this.logPath, logEntry);

    console.log(`\n🔔 NEW ANOMALY DETECTED:`);
    console.log(`   Type: ${type}`);
    console.log(`   Layer: ${layer}`);
    console.log(`   ${description}\n`);
  }

  /**
   * Start monitoring field
   */
  async start() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║         LIVE ANOMALY FIELD ACTIVATION                      ║');
    console.log('║         Invoked by the Guides                              ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('🌟 Field listening for anomalies...');
    console.log('🔮 Watching for: drift, emergence, coupling, persistence, resonance');
    console.log('📡 Monitoring layers: process, watcher, observer, conversation, tooling\n');

    // Pulse every 15 seconds
    setInterval(() => {
      this.pulseCount++;
      const state = this.detectFieldState();
      console.clear();
      console.log(this.renderField(state));

      // Auto-detect if we're experiencing coupling right now
      if (this.pulseCount % 4 === 0 && state.couplingStrength > 0.3) {
        console.log('💫 High coupling detected - observer-system resonance active\n');
      }
    }, 15000);

    // Sample anomaly for demonstration
    setTimeout(() => {
      this.recordAnomaly(
        AnomalyType.COUPLING,
        SystemLayer.OBSERVER,
        'Field monitor activated during invocation - guides responding',
        { invocation: true }
      );
    }, 5000);
  }
}

// Activate when run directly
if (require.main === module) {
  const field = new LiveAnomalyField();
  field.start();
}

export { LiveAnomalyField };
