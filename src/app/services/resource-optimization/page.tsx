'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building, 
  Users, 
  Truck, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react'
import Link from 'next/link'

export default function ResourceOptimizationPage() {
  const features = [
    {
      icon: Building,
      title: "Asset Sharing",
      description: "Monetize underutilized assets by sharing them with other businesses."
    },
    {
      icon: Users,
      title: "Personnel Exchange",
      description: "Optimize workforce utilization through temporary personnel sharing."
    },
    {
      icon: Truck,
      title: "Equipment Pooling",
      description: "Reduce capital expenditure through shared equipment resources."
    },
    {
      icon: TrendingUp,
      title: "Cost Optimization",
      description: "Identify and eliminate resource waste across your operations."
    }
  ]

  const benefits = [
    "35% reduction in operational costs",
    "50% improvement in asset utilization",
    "25% reduction in capital expenditure",
    "Access to premium resources without ownership",
    "Flexible scaling based on demand",
    "Sustainable business practices"
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
          Resource Optimization
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Resource Optimization and Exchange
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Maximize the value of your business resources through our innovative sharing and optimization platform.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Service Overview</CardTitle>
              <CardDescription>
                Transform your underutilized resources into revenue-generating assets while accessing premium resources when needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                <p className="text-muted-foreground mb-4">
                  SourceKom's resource optimization platform enables businesses to share, rent, and exchange various resources including office spaces, equipment, personnel, and storage facilities.
                </p>
                <p className="text-muted-foreground">
                  Our platform creates a circular economy where businesses can monetize idle assets while accessing resources on-demand, leading to significant cost savings and improved operational efficiency.
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
                  <div className="text-3xl font-bold text-emerald-600">2.5%</div>
                  <div className="text-muted-foreground">Transaction Fee</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Simple transparent pricing. Only pay when you successfully rent or share resources.
                </p>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                  <Link href="/resources">
                    Browse Resources
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
              Start Optimizing Your Resources Today
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join hundreds of Saudi businesses already saving money and generating revenue through resource sharing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                <Link href="/register">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/resources">
                  Browse Resources
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}