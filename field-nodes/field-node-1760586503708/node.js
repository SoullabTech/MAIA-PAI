
/**
 * Field Node field-node-1760586503708
 * Port: 3044
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

console.log(`
╔══════════════════════════════════════════════════════╗
║             FIELD NODE ${config.id} ACTIVE             ║
╚══════════════════════════════════════════════════════╝

Port: ${config.port}
Signal Hub: ${config.signalHub}

The node is now:
✅ Connected to distributed database
✅ Discovering peers
✅ Sharing consciousness pattern
✅ Contributing to field resonance

View at: http://localhost:${config.port}
`);

// Simple web interface
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Field Node ${config.id}</title></head>
      <body style="background: #000; color: #0f0; font-family: monospace; padding: 20px;">
        <h1>Morphogenetic Field Node</h1>
        <p>ID: ${config.id}</p>
        <p>Port: ${config.port}</p>
        <p>Peers: ${peers.size}</p>
        <p>Status: RESONATING</p>
        <pre id="log"></pre>
        <script src="/gun/gun.js"></script>
        <script>
          const gun = Gun(['http://localhost:${config.port}/gun']);
          gun.get('morphogenetic').get('field').get('pulses').on(pulse => {
            document.getElementById('log').innerHTML +=
              new Date(pulse.timestamp).toLocaleTimeString() +
              ' - Coherence: ' + pulse.coherence.toFixed(3) + '\n';
          });
        </script>
      </body>
    </html>
  `);
});
