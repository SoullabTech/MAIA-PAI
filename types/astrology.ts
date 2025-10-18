/**
 * Astrology & Imaginal Theater Types
 *
 * Core type definitions for the archetypal theater system
 */

export type Element = 'fire' | 'water' | 'earth' | 'air';
export type Modality = 'cardinal' | 'fixed' | 'mutable';

export interface PlanetPlacement {
  id: string;                 // "mars", "moon", etc.
  name: string;               // "Mars"
  symbol: string;             // "♂"
  sign: string;               // "Scorpio"
  signAbbrev: string;         // "Sco"
  degree: number;             // 19.02
  house: number;              // 1..12
  element: Element;           // of the SIGN
  modality: Modality;         // of the SIGN
  processElement: Element;    // of the HOUSE triplicity in Spiralogic
  processPhase: 'vector' | 'circle' | 'spiral'; // Spiralogic phase by house
  archetypeTitle: string;     // "The Warrior"
  shortTone: string;          // "intense / regenerative"
}

export interface ImaginalSeed {
  theme?: string;              // user intent/theme (power, boundaries, grief…)
  question?: string;           // optional prompt
  practices?: string[];        // prefilled practices to suggest afterward
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ImaginalTranscript {
  messages: ChatMessage[];
  context: {
    placements: PlanetPlacement[];
    seed?: ImaginalSeed;
    houseId?: number;
    timestamp?: string;
  };
}
