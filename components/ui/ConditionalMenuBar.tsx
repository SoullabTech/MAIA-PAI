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
    '/signup'
  ];

  const shouldHide = hideOnPages.some(page => pathname?.startsWith(page));

  if (shouldHide) {
    return null;
  }

  return <MenuBar />;
}
