import { Metadata } from 'next'
import { AppLayout } from '@/components/layout/app-layout'

export const metadata: Metadata = {
  title: 'Services - SourceKom | Business Consulting & Resource Management',
  description: 'Comprehensive business consulting and resource management services in Saudi Arabia. Expert solutions for market entry, logistics, efficiency, and sustainability.',
  keywords: ['business consulting', 'resource management', 'market entry', 'logistics', 'efficiency', 'sustainability', 'Saudi Arabia'],
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}