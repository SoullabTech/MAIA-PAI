import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-background/80 backdrop-blur-xl border border-amber-500/20 rounded-lg shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-4 opacity-60">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-6xl font-bold text-amber-400 mb-2">404</div>
          <h3 className="text-xl font-semibold leading-none tracking-tight">Path Not Found</h3>
        </div>
        <div className="p-6 pt-0 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            This wisdom path doesn&apos;t exist in our oracle system. Let&apos;s guide you back to familiar territory.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </Link>
            <Link
              href="/oracle"
              className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md text-sm font-medium border border-amber-500/20 hover:bg-amber-500/10 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Oracle Chat
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-500/20">
            <p className="text-xs text-muted-foreground">
              Need help? Try our <Link href="/oracle" className="text-amber-400 hover:text-amber-300">oracle chat</Link> for guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}