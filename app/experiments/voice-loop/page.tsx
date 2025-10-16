"use client";

import React, { useEffect, useRef, useState } from "react";
import { create } from "zustand";
import mitt from "mitt";

// ---------- Event Bus ----------
type VoiceEvent =
  | { type: "transcript_word"; word: string }
  | { type: "transcript_complete"; text: string; timestamp: number }
  | { type: "response_ready"; text: string; timestamp: number }
  | { type: "mode_switch"; mode: "scribe" | "active" | "full" }
  | { type: "timing"; stage: string; timestamp: number };

const bus = mitt<VoiceEvent>();

// ---------- Timing Tracker ----------
interface TimingMetric {
  stage: string;
  timestamp: number;
  delta?: number;
}

// ---------- Global Voice Store ----------
interface VoiceState {
  mode: "scribe" | "active" | "full";
  transcript: string;
  responses: string[];
  timings: TimingMetric[];
  setMode: (m: VoiceState["mode"]) => void;
  addTranscript: (t: string) => void;
  addResponse: (r: string) => void;
  addTiming: (stage: string, timestamp: number) => void;
  clearTimings: () => void;
}

const useVoiceStore = create<VoiceState>((set) => ({
  mode: "scribe",
  transcript: "",
  responses: [],
  timings: [],
  setMode: (mode) => {
    set({ mode });
    console.log(`[MODE] Switched to: ${mode}`);
  },
  addTranscript: (t) => set((s) => ({ transcript: s.transcript + " " + t })),
  addResponse: (r) => set((s) => ({ responses: [...s.responses, r] })),
  addTiming: (stage, timestamp) =>
    set((s) => {
      const newTiming: TimingMetric = { stage, timestamp };
      const prevTiming = s.timings[s.timings.length - 1];
      if (prevTiming) {
        newTiming.delta = timestamp - prevTiming.timestamp;
      }
      console.log(`[TIMING] ${stage}: ${timestamp}ms (Δ ${newTiming.delta || 0}ms)`);
      return { timings: [...s.timings, newTiming] };
    }),
  clearTimings: () => set({ timings: [] }),
}));

// ---------- Output Layer ----------
const speak = (text: string) => {
  const synth = window.speechSynthesis;
  if (synth.speaking) {
    console.log("[OUTPUT] Interrupting previous speech");
    synth.cancel();
  }

  const startTime = Date.now();
  useVoiceStore.getState().addTiming("TTS_START", startTime);

  const utter = new SpeechSynthesisUtterance(text);

  utter.onstart = () => {
    const playTime = Date.now();
    useVoiceStore.getState().addTiming("AUDIO_PLAYBACK_START", playTime);
  };

  utter.onend = () => {
    const endTime = Date.now();
    useVoiceStore.getState().addTiming("AUDIO_PLAYBACK_END", endTime);
  };

  synth.speak(utter);
};

// ---------- Processing Layer ----------
bus.on("transcript_complete", ({ text, timestamp }) => {
  const processingStart = Date.now();
  useVoiceStore.getState().addTiming("PROCESSING_START", processingStart);

  const { mode } = useVoiceStore.getState();
  let reply = "";

  if (mode === "scribe") {
    reply = ""; // no output
  } else if (mode === "active") {
    reply = "I'm listening.";
  } else if (mode === "full") {
    const words = text.trim().split(/\s+/).length;
    reply = `You said ${words} words: "${text.trim()}"`;
  }

  const processingEnd = Date.now();
  useVoiceStore.getState().addTiming("PROCESSING_END", processingEnd);

  if (reply) {
    bus.emit("response_ready", { text: reply, timestamp: processingEnd });
  }
});

bus.on("response_ready", ({ text, timestamp }) => {
  useVoiceStore.getState().addResponse(text);
  speak(text);
});

// ---------- Component ----------
export default function VoiceLoopDemo() {
  const { mode, transcript, responses, timings, setMode, addTranscript, addTiming, clearTimings } = useVoiceStore();
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("[INIT] webkitSpeechRecognition not available");
      return;
    }

    const rec: SpeechRecognition = new (window as any).webkitSpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => {
      console.log("[INPUT] Recognition started");
      addTiming("MIC_START", Date.now());
    };

    rec.onresult = (event) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const res = event.results[i];
        if (res.isFinal) {
          finalText += res[0].transcript;
        }
      }

      if (finalText) {
        const transcriptTime = Date.now();
        addTiming("TRANSCRIPT_COMPLETE", transcriptTime);
        addTranscript(finalText);
        bus.emit("transcript_complete", { text: finalText, timestamp: transcriptTime });
      }
    };

    rec.onerror = (event) => {
      console.error("[INPUT] Recognition error:", event.error);
    };

    recognitionRef.current = rec;
    console.log("[INIT] Speech recognition initialized");
  }, [addTranscript, addTiming]);

  const start = () => {
    if (recognitionRef.current && !listening) {
      clearTimings();
      recognitionRef.current.start();
      setListening(true);
      console.log("[CONTROL] Started listening");
    }
  };

  const stop = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
      console.log("[CONTROL] Stopped listening");
    }
  };

  // Calculate total round-trip time
  const roundTripTime = timings.length > 0
    ? timings[timings.length - 1].timestamp - timings[0].timestamp
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            🎧 MAIA Voice Loop - Concurrency Prototype
          </h1>
          <p className="text-slate-600">
            Proving parallel architecture: mic + processing + output running simultaneously
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="font-semibold text-lg mb-4 text-slate-800">Controls</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={start}
              disabled={listening}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
            >
              {listening ? "Listening..." : "Start"}
            </button>
            <button
              onClick={stop}
              disabled={!listening}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
            >
              Stop
            </button>
            <div className="border-l border-slate-300 mx-2"></div>
            {(["scribe", "active", "full"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === m
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Info */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="font-semibold text-lg mb-3 text-slate-800">
            Current Mode: <span className="text-blue-600">{mode}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-50 p-3 rounded">
              <span className="font-semibold text-slate-700">Scribe:</span>
              <p className="text-slate-600">Transcription only, no responses</p>
            </div>
            <div className="bg-slate-50 p-3 rounded">
              <span className="font-semibold text-slate-700">Active:</span>
              <p className="text-slate-600">Lightweight acknowledgments</p>
            </div>
            <div className="bg-slate-50 p-3 rounded">
              <span className="font-semibold text-slate-700">Full:</span>
              <p className="text-slate-600">Complete responses with context</p>
            </div>
          </div>
        </div>

        {/* Performance Panel */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-sm border border-purple-200 p-6">
          <h2 className="font-semibold text-lg mb-4 text-purple-900 flex items-center gap-2">
            <span>📊</span> Performance Metrics
          </h2>

          {timings.length > 0 ? (
            <>
              <div className="mb-4 p-4 bg-white rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">
                  {roundTripTime}ms
                </div>
                <div className="text-sm text-slate-600">Total Round-Trip Time</div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {timings.map((timing, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 bg-white rounded border border-slate-200"
                  >
                    <span className="font-mono text-sm text-slate-700">{timing.stage}</span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-slate-500">{timing.timestamp}ms</span>
                      {timing.delta !== undefined && (
                        <span className={`font-semibold ${
                          timing.delta < 100 ? "text-green-600" :
                          timing.delta < 500 ? "text-yellow-600" :
                          "text-red-600"
                        }`}>
                          Δ {timing.delta}ms
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-slate-500 py-8">
              Start speaking to see latency metrics
            </div>
          )}
        </div>

        {/* Transcript */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="font-semibold text-lg mb-3 text-slate-800">Transcript</h2>
          <div className="bg-slate-50 p-4 rounded min-h-[80px]">
            <p className="text-slate-700">{transcript || "No transcript yet..."}</p>
          </div>
        </div>

        {/* Responses */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="font-semibold text-lg mb-3 text-slate-800">MAIA Responses</h2>
          <div className="space-y-2">
            {responses.length > 0 ? (
              responses.map((r, i) => (
                <div key={i} className="bg-blue-50 border border-blue-200 p-3 rounded">
                  <p className="text-slate-700">{r}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 py-4">
                No responses yet...
              </div>
            )}
          </div>
        </div>

        {/* Architecture Info */}
        <div className="bg-slate-800 text-white rounded-lg shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-3">Architecture Verification</h2>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Input Layer: Continuous speech recognition (Web Speech API)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Event Bus: Mitt-based message passing (non-blocking)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>State: Zustand store (no React hooks violations)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Processing: Mode-dependent response generation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Output Layer: Interruptible speech synthesis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Mode switch listener ----------
bus.on("mode_switch", ({ mode }) => {
  useVoiceStore.getState().setMode(mode);
});
