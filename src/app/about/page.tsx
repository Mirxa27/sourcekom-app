'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Building, 
  Target, 
  Lightbulb, 
  Shield, 
  Users,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  X,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { AppLayout } from '@/components/layout/app-layout'

export default function AboutPage() {
  const [isFounderModalOpen, setIsFounderModalOpen] = useState(false)

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand/10 via-app to-brand-secondary/10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-brand/15 text-brand hover:bg-brand/25 border-brand/30">
              Company Overview
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-brand bg-clip-text text-transparent">
              Adding strength to businesses, businesses to strengths
            </h1>
            <p className="text-xl text-app-muted mb-8">
              SourceKom is an innovative resource sharing and legal consultancy platform operating in Saudi Arabia, transforming how businesses optimize their resources and navigate the legal landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The name "SourceKom" combines the English word "source" with "Kom," which means "Yours" in Arabic, expressing the company's concept of being the ideal resource partner clients can count on.
                </p>
                <p>
                  Founded by Abdullah Mirza, a motivated entrepreneur with over a decade of experience in business development, SourceKom is transforming the Saudi Arabian market by enabling businesses to exchange underutilized resources and providing expert legal consultancy.
                </p>
                <p>
                  Our platform fosters a new era of efficiency and sustainability, connecting businesses to maximize potential and foster sustainable growth through resource optimization in logistics and supply chain management.
                </p>
              </div>
              <div className="mt-8">
                <Button variant="brand" asChild>
                  <Link href="/contact">
                    Get in Touch
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand/30">
                <div className="w-12 h-12 bg-brand/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-brand" />
                </div>
                <h3 className="font-semibold mb-2">Our Vision</h3>
                <p className="text-sm text-app-muted">
                  Revolutionizing the Saudi market through resource optimization and legal expertise
                </p>
              </Card>
              <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand-secondary/30">
                <div className="w-12 h-12 bg-brand-secondary/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-6 h-6 text-brand-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Our Mission</h3>
                <p className="text-sm text-app-muted">
                  Empowering businesses with strength and connectivity for sustainable growth
                </p>
              </Card>
              <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand/30">
                <div className="w-12 h-12 bg-brand/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-brand" />
                </div>
                <h3 className="font-semibold mb-2">Legal Expertise</h3>
                <p className="text-sm text-app-muted">
                  Comprehensive legal guidance for Saudi market operations
                </p>
              </Card>
              <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand-secondary/30">
                <div className="w-12 h-12 bg-brand-secondary/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-brand-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Community Focus</h3>
                <p className="text-sm text-app-muted">
                  Building a network of thriving Saudi businesses
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-brand/15 text-brand hover:bg-brand/25 border-brand/30">
              Our Founder
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Leadership with Vision</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Led by an experienced entrepreneur with deep understanding of the Saudi market
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <div className="aspect-square bg-gradient-to-br from-blue-50/50 to-yellow-50/50 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setIsFounderModalOpen(true)}>
                    <div className="text-center">
                      <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-lg">
                        <Image
                          src="/images/Abdullah_Mirza_founder.jpg"
                          alt="Abdullah Mirza - Founder & CEO"
                          width={160}
                          height={160}
                          className="object-cover w-full h-full"
                          priority
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/images/team/founder.jpg'
                          }}
                        />
                      </div>
                      <h3 className="text-xl font-bold">Abdullah Mirza</h3>
                      <p className="text-muted-foreground">Founder & CEO</p>
                      <p className="text-sm text-muted-foreground mt-2">Click to learn more</p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">About Abdullah Mirza</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        With over a decade of experience in business development and legal operations, from ground operations to higher management, Abdullah has a deep understanding of resource optimization and the Saudi Arabian market's legal landscape.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Expertise Areas</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-state-success" />
                          <span className="text-sm">Business Development</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-state-success" />
                          <span className="text-sm">Legal Operations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-state-success" />
                          <span className="text-sm">Resource Optimization</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-state-success" />
                          <span className="text-sm">Supply Chain Management</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-state-success" />
                          <span className="text-sm">Strategic Planning</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-state-success" />
                          <span className="text-sm">Market Analysis</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Leadership Philosophy</h4>
                      <p className="text-muted-foreground">
                        "I believe in creating value through connection and optimization. Every business has untapped potential, and by sharing resources and expertise, we can unlock that potential together."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-brand/15 text-brand hover:bg-brand/25 border-brand/30">
              Why Choose SourceKom
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Your Trusted Partner</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine local expertise with comprehensive solutions to help your business thrive
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand/30">
              <div className="w-16 h-16 bg-brand/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Expertise with Legal Knowledge</h3>
              <p className="text-muted-foreground">
                We combine deep knowledge of the Saudi market with comprehensive legal expertise to provide solutions that work.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand/30">
              <div className="w-16 h-16 bg-brand/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Resource Sharing Platform</h3>
              <p className="text-muted-foreground">
                Our innovative platform connects businesses to share and optimize unused resources, creating new value.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand-secondary/30">
              <div className="w-16 h-16 bg-brand-secondary/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-brand-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sustainability Focus</h3>
              <p className="text-muted-foreground">
                Our approach emphasizes sustainable practices that benefit both businesses and the environment.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand-secondary/30">
              <div className="w-16 h-16 bg-brand-secondary/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-brand-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Extensive Network</h3>
              <p className="text-muted-foreground">
                Connect with a growing community of businesses leveraging shared resources and expertise.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand/30">
              <div className="w-16 h-16 bg-brand/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
              <p className="text-muted-foreground">
                Track record of helping businesses reduce costs by 30% while improving operational efficiency.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand/30">
              <div className="w-16 h-16 bg-brand/15 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Continuous Learning</h3>
              <p className="text-muted-foreground">
                We stay updated with the latest market trends and legal requirements to serve you better.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Impact */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-brand/15 text-brand hover:bg-brand/25 border-brand/30">
              Our Impact
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Making a Difference</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Numbers that speak to our commitment and success
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand/30">
              <div className="text-4xl font-bold text-brand mb-2">500+</div>
              <p className="text-muted-foreground">Successful Projects</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand/30">
              <div className="text-4xl font-bold text-brand mb-2">30%</div>
              <p className="text-muted-foreground">Average Efficiency Gains</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand/30">
              <div className="text-4xl font-bold text-brand mb-2">247</div>
              <p className="text-muted-foreground">Active Resource Partners</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-brand-secondary/30">
              <div className="text-4xl font-bold text-brand-secondary mb-2">SAR 458K</div>
              <p className="text-muted-foreground">Client Savings Generated</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-secondary text-app">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Partner with SourceKom</h2>
          <p className="text-xl mb-8 opacity-90">
            Stay resourced with strategic guidance, legal expertise, and a network built for sustainable growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="brand" size="lg" asChild>
              <Link href="/contact">
                Book a Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-app text-app hover:bg-app/80" asChild>
              <Link href="tel:+9661234567890">
                <Phone className="w-4 h-4 mr-2" />
                Call Our Team
              </Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-app-muted">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>info@sourcekom.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+966 123 456 7890</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Mon-Fri 9AM-5PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Modal */}
      <Dialog open={isFounderModalOpen} onOpenChange={setIsFounderModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Abdullah Mirza</DialogTitle>
            <DialogDescription>Founder & CEO of SourceKom</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary flex-shrink-0 shadow-xl">
                <Image
                  src="/images/Abdullah_Mirza_founder.jpg"
                  alt="Abdullah Mirza - Founder & CEO"
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/team/founder.jpg'
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">AM</h3>
                <p className="text-lg font-semibold mb-1">Abdullah Mirza</p>
                <p className="text-muted-foreground">Founder & CEO</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-lg">About</h4>
              <p className="text-muted-foreground leading-relaxed">
                With over a decade of experience in business development and legal operations, from ground operations to higher management, Abdullah has a deep understanding of resource optimization and the Saudi Arabian market's legal landscape.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-lg">Expertise Areas</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-state-success flex-shrink-0" />
                  <span className="text-sm">Business Development</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-state-success flex-shrink-0" />
                  <span className="text-sm">Legal Operations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-state-success flex-shrink-0" />
                  <span className="text-sm">Resource Optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-state-success flex-shrink-0" />
                  <span className="text-sm">Supply Chain Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-state-success flex-shrink-0" />
                  <span className="text-sm">Strategic Planning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-state-success flex-shrink-0" />
                  <span className="text-sm">Market Analysis</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-lg">Leadership Philosophy</h4>
              <p className="text-muted-foreground italic">
                "I believe in creating value through connection and optimization. Every business has untapped potential, and by sharing resources and expertise, we can unlock that potential together."
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/services">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Our Services
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}