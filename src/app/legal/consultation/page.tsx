'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { 
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Scale,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react'
import Link from 'next/link'

export default function LegalConsultationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const schema = z.object({
    name: z.string().min(2, 'Name is too short').max(100),
    email: z.string().email('Invalid email'),
    phone: z.string().min(6, 'Invalid phone').max(30),
    company: z.string().max(120).optional().or(z.literal('')),
    serviceType: z.string().min(2, 'Select a service type'),
    preferredDate: z.string().min(1, 'Select a date'),
    preferredTime: z.string().min(2, 'Select a time'),
    message: z.string().min(10, 'Please add more details').max(2000)
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      const parsed = schema.safeParse(formData)
      if (!parsed.success) {
        const map: Record<string, string> = {}
        for (const issue of parsed.error.issues) {
          const key = issue.path.join('.')
          if (!map[key]) map[key] = issue.message
        }
        setErrors(map)
        setIsSubmitting(false)
        return
      }
      const response = await fetch('/api/legal/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...parsed.data,
          serviceType: parsed.data.serviceType || 'other'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Consultation request received',
          description: 'We will contact you within 24 hours to confirm your session.'
        })
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          serviceType: '',
          preferredDate: '',
          preferredTime: '',
          message: ''
        })
      } else {
        toast({
          title: 'Submission failed',
          description: data.error || 'Please try again.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Network error',
        description: 'Please check your connection and try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const consultationTypes = [
    {
      title: "Corporate Law Consultation",
      duration: "60 minutes",
      price: "SAR 500",
      description: "Expert advice on company formation, governance, and compliance"
    },
    {
      title: "Contract Review Session",
      duration: "45 minutes",
      price: "SAR 350",
      description: "Professional review of your contracts and legal documents"
    },
    {
      title: "Compliance Assessment",
      duration: "90 minutes",
      price: "SAR 750",
      description: "Comprehensive review of your business compliance requirements"
    },
    {
      title: "Legal Strategy Planning",
      duration: "120 minutes",
      price: "SAR 1,000",
      description: "Strategic legal planning for business growth and risk management"
    }
  ]

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
    "4:00 PM", "4:30 PM", "5:00 PM"
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
          Legal Consultation
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Book Your Legal Consultation
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Schedule a consultation with our expert legal team to discuss your specific needs and get professional advice tailored to your business.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Consultation Types */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Consultation Types</CardTitle>
              <CardDescription>
                Choose the consultation type that best fits your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {consultationTypes.map((type, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{type.title}</h3>
                        <Badge variant="secondary">{type.price}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {type.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {type.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          4.9/5
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Schedule Your Consultation</CardTitle>
              <CardDescription>
                Fill in your details and preferred consultation time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                    {errors.name && (<p className="text-sm text-red-600 mt-1">{errors.name}</p>)}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Address *</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                    {errors.email && (<p className="text-sm text-red-600 mt-1">{errors.email}</p>)}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone Number *</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+966 123 456 7890"
                      required
                    />
                    {errors.phone && (<p className="text-sm text-red-600 mt-1">{errors.phone}</p>)}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Company Name</label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Your Company Ltd."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Service Type *</label>
                  <Select value={formData.serviceType} onValueChange={(value) => handleSelectChange('serviceType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consultation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporate">Corporate Law Consultation</SelectItem>
                      <SelectItem value="contract">Contract Review Session</SelectItem>
                      <SelectItem value="compliance">Compliance Assessment</SelectItem>
                      <SelectItem value="strategy">Legal Strategy Planning</SelectItem>
                      <SelectItem value="other">Other Legal Matter</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.serviceType && (<p className="text-sm text-red-600 mt-1">{errors.serviceType}</p>)}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Date *</label>
                    <Input
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                    {errors.preferredDate && (<p className="text-sm text-red-600 mt-1">{errors.preferredDate}</p>)}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Time *</label>
                    <Select value={formData.preferredTime} onValueChange={(value) => handleSelectChange('preferredTime', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  {errors.preferredTime && (<p className="text-sm text-red-600 mt-1">{errors.preferredTime}</p>)}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Describe Your Legal Needs *</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Please provide details about your legal situation and what you hope to achieve through this consultation."
                    required
                  />
                  {errors.message && (<p className="text-sm text-red-600 mt-1">{errors.message}</p>)}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Book Consultation'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Why Choose Us */}
          <Card>
            <CardHeader>
              <CardTitle>Why Choose SourceKom Legal?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-medium">Expert Legal Team</p>
                  <p className="text-sm text-muted-foreground">15+ years of experience in Saudi law</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-medium">Quick Response</p>
                  <p className="text-sm text-muted-foreground">24-48 hour consultation scheduling</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-medium">Confidential Service</p>
                  <p className="text-sm text-muted-foreground">100% confidential legal advice</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-medium">Practical Solutions</p>
                  <p className="text-sm text-muted-foreground">Actionable legal strategies</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Legal Support</CardTitle>
              <CardDescription>
                For urgent legal matters requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium">Emergency Hotline</p>
                    <p className="text-sm text-red-600">+966 920 000 123</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Urgent Email</p>
                    <p className="text-sm text-muted-foreground">urgent@sourcekom.com</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/contact">Contact Emergency Team</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Consultation Process */}
          <Card>
            <CardHeader>
              <CardTitle>Consultation Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                  <div>
                    <p className="font-medium">Book Consultation</p>
                    <p className="text-sm text-muted-foreground">Submit your request online</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                  <div>
                    <p className="font-medium">Confirmation</p>
                    <p className="text-sm text-muted-foreground">Receive booking confirmation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                  <div>
                    <p className="font-medium">Consultation</p>
                    <p className="text-sm text-muted-foreground">Meet with legal expert</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-medium">4</div>
                  <div>
                    <p className="font-medium">Action Plan</p>
                    <p className="text-sm text-muted-foreground">Receive legal strategy</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
