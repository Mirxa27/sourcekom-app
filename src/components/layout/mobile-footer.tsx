'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Search, 
  PlusCircle, 
  User, 
  Menu
} from 'lucide-react'

const mobileNavigation = [
  {
    name: 'Home',
    href: '/',
    icon: Home
  },
  {
    name: 'Browse',
    href: '/browse',
    icon: Search
  },
  {
    name: 'Create',
    href: '/upload',
    icon: PlusCircle
  },
  {
    name: 'Account',
    href: '/dashboard',
    icon: User
  },
  {
    name: 'Menu',
    href: '/menu',
    icon: Menu
  }
]

export function MobileFooter() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-background border-t">
        <div className="grid grid-cols-5 h-16">
          {mobileNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-colors",
                isActive(item.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}