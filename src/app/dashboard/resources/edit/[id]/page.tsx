'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditResourcePage() {
  const router = useRouter()
  const params = useParams()
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
        const response = await fetch(`/api/resources/${params.id}`)
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

    if (params.id) {
      fetchResource()
    }
  }, [params.id, router])

  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/resources/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Resource updated successfully')
        router.push('/dashboard/resources')
      } else {
        alert('Failed to update resource')
      }
    } catch (error) {
      alert('An error occurred')
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
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Edit Resource</h1>
          <p className="text-gray-600">Update the details of your resource</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleUpdateResource} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700">
                File URL
              </label>
              <input
                id="fileUrl"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
