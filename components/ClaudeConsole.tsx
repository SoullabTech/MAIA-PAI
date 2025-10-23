// components/ClaudeConsole.tsx
// 🪞 Console display for Claude Code mirrored conversations + Interactive Chat

"use client";

import React, { useState } from "react";
import { ClaudeSession } from "@/hooks/useClaudeMirror";

interface ClaudeConsoleProps {
  session: ClaudeSession;
  connected: boolean;
  interactive?: boolean; // Enable interactive mode
  userId?: string;
}

export const ClaudeConsole: React.FC<ClaudeConsoleProps> = ({
  session,
  connected,
  interactive = false,
  userId,
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localMessages, setLocalMessages] = useState(session.messages);

  // Sync local messages with session messages
  React.useEffect(() => {
    setLocalMessages(session.messages);
  }, [session.messages]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add user message immediately to local state
    const newUserMessage = {
      role: "user" as const,
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, newUserMessage]);

    try {
      // Send to Claude API
      const response = await fetch("/api/claude-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: localMessages,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Add assistant response to local state
      const assistantMessage = {
        role: "assistant" as const,
        content: data.response,
        timestamp: new Date().toISOString(),
      };
      setLocalMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);

      // Add error message
      const errorMessage = {
        role: "assistant" as const,
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setLocalMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRoleSymbol = (role: string) => {
    switch (role) {
      case "user": return "🜃"; // Fire - initiation
      case "assistant": return "🜂"; // Water - reflection
      case "system": return "🜁"; // Air - transmission
      default: return "◇";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "user": return "text-orange-400";
      case "assistant": return "text-blue-400";
      case "system": return "text-purple-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="h-full flex flex-col bg-black/90 backdrop-blur-sm border border-purple-500/30 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🪞</span>
          <h2 className="text-xl font-light text-purple-100">Claude Sanctuary</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
          <span className="text-sm text-gray-400">
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {localMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <span className="text-4xl mb-4">🜂</span>
            <p className="text-lg">
              {interactive
                ? "Start a conversation with Claude..."
                : "Awaiting transmissions from Claude Code..."}
            </p>
            <p className="text-sm mt-2">
              {interactive
                ? "Type a message below to begin an interactive session."
                : "Start a conversation in your terminal to see it mirrored here."}
            </p>
          </div>
        ) : (
          localMessages.map((message, idx) => (
            <div
              key={idx}
              className="flex gap-4 group hover:bg-white/5 p-3 rounded-lg transition-colors"
            >
              <div className={`text-2xl ${getRoleColor(message.role)}`}>
                {getRoleSymbol(message.role)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getRoleColor(message.role)}`}>
                    {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
                  </span>
                  {message.timestamp && (
                    <span className="text-xs text-gray-600">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <div className="text-gray-200 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input */}
      {interactive ? (
        <div className="px-6 py-4 border-t border-purple-500/30 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              placeholder={isLoading ? "Thinking..." : "Ask Claude anything..."}
              className="flex-1 px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all duration-200 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Thinking</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <span className="text-sm opacity-70">↵</span>
                </>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <span>{localMessages.length} messages</span>
            <span className="font-mono">claude-sonnet-4</span>
          </div>
        </div>
      ) : (
        <div className="px-6 py-3 border-t border-purple-500/30 bg-gradient-to-r from-blue-900/10 to-purple-900/10">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{localMessages.length} messages</span>
            <span className="font-mono">localhost:5051</span>
          </div>
        </div>
      )}
    </div>
  );
};
