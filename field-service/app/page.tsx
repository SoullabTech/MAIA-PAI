export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        🜃 Akashic Field Service
      </h1>
      <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2rem' }}>
        Distributed memory and resonance aggregator for MAIA-PAI
      </p>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '600px',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>API Endpoints</h2>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '1rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
              POST /api/field/query
            </code>
            <span style={{ marginLeft: '0.5rem', opacity: 0.8 }}>- Query resonance patterns</span>
          </li>
          <li>
            <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
              POST /api/field/ingest
            </code>
            <span style={{ marginLeft: '0.5rem', opacity: 0.8 }}>- Ingest field data</span>
          </li>
        </ul>
      </div>

      <p style={{ marginTop: '2rem', opacity: 0.7, fontSize: '0.9rem' }}>
        Authentication required • Field key protected
      </p>
    </div>
  )
}
