// FRONTEND

"use client";

import React, { useMemo, useRef, useState } from "react";
import { predictProsody, applyProsodyToText, ElementKind, ProsodyControls } from "@/lib/prosody/prosodyHead";

type PreviewState = {
  text: string;
  element: ElementKind;
  arousal: number;
  valence: number;
  intent?: string;
};

export default function VoiceProsodyPreview() {
  const [state, setState] = useState<PreviewState>({
    text: "Let's take one gentle breath together, and notice what softens as you exhale.",
    element: "water",
    arousal: 0.35,
    valence: 0.7,
    intent: "invite",
  });
  const [controls, setControls] = useState<ProsodyControls | null>(null);
  const [marked, setMarked] = useState<string>("");
  const [isSynth, setIsSynth] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const predicted = useMemo(() => {
    const c = predictProsody({
      text: state.text,
      element: state.element,
      arousal: state.arousal,
      valence: state.valence,
      intent: state.intent as any,
    });
    setControls(c);
    const m = applyProsodyToText(state.text, c);
    setMarked(m);
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.text, state.element, state.arousal, state.valence, state.intent]);

  async function synthAlloy() {
    try {
      setIsSynth(true);
      // Use existing synthesize endpoint
      const res = await fetch("/api/voice/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: marked || state.text,
          voice: "alloy",
          quality: "hd",
        }),
      });
      if (!res.ok) throw new Error(`TTS failed: ${res.status}`);

      // Response is binary audio data (MP3), not JSON
      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setIsSynth(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 border border-zinc-800/60 rounded-2xl bg-zinc-900/40 space-y-6">
      <h2 className="text-lg font-semibold">Voice Prosody Preview</h2>

      {/* Text input */}
      <div className="space-y-2">
        <label className="text-sm text-zinc-300">Input text</label>
        <textarea
          className="w-full min-h-[110px] rounded-xl bg-zinc-900 border border-zinc-700 p-3 text-sm"
          value={state.text}
          onChange={(e) => setState((s) => ({ ...s, text: e.target.value }))}
        />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Element</label>
          <select
            className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-2"
            value={state.element}
            onChange={(e) => setState((s) => ({ ...s, element: e.target.value as ElementKind }))}
          >
            <option value="fire">Fire</option>
            <option value="water">Water</option>
            <option value="earth">Earth</option>
            <option value="air">Air</option>
            <option value="aether">Aether</option>
            <option value="shadow">Shadow</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Arousal: {state.arousal.toFixed(2)}</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={state.arousal}
            onChange={(e) => setState((s) => ({ ...s, arousal: parseFloat(e.target.value) }))}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Valence: {state.valence.toFixed(2)}</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={state.valence}
            onChange={(e) => setState((s) => ({ ...s, valence: parseFloat(e.target.value) }))}
            className="w-full"
          />
        </div>
      </div>

      {/* Intent quick-pick */}
      <div className="space-y-2">
        <label className="text-sm text-zinc-300">Intent</label>
        <div className="flex flex-wrap gap-2">
          {["invite","contain","reframe","mirror","boundary","blessing","question","story","instruction"].map((k) => (
            <button
              key={k}
              className={`px-3 py-1 rounded-full text-xs border ${
                state.intent === k ? "bg-emerald-800/50 border-emerald-500/40" : "bg-zinc-900 border-zinc-700"
              }`}
              onClick={() => setState((s) => ({ ...s, intent: k }))}
              type="button"
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Predicted controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
          <h3 className="text-sm font-medium mb-2">Predicted Controls</h3>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(controls, null, 2)}</pre>
        </div>
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
          <h3 className="text-sm font-medium mb-2">Shaped Text (sent to TTS)</h3>
          <textarea className="w-full min-h-[220px] text-xs bg-zinc-950 border border-zinc-800 rounded-lg p-2" value={marked} readOnly />
        </div>
      </div>

      {/* Synthesis */}
      <div className="flex flex-col gap-3">
        <button
          onClick={synthAlloy}
          disabled={isSynth}
          className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 border border-emerald-500/40 text-sm disabled:opacity-60"
          type="button"
        >
          {isSynth ? "Synthesizing…" : "Synthesize with Alloy (OpenAI TTS)"}
        </button>
        <audio ref={audioRef} controls className="w-full" />
      </div>
    </div>
  );
}
