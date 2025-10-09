'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Community Navigation
 *
 * Simple nav bar to add to any page for quick access to community
 */

export function CommunityNav() {
  const pathname = usePathname()

  // Don't show on community pages (they have their own nav)
  if (pathname?.startsWith('/community')) {
    return null
  }

  return (
    <div className="community-nav">
      <Link href="/community" className="community-link">
        🌊 Soul-Building Circle
      </Link>

      <style jsx>{`
        .community-nav {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
        }

        .community-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: rgba(79, 70, 229, 0.9);
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
          transition: all 0.3s;
        }

        .community-link:hover {
          background: rgba(79, 70, 229, 1);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.5);
        }

        @media (max-width: 640px) {
          .community-nav {
            bottom: 1rem;
            right: 1rem;
          }

          .community-link {
            padding: 0.875rem 1.25rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  )
}

/**
 * Community Header Nav
 * For use in your main app header/navbar
 */
export function CommunityHeaderLink() {
  return (
    <Link href="/community" className="community-header-link">
      🌊 Circle
      <style jsx>{`
        .community-header-link {
          padding: 0.5rem 1rem;
          background: rgba(79, 70, 229, 0.2);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s;
          font-size: 0.9375rem;
        }

        .community-header-link:hover {
          background: rgba(79, 70, 229, 0.3);
        }
      `}</style>
    </Link>
  )
}