export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px'
    }}>
      <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '8px' }}>
        Page not found
      </h1>
      <p style={{
        color: '#666',
        marginBottom: '16px',
        textAlign: 'center',
        maxWidth: '448px'
      }}>
        The page you were looking for doesn&apos;t exist or may have moved.
      </p>
      <a href="/" style={{ textDecoration: 'underline' }}>
        Return to MAIA home
      </a>
    </div>
  );
}