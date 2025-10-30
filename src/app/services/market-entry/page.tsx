'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  MapPin, 
  Users, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Building
} from 'lucide-react'
import Link from 'next/link'

export default function MarketEntryPage() {
  const features = [
    {
      icon: MapPin,
      title: "Market Research",
      description: "Comprehensive analysis of Saudi market opportunities and challenges."
    },
    {
      icon: Users,
      title: "Local Partnerships",
      description: "Connect with strategic local partners for market entry success."
    },
    {
      icon: Globe,
      title: "Regulatory Guidance",
      description: "Navigate Saudi Arabian regulations and licensing requirements."
    },
    {
      icon: TrendingUp,
      title: "Growth Strategy",
      description: "Develop tailored strategies for market penetration and expansion."
    }
  ]

  const benefits = [
    "70% faster market entry",
    "50% reduction in setup costs",
    "Access to exclusive networks",
    "Regulatory compliance assurance",
    "Local market expertise",
    "Ongoing support and guidance"
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SourceKom</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/services" className="text-foreground font-medium">
                Services
              </Link>
              <Link href="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </Link>
              <Link href="/legal" className="text-muted-foreground hover:text-foreground transition-colors">
                Legal Services
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/services">Back to Services</Link>
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/contact">Get Consultation</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
            Market Entry
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Market Entry and Expansion Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Successfully enter and expand within the Saudi Arabian market with our expert guidance and local connections.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Service Overview</CardTitle>
                <CardDescription>
                  Navigate the complexities of entering the Saudi market with our comprehensive market entry services.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                  <p className="text-muted-foreground mb-4">
                    Our market entry services provide comprehensive support for businesses looking to establish or expand their presence in Saudi Arabia, leveraging our deep local knowledge and extensive network.
                  </p>
                  <p className="text-muted-foreground">
                    From initial market assessment to full-scale operations, we guide you through every step of your Saudi market journey.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {features.map((feature, index) => {
                      const IconComponent = feature.icon
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">SAR 7,500</div>
                    <div className="text-muted-foreground">Starting from</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Customized market entry packages based on your industry, scale, and specific requirements.
                  </p>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link href="/contact">
                      Get Consultation
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Enter the Saudi Market?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Let our market entry experts help you succeed in one of the world's most dynamic markets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                  <Link href="/contact">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/services">
                    View All Services
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}