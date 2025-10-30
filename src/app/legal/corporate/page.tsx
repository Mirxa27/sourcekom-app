'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building, 
  Users, 
  FileText, 
  Scale,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react'
import Link from 'next/link'

export default function CorporateLawPage() {
  const services = [
    {
      icon: Building,
      title: "Company Formation",
      description: "Complete assistance with company registration and legal structure setup."
    },
    {
      icon: Users,
      title: "Corporate Governance",
      description: "Establish robust governance frameworks and compliance procedures."
    },
    {
      icon: FileText,
      title: "M&A Advisory",
      description: "Expert legal guidance for mergers, acquisitions, and business combinations."
    },
    {
      icon: Scale,
      title: "Board Compliance",
      description: "Ensure board operations comply with Saudi corporate law requirements."
    }
  ]

  const benefits = [
    "100% compliance with Saudi Company Law",
    "Expert guidance on optimal legal structure",
    "Streamlined registration process",
    "Ongoing compliance support",
    "Access to legal templates and documents",
    "Experienced corporate lawyers"
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
            Corporate Law
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Corporate Law Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive legal guidance for company formation, governance, and corporate compliance in Saudi Arabia.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Service Overview</CardTitle>
                <CardDescription>
                  Expert corporate legal services tailored to the Saudi Arabian business environment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                  <p className="text-muted-foreground mb-4">
                    Our corporate law services provide comprehensive legal support for businesses operating in Saudi Arabia, from initial company formation to ongoing corporate governance and compliance.
                  </p>
                  <p className="text-muted-foreground">
                    Our team of experienced corporate lawyers ensures your business complies with all Saudi regulations while optimizing your legal structure for maximum efficiency and protection.
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
                    <div className="text-3xl font-bold text-emerald-600">SAR 500</div>
                    <div className="text-muted-foreground">Per consultation</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fixed fees available for company formation packages and ongoing retainer services.
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

        {/* Process Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Company Formation Process</CardTitle>
            <CardDescription>
              How we help you establish your business in Saudi Arabia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-emerald-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Consultation</h3>
                <p className="text-sm text-muted-foreground">
                  Initial consultation to understand your business needs and optimal legal structure.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Preparation of all necessary legal documents and applications.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Registration</h3>
                <p className="text-sm text-muted-foreground">
                  Submission of documents and coordination with government authorities.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-orange-600">4</span>
                </div>
                <h3 className="font-semibold mb-2">Launch</h3>
                <p className="text-sm text-muted-foreground">
                  Final registration and business launch with ongoing compliance support.
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
                Ready to Establish Your Business?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Let our corporate law experts guide you through the process of establishing your business in Saudi Arabia.
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