'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StructuredData } from '@/components/layout/structured-data'
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
  Download
} from 'lucide-react'
import Link from 'next/link'
import { TestimonialModal } from '@/components/testimonials/testimonial-modal'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredResources, setFeaturedResources] = useState([])
  const [categories, setCategories] = useState([])
  const [email, setEmail] = useState('')
  const [showTestimonialModal, setShowTestimonialModal] = useState(false)

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
      if (response.ok) {
        const data = await response.json()
        setFeaturedResources(data)
      }
    } catch (error) {
      console.error('Failed to fetch featured resources:', error)
    }
  }

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
          alert('Thank you for subscribing! You will receive updates at: ' + email)
          setEmail('')
        } else {
          const data = await response.json()
          alert(data.error || 'Subscription failed. Please try again.')
        }
      } catch (error) {
        alert('Subscription failed. Please try again.')
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
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50/50 via-white to-yellow-50/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <Badge className="mb-6 inline-block bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 px-4 py-2">
              Welcome to the Future of Resource Management
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-yellow-600 bg-clip-text text-transparent leading-tight">
              Revolutionizing Resource Management<br className="hidden md:block" />
              <span className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                in Saudi Arabia
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              SourceKom connects businesses to maximize potential and foster sustainable growth through resource optimization in logistics and supply chain management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8" asChild>
                <Link href="/register">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8" asChild>
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
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors">500+</div>
              <div className="text-sm md:text-base text-muted-foreground">Trusted Businesses</div>
            </button>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">30%</div>
              <div className="text-sm md:text-base text-muted-foreground">Cost Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-sm md:text-base text-muted-foreground">Secure Platform</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-sm md:text-base text-muted-foreground">Support</div>
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
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-blue-600">247</CardTitle>
                <CardDescription>Active Available Resources</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Click to view your listed resources</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Handshake className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-yellow-600">89</CardTitle>
                <CardDescription>Active Bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Click to view booking history</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-purple-600">SAR 458K</CardTitle>
                <CardDescription>Total Revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Click to view financial reports</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-orange-600">78%</CardTitle>
                <CardDescription>Utilization Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">Resource utilization efficiency</p>
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
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
                About SourceKom
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Adding strength to businesses, businesses to strengths
              </h2>
              <p className="text-muted-foreground mb-6">
                SourceKom is an innovative resource sharing and legal consultancy platform operating in Saudi Arabia. The name "SourceKom" combines the English word "source" with "Kom," which means "Yours" in Arabic, expressing the company's concept of being the ideal resource partner clients can count on.
              </p>
              <p className="text-muted-foreground mb-8">
                Founded by Abdullah Mirza, a motivated entrepreneur with over a decade of experience in business development, SourceKom is transforming the Saudi Arabian market by enabling businesses to exchange underutilized resources and providing expert legal consultancy, fostering a new era of efficiency and sustainability.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link href="/about">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Our Vision</h3>
                <p className="text-sm text-muted-foreground">
                  Revolutionizing the Saudi market through resource optimization and legal expertise
                </p>
              </Card>
              <Card className="text-center p-6">
                <Lightbulb className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Our Mission</h3>
                <p className="text-sm text-muted-foreground">
                  Empowering businesses with strength and connectivity for sustainable growth
                </p>
              </Card>
              <Card className="text-center p-6">
                <Shield className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Legal Expertise</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive legal guidance for Saudi market operations
                </p>
              </Card>
              <Card className="text-center p-6">
                <Zap className="w-8 h-8 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Resource Sharing</h3>
                <p className="text-sm text-muted-foreground">
                  Optimize resource utilization across businesses
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Resources</h2>
              <p className="text-muted-foreground">
                Discover our most popular and highly-rated resources
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.slice(0, 6).map((resource: any) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{resource.category}</Badge>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm ml-1">{resource.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-blue-600">
                        SAR {resource.price}
                      </span>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/resources/${resource.slug}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link href="/resources">
                  View All Resources
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

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
                    <Card className="text-center p-6 hover:shadow-md transition-all hover:scale-105">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
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
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
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
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                required
              />
              <Button type="submit" variant="secondary">
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