'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Switch } from '@/components/ui/switch'
import { 
  Cookie, 
  Shield, 
  Settings,
  ArrowRight,
  Building,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Info,
  Eye,
  Lock,
  Globe,
  Clock,
  Database,
  BarChart3,
  Target,
  Users,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

export default function CookiesPage() {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    performance: true,
    functional: false,
    marketing: false
  })

  const handleCookieChange = (category: string, value: boolean) => {
    setCookiePreferences(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const savePreferences = () => {
    // In a real app, this would save to localStorage or backend
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences))
    alert('Cookie preferences saved successfully!')
  }

  const acceptAll = () => {
    setCookiePreferences({
      essential: true,
      performance: true,
      functional: true,
      marketing: true
    })
    savePreferences()
  }

  const rejectAll = () => {
    setCookiePreferences({
      essential: true,
      performance: false,
      functional: false,
      marketing: false
    })
    savePreferences()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--sourcekom-blue)] to-[var(--sourcekom-blue-light)] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-white/30">
              Cookie Policy
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cookie Policy & Consent Management
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Comprehensive information about how SourceKom uses cookies and similar technologies to enhance your experience while respecting your privacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center space-x-2 text-white/80">
                <Calendar className="w-4 h-4" />
                <span>Last updated: January 15, 2025</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Globe className="w-4 h-4" />
                <span>GDPR & PDPL Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Quick Cookie Management */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Quick Cookie Preferences
            </CardTitle>
            <CardDescription>
              Manage your cookie preferences instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Essential</p>
                  <p className="text-xs text-muted-foreground">Required</p>
                </div>
                <Switch checked={true} disabled />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Performance</p>
                  <p className="text-xs text-muted-foreground">Analytics</p>
                </div>
                <Switch 
                  checked={cookiePreferences.performance} 
                  onCheckedChange={(checked) => handleCookieChange('performance', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Functional</p>
                  <p className="text-xs text-muted-foreground">Personalization</p>
                </div>
                <Switch 
                  checked={cookiePreferences.functional} 
                  onCheckedChange={(checked) => handleCookieChange('functional', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing</p>
                  <p className="text-xs text-muted-foreground">Advertising</p>
                </div>
                <Switch 
                  checked={cookiePreferences.marketing} 
                  onCheckedChange={(checked) => handleCookieChange('marketing', checked)}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button onClick={acceptAll} className="bg-[var(--sourcekom-blue)] hover:bg-[var(--sourcekom-blue-light)] text-white">
                Accept All
              </Button>
              <Button onClick={rejectAll} variant="outline">
                Reject All
              </Button>
              <Button onClick={savePreferences} variant="default">
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* What Are Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Cookie className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle>What Are Cookies?</CardTitle>
            </div>
            <CardDescription>
              Understanding cookies and similar technologies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) 
              when you visit a website. They are widely used to make websites work more efficiently and 
              to provide information to website owners.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">How Cookies Work</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Server sends cookie to your browser</li>
                  <li>• Browser stores cookie on your device</li>
                  <li>• Browser sends cookie back to server on subsequent visits</li>
                  <li>• Server recognizes you and personalizes experience</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Why We Use Cookies</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Essential platform functionality</li>
                  <li>• Security and fraud prevention</li>
                  <li>• User experience optimization</li>
                  <li>• Analytics and performance monitoring</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle>Types of Cookies We Use</CardTitle>
            </div>
            <CardDescription>
              Detailed breakdown of cookie categories and their purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="essential" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="text-left flex items-center justify-between w-full">
                    <div>
                      <h3 className="font-semibold">Essential Cookies</h3>
                      <p className="text-sm text-muted-foreground">Required for platform operation</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Always Active</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Purpose:</h4>
                    <p className="text-muted-foreground">
                      These cookies are necessary for the operation of our platform and cannot be disabled. 
                      They enable core functionality such as user authentication, security, and shopping cart management.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Examples:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Authentication tokens to keep you logged in</li>
                      <li>CSRF tokens to prevent cross-site request forgery</li>
                      <li>Session cookies to maintain your booking progress</li>
                      <li>Load balancing cookies for platform stability</li>
                      <li>Security cookies for fraud detection</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Duration:</h4>
                    <p className="text-muted-foreground">Session to 1 year depending on specific cookie purpose</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="performance" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="text-left flex items-center justify-between w-full">
                    <div>
                      <h3 className="font-semibold">Performance & Analytics Cookies</h3>
                      <p className="text-sm text-muted-foreground">Help us improve our platform</p>
                    </div>
                    <Switch 
                      checked={cookiePreferences.performance} 
                      onCheckedChange={(checked) => handleCookieChange('performance', checked)}
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Purpose:</h4>
                    <p className="text-muted-foreground">
                      These cookies help us understand how visitors interact with our platform by collecting 
                      and reporting information anonymously. This data helps us improve user experience and optimize our services.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Examples:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Google Analytics for traffic analysis</li>
                      <li>Hotjar for heat mapping and user behavior</li>
                      <li>Error tracking cookies for technical optimization</li>
                      <li>Performance monitoring for speed optimization</li>
                      <li>A/B testing cookies for feature improvement</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Data Collected:</h4>
                    <p className="text-muted-foreground">
                      Pages visited, time spent on pages, bounce rates, device information, geographic location (approximate)
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="functional" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="text-left flex items-center justify-between w-full">
                    <div>
                      <h3 className="font-semibold">Functional Cookies</h3>
                      <p className="text-sm text-muted-foreground">Enhanced user experience</p>
                    </div>
                    <Switch 
                      checked={cookiePreferences.functional} 
                      onCheckedChange={(checked) => handleCookieChange('functional', checked)}
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Purpose:</h4>
                    <p className="text-muted-foreground">
                      These cookies enhance your experience by remembering your preferences and providing personalized features. 
                      They make your interaction with our platform more convenient and tailored to your needs.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Examples:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Language and region preferences</li>
                      <li>Display settings and accessibility options</li>
                      <li>Search filters and browsing history</li>
                      <li>Personalized content recommendations</li>
                      <li>Remembered login information (optional)</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="marketing" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="text-left flex items-center justify-between w-full">
                    <div>
                      <h3 className="font-semibold">Marketing & Advertising Cookies</h3>
                      <p className="text-sm text-muted-foreground">Personalized advertising</p>
                    </div>
                    <Switch 
                      checked={cookiePreferences.marketing} 
                      onCheckedChange={(checked) => handleCookieChange('marketing', checked)}
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Purpose:</h4>
                    <p className="text-muted-foreground">
                      These cookies are used to deliver advertisements that are relevant to you and your interests. 
                      They also help us measure the effectiveness of our marketing campaigns.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Examples:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Google Ads conversion tracking</li>
                      <li>Facebook Pixel for social media advertising</li>
                      <li>LinkedIn Insight Tag for professional networking</li>
                      <li>Retargeting cookies for personalized ads</li>
                      <li>Affiliate tracking cookies for partnerships</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Third-Party Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle>Third-Party Services</CardTitle>
            </div>
            <CardDescription>
              External services that may set cookies on our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Analytics Services</h3>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Google Analytics</h4>
                    <p className="text-xs text-muted-foreground">Website analytics and user behavior tracking</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Hotjar</h4>
                    <p className="text-xs text-muted-foreground">Heat mapping and session recording</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Mixpanel</h4>
                    <p className="text-xs text-muted-foreground">Product analytics and user engagement</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Marketing Services</h3>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Google Ads</h4>
                    <p className="text-xs text-muted-foreground">Advertising campaign tracking and optimization</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Meta Pixel</h4>
                    <p className="text-xs text-muted-foreground">Facebook and Instagram advertising</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">LinkedIn Insight Tag</h4>
                    <p className="text-xs text-muted-foreground">Professional networking advertising</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Third-Party Privacy</h4>
              <p className="text-sm text-yellow-700">
                Each third-party service has its own privacy policy and cookie policy. We encourage you 
                to review these policies to understand how they use your data. We are not responsible for 
                the privacy practices of third-party services.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-orange-600" />
              </div>
              <CardTitle>Managing Your Cookie Preferences</CardTitle>
            </div>
            <CardDescription>
              How to control and manage your cookie settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Browser Settings</h3>
                <p className="text-muted-foreground mb-3">
                  You can control cookies through your browser settings:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• View all cookies stored on your device</li>
                  <li>• Delete specific cookies or all cookies</li>
                  <li>• Block cookies from specific websites</li>
                  <li>• Set notifications when cookies are stored</li>
                  <li>• Block third-party cookies</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Platform Controls</h3>
                <p className="text-muted-foreground mb-3">
                  Manage cookies directly on our platform:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Cookie consent banner on first visit</li>
                  <li>• Cookie settings panel in footer</li>
                  <li>• Account preferences section</li>
                  <li>• Privacy dashboard for data control</li>
                  <li>• One-click preference management</li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-blue-200 pl-4 py-2 bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-1">Impact of Disabling Cookies</h4>
              <p className="text-sm text-blue-700">
                Disabling certain cookies may affect platform functionality. Essential cookies cannot be disabled 
                as they are required for basic operation. Some features may not work properly without functional cookies.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle>Your Rights and Choices</CardTitle>
            </div>
            <CardDescription>
              Your privacy rights regarding cookies and tracking technologies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Your Rights</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Informed Consent</p>
                      <p className="text-xs text-muted-foreground">
                        Clear information about cookies before consent
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Granular Control</p>
                      <p className="text-xs text-muted-foreground">
                        Choose specific cookie categories to accept
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Withdraw Consent</p>
                      <p className="text-xs text-muted-foreground">
                        Change preferences at any time
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Data Access</p>
                      <p className="text-xs text-muted-foreground">
                        Request information about collected data
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Compliance Standards</h3>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">GDPR Compliance</h4>
                    <p className="text-xs text-muted-foreground">
                      Full compliance with EU General Data Protection Regulation
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">PDPL Compliance</h4>
                    <p className="text-xs text-muted-foreground">
                      Saudi Personal Data Protection Law adherence
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">ePrivacy Directive</h4>
                    <p className="text-xs text-muted-foreground">
                      EU directive on privacy in electronic communications
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-emerald-600" />
              </div>
              <CardTitle>Contact Us About Cookies</CardTitle>
            </div>
            <CardDescription>
              Questions or concerns about our cookie practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Privacy Inquiries</p>
                    <p className="text-sm text-muted-foreground">privacy@sourcekom.sa</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Support Hotline</p>
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
                  <Globe className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Data Protection Officer</p>
                    <p className="text-sm text-muted-foreground">dpo@sourcekom.sa</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}