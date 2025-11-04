'use client';

import { usePathname } from 'next/navigation';
import { MenuBar } from './MenuBar';

/**
 * Conditionally renders MenuBar based on current route
 * Shows on home and MAIA conversation page
 */
export function ConditionalMenuBar() {
  const pathname = usePathname();

  // Show MenuBar on home page and MAIA conversation page
  const shouldShowMenuBar = pathname === '/' || pathname === '/maia';

  // Hide on all other pages
  if (!shouldShowMenuBar) {
    return null;
  }

  return <MenuBar />;
}
