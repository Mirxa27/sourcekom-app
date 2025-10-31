import { ReactNode } from 'react'
import { AppLayout } from '@/components/layout/app-layout'

interface UploadLayoutProps {
  children: ReactNode
}

export default function UploadLayout({ children }: UploadLayoutProps) {
  return (
    <AppLayout showFooter={false} showChat={false}>
      {children}
    </AppLayout>
  )
}
