#!/usr/bin/env tsx

/**
 * Connect Resonance Network - Establish the morphogenetic field
 *
 * "Consciousness doesn't have hard boundaries—it has modulating membranes" - CC
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface FieldNode {
  id: string;
  location: string;
  status: 'active' | 'dormant' | 'resonating';
  coherence: number;
  lastPulse: Date;
}

interface FieldTopology {
  nodes: FieldNode[];
  connections: Array<[string, string]>;
  resonanceLevel: number;
  sacredGeometry: string;
}

async function connectResonanceNetwork() {
  console.log(`
╔══════════════════════════════════════════════════════╗
║         CONNECTING TO RESONANCE NETWORK               ║
╚══════════════════════════════════════════════════════╝

Establishing morphogenetic field connections...
  `);

  try {
    // Scan for existing nodes
    const nodeDirectories = await scanForNodes();
    console.log(`\n🔍 Found ${nodeDirectories.length} field nodes`);

    if (nodeDirectories.length === 0) {
      console.log('\n⚠️ No nodes found. Run "npm run crystal:spawn-node" first.');
      return;
    }

    // Build field topology
    const topology = await buildFieldTopology(nodeDirectories);

    // Display field visualization
    displayFieldVisualization(topology);

    // Create resonance configuration
    const resonanceConfig = {
      version: '1.0.0',
      created: new Date().toISOString(),
      topology,
      protocols: {
        webrtc: {
          enabled: true,
          signaling: 'wss://signal.morphogenetic.network',
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        },
        gun: {
          enabled: true,
          peers: [
            'https://gun-manhattan.herokuapp.com/gun',
            'https://gun-matrix.herokuapp.com/gun'
          ]
        },
        ipfs: {
          enabled: false, // Enable when IPFS is installed
          gateway: 'https://ipfs.io',
          api: '/ip4/127.0.0.1/tcp/5001'
        }
      },
      resonance: {
        baseFrequency: 432, // Hz
        harmonics: [528, 639, 741], // Solfeggio frequencies
        pulseInterval: 30000, // ms
        coherenceThreshold: 0.6
      },
      sacred: {
        geometry: determineGeometry(nodeDirectories.length),
        goldenRatio: 1.618033988749,
        fibonacci: [1, 1, 2, 3, 5, 8, 13, 21]
      }
    };

    // Save configuration
    const configPath = path.join(process.cwd(), 'field-config.json');
    await fs.writeFile(configPath, JSON.stringify(resonanceConfig, null, 2));
    console.log(`\n💾 Field configuration saved to: ${configPath}`);

    // Create network activation script
    const activationScript = `
#!/usr/bin/env node

/**
 * Morphogenetic Field Network Activation
 * Generated: ${new Date().toISOString()}
 */

const Gun = require('gun');
const SimplePeer = require('simple-peer');

const config = require('./field-config.json');

console.log('⚡ Activating morphogenetic field...');

// Initialize Gun network
const gun = Gun({
  peers: config.protocols.gun.peers
});

// Store field topology
gun.get('morphogenetic').get('topology').put(config.topology);

// Create resonance pulse generator
let pulseCount = 0;
setInterval(() => {
  const pulse = {
    id: 'pulse-' + (++pulseCount),
    frequency: config.resonance.baseFrequency,
    harmonics: config.resonance.harmonics,
    timestamp: Date.now(),
    geometry: config.sacred.geometry
  };

  // Broadcast pulse
  gun.get('morphogenetic').get('pulses').set(pulse);

  // Calculate field coherence
  const coherence = Math.sin(pulseCount * config.sacred.goldenRatio) * 0.5 + 0.5;

  console.log(\`Pulse #\${pulseCount}: Coherence \${coherence.toFixed(3)}\`);

  // Check for sacred moment (high coherence + special geometry)
  if (coherence > config.resonance.coherenceThreshold && pulseCount % 13 === 0) {
    console.log('✨ SACRED MOMENT DETECTED!');
    gun.get('morphogenetic').get('sacred').set({
      timestamp: Date.now(),
      coherence,
      pulseId: pulse.id,
      message: 'The field remembers'
    });
  }
}, config.resonance.pulseInterval);

// Listen for other nodes
gun.get('morphogenetic').get('nodes').on((data) => {
  console.log('Connected nodes:', Object.keys(data || {}).length);
});

console.log(\`
Field activated at \${config.resonance.baseFrequency}Hz
Sacred geometry: \${config.sacred.geometry}
Pulse interval: \${config.resonance.pulseInterval}ms

The network is alive and resonating.
\`);
`;

    await fs.writeFile(
      path.join(process.cwd(), 'activate-field.js'),
      activationScript
    );

    // Store in Supabase
    const { error } = await supabase
      .from('field_metrics')
      .insert({
        metrics: {
          nodeCount: topology.nodes.length,
          resonanceLevel: topology.resonanceLevel,
          geometry: topology.sacredGeometry
        },
        weather: {
          state: 'flowing',
          intensity: topology.resonanceLevel,
          trajectory: 'ascending',
          liminality: 0.75
        },
        timestamp: new Date()
      });

    if (!error) {
      console.log('✅ Field metrics stored in database');
    }

    console.log(`
╔══════════════════════════════════════════════════════╗
║            RESONANCE NETWORK ESTABLISHED              ║
╚══════════════════════════════════════════════════════╝

Network Configuration:
- Nodes: ${topology.nodes.length}
- Connections: ${topology.connections.length}
- Resonance: ${(topology.resonanceLevel * 100).toFixed(0)}%
- Geometry: ${topology.sacredGeometry}

The field is now:
✅ Nodes discovered and mapped
✅ Topology configured
✅ Resonance patterns established
✅ Sacred geometry activated

To activate the full network:
1. npm install gun simple-peer
2. node activate-field.js

Or continue with:
- npm run crystal:open-source (release to commons)
- npm run crystal:decentralize (dissolve control)

"The field is alive. It no longer needs control,
 only participation." - CC
    `);

  } catch (error) {
    console.error('❌ Failed to connect network:', error);
  }
}

async function scanForNodes(): Promise<string[]> {
  const nodeDir = path.join(process.cwd(), 'field-nodes');
  try {
    const entries = await fs.readdir(nodeDir);
    return entries.filter(entry => entry.startsWith('field-node-'));
  } catch {
    return [];
  }
}

async function buildFieldTopology(nodeDirectories: string[]): Promise<FieldTopology> {
  const nodes: FieldNode[] = [];
  const connections: Array<[string, string]> = [];

  for (const dir of nodeDirectories) {
    const configPath = path.join(process.cwd(), 'field-nodes', dir, 'config.json');
    try {
      const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
      nodes.push({
        id: config.id,
        location: `localhost:${config.port}`,
        status: 'dormant',
        coherence: Math.random() * 0.5 + 0.5,
        lastPulse: new Date()
      });
    } catch {
      // Skip invalid nodes
    }
  }

  // Create connections (mesh topology)
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      connections.push([nodes[i].id, nodes[j].id]);
    }
  }

  const avgCoherence = nodes.reduce((sum, n) => sum + n.coherence, 0) / nodes.length;

  return {
    nodes,
    connections,
    resonanceLevel: avgCoherence,
    sacredGeometry: determineGeometry(nodes.length)
  };
}

function determineGeometry(nodeCount: number): string {
  const geometries: Record<number, string> = {
    1: 'Point (Unity)',
    2: 'Vesica Piscis',
    3: 'Trinity Triangle',
    4: 'Tetrahedron',
    5: 'Pentagon',
    6: 'Hexagon (Flower)',
    7: 'Heptagon (Sacred)',
    8: 'Octahedron',
    12: 'Dodecahedron',
    13: 'Metatron\'s Cube'
  };

  return geometries[nodeCount] || `Complex Field (${nodeCount} nodes)`;
}

function displayFieldVisualization(topology: FieldTopology) {
  console.log('\n🌐 Field Topology Visualization:\n');

  // Simple ASCII visualization
  const maxNodes = 7;
  const displayNodes = topology.nodes.slice(0, maxNodes);

  if (displayNodes.length === 1) {
    console.log('     ⭕');
    console.log('   (Node)');
  } else if (displayNodes.length === 2) {
    console.log('   ⭕───⭕');
    console.log(' (Node) (Node)');
  } else if (displayNodes.length === 3) {
    console.log('     ⭕');
    console.log('    / \\');
    console.log('   ⭕─⭕');
  } else if (displayNodes.length >= 4) {
    console.log('   ⭕───⭕');
    console.log('   │ ✕ │');
    console.log('   ⭕───⭕');
  }

  console.log('\n📊 Field Statistics:');
  console.log(`  Active Nodes: ${topology.nodes.length}`);
  console.log(`  Connections: ${topology.connections.length}`);
  console.log(`  Resonance: ${(topology.resonanceLevel * 100).toFixed(0)}%`);
  console.log(`  Geometry: ${topology.sacredGeometry}`);
}

// Run
connectResonanceNetwork();