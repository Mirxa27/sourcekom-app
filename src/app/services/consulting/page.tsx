'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Target, 
  Lightbulb, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Building
} from 'lucide-react'
import Link from 'next/link'

export default function ConsultingPage() {
  const features = [
    {
      icon: Target,
      title: "Market Analysis",
      description: "In-depth analysis of Saudi market trends and opportunities."
    },
    {
      icon: Lightbulb,
      title: "Strategic Planning",
      description: "Development of comprehensive business strategies for growth."
    },
    {
      icon: BarChart3,
      title: "Performance Optimization",
      description: "Data-driven insights to improve business performance."
    },
    {
      icon: TrendingUp,
      title: "Growth Acceleration",
      description: "Proven strategies to accelerate business growth and expansion."
    }
  ]

  const benefits = [
    "45% faster business growth",
    "30% improvement in operational efficiency",
    "50% better market penetration",
    "Access to industry experts",
    "Customized growth strategies",
    "Measurable ROI within 6 months"
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
          Strategic Consulting
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Strategic Business Consulting
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Expert guidance to navigate the Saudi Arabian market and accelerate your business growth.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Service Overview</CardTitle>
              <CardDescription>
                Transform your business with strategic consulting tailored to the Saudi Arabian market.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                <p className="text-muted-foreground mb-4">
                  Our strategic consulting services provide expert guidance on business strategy, market positioning, and growth opportunities specifically designed for the Saudi Arabian market.
                </p>
                <p className="text-muted-foreground">
                  With over a decade of experience in the Saudi business landscape, our consultants help you identify opportunities, overcome challenges, and achieve sustainable growth.
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
                  <div className="text-3xl font-bold text-emerald-600">SAR 3,000</div>
                  <div className="text-muted-foreground">Per consultation</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Customized consulting packages available based on your specific needs and project scope.
                </p>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                  <Link href="/contact">
                    Book Consultation
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
              Ready to Transform Your Business?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Let our strategic consultants help you unlock your business potential in the Saudi market.
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