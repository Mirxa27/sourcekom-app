'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from './logo'
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
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const companyLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Our Approach', href: '/approach' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' }
]

const serviceLinks = [
  { name: 'Resource Sharing', href: '/resources' },
  { name: 'Legal Services', href: '/legal' },
  { name: 'Consulting', href: '/services/consulting' },
  { name: 'Market Entry', href: '/services/market-entry' }
]

const supportLinks = [
  { name: 'Help Center', href: '/help' },
  { name: 'FAQ', href: '/help/faq' },
  { name: 'Support', href: '/help/support' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Cookie Policy', href: '/cookies' }
]

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
            <Logo height={40} />
            <p className="text-sm text-muted-foreground mb-4 mt-4">
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
              <Building className="w-4 h-4 mr-2" />
              Company
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
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

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Services
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
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

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <HelpCircle className="w-4 h-4 mr-2" />
              Support
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
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

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start">
                <Mail className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@sourcekom.com" className="hover:text-foreground transition-colors">
                  info@sourcekom.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <a href="tel:+9661234567890" className="hover:text-foreground transition-colors">
                  +966 123 456 7890
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  King Fahd Road<br />
                  Riyadh, Saudi Arabia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SourceKom. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>

    {/* Pricing Modal */}
    <Dialog open={showPricingModal} onOpenChange={setShowPricingModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pricing Information</DialogTitle>
          <DialogDescription>
            Contact us for detailed pricing information tailored to your needs.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Resource Sharing</h4>
            <p className="text-sm text-muted-foreground">
              Free to browse and list resources. Transaction fees apply only on successful exchanges.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Legal Services</h4>
            <p className="text-sm text-muted-foreground">
              Consultation fees start from SAR 350. Custom packages available for enterprise clients.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Consulting Services</h4>
            <p className="text-sm text-muted-foreground">
              Starting from SAR 3,000 per consultation. Project-based pricing available.
            </p>
          </div>
          <Button 
            className="w-full" 
            onClick={() => {
              setShowPricingModal(false)
              window.location.href = '/contact'
            }}
          >
            Contact Sales
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
