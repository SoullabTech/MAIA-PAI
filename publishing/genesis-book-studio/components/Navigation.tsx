'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Sparkles, Users, Home, GraduationCap } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/academy', label: 'Academy', icon: GraduationCap },
    { href: '/read-adaptive', label: 'Adaptive Reading', icon: BookOpen },
    { href: '/creed', label: 'The Creed', icon: Sparkles },
    { href: '/beta', label: 'Join Beta', icon: Users },
  ]

  return (
    <nav className="bg-gradient-to-r from-parchment/50 via-white to-parchment/50 border-b-2 border-leather/20 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <BookOpen className="text-fire group-hover:text-fire-dark transition-colors" size={28} />
            <span className="font-heading font-bold text-xl text-gray-900 hidden sm:inline">
              Genesis Book Studio
            </span>
            <span className="font-heading font-bold text-xl text-gray-900 sm:hidden">
              Genesis
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-gradient-to-r from-fire/10 to-water/10 text-gray-900 border-2 border-leather/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-parchment/30'
                    }
                  `}
                >
                  <Icon size={16} className={isActive ? 'text-fire' : ''} />
                  <span className="hidden md:inline">{link.label}</span>
                  <span className="md:hidden">
                    {link.label.split(' ')[0]}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Turtle Easter Egg */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400">
            <span className="italic">Turtles all the way down</span>
            <span>🐢</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
