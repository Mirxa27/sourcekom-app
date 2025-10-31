'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/app-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search as SearchIcon, 
  Filter, 
  Star, 
  Download, 
  Eye,
  Building,
  FileText,
  Users,
  Loader2,
  X
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SearchResult {
  query: string
  type: string
  resources?: {
    items: any[]
    total: number
    totalPages: number
  }
  categories?: {
    items: any[]
    total: number
  }
  users?: {
    items: any[]
    total: number
  }
  pagination: {
    currentPage: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
    totalItems: number
    totalPages: number
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [searchType, setSearchType] = useState<'all' | 'resources' | 'categories' | 'users'>('all')
  const [category, setCategory] = useState<string>('')
  const [priceMin, setPriceMin] = useState<string>('')
  const [priceMax, setPriceMax] = useState<string>('')
  const [isFree, setIsFree] = useState<string>('')
  const [sort, setSort] = useState<'relevance' | 'newest' | 'oldest' | 'price_low' | 'price_high' | 'popular'>('relevance')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (query) {
      performSearch()
    }
  }, [query, searchType, category, priceMin, priceMax, isFree, sort])

  const performSearch = async () => {
    if (!query.trim()) {
      setResults(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        q: query,
        type: searchType,
        sort,
        page: '1',
        limit: '20'
      })

      if (category) params.append('category', category)
      if (priceMin) params.append('priceMin', priceMin)
      if (priceMax) params.append('priceMax', priceMax)
      if (isFree !== '') params.append('isFree', isFree)

      const response = await fetch(`/api/search?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setResults(data)
        // Update URL without reload
        router.push(`/search?${params.toString()}`, { scroll: false })
      } else {
        setError(data.error || 'Search failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  const clearFilters = () => {
    setCategory('')
    setPriceMin('')
    setPriceMax('')
    setIsFree('')
    setSort('relevance')
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Search</h1>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for resources, categories, or users..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={loading || !query.trim()}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <SearchIcon className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="resources">Resources</SelectItem>
                  <SelectItem value="categories">Categories</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                </SelectContent>
              </Select>

              {searchType === 'all' || searchType === 'resources' ? (
                <>
                  <Select value={isFree} onValueChange={setIsFree}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Prices</SelectItem>
                      <SelectItem value="true">Free</SelectItem>
                      <SelectItem value="false">Paid</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    placeholder="Min price"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-[120px]"
                  />
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-[120px]"
                  />

                  <Select value={sort} onValueChange={(value: any) => setSort(value)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="price_low">Price: Low to High</SelectItem>
                      <SelectItem value="price_high">Price: High to Low</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              ) : null}

              {(category || priceMin || priceMax || isFree) && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && results && (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Found {results.pagination.totalItems} result{results.pagination.totalItems !== 1 ? 's' : ''} for &quot;{query}&quot;
              </p>
            </div>

            {/* Resources Results */}
            {results.resources && results.resources.items.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Resources ({results.resources.total})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.resources.items.map((resource: any) => (
                    <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                      <Link href={`/resources/${resource.slug}`}>
                        <CardHeader>
                          <div className="relative w-full h-48 mb-4">
                            <Image
                              src={resource.thumbnail || '/images/placeholders/digital-product.svg'}
                              alt={resource.title}
                              fill
                              className="object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/images/placeholders/digital-product.svg'
                              }}
                            />
                          </div>
                          <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {resource.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {resource.isFree ? (
                                <Badge variant="secondary">Free</Badge>
                              ) : (
                                <Badge>SAR {resource.price}</Badge>
                              )}
                              {resource.averageRating > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">{resource.averageRating}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Download className="w-4 h-4" />
                                {resource.downloadCount}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {resource.viewCount}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Results */}
            {results.categories && results.categories.items.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Building className="w-6 h-6" />
                  Categories ({results.categories.total})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.categories.items.map((category: any) => (
                    <Card key={category.id} className="hover:shadow-lg transition-shadow">
                      <Link href={`/resources?category=${category.slug}`}>
                        <CardHeader>
                          <CardTitle>{category.name}</CardTitle>
                          <CardDescription>{category.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="outline">
                            {category.resourceCount || 0} resources
                          </Badge>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Users Results */}
            {results.users && results.users.items.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Users ({results.users.total})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.users.items.map((user: any) => (
                    <Card key={user.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle>{user.name || user.email}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            {user._count?.resources || 0} resources
                          </Badge>
                          <Badge variant="outline">
                            {user._count?.purchases || 0} purchases
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {results.pagination.totalItems === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    No results found for &quot;{query}&quot;
                  </p>
                  <Button variant="outline" onClick={() => setQuery('')}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!loading && !error && !results && (
          <Card>
            <CardContent className="pt-6 text-center">
              <SearchIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Enter a search query to find resources, categories, or users
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}

