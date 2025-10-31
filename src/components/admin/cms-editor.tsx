'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Save, 
  X, 
  Eye, 
  FileText, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Tag
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface CMSEditorProps {
  content?: any
  onSave: (data: any) => Promise<void>
  onClose: () => void
  isOpen: boolean
}

export function CMSEditor({ content, onSave, onClose, isOpen }: CMSEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    type: 'page' as 'page' | 'post' | 'announcement' | 'faq',
    status: 'draft' as 'draft' | 'published' | 'archived',
    featured: false,
    seoTitle: '',
    seoDescription: ''
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [previewMode, setPreviewMode] = useState(false)
  const [slugGenerating, setSlugGenerating] = useState(false)

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || '',
        slug: content.slug || '',
        excerpt: content.excerpt || '',
        content: content.content || '',
        type: content.type || 'page',
        status: content.status || 'draft',
        featured: content.featured || false,
        seoTitle: content.seoTitle || '',
        seoDescription: content.seoDescription || ''
      })
    } else {
      // Reset for new content
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        type: 'page',
        status: 'draft',
        featured: false,
        seoTitle: '',
        seoDescription: ''
      })
    }
  }, [content, isOpen])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({ ...prev, title: value }))
    // Auto-generate slug if empty or if it matches the old title's slug
    if (!formData.slug || formData.slug === generateSlug(formData.title)) {
      setSlugGenerating(true)
      setTimeout(() => {
        setFormData(prev => ({ ...prev, slug: generateSlug(value) || prev.slug }))
        setSlugGenerating(false)
      }, 300)
    }
  }

  const handleSave = async () => {
    setError('')
    
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }
    
    if (!formData.slug.trim()) {
      setError('Slug is required')
      return
    }
    
    if (!formData.content.trim()) {
      setError('Content is required')
      return
    }

    setIsSaving(true)
    
    try {
      await onSave({
        ...(content ? { id: content.id } : {}),
        ...formData,
        slug: formData.slug.toLowerCase().trim()
      })
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to save content')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {content ? 'Edit Content' : 'Create New Content'}
          </DialogTitle>
          <DialogDescription>
            {content ? 'Update your content details and publish when ready.' : 'Create a new page, post, announcement, or FAQ.'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter content title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  placeholder="url-friendly-slug"
                  className="flex-1"
                />
                {slugGenerating && <Loader2 className="w-4 h-4 animate-spin mt-2" />}
              </div>
              <p className="text-xs text-muted-foreground">
                URL-friendly identifier (e.g., "about-us", "blog-post-title")
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief description (used in listings and previews)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter your content here. Markdown supported."
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Supports Markdown formatting. Use **bold**, *italic*, # headings, - lists, etc.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                placeholder="SEO-optimized title (defaults to title if empty)"
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 50-60 characters. Leave empty to use title.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                placeholder="Meta description for search engines"
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 150-160 characters. Used in search engine results.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Content Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">Page</SelectItem>
                    <SelectItem value="post">Post</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="faq">FAQ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
              />
              <Label htmlFor="featured">Feature this content</Label>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Content Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline">{formData.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={formData.status === 'published' ? 'default' : 'secondary'}>
                    {formData.status}
                  </Badge>
                </div>
                {formData.featured && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Featured:</span>
                    <Badge>Yes</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Content Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formData.content ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <h1>{formData.title || 'Untitled'}</h1>
                    {formData.excerpt && (
                      <p className="text-muted-foreground italic">{formData.excerpt}</p>
                    )}
                    <ReactMarkdown>{formData.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Add content to see preview
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {content ? 'Update Content' : 'Create Content'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

