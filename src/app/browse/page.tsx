'use client'

import { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Search, Filter, Grid, List, Star, Download, Heart, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { AppLayout } from '@/components/layout/app-layout'
import { useSearchParams } from 'next/navigation'

function BrowseContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '')
  const [resources, setResources] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 200],
    isFree: false,
    sortBy: 'newest'
  })
  const [showFilters, setShowFilters] = useState(false)

  const categoryIcons = {
    'Code': '💻',
    'Design': '🎨',
    'Music': '🎵',
    'Video': '🎬',
    'Documents': '📄',
    'Templates': '📋',
  }

  useEffect(() => {
    fetchCategories()
    fetchResources()
  }, [searchQuery, filters])

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

  const fetchResources = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (filters.category) params.append('category', filters.category)
      if (filters.isFree) params.append('isFree', 'true')
      params.append('minPrice', filters.priceRange[0].toString())
      params.append('maxPrice', filters.priceRange[1].toString())
      params.append('sortBy', filters.sortBy)

      const response = await fetch(`/api/resources?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setResources(data.resources || [])
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchResources()
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 200],
      isFree: false,
      sortBy: 'newest'
    })
  }

  const activeFiltersCount = [
    filters.category,
    filters.isFree,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 200
  ].filter(Boolean).length

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Search and Filters Section */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
              </form>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All categories</SelectItem>
                        {categories.map((category: any) => (
                          <SelectItem key={category.id} value={category.slug}>
                            <div className="flex items-center gap-2">
                              <span>{categoryIcons[category.name as keyof typeof categoryIcons] || '📁'}</span>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Price Range: SAR {filters.priceRange[0]} - {filters.priceRange[1]}
                    </label>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                      max={200}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  {/* Free Only */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="free-only"
                      checked={filters.isFree}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, isFree: !!checked }))}
                    />
                    <label htmlFor="free-only" className="text-sm font-medium">
                      Free resources only
                    </label>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort by</label>
                    <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest first</SelectItem>
                        <SelectItem value="oldest">Oldest first</SelectItem>
                        <SelectItem value="price-low">Price: Low to high</SelectItem>
                        <SelectItem value="price-high">Price: High to low</SelectItem>
                        <SelectItem value="popular">Most popular</SelectItem>
                        <SelectItem value="rating">Highest rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Browse Resources'}
          </h1>
          <p className="text-muted-foreground">
            {resources.length} {resources.length === 1 ? 'resource' : 'resources'} found
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">No resources found</h2>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {resources.map((resource: any) => (
              <Link key={resource.id} href={`/resources/${resource.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  {viewMode === 'grid' ? (
                    <>
                      <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative">
                        {resource.thumbnail ? (
                          <img
                            src={resource.thumbnail}
                            alt={resource.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/images/placeholders/digital-product.svg'
                              target.onerror = null
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-4xl">
                              📁
                            </span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Button variant="secondary" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        {resource.isFree && (
                          <Badge variant="secondary" className="absolute top-2 left-2">
                            Free
                          </Badge>
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                          <Badge variant={resource.isFree ? "secondary" : "default"}>
                            {resource.isFree ? "Free" : `SAR ${resource.price}`}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {resource.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-current" />
                            <span>{resource.averageRating || 0}</span>
                            <span className="text-xs">({resource.reviewCount || 0})</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="w-4 h-4" />
                            <span>{resource.downloadCount}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            by {resource.author?.name || 'Anonymous'}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {resource.category?.name || 'Uncategorized'}
                          </Badge>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <div className="p-6">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {resource.thumbnail ? (
                            <img
                              src={resource.thumbnail}
                              alt={resource.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/images/placeholders/digital-product.svg'
                                target.onerror = null
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-2xl">
                                📁
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold line-clamp-1">{resource.title}</h3>
                            <div className="flex items-center gap-2">
                              {resource.isFree && (
                                <Badge variant="secondary">Free</Badge>
                              )}
                              <Badge variant={resource.isFree ? "secondary" : "default"}>
                                {resource.isFree ? "Free" : `SAR ${resource.price}`}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-muted-foreground line-clamp-2 mb-2">
                            {resource.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4 text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-current" />
                                <span>{resource.averageRating || 0}</span>
                                <span className="text-xs">({resource.reviewCount || 0})</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Download className="w-4 h-4" />
                                <span>{resource.downloadCount}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                by {resource.author?.name || 'Anonymous'}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {resource.category?.name || 'Uncategorized'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  </AppLayout>
  )
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <AppLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppLayout>
    }>
      <BrowseContent />
    </Suspense>
  )
}
