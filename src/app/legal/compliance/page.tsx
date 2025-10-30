'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  FileCheck, 
  Clipboard, 
  Award,
  CheckCircle,
  ArrowRight,
  Building
} from 'lucide-react'
import Link from 'next/link'

export default function CompliancePage() {
  const services = [
    {
      icon: FileCheck,
      title: "Regulatory Compliance",
      description: "Ensure adherence to all Saudi Arabian business regulations and requirements."
    },
    {
      icon: Clipboard,
      title: "License Applications",
      description: "Expert assistance with business licensing and permit applications."
    },
    {
      icon: Shield,
      title: "Audit Support",
      description: "Comprehensive support for regulatory audits and inspections."
    },
    {
      icon: Award,
      title: "Policy Development",
      description: "Development of compliance policies and procedures tailored to your business."
    }
  ]

  const benefits = [
    "100% regulatory compliance",
    "Reduced risk of penalties",
    "Smooth audit processes",
    "Up-to-date with regulation changes",
    "Expert compliance guidance",
    "Custom compliance frameworks"
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
              <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                Services
              </Link>
              <Link href="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </Link>
              <Link href="/legal" className="text-foreground font-medium">
                Legal Services
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/legal">Back to Legal</Link>
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/legal/consultation">Book Consultation</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
            Compliance Services
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Compliance Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ensure your business complies with Saudi Arabian regulations and industry-specific legal requirements.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Service Overview</CardTitle>
                <CardDescription>
                  Comprehensive compliance solutions to keep your business fully compliant with Saudi regulations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                  <p className="text-muted-foreground mb-4">
                    Our compliance services ensure your business meets all regulatory requirements in Saudi Arabia, from basic business licensing to industry-specific compliance standards.
                  </p>
                  <p className="text-muted-foreground">
                    We stay current with all regulatory changes and provide proactive guidance to keep your business compliant and avoid penalties.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Our Services</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {services.map((service, index) => {
                      const IconComponent = service.icon
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{service.title}</h4>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
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
                    <div className="text-3xl font-bold text-emerald-600">SAR 750</div>
                    <div className="text-muted-foreground">Per compliance assessment</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Monthly retainer options available for ongoing compliance management.
                  </p>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link href="/legal/consultation">
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
                Need Compliance Assistance?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Let our compliance experts ensure your business meets all Saudi regulatory requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                  <Link href="/legal/consultation">
                    Book Consultation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/legal">
                    View All Legal Services
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