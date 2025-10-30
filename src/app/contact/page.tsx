'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  Calendar,
  Users,
  FileText,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company || undefined,
          phone: formData.phone || undefined,
          message: formData.message,
          type: 'general',
          service: formData.service || undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({
            name: '',
            email: '',
            company: '',
            phone: '',
            service: '',
            message: ''
          })
        }, 3000)
      } else {
        alert(data.error || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResourceInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const form = e.target as HTMLFormElement
    const formDataObj = new FormData(form)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formDataObj.get('name'),
          email: formDataObj.get('email'),
          company: formDataObj.get('company') || undefined,
          message: formDataObj.get('resourceDescription'),
          type: 'resource_inquiry'
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('Resource inquiry submitted successfully! We will contact you soon.')
        form.reset()
      } else {
        alert(data.error || 'Failed to submit inquiry. Please try again.')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLegalConsultation = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const form = e.target as HTMLFormElement
    const formDataObj = new FormData(form)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formDataObj.get('name'),
          email: formDataObj.get('email'),
          company: formDataObj.get('company'),
          phone: formDataObj.get('phone'),
          message: formDataObj.get('legalNeeds') + '\n\nPreferred Date: ' + formDataObj.get('date') + '\nPreferred Time: ' + formDataObj.get('time'),
          type: 'legal_consultation',
          priority: 'high'
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('Legal consultation request submitted successfully! We will contact you to confirm your appointment.')
        form.reset()
      } else {
        alert(data.error || 'Failed to submit consultation request. Please try again.')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SourceKom</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
              Get in Touch
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Connect With SourceKom Today
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Ready to optimize your resources? Reach out to our team for expert guidance and support tailored to your business needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground mb-1">info@sourcekom.com</p>
              <p className="text-sm text-muted-foreground">For general inquiries and support</p>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <a href="mailto:info@sourcekom.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </a>
              </Button>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-muted-foreground mb-1">+966 123 456 7890</p>
              <p className="text-sm text-muted-foreground">Monday to Friday, 9AM-5PM</p>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <a href="tel:+9661234567890">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </Button>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Address</h3>
              <p className="text-muted-foreground mb-1">King Fahd Road</p>
              <p className="text-muted-foreground mb-1">Riyadh, Saudi Arabia</p>
              <p className="text-sm text-muted-foreground">Book an appointment before visiting</p>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                  <MapPin className="w-4 h-4 mr-2" />
                  Get Directions
                </a>
              </Button>
            </Card>
          </div>

          {/* Contact Forms */}
          <Tabs defaultValue="general" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General Inquiry</TabsTrigger>
              <TabsTrigger value="resource">Resource Sharing</TabsTrigger>
              <TabsTrigger value="legal">Legal Consultation</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>General Inquiry</CardTitle>
                  <CardDescription>
                    Have questions about our services? Fill out the form below and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                      <p className="text-muted-foreground">
                        Your message has been sent successfully. We'll get back to you soon.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Full Name *</label>
                          <Input
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Email Address *</label>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Company Name</label>
                          <Input
                            placeholder="Your Company Ltd."
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Phone Number</label>
                          <Input
                            type="tel"
                            placeholder="+966 5x xxx xxxx"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Service Interest</label>
                        <select 
                          className="w-full p-3 border rounded-lg bg-background"
                          value={formData.service}
                          onChange={(e) => handleInputChange('service', e.target.value)}
                        >
                          <option value="">Select a service</option>
                          <option value="logistics">Logistics and Supply Chain</option>
                          <option value="resource-optimization">Resource Optimization</option>
                          <option value="consulting">Strategic Consulting</option>
                          <option value="efficiency">Operational Efficiency</option>
                          <option value="sustainability">Sustainability</option>
                          <option value="market-entry">Market Entry</option>
                          <option value="legal">Legal Services</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Message *</label>
                        <textarea
                          className="w-full p-3 border rounded-lg resize-none min-h-[120px]"
                          placeholder="Tell us about your needs and how we can help..."
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resource" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Resource Sharing Inquiry</CardTitle>
                  <CardDescription>
                    Looking to share or access business resources? Let us know what you need and we'll help you find the perfect match.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleResourceInquiry} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Full Name *</label>
                        <Input name="name" placeholder="John Doe" required />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email Address *</label>
                        <Input name="email" type="email" placeholder="john@example.com" required />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Company Name</label>
                      <Input name="company" placeholder="Your Company Ltd." />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Resource Type</label>
                      <select name="resourceType" className="w-full p-3 border rounded-lg bg-background">
                        <option value="">Select resource type</option>
                        <option value="office-space">Office Space</option>
                        <option value="equipment">Equipment</option>
                        <option value="personnel">Personnel</option>
                        <option value="storage">Storage</option>
                        <option value="vehicles">Vehicles</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Describe the resources you want to share or access *
                      </label>
                      <textarea
                        name="resourceDescription"
                        className="w-full p-3 border rounded-lg resize-none min-h-[120px]"
                        placeholder="Please provide details about what resources you're looking to share or access through our platform."
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Timeline</label>
                      <select name="timeline" className="w-full p-3 border rounded-lg bg-background">
                        <option value="">Select timeline</option>
                        <option value="immediate">Immediate</option>
                        <option value="1-week">Within 1 week</option>
                        <option value="1-month">Within 1 month</option>
                        <option value="3-months">Within 3 months</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : (
                        <>
                          <Users className="w-4 h-4 mr-2" />
                          Submit Resource Inquiry
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legal" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Legal Consultation Booking</CardTitle>
                  <CardDescription>
                    Schedule a consultation with our legal experts for comprehensive guidance on Saudi Arabian business law and compliance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLegalConsultation} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Full Name *</label>
                        <Input name="name" placeholder="John Doe" required />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email Address *</label>
                        <Input name="email" type="email" placeholder="john@example.com" required />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Company Name *</label>
                      <Input name="company" placeholder="Your Company Ltd." required />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone Number *</label>
                      <Input name="phone" type="tel" placeholder="+966 5x xxx xxxx" required />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Legal Service Required *</label>
                      <select name="serviceType" className="w-full p-3 border rounded-lg bg-background" required>
                        <option value="">Select service type</option>
                        <option value="corporate-law">Corporate Law</option>
                        <option value="contract-review">Contract Review</option>
                        <option value="compliance">Regulatory Compliance</option>
                        <option value="business-licensing">Business Licensing</option>
                        <option value="documentation">Legal Documentation</option>
                        <option value="market-entry">Market Entry Legal</option>
                        <option value="other">Other Legal Service</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Preferred Consultation Date *</label>
                      <Input name="date" type="date" required />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Preferred Time *</label>
                      <select name="time" className="w-full p-3 border rounded-lg bg-background" required>
                        <option value="">Select time slot</option>
                        <option value="9am-10am">9:00 AM - 10:00 AM</option>
                        <option value="10am-11am">10:00 AM - 11:00 AM</option>
                        <option value="11am-12pm">11:00 AM - 12:00 PM</option>
                        <option value="2pm-3pm">2:00 PM - 3:00 PM</option>
                        <option value="3pm-4pm">3:00 PM - 4:00 PM</option>
                        <option value="4pm-5pm">4:00 PM - 5:00 PM</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Brief description of your legal needs *
                      </label>
                      <textarea
                        name="legalNeeds"
                        className="w-full p-3 border rounded-lg resize-none min-h-[120px]"
                        placeholder="Please provide a brief description of your legal requirements..."
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : (
                        <>
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Consultation
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                Business Hours
              </Badge>
              <h2 className="text-3xl font-bold mb-4">When We're Available</h2>
              <p className="text-muted-foreground">
                Our team is ready to assist you during these hours
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Regular Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Monday - Thursday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Friday</span>
                    <span className="font-medium">9:00 AM - 12:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday - Sunday</span>
                    <span className="font-medium text-muted-foreground">Closed</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Emergency Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    For urgent matters outside business hours, please email us at:
                  </p>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <p className="font-medium text-emerald-800">emergency@sourcekom.com</p>
                    <p className="text-sm text-emerald-600 mt-1">
                      We'll respond within 4 hours during business days
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of businesses that have transformed their operations with SourceKom
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/services">
                Explore Our Services
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-emerald-600" asChild>
              <Link href="/about">
                Learn About SourceKom
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}