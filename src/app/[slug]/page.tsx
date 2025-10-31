'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Content } from '@/components/content/content'
import { useParams } from 'next/navigation'

export default function DynamicPage() {
  const params = useParams()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug

  if (!slug) {
    return null // Or a not found component
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <Content slug={slug} />
      </div>
    </AppLayout>
  )
}
