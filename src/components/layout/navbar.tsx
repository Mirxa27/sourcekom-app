'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Menu, 
  X, 
  Home, 
  Building, 
  FileText, 
  Users, 
  HelpCircle, 
  Phone,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Target,
  Shield
} from 'lucide-react'
import { Logo } from './logo'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useIsClient } from '@/hooks/useIsClient'

const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: Home
  },
  {
    name: 'About',
    href: '/about',
    icon: Users
  },
  {
    name: 'Services',
    href: '/services',
    icon: Building,
    children: [
      { name: 'All Services', href: '/services' },
      { name: 'Consulting', href: '/services/consulting' },
      { name: 'Market Entry', href: '/services/market-entry' },
      { name: 'Logistics', href: '/services/logistics' },
      { name: 'Efficiency', href: '/services/efficiency' },
      { name: 'Sustainability', href: '/services/sustainability' },
      { name: 'Resource Optimization', href: '/services/resource-optimization' }
    ]
  },
  {
    name: 'Our Approach',
    href: '/approach',
    icon: Target
  },
  {
    name: 'Resources',
    href: '/resources',
    icon: FileText,
    children: [
      { name: 'Resource Library', href: '/resources' },
      { name: 'Digital Products', href: '/digital-products' },
      { name: 'Browse Marketplace', href: '/browse' },
      { name: 'Search Resources', href: '/search' }
    ]
  },
  {
    name: 'Legal',
    href: '/legal',
    icon: FileText,
    children: [
      { name: 'Legal Services', href: '/legal' },
      { name: 'Corporate Law', href: '/legal/corporate' },
      { name: 'Contracts', href: '/legal/contracts' },
      { name: 'Compliance', href: '/legal/compliance' },
      { name: 'Consultation', href: '/legal/consultation' }
    ]
  },
  {
    name: 'Help',
    href: '/help',
    icon: HelpCircle,
    children: [
      { name: 'Help Center', href: '/help' },
      { name: 'FAQ', href: '/help/faq' },
      { name: 'Support', href: '/help/support' },
      { name: 'System Status', href: '/status' }
    ]
  },
  {
    name: 'Contact',
    href: '/contact',
    icon: Phone
  }
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const isClient = useIsClient()

  useEffect(() => {
    if (!isClient) return

    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    
    // Check if user is logged in - only on client side
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        // Invalid user data
      }
    }
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isClient])

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    if (!isClient) return
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  const handleMobileLogout = () => {
    if (!isClient) return
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setIsOpen(false)
    window.location.href = '/'
  }

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
      scrolled && "bg-background/80 shadow-sm"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo height={40} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {item.name}
                  {item.children && (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.children && (
                  <div className="absolute left-0 mt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                    <div className="bg-background border rounded-md shadow-lg py-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            "block px-4 py-2 text-sm transition-colors",
                            pathname === child.href
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            {isClient && user?.role === 'ADMIN' && (
              <Button variant="outline" size="sm" asChild className="border-brand text-brand hover:bg-brand hover:text-app transition-all">
                <Link href="/admin">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Link>
              </Button>
            )}
            {isClient && user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild data-testid="nav-signin">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" variant="brand" asChild data-testid="nav-getstarted">
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
                data-testid="mobile-menu-button"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive(item.href)
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>

                    {/* Mobile Submenu */}
                    {item.children && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "block px-3 py-2 text-sm transition-colors rounded-md",
                              pathname === child.href
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="px-3 py-2">
                    <ThemeToggle />
                  </div>
                  {isClient && user?.role === 'ADMIN' && (
                    <Button variant="outline" size="sm" className="w-full justify-start border-brand text-brand hover:bg-brand hover:text-app" asChild>
                      <Link href="/admin" onClick={() => setIsOpen(false)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </Button>
                  )}
                  {isClient && user ? (
                    <>
                      <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleMobileLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          Sign In
                        </Link>
                      </Button>
                      <Button size="sm" variant="brand" className="w-full" asChild>
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
