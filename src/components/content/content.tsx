'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Content({ slug }: { slug: string }) {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/content/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setContent(data.content)
        }
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [slug])

  if (loading) {
    return <p>Loading...</p>
  }

  if (!content) {
    return <p>Content not found.</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div dangerouslySetInnerHTML={{ __html: content.content }} />
      </CardContent>
    </Card>
  )
}
