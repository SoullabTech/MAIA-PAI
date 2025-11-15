// frontend

export const dynamic = 'force-dynamic';

export default function NotFoundPage() {
  return (
    <html lang="en">
      <head>
        <title>Page Not Found - MAIA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#0f0f0f',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '400px',
          padding: '2rem'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page not found</h2>
          <p style={{ marginBottom: '2rem', opacity: 0.7 }}>
            The page you were looking for doesn't exist or may have moved.
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#FFD700',
              color: '#000000',
              textDecoration: 'none',
              borderRadius: '0.375rem',
              fontWeight: 500
            }}
          >
            Return to MAIA home
          </a>
        </div>
      </body>
    </html>
  );
}