'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { 
  FileText, 
  Shield, 
  AlertTriangle,
  ArrowRight,
  Building,
  Mail,
  Phone,
  Calendar,
  Gavel,
  Users,
  CreditCard,
  Database,
  CheckCircle,
  XCircle,
  Info,
  Eye,
  Lock,
  Globe,
  Scale,
  BookOpen,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'
import { AppLayout } from '@/components/layout/app-layout'

export default function TermsPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--sourcekom-blue)] to-[var(--sourcekom-blue-light)] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-white/30">
              Terms of Service
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Comprehensive terms governing your use of SourceKom's resource sharing and legal consultancy platform in compliance with Saudi Arabian law.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center space-x-2 text-white/80">
                <Calendar className="w-4 h-4" />
                <span>Last updated: January 15, 2025</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Gavel className="w-4 h-4" />
                <span>Governing Law: Saudi Arabia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Quick Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Quick Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Acceptance', icon: CheckCircle, href: '#acceptance' },
                { title: 'Services', icon: Building, href: '#services' },
                { title: 'User Rights', icon: Users, href: '#rights' },
                { title: 'Payments', icon: CreditCard, href: '#payments' },
                { title: 'Prohibited', icon: XCircle, href: '#prohibited' },
                { title: 'Privacy', icon: Shield, href: '#privacy' },
                { title: 'Disputes', icon: Scale, href: '#disputes' },
                { title: 'Contact', icon: Mail, href: '#contact' }
              ].map((item) => (
                <Button key={item.title} variant="outline" className="justify-start h-auto p-4" asChild>
                  <Link href={item.href}>
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Important Notice</h3>
                <p className="text-blue-700">
                  These Terms of Service constitute a legally binding agreement between you and SourceKom. 
                  Please read them carefully before using our platform. By accessing or using SourceKom, 
                  you agree to be bound by these terms and our Privacy Policy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <Card id="acceptance">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle>Acceptance of Terms</CardTitle>
              </div>
              <CardDescription>
                Your agreement to be bound by these terms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Binding Agreement</h3>
                <p className="text-muted-foreground">
                  By accessing and using SourceKom's platform, you accept and agree to be bound by these Terms of Service, 
                  our Privacy Policy, and all applicable laws and regulations. If you do not agree to these terms, 
                  you may not access or use our platform.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Age Requirement</h3>
                <p className="text-muted-foreground">
                  You must be at least 18 years of age to create an account and use our platform. 
                  By using our platform, you represent and warrant that you meet this age requirement.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Modifications to Terms</h3>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes 
                  by posting the updated terms on our platform and sending email notifications. Your continued use of 
                  the platform after such changes constitutes acceptance of the modified terms.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Platform Services */}
          <Card id="services">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle>Platform Services</CardTitle>
              </div>
              <CardDescription>
                The services provided by SourceKom
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="resource-sharing" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="text-left">
                      <h3 className="font-semibold">Resource Sharing Platform</h3>
                      <p className="text-sm text-muted-foreground">Connect businesses to share resources</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Available Resources:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Office spaces and meeting rooms</li>
                        <li>Equipment and machinery</li>
                        <li>Storage facilities and warehouses</li>
                        <li>Vehicles and transportation</li>
                        <li>Human resources and personnel</li>
                        <li>Digital resources and templates</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Platform Role:</h4>
                      <p className="text-muted-foreground">
                        SourceKom acts as an intermediary platform connecting resource providers with users. 
                        We facilitate transactions but do not own, control, or guarantee the quality of resources 
                        listed on our platform.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="legal-services" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="text-left">
                      <h3 className="font-semibold">Legal Consultancy Services</h3>
                      <p className="text-sm text-muted-foreground">Connect with legal professionals</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Services Offered:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Business registration and licensing</li>
                        <li>Contract drafting and review</li>
                        <li>Compliance consulting</li>
                        <li>Legal documentation preparation</li>
                        <li>Market entry guidance</li>
                        <li>Legal representation referrals</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Disclaimer:</h4>
                      <p className="text-muted-foreground">
                        Legal consultations are provided by independent legal professionals. 
                        SourceKom facilitates these connections but is not responsible for the legal advice provided. 
                        All legal services are subject to separate engagement agreements.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="platform-features" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="text-left">
                      <h3 className="font-semibold">Platform Features</h3>
                      <p className="text-sm text-muted-foreground">Tools and functionality</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Core Features:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Resource search and discovery</li>
                        <li>Booking and reservation system</li>
                        <li>Secure payment processing</li>
                        <li>User profiles and verification</li>
                        <li>Rating and review system</li>
                        <li>Messaging and communication tools</li>
                        <li>Analytics and reporting dashboard</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* User Rights and Responsibilities */}
          <Card id="rights">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <CardTitle>User Rights and Responsibilities</CardTitle>
              </div>
              <CardDescription>
                Your rights and obligations as a platform user
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">User Rights</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Fair Treatment</p>
                        <p className="text-xs text-muted-foreground">
                          Equal access to platform features and non-discriminatory treatment
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Data Privacy</p>
                        <p className="text-xs text-muted-foreground">
                          Protection of personal information as outlined in our Privacy Policy
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Transparent Pricing</p>
                        <p className="text-xs text-muted-foreground">
                          Clear information about all fees and charges
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Quality Assurance</p>
                        <p className="text-xs text-muted-foreground">
                          Access to dispute resolution and support services
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">User Responsibilities</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Account Security</p>
                        <p className="text-xs text-muted-foreground">
                          Maintain confidentiality of login credentials
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Accurate Information</p>
                        <p className="text-xs text-muted-foreground">
                          Provide truthful and up-to-date profile information
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Legal Compliance</p>
                        <p className="text-xs text-muted-foreground">
                          Follow all applicable Saudi laws and regulations
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Professional Conduct</p>
                        <p className="text-xs text-muted-foreground">
                          Maintain respectful and professional interactions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-purple-200 pl-4 py-2 bg-purple-50">
                <h4 className="font-semibold text-purple-800 mb-1">Verification Requirements</h4>
                <p className="text-sm text-purple-700">
                  Certain platform features may require identity verification, business registration documents, 
                  or professional certifications. Users must provide authentic documentation when requested.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card id="payments">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle>Payment Terms</CardTitle>
              </div>
              <CardDescription>
                Financial terms and payment processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Payment Processing</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• All transactions processed in Saudi Riyals (SAR)</li>
                    <li>• Secure payment processing via MyFatoorah</li>
                    <li>• Platform fees: 5-15% depending on service type</li>
                    <li>• VAT included as required by Saudi law</li>
                    <li>• Payment confirmation via email and dashboard</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Refund Policy</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 14-day refund policy for digital resources</li>
                    <li>• 48-hour cancellation for bookings</li>
                    <li>• Legal consultation fees non-refundable after 24 hours</li>
                    <li>• Refunds processed within 5-7 business days</li>
                    <li>• Dispute resolution available for contested refunds</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-green-200 pl-4 py-2 bg-green-50">
                <h4 className="font-semibold text-green-800 mb-1">Payment Security</h4>
                <p className="text-sm text-green-700">
                  All payment transactions are encrypted and processed through PCI DSS compliant payment processors. 
                  SourceKom does not store credit card information on its servers.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Activities */}
          <Card id="prohibited">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <CardTitle>Prohibited Activities</CardTitle>
              </div>
              <CardDescription>
                Activities that are strictly forbidden on our platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-red-600">Illegal Activities</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Fraud, money laundering, or terrorist financing</li>
                    <li>• Sale of illegal goods or services</li>
                    <li>• Violation of Saudi Arabian laws</li>
                    <li>• Tax evasion or financial crimes</li>
                    <li>• Intellectual property infringement</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-red-600">Platform Abuse</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• False or misleading listings</li>
                    <li>• Fake reviews or ratings manipulation</li>
                    <li>• Spam or unsolicited communications</li>
                    <li>• Unauthorized access or hacking attempts</li>
                    <li>• Use of automated scraping tools</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-red-200 pl-4 py-2 bg-red-50">
                <h4 className="font-semibold text-red-800 mb-1">Consequences of Violations</h4>
                <p className="text-sm text-red-700">
                  Violation of these prohibited activities may result in immediate account termination, 
                  legal action, and reporting to relevant authorities. We cooperate fully with law enforcement 
                  investigations.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data */}
          <Card id="privacy">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-indigo-600" />
                </div>
                <CardTitle>Privacy and Data Protection</CardTitle>
              </div>
              <CardDescription>
                How we protect your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Your privacy is important to us. Our collection, use, and protection of personal information 
                  is governed by our Privacy Policy, which is incorporated into these terms by reference.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Data Collection</h3>
                    <p className="text-sm text-muted-foreground">
                      We collect information necessary to provide our services, including account details, 
                      payment information, and usage data. All data collection complies with Saudi PDPL requirements.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Data Protection</h3>
                    <p className="text-sm text-muted-foreground">
                      We implement industry-standard security measures to protect your data and ensure 
                      compliance with international data protection standards.
                    </p>
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/privacy">
                    <Eye className="w-4 h-4 mr-2" />
                    Read Full Privacy Policy
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dispute Resolution */}
          <Card id="disputes">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-orange-600" />
                </div>
                <CardTitle>Dispute Resolution</CardTitle>
              </div>
              <CardDescription>
                How disputes are handled and resolved
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">User-to-User Disputes</h3>
                  <p className="text-muted-foreground">
                    We encourage users to resolve disputes directly through communication. Our support team 
                    can provide mediation services but is not obligated to resolve disputes between users.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Platform Disputes</h3>
                  <p className="text-muted-foreground">
                    Disputes between users and SourceKom regarding platform services, fees, or account matters 
                    will be addressed through our internal resolution process.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Legal Proceedings</h3>
                  <p className="text-muted-foreground">
                    Any legal disputes arising from these terms shall be governed by the laws of Saudi Arabia 
                    and resolved in the courts of Riyadh, Saudi Arabia.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-orange-200 pl-4 py-2 bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-1">Arbitration Option</h4>
                <p className="text-sm text-orange-700">
                  Certain disputes may be resolved through binding arbitration in accordance with Saudi arbitration laws, 
                  providing a faster and more cost-effective resolution mechanism.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-gray-600" />
                </div>
                <CardTitle>Limitation of Liability</CardTitle>
              </div>
              <CardDescription>
                Limits on our liability to you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Platform Liability</h3>
                <p className="text-muted-foreground">
                  To the maximum extent permitted by law, SourceKom shall not be liable for any indirect, 
                  incidental, special, or consequential damages arising from your use of our platform.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Liability Cap</h3>
                <p className="text-muted-foreground">
                  Our total liability for any claims arising from your use of the platform shall not exceed 
                  the amount you paid to us in the twelve (12) months preceding the claim.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Third-Party Services</h3>
                <p className="text-muted-foreground">
                  We do not guarantee the accuracy, reliability, or quality of resources or services provided 
                  by third parties through our platform. All such arrangements are between you and the service provider.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card id="contact">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <CardTitle>Contact Information</CardTitle>
              </div>
              <CardDescription>
                How to reach us with questions about these terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium">Legal Inquiries</p>
                      <p className="text-sm text-muted-foreground">legal@sourcekom.sa</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-muted-foreground">+966 11 234 5678</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium">Office Address</p>
                      <p className="text-sm text-muted-foreground">
                        King Fahd Road, Riyadh, Saudi Arabia 11564
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-sm text-muted-foreground">Available on our website</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-[var(--sourcekom-blue)]/10 to-[var(--sourcekom-yellow)]/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join SourceKom today and become part of Saudi Arabia's innovative resource sharing community. 
            By creating an account, you agree to these terms and our privacy policy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[var(--sourcekom-blue)] hover:bg-[var(--sourcekom-blue-light)] text-white" asChild>
              <Link href="/register">
                Create Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/help">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
  )
}
