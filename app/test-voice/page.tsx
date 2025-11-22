'use client';

// VOICE TEST PAGE - DISABLED pending voice architecture cleanup
// useMaiaVoice hook has been removed (was OpenAI-based)

export default function TestVoicePage() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', background: '#0A0D16', minHeight: '100vh', color: '#FCD34D' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>MAIA Voice Test</h1>

      <div style={{ padding: '20px', background: '#1F2937', borderRadius: '8px', marginBottom: '20px' }}>
        <p style={{ color: '#9CA3AF' }}>
          Voice testing page is temporarily disabled while we enhance sovereign TTS architecture.
        </p>
        <p style={{ color: '#9CA3AF', marginTop: '12px' }}>
          Please use the main MAIA page at <a href="/maia" style={{ color: '#A78BFA' }}>/maia</a> for voice interaction.
        </p>
      </div>
    </div>
  );
}
