'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #451a03 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '400px',
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '12px',
        padding: '2rem',
        border: '1px solid rgba(239, 68, 68, 0.2)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'rgba(239, 68, 68, 0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '24px'
        }}>
          ⚠️
        </div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#f59e0b' }}>
          Something went wrong
        </h1>
        <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
          We encountered an unexpected error. This has been logged and our team will investigate.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', fontSize: '0.75rem', color: '#fca5a5' }}>
              Error Details (Development)
            </summary>
            <pre style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: 'rgba(127, 29, 29, 0.2)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: '#fecaca',
              overflow: 'auto'
            }}>
              {error.message}
            </pre>
          </details>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'medium',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            🔄 Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              borderRadius: '0.5rem',
              color: '#f59e0b',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(249, 115, 22, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            🏠 Go Home
          </button>
        </div>
      </div>
    </div>
  )
}