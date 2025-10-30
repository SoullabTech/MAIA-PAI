import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to consolidate legacy routes to /maia
 * MAIA = Midwife of Ancient Intelligence Awakening
 * This redirects all legacy endpoints to the unified MAIA interface
 */

// List of routes to consolidate
const LEGACY_ROUTES = [
  '/oracle-beta',
  '/maya-voice',
  '/sacred-oracle',
  '/voice-chat',
  // '/consciousness', // REMOVED - Now active as MAIA/KAIROS/UNIFIED interface
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
  '/maya',
  '/soulmap',
  '/holoflower',
  '/sliding-prototype'
];

export function middleware(request: NextRequest) {
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