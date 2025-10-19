'use client';

import { usePathname } from 'next/navigation';
import { MenuBar } from './MenuBar';

/**
 * Conditionally renders MenuBar based on current route
 * Hides on onboarding/auth pages to avoid UI clutter
 */
export function ConditionalMenuBar() {
  const pathname = usePathname();

  // ONLY show MenuBar on /maia page
  // All other pages get a clean, immersive experience with just Home + Logout
  const showFullMenuOnPages = [
    '/maia'
  ];

  // Pages where we hide MenuBar completely (onboarding/auth flows)
  const hideCompletelyOnPages = [
    '/beta-signup',
    '/beta-entry',
    '/beta-orientation',
    '/beta-onboarding',
    '/beta-welcome',
    '/beta-reset-notice',
    '/onboarding',
    '/intro',
    '/login',
    '/signup',
    '/auth'
  ];

  // Check if we should hide completely
  const shouldHideCompletely = hideCompletelyOnPages.some(page => pathname?.startsWith(page));
  if (shouldHideCompletely) {
    return null;
  }

  // Check if we should show full menu (only /maia)
  const shouldShowFullMenu = showFullMenuOnPages.some(page => pathname?.startsWith(page));

  if (shouldShowFullMenu) {
    return <MenuBar />;
  }

  // For all other pages: Show minimal Home + Logout only
  return (
    <div className="flex fixed right-4 z-40 items-center gap-2" style={{ top: 'calc(max(1rem, env(safe-area-inset-top)) + 3.5rem)' }}>
      {/* Home Button */}
      <a
        href="/maia"
        className="group relative"
        aria-label="Home - MAIA"
      >
        <div className="relative p-2 md:p-2.5 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30 flex items-center justify-center">
          <div className="w-8 h-8 md:w-9 md:h-9">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgb(251, 191, 36)" strokeWidth="1" opacity="0.6" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="rgb(251, 191, 36)" strokeWidth="1" opacity="0.4" />
              <circle cx="50" cy="50" r="15" fill="rgb(251, 191, 36)" opacity="0.3" />
            </svg>
          </div>
          <span className="absolute -bottom-8 right-0 bg-dune-spice-sand/95 text-dune-deep-sand text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Home
          </span>
        </div>
      </a>

      {/* Logout Button */}
      <button
        onClick={async () => {
          const { supabase } = await import('@/lib/auth/supabase-client');
          await supabase.auth.signOut();
          localStorage.removeItem('beta_user');
          localStorage.removeItem('soullab-session');
          window.location.href = '/auth';
        }}
        className="group relative"
        aria-label="Sign Out"
      >
        <div className="relative p-2 md:p-2.5 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          <span className="absolute -bottom-8 right-0 bg-dune-spice-sand/95 text-dune-deep-sand text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Sign Out
          </span>
        </div>
      </button>
    </div>
  );
}
