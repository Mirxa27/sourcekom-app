'use client'

import { ReactNode } from 'react'
import { MainLayout } from './main-layout'
import { Footer } from './footer'
import { usePathname } from 'next/navigation'

interface AppLayoutProps {
  children: ReactNode
  showFooter?: boolean
}

const noFooterRoutes = ['/dashboard', '/upload', '/login', '/register']

export function AppLayout({ children, showFooter = true }: AppLayoutProps) {
  const pathname = usePathname()
  const shouldShowFooter = showFooter && !noFooterRoutes.includes(pathname)

  return (
    <MainLayout>
      {children}
      {shouldShowFooter && <Footer />}
    </MainLayout>
  )
}