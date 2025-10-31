'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Leaf, 
  Recycle, 
  Globe,
  CheckCircle,
  ArrowRight,
  Building
} from 'lucide-react'
import Link from 'next/link'

export default function SustainabilityPage() {
  const features = [
    {
      icon: Leaf,
      title: "Green Operations",
      description: "Implement environmentally friendly business practices."
    },
    {
      icon: Recycle,
      title: "Resource Optimization",
      description: "Minimize waste through efficient resource utilization."
    },
    {
      icon: Shield,
      title: "Sustainable Compliance",
      description: "Ensure compliance with environmental regulations."
    },
    {
      icon: Globe,
      title: "Impact Assessment",
      description: "Measure and reduce your environmental footprint."
    }
  ]

  const benefits = [
    "50% reduction in environmental impact",
    "30% cost savings through sustainability",
    "Enhanced brand reputation",
    "Regulatory compliance assurance",
    "Access to green financing",
    "Improved employee engagement"
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
          Sustainability
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Sustainable Business Practices
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Implement environmentally friendly practices that also improve your bottom line.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Service Overview</CardTitle>
              <CardDescription>
                Transform your business with sustainable practices that benefit both the environment and your profitability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                <p className="text-muted-foreground mb-4">
                  Our sustainability services help businesses implement environmentally friendly practices that not only reduce environmental impact but also improve operational efficiency and profitability.
                </p>
                <p className="text-muted-foreground">
                  We work with you to develop comprehensive sustainability strategies aligned with Saudi Vision 2030 and global best practices.
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
                  <div className="text-3xl font-bold text-emerald-600">SAR 3,500</div>
                  <div className="text-muted-foreground">Starting from</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Custom sustainability packages based on your business size and environmental goals.
                </p>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                  <Link href="/contact">
                    Get Assessment
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
              Ready to Go Sustainable?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join the growing number of Saudi businesses embracing sustainability for a better future.
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
  )
}