import { ReactNode } from 'react'
import { AppLayout } from '@/components/layout/app-layout'

interface DigitalProductsLayoutProps {
  children: ReactNode
}

export default function DigitalProductsLayout({ children }: DigitalProductsLayoutProps) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  )
}
