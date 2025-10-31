'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function MyResourcesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/user/resources')
        if (response.ok) {
          const data = await response.json()
          setResources(data.resources)
        } else {
          router.push('/login')
        }
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Resources</h1>
        <Button asChild>
          <Link href="/dashboard/resources/new">Create New Resource</Link>
        </Button>
      </div>

      {resources.length === 0 ? (
        <p>You have not created any resources yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <CardHeader>
                <CardTitle>{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href={`/dashboard/resources/edit/${resource.slug}`}>Edit Resource</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
