// frontend

/**
 * Clean a message before sending it to TTS.
 * Keep this gentle so MAIA still sounds like herself.
 */
export function cleanMessageForVoice(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // Strip fenced code blocks
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');

  // Strip common markdown noise
  cleaned = cleaned.replace(/[*_~`#>-]{1,}/g, ' ');

  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}