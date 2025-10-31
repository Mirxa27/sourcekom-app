'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditResourcePage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    fileUrl: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await fetch(`/api/resources/${params.slug}`)
        if (response.ok) {
          const data = await response.json()
          setFormData(data.resource)
        } else {
          router.push('/dashboard/resources')
        }
      } catch (error) {
        router.push('/dashboard/resources')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchResource()
    }
  }, [params.slug, router])

  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/resources/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Resource updated successfully',
        })
        router.push('/dashboard/resources')
      } else {
        toast({
          title: 'Failed to update resource',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Edit Resource</CardTitle>
            <CardDescription>Update the details of your resource</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateResource} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileUrl">File URL</Label>
                <Input
                  id="fileUrl"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
    </div>
  )
}
