'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'
import { MobileFooter } from './mobile-footer'
import { Breadcrumbs } from './breadcrumbs'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: ReactNode
  showBreadcrumbs?: boolean
  showMobileFooter?: boolean
}

const noBreadcrumbsRoutes = ['/']
const noMobileFooterRoutes = ['/dashboard', '/upload', '/login', '/register']

export function MainLayout({ 
  children, 
  showBreadcrumbs = true, 
  showMobileFooter = true 
}: MainLayoutProps) {
  const pathname = usePathname()

  const shouldShowBreadcrumbs = showBreadcrumbs && !noBreadcrumbsRoutes.includes(pathname)
  const shouldShowMobileFooter = showMobileFooter && !noMobileFooterRoutes.includes(pathname)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {shouldShowBreadcrumbs && <Breadcrumbs />}
      
      <main className={cn(
        "flex-1",
        shouldShowMobileFooter && "pb-16 md:pb-0"
      )}>
        {children}
      </main>
      
      {shouldShowMobileFooter && <MobileFooter />}
    </div>
  )
}