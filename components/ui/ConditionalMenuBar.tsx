'use client';

import { usePathname } from 'next/navigation';
import { MenuBar } from './MenuBar';

/**
 * Conditionally renders MenuBar based on current route
 * Hides on onboarding/auth pages to avoid UI clutter
 */
export function ConditionalMenuBar() {
  const pathname = usePathname();

  // Hide MenuBar on these pages
  const hideOnPages = [
    '/beta-signup',
    '/beta-entry',
    '/beta-orientation',
    '/beta-onboarding',
    '/beta-welcome',
    '/beta-reset-notice',
    '/login',
    '/signup',
    '/maia',  // MAIA page has its own integrated bottom bar
    '/maya',   // Redirects to /maia, but hide here too
    '/week2-welcome',  // Sign-in ritual: Welcome and credentials
    '/intro',  // Sign-in ritual: Meet MAIA with rotating quotes
    '/onboarding'  // Sign-in ritual: Name, astrology, intention
  ];

  // If no pathname yet (SSR), don't render to avoid flash
  if (!pathname) {
    return null;
  }

  const shouldHide = hideOnPages.some(page => pathname.startsWith(page));

  // Debug logging
  console.log('📍 ConditionalMenuBar - pathname:', pathname, 'shouldHide:', shouldHide);

  if (shouldHide) {
    return null;
  }

  return <MenuBar />;
}
