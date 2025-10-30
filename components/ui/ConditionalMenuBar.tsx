'use client';

import { usePathname } from 'next/navigation';
import { MenuBar } from './MenuBar';

/**
 * Conditionally renders MenuBar based on current route
 * ONLY shows on main home page - hidden everywhere else
 */
export function ConditionalMenuBar() {
  const pathname = usePathname();

  // ONLY show MenuBar on the main home page
  const showOnlyOnHome = pathname === '/';

  // Hide on all other pages
  if (!showOnlyOnHome) {
    return null;
  }

  return <MenuBar />;
}
