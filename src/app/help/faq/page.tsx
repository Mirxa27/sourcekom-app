'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  CreditCard, 
  Shield, 
  Users, 
  Truck, 
  Building,
  FileText,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Star,
  Clock,
  Filter
} from 'lucide-react'
import Link from 'next/link'

const faqData = [
  {
    category: 'getting-started',
    categoryName: 'Getting Started',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-600',
    questions: [
      {
        id: 1,
        question: 'How do I create a SourceKom account?',
        answer: 'Creating a SourceKom account is simple and free. Click on the "Get Started" button on our homepage, fill in your basic information including name, email, and password. You\'ll receive a verification email to confirm your account. Once verified, you can immediately start browsing resources and using our platform features.',
        helpful: 45,
        views: 1234
      },
      {
        id: 2,
        question: 'What are the different user roles on SourceKom?',
        answer: 'SourceKom offers three user roles: 1) User - Can browse, purchase, and download resources. 2) Creator - Can upload and sell their own resources in addition to user capabilities. 3) Admin - Has full platform management access. You can upgrade your role by contacting our support team.',
        helpful: 38,
        views: 892
      },
      {
        id: 3,
        question: 'Is SourceKom available for businesses outside Saudi Arabia?',
        answer: 'While SourceKom primarily focuses on the Saudi Arabian market, we welcome international businesses looking to operate in or expand to the KSA region. Our platform supports multiple languages and currencies, with specialized features for international business compliance.',
        helpful: 52,
        views: 756
      }
    ]
  },
  {
    category: 'resources',
    categoryName: 'Resources & Downloads',
    icon: FileText,
    color: 'bg-green-100 text-green-600',
    questions: [
      {
        id: 4,
        question: 'How do I upload and sell resources on SourceKom?',
        answer: 'To upload resources, ensure you have a Creator account. Go to your Dashboard, click "Upload Resource," fill in the required details including title, description, category, and pricing. Upload your files (supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP). Set your price and publish. Our team will review your content within 24 hours.',
        helpful: 67,
        views: 1567
      },
      {
        id: 5,
        question: 'What file types and sizes are supported?',
        answer: 'We support most business document formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, and ZIP archives. Maximum file size is 100MB per file. For larger files, consider compressing them or splitting into multiple parts. Video files are not currently supported.',
        helpful: 41,
        views: 923
      },
      {
        id: 6,
        question: 'How do I download purchased resources?',
        answer: 'After purchasing a resource, go to your Dashboard > "My Purchases." You\'ll see all your purchased resources with download links. Click the download button to access your files. Downloads are available for 30 days from purchase date. You can also re-download from the resource page.',
        helpful: 58,
        views: 1456
      },
      {
        id: 7,
        question: 'Can I get a refund for a resource?',
        answer: 'Yes, we offer a 14-day refund policy for digital resources. If you\'re not satisfied with your purchase, contact our support team within 14 days with your reason for refund. Refunds are typically processed within 5-7 business days. Note that resources marked as "Final Sale" are not eligible for refunds.',
        helpful: 33,
        views: 678
      }
    ]
  },
  {
    category: 'payments',
    categoryName: 'Payments & Billing',
    icon: CreditCard,
    color: 'bg-purple-100 text-purple-600',
    questions: [
      {
        id: 8,
        question: 'What payment methods does SourceKom accept?',
        answer: 'We accept various payment methods including: Credit/Debit cards (Visa, Mastercard, American Express), Bank transfers, Mada (for Saudi customers), PayPal, and Apple Pay. All payments are processed securely through MyFatoorah, a leading payment gateway in the Middle East.',
        helpful: 72,
        views: 2341
      },
      {
        id: 9,
        question: 'Is my payment information secure?',
        answer: 'Absolutely. We use industry-standard SSL encryption for all transactions. Your payment information is processed directly by MyFatoorah, a PCI DSS compliant payment processor. SourceKom never stores your credit card details on our servers. We also implement additional security measures like two-factor authentication.',
        helpful: 89,
        views: 1876
      },
      {
        id: 10,
        question: 'How do creators receive payments?',
        answer: 'Creators receive payments through their preferred method: Bank transfer (preferred for Saudi banks), PayPal, or SourceKom wallet. Payments are processed monthly, with a 15-day holding period for buyer protection. Creators receive 70% of net revenue after payment processing fees.',
        helpful: 45,
        views: 1234
      },
      {
        id: 11,
        question: 'Are there any subscription fees?',
        answer: 'SourceKom offers both free and paid plans. The free plan allows browsing and purchasing resources. Premium plans (starting at SAR 29/month) offer benefits like unlimited uploads, featured listings, advanced analytics, and priority support. You can upgrade, downgrade, or cancel your subscription anytime.',
        helpful: 56,
        views: 987
      }
    ]
  },
  {
    category: 'legal',
    categoryName: 'Legal Services',
    icon: Shield,
    color: 'bg-orange-100 text-orange-600',
    questions: [
      {
        id: 12,
        question: 'What legal services does SourceKom provide?',
        answer: 'SourceKom offers comprehensive legal services including: Business registration and licensing, Contract drafting and review, Compliance consulting, Legal documentation preparation, Market entry guidance, and Legal representation referrals. Our legal experts specialize in Saudi Arabian business law.',
        helpful: 61,
        views: 1567
      },
      {
        id: 13,
        question: 'How do I book a legal consultation?',
        answer: 'To book a consultation: 1) Go to Legal Services > "Book Consultation" 2) Select your legal needs category 3) Choose a time slot from available appointments 4) Provide necessary information and documents 5) Pay the consultation fee 6) Receive confirmation with video conference link. Consultations are available in English and Arabic.',
        helpful: 48,
        views: 890
      },
      {
        id: 14,
        question: 'What are the consultation fees?',
        answer: 'Consultation fees vary based on complexity and duration: Initial consultation (30 minutes): SAR 200, Standard consultation (1 hour): SAR 350, Extended consultation (2 hours): SAR 600. Package deals are available for ongoing legal support. Corporate clients can request custom pricing.',
        helpful: 39,
        views: 765
      }
    ]
  },
  {
    category: 'account',
    categoryName: 'Account Management',
    icon: Users,
    color: 'bg-pink-100 text-pink-600',
    questions: [
      {
        id: 15,
        question: 'How do I reset my password?',
        answer: 'To reset your password: 1) Click "Forgot Password" on the login page 2) Enter your registered email address 3) Check your email for a reset link (valid for 24 hours) 4) Create a new strong password 5) Confirm the new password. If you don\'t receive the email, check your spam folder or contact support.',
        helpful: 82,
        views: 3456
      },
      {
        id: 16,
        question: 'Can I change my email address?',
        answer: 'Yes, you can change your email address from Account Settings. Go to Dashboard > "Account Settings" > "Email" > "Change Email." You\'ll need to verify your new email address. The old email will remain active until verification is complete. Note that this will update your login credentials.',
        helpful: 44,
        views: 1234
      },
      {
        id: 17,
        question: 'How do I delete my account?',
        answer: 'To delete your account: Go to Account Settings > "Privacy & Security" > "Delete Account." Please note this action is irreversible. We\'ll ask you to confirm via email. Any remaining credits or active subscriptions will be forfeited. Your purchased resources will remain accessible for 30 days after deletion.',
        helpful: 28,
        views: 567
      }
    ]
  },
  {
    category: 'technical',
    categoryName: 'Technical Support',
    icon: MessageCircle,
    color: 'bg-indigo-100 text-indigo-600',
    questions: [
      {
        id: 18,
        question: 'What browsers are supported?',
        answer: 'SourceKom works best on modern browsers: Chrome (version 90+), Firefox (version 88+), Safari (version 14+), Edge (version 90+). For mobile devices, we recommend using the latest versions of iOS Safari and Chrome for Android. JavaScript must be enabled for full functionality.',
        helpful: 55,
        views: 2345
      },
      {
        id: 19,
        question: 'Why can\'t I upload my file?',
        answer: 'Common upload issues include: File size exceeds 100MB limit, Unsupported file format, Slow internet connection, Browser cache issues. Try compressing your file, checking the format, clearing browser cache, or trying a different browser. If problems persist, contact support with your file details.',
        helpful: 47,
        views: 1890
      },
      {
        id: 20,
        question: 'Is SourceKom mobile-friendly?',
        answer: 'Yes! SourceKom is fully responsive and works on all devices. We also offer mobile apps for iOS and Android with additional features like push notifications and offline access to purchased resources. Download from the App Store or Google Play Store.',
        helpful: 71,
        views: 2678
      }
    ]
  }
]

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [feedback, setFeedback] = useState<Record<number, boolean>>({})

  const filteredFAQs = useMemo(() => {
    let filtered = faqData

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(section => section.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.map(section => ({
        ...section,
        questions: section.questions.filter(q =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(section => section.questions.length > 0)
    }

    return filtered
  }, [searchQuery, selectedCategory])

  const handleFeedback = (questionId: number, isHelpful: boolean) => {
    setFeedback(prev => ({ ...prev, [questionId]: isHelpful }))
    // In a real app, this would send feedback to the server
  }

  const popularQuestions = useMemo(() => {
    return faqData
      .flatMap(section => section.questions)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--sourcekom-blue)] to-[var(--sourcekom-blue-light)] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-white/30">
              Frequently Asked Questions
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How can we help you?
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Find quick answers to common questions about SourceKom
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[var(--sourcekom-blue)] mb-1">20+</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600 mb-1">150+</div>
              <div className="text-sm text-muted-foreground">FAQ Articles</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600 mb-1">95%</div>
              <div className="text-sm text-muted-foreground">Helpfulness Rate</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600 mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Updated</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Category Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center justify-between ${
                      selectedCategory === 'all' ? 'bg-muted border-l-4 border-[var(--sourcekom-blue)]' : ''
                    }`}
                  >
                    <span>All Categories</span>
                    <Badge variant="secondary">{faqData.reduce((acc, section) => acc + section.questions.length, 0)}</Badge>
                  </button>
                  {faqData.map((category) => (
                    <button
                      key={category.category}
                      onClick={() => setSelectedCategory(category.category)}
                      className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center justify-between ${
                        selectedCategory === category.category ? 'bg-muted border-l-4 border-[var(--sourcekom-blue)]' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                          <category.icon className="w-4 h-4" />
                        </div>
                        <span>{category.categoryName}</span>
                      </div>
                      <Badge variant="secondary">{category.questions.length}</Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Questions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Popular Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularQuestions.map((question) => (
                    <div key={question.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-[var(--sourcekom-blue)] rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm leading-tight mb-1 hover:text-[var(--sourcekom-blue)] cursor-pointer transition-colors">
                          {question.question}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{question.helpful} helpful</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Help */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Need More Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/help">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Help Center
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/help/support">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/contact">
                    <Users className="w-4 h-4 mr-2" />
                    Live Chat
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {searchQuery && (
              <div className="mb-6 text-muted-foreground">
                Found {filteredFAQs.reduce((acc, section) => acc + section.questions.length, 0)} results for "{searchQuery}"
              </div>
            )}

            {filteredFAQs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any answers matching your search. Try different keywords or browse categories.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" onClick={() => setSearchQuery('')}>
                      Clear Search
                    </Button>
                    <Button asChild>
                      <Link href="/help/support">
                        Contact Support
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {filteredFAQs.map((section) => (
                  <Card key={section.category}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${section.color} rounded-lg flex items-center justify-center`}>
                          <section.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{section.categoryName}</CardTitle>
                          <CardDescription>{section.questions.length} articles</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="space-y-4">
                        {section.questions.map((question) => (
                          <AccordionItem key={question.id} value={`question-${question.id}`} className="border rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex-1 text-left">
                                <h3 className="font-medium">{question.question}</h3>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{question.views} views</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <ThumbsUp className="w-3 h-3" />
                                    <span>{question.helpful} helpful</span>
                                  </div>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pt-4">
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                  {question.answer}
                                </p>
                                
                                {/* Feedback Section */}
                                <div className="flex items-center justify-between pt-4 border-t">
                                  <div className="text-sm text-muted-foreground">
                                    Was this helpful?
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleFeedback(question.id, true)}
                                      className={`${
                                        feedback[question.id] === true 
                                          ? 'text-green-600 bg-green-50' 
                                          : 'text-muted-foreground hover:text-green-600'
                                      }`}
                                    >
                                      <ThumbsUp className="w-4 h-4 mr-1" />
                                      Yes
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleFeedback(question.id, false)}
                                      className={`${
                                        feedback[question.id] === false 
                                          ? 'text-red-600 bg-red-50' 
                                          : 'text-muted-foreground hover:text-red-600'
                                      }`}
                                    >
                                      <ThumbsDown className="w-4 h-4 mr-1" />
                                      No
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-[var(--sourcekom-blue)]/10 to-[var(--sourcekom-yellow)]/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Still have questions?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[var(--sourcekom-blue)] hover:bg-[var(--sourcekom-blue-light)] text-white" asChild>
              <Link href="/help/support">
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Support
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                <Users className="w-5 h-5 mr-2" />
                Start Live Chat
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}