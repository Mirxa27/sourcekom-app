'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { 
  Shield, 
  Eye, 
  Lock, 
  Database,
  ArrowRight,
  Building,
  Mail,
  Phone,
  Calendar,
  Globe,
  Users,
  FileText,
  Cookie,
  Server,
  CheckCircle,
  AlertTriangle,
  Info,
  Download,
  Settings,
  Trash2,
  Edit,
  Search,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--sourcekom-blue)] to-[var(--sourcekom-blue-light)] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-white/30">
              Privacy Policy
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Privacy Matters
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Comprehensive information about how we collect, use, and protect your personal data in compliance with Saudi Arabian data protection laws and international standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center space-x-2 text-white/80">
                <Calendar className="w-4 h-4" />
                <span>Last updated: January 15, 2025</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Globe className="w-4 h-4" />
                <span>Effective: Saudi Arabia & International</span>
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
              <FileText className="w-5 h-5 mr-2" />
              Quick Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Data Collection', icon: Database, href: '#collection' },
                { title: 'Data Usage', icon: Eye, href: '#usage' },
                { title: 'Data Protection', icon: Shield, href: '#protection' },
                { title: 'Your Rights', icon: Users, href: '#rights' },
                { title: 'Cookies', icon: Cookie, href: '#cookies' },
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

        {/* Data Protection Commitment */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Our Privacy Commitment</h3>
                <p className="text-green-700">
                  We are committed to protecting your privacy and ensuring transparency in how we handle your personal data. 
                  This policy is designed to comply with Saudi Arabian Personal Data Protection Law (PDPL), GDPR, and other applicable regulations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <Card id="collection">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle>Information We Collect</CardTitle>
              </div>
              <CardDescription>
                We collect different types of information to provide and improve our services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="personal" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="text-left">
                      <h3 className="font-semibold">Personal Information</h3>
                      <p className="text-sm text-muted-foreground">Identity and contact details</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Account Information:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Full name, email address, phone number</li>
                        <li>Company name, job title, business address</li>
                        <li>Professional license numbers (for legal services)</li>
                        <li>Commercial registration details</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Payment Information:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Credit/debit card details (processed securely via MyFatoorah)</li>
                        <li>Bank account information for payouts</li>
                        <li>Billing address and tax identification</li>
                        <li>Transaction history and invoices</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="technical" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="text-left">
                      <h3 className="font-semibold">Technical Data</h3>
                      <p className="text-sm text-muted-foreground">Usage and device information</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Device & Browser Information:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>IP address, geolocation data</li>
                        <li>Browser type, operating system, device type</li>
                        <li>Language preferences and timezone settings</li>
                        <li>Unique device identifiers and advertising IDs</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Usage Data:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Pages visited, time spent on each page</li>
                        <li>Search queries and filter preferences</li>
                        <li>Resources viewed, downloaded, or purchased</li>
                        <li>Interaction with support and help features</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="communications" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="text-left">
                      <h3 className="font-semibold">Communications Data</h3>
                      <p className="text-sm text-muted-foreground">Messages and support interactions</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Customer Support:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Support tickets and chat transcripts</li>
                        <li>Email communications with our team</li>
                        <li>Phone call recordings (with consent)</li>
                        <li>Feedback and survey responses</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Platform Interactions:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Messages between users (when applicable)</li>
                        <li>Reviews and ratings provided</li>
                        <li>Comments on resources and services</li>
                        <li>Forum and community participation</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card id="usage">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle>How We Use Your Information</CardTitle>
              </div>
              <CardDescription>
                The purposes for which we process your personal data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Service Provision</h3>
                      <p className="text-sm text-muted-foreground">
                        Providing core platform functionality, processing transactions, and facilitating resource sharing between users.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Account Management</h3>
                      <p className="text-sm text-muted-foreground">
                        Creating and managing user accounts, authentication, and personalization of your platform experience.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Communication</h3>
                      <p className="text-sm text-muted-foreground">
                        Sending important updates, transaction notifications, and responding to your inquiries and support requests.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Platform Improvement</h3>
                      <p className="text-sm text-muted-foreground">
                        Analyzing usage patterns to enhance features, optimize performance, and develop new services.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Safety & Security</h3>
                      <p className="text-sm text-muted-foreground">
                        Detecting fraud, preventing illegal activities, and ensuring platform security for all users.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Legal Compliance</h3>
                      <p className="text-sm text-muted-foreground">
                        Complying with legal obligations, regulatory requirements, and lawful requests from authorities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-blue-200 pl-4 py-2 bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-1">Legal Basis for Processing</h4>
                <p className="text-sm text-blue-700">
                  We process your data based on: (1) Contract necessity for service provision, (2) Legal compliance requirements, 
                  (3) Legitimate business interests, (4) Explicit consent where required, and (5) Vital interests protection.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card id="protection">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <CardTitle>Data Protection & Security</CardTitle>
              </div>
              <CardDescription>
                How we safeguard your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Technical Security Measures</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-green-600" />
                      <span className="text-sm">256-bit SSL/TLS encryption</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Server className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Secure Saudi-based data centers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Regular security audits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Encrypted database storage</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Organizational Measures</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Staff training on data protection</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Strict confidentiality agreements</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Settings className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Access control policies</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Incident response procedures</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="border-l-4 border-orange-200 pl-4 py-2 bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-1">Data Breach Notification</h4>
                <p className="text-sm text-orange-700">
                  In the unlikely event of a data breach, we will notify affected users and relevant authorities 
                  within 72 hours in accordance with PDPL and GDPR requirements.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card id="rights">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <CardTitle>Your Data Protection Rights</CardTitle>
              </div>
              <CardDescription>
                Your rights under Saudi PDPL and international data protection laws
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Search className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Right to Access</h3>
                          <p className="text-sm text-muted-foreground">
                            Request a copy of your personal data and information about how we process it.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Edit className="w-5 h-5 text-green-600 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Right to Rectification</h3>
                          <p className="text-sm text-muted-foreground">
                            Correct inaccurate or incomplete personal data we hold about you.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Trash2 className="w-5 h-5 text-red-600 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Right to Erasure</h3>
                          <p className="text-sm text-muted-foreground">
                            Request deletion of your personal data when no longer necessary for processing.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Download className="w-5 h-5 text-purple-600 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Right to Data Portability</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive your data in a structured format for transfer to other services.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Right to Object</h3>
                          <p className="text-sm text-muted-foreground">
                            Object to processing based on legitimate interests or for direct marketing.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Settings className="w-5 h-5 text-gray-600 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Right to Restrict</h3>
                          <p className="text-sm text-muted-foreground">
                            Limit processing of your data in certain circumstances.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">How to Exercise Your Rights</h4>
                <p className="text-sm text-blue-700 mb-3">
                  You can exercise most of these rights directly through your account settings or by contacting our 
                  Data Protection Officer at privacy@sourcekom.sa. We will respond to your request within 30 days.
                </p>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Privacy Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card id="cookies">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-yellow-600" />
                </div>
                <CardTitle>Cookies and Tracking Technologies</CardTitle>
              </div>
              <CardDescription>
                How we use cookies and similar technologies on our platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Cookie Types We Use</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Essential Cookies</h4>
                      <p className="text-xs text-muted-foreground">
                        Required for basic platform functionality and security. Cannot be disabled.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Performance Cookies</h4>
                      <p className="text-xs text-muted-foreground">
                        Help us understand how our platform is used and improve performance.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Functional Cookies</h4>
                      <p className="text-xs text-muted-foreground">
                        Enable personalized features and remember your preferences.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Marketing Cookies</h4>
                      <p className="text-xs text-muted-foreground">
                        Used to deliver relevant advertisements and track marketing effectiveness.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Managing Cookie Preferences</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      You can control cookies through:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Our cookie consent banner when you first visit</li>
                      <li>Browser settings to block or delete cookies</li>
                      <li>Your account privacy settings</li>
                      <li>Privacy preferences panel in website footer</li>
                    </ul>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        <strong>Note:</strong> Disabling certain cookies may affect platform functionality and your user experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* International Data Transfers */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-indigo-600" />
                </div>
                <CardTitle>International Data Transfers</CardTitle>
              </div>
              <CardDescription>
                How your data may be transferred internationally
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  As a Saudi Arabian company, we prioritize local data storage and processing. However, some of our 
                  service providers are located internationally, which may require data transfers outside Saudi Arabia.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Data Storage Locations</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Primary: Saudi Arabia data centers</li>
                      <li>Secondary: UAE data centers (redundancy)</li>
                      <li>Analytics: United States (aggregated data only)</li>
                      <li>Payment processing: UAE (MyFatoorah)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Protection Measures</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Standard Contractual Clauses (SCCs)</li>
                      <li>Adequacy decisions where applicable</li>
                      <li>Encryption during transit and storage</li>
                      <li>Regular compliance audits</li>
                    </ul>
                  </div>
                </div>
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
                <CardTitle>Contact Our Data Protection Team</CardTitle>
              </div>
              <CardDescription>
                Get in touch with questions about your privacy or data rights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium">Data Protection Officer</p>
                      <p className="text-sm text-muted-foreground">privacy@sourcekom.sa</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium">Privacy Hotline</p>
                      <p className="text-sm text-muted-foreground">+966 11 234 5678</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium">Office Address</p>
                      <p className="text-sm text-muted-foreground">
                        King Fahd Road, Riyadh, Saudi Arabia 11564
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Response Times</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Data access requests: 30 days</li>
                      <li>• Data correction requests: 15 days</li>
                      <li>• Privacy concerns: 7 days</li>
                      <li>• Urgent requests: 48 hours</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Regulatory Authorities</h3>
                    <p className="text-sm text-muted-foreground">
                      If you're unsatisfied with our response, you can contact the Saudi Data & AI Authority (SDAIA) 
                      or your local data protection authority.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center bg-gradient-to-r from-[var(--sourcekom-blue)]/10 to-[var(--sourcekom-yellow)]/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Privacy is Our Priority
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            We are committed to protecting your personal data and being transparent about our privacy practices. 
            If you have any questions or concerns, please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[var(--sourcekom-blue)] hover:bg-[var(--sourcekom-blue-light)] text-white" asChild>
              <Link href="/help/support">
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Privacy Team
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/cookies">
                <Cookie className="w-5 h-5 mr-2" />
                Manage Cookie Preferences
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}