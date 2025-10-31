'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, FileText, Image as ImageIcon, Film, Music } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function NewResourcePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    fileUrl: '',
    previewUrl: '',
    thumbnail: '',
    productType: 'DIGITAL_PRODUCT',
    licenseType: 'STANDARD',
    activationLimit: 1,
    fileSize: 0,
    fileFormat: ''
  })
  const [uploadedFiles, setUploadedFiles] = useState<{
    product?: { url: string; name: string; size: number };
    preview?: { url: string; name: string };
    thumbnail?: { url: string; name: string };
  }>({})

  const handleFileUpload = async (file: File, type: 'product' | 'preview' | 'thumbnail') => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/resources/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        
        setUploadedFiles(prev => ({
          ...prev,
          [type]: {
            url: data.fileUrl,
            name: data.fileName,
            size: data.fileSize
          }
        }))

        // Update form data
        if (type === 'product') {
          setFormData(prev => ({
            ...prev,
            fileUrl: data.fileUrl,
            fileSize: data.fileSize,
            fileFormat: data.fileType
          }))
        } else if (type === 'preview') {
          setFormData(prev => ({ ...prev, previewUrl: data.fileUrl }))
        } else if (type === 'thumbnail') {
          setFormData(prev => ({ ...prev, thumbnail: data.fileUrl }))
        }

        toast({
          title: `${type} uploaded successfully`,
          description: data.fileName
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Upload failed',
          description: error.error,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Upload error',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'preview' | 'thumbnail') => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file, type)
    }
  }

  const removeFile = (type: 'product' | 'preview' | 'thumbnail') => {
    setUploadedFiles(prev => {
      const updated = { ...prev }
      delete updated[type]
      return updated
    })

    if (type === 'product') {
      setFormData(prev => ({ ...prev, fileUrl: '', fileSize: 0, fileFormat: '' }))
    } else if (type === 'preview') {
      setFormData(prev => ({ ...prev, previewUrl: '' }))
    } else if (type === 'thumbnail') {
      setFormData(prev => ({ ...prev, thumbnail: '' }))
    }
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext || '')) {
      return <ImageIcon className="w-5 h-5" />
    } else if (['mp4', 'mov', 'avi'].includes(ext || '')) {
      return <Film className="w-5 h-5" />
    } else if (['mp3', 'wav'].includes(ext || '')) {
      return <Music className="w-5 h-5" />
    }
    return <FileText className="w-5 h-5" />
  }

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fileUrl) {
      toast({
        title: 'Product file required',
        description: 'Please upload the main product file',
        variant: 'destructive'
      })
      return
    }

    try {
      // Ensure proper data types
      const payload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price.toString()),
        fileUrl: formData.fileUrl,
        previewUrl: formData.previewUrl || undefined,
        thumbnail: formData.thumbnail || undefined,
        productType: formData.productType,
        licenseType: formData.licenseType,
        activationLimit: parseInt(formData.activationLimit.toString()),
        fileSize: formData.fileSize || undefined,
        fileFormat: formData.fileFormat || undefined
      }

      console.log('Submitting resource:', payload)

      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      let data;
      try {
        const text = await response.text()
        console.log('Response text:', text)
        data = text ? JSON.parse(text) : {}
      } catch (parseError) {
        console.error('Failed to parse response:', parseError)
        data = { error: 'Invalid server response' }
      }

      if (response.ok) {
        toast({
          title: 'Resource created successfully',
          description: 'License keys will be generated upon purchase'
        })
        router.push('/dashboard/resources')
      } else {
        console.error('API Error Details:')
        console.error('- Status:', response.status)
        console.error('- Data:', data)
        console.error('- Validation details:', data.details)
        
        const errorMessage = data.error || 'Please check all required fields'
        
        // Handle validation errors (could be array or string)
        let validationErrors = ''
        if (Array.isArray(data.details)) {
          validationErrors = data.details.map((d: any) => d.message).join(', ')
        } else if (typeof data.details === 'string') {
          validationErrors = data.details
        }
        
        toast({
          title: 'Failed to create resource',
          description: validationErrors || errorMessage,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast({
        title: 'An error occurred',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Resource</CardTitle>
          <CardDescription>Upload your digital product and configure settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateResource} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (SAR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productType">Product Type</Label>
                  <Select
                    value={formData.productType}
                    onValueChange={(value) => setFormData({ ...formData, productType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DIGITAL_PRODUCT">Digital Product</SelectItem>
                      <SelectItem value="SOFTWARE">Software</SelectItem>
                      <SelectItem value="TEMPLATE">Template</SelectItem>
                      <SelectItem value="GUIDE">Guide</SelectItem>
                      <SelectItem value="DOCUMENTATION">Documentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* File Uploads */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">Files</h3>
              
              {/* Main Product File */}
              <div className="space-y-2">
                <Label>Main Product File * (Max 100MB)</Label>
                {!uploadedFiles.product ? (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload your digital product file
                    </p>
                    <Input
                      type="file"
                      onChange={(e) => handleFileInputChange(e, 'product')}
                      disabled={uploading}
                      className="max-w-xs mx-auto"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported: PDF, DOC, ZIP, EXE, APK, and more
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(uploadedFiles.product.name)}
                      <div>
                        <p className="font-medium">{uploadedFiles.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFiles.product.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile('product')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Preview File (Optional) */}
              <div className="space-y-2">
                <Label>Preview File (Optional)</Label>
                {!uploadedFiles.preview ? (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload a preview/demo file
                    </p>
                    <Input
                      type="file"
                      onChange={(e) => handleFileInputChange(e, 'preview')}
                      disabled={uploading}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                ) : (
                  <div className="border rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(uploadedFiles.preview.name)}
                      <span className="text-sm">{uploadedFiles.preview.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile('preview')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Thumbnail (Optional) */}
              <div className="space-y-2">
                <Label>Thumbnail Image (Optional)</Label>
                {!uploadedFiles.thumbnail ? (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload a thumbnail image
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileInputChange(e, 'thumbnail')}
                      disabled={uploading}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                ) : (
                  <div className="border rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-sm">{uploadedFiles.thumbnail.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile('thumbnail')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* License Configuration */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">License Configuration</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseType">License Type</Label>
                  <Select
                    value={formData.licenseType}
                    onValueChange={(value) => setFormData({ ...formData, licenseType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STANDARD">Standard License</SelectItem>
                      <SelectItem value="COMMERCIAL">Commercial License</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise License</SelectItem>
                      <SelectItem value="WHITE_LABEL">White Label License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activationLimit">Activation Limit</Label>
                  <Input
                    id="activationLimit"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.activationLimit}
                    onChange={(e) => setFormData({ ...formData, activationLimit: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of devices that can use this license
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/resources')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploading || !formData.fileUrl}
              >
                {uploading ? 'Uploading...' : 'Create Resource'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
