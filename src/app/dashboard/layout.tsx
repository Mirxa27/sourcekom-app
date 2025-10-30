import { Metadata } from 'next'
import { MainLayout } from '@/components/layout/main-layout'

export const metadata: Metadata = {
  title: 'Dashboard - SourceKom',
  description: 'Manage your resources, bookings, and account settings.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MainLayout showBreadcrumbs={true} showMobileFooter={false}>
      {children}
    </MainLayout>
  )
}