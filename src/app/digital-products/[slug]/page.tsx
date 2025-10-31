'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Download, 
  Star, 
  Users, 
  Clock, 
  FileText, 
  Shield, 
  ChevronRight,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Heart,
  Share2,
  ShoppingCart,
  Play,
  Code,
  BookOpen,
  Target,
  Zap,
  Globe
} from 'lucide-react'
import Link from 'next/link'

const pricingConfig = {
  'BASIC': {
    name: 'Basic',
    color: 'bg-gray-100 text-gray-800',
    features: ['Single business use', '6 months updates', 'Email support']
  },
  'PROFESSIONAL': {
    name: 'Professional',
    color: 'bg-blue-100 text-blue-800',
    features: ['Multi-branch use', '12 months updates', 'Priority support', 'Advanced features']
  },
  'ENTERPRISE': {
    name: 'Enterprise',
    color: 'bg-purple-100 text-purple-800',
    features: ['Unlimited use', 'Lifetime updates', 'Dedicated support', 'Custom modifications']
  },
  'CUSTOM': {
    name: 'Custom',
    color: 'bg-green-100 text-green-800',
    features: ['Tailored solutions', 'Custom development', 'On-site support', 'White-label options']
  }
}

const licenseConfig = {
  'STANDARD': {
    name: 'Standard License',
    description: 'Single business use with updates'
  },
  'COMMERCIAL': {
    name: 'Commercial License',
    description: 'Multi-branch use with resale rights'
  },
  'ENTERPRISE': {
    name: 'Enterprise License',
    description: 'Unlimited use with dedicated support'
  },
  'WHITE_LABEL': {
    name: 'White-Label License',
    description: 'Full customization and rebranding rights'
  },
  'CUSTOM': {
    name: 'Custom License',
    description: 'Tailored licensing for specific needs'
  }
}

export default function DigitalProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPricing, setSelectedPricing] = useState('PROFESSIONAL')
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchProduct(params.slug as string)
    }
  }, [params.slug])

  const fetchProduct = async (slug: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/resources/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.resource)
        setSelectedPricing(data.resource?.pricingTier || 'PROFESSIONAL')
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async () => {
    try {
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId: product.id,
          pricingTier: selectedPricing
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl
        }
      }
    } catch (error) {
      console.error('Failed to initiate purchase:', error)
    }
  }

  const handleWishlist = async () => {
    try {
      // Implementation for wishlist functionality
      setIsWishlisted(!isWishlisted)
    } catch (error) {
      console.error('Failed to update wishlist:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">The digital product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/digital-products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  const pricing = pricingConfig[product.pricingTier as keyof typeof pricingConfig]
  const license = licenseConfig[product.licenseType as keyof typeof licenseConfig]

  return (
    <div className="min-h-screen bg-background">
        {/* Back Navigation and Actions */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/digital-products" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Back to Digital Products</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleWishlist}>
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={pricing.color}>
                    {pricing.name}
                  </Badge>
                  <Badge variant="outline">{product.fileFormat}</Badge>
                  {product.isFeatured && (
                    <Badge className="bg-yellow-400 text-yellow-900">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
              
              <p className="text-lg text-muted-foreground mb-6">{product.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>
                  <span>({product.ratingCount} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>{product.downloadCount} downloads</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{product._count?.purchases || 0} customers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{product.duration}</span>
                </div>
              </div>
            </div>

            {/* Product Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Product Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  {product.previewUrl ? (
                    <img
                      src={product.previewUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : product.demoUrl ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
                      <div className="text-center">
                        <Play className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">Interactive Demo Available</p>
                        <Button asChild>
                          <Link href={product.demoUrl} target="_blank">
                            Try Demo
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
                      <FileText className="w-12 h-12 text-emerald-600" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Details Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      {product.content ? (
                        <div dangerouslySetInnerHTML={{ __html: product.content.replace(/\n/g, '<br>') }} />
                      ) : (
                        <p className="text-muted-foreground">No detailed description available.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">File Format</span>
                          <span className="font-medium">{product.fileFormat}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">File Size</span>
                          <span className="font-medium">{(product.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Version</span>
                          <span className="font-medium">{product.version}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Difficulty</span>
                          <span className="font-medium">{product.difficulty}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="font-medium">{product.duration}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">License</span>
                          <span className="font-medium">{license.name}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                    <CardDescription>Everything included in this digital product</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {product.features ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {JSON.parse(product.features).map((feature: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No features listed for this product.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Saudi-Specific Features</CardTitle>
                    <CardDescription>Tailored for Saudi Arabian business context</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <Globe className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Saudi Calendar Integration</h4>
                          <p className="text-sm text-muted-foreground">Saturday-Thursday work week</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Target className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Saudization Compliance</h4>
                          <p className="text-sm text-muted-foreground">Workforce tracking</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Zap className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">VAT Optimization</h4>
                          <p className="text-sm text-muted-foreground">15% VAT calculation</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Regulatory Compliance</h4>
                          <p className="text-sm text-muted-foreground">Saudi law adherence</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{product.requirements}</p>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span>Modern web browser (Chrome, Firefox, Safari, Edge)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span>Stable internet connection</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span>Email account for support</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Technical Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Programming Language</span>
                        <span className="font-medium">JavaScript</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Framework</span>
                        <span className="font-medium">Vanilla JS</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Browser Support</span>
                        <span className="font-medium">Modern browsers</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Mobile Compatible</span>
                        <span className="font-medium">Yes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="support" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Support Level</CardTitle>
                    <CardDescription>
                      <Badge className={pricing.color}>
                        {product.supportLevel} Support
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Email Support</h4>
                          <p className="text-sm text-muted-foreground">Response within 24-48 hours</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Documentation</h4>
                          <p className="text-sm text-muted-foreground">Comprehensive user guides</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Updates</h4>
                          <p className="text-sm text-muted-foreground">
                            {product.pricingTier === 'PROFESSIONAL' ? '12 months included' : 
                             product.pricingTier === 'ENTERPRISE' ? 'Lifetime updates' : 
                             '6 months included'}
                          </p>
                        </div>
                      </div>
                      {product.supportLevel === 'PREMIUM' && (
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium">Priority Support</h4>
                            <p className="text-sm text-muted-foreground">Response within 4-8 hours</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                    <CardDescription>
                      {product.ratingCount} reviews • {product.rating.toFixed(1)} average rating
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">{product.rating.toFixed(1)}</h3>
                      <p className="text-muted-foreground mb-4">Based on {product.ratingCount} reviews</p>
                      <Button variant="outline">Be the first to review</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Purchase Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <CardTitle>Purchase Options</CardTitle>
                  <Badge className={pricing.color}>{pricing.name}</Badge>
                </div>
                <div className="space-y-2">
                  {product.originalPrice && product.originalPrice > product.price ? (
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-emerald-600">SAR {product.price}</span>
                      <span className="text-lg text-muted-foreground line-through">SAR {product.originalPrice}</span>
                      <Badge className="bg-red-100 text-red-800">Save {Math.round((1 - product.price / product.originalPrice) * 100)}%</Badge>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-emerald-600">
                      {product.isFree ? 'Free' : `SAR ${product.price}`}
                    </span>
                  )}
                </div>
                <CardDescription className="text-sm">
                  {license.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700" 
                  size="lg"
                  onClick={handlePurchase}
                  disabled={product.isFree}
                >
                  {product.isFree ? (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download Now
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Purchase Now
                    </>
                  )}
                </Button>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Secure payment via MyFatoorah</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Instant access after purchase</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">30-day money-back guarantee</span>
                  </div>
                </div>

                {/* Pricing Tier Selector */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Select Pricing Tier</h4>
                  <div className="space-y-2">
                    {Object.entries(pricingConfig).map(([tier, config]) => (
                      <button
                        key={tier}
                        onClick={() => setSelectedPricing(tier)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedPricing === tier 
                            ? 'border-emerald-600 bg-emerald-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{config.name}</span>
                          {tier === product.pricingTier && (
                            <Badge variant="secondary" className="text-xs">Current</Badge>
                          )}
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {config.features.slice(0, 2).map((feature, idx) => (
                            <li key={idx} className="flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* License Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">License Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">{license.name}</h4>
                      <p className="text-xs text-muted-foreground">{license.description}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Usage Rights</h4>
                      <p className="text-xs text-muted-foreground">Commercial use permitted</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Code className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Source Code</h4>
                      <p className="text-xs text-muted-foreground">Full source code included</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}