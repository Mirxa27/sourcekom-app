'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  BookOpen, 
  Video, 
  FileText, 
  MessageCircle, 
  Download,
  ExternalLink,
  Clock,
  Star,
  TrendingUp,
  Users,
  Headphones,
  Shield,
  CreditCard,
  Truck,
  Building,
  HelpCircle,
  ChevronRight,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
    { id: 'resources', name: 'Resources', icon: Download, color: 'bg-green-100 text-green-600' },
    { id: 'payments', name: 'Payments & Billing', icon: CreditCard, color: 'bg-purple-100 text-purple-600' },
    { id: 'legal', name: 'Legal Services', icon: Shield, color: 'bg-orange-100 text-orange-600' },
    { id: 'account', name: 'Account Management', icon: Users, color: 'bg-pink-100 text-pink-600' },
    { id: 'technical', name: 'Technical Support', icon: Headphones, color: 'bg-indigo-100 text-indigo-600' }
  ]

  const helpArticles = [
    {
      id: 1,
      title: 'Getting Started with SourceKom',
      category: 'getting-started',
      description: 'Learn how to create your account and start using our platform effectively.',
      readTime: '5 min read',
      views: 1234,
      rating: 4.8,
      featured: true,
      slug: 'getting-started-guide'
    },
    {
      id: 2,
      title: 'How to Upload and Sell Resources',
      category: 'resources',
      description: 'Complete guide on uploading your resources and setting up pricing.',
      readTime: '8 min read',
      views: 892,
      rating: 4.7,
      featured: true,
      slug: 'upload-sell-resources'
    },
    {
      id: 3,
      title: 'Understanding Payment Processing',
      category: 'payments',
      description: 'Learn about our payment methods, security, and refund policies.',
      readTime: '6 min read',
      views: 756,
      rating: 4.6,
      featured: false,
      slug: 'payment-processing'
    },
    {
      id: 4,
      title: 'Legal Consultation Services',
      category: 'legal',
      description: 'How to book and prepare for legal consultations.',
      readTime: '7 min read',
      views: 623,
      rating: 4.9,
      featured: true,
      slug: 'legal-consultation-services'
    },
    {
      id: 5,
      title: 'Managing Your Account Settings',
      category: 'account',
      description: 'Customize your profile, notifications, and privacy settings.',
      readTime: '4 min read',
      views: 445,
      rating: 4.5,
      featured: false,
      slug: 'account-settings'
    },
    {
      id: 6,
      title: 'Troubleshooting Common Issues',
      category: 'technical',
      description: 'Solutions to frequently encountered technical problems.',
      readTime: '10 min read',
      views: 1567,
      rating: 4.4,
      featured: false,
      slug: 'troubleshooting-guide'
    },
    {
      id: 7,
      title: 'Creating Your First Resource Listing',
      category: 'resources',
      description: 'Step-by-step guide to creating an effective resource listing that attracts buyers.',
      readTime: '6 min read',
      views: 1123,
      rating: 4.7,
      featured: false,
      slug: 'create-resource-listing'
    },
    {
      id: 8,
      title: 'Payment Methods Explained',
      category: 'payments',
      description: 'Detailed overview of all available payment methods including MyFatoorah integration.',
      readTime: '5 min read',
      views: 987,
      rating: 4.6,
      featured: false,
      slug: 'payment-methods'
    },
    {
      id: 9,
      title: 'Understanding VAT and Tax Compliance',
      category: 'legal',
      description: 'Learn about VAT requirements and tax compliance for Saudi Arabia businesses.',
      readTime: '9 min read',
      views: 756,
      rating: 4.8,
      featured: false,
      slug: 'vat-tax-compliance'
    },
    {
      id: 10,
      title: 'Resource Categories and Organization',
      category: 'resources',
      description: 'How to properly categorize and organize your resources for better visibility.',
      readTime: '4 min read',
      views: 654,
      rating: 4.5,
      featured: false,
      slug: 'resource-categories'
    },
    {
      id: 11,
      title: 'Security Best Practices',
      category: 'account',
      description: 'Essential security tips to protect your account and transactions.',
      readTime: '7 min read',
      views: 1456,
      rating: 4.9,
      featured: true,
      slug: 'security-best-practices'
    },
    {
      id: 12,
      title: 'Refund and Cancellation Policy',
      category: 'payments',
      description: 'Complete guide to our refund and cancellation policies for digital products.',
      readTime: '5 min read',
      views: 823,
      rating: 4.5,
      featured: false,
      slug: 'refund-cancellation-policy'
    },
    {
      id: 13,
      title: 'Digital Product Licensing',
      category: 'resources',
      description: 'Understanding different license types and usage rights for digital products.',
      readTime: '8 min read',
      views: 567,
      rating: 4.7,
      featured: false,
      slug: 'digital-product-licensing'
    },
    {
      id: 14,
      title: 'Business Registration Assistance',
      category: 'legal',
      description: 'How SourceKom can help with business registration and licensing in Saudi Arabia.',
      readTime: '10 min read',
      views: 445,
      rating: 4.8,
      featured: false,
      slug: 'business-registration'
    },
    {
      id: 15,
      title: 'Analytics and Reporting Dashboard',
      category: 'account',
      description: 'How to use analytics to track your resource performance and earnings.',
      readTime: '6 min read',
      views: 723,
      rating: 4.6,
      featured: false,
      slug: 'analytics-dashboard'
    },
    {
      id: 16,
      title: 'Mobile App Usage Guide',
      category: 'technical',
      description: 'Complete guide to using SourceKom mobile app on iOS and Android devices.',
      readTime: '5 min read',
      views: 934,
      rating: 4.5,
      featured: false,
      slug: 'mobile-app-guide'
    },
    {
      id: 17,
      title: 'Privacy and Data Protection',
      category: 'account',
      description: 'How we protect your data and what privacy controls are available.',
      readTime: '6 min read',
      views: 1123,
      rating: 4.7,
      featured: false,
      slug: 'privacy-data-protection'
    },
    {
      id: 18,
      title: 'API Integration Guide',
      category: 'technical',
      description: 'Developer guide for integrating SourceKom API into your applications.',
      readTime: '12 min read',
      views: 456,
      rating: 4.8,
      featured: false,
      slug: 'api-integration-guide'
    }
  ]

  const videoTutorials = [
    {
      id: 1,
      title: 'Platform Overview Tour',
      duration: '12:34',
      thumbnail: '/api/placeholder/320/180',
      views: 2341,
      category: 'getting-started'
    },
    {
      id: 2,
      title: 'Resource Upload Guide',
      duration: '8:45',
      thumbnail: '/api/placeholder/320/180',
      views: 1876,
      category: 'resources'
    },
    {
      id: 3,
      title: 'Payment Process Tutorial',
      duration: '6:23',
      thumbnail: '/api/placeholder/320/180',
      views: 1234,
      category: 'payments'
    }
  ]

  const quickActions = [
    { title: 'Contact Support', description: 'Get help from our support team', icon: MessageCircle, href: '/help/support', color: 'bg-blue-500' },
    { title: 'Video Tutorials', description: 'Watch step-by-step guides', icon: Video, href: '/help/videos', color: 'bg-green-500' },
    { title: 'API Documentation', description: 'Developer resources and docs', icon: FileText, href: '/help/docs', color: 'bg-purple-500' },
    { title: 'Community Forum', description: 'Connect with other users', icon: Users, href: '/help/community', color: 'bg-orange-500' }
  ]

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--sourcekom-blue)] to-[var(--sourcekom-blue-light)] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-white/30">
              Help Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How can we help you today?
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Find answers, guides, and support for all SourceKom services
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for help articles, videos, and guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[var(--sourcekom-blue)] mb-1">150+</div>
              <div className="text-sm text-muted-foreground">Help Articles</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600 mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Live Support</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600 mb-1">95%</div>
              <div className="text-sm text-muted-foreground">Issue Resolution</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600 mb-1">&lt;2hr</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
              <Link href={action.href}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-[var(--sourcekom-blue)] transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {action.description}
                  </p>
                  <div className="flex items-center text-sm text-[var(--sourcekom-blue)]">
                    Learn more <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Categories */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center justify-between ${
                      selectedCategory === 'all' ? 'bg-muted border-l-4 border-[var(--sourcekom-blue)]' : ''
                    }`}
                  >
                    <span>All Categories</span>
                    <Badge variant="secondary">{helpArticles.length}</Badge>
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center justify-between ${
                        selectedCategory === category.id ? 'bg-muted border-l-4 border-[var(--sourcekom-blue)]' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                          <category.icon className="w-4 h-4" />
                        </div>
                        <span>{category.name}</span>
                      </div>
                      <Badge variant="secondary">
                        {helpArticles.filter(a => a.category === category.id).length}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Articles */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                  Popular Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {helpArticles
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 3)
                    .map((article) => (
                      <div key={article.id} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[var(--sourcekom-blue)] rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm leading-tight mb-1 hover:text-[var(--sourcekom-blue)] cursor-pointer transition-colors">
                            {article.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="articles" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
                <TabsTrigger value="guides">Quick Guides</TabsTrigger>
              </TabsList>

              <TabsContent value="articles" className="space-y-6">
                {searchQuery && (
                  <div className="text-muted-foreground">
                    Found {filteredArticles.length} results for "{searchQuery}"
                  </div>
                )}

                <div className="grid gap-6">
                  {filteredArticles.map((article) => (
                    <Card key={article.id} className="hover:shadow-lg transition-all duration-200 group">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              {article.featured && (
                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                              <Badge variant="outline">
                                {categories.find(c => c.id === article.category)?.name}
                              </Badge>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--sourcekom-blue)] transition-colors cursor-pointer">
                              {article.title}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {article.description}
                            </p>
                            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{article.readTime}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{article.views} views</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>{article.rating}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" className="ml-4 group-hover:bg-[var(--sourcekom-blue)] group-hover:text-white transition-colors" asChild>
                            <Link href={`/help/articles/${article.slug}`}>
                              <ArrowRight className="w-5 h-5" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="videos" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoTutorials.map((video) => (
                    <Card key={video.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                      <div className="relative">
                        <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                          <Video className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-black ml-1" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-[var(--sourcekom-blue)] transition-colors">
                          {video.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{video.views} views</span>
                          <Badge variant="secondary">
                            {categories.find(c => c.id === video.category)?.name}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="guides" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Beginner's Guide</h3>
                    <p className="text-muted-foreground mb-4">
                      Start your journey with SourceKom through our comprehensive beginner's guide.
                    </p>
                    <Button variant="outline" className="w-full">
                      Start Learning
                    </Button>
                  </Card>

                  <Card className="p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Advanced Tips</h3>
                    <p className="text-muted-foreground mb-4">
                      Master advanced features and optimize your resource management strategy.
                    </p>
                    <Button variant="outline" className="w-full">
                      Explore Advanced
                    </Button>
                  </Card>

                  <Card className="p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Security Best Practices</h3>
                    <p className="text-muted-foreground mb-4">
                      Learn how to keep your account and data secure with our security guidelines.
                    </p>
                    <Button variant="outline" className="w-full">
                      Security Guide
                    </Button>
                  </Card>

                  <Card className="p-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                      <CreditCard className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Billing Help</h3>
                    <p className="text-muted-foreground mb-4">
                      Understand billing, payments, refunds, and subscription management.
                    </p>
                    <Button variant="outline" className="w-full">
                      Billing Guide
                    </Button>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-[var(--sourcekom-blue)]/10 to-[var(--sourcekom-yellow)]/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Still need help?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our support team is available 24/7 to help you with any questions or issues you might have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[var(--sourcekom-blue)] hover:bg-[var(--sourcekom-blue-light)] text-white" asChild>
              <Link href="/help/support">
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Support
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/help/faq">
                <HelpCircle className="w-5 h-5 mr-2" />
                Browse FAQ
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Play({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
  )
}