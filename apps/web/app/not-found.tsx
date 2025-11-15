// frontend

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default function NotFound() {
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
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '32px'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>
            404 - Page not found
          </h1>
          <p style={{
            color: '#999',
            marginBottom: '24px',
            maxWidth: '400px',
            lineHeight: '1.5',
            margin: '0 0 24px 0'
          }}>
            The page you were looking for doesn&apos;t exist or may have moved.
          </p>
          <a href="/" style={{
            color: '#ffffff',
            textDecoration: 'underline',
            fontSize: '16px'
          }}>
            Return to MAIA home
          </a>
        </div>
      </body>
    </html>
  );
}