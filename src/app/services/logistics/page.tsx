'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Truck, 
  Package, 
  Globe, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Building,
  Phone,
  Mail
} from 'lucide-react'
import Link from 'next/link'

export default function LogisticsPage() {
  const features = [
    {
      icon: Package,
      title: "Supply Chain Optimization",
      description: "Streamline your supply chain processes for maximum efficiency and cost reduction."
    },
    {
      icon: Truck,
      title: "Fleet Management",
      description: "Comprehensive fleet management solutions to optimize your transportation operations."
    },
    {
      icon: Globe,
      title: "Global Logistics",
      description: "International logistics solutions for import/export and global supply chain management."
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Data-driven insights to improve logistics performance and reduce operational costs."
    }
  ]

  const benefits = [
    "30% reduction in transportation costs",
    "25% improvement in delivery times",
    "40% reduction in inventory holding costs",
    "99% on-time delivery rate",
    "24/7 logistics support",
    "Real-time tracking and monitoring"
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
          Logistics & Supply Chain
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Logistics and Supply Chain Management
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transform your logistics operations with our comprehensive supply chain solutions designed for Saudi Arabian market.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Service Overview</CardTitle>
              <CardDescription>
                Our logistics and supply chain management services help businesses optimize their operations, reduce costs, and improve efficiency across entire supply chain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                <p className="text-muted-foreground mb-4">
                  SourceKom provides end-to-end logistics solutions tailored to your business needs. From inventory management to last-mile delivery, we ensure your supply chain operates at peak efficiency.
                </p>
                <p className="text-muted-foreground">
                  Our team of logistics experts combines local market knowledge with international best practices to deliver solutions that drive growth and profitability for your business.
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
                  <div className="text-3xl font-bold text-emerald-600">SAR 5,000</div>
                  <div className="text-muted-foreground">Starting from</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Custom pricing based on your specific logistics requirements and scale of operations.
                </p>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                  <Link href="/contact">
                    Get Custom Quote
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Process Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Our Process</CardTitle>
          <CardDescription>
            How we transform your logistics operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Assessment</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive analysis of your current logistics operations and challenges.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Strategy</h3>
              <p className="text-sm text-muted-foreground">
                Development of customized logistics strategy and implementation plan.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Implementation</h3>
              <p className="text-sm text-muted-foreground">
                Execution of logistics solutions with minimal disruption to your operations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Continuous monitoring and improvement of logistics performance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Optimize Your Supply Chain?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Let our logistics experts help you transform your supply chain operations and drive business growth.
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