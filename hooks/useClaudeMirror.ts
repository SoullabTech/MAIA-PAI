// hooks/useClaudeMirror.ts
// 🪞 WebSocket hook for Claude Code Mirror Bridge

import { useEffect, useState } from "react";
import { claudeSessionService } from "@/lib/services/claudeSessionService";
import { saveMirrorInsight } from "@/lib/saveMirrorInsight";

export interface ClaudeMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export interface ClaudeSession {
  messages: ClaudeMessage[];
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface ElementalBalance {
  fire: number;
  water: number;
  air: number;
  earth: number;
  aether: number;
}

export const useClaudeMirror = (userId?: string, autoPersist = false) => {
  const [session, setSession] = useState<ClaudeSession>({ messages: [] });
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coherence, setCoherence] = useState(0);
  const [elementalBalance, setElementalBalance] = useState<ElementalBalance>({
    fire: 0,
    water: 0,
    air: 0,
    earth: 0,
    aether: 0,
  });
  const [lastSavedMessageCount, setLastSavedMessageCount] = useState(0);

  // Compute coherence and elemental balance from messages
  useEffect(() => {
    if (session.messages.length > 0) {
      const balance = computeElementalBalance(session.messages);
      const coherenceScore = computeCoherence(session.messages);

      setElementalBalance(balance);
      setCoherence(coherenceScore);
    }
  }, [session.messages]);

  // Auto-persist to Supabase when session updates
  useEffect(() => {
    if (autoPersist && userId && session.messages.length > 0) {
      const persistSession = async () => {
        await claudeSessionService.saveSession(userId, session);
      };

      // Debounce: save 2 seconds after last update
      const timeout = setTimeout(persistSession, 2000);
      return () => clearTimeout(timeout);
    }
  }, [autoPersist, userId, session]);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        socket = new WebSocket("ws://localhost:5051");

        socket.onopen = () => {
          console.log("🜂 Connected to Claude Mirror Bridge");
          setConnected(true);
          setError(null);
        };

        socket.onmessage = async (event) => {
          try {
            const msg = JSON.parse(event.data);

            if (msg.type === "status") {
              console.log(msg.message);
            } else if (msg.type === "update") {
              const newSession = msg.payload;

              // Archive ONLY new messages to Supabase (not duplicates)
              if (newSession.messages && Array.isArray(newSession.messages)) {
                const currentCount = newSession.messages.length;

                // Only save if we have new messages
                if (currentCount > lastSavedMessageCount) {
                  const newMessages = newSession.messages.slice(lastSavedMessageCount);

                  // Save new messages asynchronously without blocking UI
                  for (const message of newMessages) {
                    const content = typeof message.content === "string"
                      ? message.content
                      : JSON.stringify(message.content);

                    // Fire and forget - don't await to avoid blocking
                    saveMirrorInsight(message.role, content).catch((err) => {
                      console.warn("Mirror insight save failed (non-critical):", err);
                    });
                  }

                  setLastSavedMessageCount(currentCount);
                }
              }

              setSession(newSession);
            }
          } catch (err) {
            console.error("Failed to parse message:", err);
          }
        };

        socket.onerror = (err) => {
          console.error("WebSocket error:", err);
          setError("Connection error - is the mirror bridge running?");
        };

        socket.onclose = () => {
          console.log("🪞 Disconnected from Claude Mirror");
          setConnected(false);

          // Attempt to reconnect after 3 seconds
          reconnectTimeout = setTimeout(() => {
            console.log("🔄 Attempting to reconnect...");
            connect();
          }, 3000);
        };
      } catch (err) {
        setError("Failed to connect to mirror bridge");
        console.error(err);
      }
    };

    connect();

    return () => {
      if (socket) {
        socket.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []);

  return { session, connected, error, coherence, elementalBalance };
};

// === Helper Functions ===

function computeCoherence(messages: ClaudeMessage[]): number {
  if (!messages || messages.length === 0) return 0;

  const lengthScore = Math.min(messages.length / 10, 1);
  const balanceScore = computeBalanceScore(messages);
  const avgLengthScore = computeAvgLengthScore(messages);

  return lengthScore * 0.3 + balanceScore * 0.5 + avgLengthScore * 0.2;
}

function computeBalanceScore(messages: ClaudeMessage[]): number {
  if (messages.length < 2) return 0;

  let alternations = 0;
  for (let i = 1; i < messages.length; i++) {
    if (messages[i].role !== messages[i - 1].role) {
      alternations++;
    }
  }

  return alternations / (messages.length - 1);
}

function computeAvgLengthScore(messages: ClaudeMessage[]): number {
  const avgLength =
    messages.reduce((sum, m) => sum + (m.content?.length || 0), 0) /
    messages.length;

  if (avgLength < 50) return 0.3;
  if (avgLength > 1000) return 0.5;
  return 1.0;
}

function computeElementalBalance(messages: ClaudeMessage[]): ElementalBalance {
  const userMessages = messages.filter((m) => m.role === "user").length;
  const assistantMessages = messages.filter((m) => m.role === "assistant").length;
  const systemMessages = messages.filter((m) => m.role === "system").length;
  const total = messages.length || 1;

  const fire = userMessages / total;
  const water = assistantMessages / total;
  const air = systemMessages / total;
  const earth = 1 - Math.abs(fire - water);
  const aether = computeCoherence(messages);

  return {
    fire: Math.round(fire * 100) / 100,
    water: Math.round(water * 100) / 100,
    air: Math.round(air * 100) / 100,
    earth: Math.round(earth * 100) / 100,
    aether: Math.round(aether * 100) / 100,
  };
}
