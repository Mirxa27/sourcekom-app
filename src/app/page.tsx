'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StructuredData } from '@/components/layout/structured-data'
import { useToast } from '@/hooks/use-toast'
import { 
  Search, 
  Users, 
  Building, 
  Truck, 
  FileText, 
  TrendingUp,
  Handshake,
  BarChart3,
  Target,
  Lightbulb,
  Shield,
  Zap,
  ArrowRight,
  Star,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { TestimonialModal } from '@/components/testimonials/testimonial-modal'

type FeaturedResource = {
  id: string
  title: string
  description: string
  price: number
  category: { id: string; name: string; slug: string } | string | null
  averageRating?: number
  rating?: number
  reviewCount?: number
  slug: string
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredResources, setFeaturedResources] = useState<FeaturedResource[]>([])
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [showTestimonialModal, setShowTestimonialModal] = useState(false)
  const { toast } = useToast()

  const categoryIcons = {
    'Office Space': Building,
    'Equipment': Truck,
    'Personnel': Users,
    'Storage': Building,
    'Vehicles': Truck,
    'Legal Services': FileText,
  }

  useEffect(() => {
    fetchFeaturedResources()
    fetchCategories()
  }, [])

  const fetchFeaturedResources = async () => {
    try {
      const response = await fetch('/api/resources/featured')
      if (!response.ok) {
        throw new Error('Failed to load featured resources')
      }

      const data: FeaturedResource[] = await response.json()
      setFeaturedResources(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch featured resources:', error)
      setFeaturedResources([])
      toast({
        title: 'Unable to load featured resources',
        description: 'Please try again shortly. Our team has been notified.',
        variant: 'destructive'
      })
    } finally {
      setIsLoadingFeatured(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) {
        throw new Error('Failed to load categories')
      }

      const data = await response.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast({
        title: 'Unable to load categories',
        description: 'Refresh the page or try again later.',
        variant: 'destructive'
      })
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/browse?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })

        if (response.ok) {
          toast({
            title: 'Subscription confirmed',
            description: `Updates will be sent to ${email}.`
          })
          setEmail('')
        } else {
          const data = await response.json()
          toast({
            title: 'Subscription failed',
            description: data.error || 'Please try again.',
            variant: 'destructive'
          })
        }
      } catch (error) {
        toast({
          title: 'Subscription failed',
          description: 'Please check your connection and try again.',
          variant: 'destructive'
        })
      }
    }
  }

  return (
    <AppLayout>
      <StructuredData 
        type="WebSite"
        data={{
          name: 'SourceKom',
          alternateName: 'SourceKom Saudi Arabia',
          description: 'Resource management and legal consultancy platform in Saudi Arabia'
        }}
      />
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand/10 via-app to-brand-secondary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <Badge className="mb-6 inline-block bg-brand/15 text-brand hover:bg-brand/25 border-brand/30 px-4 py-2">
              Welcome to the Future of Resource Management
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-brand bg-clip-text text-transparent leading-tight">
              Revolutionizing Resource Management<br className="hidden md:block" />
              <span className="text-4xl md:text-6xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                in Saudi Arabia
              </span>
            </h1>
            <p className="text-lg md:text-xl text-app-muted mb-8 max-w-3xl mx-auto leading-relaxed">
              SourceKom connects businesses to maximize potential and foster sustainable growth through resource optimization in logistics and supply chain management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" variant="brand" className="px-8" asChild>
                <Link href="/register">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 border-2 border-brand text-brand hover:bg-brand hover:text-app transition-all" asChild>
                <Link href="/approach">
                  Our Approach
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
              <button
                onClick={() => setShowTestimonialModal(true)}
                className="text-center hover:scale-105 transition-transform cursor-pointer group"
              >
                <div className="text-3xl md:text-4xl font-bold text-brand mb-2 group-hover:text-brand-deep transition-colors">500+</div>
                <div className="text-sm md:text-base text-app-muted">Trusted Businesses</div>
              </button>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand mb-2">30%</div>
                <div className="text-sm md:text-base text-app-muted">Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand mb-2">100%</div>
                <div className="text-sm md:text-base text-app-muted">Secure Platform</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand mb-2">24/7</div>
                <div className="text-sm md:text-base text-app-muted">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Find the Resources You Need</h2>
            <p className="text-muted-foreground text-lg">
              Search through our extensive database of verified resources and services
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="Search for resources, services, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-12 text-base"
              />
              <Button type="submit" size="lg" className="h-12 px-8">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Resource Overview */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Resource Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-brand/30">
              <CardHeader>
                <div className="w-12 h-12 bg-brand/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building className="w-6 h-6 text-brand" />
                </div>
                <CardTitle className="text-2xl font-bold text-brand">247</CardTitle>
                <CardDescription>Active Available Resources</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-app-muted">Click to view your listed resources</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-brand-secondary/30">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-secondary/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Handshake className="w-6 h-6 text-brand-secondary" />
                </div>
                <CardTitle className="text-2xl font-bold text-brand-secondary">89</CardTitle>
                <CardDescription>Active Bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-app-muted">Click to view booking history</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-brand/30">
              <CardHeader>
                <div className="w-12 h-12 bg-brand/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-brand" />
                </div>
                <CardTitle className="text-2xl font-bold text-brand">SAR 458K</CardTitle>
                <CardDescription>Total Revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-app-muted">Click to view financial reports</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-brand-secondary/30">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-secondary/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-brand-secondary" />
                </div>
                <CardTitle className="text-2xl font-bold text-brand-secondary">78%</CardTitle>
                <CardDescription>Utilization Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge className="mb-2 bg-brand-secondary/15 text-brand-secondary">
                  78% utilization
                </Badge>
                <p className="text-xs text-app-muted">Resource utilization efficiency</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-brand/15 text-brand hover:bg-brand/25 border-brand/30">
                About SourceKom
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Adding strength to businesses, businesses to strengths
              </h2>
              <p className="text-app-muted mb-6">
                SourceKom is an innovative resource sharing and legal consultancy platform operating in Saudi Arabia. The name "SourceKom" combines the English word "source" with "Kom," which means "Yours" in Arabic, expressing the company's concept of being the ideal resource partner clients can count on.
              </p>
              <p className="text-app-muted mb-8">
                Founded by Abdullah Mirza, a motivated entrepreneur with over a decade of experience in business development, SourceKom is transforming the Saudi Arabian market by enabling businesses to exchange underutilized resources and providing expert legal consultancy, fostering a new era of efficiency and sustainability.
              </p>
              <Button variant="brand" asChild>
                <Link href="/about">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand/30">
                <div className="w-12 h-12 bg-brand/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-brand" />
                </div>
                <h3 className="font-semibold mb-2">Our Vision</h3>
                <p className="text-sm text-app-muted">
                  Revolutionizing the Saudi market through resource optimization and legal expertise
                </p>
              </Card>
              <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand-secondary/30">
                <div className="w-12 h-12 bg-brand-secondary/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-6 h-6 text-brand-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Our Mission</h3>
                <p className="text-sm text-app-muted">
                  Empowering businesses with strength and connectivity for sustainable growth
                </p>
              </Card>
              <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand/30">
                <div className="w-12 h-12 bg-brand/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-brand" />
                </div>
                <h3 className="font-semibold mb-2">Legal Expertise</h3>
                <p className="text-sm text-app-muted">
                  Comprehensive legal guidance for Saudi market operations
                </p>
              </Card>
              <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand-secondary/30">
                <div className="w-12 h-12 bg-brand-secondary/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-brand-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Resource Sharing</h3>
                <p className="text-sm text-app-muted">
                  Optimize resource utilization across businesses
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Resources</h2>
            <p className="text-muted-foreground">
              Discover our most popular and highly-rated resources
            </p>
          </div>

          {isLoadingFeatured ? (
            <div className="flex justify-center py-12">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading featured resources...
              </div>
            </div>
          ) : featuredResources.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No featured resources yet</h3>
              <p className="text-muted-foreground">
                Check back soon as we add new premium resources for SourceKom members.
              </p>
              <div className="mt-6 flex justify-center">
                <Button variant="brand" asChild>
                  <Link href="/browse">
                    Explore Marketplace
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.slice(0, 6).map((resource) => {
                const categoryLabel = typeof resource.category === 'string'
                  ? resource.category
                  : resource.category?.name || 'Uncategorized'

                const ratingValue = typeof resource.averageRating === 'number'
                  ? resource.averageRating
                  : resource.rating

                return (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{categoryLabel}</Badge>
                        {typeof ratingValue === 'number' && ratingValue > 0 ? (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm ml-1">{ratingValue.toFixed(1)}</span>
                          </div>
                        ) : null}
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-brand">
                          SAR {resource.price}
                        </span>
                        <Button variant="brand" asChild>
                          <Link href={`/resources/${resource.slug}`}>
                            View Detail
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <div className="text-center mt-8">
        <Button variant="outline" size="lg" asChild>
          <Link href="/resources">
            View All Resources
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 px-4 bg-muted/20">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
              <p className="text-muted-foreground">
                Find exactly what you need by exploring our categories
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category: any) => {
                const Icon = categoryIcons[category.name] || FileText
                return (
                  <Link
                    key={category.id}
                    href={`/browse?category=${category.slug}`}
                    className="group"
                  >
                    <Card className="text-center p-6 hover:shadow-md transition-all hover:scale-105 border-2 border-transparent hover:border-brand/30">
                      <div className="w-12 h-12 bg-brand/15 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-brand/25 transition-colors">
                        <Icon className="w-6 h-6 text-brand" />
                      </div>
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                      <p className="text-xs text-app-muted mt-1">
                        {category.resourceCount} resources
                      </p>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-gradient-brand text-app">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-app/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest updates on new resources, 
            services, and exclusive offers tailored for your business needs.
          </p>
          
          <form onSubmit={handleNewsletterSubscribe} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-app/10 border-app/20 text-app placeholder:text-app/60 focus:border-app/40"
                required
              />
              <Button type="submit" variant="secondary" className="bg-app text-brand hover:bg-app/90 shadow-app-lg transition-all">
                Subscribe
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Testimonial Modal */}
      <TestimonialModal
        isOpen={showTestimonialModal}
        onClose={() => setShowTestimonialModal(false)}
      />
    </AppLayout>
  )
}