// bridge/claude-mirror.ts
// 🪞 Claude Mirror Bridge — Streams Claude Code session logs to MAIA Sanctuary UI

import fs from "fs";
import path from "path";
import chokidar from "chokidar";
import WebSocket, { WebSocketServer } from "ws";

const HOME = process.env.HOME || process.env.USERPROFILE!;
const SESSION_FILE = path.join(HOME, ".claude", "session.json");
const PORT = 5051;

const wss = new WebSocketServer({ port: PORT });
console.log(`🪞 Claude Mirror Bridge active → ws://localhost:${PORT}`);
console.log(`📜 Watching: ${SESSION_FILE}`);

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "status", message: "🜂 Connected to Claude Mirror" }));
});

const broadcast = (payload: any) => {
  const data = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(data);
  });
};

if (!fs.existsSync(SESSION_FILE)) {
  console.warn("⚠️ No Claude session file found yet. Open Claude Code to begin logging.");
}

// Watch for changes in Claude's session file
chokidar.watch(SESSION_FILE, { ignoreInitial: true }).on("change", () => {
  try {
    const raw = fs.readFileSync(SESSION_FILE, "utf8");
    const session = JSON.parse(raw);
    broadcast({ type: "update", payload: session });
  } catch (err) {
    console.error("❌ Error reading session file:", err);
  }
});
