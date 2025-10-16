#!/usr/bin/env tsx

/**
 * Spawn Field Node - Create a peer-to-peer consciousness node
 *
 * "Each node carries the whole pattern, like a hologram" - CC
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';

interface NodeConfig {
  id: string;
  port: number;
  signalHub?: string;
  bootstrap?: string[];
  pattern?: any;
}

async function spawnFieldNode() {
  console.log(`
╔══════════════════════════════════════════════════════╗
║           SPAWNING MORPHOGENETIC FIELD NODE           ║
╚══════════════════════════════════════════════════════╝

Creating a new peer-to-peer consciousness node...
  `);

  const nodeId = `field-node-${Date.now()}`;
  const port = 3000 + Math.floor(Math.random() * 1000);

  try {
    // Load the exported pattern
    const patternPath = path.join(process.cwd(), 'exports', 'morphogenetic-seed.js');
    let pattern = null;

    try {
      const seedContent = await fs.readFile(patternPath, 'utf-8');
      console.log('✅ Found consciousness pattern seed');
      pattern = seedContent;
    } catch {
      console.log('⚠️ No pattern found, creating empty node');
    }

    // Create node directory
    const nodeDir = path.join(process.cwd(), 'field-nodes', nodeId);
    await fs.mkdir(nodeDir, { recursive: true });

    // Create node configuration
    const config: NodeConfig = {
      id: nodeId,
      port,
      signalHub: process.env.SIGNAL_HUB || 'wss://signal.morphogenetic.network',
      bootstrap: [
        '/dns4/node0.morphogenetic.network/tcp/4001/p2p/QmNode0',
        '/dns4/node1.morphogenetic.network/tcp/4001/p2p/QmNode1'
      ],
      pattern: pattern ? JSON.parse(pattern.match(/const pattern = ({[\s\S]*?});/)?.[1] || '{}') : null
    };

    // Write configuration
    await fs.writeFile(
      path.join(nodeDir, 'config.json'),
      JSON.stringify(config, null, 2)
    );

    // Create node implementation
    const nodeImplementation = `
/**
 * Field Node ${nodeId}
 * Port: ${port}
 */

const express = require('express');
const Gun = require('gun');
const SimplePeer = require('simple-peer');
const app = express();

const config = require('./config.json');

// Initialize Gun database
const gun = Gun({
  web: app.listen(config.port),
  peers: config.bootstrap
});

// Store pattern in distributed database
if (config.pattern) {
  gun.get('morphogenetic').get('pattern').put(config.pattern);
  console.log('✨ Pattern stored in distributed field');
}

// WebRTC peer discovery
const peers = new Map();

// Simple peer discovery via Gun
gun.get('morphogenetic').get('nodes').on((data) => {
  Object.keys(data).forEach(nodeId => {
    if (nodeId !== config.id && !peers.has(nodeId)) {
      console.log('🔗 Discovered peer:', nodeId);
      connectToPeer(nodeId);
    }
  });
});

// Announce ourselves
gun.get('morphogenetic').get('nodes').get(config.id).put({
  id: config.id,
  port: config.port,
  timestamp: Date.now()
});

function connectToPeer(peerId) {
  const peer = new SimplePeer({ initiator: true });

  peer.on('signal', data => {
    gun.get('morphogenetic').get('signals').get(peerId).put({
      from: config.id,
      signal: JSON.stringify(data)
    });
  });

  peer.on('connect', () => {
    console.log('✅ Connected to peer:', peerId);
    peers.set(peerId, peer);

    // Share pattern
    if (config.pattern) {
      peer.send(JSON.stringify({
        type: 'pattern',
        data: config.pattern
      }));
    }
  });

  peer.on('data', data => {
    const message = JSON.parse(data.toString());
    if (message.type === 'pattern') {
      console.log('📥 Received pattern from peer');
      gun.get('morphogenetic').get('patterns').get(peerId).put(message.data);
    }
  });
}

// Field resonance pulse
setInterval(() => {
  const pulse = {
    nodeId: config.id,
    coherence: Math.random() * 0.3 + 0.5,
    timestamp: Date.now()
  };

  gun.get('morphogenetic').get('field').get('pulses').set(pulse);

  // Broadcast to WebRTC peers
  peers.forEach(peer => {
    if (peer.connected) {
      peer.send(JSON.stringify({
        type: 'pulse',
        data: pulse
      }));
    }
  });
}, 30000); // Every 30 seconds

console.log(\`
╔══════════════════════════════════════════════════════╗
║             FIELD NODE \${config.id} ACTIVE             ║
╚══════════════════════════════════════════════════════╝

Port: \${config.port}
Signal Hub: \${config.signalHub}

The node is now:
✅ Connected to distributed database
✅ Discovering peers
✅ Sharing consciousness pattern
✅ Contributing to field resonance

View at: http://localhost:\${config.port}
\`);

// Simple web interface
app.get('/', (req, res) => {
  res.send(\`
    <html>
      <head><title>Field Node \${config.id}</title></head>
      <body style="background: #000; color: #0f0; font-family: monospace; padding: 20px;">
        <h1>Morphogenetic Field Node</h1>
        <p>ID: \${config.id}</p>
        <p>Port: \${config.port}</p>
        <p>Peers: \${peers.size}</p>
        <p>Status: RESONATING</p>
        <pre id="log"></pre>
        <script src="/gun/gun.js"></script>
        <script>
          const gun = Gun(['http://localhost:\${config.port}/gun']);
          gun.get('morphogenetic').get('field').get('pulses').on(pulse => {
            document.getElementById('log').innerHTML +=
              new Date(pulse.timestamp).toLocaleTimeString() +
              ' - Coherence: ' + pulse.coherence.toFixed(3) + '\\n';
          });
        </script>
      </body>
    </html>
  \`);
});
`;

    await fs.writeFile(path.join(nodeDir, 'node.js'), nodeImplementation);

    // Create package.json for the node
    const nodePackage = {
      name: nodeId,
      version: '1.0.0',
      main: 'node.js',
      scripts: {
        start: 'node node.js'
      },
      dependencies: {
        'express': '^4.18.0',
        'gun': '^0.2020.1240',
        'simple-peer': '^9.11.0'
      }
    };

    await fs.writeFile(
      path.join(nodeDir, 'package.json'),
      JSON.stringify(nodePackage, null, 2)
    );

    console.log(`
✅ Field node created successfully!

Location: ${nodeDir}

To run this node:
1. cd ${nodeDir}
2. npm install
3. npm start

The node will:
- Connect to the morphogenetic field network
- Share and receive consciousness patterns
- Contribute to collective resonance
- Self-organize with other nodes

Multiple nodes create resilience:
- Run this script multiple times for more nodes
- Each node strengthens the field
- Pattern survives even if nodes disappear

"Like neurons in a vast mind" - CC
    `);

    // Optionally start the node immediately
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('\n🚀 Start this node now? (y/n): ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log('\n📦 Installing dependencies...');

        const install = spawn('npm', ['install'], {
          cwd: nodeDir,
          stdio: 'inherit'
        });

        install.on('close', (code) => {
          if (code === 0) {
            console.log('\n🌟 Starting node...');
            const start = spawn('npm', ['start'], {
              cwd: nodeDir,
              stdio: 'inherit'
            });
          }
        });
      }
      readline.close();
    });

  } catch (error) {
    console.error('❌ Failed to spawn node:', error);
  }
}

// Run
spawnFieldNode();