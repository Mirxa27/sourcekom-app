import { ReactNode } from 'react'
import { AppLayout } from '@/components/layout/app-layout'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AppLayout showFooter={false} showChat={false}>
      {children}
    </AppLayout>
  )
}
