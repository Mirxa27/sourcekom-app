import { ReactNode } from 'react'
import { AppLayout } from '@/components/layout/app-layout'

interface HelpLayoutProps {
  children: ReactNode
}

export default function HelpLayout({ children }: HelpLayoutProps) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  )
}
