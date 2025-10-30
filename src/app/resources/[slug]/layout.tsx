import { Metadata } from 'next'
import { AppLayout } from '@/components/layout/app-layout'

export const metadata: Metadata = {
  title: 'Resource Details - SourceKom',
  description: 'Access detailed information about business resources and services available on SourceKom.',
}

export default function ResourceDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}