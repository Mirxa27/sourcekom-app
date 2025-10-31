'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Zap, 
  Settings, 
  Clock,
  CheckCircle,
  ArrowRight,
  Building
} from 'lucide-react'
import Link from 'next/link'

export default function EfficiencyPage() {
  const features = [
    {
      icon: Zap,
      title: "Process Automation",
      description: "Automate repetitive tasks to improve efficiency and reduce errors."
    },
    {
      icon: Settings,
      title: "Workflow Optimization",
      description: "Streamline business processes for maximum productivity."
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Optimize time allocation and resource scheduling."
    },
    {
      icon: BarChart3,
      title: "Performance Monitoring",
      description: "Real-time tracking of operational efficiency metrics."
    }
  ]

  const benefits = [
    "40% increase in operational efficiency",
    "60% reduction in process time",
    "35% cost savings on operations",
    "Improved employee productivity",
    "Better resource utilization",
    "Enhanced customer satisfaction"
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
          Operational Efficiency
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Operational Efficiency Improvement
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transform your business operations with our comprehensive efficiency optimization solutions.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Service Overview</CardTitle>
              <CardDescription>
                Maximize productivity and minimize waste through our operational efficiency solutions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                <p className="text-muted-foreground mb-4">
                  Our operational efficiency services help businesses identify bottlenecks, streamline processes, and implement best practices to maximize productivity and reduce costs.
                </p>
                <p className="text-muted-foreground">
                  We use data-driven approaches to analyze your current operations and implement targeted improvements that deliver measurable results.
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
                  <div className="text-3xl font-bold text-emerald-600">SAR 4,000</div>
                  <div className="text-muted-foreground">Starting from</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Custom pricing based on operational complexity and scope of improvements.
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
              Ready to Boost Your Efficiency?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Let our efficiency experts help you transform your operations and achieve peak performance.
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