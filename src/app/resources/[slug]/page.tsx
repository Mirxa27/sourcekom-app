'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PaymentModal } from '@/components/payment/payment-modal'
import { 
  Download, 
  Heart, 
  Share2, 
  Star, 
  Eye, 
  Calendar, 
  User, 
  Tag, 
  ExternalLink,
  ShoppingCart,
  Check,
  Loader2,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ResourceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [resource, setResource] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [isPurchased, setIsPurchased] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    fetchResource()
  }, [slug])

  const fetchResource = async () => {
    try {
      const response = await fetch(`/api/resources/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setResource(data)
        
        // Check if user has purchased this resource
        if (user) {
          checkPurchaseStatus(data.id)
        }
      } else if (response.status === 404) {
        setError('Resource not found')
      } else {
        setError('Failed to load resource')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const checkPurchaseStatus = async (resourceId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/purchases/check/${resourceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setIsPurchased(data.purchased)
      }
    } catch (error) {
      console.error('Failed to check purchase status:', error)
    }
  }

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    // Show payment modal instead of direct purchase
    setShowPaymentModal(true)
  }

  const handleDownload = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!isPurchased && !resource.isFree) {
      handlePurchase()
      return
    }

    setDownloadLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/resources/${resource.id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.downloadUrl) {
          // Create download link
          const link = document.createElement('a')
          link.href = data.downloadUrl
          link.download = ''
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to download resource')
      }
    } catch (error) {
      setError('Network error during download')
    } finally {
      setDownloadLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource.title,
          text: resource.description,
          url: window.location.href
        })
      } catch (error) {
        // Fallback to copying to clipboard
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    // You could show a toast notification here
  }

  const handleFavorite = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    // Toggle favorite status
    setIsFavorite(!isFavorite)
    // TODO: Implement favorite API
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Resource Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'This resource could not be found.'}</p>
          <Button asChild>
            <Link href="/browse">Browse Resources</Link>
          </Button>
        </div>
      </div>
    )
  }

  const canDownload = resource.isFree || isPurchased
  const tags = resource.tags ? JSON.parse(resource.tags) : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Resource Header */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{resource.category?.name}</Badge>
                  {resource.isFree && <Badge variant="secondary">Free</Badge>}
                  {resource.isFeatured && <Badge>Featured</Badge>}
                </div>
                <h1 className="text-3xl font-bold mb-2">{resource.title}</h1>
                <p className="text-lg text-muted-foreground">{resource.description}</p>
              </div>
              <div className="text-right ml-8">
                <div className="text-2xl font-bold mb-2">
                  {resource.isFree ? 'Free' : `SAR ${resource.price}`}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{resource.averageRating || 0}</span>
                  <span>({resource.reviewCount || 0} reviews)</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                onClick={handleDownload}
                disabled={downloadLoading || purchaseLoading}
                className="flex-1 sm:flex-none"
              >
                {downloadLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : purchaseLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : canDownload ? (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Purchase - SAR {resource.price}
                  </>
                )}
              </Button>

              {resource.previewUrl && (
                <Button variant="outline" size="lg" asChild>
                  <a href={resource.previewUrl} target="_blank" rel="noopener noreferrer">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Preview */}
          {resource.thumbnail && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={resource.thumbnail}
                  alt={resource.title}
                  className="w-full rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* Content Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About this resource</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {resource.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resource Content</CardTitle>
                </CardHeader>
                <CardContent>
                  {resource.content ? (
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
                        {resource.content}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      This resource contains downloadable files. Purchase or download to access the content.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                  <CardDescription>
                    See what others think about this resource
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No reviews yet. Be the first to review this resource!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Author</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">{resource.author?.name || 'Anonymous'}</h3>
                  <p className="text-sm text-muted-foreground">Content Creator</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </CardContent>
          </Card>

          {/* Resource Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resource Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <Badge variant="outline">{resource.category?.name}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">File Size</span>
                <span className="text-sm">--</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Downloads</span>
                <span className="text-sm">{resource.downloadCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Views</span>
                <span className="text-sm">{resource.viewCount}</span>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm">
                  {new Date(resource.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Updated</span>
                <span className="text-sm">
                  {new Date(resource.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Access Status</CardTitle>
            </CardHeader>
            <CardContent>
              {canDownload ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {resource.isFree ? 'Free Resource' : 'Purchased'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You have full access to this resource and can download it anytime.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Purchase this resource to get full access to all files and updates.
                  </p>
                  <div className="text-lg font-semibold">
                    SAR {resource.price}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          resource={{
            id: resource.id,
            title: resource.title,
            description: resource.description,
            price: resource.price,
            category: resource.category?.name || 'Unknown'
          }}
          user={user ? {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone
          } : undefined}
        />
      )}
    </div>
  )
}