// BACKEND

/**
 * Lightweight, zero-deps "prosody head" that predicts pause lengths,
 * speaking rate, emphasis words, breath slots, and basic pitch shape
 * from (text, element, arousal, valence, intent).
 *
 * Drop-in usage:
 *   import { predictProsody, applyProsodyToText } from "@/lib/prosody/prosodyHead";
 *   const controls = predictProsody({ text, element: "water", arousal: 0.35, valence: 0.7, intent: "invite" });
 *   const shaped = applyProsodyToText(text, controls);
 *   // send `shaped` to OpenAI TTS (Alloy) today, or map `controls` to your XTTS later.
 */

export type ElementKind = "fire" | "water" | "earth" | "air" | "aether" | "shadow";

export type IntentKind =
  | "invite"
  | "contain"
  | "reframe"
  | "mirror"
  | "boundary"
  | "blessing"
  | "question"
  | "story"
  | "instruction";

export interface ProsodyInput {
  text: string;
  element: ElementKind;
  arousal: number; // 0..1
  valence: number; // 0..1
  intent?: IntentKind;
  wpmBase?: number; // optional override baseline words-per-minute
}

export interface ProsodyControls {
  wpm: number;
  pauseMs: {
    comma: number;
    dash: number;
    period: number;
    paragraph: number;
    breath: number;
  };
  f0: {
    baselineHz: number;
    slope: number; // negative = falling; positive = rising
    rangeSemitones: number;
    finalRise: boolean;
  };
  emphasisWordIdx: number[]; // indices into tokenized words
  breathAfterWordIdx: number[]; // place breath after these indices
  energyProfile: "even" | "taper" | "crescendo";
}

/** ---------- helpers ---------- */

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function tokenizeWords(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

// crude syllable estimate—good enough for spacing & breath cadence
function estimateSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 1;
  const vowels = w.match(/[aeiouy]+/g)?.length ?? 1;
  // common silent endings
  const silent = /e$/.test(w) ? -0.5 : 0;
  return Math.max(1, Math.round(vowels + silent));
}

function totalSyllables(words: string[]) {
  return words.reduce((acc, w) => acc + estimateSyllables(w), 0);
}

function pickEmphasisIndices(words: string[], count: number): number[] {
  // Choose "content-y" longer words; avoid stopwords
  const stop = new Set([
    "the","a","an","and","or","but","so","of","to","in","on","for","with","is","are",
    "be","am","I","you","we","they","it","that","this","these","those","as","at","by"
  ]);
  const scored = words.map((w, i) => {
    const base = w.replace(/[^\w]/g, "");
    const len = base.length;
    const score =
      (stop.has(base.toLowerCase()) ? 0 : 1) * (len >= 7 ? 2 : len >= 5 ? 1.2 : 0.8);
    return { i, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const unique = new Set<number>();
  for (const s of scored) {
    unique.add(s.i);
    if (unique.size >= count) break;
  }
  return Array.from(unique).sort((a, b) => a - b);
}

/** ---------- main predictor ---------- */

export function predictProsody(input: ProsodyInput): ProsodyControls {
  const { text } = input;
  const element = input.element;
  const arousal = clamp(input.arousal, 0, 1);
  const valence = clamp(input.valence, 0, 1);
  const intent: IntentKind = input.intent ?? inferIntent(text);

  const words = tokenizeWords(text);
  const sylls = totalSyllables(words);

  // Baseline WPM by element (lower = slower)
  const baseMap: Record<ElementKind, number> = {
    fire: 170,
    air: 160,
    aether: 140,
    water: 135,
    earth: 130,
    shadow: 125,
  };
  let wpm = input.wpmBase ?? baseMap[element];

  // Modulate by arousal (+/- ~15%)
  wpm = Math.round(wpm * (0.85 + arousal * 0.3)); // 0.85..1.15 range

  // Intent adjustments
  if (intent === "blessing" || intent === "contain") wpm = Math.round(wpm * 0.92);
  if (intent === "instruction" || intent === "reframe") wpm = Math.round(wpm * 1.02);

  // Pause map (ms)
  const basePause = {
    comma: 140,
    dash: 220,
    period: 380,
    paragraph: 600,
    breath: 420,
  };

  // Element shaping
  const elementPauseScale: Record<ElementKind, number> = {
    fire: 0.9,
    air: 1.0,
    aether: 1.15,
    water: 1.2,
    earth: 1.05,
    shadow: 1.1,
  };

  const pauseScale =
    elementPauseScale[element] *
    (intent === "question" ? 0.95 : 1.0) *
    (intent === "instruction" ? 0.95 : 1.0) *
    (valence < 0.35 ? 1.1 : 1.0); // heavier when low mood

  const pauseMs = {
    comma: Math.round(basePause.comma * pauseScale),
    dash: Math.round(basePause.dash * pauseScale),
    period: Math.round(basePause.period * pauseScale),
    paragraph: Math.round(basePause.paragraph * pauseScale),
    breath: Math.round(basePause.breath * pauseScale),
  };

  // F0 curve
  const baselineHz =
    170 + // neutral
    (element === "aether" || element === "air" ? +10 : 0) +
    (element === "earth" ? -10 : 0) +
    (valence - 0.5) * 20; // happier → slightly higher

  const rangeSemitones =
    3.2 +
    (arousal * 2.0) + // higher arousal → wider expressive range
    (element === "water" ? -0.6 : 0) +
    (element === "fire" ? +0.6 : 0);
  const slope =
    (intent === "instruction" || element === "earth" ? -0.5 : 0) +
    (intent === "question" || element === "air" ? +0.4 : 0);

  const finalRise =
    intent === "question" ||
    /[?!]\s*$/.test(text) ||
    (element === "air" && arousal >= 0.4);

  // Emphasis & breaths
  const emphasisCount = clamp(Math.round(words.length / 12), 1, 3);
  const emphasisWordIdx = pickEmphasisIndices(words, emphasisCount);

  // Breath rhythm: every ~12 syllables when low arousal; ~18 when high
  const breathEvery = Math.round(clamp(18 - arousal * 6, 10, 18));
  const breathAfterWordIdx: number[] = [];
  let syllSum = 0;
  for (let i = 0; i < words.length; i++) {
    syllSum += estimateSyllables(words[i]);
    if (syllSum >= breathEvery) {
      breathAfterWordIdx.push(i);
      syllSum = 0;
    }
  }

  // Energy envelope
  const energyProfile: ProsodyControls["energyProfile"] =
    element === "earth" || intent === "contain"
      ? "even"
      : element === "water" || intent === "blessing"
      ? "taper"
      : "crescendo";

  return {
    wpm: clamp(wpm, 105, 200),
    pauseMs,
    f0: {
      baselineHz: clamp(Math.round(baselineHz), 120, 240),
      slope: clamp(slope, -1.0, 1.0),
      rangeSemitones: clamp(Number(rangeSemitones.toFixed(1)), 2.0, 6.0),
      finalRise,
    },
    emphasisWordIdx,
    breathAfterWordIdx,
    energyProfile,
  };
}

/**
 * Apply simple, TTS-friendly markup to text based on predicted controls.
 * The goal is to help non-SSML engines like OpenAI TTS feel human
 * (commas/em-dashes/ellipses + lightweight emphasis markers).
 */
export function applyProsodyToText(text: string, controls: ProsodyControls): string {
  const words = tokenizeWords(text);
  const emph = new Set(controls.emphasisWordIdx);
  const breath = new Set(controls.breathAfterWordIdx);

  const shaped: string[] = [];
  for (let i = 0; i < words.length; i++) {
    const raw = words[i];
    const base = raw.replace(/([,.:;!?])$/, ""); // strip trailing punct for wrapping
    const punct = raw.slice(base.length);

    const wrapped = emph.has(i) ? `*${base}*` : base;
    shaped.push(wrapped);

    // insert breath marks (only where there isn't strong punctuation already)
    if (breath.has(i) && !/[,.;:!?]$/.test(punct)) {
      shaped.push("..."); // Just ellipsis for natural pause, no spoken "(breath)"
    }

    // re-attach original punctuation, but prefer em-dash for semantic breaks
    if (punct) {
      const out =
        punct === ","
          ? ","
          : punct === ";"
          ? " — "
          : punct; // let sentence-final marks stand
      shaped.push(out);
    }
  }

  // Hints for cadence at paragraph boundaries
  const final = shaped.join(" ");
  const tidy = final
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+—\s+/g, " — ")
    .replace(/\s+\.\.\./g, "...")
    .replace(/\s+…/g, " …");

  // Encourage a question rise if needed
  if (controls.f0.finalRise && !/[!?]\s*$/.test(tidy)) {
    return `${tidy} ?`;
  }
  return tidy;
}

/** Naive intent inference from punctuation & keywords */
function inferIntent(text: string): IntentKind {
  const t = text.toLowerCase();
  if (/\?$/.test(t) || /how|what|could|would|might/.test(t)) return "question";
  if (/let(?:'|')s|try|step|first|next/.test(t)) return "instruction";
  if (/i bless|may you|may we|may it/.test(t)) return "blessing";
  if (/i hear|it sounds|reflect|mirror/.test(t)) return "mirror";
  if (/boundary|limit|time|pause|stop|hold/.test(t)) return "boundary";
  if (/story|once|remember/.test(t)) return "story";
  if (/consider|perhaps|what if|another way/.test(t)) return "reframe";
  if (/welcome|with you|together|safe/.test(t)) return "invite";
  return "invite";
}
