'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Building,
  FileText,
  Users,
  HelpCircle,
  Cookie,
  Shield,
  CreditCard
} from 'lucide-react'
import { PricingPlansModal } from '@/components/payment/pricing-plans-modal'
import { Button } from '@/components/ui/button'

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Resources', href: '/resources' },
    { name: 'Legal Services', href: '/legal' },
    { name: 'Contact', href: '/contact' }
  ],
  services: [
    { name: 'Consulting', href: '/services/consulting' },
    { name: 'Market Entry', href: '/services/market-entry' },
    { name: 'Logistics', href: '/services/logistics' },
    { name: 'Efficiency', href: '/services/efficiency' },
    { name: 'Sustainability', href: '/services/sustainability' }
  ],
  legal: [
    { name: 'Corporate Law', href: '/legal/corporate' },
    { name: 'Contracts', href: '/legal/contracts' },
    { name: 'Compliance', href: '/legal/compliance' },
    { name: 'Consultation', href: '/legal/consultation' }
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'FAQ', href: '/help/faq' },
    { name: 'Support', href: '/help/support' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' }
  ]
}

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'Instagram', href: '#', icon: Instagram }
]

export function Footer() {
  const [showPricingModal, setShowPricingModal] = useState(false)

  return (
    <>
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <img 
                src="/logo.png" 
                alt="SourceKom" 
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Adding strength to businesses, businesses to strengths. 
              Your trusted resource partner in Saudi Arabia.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Services
            </h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resource Sharing Links */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Resource Sharing
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/browse"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/upload"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  List Your Resource
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Manage Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/analytics"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Analytics Dashboard
                </Link>
              </li>
              <li>
                <Button
                  variant="link"
                  className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto font-normal"
                  onClick={() => setShowPricingModal(true)}
                >
                  Pricing Plans
                </Button>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">info@sourcekom.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">+966 50 123 4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">Riyadh, Saudi Arabia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SourceKom. All rights reserved. 
            |{' '}
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            {' '}|{' '}
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            {' '}|{' '}
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>

    {/* Pricing Modal */}
    <PricingPlansModal
      isOpen={showPricingModal}
      onClose={() => setShowPricingModal(false)}
    />
    </>
  )
}