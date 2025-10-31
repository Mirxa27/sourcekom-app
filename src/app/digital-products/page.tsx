'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Download, 
  Star, 
  Users, 
  Building, 
  Truck, 
  FileText, 
  Filter,
  Grid,
  List,
  ArrowRight,
  Crown,
  Sparkles,
  Code,
  Palette,
  BookOpen,
  Target
} from 'lucide-react'
import Link from 'next/link'

const categoryIcons = {
  'resource-management-templates': FileText,
  'saudi-business-documentation': Building,
  'digital-asset-collections': Palette,
  'consulting-toolkits': Target,
  'developer-resources': Code,
  'business-guides-training': BookOpen
}

const pricingColors = {
  'BASIC': 'bg-gray-100 text-gray-800',
  'PROFESSIONAL': 'bg-blue-100 text-blue-800',
  'ENTERPRISE': 'bg-purple-100 text-purple-800',
  'CUSTOM': 'bg-green-100 text-green-800'
}

export default function DigitalProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPricing, setSelectedPricing] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [selectedCategory, selectedPricing, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        category: selectedCategory === 'all' ? '' : selectedCategory,
        pricing: selectedPricing === 'all' ? '' : selectedPricing,
        sort: sortBy,
        search: searchQuery,
        productType: 'DIGITAL_PRODUCT'
      })
      
      const response = await fetch(`/api/resources?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.resources || [])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProducts()
  }

  return (
    <div className="min-h-screen bg-background">
        {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
            Digital Products Suite
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Premium Digital Products
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Professional-grade digital tools and templates designed specifically for Saudi Arabian businesses. 
            Accelerate your growth with our expert-crafted solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="#products">
                Browse Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                Request Custom Solution
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-emerald-600 mb-2">50+</h3>
              <p className="text-gray-600">Digital Products</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-emerald-600 mb-2">1000+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-emerald-600 mb-2">24/7</h3>
              <p className="text-gray-600">Support Available</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-emerald-600 mb-2">98%</h3>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 bg-white border-b">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
                <p className="text-gray-600">Professional-grade tools built by Saudi business experts</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Saudi Context</h3>
                <p className="text-gray-600">Tailored for Saudi market regulations and business culture</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
                <p className="text-gray-600">Dedicated support team with Saudi business expertise</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section id="products" className="py-8 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search digital products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedPricing} onValueChange={setSelectedPricing}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Pricing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="BASIC">Basic</SelectItem>
                  <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading digital products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No digital products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or browse all categories.
              </p>
              <Button variant="outline" onClick={() => {
                setSelectedCategory('all')
                setSelectedPricing('all')
                setSearchQuery('')
                setSortBy('newest')
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {products.map((product: any) => {
                const IconComponent = categoryIcons[product.category?.slug as keyof typeof categoryIcons] || FileText
                return (
                  <Link key={product.id} href={`/digital-products/${product.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group relative overflow-hidden">
                      {/* Featured Badge */}
                      {product.isFeatured && (
                        <div className="absolute top-3 right-3 z-10">
                          <Badge className="bg-yellow-400 text-yellow-900">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}
                      
                      {viewMode === 'grid' ? (
                        <>
                          <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                            {product.thumbnail ? (
                              <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
                                <IconComponent className="w-12 h-12 text-emerald-600" />
                              </div>
                            )}
                          </div>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={pricingColors[product.pricingTier as keyof typeof pricingColors]}>
                                {product.pricingTier}
                              </Badge>
                              <Badge variant="outline">{product.fileFormat}</Badge>
                            </div>
                            <CardDescription className="line-clamp-2">
                              {product.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-current text-yellow-400" />
                                <span className="text-sm">{product.rating.toFixed(1)}</span>
                                <span className="text-sm text-muted-foreground">({product.ratingCount})</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Download className="w-4 h-4" />
                                <span className="text-sm">{product.downloadCount}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                {product.originalPrice && product.originalPrice > product.price ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-emerald-600">SAR {product.price}</span>
                                    <span className="text-sm text-muted-foreground line-through">SAR {product.originalPrice}</span>
                                  </div>
                                ) : (
                                  <span className="text-lg font-bold text-emerald-600">
                                    {product.isFree ? 'Free' : `SAR ${product.price}`}
                                  </span>
                                )}
                              </div>
                              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </>
                      ) : (
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                              {product.thumbnail ? (
                                <img
                                  src={product.thumbnail}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
                                  <IconComponent className="w-8 h-8 text-emerald-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                                <div className="flex items-center gap-1">
                                  {product.isFeatured && (
                                    <Badge className="bg-yellow-400 text-yellow-900 text-xs">
                                      <Star className="w-3 h-3 mr-1" />
                                    </Badge>
                                  )}
                                  <Badge className={pricingColors[product.pricingTier as keyof typeof pricingColors] + ' text-xs'}>
                                    {product.pricingTier}
                                  </Badge>
                                </div>
                              </div>
                              <CardDescription className="line-clamp-2 mb-3">
                                {product.description}
                              </CardDescription>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                                    <span>{product.rating.toFixed(1)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Download className="w-4 h-4" />
                                    <span>{product.downloadCount}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {product.originalPrice && product.originalPrice > product.price ? (
                                    <>
                                      <span className="font-bold text-emerald-600">SAR {product.price}</span>
                                      <span className="text-sm text-muted-foreground line-through">SAR {product.originalPrice}</span>
                                    </>
                                  ) : (
                                    <span className="font-bold text-emerald-600">
                                      {product.isFree ? 'Free' : `SAR ${product.price}`}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Custom Digital Solutions?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We create tailored digital products for your specific business needs. 
            Contact us for custom solutions and enterprise pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/contact">
                Get Custom Solution
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/digital-products/enterprise">
                Enterprise Plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}