'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map, Users, Shield, User } from 'lucide-react'

const navItems = [
  { href: '/', icon: Map, label: 'Map' },
  { href: '/classes', icon: Users, label: 'Classes' },
  { href: '/safety', icon: Shield, label: 'Safety' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  // Don't show nav on login page
  if (pathname === '/login') return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 pt-3 pb-8 z-50">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || 
            (href !== '/' && pathname.startsWith(href))
          
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-accent-blue' : 'text-text-tertiary'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
