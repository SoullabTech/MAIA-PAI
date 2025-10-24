// lib/saveUnifiedAkashic.ts
// 🜃 Unified Akashic Records Integration
// Weaves ALL sources into the searchable wisdom field:
// - MAIA conversations (voice/text)
// - Claude Mirror reflections
// - Astrology insights (birth chart, transits)
// - Divination readings (tarot, I Ching)
// - Offered documents (PDFs, journals, uploads)

import { createClient } from "@/lib/supabase";

/**
 * Detect element from any type of content
 * Enhanced to support astrological and divinatory language
 */
function detectElement(content: string): string {
  const lower = content.toLowerCase();

  // Fire: Transformation, creation, vision, breakthrough, action, WANDS
  if (lower.match(/fire|ignite|create|transform|vision|light|emerge|birth|catalyst|breakthrough|action|passion|urgent|now|wands|aries|leo|sagittarius/)) {
    return "Fire";
  }

  // Water: Emotion, flow, feeling, intuition, depth, CUPS
  if (lower.match(/water|feel|flow|dream|emotion|shadow|dissolve|reflect|intuition|grief|tears|deep|nurture|cups|cancer|scorpio|pisces/)) {
    return "Water";
  }

  // Earth: Grounding, body, practical, structure, PENTACLES
  if (lower.match(/earth|ground|build|body|form|structure|manifest|practical|concrete|stable|foundation|anchor|pentacles|taurus|virgo|capricorn/)) {
    return "Earth";
  }

  // Air: Thought, clarity, communication, perspective, SWORDS
  if (lower.match(/air|speak|mind|clarity|idea|breath|communicate|abstract|pattern|understand|think|perspective|swords|gemini|libra|aquarius/)) {
    return "Air";
  }

  // Aether: Spirit, integration, wholeness, mystery, MAJOR ARCANA
  if (lower.match(/aether|spirit|field|presence|soul|coherence|integrate|unity|wholeness|sacred|mystery|witness|arcana|hermit|magician|priestess/)) {
    return "Aether";
  }

  // Default based on context
  return "Aether"; // Unknown content defaults to Aether
}

/**
 * Detect archetype from content and source type
 * Extended to support divination and astrological archetypes
 */
function detectArchetype(content: string, role: string, source: string): string {
  const lower = content.toLowerCase();

  // MainOracle: System wisdom, oracle guidance, comprehensive responses
  if (
    source === "MAIA" && role === "assistant" ||
    lower.match(/oracle|wisdom|guide|path|destiny|purpose|soul|calling|mission/)
  ) {
    return "MainOracle";
  }

  // InnerGuide: Personal reflection, journaling, emotional processing
  if (
    source === "ClaudeMirror" ||
    lower.match(/feel|emotion|process|reflect|understand|insight|aware|discover|heal|growth|journal/)
  ) {
    return "InnerGuide";
  }

  // Dream: Imagination, vision, symbolic work
  if (lower.match(/dream|vision|imagine|symbol|metaphor|story|creative|possibility|future/)) {
    return "Dream";
  }

  // Mentor: Teaching, explanation, knowledge sharing
  if (lower.match(/teach|learn|explain|how to|understand|practice|principle|method|technique/)) {
    return "Mentor";
  }

  // Relationship: Connection patterns, dialogue
  if (lower.match(/relationship|connect|together|conversation|dialogue|communication|between|bond/)) {
    return "Relationship";
  }

  // Alchemist: Transformation, integration, transmutation
  if (lower.match(/transform|alchemy|transmute|integrate|synthesize|evolve|change|shift|breakthrough/)) {
    return "Alchemist";
  }

  // Shadow: Processing difficult emotions, unconscious patterns
  if (lower.match(/shadow|pain|grief|anger|fear|resist|block|avoid|deny|unconscious|hidden/)) {
    return "Shadow";
  }

  // Default based on role
  return role === "assistant" ? "MainOracle" : "InnerGuide";
}

/**
 * Save astrology insight to Akashic Records
 *
 * @param insightType - "birth-chart" | "transit" | "progression" | "synastry"
 * @param insightData - Astrological data (chart, transits, etc.)
 * @param userId - User ID
 * @param sessionId - Session ID (optional)
 */
export async function saveAstrologyToAkashic(
  insightType: string,
  insightData: any,
  userId?: string,
  sessionId?: string
): Promise<void> {
  try {
    const supabase = createClient();

    // Generate readable content from astrology data
    const content = formatAstrologyInsight(insightType, insightData);
    const element = detectAstrologyElement(insightData);
    const archetype = detectAstrologyArchetype(insightData);

    const { error } = await supabase.from("insight_history").insert({
      user_id: userId || null,
      role: "system", // Astrology is system-generated wisdom
      content,
      element,
      archetype,
      source: "Astrology",
      source_type: insightType, // birth-chart, transit, etc.
      session_id: sessionId || null,
      metadata: {
        insightType,
        astrologyData: insightData,
        timestamp: new Date().toISOString()
      },
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.warn("[saveAstrologyToAkashic] Failed to save:", error.message);
    } else {
      console.debug(`🌟 Astrology Akashic Record saved: ${element} • ${archetype} • ${insightType}`);
    }
  } catch (err) {
    console.debug("[saveAstrologyToAkashic] Archival skipped:", err);
  }
}

/**
 * Save divination reading to Akashic Records
 *
 * @param method - "tarot" | "iching" | "oracle-card" | "runes"
 * @param reading - Divination reading data
 * @param query - User's query/question
 * @param userId - User ID
 * @param sessionId - Session ID (optional)
 */
export async function saveDivinationToAkashic(
  method: string,
  reading: any,
  query: string,
  userId?: string,
  sessionId?: string
): Promise<void> {
  try {
    const supabase = createClient();

    // Generate readable content from divination reading
    const content = formatDivinationReading(method, reading, query);
    const element = detectDivinationElement(method, reading);
    const archetype = detectDivinationArchetype(reading);

    const { error } = await supabase.from("insight_history").insert({
      user_id: userId || null,
      role: "system", // Divination is system-generated guidance
      content,
      element,
      archetype,
      source: "Divination",
      source_type: method, // tarot, iching, etc.
      session_id: sessionId || null,
      metadata: {
        method,
        reading,
        query,
        timestamp: new Date().toISOString()
      },
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.warn("[saveDivinationToAkashic] Failed to save:", error.message);
    } else {
      console.debug(`🔮 Divination Akashic Record saved: ${element} • ${archetype} • ${method}`);
    }
  } catch (err) {
    console.debug("[saveDivinationToAkashic] Archival skipped:", err);
  }
}

/**
 * Save document insight to Akashic Records
 *
 * @param documentType - "pdf" | "journal" | "note" | "image" | "audio"
 * @param documentContent - Extracted/transcribed content
 * @param documentMetadata - File metadata (name, size, etc.)
 * @param userId - User ID
 * @param sessionId - Session ID (optional)
 */
export async function saveDocumentToAkashic(
  documentType: string,
  documentContent: string,
  documentMetadata: any,
  userId?: string,
  sessionId?: string
): Promise<void> {
  try {
    const supabase = createClient();

    const element = detectElement(documentContent);
    const archetype = detectArchetype(documentContent, "user", "Document");

    const { error } = await supabase.from("insight_history").insert({
      user_id: userId || null,
      role: "user", // Documents are user-contributed wisdom
      content: documentContent,
      element,
      archetype,
      source: "Document",
      source_type: documentType, // pdf, journal, etc.
      session_id: sessionId || null,
      metadata: {
        documentType,
        fileName: documentMetadata.fileName,
        fileSize: documentMetadata.fileSize,
        uploadedAt: documentMetadata.uploadedAt,
        timestamp: new Date().toISOString()
      },
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.warn("[saveDocumentToAkashic] Failed to save:", error.message);
    } else {
      console.debug(`📄 Document Akashic Record saved: ${element} • ${archetype} • ${documentType}`);
    }
  } catch (err) {
    console.debug("[saveDocumentToAkashic] Archival skipped:", err);
  }
}

// === HELPER FUNCTIONS ===

/**
 * Format astrology data into readable content for Akashic Records
 */
function formatAstrologyInsight(insightType: string, data: any): string {
  switch (insightType) {
    case "birth-chart":
      return `Birth Chart Insight: Sun in ${data.sun?.sign || "Unknown"}, Moon in ${data.moon?.sign || "Unknown"}, Rising ${data.ascendant?.sign || "Unknown"}. ${data.interpretation || ""}`;

    case "transit":
      return `Transit: ${data.planet} ${data.aspect} ${data.natalPlanet}. ${data.interpretation || ""}`;

    case "progression":
      return `Progression: ${data.description || ""}`;

    default:
      return JSON.stringify(data);
  }
}

/**
 * Detect element from astrology data
 */
function detectAstrologyElement(data: any): string {
  // Check elemental balance if available
  if (data.elementalBalance) {
    const elements = Object.entries(data.elementalBalance) as [string, number][];
    const dominant = elements.sort((a, b) => b[1] - a[1])[0];
    if (dominant && dominant[1] > 0) {
      return dominant[0].charAt(0).toUpperCase() + dominant[0].slice(1);
    }
  }

  // Check sun sign element
  if (data.sun?.element) {
    return data.sun.element.charAt(0).toUpperCase() + data.sun.element.slice(1);
  }

  return "Aether"; // Default for astrology
}

/**
 * Detect archetype from astrology data
 */
function detectAstrologyArchetype(data: any): string {
  // Check for specific planetary emphasis
  if (data.sun?.sign || data.ascendant?.sign) {
    return "MainOracle"; // Birth chart is core identity
  }

  if (data.planet && data.aspect) {
    return "Alchemist"; // Transits are transformation
  }

  return "MainOracle";
}

/**
 * Format divination reading into readable content
 */
function formatDivinationReading(method: string, reading: any, query: string): string {
  switch (method) {
    case "tarot":
      const cards = reading.cards?.map((c: any) => c.name).join(", ") || "";
      return `Tarot Reading for "${query}": ${cards}. ${reading.overallMessage || ""}`;

    case "iching":
      return `I Ching Reading for "${query}": Hexagram ${reading.number} - ${reading.name}. ${reading.interpretation || ""}`;

    default:
      return `${method} Reading for "${query}": ${reading.message || JSON.stringify(reading)}`;
  }
}

/**
 * Detect element from divination reading
 */
function detectDivinationElement(method: string, reading: any): string {
  if (method === "tarot") {
    // Check suit predominance
    const suits = reading.cards?.map((c: any) => c.suit).filter(Boolean) || [];
    const suitCounts: Record<string, number> = {};
    suits.forEach((suit: string) => {
      suitCounts[suit] = (suitCounts[suit] || 0) + 1;
    });

    const dominantSuit = Object.entries(suitCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    switch (dominantSuit) {
      case "wands": return "Fire";
      case "cups": return "Water";
      case "pentacles": return "Earth";
      case "swords": return "Air";
      default: return "Aether"; // Major arcana
    }
  }

  return "Aether"; // Default for divination
}

/**
 * Detect archetype from divination reading
 */
function detectDivinationArchetype(reading: any): string {
  // Check for specific card archetypes
  if (reading.cards) {
    const cardNames = reading.cards.map((c: any) => c.name.toLowerCase()).join(" ");

    if (cardNames.includes("magician") || cardNames.includes("emperor")) {
      return "MainOracle";
    }
    if (cardNames.includes("high priestess") || cardNames.includes("hermit")) {
      return "InnerGuide";
    }
    if (cardNames.includes("fool") || cardNames.includes("star")) {
      return "Dream";
    }
    if (cardNames.includes("hierophant") || cardNames.includes("wheel")) {
      return "Mentor";
    }
    if (cardNames.includes("lovers") || cardNames.includes("two of cups")) {
      return "Relationship";
    }
    if (cardNames.includes("death") || cardNames.includes("tower")) {
      return "Alchemist";
    }
    if (cardNames.includes("devil") || cardNames.includes("moon")) {
      return "Shadow";
    }
  }

  return "MainOracle"; // Default for divination
}
