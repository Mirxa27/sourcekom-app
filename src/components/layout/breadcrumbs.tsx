'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href: string
}

export function Breadcrumbs() {
  const pathname = usePathname()

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ]

    let currentPath = ''
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Convert kebab-case to Title Case
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      // Handle special cases
      const formattedLabel = label
        .replace('And', '&')
        .replace('Ressource', 'Resource')
        .replace('Srvices', 'Services')
      
      breadcrumbs.push({
        label: formattedLabel,
        href: currentPath
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (pathname === '/') {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground py-4 px-4 sm:px-6 lg:px-8">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index === 0 && (
            <Home className="h-4 w-4 mr-1" />
          )}
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
          )}
          <Link
            href={item.href}
            className={cn(
              "hover:text-foreground transition-colors",
              index === breadcrumbs.length - 1 && "text-foreground font-medium"
            )}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  )
}