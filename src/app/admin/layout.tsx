import { ReactNode } from 'react'
import { AppLayout } from '@/components/layout/app-layout'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AppLayout showFooter={false} showChat={false}>
      {children}
    </AppLayout>
  )
}
