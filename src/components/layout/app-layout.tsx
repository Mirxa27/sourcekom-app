'use client'

import { ReactNode } from 'react'
import { MainLayout } from './main-layout'
import { Footer } from './footer'
import { ChatWidget } from '@/components/chat/chat-widget'
import { usePathname } from 'next/navigation'

interface AppLayoutProps {
  children: ReactNode
  showFooter?: boolean
  showChat?: boolean
}

const noFooterRoutes = ['/dashboard', '/upload', '/login', '/register']
const noChatRoutes = ['/dashboard', '/upload', '/admin']

export function AppLayout({ children, showFooter = true, showChat = true }: AppLayoutProps) {
  const pathname = usePathname()
  const shouldShowFooter = showFooter && !noFooterRoutes.includes(pathname)
  const shouldShowChat = showChat && !noChatRoutes.includes(pathname)

  return (
    <MainLayout>
      {children}
      {shouldShowFooter && <Footer />}
      {shouldShowChat && <ChatWidget />}
    </MainLayout>
  )
}
