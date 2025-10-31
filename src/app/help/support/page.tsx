'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { 
  MessageCircle, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Plus,
  Filter,
  Calendar,
  User,
  FileText,
  Phone,
  Mail,
  ChevronRight,
  ArrowRight,
  Headphones,
  Ticket,
  Paperclip,
  Download,
  Eye,
  Reply,
  MoreHorizontal,
  BookOpen,
  Users,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

interface SupportTicket {
  id: string
  ticketId: string
  subject: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  description: string
  createdAt: string
  updatedAt: string
  lastReply?: string
  replies: number
  attachments: number
}

const mockTickets: SupportTicket[] = [
  {
    id: 'TK-001234',
    subject: 'Issue with resource download',
    category: 'technical',
    priority: 'high',
    status: 'in_progress',
    description: 'I purchased a resource but cannot download it. The download button is not working.',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    lastReply: 'Our team is investigating the issue. We\'ll update you shortly.',
    replies: 2,
    attachments: 1
  },
  {
    id: 'TK-001233',
    subject: 'Refund request for legal template',
    category: 'billing',
    priority: 'medium',
    status: 'open',
    description: 'The template I purchased doesn\'t meet my requirements. I would like to request a refund.',
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    replies: 0,
    attachments: 0
  },
  {
    id: 'TK-001232',
    subject: 'Account verification issue',
    category: 'account',
    priority: 'urgent',
    status: 'resolved',
    description: 'I haven\'t received the verification email after registration.',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T11:30:00Z',
    lastReply: 'Issue resolved. Please check your spam folder or contact us if you still need help.',
    replies: 3,
    attachments: 0
  }
]

const categories = [
  { value: 'technical', label: 'Technical Support', icon: '🔧' },
  { value: 'billing', label: 'Billing & Payments', icon: '💳' },
  { value: 'account', label: 'Account Issues', icon: '👤' },
  { value: 'resources', label: 'Resources & Downloads', icon: '📁' },
  { value: 'legal', label: 'Legal Services', icon: '⚖️' },
  { value: 'feature', label: 'Feature Request', icon: '💡' },
  { value: 'other', label: 'Other', icon: '📝' }
]

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
}

const statusColors = {
  open: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
}

const statusIcons = {
  open: AlertCircle,
  in_progress: Clock,
  resolved: CheckCircle,
  closed: CheckCircle
}

export default function ContactSupport() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('new')
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    description: '',
    attachments: [] as File[]
  })

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        console.error('Failed to parse user data:', e)
      }
    }
    
    // Load tickets if user is logged in
    if (userData) {
      loadTickets()
    } else {
      setLoading(false)
    }
  }, [])

  const loadTickets = async () => {
    try {
      setLoading(true)
      const userData = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (!userData || !token) {
        setLoading(false)
        return
      }
      
      const user = JSON.parse(userData)
      const response = await fetch(`/api/support/tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const formattedTickets = (data.tickets || []).map((ticket: any) => ({
          id: ticket.id,
          ticketId: ticket.ticketId,
          subject: ticket.subject,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          description: ticket.description,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
          lastReply: ticket.replies && ticket.replies.length > 0 
            ? ticket.replies[ticket.replies.length - 1].message 
            : undefined,
          replies: ticket.replies ? ticket.replies.length : 0,
          attachments: ticket.attachments ? (typeof ticket.attachments === 'string' ? JSON.parse(ticket.attachments).length : ticket.attachments.length) : 0
        }))
        setTickets(formattedTickets)
      } else {
        // If API fails, use empty array instead of mock data
        setTickets([])
      }
    } catch (error) {
      console.error('Failed to load tickets:', error)
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus
    const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to submit a support ticket.',
          variant: 'destructive'
        })
        setIsSubmitting(false)
        return
      }

      // Send as JSON for now (file uploads would need separate handling)
      const requestBody = {
        subject: formData.subject,
        category: formData.category,
        priority: formData.priority,
        description: formData.description,
        attachments: formData.attachments.map(file => file.name) // Store filenames for now
      }

      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: 'Ticket submitted',
          description: `Your support ticket ${data.ticket.ticketId} has been created successfully.`,
        })
        setFormData({
          subject: '',
          category: '',
          priority: 'medium',
          description: '',
          attachments: []
        })
        setActiveTab('tickets')
        loadTickets() // Reload tickets to show the new one
      } else {
        const errorData = await response.json()
        toast({
          title: 'Failed to submit ticket',
          description: errorData.error || 'Please try again.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Failed to submit ticket:', error)
      toast({
        title: 'Network error',
        description: 'Failed to submit ticket. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }))
  }

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--sourcekom-blue)] to-[var(--sourcekom-blue-light)] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-white/30">
              Support Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How can we help you?
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Get support from our team through tickets, live chat, or comprehensive resources
            </p>
            
            {/* Quick Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <MessageCircle className="w-5 h-5 mr-2" />
                Live Chat
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Phone className="w-5 h-5 mr-2" />
                +966 11 234 5678
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Mail className="w-5 h-5 mr-2" />
                support@sourcekom.sa
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Support Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600 mb-1">95%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600 mb-1">&lt;2hr</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Live Support</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600 mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Tickets/Day</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="new">Create Ticket</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Ticket Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="w-5 h-5 mr-2" />
                      Create Support Ticket
                    </CardTitle>
                    <CardDescription>
                      Fill in the details below and our support team will get back to you within 24 hours.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitTicket} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject *</Label>
                          <Input
                            id="subject"
                            placeholder="Brief description of your issue"
                            value={formData.subject}
                            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category *</Label>
                          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  <span className="flex items-center">
                                    <span className="mr-2">{category.icon}</span>
                                    {category.label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low - General inquiry</SelectItem>
                            <SelectItem value="medium">Medium - Feature request</SelectItem>
                            <SelectItem value="high">High - Issue affecting usage</SelectItem>
                            <SelectItem value="urgent">Urgent - Critical issue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Please provide as much detail as possible about your issue..."
                          rows={6}
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="attachments">Attachments</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            id="attachments"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Paperclip className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop files here or click to browse
                          </p>
                          <Button type="button" variant="outline" onClick={() => document.getElementById('attachments')?.click()}>
                            Choose Files
                          </Button>
                        </div>
                        
                        {formData.attachments.length > 0 && (
                          <div className="space-y-2">
                            {formData.attachments.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                <span className="text-sm">{file.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAttachment(index)}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating ticket...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Create Ticket
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Quick Help */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Help</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/help/faq">
                        <FileText className="w-4 h-4 mr-2" />
                        Browse FAQ
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/help">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Help Center
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Live Chat
                    </Button>
                  </CardContent>
                </Card>

                {/* Response Times */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Response Times</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Urgent</span>
                      <Badge variant="outline">&lt;1 hour</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">High</span>
                      <Badge variant="outline">&lt;4 hours</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Medium</span>
                      <Badge variant="outline">&lt;24 hours</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Low</span>
                      <Badge variant="outline">1-2 days</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Other Ways to Reach Us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">+966 11 234 5678</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">support@sourcekom.sa</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Mon-Fri, 9AM-6PM AST</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tickets List */}
            <div className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Loading tickets...</p>
                  </CardContent>
                </Card>
              ) : !user ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Login Required</h3>
                    <p className="text-muted-foreground mb-6">
                      Please log in to view and manage your support tickets.
                    </p>
                    <Button asChild>
                      <Link href="/login?redirect=/help/support">
                        Login to Continue
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : filteredTickets.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No tickets found</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery || filterStatus !== 'all' || filterCategory !== 'all'
                        ? 'Try adjusting your filters or search terms.'
                        : 'You haven\'t created any support tickets yet.'}
                    </p>
                    <Button onClick={() => setActiveTab('new')}>
                      Create Your First Ticket
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredTickets.map((ticket) => {
                  const StatusIcon = statusIcons[ticket.status]
                  return (
                    <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                              <Badge className={priorityColors[ticket.priority]}>
                                {ticket.priority}
                              </Badge>
                              <Badge className={statusColors[ticket.status]}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {ticket.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-3 line-clamp-2">
                              {ticket.description}
                            </p>
                            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Ticket className="w-4 h-4" />
                                <span>{ticket.ticketId}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(ticket.createdAt)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="w-4 h-4" />
                                <span>{ticket.replies} replies</span>
                              </div>
                              {ticket.attachments > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Paperclip className="w-4 h-4" />
                                  <span>{ticket.attachments} files</span>
                                </div>
                              )}
                            </div>
                            {ticket.lastReply && (
                              <div className="mt-3 p-3 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                  <strong>Latest reply:</strong> {ticket.lastReply}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Reply className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Knowledge Base</h3>
                <p className="text-muted-foreground mb-4">
                  Browse our comprehensive library of articles and guides.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/help">
                    Browse Articles
                  </Link>
                </Button>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                <p className="text-muted-foreground mb-4">
                  Get instant help from our support team via live chat.
                </p>
                <Button variant="outline" className="w-full">
                  Start Chat
                </Button>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">FAQ</h3>
                <p className="text-muted-foreground mb-4">
                  Find quick answers to frequently asked questions.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/help/faq">
                    View FAQ
                  </Link>
                </Button>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
                <p className="text-muted-foreground mb-4">
                  Speak directly with our support team.
                </p>
                <Button variant="outline" className="w-full">
                  Call Us
                </Button>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground mb-4">
                  Send us a detailed email about your issue.
                </p>
                <Button variant="outline" className="w-full">
                  Email Us
                </Button>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Community</h3>
                <p className="text-muted-foreground mb-4">
                  Connect with other SourceKom users and experts.
                </p>
                <Button variant="outline" className="w-full">
                  Join Community
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}