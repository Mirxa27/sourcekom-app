'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Testimonial {
  id: string
  name: string
  company: string
  role: string
  avatar?: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

interface TestimonialModalProps {
  isOpen: boolean
  onClose: () => void
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ahmed Al-Mansouri',
    company: 'TechCorp Saudi',
    role: 'Operations Manager',
    avatar: '/images/avatars/avatar-1.jpg',
    rating: 5,
    comment: 'SourceKom has revolutionized how we manage our resources. We\'ve reduced operational costs by 35% and improved efficiency across all departments. The platform is intuitive, secure, and the support team is outstanding.',
    date: '2024-12-15',
    verified: true,
  },
  {
    id: '2',
    name: 'Fatima Al-Zahrani',
    company: 'Green Logistics Co.',
    role: 'CEO',
    avatar: '/images/avatars/avatar-2.jpg',
    rating: 5,
    comment: 'As a business owner, finding reliable partners was always challenging. SourceKom connected us with quality businesses and helped us optimize our supply chain. The legal consultancy services are top-notch and have saved us countless hours.',
    date: '2024-12-10',
    verified: true,
  },
  {
    id: '3',
    name: 'Khalid Abdullah',
    company: 'Modern Manufacturing Ltd.',
    role: 'Director of Operations',
    avatar: '/images/avatars/avatar-3.jpg',
    rating: 5,
    comment: 'The resource sharing platform exceeded our expectations. We\'ve been able to share excess capacity with other businesses, creating new revenue streams. The MyFatoorah integration makes payments seamless, and the platform is always improving.',
    date: '2024-12-05',
    verified: true,
  },
  {
    id: '4',
    name: 'Noura Al-Fahad',
    company: 'Innovation Hub',
    role: 'Resource Manager',
    avatar: '/images/avatars/avatar-4.jpg',
    rating: 5,
    comment: 'SourceKom\'s approach to resource optimization is brilliant. We\'ve reduced waste significantly while connecting with amazing partners. The analytics dashboard provides valuable insights, and the team is always responsive to our needs.',
    date: '2024-11-28',
    verified: true,
  },
  {
    id: '5',
    name: 'Mohammed Al-Rashid',
    company: 'Smart Supply Chain',
    role: 'CTO',
    avatar: '/images/avatars/avatar-5.jpg',
    rating: 5,
    comment: 'The platform\'s technology is impressive. Real-time availability, secure transactions, and comprehensive reporting make it essential for our operations. We\'ve been using it for 6 months and can\'t imagine going back.',
    date: '2024-11-20',
    verified: true,
  },
  {
    id: '6',
    name: 'Sarah Al-Mutairi',
    company: 'Sustainable Business Solutions',
    role: 'Founder',
    avatar: '/images/avatars/avatar-6.jpg',
    rating: 5,
    comment: 'SourceKom aligns perfectly with our sustainability goals. By sharing resources with other businesses, we\'ve reduced our environmental footprint while improving profitability. The legal guidance has been invaluable for compliance.',
    date: '2024-11-15',
    verified: true,
  },
]

export function TestimonialModal({ isOpen, onClose }: TestimonialModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0)
    }
  }, [isOpen])

  const currentTestimonial = testimonials[currentIndex]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-primary" />
            Trusted by 500+ Businesses
          </DialogTitle>
          <DialogDescription>
            See what our clients say about SourceKom
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={currentTestimonial.avatar} alt={currentTestimonial.name} />
                <AvatarFallback>
                  {currentTestimonial.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{currentTestimonial.name}</h3>
                  {currentTestimonial.verified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentTestimonial.role} at {currentTestimonial.company}
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < currentTestimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="relative">
              <Quote className="absolute -top-2 -left-2 w-8 h-8 text-muted-foreground/20" />
              <p className="text-sm leading-relaxed pl-6 italic">
                "{currentTestimonial.comment}"
              </p>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              {new Date(currentTestimonial.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex gap-1">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-primary'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Showing {currentIndex + 1} of {testimonials.length} testimonials
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
