'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Shield, 
  Search, 
  PenTool,
  CheckCircle,
  ArrowRight,
  Building
} from 'lucide-react'
import Link from 'next/link'

export default function ContractsPage() {
  const services = [
    {
      icon: PenTool,
      title: "Contract Drafting",
      description: "Custom contracts tailored to your specific business needs and Saudi law requirements."
    },
    {
      icon: Search,
      title: "Contract Review",
      description: "Thorough review of existing contracts to identify risks and opportunities."
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Comprehensive analysis of potential legal and financial risks in contracts."
    },
    {
      icon: FileText,
      title: "Negotiation Support",
      description: "Expert assistance during contract negotiations to protect your interests."
    }
  ]

  const benefits = [
    "90% risk reduction in contracts",
    "Faster contract turnaround time",
    "Legal compliance assurance",
    "Better negotiation outcomes",
    "Standardized contract templates",
    "Expert legal guidance"
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
          Contract Services
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Contract Review & Drafting
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Professional contract services to protect your business interests and ensure legal compliance in all agreements.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Service Overview</CardTitle>
              <CardDescription>
                Comprehensive contract services to safeguard your business interests in all transactions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                <p className="text-muted-foreground mb-4">
                  Our contract services provide expert legal support for all your business agreements, ensuring they are legally sound, protect your interests, and comply with Saudi Arabian law.
                </p>
                <p className="text-muted-foreground">
                  Whether you need new contracts drafted or existing ones reviewed, our legal team ensures your agreements are robust and enforceable.
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
                  <div className="text-3xl font-bold text-emerald-600">SAR 350</div>
                  <div className="text-muted-foreground">Per contract review</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Package deals available for multiple contracts and ongoing retainer services.
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
              Need Contract Assistance?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Let our contract experts ensure your agreements protect your interests and comply with Saudi law.
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
  )
}