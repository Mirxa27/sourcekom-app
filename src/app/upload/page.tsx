'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Upload, X, Image as ImageIcon, File, Eye, EyeOff, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState([])
  const [previewMode, setPreviewMode] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [uploadedThumbnail, setUploadedThumbnail] = useState<string>('')
  
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    content: string;
    price: string;
    isFree: boolean;
    isFeatured: boolean;
    categoryId: string;
    tags: string;
    fileUrl: string;
    fileUrl2: string;
    fileUrl3: string;
    previewUrl: string;
    thumbnail: string;
  }>({
    title: '',
    description: '',
    content: '',
    price: '',
    isFree: false,
    isFeatured: false,
    categoryId: '',
    tags: '',
    fileUrl: '',
    fileUrl2: '',
    fileUrl3: '',
    previewUrl: '',
    thumbnail: ''
  })

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!userData || !token) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    
    // Fetch categories
    fetchCategories()
  }, [router])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (file: File, type: 'thumbnail' | 'file' | 'preview') => {
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('type', type)

    try {
      setLoading(true)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (response.ok) {
        const data = await response.json()
        
        if (type === 'thumbnail') {
          setUploadedThumbnail(data.url)
          setFormData(prev => ({ ...prev, thumbnail: data.url }))
        } else {
          setUploadedFiles(prev => [...prev, data.url])
          if (type === 'file' && !formData.fileUrl) {
            setFormData(prev => ({ ...prev, fileUrl: data.url }))
          } else if (type === 'file' && formData.fileUrl && !formData.fileUrl2) {
            setFormData(prev => ({ ...prev, fileUrl2: data.url }))
          } else if (type === 'file' && formData.fileUrl2 && !formData.fileUrl3) {
            setFormData(prev => ({ ...prev, fileUrl3: data.url }))
          } else if (type === 'preview') {
            setFormData(prev => ({ ...prev, previewUrl: data.url }))
          }
        }
      } else {
        setError('Failed to upload file')
      }
    } catch (error) {
      setError('Network error during file upload')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validation
    if (!formData.title || !formData.description || !formData.categoryId) {
      setError('Title, description, and category are required')
      setLoading(false)
      return
    }

    if (!formData.isFree && (!formData.price || parseFloat(formData.price) <= 0)) {
      setError('Price must be greater than 0 for paid resources')
      setLoading(false)
      return
    }

    if (!formData.fileUrl && !formData.content) {
      setError('Either a file or content must be provided')
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: formData.isFree ? 0 : parseFloat(formData.price),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Resource uploaded successfully!')
        setTimeout(() => {
          router.push(`/resources/${data.slug}`)
        }, 2000)
      } else {
        setError(data.error || 'Failed to upload resource')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const removeUploadedFile = (url: string) => {
    setUploadedFiles(prev => prev.filter(file => file !== url))
    if (formData.fileUrl === url) {
      setFormData(prev => ({ ...prev, fileUrl: '' }))
    } else if (formData.fileUrl2 === url) {
      setFormData(prev => ({ ...prev, fileUrl2: '' }))
    } else if (formData.fileUrl3 === url) {
      setFormData(prev => ({ ...prev, fileUrl3: '' }))
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Upload Resource</h1>
              <p className="text-muted-foreground">Share your work with the community</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
              {previewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Resource Details</CardTitle>
                <CardDescription>
                  Provide information about your resource
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter a descriptive title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your resource in detail"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content">Content (for text-based resources)</Label>
                    <Textarea
                      id="content"
                      placeholder="Enter your content here (optional if uploading files)"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      rows={6}
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="Enter tags separated by commas (e.g., react, javascript, tutorial)"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                    />
                  </div>

                  {/* Pricing */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isFree"
                        checked={formData.isFree}
                        onCheckedChange={(checked) => handleInputChange('isFree', checked)}
                      />
                      <Label htmlFor="isFree">This is a free resource</Label>
                    </div>

                    {!formData.isFree && (
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (SAR) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* Featured */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                    />
                    <Label htmlFor="isFeatured">Feature this resource (admin only)</Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Upload Resource
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Thumbnail Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thumbnail</CardTitle>
                <CardDescription>
                  Upload a preview image for your resource
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uploadedThumbnail ? (
                  <div className="relative">
                    <img
                      src={uploadedThumbnail}
                      alt="Thumbnail preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setUploadedThumbnail('')
                        setFormData(prev => ({ ...prev, thumbnail: '' }))
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a thumbnail image
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'thumbnail')
                      }}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="thumbnail-upload" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Image
                      </label>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Files</CardTitle>
                <CardDescription>
                  Upload your resource files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4" />
                        <span className="text-sm truncate">{file.split('/').pop()}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeUploadedFile(file)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload your resource files
                    </p>
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'file')
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button asChild variant="outline" size="sm">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </label>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview URL */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview URL</CardTitle>
                <CardDescription>
                  Add a preview link (optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="https://example.com/preview"
                  value={formData.previewUrl}
                  onChange={(e) => handleInputChange('previewUrl', e.target.value)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}