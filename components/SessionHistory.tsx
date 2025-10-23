// components/SessionHistory.tsx
// 📜 Session History Browser for Claude Code conversations

"use client";

import React from "react";
import { PersistedClaudeSession } from "@/lib/services/claudeSessionService";
import { motion } from "framer-motion";

interface SessionHistoryProps {
  sessions: PersistedClaudeSession[];
  onSelectSession: (session: PersistedClaudeSession) => void;
  selectedSessionId?: string;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({
  sessions,
  onSelectSession,
  selectedSessionId,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getCoherenceColor = (coherence: number = 0) => {
    if (coherence > 0.8) return "text-green-400";
    if (coherence > 0.5) return "text-blue-400";
    if (coherence > 0.3) return "text-yellow-400";
    return "text-gray-400";
  };

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <span className="text-4xl mb-3">📜</span>
        <p>No saved sessions yet</p>
        <p className="text-sm mt-2">
          Your conversations will be archived here automatically
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
      {sessions.map((session, idx) => (
        <motion.div
          key={session.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          onClick={() => onSelectSession(session)}
          className={`
            p-4 rounded-lg border cursor-pointer transition-all
            ${
              selectedSessionId === session.id
                ? "bg-purple-900/30 border-purple-500/50"
                : "bg-black/20 border-gray-700/50 hover:border-purple-500/30 hover:bg-purple-900/10"
            }
          `}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-200">
                Session {session.session_id.split("-").pop()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(session.created_at)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">
                {session.message_count} messages
              </div>
              {session.avg_coherence !== undefined && (
                <div
                  className={`text-xs font-mono mt-1 ${getCoherenceColor(
                    session.avg_coherence
                  )}`}
                >
                  {Math.round(session.avg_coherence * 100)}% coherence
                </div>
              )}
            </div>
          </div>

          {/* Elemental Balance Mini Preview */}
          {session.elemental_balance && (
            <div className="flex gap-1 mt-2">
              <div
                className="h-1 bg-orange-500 rounded"
                style={{ width: `${session.elemental_balance.fire * 20}%` }}
              />
              <div
                className="h-1 bg-blue-500 rounded"
                style={{ width: `${session.elemental_balance.water * 20}%` }}
              />
              <div
                className="h-1 bg-purple-500 rounded"
                style={{ width: `${session.elemental_balance.air * 20}%` }}
              />
              <div
                className="h-1 bg-green-500 rounded"
                style={{ width: `${session.elemental_balance.earth * 20}%` }}
              />
              <div
                className="h-1 bg-violet-500 rounded"
                style={{ width: `${session.elemental_balance.aether * 20}%` }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
