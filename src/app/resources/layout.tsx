import { Metadata } from 'next'
import { AppLayout } from '@/components/layout/app-layout'

export const metadata: Metadata = {
  title: 'Resources - SourceKom | Business Resource Marketplace',
  description: 'Browse and access verified business resources in Saudi Arabia. Office spaces, equipment, personnel, and more for your business needs.',
  keywords: ['business resources', 'office space', 'equipment', 'personnel', 'storage', 'vehicles', 'Saudi Arabia', 'resource sharing'],
}

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}