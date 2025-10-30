import { Metadata } from 'next'
import { AppLayout } from '@/components/layout/app-layout'

export const metadata: Metadata = {
  title: 'Legal Services - SourceKom | Corporate Law & Compliance',
  description: 'Expert legal services for businesses in Saudi Arabia. Corporate law, contracts, compliance, and legal consultation with experienced attorneys.',
  keywords: ['legal services', 'corporate law', 'contracts', 'compliance', 'legal consultation', 'Saudi Arabia', 'business law'],
}

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}