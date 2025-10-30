'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: 'legal_consultation'
        }),
      })

      if (response.ok) {
        alert('Consultation request submitted successfully! We will contact you within 24 hours.')
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
        alert('Failed to submit request. Please try again.')
      }
    } catch (error) {
      alert('Failed to submit request. Please try again.')
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SourceKom</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                Services
              </Link>
              <Link href="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </Link>
              <Link href="/legal" className="text-muted-foreground hover:text-foreground transition-colors">
                Legal Services
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/legal">Back to Legal</Link>
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/contact">Emergency Contact</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
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
    </div>
  )
}