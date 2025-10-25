import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to consolidate all legacy routes to /maia (MAIA Oracle)
 * This redirects all legacy endpoints to the unified interface
 */

// List of routes to consolidate
const LEGACY_ROUTES = [
  '/oracle-beta',
  '/maya-voice',
  // '/maya' handled by next.config.js redirects
  '/sacred-oracle',
  '/voice-chat',
  '/consciousness',
  '/oracle',
  '/voice',
  '/beta',
  '/sacred',
  '/organic-voice',
  '/simplified-organic-voice',
  '/maya-test',
  '/maya-demo',
  '/oracle-voice',
  '/oracle-chat',
  '/sacred-tech',
  '/consciousness-field',
  '/oracle-conversation',
  '/oracle-conversation-test',
  '/oracle-conversation-debug',
  '/oracle-conversation-dynamic',
  '/oracle-conversation-safe',
  '/test-voice',
  '/voice-test',
  '/soulmap',
  '/holoflower',
  '/sliding-prototype'
];

export function middleware(request: NextRequest) {
  // TEMPORARILY DISABLED - debugging redirect loop
  // Just let everything through
  return NextResponse.next();

  /*
  const pathname = request.nextUrl.pathname;

  // Check if current path is a legacy route
  if (LEGACY_ROUTES.includes(pathname)) {
    // Redirect to unified MAIA interface
    const url = request.nextUrl.clone();
    url.pathname = '/maia';

    // Preserve any query parameters
    return NextResponse.redirect(url, { status: 301 });
  }

  // Allow request to continue
  return NextResponse.next();
  */
}

// Configure which routes this middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next (Next.js internals)
     * - static files
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};