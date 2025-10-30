'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Building, 
  FileText, 
  Users, 
  HelpCircle, 
  Phone,
  Settings,
  LogOut,
  User,
  Search,
  PlusCircle,
  BarChart3,
  Shield,
  BookOpen,
  Mail,
  MapPin,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

const menuSections = [
  {
    title: 'Main',
    items: [
      { name: 'Home', href: '/', icon: Home, description: 'Return to homepage' },
      { name: 'Browse', href: '/browse', icon: Search, description: 'Search resources' },
      { name: 'Create', href: '/upload', icon: PlusCircle, description: 'Upload resources' },
    ]
  },
  {
    title: 'Services',
    items: [
      { name: 'All Services', href: '/services', icon: Building, description: 'View all services' },
      { name: 'Consulting', href: '/services/consulting', icon: Users, description: 'Business consulting' },
      { name: 'Market Entry', href: '/services/market-entry', icon: Building, description: 'Enter Saudi market' },
      { name: 'Logistics', href: '/services/logistics', icon: Building, description: 'Logistics solutions' },
      { name: 'Legal Services', href: '/legal', icon: Shield, description: 'Legal consultation' },
    ]
  },
  {
    title: 'Account',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: BarChart3, description: 'Manage account' },
      { name: 'Profile', href: '/dashboard/profile', icon: User, description: 'Edit profile' },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings, description: 'Account settings' },
    ]
  },
  {
    title: 'Support',
    items: [
      { name: 'Help Center', href: '/help', icon: HelpCircle, description: 'Get help' },
      { name: 'FAQ', href: '/help/faq', icon: BookOpen, description: 'Frequently asked questions' },
      { name: 'Contact', href: '/contact', icon: Phone, description: 'Contact us' },
    ]
  }
]

export default function MenuPage() {
  return (
    <AppLayout showFooter={false}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Menu</h1>
            <p className="text-muted-foreground">Navigate to any section of the app</p>
          </div>

          <div className="grid gap-6">
            {menuSections.map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link href="/search">
                    <Search className="w-4 h-4 mr-2" />
                    Quick Search
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/help">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Get Help
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Legal & Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legal & Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href="/terms"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                >
                  <span>Terms of Service</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/privacy"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                >
                  <span>Privacy Policy</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/cookies"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                >
                  <span>Cookie Policy</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}